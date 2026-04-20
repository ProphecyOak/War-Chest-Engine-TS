export interface ICoordinate {
  get q(): number;
  get r(): number;
  get s(): number;
  add(other: ICoordinate): ICoordinate;
  sub(other: ICoordinate): ICoordinate;
  mul(scalar: number): ICoordinate;
}

class Coordinate implements ICoordinate {
  private _q: number;
  get q(): number {
    return this._q;
  }

  private _r: number;
  get r(): number {
    return this._r;
  }

  get s(): number {
    return -this._q - this._r;
  }

  constructor(q: number, r: number) {
    this._q = q;
    this._r = r;
  }

  add(other: ICoordinate): ICoordinate {
    return new Coordinate(this.q + other.q, this.r + other.r);
  }

  sub(other: ICoordinate): ICoordinate {
    return new Coordinate(this.q - other.q, this.r - other.r);
  }

  mul(scalar: number): ICoordinate {
    return new Coordinate(this.q * scalar, this.r * scalar);
  }

  toString() {
    return `<${this.q},${this.r}>`;
  }

}