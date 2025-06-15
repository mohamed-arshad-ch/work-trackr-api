import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
export declare const registerSchema: Joi.ObjectSchema<any>;
export declare const loginSchema: Joi.ObjectSchema<any>;
export declare const updateProfileSchema: Joi.ObjectSchema<any>;
export declare const refreshTokenSchema: Joi.ObjectSchema<any>;
export declare const validate: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRegister: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateLogin: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateUpdateProfile: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRefreshToken: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validationMiddleware.d.ts.map