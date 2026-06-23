# Deployment Guide

## Local Development Setup

This guide covers setting up the Video VFX Engine for local development and testing.

### Prerequisites

#### System Requirements
- **OS:** macOS, Linux, or Windows (WSL2 recommended)
- **Python:** 3.10 or higher
- **Node.js:** 18.0 or higher
- **FFmpeg:** 5.0 or higher

#### Installation

**macOS:**
```bash
brew install python@3.10 node ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3.10 python3.10-venv nodejs ffmpeg
```

**Windows (with WSL2):**
```bash
wsl --install -d Ubuntu-22.04
# Then run Ubuntu commands above
```

**Verify installations:**
```bash
python3 --version      # Python 3.10+
node --version         # Node 18+
ffmpeg -version        # FFmpeg 5.0+
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Key dependencies:**
- FastAPI 0.104+
- Uvicorn (ASGI server)
- SQLAlchemy (ORM)
- Librosa (audio processing)
- Openai-whisper (transcription)
- PyJWT (token management)
- python-multipart (file uploads)

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database
DATABASE_URL=sqlite:///./app.db

# API Keys
WHISPER_API_KEY=sk-...  # From OpenAI
OPENAI_API_KEY=sk-...   # For Whisper API

# JWT
JWT_SECRET=your-secret-key-at-least-32-characters
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=1

# Server
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
DEBUG=True

# CORS (for local development)
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

**Important:** For local dev, `JWT_SECRET` can be any 32+ char string. In production, use a cryptographically secure random value.

### 5. Initialize Database

```bash
python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"
```

This creates `app.db` with all tables and built-in presets.

### 6. Start Backend Server

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

Test the health endpoint:
```bash
curl http://localhost:8000/health
# Response: {"status": "healthy"}
```

---

## Frontend Setup

### 1. Install Dependencies

From the project root (not backend):

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

Open `http://localhost:5173` in your browser.

---

## Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python -m uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Both services should now be running:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000   # Windows (then taskkill /PID)

# Or use a different port
python -m uvicorn main:app --reload --port 8001
```

**ModuleNotFoundError: No module named 'fastapi'**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Database locked error:**
- SQLite is single-writer
- Ensure only one backend instance is running
- Delete `app.db` and reinitialize if corrupted:
  ```bash
  rm app.db
  python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"
  ```

**FFmpeg not found:**
```bash
# Verify installation
ffmpeg -version

# macOS
brew install ffmpeg

# Ubuntu
sudo apt install ffmpeg
```

### Frontend Issues

**Port 5173 already in use:**
```bash
npm run dev -- --port 5174
```

**CORS errors in browser console:**
- Verify `CORS_ORIGINS` in backend `.env` includes `http://localhost:5173`
- Check backend is running on `http://localhost:8000`
- Restart backend after changing CORS settings

**API calls returning 401 Unauthorized:**
- Check JWT token is stored in localStorage
- Verify token isn't expired (1 hour default)
- Try logging out and back in

**Blank page or "Loading..." forever:**
- Open browser DevTools (F12)
- Check Network tab for API errors
- Check Console for JavaScript errors
- Verify backend is responding: `curl http://localhost:8000/health`

---

## Production Deployment (Phase 2)

### Backend - Railway/Heroku/AWS

```bash
# Build for production
pip install -r requirements.txt
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app

# Or with Uvicorn directly
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Environment variables to set:**
- `DATABASE_URL` → PostgreSQL connection string
- `JWT_SECRET` → Cryptographically secure key
- `WHISPER_API_KEY` → OpenAI API key
- `CORS_ORIGINS` → Frontend deployment URL

### Frontend - Vercel/Netlify

```bash
# Build static files
npm run build

# Output in dist/ directory
```

**Environment variables:**
- `VITE_API_BASE_URL` → Backend API URL

**Deployment:**
```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod --dir=dist
```

---

## Performance Optimization

### Backend
- Enable query result caching for presets
- Use database connection pooling
- Implement render job queue with workers (Celery)
- Move transcription to async background job

### Frontend
- Code splitting with React.lazy()
- Lazy load dashboard components
- Cache API responses with SWR or React Query
- Compress assets (gzip)

---

## Monitoring & Logging

### Backend Logs
```bash
# Stream logs in production
tail -f /var/log/vfx-engine.log

# View recent errors
grep ERROR /var/log/vfx-engine.log
```

### Frontend
- Browser DevTools Console for client-side errors
- Network tab to inspect API calls
- Lighthouse for performance audits

### Health Checks

Backend health endpoint:
```bash
curl http://localhost:8000/health
```

Frontend status (via browser):
```javascript
fetch('http://localhost:8000/health').then(r => r.json()).then(console.log)
```

---

## Database Backups

### Local Development
```bash
# Backup
cp backend/app.db backend/app.db.backup

# Restore
cp backend/app.db.backup backend/app.db
```

### Production (PostgreSQL)
```bash
# Automated daily backups recommended
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## Development Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feat/my-feature
   ```

2. **Make changes and test:**
   - Backend: Watch for errors in terminal
   - Frontend: Check DevTools for console errors

3. **Verify API contract:**
   - Test endpoints with curl or Postman
   - Compare response with API.md documentation

4. **Run manual testing checklist:**
   - See [TESTING.md](TESTING.md)

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add feature description"
   git push origin feat/my-feature
   ```

6. **Create pull request on GitHub**

---

## Common Development Commands

```bash
# Backend
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload              # Start server
python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"  # Reset DB
python -m pytest tests/                          # Run tests (when added)

# Frontend
npm run dev                                       # Start dev server
npm run build                                    # Build for production
npm run preview                                  # Preview production build
npm run lint                                     # Check for style issues
```

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│          Browser (React App)                    │
│    http://localhost:5173                        │
└────────────┬────────────────────────────────────┘
             │ HTTP/JSON
             ▼
┌─────────────────────────────────────────────────┐
│    FastAPI Backend                              │
│    http://localhost:8000                        │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Routes (Auth, Video, Render, Presets)  │  │
│  ├──────────────────────────────────────────┤  │
│  │  Services (Business Logic)               │  │
│  ├──────────────────────────────────────────┤  │
│  │  ORM Models (SQLAlchemy)                 │  │
│  └──────────────────────────────────────────┘  │
└────────────┬────────────────────────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
  SQLite   FFmpeg   OpenAI
  (DB)    (Videos)  (Whisper)
```

For questions or issues, refer to [README.md](../README.md) or check the GitHub issues.
