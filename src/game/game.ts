import { IBoard } from "../board/board";
import { IPlayer, Player } from "./player";
import * as boardLayouts from "../board/Layouts";
import * as CoinCollections from "../coin/collections";
import { IGameEffect } from "./gameEffect";
import { PlayableID } from "../unit/unit";
import { IMemoizedPlayable } from "../unit/memoizablePlayable";
import { IAction } from "./action";

export interface IGame {
  get board(): IBoard;
  get players(): IPlayer[];
  get box(): CoinCollections.ICoinCollection;
  resolveAction(action: IAction): void;
  addPlayable(id: PlayableID, memo: IMemoizedPlayable): void;
}
export class Game implements IGame {
  board: IBoard = new boardLayouts.Vanilla();
  players: IPlayer[] = [];
  box: CoinCollections.ICoinCollection = CoinCollections.Box;
  private playables: Record<PlayableID, IMemoizedPlayable> = {};

  addPlayable(id: PlayableID, memo: IMemoizedPlayable) {
    this.playables[id] = memo;
  }

  playable(id: PlayableID): IMemoizedPlayable {
    return this.playables[id]!;
  }

  private constructor() {
    //FIXME variable player count.
    this.players.push(new Player(0));
    this.players.push(new Player(1));
  }

  private static _instance: Game;

  static get instance(): Game {
    if (!this._instance) this._instance = new Game();
    return this._instance;
  }

  resolveAction(action: IAction): void {
    action.effects.forEach((effect: IGameEffect) => {
      let effectResults = effect.execute(this);
    });
  }
}
