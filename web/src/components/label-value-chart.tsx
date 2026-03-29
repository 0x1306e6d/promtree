import { useMemo } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import HorizontalBarChart from "./horizontal-bar-chart";

const MAX_VALUES = 15;

const chartConfig = {
  count: { label: "Series", color: "oklch(0.6 0.12 200)" },
} satisfies ChartConfig;

interface LabelValueChartProps {
  labelCounts: { [value: string]: number };
}

export default function LabelValueChart({ labelCounts }: LabelValueChartProps) {
  const { chartData, remaining } = useMemo(() => {
    const sorted = Object.entries(labelCounts)
      .map(([value, count]) => ({
        value,
        count,
        label: `${value} (${count.toLocaleString()})`,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      chartData: sorted.slice(0, MAX_VALUES),
      remaining: Math.max(0, sorted.length - MAX_VALUES),
    };
  }, [labelCounts]);

  if (chartData.length === 0) return null;

  return (
    <div className="mb-2">
      <HorizontalBarChart
        data={chartData}
        dataKey="count"
        labelKey="label"
        categoryKey="value"
        config={chartConfig}
      />
      {remaining > 0 && (
        <p className="mt-1 text-[10px] text-muted-foreground">
          ... and {remaining} more {remaining === 1 ? "value" : "values"}
        </p>
      )}
    </div>
  );
}
