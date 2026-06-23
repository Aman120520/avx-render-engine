# Current State — Phase 1 Technical Foundation

**Plan:** Video VFX Engine: Phase 1 Technical Foundation
**File:** 01-current-state.md
**Created:** 2026-04-25

---

## Project Overview

**avx-render-engine** is a React + Vite frontend project currently with no backend. The codebase is minimal and ready for expansion.

### Current Stack
- **Frontend:** React 19.2.4, Vite 8.0.1, Tailwind CSS 4.2.2
- **Backend:** None (to be built)
- **Database:** None (to be built)
- **Rendering:** None (to be built)

### Current Frontend Structure

```
src/
├── App.jsx              # Main React component (25KB, likely contains example content)
├── App.css              # Styling
├── main.jsx             # Entry point
├── index.css            # Global styles
├── assets/              # Static assets (likely images/videos)
├── components/          # Reusable React components (empty or minimal)
├── constants/           # App constants and festival data
├── styles/              # Style utilities
└── utils/               # Utility functions
    ├── canvasHelper.js  # Canvas manipulation helpers
    ├── illustrationHelpers.js (new, not yet integrated)
    ├── particleSystem.js (new, not yet integrated)
```

### Key Assets

The following files exist but are not yet wired into the active codebase:
- `HYBRID_DESIGN_OVERVIEW.md` — Design documentation
- `HYBRID_IMPLEMENTATION_COMPLETE.md` — Implementation notes
- `IMAGE_ENHANCEMENTS.md` — Image processing notes
- `IMPROVEMENTS_SUMMARY.md` — Summary of improvements
- `src/utils/illustrationHelpers.js` — Illustration utilities (unintegrated)
- `src/utils/particleSystem.js` — Particle system (unintegrated)

### Current Branch

- **Active branch:** `feat/ai-image-generator`
- **Main branch:** `main`
- **Recent commits:**
  - `c8ac519` Update .gitignore
  - `8f19a83` Fix errors
  - `cc4d919` Update festival images
  - `299d2a8` Improve performance
  - `ba93e30` Make UI responsive

---

## Phase 1 Architecture (to be built)

### High-Level Flow

```
User (React App)
    ↓
    [Upload Video + Select Vibe + Configure Hooks]
    ↓
Python FastAPI Backend
    ├── Authentication (email/password)
    ├── User profile & vibe presets (SQLite)
    ├── Whisper transcription (blocking)
    ├── Audio analysis (detect peaks)
    └── Queue render job (AWS/Google Cloud)
    ↓
    [Polling for completion]
    ↓
Cloud (AWS Lambda / Google Cloud Run)
    ├── Fetch raw video from storage
    ├── Fetch VFX overlays
    ├── Apply FFmpeg compositing
    ├── Return rendered video
    ↓
React App displays rendered video + download link
```

### Components to Build

#### 1. **Frontend (React)**

**Auth flow:**
- Login/Register screens
- Session management (JWT token in localStorage)
- Protected routes

**Upload flow:**
- Video picker (file input or drag-and-drop)
- Vibe selector (3 built-in templates + saved presets)
- Hook configuration UI (enable/disable detected peaks)
- Progress indicator during transcription and rendering
- Download button when complete

**Dashboard:**
- List of user's past renders
- Saved vibe presets (create, edit, delete)
- Quick re-render with different vibe

**Components needed:**
- `AuthModal` (login/register)
- `UploadForm` (drag-drop, vibe selector)
- `HookEditor` (show audio peaks, toggle hooks)
- `RenderProgress` (status updates)
- `Dashboard` (list renders, manage presets)
- `VibePresetManager` (CRUD for custom presets)

#### 2. **Backend (Python FastAPI)**

**Core responsibilities:**
1. User authentication (bcrypt + JWT)
2. Store user data, vibe presets, video metadata (SQLite with SQLAlchemy ORM)
3. Integrate Whisper API for transcription
4. Audio analysis (detect peaks from WAV/MP3)
5. Queue render jobs to cloud
6. Poll cloud service for job status
7. Return render results to frontend

**Endpoints:**
```
POST   /api/auth/register          # Register user
POST   /api/auth/login             # Login, return JWT
GET    /api/auth/verify            # Verify token
POST   /api/videos/upload          # Upload video, return job ID
GET    /api/videos/{video_id}      # Get video metadata & status
GET    /api/videos                 # List user's videos
POST   /api/presets                # Create vibe preset
GET    /api/presets                # List user's presets
PUT    /api/presets/{preset_id}    # Update preset
DELETE /api/presets/{preset_id}    # Delete preset
GET    /api/hooks/{video_id}       # Get detected audio peaks
POST   /api/render/{video_id}      # Trigger render with vibe
GET    /api/render/{video_id}/status # Poll render status
```

**Database schema (SQLite):**

```sql
-- Users
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vibe presets
CREATE TABLE vibe_presets (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL FOREIGN KEY,
  name TEXT NOT NULL,
  config JSON NOT NULL,  -- { colors, fonts, timing, effects }
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Video metadata
CREATE TABLE videos (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  original_filename TEXT,
  upload_path TEXT NOT NULL,
  duration_seconds FLOAT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Transcriptions
CREATE TABLE transcriptions (
  id INTEGER PRIMARY KEY,
  video_id INTEGER NOT NULL UNIQUE,
  text TEXT,
  segments JSON,  -- Whisper format: [{ id, start, end, text }]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(video_id) REFERENCES videos(id)
);

-- Audio peaks (detected silence + peaks)
CREATE TABLE audio_peaks (
  id INTEGER PRIMARY KEY,
  video_id INTEGER NOT NULL UNIQUE,
  peaks JSON,  -- [{ timestamp, intensity }]
  silence_regions JSON,  -- [{ start, end }]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(video_id) REFERENCES videos(id)
);

-- Render jobs
CREATE TABLE render_jobs (
  id INTEGER PRIMARY KEY,
  video_id INTEGER NOT NULL,
  preset_id INTEGER NOT NULL,
  enabled_hooks JSON,  -- List of hook indices to apply
  status TEXT DEFAULT 'queued',  -- queued, processing, completed, failed
  output_path TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY(video_id) REFERENCES videos(id),
  FOREIGN KEY(preset_id) REFERENCES vibe_presets(id)
);
```

