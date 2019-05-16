class Animator {
  // loop any function that return promise
  static loop(fxn) {
    fxn().then(() => this.loop(fxn));
  }

  constructor() {
    this.promise = Promise.resolve(true);
  }

  // Runs animation after all previous animations have completed
  // opts = Sifrr.animate options object or array of options object. If array is given, all animations are run concurrently
  next(opts) {
    this.promise = this.promise.then(() => this.animate(opts));
    return this;
  }

  // runs animation instantly
  now(opts) {
    this.promise = Promise.all([this.promise, this.animate(opts)]);
    return this;
  }

  // loops animation
  loop(opts) {
    this.constructor.loop(() => this.animate(opts));
    return this;
  }

  // loops timeline
  loopTimeline(optsArray) {
    this.constructor.loop(() => this.timeline(optsArray));
    return this;
  }

  // runs animation but not in same timeline
  animate(opts) {
    if (Array.isArray(opts)) return Promise.all(opts.map((o) => {
      if (Array.isArray(o)) {
        let promise = Promise.resolve(true);
        o.forEach(o1 => {
          promise = promise.then(() => Sifrr.animate(o1));
        });
        return promise;
      }
      return Sifrr.animate(o);
    }));
    return Sifrr.animate(opts);
  }

  // animate a timeline, optsArray = array of opts
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
