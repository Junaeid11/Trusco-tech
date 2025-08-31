import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  // Server
  port: process.env['PORT'] || 5000,
  nodeEnv: process.env['NODE_ENV'] || 'development',
  clientOrigin: process.env['CLIENT_ORIGIN'] || 'http://localhost:3000',

  // Database
  mongoUri: process.env['MONGO_URI'] || 'mongodb://localhost:27017/ecommerce',

  // JWT
  jwt: {
    accessSecret: process.env['JWT_ACCESS_SECRET'] || 'access-secret',
    refreshSecret: process.env['JWT_REFRESH_SECRET'] || 'refresh-secret',
    accessExpires: process.env['JWT_ACCESS_EXPIRES'] || '15m',
    refreshExpires: process.env['JWT_REFRESH_EXPIRES'] || '7d',
  },

  // Google OAuth
  google: {
    clientId: process.env['GOOGLE_CLIENT_ID'] || '',
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'] || '',
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env['CLOUDINARY_CLOUD_NAME'],
    apiKey: process.env['CLOUDINARY_API_KEY'],
    apiSecret: process.env['CLOUDINARY_API_SECRET'],
  },

  // AWS S3
  aws: {
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
    region: process.env['AWS_REGION'] || 'us-east-1',
    s3Bucket: process.env['AWS_S3_BUCKET'],
  },

  // Stripe
  stripe: {
    secretKey: process.env['STRIPE_SECRET_KEY'],
    webhookSecret: process.env['STRIPE_WEBHOOK_SECRET'],
  },

  // SSLCommerz
  sslCommerz: {
    registered: process.env['SSL_REGISTERED'] === 'true',
    storeId: process.env['SSL_STORE_ID'],
    storePassword: process.env['SSL_STORE_PASSWORD'],
    isSandbox: process.env['SSL_IS_SANDBOX'] === 'true',
  },

  // Email
  email: {
    host: process.env['SMTP_HOST'],
    port: parseInt(process.env['SMTP_PORT'] || '587'),
    user: process.env['SMTP_USER'],
    password: process.env['SMTP_PASS'], // Changed from 'pass' to 'password' for nodemailer
  },

  // Redis
  redis: {
    url: process.env['REDIS_URL'] || 'redis://localhost:6379',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'),
    maxRequests: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'),
  },
} as const;

export type Config = typeof config;
