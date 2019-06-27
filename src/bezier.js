const beziers = {};

class Bezier {
  static fromArray(arr) {
    const key = arr.toString();
    if (!beziers[key]) {
      const bez = new Bezier(...arr);
      beziers[key] = bez.final.bind(bez);
    }
    return beziers[key];
  }

  constructor(x1, y1, x2, y2) {
    this.setProps(x1, y1, x2, y2);
  }

  setProps(x1, y1, x2, y2) {
    let props = { x1, y1, x2, y2 };
    const A = (a, b) => 1.0 - 3.0 * b + 3.0 * a;
    const B = (a, b) => 3.0 * b - 6.0 * a;
    const C = a => 3.0 * a;

    const aX1X2 = A(x1, x2) * 3.0;
    const bX1X2 = B(x1, x2) * 2.0;
    const cX1 = C(x1);
    this.GetSlope = t => aX1X2 * t * t + bX1X2 * t + cX1;

    this.CalcBezier = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;

    Object.assign(this, props);
  }

  final(x) {
    if (this.x1 == this.y1 && this.x2 == this.y2) return x;
    return this.CalcBezier(this.GetTForX(x), this.y1, this.y2);
  }

  GetTForX(xx) {
    let t = xx;
    for (let i = 0; i < 4; ++i) {
      let slope = this.GetSlope(t);
      if (slope == 0) return t;
      let x = this.CalcBezier(t, this.x1, this.x2) - xx;
      t -= x / slope;
    }
    return t;
  }
}

export default Bezier;
