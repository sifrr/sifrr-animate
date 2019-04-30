const Bezier = require('./bezier');
const types = require('./types');
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
      fromNums.push(Number(fromSplit[i]));
      diffs.push(n - (Number(fromSplit[i]) || 0));
    }
  }
  type = typeof type === 'function' ? type : new Bezier(types[type] || type);

  return new Promise(res => {
    let startTime;
    function frame(currentTime) {
      startTime = startTime || currentTime;
      const percent = (currentTime - startTime) / time, bper = type(percent);
      if (percent >= 1) {
        target[prop] = to;
        return res();
      }
      const next = diffs.map((d, i) => {
        if (round) return Math.round(bper * d + (fromNums[i] || 0));
        return bper * d + (fromNums[i] || 0);
      });
      const val = String.raw({ raw }, ...next);
      target[prop] = Number(val) || val;
      if (onUp) onUpdate(target, prop, val);
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  });
}

module.exports = animateOne;
