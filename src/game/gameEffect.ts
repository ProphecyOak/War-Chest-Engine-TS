import { ICoordinate } from "../board/coordinate";
import { IGame } from "./game";
import * as CoinCollections from "../coin/collections";
import { HexFlag } from "../board/hex";
import CoinStack from "../coin/collections/coinStack";
import { IMemoizedPlayable } from "../unit/memoizablePlayable";
import { Unit } from "../unit/unit";

export interface IGameEffect {
  execute(game: IGame): void;
}

abstract class GameEffect implements IGameEffect {
  abstract execute(game: IGame): void;
}

export namespace Effect {
  export class Deploy extends GameEffect {
    unit: Unit;
    location: ICoordinate;

    constructor(unit: Unit, location: ICoordinate) {
      super();
      this.unit = unit;
      this.location = location;
    }

    execute(game: IGame): void {
      let deployLocation = game.board.getHex(this.location);
      deployLocation.deploy(this.unit, this.unit.boardLocations.length);
    }
  }

  export class Bolster extends GameEffect {
    execute(game: IGame): void {
      throw new Error("Method not implemented.");
    }
  }

  export class Move extends GameEffect {
    execute(game: IGame): void {
      throw new Error("Method not implemented.");
    }
  }

  export class Control extends GameEffect {
    execute(game: IGame): void {
      throw new Error("Method not implemented.");
    }
  }

  export class Damage extends GameEffect {
    execute(game: IGame): void {
      throw new Error("Method not implemented.");
    }
  }
}
