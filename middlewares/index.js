const validateBody = require("./validateBody");
const authenticate = require("./authenticate");
const waterMiddleware = require('./waterMiddleware');
const validateQuery = require('./validateQuery');
const validateParams = require('./validateParams');

module.exports = {
    validateBody,
    authenticate,
    waterMiddleware,
    validateQuery,
    validateParams
};
