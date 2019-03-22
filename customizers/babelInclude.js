const getBabelLoader = require("../utilities/getBabelLoader");

const babelInclude = include => config => {
  getBabelLoader(config).include = include;
  return config;
};

module.exports = babelInclude;
