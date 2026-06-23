import subprocess
import json
from pathlib import Path
from config import WHISPER_API_KEY
from services.audio_service import extract_audio

def transcribe_video(video_path: str) -> dict:
    try:
        audio_path = extract_audio(video_path)

        result = subprocess.run(
            [
                "whisper",
                audio_path,
                "--output_format", "json",
                "--output_dir", ".",
                "--language", "en",
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )

        if result.returncode != 0:
            raise Exception(f"Whisper failed: {result.stderr}")

        json_path = Path(audio_path).stem + ".json"
        with open(json_path, "r") as f:
            whisper_output = json.load(f)

        segments = [
            {
                "id": seg.get("id", idx),
                "start": seg["start"],
                "end": seg["end"],
                "text": seg["text"],
            }
            for idx, seg in enumerate(whisper_output.get("segments", []))
        ]

        text = whisper_output.get("text", "")

        Path(json_path).unlink(missing_ok=True)
        Path(audio_path).unlink(missing_ok=True)

        return {"text": text, "segments": segments}
    except subprocess.TimeoutExpired:
        raise Exception("Transcription timed out after 30 seconds")
    except Exception as e:
        raise Exception(f"Transcription failed: {str(e)}")
