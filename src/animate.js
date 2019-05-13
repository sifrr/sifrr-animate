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
  let numDelay = delay;
  function iterate(t, props, index) {
    if (typeof delay === 'function') numDelay = delay(index);
    const promises = [];
    for (let prop in props) {
      let from, final;
      if (Array.isArray(props[prop])) [from, final] = props[prop];
      else final = props[prop];
      if (typeof props[prop] === 'object' && !Array.isArray(props[prop])) {
        promises.push(iterate(t[prop], props[prop], index));
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
          delay: numDelay
        }));
      }
    }
    return Promise.all(promises);
  }
  let numTo;
  return Promise.all(targets.map((target, i) => {
    numTo = to;
    if (typeof to === 'function') numTo = to(i);
    return iterate(target, numTo, i);
  }));
}

animate.types = require('./types');
animate.wait = require('./wait');
animate.animate = animate;

module.exports = animate;
