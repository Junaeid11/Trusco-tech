export declare const config: {
    readonly port: string | 5000;
    readonly nodeEnv: string;
    readonly clientOrigin: string;
    readonly mongoUri: string;
    readonly jwt: {
        readonly accessSecret: string;
        readonly refreshSecret: string;
        readonly accessExpires: string;
        readonly refreshExpires: string;
    };
    readonly cloudinary: {
        readonly cloudName: string | undefined;
        readonly apiKey: string | undefined;
        readonly apiSecret: string | undefined;
    };
    readonly aws: {
        readonly accessKeyId: string | undefined;
        readonly secretAccessKey: string | undefined;
        readonly region: string;
        readonly s3Bucket: string | undefined;
    };
    readonly stripe: {
        readonly secretKey: string | undefined;
        readonly webhookSecret: string | undefined;
    };
    readonly sslCommerz: {
        readonly registered: boolean;
        readonly storeId: string | undefined;
        readonly storePassword: string | undefined;
        readonly isSandbox: boolean;
    };
    readonly email: {
        readonly host: string | undefined;
        readonly port: number;
        readonly user: string | undefined;
        readonly pass: string | undefined;
    };
    readonly redis: {
        readonly url: string;
    };
    readonly rateLimit: {
        readonly windowMs: number;
        readonly maxRequests: number;
    };
};
export type Config = typeof config;
//# sourceMappingURL=index.d.ts.map