const Joi = require('joi');
const { regexp } = require('../vars');

exports.addWater = Joi.object({
    waterVolume: Joi.number().min(1).max(5000).required().messages({
        'number.base': 'WaterVolume should be a type of number',
        'number.min': 'Min value 1 ml',
        'number.max': 'Max value 5000 ml',
        'any.required': 'Water volume is required',
    }),
    time: Joi.string()
        .pattern(regexp.time)
        .required()
        .messages({ 'any.required': 'Time is required' }),
});

exports.query = Joi.object({
    year: Joi.number().min(1970).messages({
        'number.base': 'Year should be a type of number',
        'number.min': 'Min value 1970 year',
    }),
    month: Joi.number().min(0).max(11).messages({
        'number.base': 'Month should be a type of number',
        'number.min': 'Min value 0',
        'number.max': 'Max value 11',
    }),
});