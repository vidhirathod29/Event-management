const Joi = require('joi');

module.exports = {
  addEvent: Joi.object({
    event_name: Joi.string().empty().max(50).required().messages({
      'string.base': 'Event name should be type of string',
      'string.empty': 'Event name should not be empty',
      'string.max': 'Event name should have maximum length of 50',
    }),
    event_description: Joi.string().empty().max(250).required().messages({
      'string.base': 'Event description should be type of string',
      'string.empty': 'Event description should not be empty',
      'string.max': 'Event description should have maximum length of 250',
    }),
  }),

  updateEvent: Joi.object({
    event_name: Joi.string().optional().max(50).messages({
      'string.base': 'Event name should be type of string',
      'string.max': 'Event name should have maximum length of 50',
    }),
    event_description: Joi.string().optional().max(250).messages({
      'string.base': 'Event description should be type of string',
      'string.max': 'Event description should have maximum length of 250',
    }),
  }),

  listOfEvent: Joi.object({
    condition: Joi.object().optional().messages({
      'object.base': 'Condition should be type of an object',
    }),
    pageSize: Joi.number().optional().messages({
      'number.base': 'pageSize should be type of a number',
    }),
  }),
};