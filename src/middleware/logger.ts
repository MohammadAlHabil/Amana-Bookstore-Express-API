import { Request, Response, NextFunction } from 'express';
import { logToFile } from '@utils/helpers';

/**
 * Request Logger Middleware
 */
export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.socket.remoteAddress;

  const logMessage = `[${timestamp}] ${method} ${url} - IP: ${ip}`;

  // Log to console
  console.log(logMessage);

  // Log to file (async, don't wait)
  logToFile(logMessage).catch((err) => console.error('Logging error:', err));

  next();
};

/**
 * Response Time Logger
 */
export const responseTimeLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logMessage = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
    console.log(logMessage);
    logToFile(logMessage).catch((err) => console.error('Logging error:', err));
  });

  next();
};
