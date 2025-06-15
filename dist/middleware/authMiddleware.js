"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
const errors_1 = require("../utils/errors");
const userService = new userService_1.UserService();
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            throw new errors_1.AuthenticationError('Access token required');
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT secret not configured');
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await userService.getUserById(decoded.userId);
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Invalid token',
                error: 'INVALID_TOKEN'
            });
        }
        else if (error instanceof errors_1.AuthenticationError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: 'AUTHENTICATION_ERROR'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: 'INTERNAL_ERROR'
            });
        }
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const jwtSecret = process.env.JWT_SECRET;
            if (jwtSecret) {
                const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
                const user = await userService.getUserById(decoded.userId);
                req.user = user;
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=authMiddleware.js.map