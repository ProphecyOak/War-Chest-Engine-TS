import { Unit, UnitID } from "../../unit";
import { UnitEvent, UnitEventBus } from "../../unitEvents";

export default class Swordsman extends Unit {
  id: UnitID = "vanilla.swordsman";

  initializeListeners(): void {
    let unitEvents = UnitEventBus.instance;
    this.subscriptions.push(
      unitEvents.subscribe((event: UnitEvent) => {
        if (
          event.type == "vanilla.attack" &&
          event.actor == "vanilla.swordsman"
        )
          this.onPerformsAttack(event);
      }),
    );
    //FIXME filter Swordsman trigger
  }

  onPerformsAttack(event: UnitEvent): void {
    //FIXME Swordsman Triggers Bonus Move.
    console.log("Swordsman can move.");
  }
}
