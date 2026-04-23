import * as CoinCollections from "../coin/collections";

export interface IHex {
  get coinStack(): CoinCollections.ICoinStack;
  is(flagName: string): number;
  set(flagName: string, value: number): void;
}

export class Hex implements IHex {
  private _coinStack: CoinCollections.ICoinStack;
  get coinStack(): CoinCollections.ICoinStack {
    return this._coinStack;
  }

  private _flags: Record<string, number> = {
    controllable: 0,
    controlledBy: -1,
    fortified: 0,
  };

  is(flagName: string): number {
    return this._flags[flagName] ?? 0;
  }

  set(flagName: string, value: number): void {
    this._flags[flagName] = value;
  }

  constructor() {
    this._coinStack = new CoinCollections.Stack();
  }
}
