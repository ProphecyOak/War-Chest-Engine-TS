import { IPlayable, UnitID } from "../unit/unit";
import { UnitEvent } from "../unit/unitEvents";
import { IGameEffect } from "./gameEffect";

type FaceDownAction = "pass" | "initiative" | "recruit";
type FaceUpAction = "move" | "attack" | "tactic" | "control";

type ActionName = `${string}.${FaceDownAction | FaceUpAction}`;

export interface IAction {
  name: ActionName;
  actor: UnitID;
  player: number;
  effects: { effect: IGameEffect; event: UnitEvent }[];
  addEffect(effect: IGameEffect, event?: UnitEvent): IAction;
}

export class Action implements IAction {
  name: ActionName;
  actor: UnitID;
  player: number;
  effects: { effect: IGameEffect; event: UnitEvent }[] = [];

  constructor(actor: IPlayable, name: ActionName) {
    this.player = actor.team;
    this.actor = actor.id;
    this.name = name;
  }
  addEffect(effect: IGameEffect, event: UnitEvent): Action {
    this.effects.push({ effect, event });
    return this;
  }
}
