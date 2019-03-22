const getBabelLoader = require("../utilities/getBabelLoader");

const addBabelPlugin = plugin => config => {
  getBabelLoader(config).options.plugins.push(plugin);
  return config;
};

module.exports = addBabelPlugin;
