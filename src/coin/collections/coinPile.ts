import { ICoin } from "../coin";
import {
  CoinCollection,
  emptyCollectionError,
  outOfBoundsCollectionError,
} from "./coinCollection";

export default class CoinPile extends CoinCollection {
  get size(): number {
    return this.coins.length;
  }

  protected removeCoin(idx?: number): ICoin {
    if (this.size == 0) {
      throw emptyCollectionError;
    }
    if (idx != null) {
      return this.coins.splice(idx, 1).at(0)!;
    } else {
      return this.coins.pop()!;
    }
  }

  getCoin(idx?: number) {
    if (this.size == 0) {
      throw emptyCollectionError;
    }
    if (idx != null) {
      if (this.coins[idx] == undefined) {
        throw outOfBoundsCollectionError(idx);
      }
      return this.coins[idx]!;
    } else {
      return this.coins.at(-1)!;
    }
  }

  addCoin(coin: ICoin, idx?: number): void {
    if (idx != null) {
      this.coins.splice(idx, 0, coin);
    } else {
      this.coins.push(coin);
    }
  }

  toString(): string {
    return this.coins.join(",");
  }
}
