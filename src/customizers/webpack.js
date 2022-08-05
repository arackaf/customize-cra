import { getBabelLoader } from "../utilities";

export const addBundleVisualizer = (
  options = {},
  behindFlag = false
) => config => {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

  // if behindFlag is set to true, the report will be created only if
  // the `--analyze` flag is added to the `yarn build` command
  if (behindFlag ? process.argv.includes("--analyze") : true) {
    config.plugins.push(
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
  return config;
};

export const disableEsLint = () => config => {
  let eslintRules = config.module.rules.filter(
    r => r.use && r.use.some(u => u.options && u.options.useEslintrc !== void 0)
  );
  eslintRules.forEach(rule => {
    config.module.rules = config.module.rules.filter(r => r !== rule);
  });
  return config;
};

export const addWebpackAlias = alias => config => {
  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  Object.assign(config.resolve.alias, alias);
  return config;
};

export const addWebpackResolve = resolve => config => {
  if (!config.resolve) {
    config.resolve = {};
  }
  Object.assign(config.resolve, resolve);
  return config;
};

export const addWebpackPlugin = plugin => config => {
  config.plugins.push(plugin);
  return config;
};

export const adjustWorkbox = adjust => config => {
  config.plugins.forEach(p => {
    if (p.constructor.name === "GenerateSW") {
      adjust(p.config);
    }
  });
  return config;
};

export const adjustStyleLoaders = callback => config => {
  const mode = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
  const loader = mode === 'prod' ? 'css-extract-plugin' : 'style-loader';

  const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    .oneOf;
  const styleLoaders = loaders.filter(({ use }) => use && use[0] && (use[0].loader || use[0]).includes(loader));
  styleLoaders.forEach(loader => callback(loader));

  return config;
};

export const useEslintRc = configFile => config => {
  const eslintRule = config.module.rules.filter(
    r => r.use && r.use.some(u => u.options && u.options.useEslintrc !== void 0)
  )[0];

  eslintRule.use[0].options.useEslintrc = true;
  eslintRule.use[0].options.ignore = true;
  eslintRule.use[0].options.configFile = configFile;

  delete eslintRule.use[0].options.baseConfig;

  const rules = config.module.rules.map(r =>
    r.use && r.use.some(u => u.options && u.options.useEslintrc !== void 0)
      ? eslintRule
      : r
  );
  config.module.rules = rules;

  return config;
};

export const enableEslintTypescript = () => config => {
  const eslintRule = config.module.rules.filter(
    r => r.use && r.use.some(u => u.options && u.options.useEslintrc !== void 0)
  )[0];

  eslintRule.test = /\.([j,t]sx?|mjs)$/;

  const rules = config.module.rules.map(r =>
    r.use && r.use.some(u => u.options && u.options.useEslintrc !== void 0)
      ? eslintRule
      : r
  );
  config.module.rules = rules;

  return config;
};

export const addLessLoader = (loaderOptions = {}, customCssModules = {}) => config => {
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const postcssNormalize = require("postcss-normalize");

  const cssLoaderOptions = loaderOptions.cssLoaderOptions || {};

  const { localIdentName } = loaderOptions;
  let cssModules = loaderOptions.cssModules || { localIdentName };

  if (!cssModules.localIdentName) {
    cssModules = customCssModules;
  }

  cssModules.localIdentName = cssModules.localIdentName || "[local]--[hash:base64:5]";

  const lessRegex = /\.less$/;
  const lessModuleRegex = /\.module\.less$/;

  const webpackEnv = process.env.NODE_ENV;
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
  const publicPath = config.output.publicPath;
  const shouldUseRelativeAssetPaths = publicPath === "./";

  const { version } = require('webpack');
  const webpackVersion = version.split(".")[0] * 1

  const lessOptions = webpackVersion < 5 ? {
    ident: "postcss",
    plugins: () => [
      require("postcss-flexbugs-fixes"),
      require("postcss-preset-env")({
        autoprefixer: {
          flexbox: "no-2009"
        },
        stage: 3
      }),
      postcssNormalize()
    ],
    sourceMap: isEnvProduction && shouldUseSourceMap
  } : {
    postcssOptions: {
      ident: 'postcss',
      config: false,
      plugins: [
        'postcss-flexbugs-fixes',
        [
          'postcss-preset-env',
          {
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          },
        ],
        'postcss-normalize',
      ]
    },
    sourceMap: isEnvProduction && shouldUseSourceMap
  }

  // copy from react-scripts
  // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js#L93
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: shouldUseRelativeAssetPaths ? { publicPath: "../../" } : {}
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions
      },
      {
        loader: require.resolve("postcss-loader"),
        options: lessOptions
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve("resolve-url-loader"),
          options: {
            sourceMap: isEnvProduction && shouldUseSourceMap
          }
        },
        {
          loader: require.resolve(preProcessor),
          // not the same as react-scripts
          options: Object.assign(
            {
              sourceMap: true
            },
            loaderOptions
          )
        }
      );
    }
    return loaders;
  };

  const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    .oneOf;

  // Insert less-loader as the penultimate item of loaders (before file-loader)
  loaders.splice(
    loaders.length - 1,
    0,
    {
      test: lessRegex,
      exclude: lessModuleRegex,
      use: getStyleLoaders(
        Object.assign(
          {
            importLoaders: 2,
            sourceMap: isEnvProduction && shouldUseSourceMap
          },
          cssLoaderOptions
        ),
        "less-loader"
      )
    },
    {
      test: lessModuleRegex,
      use: getStyleLoaders(
        Object.assign(
          {
            importLoaders: 2,
            sourceMap: isEnvProduction && shouldUseSourceMap
          },
          cssLoaderOptions,
          {
            modules: cssModules
          }
        ),
        "less-loader"
      )
    }
  );

  return config;
};

