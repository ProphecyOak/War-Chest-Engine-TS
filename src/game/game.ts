import { IBoard } from "../board/board";
import { IPlayer } from "./player";
import * as boardLayouts from "../board/Layouts";

export interface IGame {
  get board(): IBoard;
  get players(): IPlayer[];
}
export class Game implements IGame {
  board: IBoard = new boardLayouts.Vanilla();
  players: IPlayer[] = [];
}
