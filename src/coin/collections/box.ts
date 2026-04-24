import CoinPile from "./coinPile";

class Box extends CoinPile {
  private static _instance: Box;
  static get instance(): Box {
    if (!this._instance) this._instance = new CoinPile();
    return this._instance;
  }
}

export default Box.instance;
