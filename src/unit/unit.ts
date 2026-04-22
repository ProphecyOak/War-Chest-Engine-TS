import { IBoard } from "../board/board";
import { ICoordinate } from "../board/coordinate";
import { IHex } from "../board/hex";

type FaceDownAction = "pass" | "initiative" | "recruit";
type FaceUpAction = "move" | "attack" | "tactic" | "control";

interface Action {
  name: FaceDownAction | FaceUpAction;
  targets?: ICoordinate[];
}

interface IPlayable {
  unitActionsAvailable(board: IBoard): Action[];
}

export abstract class Unit implements IPlayable {
  board_locations: ICoordinate[] = [];
  team: number;

  constructor(team: number) {
    this.team = team;
  }

  unitActionsAvailable(board: IBoard): Action[] {
    return ([] as Action[])
      .concat(this.moveOptions(board))
      .concat(this.attackOptions(board))
      .concat(this.controlOptions(board));
  }

  moveOptions(board: IBoard): Action[] {
    return this.board_locations
      .map((location: ICoordinate) => {
        return {
          name: "move",
          targets: location
            .neighbors()
            .filter((neighbor_coord: ICoordinate) =>
              board.in_board(neighbor_coord),
            )
            .filter(
              (neighbor_coord: ICoordinate) =>
                board.getHex(neighbor_coord).coinStack.size == 0,
            ),
        } as Action;
      })
      .filter((action: Action) => action.targets!.length > 0);
  }

  attackOptions(board: IBoard): Action[] {
    return this.board_locations
      .map((location: ICoordinate) => {
        return {
          name: "attack",
          targets: location
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
            }),
        } as Action;
      })
      .filter((action: Action) => action.targets!.length > 0);
  }

  canTactic(board: IBoard): boolean {
    throw new Error("Method not implemented.");
  }

  controlOptions(board: IBoard): Action[] {
    return this.board_locations
      .map((location: ICoordinate) => {
        return {
          name: "control",
          targets: [location].filter((spot_coord: ICoordinate) => {
            let hex = board.getHex(spot_coord);
            return (
              hex.is("controllable") && hex.is("controlledBy") != this.team
            );
          }),
        } as Action;
      })
      .filter((action: Action) => action.targets!.length > 0);
  }
}

class RoyalCoin implements IPlayable {
  unitActionsAvailable(board: IBoard): Action[] {
    let actions: Action[] = [];
    return actions;
  }
}
