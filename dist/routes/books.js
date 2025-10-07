"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const booksController_1 = require("../controllers/booksController");
const validator_1 = require("../middleware/validator");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const bookValidationRules = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Title must be between 2 and 200 characters'),
    (0, express_validator_1.body)('author')
        .trim()
        .notEmpty()
        .withMessage('Author is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Author must be between 2 and 100 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    (0, express_validator_1.body)('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('image').trim().notEmpty().withMessage('Image URL is required'),
    (0, express_validator_1.body)('isbn').trim().notEmpty().withMessage('ISBN is required'),
    (0, express_validator_1.body)('genre').isArray({ min: 1 }).withMessage('Genre must be an array with at least one item'),
    (0, express_validator_1.body)('genre.*').trim().notEmpty().withMessage('Genre items cannot be empty'),
    (0, express_validator_1.body)('tags').isArray({ min: 1 }).withMessage('Tags must be an array with at least one item'),
    (0, express_validator_1.body)('tags.*').trim().notEmpty().withMessage('Tag items cannot be empty'),
    (0, express_validator_1.body)('datePublished').isISO8601().withMessage('Date published must be a valid date'),
    (0, express_validator_1.body)('pages').isInt({ min: 1 }).withMessage('Pages must be a positive integer'),
    (0, express_validator_1.body)('language').trim().notEmpty().withMessage('Language is required'),
    (0, express_validator_1.body)('publisher').trim().notEmpty().withMessage('Publisher is required'),
    (0, express_validator_1.body)('inStock').isBoolean().withMessage('InStock must be a boolean'),
    (0, express_validator_1.body)('featured').isBoolean().withMessage('Featured must be a boolean'),
];
const updateBookValidationRules = [
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Title must be between 2 and 200 characters'),
    (0, express_validator_1.body)('author')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Author must be between 2 and 100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    (0, express_validator_1.body)('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('image').optional().trim().notEmpty().withMessage('Image URL cannot be empty'),
    (0, express_validator_1.body)('isbn')
        .optional()
        .trim()
        .matches(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/)
        .withMessage('Invalid ISBN format'),
    (0, express_validator_1.body)('genre')
        .optional()
        .isArray({ min: 1 })
        .withMessage('Genre must be an array with at least one item'),
    (0, express_validator_1.body)('genre.*').optional().trim().notEmpty().withMessage('Genre items cannot be empty'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray({ min: 1 })
        .withMessage('Tags must be an array with at least one item'),
    (0, express_validator_1.body)('tags.*').optional().trim().notEmpty().withMessage('Tag items cannot be empty'),
    (0, express_validator_1.body)('datePublished').optional().isISO8601().withMessage('Date published must be a valid date'),
    (0, express_validator_1.body)('pages').optional().isInt({ min: 1 }).withMessage('Pages must be a positive integer'),
    (0, express_validator_1.body)('language').optional().trim().notEmpty().withMessage('Language cannot be empty'),
    (0, express_validator_1.body)('publisher').optional().trim().notEmpty().withMessage('Publisher cannot be empty'),
    (0, express_validator_1.body)('inStock').optional().isBoolean().withMessage('InStock must be a boolean'),
    (0, express_validator_1.body)('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
];
const idParamValidation = [(0, express_validator_1.param)('id').trim().notEmpty().withMessage('Book ID is required')];
const queryValidation = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('minPrice must be a positive number'),
    (0, express_validator_1.query)('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('maxPrice must be a positive number'),
    (0, express_validator_1.query)('publishedAfter')
        .optional()
        .isISO8601()
        .withMessage('publishedAfter must be a valid ISO8601 date'),
    (0, express_validator_1.query)('publishedBefore')
        .optional()
        .isISO8601()
        .withMessage('publishedBefore must be a valid ISO8601 date'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['price', 'rating', 'datePublished', 'title'])
        .withMessage('Invalid sortBy field'),
    (0, express_validator_1.query)('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
];
const searchValidation = [
    (0, express_validator_1.query)('q').trim().notEmpty().withMessage('Search query (q) is required'),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];
router.get('/', (0, validator_1.validate)(queryValidation), booksController_1.getAllBooks);
router.get('/top-rated', booksController_1.getTopRatedBooks);
router.get('/search', (0, validator_1.validate)(searchValidation), booksController_1.searchBooks);
router.get('/:id/reviews', (0, validator_1.validate)(idParamValidation), booksController_1.getReviewsForBook);
router.get('/featured', booksController_1.getFeaturedBooks);
router.get('/:id', (0, validator_1.validate)(idParamValidation), booksController_1.getBookById);
router.post('/', auth_1.requireAuth, (0, validator_1.validate)(bookValidationRules), booksController_1.createBook);
router.put('/:id', (0, validator_1.validate)([...idParamValidation, ...updateBookValidationRules]), booksController_1.updateBook);
router.delete('/:id', (0, validator_1.validate)(idParamValidation), booksController_1.deleteBook);
exports.default = router;
//# sourceMappingURL=books.js.map