const path = require('path');

const { getRollupConfig } = require('@sifrr/dev');
const footer = '/*! (c) @aadityataparia */';

function moduleConfig(name, root, minify = false, type) {
  const banner = `/*! sifrr-animate v${
    require('./package.json').version
  } - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-animate */`;
  return getRollupConfig(
    {
      name,
      inputFile: path.join(root, `./src/animate.ts`),
      outputFolder: path.join(root, './dist'),
      outputFileName: 'sifrr.animate',
      minify,
      type
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
  moduleConfig('Sifrr.animate', __dirname, true, ['browser']),
  moduleConfig('Sifrr.animate', __dirname, false, ['browser', 'cjs'])
];
