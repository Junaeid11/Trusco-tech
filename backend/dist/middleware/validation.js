"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = exports.validate = void 0;
const zod_1 = require("zod");
const errors_1 = require("@/utils/errors");
const validate = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code,
                }));
                next(new errors_1.ValidationError('Validation failed', details));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
const validateBody = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code,
                }));
                next(new errors_1.ValidationError('Request body validation failed', details));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateBody = validateBody;
const validateQuery = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.parseAsync(req.query);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code,
                }));
                next(new errors_1.ValidationError('Query parameters validation failed', details));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.parseAsync(req.params);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code,
                }));
                next(new errors_1.ValidationError('URL parameters validation failed', details));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateParams = validateParams;
//# sourceMappingURL=validation.js.map