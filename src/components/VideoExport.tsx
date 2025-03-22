
import React, { useState } from 'react';
import { Download, Share, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VideoExportProps {
  templateName: string;
  songName: string;
  artist: string;
}

const VideoExport: React.FC<VideoExportProps> = ({ 
  templateName, 
  songName, 
  artist 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExported, setIsExported] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export process with progress updates
    const interval = setInterval(() => {
      setExportProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            setIsExported(true);
            toast.success('Your TikTok video is ready!');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  const handleShareToTikTok = () => {
    toast('Sharing to TikTok...', {
      description: 'This would open the TikTok app with your video.'
    });
  };
  
  return (
    <div className="rounded-lg border p-6 bg-card subtle-shadow space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium">Export Your TikTok Video</h3>
        <p className="text-sm text-muted-foreground">
          Your video will be optimized for TikTok with perfect beat synchronization.
        </p>
      </div>
      
      {!isExporting && !isExported ? (
        <button
          className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors hover-scale"
          onClick={handleExport}
        >
          <Download className="h-5 w-5" />
          Export Video
        </button>
      ) : isExporting ? (
        <div className="space-y-4">
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Exporting...</span>
            </div>
            <span>{Math.round(exportProgress)}%</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              onClick={() => toast.success('Video downloaded')}
            >
              <Download className="h-5 w-5" />
              Download
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/70 transition-colors"
              onClick={handleShareToTikTok}
            >
              <Share className="h-5 w-5" />
              Share to TikTok
            </button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Your video has been created with "{templateName}" template<br />
            using "{songName}" by {artist}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoExport;
