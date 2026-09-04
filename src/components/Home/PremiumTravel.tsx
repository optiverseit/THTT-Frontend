import React, { useRef } from "react";
import {
  Plane, Map, Activity, Mountain, Bed, Shield, Heart, Car, Wind, FileText,
  ChevronLeft, ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { services } from "../../assets/data/mockData";

const PremiumTravel: React.FC = () => {
  const iconMap: Record<string, LucideIcon> = {
    Plane, Map, Activity, Mountain, Bed, Shield, Heart, Car, Wind, FileText,
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <p className="text-xs sm:text-sm text-pink-600 font-semibold mb-2 uppercase tracking-wider">
            Your Adventure Starts Here
          </p>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#2D1347] tracking-tight leading-tight">
              Premium Travel Services
            </h2>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-purple-900" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-purple-900" />
              </button>
            </div>
          </div>
        </div>

        {/* Services scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 pb-3 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <div
                key={service.id}
                className="relative rounded-2xl overflow-hidden flex-shrink-0 group cursor-pointer"
                style={{ width: "clamp(150px, 30vw, 200px)", height: "clamp(200px, 30vw, 280px)" }}
              >
                <img
                  src={service.heroImage}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3">
                  <div className="w-9 h-9 bg-pink-600 rounded-xl flex items-center justify-center">
                    {Icon && <Icon className="w-4 h-4 text-white" />}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xs font-bold mb-1">{service.name}</h3>
                  <p className="text-[10px] text-gray-200 leading-relaxed line-clamp-2">
                    {service.shortDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PremiumTravel;
