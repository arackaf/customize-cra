const addBabelPlugin = require("./addBabelPlugin");

const addDecoratorsLegacy = () => config =>
  addBabelPlugin(["@babel/plugin-proposal-decorators", { legacy: true }])(
    config
  );

module.exports = addDecoratorsLegacy;
