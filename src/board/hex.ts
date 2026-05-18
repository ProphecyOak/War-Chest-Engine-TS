import * as CoinCollections from "../coin/collections";
import { Unit } from "../unit/unit";

export enum HexFlag {
  Controllable = "Controllable",
  ControlledBy = "ControlledBy",
  Fortified = "Fortified",
}

type TInhabitant = { unit: Unit; idx?: number };
//TODO: TInhabitant Longboat
//   Maybe this type needs a function that grabs
//   optional units to maneuver or something

export interface IHex {
  get inhabitant(): TInhabitant | undefined;
  is(flagName: HexFlag, comparison?: number): boolean;
  set(flagName: HexFlag, value: number): void;
}

export class Hex implements IHex {
  private _inhabitant?: TInhabitant;
  get inhabitant(): TInhabitant | undefined {
    return this._inhabitant;
  }

  set inhabitant(new_inhabitant: TInhabitant) {
    this._inhabitant = new_inhabitant;
  }

  private _flags: Partial<Record<HexFlag, number>> = {
    [HexFlag.Controllable]: 0,
  };

  is(flagName: HexFlag, comparison: number = 1): boolean {
    return (this._flags[flagName] ?? -1) == comparison;
  }

  set(flagName: HexFlag, value: number): void {
    this._flags[flagName] = value;
  }
}
