const path = require('path');

const { getRollupConfig } = require('@sifrr/dev');
const footer = '/*! (c) @aadityataparia */';

function moduleConfig(name, root, minify = false, isModule = false) {
  const banner = `/*! sifrr-animate v${
    require('./package.json').version
  } - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-animate */`;
  return getRollupConfig(
    {
      name,
      inputFile: path.join(root, `./src/animate.js`),
      outputFolder: path.join(root, './dist'),
      outputFileName: 'sifrr.animate',
      minify,
      type: isModule ? 'module' : 'browser'
    },
    {
      output: {
        banner,
        footer
      }
    }
  );
}

module.exports = [
  moduleConfig('Sifrr.animate', __dirname),
  moduleConfig('Sifrr.animate', __dirname, true),
  moduleConfig('Sifrr.animate', __dirname, false, true)
];
