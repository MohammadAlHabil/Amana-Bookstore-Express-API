"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_1 = __importDefault(require("./books"));
const reviews_1 = __importDefault(require("./reviews"));
const router = (0, express_1.Router)();
router.use('/books', books_1.default);
router.use('/reviews', reviews_1.default);
router.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Amana Bookstore API is running',
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map