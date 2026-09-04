import React from "react";
import { useNavigate } from "react-router-dom";
import { packages } from "../../../assets/data/mockData";
import PackageCard from "./PackageCard";
import type { Package } from "../../../assets/data/types";
import { ArrowRight } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  type?: Package["type"];
  category?: Package["category"];
  buttonText: string;
}

const PackageSection: React.FC<Props> = ({
  title,
  subtitle,
  type,
  category,
  buttonText,
}) => {
  const navigate = useNavigate();
  const filteredPackages = packages.filter((pkg) => {
    if (!pkg.isFeatured) return false;

    if (type && pkg.type !== type) return false;
    if (category && pkg.category !== category) return false;

    return true;
  });

  return (
    <section className="py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 sm:mb-10">
          <div>
            <p className="text-xs sm:text-sm text-pink-600 font-semibold mb-2 uppercase tracking-wider">
              {subtitle}
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#2D1347] tracking-tight leading-tight">
              {title}
            </h2>
          </div>

          <button
            onClick={() => navigate("/packages")}
            className={`text-xs sm:text-sm ${type === "tour" ? "bg-purple-50 text-purple-900 hover:bg-purple-100" : "bg-pink-50 text-pink-500 hover:bg-pink-100"} px-4 sm:px-5 py-2 rounded-full font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm`}
          >
            {buttonText} <ArrowRight size={15} />
          </button>
        </div>
        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {filteredPackages.slice(0, 4).map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackageSection;
