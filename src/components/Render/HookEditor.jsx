import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function HookEditor({ peaks, onApplyHooks }) {
  const [enabledHooks, setEnabledHooks] = useState(
    new Array(peaks?.length || 0).fill(false)
  );
  const [expanded, setExpanded] = useState({});

  const toggleHook = (idx) => {
    const updated = [...enabledHooks];
    updated[idx] = !updated[idx];
    setEnabledHooks(updated);
  };

  const toggleExpanded = (idx) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleApply = () => {
    const selectedIndices = enabledHooks
      .map((enabled, idx) => enabled ? idx : -1)
      .filter(idx => idx !== -1);
    onApplyHooks(selectedIndices);
  };

  if (!peaks || peaks.length === 0) {
    return <div className="hook-editor-empty">No peaks to edit</div>;
  }

  return (
    <div className="hook-editor">
      <h3>Audio Hooks ({enabledHooks.filter(Boolean).length} selected)</h3>
      <div className="hooks-list">
        {peaks.map((peak, idx) => (
          <div key={idx} className="hook-item">
            <div className="hook-header">
              <label className="hook-checkbox">
                <input
                  type="checkbox"
                  checked={enabledHooks[idx]}
                  onChange={() => toggleHook(idx)}
                />
                <span className="checkbox-label">
                  {peak.timestamp.toFixed(2)}s
                  <span className="intensity">
                    {(peak.intensity * 100).toFixed(0)}%
                  </span>
                </span>
              </label>
              <button
                className="expand-btn"
                onClick={() => toggleExpanded(idx)}
              >
                {expanded[idx] ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
            {expanded[idx] && (
              <div className="hook-details">
                <label>Hook Intensity</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="100"
                  className="intensity-slider"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleApply} className="btn-apply-hooks">
        Apply Hooks
      </button>
    </div>
  );
}
