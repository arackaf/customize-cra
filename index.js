function addBundleVisualizer(config) {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "report.html"
    })
  );
}

function addBabelPlugin(plugin, config, env) {
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
}

function addDecoratorsLegacy(config, env) {
  addBabelPlugin(["@babel/plugin-proposal-decorators", { legacy: true }], config, env);
}

function disableEsLint(config, env) {
  let eslintRules = config.module.rules.filter(r => r.use && r.use.some(u => u.options && u.options.useEslintrc != void 0));
  eslintRules.forEach(rule => {
    config.module.rules = config.module.rules.filter(r => r !== rule);
  });
}

module.exports = {
  addBundleVisualizer,
  addBabelPlugin,
  addDecoratorsLegacy,
  disableEsLint
};
