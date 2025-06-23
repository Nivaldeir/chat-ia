import { EnumModel } from "@/app/(private)/dashboard/models/models.types";
import { calculateTokenCost } from "@/lib/calculate-token";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { AssistantResponse } from "ai";
import { getServerSession } from "next-auth";

type Props = {
  threadId: string;
  message: string;
  assistant: string;
};

export async function POST(req: Request) {
  const { assistant: ass_id, message } = (await req.json()) as Props;
  const session = await getServerSession();

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: true, message: "Usuário não autenticado." }), { status: 401 });
  }

  const assistant = await prisma.assistant.findUnique({
    where: { id: ass_id },
  });

  if (!assistant) {
    return new Response(JSON.stringify({ error: true, message: "Assistente não encontrado." }), { status: 404 });
  }

  const thread = await openai.beta.threads.create();
  const threadId = thread.id;

  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: [{ text: message, type: "text" }],
  });

  const team = await prisma.team.findFirst({
    where: {
      assistant: {
        some: {
          id: ass_id,
        },
      },
    },
  });

  if (!team) {
    console.error("Nenhum time encontrado para o assistente:", ass_id);
    return new Response(
      JSON.stringify({ error: true, message: "Time não encontrado para o assistente." }),
      { status: 404 }
    );
  }

  return AssistantResponse(
    { threadId: threadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          assistant.openai_assistant_id ??
          (() => {
            throw new Error("ASSISTANT_ID environment is not set");
          })(),
        tool_choice: {
          type: "file_search",
        },
        tools: [
          {
            type: "file_search",
          },
        ],
      });

      runStream.on("event", async (data) => {
        if (data.event === "thread.run.completed") {
          await prisma.tokenUsage.create({
            data: {
              tokens: data.data.usage?.prompt_tokens,
              model: assistant.model,
              price: calculateTokenCost(
                assistant.model as EnumModel,
                data.data.usage!.prompt_tokens,
                data.data.usage!.completion_tokens
              ),
              user: {
                connect: {
                  email: session.user.email,
                },
              },
              team: {
                connect: {
                  id: team.id,
                },
              },
            },
          });
        }
      });

      await forwardStream(runStream);
    }
  );
}