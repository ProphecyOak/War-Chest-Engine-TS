import { ICoin } from "./coin";

export interface ICoinCollection {
  get size(): number;
  getCoin(idx?: number): ICoin;
  transferCoin(destination: ICoinCollection, idx?: number): ICoin;
  addCoin(coin: ICoin, idx?: number): void;
}

export class CoinCollection implements ICoinCollection {
  protected coins: ICoin[] = [];

  get size(): number {
    return this.coins.length;
  }

  getCoin(idx?: number): ICoin {
    if (this.size == 0) {
      throw new Error("No coins in this stack.");
    }
    if (idx != null) {
      if (this.coins[idx] == undefined) {
        throw new Error(`Index ${idx} out of range on coin stack.`);
      }
      return this.coins[idx]!;
    } else {
      return this.coins.at(-1)!;
    }
  }

  private removeCoin(idx?: number): ICoin {
    if (this.size == 0) {
      throw new Error("No coins in this stack.");
    }
    if (idx != null) {
      return this.coins.splice(idx, 1)[0]!;
    } else {
      return this.coins.pop()!;
    }
  }

  addCoin(coin: ICoin, idx?: number): void {
    if (idx != null) {
      this.coins.splice(idx, 0, coin);
    } else {
      this.coins.push(coin);
    }
  }

  transferCoin(destination: ICoinCollection, idx?: number): ICoin {
    destination.addCoin(this.getCoin(idx));
    return this.removeCoin(idx);
  }
}

//TODO: MAKE THIS INTO UNIT STACKS AND COIN COLLECTIONS
//  WITH SIMILAR INTERFACE FOR TRANSFERING?
//  OR MAKE IT SO UNIT STACK HAS SIMILAR INTERFACE TO COIN AND CAN BE PLACED IN COLLECTION?

export interface ICoinStack extends ICoinCollection {
  get substackCount(): number;
  getSubstack(idx: number): ICoinCollection;
  moveTo(destination: ICoinStack, depth?: number): void;
  addStack(other: ICoinStack): void;
}

class CoinStack extends CoinCollection implements ICoinStack {
  private _top_stack: ICoinStack | undefined;
  get substackCount(): number {
    return 1 + (this._top_stack ? this._top_stack.substackCount : 0);
  }

  getSubstack(idx: number): ICoinCollection {
    if (idx < 0) idx += this.size;
    if (this.substackCount < idx + 1) {
      throw new Error("Substack index out of bounds.");
    }
    if (idx == 0) return this;
    return this._top_stack!.getSubstack(idx - 1);
  }

  override get size(): number {
    return this.coins.length + (this._top_stack ? this._top_stack.size : 0);
  }

  override getCoin(idx?: number): ICoin {
    if (idx == undefined) idx = this.size - 1;
    if (idx < 0) idx += this.size;
    if (idx < this.coins.length) return this.coins[idx]!;
    if (this._top_stack == undefined) {
      throw new Error("Coin index out of bounds.");
    }
    return this._top_stack!.getCoin(idx - this.coins.length)!;
  }

  override addCoin(coin: ICoin, idx?: number): void {
    if (idx != null) {
      if (idx < this.coins.length) {
        this.coins.splice(idx, 0, coin);
        return;
      }
      if (this._top_stack == undefined) {
        throw new Error("Coin index out of bounds.");
      }
      return this._top_stack!.addCoin(coin, idx - this.coins.length)!;
    }
    if (this._top_stack == undefined) this.coins.push(coin);
    else this._top_stack.addCoin(coin);
  }

  moveTo(destination: ICoinStack, depth?: number): void {
    if (destination.size >= 1) {
      destination.addStack(this);
    }
  }

  addStack(other: ICoinStack): void {
    if (this._top_stack == undefined) {
      if (this.getCoin(-1)!.id != other.getCoin(-1)!.id) {
        this._top_stack = other;
        return;
      }
      while (other.size > 0) other.transferCoin(this);
      return;
    }
    this._top_stack.addStack(other);
  }
}
