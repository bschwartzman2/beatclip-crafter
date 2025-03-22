
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TemplateGallery from '../components/TemplateGallery';
import { Search, Filter, Music } from 'lucide-react';

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'trending', name: 'Trending' },
    { id: 'dance', name: 'Dance' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'transition', name: 'Transition' }
  ];
  
  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Template Gallery</h1>
            <p className="text-muted-foreground">
              Browse and find the perfect template for your TikTok videos
            </p>
          </div>
          
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search by song or artist..."
              className="pl-10 pr-4 py-2 w-full md:w-64 rounded-full bg-background border focus:ring-primary focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-6 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <TemplateGallery 
          searchQuery={searchQuery} 
          category={selectedCategory} 
        />
      </div>
    </Layout>
  );
};

export default Templates;
