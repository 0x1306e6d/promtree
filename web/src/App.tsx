import { useState } from "react";
import Layout from "@/components/layout";
import UrlInput from "@/components/url-input";
import HeroSection from "@/components/hero-section";
import Explorer from "@/components/explorer";
import ExplorerSkeleton from "@/components/explorer-skeleton";
import ErrorAlert from "@/components/error-alert";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMetricTree } from "@/hooks/use-metric-tree";

export default function App() {
  const [url, setUrl] = useState("");
  const { tree, loading, error } = useMetricTree(url);

  const hasSubmitted = url !== "";

  return (
    <TooltipProvider delayDuration={300}>
      <Layout>
        {!hasSubmitted ? (
          <HeroSection onSubmit={setUrl} />
        ) : (
          <div className="flex flex-col gap-4">
            <UrlInput onSubmit={setUrl} compact />
            {loading && <ExplorerSkeleton />}
            {error && <ErrorAlert message={error} />}
            {tree && <Explorer root={tree} />}
          </div>
        )}
      </Layout>
    </TooltipProvider>
  );
}
