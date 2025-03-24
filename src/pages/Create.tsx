
import React, { useState } from 'react';
import Layout from '../components/Layout';
import TemplateCreator from '../components/TemplateCreator';
import TemplateMaker from '../components/TemplateMaker';

const Create = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  // This mock template data would normally come from your backend after saving a template
  const mockTemplate = {
    id: "template-123",
    name: "Dance Template",
    trackName: "Upbeat Dance Track",
    artist: "Dance Artist",
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D",
    duration: 180, // 3 minutes in seconds
    beatMarkers: [
      0, 2.1, 4.2, 6.3, 8.4, 10.5, 12.6, 14.7, 16.8, 18.9, 21.0,
      23.1, 25.2, 27.3, 29.4, 31.5, 33.6, 35.7, 37.8, 39.9, 42.0,
      44.1, 46.2, 48.3, 50.4, 52.5, 54.6, 56.7, 58.8, 60.9, 63.0,
      65.1, 67.2, 69.3, 71.4, 73.5, 75.6, 77.7, 79.8, 81.9, 84.0
    ],
  };
  
  // For demonstration, we can simulate selecting a template after creation
  const handleTemplateCreated = (template: any) => {
    setSelectedTemplate(template || mockTemplate);
  };
  
  return (
    <Layout>
      <div className="py-10">
        <div className="max-w-4xl mx-auto px-6 mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Create Beat-Synced Templates for any of your videos
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your favorite song and we'll analyze the beats to create the perfect TikTok template.
          </p>
        </div>
        
        {selectedTemplate ? (
          <TemplateMaker template={selectedTemplate} />
        ) : (
          <TemplateCreator onTemplateCreated={handleTemplateCreated} />
        )}
      </div>
    </Layout>
  );
};

export default Create;
