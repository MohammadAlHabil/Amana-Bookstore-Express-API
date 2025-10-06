import { Request, Response } from 'express';
export declare const getAllBooks: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getBookById: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getFeaturedBooks: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const createBook: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateBook: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteBook: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare function updateBookRating(bookId: string, newRating: number, isNewReview: boolean): Promise<void>;
//# sourceMappingURL=booksController.d.ts.map