"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
class UserService {
    constructor() {
        this.saltRounds = 12;
    }
    async validateUserData(userData) {
        const existingUser = await database_1.default.user.findUnique({
            where: { email: userData.email }
        });
        if (existingUser) {
            throw new errors_1.ConflictError('Email already registered');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new errors_1.ValidationError('Invalid email format');
        }
        if (userData.password.length < 8) {
            throw new errors_1.ValidationError('Password must be at least 8 characters long');
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(userData.password)) {
            throw new errors_1.ValidationError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        }
    }
    async hashPassword(password) {
        return bcryptjs_1.default.hash(password, this.saltRounds);
    }
    async verifyPassword(password, hashedPassword) {
        return bcryptjs_1.default.compare(password, hashedPassword);
    }
    generateTokens(payload) {
        const jwtSecret = process.env.JWT_SECRET;
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
        if (!jwtSecret || !jwtRefreshSecret) {
            throw new Error('JWT secrets not configured');
        }
        const accessToken = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, jwtRefreshSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
        return { accessToken, refreshToken };
    }
    async createUser(userData) {
        await this.validateUserData(userData);
        const hashedPassword = await this.hashPassword(userData.password);
        const user = await database_1.default.user.create({
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
    async authenticateUser(loginData) {
        const user = await database_1.default.user.findUnique({
            where: { email: loginData.email }
        });
        if (!user) {
            throw new errors_1.AuthenticationError('Invalid email or password');
        }
        const isPasswordValid = await this.verifyPassword(loginData.password, user.password);
        if (!isPasswordValid) {
            throw new errors_1.AuthenticationError('Invalid email or password');
        }
        return user;
    }
    async updateUserProfile(userId, updateData) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const updatedUser = await database_1.default.user.update({
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
    async updateUserLogo(userId, logoPath) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const updatedUser = await database_1.default.user.update({
            where: { id: userId },
            data: { companyLogo: logoPath }
        });
        return updatedUser;
    }
    async storeRefreshToken(userId, refreshToken) {
        await database_1.default.user.update({
            where: { id: userId },
            data: { refreshToken }
        });
    }
    async validateRefreshToken(refreshToken) {
        try {
            const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
            if (!jwtRefreshSecret) {
                throw new Error('JWT refresh secret not configured');
            }
            const decoded = jsonwebtoken_1.default.verify(refreshToken, jwtRefreshSecret);
            const user = await database_1.default.user.findFirst({
                where: {
                    id: decoded.userId,
                    refreshToken: refreshToken
                }
            });
            if (!user) {
                throw new errors_1.AuthenticationError('Invalid refresh token');
            }
            return user;
        }
        catch (error) {
            throw new errors_1.AuthenticationError('Invalid refresh token');
        }
    }
    async getUserById(userId) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        return user;
    }
    sanitizeUser(user) {
        const { password, refreshToken, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map