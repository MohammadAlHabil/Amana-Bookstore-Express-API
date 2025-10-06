# 🚂 Railway Deployment Guide

## 📋 Pre-deployment Checklist

✅ All items below are already configured:

- ✅ `package.json` with correct scripts
- ✅ `postinstall` script for automatic build
- ✅ `start` script pointing to `dist/server.js`
- ✅ Environment variables support via `dotenv`
- ✅ Port configuration from `process.env.PORT`
- ✅ `railway.json` configuration file
- ✅ `.gitignore` excluding `node_modules` and `dist`

## 🚀 Deployment Steps

### 1. Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Amana Bookstore API"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/MohammadAlHabil/Amana-Bookstore-Express-API.git

# Push
git push -u origin main
```

### 2. Deploy on Railway

#### Option A: Via Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `Amana-Bookstore-Express-API`
5. Railway will automatically:
   - Detect Node.js project
   - Run `npm install`
   - Run `npm run build` (via postinstall)
   - Start with `npm start`

#### Option B: Via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up

# Open in browser
railway open
```

### 3. Configure Environment Variables

In Railway Dashboard → Your Project → Variables, add:

```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=combined
```

**Note:** Railway automatically provides `PORT`, so it will override your setting.

### 4. Add Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **"Generate Domain"** (Railway provides free domain)
3. Or add your custom domain

## 🔧 Important Configuration

### Environment Variables on Railway

Railway automatically sets:

- `PORT` - The port your app should listen on
- `RAILWAY_ENVIRONMENT` - deployment environment
- `RAILWAY_SERVICE_ID` - unique service identifier

Your app already handles this correctly:

```typescript
// src/config/index.ts
port: parseInt(process.env['PORT'] || '3000', 10);
```

### Automatic Build

Railway will automatically:

1. Run `npm install` (installs dependencies)
2. Run `npm run build` (via postinstall script)
3. Run `npm start` (starts the server)

## 📊 Monitoring & Logs

### View Logs

```bash
# Via CLI
railway logs

# Or in Dashboard → Deployments → View Logs
```

### Health Check

Once deployed, test your API:

```bash
# Replace with your Railway URL
curl https://your-app.up.railway.app/api/health
```

## 🗄️ Data Persistence

**⚠️ Important:** Railway's filesystem is ephemeral!

### Current Setup (JSON files)

- `data/books.json` - Will reset on each deployment
- `logging/log.txt` - Will not persist

### Recommended Solutions:

#### Option 1: Railway PostgreSQL (Recommended)

```bash
# Add PostgreSQL service
railway add --database postgres

# Then migrate from JSON to database
```

#### Option 2: Railway Volumes (For files)

```bash
# Mount persistent volume for data
railway volume create --name data-storage --mount /data
```

#### Option 3: External Database

- Use MongoDB Atlas (free tier)
- Use Supabase
- Use PlanetScale

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update API"
git push

# Railway automatically deploys! 🚀
```

## 🐛 Troubleshooting

### Build Fails

```bash
# Check logs
railway logs --build

# Common fix: ensure TypeScript compiles locally
npm run build
```

### App Crashes

```bash
# Check runtime logs
railway logs

# Ensure start command works locally
npm start
```

### Port Issues

Railway assigns a random port. Your app correctly reads from `process.env.PORT`:

```typescript
const port = process.env['PORT'] || '3000';
```

### Module Not Found

Ensure TypeScript is compiling correctly:

```bash
npm run build
ls dist/  # Should see compiled .js files
```

## 📱 API Endpoints After Deployment

Your API will be available at:

```
https://your-app-name.up.railway.app
```

### Test Endpoints:

```bash
# Health check
curl https://your-app.up.railway.app/api/health

# Get books
curl https://your-app.up.railway.app/api/books

# Get featured books
curl https://your-app.up.railway.app/api/books/featured

# Get reviews
curl https://your-app.up.railway.app/api/reviews
```

## 🔐 Security Considerations

### Update CORS in Production

After deployment, update CORS_ORIGIN:

```env
CORS_ORIGIN=https://your-frontend-domain.com
```

### Rate Limiting

Already configured! (100 requests per 15 minutes per IP)

### Security Headers

Already configured with Helmet.js! ✅

## 💰 Pricing

Railway offers:

- **Free Trial**: $5 credit
- **Hobby Plan**: $5/month
- **Pro Plan**: Usage-based pricing

Your app should fit comfortably in the free tier for development/testing.

## 📚 Useful Commands

```bash
# View service info
railway service

# View environment variables
railway variables

# Open Railway dashboard
railway open

# Link to existing project
railway link

# Run command in Railway environment
railway run node dist/server.js

# Shell into deployment
railway shell
```

## 🎯 Next Steps After Deployment

1. ✅ Test all API endpoints
2. ✅ Configure custom domain
3. ✅ Set up monitoring/alerts
4. ⚠️ Migrate from JSON to database
5. ✅ Update CORS settings for production
6. ✅ Set up CI/CD pipeline (optional)

## 📖 Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Guide](https://docs.railway.app/develop/cli)
- [Railway Examples](https://railway.app/templates)

---

**Your Amana Bookstore API is ready for Railway deployment! 🚀**

Need help? Check Railway's excellent documentation or their Discord community.
