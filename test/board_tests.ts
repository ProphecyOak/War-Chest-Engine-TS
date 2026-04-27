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

  let myPikeman = Units.Vanilla.Pikeman.of(myGame.players.at(0)!);
  let pikemanLocation: ICoordinate = new Coordinate(4, 4);
  function addPikeman(
    amount: number = 1,
    location: ICoordinate = pikemanLocation,
  ) {
    for (let i = 0; i < amount; i++)
      myGame.board
        .getHex(location)
        .coinStack.addCoin(new Coin("vanilla.pikeman"));
  }

  let mySwordsman = Units.Vanilla.Swordsman.of(myGame.players.at(1)!);
  let swordsmanLocation: ICoordinate = new Coordinate(3, 4);

  function addSwordsman(
    amount: number = 1,
    location: ICoordinate = swordsmanLocation,
  ) {
    for (let i = 0; i < amount; i++)
      myGame.board
        .getHex(location)
        .coinStack.addCoin(new Coin("vanilla.swordsman"));
  }

  describe("Damage Effect", () => {
    test("damage lone piece", () => {
      let location: ICoordinate = pikemanLocation;
      addPikeman(1);
      expect(myGame.board.getHex(location).coinStack.size).toEqual(1);
      let damageLone: IAction = new Action(mySwordsman, "vanilla.attack");
      damageLone.addEffect(new Effect.Damage(location, 1), {
        type: "vanilla.attack",
        actor: {
          id: myGame.board.getHex(location).coinStack.getCoin().id,
          stackNumber: 0,
        },
        target: { id: "vanilla.pikeman", stackNumber: 0 },
      });
      myGame.resolveAction(damageLone);
      expect(myGame.board.getHex(location).coinStack.size).toEqual(0);
    });

    test("damage bolstered piece", () => {
      let location: ICoordinate = pikemanLocation;
      addPikeman(2);
      expect(myGame.board.getHex(location).coinStack.size).toEqual(2);
      let damageBolstered: IAction = new Action(mySwordsman, "vanilla.attack");
      damageBolstered.addEffect(new Effect.Damage(location, 1), {
        type: "vanilla.attack",
        actor: {
          id: "vanilla.god",
          stackNumber: 0,
        },
        target: { id: "vanilla.pikeman", stackNumber: 0 },
      });
      myGame.resolveAction(damageBolstered);
      expect(myGame.board.getHex(location).coinStack.size).toEqual(1);
    });

    test("damage bottom stack", () => {
      let location: ICoordinate = pikemanLocation;
      expect(myGame.board.getHex(location).coinStack.size).toEqual(1);
      addPikeman(1);
      addSwordsman(1, pikemanLocation);
      expect(myGame.board.getHex(location).coinStack.size).toEqual(3);
      let damageBottom: IAction = new Action(mySwordsman, "vanilla.attack");
      damageBottom.addEffect(new Effect.Damage(location, 1, 1), {
        type: "vanilla.attack",
        actor: {
          id: "vanilla.god",
          stackNumber: 0,
        },
        target: { id: "vanilla.pikeman", stackNumber: 0 },
      });
      myGame.resolveAction(damageBottom);
      expect(myGame.board.getHex(location).coinStack.size).toEqual(2);
    });
  });

  describe("Control Effect", () => {
    test("control controllable space", () => {
      let location = new Coordinate(5, 0);
      let controlControllable: IAction = new Action(
        mySwordsman,
        "vanilla.control",
      );
      controlControllable.addEffect(
        new Effect.Control(location, mySwordsman.team),
        {
          type: "vanilla.control",
          actor: {
            id: "vanilla.god",
            stackNumber: 0,
          },
          target: location,
        },
      );
      myGame.resolveAction(controlControllable);
      expect(
        myGame.board
          .getHex(location)
          .is(HexFlag.ControlledBy, mySwordsman.team),
      ).toEqual(true);
    });

    test("control uncontrollable space", () => {
      let location = new Coordinate(4, 4);
      let controlUncontrollable: IAction = new Action(
        mySwordsman,
        "vanilla.control",
      );
      controlUncontrollable.addEffect(
        new Effect.Control(location, mySwordsman.team),
        {
          type: "vanilla.control",
          actor: {
            id: "vanilla.god",
            stackNumber: 0,
          },
          target: location,
        },
      );
      expect(() => myGame.resolveAction(controlUncontrollable)).toThrow(
        /cannot be controlled/,
      );
    });
  });
});
