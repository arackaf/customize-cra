import {
  addBabelPlugin,
  addBabelPlugins,
  addDecoratorsLegacy,
  addBabelPreset,
  addBabelPresets,
  fixBabelImports,
  useBabelRc,
  babelInclude
} from "./babel";

const config = () => ({
  module: {
    rules: [
      {
        oneOf: [
          {
            loader: "babel",
            options: {
              plugins: []
            }
          }
        ]
      }
    ]
  }
});

test("fixBabelImports adds the babel imports plugin for the provided library", () => {
  const options = { libraryDirectory: "" };
  const plugin = [
    "import",
    { libraryDirectory: "", libraryName: "lodash" },
    "fix-lodash-imports"
  ];
  const actual = fixBabelImports("lodash", options)(config());

  expect(actual).toMatchSnapshot();
});

test("useBabelRc enables the babel loader's babelrc flag", () => {
  const actual = useBabelRc()(config());

  expect(actual).toMatchSnapshot();
});

test("babelInclude sets the babel loader include", () => {
  const include = ["src"];
  const actual = babelInclude(include)(config());

  expect(actual).toMatchSnapshot();
});

test("addBabelPlugin returns a function that adds a plugin to the plugins list", () => {
  const plugin = "@babel/plugin-transform-runtime";
  const actual = addBabelPlugin(plugin)(config());

  expect(actual).toMatchSnapshot();
});

test("addBabelPlugins returns functions that add plugins to the plugins list", () => {
  const plugins = [
    ["@babel/plugin-proposal-object-rest-spread", { loose: true }],
    "@babel/plugin-transform-runtime"
  ];
  const functions = addBabelPlugins(...plugins);
  const actual = functions.reduce((config, fn) => fn(config), config());

  expect(actual).toMatchSnapshot();
});

test("addBabelPreset returns a function that adds a preset to the presets list", () => {
  const preset = "@babel/env";
  const conf = config();
  conf.module.rules[0].oneOf[0].options.presets = [];
  const actual = addBabelPreset(preset)(conf);

  expect(actual).toMatchSnapshot();
});

test("addBabelPresets returns functions that add presets to the presets list", () => {
  const presets = [["@babel/env", { loose: true }], "@babel/typescript"];
  const conf = config();
  conf.module.rules[0].oneOf[0].options.presets = [];
  const functions = addBabelPresets(...presets);
  const actual = functions.reduce((config, fn) => fn(config), conf);

  expect(actual).toMatchSnapshot();
});

test("addDecoratorsLegacy returns a function that adds the decorators plugin to the plugins list", () => {
  const actual = addDecoratorsLegacy()(config());

  expect(actual).toMatchSnapshot();
});
