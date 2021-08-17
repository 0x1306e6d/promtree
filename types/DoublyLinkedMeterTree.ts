import type Meter from "./Meter";

export default interface DoublyLinkedMeterTree {
  readonly name: string;
  readonly parent?: DoublyLinkedMeterTree;
  readonly children: { [key: string]: DoublyLinkedMeterTree };
  readonly count: number;
  readonly meter?: Meter;
}
