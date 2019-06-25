/*! sifrr-animate v0.0.3 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-animate */
const beziers = {};
class Bezier {
  constructor(args) {
    const key = args.join('_');
    if (!beziers[key]) {
      this.setProps(...args);
      beziers[key] = this.final.bind(this);
    }
    return beziers[key];
  }
  setProps(x1, y1, x2, y2) {
    let props = {
      x1,
      y1,
      x2,
      y2,
      A: (x1, x2) => 1.0 - 3.0 * x2 + 3.0 * x1,
      B: (x1, x2) => 3.0 * x2 - 6.0 * x1,
      C: x1 => 3.0 * x1,
      CalcBezier: (t, x1, x2) =>
        ((this.A(x1, x2) * t + this.B(x1, x2)) * t + this.C(x1)) * t,
      GetSlope: (t, x1, x2) =>
        3.0 * this.A(x1, x2) * t * t + 2.0 * this.B(x1, x2) * t + this.C(x1)
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

const linear = [0, 0, 1, 1];
const ease = [0.25, 0.1, 0.25, 1];
const easeIn = [0.42, 0, 1, 1];
const easeOut = [0, 0, 0.58, 1];
const easeInOut = [0.42, 0, 0.58, 1];
const spring = [0.3642, 0, 0.6358, 1];

const types = /*#__PURE__*/Object.freeze({
  linear: linear,
  ease: ease,
  easeIn: easeIn,
  easeOut: easeOut,
  easeInOut: easeInOut,
  spring: spring
});

const digitRgx = /((?:[+\-*/]=)?-?\d+\.?\d*)/;
const frames = new Set();
function runFrames(currentTime) {
  frames.forEach(f => f(currentTime));
  window.requestAnimationFrame(runFrames);
}
window.requestAnimationFrame(runFrames);
function animateOne({
  target,
  prop,
  from,
  to,
  time = 300,
  type = 'spring',
  onUpdate,
  round = false,
  delay = 0
}) {
  const toSplit = to.toString().split(digitRgx),
    l = toSplit.length,
    raw = [],
    fromNums = [],
    diffs = [];
  const fromSplit = (from || target[prop] || '').toString().split(digitRgx);
  const onUp = typeof onUpdate === 'function';
  for (let i = 0; i < l; i++) {
    const fn = Number(fromSplit[i]) || 0;
    let tn;
    if (toSplit[i][1] === '=') {
      tn = Number(toSplit[i].slice(2));
      switch (toSplit[i][0]) {
        case '+':
          tn = fn + tn;
          break;
        case '-':
          tn = fn - tn;
          break;
        case '*':
          tn = fn * tn;
          break;
        case '/':
          tn = fn / tn;
          break;
      }
    } else tn = Number(toSplit[i]);
    if (isNaN(tn) || !toSplit[i]) raw.push(toSplit[i]);
    else {
      fromNums.push(fn);
      diffs.push(tn - fn);
    }
  }
  const rawObj = { raw };
  return new Promise((resolve, reject) => {
    if (types[type]) type = types[type];
    if (Array.isArray(type)) type = new Bezier(type);
    else if (typeof type !== 'function')
      return reject(
        Error(
          'type should be one of ' +
            Object.keys(types).toString() +
            ' or Bezier Array or Function, given ' +
            type
        )
      );
    const startTime = performance.now() + delay;
    const frame = function(currentTime) {
      const percent = (currentTime - startTime) / time,
        bper = type(percent > 1 ? 1 : percent);
      if (percent < 0) return;
      const next = diffs.map((d, i) => {
        const n = bper * d + fromNums[i];
        return round ? Math.round(n) : n;
      });
      const val = String.raw(rawObj, ...next);
      try {
        target[prop] = Number(val) || val;
        if (onUp) onUpdate(target, prop, target[prop]);
        if (percent >= 1) resolve(frames.delete(frame));
      } catch (e) {
        frames.delete(frame);
        reject(e);
      }
    };
    frames.add(frame);
  });
}

function animate({
  targets,
  target,
  to,
  time,
  type,
  onUpdate,
  round,
  delay
}) {
  targets = targets ? Array.from(targets) : [target];
  function iterate(tg, props, d, ntime) {
    const promises = [];
    for (let prop in props) {
      let from, final;
      if (Array.isArray(props[prop])) [from, final] = props[prop];
      else final = props[prop];
      if (typeof props[prop] === 'object' && !Array.isArray(props[prop])) {
        promises.push(iterate(tg[prop], props[prop], d, ntime));
      } else {
        promises.push(
          animateOne({
            target: tg,
            prop,
            to: final,
            time: ntime,
            type,
            from,
            onUpdate,
            round,
            delay: d
          })
        );
      }
    }
    return Promise.all(promises);
  }
  let numTo = to,
    numDelay = delay,
    numTime = time;
  return Promise.all(
    targets.map((target, i) => {
      if (typeof to === 'function') numTo = to.call(target, i);
      if (typeof delay === 'function') numDelay = delay.call(target, i);
      if (typeof time === 'function') numTime = time.call(target, i);
      return iterate(target, numTo, numDelay, numTime);
    })
  );
}
animate.types = require('./types');
animate.wait = require('./wait').default;
animate.animate = animate;
animate.keyframes = arrOpts => {
  let promise = Promise.resolve(true);
  arrOpts.forEach(opts => {
    if (Array.isArray(opts))
      promise = promise.then(() => Promise.all(opts.map(animate)));
    promise = promise.then(() => animate(opts));
  });
  return promise;
};
animate.loop = fxn => fxn().then(() => animate.loop(fxn));

export default animate;
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrr.animate.module.js.map
