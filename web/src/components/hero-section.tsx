import { TreePine } from "lucide-react";
import UrlInput from "./url-input";

interface HeroSectionProps {
  onSubmit: (url: string) => void;
}

export default function HeroSection({ onSubmit }: HeroSectionProps) {
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
          onClick={() => onSubmit("https://prometheus.demo.do.prometheus.io/metrics")}
        >
          https://prometheus.demo.do.prometheus.io/metrics
        </button>
      </p>
    </div>
  );
}
