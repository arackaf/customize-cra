# customize-cra

This project provides a set of utilities to customize [`create-react-app`](https://github.com/facebook/create-react-app) versions 2 and 3 configurations leveraging [`react-app-rewired`](https://github.com/timarney/react-app-rewired/) core functionalities.

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

To start, this project will export functions I need for what I'm using CRA for, but PRs will of course be welcome.

The functions documented below can be imported by name, and used in your `config-overrides.js` file, as explained below.

## Documentation

[See `api.md`](api.md) for documentation on the functions provided by `customize-cra`.

## Contributing

For more information about contributing to this project, like a directory map or a how-to for reporting an issue about the project, please [`see contributing.md`](contributing.md).
