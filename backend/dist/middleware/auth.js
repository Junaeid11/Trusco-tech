"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireCustomer = exports.requireAdmin = exports.requireRole = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@/config");
const user_model_1 = require("@/modules/users/user.model");
const errors_1 = require("@/utils/errors");
const requireAuth = async (req, _res, next) => {
    try {
        const token = req.cookies['accessToken'] || req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new errors_1.AuthenticationError('Access token required');
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.accessSecret);
        const user = await user_model_1.User.findById(decoded.userId).select('-passwordHash');
        if (!user || !user.isActive) {
            throw new errors_1.AuthenticationError('User not found or inactive');
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new errors_1.AuthenticationError('Invalid token'));
        }
        else {
            next(error);
        }
    }
};
exports.requireAuth = requireAuth;
const requireRole = (roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            next(new errors_1.AuthenticationError('Authentication required'));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(new errors_1.AuthorizationError(`Access denied. Required roles: ${roles.join(', ')}`));
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)(['admin']);
exports.requireCustomer = (0, exports.requireRole)(['customer', 'admin']);
const optionalAuth = async (req, _res, next) => {
    try {
        const token = req.cookies['accessToken'] || req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.accessSecret);
        const user = await user_model_1.User.findById(decoded.userId).select('-passwordHash');
        if (user && user.isActive) {
            req.user = user;
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map