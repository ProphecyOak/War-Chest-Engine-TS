import { describe, expect, test } from "@jest/globals";
import * as boardLayouts from "../src/board/Layouts";
import { Board } from "../src/board/board";
import { Coordinate } from "../src/board/coordinate";
import { red } from "./format";
import { HexFlag } from "../src/board/hex";

describe("Board", () => {
  let myBoard: Board;
  test("init Vanilla Board.", () => {
    myBoard = new boardLayouts.Vanilla();
    let out = "";
    for (let q = 0; q < 7; q++) {
      for (let r = 0; r < 7; r++) {
        let coord = new Coordinate(q, r);
        out += myBoard.inBoard(coord)
          ? (myBoard.getHex(coord).is(HexFlag.Controllable)
              ? red
              : (x: string) => x)("O")
          : " ";
      }
      out += "\n";
    }
    console.log(out);
  });

  test("", () => {});
});
