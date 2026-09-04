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
      <div className="flex w-full justify-between mt-4 items-center">
        {service.slice(0, 5).map((item, index) => {
          const Icon = iconMap[item.icon];
          return (
            <div
              key={index}
              className="flex flex-col w-60 justify-center items-center rounded-xl shadow-xl shadow-gray-200 bg-white px-8 py-6 cursor-pointer hover:shadow-pink-400/60"
            >
              <div className="rounded-xl bg-pink-400/20 p-3">
                {Icon && <Icon className="text-pink-500" />}
              </div>
              <p className="font-bold text-purple-950 mt-2 text-sm">
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
