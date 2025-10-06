"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJsonFile = readJsonFile;
exports.writeJsonFile = writeJsonFile;
exports.loadBooks = loadBooks;
exports.saveBooks = saveBooks;
exports.loadReviews = loadReviews;
exports.saveReviews = saveReviews;
exports.generateId = generateId;
exports.isValidDate = isValidDate;
exports.paginate = paginate;
exports.getPaginationMetadata = getPaginationMetadata;
exports.logToFile = logToFile;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function readJsonFile(filePath) {
    try {
        const absolutePath = path_1.default.resolve(process.cwd(), filePath);
        const data = await fs_1.promises.readFile(absolutePath, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to read file ${filePath}: ${error.message}`);
        }
        throw error;
    }
}
async function writeJsonFile(filePath, data) {
    try {
        const absolutePath = path_1.default.resolve(process.cwd(), filePath);
        await fs_1.promises.writeFile(absolutePath, JSON.stringify(data, null, 2), 'utf-8');
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to write file ${filePath}: ${error.message}`);
        }
        throw error;
    }
}
async function loadBooks() {
    const data = await readJsonFile('./data/books.json');
    return data.books;
}
async function saveBooks(books) {
    const data = { books };
    await writeJsonFile('./data/books.json', data);
}
async function loadReviews() {
    const data = await readJsonFile('./data/reviews.json');
    return data.reviews;
}
async function saveReviews(reviews) {
    const data = { reviews };
    await writeJsonFile('./data/reviews.json', data);
}
function generateId(prefix = '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}
function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}
function paginate(array, page, limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return array.slice(startIndex, endIndex);
}
function getPaginationMetadata(total, page, limit) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}
async function logToFile(message, logPath = './logging/log.txt') {
    try {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        const absolutePath = path_1.default.resolve(process.cwd(), logPath);
        await fs_1.promises.appendFile(absolutePath, logMessage, 'utf-8');
    }
    catch (error) {
        console.error('Failed to write to log file:', error);
    }
}
//# sourceMappingURL=helpers.js.map