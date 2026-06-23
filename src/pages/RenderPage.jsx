import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AudioWaveform } from '../components/Render/AudioWaveform';
import { HookEditor } from '../components/Render/HookEditor';
import { RenderProgress } from '../components/Render/RenderProgress';
import { videoService } from '../services/videoService';
import { renderService } from '../services/renderService';
import '../styles/render.css';

export function RenderPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedVibe = location.state?.selectedVibe;

  const [peaks, setPeaks] = useState([]);
  const [rendering, setRendering] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  const fetchVideoData = async () => {
    try {
      const videoData = await videoService.getVideo(videoId);
      setVideoInfo(videoData);

      const peaksData = await videoService.getAudioPeaks(videoId);
      setPeaks(peaksData.peaks || []);
    } catch (err) {
      setError('Failed to load video data');
    }
  };

  const handleRender = async (enabledHooks) => {
    if (!selectedVibe) {
      setError('No vibe selected');
      return;
    }

    setRendering(true);
    setError('');

    try {
      const response = await renderService.startRender(videoId, selectedVibe.id, enabledHooks);
      setJobId(response.job_id);
    } catch (err) {
      setError(err.message || 'Failed to start render');
      setRendering(false);
    }
  };

  if (rendering && jobId) {
    return (
      <div className="render-page">
        <header className="render-header">
          <button
            onClick={() => navigate('/upload')}
            className="btn-back-header"
          >
            <ArrowLeft size={20} /> Back
          </button>
        </header>
        <RenderProgress
          jobId={jobId}
          onDownload={(url) => setDownloadUrl(url)}
          onError={(err) => {
            setError(err);
            setRendering(false);
          }}
        />
        {downloadUrl && (
          <div className="download-section">
            <p>Your video is ready!</p>
            <a href={downloadUrl} download className="btn-download">
              Download Render
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="render-page">
      <header className="render-header">
        <button onClick={() => navigate('/upload')} className="btn-back-header">
          <ArrowLeft size={20} /> Back
        </button>
        <h1>Configure & Render</h1>
      </header>

      <main className="render-main">
        <div className="render-content">
          <section className="render-section vibe-summary">
            <h2>Selected Vibe</h2>
            {selectedVibe && (
              <div className="vibe-info">
                <h3>{selectedVibe.name}</h3>
                <p>{selectedVibe.description || 'Custom preset'}</p>
                <div
                  className="vibe-color-preview"
                  style={{
                    background: `linear-gradient(135deg, ${selectedVibe.config.colors.primary}, ${selectedVibe.config.colors.secondary})`,
                  }}
                />
              </div>
            )}
          </section>

          <section className="render-section waveform-section">
            <h2>Audio Peaks</h2>
            {videoInfo && (
              <p className="video-duration">
                Duration: {videoInfo.duration.toFixed(2)}s
              </p>
            )}
            <AudioWaveform peaks={peaks} enabledHooks={[]} />
          </section>

          <section className="render-section editor-section">
            <h2>Audio Hooks</h2>
            <HookEditor
              peaks={peaks}
              onApplyHooks={(enabledIndices) => handleRender(enabledIndices)}
            />
          </section>

          {error && <div className="error-banner">{error}</div>}
        </div>
      </main>
    </div>
  );
}
