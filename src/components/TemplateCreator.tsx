import React, { useState, useEffect } from 'react';
import { Play, Pause, Save, Loader2, Music2, BarChart2, Clock, Plus } from 'lucide-react';
import SpotifySearch from './SpotifySearch';
import AudioWaveform from './AudioWaveform';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Track {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
}

interface TemplateCreatorProps {
  onTemplateCreated?: (template: any) => void;
}

const TemplateCreator: React.FC<TemplateCreatorProps> = ({ onTemplateCreated }) => {
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [beatMarkers, setBeatMarkers] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('dance');
  
  const categories = [
    { id: 'dance', name: 'Dance' },
    { id: 'transition', name: 'Transition' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'travel', name: 'Travel' }
  ];
  
  useEffect(() => {
    if (selectedTrack) {
      analyzeBeat();
    }
  }, [selectedTrack]);
  
  const analyzeBeat = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockBeatMarkers = [];
      const songDuration = 180;
      let currentBeat = 0;
      
      while (currentBeat < songDuration) {
        const interval = 0.5 + (Math.random() * 0.1 - 0.05);
        currentBeat += interval;
        mockBeatMarkers.push(currentBeat);
      }
      
      setBeatMarkers(mockBeatMarkers);
      setIsAnalyzing(false);
      toast.success('Beat analysis complete', {
        description: `${mockBeatMarkers.length} beats detected`
      });
      
      if (selectedTrack) {
        setTemplateName(`${selectedTrack.name} Template`);
      }
    }, 2000);
  };
  
  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Template saved successfully');
      
      const newTemplate = {
        id: `template-${Date.now()}`,
        name: templateName,
        trackName: selectedTrack?.name || 'Unknown Track',
        artist: selectedTrack?.artist || 'Unknown Artist',
        albumArt: selectedTrack?.albumArt || '',
        beatMarkers,
        duration: 180,
        category: selectedCategory
      };
      
      console.log('Template data:', newTemplate);
      
      if (onTemplateCreated) {
        onTemplateCreated(newTemplate);
      } else {
        navigate('/templates/1');
      }
    }, 1500);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Create a New Template</h2>
        <p className="text-muted-foreground">
          Search for a song, and we'll analyze its beats to create a perfect TikTok template.
        </p>
      </div>
      
      {!selectedTrack ? (
        <div className="animate-fade-in space-y-8">
          <SpotifySearch onTrackSelect={setSelectedTrack} />
          
          <div className="pt-8 border-t">
            <h3 className="text-lg font-medium mb-4">Popular Songs for TikTok Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: '1', name: 'Dance Monkey', artist: 'Tones and I', albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bXVzaWN8ZW58MHx8MHx8fDA%3D' },
                { id: '2', name: 'Blinding Lights', artist: 'The Weeknd', albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D' },
                { id: '3', name: 'SICKO MODE', artist: 'Travis Scott', albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVzaWN8ZW58MHx8MHx8fDA%3D' }
              ].map(track => (
                <div 
                  key={track.id}
                  className="flex items-center p-3 rounded-lg border hover:bg-secondary/20 transition-colors cursor-pointer hover-scale"
                  onClick={() => setSelectedTrack(track)}
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden mr-3">
                    <img 
                      src={track.albumArt} 
                      alt={`${track.name} album cover`}
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{track.name}</h4>
                    <p className="text-xs text-muted-foreground">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center p-4 border rounded-lg bg-card subtle-shadow">
            <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden mr-4">
              <img 
                src={selectedTrack.albumArt} 
                alt={`${selectedTrack.name} album cover`}
                className="h-full w-full object-cover" 
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{selectedTrack.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedTrack.artist}</p>
            </div>
            <div className="flex-shrink-0">
              <button 
                className={`p-3 rounded-full ${
                  isPlaying 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                } hover:bg-primary/90 hover:text-primary-foreground transition-colors`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Analyzing beat pattern...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium">
                    Template Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Music2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 p-3 bg-secondary/50 border border-secondary rounded-lg focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Enter a name for your template"
                      value={templateName}
                      onChange={e => setTemplateName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-medium">
                    Template Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    Beat Analysis
                  </label>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    <span>{beatMarkers.length} beats detected</span>
                  </div>
                </div>
                <AudioWaveform 
                  trackId={selectedTrack.id}
                  beatMarkers={beatMarkers}
                  duration={180}


