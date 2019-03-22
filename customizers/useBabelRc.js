const getBabelLoader = require("../utilities/getBabelLoader");

const useBabelRc = () => config => {
  getBabelLoader(config).options.babelrc = true;
  return config;
};

module.exports = useBabelRc;
