import { expect, test } from "@jest/globals";
import * as CoinCollections from "../src/coin/collections";
import { Coin, ICoin } from "../src/coin/coin";

describe("Coin", () => {
  let myCoin: ICoin;
  test("init Coin.", () => {
    myCoin = new Coin("vanilla.pikeman", 0);
    expect(myCoin.id).toEqual("vanilla.pikeman");
    expect(myCoin.team).toEqual(0);
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
    myPile.addCoin(new Coin("vanilla.pikeman", 0));
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

  test("addCoin (multiple).", () => {
    myPile.addCoin(new Coin("vanilla.pikeman", 0));
    myPile.addCoin(new Coin("vanilla.swordsman", 0));
    myPile.addCoin(new Coin("vanilla.swordsman", 0));
    expect(myPile.size).toEqual(3);
    expect(myPile.getCoin(0).id).toEqual("vanilla.pikeman");
    expect(myPile.getCoin(1).id).toEqual("vanilla.swordsman");
    expect(myPile.getCoin(2).id).toEqual("vanilla.swordsman");
  });
}

describe("Coin Pile", () => {
  testCollection(() => new CoinCollections.Pile(), "Coin Pile");
});

describe("Coin Stack", () => {
  testCollection(() => new CoinCollections.Stack(), "Coin Stack");

  let myStack: CoinCollections.ICoinStack = new CoinCollections.Stack();
  test("getSubstack", () => {
    myStack.addCoin(new Coin("vanilla.pikeman", 0));
    myStack.addCoin(new Coin("vanilla.swordsman", 0));
    myStack.addCoin(new Coin("vanilla.swordsman", 0));
    expect(myStack.getSubstack(0).size).toEqual(3);
    expect(myStack.getSubstack(1).size).toEqual(2);
  });

  let secondStack: CoinCollections.ICoinStack = new CoinCollections.Stack();

  test("addStack (null-null)", () => {
    let thirdStack: CoinCollections.ICoinStack = new CoinCollections.Stack();
    secondStack.addStack(thirdStack);
    expect(secondStack.size).toEqual(0);
    expect(() => secondStack.getSubstack(1)).toThrow(Error);
  });

  test("addStack (null)", () => {
    secondStack.addStack(myStack.getSubstack(1));
    expect(secondStack.size).toEqual(2);
  });

  test("addStack (unlike)", () => {
    expect(myStack.size).toEqual(1);
    secondStack.addStack(myStack);
    expect(secondStack.size).toEqual(3);
  });

  test("addStack (like)", () => {
    let thirdStack: CoinCollections.ICoinStack = new CoinCollections.Stack();
    thirdStack.addCoin(new Coin("vanilla.pikeman", 0));
    secondStack.addStack(thirdStack);
    expect(secondStack.size).toEqual(4);
    expect(secondStack.getSubstack(0).size).toEqual(4);
    expect(secondStack.getSubstack(1).size).toEqual(2);
    expect(() => secondStack.getSubstack(2)).toThrow(Error);
  });

  test("moveTo", () => {
    expect(myStack.size).toEqual(0);
    secondStack.moveTo(myStack, 1);
    expect(myStack.size).toEqual(2);
    expect(secondStack.size).toEqual(2);
  });
});
