import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server Configuration
  port: parseInt(process.env['PORT'] || '3000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',

  // API Configuration
  apiPrefix: '/api',
  apiVersion: 'v1',

  // Pagination Defaults
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // CORS Configuration
  cors: {
    origin: process.env['CORS_ORIGIN'] || '*',
    credentials: true,
  },

  // Logging
  logging: {
    level: process.env['LOG_LEVEL'] || 'dev',
    logFile: './logging/log.txt',
  },

  // Data Paths
  data: {
    booksPath: './data/books.json',
    reviewsPath: './data/reviews.json',
  },
} as const;

// Validate required environment variables
const requiredEnvVars: string[] = [];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export default config;
