"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./middleware/logger");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(config_1.default.cors));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.default.rateLimit.windowMs,
    max: config_1.default.rateLimit.max,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, compression_1.default)());
if (config_1.default.nodeEnv === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
app.use(logger_1.responseTimeLogger);
app.use(config_1.default.apiPrefix, routes_1.default);
app.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Amana Bookstore API',
        version: '1.0.0',
        documentation: '/api/health',
    });
});
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
const startServer = () => {
    try {
        app.listen(config_1.default.port, () => {
            console.log('='.repeat(50));
            console.log(`🚀 Amana Bookstore API Server`);
            console.log('='.repeat(50));
            console.log(`📡 Environment: ${config_1.default.nodeEnv}`);
            console.log(`🌐 Server running on: http://localhost:${config_1.default.port}`);
            console.log(`📚 API Base URL: http://localhost:${config_1.default.port}${config_1.default.apiPrefix}`);
            console.log(`💚 Health Check: http://localhost:${config_1.default.port}${config_1.default.apiPrefix}/health`);
            console.log('='.repeat(50));
            console.log('📖 Available Endpoints:');
            console.log(`   Books: ${config_1.default.apiPrefix}/books`);
            console.log(`   Reviews: ${config_1.default.apiPrefix}/reviews`);
            console.log('='.repeat(50));
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map