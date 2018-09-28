# customize-cra

This project piggybacks on `react-app-rewired` to customize create-react-app for version 2.0 and higher.

To start, this project will export methods I need for what I'm using CRA for, but PRs will of course be welcome.

The functions documented below can be imported by name, and used in your config-overrides.js file, ie

```js
const { addDecoratorsLegacy } = require("customize-cra");
```

## Docs

### addBabelPlugin(plugin, config, env)

Adds a babel plugin. Not sure what else to say here.

### addDecoratorsLegacy(config, env)

Add decorators in legacy mode. Be sure to have `@babel/plugin-proposal-decorators` installed.

### disableEsLint(config, env)

Does what it says. You may need this along with `addDecoratorsLegacy` in order to get decorators and exports to parse together.

### addBundleVisualizer(config)

Adds the bundle visualizer plugin to your webpack config. Be sure to have `webpack-bundle-analyzer` installed.

## MobX Users

If you want CRA 2 to work with MobX, this should get you going.

```js
const { addDecoratorsLegacy, disableEsLint } = require("customize-cra");

module.exports = function override(config, env) {
  addDecoratorsLegacy(config, env);
  disableEsLint(config, env);

  return config;
};
```
