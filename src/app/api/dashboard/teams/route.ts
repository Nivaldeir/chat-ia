import { calculateTokenCost } from "@/lib/calculate-token";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const teams = await prisma.team.findMany({
    select: {
      id: true,
      name: true,
      users: {
        select: {
          TokenUsage: true,
          _count: true
        }
      },
      file: { select: { id: true } },
      tokenUsage: true,
      assistant: { select: { id: true } },
    },
  });
  const output = teams.map(team => ({
    id: team.id,
    name: team.name,
    icon: team.name.charAt(0).toUpperCase(),
    userCount: team.users?.length,
    fileCount: team.file.length,
    tokenUsage: team.tokenUsage.reduce((sum, usage) => sum + usage.tokens, 0),
    assistantCount: team.assistant.length,
  }));
  return NextResponse.json({ message: "", data: output });
}
