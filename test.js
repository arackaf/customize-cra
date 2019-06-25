const {
  getBabelLoader,
  addBabelPlugin,
  addBabelPlugins,
  addBabelPreset,
  addBabelPresets,
  fixBabelImports,
  useBabelRc,
  babelInclude,
  addWebpackExternals,
  addWebpackAlias,
  addWebpackResolve,
  addWebpackPlugin,
  override
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

describe("webpack", () => {
  test("addWebpackExternals returns function that spreads provided args last in externals list", () => {
    const config = {
      externals: { lodash: "Lodash", "react-dom": "NotReactDom" }
    };
    const externals = {
      react: "React",
      "react-dom": "ReactDom"
    };
    const outputConfig = addWebpackExternals(externals)(config);

    expect(outputConfig).toMatchObject({
      externals: {
        lodash: "Lodash",
        react: "React",
        "react-dom": "ReactDom"
      }
    });
  });

  describe("addWebpackAlias", () => {
    test("initializes resolve.alias with empty objects if non-existant", () => {
      const config = {};
      const outputConfig = addWebpackAlias({})(config);

      expect(outputConfig).toEqual({ resolve: { alias: {} } });
    });

    test("merges the provided alias object with the config resolve.alias object", () => {
      const config = {
        resolve: {
          alias: { a: "A", b: "B" }
        }
      };
      const alias = { b: "b", c: "c" };
      const outputConfig = addWebpackAlias(alias)(config);

      expect(outputConfig).toEqual({
        resolve: { alias: { a: "A", b: "b", c: "c" } }
      });
    });
  });

  describe("addWebpackResolve", () => {
    test("initializes resolve with empty object if non-existant", () => {
      const config = {};
      const outputConfig = addWebpackResolve({})(config);

      expect(outputConfig).toEqual({ resolve: {} });
    });

    test("merges the provided resolve object into the config resolve object", () => {
      const config = {
        resolve: {
          alias: { a: "A", b: "b" }
        }
      };
      const resolve = { alias: { a: "a", b: "B" } };
      const outputConfig = addWebpackResolve(resolve)(config);

      expect(outputConfig).toEqual({ resolve: { alias: { a: "a", b: "B" } } });
    });
  });

  test("addWebpackPlugin adds the provided plugin to the config plugins list", () => {
    const config = {
      plugins: ["A"]
    };
    const plugin = "B";
    const outputConfig = addWebpackPlugin(plugin)(config);
  });
});

test("override composes provided plugin functions", () => {
  const plugin1 = jest.fn(x => x);
  const plugin2 = jest.fn(x => x);
  const composed = override(plugin1, plugin2);
  const result = composed("hello");

  expect(result).toBe("hello");
  expect(plugin1).toHaveBeenCalledWith("hello");
  expect(plugin2).toHaveBeenCalledWith("hello");
});
