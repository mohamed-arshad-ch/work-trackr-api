import { Response, NextFunction } from 'express';
import { AuthRequest, RegisterUserData, LoginUserData, UpdateProfileData } from '../types/auth';
import { UserService } from '../services/userService';
import { BlobService } from '../services/blobService';
import { ValidationError } from '../utils/errors';

const userService = new UserService();
const blobService = new BlobService();

export class UserController {
  async registerUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: RegisterUserData = req.body;
      
      // Create user
      const user = await userService.createUser(userData);
      
      // Generate tokens
      const tokens = userService.generateTokens({
        userId: user.id,
        email: user.email
      });
      
      // Store refresh token
      await userService.storeRefreshToken(user.id, tokens.refreshToken);
      
      // Return sanitized user data with tokens
      const sanitizedUser = userService.sanitizeUser(user);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: sanitizedUser,
          tokens
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginData: LoginUserData = req.body;
      
      // Authenticate user
      const user = await userService.authenticateUser(loginData);
      
      // Generate tokens
      const tokens = userService.generateTokens({
        userId: user.id,
        email: user.email
      });
      
      // Store refresh token
      await userService.storeRefreshToken(user.id, tokens.refreshToken);
      
      // Return sanitized user data with tokens
      const sanitizedUser = userService.sanitizeUser(user);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: sanitizedUser,
          tokens
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      // Validate refresh token and get user
      const user = await userService.validateRefreshToken(refreshToken);
      
      // Generate new tokens
      const tokens = userService.generateTokens({
        userId: user.id,
        email: user.email
      });
      
      // Store new refresh token
      await userService.storeRefreshToken(user.id, tokens.refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { tokens }
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'AUTHENTICATION_REQUIRED'
        });
        return;
      }

      const sanitizedUser = userService.sanitizeUser(req.user);
      
      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: { user: sanitizedUser }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'AUTHENTICATION_REQUIRED'
        });
        return;
      }

      const updateData: UpdateProfileData = req.body;
      
      // Update user profile
      const updatedUser = await userService.updateUserProfile(req.user.id, updateData);
      
      // Return sanitized updated user data
      const sanitizedUser = userService.sanitizeUser(updatedUser);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: sanitizedUser }
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadLogo(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'AUTHENTICATION_REQUIRED'
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
          error: 'FILE_REQUIRED'
        });
        return;
      }

      // Validate file type and size
      if (!blobService.isValidImageType(req.file.mimetype)) {
        res.status(400).json({
          success: false,
          message: 'Only image files (JPEG, PNG, GIF, WebP) are allowed',
          error: 'INVALID_FILE_TYPE'
        });
        return;
      }

      if (!blobService.isValidFileSize(req.file.size)) {
        res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 2MB.',
          error: 'FILE_TOO_LARGE'
        });
        return;
      }

      try {
        // Upload file to Vercel Blob
        const uploadResult = await blobService.uploadFile(req.file, req.user.id);

        // Delete old logo if exists
        if (req.user.companyLogo) {
          await blobService.deleteFile(req.user.companyLogo);
        }

        // Update user with new logo URL
        const updatedUser = await userService.updateUserLogo(req.user.id, uploadResult.url);
        
        // Return sanitized updated user data
        const sanitizedUser = userService.sanitizeUser(updatedUser);
        
        res.status(200).json({
          success: true,
          message: 'Logo uploaded successfully',
          data: { 
            user: sanitizedUser,
            logoUrl: uploadResult.url
          }
        });
      } catch (error) {
        throw error;
      }
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'AUTHENTICATION_REQUIRED'
        });
        return;
      }

      // Clear refresh token from database
      await userService.storeRefreshToken(req.user.id, '');
      
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }
} 