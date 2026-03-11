import type { DoublyLinkedMeterTree } from "@/types/meter";

export function resolveTreePath(
  root: DoublyLinkedMeterTree,
  path: string
): DoublyLinkedMeterTree | undefined {
  if (!path) return root;

  const segments = path.split("/");
  let current: DoublyLinkedMeterTree = root;

  for (const segment of segments) {
    const child = current.children[segment];
    if (!child) return undefined;
    current = child;
  }

  return current;
}

export function getTreePath(node: DoublyLinkedMeterTree): string {
  const segments: string[] = [];
  let current: DoublyLinkedMeterTree | undefined = node;

  while (current?.parent) {
    segments.push(current.name);
    current = current.parent;
  }

  return segments.reverse().join("/");
}
