# Amana Bookstore Express API 📚

A professional, enterprise-grade Express.js REST API built with TypeScript for the Amana Bookstore - a specialized academic bookstore focusing on science and educational texts.

## 🚀 Project Overview

This is a fully-featured REST API server built with industry best practices, featuring comprehensive security, validation, logging, and error handling. The API serves academic institutions, students, and researchers with high-quality scientific and educational publications.

## 🏗️ Project Structure

```
Amana-Bookstore-Express-API/
├── src/
│   ├── config/
│   │   └── index.ts           # Configuration management
│   ├── controllers/
│   │   ├── booksController.ts # Books CRUD operations
│   │   └── reviewsController.ts # Reviews CRUD operations
│   ├── middleware/
│   │   ├── errorHandler.ts    # Error handling middleware
│   │   ├── validator.ts       # Request validation middleware
│   │   └── logger.ts          # Custom logging middleware
│   ├── routes/
│   │   ├── books.ts           # Books routes
│   │   ├── reviews.ts         # Reviews routes
│   │   └── index.ts           # Main router
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── helpers.ts         # Utility functions
│   └── server.ts              # Express server entry point
├── data/
│   ├── books.json             # Books data store
│   └── reviews.json           # Reviews data store
├── logging/
│   └── log.txt                # Application logs
├── dist/                       # Compiled JavaScript (generated)
├── .env                        # Environment variables
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── .eslintrc.json             # ESLint configuration
├── .prettierrc.json           # Prettier configuration
├── tsconfig.json              # TypeScript configuration
├── nodemon.json               # Nodemon configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## ✨ Features

### Core Functionality

- ✅ **Complete CRUD Operations** for Books and Reviews
- ✅ **Advanced Filtering & Search** with multiple parameters
- ✅ **Pagination Support** for all list endpoints
- ✅ **Automatic Rating Calculation** based on reviews
- ✅ **Featured Books Management**
- ✅ **Inventory Tracking** (in-stock status)

### Security & Performance

- 🔒 **Helmet.js** - Security headers protection
- 🚦 **Rate Limiting** - Prevents API abuse
- 🔐 **CORS** - Cross-origin resource sharing
- 🗜️ **Compression** - Response compression
- ✅ **Input Validation** - Express-validator integration
- 🛡️ **Error Handling** - Comprehensive error management

### Developer Experience

- 📝 **TypeScript** - Full type safety
- 🔥 **Hot Reload** - Nodemon development mode
- 📊 **Morgan Logging** - HTTP request logging
- 📋 **Custom Logging** - File-based logging system
- 🎨 **Code Quality** - ESLint + Prettier
- 📖 **Well Documented** - Comprehensive inline documentation

## 🛠️ Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Security**: Helmet.js, CORS, Rate Limiting
- **Validation**: Express-validator
- **Logging**: Morgan, Custom File Logger
- **Development**: Nodemon, TS-Node
- **Code Quality**: ESLint, Prettier
- **Performance**: Compression

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Amana-Bookstore-Express-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=dev
```

### 4. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm start
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Books Endpoints

#### Get All Books

```http
GET /api/books
```

**Query Parameters:**

- `genre` - Filter by genre
- `author` - Filter by author name
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `inStock` - Filter by stock status (true/false)
- `featured` - Filter featured books (true/false)
- `search` - Search in title, author, description, tags
- `sortBy` - Sort field (price, rating, datePublished, title)
- `order` - Sort order (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Example:**

```bash
curl "http://localhost:3000/api/books?genre=Physics&sortBy=rating&order=desc&page=1&limit=10"
```

#### Get Featured Books

```http
GET /api/books/featured
```

#### Get Book by ID

```http
GET /api/books/:id
```

#### Create New Book

```http
POST /api/books
Content-Type: application/json

{
  "title": "Advanced Quantum Computing",
  "author": "Dr. Sarah Ahmed",
  "description": "A comprehensive guide to quantum computing...",
  "price": 149.99,
  "image": "/images/quantum.jpg",
  "isbn": "978-0123456789",
  "genre": ["Physics", "Computer Science"],
  "tags": ["Quantum", "Computing", "Advanced"],
  "datePublished": "2024-01-15",
  "pages": 850,
  "language": "English",
  "publisher": "Academic Press",
  "inStock": true,
  "featured": false
}
```

#### Update Book

```http
PUT /api/books/:id
Content-Type: application/json

{
  "price": 129.99,
  "inStock": true
}
```

#### Delete Book

```http
DELETE /api/books/:id
```

### Reviews Endpoints

#### Get All Reviews

```http
GET /api/reviews
```

**Query Parameters:**

- `bookId` - Filter by book ID
- `minRating` - Minimum rating filter (1-5)
- `verified` - Filter verified reviews (true/false)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

#### Get Review by ID

```http
GET /api/reviews/:id
```

#### Get Reviews for a Book

```http
GET /api/reviews/book/:bookId
```

#### Create New Review

```http
POST /api/reviews
Content-Type: application/json

{
  "bookId": "1",
  "author": "Dr. Ahmed Hassan",
  "rating": 5,
  "title": "Excellent resource",
  "comment": "This book provides comprehensive coverage...",
  "verified": true
}
```

#### Update Review

```http
PUT /api/reviews/:id
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review comment..."
}
```

#### Delete Review

```http
DELETE /api/reviews/:id
```

### Health Check

```http
GET /api/health
```

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
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
  "error": "Error message here"
}
```

## 🧪 Sample Data

### Books Dataset (`data/books.json`)

**3 sample books** with comprehensive metadata including:

- **Academic Focus**: Physics, Quantum Mechanics, and Astrophysics textbooks
- **Detailed Metadata**: ISBN, genre, tags, publication info, pricing
- **Rich Content**: Descriptions, ratings, review counts, stock status
- **Featured Books**: Curated selection for homepage display

### Reviews Dataset (`data/reviews.json`)

### Reviews Dataset (`data/reviews.json`)

**11 sample reviews** with:

- **Verified Reviews**: Academic credibility with verification status
- **Detailed Feedback**: Professional reviews from educators and students
- **Rating System**: 5-star rating with detailed comments
- **Academic Authors**: Reviews from professors, doctors, and students

## 📜 Available Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Clean build directory
npm run clean

# Clean and rebuild
npm run rebuild

# Type checking without building
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## 🔒 Security Features

- **Helmet.js**: Sets secure HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs validated with express-validator
- **Error Handling**: Secure error responses (no stack traces in production)
- **Type Safety**: Full TypeScript implementation

## 📝 Logging

The application uses a dual logging approach:

1. **Console Logging** (Morgan):
   - Development: `dev` format
   - Production: `combined` format

2. **File Logging** (Custom):
   - Location: `logging/log.txt`
   - Includes: Timestamps, request details, response times

## 🐛 Error Handling

The API implements comprehensive error handling:

- **Validation Errors** (400): Invalid input data
- **Not Found Errors** (404): Resource not found
- **Conflict Errors** (409): Duplicate resources (e.g., ISBN)
- **Server Errors** (500): Unexpected server errors

All errors return a consistent JSON format:

```json
{
  "success": false,
  "error": "Error description"
}
```

## 🚀 Production Deployment

### Build the Application

```bash
npm run build
```

### Set Production Environment

```bash
export NODE_ENV=production
export PORT=3000
```

### Start the Server

```bash
npm start
```

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start dist/server.js --name amana-bookstore-api

# View logs
pm2 logs amana-bookstore-api

# Monitor
pm2 monit
```

