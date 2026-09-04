import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { travelGuides } from '../data/mockData';
import { 
  Compass, 
  ChevronRight, 
  // Added missing ChevronDown
  ChevronDown,
  Info, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  Zap,
  Globe,
  FileText,
  Mountain,
  Wifi,
  // Added missing Phone
  Phone
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import ServicesStrip from '@/components/Layout/ServicesStrip';

const TravelGuidePage: React.FC = () => {
  const { guideSlug } = useParams<{ guideSlug: string }>();
  const navigate = useNavigate();
  
  // Default to the first guide if no slug is provided
  const currentGuide = travelGuides.find(g => g.slug === guideSlug) || travelGuides[0];

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Info;
    return <IconComponent size={24} />;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className={`sticky top-0 z-[60]`}>
                <ServicesStrip />
              </div>
      {/* Cinematic Hero Header */}
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
         
        <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-700">
            
            <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">Essential Information</span>
          
          <h1 className="text-5xl md:text-7xl lg:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
            Travel Guide
          </h1>
          <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-8 shadow-lg"></div>
          <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
            "Your complete handbook for a safe and memorable journey in Nepal."
          </p>
        </div>
      </section>

      <section className="py-12 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Main Guide Content Area */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100 min-h-[600px] animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-5 mb-10">
                   <div className="bg-[#D92671] p-4 rounded-2xl text-white shadow-lg">
                      {getIcon(currentGuide.icon)}
                   </div>
                   <div>
                      <h2 className="text-3xl md:text-4xl font-black text-[#2D1347] tracking-tight uppercase">{currentGuide.title}</h2>
                      <div className="h-1 w-12 bg-[#D92671] rounded-full mt-2"></div>
                   </div>
                </div>

                <div className="prose prose-lg prose-slate max-w-none">
                   <div className="text-slate-600 text-lg leading-[1.8] font-medium whitespace-pre-line">
                      {currentGuide.content}
                   </div>
                </div>

                

                {/* Call to action within guide */}
                <div className="mt-12 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="text-center md:text-left">
                      <h4 className="font-black text-[#2D1347] text-lg uppercase tracking-tight">Need more specific help?</h4>
                      <p className="text-slate-400 text-sm font-medium">Our travel experts are ready to assist you 24/7.</p>
                   </div>
                   <button className="bg-[#2D1347] text-white px-10 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-[#D92671] transition-all shadow-xl">
                      Contact Expert
                   </button>
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar Navigation (Matches user's requested style) */}
            <div className="lg:col-span-4">
               <div className="sticky top-32 space-y-8">
                  
                  {/* The Specific List Navigation Requested */}
                  <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    {/* Sidebar Header - Blue like in the image but with brand flair */}
                    <div className="bg-[#D92671] p-6 text-center border-b border-white/10">
                       <h3 className="text-white font-black text-lg flex items-center justify-center uppercase tracking-[0.1em]">
                          Travel Guide <ChevronDown size={18} className="ml-2" />
                       </h3>
                    </div>

                    <div className="flex flex-col">
                       {travelGuides.map((guide) => (
                         <button 
                           key={guide.id} 
                           onClick={() => navigate(`/travel-guide/${guide.slug}`)}
                           className={`w-full text-left px-8 py-4 border-b border-slate-100 last:border-b-0 transition-all group flex items-center justify-between ${
                             currentGuide.slug === guide.slug 
                               ? 'bg-slate-50 border-l-4 border-l-[#D92671]' 
                               : 'hover:bg-slate-50 hover:border-l-4 hover:border-l-[#D92671]'
                           }`}
                         >
                            <span className={`text-[13px] font-bold tracking-tight ${
                              currentGuide.slug === guide.slug ? 'text-[#D92671]' : 'text-slate-700 group-hover:text-[#D92671]'
                            }`}>
                               {guide.title}
                            </span>
                            <ChevronRight size={14} className={`${
                              currentGuide.slug === guide.slug ? 'text-[#0077C8]' : 'text-slate-300'
                            }`} />
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Booking Support Promo */}
                  <div className="bg-gradient-to-br from-[#D92671] to-[#E91E63] p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
                     <div className="absolute -top-10 -right-10 opacity-10"><LucideIcons.PhoneCall size={150} /></div>
                     <h3 className="text-2xl font-black mb-4 relative z-10 leading-tight">Got Questions?</h3>
                     <p className="text-white/70 text-sm font-medium mb-8 relative z-10 leading-relaxed">Planning a trip can be complex. Let us handle the details for you.</p>
                     <div className="space-y-3 relative z-10">
                        <a href="tel:+9779800000000" className="w-full bg-white text-[#D92671] py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center space-x-3 shadow-xl">
                           <Phone size={16} />
                           <span>Call Support</span>
                        </a>
                     </div>
                  </div>

               </div>
            </div>

          </div>

        </div>
      </section>
 
    </div>
  );
};

export default TravelGuidePage;