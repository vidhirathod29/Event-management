const Joi = require('joi');

module.exports = {
  registration: Joi.object({
    name: Joi.string().min(3).max(30).required().empty().messages({
      'string.base': `name should be a type of text`,
      'string.empty': `name cannot be an empty field`,
      'string.min': `name should have a minimum length of 3`,
      'any.required': `name is a required field`,
    }),

    email: Joi.string().min(11).max(50).required().empty().email().messages({
      'string.empty': `email cannot be an empty field`,
      'any.required': `email is a required field`,
    }),
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
      )
      .max(250)
      .required()
      .empty()
      .messages({
        'string.base': `password should contain at least 1 uppercase,1 lowercase,1 digit`,
        'string.empty': `password cannot be an empty field`,
        'string.min': `password should have a minimum length of 8 `,
        'any.required': `password is a required field`,
        'string.pattern.base': `Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character`,
      }),

    confirmPassword: Joi.valid(Joi.ref('password')).empty().messages({
      'any.only': `confirmPassword and password should be same`,
      'string.empty': `"confirmPassword should not be empty`,
    }),
    phone_number: Joi.string().required().empty().messages({
      'any.required': `Phone number is a required field`,
      'string.empty': `Phone number should not be empty`,
    }),
    profile_image: Joi.string().optional().empty().messages({
      'string.base': `Image must be a string`,
      'string.empty': `Image cannot be empty`,
    }),
    status: Joi.string().required().empty().messages({
      'any.required': `status is a required field`,
      'string.empty': `status should not be empty`,
    }),
    role: Joi.string().required().empty().messages({
      'any.required': `role is a required field`,
      'string.empty': `role should not be empty`,
    }),
  }),

  login: Joi.object({
    email: Joi.string().min(11).max(50).required().empty().email().messages({
      'string.empty': `email cannot be an empty field`,
      'any.required': `email is a required field`,
    }),
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
      )
      .max(250)
      .required()
      .empty()
      .messages({
        'string.base': `password should contain at least 1 uppercase,1 lowercase,1 digit`,
        'string.empty': `password cannot be an empty field`,
        'string.min': `password should have a minimum length of 8 `,
        'any.required': `password is a required field`,
        'string.pattern.base': `Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character`,
      }),
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(30).empty().messages({
      'string.base': `name should be a type of text`,
      'string.empty': `name cannot be an empty field`,
      'string.min': `name should have a minimum length of 3`,
      'any.required': `name is a required field`,
    }),
    email: Joi.string().min(11).max(50).empty().email().messages({
      'string.empty': `email cannot be an empty field`,
      'any.required': `email is a required field`,
    }),
    phone_number: Joi.string().empty().messages({
      'any.required': `Phone number is a required field`,
      'string.empty': `Phone number should not be empty`,
    }),
    profile_image: Joi.string().optional().empty().messages({
      'string.base': `Image must be a string`,
      'string.empty': `Image cannot be empty`,
    }),
    status: Joi.string().empty().messages({
      'any.required': `status is a required field`,
      'string.empty': `status should not be empty`,
    }),
    role: Joi.string().empty().messages({
      'any.required': `role is a required field`,
      'string.empty': `role should not be empty`,
    }),
  }),
};