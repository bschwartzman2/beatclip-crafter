
import React, { useEffect, useRef, useState } from 'react';
import { Music, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioTimelineProps {
  beatMarkers: number[];
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  onSeek?: (time: number) => void;
  onBeatClick?: (index: number) => void;
}

const AudioTimeline: React.FC<AudioTimelineProps> = ({
  beatMarkers,
  duration,
  currentTime,
  isPlaying,
  onSeek,
  onBeatClick,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  const [hoveredBeatIndex, setHoveredBeatIndex] = useState<number | null>(null);
  
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !onSeek) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    onSeek(newTime);
  };
  
  const handleTimelineHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const hoverPosition = (e.clientX - rect.left) / rect.width;
    setHoveredTime(hoverPosition * duration);
    
    // Find closest beat marker to the hover position
    const hoverTimeInSeconds = hoverPosition * duration;
    let closestBeatIndex = -1;
    let closestDistance = Number.MAX_VALUE;
    
    beatMarkers.forEach((markerTime, index) => {
      const distance = Math.abs(markerTime - hoverTimeInSeconds);
      if (distance < closestDistance && distance < 2) { // Within 2 seconds
        closestDistance = distance;
        closestBeatIndex = index;
      }
    });
    
    setHoveredBeatIndex(closestBeatIndex);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Find the active beat marker
  const activeBeatIndex = beatMarkers.findIndex((time, index) => 
    currentTime >= time && (index === beatMarkers.length - 1 || currentTime < beatMarkers[index + 1])
  );
  
  return (
    <div className="w-full space-y-2">
      <div 
        ref={timelineRef}
        className="h-24 bg-secondary/20 rounded-lg relative cursor-pointer overflow-hidden"
        onClick={handleTimelineClick}
        onMouseMove={handleTimelineHover}
        onMouseLeave={() => {
          setHoveredTime(null);
          setHoveredBeatIndex(null);
        }}
      >
        {/* Visualization background - subtle beat pattern */}
        <div className="absolute inset-0 flex items-end">
          {Array.from({ length: 50 }).map((_, index) => {
            const height = 20 + Math.sin(index * 0.2) * 10;
            return (
              <div 
                key={index} 
                className="w-full h-full flex-1 flex items-end"
              >
                <div 
                  className="w-full bg-secondary/30 rounded-sm"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            );
          })}
        </div>
        
        {/* Beat markers */}
        {beatMarkers.map((time, index) => {
          const position = (time / duration) * 100;
          const isActive = index === activeBeatIndex;
          const isHovered = index === hoveredBeatIndex;
          
          return (
            <div
              key={index}
              className={cn(
                "absolute h-full flex flex-col items-center justify-end transition-all duration-200",
                isActive ? "z-20" : "z-10",
                isHovered ? "scale-110" : ""
              )}
              style={{ 
                left: `${position}%`, 
                transform: `translateX(-50%) ${isHovered ? 'scale(1.1)' : ''}`
              }}
              onClick={(e) => {
                e.stopPropagation();
                onBeatClick?.(index);
              }}
            >
              {/* Beat marker label */}
              <div className={cn(
                "absolute -top-1 text-xs font-medium transition-all duration-200",
                isActive || isHovered ? "text-primary" : "text-primary/70"
              )}>
                {index + 1}
              </div>
              
              {/* Beat marker pulse animation for active beat */}
              {isActive && (
                <div className="absolute top-1/3 w-6 h-6 rounded-full bg-primary/20 animate-ping"></div>
              )}
              
              {/* Beat marker dot */}
              <div className={cn(
                "w-3 h-3 rounded-full mb-2 transition-all duration-200",
                isActive 
                  ? "bg-primary shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                  : isHovered 
                    ? "bg-primary/80" 
                    : "bg-primary/50"
              )}></div>
              
              {/* Beat marker line */}
              <div className={cn(
                "w-0.5 h-3/4 transition-all duration-200",
                isActive 
                  ? "bg-primary shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                  : isHovered 
                    ? "bg-primary/80" 
                    : "bg-primary/40"
              )}></div>
            </div>
          );
        })}
        
        {/* Playhead */}
        {isPlaying && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white z-30 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute top-0 w-3 h-3 -ml-[5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
          </div>
        )}
        
        {/* Hover time indicator */}
        {hoveredTime !== null && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-primary/30 z-5"
            style={{ left: `${(hoveredTime / duration) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs">
              {formatTime(hoveredTime)}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4" />
          <span>{beatMarkers.length} beats</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioTimeline;
