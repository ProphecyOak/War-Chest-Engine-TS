import { Coin, ICoin } from "../coin";
import {
  CoinCollection,
  emptyCollectionError,
  ICoinCollection,
  ICoinStack,
  outOfBoundsCollectionError,
} from "./coinCollection";

export default class CoinStack extends CoinCollection implements ICoinStack {
  private topStack: CoinStack | undefined;
  private parent_stack: CoinStack | undefined;
  get substackCount(): number {
    return 1 + (this.topStack?.substackCount ?? 0);
  }

  /**
   *
   * @param idx 0-indexed starting from this stack up
   * @returns CoinStack at the index
   */
  stackFromBottom(idx: number): CoinStack {
    if (idx < 0) idx += this.size;
    if (this.substackCount < idx + 1) {
      throw new Error(`Substack index ${idx} out of bounds.`);
    }
    if (idx == 0) return this;
    return this.topStack!.stackFromBottom(idx - 1);
  }

  get size(): number {
    return this.coins.length + (this.topStack?.size ?? 0);
  }

  getCoin(idx?: number): ICoin {
    if (this.size == 0) throw emptyCollectionError;
    if (idx == undefined) idx = this.size - 1;
    if (idx < 0) idx += this.size;
    if (idx < this.coins.length) return this.coins[idx]!;
    if (this.topStack == undefined) {
      throw outOfBoundsCollectionError(idx);
    }
    return this.topStack!.getCoin(idx - this.coins.length)!;
  }

  protected removeCoin(idx?: number): ICoin {
    if (this.size == 0) throw emptyCollectionError;
    if (idx == undefined) idx = this.size - 1;
    if (idx < 0) idx += this.size;
    if (idx < this.coins.length) {
      let coin: ICoin = this.coins.splice(idx, 1).at(0)!;
      if (this.coins.length == 0) {
        if (this.parent_stack != undefined)
          this.parent_stack.topStack = undefined;
      }
      return coin;
    }
    if (this.topStack == undefined) {
      throw outOfBoundsCollectionError(idx);
    }
    return this.topStack.removeCoin(idx - this.coins.length);
  }

  addCoin(coin: ICoin, idx?: number): void {
    if (idx != null) {
      if (idx < this.coins.length) {
        this.coins.splice(idx, 0, coin);
        return;
      }
      if (this.topStack == undefined) {
        throw outOfBoundsCollectionError(idx);
      }
      return this.topStack.addCoin(coin, idx - this.coins.length)!;
    }
    if (this.topStack == undefined) {
      if (this.size == 0 || this.coins.at(-1)!.id == coin.id) {
        this.coins.push(coin);
      } else {
        this.topStack = new CoinStack();
        this.topStack.parent_stack = this;
        this.topStack.addCoin(coin);
      }
    } else this.topStack.addCoin(coin);
  }

  /**
   *
   * @param destination other stack to move to.
   */
  moveTo(destination: ICoinStack): void {
    destination.addStack(this);
  }

  private copyStackTo(destination: CoinStack) {
    while (this.size > 0) this.transferCoin(destination, 0);
  }

  addStack(other: CoinStack): void {
    if (this.topStack == undefined) {
      if (
        this.coins.length == 0 ||
        other.coins.length == 0 ||
        this.getCoin(-1)!.id == other.getCoin(0)!.id
      ) {
        other.copyStackTo(this);
        return;
      }
      if (other.parent_stack != undefined) {
        this.topStack = other;
        other.parent_stack.topStack = undefined;
        other.parent_stack = this;
        return;
      }
      this.topStack = new CoinStack();
      this.topStack.parent_stack = this;
      other.copyStackTo(this);
      return;
    }
    this.topStack.addStack(other);
  }

  toString(): string {
    return (
      this.coins.join(",") +
      (this.topStack ? `,(${this.topStack.toString()})` : "")
    );
  }
}
