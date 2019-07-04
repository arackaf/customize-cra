const flow = require("lodash.flow");

const getBabelLoader = config => {
  const babelLoaderFilter = rule =>
    rule.loader &&
    rule.loader.includes("babel") &&
    rule.options &&
    rule.options.plugins;

  // First, try to find the babel loader inside the oneOf array.
  // This is where we can find it when working with react-scripts@2.0.3.
  let loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    .oneOf;

  let babelLoader = loaders.find(babelLoaderFilter);

  // If the loader was not found, try to find it inside of the "use" array, within the rules.
  // This should work when dealing with react-scripts@2.0.0.next.* versions.
  if (!babelLoader) {
    loaders = loaders.reduce((ldrs, rule) => ldrs.concat(rule.use || []), []);
    babelLoader = loaders.find(babelLoaderFilter);
  }
  return babelLoader;
};

const override = (...plugins) => flow(...plugins.filter(f => f));

// Use this helper to override the webpack dev server settings
//  it works just like the `override` utility
const overrideDevServer = (...plugins) => configFunction => (
  proxy,
  allowedHost
) => {
  const config = configFunction(proxy, allowedHost);
  const updatedConfig = override(...plugins)(config);
  return updatedConfig;
};

module.exports = { getBabelLoader, override, overrideDevServer };
