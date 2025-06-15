import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle operational errors (known errors)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: 'OPERATIONAL_ERROR'
    });
    return;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    // Unique constraint violation
    if (prismaError.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'Resource already exists',
        error: 'DUPLICATE_RESOURCE'
      });
      return;
    }
    
    // Record not found
    if (prismaError.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Resource not found',
        error: 'RESOURCE_NOT_FOUND'
      });
      return;
    }
  }

  // Handle validation errors from Prisma
  if (error.name === 'PrismaClientValidationError') {
    res.status(400).json({
      success: false,
      message: 'Invalid data provided',
      error: 'VALIDATION_ERROR'
    });
    return;
  }

  // Handle JWT errors
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

  // Handle unexpected errors
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : error.message,
    error: 'INTERNAL_SERVER_ERROR'
  });
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: 'ROUTE_NOT_FOUND'
  });
}; 