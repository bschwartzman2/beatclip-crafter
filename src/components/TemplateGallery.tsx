
import React, { useState, useEffect } from 'react';
import { Search, Music, Play, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  trackName: string;
  artist: string;
  albumArt: string;
  duration: number;
  beatCount: number;
  createdAt: string;
}

const TemplateGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  
  useEffect(() => {
    // Simulate loading templates
    setTimeout(() => {
      const mockTemplates: Template[] = [
        {
          id: 't1',
          name: 'Energetic Dance Transitions',
          trackName: 'As It Was',
          artist: 'Harry Styles',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0',
          duration: 180,
          beatCount: 207,
          createdAt: '2023-08-15'
        },
        {
          id: 't2',
          name: 'Smooth Lifestyle Flow',
          trackName: 'Blinding Lights',
          artist: 'The Weeknd',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b2731e4b0a19462eca5acecfd6ad',
          duration: 195,
          beatCount: 246,
          createdAt: '2023-09-02'
        },
        {
          id: 't3',
          name: 'Dramatic Beat Drops',
          trackName: 'Bad Guy',
          artist: 'Billie Eilish',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e',
          duration: 175,
          beatCount: 198,
          createdAt: '2023-07-28'
        },
        {
          id: 't4',
          name: 'Upbeat Fashion Cuts',
          trackName: 'Uptown Funk',
          artist: 'Mark Ronson ft. Bruno Mars',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b273e419ccba0baa54a0d439b9d0',
          duration: 225,
          beatCount: 302,
          createdAt: '2023-08-22'
        },
        {
          id: 't5',
          name: 'Quirky Transition Sequence',
          trackName: 'Dance Monkey',
          artist: 'Tones and I',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b2737b8d8ca1a8e14506c8f35233',
          duration: 165,
          beatCount: 187,
          createdAt: '2023-09-10'
        }
      ];
      
      setTemplates(mockTemplates);
      setFilteredTemplates(mockTemplates);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTemplates(templates);
      return;
    }
    
    const filtered = templates.filter(template => 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.trackName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredTemplates(filtered);
  }, [searchQuery, templates]);
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Browse Templates</h2>
        <p className="text-muted-foreground">
          Find the perfect beat-matched template for your TikTok video.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="bg-secondary/50 border border-secondary text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-3 transition-colors"
            placeholder="Search by song or template name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div 
              key={i}
              className="bg-card rounded-lg overflow-hidden border subtle-shadow animate-pulse-slow"
            >
              <div className="h-40 bg-secondary/60"></div>
              <div className="p-4">
                <div className="h-5 bg-secondary/80 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-secondary/60 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Link 
              to={`/templates/${template.id}`} 
              key={template.id}
              className="group template-item bg-card border subtle-shadow"
              onClick={() => toast.info(`Opening template: ${template.name}`)}
            >
              <div className="h-40 relative overflow-hidden">
                <img 
                  src={template.albumArt} 
                  alt={template.trackName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="template-overlay">
                  <button className="p-3 rounded-full bg-primary/90 text-primary-foreground">
                    <Play className="h-6 w-6" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center text-white">
                    <Music className="h-4 w-4 mr-1" />
                    <span className="text-xs truncate">{template.trackName} - {template.artist}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1 truncate">{template.name}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDuration(template.duration)}</span>
                  </div>
                  <div>{template.beatCount} beats</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-muted-foreground">
            Try a different search term or create a new template
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
