import { IBoard } from "../board/board";
import { IPlayer, Player } from "./player";
import * as boardLayouts from "../board/Layouts";
import * as CoinCollections from "../coin/collections";
import { IAction } from "./action";
import { IGameEffect } from "./gameEffect";
import { UnitEvent, UnitEventBus } from "../unit/unitEvents";

export interface IGame {
  get board(): IBoard;
  get players(): IPlayer[];
  get box(): CoinCollections.ICoinCollection;
  resolveAction(action: IAction): void;
}
export class Game implements IGame {
  board: IBoard = new boardLayouts.Vanilla();
  players: IPlayer[] = [];
  box: CoinCollections.ICoinCollection = CoinCollections.Box;

  constructor() {
    //FIXME variable player count.
    this.players.push(new Player(0));
    this.players.push(new Player(1));
  }

  resolveAction(action: IAction): void {
    action.effects.forEach(
      (value: { effect: IGameEffect; event?: UnitEvent }) => {
        value.effect.execute(this);
        if (value.event) UnitEventBus.instance.fire(value.event);
      },
    );
  }
}
