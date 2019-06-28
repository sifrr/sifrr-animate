# sifrr-animate · [![npm version](https://img.shields.io/npm/v/@sifrr/animate.svg)](https://www.npmjs.com/package/@sifrr/animate)

<p align="center">
  <a href="https://github.com/sifrr/sifrr-animate/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="GitHub license" /></a>
  <a href="https://circleci.com/gh/sifrr/sifrr-animate"><img alt="CircleCI" src="https://img.shields.io/circleci/project/github/sifrr/sifrr-animate/master.svg?logo=circleci&style=flat-square" /></a>
  <a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fsifrr%2Fsifrr-animate?ref=badge_small" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsifrr%2Fsifrr-animate.svg?type=small"/></a>
  <a href="https://coveralls.io/github/sifrr/sifrr-animate?branch=master"><img src="https://img.shields.io/coveralls/github/sifrr/sifrr-animate.svg?style=flat-square" alt="Coverage Status" /></a>
  <a href="https://dependabot.com/"><img src="https://badgen.net/badge/Dependabot/enabled/green?icon=dependabot" alt="Dependabot badge" /></a>
</p>

> ~1kb library to Animate any mutable object's properties using requestAnimationFrame with promise based API.

This is a basic level library, which can be used to create complex animations as well like [anime.js](https://github.com/juliangarnier/anime), using keyframes, delay and loop.

**Note**: Since it uses requestAnimationFrame, actual time taken to animate can vary +1 frame (~17ms for 60fps)

## Size

| Type                                             |                                                                                                       Size                                                                                                       |
| :----------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Normal (`dist/sifrr.animate.js`)                 |                   [![Normal](https://img.badgesize.io/sifrr/sifrr-animate/master/dist/sifrr.animate.js?maxAge=600)](https://github.com/sifrr/sifrr-animate/blob/master/dist/sifrr.animate.js)                    |
| Minified (`dist/sifrr.animate.min.js`)           |              [![Minified](https://img.badgesize.io/sifrr/sifrr-animate/master/dist/sifrr.animate.min.js?maxAge=600)](https://github.com/sifrr/sifrr-animate/blob/master/dist/sifrr.animate.min.js)               |
| Minified + Gzipped (`dist/sifrr.animate.min.js`) | [![Minified + Gzipped](https://img.badgesize.io/sifrr/sifrr-animate/master/dist/sifrr.animate.min.js?compression=gzip&maxAge=600)](https://github.com/sifrr/sifrr-animate/blob/master/dist/sifrr.animate.min.js) |

## Examples

<https://sifrr.github.io/sifrr-animate/showcase/>

## Usage

```js
import { animate, wait } from '@sifrr/animate';

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
  time: 300, // default = 300
  type: 'spring', // default = 'spring' which is basically cosine curve
  round: false, // default = false
  onUpdate: () => {},
  delay: 1000 // animate after waiting for 1 second, default = 0
}).then(() => {
  // do something after animation is complete
})

// animate after waiting for 1 second
// same as delay, but for more control over animation timeframes
// You can create very complex animations using wait, animate and loops
wait(1000 /* in ms */).then(() => {
  animate({...});
})
```

- `target(s)` - object(s) whose properties you want to animate, target is single object, targets is array of object
- `to` - properties with final values you want to animate to.
- `time` - time taken to animate (in ms)
- `type` - type of animation (pre added: \['linear', 'ease', 'easeIn', 'easeOut', 'easeInOut', 'spring']). type can also be a bezier array or function which takes x value between (0,1) and returns corresponding y value.
- `round` - round off animated values or not
- `onUpdate` - this function will be called on update with arguments `object`, `property`, `currentValue`, doing heavy lifting here can cause laggy animation
- `delay` - (in miliseconds) number or function, delay before start of animation (in ms)
- `initialPercent` - (between 0 and 1) default `0`, initial x-percent value to start animation from
- `finalPercent` - (between 0 and 1) default `1`, final x-percent value to end animation at

If from values are not given (or object doesn't have that property), they will start from 0.
If a function for `time`, `delay`, `to`, `initialPercent` or `finalPercent` is given, it will be called with index of target to animate (starting from 0) and return value will be used as corresponding value for that target. `this` inside these functions is `target`.

You can add more types using bezier function values:

```js
import { types } from '@sifrr/animate';

types['customType'] = [.42, 0, .58, 1]; // bezier array
// then use
animate({ type: 'customType' ...})
```

### Format

Property's current/from value and to value should be of same format (strings around numbers should be same).

- Number
- string with multiple numbers to animate, examples:
  - '123'
  - 'p123'
  - '123s'
  - 'abcd 1234 fed 45'
  - 'aaaaaa123aaaa123aaaaaa123aaaaaa'

`OR`

Relative `to`, `to` can be relative number as well

- if from is `100px`, and to is `+=20px`, then final value will be `120px`
- if from is `100px`, and to is `-=20px`, then final value will be `80px`
- if from is `100px`, and to is `*=2px`, then final value will be `200px`
- if from is `100px`, and to is `/=5px`, then final value will be `20px`

## Advanced usages

```js
import { keyframes, loop } from '@sifrr/animate';

// each animateOpts1 is valid options object for animate function
// returns a promise that resolves after all the animations are complete
keyframes([animateOpts1, animateOpts2, [ animateOpts3, animateOpts4 ], animateOpts5]);

// this will execute the timeline:
// <---1--->
//          <---2--->
//                   <---3--->
//                   <---4--->
//                            <---5--->
//                                     Promise resolved

// loop will execute the function on loop consecutively after previous promise is resolved
loop(() => /* return any promise, eg. animate(...options), keyframes([...options]), etc */)
```

## Standalone files

```html
<script src="https://unpkg.com/@sifrr/animate@{version}/dist/sifrr.animate.min.js"></script>
// for v0.0.3, version = 0.0.3
```

then use

```js
Sifrr.animate.animate({...});
Sifrr.animate.keyframes([...]);
Sifrr.animate.wait(100);
Sifrr.animate.loop(() => {});
Sifrr.animate.types;
```

## CommonJs

```js
const { animate, types, keyframes, loop } = require('@sifrr/animate)
```
