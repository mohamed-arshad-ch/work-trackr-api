import { Response, NextFunction } from 'express';
import { AuthRequest, RegisterUserData, LoginUserData, UpdateProfileData } from '../types/auth';
import { UserService } from '../services/userService';
import { deleteUploadedFile } from '../middleware/uploadMiddleware';

const userService = new UserService();

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

      try {
        // Delete old logo if exists
        if (req.user.companyLogo) {
          deleteUploadedFile(req.user.companyLogo);
        }

        // Update user with new logo path
        const logoPath = req.file.path;
        const updatedUser = await userService.updateUserLogo(req.user.id, logoPath);
        
        // Return sanitized updated user data
        const sanitizedUser = userService.sanitizeUser(updatedUser);
        
        res.status(200).json({
          success: true,
          message: 'Logo uploaded successfully',
          data: { 
            user: sanitizedUser,
            logoUrl: `/uploads/logos/${req.file.filename}`
          }
        });
      } catch (error) {
        // If database update fails, delete the uploaded file
        if (req.file) {
          deleteUploadedFile(req.file.path);
        }
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