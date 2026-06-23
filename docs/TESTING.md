# Testing Guide

## Manual Testing Checklist

Complete this checklist to verify all features work end-to-end on localhost.

### Setup

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Browser DevTools open (F12) with Console visible
- [ ] No errors in backend terminal or browser console before starting

---

## User Authentication Flow

### Register New Account

**Steps:**
1. [ ] Navigate to http://localhost:5173/register
2. [ ] Enter email: `testuser@example.com`
3. [ ] Enter password: `SecurePassword123!`
4. [ ] Confirm password (same)
5. [ ] Click "Register"

**Expected Results:**
- [ ] Redirected to `/upload` page (already authenticated)
- [ ] JWT token stored in localStorage
- [ ] No console errors
- [ ] No backend errors

**Verify via DevTools:**
```javascript
console.log(localStorage.getItem('auth_token'))  // Should show token
console.log(localStorage.getItem('user_id'))      // Should show UUID
```

---

### Login with Existing Account

**Steps:**
1. [ ] Logout (click logout button in dashboard/upload header)
2. [ ] Navigate to http://localhost:5173/login
3. [ ] Enter email: `testuser@example.com`
4. [ ] Enter password: `SecurePassword123!`
5. [ ] Click "Login"

**Expected Results:**
- [ ] Redirected to `/upload` page
- [ ] JWT token refreshed in localStorage
- [ ] No console errors

---

### Invalid Credentials

**Steps:**
1. [ ] Go to login page
2. [ ] Enter correct email, wrong password
3. [ ] Click "Login"

**Expected Results:**
- [ ] Error message: "Invalid credentials"
- [ ] Not redirected (stays on login)
- [ ] No token stored

---

### Token Expiration

**Steps:**
1. [ ] Login successfully
2. [ ] Note the token expiration time (1 hour from login)
3. [ ] Make an API call after expiration (or manually set token to invalid)

**Expected Results:**
- [ ] 401 Unauthorized response
- [ ] Redirected to `/login` page
- [ ] localStorage cleared

---

## Video Upload Flow

### Successful Upload

**Steps:**
1. [ ] Login and navigate to `/upload`
2. [ ] Select video file (test-video.mp4, <500MB, MP4/MOV/WebM)
3. [ ] Verify file info displayed (filename, size)
4. [ ] Click "Next"
5. [ ] See "Step 2 of 2" - Vibe Selection
6. [ ] Select a vibe (e.g., "Global CEO")
7. [ ] Click "Render Video"

**Expected Results:**
- [ ] File validated (no error for valid video types)
- [ ] Transcription starts (Loading indicator appears)
- [ ] Peaks detected (List of timestamps appears)
- [ ] Redirected to `/render/:videoId` page
- [ ] No console errors
- [ ] Backend logs show: upload, transcription, peaks detection

**Backend Verification:**
```bash
# Check app.db has new video
sqlite3 backend/app.db "SELECT id, filename, duration FROM Videos LIMIT 1;"
```

---

### Invalid File Type

**Steps:**
1. [ ] Navigate to `/upload`
2. [ ] Select a non-video file (image.jpg, document.pdf, etc.)
3. [ ] Try to proceed

**Expected Results:**
- [ ] Error message: "Invalid file type. Supported: MP4, MOV, MPEG, WebM"
- [ ] Cannot proceed to next step

---

### File Too Large

**Steps:**
1. [ ] Attempt to upload file > 500MB

**Expected Results:**
- [ ] Error message: "File too large. Maximum: 500MB"
- [ ] Upload rejected

---

## Render Configuration & Execution

### Hook Selection

**From `/render/:videoId` page:**

**Steps:**
1. [ ] See waveform visualization of audio peaks
2. [ ] See hook editor with list of detected peaks
3. [ ] Toggle checkboxes to enable/disable hooks
4. [ ] Verify selected count updates ("X selected")

**Expected Results:**
- [ ] Peaks display as vertical bars with timestamps
- [ ] Hover shows timestamp and intensity
- [ ] Enabled peaks highlighted (different color)
- [ ] Counter updates in real-time

---

### Render Start

**Steps:**
1. [ ] With 2-3 hooks enabled, click "Apply Hooks"

