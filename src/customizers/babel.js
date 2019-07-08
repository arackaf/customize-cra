import { getBabelLoader } from "../utilities";

export const addBabelPlugin = plugin => config => {
  getBabelLoader(config).options.plugins.push(plugin);
  return config;
};

export const addBabelPreset = preset => config => {
  getBabelLoader(config).options.presets.push(preset);
  return config;
};

export const addDecoratorsLegacy = () => config =>
  addBabelPlugin(["@babel/plugin-proposal-decorators", { legacy: true }])(
    config
  );

export const useBabelRc = () => config => {
  getBabelLoader(config).options.babelrc = true;
  return config;
};

export const babelInclude = include => config => {
  getBabelLoader(config).include = include;
  return config;
};

export const addBabelPlugins = (...plugins) =>
  plugins.map(p => addBabelPlugin(p));

export const addBabelPresets = (...plugins) =>
  plugins.map(p => addBabelPreset(p));

export const fixBabelImports = (libraryName, options) =>
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
