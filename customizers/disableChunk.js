// to be used to disable chunk according to:
// https://github.com/facebook/create-react-app/issues/5306#issuecomment-433425838
const disableChunk = () => config => {
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false
    }
  };

  config.optimization.runtimeChunk = false;

  return config;
};

module.exports = disableChunk;
