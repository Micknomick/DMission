"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type ProgressCircleProps = {
  completedTasks: number; // 完了タスク数
  totalTasks: number; // 合計タスク数
};

const chartConfig = {
  completed: {
    label: "Completed",
    color: "#6366F1", // Blue for completed tasks
  },
  remaining: {
    label: "Remaining",
    color: "#F43F5E", // Red for remaining tasks
  },
} satisfies ChartConfig;

export function ProgressCircle({ completedTasks, totalTasks }: ProgressCircleProps) {
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const remainingTasks = totalTasks - completedTasks;

  const chartData = [
    { name: "Completed", value: completedTasks },
    { name: "Remaining", value: remainingTasks },
  ];

  return (
    <Card className="flex flex-col bg-black text-white">
      <CardHeader className="items-center pb-0">
        <CardTitle>Task Progress</CardTitle>
        <CardDescription>Do Tasks</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-white text-3xl font-bold"
                        >
                          {completedTasks}/{totalTasks}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 16}
                          className="fill-gray-400 text-lg"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            {/* RadialBar for Completed Tasks */}
            <RadialBar
              dataKey="value"
              stackId="a"
              cornerRadius={5}
              data={[chartData[0]]} // Completed data
              fill={chartConfig.completed.color}
              className="stroke-transparent stroke-2"
            />
            {/* RadialBar for Remaining Tasks */}
            <RadialBar
              dataKey="value"
              stackId="a"
              cornerRadius={5}
              data={[chartData[1]]} // Remaining data
              fill={chartConfig.remaining.color}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by {progress.toFixed(1)}% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-gray-400">Showing task progress overview</div>
      </CardFooter>
    </Card>
  );
}

export default ProgressCircle;
