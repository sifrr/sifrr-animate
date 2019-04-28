const beziers = {};

class Bezier {
  constructor(args){
    const key = args.join('_');
    if (!beziers[key]) {
      this.setProps(...args);
      beziers[key] = this.final.bind(this);
    }
    return beziers[key];
  }

  setProps(x1, y1, x2, y2) {
    let props = {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      A: (aA1, aA2) => 1.0 - 3.0 * aA2 + 3.0 * aA1,
      B: (aA1, aA2) => 3.0 * aA2 - 6.0 * aA1,
      C: (aA1) => 3.0 * aA1,
      CalcBezier: (aT, aA1, aA2) => ((this.A(aA1, aA2)*aT + this.B(aA1, aA2))*aT + this.C(aA1))*aT,
      GetSlope: (aT, aA1, aA2) => 3.0 * this.A(aA1, aA2)*aT*aT + 2.0 * this.B(aA1, aA2) * aT + this.C(aA1)
    };
    Object.assign(this, props);
  }

  final(x) {
    if (this.x1 == this.y1 && this.x2 == this.y2) return x;
    return this.CalcBezier(this.GetTForX(x), this.y1, this.y2);
  }

  GetTForX(xx) {
    let t = xx;
    for (let i = 0; i < 4; ++i) {
      let slope = this.GetSlope(t, this.x1, this.x2);
      if (slope == 0.0) return t;
      let x = this.CalcBezier(t, this.x1, this.x2) - xx;
      t -= x / slope;
    }
    return t;
  }
}

module.exports = Bezier;
