import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { renderService } from '../../services/renderService';

export function PresetManager() {
  const [customPresets, setCustomPresets] = useState([]);
  const [builtInPresets, setBuiltInPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    colors: { primary: '#667eea', secondary: '#764ba2' },
    typography: { fontFamily: 'system-ui', fontSize: '16px' },
    effects: { intensity: 100, duration: 2000 }
  });

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      setLoading(true);
      const data = await renderService.getPresets();
      setBuiltInPresets(data.built_in || []);
      setCustomPresets(data.custom || []);
      setError('');
    } catch (err) {
      setError('Failed to load presets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreset = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Preset name is required');
      return;
    }

    try {
      if (editingId) {
        await renderService.updatePreset(editingId, formData);
        setCustomPresets(customPresets.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
      } else {
        const response = await renderService.createPreset(formData);
        setCustomPresets([...customPresets, response]);
      }
      resetForm();
      setError('');
    } catch (err) {
      setError('Failed to save preset');
      console.error(err);
    }
  };

  const handleDelete = async (presetId) => {
    try {
      await renderService.deletePreset(presetId);
      setCustomPresets(customPresets.filter(p => p.id !== presetId));
      setConfirmDelete(null);
    } catch (err) {
      setError('Failed to delete preset');
    }
  };

  const handleEdit = (preset) => {
    setEditingId(preset.id);
    setFormData({
      name: preset.name,
      description: preset.description || '',
      colors: preset.config?.colors || formData.colors,
      typography: preset.config?.typography || formData.typography,
      effects: preset.config?.effects || formData.effects
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      colors: { primary: '#667eea', secondary: '#764ba2' },
      typography: { fontFamily: 'system-ui', fontSize: '16px' },
      effects: { intensity: 100, duration: 2000 }
    });
  };

  if (loading) {
    return <div className="preset-manager-loading">Loading presets...</div>;
  }

  return (
    <div className="preset-manager">
      {error && <div className="preset-manager-error">{error}</div>}

      <div className="preset-section">
        <h3>Built-in Presets</h3>
        <div className="preset-grid">
          {builtInPresets.map((preset) => (
            <div key={preset.id} className="preset-card preset-card-builtin">
              <div
                className="preset-color-preview"
                style={{
                  background: `linear-gradient(135deg, ${preset.config?.colors?.primary}, ${preset.config?.colors?.secondary})`
                }}
              />
              <div className="preset-info">
                <h4>{preset.name}</h4>
                <p className="preset-description">{preset.description}</p>
                <span className="preset-badge">Built-in</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="preset-section">
        <div className="preset-section-header">
          <h3>Custom Presets</h3>
          {!editingId && (
            <button className="btn-new-preset" onClick={() => setFormData({ ...formData, name: '' })}>
              <Plus size={18} /> New Preset
            </button>
          )}
        </div>

        {editingId || !customPresets.length ? (
          <form className="preset-form" onSubmit={handleSavePreset}>
            <div className="form-group">
              <label>Preset Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., My Cool Vibe"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Primary Color</label>
                <input
                  type="color"
                  value={formData.colors.primary}
                  onChange={(e) => setFormData({
                    ...formData,
                    colors: { ...formData.colors, primary: e.target.value }
                  })}
                />
              </div>
              <div className="form-group">
                <label>Secondary Color</label>
                <input
                  type="color"
                  value={formData.colors.secondary}
                  onChange={(e) => setFormData({
                    ...formData,
                    colors: { ...formData.colors, secondary: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Effect Intensity</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.effects.intensity}
                onChange={(e) => setFormData({
                  ...formData,
                  effects: { ...formData.effects, intensity: parseInt(e.target.value) }
                })}
              />
              <span>{formData.effects.intensity}%</span>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-form-cancel" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn-form-save">
                {editingId ? 'Update Preset' : 'Create Preset'}
              </button>
            </div>
          </form>
        ) : (
          <div className="preset-grid">
            {customPresets.map((preset) => (
              <div key={preset.id} className="preset-card">
                <div
                  className="preset-color-preview"
                  style={{
                    background: `linear-gradient(135deg, ${preset.config?.colors?.primary}, ${preset.config?.colors?.secondary})`
                  }}
                />
                <div className="preset-info">
                  <h4>{preset.name}</h4>
                  <p className="preset-description">{preset.description}</p>
                </div>
                <div className="preset-actions">
                  <button
                    className="btn-action btn-edit"
                    onClick={() => handleEdit(preset)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => setConfirmDelete(preset.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {customPresets.length === 0 && !editingId && (
          <div className="preset-empty">No custom presets yet. Create one to get started!</div>
        )}
      </div>

      {confirmDelete && (
        <div className="delete-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Preset?</h3>
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
