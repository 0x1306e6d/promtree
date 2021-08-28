import type MetricType from "./MetricType";

export default interface Meter {
  readonly name: string;
  readonly description: string;
  readonly type: MetricType;
  readonly count: number;
}
