import { describe, expect, test } from "@jest/globals";
import * as CoinCollections from "../src/coin/collections";
import { Coin, ICoin } from "../src/coin/coin";
import { Game } from "../src/game/game";
import * as Units from "../src/unit/Units";

describe("Coin", () => {
  let myCoin: ICoin;
  test("init Coin.", () => {
    myCoin = new Coin("vanilla.pikeman");
    expect(myCoin.id).toEqual("vanilla.pikeman");
  });

  test("flipFacedown, flipFaceup.", () => {
    expect(myCoin.faceup).toEqual(true);
    myCoin.flipFacedown();
    expect(myCoin.faceup).toEqual(false);
    myCoin.flipFaceup();
    expect(myCoin.faceup).toEqual(true);
  });
});

function testCollection(
  collectionCreator: () => CoinCollections.ICoinCollection,
  collectionType: string,
) {
  let myPile: CoinCollections.ICoinCollection;
  test(`init ${collectionType}.`, () => {
    myPile = collectionCreator();
    expect(myPile.size).toEqual(0);
    expect(() => myPile.getCoin()).toThrow(/No coins/);
  });

  test("addCoin", () => {
    myPile.addCoin(new Coin("vanilla.pikeman"));
    expect(myPile.getCoin().id).toEqual("vanilla.pikeman");
    expect(myPile.size).toEqual(1);
    expect(() => myPile.getCoin(1)).toThrow(/out of bounds/);
  });

  let secondPile: CoinCollections.ICoinCollection = collectionCreator();
  test("transferCoin.", () => {
    myPile.transferCoin(secondPile);
    expect(myPile.size).toEqual(0);
    expect(secondPile.size).toEqual(1);
    expect(secondPile.getCoin().id).toEqual("vanilla.pikeman");
  });
}

describe("Coin Pile", () => {
  let piles: CoinCollections.Pile[] = [];
  function pileCreator(): CoinCollections.Pile {
    piles.push(new CoinCollections.Pile());
    return piles.at(-1)!;
  }
  testCollection(pileCreator, "Coin Pile");

  test("addCoin (multiple).", () => {
    let myPile = pileCreator();
    myPile.addCoin(new Coin("vanilla.pikeman"));
    myPile.addCoin(new Coin("vanilla.swordsman"));
    myPile.addCoin(new Coin("vanilla.swordsman"));
    expect(myPile.size).toEqual(3);
    expect(myPile.getCoin(0).id).toEqual("vanilla.pikeman");
    expect(myPile.getCoin(1).id).toEqual("vanilla.swordsman");
    expect(myPile.getCoin(2).id).toEqual("vanilla.swordsman");
  });
});

describe("Coin Stack", () => {
  testCollection(
    () => new CoinCollections.Stack("vanilla.pikeman"),
    "Coin Stack",
  );
});
