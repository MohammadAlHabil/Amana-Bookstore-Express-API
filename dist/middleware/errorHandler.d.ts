import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';
export declare class CustomError extends Error implements AppError {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare const notFoundHandler: (req: Request, _res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: Error | CustomError, _req: Request, res: Response, _next: NextFunction) => void;
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map