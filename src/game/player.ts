export interface IPlayer {
  team: number;
}

export class Player implements IPlayer {
  team: number;

  constructor(team: number) {
    this.team = team;
  }
}
