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

  describe("Deploy Effect", () => {
    test("deploy piece", () => {
      let destination = new Coordinate(4, 4);
      expect(myGame.board.getHex(destination).inhabitant).toEqual(undefined);

      let deployPikeman = new Action(pikeman, "vanilla.deploy").addEffect(
        new Effect.Deploy(pikeman as Unit, destination),
        {
          type: "vanilla.deploy",
          actor: { id: pikeman.id, stackNumber: 0 },
          target: destination,
        },
      );
      myGame.resolveAction(deployPikeman);
      expect(myGame.board.getHex(destination).inhabitant?.unit).toEqual(
        pikeman,
      );
    });

    test("deploy piece to occupied", () => {
      let destination = new Coordinate(4, 4);
      expect(myGame.board.getHex(destination).inhabitant?.unit).toEqual(
        pikeman,
      );

      let deployPikeman = new Action(pikeman, "vanilla.deploy").addEffect(
        new Effect.Deploy(pikeman as Unit, destination),
        {
          type: "vanilla.deploy",
          actor: { id: pikeman.id, stackNumber: 0 },
          target: destination,
        },
      );
      expect(() => myGame.resolveAction(deployPikeman)).toThrow(/occupied/);
    });
  });

  //   describe("Damage Effect", () => {
  //     test("damage lone piece", () => {
  //       throw new Error("Test not implemented.");
  //     });

  //     test("damage bolstered piece", () => {
  //       throw new Error("Test not implemented.");
  //     });

  //     test("damage bottom stack", () => {
  //       throw new Error("Test not implemented.");
  //     });
  //   });

  //   describe("Control Effect", () => {
  //     test("control controllable space", () => {
  //       throw new Error("Test not implemented.");
  //     });

  //     test("control uncontrollable space", () => {
  //       throw new Error("Test not implemented.");
  //     });
  //   });

  //   describe("Move Effect", () => {
  //     test("move stacked pieces", () => {
  //       throw new Error("Test not implemented.");
  //     });

  //     test("move lower stack", () => {
  //       throw new Error("Test not implemented.");
  //     });

  //     test("split stack", () => {
  //       throw new Error("Test not implemented.");
  //     });
  //   });
});
