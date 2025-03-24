import React, { useEffect, useRef } from 'react';
import { ArrowRight, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const waveRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!waveRef.current) return;
    
    const bars = Array.from(waveRef.current.children) as HTMLElement[];
    
    bars.forEach((bar, i) => {
      bar.style.animationDelay = `${i * 0.05}s`;
      bar.style.height = `${Math.floor(Math.random() * 50) + 20}%`;
    });
  }, []);
  
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background to-secondary/20 px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[15%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center z-10 animate-fade-in">
        <div className="inline-flex items-center justify-center px-3 py-1 mb-8 border rounded-full text-sm font-medium text-muted-foreground backdrop-blur-sm bg-background/50">
          <Music className="h-4 w-4 mr-2" />
          <span>Perfect TikTok videos, matched to any beat</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
          Create Beat-Synced <br className="hidden sm:inline" /> Templates for any of your videos
        </h1>
        
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Select any song from Spotify, and we'll automatically create a template that matches the beat.
          Just add your clips and create the perfect TikTok video.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/create" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover-scale transition-all-cubic"
          >
            Create Your First Template
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          
          <Link 
            to="/templates" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover-scale transition-all-cubic"
          >
            Browse Templates
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="wave-container" ref={waveRef}>
          {Array.from({ length: 120 }).map((_, i) => (
            <div 
              key={i} 
              className="wave-bar"
              style={{ 
                opacity: Math.random() * 0.5 + 0.2,
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
