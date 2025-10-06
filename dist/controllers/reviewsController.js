"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.createReview = exports.getReviewsByBookId = exports.getReviewById = exports.getAllReviews = void 0;
const helpers_1 = require("../utils/helpers");
const errorHandler_1 = require("../middleware/errorHandler");
const booksController_1 = require("./booksController");
const config_1 = __importDefault(require("../config"));
exports.getAllReviews = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const query = req.query;
    let reviews = await (0, helpers_1.loadReviews)();
    if (query.bookId) {
        reviews = reviews.filter((review) => review.bookId === query.bookId);
    }
    if (query.minRating !== undefined) {
        reviews = reviews.filter((review) => review.rating >= Number(query.minRating));
    }
    if (query.verified !== undefined) {
        const verifiedValue = query.verified === 'true' || query.verified === true;
        reviews = reviews.filter((review) => review.verified === verifiedValue);
    }
    reviews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || config_1.default.pagination.defaultLimit, config_1.default.pagination.maxLimit);
    const total = reviews.length;
    const paginatedReviews = (0, helpers_1.paginate)(reviews, page, limit);
    const response = {
        success: true,
        data: paginatedReviews,
        pagination: (0, helpers_1.getPaginationMetadata)(total, page, limit),
    };
    res.status(200).json(response);
});
exports.getReviewById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const reviews = await (0, helpers_1.loadReviews)();
    const review = reviews.find((r) => r.id === id);
    if (!review) {
        throw new errorHandler_1.CustomError('Review not found', 404);
    }
    const response = {
        success: true,
        data: review,
    };
    res.status(200).json(response);
});
exports.getReviewsByBookId = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { bookId } = req.params;
    const reviews = await (0, helpers_1.loadReviews)();
    const books = await (0, helpers_1.loadBooks)();
    const book = books.find((b) => b.id === bookId);
    if (!book) {
        throw new errorHandler_1.CustomError('Book not found', 404);
    }
    const bookReviews = reviews.filter((review) => review.bookId === bookId);
    bookReviews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const response = {
        success: true,
        data: bookReviews,
    };
    res.status(200).json(response);
});
exports.createReview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const reviewData = req.body;
    const reviews = await (0, helpers_1.loadReviews)();
    const books = await (0, helpers_1.loadBooks)();
    const book = books.find((b) => b.id === reviewData.bookId);
    if (!book) {
        throw new errorHandler_1.CustomError('Book not found', 404);
    }
    const newReview = {
        id: (0, helpers_1.generateId)('review'),
        ...reviewData,
        verified: reviewData.verified || false,
        timestamp: new Date().toISOString(),
    };
    reviews.push(newReview);
    await (0, helpers_1.saveReviews)(reviews);
    await (0, booksController_1.updateBookRating)(reviewData.bookId, reviewData.rating, true);
    const response = {
        success: true,
        data: newReview,
        message: 'Review created successfully',
    };
    res.status(201).json(response);
});
exports.updateReview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const reviews = await (0, helpers_1.loadReviews)();
    const reviewIndex = reviews.findIndex((r) => r.id === id);
    if (reviewIndex === -1) {
        throw new errorHandler_1.CustomError('Review not found', 404);
    }
    const oldReview = reviews[reviewIndex];
    if (!oldReview) {
        throw new errorHandler_1.CustomError('Review not found', 404);
    }
    reviews[reviewIndex] = {
        ...oldReview,
        ...updateData,
    };
    await (0, helpers_1.saveReviews)(reviews);
    if (updateData.rating !== undefined && updateData.rating !== oldReview.rating) {
        await (0, booksController_1.updateBookRating)(oldReview.bookId, 0, false);
    }
    const response = {
        success: true,
        data: reviews[reviewIndex],
        message: 'Review updated successfully',
    };
    res.status(200).json(response);
});
exports.deleteReview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const reviews = await (0, helpers_1.loadReviews)();
    const reviewIndex = reviews.findIndex((r) => r.id === id);
    if (reviewIndex === -1) {
        throw new errorHandler_1.CustomError('Review not found', 404);
    }
    const deletedReview = reviews[reviewIndex];
    if (!deletedReview) {
        throw new errorHandler_1.CustomError('Review not found', 404);
    }
    reviews.splice(reviewIndex, 1);
    await (0, helpers_1.saveReviews)(reviews);
    await (0, booksController_1.updateBookRating)(deletedReview.bookId, 0, false);
    const response = {
        success: true,
        message: 'Review deleted successfully',
    };
    res.status(200).json(response);
});
//# sourceMappingURL=reviewsController.js.map