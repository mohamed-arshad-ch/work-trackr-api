import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { uploadLogo, handleUploadError } from '../middleware/uploadMiddleware';
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateRefreshToken
} from '../middleware/validationMiddleware';

const router = Router();
const userController = new UserController();

// Authentication routes
router.post('/auth/register', validateRegister, userController.registerUser);
router.post('/auth/login', validateLogin, userController.loginUser);
router.post('/auth/refresh', validateRefreshToken, userController.refreshToken);
router.post('/auth/logout', authenticateToken, userController.logout);

// Profile routes (protected)
router.get('/user/profile', authenticateToken, userController.getProfile);
router.put('/user/profile', authenticateToken, validateUpdateProfile, userController.updateProfile);

// File upload route (protected)
router.post(
  '/user/upload-logo',
  authenticateToken,
  uploadLogo,
  handleUploadError,
  userController.uploadLogo
);

export default router; 