import { useMemo } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import type { DoublyLinkedMeterTree } from "@/types/meter";
import HorizontalBarChart from "./horizontal-bar-chart";

const chartConfig = {
  count: { label: "Series", color: "oklch(0.55 0.15 250)" },
} satisfies ChartConfig;

interface ChildrenDistributionChartProps {
  node: DoublyLinkedMeterTree;
}

export default function ChildrenDistributionChart({
  node,
}: ChildrenDistributionChartProps) {
  const chartData = useMemo(() => {
    const entries = Object.entries(node.children)
      .map(([name, child]) => ({
        name,
        count: child.count,
        label: `${name} (${child.count.toLocaleString()})`,
      }))
      .sort((a, b) => b.count - a.count);

    if (entries.length <= 15) return entries;

    const top = entries.slice(0, 14);
    const rest = entries.slice(14).reduce((sum, e) => sum + e.count, 0);
    return [...top, { name: "Others", count: rest, label: `Others (${rest.toLocaleString()})` }];
  }, [node]);

  if (chartData.length <= 1) return null;

  return (
    <HorizontalBarChart
      data={chartData}
      dataKey="count"
      labelKey="label"
      categoryKey="name"
      config={chartConfig}
      minHeight={150}
      padding={40}
      labelFontSize={12}
    />
  );
}
