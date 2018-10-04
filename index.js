const curry = require("lodash.curry");
const flow = require("lodash.flow");

const addBundleVisualizer = (options = {}) => config => {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

  config.plugins.push(
    new BundleAnalyzerPlugin(
      Object.assign(
        {
          analyzerMode: "static",
          reportFilename: "report.html"
        },
        options
      )
    )
  );
  return config;
};

const addBabelPlugin = plugin => config => {
  const babelLoaderFilter = rule => rule.loader && rule.loader.includes("babel") && rule.options && rule.options.plugins;

  // First, try to find the babel loader inside the oneOf array.
  // This is where we can find it when working with react-scripts@2.0.3.
  let loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

  let babelLoader = loaders.find(babelLoaderFilter);

  // If the loader was not found, try to find it inside of the "use" array, within the rules.
  // This should work when dealing with react-scripts@2.0.0.next.* versions.
  if (!babelLoader) {
    loaders = loaders.reduce((ldrs, rule) => ldrs.concat(rule.use || []), []);
    babelLoader = loaders.find(babelLoaderFilter);
  }

  babelLoader.options.plugins.push(plugin);

  return config;
};

const addDecoratorsLegacy = () => config => addBabelPlugin(["@babel/plugin-proposal-decorators", { legacy: true }])(config);

const disableEsLint = () => config => {
  let eslintRules = config.module.rules.filter(r => r.use && r.use.some(u => u.options && u.options.useEslintrc != void 0));
  eslintRules.forEach(rule => {
    config.module.rules = config.module.rules.filter(r => r !== rule);
  });
  return config;
};

const addWebpackAlias = alias => config => {
  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  Object.assign(config.resolve.alias, alias);
  return config;
};

const override = (...plugins) => config => flow(...plugins.map(f => f || (a => a)))(config);

module.exports = {
  override,
  addBundleVisualizer,
  addBabelPlugin,
  addDecoratorsLegacy,
  disableEsLint,
  addWebpackAlias
};
