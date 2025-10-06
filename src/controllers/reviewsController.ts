import { Request, Response } from 'express';
import {
  Review,
  ReviewQueryParams,
  CreateReviewRequest,
  UpdateReviewRequest,
  ApiResponse,
  PaginatedResponse,
} from '../types';
import {
  loadReviews,
  saveReviews,
  generateId,
  paginate,
  getPaginationMetadata,
  loadBooks,
} from '../utils/helpers';
import { CustomError, asyncHandler } from '../middleware/errorHandler';
import { updateBookRating } from './booksController';
import config from '../config';

/**
 * Get all reviews with optional filtering and pagination
 */
export const getAllReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = req.query as unknown as ReviewQueryParams;

  let reviews = await loadReviews();

  // Apply filters
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

  // Sort by timestamp (newest first)
  reviews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Apply pagination
  const page = Number(query.page) || 1;
  const limit = Math.min(
    Number(query.limit) || config.pagination.defaultLimit,
    config.pagination.maxLimit
  );

  const total = reviews.length;
  const paginatedReviews = paginate(reviews, page, limit);

  const response: PaginatedResponse<Review> = {
    success: true,
    data: paginatedReviews,
    pagination: getPaginationMetadata(total, page, limit),
  };

  res.status(200).json(response);
});

/**
 * Get review by ID
 */
export const getReviewById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const reviews = await loadReviews();

  const review = reviews.find((r) => r.id === id);

  if (!review) {
    throw new CustomError('Review not found', 404);
  }

  const response: ApiResponse<Review> = {
    success: true,
    data: review,
  };

  res.status(200).json(response);
});

/**
 * Get reviews for a specific book
 */
export const getReviewsByBookId = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { bookId } = req.params;
    const reviews = await loadReviews();

    // Check if book exists
    const books = await loadBooks();
    const book = books.find((b) => b.id === bookId);

    if (!book) {
      throw new CustomError('Book not found', 404);
    }

    const bookReviews = reviews.filter((review) => review.bookId === bookId);

    // Sort by timestamp (newest first)
    bookReviews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const response: ApiResponse<Review[]> = {
      success: true,
      data: bookReviews,
    };

    res.status(200).json(response);
  }
);

/**
 * Create new review
 */
export const createReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const reviewData = req.body as CreateReviewRequest;
  const reviews = await loadReviews();

  // Check if book exists
  const books = await loadBooks();
  const book = books.find((b) => b.id === reviewData.bookId);

  if (!book) {
    throw new CustomError('Book not found', 404);
  }

  const newReview: Review = {
    id: generateId('review'),
    ...reviewData,
    verified: reviewData.verified || false,
    timestamp: new Date().toISOString(),
  };

  reviews.push(newReview);
  await saveReviews(reviews);

  // Update book rating
  await updateBookRating(reviewData.bookId, reviewData.rating, true);

  const response: ApiResponse<Review> = {
    success: true,
    data: newReview,
    message: 'Review created successfully',
  };

  res.status(201).json(response);
});

/**
 * Update review by ID
 */
export const updateReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body as UpdateReviewRequest;
  const reviews = await loadReviews();

  const reviewIndex = reviews.findIndex((r) => r.id === id);

  if (reviewIndex === -1) {
    throw new CustomError('Review not found', 404);
  }

  const oldReview = reviews[reviewIndex];
  if (!oldReview) {
    throw new CustomError('Review not found', 404);
  }

  reviews[reviewIndex] = {
    ...oldReview,
    ...updateData,
  };

  await saveReviews(reviews);

  // Update book rating if rating changed
  if (updateData.rating !== undefined && updateData.rating !== oldReview.rating) {
    await updateBookRating(oldReview.bookId, 0, false);
  }

  const response: ApiResponse<Review> = {
    success: true,
    data: reviews[reviewIndex],
    message: 'Review updated successfully',
  };

  res.status(200).json(response);
});

/**
 * Delete review by ID
 */
export const deleteReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const reviews = await loadReviews();

  const reviewIndex = reviews.findIndex((r) => r.id === id);

  if (reviewIndex === -1) {
    throw new CustomError('Review not found', 404);
  }

  const deletedReview = reviews[reviewIndex];
  if (!deletedReview) {
    throw new CustomError('Review not found', 404);
  }

  reviews.splice(reviewIndex, 1);
  await saveReviews(reviews);

  // Update book rating
  await updateBookRating(deletedReview.bookId, 0, false);

  const response: ApiResponse<null> = {
    success: true,
    message: 'Review deleted successfully',
  };

  res.status(200).json(response);
});
