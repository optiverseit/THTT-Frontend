import React, { useState, useEffect } from "react";

interface HeroBackgroundSliderProps {
  images: string[];
  alt?: string;
  interval?: number; // Defaults to 5000ms (5 seconds)
  overlayGradient?: string;
  className?: string;
  imgClassName?: string;
  objectPosition?: string;
  children?: React.ReactNode;
}

/**
 * Reusable Hero Background Slider.
 * - If 2 or more images: automatically slides every 5 seconds with a smooth 1-second crossfade.
 * - If 1 image: renders statically without sliding.
 * - Operates without manual buttons or touch controls as requested.
 * - Automatically preloads images for glitch-free transitions.
 */
export const HeroBackgroundSlider: React.FC<HeroBackgroundSliderProps> = ({
  images,
  alt = "Background",
  interval = 5000,
  overlayGradient,
  className = "absolute inset-0 overflow-hidden pointer-events-none",
  imgClassName = "w-full h-full object-cover object-center",
  objectPosition,
  children,
}) => {
  const validImages = images.filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload multiple images for smooth transitions
  useEffect(() => {
    if (validImages.length > 1) {
      validImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [validImages]);

  // Automatic slide interval when there are 2 or more images
  useEffect(() => {
    if (validImages.length < 2) {
      setCurrentIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [validImages.length, interval]);

  const activeIndex =
    validImages.length > 0 ? currentIndex % validImages.length : 0;

  return (
    <div className={className}>
      {validImages.map((src, idx) => {
        const isActive = idx === activeIndex;
        return (
          <img
            key={`${src}-${idx}`}
            src={src}
            alt={`${alt} ${validImages.length > 1 ? idx + 1 : ""}`}
            style={objectPosition ? { objectPosition } : undefined}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${imgClassName} ${
              isActive ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
            }`}
          />
        );
      })}

      {overlayGradient && (
        <div className={`absolute inset-0 ${overlayGradient}`} />
      )}

      {children}
    </div>
  );
};

export default HeroBackgroundSlider;

