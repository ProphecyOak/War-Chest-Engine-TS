import { ICoin } from "../coin";
import {
  CoinCollection,
  emptyCollectionError,
  ICoinStack,
  outOfBoundsCollectionError,
} from "./coinCollection";

export default class CoinStack extends CoinCollection implements ICoinStack {
  private above: CoinStack | undefined;
  private below: CoinStack | undefined;

  get isRoot(): boolean {
    return this.below == undefined;
  }

  get isTop(): boolean {
    return this.above == undefined;
  }

  get size(): number {
    return this.coins.length + (this.above?.size ?? 0);
  }

  getCoin(idx?: number): ICoin {
    if (idx == undefined) idx = this.size - 1; //Set to last element if needed
    if (idx < 0) idx += this.size; //Make positive if needed
    if (idx >= this.size) throw emptyCollectionError;
    if (idx < 0) throw outOfBoundsCollectionError;
    return this.getHelper(idx);
  }

  private getHelper(idx: number): ICoin {
    if (idx < this.coins.length) return this.coins.at(idx)!;
    if (this.isTop) throw outOfBoundsCollectionError;
    return this.above!.getHelper(idx - this.coins.length);
  }

  addCoin(coin: ICoin, idx?: number): void {
    if (idx == undefined) idx = this.size - 1;
    if (idx < 0) idx += this.size;
    if (idx > this.size) throw outOfBoundsCollectionError;
    this.addHelper(coin, idx);
  }

  private addHelper(coin: ICoin, idx: number) {
    if (idx < this.coins.length) return this.coins.splice(idx, 0, coin);
    if (this.isTop) throw outOfBoundsCollectionError;
    //FIXME CoinStack.addHelper
  }

  protected removeCoin(idx?: number): ICoin {
    //TODO CoinStack.removeCoin
    throw new Error("Method not implemented.");
  }

  stackSlice(idx: number, size?: number): ICoinStack {
    //TODO CoinStack.stackSlice
    throw new Error("Method not implemented.");
  }

  coinSlice(idx: number, size?: number): CoinCollection {
    //TODO CoinStack.coinSlice
    throw new Error("Method not implemented.");
  }

  toString(): string {
    return (
      this.coins.join(",") + (this.above ? `,(${this.above.toString()})` : "")
    );
  }
}
