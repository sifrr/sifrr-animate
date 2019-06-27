import Bezier from './bezier';
import wait from './wait';
import * as types from './types';

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
  finalPercent = 1,
  beforePercent = 0,
  delay = 0 // number
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
  const reverse = finalPercent < beforePercent;
  return wait(delay).then(
    () =>
      new Promise((resolve, reject) => {
        if (types[type]) type = types[type];
        if (Array.isArray(type)) type = Bezier.fromArray(type);
        else if (typeof type !== 'function')
          return reject(
            Error(
              'type should be one of ' +
                Object.keys(types).toString() +
                ' or Bezier Array or Function, given ' +
                type
            )
          );

        let lastTime = performance.now(),
          percent = beforePercent;
        const frame = function(currentTime) {
          percent = reverse
            ? percent - (currentTime - lastTime) / time
            : percent + (currentTime - lastTime) / time;
          lastTime = currentTime;
          const bper = reverse
            ? type(Math.max(percent, finalPercent))
            : type(Math.min(percent, finalPercent));
          const next = diffs.map((d, i) => {
            const n = bper * d + fromNums[i];
            return round ? Math.round(n) : n;
          });
          const val = String.raw(rawObj, ...next);
          try {
            target[prop] = Number(val) || val;
            if (onUp) onUpdate(target, prop, target[prop]);
            if (
              (reverse ? percent <= finalPercent : percent >= finalPercent) ||
              percent > 1
            )
              resolve(frames.delete(frame));
          } catch (e) {
            frames.delete(frame);
            reject(e);
          }
        };
        frames.add(frame);
      })
  );
}

export default animateOne;
