# Video VFX Engine

A full-stack video rendering platform with AI-powered transcription, audio peak detection, and customizable visual effects. Render videos with dynamic vibe presets and synchronized audio hooks.

## Features

### Phase 1 (MVP)
- **User Authentication**: JWT-based login/register with secure password hashing
- **Video Upload**: Drag-and-drop video upload with MIME type validation (500MB max)
- **AI Transcription**: Automatic speech-to-text using OpenAI Whisper API
- **Audio Analysis**: Peak detection using Librosa (80th percentile algorithm)
- **Vibe Presets**: 3 built-in presets (Global CEO, Asli Khiladi, Distant Vision) + custom preset creation
- **Visual Effects**: Audio hooks with synchronized effects at detected peaks (0.05s triggers)
- **Render Queue**: Mock cloud rendering with exponential backoff polling (1s→30s max)
- **Dashboard**: View past renders, manage custom presets, download completed videos
- **Responsive UI**: Mobile-friendly design with gradient backgrounds and smooth animations

## Tech Stack

**Backend:**
- FastAPI (Python 3.10+)
- SQLAlchemy ORM with SQLite
- OpenAI Whisper (transcription)
- Librosa (audio peak detection)
- FFmpeg/FFprobe (video processing)
- Bcrypt (password hashing)
- PyJWT (token management)

**Frontend:**
- React 19
- React Router v6 (protected routes)
- Vite (build tool)
- Lucide React (icons)

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- FFmpeg (`brew install ffmpeg` on macOS, `choco install ffmpeg` on Windows)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Initialize database and start server
python -m uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
npm install

# Create .env.local file
cp .env.local.example .env.local
# .env.local should have: VITE_API_BASE_URL=http://localhost:8000

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:5173`

## Architecture

```
avx-render-engine/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Environment config
│   ├── database.py          # SQLAlchemy setup
│   ├── models.py            # ORM models (User, Video, etc.)
│   ├── services/            # Business logic (auth, video, render)
│   ├── routes/              # API endpoints
│   ├── schemas/             # Pydantic request/response models
│   ├── utils/               # File validation, ffprobe
│   ├── constants/           # Vibe preset templates
│   └── requirements.txt
│
└── src/
    ├── pages/               # Page components (Login, Upload, Render, Dashboard)
    ├── components/          # Reusable components (Upload, Render, Auth, Dashboard)
    ├── hooks/               # Custom hooks (useAuth)
    ├── contexts/            # React contexts (AuthContext)
    ├── services/            # API services (authService, videoService, renderService)
    ├── utils/               # Utilities (apiClient, formatting)
    ├── styles/              # CSS stylesheets
    └── App.jsx              # Router setup
```

## API Overview

All endpoints require JWT authentication (except `/api/auth/*`).

### Auth Endpoints
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and receive JWT token
- `POST /api/auth/verify` - Verify current token

### Video Endpoints
- `POST /api/videos/upload` - Upload video file
- `GET /api/videos` - List user's videos
- `GET /api/videos/{video_id}` - Get video metadata
- `DELETE /api/videos/{video_id}` - Delete video

### Transcription & Peaks
- `GET /api/transcription/{video_id}` - Get video transcription
- `GET /api/hooks/{video_id}` - Get detected audio peaks

### Presets
- `GET /api/presets` - List built-in and custom presets
- `POST /api/presets` - Create custom preset
- `PUT /api/presets/{id}` - Update preset
- `DELETE /api/presets/{id}` - Delete preset

### Rendering
- `POST /api/render/{video_id}` - Start render job
- `GET /api/render/{job_id}/status` - Poll render progress

See [docs/API.md](docs/API.md) for full endpoint documentation.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed setup and troubleshooting.

## Testing

See [docs/TESTING.md](docs/TESTING.md) for manual testing checklist and verification steps.

## Database Schema

See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for complete schema documentation.

## Development Workflow

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make changes and test locally
3. Ensure no console errors in browser DevTools
4. Ensure no errors in backend terminal logs
5. Commit with clear message: `git commit -m "Add feature description"`
6. Push to remote and create pull request

## Known Limitations (Phase 1)

- Transcription is blocking (uploaded video waits for Whisper API response)
- Mock cloud rendering (no real video processing)
- SQLite single-writer limitation (not suitable for high concurrency)
- No cleanup of orphaned files on deletion
- No email notifications

## Phase 2+ Roadmap

- Async transcription with background jobs (Celery)
- Real video rendering (FFmpeg integration or cloud service)
- PostgreSQL for production database
- Email notifications on render completion
- Advanced audio visualization (waveform rendering)
- Preset templates library (community sharing)
- Analytics dashboard

## Contributing

Contributions welcome! Please:
1. Follow the existing code style
2. Test your changes locally
3. Update documentation if adding features
4. Keep commits focused and well-described

## License

MIT

## Support

For issues and questions, please open a GitHub issue or contact the development team.
