import type Meter from "../types/Meter";
import type MeterTree from "../types/MeterTree";

export default function treefy(meters: Meter[]): MeterTree {
  const root: MutableMeterTree = { children: {}, count: 0 };
  meters.forEach((meter) => {
    const key = meter.name.split("_");
    add(root, key, meter);
  });
  return root;
}

function add(root: MutableMeterTree, key: string[], value: Meter) {
  let current = root;
  key.forEach((k) => {
    current.count += value.count;

    if (!(k in current.children)) {
      current.children[k] = { children: {}, count: 0 };
    }
    current = current.children[k];
  });

  current.count = value.count;
  current.meter = value;
}

interface MutableMeterTree {
  children: { [key: string]: MeterTree };
  count: number;
  meter?: Meter;
}
