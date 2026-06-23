import subprocess
from pathlib import Path
import librosa
import numpy as np

def extract_audio(video_path: str) -> str:
    audio_path = Path(video_path).stem + "_audio.wav"
    try:
        subprocess.run(
            [
                "ffmpeg",
                "-i", video_path,
                "-q:a", "9",
                "-n",
                audio_path,
            ],
            capture_output=True,
            timeout=60,
        )
        return audio_path
    except Exception as e:
        raise Exception(f"Failed to extract audio: {str(e)}")

def detect_peaks(audio_path: str) -> dict:
    try:
        y, sr = librosa.load(audio_path, sr=None)
        S = librosa.feature.melspectrogram(y=y, sr=sr)
        energy = np.mean(librosa.power_to_db(S, ref=np.max), axis=0)

        threshold = np.percentile(energy, 80)
        peaks = librosa.util.peak_pick(energy, pre_max=3, post_max=3, pre_avg=3, post_avg=3, delta=threshold * 0.1, wait=10)

        frame_length = len(y) / len(energy)
        timestamps = (peaks * frame_length / sr)

        peak_data = [
            {
                "timestamp": float(ts),
                "intensity": float((energy[peak] - energy.min()) / (energy.max() - energy.min())),
            }
            for peak, ts in zip(peaks, timestamps)
        ]

        return {"peaks": peak_data}
    except Exception as e:
        raise Exception(f"Failed to detect peaks: {str(e)}")
