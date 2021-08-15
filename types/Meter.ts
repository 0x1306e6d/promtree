export default interface Meter {
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly count: number;
}
