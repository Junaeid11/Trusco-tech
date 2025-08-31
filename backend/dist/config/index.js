"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
exports.config = {
    port: process.env['PORT'] || 5000,
    nodeEnv: process.env['NODE_ENV'] || 'development',
    clientOrigin: process.env['CLIENT_ORIGIN'] || 'http://localhost:3000',
    mongoUri: process.env['MONGO_URI'] || 'mongodb://localhost:27017/ecommerce',
    jwt: {
        accessSecret: process.env['JWT_ACCESS_SECRET'] || 'access-secret',
        refreshSecret: process.env['JWT_REFRESH_SECRET'] || 'refresh-secret',
        accessExpires: process.env['JWT_ACCESS_EXPIRES'] || '15m',
        refreshExpires: process.env['JWT_REFRESH_EXPIRES'] || '7d',
    },
    cloudinary: {
        cloudName: process.env['CLOUDINARY_CLOUD_NAME'],
        apiKey: process.env['CLOUDINARY_API_KEY'],
        apiSecret: process.env['CLOUDINARY_API_SECRET'],
    },
    aws: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
        region: process.env['AWS_REGION'] || 'us-east-1',
        s3Bucket: process.env['AWS_S3_BUCKET'],
    },
    stripe: {
        secretKey: process.env['STRIPE_SECRET_KEY'],
        webhookSecret: process.env['STRIPE_WEBHOOK_SECRET'],
    },
    sslCommerz: {
        registered: process.env['SSL_REGISTERED'] === 'true',
        storeId: process.env['SSL_STORE_ID'],
        storePassword: process.env['SSL_STORE_PASSWORD'],
        isSandbox: process.env['SSL_IS_SANDBOX'] === 'true',
    },
    email: {
        host: process.env['SMTP_HOST'],
        port: parseInt(process.env['SMTP_PORT'] || '587'),
        user: process.env['SMTP_USER'],
        pass: process.env['SMTP_PASS'],
    },
    redis: {
        url: process.env['REDIS_URL'] || 'redis://localhost:6379',
    },
    rateLimit: {
        windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'),
        maxRequests: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'),
    },
};
//# sourceMappingURL=index.js.map