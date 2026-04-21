export interface ICoordinate {
  get q(): number;
  get r(): number;
  get s(): number;
  add(other: ICoordinate): ICoordinate;
  sub(other: ICoordinate): ICoordinate;
  mul(scalar: number): ICoordinate;
  neighbors(radius?: number): ICoordinate[];
  inLineWith(other: ICoordinate | ICoordinate[]): boolean;
  ray(direction: ICoordinate): ICoordinate[];
}

export class Coordinate implements ICoordinate {
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

  neighbors(radius: number = 1): ICoordinate[] {
    let results: ICoordinate[] = [];
    for (let i = -radius; i <= radius; i++) {
      for (
        let j = -radius + Math.max(0, -i);
        j <= radius + Math.min(0, -i);
        j++
      ) {
        if (i == 0 && j == 0) continue;
        results.push(new Coordinate(i, j).add(this));
      }
    }
    return results;
  }

  inLineWith(other: ICoordinate | ICoordinate[]): boolean {
    if (!Array.isArray(other)) {
      return this.q == other.q || this.r == other.r || this.s == other.s;
    }
    if (other.length == 0) return true;
    if (other.length == 1) return this.inLineWith(other.at(0)!);
    if (other.length == 2)
      return (
        (this.q == other.at(0)!.q && this.q == other.at(1)!.q) ||
        (this.r == other.at(0)!.r && this.r == other.at(1)!.r) ||
        (this.s == other.at(0)!.s && this.s == other.at(1)!.s)
      );
    let base = other.slice(0, 2);
    return (
      this.inLineWith(base) &&
      other.slice(2).every((coord: ICoordinate) => coord.inLineWith(base))
    );
  }

  ray(direction: ICoordinate, radius: number = 1): ICoordinate[] {
    let results: ICoordinate[] = [this];
    for (let i = 0; i < radius; i++) {
      results.push(results.at(i)!.add(direction));
    }
    return results;
  }

  toString() {
    return `<${this.q},${this.r}>`;
  }
}

const CARDINALS = [
  new Coordinate(0, -1),
  new Coordinate(1, -1),
  new Coordinate(1, 0),
  new Coordinate(0, 1),
  new Coordinate(-1, 1),
  new Coordinate(-1, 0),
];

const DIAGONALS = [
  new Coordinate(2, -1),
  new Coordinate(1, -2),
  new Coordinate(-1, -1),
  new Coordinate(-2, 1),
  new Coordinate(-1, 2),
  new Coordinate(1, 1),
];
