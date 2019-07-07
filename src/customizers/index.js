const webpack = require("./webpack");
const babel = require("./babel");

module.exports = {
  ...babel,
  ...webpack
};
