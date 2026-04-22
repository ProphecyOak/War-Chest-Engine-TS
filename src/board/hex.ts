import { CoinCollection, ICoinCollection } from "../coin/coinCollection";

export interface IHex {
  get coinStack(): ICoinCollection;
  is(flagName: string): number;
  set(flagName: string, value: number): void;
}

export class Hex implements IHex {
  private _coinStack: ICoinCollection;
  get coinStack(): ICoinCollection {
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
    this._coinStack = new CoinCollection();
  }
}
