import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth';
export declare class UserController {
    registerUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    loginUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    uploadLogo(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=userController.d.ts.map