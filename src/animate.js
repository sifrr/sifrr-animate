const animateOne = require('./animateone');

function animate({
  targets,
  target,
  to, // object or function
  time,
  type,
  onUpdate,
  round,
  delay // number or function
}) {
  targets = targets ? Array.from(targets) : [target];
  function iterate(t, props, d) {
    const promises = [];
    for (let prop in props) {
      let from, final;
      if (Array.isArray(props[prop])) [from, final] = props[prop];
      else final = props[prop];
      if (typeof props[prop] === 'object' && !Array.isArray(props[prop])) {
        promises.push(iterate(t[prop], props[prop], d));
      } else {
        promises.push(animateOne({
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
  let numTo = to, numDelay = delay;
  return Promise.all(targets.map((target, i) => {
    if (typeof to === 'function') numTo = to(i);
    if (typeof delay === 'function') numDelay = delay(i);
    return iterate(target, numTo, numDelay);
  }));
}

animate.types = require('./types');
animate.wait = require('./wait');
animate.animate = animate;

module.exports = animate;