**Key services:**
- `AuthService` — bcrypt, JWT generation
- `UserService` — CRUD for users
- `VideoService` — Upload, storage, metadata
- `TranscriptionService` — Whisper API calls
- `AudioAnalysisService` — Peak detection from audio
- `VibePresetService` — CRUD for presets
- `RenderQueueService` — AWS/Google Cloud job submission and polling

#### 3. **Vibe Preset Configuration Schema**

Each vibe preset is a JSON config stored in `vibe_presets.config`:

```json
{
  "name": "Global CEO",
  "description": "Minimalist, high-end white/black aesthetic",
  "colors": {
    "primary": "#000000",
    "secondary": "#FFFFFF",
    "accent": "#333333",
    "text": "#FFFFFF"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSize": "48px",
    "fontWeight": "700",
    "style": "Authority"
  },
  "effects": {
    "overlayType": "subtle-light-rays",
    "hookType": "macro-zoom-subtle",
    "transitionStyle": "fade",
    "particleIntensity": 0.2
  },
  "timing": {
    "hookDuration": 0.05,
    "hookEasing": "ease-out-cubic"
  }
}
```

**Three built-in templates:**

1. **Global CEO:**
   - Colors: Black/White/Gray
   - Font: Bold, sans-serif, "Authority"
   - Effects: Subtle light rays, macro zoom (1.05x)
   - Vibe: Corporate, minimalist

2. **Asli Khiladi:**
   - Colors: Red/Neon/Dark
   - Font: Bold, high contrast
   - Effects: Aggressive glitch, kinetic zoom (1.2x)
   - Vibe: High-energy, red-hot

3. **Distant Vision:**
   - Colors: Pastels/Ethereal blues
   - Font: Light, serif
   - Effects: Slow-motion, light particles
   - Vibe: Philosophical, dreamy

---

## MVP Scope (Phase 1)

### In Scope
✅ User registration + login (email/password, JWT)
✅ Video upload with file validation
✅ Whisper transcription (blocking during upload)
✅ Audio peak detection (basic FFT analysis)
✅ Three built-in vibe presets
✅ User-created custom presets (CRUD)
✅ Hook enable/disable UI
✅ Cloud render job submission (placeholder for AWS/Google)
✅ Render status polling
✅ Download rendered video

### Out of Scope (Phase 2+)
❌ Mobile app (React Native)
❌ Real cloud rendering (MVP uses mock)
❌ Advanced VFX overlays (pre-rendered assets)
❌ Social proof / beta group features
❌ Advanced analytics

---

## Technology Decisions

### Why Python FastAPI?
- Excellent async support for I/O-bound tasks (transcription, cloud polling)
- Native Whisper integration
- Easy audio processing with librosa
- Fast startup and deployment

### Why SQLite for MVP?
- Zero external dependencies
- Local development without Docker
- Easy to migrate to PostgreSQL later
- Sufficient for single-user testing

### Why AWS/Google Cloud (not local FFmpeg)?
- Rendering is CPU-intensive; offload to cloud
- Scalable for multiple users
- Avoid server resource bottlenecks
- Focus backend on orchestration, not rendering

### Why blocking transcription?
- User gets captions immediately
- Simpler UX (no async callbacks yet)
- Can be moved to background job in Phase 2

### Why JWT over session cookies?
- Stateless; easier to scale
- Works with mobile later
- Can be refreshed without server state

---

## Integration Points

### Frontend ↔ Backend
- All communication via REST API (FastAPI OpenAPI docs auto-generated)
- Video upload: multipart/form-data
- Status polling: JSON responses with job status and progress

### Backend ↔ Cloud
- AWS Lambda / Google Cloud Run (mocked in MVP)
- Job submission: HTTP POST to cloud endpoint
- Polling: GET status until `status === 'completed'`
- Output retrieval: Download from cloud storage or return download URL

### Whisper Integration
- OpenAI Whisper API or local model (depends on preference)
- Input: WAV audio extracted from video
- Output: Transcript + segment timestamps

### Audio Analysis
- librosa for peak detection
- Input: WAV audio
- Output: List of peak timestamps and intensity

---

## Known Constraints & Risks

### Security
- Password hashing must use bcrypt (not plaintext or weak hash)
- JWT secret must be strong and rotated in production
- File uploads must validate MIME type and size limits
- No sensitive data in logs (no passwords, tokens, file paths)
- CORS must be configured correctly (no `*` in production)

### Performance
- Video uploads can be large (100MB+); need progress bars
- Transcription is blocking; UI should show spinner
- Audio peak detection is fast (< 1s for typical video)
- Render polling: use exponential backoff to avoid hammering server

### Data Integrity
- Video file validation (codec, format, duration)
- Orphaned videos if render job fails (need cleanup job)
- Race condition: user deletes preset while render is in progress (check preset_id exists before rendering)

### Scalability Limits (MVP)
- SQLite is single-writer; will need PostgreSQL if > 10 concurrent users
- Local file storage; will need cloud storage if > 10GB of videos
- Blocking transcription; will bottleneck if > 2 concurrent uploads

