# 📚 Amana Bookstore API - Architecture & Implementation Details

## 🏛️ Architecture Overview

This project follows a **layered architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           Client Requests                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Middleware Layer                 │
│  • Security (Helmet, CORS, Rate Limit)  │
│  • Logging (Morgan, Custom Logger)      │
│  • Validation (Express Validator)       │
│  • Error Handling                        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│            Routes Layer                  │
│  • API Routing                          │
│  • Request Validation Rules             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Controllers Layer                │
│  • Business Logic                       │
│  • Data Processing                      │
│  • Response Formatting                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Utils/Helpers                   │
│  • File Operations                      │
│  • Data Transformation                  │
│  • Utility Functions                    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Data Storage                    │
│  • books.json                           │
│  • reviews.json                         │
└─────────────────────────────────────────┘
```

## 📁 Project Structure Explained

### `/src/server.ts`

**Main Application Entry Point**

- Express app initialization
- Middleware configuration
- Route mounting
- Error handling setup
- Server startup logic
- Process signal handling (graceful shutdown)

**Key Features:**

- ✅ Helmet.js for security headers
- ✅ Morgan for HTTP logging
- ✅ CORS configuration
- ✅ Compression for response optimization
- ✅ Rate limiting to prevent abuse
- ✅ Graceful error handling

### `/src/config/index.ts`

**Configuration Management**

- Centralized configuration
- Environment variables loading
- Default values
- Type-safe configuration object

**Configuration Sections:**

- Server settings (port, environment)
- API settings (prefix, version)
- Pagination defaults
- Rate limiting settings
- CORS configuration
- Logging configuration
- Data file paths

### `/src/types/index.ts`

**TypeScript Type Definitions**

**Defined Types:**

1. **Book Interface** - Complete book entity structure
2. **Review Interface** - Review entity structure
3. **Data Store Interfaces** - JSON file structures
4. **API Response Types** - Standardized response formats
5. **Query Parameters** - Request query type definitions
6. **Request Bodies** - POST/PUT request body types
7. **Error Types** - Custom error interfaces

**Benefits:**

- Type safety throughout the application
- IntelliSense support
- Compile-time error detection
- Self-documenting code

### `/src/controllers/`

#### `booksController.ts`

**Books Business Logic**

**Functions:**

- `getAllBooks()` - Get all books with filtering, sorting, pagination
- `getBookById()` - Get single book by ID
- `getFeaturedBooks()` - Get featured books only
- `createBook()` - Create new book with validation
- `updateBook()` - Update existing book
- `deleteBook()` - Remove book
- `updateBookRating()` - Recalculate book rating from reviews

**Features:**

- ✅ Advanced filtering (genre, author, price, stock, featured)
- ✅ Full-text search (title, author, description, tags)
- ✅ Multiple sorting options
- ✅ Pagination support
- ✅ ISBN uniqueness validation
- ✅ Automatic rating calculation

#### `reviewsController.ts`

**Reviews Business Logic**

**Functions:**

- `getAllReviews()` - Get all reviews with filters
- `getReviewById()` - Get single review
- `getReviewsByBookId()` - Get all reviews for a book
- `createReview()` - Create new review
- `updateReview()` - Update existing review
- `deleteReview()` - Remove review

**Features:**

- ✅ Filter by book, rating, verification status
- ✅ Automatic timestamp generation
- ✅ Book existence validation
- ✅ Automatic book rating update on changes
- ✅ Sorted by newest first

### `/src/routes/`

#### `books.ts`

**Books Route Definitions**

**Endpoints:**

- `GET /` - List all books
- `GET /featured` - Featured books
- `GET /:id` - Single book
- `POST /` - Create book
- `PUT /:id` - Update book
- `DELETE /:id` - Delete book

**Validation Rules:**

- Title: 2-200 characters
- Author: 2-100 characters
- Description: 10-2000 characters
- Price: Positive number
- ISBN: Valid ISBN format (10 or 13 digits)
- Genre/Tags: Non-empty arrays
- Date: ISO 8601 format
- Pages: Positive integer

#### `reviews.ts`

**Reviews Route Definitions**

**Endpoints:**

- `GET /` - List all reviews
- `GET /:id` - Single review
- `GET /book/:bookId` - Reviews by book
- `POST /` - Create review
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review

**Validation Rules:**

- Author: 2-100 characters
- Rating: Integer 1-5
- Title: 2-200 characters
- Comment: 10-2000 characters
- Verified: Boolean

#### `index.ts`

**Main Router**

- Combines all sub-routers
- Health check endpoint
- API versioning support

### `/src/middleware/`

#### `errorHandler.ts`

**Error Handling Middleware**

**Components:**

1. **CustomError Class** - Enhanced error with status codes
2. **notFoundHandler** - 404 error handler
3. **errorHandler** - Global error handler
4. **asyncHandler** - Async function wrapper

**Features:**

- ✅ Operational vs programming error distinction
- ✅ Development vs production error details
- ✅ Consistent error response format
- ✅ Stack trace in development only

#### `validator.ts`

**Input Validation Middleware**

**Functions:**

- `handleValidationErrors()` - Basic validation handler
- `validate()` - Validation middleware factory

**Features:**

- ✅ Express-validator integration
- ✅ Detailed validation error messages
- ✅ Array of validation errors
- ✅ 400 Bad Request responses

#### `logger.ts`

**Custom Logging Middleware**

**Functions:**

- `requestLogger()` - Log incoming requests
- `responseTimeLogger()` - Log response times

**Features:**

- ✅ Console logging
- ✅ File logging (logging/log.txt)
- ✅ Timestamp tracking
- ✅ IP address logging
- ✅ Response time measurement

### `/src/utils/helpers.ts`

**Utility Functions**

**File Operations:**

- `readJsonFile()` - Read JSON data
- `writeJsonFile()` - Write JSON data
- `loadBooks()` - Load books from file
- `saveBooks()` - Save books to file
- `loadReviews()` - Load reviews from file
- `saveReviews()` - Save reviews to file

**Helper Functions:**

- `generateId()` - Generate unique IDs
- `isValidDate()` - Date validation
- `paginate()` - Array pagination
- `getPaginationMetadata()` - Pagination info
- `logToFile()` - File logging utility

## 🔒 Security Implementation

### 1. Helmet.js

Automatically sets security headers:

- Content Security Policy
- X-DNS-Prefetch-Control
- X-Frame-Options
- X-Content-Type-Options
- And more...

### 2. CORS

Configurable cross-origin resource sharing:

- Origin whitelisting
- Credentials support
- Pre-flight handling

### 3. Rate Limiting

Prevents API abuse:

- 100 requests per 15 minutes per IP
- Configurable windows
- Standard headers support

### 4. Input Validation

Every endpoint validates:

- Data types
- String lengths
- Number ranges
- Required fields
- Format validation (ISBN, dates)

### 5. Error Handling

Secure error responses:

- No sensitive data exposure
- Stack traces only in development
- Consistent error format
- Appropriate HTTP status codes

## 📊 Data Flow Example

### Creating a Book:

```
1. Client sends POST /api/books
2. Rate limiter checks request count
3. CORS validates origin
4. Body parser parses JSON
5. Validation middleware validates all fields
6. Books controller receives validated data
7. Controller checks for duplicate ISBN
8. Helper generates unique ID
9. Helper reads books.json
10. New book added to array
11. Helper writes updated books.json
12. Controller returns success response
13. Response logger logs the operation
14. Client receives 201 Created
```

## 🚀 Performance Optimizations

1. **Compression** - Gzip compression reduces response size
2. **Pagination** - Limits data transfer per request
3. **TypeScript** - Compiled JavaScript is optimized
4. **Async/Await** - Non-blocking I/O operations
5. **JSON Parsing Limits** - 10MB limit prevents memory issues
6. **Efficient Filtering** - Array methods with early returns

## 🧪 Testing Recommendations

### Unit Tests (Future Addition)

```typescript
// Example: Test book creation
describe('BooksController', () => {
  it('should create a new book', async () => {
    // Test implementation
  });
});
```

### Integration Tests

Test full API endpoints with real requests

### Load Testing

Use tools like Apache Bench or Artillery

## 🔄 Future Enhancements

1. **Database Integration**
   - PostgreSQL or MongoDB
   - ORM/ODM (Prisma, TypeORM, Mongoose)

2. **Authentication & Authorization**
   - JWT tokens
   - User roles (admin, customer)
   - Protected routes

3. **Caching**
   - Redis for frequently accessed data
   - Response caching

4. **Advanced Search**
   - Elasticsearch integration
   - Full-text search optimization

5. **File Upload**
   - Book cover images
   - Multer integration

6. **API Documentation**
   - Swagger/OpenAPI
   - Interactive documentation

7. **Testing Suite**
   - Jest for unit tests
   - Supertest for integration tests
   - Test coverage reports

8. **CI/CD Pipeline**
   - GitHub Actions
   - Automated testing
   - Automated deployment

9. **Monitoring**
   - Application monitoring (New Relic, DataDog)
   - Error tracking (Sentry)
   - Performance metrics

10. **WebSocket Support**
    - Real-time updates
    - Book availability notifications

## 📚 Best Practices Implemented

✅ **TypeScript** - Full type safety
✅ **Async/Await** - Modern async handling
✅ **Error Handling** - Comprehensive error management
✅ **Validation** - Input validation on all endpoints
✅ **Logging** - Detailed logging for debugging
✅ **Security** - Multiple security layers
✅ **Code Organization** - Clear separation of concerns
✅ **Documentation** - Well-documented code
✅ **Configuration** - Environment-based config
✅ **Scalability** - Ready for database migration

## 🎓 Learning Resources

- Express.js Documentation
- TypeScript Handbook
- Node.js Best Practices
- REST API Design Guidelines
- Security Best Practices (OWASP)

---

**Built with ❤️ using modern Node.js and TypeScript best practices**
