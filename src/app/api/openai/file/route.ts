import { openai } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";
import { File } from "node-fetch";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";


export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const { searchParams } = new URL(req.url);
  const teamName = searchParams.get("team");

  const team = await prisma.team.findFirstOrThrow({
    where: {
      name: teamName!,
    }
  })
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const nodeFile = new File([arrayBuffer], file.name, { type: file.type });

  try {
    const output = await openai.files.create({
      file: nodeFile as unknown as File,
      purpose: "assistants",
    });
    await prisma.file.create({
      data: {
        filename: file.name,
        bytes: output.bytes,
        openai_id: output.id,
        extension: file.name.split('.').pop() ?? "txt",
        teamId: team.id
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: true, message: error.message });
  }

  return NextResponse.json({ message: "Arquivo recebido!", fileName: file.name });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  const { searchParams } = new URL(req.url);
  const teamName = searchParams.get("team");
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email
    }
  })

  const team = await prisma.team.findFirstOrThrow({
    where: {
      name: teamName!,
    },
  })
  const files = await prisma.file.findMany({
    where: {
      teamId: team.id
    }
  });

  return NextResponse.json({ message: "Recebido!", data: files });
}