const addBabelPreset = require("./addBabelPreset");

const addBabelPresets = (...plugins) => plugins.map(p => addBabelPreset(p));

module.exports = addBabelPresets;
