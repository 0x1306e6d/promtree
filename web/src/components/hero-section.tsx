import { TreePine, X, Clock, Trash2 } from "lucide-react";
import UrlInput from "./url-input";
import type { SearchHistoryEntry } from "@/hooks/use-search-history";

interface HeroSectionProps {
  onSubmit: (url: string) => void;
  history: SearchHistoryEntry[];
  onRemoveHistory: (url: string) => void;
  onClearHistory: () => void;
}

export default function HeroSection({
  onSubmit,
  history,
  onRemoveHistory,
  onClearHistory,
}: HeroSectionProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <TreePine className="h-8 w-8 text-primary" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Explore Prometheus Metrics
          </h2>
          <p className="max-w-md text-muted-foreground">
            Paste a Prometheus metrics endpoint URL to visualize and explore your
            metrics as an interactive tree.
          </p>
        </div>
      </div>
      <div className="w-full max-w-lg">
        <UrlInput onSubmit={onSubmit} />
      </div>
      <p className="text-xs text-muted-foreground">
        Try{" "}
        <button
          className="underline underline-offset-2 hover:text-foreground transition-colors"
          onClick={() => onSubmit("https://node.demo.prometheus.io/metrics")}
        >
          https://node.demo.prometheus.io/metrics
        </button>
      </p>

      {history.length > 0 && (
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Recent</span>
            </div>
            <button
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClearHistory}
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear all</span>
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {history.map((entry) => (
              <div
                key={entry.url}
                className="group flex items-center gap-2 rounded-lg border bg-card px-3 py-2 transition-colors hover:border-primary/30 hover:bg-accent cursor-pointer"
                onClick={() => onSubmit(entry.url)}
              >
                <span className="text-sm font-medium truncate">
                  {entry.hostname}
                </span>
                <span className="text-xs text-muted-foreground truncate flex-1 min-w-0">
                  {entry.url}
                </span>
                <button
                  className="shrink-0 rounded-md p-0.5 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveHistory(entry.url);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
