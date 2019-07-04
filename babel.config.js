module.exports = function(api) {
  api.cache(true);
  const presets = [
    [
      '@babel/env',
      {
        targets: require('./package.json').browserslist
      }
    ]
  ];

  return {
    presets
  };
};
