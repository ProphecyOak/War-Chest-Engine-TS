import * as CoinCollections from "../coin/collections";

export enum HexFlag {
  Controllable = "Controllable",
  ControlledBy = "ControlledBy",
  Fortified = "Fortified",
}

export interface IHex {
  get coinStack(): CoinCollections.ICoinStack;
  is(flagName: HexFlag, comparison?: number): boolean;
  set(flagName: HexFlag, value: number): void;
}

export class Hex implements IHex {
  private _coinStack: CoinCollections.ICoinStack;
  get coinStack(): CoinCollections.ICoinStack {
    return this._coinStack;
  }

  private _flags: Partial<Record<HexFlag, number>> = {
    [HexFlag.Controllable]: 0,
  };

  is(flagName: HexFlag, comparison: number = 1): boolean {
    return (this._flags[flagName] ?? 0) == comparison;
  }

  set(flagName: HexFlag, value: number): void {
    this._flags[flagName] = value;
  }

  constructor() {
    this._coinStack = new CoinCollections.Stack();
  }
}
