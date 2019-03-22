// This will remove the CRA plugin that prevents to import modules from
// outside the `src` directory, useful if you use a different directory
const removeModuleScopePlugin = () => config => {
  config.resolve.plugins = config.resolve.plugins.filter(
    p => p.constructor.name !== "ModuleScopePlugin"
  );
  return config;
};

module.exports = removeModuleScopePlugin;
