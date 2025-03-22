
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import TemplateMaker from '../components/TemplateMaker';
import { Loader2 } from 'lucide-react';
import { generateMockBeats } from '../lib/beatDetection';

interface Template {
  id: string;
  name: string;
  trackName: string;
  artist: string;
  albumArt: string;
  duration: number;
  beatMarkers: number[];
}

const TemplateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch the template data from your API
    // This is a mock implementation
    setTimeout(() => {
      // Mock data based on the ID
      const mockTemplate: Template = {
        id: id || 't1',
        name: 'Energetic Dance Transitions',
        trackName: 'As It Was',
        artist: 'Harry Styles',
        albumArt: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0',
        duration: 180,
        beatMarkers: generateMockBeats(180, 120).map(beat => beat.time)
      };
      
      setTemplate(mockTemplate);
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading template...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!template) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Template Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The template you're looking for doesn't exist or has been removed.
            </p>
            <a 
              href="/templates" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium"
            >
              Browse Templates
            </a>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="py-10">
        <TemplateMaker template={template} />
      </div>
    </Layout>
  );
};

export default TemplateDetail;
