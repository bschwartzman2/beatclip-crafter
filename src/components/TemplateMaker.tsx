import React, { useState, useRef, useEffect } from 'react';
import { Music, Clock, UploadCloud, Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';
import VideoUploader from './VideoUploader';
import VideoExport from './VideoExport';
import AudioWaveform from './AudioWaveform';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import AudioTimeline from './AudioTimeline';
import ClipTransitions from './ClipTransitions';

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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Beat Pattern</h3>
            <AudioTimeline
              beatMarkers={template.beatMarkers}
              duration={template.duration}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onSeek={(time) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = time;
                  setCurrentTime(time);
                }
              }}
              onBeatClick={(index) => {
                if (audioRef.current) {
                  const time = template.beatMarkers[index];
                  audioRef.current.currentTime = time;
                  setCurrentTime(time);
                  setActiveTransitionIndex(index);
                }
              }}
            />
          </div>
          
          <VideoUploader onUpload={handleVideoUpload} />
          
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
        
        <div className="space-y-6">
          <ClipTransitions
            beatMarkers={template.beatMarkers}
            duration={template.duration}
            currentTime={currentTime}
            clipCount={template.beatMarkers.length}
            onClipClick={(index) => {
              if (audioRef.current) {
                const time = template.beatMarkers[index];
                audioRef.current.currentTime = time;
                setCurrentTime(time);
                setActiveTransitionIndex(index);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateMaker;
