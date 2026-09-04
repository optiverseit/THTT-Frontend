import React from "react";
import { MapPin, Clock, Star } from "lucide-react";
import type { Package } from "../../assets/data/types";
import { useNavigate } from "react-router-dom";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";

interface PackageCardProps {
  pkg: Package;
}

const PackageDetailsCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const navigate = useNavigate();

  /** Read global currency mode and live exchange rate */
  const { selectedCurrency, nprPerOneDollar } = useGlobalCurrency();

  /**
   * Extract the base USD price from the package price string (e.g. "$85" -> 85),
   * then convert to NPR by multiplying by the live exchange rate.
   * displayPrice() then formats it in the active currency.
   */
  const baseUSDPrice = Number(pkg.price?.replace(/[^0-9]/g, "") || 0);
  const baseNPRPrice = baseUSDPrice * nprPerOneDollar;
  const formattedStartingPrice = baseUSDPrice > 0
    ? displayPrice(baseNPRPrice, selectedCurrency, nprPerOneDollar)
    : "Contact Us";

  const handleCardClick = () => {
    navigate(`/details/${pkg.id}`);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const whatsappPhone = "9779800000003";
    const priceText = formattedStartingPrice !== "Contact Us" ? ` (Starting from ${formattedStartingPrice})` : "";
    const locationText = pkg.location ? ` in ${pkg.location}` : "";
    const message = `Hello Trip Himalaya! I would like to inquire about "${pkg.title}"${locationText}${priceText}. Duration: ${pkg.duration}. Please provide more details.`;
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col md:flex-row bg-white rounded-3xl shadow-sm hover:shadow-lg border border-gray-100/90 transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      {/* ── LEFT: IMAGE WITH FLOATING TAG ── */}
      <div className="relative w-full md:w-72 lg:w-80 min-h-[200px] md:min-h-[220px] flex-shrink-0 overflow-hidden bg-gray-100">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Category Badge */}
        <span className="absolute top-3.5 left-3.5 bg-white/95 text-[#2D1347] text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          {pkg.category === "international" ? "INTERNATIONAL" : "DOMESTIC"}
        </span>
      </div>

      {/* ── MIDDLE: PACKAGE INFO ── */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Star Rating & Highly Rated Tag */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase">
              HIGHLY RATED
            </span>
          </div>

          {/* Title */}
          <h2
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/details/${pkg.id}`);
            }}
            className="text-lg sm:text-xl font-extrabold text-[#200B3B] hover:text-[#E91E63] transition-colors cursor-pointer leading-snug"
          >
            {pkg.title}
          </h2>

          {/* Description */}
          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed font-medium">
            {pkg.description ||
              `A curated travel experience with expert planning, flexible options, and memorable adventures in ${
                pkg.location || "Nepal"
              }.`}
          </p>
        </div>

        {/* Location and Duration */}
        <div className="flex items-center gap-4 mt-4 pt-2 text-xs font-bold text-gray-600">
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-[#E91E63]" />
            <span>{pkg.location || "Nepal"}</span>
          </span>

          <span className="flex items-center gap-1">
            <Clock size={13} className="text-[#E91E63]" />
            <span>{pkg.duration}</span>
          </span>
        </div>
      </div>

      {/* ── RIGHT: PRICING & ACTIONS ── */}
      <div className="w-full md:w-56 lg:w-60 p-5 sm:p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 flex-shrink-0 text-center bg-white">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          STARTING FROM
        </span>

        <p className="text-2xl sm:text-3xl font-black text-[#E91E63] my-1">
          {formattedStartingPrice}
        </p>

        <span className="text-[9px] text-gray-400 font-medium">
          per person
        </span>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-2 w-full justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/details/${pkg.id}`);
            }}
            className="flex-1 px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#E91E63] hover:bg-pink-600 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            VIEW DETAILS
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/details/${pkg.id}`);
            }}
            className="flex-1 px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#200B3B] hover:bg-[#2D1347] text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            BOOK NOW
          </button>
        </div>

        {/* Instant Inquiry */}
        <div
          onClick={handleWhatsAppInquiry}
          className="flex items-center justify-center gap-1.5 mt-2.5 text-[10px] font-bold text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer group/inq"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span className="group-hover/inq:underline">INSTANT INQUIRY</span>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsCard;
