import { describe, expect, test } from "@jest/globals";
import * as boardLayouts from "../src/board/Layouts";
import * as Units from "../src/unit/Units";
import { Board } from "../src/board/board";
import { HexFlag } from "../src/board/hex";
import { Coordinate } from "../src/board/coordinate";
import { Game } from "../src/game/game";
import { Action, IAction } from "../src/game/action";
import { Effect } from "../src/game/gameEffect";
import { Unit } from "../src/unit/unit";

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

  test("control spots", () => {
    let wolfHex = myBoard.getHex(new Coordinate(5, 0));
    expect(wolfHex.is(HexFlag.Controllable)).toEqual(true);
    expect(wolfHex.is(HexFlag.ControlledBy, 0)).toEqual(true);

    let ravenHex = myBoard.getHex(new Coordinate(1, 6));
    expect(ravenHex.is(HexFlag.Controllable)).toEqual(true);
    expect(ravenHex.is(HexFlag.ControlledBy, 1)).toEqual(true);

    let neutralHex = myBoard.getHex(new Coordinate(4, 4));
    expect(neutralHex.is(HexFlag.Controllable)).toEqual(false);
    expect(neutralHex.is(HexFlag.ControlledBy, -1)).toEqual(true);
  });
});

describe("Effects", () => {
  let myGame = Game.instance;
  myGame.addPlayable("vanilla.pikeman", Units.Vanilla.Pikeman);
  let pikeman = myGame.playable("vanilla.pikeman").of(myGame.players[0]);
  let pikeman1 = myGame.playable("vanilla.pikeman").of(myGame.players[1]);

  describe("Deploy Effect", () => {
    test("deploy piece", () => {
      let destination = new Coordinate(4, 4);
      let target = myGame.board.getHex(destination);
      expect(target.inhabitant).toEqual(undefined);

      myGame.resolveAction(
        new Action(pikeman, "vanilla.deploy").addEffect(
          new Effect.Deploy(pikeman as Unit, destination),
        ),
      );
      expect(target.inhabitant?.unit).toEqual(pikeman);
      expect(
        target.inhabitant?.unit.stacks.at(target.inhabitant.idx!)?.size,
      ).toEqual(1);
    });

    test("deploy piece to occupied", () => {
      let destination = new Coordinate(4, 4);
      expect(myGame.board.getHex(destination).inhabitant?.unit).toEqual(
        pikeman,
      );

      expect(() =>
        myGame.resolveAction(
          new Action(pikeman, "vanilla.deploy").addEffect(
            new Effect.Deploy(pikeman as Unit, destination),
          ),
        ),
      ).toThrow(/occupied/);
    });

    test("deploy second stack", () => {
      let destination = new Coordinate(4, 5);
      expect(myGame.board.getHex(destination).inhabitant).toEqual(undefined);

      myGame.resolveAction(
        new Action(pikeman, "vanilla.deploy").addEffect(
          new Effect.Deploy(pikeman as Unit, destination),
        ),
      );
      expect(myGame.board.getHex(destination).inhabitant?.unit).toEqual(
        pikeman,
      );
    });
  });

  describe("Bolster Effect", () => {
    test("bolster piece", () => {
      let target = myGame.board.getHex(new Coordinate(4, 4));
      expect(target.inhabitant?.unit).toEqual(pikeman);
      expect(
        target.inhabitant?.unit.stacks.at(target.inhabitant.idx!)?.size,
      ).toEqual(1);
      myGame.resolveAction(
        new Action(pikeman, "vanilla.bolster").addEffect(
          new Effect.Bolster({ unit: pikeman as Unit, stackIdx: 0 }),
        ),
      );
      expect(
        target.inhabitant?.unit.stacks.at(target.inhabitant.idx!)?.size,
      ).toEqual(2);
    });

    test("bolster non-existent piece", () => {
      expect(() =>
        myGame.resolveAction(
          new Action(pikeman, "vanilla.bolster").addEffect(
            new Effect.Bolster({ unit: pikeman as Unit, stackIdx: 20 }),
          ),
        ),
      ).toThrow(/out of range/);
    });
  });

  describe("Control Effect", () => {
    test("control enemy hex", () => {
      let location = new Coordinate(5, 0);
      let target = myGame.board.getHex(location);
      expect(target.is(HexFlag.Controllable)).toEqual(true);
      expect(target.is(HexFlag.ControlledBy, 0)).toEqual(true);
      myGame.resolveAction(
        new Action(pikeman, "vanilla.control").addEffect(
          new Effect.Control(location, { unit: pikeman1 as Unit, stackIdx: 0 }),
        ),
      );
      expect(target.is(HexFlag.ControlledBy, 1)).toEqual(true);
    });

    test("control uncontrollable hex", () => {
      let location = new Coordinate(5, 1);
      let target = myGame.board.getHex(location);
      expect(target.is(HexFlag.Controllable)).toEqual(false);
      expect(() =>
        myGame.resolveAction(
          new Action(pikeman, "vanilla.control").addEffect(
            new Effect.Control(location, {
              unit: pikeman as Unit,
              stackIdx: 0,
            }),
          ),
        ),
      ).toThrow(/uncontrollable/);
    });

    test("control friendly hex", () => {
      let location = new Coordinate(6, 1);
      let target = myGame.board.getHex(location);
      expect(target.is(HexFlag.Controllable)).toEqual(true);
      expect(target.is(HexFlag.ControlledBy, 0)).toEqual(true);
      expect(() =>
        myGame.resolveAction(
          new Action(pikeman, "vanilla.control").addEffect(
            new Effect.Control(location, {
              unit: pikeman as Unit,
              stackIdx: 0,
            }),
          ),
        ),
      ).toThrow(/friendly/);
    });
  });

  describe("Move Effect", () => {
    test("", () => {
      throw new Error("Test Section Not Implemented.");
    });
  });

  describe("Damage Effect", () => {
    test("", () => {
      throw new Error("Test Section Not Implemented.");
    });
  });
});
