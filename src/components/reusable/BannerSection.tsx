import React, { useState, useEffect, useMemo } from "react";

interface Props {
  background?: string;
  backgrounds?: string[];
  alt: string;
  title: string;
  heading: string;
  description: string;
  searchBar?: React.ReactNode;
  overlayGradient?: string;
  bottomGradient?: string;
  contentClassName?: string;
  sectionClassName?: string;
  autoSlideInterval?: number; // Defaults to 5000ms (5 seconds)
}

const BannerSection: React.FC<Props> = ({
  background,
  backgrounds,
  alt,
  title,
  heading,
  description,
  searchBar,
  overlayGradient,
  bottomGradient,
  contentClassName,
  sectionClassName,
  autoSlideInterval = 5000,
}) => {
  // Resolve image list: prioritize backgrounds array if provided, fallback to single background
  const images = useMemo(() => {
    if (backgrounds && backgrounds.length > 0) {
      return backgrounds.filter(Boolean);
    }
    if (background) {
      return [background];
    }
    return [];
  }, [background, backgrounds]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload multiple images for butter-smooth automatic crossfade transitions
  useEffect(() => {
    if (images.length > 1) {
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [images]);

  // Automatic slide interval when there are 2 or more images (default: 5 seconds)
  useEffect(() => {
    if (images.length < 2) {
      setCurrentIndex(0);
      return;
    }

    const intervalTime = autoSlideInterval > 0 ? autoSlideInterval : 5000;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [images.length, autoSlideInterval]);

  const activeIndex = images.length > 0 ? currentIndex % images.length : 0;

  return (
    <section
      className={`relative min-h-[420px] sm:min-h-[460px] md:min-h-[500px] flex items-center justify-center overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 ${sectionClassName || ""
        }`}
    >
      {/* Background Image(s) / Automatic Slider */}
      {images.map((imgSrc, index) => {
        const isActive = index === activeIndex;
        return (
          <img
            key={`${imgSrc}-${index}`}
            src={imgSrc}
            alt={`${alt} ${images.length > 1 ? index + 1 : ""}`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
              }`}
          />
        );
      })}

      {/* Dark overlay with soft gradient for contrast */}
      <div
        className={`absolute inset-0 z-0 ${overlayGradient ||
          "bg-gradient-to-b from-[#2D1347]/85 via-[#2D1347]/55 to-[#2D1347]/40"
          }`}
      />

      {/* Content Stack: 1. Title at Top, 2. Search Bar in Middle, 3. Description Below */}
      <div
        className={`relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center ${contentClassName || ""
          }`}
      >
        {/* 1. Tagline & Title */}
        <div className="flex flex-col items-center">
          <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
            {heading}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
            {title}
          </h1>
          <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-4 shadow-md" />
        </div>

        {/* 2. Search Bar with equal vertical spacing */}
        {searchBar && (
          <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">
            {searchBar}
          </div>
        )}

        {/* 3. Description Below */}
        {description && (
          <p className="text-white/95 text-sm sm:text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed italic drop-shadow-md px-4">
            "{description}"
          </p>
        )}
      </div>

      {/* Bottom Transition */}
      <div
        className={`absolute bottom-0 left-0 w-full pointer-events-none z-10 ${bottomGradient || "h-12 bg-gradient-to-t from-white to-transparent"
          }`}
      />
    </section>
  );
};

export default BannerSection;
