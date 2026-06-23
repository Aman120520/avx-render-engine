# Problems & Caveats — Phase 1 Technical Foundation

**Plan:** Video VFX Engine: Phase 1 Technical Foundation
**File:** 02-problems-and-caveats.md
**Created:** 2026-04-25

---

## Security Risks & Mitigations

### 1. **Weak Password Validation**
**Risk:** Users create weak passwords; accounts easily compromised.
**Mitigation:**
- Enforce minimum 8 characters, mix of uppercase/lowercase/numbers
- Rate-limit login attempts (5 failures → 15-minute lockout)
- Hash passwords with bcrypt (cost factor 12)
- Add email verification flow (verify email before account is active)

**Status:** ✅ Addressed in auth service design

---

### 2. **JWT Token Leakage**
**Risk:** JWT stored in localStorage is accessible to XSS attacks; no expiration could allow indefinite access if token leaked.
**Mitigation:**
- Set JWT expiration to 1 hour
- Store refresh token in HTTP-only cookie (more secure)
- Implement refresh token rotation
- Add CORS whitelist (no `Access-Control-Allow-Origin: *`)

**Status:** ✅ Addressed in JWT strategy

---

### 3. **File Upload Validation**
**Risk:** Users upload malicious files (non-video, oversized, malformed).
**Mitigation:**
- Validate MIME type (must be `video/*`)
- Check file size (max 500MB for MVP)
- Use FFprobe to verify video codec and duration (reject if invalid)
- Store uploads in isolated directory outside web root
- Generate random filename (prevent path traversal)

**Status:** ✅ Addressed in upload service design

---

### 4. **SQL Injection (via SQLAlchemy ORM)**
**Risk:** Improper parameterization of database queries.
**Mitigation:**
- Always use SQLAlchemy ORM (never raw SQL strings)
- Never interpolate user input into queries
- Use prepared statements for complex queries

**Status:** ✅ Built into FastAPI + SQLAlchemy best practices

---

### 5. **CORS Misconfiguration**
**Risk:** Frontend at `localhost:5173` cannot communicate with backend at `localhost:8000` due to CORS policy.
**Mitigation:**
- Configure FastAPI CORS middleware:
  ```python
  from fastapi.middleware.cors import CORSMiddleware
  app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Dev only; use env var for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )
  ```
- Credentials (JWT) must be sent with `credentials: 'include'` in fetch()

**Status:** ✅ Addressed in FastAPI setup

---

### 6. **Sensitive Data in Logs**
**Risk:** Passwords, tokens, file paths logged to console/file.
**Mitigation:**
- Never log passwords, API keys, or JWTs
- Log structured data: `logger.info({ user_id, action }, "message")`
- Sanitize file paths (log relative paths only)
- Use log levels: `debug` for detailed, `info` for events, `warn` for issues, `error` for failures

**Status:** ⚠️ To be enforced in implementation

---

## Data Integrity Risks & Mitigations

### 7. **Orphaned Video Files**
**Risk:** If a render job fails, the uploaded video file is never deleted.
**Mitigation:**
- Add `created_at` timestamp to videos table
- Implement cron job: clean up videos with failed renders after 7 days
- Track file paths in database for deletion

**Status:** ⚠️ Phase 2 (add cleanup job after MVP render flow works)

---

