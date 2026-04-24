import { ICoordinate } from "../board/coordinate";

type FaceDownAction = "pass" | "initiative" | "recruit";
type FaceUpAction = "move" | "attack" | "tactic" | "control";

type ActionName = `${string}.${FaceDownAction | FaceUpAction}`;

type UnitID = `${string}.${string}`;

export interface IAction {
  name: ActionName;

  damaged: Map<ICoordinate, number>;
  damage(loc: ICoordinate, strength: number): IAction;

  moved: Map<{ loc: ICoordinate; depth: number }, ICoordinate>;
  move(loc: ICoordinate, destination: ICoordinate, depth?: number): IAction;

  controlled: Map<ICoordinate, number>;
  control(loc: ICoordinate, team: number): IAction;

  recruited: Map<UnitID, number>;
  recruit(unit: UnitID, amount: number): IAction;
}

export class Action implements IAction {
  name: ActionName;
  damaged: Map<ICoordinate, number> = new Map();
  moved: Map<{ loc: ICoordinate; depth: number }, ICoordinate> = new Map();
  controlled: Map<ICoordinate, number> = new Map();
  recruited: Map<UnitID, number> = new Map();

  constructor(name: ActionName) {
    this.name = name;
  }

  damage(loc: ICoordinate, strength: number): IAction {
    this.damaged.set(loc, strength);
    return this;
  }

  move(
    loc: ICoordinate,
    destination: ICoordinate,
    depth: number = -1,
  ): IAction {
    this.moved.set({ loc, depth }, destination);
    return this;
  }

  control(loc: ICoordinate, team: number): IAction {
    this.controlled.set(loc, team);
    return this;
  }

  recruit(unit: UnitID, amount: number): IAction {
    this.recruited.set(unit, amount);
    return this;
  }

  toJSON() {
    return {
      name: this.name,
      moved: Array.from(this.moved.entries()),
      damaged: Array.from(this.damaged.entries()),
      controlled: Array.from(this.controlled.entries()),
      recruited: Array.from(this.recruited.entries()),
    };
  }
}
