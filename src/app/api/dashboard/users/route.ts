import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      isActived: true,
      createdAt: true,
      teams: {
        select: {
          name: true,
        },
      },
    },
  });

  const output = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isActived: user.isActived,
    createdAt: user.createdAt.toISOString(),
    teams: user.teams.map(team => team.name),
  }));

  return NextResponse.json({ message: "", data: output });
}
