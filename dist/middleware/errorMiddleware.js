"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const errorHandler = (error, req, res, next) => {
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    if (error instanceof errors_1.AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            error: 'OPERATIONAL_ERROR'
        });
        return;
    }
    if (error.name === 'PrismaClientKnownRequestError') {
        const prismaError = error;
        if (prismaError.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'Resource already exists',
                error: 'DUPLICATE_RESOURCE'
            });
            return;
        }
        if (prismaError.code === 'P2025') {
            res.status(404).json({
                success: false,
                message: 'Resource not found',
                error: 'RESOURCE_NOT_FOUND'
            });
            return;
        }
    }
    if (error.name === 'PrismaClientValidationError') {
        res.status(400).json({
            success: false,
            message: 'Invalid data provided',
            error: 'VALIDATION_ERROR'
        });
        return;
    }
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: 'INVALID_TOKEN'
        });
        return;
    }
    if (error.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            message: 'Token expired',
            error: 'TOKEN_EXPIRED'
        });
        return;
    }
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong'
            : error.message,
        error: 'INTERNAL_SERVER_ERROR'
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        error: 'ROUTE_NOT_FOUND'
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorMiddleware.js.map