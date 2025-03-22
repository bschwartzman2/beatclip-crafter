
import React from 'react';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import { Check, Sparkles, Zap } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <Hero />
      
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create perfect TikTok videos that synchronize with any song in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border subtle-shadow hover-scale transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Select Any Song</h3>
              <p className="text-muted-foreground">
                Search for any song on Spotify, or browse our template gallery to find songs that match your vibe.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border subtle-shadow hover-scale transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Upload Your Clips</h3>
              <p className="text-muted-foreground">
                Add your video clips to the template. We'll automatically arrange them to match the beat of the song.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border subtle-shadow hover-scale transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Export & Share</h3>
              <p className="text-muted-foreground">
                Download your perfectly synchronized TikTok video or share it directly to TikTok in one click.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose BeatSync</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stand out on TikTok with videos that perfectly match the rhythm of any song.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard 
              icon={<Sparkles className="h-5 w-5" />}
              title="AI-Powered Beat Detection"
              description="Our advanced algorithm automatically identifies beats in any song with remarkable precision, ensuring perfect synchronization."
            />
            
            <FeatureCard 
              icon={<Check className="h-5 w-5" />}
              title="Simple & Intuitive"
              description="No technical skills required. Our streamlined interface makes it easy to create professional-quality videos in minutes."
            />
            
            <FeatureCard 
              icon={<Zap className="h-5 w-5" />}
              title="Lightning-Fast Processing"
              description="Generate and export your TikTok videos quickly, so you can post your content while it's still fresh and relevant."
            />
            
            <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>}
              title="Perfect for Creators"
              description="Whether you're a beginner or a professional, BeatSync helps you create content that stands out and engages your audience."
            />
          </div>
        </div>
      </section>
      
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create?</h2>
          <p className="text-muted-foreground mb-8">
            Start creating beat-synchronized TikTok videos that will capture your audience's attention and set you apart from the crowd.
          </p>
          <a 
            href="/create" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover-scale transition-all"
          >
            Create Your First Template
          </a>
        </div>
      </section>
    </Layout>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="flex p-6 rounded-lg bg-card border subtle-shadow hover-scale transition-all">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
        <div className="text-primary">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Index;
