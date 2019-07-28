import animateOne, { animFxn } from './animateone';
import * as types from './types';
import wait from './wait';

// types and interfaces
type numFxn = (a: number) => number;
type numberOrFxn = number | numFxn | any; // any because bind/call is not type safe
type animateOpts = {
  targets: HTMLElement[];
  target: HTMLElement;
  to: object | ((a: number) => object);
  time: numberOrFxn;
  type: animFxn;
  onUpdate: any;
  round: boolean;
  finalPercent: numberOrFxn;
  initialPercent: numberOrFxn;
  delay: numberOrFxn;
};
////

function animate({
  targets,
  target,
  to,
  time,
  type,
  onUpdate,
  round,
  finalPercent,
  initialPercent,
  delay
}: animateOpts): Promise<boolean[][]> {
  targets = targets ? Array.from(targets) : [target];
  function iterate(
    tg: HTMLElement,
    props: object,
    d: number,
    ntime: number,
    fp: number,
    bp: number
  ) {
    const promises = [];
    for (let prop in props) {
      let from, final;
      if (Array.isArray(props[prop])) [from, final] = props[prop];
      else final = props[prop];
      if (typeof props[prop] === 'object' && !Array.isArray(props[prop])) {
        promises.push(iterate(tg[prop], props[prop], d, ntime, fp, bp));
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
            delay: d,
            finalPercent: fp,
            initialPercent: bp
          })
        );
      }
    }
    return Promise.all(promises);
  }
  let numTo = to,
    numDelay = delay,
    numTime = time,
    numPer = finalPercent,
    befPer = initialPercent;
  return Promise.all(
    targets.map((target, i) => {
      if (typeof to === 'function') numTo = to.call(target, i);
      if (typeof delay === 'function') numDelay = delay.call(target, i);
      if (typeof time === 'function') numTime = time.call(target, i);
      if (typeof finalPercent === 'function')
        numPer = finalPercent.call(target, i);
      if (typeof initialPercent === 'function')
        befPer = initialPercent.call(target, i);
      return iterate(target, numTo, numDelay, numTime, numPer, befPer);
    })
  );
}

export { types, wait, animate, animateOne };
export function keyframes(arrOpts: animateOpts[]): Promise<any> {
  let promise = Promise.resolve(null);
  arrOpts.forEach(opts => {
    if (Array.isArray(opts))
      promise = promise.then(() => Promise.all(opts.map(animate)));
    promise = promise.then(() => animate(opts));
  });
  return promise;
}
export const loop = (fxn: Function) => fxn().then(() => loop(fxn));
