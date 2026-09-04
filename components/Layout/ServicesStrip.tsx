import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { services } from '../../data/mockData';

const ServicesStrip: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [openServiceId, setOpenServiceId] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.7;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpenServiceId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute w-full z-[90] hidden md:block pl-[900px] lg:pl-[190px]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative" ref={wrapperRef}>
        <div className="flex items-center h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl overflow-hidden mt-2">

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="z-[101] p-2 h-full bg-black/20 text-white hover:bg-[#D92671] transition-all flex items-center justify-center border-r border-white/10"

            type="button"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth w-full px-4"

          >
            {services.map((service) => {
              const IconComponent = (Icons as any)[service.icon] || HelpCircle;
              const isOpen = openServiceId === service.id;

              return (
                <div key={service.id} className="relative flex-shrink-0 py-2">
                  {/* Clickable trigger (NO hover) */}
                  <button
                    type="button"
                    onClick={() => setOpenServiceId((prev) => (prev === service.id ? null : service.id))}
                    className="flex items-center space-x-2 px-3 py-1 rounded-full text-[9px] font-black tracking-widest text-white hover:bg-white hover:text-[#5D2A8E] transition-all duration-300 border border-white/10 hover:border-white"

                  >
                    <IconComponent size={12} className="opacity-70" />
                    <span className="whitespace-nowrap">{service.name.toUpperCase()}</span>
                  </button>

                  {/* Sub-services Popover (shown on click) */}
                  <div
                    className={`
                      absolute top-full left-0 mt-3 w-64 bg-white border border-slate-200
                      shadow-[0_25px_70px_rgba(45,19,71,0.3)] rounded-[2rem]
                      transition-all duration-300 transform z-[110] overflow-hidden
                      ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 pointer-events-none'}
                    `}
                    role="dialog"
                    aria-hidden={!isOpen}
                  >
                    <div className="p-6">
                      <ul className="space-y-3">
                        {service.subServices.map((sub, idx) => (
                          <li key={idx}>
                            {/* If sub-services should navigate, update href accordingly */}
                            <a
                              href={`#/services/${service.slug}`}
                              className="text-[11px] text-slate-700 font-bold flex items-center hover:text-[#5D2A8E] transition-colors"
                              onClick={() => setOpenServiceId(null)}
                            >
                              <span className="w-1.5 h-1.5 bg-[#D92671] rounded-full mr-3 shrink-0"></span>
                              {sub}
                            </a>
                          </li>
                        ))}
                      </ul>

                      {/* Optional: direct CTA */}
                      <a
                        href={`#/services/${service.slug}`}
                        className="mt-5 inline-flex w-full justify-center rounded-full bg-[#5D2A8E] px-4 py-2 text-[10px] font-black tracking-widest text-white hover:brightness-110 transition"
                        onClick={() => setOpenServiceId(null)}
                      >
                        VIEW SERVICE
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => scroll('right')}
            className="z-[101] p-3 h-full bg-black/20 text-white hover:bg-[#D92671] transition-all flex items-center justify-center border-l border-white/10"
            type="button"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesStrip;
