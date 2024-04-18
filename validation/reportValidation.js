const Joi = require('joi');

module.exports={
    reportValidation : Joi.object({
        eventName: Joi.string().optional().messages({
            'string.base':'Event name should be a string'
        }),
        startDate: Joi.date().optional().messages({
            'date.base':'Start date should be a date'
        }),
        endDate: Joi.date().optional().messages({
            'date.base':'Start date should be a date'
        }),
        userName: Joi.string().optional().messages({
            'string.base':'User name should be a string'
        })
    })
}