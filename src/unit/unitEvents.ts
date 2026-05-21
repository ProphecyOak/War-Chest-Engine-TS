import { ICoordinate } from "../board/coordinate";
import { EventBus } from "../game/eventBus";
import { Unit } from "./unit";

export class UnitEventBus extends EventBus<UnitEvent> {
  private static _instance: UnitEventBus;

  static get instance(): UnitEventBus {
    if (!UnitEventBus._instance) UnitEventBus._instance = new UnitEventBus();
    return UnitEventBus._instance;
  }
}

type UnitIdentifier = { unit: Unit; stackNumber: number };

export type UnitEvent = AttackEvent | ControlEvent | MoveEvent | DeployEvent;

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

interface MoveEvent extends BaseEvent {
  type: "vanilla.move";
  actor: UnitIdentifier;
  target: ICoordinate;
}

interface DeployEvent extends BaseEvent {
  type: "vanilla.deploy";
  actor: UnitIdentifier;
  target: ICoordinate;
}
