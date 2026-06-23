from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import DATABASE_URL
from database import init_db
from routes.auth_routes import router as auth_router
from routes.video_routes import router as video_router
from routes.transcription_routes import router as transcription_router
from routes.preset_routes import router as preset_router
from routes.render_routes import router as render_router

app = FastAPI(title="AVX Render Engine API", version="0.1.0")

# CORS configuration for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(video_router)
app.include_router(transcription_router)
app.include_router(preset_router)
app.include_router(render_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.on_event("startup")
async def startup_event():
    init_db()
    print(f"Starting AVX Render Engine - Database: {DATABASE_URL}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
