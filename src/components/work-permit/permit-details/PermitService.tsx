import React from "react";
import type { Service } from "../../../assets/data/types";
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
    Heart,
    Car,
    Wind,
    FileText,
  };

  return (
    <div className="mb-10">
      <header className="flex justify-between">
        <h1 className="text-xl font-bold text-purple-950">
          Our Other Services
        </h1>
        <button className="rounded-md border border-pink-500 px-2 py-1 text-[10px] cursor-pointer hover:bg-pink-500 hover:text-white transition-colors font-semibold text-pink-500">
          VIEW ALL SERVICES
        </button>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mt-4">
        {service.slice(0, 5).map((item, index) => {
          const Icon = iconMap[item.icon];
          return (
            <div
              key={index}
              className="flex flex-col w-full justify-center items-center rounded-xl shadow-md sm:shadow-xl shadow-gray-200 bg-white px-3 py-4 sm:px-4 sm:py-6 cursor-pointer hover:shadow-pink-400/60 text-center transition-shadow"
            >
              <div className="rounded-xl bg-pink-400/20 p-2.5 sm:p-3">
                {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />}
              </div>
              <p className="font-bold text-purple-950 mt-2 text-xs sm:text-sm truncate w-full">
                {item.name.toUpperCase()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PermitService;
