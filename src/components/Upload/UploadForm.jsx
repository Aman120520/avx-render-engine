import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

export function UploadForm({ onFileSelect, selectedFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file) => {
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file');
      return false;
    }
    if (file.size > 500 * 1024 * 1024) {
      setError('File is too large (max 500MB)');
      return false;
    }
    setError('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  return (
    <div className="upload-form">
      {selectedFile ? (
        <div className="selected-file">
          <div className="file-info">
            <h3>{selectedFile.name}</h3>
            <p>{formatFileSize(selectedFile.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="btn-remove"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          className={`drag-drop ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={48} />
          <h3>Drag and drop your video</h3>
          <p>or click to browse</p>
          <span className="file-hint">MP4, WebM • Up to 500MB</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}
