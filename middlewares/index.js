const validateBody = require("./validateBody");
const authenticate = require("./authenticate");
const waterMiddleware = require('./waterMiddleware');

module.exports = {
  validateBody,
  authenticate,
  waterMiddleware
};
