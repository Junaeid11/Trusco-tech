"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    static async register(req, res, next) {
        try {
            const { name, email, password, phone } = req.body;
            const user = await auth_service_1.AuthService.register({
                name,
                email,
                password,
                phone,
            });
            const response = {
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                    },
                },
            };
            res.status(201).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, tokens } = await auth_service_1.AuthService.login(email, password);
            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            const response = {
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                    },
                    tokens: {
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                    },
                },
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies['refreshToken'] || req.body.refreshToken;
            if (!refreshToken) {
                res.status(401).json({
                    success: false,
                    message: 'Refresh token required',
                    code: 'REFRESH_TOKEN_REQUIRED',
                });
                return;
            }
            const tokens = await auth_service_1.AuthService.refreshToken(refreshToken);
            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            const response = {
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    tokens: {
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                    },
                },
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            const userId = req.user?._id;
            if (userId) {
                await auth_service_1.AuthService.logout(userId.toString());
            }
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            const response = {
                success: true,
                message: 'Logout successful',
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async me(req, res, next) {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                    code: 'AUTHENTICATION_REQUIRED',
                });
                return;
            }
            const response = {
                success: true,
                message: 'User profile retrieved successfully',
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                        addresses: user.addresses,
                        wishlist: user.wishlist,
                    },
                },
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async changePassword(req, res, next) {
        try {
            const userId = req.user._id.toString();
            const { currentPassword, newPassword } = req.body;
            await auth_service_1.AuthService.changePassword(userId, currentPassword, newPassword);
            const response = {
                success: true,
                message: 'Password changed successfully',
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            await auth_service_1.AuthService.forgotPassword(email);
            const response = {
                success: true,
                message: 'Password reset email sent (if user exists)',
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async resetPassword(req, res, next) {
        try {
            const { token, newPassword } = req.body;
            await auth_service_1.AuthService.resetPassword(token, newPassword);
            const response = {
                success: true,
                message: 'Password reset successfully',
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map