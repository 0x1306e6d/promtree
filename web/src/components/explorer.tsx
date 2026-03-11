import { useEffect } from "react";
import {
  ChevronRight,
  FolderTree,
  Activity,
  Gauge,
  BarChart3,
  LineChart,
  Tag,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DoublyLinkedMeterTree } from "@/types/meter";
import type { MetricType } from "@/types/meter";
import { resolveTreePath, getTreePath } from "@/lib/resolve-tree-path";
import MetricTypeBadge from "./metric-type-badge";

interface ExplorerProps {
  root: DoublyLinkedMeterTree;
  path: string;
  onNavigate: (path: string, replace?: boolean) => void;
}

function getAncestors(
  tree: DoublyLinkedMeterTree
): DoublyLinkedMeterTree[] {
  const ancestors: DoublyLinkedMeterTree[] = [];
  let current: DoublyLinkedMeterTree | undefined = tree;
  while (current) {
    ancestors.push(current);
    current = current.parent;
  }
  return ancestors;
}

const iconColorMap: Record<string, string> = {
  counter: "bg-green-100 text-green-700",
  gauge: "bg-blue-100 text-blue-700",
  histogram: "bg-orange-100 text-orange-700",
  summary: "bg-purple-100 text-purple-700",
};

function MetricIcon({ type }: { type: MetricType }) {
  const props = { className: "h-4 w-4" };
  switch (type) {
    case "counter":
      return <Activity {...props} />;
    case "gauge":
      return <Gauge {...props} />;
    case "histogram":
      return <BarChart3 {...props} />;
    case "summary":
      return <LineChart {...props} />;
    default:
      return <Activity {...props} />;
  }
}

export default function Explorer({ root, path, onNavigate }: ExplorerProps) {
  const resolved = resolveTreePath(root, path);
  const current = resolved ?? root;

  useEffect(() => {
    if (!resolved && path) {
      onNavigate("", true);
    }
  }, [resolved, path, onNavigate]);

  const navigateTo = (node: DoublyLinkedMeterTree) => {
    onNavigate(getTreePath(node));
  };

  const ancestors = getAncestors(current).reverse();
  const entries = Object.entries(current.children).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const branches = entries.filter(
    ([, child]) => Object.keys(child.children).length > 0
  );
  const leaves = entries.filter(
    ([, child]) => Object.keys(child.children).length === 0 && child.meter
  );

  return (
    <div key={current.name} className="flex flex-col gap-3 animate-fade-in">
      {/* Breadcrumb bar */}
      <div className="flex items-center rounded-lg border bg-muted/50 px-4 py-2.5">
        <Breadcrumb>
          <BreadcrumbList>
            {ancestors.map((ancestor, index) => (
              <BreadcrumbItem key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                {index === ancestors.length - 1 ? (
                  <BreadcrumbPage className="font-semibold">
                    {ancestor.name}
                  </BreadcrumbPage>
                ) : (
                  <button
                    className="text-sm transition-colors hover:text-foreground"
                    onClick={() => navigateTo(ancestor)}
                  >
                    {ancestor.name}
                  </button>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <Badge variant="secondary" className="ml-auto shrink-0">
          {current.count} {current.count === 1 ? "metric" : "metrics"}
        </Badge>
      </div>

      {/* Branch nodes */}
      {branches.map(([key, child]) => (
        <Card
          key={key}
          className="group cursor-pointer transition-all duration-200 hover:border-primary/30 hover:shadow-md"
          onClick={() => navigateTo(child)}
        >
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="font-semibold">{child.name}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/20 transition-all"
                    style={{
                      width: `${(child.count / current.count) * 100}%`,
                    }}
                  />
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {child.count} {child.count === 1 ? "metric" : "metrics"}
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </Card>
      ))}

      {/* Separator between branches and leaves */}
      {branches.length > 0 && leaves.length > 0 && (
        <div className="flex items-center gap-3 pt-1">
          <Separator className="flex-1" />
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            Metrics ({leaves.length})
          </span>
          <Separator className="flex-1" />
        </div>
      )}

      {/* Leaf nodes */}
      {leaves.map(([key, child]) => (
        <Card
          key={key}
          className="transition-all duration-200 hover:border-primary/30 hover:shadow-md"
        >
          <div className="flex items-start gap-3 p-4">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                child.meter
                  ? iconColorMap[child.meter.type] ?? "bg-muted text-muted-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <MetricIcon type={child.meter?.type ?? ""} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{child.name}</span>
                {child.meter && <MetricTypeBadge type={child.meter.type} />}
              </div>
              {child.meter?.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {child.meter.description}
                </p>
              )}
              {child.meter?.labels &&
                Object.keys(child.meter.labels).length > 0 && (
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    <Tag className="h-3 w-3 shrink-0 text-muted-foreground/50" />
                    {Object.entries(child.meter.labels)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([key, values]) => (
                        <Tooltip key={key}>
                          <TooltipTrigger asChild>
                            <div className="inline-flex cursor-default items-center gap-1 rounded-md border bg-muted/40 px-1.5 py-0.5 text-[11px] transition-colors hover:border-primary/30 hover:bg-muted/60">
                              <span className="text-muted-foreground">
                                {key}
                              </span>
                              <span className="rounded bg-primary/10 px-1 font-semibold text-primary">
                                {values.length}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {values.map((v) => (
                                <code
                                  key={v}
                                  className="rounded bg-background/20 px-1 py-0.5 text-[11px]"
                                >
                                  {v}
                                </code>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                  </div>
                )}
              {child.meter && (
                <span className="text-xs text-muted-foreground/70">
                  {child.meter.name}
                </span>
              )}
            </div>
            <Badge variant="secondary" className="shrink-0">
              {child.count}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
