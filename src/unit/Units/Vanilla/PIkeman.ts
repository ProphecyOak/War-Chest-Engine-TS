import { Action, IAction } from "../../../game/action";
import { Effect } from "../../../game/gameEffect";
import { IPlayer } from "../../../game/player";
import { PlayableID, Unit, UnitID } from "../../unit";
import { UnitEvent, UnitEventBus } from "../../unitEvents";
import { memoizedPlayable } from "../../memoizablePlayable";

class Pikeman extends Unit {
  static id: UnitID = "vanilla.pikeman";

  get id(): PlayableID {
    return Pikeman.id;
  }

  initializeListeners(): void {
    let unitEvents = UnitEventBus.instance;
    this.subscriptions.push(
      unitEvents.subscribe((event: UnitEvent) => {
        if (
          event.type == "vanilla.attack" &&
          event.target.id == "vanilla.pikeman"
        )
          this.onAttacked(event);
      }),
    );
  }

  onAttacked(event: UnitEvent): void {
    //FIXME Pikeman Thorns Trigger
    console.log("Pikeman deals thorns damage.");
    let thorns: IAction = new Action(this, "vanilla.thorns");
    // thorns.addEffect(new Effect.Damage(event.actor,1), {
    //   type: "vanilla.thorns",
    //   actor: "vanilla.pikeman",
    //   target: event.actor,
    //   originLocation: this.boardLocations[event.]
    // });
  }
}

export default memoizedPlayable(Pikeman);
