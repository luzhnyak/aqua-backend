const Joi = require('joi');
const { regexp } = require('../vars');

exports.addWater = Joi.object({
    waterVolume: Joi.number().min(1).max(5000).required().messages({
        'number.min': 'Min value 1 ml',
        'number.max': 'Max value 5000 ml',
        'any.required': 'Water volume is required',
    }),
    time: Joi.string()
        .pattern(regexp.time)
        .required()
        .messages({ 'any.required': 'Time is required' }),
});

exports.updateEntry = Joi.object({
    date: Joi.date().required().messages({ 'any.required': 'Date is required' }),
    time: Joi.string()
        .pattern(regexp.time)
        .required()
        .messages({ 'any.required': 'Time is required' }),
    waterVolume: Joi.number().min(1).max(5000).required().messages({
        'number.min': 'Min value 1 ml',
        'number.max': 'Max value 5000 ml',
        'any.required': 'Water volume is required',
    }),
});