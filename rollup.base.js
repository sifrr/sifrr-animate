const path = require('path');
const version = require('./package.json').version;
const babel = require('rollup-plugin-babel');
const terser = require('rollup-plugin-terser').terser;
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const cleanup = require('rollup-plugin-cleanup');
const postcss = require('rollup-plugin-postcss');
const html = require('rollup-plugin-html');

const footer = '/*! (c) @aadityataparia */';

function moduleConfig(name, root, min = false, isModule = false) {
  const filename = name.toLowerCase();
  const banner = `/*! ${name} v${version} - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */`;
  const ret = {
    input: path.join(root, `./src/animate.js`),
    output: {
      file: path.join(root, `./dist/${filename + (isModule ? '.module' : '') + (min ? '.min' : '')}.js`),
      format: isModule ? 'es' : 'umd',
      name: name,
      banner: banner,
      footer: footer,
      sourcemap: !min,
      preferConst: true
    },
    plugins: [
      resolve({
        browser: !isModule,
        mainFields: ['module', 'main']
      }),
      commonjs(),
      postcss({
        extensions: ['.css', '.scss', '.sass', '.less'],
        inject: false,
        plugins: [
          min ? require('cssnano')({
            preset: [ 'default', { discardComments: false } ],
          }) : false
        ].filter(k => k)
      }),
      html({
        htmlMinifierOptions: min ? {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          conservativeCollapse: true,
          minifyJS: true
        } : {}
      })
    ]
  };

  if (!isModule) {
    ret.plugins.push(babel({
      exclude: 'node_modules/**',
      rootMode: 'upward'
    }));
  }

  ret.plugins.push(cleanup());

  if (min) {
    ret.plugins.push(terser({
      output: {
        comments: 'all'
      }
    }));
  }

  return ret;
}

module.exports = (name, __dirname, isBrowser = true) => {
  let ret = [];
  if (isBrowser) {
    ret = [
      moduleConfig(name, __dirname),
      moduleConfig(name, __dirname, true)
    ];
  }
  ret.push(moduleConfig(name, __dirname, false, true));

  return ret;
};
