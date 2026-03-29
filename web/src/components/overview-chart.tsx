import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DoublyLinkedMeterTree } from "@/types/meter";
import MetricTypeChart from "./metric-type-chart";
import ChildrenDistributionChart from "./children-distribution-chart";

interface OverviewChartProps {
  node: DoublyLinkedMeterTree;
}

export default function OverviewChart({ node }: OverviewChartProps) {
  const hasChildren = Object.keys(node.children).length > 1;
  const hasMetrics = node.count > 0;

  if (!hasMetrics) return null;

  return (
    <Card className="p-4">
      <Tabs defaultValue="types">
        <TabsList>
          <TabsTrigger value="types">By Type</TabsTrigger>
          {hasChildren && (
            <TabsTrigger value="children">By Namespace</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="types">
          <MetricTypeChart node={node} />
        </TabsContent>
        {hasChildren && (
          <TabsContent value="children">
            <ChildrenDistributionChart node={node} />
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
}
