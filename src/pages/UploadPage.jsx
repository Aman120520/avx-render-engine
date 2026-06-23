import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadForm } from '../components/Upload/UploadForm';
import { VibeSelector } from '../components/Upload/VibeSelector';
import { videoService } from '../services/videoService';
import { renderService } from '../services/renderService';
import { useAuth } from '../hooks/useAuth';
import '../styles/upload.css';

export function UploadPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVibes();
  }, []);

  const fetchVibes = async () => {
    try {
      const data = await renderService.getPresets();
      const allVibes = [...(data.built_in || []), ...(data.custom || [])];
      setVibes(allVibes);
      const defaultVibe = allVibes.find(v => v.is_builtin);
      setSelectedVibe(defaultVibe);
    } catch (err) {
      console.error('Failed to fetch vibes:', err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedVibe) return;

    setLoading(true);
    setError('');

    try {
      const uploadResponse = await videoService.uploadVideo(selectedFile, selectedVibe.id);
      const videoId = uploadResponse.video_id;

      await videoService.getTranscription(videoId);
      await videoService.getAudioPeaks(videoId);

      navigate(`/render/${videoId}`, { state: { selectedVibe } });
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <header className="upload-header">
        <div className="header-content">
          <h1>Create Rendered Video</h1>
          <p className="step-indicator">Step {step} of 2</p>
        </div>
        <button onClick={() => logout()} className="btn-logout">
          Logout
        </button>
      </header>

      <main className="upload-main">
        {step === 1 && (
          <div className="upload-step">
            <h2>Upload Your Video</h2>
            <UploadForm
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!selectedFile || loading}
              className="btn-next"
            >
              {loading ? 'Processing...' : 'Next'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="vibe-step">
            <h2>Select Your Vibe</h2>
            <VibeSelector
              vibes={vibes}
              selectedVibe={selectedVibe}
              onSelect={setSelectedVibe}
              isLoading={loading}
            />
            {error && <div className="error-message">{error}</div>}
            <div className="step-actions">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="btn-back"
              >
                Back
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedVibe || loading}
                className="btn-upload"
              >
                {loading ? 'Uploading & Transcribing...' : 'Render Video'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
