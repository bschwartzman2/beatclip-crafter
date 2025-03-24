
import React, { useState, useRef, useEffect } from 'react';
import { Music, Clock, UploadCloud, Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';
import VideoUploader from './VideoUploader';
import VideoExport from './VideoExport';
import AudioWaveform from './AudioWaveform';
import { Slider } from './ui/slider';
import { toast } from 'sonner';

interface TemplateMakerProps {
  template: {
    id: string;
    name: string;
    trackName: string;
    artist: string;
    albumArt: string;
    duration: number;
    beatMarkers: number[];
  };
}

const TemplateMaker: React.FC<TemplateMakerProps> = ({ template }) => {
  const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTransitionIndex, setActiveTransitionIndex] = useState<number>(-1);
  const [clipDurations, setClipDurations] = useState<number[]>([]);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // For the purpose of this demo, we'll use a mock audio source
  const audioSrc = "https://cdn.uppbeat.io/audio-preview/UPP-preview-main-2004.mp3";

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      const audio = new Audio(audioSrc);
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleEnded);
      audioRef.current = audio;
    }

    // Calculate clip durations based on beat markers
    calculateClipDurations();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [template.beatMarkers]);

  const calculateClipDurations = () => {
    // Calculate the duration of each clip based on beat markers
    const durations: number[] = [];
    for (let i = 0; i < template.beatMarkers.length - 1; i++) {
      const clipDuration = template.beatMarkers[i + 1] - template.beatMarkers[i];
      durations.push(clipDuration);
    }
    // Add the last clip duration (from last marker to end of song)
    if (template.beatMarkers.length > 0) {
      const lastDuration = template.duration - template.beatMarkers[template.beatMarkers.length - 1];
      durations.push(lastDuration);
    }
    setClipDurations(durations);
  };

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // Find the active transition based on current time
      const beatMarkers = template.beatMarkers;
      for (let i = 0; i < beatMarkers.length; i++) {
        if (audioRef.current.currentTime >= beatMarkers[i] && 
            (i === beatMarkers.length - 1 || audioRef.current.currentTime < beatMarkers[i + 1])) {
          setActiveTransitionIndex(i);
          break;
        }
      }
      
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveTransitionIndex(-1);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      } else {
        audioRef.current.play();
        animationRef.current = requestAnimationFrame(updateProgress);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVideoUpload = (videoUrls: string[]) => {
    // Convert the URLs to File objects for this demo
    const mockFiles = videoUrls.map((url, index) => {
      // Create a mock File object
      const file = new File([""], `video-${index + 1}.mp4`, { type: "video/mp4" });
      return file;
    });
    
    setUploadedVideos(mockFiles);
    
    if (videoUrls.length > 0) {
      toast.success(`${videoUrls.length} clips added`);
    }
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const jumpToBeat = (index: number) => {
    if (audioRef.current && template.beatMarkers[index] !== undefined) {
      audioRef.current.currentTime = template.beatMarkers[index];
      setCurrentTime(template.beatMarkers[index]);
      setActiveTransitionIndex(index);
    }
  };

  const getNextBeatIndex = () => {
    const nextIndex = activeTransitionIndex + 1;
    if (nextIndex < template.beatMarkers.length) {
      jumpToBeat(nextIndex);
    }
  };

  const getPrevBeatIndex = () => {
    const prevIndex = activeTransitionIndex - 1;
    if (prevIndex >= 0) {
      jumpToBeat(prevIndex);
    } else {
      // Jump to beginning of song
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setActiveTransitionIndex(-1);
      }
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="sm:w-1/3">
          <div className="rounded-lg overflow-hidden border subtle-shadow bg-card">
            <div className="aspect-square relative">
              <img 
                src={template.albumArt} 
                alt={template.trackName}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                <h2 className="text-white font-medium text-lg">{template.name}</h2>
                <div className="flex items-center text-white/90 text-sm">
                  <Music className="h-4 w-4 mr-1" />
                  <span className="truncate">{template.trackName}</span>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatDuration(template.duration)}</span>
                </div>
                <div className="text-muted-foreground">
                  {template.beatMarkers.length} beats
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Artist:</span> {template.artist}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Use This Template</h1>
            <p className="text-muted-foreground">
              Upload your video clips and we'll automatically sync them to the beats.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Beat Pattern</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={getPrevBeatIndex} 
                  className="p-2 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={handlePlayPause} 
                  className="p-2 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button 
                  onClick={getNextBeatIndex} 
                  className="p-2 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <AudioWaveform 
              trackId={template.id}
              beatMarkers={template.beatMarkers}
              duration={template.duration}
              currentTime={currentTime}
              isPlaying={isPlaying}
            />
            
            <div className="flex items-center gap-2">
              <span className="text-xs w-10 text-muted-foreground">
                {formatDuration(currentTime)}
              </span>
              <Slider 
                value={[currentTime]}
                min={0}
                max={template.duration}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-xs w-10 text-right text-muted-foreground">
                {formatDuration(template.duration)}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Each marker represents a beat where your clips will transition.
            </p>
          </div>
          
          {/* Beat Transition Visual Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Transition Points</h3>
              <button 
                onClick={() => setShowDetailedView(!showDetailedView)} 
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {showDetailedView ? "Simple View" : "Detailed View"}
              </button>
            </div>
            <div 
              className="w-full h-16 bg-secondary/30 rounded-lg overflow-hidden relative p-2"
              ref={timelineRef}
            >
              {/* Timeline markers */}
              {template.beatMarkers.map((time, index) => {
                const positionPercent = (time / template.duration) * 100;
                return (
                  <div 
                    key={index}
                    className={`absolute top-0 bottom-0 w-px bg-primary/50 cursor-pointer transition-opacity
                               ${index === activeTransitionIndex ? 'opacity-100' : 'opacity-50'}`}
                    style={{ left: `${positionPercent}%` }}
                    onClick={() => jumpToBeat(index)}
                  >
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-[10px] text-primary/70">
                      {index + 1}
                    </div>
                  </div>
                );
              })}
              
              {/* Clip transition segments */}
              {template.beatMarkers.map((time, index) => {
                if (index === template.beatMarkers.length - 1) return null;
                
                const startPercent = (time / template.duration) * 100;
                const endPercent = (template.beatMarkers[index + 1] / template.duration) * 100;
                const width = endPercent - startPercent;
                
                return (
                  <div 
                    key={`segment-${index}`}
                    className={`absolute bottom-2 h-8 rounded-md border-2 border-dashed 
                                transition-all duration-200 flex items-center justify-center
                                ${index === activeTransitionIndex 
                                   ? 'bg-primary/20 border-primary' 
                                   : 'bg-secondary/50 border-secondary'}`}
                    style={{ 
                      left: `${startPercent}%`, 
                      width: `${width}%`,
                    }}
                    onClick={() => jumpToBeat(index)}
                  >
                    <span className="text-xs font-medium truncate px-1">
                      Clip {index + 1}
                    </span>
                  </div>
                );
              })}
              
              {/* Add the final clip */}
              {template.beatMarkers.length > 0 && (
                <div 
                  className={`absolute bottom-2 h-8 rounded-md border-2 border-dashed 
                              transition-all duration-200 flex items-center justify-center
                              ${activeTransitionIndex === template.beatMarkers.length - 1 
                                 ? 'bg-primary/20 border-primary' 
                                 : 'bg-secondary/50 border-secondary'}`}
                  style={{ 
                    left: `${(template.beatMarkers[template.beatMarkers.length - 1] / template.duration) * 100}%`, 
                    width: `${100 - (template.beatMarkers[template.beatMarkers.length - 1] / template.duration) * 100}%`,
                  }}
                  onClick={() => jumpToBeat(template.beatMarkers.length - 1)}
                >
                  <span className="text-xs font-medium truncate px-1">
                    Clip {template.beatMarkers.length}
                  </span>
                </div>
              )}
              
              {/* Current time indicator */}
              {isPlaying && (
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 pointer-events-none"
                  style={{ 
                    left: `${(currentTime / template.duration) * 100}%`,
                    boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)' 
                  }}
                ></div>
              )}
            </div>
            
            {showDetailedView && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 animate-fade-in">
                <div className="space-y-2">
                  <h4 className="text-xs font-medium">Clip Durations</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {clipDurations.map((duration, index) => (
                      <div 
                        key={`duration-${index}`}
                        className={`flex items-center justify-between p-2 rounded-md text-xs ${
                          index === activeTransitionIndex ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/30'
                        }`}
                      >
                        <span>Clip {index + 1}</span>
                        <span>{duration.toFixed(2)}s</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-medium">Transition Timestamps</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {template.beatMarkers.map((time, index) => (
                      <div 
                        key={`timestamp-${index}`} 
                        className={`flex items-center justify-between p-2 rounded-md text-xs cursor-pointer ${
                          index === activeTransitionIndex ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/30'
                        }`}
                        onClick={() => jumpToBeat(index)}
                      >
                        <span>Beat {index + 1}</span>
                        <span>{formatDuration(time)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Click on a transition point to preview where your clips will change.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Upload Your Clips</h3>
            <VideoUploader onUpload={handleVideoUpload} />
          </div>
          
          {uploadedVideos.length > 0 && (
            <VideoExport 
              templateName={template.name}
              songName={template.trackName}
              artist={template.artist}
              isReady={true}
              onExport={() => console.log('Exporting template with clips', uploadedVideos)}
              disabled={uploadedVideos.length === 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateMaker;
