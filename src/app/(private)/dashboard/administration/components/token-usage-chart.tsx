"use client";

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useFetcher } from "@/hooks/use-fetcher";
import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type ApiResponse = {
  message: string;
  data: Record<string, any>[]; // Dados da API
};

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  nivaldeir: {
    label: "nivaldeir",
    color: "hsl(var(--chart-1))",
  },
  231: {
    label: "231",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function TokenUsageChart() {
  const { data } = useFetcher<ApiResponse>(`/api/dashboard/token`);

  // Extraindo chaves válidas (times) sem contar "date"
  const keys = Object.keys(data?.data?.[0] ?? {}).filter((k) => k !== "date");

  const [timeRange, setTimeRange] = React.useState("90d");

  // Filtrando dados com base no timeRange
  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    const referenceDate = new Date();
    let daysToSubtract = 90;

    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return data.data.filter((item) => new Date(item.date) >= startDate);
  }, [data, timeRange]);

  // Definição de cores dinâmicas para os times
  const colors = [`#8884d8`, `#82ca9d`, `#ffc658`, `#ff8042`, `#0088fe`];

  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              return new Date(value).toLocaleDateString("pt-BR", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                indicator="dot"
              />
            }
          />

          {/* Renderizando uma Area para cada time */}
          {keys.map((key, index) => (
            <Area
              key={key}
              dataKey={key}
              type="monotone"
              fill={`url(#fill${key})`}
              stackId="a"
            />
          ))}

          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
