const {
  getBabelLoader,
  addBabelPlugin,
  addBabelPlugins,
  addBabelPreset,
  addBabelPresets,
  fixBabelImports,
  useBabelRc,
  babelInclude
} = require(".");

describe("babel", () => {
  describe("getBabelLoader finds the babel loader options", () => {
    const loader = { loader: "babel", options: { plugins: ["test"] } };

    test('in "oneOf" array', () => {
      const config = {
        module: {
          rules: [
            {
              oneOf: [loader]
            }
          ]
        }
      };

      expect(getBabelLoader(config)).toEqual(loader);
    });

    test('in a rule\'s "use" array', () => {
      const config = {
        module: {
          rules: [
            {
              oneOf: [{ use: [loader] }]
            }
          ]
        }
      };

      expect(getBabelLoader(config)).toEqual(loader);
    });
  });

  test("fixBabelImports adds the babel imports plugin for the provided library", () => {
    const options = { libraryDirectory: "" };
    const plugin = [
      "import",
      { libraryDirectory: "", libraryName: "lodash" },
      "fix-lodash-imports"
    ];
    const config = {
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
    };

    expect(fixBabelImports("lodash", options)(config)).toMatchObject({
      module: {
        rules: [
          {
            oneOf: [
              {
                loader: "babel",
                options: {
                  plugins: [plugin]
                }
              }
            ]
          }
        ]
      }
    });
  });

  test("useBabelRc enables the babel loader's babelrc flag", () => {
    const config = {
      module: {
        rules: [
          {
            oneOf: [
              {
                loader: "babel",
                options: {
                  plugins: [],
                  babelrc: false
                }
              }
            ]
          }
        ]
      }
    };

    expect(useBabelRc()(config)).toMatchObject({
      module: {
        rules: [
          {
            oneOf: [
              {
                loader: "babel",
                options: {
                  babelrc: true
                }
              }
            ]
          }
        ]
      }
    });
  });

  test("babelInclude sets the babel loader include", () => {
    const include = ["src"];
    const config = {
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
    };

    expect(babelInclude(include)(config)).toMatchObject({
      module: {
        rules: [
          {
            oneOf: [
              {
                loader: "babel",
                include
              }
            ]
          }
        ]
      }
    });
  });

  test("addBabelPlugin returns a function that adds a plugin to the plugins list", () => {
    const plugin = "@babel/plugin-transform-runtime";
    const config = {
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
    };

    expect(addBabelPlugin(plugin)(config)).toMatchObject({
      module: {
        rules: [
          {
            oneOf: [
              {
                loader: "babel",
                options: { plugins: [plugin] }
              }
            ]
          }
        ]
      }
    });
  });

  test("addBabelPlugins returns functions that add plugins to the plugins list", () => {
    const plugins = [
      ["@babel/plugin-proposal-object-rest-spread", { loose: true }],
      "@babel/plugin-transform-runtime"
    ];
    const inputConfig = {
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
    };
    const functions = addBabelPlugins(...plugins);
    const outputConfig = functions.reduce(
      (config, fn) => fn(config),
      inputConfig
    );

    expect(outputConfig).toMatchObject({
      module: {
        rules: [
          {
            oneOf: [
              {
                loader: "babel",
                options: { plugins }
              }
            ]
          }
        ]
      }
    });
  });

  test("addBabelPreset returns a function that adds a preset to the presets list", () => {
    const preset = "@babel/env";
    const config = {
      module: {
        rules: [
          {
            oneOf: [
              {
                loader: "babel",
                options: {
                  plugins: [],
                  presets: []
                }
              }
            ]
          }
        ]
      }
    };

    expect(addBabelPreset(preset)(config)).toMatchObject({
      module: {
        rules: [
          {
            oneOf: [
              {
                loader: "babel",
                options: { presets: [preset] }
              }
            ]
          }
        ]
      }
    });
  });

  test("addBabelPresets returns functions that add presets to the presets list", () => {
    const presets = [["@babel/env", { loose: true }], "@babel/typescript"];
    const inputConfig = {
      module: {
        rules: [
          {
            oneOf: [
              {
                loader: "babel",
                options: {
                  plugins: [],
                  presets: []
                }
              }
            ]
          }
        ]
      }
    };
    const functions = addBabelPresets(...presets);
    const outputConfig = functions.reduce(
      (config, fn) => fn(config),
      inputConfig
    );

    expect(outputConfig).toMatchObject({
      module: {
        rules: [
          {
            oneOf: [
              {
                loader: "babel",
                options: { presets }
              }
            ]
          }
        ]
      }
    });
  });
});
