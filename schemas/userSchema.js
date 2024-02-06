const Joi = require("joi");

const { regexp } = require("../vars");

exports.userJoiSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(64)
    .required()
    .messages({ "any.required": "Set password for user" }),
  email: Joi.string().pattern(regexp.emailRegexp).required().messages({
    "any.required": "Email is required",
    "string.pattern.base": "Email {:[.]} is not valid",
  }),
});

exports.userEmailSchema = Joi.object({
  email: Joi.string().pattern(regexp.emailRegexp).required().messages({
    "any.required": "Missing required field email",
    "string.pattern.base": "Email {:[.]} is not valid",
  }),
});

exports.userUpdateSchema = Joi.object({
  gender: Joi.string().valid("female", "male").required().messages({
    "any.required": "Missing required field gender",
  }),
  name: Joi.string().allow("").required().messages({
    "any.required": "Missing required field name",
  }),
  email: Joi.string().pattern(regexp.emailRegexp).required().messages({
    "any.required": "Missing required field email",
  }),
  password: Joi.string().min(8).max(64),
  newPassword: Joi.when("password", {
    is: Joi.exist(),
    then: Joi.string().min(8).max(64).required().messages({
      "any.required": "Missing required field newPassword",
    }),
  }),
});

exports.passwordJoiSchema = Joi.object({
  newPassword: Joi.string()
    .min(8)
    .max(64)
    .required()
    .messages({ "any.required": "Set password for user" }),
});

exports.refreshTokenJoiSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

exports.updateWaterRateJoiSchema = Joi.object({
  waterRate: Joi.string().required(),
});
