
import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  trackId?: string;
  beatMarkers: number[];
  duration: number;
  currentTime?: number;
  isPlaying?: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ 
  trackId, 
  beatMarkers,
  duration,
  currentTime = 0,
  isPlaying = false
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
              className={`absolute bottom-0 top-6 w-px bg-primary transition-opacity duration-200 ${
                currentTime >= position && currentTime < (beatMarkers[index + 1] || duration)
                  ? 'opacity-100' 
                  : 'opacity-50'
              }`}
              style={{
                left: `${positionPercent}%`,
                boxShadow: currentTime >= position && currentTime < (beatMarkers[index + 1] || duration)
                  ? '0 0 4px rgba(255, 255, 255, 0.5)'
                  : 'none'
              }}
            ></div>
          );
        })}
        
        {/* Current time indicator */}
        <div 
          className={`absolute top-0 bottom-0 w-0.5 bg-white/70 z-10 transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            left: `${(currentTime / duration) * 100}%`,
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default AudioWaveform;
