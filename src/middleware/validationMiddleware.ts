import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

// Validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters'
  }),
  lastName: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 50 characters'
  }),
  companyName: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Company name must be at least 2 characters long',
    'string.max': 'Company name cannot exceed 100 characters'
  }),
  companyAddress: Joi.string().max(200).optional().messages({
    'string.max': 'Company address cannot exceed 200 characters'
  }),
  taxId: Joi.string().max(50).optional().messages({
    'string.max': 'Tax ID cannot exceed 50 characters'
  }),
  hourlyRate: Joi.number().positive().precision(2).optional().messages({
    'number.positive': 'Hourly rate must be a positive number',
    'number.precision': 'Hourly rate can have at most 2 decimal places'
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters'
  }),
  lastName: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 50 characters'
  }),
  companyName: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Company name must be at least 2 characters long',
    'string.max': 'Company name cannot exceed 100 characters'
  }),
  companyAddress: Joi.string().max(200).optional().messages({
    'string.max': 'Company address cannot exceed 200 characters'
  }),
  taxId: Joi.string().max(50).optional().messages({
    'string.max': 'Tax ID cannot exceed 50 characters'
  }),
  hourlyRate: Joi.number().positive().precision(2).optional().messages({
    'number.positive': 'Hourly rate must be a positive number',
    'number.precision': 'Hourly rate can have at most 2 decimal places'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required'
  })
});

// Generic validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
        error: 'VALIDATION_ERROR'
      });
      return;
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Specific validation middlewares
export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateUpdateProfile = validate(updateProfileSchema);
export const validateRefreshToken = validate(refreshTokenSchema);
 