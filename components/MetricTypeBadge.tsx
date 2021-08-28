import { Badge } from "evergreen-ui";

import MetricType from "../types/MetricType";

interface MetricTypeBadgeProps {
  type: MetricType;
}

export default function MetricTypeBadge({ type }: MetricTypeBadgeProps) {
  return <Badge color={colorOf(type)}>{type}</Badge>;
}

type Color = "neutral" | "blue" | "orange" | "green" | "purple";

function colorOf(type: MetricType): Color {
  switch (type) {
    case MetricType.Counter:
      return "green";
    case MetricType.Gauge:
      return "blue";
    case MetricType.Histogram:
      return "orange";
    case MetricType.Summary:
      return "purple";
  }
  return "neutral";
}
