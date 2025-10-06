import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

/**
 * Custom Error Class
 */
export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found Error Handler
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new CustomError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Global Error Handler
 */
export const errorHandler = (
  err: Error | CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isCustomError = err instanceof CustomError;
  const statusCode = isCustomError ? err.statusCode : 500;
  const message = isCustomError ? err.message : 'Internal Server Error';

  // Log error for debugging
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

/**
 * Async Handler Wrapper
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
