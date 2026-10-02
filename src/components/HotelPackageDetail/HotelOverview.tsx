import React from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle2, Clock, MapPin, Bed } from "lucide-react";
import HotelIncludesExclude from "./HotelIncludesExclude";
import HotelPricing from "./HotelPricing";

interface HotelOverviewProps {
  pkg: any;
  allItenary: any[];
}

const HotelOverview: React.FC = () => {
  const { pkg } = useOutletContext<HotelOverviewProps>();

  const amenities: string[] = Array.isArray(pkg.highlights) ? pkg.highlights : [];

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

              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <Bed size={15} />
                <span className="text-gray-700">Hotel Stay</span>
              </span>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed font-medium space-y-2.5">
              <p>
                {pkg.description ||
                  `Experience the finest hospitality at ${pkg.title}. Designed with comfort, luxury, and unforgettable memories in mind.`}
              </p>
              <p>
                Guests can look forward to personalized concierge attention, daily gourmet breakfast, and seamless check-in assistance. Whether you are unwinding after Himalayan excursions or enjoying quiet moments amidst authentic heritage settings, our handpicked suites provide the pinnacle of comfort, discretion, and Nepali warmth.
              </p>
            </div>
          </div>

          {/* Amenities / Highlights Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-black text-[#200B3B]">
              <CheckCircle2 size={20} className="text-[#E91E63]" />
              <span>Hotel Amenities & Highlights</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {amenities.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <HotelIncludesExclude />
        </div>

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols) ── */}
        <div id="pricing-section" className="lg:col-span-4 lg:sticky lg:top-[135px] self-start space-y-6">
          <HotelPricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default HotelOverview;
