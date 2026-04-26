import { PlayableID, Unit, UnitID } from "../../unit";
import { UnitEvent, UnitEventBus } from "../../unitEvents";
import { memoizedPlayable } from "../../memoizablePlayable";

class Swordsman extends Unit {
  static id: UnitID = "vanilla.swordsman";

  get id(): PlayableID {
    return Swordsman.id;
  }

  initializeListeners(): void {
    let unitEvents = UnitEventBus.instance;
    this.subscriptions.push(
      unitEvents.subscribe((event: UnitEvent) => {
        if (
          event.type == "vanilla.attack" &&
          event.actor.id == "vanilla.swordsman"
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

export default memoizedPlayable(Swordsman);
