import { IAction } from "../../action";
import { Unit, UnitID } from "../../unit";
import { UnitEventBus } from "../../unitEvents";

export default class Pikeman extends Unit {
  id: UnitID = "vanilla.pikeman";
  initializeListeners(): void {
    let unitEvents = UnitEventBus.instance;
    this.subscriptions.push(unitEvents.subscribe(this.onAttacked));
    //FIXME filter Pikeman trigger
  }

  onAttacked(event: IAction): void {
    //FIXME Pikeman Thorns Trigger
    console.log("Pikeman deals thorns damage.");
  }
}
