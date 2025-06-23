import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ModelConfig = {
  name: string;
  id?: string;
  description: string;
  instructions: string;
  files_ids: string[];
  temperature: number;
  model: string;
  team?: string;
  threadId?: string;
  openai_assistant_id?: string;
};

export async function POST(req: NextRequest) {
  console.log(req.body)
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

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: true, message: "Usuário não encontrado." }, { status: 404 });

    const team = await prisma.team.findFirst({ where: { name: teamName } });
    if (!team) return NextResponse.json({ error: true, message: "Time não encontrado." }, { status: 404 });

    const body = await req.json();
    console.log(body)
    const {
      name,
      model,
      description,
      files_ids = [],
      instructions = "Sem instruções.",
      id,
      temperature = 0.5,
      openai_assistant_id,
      threadId,
    } = body as Partial<ModelConfig>;

    let vectorStoreId: string | undefined = undefined;

    // Verifica e carrega arquivos válidos
    const fileRecords = await prisma.file.findMany({
      where: { id: { in: files_ids } },
    });

    if (files_ids.length && fileRecords.length !== files_ids.length) {
      return NextResponse.json({ error: true, message: "Um ou mais arquivos não foram encontrados." }, { status: 404 });
    }

    if (fileRecords.length > 0) {
      const vectorStore = await openai.beta.vectorStores.create({
        name,
        file_ids: fileRecords.map((f) => f.openai_id),
      });
      vectorStoreId = vectorStore.id;
    }

    let assistant;
    if (!id) {
      assistant = await openai.beta.assistants.create({
        name,
        model: model!,
        description,
        instructions,
        ...(vectorStoreId && {
          tool_resources: {
            file_search: { vector_store_ids: [vectorStoreId] },
          },
          tools: [{ type: "file_search" }],
        }),
      });
    } else {
      if (!openai_assistant_id) {
        return NextResponse.json({ error: true, message: "ID do assistente OpenAI é obrigatório para update." }, { status: 400 });
      }

      assistant = await openai.beta.assistants.update(openai_assistant_id, {
        name,
        model: model!,
        description,
        instructions,
        ...(vectorStoreId && {
          tool_resources: {
            file_search: { vector_store_ids: [vectorStoreId] },
          },
          tools: [{ type: "file_search" }],
        }),
      });
    }

    const thread = threadId ?? (await openai.beta.threads.create()).id;

    await prisma.assistant.upsert({
      where: {
        id: id ?? assistant.id,
      },
      create: {
        name: name!,
        description: description!,
        openai_assistant_id: assistant.id,
        instructions: instructions,
        model: model!,
        teamId: team.id,
        threadId: thread,
        temperatures: temperature,
      },
      update: {
        name: name!,
        description: description!,
        openai_assistant_id: assistant.id,
        model: model!,
        teamId: team.id,
        instructions: instructions,
        threadId: thread,
        temperatures: temperature,
      },
    });

    return NextResponse.json({ message: "Assistente salvo com sucesso!", assistantId: assistant.id });

  } catch (error: any) {
    console.error("Erro no POST /assistants:", error);
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
      where: { team: { name: teamName } },
    });

    return NextResponse.json({ message: "Assistentes encontrados!", data: assistants });
  } catch (error: any) {
    console.error("Erro no GET /assistants:", error);
    return NextResponse.json({ error: true, message: error.message || "Erro interno." }, { status: 500 });
  }
}
