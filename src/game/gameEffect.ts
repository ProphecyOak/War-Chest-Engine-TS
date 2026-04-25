import { ICoordinate } from "../board/coordinate";
import { IGame } from "./game";
import * as CoinCollections from "../coin/collections";

export interface IGameEffect {
  execute(game: IGame, report?: boolean): void;
}

abstract class GameEffect implements IGameEffect {
  abstract execute(game: IGame, report?: boolean): void;
}

export namespace Effect {
  class Damage extends GameEffect {
    depth: number;
    strength: number;
    location: ICoordinate;

    constructor(
      location: ICoordinate,
      strength: number = 1,
      depth: number = 1,
    ) {
      super();
      this.location = location;
      this.strength = strength;
      this.depth = depth;
    }

    execute(game: IGame, report?: boolean): void {
      let targetStack: CoinCollections.ICoinStack;
      targetStack = game.board.getHex(this.location).coinStack;
    }
  }
}
