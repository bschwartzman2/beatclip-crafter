
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// In a real app, you would integrate with the Spotify API
// This is a simplified mock implementation

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number; // in seconds
  previewUrl: string | null;
}

interface SpotifySearchResult {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
}

export function useSpotify() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  
  const mockAuthorize = () => {
    setIsConnecting(true);
    
    // Simulate authorization process
    setTimeout(() => {
      setIsAuthorized(true);
      setIsConnecting(false);
      toast.success('Connected to Spotify');
    }, 1500);
  };
  
  const disconnect = () => {
    setIsAuthorized(false);
    toast.info('Disconnected from Spotify');
  };
  
  const searchTracks = (query: string): SpotifySearchResult => {
    const [results, setResults] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      // Mock API call with timeout
      const timeoutId = setTimeout(() => {
        try {
          // This is mock data - in a real app, you'd fetch from Spotify API
          const mockData: Track[] = [
            {
              id: '1',
              name: 'As It Was',
              artist: 'Harry Styles',
              album: "Harry's House",
              albumArt: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0',
              duration: 167,
              previewUrl: null
            },
            {
              id: '2',
              name: 'Blinding Lights',
              artist: 'The Weeknd',
              album: 'After Hours',
              albumArt: 'https://i.scdn.co/image/ab67616d0000b2731e4b0a19462eca5acecfd6ad',
              duration: 200,
              previewUrl: null
            },
            {
              id: '3',
              name: 'Bad Guy',
              artist: 'Billie Eilish',
              album: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
              albumArt: 'https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e',
              duration: 194,
              previewUrl: null
            },
            {
              id: '4',
              name: 'Uptown Funk',
              artist: 'Mark Ronson ft. Bruno Mars',
              album: 'Uptown Special',
              albumArt: 'https://i.scdn.co/image/ab67616d0000b273e419ccba0baa54a0d439b9d0',
              duration: 270,
              previewUrl: null
            },
            {
              id: '5',
              name: 'Dance Monkey',
              artist: 'Tones and I',
              album: 'The Kids Are Coming',
              albumArt: 'https://i.scdn.co/image/ab67616d0000b2737b8d8ca1a8e14506c8f35233',
              duration: 210,
              previewUrl: null
            }
          ];
          
          const filteredTracks = mockData.filter(track => 
            track.name.toLowerCase().includes(query.toLowerCase()) || 
            track.artist.toLowerCase().includes(query.toLowerCase())
          );
          
          setResults(filteredTracks);
          setIsLoading(false);
        } catch (err) {
          setError('Failed to search tracks');
          setIsLoading(false);
          console.error(err);
        }
      }, 800);
      
      return () => clearTimeout(timeoutId);
    }, [query]);
    
    return { tracks: results, isLoading, error };
  };
  
  return {
    isAuthorized,
    isConnecting,
    authorize: mockAuthorize,
    disconnect,
    searchTracks
  };
}
