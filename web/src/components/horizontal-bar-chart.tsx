import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";

const ROW_HEIGHT = 28;

interface HorizontalBarChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  labelKey: string;
  categoryKey: string;
  config: ChartConfig;
  minHeight?: number;
  padding?: number;
  labelFontSize?: number;
  className?: string;
}

export default function HorizontalBarChart({
  data,
  dataKey,
  labelKey,
  categoryKey,
  config,
  minHeight = 80,
  padding = 20,
  labelFontSize = 11,
  className,
}: HorizontalBarChartProps) {
  if (data.length === 0) return null;

  const chartHeight = Math.max(minHeight, data.length * ROW_HEIGHT + padding);

  return (
    <ChartContainer
      config={config}
      className={className ?? "w-full"}
      style={{ minHeight: chartHeight }}
    >
      <BarChart
        accessibilityLayer
        layout="vertical"
        data={data}
        margin={{ right: 100 }}
      >
        <XAxis type="number" dataKey={dataKey} hide />
        <YAxis dataKey={categoryKey} type="category" hide />
        <Bar
          dataKey={dataKey}
          fill={`var(--color-${dataKey})`}
          radius={5}
          isAnimationActive={false}
        >
          <LabelList
            dataKey={labelKey}
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={labelFontSize}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
