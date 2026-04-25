import { ICoordinate } from "../board/coordinate";
import { IGame } from "./game";
import * as CoinCollections from "../coin/collections";
import { UnitEventBus } from "../unit/unitEvents";

export interface IGameEffect {
  execute(game: IGame): void;
}

abstract class GameEffect implements IGameEffect {
  abstract execute(game: IGame): void;
}

export namespace Effect {
  export class Damage extends GameEffect {
    depth: number;
    strength: number;
    location: ICoordinate;

    constructor(
      location: ICoordinate,
      strength: number = 1,
      depth: number = 0,
    ) {
      super();
      this.location = location;
      this.strength = strength;
      this.depth = depth;
    }

    execute(game: IGame): void {
      let targetStack: CoinCollections.ICoinStack;
      targetStack = game.board.getHex(this.location).coinStack;
      let stackHolder: CoinCollections.ICoinStack = new CoinCollections.Stack();
      if (this.depth > 0) {
        targetStack.moveTo(stackHolder, this.depth - 1);
      }
      for (let i = 0; i < this.strength; i++)
        targetStack.transferCoin(game.box);
      stackHolder.moveTo(targetStack);
    }
  }
}
