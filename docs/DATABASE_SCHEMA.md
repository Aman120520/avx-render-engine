# Database Schema

SQLite database with the following tables and relationships:

## Entity Relationship Diagram

```
┌─────────────┐
│   Users     │
├─────────────┤
│ id (PK)     │
│ email       │
│ password    │
│ created_at  │
└────────┬────┘
         │ 1:N
         │
    ┌────▼────────────┐
    │    Videos       │
    ├─────────────────┤
    │ id (PK)         │
    │ user_id (FK)    │
    │ filename        │
    │ duration        │
    │ width/height    │
    │ file_path       │
    │ created_at      │
    └────┬─────┬──────┘
         │     │ 1:1
         │     │
    ┌────▼──┐  └─────────────────────┐
    │Transcr│                        │
    │iptions│                        │
    ├───────┤               ┌────────▼────────┐
    │id(PK) │               │  AudioPeaks     │
    │video_ │               ├─────────────────┤
    │id(FK) │               │ id (PK)         │
    │text   │               │ video_id (FK)   │
    │segs   │               │ peaks_json      │
    │lang   │               │ created_at      │
    └───────┘               └─────────────────┘
    
    ┌──────────────────┐
    │   VibePresets    │
    ├──────────────────┤
    │ id (PK)          │
    │ name             │
    │ description      │
    │ config_json      │
    │ is_builtin       │
    │ user_id (FK)*    │
    │ created_at       │
    └────────┬─────────┘
             │ 1:N
             │
    ┌────────▼────────────┐
    │  RenderJobs         │
    ├─────────────────────┤
    │ id (PK)             │
    │ video_id (FK)       │
    │ preset_id (FK)      │
    │ user_id (FK)        │
    │ enabled_hooks_json  │
    │ status              │
    │ progress            │
    │ output_path         │
    │ error_message       │
    │ created_at          │
    └─────────────────────┘

* user_id is NULL for built-in presets, required for custom presets
```

## Tables

### Users

Stores user account information with secure password hashing.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 |
| `email` | TEXT | UNIQUE NOT NULL | Email format validated |
| `password` | TEXT | NOT NULL | Bcrypt hash (cost 12) |
| `created_at` | DATETIME | NOT NULL | ISO 8601 timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE on `email`

---

### VibePresets

Stores vibe preset configurations for video rendering.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 |
| `name` | TEXT | NOT NULL | Preset display name |
| `description` | TEXT | NULL | Optional description |
| `config` | JSON | NOT NULL | Colors, fonts, effects |
| `is_builtin` | BOOLEAN | NOT NULL | True for 3 defaults |
| `user_id` | TEXT | FOREIGN KEY | NULL for built-in |
| `created_at` | DATETIME | NOT NULL | ISO 8601 timestamp |

**Built-in Presets:**
1. Global CEO: Minimalist black/white
2. Asli Khiladi: Red/neon high-energy
3. Distant Vision: Ethereal pastels

**Foreign Keys:**
- `user_id` → `Users.id` (ON DELETE CASCADE, optional)

---

### Videos

Stores uploaded video metadata.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 |
| `user_id` | TEXT | FOREIGN KEY NOT NULL | Owner of video |
| `filename` | TEXT | NOT NULL | Original filename |
| `duration` | FLOAT | NOT NULL | Seconds |
| `width` | INTEGER | NOT NULL | Video width (px) |
| `height` | INTEGER | NOT NULL | Video height (px) |
| `file_path` | TEXT | NOT NULL | Local filesystem path |
| `size_mb` | FLOAT | NOT NULL | File size in MB |
| `created_at` | DATETIME | NOT NULL | ISO 8601 timestamp |

**Foreign Keys:**
- `user_id` → `Users.id` (ON DELETE CASCADE)

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `user_id`

---

### Transcriptions

Stores AI-generated transcriptions with segment data.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 |
| `video_id` | TEXT | FOREIGN KEY UNIQUE NOT NULL | One per video |
| `text` | TEXT | NOT NULL | Full transcription |
| `segments` | JSON | NOT NULL | Array of {start, end, text} |
| `language` | TEXT | NOT NULL | Detected language (e.g., "en") |
| `created_at` | DATETIME | NOT NULL | ISO 8601 timestamp |

**Foreign Keys:**
- `video_id` → `Videos.id` (ON DELETE CASCADE)

