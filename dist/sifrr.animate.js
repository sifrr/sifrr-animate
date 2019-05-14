/*! Sifrr.animate v0.0.1 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.Sifrr = global.Sifrr || {}, global.Sifrr.animate = factory()));
}(this, function () { 'use strict';

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
        CalcBezier: (t, x1, x2) => ((this.A(x1, x2) * t + this.B(x1, x2)) * t + this.C(x1)) * t,
        GetSlope: (t, x1, x2) => 3.0 * this.A(x1, x2) * t * t + 2.0 * this.B(x1, x2) * t + this.C(x1)
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

  var wait = (t = 0) => new Promise(res => setTimeout(res, t));

  const digitRgx = /(\d+\.?\d*)/;
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
    type = 'ease',
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
      const n = Number(toSplit[i]);
      if (isNaN(n) || !toSplit[i]) raw.push(toSplit[i]);else {
        fromNums.push(Number(fromSplit[i]) || 0);
        diffs.push(n - (Number(fromSplit[i]) || 0));
      }
    }
    type = typeof type === 'function' ? type : new bezier(types[type] || type);
    const rawObj = {
      raw
    };
    return wait(delay).then(() => new Promise(resolve => {
      let startTime = performance.now();
      const frame = function (currentTime) {
        const percent = (currentTime - startTime) / time,
              bper = type(percent >= 1 ? 1 : percent);
        const next = diffs.map((d, i) => {
          const n = bper * d + fromNums[i];
          return round ? Math.round(n) : n;
        });
        const val = String.raw(rawObj, ...next);
        target[prop] = Number(val) || val;
        if (onUp) onUpdate(target, prop, target[prop]);
        if (percent >= 1) resolve(frames.delete(frame));
      };
      frames.add(frame);
    }));
  }
  var animateone = animateOne;

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
    function iterate(t, props, d) {
      const promises = [];
      for (let prop in props) {
        let from, final;
        if (Array.isArray(props[prop])) [from, final] = props[prop];else final = props[prop];
        if (typeof props[prop] === 'object' && !Array.isArray(props[prop])) {
          promises.push(iterate(t[prop], props[prop], d));
        } else {
          promises.push(animateone({
            target: t,
            prop,
            to: final,
            time,
            type,
            from,
            onUpdate,
            round,
            delay: d
          }));
        }
      }
      return Promise.all(promises);
    }
    let numTo = to,
        numDelay = delay;
    return Promise.all(targets.map((target, i) => {
      if (typeof to === 'function') numTo = to(i);
      if (typeof delay === 'function') numDelay = delay(i);
      return iterate(target, numTo, numDelay);
    }));
  }
  animate.types = types;
  animate.wait = wait;
  animate.animate = animate;
  var animate_1 = animate;

  return animate_1;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrr.animate.js.map
