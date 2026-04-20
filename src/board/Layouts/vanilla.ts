import { Board } from "../board";
import { ICoordinate } from "../coordinate";

export class Vanilla extends Board {
  in_board(coord: ICoordinate): boolean {
    throw new Error("Method not implemented.");
  }
}
