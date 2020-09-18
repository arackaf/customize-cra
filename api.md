# api docs

This file documents the functions exported by `customize-cra`.

- [api docs](#api-docs)
  - [`customizers`](#customizers)
    - [addTslintLoader(loaderOptions)](#addtslintloaderloaderoptions)
    - [addExternalBabelPlugin(plugin)](#addexternalbabelpluginplugin)
    - [addExternalBabelPlugins(plugins)](#addexternalbabelpluginsplugins)
    - [addBabelPlugin(plugin)](#addbabelpluginplugin)
    - [addBabelPlugins(plugins)](#addbabelpluginsplugins)
    - [addBabelPreset(preset)](#addbabelpresetpreset)
    - [addBabelPresets(...presets)](#addbabelpresetspresets)
    - [babelInclude](#babelinclude)
    - [babelExclude(exclude)](#babelexcludeexclude)
    - [removeInternalBabelPlugin(pluginName)](#removeinternalbabelpluginpluginname)
    - [fixBabelImports(libraryName, options)](#fixbabelimportslibraryname-options)
    - [addDecoratorsLegacy()](#adddecoratorslegacy)
    - [disableEsLint()](#disableeslint)
    - [useEslintRc(configFile)](#useeslintrcconfigfile)
    - [enableEslintTypescript()](#enableeslinttypescript)
    - [enableSVGO()](#enablesvgo)
    - [addWebpackAlias(alias)](#addwebpackaliasalias)
    - [addWebpackResolve(resolve)](#addwebpackresolveresolve)
    - [addWebpackPlugin(plugin)](#addwebpackpluginplugin)
    - [addWebpackExternals(deps)](#addwebpackexternalsdeps)
    - [addWebpackModuleRule(rule)](#addwebpackmodulerulerule)
    - [setWebpackTarget(target)](#setwebpacktargettarget)
    - [setWebpackStats(stats)](#setwebpackstatsstats)
    - [addBundleVisualizer(options, behindFlag = false)](#addbundlevisualizeroptions-behindflag--false)
    - [setWebpackOptimizationSplitChunks(target)](#setwebpackoptimizationsplitchunkstarget)
    - [useBabelRc()](#usebabelrc)
    - [adjustWorkbox(fn)](#adjustworkboxfn)
    - [addLessLoader(loaderOptions)](#addlessloaderloaderoptions)
    - [addPostcssPlugins([plugins])](#addpostcsspluginsplugins)
    - [disableChunk](#disablechunk)
    - [removeModuleScopePlugin()](#removemodulescopeplugin)
    - [watchAll()](#watchall)
    - [adjustStyleLoaders(callback)](#adjuststyleloaderscallback)
  - [`utilities`](#utilities)
    - [getBabelLoader(config, isOutsideOfApp)](#getbabelloaderconfig-isoutsideofapp)
    - [tap(options)](#tapoptions)

## `customizers`

`customizers` are functions that produce modifications to a config object, allowing a user to easily enable or disable `webpack`, `webpack-dev-server`, `babel`, et al., features.

### addTslintLoader(loaderOptions)

Need to install `tslint-loader`.

```js
const { addTslintLoader } = require("customize-cra");

module.exports = override(addTslintLoader());
```

### addExternalBabelPlugin(plugin)

`create-react-app` actually has two rules in its `webpack` config for `babel-loader`: one for code in `addSrc` (`src/` by default) and the other for code `external` to that folder (like `node_modules`). You can add plugins to the `external` loader using `addExternalBabelPlugin` in the same way you'd use `addBabelPlugin`.

### addExternalBabelPlugins(plugins)

A simple helper that calls `addExternalBabelPlugin` for each plugin passed.

Note: Make sure to use the spread operator if adding multiple plugins.

```js
module.exports = override(
  disableEsLint(),
  ...addExternalBabelPlugins(
    "babel-plugin-transform-do-expressions",
    "@babel/plugin-proposal-object-rest-spread"
  ),
  fixBabelImports("lodash", {
    libraryDirectory: "",
    camel2DashComponentName: false,
  }),
  fixBabelImports("react-feather", {
    libraryName: "react-feather",
    libraryDirectory: "dist/icons",
  })
);
```

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
    camel2DashComponentName: false,
  }),
  fixBabelImports("react-feather", {
    libraryName: "react-feather",
    libraryDirectory: "dist/icons",
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
          browsers: ["> 1%", "last 2 versions"],
        },
        modules: "commonjs",
      },
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
    path.resolve("node_modules/react-native-easy-grid"),
  ])
);
```

### babelExclude(exclude)

Overwrites the `exclude` option for `babel-loader`. Useful for excluding a specific folder that you don't want to be transpiled.

```js
module.exports = override(babelExclude([path.resolve("src/excluded-folder")]));
```

### removeInternalBabelPlugin(pluginName)

Removes a specific `babel` plugin with a constructor name matching `pluginName`from the configuration.

```js
module.exports = override(removeInternalBabelPlugin("plugin-name"));
```

### fixBabelImports(libraryName, options)

Adds the [babel-plugin-import plugin](https://www.npmjs.com/package/babel-plugin-import). See above for an example.

### addDecoratorsLegacy()

Add decorators in legacy mode. Be sure to have `@babel/plugin-proposal-decorators` installed.

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

### enableSVGO()

Currently, Create React App enables a user to import svgsas src urls or alternately as a ReactComponent, in order to use the component inline in the project.
Using the SVG inline means it uses SVGR to do this. SVGR can be configured using an `.svgrc` file in the root of the project. Unfortunately, out of the box, the `svgo` portion of
the svgrc, which are arguments that can be passes to the underlying transformer is disabled as default.

For example the following code in your `.svgrc.js` file would produce unexpected results:

```
module.exports = {
  memo: true,
  icon: false,
  // things above this line will run
  // but nothing below this line will run.
  svgoConfig: {
    pretty: false,
    multipass: true,
    plugins: [
      { convertColors: { currentColor: true } },
      { cleanupIDs: true },
    ],
  },
};
```

In this above example, the id's in the svg would remain in place, and the fill colors would stay as they were. This is non-canonical to SVGR, and [was done by the team as a way to avoid confusing
endusers.](https://github.com/facebook/create-react-app/pull/5062.) In other words, the goal of CRA is, with no modification, to import an SVG completely unaltered from the original and not actually allow the full use of an SVG transformation pipeline. However, there are a lot of reasons why a developer who is using an SVG import pipeline might intentionally
want to manipulate SVG's with SVGO. here are just three:

- removing Id's, unused attrs, collapsing g's and a number of other optimizations that can reduce the size of the SVG significantly, without modifying it cosmetically
- replacing `fill` and `stroke` colors with `currentColor` to enable the application to programatically manipulate the SVG via css without changing the designer's worflow (which likely has a hardcoded value) this is also critical if you want to override svg colors with popular css frameworks, like tailwind
- properly integrate SVGs with an existing stylesytem by prefixing id's, or adding classes.

You can see all the ways that SVGO can transform an SVG in the build process here: `https://github.com/svg/svgo#what-it-can-do`

Here is an example of how you might configure an aggressive SVG optimizer:

First, to use this function include `enableSVGO` as a parameter to `override()`

```
module.exports = override(
  enableSVGO()
);
```

Now a common use case is to reduce the size of the SVG by removing unused properties, namespaces, titles and so on. Make a file in the
root of th eproject called `svgrrc.js` you can also use a yaml, or json variant. [Read more here](https://react-svgr.com/docs/custom-transformations/#applying-custom-transformations)

in this file put something like:

```
const svgoPlugins = [
  { removeComments: true },
  { removeDesc: true },
  { removeDimensions: true },
  { removeDoctype: true },
  { removeEditorsNSData: true },
  { removeEmptyAttrs: true },
  { removeEmptyContainers: true },
  { removeEmptyText: true },
  { removeHiddenElems: true },
  { removeMetadata: true },
  { removeNonInheritableGroupAttrs: true },
  { removeRasterImages: false },
  { removeTitle: true },
  { removeUnknownsAndDefaults: true },
  { removeUnusedNS: true },
  { removeUselessDefs: true },
  { removeUselessStrokeAndFill: true },
  { removeViewBox: false },
  { removeXMLProcInst: true },

  { cleanUpEnableBackground: true },
  { cleanupAttrs: true },
  { cleanupIDs: true },
  { cleanupNumericValues: true },
  { collapseGroups: true },
  { convertPathData: true },
  { convertShapeToPath: true },
  { convertStyleToAttrs: true },
  { convertTransform: true },
  { mergePaths: true },
  { moveElemsAttrsToGroup: true },
  { moveGroupAttrsToElems: true },

  { transformsWithOnePath: false },
  { convertColors: { currentColor: true } },
  { sortAttrs: true },
];

module.exports = {
  typescript: true,
  memo: true,
  icon: false,
  svgoConfig: {
    multipass: true,
    plugins: svgoPlugins,
  },
};
```

Theres a lot happening here, but this will greately reduce the SVG size. Multipass is also an undocumented optimization, [read more
about it here](https://github.com/svg/svgo/pull/258). It attempts to simplify shapes into paths to reduce file complexity.

### addWebpackAlias(alias)

Adds the provided alias info into webpack's alias section. Pass an object literal with as many entries as you'd like, and the whole object will be merged in.

### addWebpackResolve(resolve)

Adds the provided resolve info into webpack's resolve section. Pass an object literal with as many entries as you'd like, and the whole object will be merged in.

### addWebpackPlugin(plugin)

Adds the provided plugin info into webpack's plugin array. Pass a plugin defined with `new webpack.DefinePlugin({...})`

### addWebpackExternals(deps)

Add external dependencies, useful when trying to offload libs to CDN.

For example you can [offload](https://github.com/facebook/create-react-app/issues/2758) `react` and `react-dom` by

```js
addWebpackExternals({
  react: "React",
  "react-dom": "ReactDom",
});
```

`addWebpackExternals` can also accept a `string`, `function`, or `regex`. See [the webpack documentation](https://webpack.js.org/configuration/externals/) for more information.

### addWebpackModuleRule(rule)

Adds the provided rule to the webpack config's `module.rules` array.

See https://webpack.js.org/configuration/module/#modulerules for more information

```js
module.exports = {
  override(
    addWebpackModuleRule({test: /\.txt$/, use: 'raw-loader'})
  )
}
```

### setWebpackTarget(target)

Sets the `target` config variable for webpack. This can be, [as described in the webpack docs](https://webpack.js.org/configuration/target/), a string or a function.

```js
module.exports = {
  override(
    setWebpackTarget('electron-renderer')
  )
}
```

### setWebpackStats(stats)

Sets the `stats` attribute for webpack. This is an attribute that can allow you to customize Webpack's error message behaviour, in production builds. This can be, [as described in the webpack docs](https://webpack.js.org/configuration/stats/), a string or an object.

```js
module.exports = {
  override(
    setWebpackStats('errors-only')
  )
}
```

You can configure it to ignore certain expected warning patterns, as create-react-app treats warnings as errors when `CI` env is true:

```js
module.exports = {
  override(
    setWebpackStats({
      warningsFilter: [
        'filter',
        /filter/,
        (warning) => true
      ]
    })
  )
}
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

### setWebpackOptimizationSplitChunks(target)

Sets your customized optimization.splitChunks configuration to your webpack config. Please Use this method cautiously because the webpack default config is effective on most of time. By default, the options in create-react-app is:

```json
{
  "chunks": "all",
  "name": false
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
adjustWorkbox((wb) =>
  Object.assign(wb, {
    skipWaiting: true,
    exclude: (wb.exclude || []).concat("index.html"),
  })
);
```

### addLessLoader(loaderOptions)

First, install `less` and `less-loader` packages:

```bash
yarn add --dev less less-loader
```

or:

```bash
npm i -D less less-loader
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
    modifyVars: {
      "@primary-color": "#1DA57A", // for example, you use Ant Design to change theme color.
    },
    cssLoaderOptions: {}, // .less file used css-loader option, not all CSS file.
    cssModules: {
      localIdentName: "[path][name]__[local]--[hash:base64:5]", // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
    },
  })
);
```

Check [Less document](http://lesscss.org/usage/#command-line-usage-options) for all available specific options you can use.

Once `less-loader` is enabled, you can import `.less` file in your project.

`.module.less` will use CSS Modules.

> if you use TypeScript (npm init react-app my-app --typescript) with CSS Modules, you should edit `react-app-env.d.ts`.

```typescript
declare module "*.module.less" {
  const classes: { [key: string]: string };
  export default classes;
}
```

### addPostcssPlugins([plugins])

To add post-css plugins, you can use `addPostcssPlugins`.

```js
const { override, addPostcssPlugins } = require("customize-cra");

module.exports = override(
  addPostcssPlugins([require("postcss-px2rem")({ remUnit: 37.5 })])
);
```

### disableChunk

Prevents the default static chunking, and forces the entire build into one file. See [this thread](https://github.com/facebook/create-react-app/issues/5306) for more info.

### removeModuleScopePlugin()

This will remove the CRA plugin that prevents to import modules from
outside the `src` directory, useful if you use a different directory.

A common use case is if you are using CRA in a monorepo setup, where your packages
are under `packages/` rather than `src/`.

### watchAll()

When applied, CRA will watch all the project's files, included `node_modules`.
To use it, just apply it and run the dev server with `yarn start --watch-all`.

```js
watchAll();
```

### adjustStyleLoaders(callback)

Find all style loaders and callback one by one.

```js
adjustStyleLoaders((loader) => {});
```

In default config, CRA only generate sourcemap in production mode,
if you need sourcemap in development mode, you must adjust style loaders.

Here is the example:

```js
adjustStyleLoaders(({ use: [, css, postcss, resolve, processor] }) => {
  css.options.sourceMap = true; // css-loader
  postcss.options.sourceMap = true; // postcss-loader
  // when enable pre-processor,
  // resolve-url-loader will be enabled too
  if (resolve) {
    resolve.options.sourceMap = true; // resolve-url-loader
  }
  // pre-processor
  if (processor && processor.loader.includes("sass-loader")) {
    processor.options.sourceMap = true; // sass-loader
  }
});
```

## `utilities`

`utilities` are functions consumed by `customizers` in order to navigate their config.

### getBabelLoader(config, isOutsideOfApp)

Returns the `babel` loader from the provided `config`.

`create-react-app` defines two `babel` configurations, one for js files
found in `src/` and another for any js files found outside that directory. This function can target either using the `isOutsideOfApp` param.

`getBabelLoader` is used to implement most of the `babel`-related `customizers`. Check out [`src/customizers/babel.js`](src/customizers/babel.js) for examples.

### tap(options)

Use `tap` to help you identify the configuration at certain points by printing the configuration in the console or in a separate file.

`Tap` accepts an optional `options` object with the next properties:

- message: String message to be printed before the configuration.
- dest: Destination file for writing logs.

```js
const { override, tap, addLessLoader } = require("customize-cra");

module.exports = override(
  // Print initial config in the console prepending a message
  tap({ message: "Pre - Customizers" })
  /* Your customizers: eg. addLessLoader() */
  addLessLoader()
  // Print final config in a separate file
  tap({ dest: 'customize-cra.log'})
)
```
