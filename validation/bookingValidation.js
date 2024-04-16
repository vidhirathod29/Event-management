const Joi = require('joi');

module.exports = {
  addBooking: Joi.object({
    address_id: Joi.string().empty().required().messages({
      'string.base': 'Address id should be type of string',
      'string.empty': 'Address id should not be empty',
      'any.required': 'Address id is required',
    }),
    event_manage_id: Joi.string().empty().required().messages({
      'string.base': 'Event id should be type of string',
      'string.empty': 'Event id should not be empty',
      'any.required': 'Event id is required',
    }),
    event_date: Joi.date().empty().required().messages({
      'date.base': 'Event date should be type of date',
      'date.empty': 'Event date should not be empty',
      'any.required': 'Event date is required',
    }),
    additional_information: Joi.string().empty().required().messages({
      'string.base': 'Additional information should be type of string',
      'string.empty': 'Additional information should not be empty',
      'any.required': 'Additional information is required',
    }),
    status: Joi.string().empty().required().messages({
      'string.base': 'Status should be type of string',
      'string.empty': 'Status should not be empty',
      'any.required': 'Status is required',
    }),
  }),

  updateBooking: Joi.object({
    event_date: Joi.date().optional().messages({
      'date.base': 'Event date should be type of date',
    }),
    additional_information: Joi.string().optional().messages({
      'string.base': 'Additional information should be type of string',
    }),
    status: Joi.string().optional().messages({
      'string.base': 'Status should be type of string',
    }),
  }),

  listOfBooking: Joi.object({
    condition: Joi.object().optional().messages({
      'object.base': 'Condition should be type of an object',
    }),
    pageSize: Joi.number().optional().messages({
      'number.base': 'pageSize should be type of a number',
    }),
  }),
};
