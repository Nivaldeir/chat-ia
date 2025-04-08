import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ModelConfig = {
  name: string;
  id?: string
  description: string;
  instructions: string;
  files_ids: string[];
  temperature: number;
  model: string;
  team?: string;
  temperatures?: string;
  threadId?: string
  openai_assistant_id?: string;
};
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teamName = searchParams.get("team");
    if (!teamName) {
      return NextResponse.json({ error: true, message: "Nome do time é obrigatório." }, { status: 400 });
    }

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: true, message: "Usuário não autenticado." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    if (!user) {
      return NextResponse.json({ error: true, message: "Usuário não encontrado." }, { status: 404 });
    }

    const team = await prisma.team.findFirst({
      where: { name: teamName }
    });
    if (!team) {
      return NextResponse.json({ error: true, message: "Time não encontrado." }, { status: 404 });
    }

    const body = await req.json();
    console.log("BODY", body)
    const {
      name,
      model,
      description,
      files_ids = [],
      instructions,
      id,
      temperature = 0.5,
      openai_assistant_id,
      threadId
    } = body as Partial<ModelConfig>;

    let fileRecord, vectorStoreId;
    if (Array.isArray(files_ids) && files_ids.length > 0) {
      fileRecord = await prisma.file.findFirst({
        where: { id: files_ids[0] }
      });
      if (!fileRecord) {
        return NextResponse.json({ error: true, message: "Arquivo não encontrado." }, { status: 404 });
      }

      const vectorStore = await openai.beta.vectorStores.create({
        name,
        file_ids: [fileRecord.openai_id],
      });
      vectorStoreId = vectorStore.id;
    }

    let assistant: any
    if (!id) {
      assistant = await openai.beta.assistants.create({
        name,
        model: model!,
        description,
        instructions: instructions || "Sem instruções.",
        ...(vectorStoreId && {
          tool_resources: {
            file_search: {
              vector_store_ids: [vectorStoreId],
            },
          },
          tools: [{ type: "file_search" }],
        }),
      });
    } else {
      assistant = await openai.beta.assistants.update(openai_assistant_id!, {
        name,
        model,
        description,
        instructions: instructions || "Sem instruções.",
        ...(vectorStoreId && {
          tool_resources: {
            file_search: {
              vector_store_ids: [vectorStoreId],
            },
          },
          tools: [{ type: "file_search" }],
        }),
      });

    }

    const thread = await openai.beta.threads.create();

    await prisma.assistant.upsert({
      where: {
        id: id,
      },
      create: {
        name: name!,
        description,
        openai_assistant_id: assistant.id,
        model: model!,
        teamId: team.id,
        threadId: thread.id,
        temperatures: assistant.temperature ?? temperature,
      },
      update: {
        name,
        description,
        openai_assistant_id: openai_assistant_id,
        model,
        teamId: team.id,
        threadId: threadId,
        temperatures: temperature,
      }
    });

    return NextResponse.json({ message: "Assistente criado com sucesso!" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: true, message: error.message || "Erro interno." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teamName = searchParams.get("team");
    if (!teamName) {
      return NextResponse.json({ error: true, message: "Nome do time é obrigatório." }, { status: 400 });
    }

    const assistants = await prisma.assistant.findMany({
      where: { team: { name: teamName } }
    });

    return NextResponse.json({ message: "Assistentes encontrados!", data: assistants });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: true, message: error.message || "Erro interno." }, { status: 500 });
  }
}
