# API Reference

## Base URL

```
http://localhost:8000/api
```

All endpoints use JSON for request and response bodies. Timestamps are in ISO 8601 format.

## Authentication

Most endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

The token is obtained via `/auth/login` and expires after 1 hour.

## Auth Endpoints

### POST /auth/register

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "User created successfully"
}
```

**Errors:**
- 400: Invalid email or password format
- 409: Email already registered

---

### POST /auth/login

Authenticate and receive a JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Login successful"
}
```

**Errors:**
- 400: Invalid credentials
- 429: Too many failed attempts (15 min lockout after 5 failures)

---

### POST /auth/verify

Verify current token validity.

**Response (200):**
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "valid": true
}
```

**Errors:**
- 401: Invalid or expired token

---

## Video Endpoints

### POST /videos/upload

Upload a video file. Requires multipart/form-data.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (required): Video file (MP4, MOV, MPEG, WebM; max 500MB)
- `preset_id` (required): UUID of selected vibe preset

**Response (201):**
```json
{
  "video_id": "uuid",
  "filename": "my-video.mp4",
  "duration": 45.3,
  "width": 1920,
  "height": 1080,
  "size_mb": 125.4
}
```

**Errors:**
- 400: Invalid file type or size exceeds limit
- 401: Unauthorized
- 413: Payload too large

---

### GET /videos

List all videos for current user.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "filename": "video1.mp4",
    "duration": 45.3,
    "created_at": "2024-04-25T10:30:00Z",
    "status": "completed",
    "vibe_name": "Global CEO"
  },
  {
    "id": "uuid2",
    "filename": "video2.mp4",
    "duration": 60.0,
    "created_at": "2024-04-25T11:00:00Z",
    "status": "failed",
    "vibe_name": "Asli Khiladi"
  }
]
```

**Errors:**
- 401: Unauthorized

---

### GET /videos/{video_id}

Get metadata for a specific video.

**Response (200):**
```json
{
  "id": "uuid",
  "filename": "my-video.mp4",
  "duration": 45.3,
  "width": 1920,
  "height": 1080,
  "created_at": "2024-04-25T10:30:00Z",
  "transcription_status": "completed",
  "peaks_status": "completed"
}
```

**Errors:**
- 401: Unauthorized
- 404: Video not found

---

### DELETE /videos/{video_id}

Delete a video and associated data.

**Response (200):**
```json
{
  "message": "Video deleted successfully"
}
```

**Errors:**
- 401: Unauthorized
- 404: Video not found

---

## Transcription Endpoints

### GET /transcription/{video_id}

Get transcription for a video.

**Response (200):**
```json
{
  "video_id": "uuid",
  "text": "Hello world, this is a test transcription...",
  "segments": [
    {
      "start": 0.0,
      "end": 2.5,
      "text": "Hello world"
    },
    {
      "start": 2.5,
      "end": 6.0,
      "text": "this is a test transcription"
    }
  ],
  "language": "en",
  "created_at": "2024-04-25T10:35:00Z"
}
```

**Errors:**
- 401: Unauthorized
- 404: Video or transcription not found

---

## Audio Peaks Endpoints

### GET /hooks/{video_id}

Get detected audio peaks for a video.

**Response (200):**
```json
{
  "video_id": "uuid",
  "peaks": [
    {
      "timestamp": 5.2,
      "intensity": 0.85
    },
    {
      "timestamp": 12.1,
      "intensity": 0.72
    },
    {
      "timestamp": 18.5,
      "intensity": 0.91
    }
  ],
  "detected_at": "2024-04-25T10:36:00Z"
}
```

**Errors:**
- 401: Unauthorized
- 404: Video or peaks not found

---

## Preset Endpoints

### GET /presets

