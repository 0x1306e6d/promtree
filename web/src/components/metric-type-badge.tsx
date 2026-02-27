import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MetricType } from "@/types/meter";

interface MetricTypeBadgeProps {
  type: MetricType;
}

const colorMap: Record<string, string> = {
  counter: "bg-green-100 text-green-800 border-green-200",
  gauge: "bg-blue-100 text-blue-800 border-blue-200",
  histogram: "bg-orange-100 text-orange-800 border-orange-200",
  summary: "bg-purple-100 text-purple-800 border-purple-200",
};

const descriptionMap: Record<string, string> = {
  counter: "A counter is a cumulative metric that only goes up.",
  gauge: "A gauge is a metric that can go up and down.",
  histogram:
    "A histogram samples observations and counts them in configurable buckets.",
  summary:
    "A summary samples observations and provides configurable quantiles.",
};

export default function MetricTypeBadge({ type }: MetricTypeBadgeProps) {
  if (!type) return null;

  const description = descriptionMap[type];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={colorMap[type] ?? ""}>
          {type}
        </Badge>
      </TooltipTrigger>
      {description && (
        <TooltipContent side="top" className="max-w-xs">
          <p>{description}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
