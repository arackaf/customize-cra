/**
 *
 * Returns the `babel` loader from the provided `config`.
 *
 * `create-react-app` defines two `babel` configurations, one for js files
 * found in `src/` and another for any js files found outside that directory.
 * This function can target either using the `isOutsideOfApp` param.
 *
 * @param {*} config The webpack config to search.
 * @param {boolean} isOutsideOfApp Flag for whether to use the `babel-loader`
 * for matching files in `src/` or files outside of `src/`.
 */
export const getBabelLoader = (config, isOutsideOfApp) => {
  let babelLoaderFilter;
  if (isOutsideOfApp) {
    babelLoaderFilter = rule =>
      rule.loader && rule.loader.includes("babel") && rule.exclude;
  } else {
    babelLoaderFilter = rule =>
      rule.loader && rule.loader.includes("babel") && rule.include;
  }

  // First, try to find the babel loader inside the oneOf array.
  // This is where we can find it when working with react-scripts@2.0.3.
  let loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    .oneOf;

  let babelLoader = loaders.find(babelLoaderFilter);

  // If the loader was not found, try to find it inside of the "use" array, within the rules.
  // This should work when dealing with react-scripts@2.0.0.next.* versions.
  if (!babelLoader) {
    loaders = loaders.reduce((ldrs, rule) => ldrs.concat(rule.use || []), []);
    babelLoader = loaders.find(babelLoaderFilter);
  }
  return babelLoader;
};

export const tap = (options) => (config) => {
  const { message, dest } = options || {}
  const print = []
  if (message) print.push(message)
  print.push(JSON.stringify(config, null, 2))

  if (dest) {
    const fs = require('fs')
    fs.appendFile(
      dest,
      `${print.join('\n')}\n`,
      (err) => {
        if (err) throw new Error(err);
        console.log(`customize-cra config written to file ${dest}`);
      }
    )
  }

  print.forEach(sentence => console.log(sentence))

  return config
}
