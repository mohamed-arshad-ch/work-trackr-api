import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { ValidationError } from '../utils/errors';

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || 'uploads/logos';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `logo-${uniqueSuffix}${extension}`);
  }
});

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '2097152'), // 2MB default
    files: 1
  },
  fileFilter: fileFilter
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

// Utility function to delete uploaded file
export const deleteUploadedFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}; 