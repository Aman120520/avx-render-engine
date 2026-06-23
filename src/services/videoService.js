import { apiCall } from '../utils/apiClient';

const VALID_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/mpeg', 'video/webm'];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export const videoService = {
  validateFile(file) {
    if (!VALID_MIME_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type. Supported: MP4, MOV, MPEG, WebM`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum: ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`);
    }
    return true;
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  async uploadVideo(file, presetId) {
    this.validateFile(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('preset_id', presetId);

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/videos/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      window.location.href = '/login';
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.detail || error.message || 'Upload failed');
    }

    return response.json();
  },

  async getVideos() {
    return apiCall('/api/videos');
  },

  async getVideo(videoId) {
    return apiCall(`/api/videos/${videoId}`);
  },

  async deleteVideo(videoId) {
    return apiCall(`/api/videos/${videoId}`, { method: 'DELETE' });
  },

  async getTranscription(videoId) {
    return apiCall(`/api/transcription/${videoId}`);
  },

  async getAudioPeaks(videoId) {
    return apiCall(`/api/hooks/${videoId}`);
  }
};
