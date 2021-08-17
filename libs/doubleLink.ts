import type DoublyLinkedMeterTree from "../types/DoublyLinkedMeterTree";
import type MeterTree from "../types/MeterTree";

export default function doubleLink(
  name: string,
  current: MeterTree,
  parent?: DoublyLinkedMeterTree
): DoublyLinkedMeterTree {
  const doublyLinkedCurrent = {
    name,
    parent,
    children: {}, // fill children lazy.
    count: current.count,
    meter: current.meter,
  };
  doublyLinkedCurrent.children = Object.entries(current.children).reduce<{
    [key: string]: DoublyLinkedMeterTree;
  }>((acc, [key, value]) => {
    acc[key] = doubleLink(key, value, doublyLinkedCurrent);
    return acc;
  }, {});
  return doublyLinkedCurrent;
}
