const addBabelPlugin = require("./addBabelPlugin");

const addBabelPlugins = (...plugins) => plugins.map(p => addBabelPlugin(p));

module.exports = addBabelPlugins;
