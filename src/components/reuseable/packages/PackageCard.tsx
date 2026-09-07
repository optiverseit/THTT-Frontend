import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Package } from "../../../assets/data/types";
import {
  Clock,
  MapPin,
  CheckCircle2,
  MessageCircle,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../../context/CurrencyContext";
import BookingModal from "./BookingModal";

interface Props {
  pkg: Package;
}

const PackageCard: React.FC<Props> = ({ pkg }) => {
  const navigate = useNavigate();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  // Dynamic currency price calculation
  const baseUSDPrice = Number(pkg.price?.replace(/[^0-9]/g, "") || 0);
  const baseNPRPrice = baseUSDPrice * nprPerOneDollar;
  const formattedPrice =
    baseUSDPrice > 0
      ? displayPrice(baseNPRPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR)
      : pkg.price || "On Request";

  // Navigate to package details page
  const handleCardClick = () => {
    navigate(`/details/${pkg.id}`);
  };

  // Open WhatsApp for direct package inquiry
  const handleInquiryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const whatsappPhone = "9779800000003";
    const priceText = formattedPrice ? ` (${formattedPrice})` : "";
    const locationText = pkg.location ? ` in ${pkg.location}` : "";
    const durationText = pkg.duration ? ` - Duration: ${pkg.duration}` : "";

    const message = `Hello Trip Himalaya! I would like to inquire about the "${pkg.title}" package${locationText}${durationText}${priceText}. Please share more details and availability.`;
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Open Booking Modal
  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookingModalOpen(true);
  };

  // Determine category badge text & color
  const getCategoryBadge = () => {
    if (pkg.type === "trek") return "Himalayan Trek";
    if (pkg.category === "international") return "International";
    if (pkg.category === "domestic") return "Domestic Tour";
    if (pkg.type === "activity") return "Adventure";
    return "Special Tour";
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
      >
        <div>
          {/* ── IMAGE & BADGES ── */}
          <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
            <img
              src={pkg.image}
              alt={pkg.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              <span
                className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md ${
                  pkg.type === "trek"
                    ? "bg-[#2D1347]"
                    : "bg-[#E11D48]"
                }`}
              >
                {getCategoryBadge()}
              </span>

              {pkg.isFeatured && (
                <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-md">
                  Featured
                </span>
              )}
            </div>

            {/* Bottom Right Duration Pill */}
            {pkg.duration && (
              <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Clock size={13} className="text-pink-400" />
                <span>{pkg.duration}</span>
              </div>
            )}
          </div>

          {/* ── CARD CONTENT ── */}
          <div className="p-5 sm:p-6">
            {/* Title & Price Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-black text-[#2D1347] group-hover:text-[#E11D48] transition-colors leading-snug line-clamp-2">
                {pkg.title}
              </h3>
              {pkg.price && (
                <span className="font-extrabold text-xs sm:text-sm text-[#E11D48] whitespace-nowrap bg-pink-50 px-2.5 py-1 rounded-xl flex-shrink-0">
                  {formattedPrice}
                </span>
              )}
            </div>

            {/* Location */}
            {pkg.location && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-3.5">
                <MapPin size={13} className="text-[#E11D48] flex-shrink-0" />
                <span className="truncate">{pkg.location}</span>
              </div>
            )}

            {/* Highlights List */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <div className="space-y-1.5 mb-4">
                {pkg.highlights.slice(0, 3).map((hl, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                    <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1 leading-tight">{hl}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── CARD ACTIONS FOOTER ── */}
        <div className="p-5 sm:p-6 pt-0 border-t border-gray-100 mt-auto space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp Inquiry Button */}
            <button
              type="button"
              onClick={handleInquiryClick}
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <MessageCircle size={14} />
              <span>Inquiry</span>
            </button>

            {/* Book Now Button */}
            <button
              type="button"
              onClick={handleBookingClick}
              className="bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <CalendarCheck size={14} className="text-pink-400" />
              <span>Get Book</span>
            </button>
          </div>

          {/* Full Details Button */}
          <button
            type="button"
            onClick={handleCardClick}
            className="w-full bg-gray-50 hover:bg-pink-50/70 border border-gray-200/80 hover:border-pink-300 text-[#2D1347] hover:text-[#E11D48] font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <span>Full Details</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* ── BOOKING MODAL POPUP ── */}
      <BookingModal
        pkg={pkg}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};

export default PackageCard;
