const addWebpackResolve = resolve => config => {
  if (!config.resolve) {
    config.resolve = {};
  }
  Object.assign(config.resolve, resolve);
  return config;
};

module.exports = addWebpackResolve;
