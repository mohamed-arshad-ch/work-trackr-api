"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRefreshToken = exports.validateUpdateProfile = exports.validateLogin = exports.validateRegister = exports.validate = exports.refreshTokenSchema = exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required'
    }),
    firstName: joi_1.default.string().min(2).max(50).optional().messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name cannot exceed 50 characters'
    }),
    lastName: joi_1.default.string().min(2).max(50).optional().messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name cannot exceed 50 characters'
    }),
    companyName: joi_1.default.string().min(2).max(100).optional().messages({
        'string.min': 'Company name must be at least 2 characters long',
        'string.max': 'Company name cannot exceed 100 characters'
    }),
    companyAddress: joi_1.default.string().max(200).optional().messages({
        'string.max': 'Company address cannot exceed 200 characters'
    }),
    taxId: joi_1.default.string().max(50).optional().messages({
        'string.max': 'Tax ID cannot exceed 50 characters'
    }),
    hourlyRate: joi_1.default.number().positive().precision(2).optional().messages({
        'number.positive': 'Hourly rate must be a positive number',
        'number.precision': 'Hourly rate can have at most 2 decimal places'
    })
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required'
    })
});
exports.updateProfileSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(50).optional().messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name cannot exceed 50 characters'
    }),
    lastName: joi_1.default.string().min(2).max(50).optional().messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name cannot exceed 50 characters'
    }),
    companyName: joi_1.default.string().min(2).max(100).optional().messages({
        'string.min': 'Company name must be at least 2 characters long',
        'string.max': 'Company name cannot exceed 100 characters'
    }),
    companyAddress: joi_1.default.string().max(200).optional().messages({
        'string.max': 'Company address cannot exceed 200 characters'
    }),
    taxId: joi_1.default.string().max(50).optional().messages({
        'string.max': 'Tax ID cannot exceed 50 characters'
    }),
    hourlyRate: joi_1.default.number().positive().precision(2).optional().messages({
        'number.positive': 'Hourly rate must be a positive number',
        'number.precision': 'Hourly rate can have at most 2 decimal places'
    })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});
exports.refreshTokenSchema = joi_1.default.object({
    refreshToken: joi_1.default.string().required().messages({
        'any.required': 'Refresh token is required'
    })
});
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
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
        req.body = value;
        next();
    };
};
exports.validate = validate;
exports.validateRegister = (0, exports.validate)(exports.registerSchema);
exports.validateLogin = (0, exports.validate)(exports.loginSchema);
exports.validateUpdateProfile = (0, exports.validate)(exports.updateProfileSchema);
exports.validateRefreshToken = (0, exports.validate)(exports.refreshTokenSchema);
//# sourceMappingURL=validationMiddleware.js.map