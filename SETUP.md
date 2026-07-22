# 🚀 RealTradeNews - Setup & Deployment

## 📋 Project Structure

```
realtradenews/
├── frontend/          # React app
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── build/         (generated)
├── backend/           # Express server
│   ├── src/
│   │   ├── index.js   (serves frontend + APIs)
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   └── package.json
├── Dockerfile         # Production build
├── docker-compose.yml # Local development
└── SETUP.md           (this file)
```

## 🏗️ Architecture

**Single unified server:**
- Frontend: React SPA (built to `frontend/build/`)
- Backend: Express server
- Both run in ONE Docker container on port 3000
- Backend serves frontend static files + API routes

## 🧪 Local Development

### Option 1: Docker (Recommended)
docker-compose up --build

### Option 2: Manual (Node.js required)
cd frontend && npm install && npm run build
cd ../backend && npm install && node src/index.js

Visit: http://localhost:3000

## 🌍 Deployment

Connect GitHub repo to Railway/Render/Fly.io
Set environment variables
Auto-deploy

## ✅ Verification

✅ Frontend accessible at /
✅ API endpoints at /api/*
✅ Static files served from frontend/build/
✅ SPA routing works
