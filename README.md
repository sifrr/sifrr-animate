# sifrr-animate · [![npm version](https://img.shields.io/npm/v/@sifrr/animate.svg)](https://www.npmjs.com/package/@sifrr/animate)

<p align="center">
  <a href="https://github.com/sifrr/sifrr-animate/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="GitHub license" /></a>
  <a href="https://circleci.com/gh/sifrr/sifrr-animate"><img alt="CircleCI" src="https://img.shields.io/circleci/project/github/sifrr/sifrr-animate/master.svg?logo=circleci&style=flat-square" /></a>
  <a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fsifrr%2Fsifrr-animate?ref=badge_small" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsifrr%2Fsifrr-animate.svg?type=small"/></a>
  <a href="https://coveralls.io/github/sifrr/sifrr-animate?branch=master"><img src="https://img.shields.io/coveralls/github/sifrr/sifrr-animate.svg?style=flat-square" alt="Coverage Status" /></a>
  <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/sifrr/sifrr-animate.svg?style=flat-square" alt="Greenkeeper badge" /></a>
</p>

> ~1kb library to Animate any mutable object properties using requestAnimationFrame with promise based API.

Alternative to [anime.js](https://github.com/juliangarnier/anime) for basic animations.

**Note**: Since it uses requestAnimationFrame, actual time taken to animate can vary +-1 frame (~17ms)

```js
const { animate, wait } = require('@sifrr/elements');

animate({
  target: ,
  targets: ,
  to: { // exmaple
    prop1: 'to1',
    prop2: 'to2',
    porp3: ['from3', 'to3'],
    style: { // multi level properties example
      width: '100px'
    }
  },
  time: 300,
  type: 'ease',
  round: false,
  onUpdate: () => {}
}).then(() => {
  // do something after animation is complete
})

// animate after waiting for 1 second
wait(1000 /* in ms */).then(() => {
  animate({...});
})
```

-   `target(s)` - object(s) whose properties you want to animate, target is single object, targets is array of object
-   `to` - properties with final values you want to animate to
-   `time` - time taken to animate
-   `type` - type of animation (pre added: \['linear', 'ease', 'easeIn', 'easeOut', 'easeInOut'])
-   `round` - round off animated values or not
-   `onUpdate` - this function will be called on update with arguments `object`, `property`, `currentValue`, doing heavy lifting here can cause laggy animation

If from values are not given (or object doesn't have that property), they will start from 0.

You can add more types using bezier function values:

```js
const { types } = require('@sifrr/elements');

types['name'] = [.42, 0, .58, 1]; // bezier array
```

type can also be a bezier array, function which takes x value between (0,1) and returns corresponding y value.

#### Format

Property's current/from value and to value should be of same format.

-   Number
-   string with multiple numbers to animate, examples:
    -   '123'
    -   'p123'
    -   '123s'
    -   'abcd 1234 fed 45'
    -   'aaaaaa123aaaa123aaaaaa123aaaaaa'

## Standalone files

```html
<script src="https://unpkg.com/@sifrr/animate@{version}/dist/sifrr.animate.min.js"></script>
// for v0.0.3, version = 0.0.3
```

then use

```js
Sifrr.animate({...});
Sifrr.animate.wait(100);
Sifrr.animate.types;
```

## Examples

<https://sifrr.github.io/sifrr-animate/showcase/>
