const animate = require('./src/animate');
const types = require('./src/types');

module.exports = {
  animate,
  types,
  wait: function(time = 0) {
    return new Promise(res => setTimeout(res, time));
  }
};
