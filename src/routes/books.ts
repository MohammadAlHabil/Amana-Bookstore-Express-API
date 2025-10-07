import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getAllBooks,
  getBookById,
  getFeaturedBooks,
  createBook,
  updateBook,
  deleteBook,
  getTopRatedBooks,
  getReviewsForBook,
  searchBooks,
} from '../controllers/booksController';
import { validate } from '../middleware/validator';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * Book Validation Rules
 */
const bookValidationRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Author must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('image').trim().notEmpty().withMessage('Image URL is required'),
  body('isbn').trim().notEmpty().withMessage('ISBN is required'),
  body('genre').isArray({ min: 1 }).withMessage('Genre must be an array with at least one item'),
  body('genre.*').trim().notEmpty().withMessage('Genre items cannot be empty'),
  body('tags').isArray({ min: 1 }).withMessage('Tags must be an array with at least one item'),
  body('tags.*').trim().notEmpty().withMessage('Tag items cannot be empty'),
  body('datePublished').isISO8601().withMessage('Date published must be a valid date'),
  body('pages').isInt({ min: 1 }).withMessage('Pages must be a positive integer'),
  body('language').trim().notEmpty().withMessage('Language is required'),
  body('publisher').trim().notEmpty().withMessage('Publisher is required'),
  body('inStock').isBoolean().withMessage('InStock must be a boolean'),
  body('featured').isBoolean().withMessage('Featured must be a boolean'),
];

const updateBookValidationRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('author')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Author must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('image').optional().trim().notEmpty().withMessage('Image URL cannot be empty'),
  body('isbn')
    .optional()
    .trim()
    .matches(
      /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
    )
    .withMessage('Invalid ISBN format'),
  body('genre')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Genre must be an array with at least one item'),
  body('genre.*').optional().trim().notEmpty().withMessage('Genre items cannot be empty'),
  body('tags')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Tags must be an array with at least one item'),
  body('tags.*').optional().trim().notEmpty().withMessage('Tag items cannot be empty'),
  body('datePublished').optional().isISO8601().withMessage('Date published must be a valid date'),
  body('pages').optional().isInt({ min: 1 }).withMessage('Pages must be a positive integer'),
  body('language').optional().trim().notEmpty().withMessage('Language cannot be empty'),
  body('publisher').optional().trim().notEmpty().withMessage('Publisher cannot be empty'),
  body('inStock').optional().isBoolean().withMessage('InStock must be a boolean'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
];

const idParamValidation = [param('id').trim().notEmpty().withMessage('Book ID is required')];

const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a positive number'),
  query('publishedAfter')
    .optional()
    .isISO8601()
    .withMessage('publishedAfter must be a valid ISO8601 date'),
  query('publishedBefore')
    .optional()
    .isISO8601()
    .withMessage('publishedBefore must be a valid ISO8601 date'),
  query('sortBy')
    .optional()
    .isIn(['price', 'rating', 'datePublished', 'title'])
    .withMessage('Invalid sortBy field'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
];

const searchValidation = [
  query('q').trim().notEmpty().withMessage('Search query (q) is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

/**
 * Routes
 */

// GET /api/books - Get all books with filtering and pagination
router.get('/', validate(queryValidation), getAllBooks);

// GET /api/books/top-rated - Get top 10 books by rating * reviewCount
router.get('/top-rated', getTopRatedBooks);

// GET /api/books/search?q=... - Dedicated search endpoint
router.get('/search', validate(searchValidation), searchBooks);

// GET /api/books/:id/reviews - Get reviews for a specific book
router.get('/:id/reviews', validate(idParamValidation), getReviewsForBook);

// GET /api/books/featured - Get featured books
router.get('/featured', getFeaturedBooks);

// GET /api/books/:id - Get book by ID
router.get('/:id', validate(idParamValidation), getBookById);

// POST /api/books - Create new book (protected)
router.post('/', requireAuth, validate(bookValidationRules), createBook);

// PUT /api/books/:id - Update book by ID
router.put(
  '/:id',
  requireAuth,
  validate([...idParamValidation, ...updateBookValidationRules]),
  updateBook
);

// DELETE /api/books/:id - Delete book by ID
router.delete('/:id', requireAuth, validate(idParamValidation), deleteBook);

export default router;
