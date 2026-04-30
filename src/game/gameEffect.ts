import { ICoordinate } from "../board/coordinate";
import { IGame } from "./game";
import * as CoinCollections from "../coin/collections";
import { HexFlag } from "../board/hex";
import CoinStack from "../coin/collections/coinStack";

export interface IGameEffect {
  execute(game: IGame): void;
}

abstract class GameEffect implements IGameEffect {
  abstract execute(game: IGame): void;
}

export namespace Effect {
  export class Damage extends GameEffect {
    idx: number;
    strength: number;
    location: ICoordinate;

    /**
     * Damage a unit at a given location by a given strength.
     * @param location Board coordinate to damage
     * @param strength Number of coins to remove
     * @param idx Substack to hit. 0-indexed from bottom
     */
    constructor(location: ICoordinate, strength: number = 1, idx: number = 0) {
      super();
      this.location = location;
      this.strength = strength;
      this.idx = idx;
    }

    execute(game: IGame): void {
      let targetStack: CoinCollections.ICoinStack;
      targetStack = game.board.getHex(this.location).coinStack;
      let stackHolder: CoinCollections.ICoinStack = new CoinCollections.Stack();
      if (this.idx > 0) {
        targetStack.stackFromBottom(this.idx).moveTo(stackHolder);
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

    /**
     * Control a controllable hex for a given team.
     * @param location Board coordinate to control.
     * @param team Team taking control (-1 for unclaimed).
     */
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

  export class Move extends GameEffect {
    start_location: ICoordinate;
    destination: ICoordinate;
    idx: number;
    amount: number | undefined;

    /**
     * Moves a stack to another hex.
     * @param start_location hex to pull coins from
     * @param destination hex to send coins to
     * @param idx start_idx (bottom up) for stack to bring
     * @param amount whether you should just take that stack
     */
    constructor(
      start_location: ICoordinate,
      destination: ICoordinate,
      idx: number = 0,
      amount?: number,
    ) {
      super();
      this.start_location = start_location;
      this.destination = destination;
      this.idx = idx;
      this.amount = amount;
    }

    execute(game: IGame): void {
      let start = game.board.getHex(this.start_location);
      let end = game.board.getHex(this.destination);
      start.coinStack.coinSlice(this.idx!, this.amount).moveTo(end.coinStack);
    }
  }
}
