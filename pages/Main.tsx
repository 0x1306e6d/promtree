import { useEffect, useState } from "react";

import { Spinner } from "evergreen-ui";

import type DoublyLinkedMeterTree from "../types/DoublyLinkedMeterTree";
import type MeterTree from "../types/MeterTree";

import doubleLink from "../libs/doubleLink";

import Explorer from "../components/Explorer";

interface MainProps {
  url: string;
}

export default function Main({ url }: MainProps) {
  const [tree, setTree] = useState<DoublyLinkedMeterTree | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchPrometheus = async () => {
      const response = await fetch(`/api/prometheus?url=${url}`);
      const newTree: MeterTree = await response.json();
      setTree(doubleLink("", newTree));
    };
    fetchPrometheus();
  }, [url]);

  if (tree) {
    return <Explorer root={tree} />;
  } else {
    return <Spinner />;
  }
}
