"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.notFoundHandler = exports.CustomError = void 0;
class CustomError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const notFoundHandler = (req, _res, next) => {
    const error = new CustomError(`Route not found: ${req.originalUrl}`, 404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, _req, res, _next) => {
    const isCustomError = err instanceof CustomError;
    const statusCode = isCustomError ? err.statusCode : 500;
    const message = isCustomError ? err.message : 'Internal Server Error';
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        statusCode,
    });
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map