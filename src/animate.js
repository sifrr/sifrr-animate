const animateOne = require('./animateone');

function animate({
  targets,
  target,
  to, // object or function
  time, // number or function
  type,
  onUpdate,
  round,
  delay // number or function
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
        promises.push(animateOne({
          target: tg,
          prop,
          to: final,
          time: ntime,
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
  let numTo = to, numDelay = delay, numTime = time;
  return Promise.all(targets.map((target, i) => {
    if (typeof to === 'function') numTo = to(i);
    if (typeof delay === 'function') numDelay = delay(i);
    if (typeof time === 'function') numTime = time(i);
    return iterate(target, numTo, numDelay, numTime);
  }));
}

animate.types = require('./types');
animate.wait = require('./wait');
animate.animate = animate;

module.exports = animate;
