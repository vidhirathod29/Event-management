const Joi = require('joi');
const { ROLES, STATUS } = require('../utils/enum');

module.exports = {
  registration: Joi.object({
    name: Joi.string().min(3).max(30).required().empty().messages({
      'string.base': `Name should be a type of text`,
      'string.empty': `Name cannot be an empty field`,
      'string.min': `Name should have a minimum length of 3`,
      'any.required': `Name is a required field`,
    }),
    email: Joi.string()
      .max(50)
      .required()
      .empty()
      .pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)
      .messages({
        'string.base': `Email should be a type of text`,
        'string.empty': `Email cannot be an empty field`,
        'string.pattern.base"': `Email should be in proper formate`,
        'any.required': `Email is a required field`,
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
        'string.base': `Password should contain at least 1 uppercase,1 lowercase,1 digit`,
        'string.empty': `Password cannot be an empty field`,
        'string.min': `Password should have a minimum length of 8 `,
        'string.pattern.base': `Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character`,
        'any.required': `Password is a required field`,
      }),

    confirmPassword: Joi.valid(Joi.ref('password')).empty().messages({
      'any.only': `Confirm password and password should be same`,
      'string.empty': `"Confirm password should not be empty`,
      'any.required': `Confirm password is a required field`,
    }),
    phoneNumber: Joi.string().required().empty().messages({
      'string.base': `Phone number should be a type of string`,
      'any.required': `Phone number is a required field`,
      'string.empty': `Phone number should not be empty`,
    }),
    status: Joi.string()
      .valid(STATUS.ACTIVE, STATUS.DEACTIVATE)
      .empty()
      .messages({
        'any.required': `status is a required field`,
        'any.only': `Role must be a ${STATUS.ACTIVE} or ${STATUS.DEACTIVATE} `,
        'string.empty': `status should not be empty`,
      }),
    role: Joi.string()
      .required()
      .valid(ROLES.ADMIN, ROLES.ORGANIZATION, ROLES.USER)
      .empty()
      .messages({
        'string.base': `Role should be a type of string`,
        'any.only': `Role must be a ${ROLES.ADMIN} or ${ROLES.ORGANIZATION} or ${ROLES.USER} `,
        'string.empty': `Role should not be empty`,
        'any.required': `Role is a required field`,
      }),
  }),

  login: Joi.object({
    email: Joi.string()
      .min(11)
      .max(50)
      .required()
      .empty()
      .pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)
      .messages({
        'string.base': `Email should be a type of text`,
        'string.empty': `Email cannot be an empty field`,
        'string.pattern.base"': `Email should be in proper formate`,
        'any.required': `Email is a required field`,
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
        'string.base': `Password should contain at least 1 uppercase,1 lowercase,1 digit`,
        'string.empty': `Password cannot be an empty field`,
        'string.min': `Password should have a minimum length of 8 `,
        'string.pattern.base': `Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character`,
        'any.required': `Password is a required field`,
      }),
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(30).empty().messages({
      'string.base': `name should be a type of text`,
      'string.empty': `name cannot be an empty field`,
      'string.min': `name should have a minimum length of 3`,
      'any.required': `name is a required field`,
    }),
    email: Joi.string()
      .min(11)
      .max(50)
      .empty()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
      )
      .messages({
        'string.base': `Email should be a type of text`,
        'string.empty': `Email cannot be an empty field`,
        'string.pattern.base"': `Email should be in proper formate`,
        'any.required': `Email is a required field`,
      }),
    phoneNumber: Joi.string().empty().messages({
      'string.base': `Phone number should be a type of string`,
      'any.required': `Phone number is a required field`,
      'string.empty': `Phone number should not be empty`,
    }),
    status: Joi.string()
      .valid(STATUS.ACTIVE, STATUS.DEACTIVATE)
      .empty()
      .messages({
        'any.required': `status is a required field`,
        'any.only': `Role must be a ${STATUS.ACTIVE} or ${STATUS.DEACTIVATE} `,
        'string.empty': `status should not be empty`,
      }),
  }),
};