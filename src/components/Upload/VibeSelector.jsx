import React from 'react';

export function VibeSelector({ vibes, selectedVibe, onSelect, isLoading }) {
  return (
    <div className="vibe-selector">
      <h3>Choose your vibe</h3>
      <div className="vibe-grid">
        {vibes.map((vibe) => (
          <div
            key={vibe.id}
            className={`vibe-card ${selectedVibe?.id === vibe.id ? 'selected' : ''}`}
            onClick={() => !isLoading && onSelect(vibe)}
          >
            <div
              className="vibe-preview"
              style={{
                background: `linear-gradient(135deg, ${vibe.config.colors.primary}, ${vibe.config.colors.secondary})`,
              }}
            />
            <h4>{vibe.name}</h4>
            <p>{vibe.description || 'Custom preset'}</p>
            {selectedVibe?.id === vibe.id && (
              <div className="vibe-checkmark">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
