const addPostcssPlugins = plugins => config => {
  const rules = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    .oneOf;
  rules.forEach(
    r =>
      r.use &&
      r.use.forEach(u => {
        if (u.options && u.options.ident === "postcss") {
          if (!u.options.plugins) {
            u.options.plugins = () => [...plugins];
          }
          if (u.options.plugins) {
            const originalPlugins = u.options.plugins;
            u.options.plugins = () => [...originalPlugins(), ...plugins];
          }
        }
      })
  );
  return config;
};

module.exports = addPostcssPlugins;
