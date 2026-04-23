import { Coin, ICoin } from "../coin";
import {
  CoinCollection,
  emptyCollectionError,
  ICoinCollection,
  ICoinStack,
  outOfBoundsCollectionError,
} from "./coinCollection";

export default class CoinStack extends CoinCollection implements ICoinStack {
  private _top_stack: CoinStack | undefined;
  private parent_stack: CoinStack | undefined;
  get substackCount(): number {
    return 1 + (this._top_stack ? this._top_stack.substackCount : 0);
  }

  getSubstack(idx: number = 0): CoinStack {
    if (idx < 0) idx += this.size;
    if (this.substackCount < idx + 1) {
      throw new Error(`Substack index ${idx} out of bounds.`);
    }
    if (idx == 0) return this;
    return this._top_stack!.getSubstack(idx - 1);
  }

  get size(): number {
    return this.coins.length + (this._top_stack ? this._top_stack.size : 0);
  }

  getCoin(idx?: number): ICoin {
    if (this.size == 0) throw emptyCollectionError;
    if (idx == undefined) idx = this.size - 1;
    if (idx < 0) idx += this.size;
    if (idx < this.coins.length) return this.coins[idx]!;
    if (this._top_stack == undefined) {
      throw outOfBoundsCollectionError(idx);
    }
    return this._top_stack!.getCoin(idx - this.coins.length)!;
  }

  protected removeCoin(idx?: number): ICoin {
    if (this.size == 0) throw emptyCollectionError;
    if (idx == undefined) idx = this.size - 1;
    if (idx < 0) idx += this.size;
    if (idx < this.coins.length) {
      let coin: ICoin = this.coins.splice(idx, 1).at(0)!;
      if (this.coins.length == 0) {
        if (this.parent_stack != undefined)
          this.parent_stack._top_stack = undefined;
      }
      return coin;
    }
    if (this._top_stack == undefined) {
      throw outOfBoundsCollectionError(idx);
    }
    return this._top_stack.removeCoin(idx - this.coins.length);
  }

  addCoin(coin: ICoin, idx?: number): void {
    if (idx != null) {
      if (idx < this.coins.length) {
        this.coins.splice(idx, 0, coin);
        return;
      }
      if (this._top_stack == undefined) {
        throw outOfBoundsCollectionError(idx);
      }
      return this._top_stack.addCoin(coin, idx - this.coins.length)!;
    }
    if (this._top_stack == undefined) {
      if (this.size == 0 || this.coins.at(-1)!.id == coin.id) {
        this.coins.push(coin);
      } else {
        this._top_stack = new CoinStack();
        this._top_stack.parent_stack = this;
        this._top_stack.addCoin(coin);
      }
    } else this._top_stack.addCoin(coin);
  }

  moveTo(destination: CoinStack, depth?: number): void {
    if (depth != undefined) {
      depth = this.substackCount - depth;
    }
    let movingStack = this.getSubstack(depth);
    destination.addStack(movingStack);
  }

  private copyStackTo(destination: CoinStack) {
    while (this.size > 0) this.transferCoin(destination);
  }

  addStack(other: CoinStack): void {
    if (this._top_stack == undefined) {
      if (
        this.coins.length == 0 ||
        this.getCoin(-1)!.id == other.getCoin(-1)!.id
      ) {
        other.copyStackTo(this);
        return;
      }
      if (other.parent_stack != undefined) {
        this._top_stack = other;
        other.parent_stack._top_stack = undefined;
        other.parent_stack = this;
        return;
      }
      this._top_stack = new CoinStack();
      other.copyStackTo(this);
      return;
    }
    this._top_stack.addStack(other);
  }

  toString(): string {
    return (
      this.coins.join(",") +
      (this._top_stack ? `,(${this._top_stack.toString()})` : "")
    );
  }
}
