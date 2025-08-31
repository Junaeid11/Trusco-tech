"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("@/config");
const user_model_1 = require("@/modules/users/user.model");
const errors_1 = require("@/utils/errors");
class AuthService {
    static async register(userData) {
        const existingUser = await user_model_1.User.findOne({ email: userData.email.toLowerCase() });
        if (existingUser) {
            throw new errors_1.ConflictError('User with this email already exists');
        }
        const user = new user_model_1.User({
            name: userData.name,
            email: userData.email.toLowerCase(),
            phone: userData.phone,
            password: userData.password,
        });
        await user.save();
        return user;
    }
    static async login(email, password) {
        const user = await user_model_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new errors_1.AuthenticationError('Invalid email or password');
        }
        if (!user.isActive) {
            throw new errors_1.AuthenticationError('Account is deactivated');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new errors_1.AuthenticationError('Invalid email or password');
        }
        const tokens = this.generateTokens(user);
        return { user, tokens };
    }
    static async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.jwt.refreshSecret);
            const user = await user_model_1.User.findById(decoded.userId);
            if (!user || !user.isActive) {
                throw new errors_1.AuthenticationError('Invalid refresh token');
            }
            return this.generateTokens(user);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.AuthenticationError('Invalid refresh token');
            }
            throw error;
        }
    }
    static async logout(_userId) {
        return;
    }
    static generateTokens(user) {
        const payload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp: 0,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.accessSecret, {
            expiresIn: config_1.config.jwt.accessExpires,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.refreshSecret, {
            expiresIn: config_1.config.jwt.refreshExpires,
        });
        return { accessToken, refreshToken };
    }
    static verifyAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, config_1.config.jwt.accessSecret);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.AuthenticationError('Invalid access token');
            }
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errors_1.AuthenticationError('Access token expired');
            }
            throw error;
        }
    }
    static async changePassword(userId, currentPassword, newPassword) {
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            throw new errors_1.AuthenticationError('User not found');
        }
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            throw new errors_1.AuthenticationError('Current password is incorrect');
        }
        const newPasswordHash = await bcryptjs_1.default.hash(newPassword, 12);
        user.passwordHash = newPasswordHash;
        await user.save();
    }
    static async forgotPassword(email) {
        const user = await user_model_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return;
        }
        const resetToken = jsonwebtoken_1.default.sign({ userId: user._id.toString(), type: 'password_reset' }, config_1.config.jwt.accessSecret, { expiresIn: '1h' });
        console.log(`Password reset token for ${email}: ${resetToken}`);
    }
    static async resetPassword(token, newPassword) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.accessSecret);
            if (decoded.type !== 'password_reset') {
                throw new errors_1.AuthenticationError('Invalid reset token');
            }
            const user = await user_model_1.User.findById(decoded.userId);
            if (!user) {
                throw new errors_1.AuthenticationError('User not found');
            }
            const newPasswordHash = await bcryptjs_1.default.hash(newPassword, 12);
            user.passwordHash = newPasswordHash;
            await user.save();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.AuthenticationError('Invalid reset token');
            }
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errors_1.AuthenticationError('Reset token expired');
            }
            throw error;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map