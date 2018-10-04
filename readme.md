# customize-cra

This project piggybacks on [`react-app-rewired`](https://github.com/timarney/react-app-rewired/) to customize create-react-app for version 2.0 and higher.

---

To be clear, you need to use this project with `react-app-rewired`; be sure to read their docs if you never have. The code in this project, documented below, is designed to work inside of `react-app-rewired`'s `config-overrides.js` file.

---

To start, this project will export methods I need for what I'm using CRA for, but PRs will of course be welcome.

The functions documented below can be imported by name, and used in your `config-overrides.js` file, as explained below.

```js
const { addDecoratorsLegacy } = require("customize-cra");
```

## Warning

> "Stuff can break"
> \- Dan Abramov

Using this library will override default behavior and configuration of create-react-app, and therefore invalidate the guarentees that come with it. Use with discretion!

## Available plugins

### addBabelPlugin(plugin)

Adds a babel plugin. Not sure what else to say here.

### addDecoratorsLegacy()

Add decorators in legacy mode. Be sure to have `@babel/plugin-proposal-decorators` installed.

### disableEsLint()

Does what it says. You may need this along with `addDecoratorsLegacy` in order to get decorators and exports to parse together.

### addWebpackAlias(alias)

Adds the provided alias info into webpack's alias section. Pass an object literal with as many entries as you'd like, and the whole object will be merged in.

### addBundleVisualizer(options)

Adds the bundle visualizer plugin to your webpack config. Be sure to have `webpack-bundle-analyzer` installed. By default, the options passed to the plugin will be

```js
{
  analyzerMode: "static",
  reportFilename: "report.html"
}
```

which can be overridden with the (optional) options argument.

## Using the plugins

To use these plugins, import the `override` function, and call it with whatever plugins you need. Each of these plugin invocations will return a new function, that `override` will call with the newly modified config object. This means that if you need to conditionally apply any of these plugins, just provide a lambda that receives the config object, and conditionally invoke a plugin as needed, being sure to call it twice.

For example

```js
const { override, addDecoratorsLegacy, disableEsLint, addBundleVisualizer, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  config => (process.env.BUNDLE_VISUALIZE == 1 ? addBundleVisualizer()(config) : config),
  addWebpackAlias({ ["ag-grid-react$"]: path.resolve(__dirname, "src/shared/agGridWrapper.js") })
);
```

## MobX Users

If you want CRA 2 to work with MobX, use the `addDecoratorsLegacy` and `disableEsLint`.
