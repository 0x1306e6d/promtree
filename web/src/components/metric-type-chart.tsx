import { useMemo } from "react";
import { Pie, PieChart, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DoublyLinkedMeterTree, MetricType } from "@/types/meter";

const typeColors: Record<string, string> = {
  counter: "oklch(0.55 0.15 145)",
  gauge: "oklch(0.55 0.15 250)",
  histogram: "oklch(0.65 0.15 55)",
  summary: "oklch(0.55 0.15 300)",
};

const chartConfig = {
  count: { label: "Count" },
  counter: { label: "Counter", color: typeColors.counter },
  gauge: { label: "Gauge", color: typeColors.gauge },
  histogram: { label: "Histogram", color: typeColors.histogram },
  summary: { label: "Summary", color: typeColors.summary },
} satisfies ChartConfig;

function collectTypeCounts(
  node: DoublyLinkedMeterTree
): Record<MetricType, number> {
  const counts: Record<MetricType, number> = {
    counter: 0,
    gauge: 0,
    histogram: 0,
    summary: 0,
    "": 0,
  };

  function walk(n: DoublyLinkedMeterTree) {
    if (n.meter) {
      counts[n.meter.type] += n.meter.count;
    }
    for (const child of Object.values(n.children)) {
      walk(child);
    }
  }

  walk(node);
  return counts;
}

interface MetricTypeChartProps {
  node: DoublyLinkedMeterTree;
}

export default function MetricTypeChart({ node }: MetricTypeChartProps) {
  const chartData = useMemo(() => {
    const counts = collectTypeCounts(node);
    return (["counter", "gauge", "histogram", "summary"] as MetricType[])
      .filter((type) => counts[type] > 0)
      .map((type) => ({
        type,
        count: counts[type],
        fill: `var(--color-${type})`,
      }));
  }, [node]);

  const total = useMemo(
    () => chartData.reduce((sum, d) => sum + d.count, 0),
    [chartData]
  );

  if (chartData.length === 0) {
    return null;
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto min-h-[200px] w-full max-w-[300px]"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="type"
          innerRadius={50}
          outerRadius={80}
          strokeWidth={2}
          isAnimationActive={false}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {total.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 22}
                      className="fill-muted-foreground text-xs"
                    >
                      series
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="type" />} />
      </PieChart>
    </ChartContainer>
  );
}
