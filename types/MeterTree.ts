import type Meter from "./Meter";

export default interface MeterTree {
  readonly children: { [key: string]: MeterTree };
  readonly count: number;
  readonly meter?: Meter;
}
