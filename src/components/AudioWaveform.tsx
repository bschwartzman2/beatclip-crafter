
import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  trackId?: string;
  beatMarkers: number[];
  duration: number;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ 
  trackId, 
  beatMarkers,
  duration 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!waveformRef.current) return;
    
    // Generate random waveform bars
    const barCount = 100;
    waveformRef.current.innerHTML = '';
    
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      const height = Math.floor(Math.random() * 80) + 20;
      
      bar.className = 'bg-primary/30 w-1 rounded-t transition-all duration-300';
      bar.style.height = `${height}%`;
      
      waveformRef.current.appendChild(bar);
    }
  }, [trackId]);
  
  return (
    <div className="w-full h-40 bg-secondary/30 rounded-lg p-4 relative" ref={containerRef}>
      <div className="absolute top-2 left-4 text-xs font-medium text-muted-foreground">
        Waveform &amp; Beat Markers
      </div>
      
      <div className="h-full w-full pt-6 relative">
        <div className="absolute left-0 right-0 bottom-0 h-px bg-muted-foreground/20"></div>
        
        <div 
          className="h-full w-full flex items-end justify-between gap-[2px] relative overflow-hidden"
          ref={waveformRef}
        >
          {/* Bars will be dynamically added here */}
        </div>
        
        {/* Beat markers */}
        {beatMarkers.map((position, index) => {
          // Convert beat position (seconds) to percentage of total duration
          const positionPercent = (position / duration) * 100;
          
          return (
            <div 
              key={index}
              className="beat-marker"
              style={{
                left: `${positionPercent}%`,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default AudioWaveform;
