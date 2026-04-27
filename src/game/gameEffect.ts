import { ICoordinate } from "../board/coordinate";
import { IGame } from "./game";
import * as CoinCollections from "../coin/collections";
import { UnitEventBus } from "../unit/unitEvents";
import { HexFlag } from "../board/hex";

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

    /**
     *
     * @param location Board coordinate to damage
     * @param strength Number of coins to remove
     * @param depth Substack to hit. 0 is top stack, and so on down
     */
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
        targetStack.moveTo(stackHolder, this.depth);
      }
      for (let i = 0; i < this.strength; i++) {
        targetStack.transferCoin(game.box);
      }
      stackHolder.moveTo(targetStack);
    }
  }

  export class Control extends GameEffect {
    location: ICoordinate;
    team: number;

    constructor(location: ICoordinate, team: number) {
      super();
      this.location = location;
      this.team = team;
    }

    execute(game: IGame): void {
      let hex = game.board.getHex(this.location);
      if (!hex.is(HexFlag.Controllable))
        throw new Error("This hex cannot be controlled.");
      hex.set(HexFlag.ControlledBy, this.team);
    }
  }
}
