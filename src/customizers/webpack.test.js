import {
  addWebpackExternals,
  addWebpackAlias,
  addWebpackResolve,
  addWebpackPlugin,
  disableEsLint,
  useEslintRc,
  enableEslintTypescript,
  addTslintLoader,
  addWebpackModuleRule,
  adjustWorkbox,
  adjustStyleLoaders,
  watchAll,
  disableChunk,
  removeModuleScopePlugin,
  addPostcssPlugins,
  addLessLoader,
  setWebpackTarget,
  setWebpackPublicPath,
  setWebpackOptimizationSplitChunks,
  setWebpackStats
} from "./webpack";

test("addWebpackExternals returns function that spreads provided args last in externals list", () => {
  const config = {
    externals: { lodash: "Lodash", "react-dom": "NotReactDom" }
  };
  const externals = { react: "React", "react-dom": "ReactDom" };
  const extReg = /^(jquery|\$)$/i;
  function extFun(context, request, callback) {
    if (/^yourregex$/.test(request)) {
      return callback(null, "commonjs " + request);
    }
    callback();
  }
  let actual = addWebpackExternals(externals)(config);
  actual = addWebpackExternals(extReg)(actual);
  actual = addWebpackExternals(extFun)(actual);

  expect(actual).toMatchSnapshot();
});

describe("addWebpackAlias", () => {
  test("initializes resolve.alias with empty objects if non-existant", () => {
    const config = {};
    const actual = addWebpackAlias({})(config);

    expect(actual).toMatchSnapshot();
  });

  test("merges the provided alias object with the config resolve.alias object", () => {
    const config = { resolve: { alias: { a: "A", b: "B" } } };
    const alias = { b: "b", c: "c" };
    const actual = addWebpackAlias(alias)(config);

    expect(actual).toMatchSnapshot();
  });
});

describe("addWebpackResolve", () => {
  test("initializes resolve with empty object if non-existant", () => {
    const config = {};
    const actual = addWebpackResolve({})(config);

    expect(actual).toMatchSnapshot();
  });

  test("merges the provided resolve object into the config resolve object", () => {
    const config = { resolve: { alias: { a: "A", b: "b" } } };
    const resolve = { alias: { a: "a", b: "B" } };
    const actual = addWebpackResolve(resolve)(config);

    expect(actual).toMatchSnapshot();
  });
});

test("addWebpackPlugin adds the provided plugin to the config plugins list", () => {
  const config = { plugins: ["A"] };
  const plugin = "B";
  const actual = addWebpackPlugin(plugin)(config);

  expect(actual).toMatchSnapshot();
});

