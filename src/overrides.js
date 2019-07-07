const flow = require("lodash.flow");

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

module.exports = { override, overrideDevServer };
