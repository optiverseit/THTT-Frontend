import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  Plane,
  Map,
  Activity,
  Mountain,
  Bed,
  Shield,
  Heart,
  Car,
  Wind,
  FileText,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
}

const servicesList: ServiceItem[] = [
  { id: "1", name: "AIR TICKET", slug: "/service/air-ticket", icon: Plane },
  { id: "2", name: "TOURS", slug: "/service/tours", icon: Map },
  { id: "3", name: "ADVENTURE ACTIVITIES", slug: "/service/activities", icon: Activity },
  { id: "4", name: "TREKKING", slug: "/service/trekking", icon: Mountain },
  { id: "5", name: "HOTEL BOOKING", slug: "/service/hotel-booking", icon: Bed },
  { id: "6", name: "VISA SERVICES", slug: "/service/visa-services", icon: Shield },
  { id: "7", name: "TRAVEL INSURANCE", slug: "/service/travel-insurance", icon: Heart },
  { id: "8", name: "VEHICLE RENTAL", slug: "/service/vehicle-rental", icon: Car },
  { id: "9", name: "HELI SERVICES", slug: "/service/heli-services", icon: Wind },
  { id: "10", name: "ONLINE SHRAM", slug: "/work-permit", icon: FileText },
];

const ServicesStrip: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Container aligned right beside the logo curve on desktop, and full-width below logo on mobile */}
      <div className="px-2.5 sm:px-0 sm:pl-[150px] md:pl-[162px] lg:pl-[172px] w-full pr-2.5 sm:pr-4 lg:pr-10">
        {/* Light-dark transparent frosted glass bar */}
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
          className="relative flex items-center w-full bg-black/40 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl overflow-hidden p-0.5 sm:p-1"
        >
          
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll services left"
            className="flex-shrink-0 w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-white/10 hover:bg-[#FF4FA3] text-white flex items-center justify-center transition-all cursor-pointer z-10 mr-1 border border-white/15"
          >
            <ChevronLeft size={13} />
          </button>

          {/* Scrollable Services List — flex-1 fills remaining space */}
          <div
            ref={scrollRef}
            className="flex items-center gap-1.5 overflow-x-auto scroll-smooth px-0.5 py-0.5 flex-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {servicesList.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.slug}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/15 bg-white/10 hover:bg-white hover:text-[#2D1347] text-white transition-all duration-200 flex-shrink-0 group cursor-pointer shadow-sm"
                >
                  <Icon size={11} className="text-white/90 group-hover:text-[#2D1347] transition-colors flex-shrink-0" />
                  <span className="text-[9px] sm:text-[9.5px] font-bold tracking-wider uppercase whitespace-nowrap">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll services right"
            className="flex-shrink-0 w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-white/10 hover:bg-[#FF4FA3] text-white flex items-center justify-center transition-all cursor-pointer z-10 ml-1 border border-white/15"
          >
            <ChevronRight size={13} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default ServicesStrip;
