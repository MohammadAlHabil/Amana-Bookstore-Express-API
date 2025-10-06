"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getFeaturedBooks = exports.getBookById = exports.getAllBooks = void 0;
exports.updateBookRating = updateBookRating;
const helpers_1 = require("../utils/helpers");
const errorHandler_1 = require("../middleware/errorHandler");
const config_1 = __importDefault(require("../config"));
exports.getAllBooks = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const query = req.query;
    let books = await (0, helpers_1.loadBooks)();
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
        books = books.filter((book) => book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm) ||
            book.tags.some((tag) => tag.toLowerCase().includes(searchTerm)));
    }
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
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || config_1.default.pagination.defaultLimit, config_1.default.pagination.maxLimit);
    const total = books.length;
    const paginatedBooks = (0, helpers_1.paginate)(books, page, limit);
    const response = {
        success: true,
        data: paginatedBooks,
        pagination: (0, helpers_1.getPaginationMetadata)(total, page, limit),
    };
    res.status(200).json(response);
});
exports.getBookById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const books = await (0, helpers_1.loadBooks)();
    const book = books.find((b) => b.id === id);
    if (!book) {
        throw new errorHandler_1.CustomError('Book not found', 404);
    }
    const response = {
        success: true,
        data: book,
    };
    res.status(200).json(response);
});
exports.getFeaturedBooks = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const books = await (0, helpers_1.loadBooks)();
    const featuredBooks = books.filter((book) => book.featured);
    const response = {
        success: true,
        data: featuredBooks,
    };
    res.status(200).json(response);
});
exports.createBook = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const bookData = req.body;
    const books = await (0, helpers_1.loadBooks)();
    const existingBook = books.find((b) => b.isbn === bookData.isbn);
    if (existingBook) {
        throw new errorHandler_1.CustomError('Book with this ISBN already exists', 409);
    }
    const newBook = {
        id: (0, helpers_1.generateId)('book'),
        ...bookData,
        rating: 0,
        reviewCount: 0,
    };
    books.push(newBook);
    await (0, helpers_1.saveBooks)(books);
    const response = {
        success: true,
        data: newBook,
        message: 'Book created successfully',
    };
    res.status(201).json(response);
});
exports.updateBook = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const books = await (0, helpers_1.loadBooks)();
    const bookIndex = books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
        throw new errorHandler_1.CustomError('Book not found', 404);
    }
    const currentBook = books[bookIndex];
    if (!currentBook) {
        throw new errorHandler_1.CustomError('Book not found', 404);
    }
    if (updateData.isbn && updateData.isbn !== currentBook.isbn) {
        const existingBook = books.find((b) => b.isbn === updateData.isbn);
        if (existingBook) {
            throw new errorHandler_1.CustomError('Book with this ISBN already exists', 409);
        }
    }
    books[bookIndex] = {
        ...currentBook,
        ...updateData,
    };
    await (0, helpers_1.saveBooks)(books);
    const response = {
        success: true,
        data: books[bookIndex],
        message: 'Book updated successfully',
    };
    res.status(200).json(response);
});
exports.deleteBook = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const books = await (0, helpers_1.loadBooks)();
    const bookIndex = books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
        throw new errorHandler_1.CustomError('Book not found', 404);
    }
    books.splice(bookIndex, 1);
    await (0, helpers_1.saveBooks)(books);
    const response = {
        success: true,
        message: 'Book deleted successfully',
    };
    res.status(200).json(response);
});
async function updateBookRating(bookId, newRating, isNewReview) {
    const books = await (0, helpers_1.loadBooks)();
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
    }
    else {
        const { loadReviews } = await Promise.resolve().then(() => __importStar(require('../utils/helpers')));
        const reviews = await loadReviews();
        const bookReviews = reviews.filter((r) => r.bookId === bookId);
        if (bookReviews.length > 0) {
            const totalRating = bookReviews.reduce((sum, r) => sum + r.rating, 0);
            book.rating = totalRating / bookReviews.length;
            book.reviewCount = bookReviews.length;
        }
        else {
            book.rating = 0;
            book.reviewCount = 0;
        }
    }
    await (0, helpers_1.saveBooks)(books);
}
//# sourceMappingURL=booksController.js.map