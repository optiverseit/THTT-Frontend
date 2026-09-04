import React from "react";
import { useNavigate } from "react-router-dom";
import type { Package } from "../../../assets/data/types";
import { CircleCheck, MessageCircle } from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../../context/CurrencyContext";

interface Props {
  pkg: Package;
}

const PackageCard: React.FC<Props> = ({ pkg }) => {
  const navigate = useNavigate();
  const { selectedCurrency, nprPerOneDollar } = useGlobalCurrency();
  const baseUSDPrice = Number(pkg.price?.replace(/[^0-9]/g, "") || 0);
  const baseNPRPrice = baseUSDPrice * nprPerOneDollar;
  const formattedPrice = baseUSDPrice > 0
    ? displayPrice(baseNPRPrice, selectedCurrency, nprPerOneDollar)
    : pkg.price;

  // Navigate to package details page
  const handleCardClick = () => {
    navigate(`/details/${pkg.id}`);
  };

  // Open WhatsApp for direct package inquiry
  const handleInquiryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const whatsappPhone = "9779800000003"; // Travel Team WhatsApp
    const priceText = formattedPrice ? ` (Starting from ${formattedPrice})` : "";
    const locationText = pkg.location ? ` in ${pkg.location}` : "";
    const durationText = pkg.duration ? ` - Duration: ${pkg.duration}` : "";
    
    const message = `Hello Trip Himalaya! I would like to inquire about the "${pkg.title}" package${locationText}${durationText}${priceText}. Please share more details and availability.`;
    
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer group flex flex-col transform hover:-translate-y-1 duration-300"
    >
      {/* Image */}
      <div className="relative flex-shrink-0 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-48 sm:h-64 md:h-70 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Duration badge */}
        <span
          className={`absolute top-3 left-3 sm:top-4 sm:left-4 ${
            pkg.type === "trek" ? "bg-purple-900" : "bg-pink-500"
          } text-white text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full font-bold shadow`}
        >
          {pkg.duration}
        </span>
        {/* Price */}
        {pkg.price && (
          <span
            className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white ${
              pkg.type === "tour" ? "text-purple-900" : "text-pink-500"
            } text-xs sm:text-sm px-3 sm:px-4 py-1 rounded-full font-bold shadow-md`}
          >
            From {formattedPrice}
          </span>
        )}
      </div>

      {/* Content — flex-1 ensures it always takes remaining space */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <h3 className="font-bold text-base sm:text-lg text-purple-950 mb-2 sm:mb-3 group-hover:text-pink-600 transition-colors">
          {pkg.title}
        </h3>

        {/* Highlights */}
        {pkg.highlights && (
          <ul className="space-y-1 sm:space-y-2 text-[11px] sm:text-xs text-gray-600 font-semibold mb-4 sm:mb-6">
            {pkg.highlights.slice(0, 3).map((item, i) => (
              <li key={i} className="flex gap-2 items-center">
                <span className="text-pink-500 flex-shrink-0">
                  <CircleCheck size={14} />
                </span>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Inquiry Button pinned to bottom */}
        <div className="mt-auto pt-2">
          <button
            type="button"
            onClick={handleInquiryClick}
            className={`w-full ${
              pkg.type === "tour"
                ? "bg-gradient-to-r from-purple-700 to-pink-500 hover:from-purple-800 hover:to-pink-600"
                : "bg-purple-900 hover:bg-purple-950"
            } text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer`}
          >
            <MessageCircle size={16} />
            <span>INQUIRE NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
