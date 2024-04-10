const Joi = require('joi');

module.exports = {
  addAddress: Joi.object({
    country_id: Joi.string().empty().required().messages({
      'string.base': 'Country id should be type of string',
      'string.empty': 'Country id should not be empty',
      'any.required': 'Country id is required',
    }),
    state_id: Joi.string().empty().required().messages({
      'string.base': 'State id should be type of string',
      'string.empty': 'State id should not be empty',
      'any.required': 'State id is required',
    }),
    city_id: Joi.string().empty().required().messages({
      'string.base': 'City id should be type of string',
      'string.empty': 'City id should not be empty',
      'any.required': 'City id is required',
    }),
    address_line1: Joi.string().empty().required().messages({
      'string.base': 'Address line 1 should be type of string',
      'string.empty': 'Address line 1 should not be empty',
      'any.required': 'Address line 1 is required',
    }),
    address_line2: Joi.string().empty().required().messages({
      'string.base': 'Address line 2 should be type of string',
      'string.empty': 'Address line 2 should not be empty',
      'any.required': 'Address line 2 is required',
    }),
    zip_code: Joi.string().empty().required().min(5).messages({
      'string.base': 'Zip code should be type of string',
      'string.empty': 'Zip code should not be empty',
      'string.min': 'Zip code should have at least 5 characters',
      'any.required': 'Zip code is required',
    }),
  }),

  updateAddress: Joi.object({
    country_id: Joi.string().empty().required().messages({
      'string.base': 'Country id should be type of string',
      'string.empty': 'Country id should not be empty',
      'any.required': 'Country id is required',
    }),
    state_id: Joi.string().empty().required().messages({
      'string.base': 'State id should be type of string',
      'string.empty': 'State id should not be empty',
      'any.required': 'State id is required',
    }),
    city_id: Joi.string().empty().required().messages({
      'string.base': 'City id should be type of string',
      'string.empty': 'City id should not be empty',
      'any.required': 'City id is required',
    }),
    address_line1: Joi.string().empty().messages({
      'string.base': 'Address line 1 should be type of string',
      'string.empty': 'Address line 1 should not be empty',
      'any.required': 'Address line 1 is required',
    }),
    address_line2: Joi.string().empty().messages({
      'string.base': 'Address line 2 should be type of string',
      'string.empty': 'Address line 2 should not be empty',
      'any.required': 'Address line 2 is required',
    }),
    zip_code: Joi.string().empty().min(5).messages({
      'string.base': 'Zip code should be type of string',
      'string.empty': 'Zip code should not be empty',
      'string.min': 'Zip code should have at least 5 characters',
      'any.required': 'Zip code is required',
    }),
  }),

  listOfAddress: Joi.object({
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