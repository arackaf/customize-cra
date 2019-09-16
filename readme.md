# `customize-cra`

[![All Contributors](https://img.shields.io/badge/all_contributors-11-orange.svg?style=flat-square)](#contributors-)

This project provides a set of utilities to customize [`create-react-app`](https://github.com/facebook/create-react-app) versions 2 and 3 configurations leveraging [`react-app-rewired`](https://github.com/timarney/react-app-rewired/) core functionalities.

- [How to install](#how-to-install)
- [Warning](#warning)
- [Overview](#overview)
- [Usage](#usage)
  - [With `webpack`](#with-webpack)
  - [With `webpack-dev-server`](#with-webpack-dev-server)
  - [With `MobX`](#with-mobx)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Contributors](#contributors)

## How to install

This project relies on [`react-app-rewired`](https://github.com/timarney/react-app-rewired/). You'll need to install that in order for `customize-cra` to work.

```bash
yarn add customize-cra react-app-rewired --dev
```

## ❗ Warning

> "Stuff can break"
> \- Dan Abramov

Using this library will override the default behavior and configuration of `create-react-app`, therefore invalidating the guarantees that come with it. Use with discretion!

## Overview

`customize-cra` takes advantage of `react-app-rewired`'s `config-overrides.js` file. By importing `customize-cra` functions and exporting a few function calls wrapped in our `override` function, you can easily modify the underlying config objects (`webpack`, `webpack-dev-server`, `babel`, etc.) that make up `create-react-app`.

## Usage

**Note:** all code should be added to `config-overrides.js` at the same level as `package.json`.

See the [api docs](api.md) for documentation for each function.

### With `webpack`

To use these plugins, import the `override` function, and call it with whatever plugins you need. Each of these plugin invocations will return a new function, that `override` will call with the newly modified config object. Falsy values will be ignored though, so if you need to conditionally apply any of these plugins, you can do so like below.

For example:

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
  // enable legacy decorators babel plugin
  addDecoratorsLegacy(),

  // disable eslint in webpack
  disableEsLint(),

  // add webpack bundle visualizer if BUNDLE_VISUALIZE flag is enabled
  process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),

  // add an alias for "ag-grid-react" imports
  addWebpackAlias({
    ["ag-grid-react$"]: path.resolve(__dirname, "src/shared/agGridWrapper.js")
  }),

  // adjust the underlying workbox
  adjustWorkbox(wb =>
    Object.assign(wb, {
      skipWaiting: true,
      exclude: (wb.exclude || []).concat("index.html")
    })
  )
);
```

### With `webpack-dev-server`

You can use the `overrideDevServer` function to override the `webpack-dev-server` config. It works the same way as `override`:

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

### With `MobX`

If you want CRA 2 to work with MobX, use the `addDecoratorsLegacy` and `disableEsLint`.

## Documentation

[See `api.md`](api.md) for documentation on the functions provided by `customize-cra`.

## Contributing

For more information about contributing to this project, like a directory map or a how-to for reporting an issue about the project, please [`see contributing.md`](contributing.md).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/dqu"><img src="https://avatars2.githubusercontent.com/u/4287468?v=4" width="100px;" alt="dqu"/><br /><sub><b>dqu</b></sub></a><br /><a href="#question-dqu" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://blog.breezelin.cn"><img src="https://avatars2.githubusercontent.com/u/5266711?v=4" width="100px;" alt="Breeze"/><br /><sub><b>Breeze</b></sub></a><br /><a href="https://github.com/arackaf/customize-cra/commits?author=breeze2" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Terryand"><img src="https://avatars2.githubusercontent.com/u/22273687?v=4" width="100px;" alt="Terryand"/><br /><sub><b>Terryand</b></sub></a><br /><a href="https://github.com/arackaf/customize-cra/commits?author=Terryand" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/m-weeks"><img src="https://avatars0.githubusercontent.com/u/37918120?v=4" width="100px;" alt="m-weeks"/><br /><sub><b>m-weeks</b></sub></a><br /><a href="https://github.com/arackaf/customize-cra/issues?q=author%3Am-weeks" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/wuchaoya"><img src="https://avatars2.githubusercontent.com/u/20284675?v=4" width="100px;" alt="吴超"/><br /><sub><b>吴超</b></sub></a><br /><a href="#example-wuchaoya" title="Examples">💡</a></td>
    <td align="center"><a href="http://jamesthistlewood.co.uk"><img src="https://avatars3.githubusercontent.com/u/8274049?v=4" width="100px;" alt="James Thistlewood"/><br /><sub><b>James Thistlewood</b></sub></a><br /><a href="https://github.com/arackaf/customize-cra/commits?author=jthistle" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/taddj"><img src="https://avatars1.githubusercontent.com/u/48697700?v=4" width="100px;" alt="taddj"/><br /><sub><b>taddj</b></sub></a><br /><a href="#question-taddj" title="Answering Questions">💬</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/postgetme"><img src="https://avatars3.githubusercontent.com/u/5118867?v=4" width="100px;" alt="MeiLin"/><br /><sub><b>MeiLin</b></sub></a><br /><a href="https://github.com/arackaf/customize-cra/commits?author=postgetme" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/badgerwithagun"><img src="https://avatars0.githubusercontent.com/u/6483013?v=4" width="100px;" alt="Graham Crockford"/><br /><sub><b>Graham Crockford</b></sub></a><br /><a href="#ideas-badgerwithagun" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/gfafei"><img src="https://avatars3.githubusercontent.com/u/12234890?v=4" width="100px;" alt="afei"/><br /><sub><b>afei</b></sub></a><br /><a href="https://github.com/arackaf/customize-cra/commits?author=gfafei" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/fireairforce"><img src="https://avatars3.githubusercontent.com/u/32598811?v=4" width="100px;" alt="zoomdong"/><br /><sub><b>zoomdong</b></sub></a><br /><a href="https://github.com/arackaf/customize-cra/commits?author=fireairforce" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
