import { Unit, UnitID } from "../../unit";
import { UnitEvent, UnitEventBus } from "../../unitEvents";

export default class Pikeman extends Unit {
  id: UnitID = "vanilla.pikeman";
  initializeListeners(): void {
    let unitEvents = UnitEventBus.instance;
    this.subscriptions.push(
      unitEvents.subscribe((event: UnitEvent) => {
        if (event.type == "vanilla.attack" && event.target == "vanilla.pikeman")
          this.onAttacked(event);
      }),
    );
    //FIXME filter Pikeman trigger
  }

  onAttacked(event: UnitEvent): void {
    //FIXME Pikeman Thorns Trigger
    console.log("Pikeman deals thorns damage.");
  }
}
