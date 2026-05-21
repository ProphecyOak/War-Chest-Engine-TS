import { ICoordinate } from "../board/coordinate";
import { IGame } from "./game";
import * as CoinCollections from "../coin/collections";
import { outOfBoundsStackError, Unit } from "../unit/unit";
import { UnitEventBus } from "../unit/unitEvents";
import { Coin } from "../coin/coin";
import { IPlayer } from "./player";
import { HexFlag, IHex } from "../board/hex";

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

    /**
     * Places a unit at the location. Creates a new boardLocation entry.
     * @param unit
     * @param location
     */
    constructor(unit: Unit, location: ICoordinate) {
      super();
      this.unit = unit;
      this.location = location;
    }

    execute(game: IGame): void {
      let deployLocation = game.board.getHex(this.location);
      let newStackIdx = this.unit.boardLocations.length;
      deployLocation.place(this.unit, newStackIdx);
      this.unit.boardLocations.push(this.location);
      this.unit.stacks.push(new CoinCollections.Stack(this.unit.id));
      this.unit.stacks.at(newStackIdx)?.addCoin(new Coin(this.unit.id));
      UnitEventBus.instance.fire({
        type: "vanilla.deploy",
        actor: { unit: this.unit, stackNumber: newStackIdx },
        target: this.location,
      });
    }
  }

  export class Bolster extends GameEffect {
    unit: Unit;
    stackIdx: number;

    constructor(unit: Unit, stackIdx: number) {
      super();
      this.unit = unit;
      this.stackIdx = stackIdx;
    }

    execute(game: IGame): void {
      if (this.stackIdx >= this.unit.stacks.length) throw outOfBoundsStackError;
      this.unit.stacks.at(this.stackIdx)?.addCoin(new Coin(this.unit.id));
    }
  }

  export class Control extends GameEffect {
    location: IHex;
    player: IPlayer;

    constructor(location: IHex, player: IPlayer) {
      super();
      this.location = location;
      this.player = player;
    }

    execute(game: IGame): void {
      if (!this.location.is(HexFlag.Controllable))
        throw new Error("Cannot control uncontrollable hex.");
      if (this.location.is(HexFlag.ControlledBy, this.player.team))
        throw new Error("Cannot control friendly hex.");
      this.location.set(HexFlag.ControlledBy, this.player.team);
    }
  }

  export class Move extends GameEffect {
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
