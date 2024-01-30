const validateBody = require("./validateBody");
const authenticate = require("./authenticate");
const waterMiddleware = require('./waterMiddleware');
const validateQuery = require('./validateQuery');

module.exports = {
    validateBody,
    authenticate,
    waterMiddleware,
    validateQuery,
};
