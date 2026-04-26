import { IBoard } from "../board/board";
import { ICoordinate } from "../board/coordinate";
import { HexFlag } from "../board/hex";
import { ISubscription } from "../game/eventBus";
import { Action, IAction } from "../game/action";
import { IPlayer } from "../game/player";

export type UnitID = `${string}.${string}`;
export type PlayableID = UnitID | "vanilla.royal_coin";

export interface IPlayable {
  unitActionsAvailable(board: IBoard): IAction[];
  get team(): number;
  get player(): IPlayer;
  get id(): PlayableID;
}

abstract class Playable implements IPlayable {
  player: IPlayer;
  get team(): number {
    return this.player.team;
  }
  subscriptions: ISubscription[] = [];

  constructor(player: IPlayer) {
    this.player = player;
    this.initializeListeners();
  }
  abstract id: PlayableID;
  abstract unitActionsAvailable(board: IBoard): IAction[];
  abstract initializeListeners(): void;
}

export abstract class Unit extends Playable {
  boardLocations: ICoordinate[] = [];

  unitActionsAvailable(board: IBoard): IAction[] {
    return ([] as IAction[])
      .concat(this.moveOptions(board))
      .concat(this.attackOptions(board))
      .concat(this.controlOptions(board))
      .concat(this.tacticOptions(board));
  }

  moveOptions(board: IBoard): IAction[] {
    throw new Error("Method Not Implemented.");
  }

  attackOptions(board: IBoard): IAction[] {
    throw new Error("Method Not Implemented.");
  }

  tacticOptions(board: IBoard): IAction[] {
    return [];
  }

  controlOptions(board: IBoard): IAction[] {
    throw new Error("Method Not Implemented.");
  }
}

class RoyalCoin extends Playable {
  id: PlayableID = "vanilla.royalCoin";
  initializeListeners(): void {}
  unitActionsAvailable(board: IBoard): Action[] {
    let actions: Action[] = [];
    return actions;
  }
}
