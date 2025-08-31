"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errors_1 = require("@/utils/errors");
const logger_1 = __importDefault(require("@/utils/logger"));
const errorHandler = (error, req, res, _next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let code = 'INTERNAL_ERROR';
    let details = undefined;
    if (error instanceof errors_1.AppError) {
        statusCode = error.statusCode;
        message = error.message;
        code = error.code;
        details = error.details;
    }
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        code = 'VALIDATION_ERROR';
        details = Object.values(error.errors).map((err) => ({
            field: err.path,
            message: err.message,
        }));
    }
    else if (error.name === 'MongoServerError' && error.code === 11000) {
        statusCode = 409;
        message = 'Duplicate field value';
        code = 'DUPLICATE_ERROR';
        const field = Object.keys(error.keyPattern)[0];
        details = { field, value: error.keyValue[field] };
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
        code = 'INVALID_ID';
        details = { field: error.path, value: error.value };
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
        code = 'INVALID_TOKEN';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
        code = 'TOKEN_EXPIRED';
    }
    if (statusCode >= 500) {
        logger_1.default.error('Server Error:', {
            error: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
        });
    }
    else {
        logger_1.default.warn('Client Error:', {
            error: error.message,
            statusCode,
            url: req.url,
            method: req.method,
            ip: req.ip,
        });
    }
    const response = {
        success: false,
        message,
        code,
    };
    if (details) {
        response.details = details;
    }
    if (process.env['NODE_ENV'] === 'production' && statusCode >= 500) {
        response.message = 'Internal Server Error';
        response.details = undefined;
    }
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, _res, next) => {
    const error = new errors_1.AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
    next(error);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map