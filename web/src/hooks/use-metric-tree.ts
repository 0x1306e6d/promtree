import { useEffect, useState } from "react";
import type { DoublyLinkedMeterTree } from "@/types/meter";
import { fetchMetricTree } from "@/api/client";
import doubleLink from "@/lib/double-link";

interface UseMetricTreeResult {
  tree: DoublyLinkedMeterTree | undefined;
  loading: boolean;
  error: string | undefined;
}

export function useMetricTree(url: string): UseMetricTreeResult {
  const [tree, setTree] = useState<DoublyLinkedMeterTree | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!url) {
      setTree(undefined);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(undefined);

    const load = async () => {
      try {
        const hostname = new URL(url).hostname;
        const meterTree = await fetchMetricTree(url);
        if (!cancelled) {
          setTree(doubleLink(hostname, meterTree));
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { tree, loading, error };
}
