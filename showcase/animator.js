class Animator {
  constructor() {
    this.promise = Promise.resolve(true);
  }

  next(opts) {
    this.promise = this.promise.then(() => this.animate(opts));
    return this;
  }

  now(opts) {
    this.promise = Promise.all([this.promise, this.animate(opts)]);
    return this;
  }

  loop(opts) {
    this.animate(opts).then(() => this.loop(opts));
  }

  loopTimeline(optsArray) {
    this.timeline(optsArray).then(() => this.loopTimeline(optsArray));
  }

  animate(opts) {
    if (Array.isArray(opts)) return Promise.all(opts.map((o) => Sifrr.animate(o)));
    return Sifrr.animate(opts);
  }

  timeline(optsArray) {
    let promise = Promise.resolve(true);
    optsArray.forEach(opts => {
      promise = promise.then(() => this.animate(opts));
    });
    return promise;
  }

  then(fxn) {
    this.promise = this.promise.then(fxn);
    return this;
  }

  catch(fxn) {
    this.promise = this.promise.catch(fxn);
    return this;
  }
}

window.Animator = Animator;
