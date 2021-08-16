import { useEffect, useState } from "react";

import { Table } from "evergreen-ui";

import type MeterTree from "../types/MeterTree";

interface MetricTableProps {
  url: string;
}

export default function MetricTable({ url }: MetricTableProps) {
  const [meters, setMeters] = useState<MeterTree | undefined>(undefined);

  useEffect(() => {
    const fetchPrometheus = async () => {
      const response = await fetch(`/api/prometheus?url=${url}`);
      const newMeters = await response.json();
      setMeters(newMeters);
    };
    fetchPrometheus();
  }, [url]);

  return (
    <Table>
      <Table.Head>
        <Table.TextHeaderCell>Name</Table.TextHeaderCell>
        <Table.TextHeaderCell>Count</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {meters &&
          Object.entries(meters.children).map(([key, value]) => (
            <Table.Row key={key}>
              <Table.TextCell>{key}</Table.TextCell>
              <Table.TextCell isNumber>{value.count}</Table.TextCell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
}
