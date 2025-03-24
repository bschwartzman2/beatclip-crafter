
import React from 'react';
import Layout from '../components/Layout';
import TemplateCreator from '../components/TemplateCreator';

const Create = () => {
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
        <TemplateCreator />
      </div>
    </Layout>
  );
};

export default Create;
