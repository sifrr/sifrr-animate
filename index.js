const animate = require('./src/animate');
const types = require('./src/types');
animate.types = types;

module.exports = {
  animate,
  wait: function(time = 0) {
    return new Promise(res => setTimeout(res, time));
  }
};
