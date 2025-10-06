#!/bin/bash
# Railway Startup Script - Ensures data files exist

echo "🚀 Starting Amana Bookstore API..."

# Create directories if they don't exist
mkdir -p data
mkdir -p logging

# Check if data files exist, if not, they should already be in the repo
if [ ! -f "data/books.json" ]; then
    echo "⚠️  Warning: data/books.json not found!"
fi

if [ ! -f "data/reviews.json" ]; then
    echo "⚠️  Warning: data/reviews.json not found!"
fi

# Create empty log file if it doesn't exist
touch logging/log.txt

echo "✅ Pre-start checks complete!"
echo "📚 Starting server..."

# Start the application
node dist/server.js
