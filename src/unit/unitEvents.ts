import { EventBus } from "../game/eventBus";
import { UnitID } from "./unit";

export class UnitEventBus extends EventBus<UnitEvent> {
  private static _instance: UnitEventBus;

  static get instance(): UnitEventBus {
    if (!UnitEventBus._instance) UnitEventBus._instance = new UnitEventBus();
    return UnitEventBus._instance;
  }
}

export interface UnitEvent {
  type: string;
  actor?: UnitID;
  target?: UnitID;
}
