import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, TokenPayload } from '../types/auth';
import { UserService } from '../services/userService';
import { AuthenticationError } from '../utils/errors';

const userService = new UserService();

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('Access token required');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT secret not configured');
    }

    const decoded = jwt.verify(token, jwtSecret as jwt.Secret) as TokenPayload;
    const user = await userService.getUserById(decoded.userId);
    
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: 'INVALID_TOKEN'
      });
    } else if (error instanceof AuthenticationError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: 'AUTHENTICATION_ERROR'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_ERROR'
      });
    }
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret as jwt.Secret) as TokenPayload;
        const user = await userService.getUserById(decoded.userId);
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
}; 