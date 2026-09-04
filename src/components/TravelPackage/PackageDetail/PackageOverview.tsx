import React from "react";
import { useOutletContext } from "react-router-dom";
import type { Package } from "../../../assets/data/types";
import { CheckCircle2, Clock, MapPin, Star } from "lucide-react";
import PackageTimeline from "./PackageTimeline";
import IncludesExclude from "./IncludesExclude";
import PackagePricing from "./PackagePricing";

interface PackageProp {
  pkg: Package;
  allItenary: { day: string; title: string; desc: string }[];
}

const PackageOverview: React.FC = () => {
  const { pkg } = useOutletContext<PackageProp>();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT CONTENT (8 cols) ── */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Info */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#200B3B] leading-tight">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <MapPin size={15} />
                <span className="text-gray-700">{pkg.location}</span>
              </span>

              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <Clock size={15} />
                <span className="text-gray-700">{pkg.duration}</span>
              </span>

              {pkg.difficulty && (
                <span className="bg-pink-50 text-[#E91E63] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {pkg.difficulty}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed font-medium">
              {pkg.description ||
                `Discover the breathtaking beauty and thrilling experiences of ${pkg.title}. Designed with safety, comfort, and unforgettable memories in mind.`}
            </p>
          </div>

          {/* Trip Highlights Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-black text-[#200B3B]">
              <CheckCircle2 size={20} className="text-[#E91E63]" />
              <span>Trip Highlights</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {pkg.highlights?.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline & Roadmap */}
          <PackageTimeline />

          {/* Inclusions & Exclusions */}
          <IncludesExclude />
        </div>

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols) ── */}
        <div id="pricing-section" className="lg:col-span-4 lg:sticky lg:top-[190px] self-start space-y-6">
          <PackagePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default PackageOverview;