## 🧪 Testing the API

### Using cURL

#### Get all books

```bash
curl http://localhost:3000/api/books
```

#### Get featured books

```bash
curl http://localhost:3000/api/books/featured
```

#### Create a new book

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "description": "A test book description",
    "price": 29.99,
    "image": "/images/test.jpg",
    "isbn": "978-1234567890",
    "genre": ["Test"],
    "tags": ["test"],
    "datePublished": "2024-01-01",
    "pages": 200,
    "language": "English",
    "publisher": "Test Publisher",
    "inStock": true,
    "featured": false
  }'
```

### Using Postman

1. Import the API endpoints into Postman
2. Set base URL: `http://localhost:3000/api`
3. Test each endpoint with sample data

## 📊 Performance Optimization

- ✅ **Compression**: Gzip compression for responses
- ✅ **Rate Limiting**: Prevents API abuse
- ✅ **Pagination**: Efficient data loading
- ✅ **TypeScript**: Better performance with compiled code
- ✅ **Async/Await**: Non-blocking operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Mohammad Al Habil**

## 🙏 Acknowledgments

- Express.js community
- TypeScript team
- All contributors and supporters

---

Made with ❤️ for Amana Bootcamp

## Planned API Features

Based on this initial dataset, the Express.js API will support:

### Core Functionality

- **Book Catalog Management**: CRUD operations for books
- **Review System**: Customer reviews and ratings
- **Search & Filtering**: By genre, author, price, availability
- **Featured Books**: Curated book recommendations
- **Inventory Management**: Stock tracking and availability

### Advanced Features

- **Academic Focus**: Specialized for educational institutions
- **Publisher Integration**: Support for multiple academic publishers
- **Verification System**: Verified reviews from academic professionals
- **Multi-language Support**: Currently English, expandable
- **Rating Analytics**: Comprehensive rating and review analytics

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Express.js framework

### Development Setup

1. Clone this repository
2. Install dependencies: `npm install express`
3. Develop the Express server in `server.js`
4. Use the sample data in `data/` for testing and development

### Recommended API Endpoints

```
GET    /api/books              # Get all books
GET    /api/books/:id          # Get specific book
GET    /api/books/featured     # Get featured books
GET    /api/books/search       # Search books
POST   /api/books              # Add new book
PUT    /api/books/:id          # Update book
DELETE /api/books/:id          # Delete book

GET    /api/reviews            # Get all reviews
GET    /api/reviews/book/:id   # Get reviews for specific book
POST   /api/reviews            # Add new review
PUT    /api/reviews/:id        # Update review
DELETE /api/reviews/:id        # Delete review
```

## Data Characteristics

### Academic Publishers Featured

- Al-Biruni Academic Press
- Ibn Sina Publications
- Al-Sufi Astronomical Society

### Subject Areas

- Classical Mechanics
- Quantum Physics
- Astrophysics and Astronomy
- Advanced Physics

### Price Range

- $89.99 - $125.50 (Academic textbook pricing)

## Next Steps

1. **Server Development**: Implement Express.js server with routing
2. **Database Integration**: Migrate JSON data to MongoDB/PostgreSQL
3. **Authentication**: Add user authentication and authorization
4. **API Documentation**: Create comprehensive API documentation
5. **Testing**: Implement unit and integration tests
6. **Deployment**: Configure for production deployment

## Contributing

This is an initial dataset for development purposes. The data represents a specialized academic bookstore focusing on scientific publications and educational materials.

## License

This project is intended for educational and development purposes.
