// to be used inside `overrideDevServer`, makes CRA watch all the folders
// included `node_modules`, useful when you are working with linked packages
// usage: `yarn start --watch-all`
const watchAll = () => config => {
  if (process.argv.includes("--watch-all")) {
    delete config.watchOptions;
  }
  return config;
};

module.exports = watchAll;
