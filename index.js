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

const addBabelPlugin = plugin => config => {
  let rulesWithBabel = config.module.rules.filter(
    r => r.oneOf && r.oneOf.some(r => Array.isArray(r.use) && r.use.some(u => u.options && u.options.babelrc != void 0))
  );

  for (let rb of rulesWithBabel) {
    for (let r of rb.oneOf) {
      if (r.use) {
        for (let u of r.use) {
          if (u.options && u.options.babelrc != void 0) {
            u.options.plugins = (u.options.plugins || []).concat([plugin]);
          }
        }
      }
    }
  }
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

const override = (...pipeline) => (config, env) =>
  flow(
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