Get all available presets (built-in and user's custom).

**Response (200):**
```json
{
  "built_in": [
    {
      "id": "uuid",
      "name": "Global CEO",
      "description": "Minimalist black and white aesthetic",
      "is_builtin": true,
      "config": {
        "colors": {
          "primary": "#000000",
          "secondary": "#ffffff"
        },
        "typography": {
          "fontFamily": "Arial",
          "fontSize": "16px"
        },
        "effects": {
          "intensity": 100,
          "duration": 2000
        }
      }
    }
  ],
  "custom": [
    {
      "id": "uuid",
      "name": "My Custom Vibe",
      "description": "Custom preset I created",
      "is_builtin": false,
      "config": { }
    }
  ]
}
```

**Errors:**
- 401: Unauthorized

---

### POST /presets

Create a new custom preset.

**Request:**
```json
{
  "name": "My Custom Vibe",
  "description": "Custom preset description",
  "config": {
    "colors": {
      "primary": "#667eea",
      "secondary": "#764ba2"
    },
    "typography": {
      "fontFamily": "Arial",
      "fontSize": "16px"
    },
    "effects": {
      "intensity": 100,
      "duration": 2000
    }
  }
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "My Custom Vibe",
  "description": "Custom preset description",
  "is_builtin": false,
  "config": { }
}
```

**Errors:**
- 400: Invalid request body
- 401: Unauthorized

---

### PUT /presets/{preset_id}

Update an existing custom preset.

**Request:** (same as POST /presets)

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Updated Vibe",
  "description": "Updated description",
  "is_builtin": false,
  "config": { }
}
```

**Errors:**
- 400: Invalid request body
- 401: Unauthorized
- 403: Cannot modify built-in presets
- 404: Preset not found

---

### DELETE /presets/{preset_id}

Delete a custom preset.

**Response (200):**
```json
{
  "message": "Preset deleted successfully"
}
```

**Errors:**
- 401: Unauthorized
- 403: Cannot delete built-in presets
- 404: Preset not found

---

## Render Endpoints

### POST /render/{video_id}

Start a render job for a video with selected preset and hooks.

**Request:**
```json
{
  "preset_id": "uuid",
  "enabled_hooks": [0, 2, 4]
}
```

**Response (201):**
```json
{
  "job_id": "uuid",
  "video_id": "uuid",
  "preset_id": "uuid",
  "enabled_hooks": [0, 2, 4],
  "status": "queued",
  "progress": 0,
  "created_at": "2024-04-25T10:40:00Z"
}
```

**Errors:**
- 400: Invalid preset_id or enabled_hooks
- 401: Unauthorized
- 404: Video not found

---

### GET /render/{job_id}/status

Poll the status of a render job.

**Response (200):**
```json
{
  "job_id": "uuid",
  "status": "processing",
  "progress": 45,
  "message": "Processing frame 450 of 1000"
}
```

When completed:
```json
{
  "job_id": "uuid",
  "status": "completed",
  "progress": 100,
  "output_path": "/downloads/rendered-video-uuid.mp4"
}
```

When failed:
```json
{
  "job_id": "uuid",
  "status": "failed",
  "error_message": "Rendering failed: codec not supported"
}
```

**Errors:**
- 401: Unauthorized
- 404: Job not found

---

## Error Response Format

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong",
  "status_code": 400
}
```

### Common Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request format or parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but not permitted to access resource
- `404 Not Found` - Resource does not exist
- `409 Conflict` - Resource conflict (e.g., email already exists)
- `413 Payload Too Large` - File exceeds size limit
- `429 Too Many Requests` - Rate limited (auth lockout)
- `500 Internal Server Error` - Server error

---

## Rate Limiting

**Auth endpoints:**
- 5 failed login attempts → 15 minute lockout

**File uploads:**
- Maximum 500MB per file

**Polling:**
- Recommended: start at 1000ms, use exponential backoff (2^(count/3)), cap at 30000ms

---

## Data Types

**UUID:** String in format `550e8400-e29b-41d4-a716-446655440000`

**Timestamp:** ISO 8601 format `2024-04-25T10:30:00Z`

**Email:** Valid email address format

**Password:** Minimum 8 characters (Phase 1 MVP; Phase 2 will add complexity requirements)
