
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
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-full space-y-2">
      <div 
        ref={timelineRef}
        className="h-24 bg-secondary/20 rounded-lg relative cursor-pointer overflow-hidden"
        onClick={handleTimelineClick}
        onMouseMove={handleTimelineHover}
        onMouseLeave={() => setHoveredTime(null)}
      >
        {/* Beat markers */}
        {beatMarkers.map((time, index) => {
          const position = (time / duration) * 100;
          const isActive = currentTime >= time && 
            (index === beatMarkers.length - 1 || currentTime < beatMarkers[index + 1]);
          
          return (
            <div
              key={index}
              className={cn(
                "absolute top-0 bottom-0 w-px transition-all duration-200",
                isActive ? "bg-primary shadow-glow z-20" : "bg-primary/40"
              )}
              style={{ left: `${position}%` }}
              onClick={(e) => {
                e.stopPropagation();
                onBeatClick?.(index);
              }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-[10px] text-primary/70">
                {index + 1}
              </div>
            </div>
          );
        })}
        
        {/* Playhead */}
        {isPlaying && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white z-30 shadow-glow"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        )}
        
        {/* Hover time indicator */}
        {hoveredTime !== null && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-primary/30"
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
