"use client"
import { Suspense } from "react"
import Link from "next/link"
import { Activity, FileText, Users, Zap } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { TokenUsageChart } from "./components/token-usage-chart"
import { UserTable } from "./components/user-table"
import { TeamTable } from "./components/team-table"
import { useFetcher } from "@/hooks/use-fetcher"

export default function DashboardPage() {
  const { data, isLoading } = useFetcher(`/api/dashboard`)

  return (
    <div className="flex w-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Link
              href="/dashboard/settings"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Configurações
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="teams">Equipes</TabsTrigger>
            <TabsTrigger value="usage">Uso de Tokens</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-4 w-48 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.data.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">{data?.data.growthPercentage.users} em relação ao mês passado</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Equipes Ativas</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.data.totalTeams}</div>
                    <p className="text-xs text-muted-foreground">{data?.data.growthPercentage.teams} em relação ao mês passado</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Arquivos</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.data.totalFiles}</div>
                    <p className="text-xs text-muted-foreground">{data?.data.growthPercentage.files} em relação ao mês passado</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Uso de Tokens</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.data.totalTokenUsage}</div>
                    <p className="text-xs text-muted-foreground">{data?.data.growthPercentage.tokens} em relação ao mês passado</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Uso de Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? <Skeleton className="h-40 w-full" /> : <TokenUsageChart />}
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div className="flex items-center space-x-4" key={i}>
                          <Skeleton className="h-4 w-4" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-48" />
                          </div>
                          <Skeleton className="h-4 w-16 ml-auto" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {data?.data.topEntities.map((top: any) => (
                        <div className="flex items-center" key={top.title + top.description}>
                          <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium">{top.title}</p>
                            <p className="text-sm text-muted-foreground">{top.description}</p>
                          </div>
                          <div className="ml-auto font-medium">{top.time}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
              </CardHeader>
              <CardContent>{isLoading ? <Skeleton className="h-40 w-full" /> : <UserTable />}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Equipes</CardTitle>
              </CardHeader>
              <CardContent>{isLoading ? <Skeleton className="h-40 w-full" /> : <TeamTable />}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Uso de Tokens</CardTitle>
              </CardHeader>
              <CardContent>{isLoading ? <Skeleton className="h-40 w-full" /> : <TokenUsageChart />}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
