import { Book, Review } from '../types';
export declare function readJsonFile<T>(filePath: string): Promise<T>;
export declare function writeJsonFile<T>(filePath: string, data: T): Promise<void>;
export declare function loadBooks(): Promise<Book[]>;
export declare function saveBooks(books: Book[]): Promise<void>;
export declare function loadReviews(): Promise<Review[]>;
export declare function saveReviews(reviews: Review[]): Promise<void>;
export declare function generateId(prefix?: string): string;
export declare function isValidDate(dateString: string): boolean;
export declare function paginate<T>(array: T[], page: number, limit: number): T[];
export declare function getPaginationMetadata(total: number, page: number, limit: number): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};
export declare function logToFile(message: string, logPath?: string): Promise<void>;
//# sourceMappingURL=helpers.d.ts.map