const { HttpError } = require("../helpers");

exports.checkCreate = schema => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) throw HttpError(400, error.message);
    next();
};

exports.checkUpdate = schema => (req, res, next) => {
    if (Object.keys(req.body).length === 0) throw HttpError(400, 'missing fields');
    const { error } = schema.validate(req.body);
    if (error) throw HttpError(400, error.message);
    next();
};