// to be used inside `overrideDevServer`, makes CRA watch all the folders
// included `node_modules`, useful when you are working with linked packages
// usage: `yarn start --watch-all`
export const watchAll = () => config => {
  if (process.argv.includes("--watch-all")) {
    delete config.watchOptions;
  }
  return config;
};

// to be used to disable chunk according to:
// https://github.com/facebook/create-react-app/issues/5306#issuecomment-433425838
export const disableChunk = () => config => {
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false
    }
  };

  config.optimization.runtimeChunk = false;

  return config;
};

// to be used to ignore replace packages with global variable
// Useful when trying to offload libs to CDN
export const addWebpackExternals = externalDeps => config => {
  let externals = config.externals;
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

  config.externals = externals;
  return config;
};

export const addPostcssPlugins = plugins => config => {
  const rules = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    .oneOf;
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
  return config;
};

// This will remove the CRA plugin that prevents to import modules from
// outside the `src` directory, useful if you use a different directory
export const removeModuleScopePlugin = () => config => {
  config.resolve.plugins = config.resolve.plugins.filter(
    p => p.constructor.name !== "ModuleScopePlugin"
  );
  return config;
};

/**
 * Add the provided module to the webpack module rules array.
 *
 * @param rule The rule to be added
 * @see https://webpack.js.org/configuration/module/#modulerules
 */
export const addWebpackModuleRule = rule => config => {
  for (let _rule of config.module.rules) {
    if (_rule.oneOf) {
      _rule.oneOf.unshift(rule);
      break;
    }
  }
  return config;
};

export const addTslintLoader = options => config => {
  config.module.rules.unshift({
    test: /\.(ts|tsx)$/,
    loader: "tslint-loader",
    options,
    enforce: "pre"
  });
  return config;
};

/**
 * Override the webpack target.
 *
 * @param target What to set the webpack target as (can be string or function).
 *
 * @see https://webpack.js.org/configuration/target/
 */
export const setWebpackTarget = target => config => {
  config.target = target;
  return config;
};

/**
 * override the webpack publicPath
 *
 * @param path What to set the webpack publicPath as.
 * @see https://webpack.js.org/configuration/output/#outputpublicpath
 */
export const setWebpackPublicPath = path => config => {
  if (path) {
    if (!(path.startsWith("http") || path.startsWith("https"))) {
      if (!path.startsWith("/")) {
        path = "/" + path;
      }
    }
    if (!path.endsWith("/")) {
      path = path + "/";
    }
    config.output.publicPath = path;
  }
  return config;
};

/**
 * override the webpack optimization.splitChunks
 *
 * @param configuration of optimization.splitChunks
 * @see https://webpack.js.org/plugins/split-chunks-plugin/
 */
export const setWebpackOptimizationSplitChunks = splitChunks => config => {
  if (splitChunks && typeof splitChunks === "object") {
    config.optimization.splitChunks = splitChunks;
  }
  return config;
};

/**
 * Sets the `stats` object in Webpack config
 * This may not work in development mode
 *
 * @param stats Stats configuration in Webpack
 * @see https://webpack.js.org/configuration/stats/
 */
export const setWebpackStats = stats => config => {
  config.stats = stats;
  return config;
};
