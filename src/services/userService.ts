import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../generated/prisma';
import prisma from '../config/database';
import { 
  RegisterUserData, 
  LoginUserData, 
  UpdateProfileData, 
  TokenPayload, 
  AuthTokens 
} from '../types/auth';
import { 
  AuthenticationError, 
  ValidationError, 
  ConflictError, 
  NotFoundError 
} from '../utils/errors';

export class UserService {
  private readonly saltRounds = 12;

  async validateUserData(userData: RegisterUserData): Promise<void> {
    // Check email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new ValidationError('Invalid email format');
    }

    // Validate password strength
    if (userData.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(userData.password)) {
      throw new ValidationError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateTokens(payload: TokenPayload): AuthTokens {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    
    if (!jwtSecret || !jwtRefreshSecret) {
      throw new Error('JWT secrets not configured');
    }

    const accessToken = jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      payload,
      jwtRefreshSecret,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  async createUser(userData: RegisterUserData): Promise<User> {
    await this.validateUserData(userData);
    
    const hashedPassword = await this.hashPassword(userData.password);
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        companyName: userData.companyName,
        companyAddress: userData.companyAddress,
        taxId: userData.taxId,
        hourlyRate: userData.hourlyRate
      }
    });

    return user;
  }

  async authenticateUser(loginData: LoginUserData): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email: loginData.email }
    });

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isPasswordValid = await this.verifyPassword(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    return user;
  }

  async updateUserProfile(userId: string, updateData: UpdateProfileData): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        companyName: updateData.companyName,
        companyAddress: updateData.companyAddress,
        taxId: updateData.taxId,
        hourlyRate: updateData.hourlyRate
      }
    });

    return updatedUser;
  }

  async updateUserLogo(userId: string, logoPath: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { companyLogo: logoPath }
    });

    return updatedUser;
  }

  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken }
    });
  }

  async validateRefreshToken(refreshToken: string): Promise<User> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
      
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.userId,
          refreshToken: refreshToken
        }
      });

      if (!user) {
        throw new AuthenticationError('Invalid refresh token');
      }

      return user;
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  async getUserById(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  sanitizeUser(user: User): Omit<User, 'password' | 'refreshToken'> {
    const { password, refreshToken, ...sanitizedUser } = user;
    return sanitizedUser;
  }
} 