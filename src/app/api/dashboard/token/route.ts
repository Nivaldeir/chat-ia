import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function GET(req: Request) {
  // Obtendo os 5 times que mais gastaram tokens
  const topTeams = await prisma.tokenUsage.findMany({
    select: {
      teamId: true,
      team: { select: { name: true } },
      price: true,
    },
  });

  if (!topTeams.length) {
    return NextResponse.json({
      message: "Dados de uso de tokens por dia para os top 5 times",
      data: [],
    });
  }

  // Agrupando gastos por time
  const teamSpending = topTeams.reduce((acc, item) => {
    if (!item.teamId || !item.team?.name) return acc;
    acc[item.teamId] = (acc[item.teamId] || 0) + item.price;
    return acc;
  }, {} as Record<string, number>);

  // Pegando os 5 times que mais gastaram
  const top5Teams = Object.entries(teamSpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([teamId]) => teamId);

  // Pegando os gastos diários dos top 5 teams
  const dailyUsage = await prisma.tokenUsage.findMany({
    where: { teamId: { in: top5Teams } },
    select: {
      createdAt: true,
      teamId: true,
      price: true,
      team: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Formatando os dados no formato esperado
  const formattedData = dailyUsage.reduce((acc, item) => {
    if (!item.teamId || !item.team?.name) return acc;
    const date = item.createdAt.toISOString().split("T")[0];
    const teamName = item.team.name;
    const price = item.price;

    let entry = acc.find(e => e.date === date);
    if (!entry) {
      entry = { date };
      acc.push(entry);
    }

    entry[teamName] = (entry[teamName] || 0) + price;
    return acc;
  }, [] as Record<string, any>[]);

  return NextResponse.json({
    message: "Dados de uso de tokens por dia para os top 5 times",
    data: formattedData,
  });
}