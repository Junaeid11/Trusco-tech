"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("@/modules/auth/auth.controller");
const validation_1 = require("@/middleware/validation");
const auth_1 = require("@/middleware/auth");
const validationSchemas_1 = require("@/utils/validationSchemas");
const router = (0, express_1.Router)();
router.post('/register', (0, validation_1.validate)(validationSchemas_1.registerSchema), auth_controller_1.AuthController.register);
router.post('/login', (0, validation_1.validate)(validationSchemas_1.loginSchema), auth_controller_1.AuthController.login);
router.post('/refresh', auth_controller_1.AuthController.refresh);
router.post('/logout', auth_1.requireAuth, auth_controller_1.AuthController.logout);
router.get('/me', auth_1.requireAuth, auth_controller_1.AuthController.me);
router.post('/change-password', auth_1.requireAuth, auth_controller_1.AuthController.changePassword);
router.post('/forgot-password', auth_controller_1.AuthController.forgotPassword);
router.post('/reset-password', auth_controller_1.AuthController.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map