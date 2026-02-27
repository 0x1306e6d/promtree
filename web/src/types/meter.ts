export type MetricType =
  | "counter"
  | "gauge"
  | "histogram"
  | "summary"
  | "";

export interface Meter {
  readonly name: string;
  readonly description: string;
  readonly type: MetricType;
  readonly count: number;
}

export interface MeterTree {
  readonly children: { [key: string]: MeterTree };
  readonly count: number;
  readonly meter?: Meter;
}

export interface DoublyLinkedMeterTree {
  readonly name: string;
  readonly parent?: DoublyLinkedMeterTree;
  readonly children: { [key: string]: DoublyLinkedMeterTree };
  readonly count: number;
  readonly meter?: Meter;
}
