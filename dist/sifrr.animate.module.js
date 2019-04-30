/*! Sifrr.animate v0.0.1 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
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
      if (slope == 0) return t;
      let x = this.CalcBezier(t, this.x1, this.x2) - xx;
      t -= x / slope;
    }
    return t;
  }
}
var bezier = Bezier;

var types = {
  linear: [0, 0, 1, 1],
  ease: [.25, .1, .25, 1],
  easeIn: [.42, 0, 1, 1],
  easeOut: [0, 0, .58, 1],
  easeInOut: [.42, 0, .58, 1]
};

const digitRgx = /(\d+)/;
function animateOne({
  target,
  prop,
  from,
  to,
  time = 300,
  type = 'ease',
  onUpdate,
  round = false
}) {
  const toSplit = to.toString().split(digitRgx), l = toSplit.length, raw = [], fromNums = [], diffs = [];
  const fromSplit = (from || target[prop] || '').toString().split(digitRgx);
  const onUp = typeof onUpdate === 'function';
  for (let i = 0; i < l; i++) {
    const n = Number(toSplit[i]);
    if (isNaN(n) || !toSplit[i]) raw.push(toSplit[i]);
    else {
      fromNums.push(Number(fromSplit[i]) || 0);
      diffs.push(n - (Number(fromSplit[i]) || 0));
    }
  }
  type = typeof type === 'function' ? type : new bezier(types[type] || type);
  return new Promise(res => {
    let startTime;
    function frame(currentTime) {
      startTime = startTime || currentTime;
      const percent = (currentTime - startTime) / time, bper = type(percent >= 1 ? 1 : percent);
      const next = diffs.map((d, i) => {
        if (round) return Math.round(bper * d + fromNums[i]);
        return bper * d + (fromNums[i] || 0);
      });
      const val = String.raw({ raw }, ...next);
      target[prop] = Number(val) || val;
      if (onUp) onUpdate(target, prop, target[prop]);
      if (percent >= 1) return res();
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  });
}
var animateone = animateOne;

function animate({
  targets,
  target,
  to,
  time,
  type,
  onUpdate,
  round
}) {
  targets = targets ? Array.from(targets) : [target];
  function iterate(target, props) {
    const promises = [];
    for (let prop in props) {
      let from, final;
      if (Array.isArray(props[prop])) [from, final] = props[prop];
      else final = props[prop];
      if (typeof props[prop] === 'object' && !Array.isArray(props[prop])) {
        promises.push(iterate(target[prop], props[prop]));
      } else {
        promises.push(animateone({
          target,
          prop,
          to: final,
          time,
          type,
          from,
          onUpdate,
          round
        }));
      }
    }
    return Promise.all(promises);
  }
  return Promise.all(targets.map(target => iterate(target, to)));
}
animate.types = types;
animate.wait = (t = 0) => new Promise(res => setTimeout(res, t));
animate.animate = animate;
var animate_1 = animate;

export default animate_1;
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrr.animate.module.js.map
