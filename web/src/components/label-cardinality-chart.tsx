import { useMemo } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import HorizontalBarChart from "./horizontal-bar-chart";

const chartConfig = {
  cardinality: { label: "Unique values", color: "oklch(0.6 0.12 200)" },
} satisfies ChartConfig;

interface LabelCardinalityChartProps {
  labels: { [key: string]: string[] };
}

export default function LabelCardinalityChart({
  labels,
}: LabelCardinalityChartProps) {
  const chartData = useMemo(
    () =>
      Object.entries(labels)
        .map(([label, values]) => ({
          label,
          cardinality: values.length,
          display: `${label} (${values.length})`,
        }))
        .sort((a, b) => b.cardinality - a.cardinality),
    [labels]
  );

  if (chartData.length < 2) return null;

  return (
    <HorizontalBarChart
      data={chartData}
      dataKey="cardinality"
      labelKey="display"
      categoryKey="label"
      config={chartConfig}
      className="mt-1 w-full"
    />
  );
}
