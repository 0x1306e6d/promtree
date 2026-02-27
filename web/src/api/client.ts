import type { MeterTree } from "@/types/meter";

export async function fetchMetricTree(url: string): Promise<MeterTree> {
  const response = await fetch(
    `/api/prometheus?url=${encodeURIComponent(url)}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch metrics: ${response.statusText}`);
  }
  return response.json();
}
