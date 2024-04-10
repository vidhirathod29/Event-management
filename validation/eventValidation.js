const Joi = require('joi');

module.exports = {
  addEvent: Joi.object({
    event_name: Joi.string().empty().max(50).required().messages({
      'string.base': 'Event name should be type of string',
      'string.empty': 'Event name should not be empty',
      'string.max': 'Event name should have maximum length of 50',
      'any.required': 'Event is a required',
    }),
    event_description: Joi.string().empty().max(250).required().messages({
      'string.base': 'Event description should be type of string',
      'string.empty': 'Event description should not be empty',
      'string.max': 'Event description should have maximum length of 250',
      'any.required': 'Event is a required',
    }),
  }),

  updateEvent: Joi.object({
    event_name: Joi.string().empty().max(50).messages({
      'string.base': 'Event name should be type of string',
      'string.empty': 'Event name should not be empty',
      'string.max': 'Event name should have maximum length of 50',
      'any.required': 'Event is a required',
    }),
    event_description: Joi.string().empty().max(250).messages({
      'string.base': 'Event description should be type of string',
      'string.empty': 'Event description should not be empty',
      'string.max': 'Event description should have maximum length of 250',
      'any.required': 'Event is a required',
    }),
  }),

  listOfEvent: Joi.object({
    condition: Joi.object().optional().empty().messages({
      'object.base': 'Condition should be type of an object',
      'object.empty': 'Condition should not be empty',
    }),
    pageSize: Joi.number().optional().empty().messages({
      'number.base': 'pageSize should be type of a number',
      'number.empty': 'pageSize should not be empty',
    }),
  }),
};
