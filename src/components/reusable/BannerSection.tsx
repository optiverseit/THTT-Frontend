import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  background: string;
  alt: string;
  title: string;
  heading: string;
  description: string;
  searchBar?: React.ReactNode;
  overlayGradient?: string;
  bottomGradient?: string;
  contentClassName?: string;
  sectionClassName?: string;
}

const BannerSection: React.FC<Props> = ({
  background,
  alt,
  title,
  heading,
  description,
  searchBar,
  overlayGradient,
  bottomGradient,
  contentClassName,
  sectionClassName,
}) => {
  return (
    <section className={`relative min-h-[420px] sm:min-h-[460px] md:min-h-[500px] flex items-center justify-center overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 ${sectionClassName || ""}`}>
      {/* Background Image */}
      <img
        src={background}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark overlay with soft gradient for contrast */}
      <div
        className={`absolute inset-0 ${
          overlayGradient ||
          "bg-gradient-to-b from-[#2D1347]/85 via-[#2D1347]/55 to-[#2D1347]/40"
        }`}
      />

      {/* Content Stack: 1. Title at Top, 2. Search Bar in Middle, 3. Description Below */}
      <div className={`relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center ${contentClassName || ""}`}>
        {/* 1. First circled: Tagline & Title placed more at the top */}
        <div className="flex flex-col items-center">
          <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
            {heading}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
            {title}
          </h1>
          <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-4 shadow-md" />
        </div>

        {/* 2. Second position below 1: Search Bar with equal vertical spacing */}
        {searchBar && (
          <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">
            {searchBar}
          </div>
        )}

        {/* 3. Third position just below search bar with equal vertical spacing */}
        {description && (
          <p className="text-white/95 text-sm sm:text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed italic drop-shadow-md px-4">
            "{description}"
          </p>
        )}
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

      {/* Bottom Transition */}
      <div
        className={`absolute bottom-0 left-0 w-full pointer-events-none ${
          bottomGradient || "h-12 bg-gradient-to-t from-white to-transparent"
        }`}
      />
    </section>
  );
};

export default BannerSection;
