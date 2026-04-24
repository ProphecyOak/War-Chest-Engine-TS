import { IBoard } from "../board/board";
import { ICoordinate } from "../board/coordinate";
import { ISubscription } from "../game/eventBus";
import { Action, IAction, UnitID } from "./action";

interface IPlayable {
  unitActionsAvailable(board: IBoard): IAction[];
}

export abstract class Unit implements IPlayable {
  subscriptions: ISubscription[] = [];
  boardLocations: ICoordinate[] = [];
  team: number;
  abstract id: UnitID;

  constructor(team: number) {
    this.team = team;
    this.initializeListeners();
  }

  initializeListeners() {}

  unitActionsAvailable(board: IBoard): IAction[] {
    return ([] as IAction[])
      .concat(this.moveOptions(board))
      .concat(this.attackOptions(board))
      .concat(this.controlOptions(board))
      .concat(this.tacticOptions(board));
  }

  moveOptions(board: IBoard): IAction[] {
    return this.boardLocations
      .map((location: ICoordinate) =>
        location
          .neighbors()
          .filter((neighbor_coord: ICoordinate) =>
            board.in_board(neighbor_coord),
          )
          .filter(
            (neighbor_coord: ICoordinate) =>
              board.getHex(neighbor_coord).coinStack.size == 0,
          )
          .map((destination: ICoordinate) =>
            new Action("vanilla.move", this.id).move(location, destination),
          ),
      )
      .flat();
  }

  attackOptions(board: IBoard): IAction[] {
    return this.boardLocations
      .map((location: ICoordinate) =>
        location
          .neighbors()
          .filter((neighbor_coord: ICoordinate) =>
            board.in_board(neighbor_coord),
          )
          .filter((neighbor_coord: ICoordinate) => {
            let hex = board.getHex(neighbor_coord);
            return (
              hex.coinStack.size != 0 &&
              hex.coinStack.getCoin().team != this.team
            );
          })
          .map((destination: ICoordinate) =>
            new Action("vanilla.attack", this.id).damage(destination, 1),
          ),
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
        return hex.is("controllable") && hex.is("controlledBy") != this.team;
      })
      .map((destination: ICoordinate) =>
        new Action("vanilla.control", this.id).control(destination, this.team),
      );
  }
}

class RoyalCoin implements IPlayable {
  unitActionsAvailable(board: IBoard): Action[] {
    let actions: Action[] = [];
    return actions;
  }
}
