const {
  addWebpackExternals,
  addWebpackAlias,
  addWebpackResolve,
  addWebpackPlugin,
  disableEsLint,
  useEslintRc,
  enableEslintTypescript,
  addTslintLoader,
  adjustWorkbox,
  watchAll,
  disableChunk,
  removeModuleScopePlugin,
  addPostcssPlugins
} = require("./webpack");

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

    expect(outputConfig).toEqual({
      plugins: ["A", "B"]
    });
  });
});

describe("eslint", () => {
  test("disableEsLint filters out the eslint rules from the config rules list", () => {
    const inputConfig = {
      module: { rules: [{ use: [{ options: { useEslintrc: true } }] }] }
    };
    const outputConfig = disableEsLint()(inputConfig);

    expect(outputConfig).toEqual({ module: { rules: [] } });
  });

  test("useEslintRc removes the base eslint config and uses the passed filename instead", () => {
    const configFile = ".eslintrc";
    const inputConfig = {
      module: {
        rules: [
          {
            use: [
              { options: { useEslintrc: false, baseConfig: { test: true } } }
            ]
          }
        ]
      }
    };
    const outputConfig = useEslintRc(configFile)(inputConfig);

    expect(outputConfig).toEqual({
      module: {
        rules: [
          {
            use: [{ options: { useEslintrc: true, ignore: true, configFile } }]
          }
        ]
      }
    });
  });

  describe("enableEslintTypescript adds /tsx?/ to eslint file pattern test config ", () => {
    const inputConfig = {
      module: {
        rules: [{ use: [{ options: { useEslintrc: false } }] }]
      }
    };
    const outputConfig = enableEslintTypescript()(inputConfig);
    const regex = outputConfig.module.rules[0].test;
    const validExtensions = ["js", "jsx", "ts", "tsx", "mjs"];

    validExtensions.forEach(extension => {
      test(extension, () => {
        expect(regex.test(`.${extension}`)).toBe(true);
      });
    });
  });

  test("addTslintLoader adds tslint-loader as the first rule", () => {
    const options = { test: true };
    const inputConfig = {
      module: { rules: [{ test: true }] }
    };
    const outputConfig = addTslintLoader(options)(inputConfig);

    expect(outputConfig).toEqual(
      expect.objectContaining({
        module: {
          rules: [
            {
              test: expect.any(RegExp),
              loader: "tslint-loader",
              options,
              enforce: "pre"
            },
            { test: true }
          ]
        }
      })
    );
  });
});

test("adjustWorkbox calls the provided adjustment using the workbox plugin config", () => {
  const adjustment = jest.fn(x => x);
  const innerConfig = { test: true };
  const inputConfig = {
    plugins: [{ constructor: { name: "GenerateSW" }, config: innerConfig }]
  };

  expect(adjustWorkbox(adjustment)(inputConfig)).toEqual(inputConfig);
  expect(adjustment).toHaveBeenCalledWith(innerConfig);
});

test("addLessLoader", () => {});

test("watchAll removes the watchOptions from config if --watch-all passed", () => {
  const watchOptions = { watch: true };
  const inputConfig = { watchOptions };

  expect(watchAll()(inputConfig)).toEqual(inputConfig);
  process.argv.push("--watch-all");
  expect(watchAll()(inputConfig)).toEqual({});
});

test("disableChunk disables chunking config options", () => {
  const inputConfig = {
    optimization: {
      splitChunks: { cacheGroups: { default: true } },
      runtimeChunk: true
    }
  };

  expect(disableChunk()(inputConfig)).toEqual({
    optimization: {
      splitChunks: { cacheGroups: { default: false } },
      runtimeChunk: false
    }
  });
});

test("addPostcssPlugins adds postcss plugins to the postcss rule", () => {
  const plugin1 = jest.fn(() => "plugin1");
  const plugin2 = jest.fn(() => "plugin2");
  const plugins = [plugin2];
  const inputConfig = {
    module: {
      rules: [
        {
          oneOf: [
            {
              use: [{ options: { plugins: () => [plugin1], ident: "postcss" } }]
            }
          ]
        }
      ]
    }
  };
  const outputConfig = addPostcssPlugins(plugins)(inputConfig);

  expect(outputConfig).toMatchObject({
    module: {
      rules: [
        {
          oneOf: [
            {
              use: [{ options: { plugins: expect.any(Function) } }]
            }
          ]
        }
      ]
    }
  });
  const result = outputConfig.module.rules[0].oneOf[0].use[0].options
    .plugins()
    .forEach(p => p());
  expect(plugin1).toHaveBeenCalled();
  expect(plugin2).toHaveBeenCalled();
});

test("removeModuleScopePlugin removes the 'ModuleScopePlugin' resolve plugin", () => {
  const inputConfig = {
    resolve: {
      plugins: [{ constructor: { name: "ModuleScopePlugin" } }, { test: true }]
    }
  };

  expect(removeModuleScopePlugin()(inputConfig)).toEqual({
    resolve: { plugins: [{ test: true }] }
  });
});
