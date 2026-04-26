import { Game } from "../game/game";
import { IPlayer } from "../game/player";
import { IPlayable, PlayableID } from "./unit";

export interface IMemoizedPlayable {
  of: (player: IPlayer) => IPlayable;
}

export function memoizedPlayable(playable: {
  new (player: IPlayer): IPlayable;
  id: PlayableID;
}): IMemoizedPlayable {
  let units: Record<number, IPlayable> = {};
  let memo = {
    of: (player: IPlayer) => {
      let created = Object.keys(units).includes(player.team.toString());
      if (!created) {
        units[player.team] = new playable(player);
      }
      return units[player.team] as IPlayable;
    },
  };
  Game.instance.addPlayable(playable.id, memo);
  return memo;
}
