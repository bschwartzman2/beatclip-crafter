
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Music, Upload } from 'lucide-react';
import Layout from '../components/Layout';
import VideoUploader from '../components/VideoUploader';
import VideoExport from '../components/VideoExport';
import { toast } from 'sonner';

// Mock template data for demo purposes
const MOCK_TEMPLATES = [
  {
    id: '1',
    name: 'Energetic Dance Template',
    trackName: 'Dance Monkey',
    artist: 'Tones and I',
    beatCount: 32,
    duration: 30,
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D',
    popularity: 95,
    createdAt: '2023-05-15'
  },
  {
    id: '2',
    name: 'Calm Aesthetic Vibes',
    trackName: 'Blinding Lights',
    artist: 'The Weeknd',
    beatCount: 28,
    duration: 25,
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bXVzaWN8ZW58MHx8MHx8fDA%3D',
    popularity: 87,
    createdAt: '2023-06-22'
  },
  {
    id: '3',
    name: 'Trending Hip Hop Flow',
    trackName: 'SICKO MODE',
    artist: 'Travis Scott',
    beatCount: 45,
    duration: 35,
    albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVzaWN8ZW58MHx8MHx8fDA%3D',
    popularity: 92,
    createdAt: '2023-04-18'
  }
];

const TemplateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [exportReady, setExportReady] = useState(false);
  
  // Find the template based on ID
  const template = MOCK_TEMPLATES.find(t => t.id === id);
  
  if (!template) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Template Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The template you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/templates" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover-scale transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Link>
        </div>
      </Layout>
    );
  }
  
  const handleVideoUpload = (videoUrls: string[]) => {
    setUploadedVideos(videoUrls);
    
    if (videoUrls.length > 0) {
      toast.success(`${videoUrls.length} video clips uploaded!`);
      
      // If we have enough videos for the template beats, enable export
      if (videoUrls.length >= Math.min(4, template.beatCount / 8)) {
        setExportReady(true);
      }
    }
  };
  
  const handleExport = () => {
    toast.loading('Creating your TikTok video...', {
      duration: 3000,
    });
    
    // Simulate export completion after 3 seconds
    setTimeout(() => {
      toast.success('Your TikTok video is ready!');
    }, 3000);
  };
  
  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 py-10">
        <Link 
          to="/templates" 
          className="inline-flex items-center text-sm font-medium mb-6 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-[9/16] rounded-lg overflow-hidden bg-secondary/30 relative">
              {template.albumArt && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={template.albumArt} 
                    alt={template.trackName}
                    className="w-full h-full object-cover opacity-20" 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    {uploadedVideos.length === 0 ? (
                      <>
                        <Upload className="h-12 w-12 mb-4 opacity-60" />
                        <h3 className="text-xl font-medium mb-2">Upload Your Videos</h3>
                        <p className="text-muted-foreground">
                          Add your video clips to fill this template
                        </p>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
                        {uploadedVideos.map((video, index) => (
                          <div key={index} className="aspect-square rounded-md bg-background/20 shadow-sm">
                            <div className="w-full h-full flex items-center justify-center text-sm font-medium">
                              Clip {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{template.name}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <Music className="h-4 w-4 mr-2" />
                <span>{template.trackName} • {template.artist}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Duration</div>
                  <div className="text-lg font-semibold">{template.duration}s</div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Beat Count</div>
                  <div className="text-lg font-semibold">{template.beatCount} beats</div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Upload Your Clips</h3>
              <VideoUploader onUpload={handleVideoUpload} />
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Export Your Video</h3>
              <VideoExport
                isReady={exportReady}
                onExport={handleExport}
                disabled={!exportReady}
                templateName={template.name}
                songName={template.trackName}
                artist={template.artist}
              />
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button 
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                onClick={() => toast.success('Template saved to favorites')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span>Save</span>
              </button>
              <button 
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard');
                }}
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TemplateDetail;
