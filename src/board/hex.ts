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
  place(unit: Unit, idx?: number): void;
  clear(): void;
  is(flagName: HexFlag, comparison?: number): boolean;
  set(flagName: HexFlag, value: number): void;
}

export class Hex implements IHex {
  private _inhabitant: TInhabitant | undefined;
  get inhabitant(): TInhabitant | undefined {
    return this._inhabitant;
  }

  place(unit: Unit, idx: number = 0): void {
    if (this._inhabitant != undefined)
      throw new Error("Cannot place to occupied hex.");
    this._inhabitant = { unit, idx };
  }

  clear(): void {
    this._inhabitant = undefined;
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
