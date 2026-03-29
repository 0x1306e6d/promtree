import { TreePine } from "lucide-react";
import { MarkGithubIcon } from "@primer/octicons-react";
import { Separator } from "@/components/ui/separator";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-10 flex h-12 w-full items-center border-b bg-background/80 px-6 backdrop-blur-sm">
      <button
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
        onClick={() => {
          window.history.pushState({}, "", "/");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
      >
        <TreePine className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">promtree</h1>
      </button>
      <Separator orientation="vertical" className="mx-3 h-4" />
      <span className="hidden text-sm text-muted-foreground sm:inline">
        Prometheus Metric Explorer
      </span>
      <div className="ml-auto">
        <a
          href="https://github.com/0x1306e6d/promtree"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <MarkGithubIcon size={16} />
        </a>
      </div>
    </nav>
  );
}
