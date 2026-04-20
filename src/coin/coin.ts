export interface ICoin {
  get id(): string;
  get faceup(): boolean;
  flipTo(to: boolean): void;
}

export class Coin implements ICoin {
  private _id: string;
  get id(): string {
    return this._id;
  }

  _faceup: boolean;
  get faceup(): boolean {
    return this._faceup;
  }

  constructor(id: string, faceup: boolean = true) {
    this._id = id;
    this._faceup = faceup;
  }

  flipTo(to: boolean): void {
    this._faceup = to;
  }
}
