import { IPlayable, UnitID } from "../unit/unit";
import { IGameEffect } from "./gameEffect";

type FaceDownAction = "pass" | "initiative" | "recruit";
type FaceUpAction = "move" | "attack" | "tactic" | "control";

type ActionName = `${string}.${FaceDownAction | FaceUpAction}`;

export interface IAction {
  name: ActionName;
  actor: UnitID;
  player: number;
  effects: IGameEffect[];
}

export class Action implements IAction {
  name: ActionName;
  actor: UnitID;
  player: number;
  effects: IGameEffect[] = [];

  constructor(actor: IPlayable, name: ActionName) {
    this.player = actor.team;
    this.actor = actor.id;
    this.name = name;
  }
}
