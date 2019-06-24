# customize-cra

This project provides a set of utilities to customize the Create React App v2
configurations leveraging [`react-app-rewired`](https://github.com/timarney/react-app-rewired/) core functionalities.

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
Note that this rewirer will not add the plugin to the `yarn test`'s Babel configuration. See `useBabelRc()` to learn more.

### addBabelPlugins(plugins)

A simple helper that calls `addBabelPlugin` for each plugin you pass in here. Make sure you use the spread operator when using this, for example

```js
module.exports = override(
  disableEsLint(),
  ...addBabelPlugins(
    "polished",
    "emotion",
    "babel-plugin-transform-do-expressions"
  ),
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

### addBabelPreset(preset)

Adds a babel preset. Whatever you pass for `preset` will be added to Babel's `preset` array. Consult their docs for more info.
Note that this rewirer will not add the preset to the `yarn test`'s Babel configuration. See `useBabelRc()` to learn more.

### addBabelPresets(...presets)

A simple helper that calls `addBabelPreset` for each preset you pass in here. Make sure you don't pass an array and use the spread operator when using this, for example

```js
module.exports = override(
  ...addBabelPresets(
    [
      "@babel/env",
      {
        targets: {
          browsers: ["> 1%", "last 2 versions"]
        },
        modules: "commonjs"
      }
    ],
    "@babel/preset-flow",
    "@babel/preset-react"
  )
);
```

### babelInclude

Overwrites the `include` option for babel loader, for when you need to transpile a module in your `node_modules` folder.

```js
module.exports = override(
  babelInclude([
    path.resolve("src"), // make sure you link your own source
    path.resolve("node_modules/native-base-shoutem-theme"),
    path.resolve("node_modules/react-navigation"),
    path.resolve("node_modules/react-native-easy-grid")
  ])
);
```

### fixBabelImports(libraryName, options)

Adds the [babel-plugin-import plugin](https://www.npmjs.com/package/babel-plugin-import). See above for an example.

### addDecoratorsLegacy()

Add decorators in legacy mode. Be sure to have `@babel/plugin-proposal-decorators` installed.

### useBabelRc()

Use a .babelrc file for Babel configuration.

### disableEsLint()

Does what it says. You may need this along with `addDecoratorsLegacy` in order to get decorators and exports to parse together.

If you want use `@babel/plugin-proposal-decorators` with EsLint, you can enable `useEslintRc`, described below, with the follow configuration in your `.eslintrc` or `package.json`:

```json
{
  "extends": "react-app",
  "parserOptions": {
    "ecmaFeatures": {
      "legacyDecorators": true
    }
  }
}
```

### useEslintRc(configFile)

Causes your .eslintrc file to be used, rather than the config CRA ships with.
`configFile` is an optional parameter that allows to specify the exact path to the ESLint configuration file.

### enableEslintTypescript()

Updates Webpack eslint-loader to lint both .js(x) and .ts(x) files and show linting errors/warnings in console.

### addWebpackAlias(alias)

Adds the provided alias info into webpack's alias section. Pass an object literal with as many entries as you'd like, and the whole object will be merged in.

### addWebpackResolve(resolve)

Adds the provided resolve info into webpack's resolve section. Pass an object literal with as many entries as you'd like, and the whole object will be merged in.

### addWebpackPlugin(plugin)

Adds the provided plugin info into webpack's plugin array. Pass a plugin defined with  `new webpack.DefinePlugin({...})`

### addWebpackExternals(deps)

Add external dependencies, useful when trying to offload libs to CDN. 

For example you can [offload](https://github.com/facebook/create-react-app/issues/2758) `react` and `react-dom` by 

```js
addWebpackExternals({
  'react': 'React',
  'react-dom': 'ReactDom'
})
```

### addBundleVisualizer(options, behindFlag = false)

Adds the bundle visualizer plugin to your webpack config. Be sure to have `webpack-bundle-analyzer` installed. By default, the options passed to the plugin will be:

```json
{
  "analyzerMode": "static",
  "reportFilename": "report.html"
}
```

You can hide this plugin behind a command line flag (`--analyze`) by passing `true` as second argument.

```js
addBundleVisualizer({}, true);
```

### useBabelRc()

Causes your .babelrc (or .babelrc.js) file to be used, this is especially useful
if you'd rather override the CRA babel configuration and make sure it is consumed
both by `yarn start` and `yarn test` (along with `yarn build`).

```js
// config-overrides.js
module.exports = override(
  useBabelRc()
);

// .babelrc
{
  "presets": ["babel-preset-react-app"],
  "plugins": ["emotion"]
}
```

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
adjustWorkbox(wb =>
  Object.assign(wb, {
    skipWaiting: true,
    exclude: (wb.exclude || []).concat("index.html")
  })
);
```

### addLessLoader(loaderOptions)

First, install `less` and `less-loader` packages:

```bash
yarn add less
yarn add --dev less-loader
```

or:

```bash
npm i less
npm i -D less-loader
```

After it's done, call `addLessLoader` in `override` like below:

```js
const { addLessLoader } = require("customize-cra");

module.exports = override(addLessLoader(loaderOptions));
```

`loaderOptions` is optional. If you have Less specific options, you can pass to it. For example:

```js
const { addLessLoader } = require("customize-cra");

module.exports = override(
  addLessLoader({
    strictMath: true,
    noIeCompat: true,
    localIdentName: '[local]--[hash:base64:5]' // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
  })
);
```

Check [Less document](http://lesscss.org/usage/#command-line-usage-options) for all available specific options you can use.

Once `less-loader` is enabled, you can import `.less` file in your project.

`.module.less` will use CSS Modules.

> if you use TypeScript (npm init react-app my-app --typescript) with CSS Modules, you should edit `react-app-env.d.ts`.

```typescript
declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}
```

### disableChunk

Prevents the default static chunking, and forces the entire build into one file. See [this thread](https://github.com/facebook/create-react-app/issues/5306) for more info.

## Using the plugins

To use these plugins, import the `override` function, and call it with whatever plugins you need. Each of these plugin invocations will return a new function, that `override` will call with the newly modified config object. Falsy values will be ignored though, so if you need to conditionally apply any of these plugins, you can do so like below.

For example

```js
const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  addBundleVisualizer,
  addWebpackAlias,
  adjustWorkbox
} = require("customize-cra");
const path = require("path");

module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),
  addWebpackAlias({
    ["ag-grid-react$"]: path.resolve(__dirname, "src/shared/agGridWrapper.js")
  }),
  adjustWorkbox(wb =>
    Object.assign(wb, {
      skipWaiting: true,
      exclude: (wb.exclude || []).concat("index.html")
    })
  )
);
```

## removeModuleScopePlugin()

This will remove the CRA plugin that prevents to import modules from
outside the `src` directory, useful if you use a different directory.

A common use case is if you are using CRA in a monorepo setup, where your packages
are under `packages/` rather than `src/`.

## MobX Users

If you want CRA 2 to work with MobX, use the `addDecoratorsLegacy` and `disableEsLint`.

## Override dev server configuration

To override the webpack dev server configuration, you can use the `overrideDevServer` utility:

```js
const {
  override,
  disableEsLint,
  overrideDevServer,
  watchAll
} = require("customize-cra");

module.exports = {
  webpack: override(
    // usual webpack plugin
    disableEsLint()
  ),
  devServer: overrideDevServer(
    // dev server plugin
    watchAll()
  )
};
```

### watchAll()

When applied, CRA will watch all the project's files, included `node_modules`.
To use it, just apply it and run the dev server with `yarn start --watch-all`.

```js
watchAll();
```

### add post-css plugins

To add post-css plugins, you can use `addPostcssPlugins`.

```js
const { override, addPostcssPlugins } = require("customize-cra");

module.exports = override(
  addPostcssPlugins([require("postcss-px2rem")({ remUnit: 37.5 })])
);
```

### addTslintLoader(loaderOptions)

Need to install `tslint-loader`.

```js
const {
  addTslintLoader
} = require("customize-cra");

module.exports = override(
  addTslintLoader(),
);

```
