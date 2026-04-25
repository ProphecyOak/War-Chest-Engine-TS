import { describe, expect, test } from "@jest/globals";
import * as boardLayouts from "../src/board/Layouts";
import * as Units from "../src/unit/Units";
import { Board } from "../src/board/board";
import { HexFlag } from "../src/board/hex";
import { Coordinate, ICoordinate } from "../src/board/coordinate";
import { Game } from "../src/game/game";
import { Coin } from "../src/coin/coin";
import { Action, IAction } from "../src/game/action";
import { Player } from "../src/game/player";
import { Effect } from "../src/game/gameEffect";

describe("Board", () => {
  let myBoard: Board;
  test("init Vanilla Board.", () => {
    myBoard = new boardLayouts.Vanilla();
  });

  test("inBoard", () => {
    expect(myBoard.inBoard(new Coordinate(0, 0))).toEqual(false);
    for (let q = 3; q < 7; q++)
      expect(myBoard.inBoard(new Coordinate(q, 0))).toEqual(true);
    for (let r = 3; r < 7; r++)
      expect(myBoard.inBoard(new Coordinate(0, r))).toEqual(true);
  });

  test("getHex", () => {
    expect(() => myBoard.getHex(new Coordinate(0, 0))).toThrow(
      /not part of board/,
    );
    expect(
      myBoard.getHex(new Coordinate(3, 3)).is(HexFlag.Controllable),
    ).toEqual(false);
    expect(
      myBoard.getHex(new Coordinate(4, 2)).is(HexFlag.Controllable),
    ).toEqual(true);
  });
});

describe("Effects", () => {
  let myGame = new Game();

  let myPikeman = new Units.Vanilla.Pikeman(myGame.players.at(0)!);
  let pikemanLocation: ICoordinate = new Coordinate(4, 4);
  myGame.board
    .getHex(pikemanLocation)
    .coinStack.addCoin(new Coin("vanilla.pikeman", 0));

  let mySwordsman = new Units.Vanilla.Swordsman(myGame.players.at(0)!);
  let swordsmanLocation: ICoordinate = new Coordinate(3, 4);
  myGame.board
    .getHex(swordsmanLocation)
    .coinStack.addCoin(new Coin("vanilla.swordsman", 0));

  test("damage lone piece", () => {
    expect(myGame.board.getHex(pikemanLocation).coinStack.size).toEqual(1);
    let damageLone: IAction = new Action(mySwordsman, "vanilla.attack");
    damageLone.addEffect(new Effect.Damage(pikemanLocation, 1), {
      type: "vanilla.attack",
      actor: "vanilla.swordsman",
      target: "vanilla.pikeman",
    });
    myGame.resolveAction(damageLone);
    expect(myGame.board.getHex(pikemanLocation).coinStack.size).toEqual(0);
  });
});
