const Joi = require('joi');

module.exports = {
  addService: Joi.object({
    event_manage_id: Joi.string().empty().required().messages({
      'string.base': 'Event id should be type of String ',
      'string.empty': 'Event id should not be empty',
      'any.required': 'Event id is required',
    }),
    service_name: Joi.string().empty().required().messages({
      'string.base': 'Service name should be type of String ',
      'string.empty': 'Service name should not be empty',
      'any.required': 'Service name is required',
    }),
    price: Joi.number().empty().required().messages({
      'number.base': 'Price should be type of number ',
      'number.empty': 'Price should not be empty',
      'any.required': 'Price is required',
    }),
    service_description: Joi.string().empty().required().messages({
      'string.base': 'Service description should be type of String ',
      'string.empty': 'Service description should not be empty',
      'any.required': 'Service description is required',
    }),
  }),

  updateService: Joi.object({
    service_name: Joi.string().empty().messages({
      'string.base': 'Service name should be type of String ',
      'string.empty': 'Service name should not be empty',
    }),
    price: Joi.number().empty().messages({
      'number.base': 'Price should be type of number ',
      'number.empty': 'Price should not be empty',
    }),
    service_description: Joi.string().empty().messages({
      'string.base': 'Service description should be type of String ',
      'string.empty': 'Service description should not be empty',
    }),
  }),

  listOfService: Joi.object({
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