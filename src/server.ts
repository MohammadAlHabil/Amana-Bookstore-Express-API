// Register module aliases for production (must be first)
import 'module-alias/register';

import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config';
import routes from './routes';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import { responseTimeLogger } from './middleware/logger';

/**
 * Create Express Application
 */
const app: Application = express();

/**
 * Security Middleware
 */
// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors(config.cors));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

/**
 * Body Parsing Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Compression Middleware
 */
app.use(compression());

/**
 * Logging Middleware
 */
// Morgan HTTP request logger
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Custom response time logger
app.use(responseTimeLogger);

/**
 * API Routes
 */
app.use(config.apiPrefix, routes);

/**
 * Root Route
 */
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Amana Bookstore API',
    version: '1.0.0',
    endpoints: [
      'GET /api/books',
      'GET /api/books/:id',
      'GET /api/books/top-rated',
      'GET /api/books/featured',
      'GET /api/books/search',
      'GET /api/books/:id/reviews',
      'POST /api/books',
      'PUT /api/books/:id',
      'DELETE /api/books/:id',
      'GET /api/reviews',
      'GET /api/reviews/:id',
      'GET /api/reviews/book/:bookId',
      'POST /api/reviews',
      'PUT /api/reviews/:id',
      'DELETE /api/reviews/:id',
    ],
    notes: [
      'Protected endpoints require a token listed in ALLOWED_TOKENS (env).',
      'Use publishedAfter / publishedBefore to filter books by publication date.',
      'Examples: Authorization: Bearer token1  OR  X-API-KEY: token1',
    ],
  });
});

/**
 * 404 Handler
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * Start Server
 */
const startServer = (): void => {
  try {
    app.listen(config.port, () => {
      console.log('='.repeat(50));
      console.log(`🚀 Amana Bookstore API Server`);
      console.log('='.repeat(50));
      console.log(`📡 Environment: ${config.nodeEnv}`);
      console.log(`🌐 Server running on: http://localhost:${config.port}`);
      console.log(`📚 API Base URL: http://localhost:${config.port}${config.apiPrefix}`);
      console.log(`💚 Health Check: http://localhost:${config.port}${config.apiPrefix}/health`);
      console.log('='.repeat(50));
      console.log('📖 Available Endpoints:');
      console.log(`   Books: ${config.apiPrefix}/books`);
      console.log(`   Reviews: ${config.apiPrefix}/reviews`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Handle Unhandled Rejections
 */
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

/**
 * Handle Uncaught Exceptions
 */
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();

export default app;
