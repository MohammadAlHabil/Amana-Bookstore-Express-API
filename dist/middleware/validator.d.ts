import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ValidationChain } from 'express-validator';
export declare const handleValidationErrors: (req: Request, _res: Response, next: NextFunction) => void;
export declare const validate: (validations: ValidationChain[]) => RequestHandler;
//# sourceMappingURL=validator.d.ts.map