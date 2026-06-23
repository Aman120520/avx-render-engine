import { apiCall } from '../utils/apiClient';

export const renderService = {
  async getPresets() {
    const response = await apiCall('/api/presets');
    return {
      built_in: response.built_in || [],
      custom: response.custom || []
    };
  },

  async createPreset(presetData) {
    return apiCall('/api/presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(presetData)
    });
  },

  async updatePreset(presetId, presetData) {
    return apiCall(`/api/presets/${presetId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(presetData)
    });
  },

  async deletePreset(presetId) {
    return apiCall(`/api/presets/${presetId}`, { method: 'DELETE' });
  },

  async startRender(videoId, presetId, enabledHooks) {
    return apiCall(`/api/render/${videoId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preset_id: presetId,
        enabled_hooks: enabledHooks || []
      })
    });
  },

  async pollRenderStatus(jobId, onProgress) {
    let pollCount = 0;
    let lastStatus = null;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const response = await apiCall(`/api/render/${jobId}/status`);

          if (response.status !== lastStatus) {
            lastStatus = response.status;
            onProgress?.(response);
          }

          if (response.status === 'completed') {
            resolve({
              status: 'completed',
              output_path: response.output_path
            });
          } else if (response.status === 'failed') {
            reject(new Error(response.error_message || 'Rendering failed'));
          } else {
            pollCount++;
            const nextInterval = Math.min(
              1000 * Math.pow(2, Math.floor(pollCount / 3)),
              30000
            );
            setTimeout(poll, nextInterval);
          }
        } catch (err) {
          reject(err);
        }
      };

      poll();
    });
  }
};
