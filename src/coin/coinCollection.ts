import { ICoin } from "./coin";

export interface ICoinCollection {
  get size(): number;
  getCoin(idx?: number): ICoin;
  transferCoin(destination: ICoinCollection, idx?: number): ICoin;
  addCoin(coin: ICoin, idx?: number): void;
}

export class CoinCollection implements ICoinCollection {
  private coins: ICoin[] = [];

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
      return this.coins[-1]!;
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
