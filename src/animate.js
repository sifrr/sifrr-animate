import animateOne from './animateone';
import * as types from './types';
import wait from './wait';

function animate({
  targets,
  target,
  to, // object or function
  time, // number or function
  type,
  onUpdate,
  round,
  finalPercent,
  beforePercent,
  delay // number or function
}) {
  targets = targets ? Array.from(targets) : [target];
  function iterate(tg, props, d, ntime, fp, bp) {
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
            beforePercent: bp
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
    befPer = beforePercent;
  return Promise.all(
    targets.map((target, i) => {
      if (typeof to === 'function') numTo = to.call(target, i);
      if (typeof delay === 'function') numDelay = delay.call(target, i);
      if (typeof time === 'function') numTime = time.call(target, i);
      if (typeof finalPercent === 'function')
        numPer = finalPercent.call(target, i);
      if (typeof beforePercent === 'function')
        befPer = beforePercent.call(target, i);
      return iterate(target, numTo, numDelay, numTime, numPer, befPer);
    })
  );
}

export { types, wait, animate, animateOne };
export function keyframes(arrOpts) {
  let promise = Promise.resolve(true);
  arrOpts.forEach(opts => {
    if (Array.isArray(opts))
      promise = promise.then(() => Promise.all(opts.map(animate)));
    promise = promise.then(() => animate(opts));
  });
  return promise;
}
export const loop = fxn => fxn().then(() => loop(fxn));
