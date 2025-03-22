
import React, { useState, useRef } from 'react';
import { Upload, Check, X, Film, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface VideoClip {
  id: string;
  file: File;
  thumbnail: string;
  duration: number;
}

interface VideoUploaderProps {
  onUpload: (videoUrls: string[]) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [clips, setClips] = useState<VideoClip[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const createVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Set to 1 second to get a thumbnail frame
      };
      video.oncanplay = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL();
        resolve(thumbnailUrl);
      };
      video.src = URL.createObjectURL(file);
    });
  };
  
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };
  
  const processVideoFile = async (file: File) => {
    try {
      const thumbnail = await createVideoThumbnail(file);
      const duration = await getVideoDuration(file);
      
      const newClip: VideoClip = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        thumbnail,
        duration
      };
      
      const newClips = [...clips, newClip];
      setClips(newClips);
      
      // Convert clip thumbnails to URLs to pass to parent component
      const videoUrls = newClips.map(clip => clip.thumbnail);
      onUpload(videoUrls);
      
      toast.success(`Added: ${file.name}`);
    } catch (error) {
      toast.error('Failed to process video');
      console.error(error);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        processVideoFile(file);
      } else {
        toast.error('Please upload a video file');
      }
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        processVideoFile(file);
      } else {
        toast.error('Please upload a video file');
      }
    }
  };
  
  const handleRemoveClip = (id: string) => {
    setClips(prev => prev.filter(clip => clip.id !== id));
    toast.info('Clip removed');
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 transition-all text-center ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-secondary hover:border-primary/50 hover:bg-secondary/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept="video/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />
        <div className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
          <div className="p-4 rounded-full bg-secondary">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">
              {isDragging ? (
                <span className="text-primary">Drop your video here</span>
              ) : (
                'Upload your clip'
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Drag and drop or click to browse
            </p>
          </div>
        </div>
      </div>
      
      {clips.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Your Clips</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clips.map(clip => (
              <div 
                key={clip.id}
                className="flex items-center border rounded-lg overflow-hidden bg-card subtle-shadow"
              >
                <div className="h-16 w-24 flex-shrink-0 relative">
                  <img 
                    src={clip.thumbnail} 
                    alt={clip.file.name}
                    className="h-full w-full object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Film className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 p-3 min-w-0">
                  <p className="text-sm font-medium truncate">{clip.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(clip.duration)} • {Math.round(clip.file.size / 1024 / 1024 * 10) / 10} MB
                  </p>
                </div>
                <button 
                  className="p-2 text-muted-foreground hover:text-destructive mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveClip(clip.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
