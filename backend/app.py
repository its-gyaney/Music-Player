from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Allow React frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev, allow all. Restrict in prod.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MUSIC_DIR = "C:\\Users\\dillu\\OneDrive\\Desktop\\Music Player 2\\music"  # <- Change this to your folder path

@app.get("/tracks")
def list_tracks():
    """List all MP3 files in the music directory"""
    return [f for f in os.listdir(MUSIC_DIR) if f.endswith(".mp3")]

@app.get("/play/{filename}")
def play_track(filename: str):
    """Stream a specific MP3 file"""
    file_path = os.path.join(MUSIC_DIR, filename)
    return FileResponse(file_path, media_type="audio/mpeg")
