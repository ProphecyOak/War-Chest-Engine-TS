import { ICoordinate } from "../board/coordinate";
import { EventBus } from "../game/eventBus";
import { UnitID } from "./unit";

export class UnitEventBus extends EventBus<UnitEvent> {
  private static _instance: UnitEventBus;

  static get instance(): UnitEventBus {
    if (!UnitEventBus._instance) UnitEventBus._instance = new UnitEventBus();
    return UnitEventBus._instance;
  }
}

type UnitIdentifier = { id: UnitID; stackNumber: number };

export type UnitEvent = AttackEvent | ControlEvent;

interface BaseEvent {
  type: string;
}

interface AttackEvent extends BaseEvent {
  type: "vanilla.attack";
  actor: UnitIdentifier;
  target: UnitIdentifier;
}

interface ControlEvent extends BaseEvent {
  type: "vanilla.control";
  actor: UnitIdentifier;
  target: ICoordinate;
}
