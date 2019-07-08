import flow from "lodash.flow";

export const override = (...plugins) => flow(...plugins.filter(f => f));

// Use this helper to override the webpack dev server settings
//  it works just like the `override` utility
export const overrideDevServer = (...plugins) => configFunction => (
  proxy,
  allowedHost
) => {
  const config = configFunction(proxy, allowedHost);
  const updatedConfig = override(...plugins)(config);
  return updatedConfig;
};
