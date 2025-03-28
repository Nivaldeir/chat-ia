import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ou qualquer outro método de interação com o banco de dados
import { openai } from "@/lib/openai";

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop() || "";
  if (!id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
  }

  try {
    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
    })
    if(!file) return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
    const _file = await openai.files.del(file.openai_id);

    if(_file.deleted){
      await prisma.file.delete({
        where: {
          id: id,
        },
      });
    }
    return NextResponse.json({ message: "Arquivo excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir o arquivo:", error);
    return NextResponse.json({ error: "Erro ao excluir o arquivo" }, { status: 500 });
  }
}
