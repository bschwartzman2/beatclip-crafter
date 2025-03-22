
import React, { useState } from 'react';
import { Search, Music, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Track {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
}

interface SpotifySearchProps {
  onTrackSelect: (track: Track) => void;
}

const SpotifySearch: React.FC<SpotifySearchProps> = ({ onTrackSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  
  // Mock search function - this would be replaced with actual Spotify API
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock data - this would be replaced with actual Spotify API response
      const mockTracks: Track[] = [
        {
          id: '1',
          name: 'As It Was',
          artist: 'Harry Styles',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0'
        },
        {
          id: '2',
          name: 'Blinding Lights',
          artist: 'The Weeknd',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b2731e4b0a19462eca5acecfd6ad'
        },
        {
          id: '3',
          name: 'Bad Guy',
          artist: 'Billie Eilish',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e'
        },
        {
          id: '4',
          name: 'Uptown Funk',
          artist: 'Mark Ronson ft. Bruno Mars',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b273e419ccba0baa54a0d439b9d0'
        },
        {
          id: '5',
          name: 'Dance Monkey',
          artist: 'Tones and I',
          albumArt: 'https://i.scdn.co/image/ab67616d0000b2737b8d8ca1a8e14506c8f35233'
        }
      ].filter(track => 
        track.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setTracks(mockTracks);
      setIsLoading(false);
      
      if (mockTracks.length === 0) {
        toast.error('No songs found matching your search');
      }
    }, 1000);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="bg-secondary/50 border border-secondary text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 pr-20 p-3 transition-colors"
            placeholder="Search Spotify for a song..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            required
          />
          <button
            type="submit"
            className="absolute right-2.5 bottom-2 top-2 px-4 py-1 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tracks.length > 0 ? (
          tracks.map(track => (
            <div 
              key={track.id} 
              className="flex items-center p-3 border rounded-lg bg-card hover:bg-card/80 hover-scale cursor-pointer transition-all"
              onClick={() => {
                onTrackSelect(track);
                toast.success(`Selected: ${track.name} by ${track.artist}`);
              }}
            >
              <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden mr-4">
                <img 
                  src={track.albumArt} 
                  alt={`${track.name} album cover`} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.name}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>
              <div className="flex-shrink-0">
                <button className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                  <Music className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : searchQuery ? (
          <div className="text-center py-8 text-muted-foreground">
            No songs found matching your search
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SpotifySearch;
