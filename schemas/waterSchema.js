const Joi = require('joi');
const { regexp, constants } = require('../vars');

const water = Joi.object({
    waterVolume: Joi.number().min(1).max(5000).required().messages({
        'number.base': 'WaterVolume should be a type of number',
        'number.min': 'Min value 1 ml',
        'number.max': 'Max value 5000 ml',
        'any.required': 'Water volume is required',
    }),
    time: Joi.string()
        .pattern(regexp.time)
        .required()
        .messages({ 'any.required': 'Time is required'}),
});

exports.addWater = Joi.object({
    date: Joi.string().pattern(regexp.date).required().messages({
        'any.required': 'Date is required', 'string.pattern.base': 'Date mast be "d Month yyyy" format' 
    }),
    water,
});

exports.update = water;

exports.query = Joi.object({
    year: Joi.number().min(1970).messages({
        'number.base': 'Year should be a type of number',
        'number.min': 'Min value 1970 year',
    }),
    month: Joi.string().valid(...constants.MONTH),
});

exports.getDay = Joi.object({
    date: Joi.string().pattern(regexp.dateParams).required().messages({
        'any.required': 'Date is required',
        'string.pattern.base': 'Date mast be "d-Month-yyyy" format',
    }),
});