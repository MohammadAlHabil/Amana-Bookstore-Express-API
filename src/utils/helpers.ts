import { promises as fs } from 'fs';
import path from 'path';
import { Book, Review, BooksData, ReviewsData } from '../types';

/**
 * Generic function to read JSON data from file
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const data = await fs.readFile(absolutePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Generic function to write JSON data to file
 */
export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    await fs.writeFile(absolutePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to write file ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load books data
 */
export async function loadBooks(): Promise<Book[]> {
  const data = await readJsonFile<BooksData>('./data/books.json');
  return data.books;
}

/**
 * Save books data
 */
export async function saveBooks(books: Book[]): Promise<void> {
  const data: BooksData = { books };
  await writeJsonFile('./data/books.json', data);
}

/**
 * Load reviews data
 */
export async function loadReviews(): Promise<Review[]> {
  const data = await readJsonFile<ReviewsData>('./data/reviews.json');
  return data.reviews;
}

/**
 * Save reviews data
 */
export async function saveReviews(reviews: Review[]): Promise<void> {
  const data: ReviewsData = { reviews };
  await writeJsonFile('./data/reviews.json', data);
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Validate if a string is a valid date
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Paginate array
 */
export function paginate<T>(array: T[], page: number, limit: number): T[] {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return array.slice(startIndex, endIndex);
}

/**
 * Calculate pagination metadata
 */
export function getPaginationMetadata(
  total: number,
  page: number,
  limit: number
): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Log to file
 */
export async function logToFile(
  message: string,
  logPath: string = './logging/log.txt'
): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    const absolutePath = path.resolve(process.cwd(), logPath);
    await fs.appendFile(absolutePath, logMessage, 'utf-8');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}
