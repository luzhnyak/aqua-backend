const Joi = require("joi");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

exports.userJoiSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(64)
    .required()
    .messages({ "any.required": "Set password for user" }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "Email is required",
    "string.pattern.base": "Email {:[.]} is not valid",
  }),
});

exports.userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "Missing required field email",
    "string.pattern.base": "Email {:[.]} is not valid",
  }),
});
