# customize-cra

This project piggybacks on [`react-app-rewired`](https://github.com/timarney/react-app-rewired/) to customize create-react-app for version 2.0 and higher.

## How to install

⚠️ make sure you have [react-app-rewired](https://github.com/timarney/react-app-rewired/) installed. You need to use this project with `react-app-rewired`; be sure to read their docs if you never have. The code in this project, documented below, is designed to work inside of `react-app-rewired`'s `config-overrides.js` file.

### npm

```bash
npm install customize-cra --save-dev
```

### yarn

```bash
yarn add customize-cra --dev
```

## Warning

> "Stuff can break"
> \- Dan Abramov

Using this library will override default behavior and configuration of create-react-app, and therefore invalidate the guarantees that come with it. Use with discretion!

## Overview

To start, this project will export methods I need for what I'm using CRA for, but PRs will of course be welcome.

The functions documented below can be imported by name, and used in your `config-overrides.js` file, as explained below.

## Available plugins

### addBabelPlugin(plugin)

Adds a babel plugin. Whatever you pass for `plugin` will be added to Babel's `plugins` array. Consult their docs for more info.

### addBabelPlugins(plugins)

A simple helper that calls `addBabelPlugin` for each plugin you pass in here. Make sure you use the spread operator when using this, for example

```js
module.exports = override(
  disableEsLint(),
  ...addBabelPlugins("polished", "emotion", "babel-plugin-transform-do-expressions"),
  fixBabelImports("lodash", {
    libraryDirectory: "",
    camel2DashComponentName: false
  }),
  fixBabelImports("react-feather", {
    libraryName: "react-feather",
    libraryDirectory: "dist/icons"
  })
);
```

### fixBabelImports(libraryName, options)

Adds the [babel-plugin-import plugin](https://www.npmjs.com/package/babel-plugin-import). See above for an example.

### addDecoratorsLegacy()

Add decorators in legacy mode. Be sure to have `@babel/plugin-proposal-decorators` installed.

### disableEsLint()

Does what it says. You may need this along with `addDecoratorsLegacy` in order to get decorators and exports to parse together.

### useEslintRc()

Causes your .eslintrc file to be used, rather than the config cra ships with.

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

### adjustWorkbox(fn)

Adjusts Workbox configuration. Pass a function which will be called with the current Workbox configuration, in which you can mutate the config object as needed. See below for an example.

```js
adjustWorkbox(wb => Object.assign(wb, { skipWaiting: true, exclude: (wb.exclude || []).concat("index.html") }));
```

## Using the plugins

To use these plugins, import the `override` function, and call it with whatever plugins you need. Each of these plugin invocations will return a new function, that `override` will call with the newly modified config object. Falsy values will be ignored though, so if you need to conditionally apply any of these plugins, you can do so like below.

For example

```js
const { override, addDecoratorsLegacy, disableEsLint, addBundleVisualizer, addWebpackAlias, adjustWorkbox } = require("customize-cra");
const path = require("path");

module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),
  addWebpackAlias({ ["ag-grid-react$"]: path.resolve(__dirname, "src/shared/agGridWrapper.js") }),
  adjustWorkbox(wb => Object.assign(wb, { skipWaiting: true, exclude: (wb.exclude || []).concat("index.html") }))
);
```

## MobX Users

If you want CRA 2 to work with MobX, use the `addDecoratorsLegacy` and `disableEsLint`.
