import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getAllReviews,
  getReviewById,
  getReviewsByBookId,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewsController';
import { validate } from '../middleware/validator';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * Review Validation Rules
 */
const reviewValidationRules = [
  body('bookId').trim().notEmpty().withMessage('Book ID is required'),
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name must be between 2 and 100 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Review comment is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Comment must be between 10 and 2000 characters'),
  body('verified').optional().isBoolean().withMessage('Verified must be a boolean'),
];

const updateReviewValidationRules = [
  body('author')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name must be between 2 and 100 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Comment must be between 10 and 2000 characters'),
  body('verified').optional().isBoolean().withMessage('Verified must be a boolean'),
];

const idParamValidation = [param('id').trim().notEmpty().withMessage('Review ID is required')];

const bookIdParamValidation = [
  param('bookId').trim().notEmpty().withMessage('Book ID is required'),
];

const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('minRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('minRating must be between 1 and 5'),
];

/**
 * Routes
 */

// GET /api/reviews - Get all reviews with filtering and pagination
router.get('/', validate(queryValidation), getAllReviews);

// GET /api/reviews/:id - Get review by ID
router.get('/:id', validate(idParamValidation), getReviewById);

// GET /api/reviews/book/:bookId - Get reviews for a specific book
router.get('/book/:bookId', validate(bookIdParamValidation), getReviewsByBookId);

// POST /api/reviews - Create new review (protected)
router.post('/', requireAuth, validate(reviewValidationRules), createReview);

// PUT /api/reviews/:id - Update review by ID
router.put(
  '/:id',
  requireAuth,
  validate([...idParamValidation, ...updateReviewValidationRules]),
  updateReview
);

// DELETE /api/reviews/:id - Delete review by ID
router.delete('/:id', requireAuth, validate(idParamValidation), deleteReview);

export default router;
