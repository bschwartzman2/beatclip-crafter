
import React, { useState, useEffect } from 'react';
import { Play, Pause, Save, Loader2 } from 'lucide-react';
import SpotifySearch from './SpotifySearch';
import AudioWaveform from './AudioWaveform';
import { toast } from 'sonner';

interface Track {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
}

const TemplateCreator = () => {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [beatMarkers, setBeatMarkers] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (selectedTrack) {
      analyzeBeat();
    }
  }, [selectedTrack]);
  
  const analyzeBeat = () => {
    setIsAnalyzing(true);
    
    // Simulate beat detection
    setTimeout(() => {
      // Generate mock beat markers (in seconds)
      const mockBeatMarkers = [];
      // Assume a song of 3 minutes (180 seconds) with beats every ~0.5 seconds
      const songDuration = 180;
      let currentBeat = 0;
      
      while (currentBeat < songDuration) {
        // Add some randomness to the beat intervals to simulate a real song
        const interval = 0.5 + (Math.random() * 0.1 - 0.05);
        currentBeat += interval;
        mockBeatMarkers.push(currentBeat);
      }
      
      setBeatMarkers(mockBeatMarkers);
      setIsAnalyzing(false);
      toast.success('Beat analysis complete');
      
      // Set a default template name based on the track
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
    
    // Simulate saving template
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Template saved successfully');
      
      // Here you would normally save the template data to your backend
      console.log('Template data:', {
        name: templateName,
        track: selectedTrack,
        beatMarkers,
      });
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
        <div className="animate-fade-in">
          <SpotifySearch onTrackSelect={setSelectedTrack} />
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
              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Template Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-secondary/50 border border-secondary rounded-lg focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter a name for your template"
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Beat Analysis
                </label>
                <AudioWaveform 
                  trackId={selectedTrack.id}
                  beatMarkers={beatMarkers}
                  duration={180} // Mock 3 minute duration
                />
                <p className="text-xs text-muted-foreground">
                  {beatMarkers.length} beats detected
                </p>
              </div>
              
              <div className="pt-4">
                <button
                  className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  onClick={handleSaveTemplate}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving Template...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Template
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateCreator;
