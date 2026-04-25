import { IBoard } from "../board/board";
import { ICoordinate } from "../board/coordinate";
import { HexFlag } from "../board/hex";
import { ISubscription } from "../game/eventBus";
import { Action, IAction } from "../game/action";
import { IPlayer } from "../game/player";

export type UnitID = `${string}.${string}`;
type PlayableID = UnitID | "vanilla.royal_coin";

export interface IPlayable {
  unitActionsAvailable(board: IBoard): IAction[];
  get team(): number;
  get player(): IPlayer;
  id: PlayableID;
}

abstract class Playable implements IPlayable {
  player: IPlayer;
  get team(): number {
    return this.player.team;
  }
  constructor(player: IPlayer) {
    this.player = player;
    this.initializeListeners();
  }
  abstract id: PlayableID;
  abstract unitActionsAvailable(board: IBoard): IAction[];
  abstract initializeListeners(): void;
}

export abstract class Unit extends Playable {
  subscriptions: ISubscription[] = [];
  boardLocations: ICoordinate[] = [];

  unitActionsAvailable(board: IBoard): IAction[] {
    return ([] as IAction[])
      .concat(this.moveOptions(board))
      .concat(this.attackOptions(board))
      .concat(this.controlOptions(board))
      .concat(this.tacticOptions(board));
  }

  moveOptions(board: IBoard): IAction[] {
    return this.boardLocations
      .map(
        (location: ICoordinate) =>
          location
            .neighbors()
            .filter((neighbor_coord: ICoordinate) =>
              board.inBoard(neighbor_coord),
            )
            .filter(
              (neighbor_coord: ICoordinate) =>
                board.getHex(neighbor_coord).coinStack.size == 0,
            )
            .map(
              (destination: ICoordinate) => new Action(this, "vanilla.move"),
            ), //FIXME MOVE
      )
      .flat();
  }

  attackOptions(board: IBoard): IAction[] {
    return this.boardLocations
      .map(
        (location: ICoordinate) =>
          location
            .neighbors()
            .filter((neighbor_coord: ICoordinate) =>
              board.inBoard(neighbor_coord),
            )
            .filter((neighbor_coord: ICoordinate) => {
              let hex = board.getHex(neighbor_coord);
              return (
                hex.coinStack.size != 0 &&
                hex.coinStack.getCoin().team != this.team
              );
            })
            .map(
              (destination: ICoordinate) => new Action(this, "vanilla.attack"),
            ), //FIXME ATTACK
      )
      .flat();
  }

  tacticOptions(board: IBoard): IAction[] {
    return [];
  }

  controlOptions(board: IBoard): IAction[] {
    return this.boardLocations
      .filter((spot_coord: ICoordinate) => {
        let hex = board.getHex(spot_coord);
        return (
          hex.is(HexFlag.Controllable) &&
          hex.is(HexFlag.ControlledBy, this.team)
        );
      })
      .map((destination: ICoordinate) => new Action(this, "vanilla.control")); //FIXME CONTROL
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
