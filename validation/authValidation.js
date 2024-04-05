const Joi = require('joi');

module.exports = {
  resetPassword: Joi.object({
    oldPassword: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@#$!%*?&]{8,}$/,
      )
      .max(250)
      .required()
      .empty()
      .messages({
        'string.base': `Old password should contain at least 1 uppercase,1 lowercase,1 digit`,
        'string.empty': `Old password cannot be an empty field`,
        'string.min': `Old password should have a minimum length of 8 `,
        'any.required': `Old password is a required field`,
        'string.pattern.base': `Old Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character`,
      }),
    newPassword: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@#$!%*?&]{8,}$/,
      )
      .max(250)
      .required()
      .empty()
      .messages({
        'string.base': `New password should contain at least 1 uppercase,1 lowercase,1 digit`,
        'string.empty': `New password cannot be an empty field`,
        'string.min': `New password should have a minimum length of 8 `,
        'any.required': `New password is a required field`,
        'string.pattern.base': `New password must include at least one uppercase letter, one lowercase letter, one digit, and one special character`,
      }),
    confirmPassword: Joi.valid(Joi.ref('newPassword')).empty().messages({
      'string.base': `Confirm password should contain at least 1 uppercase,1 lowercase,1 digit`,
      'any.only': `Confirm password and new password should be same`,
      'string.empty': `"Confirm password should not be empty`,
    }),
  }),

  updatePassword: Joi.object({
    email: Joi.string()
      .min(11)
      .max(50)
      .empty()
      .pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)
      .messages({
        'string.empty': `Email cannot be an empty field`,
        'string.pattern.base': `Email should be in proper formate`,
        'any.required': `Email is a required field`,
      }),
    otp: Joi.string().min(6).max(50).empty().messages({
      'string.empty': `Otp cannot be an empty field`,
      'string.min': `Otp should contain 6 digits`,
      'any.required': `Otp is a required field`,
    }),
    newPassword: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@#$!%*?&]{8,}$/,
      )
      .max(250)
      .required()
      .empty()
      .messages({
        'string.base': `New password should contain at least 1 uppercase,1 lowercase,1 digit`,
        'string.empty': `New password cannot be an empty field`,
        'string.min': `New password should have a minimum length of 8 `,
        'any.required': `New password is a required field`,
        'string.pattern.base': `New password must include at least one uppercase letter, one lowercase letter, one digit, and one special character`,
      }),
    confirmPassword: Joi.valid(Joi.ref('newPassword')).empty().messages({
      'string.base': `Confirm password should contain at least 1 uppercase,1 lowercase,1 digit`,
      'any.only': `Confirm password and new password should be same`,
      'string.empty': `"Confirm password should not be empty`,
    }),
  }),
};
