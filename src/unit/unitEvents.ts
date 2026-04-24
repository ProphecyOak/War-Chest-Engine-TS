import { EventBus } from "../game/eventBus";
import { IAction } from "./action";

export class UnitEventBus extends EventBus<IAction> {
  private static _instance: UnitEventBus;

  static get instance(): UnitEventBus {
    if (!UnitEventBus._instance) UnitEventBus._instance = new UnitEventBus();
    return UnitEventBus._instance;
  }
}
