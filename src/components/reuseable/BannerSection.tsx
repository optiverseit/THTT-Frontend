import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  background: string;
  alt: string;
  title: string;
  heading: string;
  description: string;
}

const BannerSection: React.FC<Props> = ({
  background,
  alt,
  title,
  heading,
  description,
}) => {
  return (
    <section className="relative min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex items-center justify-center overflow-hidden pt-20 sm:pt-28 md:pt-32 pb-20">
      {/* Background Image */}
      <img
        src={background}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark overlay with soft gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-white/90" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl w-full mx-auto">
        <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-4 shadow-lg">
          {heading}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2 tracking-tight drop-shadow-md">
          {title}
        </h1>
        <div className="h-1 w-16 bg-[#E91E63] mx-auto rounded-full mb-3" />
        <p className="text-white/95 text-xs sm:text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed italic drop-shadow">
          "{description}"
        </p>
      </div>

      {/* Floating Page Widget on Right */}
      <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 flex-col items-center gap-1 shadow-xl border border-gray-100 z-10 text-[9px] font-bold text-gray-500">
        <button className="text-gray-400 hover:text-[#E91E63] transition-colors cursor-pointer">
          <ChevronUp size={14} />
        </button>
        <span className="text-[8px] tracking-widest uppercase text-gray-400">PAGE</span>
        <span className="font-black text-xs text-[#2D1347]">1/2</span>
        <button className="w-5 h-5 rounded-full bg-[#E91E63] text-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Smooth White Bottom Transition */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default BannerSection;
