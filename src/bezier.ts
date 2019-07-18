const beziers = {};

interface Bezier {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  getSlope(t: number): number;
  calcBezier(t: number, a: number, b: number): number;
}

class Bezier implements Bezier {
  static fromArray(arr: [number, number, number, number]) {
    const key = arr.toString();
    if (!beziers[key]) {
      const bez = new Bezier(arr);
      beziers[key] = bez.final.bind(bez);
    }
    return beziers[key];
  }

  constructor([x1, y1, x2, y2] = [0, 0, 1, 1]) {
    this.setProps(x1, y1, x2, y2);
  }

  setProps(x1: number, y1: number, x2: number, y2: number) {
    let props = { x1, y1, x2, y2 };
    const A = (a: number, b: number) => 1.0 - 3.0 * b + 3.0 * a;
    const B = (a: number, b: number) => 3.0 * b - 6.0 * a;
    const C = (a: number) => 3.0 * a;

    const aX1X2 = A(x1, x2) * 3.0;
    const bX1X2 = B(x1, x2) * 2.0;
    const cX1 = C(x1);
    this.getSlope = t => aX1X2 * t * t + bX1X2 * t + cX1;

    this.calcBezier = (t: number, a: number, b: number): number =>
      ((A(a, b) * t + B(a, b)) * t + C(a)) * t;

    Object.assign(this, props);
  }

  final(x: number) {
    if (this.x1 == this.y1 && this.x2 == this.y2) return x;
    return this.calcBezier(this.GetTForX(x), this.y1, this.y2);
  }

  GetTForX(xx: number): number {
    let t = xx;
    for (let i = 0; i < 4; ++i) {
      let slope = this.getSlope(t);
      if (slope == 0) return t;
      let x = this.calcBezier(t, this.x1, this.x2) - xx;
      t -= x / slope;
    }
    return t;
  }
}

export default Bezier;
