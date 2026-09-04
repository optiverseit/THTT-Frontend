
import React, { useState } from 'react';
import { galleryItems } from '../data/mockData';
import { Maximize2, X } from 'lucide-react';
import ServicesStrip from '@/components/Layout/ServicesStrip';

const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'tour' | 'vehicle' | 'activity' | 'office'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const filterTabs: { id: typeof activeFilter; label: string }[] = [
    { id: 'all', label: 'All Photos' },
    { id: 'tour', label: 'Tours' },
    { id: 'vehicle', label: 'Vehicles' },
    { id: 'activity', label: 'Activities' },
    { id: 'office', label: 'Office & Team' },
  ];
 
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className={`sticky top-0 z-[60]`}>
          <ServicesStrip />
        </div>
        
      <section className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
          alt="Gallery" 
          className="absolute inset-0 w-full h-full object-cover"
        />
         
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50"></div>
      </div>
 
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-700">
          <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">
            Our Visual Journey
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
           Gallery
          </h1>
          <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-8 shadow-lg"></div>
          <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
            "A glimpse into our tours, and the beauty of Nepal. Dive into our world through these captured moments."
          </p>
        </div>

        {/* Floating Stats or Element can be added here if needed */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeFilter === tab.id 
                  ? 'bg-brand text-white shadow-lg' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="relative group cursor-pointer break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              onClick={() => setSelectedImage(item.image)}
            >
              <img src={item.image} alt={item.title} className="w-full h-auto" />
              <div className="absolute inset-0 bg-brand/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <Maximize2 size={32} className="mb-2" />
                <span className="font-bold">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-accent transition-colors">
            <X size={40} />
          </button>
          <img src={selectedImage} alt="Full View" className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in duration-300" />
        </div>
      )}
    </div>
  );
};

export default Gallery;
