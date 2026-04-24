import { ICoordinate } from "../board/coordinate";
import { UnitID } from "./unit";

type FaceDownAction = "pass" | "initiative" | "recruit";
type FaceUpAction = "move" | "attack" | "tactic" | "control";

type ActionName = `${string}.${FaceDownAction | FaceUpAction}`;

export interface IAction {
  name: ActionName;
  actor: UnitID;

  damaged: Map<ICoordinate, number>;
  damage(loc: ICoordinate, strength: number): IAction;

  moved: Map<{ loc: ICoordinate; depth: number }, ICoordinate>;
  move(loc: ICoordinate, destination: ICoordinate, depth?: number): IAction;

  controlled: Map<ICoordinate, number>;
  control(loc: ICoordinate, team: number): IAction;

  recruited: Map<UnitID, number>;
  recruit(unit: UnitID, amount: number): IAction;

  deployed: Map<{ unit: UnitID; amount: number }, ICoordinate>;
  deploy(unit: UnitID, amount: number, loc: ICoordinate): IAction;
}

export class Action implements IAction {
  name: ActionName;
  actor: UnitID;
  damaged: Map<ICoordinate, number> = new Map();
  moved: Map<{ loc: ICoordinate; depth: number }, ICoordinate> = new Map();
  controlled: Map<ICoordinate, number> = new Map();
  recruited: Map<UnitID, number> = new Map();
  deployed: Map<{ unit: UnitID; amount: number }, ICoordinate> = new Map();

  constructor(name: ActionName, actor: UnitID) {
    this.name = name;
    this.actor = actor;
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

  deploy(unit: UnitID, amount: number, loc: ICoordinate): IAction {
    this.deployed.set({ unit, amount }, loc);
    return this;
  }

  toJSON() {
    return {
      name: this.name,
      moved: Array.from(this.moved.entries()),
      damaged: Array.from(this.damaged.entries()),
      controlled: Array.from(this.controlled.entries()),
      recruited: Array.from(this.recruited.entries()),
      deployed: Array.from(this.deployed.entries()),
    };
  }
}
