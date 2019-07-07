const customizers = require("./customizers");
const utilities = require("./utilities");
const overrides = require("./overrides");

module.exports = {
  ...customizers,
  ...utilities,
  ...overrides
};
