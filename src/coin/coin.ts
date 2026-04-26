import { PlayableID } from "../unit/unit";

export interface ICoin {
  get id(): string;
  get faceup(): boolean;
  flipFaceup(): void;
  flipFacedown(): void;
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

  constructor(id: PlayableID, faceup: boolean = true) {
    this._id = id;
    this._faceup = faceup;
  }

  flipFaceup(): void {
    this._faceup = true;
  }

  flipFacedown(): void {
    this._faceup = false;
  }
}
