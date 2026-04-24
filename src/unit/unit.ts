import { IBoard } from "../board/board";
import { ICoordinate } from "../board/coordinate";
import { Action, IAction } from "./action";

interface IPlayable {
  unitActionsAvailable(board: IBoard): IAction[];
}

export abstract class Unit implements IPlayable {
  board_locations: ICoordinate[] = [];
  team: number;

  constructor(team: number) {
    this.team = team;
  }

  unitActionsAvailable(board: IBoard): IAction[] {
    return ([] as IAction[])
      .concat(this.moveOptions(board))
      .concat(this.attackOptions(board))
      .concat(this.controlOptions(board))
      .concat(this.tacticOptions(board));
  }

  moveOptions(board: IBoard): IAction[] {
    return this.board_locations
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
            new Action("vanilla.move").move(location, destination),
          ),
      )
      .flat();
  }

  attackOptions(board: IBoard): IAction[] {
    return this.board_locations
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
            new Action("vanilla.attack").damage(destination, 1),
          ),
      )
      .flat();
  }

  abstract tacticOptions(board: IBoard): IAction[];

  controlOptions(board: IBoard): IAction[] {
    return this.board_locations
      .filter((spot_coord: ICoordinate) => {
        let hex = board.getHex(spot_coord);
        return hex.is("controllable") && hex.is("controlledBy") != this.team;
      })
      .map((destination: ICoordinate) =>
        new Action("vanilla.control").control(destination, this.team),
      );
  }
}

class RoyalCoin implements IPlayable {
  unitActionsAvailable(board: IBoard): Action[] {
    let actions: Action[] = [];
    return actions;
  }
}
