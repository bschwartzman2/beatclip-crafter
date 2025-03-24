
import React from 'react';
import { Video, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClipTransitionsProps {
  beatMarkers: number[];
  duration: number;
  currentTime: number;
  clipCount: number;
  onClipClick?: (index: number) => void;
}

const ClipTransitions: React.FC<ClipTransitionsProps> = ({
  beatMarkers,
  duration,
  currentTime,
  clipCount,
  onClipClick,
}) => {
  const formatDuration = (startTime: number, endTime: number) => {
    const duration = endTime - startTime;
    return `${duration.toFixed(2)}s`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Clip Transitions</h3>
        <span className="text-xs text-muted-foreground">{clipCount} clips total</span>
      </div>
      
      <div className="grid gap-2">
        {beatMarkers.map((startTime, index) => {
          const endTime = beatMarkers[index + 1] || duration;
          const isActive = currentTime >= startTime && currentTime < endTime;
          
          return (
            <button
              key={index}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all",
                isActive 
                  ? "bg-primary/20 border border-primary/30" 
                  : "bg-secondary/20 hover:bg-secondary/30"
              )}
              onClick={() => onClipClick?.(index)}
            >
              <div className="flex-shrink-0">
                <Video className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  Clip {index + 1}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(startTime, endTime)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ClipTransitions;
