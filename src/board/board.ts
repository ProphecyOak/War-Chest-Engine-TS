import { ICoordinate } from "./coordinate";
import { IHex } from "./hex";

interface IBoard {
  getHex(coord: ICoordinate): IHex;
}

export abstract class Board implements IBoard {
  private _hexes: IHex[][] = [];

  private get _width(): number {
    if (this._height == 0) return 0;
    return this._hexes.at(0)!.length;
  }

  private get _height(): number {
    return this._hexes.length;
  }

  getHex(coord: ICoordinate): IHex {
    if (coord.q < 0 || coord.q >= this._height) {
      throw new Error(`q coordinate ${coord.q} out of board-bounding range.`);
    }
    if (coord.r < 0 || coord.r >= this._width) {
      throw new Error(`r coordinate ${coord.r} out of board-bounding range.`);
    }
    if (!this.in_board(coord)) {
      throw new Error(`Location ${coord} not part of board.`);
    }
    return this._hexes.at(coord.q)!
    .at(coord.r)!;
  }

  abstract in_board(coord: ICoordinate): boolean;
}