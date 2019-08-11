import { getBabelLoader } from "../utilities";

export const addBabelPlugin = plugin => config => {
  const c = { ...config };
  getBabelLoader(c).options.plugins.push(plugin);
  return c;
};

export const addExternalBabelPlugin = plugin => config => {
  const c = { ...config };
  const outsideBabelOptions = getBabelLoader(c, true).options;
  if (!outsideBabelOptions.plugins) {
    outsideBabelOptions.plugins = [];
  }
  outsideBabelOptions.plugins.push(plugin);
  return c;
};

export const addBabelPreset = preset => config => {
  const c = { ...config };
  getBabelLoader(c).options.presets.push(preset);
  return c;
};

export const addDecoratorsLegacy = () => config => {
  const c = { ...config };
  return addBabelPlugin([
    "@babel/plugin-proposal-decorators",
    { legacy: true }
  ])(c);
};

export const useBabelRc = () => config => {
  const c = { ...config };
  getBabelLoader(c).options.babelrc = true;
  return c;
};

export const babelInclude = include => config => {
  const c = { ...config };
  getBabelLoader(c).include = include;
  return c;
};

/**
 * Replaces the `exclude` option of `babel-loader`.
 * @param exclude The new `exclude` value.
 */
export const babelExclude = exclude => config => {
  const c = { ...config };
  getBabelLoader(c).exclude = exclude;
  return c;
};

export const addBabelPlugins = (...plugins) =>
  plugins.map(p => addBabelPlugin(p));

export const addExternalBabelPlugins = (...plugins) =>
  plugins.map(p => addExternalBabelPlugin(p));

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
