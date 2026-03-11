import { useCallback } from "react";
import Layout from "@/components/layout";
import UrlInput from "@/components/url-input";
import HeroSection from "@/components/hero-section";
import Explorer from "@/components/explorer";
import ExplorerSkeleton from "@/components/explorer-skeleton";
import ErrorAlert from "@/components/error-alert";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMetricTree } from "@/hooks/use-metric-tree";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useUrlState } from "@/hooks/use-url-state";

export default function App() {
  const { url, path, setUrl, setPath } = useUrlState();
  const { tree, loading, error } = useMetricTree(url);
  const { history, addEntry, removeEntry, clearHistory } = useSearchHistory();

  const handleSubmit = useCallback(
    (newUrl: string) => {
      setUrl(newUrl);
      addEntry(newUrl);
    },
    [setUrl, addEntry]
  );

  const hasSubmitted = url !== "";

  return (
    <TooltipProvider delayDuration={300}>
      <Layout>
        {!hasSubmitted ? (
          <HeroSection
            onSubmit={handleSubmit}
            history={history}
            onRemoveHistory={removeEntry}
            onClearHistory={clearHistory}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <UrlInput onSubmit={handleSubmit} compact />
            {loading && <ExplorerSkeleton />}
            {error && <ErrorAlert message={error} />}
            {tree && (
              <Explorer root={tree} path={path} onNavigate={setPath} />
            )}
          </div>
        )}
      </Layout>
    </TooltipProvider>
  );
}
