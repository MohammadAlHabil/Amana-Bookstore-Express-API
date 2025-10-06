import { Router } from 'express';
import booksRouter from './books';
import reviewsRouter from './reviews';

const router = Router();

/**
 * API Routes
 */
router.use('/books', booksRouter);
router.use('/reviews', reviewsRouter);

/**
 * Health Check Route
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Amana Bookstore API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
