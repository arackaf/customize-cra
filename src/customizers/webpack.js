import { getBabelLoader } from "../utilities";

export const addBundleVisualizer = (
  options = {},
  behindFlag = false
) => config => {
  const c = { ...config };
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

  // if behindFlag is set to true, the report will be created only if
  // the `--analyze` flag is added to the `yarn build` command
  if (behindFlag ? process.argv.includes("--analyze") : true) {
    c.plugins.push(
      new BundleAnalyzerPlugin(
        Object.assign(
          {
            analyzerMode: "static",
            reportFilename: "report.html"
          },
          options
        )
      )
    );
  }
  return c;
};

export const disableEsLint = () => config => {
  const c = { ...config };
  let eslintRules = c.module.rules.filter(
    r => r.use && r.use.some(u => u.options && u.options.useEslintrc !== void 0)
  );
  eslintRules.forEach(rule => {
    c.module.rules = c.module.rules.filter(r => r !== rule);
  });
  return c;
};

export const addWebpackAlias = alias => config => {
  const c = { ...config };

  if (!c.resolve) {
    c.resolve = {};
  }
  if (!c.resolve.alias) {
    c.resolve.alias = {};
  }
  Object.assign(c.resolve.alias, alias);
  return c;
};

export const addWebpackResolve = resolve => config => {
  const c = { ...config };
  if (!c.resolve) {
    c.resolve = {};
  }
  Object.assign(c.resolve, resolve);
  return c;
};

export const addWebpackPlugin = plugin => config => {
  const c = { ...config };
  c.plugins.push(plugin);
  return c;
};

export const adjustWorkbox = adjust => config => {
  const c = { ...config };
  c.plugins.forEach(p => {
    if (p.constructor.name === "GenerateSW") {
      adjust(p.config);
    }
  });
  return c;
};

export const useEslintRc = configFile => config => {
  const c = { ...config };
  const eslintRule = c.module.rules.filter(
    r => r.use && r.use.some(u => u.options && u.options.useEslintrc !== void 0)
  )[0];

  eslintRule.use[0].options.useEslintrc = true;
  eslintRule.use[0].options.ignore = true;
  eslintRule.use[0].options.configFile = configFile;

  delete eslintRule.use[0].options.baseConfig;

  const rules = c.module.rules.map(r =>
    r.use && r.use.some(u => u.options && u.options.useEslintrc !== void 0)
      ? eslintRule
      : r
  );
  c.module.rules = rules;

  return c;
};

export const enableEslintTypescript = () => config => {
  const c = { ...config };
  const eslintRule = c.module.rules.filter(
    r => r.use && r.use.some(u => u.options && u.options.useEslintrc !== void 0)
  )[0];

  eslintRule.test = /\.([j,t]sx?|mjs)$/;

  const rules = c.module.rules.map(r =>
    r.use && r.use.some(u => u.options && u.options.useEslintrc !== void 0)
      ? eslintRule
      : r
  );
  c.module.rules = rules;

  return c;
};

export const addLessLoader = (loaderOptions = {}) => config => {
  const c = { ...config };
  const mode = process.env.NODE_ENV === "development" ? "dev" : "prod";

  // Need these for production mode, which are copied from react-scripts
  const publicPath = require("react-scripts/config/paths").servedPath;
  const shouldUseRelativeAssetPaths = publicPath === "./";
  const shouldUseSourceMap =
    mode === "prod" && process.env.GENERATE_SOURCEMAP !== "false";
  const lessRegex = /\.less$/;
  const lessModuleRegex = /\.module\.less$/;
  const localIdentName =
    loaderOptions.localIdentName || "[path][name]__[local]--[hash:base64:5]";

  const getLessLoader = cssOptions => {
    return [
      mode === "dev"
        ? require.resolve("style-loader")
        : {
            loader: require("mini-css-extract-plugin").loader,
            options: Object.assign(
              {},
              shouldUseRelativeAssetPaths ? { publicPath: "../../" } : undefined
            )
          },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          ident: "postcss",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              autoprefixer: {
                flexbox: "no-2009"
              },
              stage: 3
            })
          ],
          sourceMap: shouldUseSourceMap
        }
      },
      {
        loader: require.resolve("less-loader"),
        options: Object.assign(loaderOptions, {
          source: shouldUseSourceMap
        })
      }
    ];
  };

  const loaders = c.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

  // Insert less-loader as the penultimate item of loaders (before file-loader)
  loaders.splice(
    loaders.length - 1,
    0,
    {
      test: lessRegex,
      exclude: lessModuleRegex,
      use: getLessLoader({
        importLoaders: 2
      }),
      sideEffects: mode === "prod"
    },
    {
      test: lessModuleRegex,
      use: getLessLoader({
        importLoaders: 2,
        modules: true,
        localIdentName: localIdentName
      })
    }
  );

  return c;
};

// to be used inside `overrideDevServer`, makes CRA watch all the folders
// included `node_modules`, useful when you are working with linked packages
// usage: `yarn start --watch-all`
export const watchAll = () => config => {
  const c = { ...config };
  if (process.argv.includes("--watch-all")) {
    delete c.watchOptions;
  }
  return c;
};

// to be used to disable chunk according to:
// https://github.com/facebook/create-react-app/issues/5306#issuecomment-433425838
export const disableChunk = () => config => {
  const c = { ...config };
  c.optimization.splitChunks = {
    cacheGroups: {
      default: false
    }
  };

  c.optimization.runtimeChunk = false;

  return c;
};

// to be used to ignore replace packages with global variable
// Useful when trying to offload libs to CDN
export const addWebpackExternals = externalDeps => config => {
  const c = { ...config };

  let externals = c.externals;
  if (!externals) {
    externals = externalDeps;
  } else if (Array.isArray(externalDeps)) {
    externals = externalDeps.concat(externals);
  } else if (
    Array.isArray(externals) ||
    externalDeps.constructor === Function ||
    externalDeps.constructor === RegExp
  ) {
    externals = [externalDeps].concat(externals);
  } else if (externalDeps instanceof Object && externals instanceof Object) {
    externals = {
      ...externals,
      ...externalDeps
    };
  }

  c.externals = externals;
  return c;
};

export const addPostcssPlugins = plugins => config => {
  const c = { ...config };

  const rules = c.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;
  rules.forEach(
    r =>
      r.use &&
      r.use.forEach(u => {
        if (u.options && u.options.ident === "postcss") {
          if (!u.options.plugins) {
            u.options.plugins = () => [...plugins];
          }
          if (u.options.plugins) {
            const originalPlugins = u.options.plugins;
            u.options.plugins = () => [...originalPlugins(), ...plugins];
          }
        }
      })
  );
  return c;
};

// This will remove the CRA plugin that prevents to import modules from
// outside the `src` directory, useful if you use a different directory
export const removeModuleScopePlugin = () => config => {
  const c = { ...config };
  c.resolve.plugins = c.resolve.plugins.filter(
    p => p.constructor.name !== "ModuleScopePlugin"
  );
  return c;
};

/**
 * Add the provided module to the webpack module rules array.
 *
 * @param rule The rule to be added
 * @see https://webpack.js.org/configuration/module/#modulerules
 */
export const addWebpackModuleRule = rule => config => {
  const c = { ...config };
  c.module.rules.push(rule);
  return c;
};

export const addTslintLoader = options => config => {
  const c = { ...config };
  c.module.rules.unshift({
    test: /\.(ts|tsx)$/,
    loader: "tslint-loader",
    options,
    enforce: "pre"
  });
  return c;
};
