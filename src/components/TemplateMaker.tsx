
import React, { useState } from 'react';
import { Music, Clock, UploadCloud } from 'lucide-react';
import VideoUploader from './VideoUploader';
import VideoExport from './VideoExport';
import AudioWaveform from './AudioWaveform';
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
  
  const handleVideoUpload = (videoUrls: string[]) => {
    if (videoUrls.length > 0) {
      toast.success(`${videoUrls.length} clips added`);
      // In a real app, we would process the video URLs here
    }
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Beat Pattern</h3>
            <AudioWaveform 
              trackId={template.id}
              beatMarkers={template.beatMarkers}
              duration={template.duration}
            />
            <p className="text-xs text-muted-foreground">
              Each marker represents a beat where your clips will transition.
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateMaker;
