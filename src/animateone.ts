import Bezier from './bezier';
import wait from './wait';
import * as types from './types';

// Types and interfaces
interface frameFunction {
  (time: number): void;
}
export type animFxn = (x: number) => number;

const digitRgx = /((?:[+\-*/]=)?-?\d+\.?\d*)/;
const frames: Set<frameFunction> = new Set();

////
function runFrames(currentTime: number) {
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
  initialPercent = 0,
  delay = 0 // number
}: {
  target: HTMLElement;
  prop: string;
  from: any;
  to: any;
  time: number;
  type: string | [number, number, number, number] | animFxn;
  onUpdate(target: HTMLElement, prop: string, val: any): void;
  round: boolean;
  finalPercent: number;
  initialPercent: number;
  delay: number;
}) {
  const toSplit = to.toString().split(digitRgx),
    l = toSplit.length,
    raw: string[] = [],
    fromNums: number[] = [],
    diffs: number[] = [];
  const fromSplit: any[] = (from || target[prop] || '')
    .toString()
    .split(digitRgx);
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

  const reverse = finalPercent < initialPercent;
  return wait(delay).then(
    () =>
      new Promise((resolve, reject) => {
        let typeFxn: animFxn;
        if (typeof type === 'string') typeFxn = types[type];
        if (Array.isArray(type)) typeFxn = Bezier.fromArray(type);
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
          percent = initialPercent;
        const frame: frameFunction = function(currentTime) {
          percent = reverse
            ? percent - (currentTime - lastTime) / time
            : percent + (currentTime - lastTime) / time;
          lastTime = currentTime;
          const bper = reverse
            ? typeFxn(Math.max(percent, finalPercent))
            : typeFxn(Math.min(percent, finalPercent));
          const next = diffs.map((d, i) => {
            const n = bper * d + fromNums[i];
            return round ? Math.round(n) : n;
          });
          const val = raw
            .map((chunk, i) => {
              if (raw.length <= i) {
                return chunk;
              }
              return next[i - 1] ? next[i - 1] + chunk : chunk;
            })
            .join('');
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
