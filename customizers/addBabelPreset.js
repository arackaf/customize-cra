const getBabelLoader = require("../utilities/getBabelLoader");

const addBabelPreset = preset => config => {
  getBabelLoader(config).options.presets.push(preset);
  return config;
};

module.exports = addBabelPreset;
