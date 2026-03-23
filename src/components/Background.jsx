import React, { memo } from 'react';

export const ParticleSystem = memo(() => {
  const particles = Array.from({ length: 12 });
  return (
    <div className="floating-particles">
      {particles.map((_, i) => {
        const size = Math.random() * 3 + 2;
        const xStart = Math.random() * 100 + 'vw';
        const duration = Math.random() * 20 + 20 + 's';
        const delay = Math.random() * 10 + 's';
        return (
          <div key={i} className="particle" style={{
            width: size, height: size, left: xStart,
            '--x-start': '0vw', '--x-end': (Math.random() * 20 - 10) + 'vw',
            '--duration': duration, animationDelay: delay
          }} />
        );
      })}
    </div>
  );
});

export const BackgroundShapes = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[-22]">
    <div className="absolute top-[10%] left-[5%] w-64 h-64 border border-white/5 rounded-full animate-[pulse_10s_infinite] [will-change:transform]" />
    <div className="absolute bottom-[20%] right-[10%] w-96 h-96 border border-white/5 rotate-45 animate-[pulse_15s_infinite] [will-change:transform]" />
    <div className="absolute top-[40%] right-[15%] w-32 h-32 border border-white/5 rounded-lg rotate-12 animate-[pulse_12s_infinite] [will-change:transform]" />
  </div>
));

export const VideoBackground = memo(() => (
  <video
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    className="fixed top-0 left-0 w-full h-full object-cover z-[-40] opacity-20 pointer-events-none"
    style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
  >
    <source src="/bg_wave.mp4" type="video/mp4" />
  </video>
));
