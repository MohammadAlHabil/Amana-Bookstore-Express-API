"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseTimeLogger = exports.requestLogger = void 0;
const helpers_1 = require("@utils/helpers");
const requestLogger = (req, _res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.socket.remoteAddress;
    const logMessage = `[${timestamp}] ${method} ${url} - IP: ${ip}`;
    console.log(logMessage);
    (0, helpers_1.logToFile)(logMessage).catch((err) => console.error('Logging error:', err));
    next();
};
exports.requestLogger = requestLogger;
const responseTimeLogger = (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logMessage = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
        console.log(logMessage);
        (0, helpers_1.logToFile)(logMessage).catch((err) => console.error('Logging error:', err));
    });
    next();
};
exports.responseTimeLogger = responseTimeLogger;
//# sourceMappingURL=logger.js.map