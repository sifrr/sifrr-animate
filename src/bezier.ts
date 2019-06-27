const beziers = {};

interface BezierConstructor {
  new (): BezierInterface;
}

interface BezierInterface {
  final(): number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface LooseObject {
  [key: string]: any;
}

class Bezier implements BezierConstructor {
  constructor(args) {
    const key = args.join('_');
    if (!beziers[key]) {
      this.setProps(...args);
      beziers[key] = this.final.bind(this);
    }
  }

  setProps(x1: number, y1: number, x2: number, y2: number) {
    let props = {
      x1,
      y1,
      x2,
      y2,
      A: 1.0 - 3.0 * x2 + 3.0 * x1,
      B: 3.0 * x2 - 6.0 * x1,
      C: 3.0 * x1,
      CalcBezier: t => ((this.A * t + this.B) * t + this.C) * t,
      GetSlope: t => 3.0 * this.A * t * t + 2.0 * this.B * t + this.C
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
      if (slope == 0) return t;
      let x = this.CalcBezier(t, this.x1, this.x2) - xx;
      t -= x / slope;
    }
    return t;
  }
}

export default Bezier;
