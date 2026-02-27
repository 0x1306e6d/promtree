import type { DoublyLinkedMeterTree, MeterTree } from "@/types/meter";

export default function doubleLink(
  name: string,
  current: MeterTree,
  parent?: DoublyLinkedMeterTree
): DoublyLinkedMeterTree {
  const node: DoublyLinkedMeterTree = {
    name,
    parent,
    children: {},
    count: current.count,
    meter: current.meter,
  };
  (node as { children: Record<string, DoublyLinkedMeterTree> }).children =
    Object.entries(current.children).reduce<
      Record<string, DoublyLinkedMeterTree>
    >((acc, [key, value]) => {
      acc[key] = doubleLink(key, value, node);
      return acc;
    }, {});
  return node;
}
