import { TreePine } from "lucide-react";
import { MarkGithubIcon } from "@primer/octicons-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-10 flex h-12 w-full items-center border-b bg-background/80 px-6 backdrop-blur-sm">
      <Button
        variant="ghost"
        className="gap-2 px-2"
        onClick={() => {
          window.history.pushState({}, "", "/");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
      >
        <TreePine className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">promtree</h1>
      </Button>
      <Separator orientation="vertical" className="mx-3 h-4" />
      <span className="hidden text-sm text-muted-foreground sm:inline">
        Prometheus Metric Explorer
      </span>
      <div className="ml-auto">
        <a
          href="https://github.com/0x1306e6d/promtree"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <MarkGithubIcon size={16} />
        </a>
      </div>
    </nav>
  );
}
