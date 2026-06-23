import React, { useState, useEffect } from 'react';
import { Trash2, Download, RotateCw } from 'lucide-react';
import { videoService } from '../../services/videoService';

export function RenderHistory() {
  const [renders, setRenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchRenders();
  }, []);

  const fetchRenders = async () => {
    try {
      setLoading(true);
      const data = await videoService.getVideos();
      setRenders(Array.isArray(data) ? data : data.videos || []);
      setError('');
    } catch (err) {
      setError('Failed to load render history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    try {
      setDeletingId(videoId);
      await videoService.deleteVideo(videoId);
      setRenders(renders.filter(r => r.id !== videoId));
      setConfirmDelete(null);
    } catch (err) {
      setError('Failed to delete render');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="render-history-loading">Loading renders...</div>;
  }

  if (renders.length === 0) {
    return <div className="render-history-empty">No renders yet. Start by uploading a video!</div>;
  }

  return (
    <div className="render-history">
      {error && <div className="render-history-error">{error}</div>}
      <table className="render-history-table">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Vibe</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {renders.map((render) => (
            <tr key={render.id} className={`render-row render-row-${render.status}`}>
              <td className="filename">{render.filename}</td>
              <td className="vibe">{render.vibe_name || 'Unknown'}</td>
              <td className="date">{formatDate(render.created_at)}</td>
              <td className="status">
                <span className={`status-badge status-${render.status}`}>
                  {render.status}
                </span>
              </td>
              <td className="actions">
                {render.status === 'completed' && render.output_path && (
                  <a
                    href={render.output_path}
                    download
                    className="btn-action btn-download"
                    title="Download"
                  >
                    <Download size={16} />
                  </a>
                )}
                <button
                  className="btn-action btn-delete"
                  onClick={() => setConfirmDelete(render.id)}
                  disabled={deletingId === render.id}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmDelete && (
        <div className="delete-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Render?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn-modal btn-cancel"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn-modal btn-confirm-delete"
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
