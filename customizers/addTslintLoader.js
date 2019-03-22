const addTslintLoader = options => config => {
  config.module.rules.unshift({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("tslint-loader"),
    options,
    enforce: "pre"
  });
  return config;
};

module.exports = addTslintLoader;
