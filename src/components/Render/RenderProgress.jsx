import React, { useEffect, useState } from 'react';
import { Download, AlertCircle, Loader } from 'lucide-react';
import { renderService } from '../../services/renderService';

export function RenderProgress({ jobId, onDownload, onError }) {
  const [status, setStatus] = useState('queued');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const startPolling = async () => {
      try {
        const result = await renderService.pollRenderStatus(jobId, (response) => {
          setStatus(response.status);
          setProgress(response.progress || 0);
        });
        onDownload?.(result.output_path);
      } catch (err) {
        setError(err.message);
        onError?.(err.message);
      }
    };

    startPolling();
  }, [jobId, onDownload, onError]);

  if (error) {
    return (
      <div className="render-progress error">
        <AlertCircle size={32} />
        <h3>Rendering Failed</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-retry">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="render-progress">
      <Loader size={32} className="spinner" />
      <h3>Rendering Your Video</h3>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-text">{progress}% complete</p>
      <p className="status-text">
        {status === 'queued' && 'Waiting to process...'}
        {status === 'processing' && 'Processing your video...'}
      </p>
    </div>
  );
}