### 8. **Preset Deletion During Render**
**Risk:** User deletes a vibe preset while a render job references it → foreign key error or render uses outdated config.
**Mitigation:**
- Check `preset_id` exists in `vibe_presets` before starting render
- Option A: Soft-delete presets (add `deleted_at` column, don't return in API)
- Option B: Prevent deletion if render jobs in progress
- Store preset config as JSON in `render_jobs.preset_config` (snapshot at render time)

**Status:** ⚠️ Use Option B for MVP; revisit in Phase 2

---

### 9. **Race Condition: Concurrent Uploads**
**Risk:** User uploads same video twice; two transcription jobs run simultaneously.
**Mitigation:**
- Use unique constraint on `videos(user_id, original_filename, created_at)` to detect fast re-uploads
- Or: Return error if same filename uploaded within 1 minute
- Or: Treat each upload as unique (simpler, allows re-uploads)

**Status:** ✅ Treat each upload as unique (simpler for MVP)

---

### 10. **Transcription Timeout**
**Risk:** Whisper API call hangs or takes > 30 seconds; user sees infinite spinner.
**Mitigation:**
- Set request timeout to 30 seconds
- Show timeout error message to user: "Transcription took too long. Try a shorter video."
- Add retry button (up to 2 retries)

**Status:** ⚠️ To be implemented in transcription service

---

### 11. **Database Consistency After Crash**
**Risk:** Backend crashes mid-transaction; database left in inconsistent state.
**Mitigation:**
- Use SQLAlchemy transactions for multi-step operations
- Example: Upload + transcribe + save metadata as one transaction
- Use SQLite `PRAGMA journal_mode = WAL` for better crash recovery

**Status:** ⚠️ To be enforced in implementation

---

## Performance & Scalability Limits

### 12. **SQLite Single-Writer Limitation**
**Risk:** If 2+ concurrent uploads happen, SQLite locks and one request times out.
**Mitigation:** (MVP → Phase 2)
- For MVP: Accept sequential uploads (warn user in UI)
- Phase 2: Migrate to PostgreSQL

**Status:** ⚠️ Known limitation; document in MVP release notes

---

### 13. **Blocking Transcription Bottleneck**
**Risk:** Transcription is slow (1-2 min for long video); user sees UI freeze.
**Mitigation:**
- Show real-time spinner: "Transcribing... 45%"
- Phase 2: Move to async background job (show "Processing in background" message)
- For MVP: Accept the wait (document that videos < 5 min are fastest)

**Status:** ⚠️ Known limitation; phase 2 improvement

---

### 14. **Local File Storage Limits**
**Risk:** Store 1000 videos locally; disk fills up.
**Mitigation:** (MVP → Phase 2)
- Document max storage: ~100GB on typical laptop
- Phase 2: Move to AWS S3 or Google Cloud Storage
- For MVP: Show disk usage warning in admin dashboard

**Status:** ⚠️ Known limitation; sufficient for beta testing

---

### 15. **Exponential Backoff for Polling**
**Risk:** Frontend polls `/api/render/{id}/status` every 1 second; hammers backend.
**Mitigation:**
- Implement exponential backoff: 1s, 2s, 4s, 8s (max 30s)
- Backend response includes estimated time until completion
- WebSocket (phase 2) for real-time updates instead of polling

**Status:** ⚠️ To be implemented in frontend

---

## Architecture & Design Risks

### 16. **Missing Audio Analysis Library**
**Risk:** No consensus on which library to use for peak detection (librosa vs. scipy vs. pydub).
**Mitigation:**
- Use librosa (mature, numpy-based, easy to install)
- Peak detection: scipy.signal.find_peaks on spectrogram
- Threshold: detect energy peaks > 80th percentile

**Status:** ✅ Decision made

---

### 17. **Cloud Render Service Not Yet Implemented**
**Risk:** Backend designed to call AWS Lambda / Google Cloud Run, but service doesn't exist.
**Mitigation:**
- For MVP: Mock cloud service (return fake rendered video path)
- Phase 2: Implement actual Lambda or Cloud Run function
- Create abstraction layer: `RenderService` interface (can swap implementations)

**Status:** ⚠️ Use mock for MVP; implement real cloud service in Phase 2

---

### 18. **VFX Overlays Not Pre-Rendered**
**Risk:** Plan assumes VFX overlays (liquid sims, light rays) exist as transparent video files, but they don't.
**Mitigation:**
- Phase 1: Use simple FFmpeg filters instead (glitch effects via video filters)
- Phase 2: Integrate pre-rendered overlay assets
- Store overlay configs in vibe preset (which filters to apply, intensity)

**Status:** ⚠️ Phase 1 uses simple FFmpeg filters; Phase 2 adds pre-rendered overlays

---

## Integration & Testing Risks

### 19. **Missing Test Database**
**Risk:** Tests and development use same SQLite database; test data pollutes dev data.
**Mitigation:**
- Create separate SQLite file for tests: `test.db`
- Use pytest with fixture that creates a fresh in-memory database per test
- Seed test data in setup fixtures

**Status:** ⚠️ To be implemented in test suite

---

### 20. **No Staging Environment**
**Risk:** Build feature locally, push to prod, breaks for users.
**Mitigation:** (Phase 2+)
- For MVP: Only deploy to prod after manual testing
- Phase 2: Add staging environment on cloud
- Phase 3: Add CI/CD pipeline

**Status:** ⚠️ MVP limitation; add in Phase 2

---

## Known Unknowns & Decisions Pending

### 21. **Whisper API vs. Local Model**
**Question:** Use OpenAI Whisper API (requires API key, costs $$) or run local model?
**Decision:** Defer to implementation phase; abstract behind `TranscriptionService` so either can be plugged in.
**Impact:** If Whisper API is down, transcription fails; local model is slower but reliable.

**Status:** 🟡 Decision pending; both architectures supported

---

### 22. **VFX Overlay Storage**
**Question:** Where to store pre-rendered overlay assets (video files, textures)?
**Decision:** MVP uses FFmpeg filters; Phase 2 will store as file assets in `assets/overlays/`.
**Impact:** Phase 2 must design asset versioning and loading.

**Status:** 🟡 Deferred to Phase 2

---

### 23. **User Quota System**
**Question:** Should users have limits (e.g., 5 free renders/month, then paid)?
**Decision:** MVP has no limits; Phase 2 adds quota system.
**Impact:** Users could spam renders; monitor for abuse.

**Status:** 🟡 Deferred to Phase 2

---

## Dependency Checklist

Before starting implementation, verify:

- [ ] Python 3.10+ installed
- [ ] ffmpeg and ffprobe available in PATH (check: `ffmpeg -version`)
- [ ] FastAPI and SQLAlchemy installation working
- [ ] Whisper API key or local model download (decision pending)
- [ ] Node.js / npm for frontend development
- [ ] VSCode / IDE with Python extensions

