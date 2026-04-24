import { IAction } from "../unit/action";
import { ICoordinate } from "./coordinate";
import { HexFlag, IHex } from "./hex";
import * as CoinCollections from "../coin/collections";

export interface IBoard {
  getHex(coord: ICoordinate): IHex;
  inBoard(coord: ICoordinate): boolean;
  resolveAction(action: IAction): void;
}

export abstract class Board implements IBoard {
  protected abstract _hexes: (IHex | null)[][];

  private get _width(): number {
    if (this._height == 0) return 0;
    return this._hexes.at(0)!.length;
  }

  private get _height(): number {
    return this._hexes.length;
  }

  getHex(coord: ICoordinate): IHex {
    if (coord.q < 0 || coord.q >= this._height) {
      throw new Error(`q coordinate ${coord.q} out of board-bounding range.`);
    }
    if (coord.r < 0 || coord.r >= this._width) {
      throw new Error(`r coordinate ${coord.r} out of board-bounding range.`);
    }
    if (!this.inBoard(coord)) {
      throw new Error(`Location ${coord} not part of board.`);
    }
    return this._hexes.at(coord.q)!.at(coord.r)!;
  }

  abstract inBoard(coord: ICoordinate): boolean;

  resolveAction(action: IAction): void {
    action.controlled.forEach((team: number, loc: ICoordinate) =>
      this.getHex(loc).set(HexFlag.ControlledBy, team),
    );

    action.damaged.forEach((strength: number, loc: ICoordinate) => {
      for (let i = 0; i < strength; i++) {
        this.getHex(loc).coinStack.transferCoin(CoinCollections.Box);
      }
    });

    action.deployed.forEach(
      (
        loc: ICoordinate,
        x: { origin: CoinCollections.ICoinStack; amount: number },
      ) => {
        x.origin.transferCoin(this.getHex(loc).coinStack);
      },
    );

    action.moved.forEach(
      (start: ICoordinate, x: { loc: ICoordinate; depth: number }) => {
        this.getHex(start).coinStack.moveTo(
          this.getHex(x.loc).coinStack,
          x.depth,
        );
      },
    );

    action.shifted.forEach(
      (
        amount: number,
        x: {
          origin: CoinCollections.ICoinCollection;
          destination: CoinCollections.ICoinCollection;
        },
      ) => {
        for (let i = 0; i < amount; i++) x.origin.transferCoin(x.destination);
      },
    );
  }
}
