const Bezier = require('./bezier');
const types = require('./types');
const wait = require('./wait');
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
  delay = 0 // number
}) {
  const toSplit = to.toString().split(digitRgx), l = toSplit.length, raw = [], fromNums = [], diffs = [];
  const fromSplit = (from || target[prop] || '').toString().split(digitRgx);
  const onUp = typeof onUpdate === 'function';
  for (let i = 0; i < l; i++) {
    const fn = Number(fromSplit[i]) || 0;
    let tn = Number(toSplit[i]);
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
    }
    if (isNaN(tn) || !toSplit[i]) raw.push(toSplit[i]);
    else {
      fromNums.push(fn);
      diffs.push(tn - fn);
    }
  }

  const rawObj = { raw };
  return wait(delay).then(() => new Promise((resolve, reject) => {
    if (types[type]) type = types[type];
    if (Array.isArray(type)) type = new Bezier(type);
    else if (typeof type !== 'function') return reject(Error('type should be one of ' + Object.keys(types).toString() + ' or Bezier Array or Function, given ' + type));

    let startTime;
    const frame = function(currentTime) {
      startTime = startTime || currentTime - 17;
      const percent = (currentTime - startTime) / time, bper = type(percent >= 1 ? 1 : percent);
      const next = diffs.map((d, i) => {
        const n = bper * d + fromNums[i];
        return round ? Math.round(n) : n;
      });
      const val = String.raw(rawObj, ...next);
      try {
        target[prop] = Number(val) || val;
        if (onUp) onUpdate(target, prop, target[prop]);
        if (percent >= 1) resolve(frames.delete(frame));
      } catch(e) {
        frames.delete(frame);
        reject(e);
      }
    };
    frames.add(frame);
  }));
}

module.exports = animateOne;
