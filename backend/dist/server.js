"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const connection_1 = require("./db/connection");
const config_1 = require("./config");
const logger_1 = __importDefault(require("./utils/logger"));
const startServer = async () => {
    try {
        await (0, connection_1.connectDB)();
        const server = app_1.default.listen(config_1.config.port, () => {
            logger_1.default.info(`🚀 Server running on port ${config_1.config.port} in ${config_1.config.nodeEnv} mode`);
            logger_1.default.info(`📚 API Documentation available at http://localhost:${config_1.config.port}/docs`);
            logger_1.default.info(`🏥 Health check available at http://localhost:${config_1.config.port}/health`);
        });
        const gracefulShutdown = (signal) => {
            logger_1.default.info(`Received ${signal}. Starting graceful shutdown...`);
            server.close(async () => {
                logger_1.default.info('HTTP server closed');
                try {
                    const mongoose = require('mongoose');
                    await mongoose.connection.close();
                    logger_1.default.info('Database connection closed');
                    process.exit(0);
                }
                catch (error) {
                    logger_1.default.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });
            setTimeout(() => {
                logger_1.default.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 30000);
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('uncaughtException', (error) => {
            logger_1.default.error('Uncaught Exception:', error);
            process.exit(1);
        });
        process.on('unhandledRejection', (reason, promise) => {
            logger_1.default.error('Unhandled Rejection at:', promise, 'reason:', reason);
            process.exit(1);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map