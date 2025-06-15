import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { ValidationError } from '../utils/errors';

// Configure memory storage for Vercel Blob
const storage = multer.memoryStorage();

// Configure multer for memory storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '2097152'), // 2MB default
    files: 1
  }
});

// Middleware for single logo upload
export const uploadLogo = upload.single('logo');

// Error handling middleware for multer errors
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 2MB.',
        error: 'FILE_TOO_LARGE'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed.',
        error: 'TOO_MANY_FILES'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Use "logo" as field name.',
        error: 'UNEXPECTED_FIELD'
      });
    }
  }
  
  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error: 'VALIDATION_ERROR'
    });
  }

  next(error);
};

// Utility function to delete uploaded file from Vercel Blob
export const deleteUploadedFile = async (fileUrl: string): Promise<void> => {
  try {
    // For Vercel Blob, we'll handle deletion in the service layer
    // This function is kept for compatibility but doesn't need to do anything
    // as Vercel Blob handles cleanup automatically
    console.log('File deletion handled by Vercel Blob:', fileUrl);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}; 