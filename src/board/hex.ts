import { CoinCollection, ICoinCollection } from "../coin/coinCollection";

export interface IHex {
  get coinStack(): ICoinCollection;
  is(flagName: string): number
}

class Hex implements IHex {
  private _coinStack: ICoinCollection;
  get coinStack(): ICoinCollection {
    return this._coinStack;
  }

  private _flags: Record<string, number> = {
    controllable: 0,
    controlledBy: -1,
    fortified: 0
  }

  is(flagName: string): number {
    return this._flags[flagName] ?? 0;
  }
  
  constructor() {
    this._coinStack = new CoinCollection();
  }
}