import { ISubscription } from "../../../game/eventBus";
import { IAction } from "../../action";
import { Unit, UnitID } from "../../unit";
import { UnitEventBus } from "../../unitEvents";

export default class Swordsman extends Unit {
  id: UnitID = "vanilla.swordsman";

  initializeListeners(): void {
    let unitEvents = UnitEventBus.instance;
    this.subscriptions.push(
      unitEvents.subscribe((event: IAction) => {
        if (event.name == "vanilla.attack" && event.actor == this.id)
          this.onPerformsAttack(event);
      }),
    );
  }

  onPerformsAttack(event: IAction): void {
    //FIXME Swordsman Triggers Bonus Move.
    console.log("Swordsman can move.");
  }
}