describe("eslint", () => {
  test("disableEsLint filters out the eslint rules from the config rules list", () => {
    const inputConfig = {
      module: { rules: [{ use: [{ options: { useEslintrc: true } }] }] }
    };
    const actual = disableEsLint()(inputConfig);

    expect(actual).toMatchSnapshot();
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
    const actual = useEslintRc(configFile)(inputConfig);

    expect(actual).toMatchSnapshot();
  });

  describe("enableEslintTypescript adds /tsx?/ to eslint file pattern test config ", () => {
    const inputConfig = {
      module: { rules: [{ use: [{ options: { useEslintrc: false } }] }] }
    };
    const actual = enableEslintTypescript()(inputConfig);
    const regex = actual.module.rules[0].test;
    const validExtensions = ["js", "jsx", "ts", "tsx", "mjs"];

    validExtensions.forEach(extension => {
      test(extension, () => {
        expect(regex.test(`.${extension}`)).toBe(true);
      });
    });
  });

  test("addTslintLoader adds tslint-loader as the first rule", () => {
    const options = { test: true };
    const inputConfig = { module: { rules: [{ test: true }] } };
    const actual = addTslintLoader(options)(inputConfig);

    expect(actual).toMatchSnapshot();
    expect(actual).toEqual(
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

test("addWebpackModuleRule adds the provided rule to module.rules", () => {
  const rule = { name: "__TEST__" };
  const inputConfig = { module: { rules: [{ oneOf: [{ test: true }] }] } };
  const actual = addWebpackModuleRule(rule)(inputConfig);

  expect(actual).toMatchSnapshot();
});

test("adjustWorkbox calls the provided adjustment using the workbox plugin config", () => {
  const adjustment = jest.fn(x => x);
  const innerConfig = { test: true };
  const inputConfig = {
    plugins: [{ constructor: { name: "GenerateSW" }, config: innerConfig }]
  };
  const actual = adjustWorkbox(adjustment)(inputConfig);

  expect(actual).toMatchSnapshot();
  expect(adjustment).toHaveBeenCalledWith(innerConfig);
});

test("adjustStyleLoaders find all style loaders and callback one by one", () => {
  const nonStyleLoader = { test: true };
  const styleLoader = { use: [ 'style-loader' ] };
  const inputConfig = { module: { rules: [{ oneOf: [ nonStyleLoader, styleLoader ] }]} };
  adjustStyleLoaders(actual => expect(actual).toMatchSnapshot())(inputConfig);
});


describe('addLessLoader', () => {
  const findLessLoaderConf = loader => loader.test && loader.test.test('a.less');
  const findLessModuleLoaderConf = loader =>
    loader.test && loader.test.test('a.module.less') && !loader.test.test('a.less');
  const isCSSLoader = loader => /css-loader/.test(loader);
  const isLessLoader = loader => /less-loader.js$/.test(loader);

  const webpackEnv = process.env.NODE_ENV;
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const shouldUseSourceMap = isEnvProduction
    ? process.env.GENERATE_SOURCEMAP !== 'false'
    : isEnvDevelopment;

  test('with options', () => {
    const inputConfig = {
      output: {
        publicPath: '.',
      },
      module: {
        rules: [
          {
            oneOf: [
              // last on loader is assets loader
              {
                exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                type: 'asset/resource',
              },
            ],
          },
        ],
      },
    };

    const finalConfig = addLessLoader({
      cssLoaderOptions: {
        onlyLocals: true,
        modules: {
          localIdentName: '[hash:base64:8]',
        },
      },
      lessLoaderOptions: {
        lessOptions: {
          strictMath: true,
        },
      },
    })(inputConfig);

    // all loaders
    const loaders = finalConfig.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

    // find less loader
    const lessLoader = loaders.find(findLessLoaderConf);

    expect(lessLoader.use.find(loaderConf => isCSSLoader(loaderConf.loader)).options).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      onlyLocals: true,
      modules: false,
    });
    expect(lessLoader.use.find(loaderConf => isLessLoader(loaderConf.loader)).options).toEqual({
      sourceMap: shouldUseSourceMap,
      lessOptions: {
        rewriteUrls: 'local',
        strictMath: true,
      },
    });

    // find less module loader
    const lessModuleLoader = loaders.find(findLessModuleLoaderConf);

    expect(lessModuleLoader.use.find(
      loaderConf => isCSSLoader(loaderConf.loader)).options,
    ).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      onlyLocals: true,
      modules: {
        localIdentName: '[hash:base64:8]',
      },
    });
    expect(lessModuleLoader.use.find(
      loaderConf => isLessLoader(loaderConf.loader)).options,
    ).toEqual({
      sourceMap: shouldUseSourceMap,
      lessOptions: {
        rewriteUrls: 'local',
        strictMath: true,
      },
    });
  });

  test('without options', () => {
    const inputConfig = {
      output: {
        publicPath: '.',
      },
      module: {
        rules: [
          {
            oneOf: [
              // last on loader is assets loader
              {
                exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                type: 'asset/resource',
              },
            ],
          },
        ],
      },
    };

    const finalConfig = addLessLoader()(inputConfig);

    // all loaders
    const loaders = finalConfig.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

    // find less loader
    const lessLoader = loaders.find(findLessLoaderConf);

    expect(lessLoader.use.find(loaderConf => isCSSLoader(loaderConf.loader)).options).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      modules: false,
    });
    expect(lessLoader.use.find(loaderConf => isLessLoader(loaderConf.loader)).options).toEqual({
      sourceMap: shouldUseSourceMap,
      lessOptions: {
        rewriteUrls: 'local',
      },
    });

    // find less module loader
    const lessModuleLoaderRule = loaders.find(findLessModuleLoaderConf);
    const cssLoaderConf = lessModuleLoaderRule.use.find(
      loaderConf => isCSSLoader(loaderConf.loader),
    );
    expect(cssLoaderConf.options).toEqual({
      importLoaders: 2,
      sourceMap: shouldUseSourceMap,
      modules: {
        localIdentName: '[local]--[hash:base64:5]',
      },
    });
    const lessLoaderConf = lessModuleLoaderRule.use.find(
      loaderConf => isLessLoader(loaderConf.loader),
    );
    expect(lessLoaderConf.options).toEqual(
      {
        sourceMap: shouldUseSourceMap,
        lessOptions: {
          rewriteUrls: 'local',
        },
      },
    );
  });
});

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
  const actual = disableChunk()(inputConfig);

  expect(actual).toMatchSnapshot();
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
  const actual = addPostcssPlugins(plugins)(inputConfig);

  expect(actual).toMatchSnapshot();
  const result = actual.module.rules[0].oneOf[0].use[0].options
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
  const actual = removeModuleScopePlugin()(inputConfig);

  expect(actual).toMatchSnapshot();
});

test("setWebpackTarget sets the target as the config target", () => {
  const inputConfig = {
    target: "mocked-initial-target"
  };

  const actual = setWebpackTarget("mocked-new-target")(inputConfig);

  expect(actual).toMatchSnapshot();
});

describe("setWebpackPublicPath", () => {
  test("sets the path and prepends and appends slashes", () => {
    const inputConfig = {
      output: {
        publicPath: "mocked-public-path"
      }
    };

    const actual = setWebpackPublicPath("mocked-public-path")(inputConfig);

    expect(actual).toMatchSnapshot();
  });

  test("sets the path as an http address", () => {
    const inputConfig = {
      output: {}
    };

    const actual = setWebpackPublicPath("http://github.com")(inputConfig);

    expect(actual).toMatchSnapshot();
  });

  test("sets the path as an https address", () => {
    const inputConfig = {
      output: {}
    };

    const actual = setWebpackPublicPath("https://github.com")(inputConfig);

    expect(actual).toMatchSnapshot();
  });
});

test("setWebpackOptimizationSplitChunks sets the customized optimization.splitChunks for webpack", () => {
  const inputConfig = {
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    }
  };

  const actual = setWebpackOptimizationSplitChunks({
    chunks: "all",
    maxSize: 1000000
  })(inputConfig);

  expect(actual).toMatchSnapshot();
});

describe("setWebpackStats", () => {
  test("sets stats if it is a string", () => {
    const config = {};
    const actual = setWebpackStats("fake-normal-stats")(config);

    expect(actual).toMatchSnapshot();
  });

  test("sets stats if it is an object", () => {
    const config = {};
    const actual = setWebpackStats({ assets: false })(config);

    expect(actual).toMatchSnapshot();
  });

  test("overrides the config stats object with the provided stats object", () => {
    const config = { stats: { a: "A", b: "B" } };
    const stats = { b: "b", c: "c" };
    const actual = setWebpackStats(stats)(config);

    expect(actual).toMatchSnapshot();
  });
});
