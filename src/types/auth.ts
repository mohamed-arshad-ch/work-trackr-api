import { Request } from 'express';
import { User } from '../generated/prisma';

export interface AuthRequest extends Request {
  user?: User;
}

export interface RegisterUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  companyAddress?: string;
  taxId?: string;
  hourlyRate?: number;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  companyAddress?: string;
  taxId?: string;
  hourlyRate?: number;
}

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
} 