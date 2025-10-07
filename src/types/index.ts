/**
 * Book Type Definition
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
  isbn: string;
  genre: string[];
  tags: string[];
  datePublished: string;
  pages: number;
  language: string;
  publisher: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
}

/**
 * Review Type Definition
 */
export interface Review {
  id: string;
  bookId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  timestamp: string;
  verified: boolean;
}

/**
 * Data Store Structure
 */
export interface BooksData {
  books: Book[];
}

export interface ReviewsData {
  reviews: Review[];
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Query Parameters
 */
export interface BookQueryParams {
  genre?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean | string;
  featured?: boolean | string;
  // ISO date strings to filter by publication date range (inclusive)
  publishedAfter?: string;
  publishedBefore?: string;
  search?: string;
  sortBy?: 'price' | 'rating' | 'datePublished' | 'title';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ReviewQueryParams {
  bookId?: string;
  minRating?: number;
  verified?: boolean | string;
  page?: number;
  limit?: number;
}

/**
 * Request Body Types
 */
export interface CreateBookRequest {
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
  isbn: string;
  genre: string[];
  tags: string[];
  datePublished: string;
  pages: number;
  language: string;
  publisher: string;
  inStock: boolean;
  featured: boolean;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {}

export interface CreateReviewRequest {
  bookId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  verified?: boolean;
}

export interface UpdateReviewRequest extends Partial<Omit<CreateReviewRequest, 'bookId'>> {}

/**
 * Error Types
 */
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}
