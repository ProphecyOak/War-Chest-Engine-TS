import { IBoard } from "../../../board/board";
import { IAction } from "../../action";
import { Unit } from "../../unit";

export default class Swordsman extends Unit {
  tacticOptions(board: IBoard): IAction[] {
    return [];
  }
}
