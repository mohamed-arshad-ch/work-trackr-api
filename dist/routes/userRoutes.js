"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
router.post('/auth/register', validationMiddleware_1.validateRegister, userController.registerUser);
router.post('/auth/login', validationMiddleware_1.validateLogin, userController.loginUser);
router.post('/auth/refresh', validationMiddleware_1.validateRefreshToken, userController.refreshToken);
router.post('/auth/logout', authMiddleware_1.authenticateToken, userController.logout);
router.get('/user/profile', authMiddleware_1.authenticateToken, userController.getProfile);
router.put('/user/profile', authMiddleware_1.authenticateToken, validationMiddleware_1.validateUpdateProfile, userController.updateProfile);
router.post('/user/upload-logo', authMiddleware_1.authenticateToken, uploadMiddleware_1.uploadLogo, uploadMiddleware_1.handleUploadError, userController.uploadLogo);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map