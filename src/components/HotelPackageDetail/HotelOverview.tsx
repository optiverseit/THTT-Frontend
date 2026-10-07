import React from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle2, Clock, MapPin, Bed } from "lucide-react";
import HotelIncludesExclude from "./HotelIncludesExclude";
import HotelPricing from "./HotelPricing";
import { formatDescription } from "../../utils/formatDescription";

interface HotelOverviewProps {
  pkg: any;
  allItenary: any[];
}

const HotelOverview: React.FC = () => {
  const { pkg } = useOutletContext<HotelOverviewProps>();

  const amenities: string[] = Array.isArray(pkg.highlights) ? pkg.highlights : [];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* ── LEFT CONTENT (8 cols) ── */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Header Info */}
          <div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-[#200B3B] leading-tight">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <MapPin size={13} />
                <span className="text-gray-700">{pkg.location}</span>
              </span>

              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <Clock size={13} />
                <span className="text-gray-700">{pkg.duration}</span>
              </span>

              <span className="bg-pink-50 text-[#E91E63] px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                Hotel Stay
              </span>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 leading-relaxed font-medium space-y-2.5">
              <div
                dangerouslySetInnerHTML={{
                  __html: formatDescription(pkg.description) ||
                    `<p style="color:#4B5563;font-size:0.875em;line-height:1.7;">Experience the finest hospitality at ${pkg.title}. Designed with comfort, luxury, and unforgettable memories in mind.</p>`
                }}
              />
              <p>
                Guests can look forward to personalized concierge attention, daily gourmet breakfast, and seamless check-in assistance. Whether you are unwinding after Himalayan excursions or enjoying quiet moments amidst authentic heritage settings, our handpicked suites provide the pinnacle of comfort, discretion, and Nepali warmth.
              </p>
            </div>
          </div>

          {/* ── PRICING ON MOBILE (just below header info) ── */}
          <div id="pricing-section" className="lg:hidden">
            <HotelPricing pkg={pkg} />
          </div>

          {/* Amenities / Highlights Card */}
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-3 sm:space-y-4">
            <h2 className="flex items-center gap-2 sm:gap-2.5 text-base sm:text-xl font-black text-[#200B3B]">
              <CheckCircle2 size={18} className="text-[#E91E63]" />
              <span>Hotel Amenities &amp; Highlights</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
              {amenities.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm font-semibold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <HotelIncludesExclude />
        </div>

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols, desktop only) ── */}
        <div id="pricing-section-desktop" className="hidden lg:block lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <HotelPricing pkg={pkg} />
        </div>
      </div>
    </div>
  );

};

export default HotelOverview;
