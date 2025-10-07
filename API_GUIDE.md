# 🚀 Quick Start Guide - Amana Bookstore API

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Server will run on: http://localhost:3000

## Testing the API

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

### 2. Get All Books

```bash
curl http://localhost:3000/api/books
```

### 3. Get Featured Books

```bash
curl http://localhost:3000/api/books/featured
```

### 4. Search Books by Genre

```bash
curl "http://localhost:3000/api/books?genre=Physics&sortBy=rating&order=desc"
```

### 5. Get Book by ID

```bash
curl http://localhost:3000/api/books/1
```

### 6. Create a New Book

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Organic Chemistry",
    "author": "Dr. Layla Al-Farabi",
    "description": "A comprehensive guide to organic chemistry for undergraduate students",
    "price": 79.99,
    "image": "/images/organic-chemistry.jpg",
    "isbn": "978-0987654321",
    "genre": ["Chemistry", "Science"],
    "tags": ["Organic", "Chemistry", "University"],
    "datePublished": "2024-10-01",
    "pages": 550,
    "language": "English",
    "publisher": "Al-Razi Academic Press",
    "inStock": true,
    "featured": true
  }'
```

### 7. Get All Reviews

```bash
curl http://localhost:3000/api/reviews
```

### 8. Get Reviews for a Book

```bash
curl http://localhost:3000/api/reviews/book/1
```

### 9. Create a New Review

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "1",
    "author": "Dr. Khalid Al-Masri",
    "rating": 5,
    "title": "Outstanding textbook",
    "comment": "This is one of the best mechanics textbooks I have used in my teaching career. Highly recommended!",
    "verified": true
  }'
```

### 10. Update a Book (Price Update)

```bash
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 79.99,
    "inStock": true
  }'
```

### 11. Advanced Search

```bash
# Search with multiple filters
curl "http://localhost:3000/api/books?search=quantum&minPrice=50&maxPrice=150&inStock=true&page=1&limit=10"
```

### 11.a Search Endpoint (alternate)

```bash
# Full-text search across title, author, description and tags
curl "http://localhost:3000/api/books/search?q=quantum&page=1&limit=10"
```

### 12. Paginated Results

```bash
curl "http://localhost:3000/api/books?page=1&limit=2"
```

## 🔍 Query Parameters Reference

### Books Endpoint Query Parameters

- `genre` - Filter by genre (e.g., Physics, Chemistry)
- `author` - Filter by author name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `inStock` - Filter by availability (true/false)
- `featured` - Show only featured books (true/false)
- `search` - Search in title, author, description, tags
- `sortBy` - Sort by: price, rating, datePublished, title
- `order` - Sort order: asc, desc
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10, max: 100)
- `publishedAfter` - ISO date (YYYY-MM-DD) to include books published on or after this date
- `publishedBefore` - ISO date (YYYY-MM-DD) to include books published on or before this date

### Reviews Endpoint Query Parameters

- `bookId` - Filter by book ID
- `minRating` - Minimum rating (1-5)
- `verified` - Show only verified reviews (true/false)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10, max: 100)

## 🔎 Additional Endpoints

- `GET /api/books/top-rated` - Returns the top 10 books ranked by a score calculated as (rating \* reviewCount). Useful to surface popular high-rated books.
- `GET /api/books/search?q=<term>` - Alternate search endpoint that performs a focused full-text search over title, author, description and tags. Supports `page` and `limit` query params.
- `GET /` - Returns a JSON array listing all discovered API endpoints (method and path). This is generated at runtime from the Express router stack and is useful for quick discovery during development.

## 🔐 Protected Endpoints (API Token Required)

The following endpoints require an API token and will return 401 Unauthorized if a valid token is not provided:

- `POST /api/books` - Create a new book
- `POST /api/reviews` - Create a new review

Authentication options (pick one):

- Authorization header (Bearer token):

```bash
 -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

- X-API-KEY header:

```bash
 -H "X-API-KEY: <YOUR_TOKEN_HERE>"
```

The allowed tokens are configured by the server environment variable `ALLOWED_TOKENS` (comma-separated values). For local development you can set this in your environment before starting the server.

## 📊 Response Examples

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Fundamentals of Classical Mechanics",
    "author": "Dr. Ahmad Al-Kindi",
    "price": 89.99,
    ...
  },
  "message": "Book created successfully"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Book not found"
}
```

## 🛡️ Security Features

- ✅ Helmet.js for HTTP security headers
- ✅ CORS enabled
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation on all endpoints
- ✅ Comprehensive error handling

## 📝 Scripts

```bash
npm run dev      # Development with hot reload
npm run build    # Build TypeScript
npm start        # Production server
npm run clean    # Clean dist folder
npm run rebuild  # Clean and build
```

## 🔗 Useful Links

- API Base: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health
- Documentation: This file

---

**Note**: Make sure the server is running before testing the API endpoints!
