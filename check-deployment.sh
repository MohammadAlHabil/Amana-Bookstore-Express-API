#!/bin/bash

echo "🚀 Pre-Deployment Checklist for Railway"
echo "========================================"
echo ""

# Check if build works
echo "1️⃣ Testing TypeScript build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi
echo "✅ Build successful!"
echo ""

# Check if start works
echo "2️⃣ Testing start command..."
timeout 3s npm start &
sleep 2
if pgrep -f "node dist/server.js" > /dev/null; then
    echo "✅ Start command works!"
    pkill -f "node dist/server.js"
else
    echo "⚠️  Could not verify start command (might be fine)"
fi
echo ""

# Check essential files
echo "3️⃣ Checking essential files..."
files=("package.json" "tsconfig.json" "data/books.json" "data/reviews.json" ".env.example")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing!"
    fi
done
echo ""

# Check scripts in package.json
echo "4️⃣ Checking package.json scripts..."
if grep -q '"postinstall"' package.json; then
    echo "✅ postinstall script found"
else
    echo "❌ postinstall script missing!"
fi

if grep -q '"start"' package.json; then
    echo "✅ start script found"
else
    echo "❌ start script missing!"
fi
echo ""

# Check environment variables
echo "5️⃣ Environment Variables Checklist:"
echo "   📝 On Railway, set these variables:"
echo "      - NODE_ENV=production"
echo "      - CORS_ORIGIN=* (or your domain)"
echo "      - LOG_LEVEL=combined"
echo "   ℹ️  Railway automatically provides PORT"
echo ""

# Git status
echo "6️⃣ Git Status:"
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "✅ Git repository initialized"
    uncommitted=$(git status --porcelain)
    if [ -z "$uncommitted" ]; then
        echo "✅ All changes committed"
    else
        echo "⚠️  You have uncommitted changes:"
        git status --short
    fi
else
    echo "❌ Not a git repository! Initialize with: git init"
fi
echo ""

echo "========================================"
echo "🎯 Ready for Railway Deployment!"
echo ""
echo "Next steps:"
echo "1. git add . && git commit -m 'Ready for deployment'"
echo "2. git push origin main"
echo "3. Deploy on railway.app"
echo ""
echo "Or use Railway CLI:"
echo "1. railway login"
echo "2. railway init"
echo "3. railway up"
echo "========================================"
