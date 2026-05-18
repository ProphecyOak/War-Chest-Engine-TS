import { PlayableID } from "../../unit/unit";
import { Coin, ICoin } from "../coin";
import {
  CoinCollection,
  emptyCollectionError,
  ICoinStack,
  outOfBoundsCollectionError,
} from "./coinCollection";

export default class CoinStack extends CoinCollection implements ICoinStack {
  private _size: number = 0;
  get size(): number {
    return this._size;
  }

  private _unit: PlayableID;
  get id(): PlayableID {
    return this._unit;
  }

  constructor(unit: PlayableID) {
    super();
    this._unit = unit;
  }

  getCoin(idx: number = 0): ICoin {
    if (this.size == 0) throw emptyCollectionError;
    if (this.size <= idx) throw outOfBoundsCollectionError;
    return new Coin(this.id);
  }

  addCoin(coin: ICoin): void {
    if (coin.id != this.id) throw new Error("Cannot add coin to unlike stack.");
    this._size++;
  }

  protected removeCoin(): ICoin {
    if (this.size <= 0) throw emptyCollectionError;
    this._size--;
    return new Coin(this.id);
  }

  toString(): string {
    throw new Error("Method not implemented.");
  }
}
