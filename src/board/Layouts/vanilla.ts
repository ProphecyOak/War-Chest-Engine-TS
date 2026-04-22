import { Board } from "../board";
import { Coordinate, ICoordinate } from "../coordinate";
import { Hex, IHex } from "../hex";

export default class Vanilla extends Board {
  protected _hexes: (IHex | null)[][];

  constructor() {
    super();
    this._hexes = [];
    for (let q = 0; q < 7; q++) {
      this._hexes.push([]);
      for (let r = 0; r < 7; r++) {
        let thisHexInBoard = this.in_board(new Coordinate(q, r));
        this._hexes.at(-1)!.push(thisHexInBoard ? new Hex() : null);
      }
    }
    [new Coordinate(4, 4)].forEach((coord: ICoordinate) =>
      this.getHex(coord).set("controllable", 1),
    );
  }

  in_board(coord: ICoordinate): boolean {
    return (
      coord.q >= 0 &&
      coord.q < 7 &&
      coord.r >= 0 &&
      coord.r < 7 &&
      coord.s <= -3 &&
      coord.s > -10
    );
  }
}
