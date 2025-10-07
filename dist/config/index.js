"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env['PORT'] || '3000', 10),
    nodeEnv: process.env['NODE_ENV'] || 'development',
    apiPrefix: '/api',
    apiVersion: 'v1',
    pagination: {
        defaultLimit: 10,
        maxLimit: 100,
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 100,
    },
    cors: {
        origin: process.env['CORS_ORIGIN'] || '*',
        credentials: true,
    },
    logging: {
        level: process.env['LOG_LEVEL'] || 'dev',
        logFile: './logging/log.txt',
    },
    data: {
        booksPath: './data/books.json',
        reviewsPath: './data/reviews.json',
    },
    auth: {
        allowedTokens: (process.env['ALLOWED_TOKENS'] || '')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        headerName: process.env['AUTH_HEADER_NAME'] || 'authorization',
    },
};
const requiredEnvVars = [];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});
exports.default = exports.config;
//# sourceMappingURL=index.js.map