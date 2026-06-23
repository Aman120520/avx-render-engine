import React, { useState } from 'react';

export function AudioWaveform({ peaks, enabledHooks, onHoverPeak }) {
  const [hoveredPeakIdx, setHoveredPeakIdx] = useState(null);

  if (!peaks || peaks.length === 0) {
    return <div className="waveform-empty">No audio peaks detected</div>;
  }

  const maxIntensity = Math.max(...peaks.map(p => p.intensity), 1);
  const canvasWidth = Math.min(peaks.length * 15, 800);
  const barWidth = Math.max(1, canvasWidth / peaks.length - 1);

  return (
    <div className="audio-waveform">
      <div className="waveform-container">
        {peaks.map((peak, idx) => {
          const isEnabled = enabledHooks.includes(idx);
          const heightPercent = (peak.intensity / maxIntensity) * 100;
          const timestamp = peak.timestamp.toFixed(2);

          return (
            <div
              key={idx}
              className={`peak-bar ${isEnabled ? 'enabled' : 'disabled'}`}
              style={{
                height: `${Math.max(5, heightPercent)}%`,
                width: `${barWidth}px`,
              }}
              onMouseEnter={() => {
                setHoveredPeakIdx(idx);
                onHoverPeak?.(idx, timestamp);
              }}
              onMouseLeave={() => setHoveredPeakIdx(null)}
              title={`${timestamp}s`}
            />
          );
        })}
      </div>
      {hoveredPeakIdx !== null && (
        <div className="waveform-tooltip">
          {peaks[hoveredPeakIdx].timestamp.toFixed(2)}s
        </div>
      )}
    </div>
  );
}
