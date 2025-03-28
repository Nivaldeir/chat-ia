import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.json();
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.redirect("/signin")
  }
  console.log(session.user)
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    }
  })
  console.log(user)
  const team = await prisma.team.create({
    data: {
      name: formData.name,
      icon: formData.icon,
      admins: {
        connectOrCreate: {
          where: {
            id: user!.id
          },
          create: {
            userId: user!.id,
          }
        }
      },
      users: {
        connect: {
          id: user!.id
        },
      },
    }
  })
  await prisma.user.update({
    where: {
      email: session.user.email!
    },
    data: {
      teams: {
        connect: {
          id: team.id
        }
      }
    }
  })
  return NextResponse.json({ message: "Team criado com sucesso!", team }, {
    status: 201
  });
}


export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.redirect("/signin")
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    }
  })
  try {
    const teams = await prisma.team.findMany({
      where: {
        users: {
          some: {
            id: user!.id
          }
        }
      }
    })
    return NextResponse.json({ message: "", data: teams });
  } catch (error) {
    console.error("Erro ao excluir o arquivo:", error);
    return NextResponse.json({ error: "Erro ao excluir o arquivo" }, { status: 500 });
  }
}