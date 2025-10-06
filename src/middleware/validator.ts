import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult, ValidationChain, ValidationError } from 'express-validator';
import { CustomError } from './errorHandler';

/**
 * Validation Result Handler
 */
export const handleValidationErrors = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error: ValidationError) => ('msg' in error ? String(error.msg) : 'Unknown error'))
      .join(', ');
    throw new CustomError(`Validation Error: ${errorMessages}`, 400);
  }

  next();
};

/**
 * Validate and Handle Middleware Factory
 */
export const validate = (validations: ValidationChain[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Run all validations
    Promise.all(validations.map((validation) => validation.run(req)))
      .then(() => {
        // Check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errorMessages = errors
            .array()
            .map((error: ValidationError) => {
              const type = 'type' in error ? String(error.type) : 'field';
              const msg = 'msg' in error ? String(error.msg) : 'Unknown error';
              return `${type}: ${msg}`;
            })
            .join('; ');

          res.status(400).json({
            success: false,
            error: 'Validation Error',
            details: errorMessages,
            errors: errors.array(),
          });
          return;
        }

        next();
      })
      .catch((error) => next(error));
  };
};
