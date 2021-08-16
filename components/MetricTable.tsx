import { useEffect, useState } from "react";

import { Table } from "evergreen-ui";

import type Meter from "../types/Meter";

interface MetricTableProps {
  url: string;
}

export default function MetricTable({ url }: MetricTableProps) {
  const [meters, setMeters] = useState<{ [name: string]: Meter }>({});

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
        {Object.values(meters)
          .sort((a, b) => a.count - b.count)
          .reverse()
          .map((meter) => (
            <Table.Row key={meter.name}>
              <Table.TextCell>{meter.name}</Table.TextCell>
              <Table.TextCell isNumber>{meter.count}</Table.TextCell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
}
