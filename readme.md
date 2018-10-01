# customize-cra

This project piggybacks on `react-app-rewired` to customize create-react-app for version 2.0 and higher.

To start, this project will export methods I need for what I'm using CRA for, but PRs will of course be welcome.

The functions documented below can be imported by name, and used in your config-overrides.js file, ie

```js
const { addDecoratorsLegacy } = require("customize-cra");
```

## Warning

> "Stuff can break"
> \- Dan Abramov

Using this library will override default behavior and configuration of create-react-app, and therefore invalidate the guarentees that come with it. Use with discretion!

## Docs

### addBabelPlugin(plugin, config)

Adds a babel plugin. Not sure what else to say here.

### addDecoratorsLegacy(config)

Add decorators in legacy mode. Be sure to have `@babel/plugin-proposal-decorators` installed.

### disableEsLint(config)

Does what it says. You may need this along with `addDecoratorsLegacy` in order to get decorators and exports to parse together.

### addWebpackAlias(alias, config)

Adds the provided alias info into webpack's alias section. Pass an object literal with as many entries as you'd like, and the whole object will be merged in.

### addBundleVisualizer(config)

Adds the bundle visualizer plugin to your webpack config. Be sure to have `webpack-bundle-analyzer` installed.

## MobX Users

If you want CRA 2 to work with MobX, this should get you going.

```js
const { addDecoratorsLegacy, disableEsLint } = require("customize-cra");

module.exports = function override(config) {
  addDecoratorsLegacy(config);
  disableEsLint(config);

  return config;
};
```
