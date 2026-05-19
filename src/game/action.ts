import { IPlayable, Unit, UnitID } from "../unit/unit";
import { UnitEvent } from "../unit/unitEvents";
import { IGameEffect } from "./gameEffect";

type DeployAction = "deploy" | "bolster";
type FaceDownAction = "pass" | "initiative" | "recruit";
type FaceUpAction = "move" | "attack" | "tactic" | "control";
type OtherAction = "thorns";

type ActionName =
  `${string}.${DeployAction | FaceDownAction | FaceUpAction | OtherAction}`;

export interface IAction {
  name: ActionName;
  actor: UnitID;
  player: number;
  effects: IGameEffect[];
  addEffect(effect: IGameEffect): IAction;
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
  addEffect(effect: IGameEffect): Action {
    this.effects.push(effect);
    return this;
  }
}
