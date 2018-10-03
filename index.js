const curry = require("lodash.curry");
const flow = require("lodash.flow");

const addBundleVisualizer = () => config => {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "report.html"
    })
  );
  return config;
};

function addBabelPlugin(plugin) {
  return function(config) {
    const babelLoader = config.module.rules
      .find(rule => Object.keys(rule).includes('oneOf'))
      .oneOf.find(
        rule =>
          rule.loader &&
          rule.loader.includes('babel-loader') &&
          rule.options.customize
      )

    babelLoader.options.plugins.push(plugin)

    return config
  }
}

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

const override = (...pipeline) => (config, env) => flow(
  ...pipeline.map(f => {

    const curried = curry(f, 2);
    return curried(curry.placeholder, env);
  })
)(config);

module.exports = {
  override,
  addBundleVisualizer,
  addBabelPlugin,
  addDecoratorsLegacy,
  disableEsLint,
  addWebpackAlias
};
