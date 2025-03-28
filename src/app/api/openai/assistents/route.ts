import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ModelConfig = {
  name: string;
  description: string;
  model: string;
  instructions: string;
  files_ids: string[];
  temperature: number;
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

    const { name, model, description, files_ids, instructions } = await req.json() as ModelConfig;
    let fileRecord
    if (files_ids[0]) {
      fileRecord = await prisma.file.findFirst({ where: { id: files_ids[0] } });
      if (!fileRecord) {
        return NextResponse.json({ error: true, message: "Arquivo não encontrado." }, { status: 404 });
      }
    }

    const vectorStore = await openai.beta.vectorStores.create({
      name,
      ...(fileRecord && { file_ids: [fileRecord.openai_id] })
    });

    const assistant = await openai.beta.assistants.create({
      name,
      model,
      description,
      instructions: instructions || "Sem instruções.",
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id]
        },
      },
      tools: [{ type: "file_search" }]
    });

    const thread = await openai.beta.threads.create();

    await prisma.assistant.create({
      data: {
        name,
        description,
        openai_assistant_id: assistant.id,
        model,
        teamId: team.id,
        threadId: thread.id,
        temperatures: assistant.temperature || 0.5,
      },
    });

    return NextResponse.json({ message: "Assistente criado e arquivo anexado!" });
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