**Expected Results:**
- [ ] Submit request with preset_id + enabled_hooks array
- [ ] Redirected to progress view
- [ ] RenderProgress component shows spinner
- [ ] Status text shows "Waiting to process..."

**Verify Request (DevTools > Network):**
```
POST /api/render/[video_id]
Body: {"preset_id": "[uuid]", "enabled_hooks": [0, 2]}
Response: {"job_id": "[uuid]", "status": "queued", "progress": 0}
```

---

### Polling & Progress

**Steps:**
1. [ ] Watch RenderProgress component for 5+ seconds
2. [ ] Observe status changes: "Waiting..." → "Processing..."
3. [ ] Progress percentage increases from 0% to 100%

**Expected Results:**
- [ ] Requests to `/api/render/[job_id]/status` every 1-4 seconds
- [ ] Poll interval increases exponentially (backoff)
- [ ] No request spam (max 30s interval)
- [ ] No console errors

**Verify Polling (DevTools > Network):**
- Filter by `/render/` requests
- Observe intervals: ~1s, ~2s, ~4s, etc.
- Cap at 30s max

---

### Render Completion

**Steps:**
1. [ ] Wait for progress to reach 100%
2. [ ] Status changes to "Completed"
3. [ ] Download button appears

**Expected Results:**
- [ ] Download button visible with link to output file
- [ ] File path shown (e.g., `/downloads/render-[id].mp4`)
- [ ] Clicking download initiates file download
- [ ] No errors in console

**Verify Response:**
```json
{
  "job_id": "[uuid]",
  "status": "completed",
  "progress": 100,
  "output_path": "/downloads/render-[id].mp4"
}
```

---

### Render Failure

**Steps:**
1. [ ] Start a render job
2. [ ] Manually break it (e.g., restart backend with error)
3. [ ] Observe error handling

**Expected Results:**
- [ ] Error message displayed: "Rendering Failed"
- [ ] Error details shown
- [ ] "Try Again" button available
- [ ] Can restart or go back to upload

---

## Preset Management

### View Presets

**Steps:**
1. [ ] Navigate to `/dashboard`
2. [ ] Click "Presets" tab

**Expected Results:**
- [ ] Built-in presets visible (Global CEO, Asli Khiladi, Distant Vision)
- [ ] Each shows color preview and description
- [ ] "New Preset" button visible
- [ ] Custom presets section empty (initially)

---

### Create Custom Preset

**Steps:**
1. [ ] Click "New Preset"
2. [ ] Enter name: "My Vibe"
3. [ ] Enter description: "Test preset"
4. [ ] Pick primary color (color picker)
5. [ ] Pick secondary color
6. [ ] Adjust intensity slider (0-100)
7. [ ] Click "Create Preset"

**Expected Results:**
- [ ] Form submitted
- [ ] Preset added to custom presets list
- [ ] New preset appears as card
- [ ] Form resets
- [ ] No console errors

**Verify in Database:**
```bash
sqlite3 backend/app.db "SELECT name, is_builtin FROM VibePresets WHERE name='My Vibe';"
# Should show: My Vibe|0
```

---

### Edit Custom Preset

**Steps:**
1. [ ] On custom preset card, click edit icon
2. [ ] Change name to "My Vibe Updated"
3. [ ] Change color
4. [ ] Click "Update Preset"

**Expected Results:**
- [ ] Preset updated in list
- [ ] Changes visible immediately
- [ ] Form resets after update

---

### Delete Custom Preset

**Steps:**
1. [ ] On custom preset card, click delete icon
2. [ ] Confirm deletion in modal

**Expected Results:**
- [ ] Preset removed from list
- [ ] Confirmation modal closes
- [ ] No console errors

---

## Dashboard & Render History

### View Past Renders

**Steps:**
1. [ ] Navigate to `/dashboard`
2. [ ] Click "Renders" tab

**Expected Results:**
- [ ] Table shows past renders with columns:
  - Filename
  - Vibe used
  - Date created
  - Status (completed/failed)
  - Actions (download/delete)
- [ ] Renders listed in reverse chronological order
- [ ] Status badge colors: green (completed), red (failed)

---

### Download Completed Render

**Steps:**
1. [ ] In Renders table, find completed render
2. [ ] Click download button (green arrow icon)

