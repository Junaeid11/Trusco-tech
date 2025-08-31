import { UserDocument } from '@/modules/users/user.model';
import { JWTPayload } from '@/types';
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface LoginResult {
    user: UserDocument;
    tokens: AuthTokens;
}
export declare class AuthService {
    static register(userData: {
        name: string;
        email: string;
        password: string;
        phone?: string;
    }): Promise<UserDocument>;
    static login(email: string, password: string): Promise<LoginResult>;
    static refreshToken(refreshToken: string): Promise<AuthTokens>;
    static logout(_userId: string): Promise<void>;
    static generateTokens(user: UserDocument): AuthTokens;
    static verifyAccessToken(token: string): JWTPayload;
    static changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    static forgotPassword(email: string): Promise<void>;
    static resetPassword(token: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map