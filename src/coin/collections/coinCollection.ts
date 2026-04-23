import { ICoin } from "../coin";

export interface ICoinCollection {
  get size(): number;
  getCoin(idx?: number): ICoin;
  transferCoin(destination: ICoinCollection, idx?: number): ICoin;
  addCoin(coin: ICoin, idx?: number): void;
}

export abstract class CoinCollection implements ICoinCollection {
  protected coins: ICoin[] = [];
  abstract get size(): number;

  abstract getCoin(idx?: number): ICoin;
  abstract addCoin(coin: ICoin, idx?: number): void;
  protected abstract removeCoin(idx?: number): ICoin;

  transferCoin(destination: ICoinCollection, idx?: number): ICoin {
    destination.addCoin(this.getCoin(idx));
    return this.removeCoin(idx);
  }

  abstract toString(): string;
}

export interface ICoinStack extends ICoinCollection {
  get substackCount(): number;
  getSubstack(idx: number): ICoinStack;
  moveTo(destination: ICoinStack, depth?: number): void;
  addStack(other: ICoinStack): void;
}

export const emptyCollectionError = new Error("No coins in this collection.");
export function outOfBoundsCollectionError(idx: number) {
  return new Error(`Index ${idx} out of bounds on coin collection.`);
}
