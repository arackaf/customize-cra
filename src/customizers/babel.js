const { getBabelLoader } = require("../utilities");

const addBabelPlugin = plugin => config => {
  getBabelLoader(config).options.plugins.push(plugin);
  return config;
};

const addBabelPreset = preset => config => {
  getBabelLoader(config).options.presets.push(preset);
  return config;
};

const addDecoratorsLegacy = () => config =>
  addBabelPlugin(["@babel/plugin-proposal-decorators", { legacy: true }])(
    config
  );

const useBabelRc = () => config => {
  getBabelLoader(config).options.babelrc = true;
  return config;
};

const babelInclude = include => config => {
  getBabelLoader(config).include = include;
  return config;
};

const addBabelPlugins = (...plugins) => plugins.map(p => addBabelPlugin(p));

const addBabelPresets = (...plugins) => plugins.map(p => addBabelPreset(p));

const fixBabelImports = (libraryName, options) =>
  addBabelPlugin([
    "import",
    Object.assign(
      {},
      {
        libraryName
      },
      options
    ),
    `fix-${libraryName}-imports`
  ]);

module.exports = {
  addBabelPlugin,
  addBabelPlugins,
  addDecoratorsLegacy,
  addBabelPreset,
  addBabelPresets,
  fixBabelImports,
  useBabelRc,
  babelInclude
};
