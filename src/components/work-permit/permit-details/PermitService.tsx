import React from "react";
import { Link } from "react-router-dom";
import type { Service } from "../../../assets/data/types";
import {
  Plane,
  Map,
  Activity,
  Mountain,
  Bed,
  Shield,
  ShieldCheck,
  Heart,
  Car,
  Wind,
  FileText,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface PermitServiceProps {
  service: Service[];
}

const PermitService: React.FC<PermitServiceProps> = ({ service }) => {
  const iconMap: Record<string, LucideIcon> = {
    Plane,
    Map,
    Activity,
    Mountain,
    Bed,
    Shield,
    ShieldCheck,
    Heart,
    Car,
    Wind,
    FileText,
  };

  return (
    <div className="mb-12">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2D1347]">
            Our Other Services
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Complete one-stop travel logistics by Trip Himalaya
          </p>
        </div>
        <Link
          to="/service"
          className="rounded-lg border border-pink-500 px-3 py-1.5 text-[11px] cursor-pointer hover:bg-pink-500 hover:text-white transition-colors font-bold text-pink-500 inline-flex items-center justify-center uppercase tracking-wide"
        >
          VIEW ALL SERVICES
        </Link>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-2">
        {service.slice(0, 6).map((item) => {
          const Icon = iconMap[item.icon] || FileText;
          return (
            <Link
              key={item.id || item.slug}
              to={`/service/${item.slug}`}
              className="relative w-full h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Background Image */}
              <img
                src={item.heroImage}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:via-black/45 transition-colors" />

              {/* Top Left Icon Badge */}
              <div className="absolute top-3 left-3 z-10">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:bg-pink-500 transition-all duration-300">
                  <Icon size={18} strokeWidth={2.2} />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white z-10">
                <p className="font-black text-xs sm:text-sm text-white group-hover:text-pink-200 transition-colors leading-tight">
                  {item.name.toUpperCase()}
                </p>
                {item.shortDesc && (
                  <p className="text-[10px] text-gray-200 leading-snug line-clamp-2 mt-1 hidden sm:block">
                    {item.shortDesc}
                  </p>
                )}
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-pink-400 group-hover:text-white group-hover:gap-1.5 transition-all mt-2">
                  <span>Explore</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PermitService;

