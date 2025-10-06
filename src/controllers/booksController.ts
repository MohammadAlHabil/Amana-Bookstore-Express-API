import { Request, Response } from 'express';
import {
  Book,
  BookQueryParams,
  CreateBookRequest,
  UpdateBookRequest,
  ApiResponse,
  PaginatedResponse,
} from '../types';
import {
  loadBooks,
  saveBooks,
  generateId,
  paginate,
  getPaginationMetadata,
} from '../utils/helpers';
import { CustomError, asyncHandler } from '../middleware/errorHandler';
import config from '../config';

/**
 * Get all books with optional filtering and pagination
 */
export const getAllBooks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = req.query as unknown as BookQueryParams;

  let books = await loadBooks();

  // Apply filters
  if (query.genre) {
    const genreLower = query.genre.toLowerCase();
    books = books.filter((book) => book.genre.some((g) => g.toLowerCase().includes(genreLower)));
  }

  if (query.author) {
    const authorLower = query.author.toLowerCase();
    books = books.filter((book) => book.author.toLowerCase().includes(authorLower));
  }

  if (query.minPrice !== undefined) {
    books = books.filter((book) => book.price >= Number(query.minPrice));
  }

  if (query.maxPrice !== undefined) {
    books = books.filter((book) => book.price <= Number(query.maxPrice));
  }

  if (query.inStock !== undefined) {
    const inStockValue = query.inStock === 'true' || query.inStock === true;
    books = books.filter((book) => book.inStock === inStockValue);
  }

  if (query.featured !== undefined) {
    const featuredValue = query.featured === 'true' || query.featured === true;
    books = books.filter((book) => book.featured === featuredValue);
  }

  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    books = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm) ||
        book.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Apply sorting
  if (query.sortBy) {
    const sortField = query.sortBy;
    const order = query.order || 'asc';

    books.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }

  // Apply pagination
  const page = Number(query.page) || 1;
  const limit = Math.min(
    Number(query.limit) || config.pagination.defaultLimit,
    config.pagination.maxLimit
  );

  const total = books.length;
  const paginatedBooks = paginate(books, page, limit);

  const response: PaginatedResponse<Book> = {
    success: true,
    data: paginatedBooks,
    pagination: getPaginationMetadata(total, page, limit),
  };

  res.status(200).json(response);
});

/**
 * Get book by ID
 */
export const getBookById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const books = await loadBooks();

  const book = books.find((b) => b.id === id);

  if (!book) {
    throw new CustomError('Book not found', 404);
  }

  const response: ApiResponse<Book> = {
    success: true,
    data: book,
  };

  res.status(200).json(response);
});

/**
 * Get featured books
 */
export const getFeaturedBooks = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const books = await loadBooks();
    const featuredBooks = books.filter((book) => book.featured);

    const response: ApiResponse<Book[]> = {
      success: true,
      data: featuredBooks,
    };

    res.status(200).json(response);
  }
);

/**
 * Create new book
 */
export const createBook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const bookData = req.body as CreateBookRequest;
  const books = await loadBooks();

  // Check if ISBN already exists
  const existingBook = books.find((b) => b.isbn === bookData.isbn);
  if (existingBook) {
    throw new CustomError('Book with this ISBN already exists', 409);
  }

  const newBook: Book = {
    id: generateId('book'),
    ...bookData,
    rating: 0,
    reviewCount: 0,
  };

  books.push(newBook);
  await saveBooks(books);

  const response: ApiResponse<Book> = {
    success: true,
    data: newBook,
    message: 'Book created successfully',
  };

  res.status(201).json(response);
});

/**
 * Update book by ID
 */
export const updateBook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body as UpdateBookRequest;
  const books = await loadBooks();

  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    throw new CustomError('Book not found', 404);
  }

  const currentBook = books[bookIndex];
  if (!currentBook) {
    throw new CustomError('Book not found', 404);
  }

  // If ISBN is being updated, check for duplicates
  if (updateData.isbn && updateData.isbn !== currentBook.isbn) {
    const existingBook = books.find((b) => b.isbn === updateData.isbn);
    if (existingBook) {
      throw new CustomError('Book with this ISBN already exists', 409);
    }
  }

  books[bookIndex] = {
    ...currentBook,
    ...updateData,
  };

  await saveBooks(books);

  const response: ApiResponse<Book> = {
    success: true,
    data: books[bookIndex],
    message: 'Book updated successfully',
  };

  res.status(200).json(response);
});

/**
 * Delete book by ID
 */
export const deleteBook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const books = await loadBooks();

  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    throw new CustomError('Book not found', 404);
  }

  books.splice(bookIndex, 1);
  await saveBooks(books);

  const response: ApiResponse<null> = {
    success: true,
    message: 'Book deleted successfully',
  };

  res.status(200).json(response);
});

/**
 * Update book rating (called when reviews are added/updated)
 */
export async function updateBookRating(
  bookId: string,
  newRating: number,
  isNewReview: boolean
): Promise<void> {
  const books = await loadBooks();
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return;
  }

  const book = books[bookIndex];
  if (!book) {
    return;
  }

  if (isNewReview) {
    const totalRating = book.rating * book.reviewCount + newRating;
    book.reviewCount += 1;
    book.rating = totalRating / book.reviewCount;
  } else {
    // Recalculate from all reviews
    const { loadReviews } = await import('../utils/helpers');
    const reviews = await loadReviews();
    const bookReviews = reviews.filter((r) => r.bookId === bookId);

    if (bookReviews.length > 0) {
      const totalRating = bookReviews.reduce((sum, r) => sum + r.rating, 0);
      book.rating = totalRating / bookReviews.length;
      book.reviewCount = bookReviews.length;
    } else {
      book.rating = 0;
      book.reviewCount = 0;
    }
  }

  await saveBooks(books);
}
