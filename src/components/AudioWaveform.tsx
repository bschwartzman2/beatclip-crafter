
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
      
      // Make the height vary more near beat markers to simulate louder sound at beats
      let height = Math.floor(Math.random() * 80) + 20;
      
      // Check if this bar is near a beat marker
      const barPosition = (i / barCount) * duration;
      const nearBeat = beatMarkers.some(marker => 
        Math.abs(marker - barPosition) < duration / barCount
      );
      
      if (nearBeat) {
        // Make beat markers taller
        height = Math.floor(Math.random() * 20) + 80;
      }
      
      bar.className = 'bg-primary/30 w-1 rounded-t transition-all duration-300';
      bar.style.height = `${height}%`;
      
      waveformRef.current.appendChild(bar);
    }
  }, [trackId, beatMarkers, duration]);
  
  // Find active beat marker
  const activeBeatIndex = beatMarkers.findIndex((time, index) => 
    currentTime >= time && (index === beatMarkers.length - 1 || currentTime < beatMarkers[index + 1])
  );
  
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
          const isActive = index === activeBeatIndex;
          
          return (
            <div 
              key={index}
              className="absolute bottom-0 top-6 flex flex-col items-center"
              style={{
                left: `${positionPercent}%`,
              }}
            >
              {/* Beat number */}
              <div className={`absolute -top-3 text-[8px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-primary/70'}`}>
                {index + 1}
              </div>
              
              {/* Pulse animation for active beat */}
              {isActive && (
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/20 animate-ping"></div>
              )}
              
              {/* Beat marker dot */}
              <div className={`absolute top-1/2 -translate-y-1/2 -ml-1 w-2 h-2 rounded-full transition-all ${
                isActive ? 'bg-primary scale-125' : 'bg-primary/60'
              }`}></div>
              
              {/* Vertical line */}
              <div 
                className={`w-px h-full ${
                  isActive 
                    ? 'bg-primary opacity-100' 
                    : 'bg-primary/50 opacity-50'
                } transition-opacity duration-200`}
                style={{
                  boxShadow: isActive ? '0 0 4px rgba(255, 255, 255, 0.5)' : 'none'
                }}
              ></div>
            </div>
          );
        })}
        
        {/* Current time indicator */}
        <div 
          className={`absolute top-0 bottom-0 w-0.5 bg-white/70 z-10 transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            left: `${(currentTime / duration) * 100}%`,
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
          }}
        >
          <div className="absolute -top-1 -ml-1.5 w-3 h-3 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AudioWaveform;