**Segment Schema:**
```json
{
  "start": 0.0,
  "end": 2.5,
  "text": "segment text"
}
```

---

### AudioPeaks

Stores detected audio peak timestamps and intensities.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 |
| `video_id` | TEXT | FOREIGN KEY UNIQUE NOT NULL | One per video |
| `peaks` | JSON | NOT NULL | Array of {timestamp, intensity} |
| `created_at` | DATETIME | NOT NULL | ISO 8601 timestamp |

**Foreign Keys:**
- `video_id` → `Videos.id` (ON DELETE CASCADE)

**Peak Schema:**
```json
{
  "timestamp": 5.2,
  "intensity": 0.85
}
```

**Detection Algorithm:**
- Librosa: Detect peaks at 80th percentile of audio energy
- Intensity normalized to 0-1 range
- Used for audio hook triggers

---

### RenderJobs

Stores video rendering job history and progress.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 |
| `video_id` | TEXT | FOREIGN KEY NOT NULL | Video being rendered |
| `preset_id` | TEXT | FOREIGN KEY NOT NULL | Vibe preset used |
| `user_id` | TEXT | FOREIGN KEY NOT NULL | Job owner |
| `enabled_hooks` | JSON | NOT NULL | Array of peak indices |
| `status` | TEXT | NOT NULL | queued, processing, completed, failed |
| `progress` | INTEGER | NOT NULL | 0-100 percentage |
| `output_path` | TEXT | NULL | Path to rendered video |
| `error_message` | TEXT | NULL | Error description if failed |
| `created_at` | DATETIME | NOT NULL | ISO 8601 timestamp |

**Foreign Keys:**
- `video_id` → `Videos.id` (ON DELETE CASCADE)
- `preset_id` → `VibePresets.id` (ON DELETE RESTRICT)
- `user_id` → `Users.id` (ON DELETE CASCADE)

**Status Flow:**
1. `queued` → Initial state when render starts
2. `processing` → Job picked up by renderer
3. `completed` → Render succeeded, output_path set
4. `failed` → Render failed, error_message set

---

## Constraints & Rules

### Primary Keys
- All tables use UUID v4 as primary key
- Ensures globally unique IDs across instances

### Foreign Keys
- `Videos.user_id` → `Users.id` (CASCADE on delete)
- `VibePresets.user_id` → `Users.id` (CASCADE on delete, optional)
- `Transcriptions.video_id` → `Videos.id` (CASCADE on delete)
- `AudioPeaks.video_id` → `Videos.id` (CASCADE on delete)
- `RenderJobs.video_id` → `Videos.id` (CASCADE on delete)
- `RenderJobs.preset_id` → `VibePresets.id` (RESTRICT on delete)
- `RenderJobs.user_id` → `Users.id` (CASCADE on delete)

### Unique Constraints
- `Users.email` - One account per email
- `Transcriptions.video_id` - One transcription per video
- `AudioPeaks.video_id` - One peak set per video

### Data Validation
- Email format validated at application layer
- Password: Bcrypt hash (minimum 60 characters)
- Duration, width, height, size_mb: Positive numbers
- Progress: 0-100 integer
- Status: Enum (queued, processing, completed, failed)

---

## Indexes

For performance optimization:

```sql
-- Users
CREATE UNIQUE INDEX idx_users_email ON Users(email);

-- Videos
CREATE INDEX idx_videos_user_id ON Videos(user_id);
CREATE INDEX idx_videos_created_at ON Videos(created_at DESC);

-- VibePresets
CREATE INDEX idx_vibepresets_user_id ON VibePresets(user_id);
CREATE INDEX idx_vibepresets_is_builtin ON VibePresets(is_builtin);

-- RenderJobs
CREATE INDEX idx_renderjobs_user_id ON RenderJobs(user_id);
CREATE INDEX idx_renderjobs_status ON RenderJobs(status);
CREATE INDEX idx_renderjobs_created_at ON RenderJobs(created_at DESC);
```

---

## Migrations (Future)

When moving to PostgreSQL (Phase 2), ensure:
- UUID type with `uuid-ossp` extension
- JSON → JSONB for better indexing
- Add sequence for render job queuing
- Add partition by date for large tables

---

## Backup & Recovery

**Daily backups:**
```bash
sqlite3 app.db ".dump" > backup.sql
```

**Restore:**
```bash
sqlite3 app.db < backup.sql
```

For production, use automated backup solutions (AWS RDS, etc.).
