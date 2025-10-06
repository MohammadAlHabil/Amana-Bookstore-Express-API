"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("./errorHandler");
const handleValidationErrors = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error) => ('msg' in error ? String(error.msg) : 'Unknown error'))
            .join(', ');
        throw new errorHandler_1.CustomError(`Validation Error: ${errorMessages}`, 400);
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
const validate = (validations) => {
    return (req, res, next) => {
        Promise.all(validations.map((validation) => validation.run(req)))
            .then(() => {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors
                    .array()
                    .map((error) => {
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
exports.validate = validate;
//# sourceMappingURL=validator.js.map