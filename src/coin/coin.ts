export interface ICoin {
  get id(): string;
  get team(): number;
  get faceup(): boolean;
  flipTo(to: boolean): void;
}

export class Coin implements ICoin {
  private _id: string;
  get id(): string {
    return this._id;
  }

  private _faceup: boolean;
  get faceup(): boolean {
    return this._faceup;
  }

  private _team: number;
  get team(): number {
    return this._team;
  }

  constructor(id: string, team: number, faceup: boolean = true) {
    this._id = id;
    this._faceup = faceup;
    this._team = team;
  }

  flipTo(to: boolean): void {
    this._faceup = to;
  }
}
