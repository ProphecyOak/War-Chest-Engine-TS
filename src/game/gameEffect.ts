import { ICoordinate } from "../board/coordinate";
import { IGame } from "./game";
import * as CoinCollections from "../coin/collections";
import { IPlayable, outOfBoundsStackError, Unit } from "../unit/unit";
import { UnitEventBus, UnitIdentifier } from "../unit/unitEvents";
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
      let deployHex = game.board.getHex(this.location);
      let newStackIdx = this.unit.boardLocations.length;
      deployHex.place(this.unit, newStackIdx);
      this.unit.boardLocations.push(this.location);
      this.unit.stacks.push(new CoinCollections.Stack(this.unit.id));
      this.unit.stacks.at(newStackIdx)?.addCoin(new Coin(this.unit.id));

      UnitEventBus.instance.fire({
        type: "vanilla.deploy",
        actor: { unit: this.unit, stackIdx: newStackIdx },
        target: this.location,
      });
    }
  }

  export class Bolster extends GameEffect {
    unit: Unit;
    stackIdx: number;

    constructor(unitID: UnitIdentifier) {
      super();
      this.unit = unitID.unit;
      this.stackIdx = unitID.stackIdx;
    }

    execute(game: IGame): void {
      if (this.stackIdx >= this.unit.stacks.length) throw outOfBoundsStackError;
      this.unit.stacks.at(this.stackIdx)?.addCoin(new Coin(this.unit.id));

      UnitEventBus.instance.fire({
        type: "vanilla.bolster",
        actor: { unit: this.unit, stackIdx: this.stackIdx },
      });
    }
  }

  export class Control extends GameEffect {
    location: ICoordinate;
    unit: Unit;
    stackIdx: number;

    constructor(location: ICoordinate, unitID: UnitIdentifier) {
      super();
      this.unit = unitID.unit;
      this.stackIdx = unitID.stackIdx;
      this.location = location;
    }

    execute(game: IGame): void {
      let controlHex = game.board.getHex(this.location);
      if (!controlHex.is(HexFlag.Controllable))
        throw new Error("Cannot control uncontrollable hex.");
      if (controlHex.is(HexFlag.ControlledBy, this.unit.player.team))
        throw new Error("Cannot control friendly hex.");
      controlHex.set(HexFlag.ControlledBy, this.unit.player.team);

      UnitEventBus.instance.fire({
        type: "vanilla.control",
        actor: { unit: this.unit, stackIdx: this.stackIdx },
        target: this.location,
      });
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
