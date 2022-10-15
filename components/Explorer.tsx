import React, { useState } from "react";

import {
  Button,
  Card,
  ChevronRightIcon,
  ChevronUpIcon,
  Heading,
  IconButton,
  majorScale,
  Pane,
  Pill,
  Text,
} from "evergreen-ui";

import type DoublyLinkedMeterTree from "../types/DoublyLinkedMeterTree";
import type Meter from "../types/Meter";

import Breadcrumbs from "./Breadcrumbs";
import MetricTypeBadge from "./MetricTypeBadge";

interface ExplorerProps {
  root: DoublyLinkedMeterTree;
}

export default function Explorer({ root }: ExplorerProps) {
  const [current, setCurrent] = useState(root);

  const onAncestorClick = (node: DoublyLinkedMeterTree) => () => {
    setCurrent(node);
  };

  const onItemClick = (node: DoublyLinkedMeterTree) => () => {
    setCurrent(node);
  };

  const ancestors = getAncestors(current);

  return (
    <Pane display="flex" flexDirection="column">
      <Breadcrumbs>
        {ancestors
          .reverse()
          .map((ancestor, index) => (
            <Button
              key={`ancestor-${index}`}
              appearance="minimal"
              onClick={onAncestorClick(ancestor)}
            >
              {ancestor.name}
            </Button>
          ))}
      </Breadcrumbs>
      {current.parent && <Parent onClick={onItemClick(current.parent)} />}
      {Object.entries(current.children)
        .sort()
        .map(([key, child], index) => (
          <Child
            key={`child-${index}`}
            child={child}
            onClick={onItemClick(child)}
          />
        ))}
    </Pane>
  );
}

interface ParentProps {
  onClick: () => void;
}

function Parent({ onClick }: ParentProps) {
  return (
    <Card
      border="default"
      display="flex"
      margin={majorScale(1)}
      padding={majorScale(2)}
    >
      <Pane alignItems="center" display="flex" flex={1} flexDirection="row">
        <Heading marginRight={majorScale(1)}>..</Heading>
      </Pane>
      <Pane>
        <IconButton icon={ChevronUpIcon} onClick={onClick} />
      </Pane>
    </Card>
  );
}

interface ChildProps {
  child: DoublyLinkedMeterTree;
  onClick: () => void;
}

function Child({ child, onClick }: ChildProps) {
  return (
    <Card
      border="default"
      display="flex"
      flexDirection="column"
      margin={majorScale(1)}
      padding={majorScale(2)}
    >
      <Pane alignItems="center" display="flex">
        <Pane flex={1}>
          <Pane alignItems="center" display="flex">
            <Heading marginRight={majorScale(1)}>{child.name}</Heading>
            <Pill>{child.count}</Pill>
          </Pane>
        </Pane>
        {Object.keys(child.children).length > 0 && (
          <Pane>
            <IconButton icon={ChevronRightIcon} onClick={onClick} />
          </Pane>
        )}
      </Pane>
      {child.meter && <MetricInformation metric={child.meter} />}
    </Card>
  );
}

interface MetricInformationProps {
  metric: Meter;
}

function MetricInformation({ metric }: MetricInformationProps) {
  return (
    <Pane alignItems="center" display="flex" flexDirection="row">
      <Text marginRight={majorScale(1)}>{metric.name}</Text>
      <MetricTypeBadge type={metric.type} />
    </Pane>
  );
}

function getAncestors(tree: DoublyLinkedMeterTree): DoublyLinkedMeterTree[] {
  let ancestors: DoublyLinkedMeterTree[] = [];
  let current: DoublyLinkedMeterTree | undefined = tree;
  while (current) {
    ancestors.push(current);
    current = current.parent;
  }
  return ancestors;
}
