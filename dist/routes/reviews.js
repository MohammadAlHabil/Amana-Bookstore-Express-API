"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const reviewsController_1 = require("../controllers/reviewsController");
const validator_1 = require("../middleware/validator");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const reviewValidationRules = [
    (0, express_validator_1.body)('bookId').trim().notEmpty().withMessage('Book ID is required'),
    (0, express_validator_1.body)('author')
        .trim()
        .notEmpty()
        .withMessage('Author name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Author name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Review title is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Title must be between 2 and 200 characters'),
    (0, express_validator_1.body)('comment')
        .trim()
        .notEmpty()
        .withMessage('Review comment is required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Comment must be between 10 and 2000 characters'),
    (0, express_validator_1.body)('verified').optional().isBoolean().withMessage('Verified must be a boolean'),
];
const updateReviewValidationRules = [
    (0, express_validator_1.body)('author')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Author name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Title must be between 2 and 200 characters'),
    (0, express_validator_1.body)('comment')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Comment must be between 10 and 2000 characters'),
    (0, express_validator_1.body)('verified').optional().isBoolean().withMessage('Verified must be a boolean'),
];
const idParamValidation = [(0, express_validator_1.param)('id').trim().notEmpty().withMessage('Review ID is required')];
const bookIdParamValidation = [
    (0, express_validator_1.param)('bookId').trim().notEmpty().withMessage('Book ID is required'),
];
const queryValidation = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('minRating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('minRating must be between 1 and 5'),
];
router.get('/', (0, validator_1.validate)(queryValidation), reviewsController_1.getAllReviews);
router.get('/:id', (0, validator_1.validate)(idParamValidation), reviewsController_1.getReviewById);
router.get('/book/:bookId', (0, validator_1.validate)(bookIdParamValidation), reviewsController_1.getReviewsByBookId);
router.post('/', auth_1.requireAuth, (0, validator_1.validate)(reviewValidationRules), reviewsController_1.createReview);
router.put('/:id', auth_1.requireAuth, (0, validator_1.validate)([...idParamValidation, ...updateReviewValidationRules]), reviewsController_1.updateReview);
router.delete('/:id', auth_1.requireAuth, (0, validator_1.validate)(idParamValidation), reviewsController_1.deleteReview);
exports.default = router;
//# sourceMappingURL=reviews.js.map