**Expected Results:**
- [ ] File downloads to machine
- [ ] Filename matches render ID
- [ ] No 404 errors

---

### Delete Render

**Steps:**
1. [ ] In Renders table, click delete icon (trash)
2. [ ] Confirm in modal

**Expected Results:**
- [ ] Render removed from table
- [ ] Database updated
- [ ] No lingering files (Phase 2 improvement)

---

## Error Scenarios

### Network Errors

**Steps:**
1. [ ] Start render
2. [ ] Stop backend while rendering
3. [ ] Observe frontend behavior

**Expected Results:**
- [ ] Error message shown: "Connection failed"
- [ ] No infinite loading
- [ ] Retry option available

---

### Invalid JWT Token

**Steps:**
1. [ ] Manually corrupt JWT in localStorage
2. [ ] Make any API call
3. [ ] Observe response

**Expected Results:**
- [ ] 401 Unauthorized received
- [ ] Redirected to login
- [ ] localStorage cleared
- [ ] Token removed

---

### Database Issues

**Steps:**
1. [ ] Delete `app.db` file
2. [ ] Attempt upload

**Expected Results:**
- [ ] Backend initializes new database
- [ ] Upload works normally
- [ ] No "database corrupted" error

---

## Browser Compatibility

Test with:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest on macOS)
- [ ] Edge (latest on Windows)

**Verify:**
- [ ] All buttons responsive
- [ ] Drag-drop works
- [ ] Modals render correctly
- [ ] No layout issues
- [ ] No JavaScript errors

---

## Mobile Responsiveness

**Steps:**
1. [ ] Open in DevTools (F12)
2. [ ] Select iPhone SE or similar (375px width)
3. [ ] Test each page

**Pages to verify:**
- [ ] `/login` - Form fits screen
- [ ] `/register` - Form fits screen
- [ ] `/upload` - Drag-drop area visible, file info clear
- [ ] `/render/:id` - Waveform scrollable, editor usable
- [ ] `/dashboard` - Table scrollable, buttons accessible

**Expected Results:**
- [ ] No horizontal scrolling needed
- [ ] Touch-friendly button sizes (48px+)
- [ ] Text readable without zoom
- [ ] Modals fit viewport

---

## Performance Checks

### Initial Page Load

**Steps:**
1. [ ] Open DevTools > Performance
2. [ ] Reload page
3. [ ] Record timeline
4. [ ] Stop after page interactive

**Expected:**
- [ ] Page interactive in < 3 seconds
- [ ] No janky animations
- [ ] No layout thrashing

---

### API Response Times

**Steps:**
1. [ ] DevTools > Network
2. [ ] Reload and monitor requests

**Expected (on localhost):**
- [ ] Login: < 100ms
- [ ] Upload: < 5s (includes transcription)
- [ ] Poll status: < 100ms
- [ ] Get presets: < 50ms

---

### Memory Leaks

**Steps:**
1. [ ] DevTools > Memory
2. [ ] Take heap snapshot
3. [ ] Interact with app for 5 min
4. [ ] Take another heap snapshot
5. [ ] Compare sizes

**Expected:**
- [ ] Heap size stable or slightly increased
- [ ] No dramatic spikes
- [ ] No detached DOM nodes growing

---

## Final Verification Checklist

- [ ] All tests above passed
- [ ] No console errors (red X's)
- [ ] No backend errors in terminal
- [ ] API responses match API.md documentation
- [ ] Database has test data
- [ ] Can register → login → upload → render → download → delete
- [ ] All UI elements responsive
- [ ] No performance issues detected

---

## Known Limitations (Phase 1)

- ⚠️ Transcription is blocking (video upload waits for Whisper API)
- ⚠️ Mock cloud rendering (no real video processing, always succeeds)
- ⚠️ SQLite single-writer (not suitable for concurrent uploads)
- ⚠️ No email notifications
- ⚠️ No cleanup of orphaned files on deletion

These will be addressed in Phase 2.

---

## Reporting Issues

If tests fail, check:
1. Backend `.env` has correct API keys
2. Both services running on correct ports
3. Database initialized (`app.db` exists)
4. No firewall blocking localhost traffic
5. Browser DevTools Console for specific errors

If still stuck, check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section.
