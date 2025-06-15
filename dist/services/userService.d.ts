import { User } from '../generated/prisma';
import { RegisterUserData, LoginUserData, UpdateProfileData, TokenPayload, AuthTokens } from '../types/auth';
export declare class UserService {
    private readonly saltRounds;
    validateUserData(userData: RegisterUserData): Promise<void>;
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
    generateTokens(payload: TokenPayload): AuthTokens;
    createUser(userData: RegisterUserData): Promise<User>;
    authenticateUser(loginData: LoginUserData): Promise<User>;
    updateUserProfile(userId: string, updateData: UpdateProfileData): Promise<User>;
    updateUserLogo(userId: string, logoPath: string): Promise<User>;
    storeRefreshToken(userId: string, refreshToken: string): Promise<void>;
    validateRefreshToken(refreshToken: string): Promise<User>;
    getUserById(userId: string): Promise<User>;
    sanitizeUser(user: User): Omit<User, 'password' | 'refreshToken'>;
}
//# sourceMappingURL=userService.d.ts.map