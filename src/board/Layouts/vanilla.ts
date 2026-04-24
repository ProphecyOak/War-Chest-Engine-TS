import { Board } from "../board";
import { Coordinate, ICoordinate } from "../coordinate";
import { Hex, HexFlag, IHex } from "../hex";

export default class Vanilla extends Board {
  protected _hexes: (IHex | null)[][];

  constructor() {
    super();
    this._hexes = [];
    for (let q = 0; q < 7; q++) {
      this._hexes.push([]);
      for (let r = 0; r < 7; r++) {
        let thisHexInBoard = this.inBoard(new Coordinate(q, r));
        this._hexes.at(-1)!.push(thisHexInBoard ? new Hex() : null);
      }
    }
    [
      new Coordinate(5, 0),
      new Coordinate(6, 1),
      new Coordinate(3, 1),
      new Coordinate(1, 2),
      new Coordinate(4, 2),
      new Coordinate(2, 4),
      new Coordinate(5, 4),
      new Coordinate(0, 5),
      new Coordinate(3, 5),
      new Coordinate(1, 6),
    ].forEach((coord: ICoordinate) =>
      this.getHex(coord).set(HexFlag.Controllable, 1),
    );
  }

  inBoard(coord: ICoordinate): boolean {
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
