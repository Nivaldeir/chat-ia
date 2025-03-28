//@ts-nocheck

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { subMonths, subDays, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GrowthData {
  users: string;
  teams: string;
  files: string;
  tokens: string;
}

interface RecentActivityData {
  recentUsers: number;
  recentTeams: number;
  recentFiles: number;
  recentTokens: number;
}

interface StatsResponse {
  message: string;
  data: {
    totalUsers: number;
    totalTeams: number;
    totalFiles: number;
    totalTokenUsage: number;
    growthPercentage: GrowthData;
    recentActivity: RecentActivityData;
    topEntities: any[];
  };
}

export async function GET(req: Request): Promise<NextResponse<StatsResponse>> {
  const currentDate = new Date();
  const lastMonthDate = subMonths(currentDate, 1);
  const lastWeekDate = subDays(currentDate, 7);

  const totalUsers = await prisma.user.count();
  const lastMonthUsers = await prisma.user.count({
    where: { createdAt: { lt: lastMonthDate } },
  });

  const totalTeams = await prisma.team.count();
  const lastMonthTeams = await prisma.team.count({
    where: { createdAt: { lt: lastMonthDate } },
  });

  const totalFiles = await prisma.file.count();
  const lastMonthFiles = await prisma.file.count({
    where: { createdAt: { lt: lastMonthDate } },
  });

  const totalTokenUsage = await prisma.tokenUsage.aggregate({
    _sum: { tokens: true },
  });

  const lastMonthTokenUsage = await prisma.tokenUsage.aggregate({
    _sum: { tokens: true },
    where: { createdAt: { lt: lastMonthDate } },
  });

  const recentUsers = await prisma.user.count({
    where: { createdAt: { gte: lastWeekDate } },
  });
  const recentTeams = await prisma.team.count({
    where: { createdAt: { gte: lastWeekDate } },
  });
  const recentFiles = await prisma.file.count({
    where: { createdAt: { gte: lastWeekDate } },
  });
  const recentTokens = await prisma.tokenUsage.aggregate({
    _sum: { tokens: true },
    where: { createdAt: { gte: lastWeekDate } },
  });

  const calculateGrowth = (current: number, previous: number): string => {
    if (previous === 0) return "100%";
    return `${(((current - previous) / previous) * 100).toFixed(2)}%`;
  };

  const growthPercentage: GrowthData = {
    users: calculateGrowth(totalUsers, lastMonthUsers),
    teams: calculateGrowth(totalTeams, lastMonthTeams),
    files: calculateGrowth(totalFiles, lastMonthFiles),
    tokens: calculateGrowth(
      totalTokenUsage._sum.tokens || 0,
      lastMonthTokenUsage._sum.tokens || 0
    ),
  };

  const recentActivity: RecentActivityData = {
    recentUsers,
    recentTeams,
    recentFiles,
    recentTokens: recentTokens._sum.tokens || 0,
  };

  const teams = await prisma.team.findMany({
    orderBy: { createdAt: "desc" },
  });

  const assistants = await prisma.assistant.findMany({
    orderBy: { createdAt: "desc" },
    include: { team: true }
  });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  const combinedEntities = [...teams, ...assistants, ...users]
    .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
    .slice(0, 5);
  const formattedEntities = combinedEntities.map((entity) => {
    const timeAgo = formatDistanceToNow(new Date(entity!.createdAt), { locale: ptBR, addSuffix: true });
    if ('icon' in entity && 'createdBy' in entity) {
      return {
        title: `Nova equipe criada`,
        description: `Equipe '${entity.name}' foi criada por ${entity.createdBy?.name || "Desconhecido"}`,
        time: timeAgo
      }
    }

    if ('name' in entity && 'team' in entity) {
      return {
        title: `Novo assistente adicionado`,
        description: `Assistente '${entity.name}' foi adicionado à equipe '${entity.team?.name || "Desconhecido"}`,
        time: timeAgo
      }
    }

    if ('email' in entity) {
      return {
        title: `Novo usuário registrado`,
        description: `${entity.name} se registrou na plataforma`,
        time: timeAgo
      }
    }
  }).filter(e=>e);
  return NextResponse.json({
    message: "",
    data: {
      totalUsers,
      totalTeams,
      totalFiles,
      totalTokenUsage: totalTokenUsage._sum.tokens || 0,
      growthPercentage,
      recentActivity,
      topEntities: formattedEntities,
    },
  });
}
