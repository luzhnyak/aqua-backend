const { HttpError } = require("../helpers");

const validateQuery = schema => (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) throw HttpError(400, error.message)
    next()
}

module.exports = validateQuery;