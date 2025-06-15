"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const userService = new userService_1.UserService();
class UserController {
    async registerUser(req, res, next) {
        try {
            const userData = req.body;
            const user = await userService.createUser(userData);
            const tokens = userService.generateTokens({
                userId: user.id,
                email: user.email
            });
            await userService.storeRefreshToken(user.id, tokens.refreshToken);
            const sanitizedUser = userService.sanitizeUser(user);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: sanitizedUser,
                    tokens
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    async loginUser(req, res, next) {
        try {
            const loginData = req.body;
            const user = await userService.authenticateUser(loginData);
            const tokens = userService.generateTokens({
                userId: user.id,
                email: user.email
            });
            await userService.storeRefreshToken(user.id, tokens.refreshToken);
            const sanitizedUser = userService.sanitizeUser(user);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: sanitizedUser,
                    tokens
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const user = await userService.validateRefreshToken(refreshToken);
            const tokens = userService.generateTokens({
                userId: user.id,
                email: user.email
            });
            await userService.storeRefreshToken(user.id, tokens.refreshToken);
            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: { tokens }
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getProfile(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                    error: 'AUTHENTICATION_REQUIRED'
                });
                return;
            }
            const updateData = req.body;
            const updatedUser = await userService.updateUserProfile(req.user.id, updateData);
            const sanitizedUser = userService.sanitizeUser(updatedUser);
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: { user: sanitizedUser }
            });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadLogo(req, res, next) {
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
                if (req.user.companyLogo) {
                    (0, uploadMiddleware_1.deleteUploadedFile)(req.user.companyLogo);
                }
                const logoPath = req.file.path;
                const updatedUser = await userService.updateUserLogo(req.user.id, logoPath);
                const sanitizedUser = userService.sanitizeUser(updatedUser);
                res.status(200).json({
                    success: true,
                    message: 'Logo uploaded successfully',
                    data: {
                        user: sanitizedUser,
                        logoUrl: `/uploads/logos/${req.file.filename}`
                    }
                });
            }
            catch (error) {
                if (req.file) {
                    (0, uploadMiddleware_1.deleteUploadedFile)(req.file.path);
                }
                throw error;
            }
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                    error: 'AUTHENTICATION_REQUIRED'
                });
                return;
            }
            await userService.storeRefreshToken(req.user.id, '');
            res.status(200).json({
                success: true,
                message: 'Logout successful'
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map