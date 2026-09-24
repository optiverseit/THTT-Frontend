import React from "react";
import { MapPin, Clock, Star, Tag } from "lucide-react";
import type { Package } from "../../assets/data/types";
import { useNavigate } from "react-router-dom";
import { getPackageCategoryName } from "../../utils/categoryUtils";
import {
  useGlobalCurrency,
  displayPrice,
} from "../../context/CurrencyContext";

interface PackageCardProps {
  pkg: Package;
  onBook?: (pkg: Package) => void;
  onDetails?: (pkg: Package) => void;
  priceUnit?: string;
}

const PackageDetailsCard: React.FC<PackageCardProps> = ({
  pkg,
  onBook,
  onDetails,
  priceUnit,
}) => {
  const navigate = useNavigate();

  /** Read global currency mode and live exchange rate */
  const {
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  /**
   * Extract the base USD price from the package price string,
   * then convert to NPR.
   */
  const baseNPRPrice = Number(
    String(pkg.price ?? "").replace(/[^0-9.]/g, "")
  );

  const formattedStartingPrice =
    baseNPRPrice > 0
      ? displayPrice(
        baseNPRPrice,
        selectedCurrency,
        nprPerOneDollar,
        nprPerOneINR
      )
      : "Contact Us";

  const handleCardClick = () => {
    if (onDetails) {
      onDetails(pkg);
    } else {
      navigate(`/details/${pkg.id}`);
    }
  };

  const handleWhatsAppInquiry = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const isTour = pkg.type === "tour";

    const teamName = isTour
      ? "Tours & Holidays Team"
      : "Trekking & Adventure Activity Team";

    const whatsappPhone = "9779851403761";

    const priceText =
      formattedStartingPrice !== "Contact Us"
        ? ` Starting price: ${formattedStartingPrice}.`
        : "";

    const locationText = pkg.location
      ? ` (${pkg.location})`
      : "";

    const durationText = pkg.duration
      ? ` - Duration: ${pkg.duration}.`
      : "";

    const message =
      `Hello Trip Himalaya (${teamName})! ` +
      `I am interested in "${pkg.title}"` +
      `${locationText}${durationText}${priceText} ` +
      `Please share availability and details.`;

    window.open(
      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        flex flex-col md:flex-row
        bg-white
        rounded-3xl
        shadow-sm hover:shadow-lg
        border border-gray-100/90
        transition-all duration-300
        overflow-hidden
        group
        cursor-pointer

        md:h-[260px]
        lg:h-[270px]
      "
    >
      {/* =====================================================
          LEFT: IMAGE
      ====================================================== */}

      <div
        className="
          relative
          w-full
          h-[220px]

          md:w-72
          md:h-full

          lg:w-80
          lg:h-full

          flex-shrink-0
          overflow-hidden
          bg-gray-100
        "
      >
        <img
          src={pkg.image}
          alt={pkg.title}
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            object-center
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* Floating Category Badge */}

        <span
          className="
            absolute
            top-3.5
            left-3.5
            bg-white/95
            text-[#2D1347]
            text-[10px]
            font-black
            px-3.5
            py-1
            rounded-full
            uppercase
            tracking-wider
            shadow-sm
          "
        >
          {(pkg as any).tierLabel ||
            (pkg as any).categoryLabel ||
            (pkg.adventureCategory
              ? `${pkg.adventureCategory.toUpperCase()} ADVENTURE`
              : pkg.type === "combo"
                ? "COMBO PACK"
                : pkg.category === "international"
                  ? "INTERNATIONAL"
                  : "DOMESTIC")}
        </span>
      </div>

      {/* =====================================================
          MIDDLE: PACKAGE INFORMATION
      ====================================================== */}

      <div
        className="
          flex-1
          min-w-0
          p-5
          sm:p-6
          flex
          flex-col
          justify-between
          overflow-hidden
        "
      >
        <div className="min-w-0">
          {/* Star Rating */}

          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map(
                (_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className="text-yellow-400 fill-yellow-400"
                  />
                )
              )}
            </div>

            <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase">
              HIGHLY RATED
            </span>
          </div>

          {/* Title */}

          <h2
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="
              text-lg
              sm:text-xl
              font-extrabold
              text-[#200B3B]
              hover:text-[#E91E63]
              transition-colors
              cursor-pointer
              leading-snug
              line-clamp-2
            "
          >
            {pkg.title}
          </h2>

          {/* Description */}

          <p
            className="
              text-xs
              text-gray-500
              mt-2
              line-clamp-2
              leading-relaxed
              font-medium
            "
          >
            {pkg.description ||
              `A curated travel experience with expert planning, flexible options, and memorable adventures in ${pkg.location || "Nepal"
              }.`}
          </p>
        </div>

        {/* Location, Duration and Category */}

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-2 text-xs font-bold text-gray-600">
          <span className="flex items-center gap-1 min-w-0">
            <MapPin
              size={13}
              className="text-[#E91E63] flex-shrink-0"
            />

            <span className="truncate">
              {pkg.location || "Nepal"}
            </span>
          </span>

          {pkg.duration && (
            <span className="flex items-center gap-1 flex-shrink-0">
              <Clock
                size={13}
                className="text-[#E91E63]"
              />

              <span>{pkg.duration}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 bg-pink-50 text-[#E91E63] px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-pink-100 flex-shrink-0">
            <Tag size={11} className="flex-shrink-0" />
            <span>{getPackageCategoryName(pkg)}</span>
          </span>
        </div>
      </div>

      {/* =====================================================
          RIGHT: PRICING & ACTIONS
      ====================================================== */}

      <div
        className="
          w-full

          md:w-56
          lg:w-60

          p-5
          sm:p-6

          flex
          flex-col
          items-center
          justify-center

          border-t
          md:border-t-0
          md:border-l
          border-gray-100

          flex-shrink-0
          text-center
          bg-white
        "
      >
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          STARTING FROM
        </span>

        <p className="text-2xl sm:text-3xl font-black text-[#E91E63] my-1">
          {formattedStartingPrice}
        </p>

        <span className="text-[9px] text-gray-400 font-medium">
          {priceUnit ||
            (pkg as any).priceUnit ||
            "per person"}
        </span>

        {/* Buttons */}

        <div className="flex items-center gap-2 mt-2 w-full justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              if (onDetails) {
                onDetails(pkg);
              } else {
                navigate(
                  `/details/${pkg.id}`
                );
              }
            }}
            className="
              flex-1
              px-3
              py-2
              rounded-full
              text-[11px]
              font-bold
              uppercase
              tracking-wider
              bg-[#E91E63]
              hover:bg-pink-600
              text-white
              shadow-xs
              transition-all
              cursor-pointer
              whitespace-nowrap
              active:scale-95
            "
          >
            VIEW DETAILS
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              if (onBook) {
                onBook(pkg);
              } else {
                navigate(
                  `/details/${pkg.id}`
                );
              }
            }}
            className="
              flex-1
              px-3
              py-2
              rounded-full
              text-[11px]
              font-bold
              uppercase
              tracking-wider
              bg-[#200B3B]
              hover:bg-[#2D1347]
              text-white
              shadow-xs
              transition-all
              cursor-pointer
              whitespace-nowrap
              active:scale-95
            "
          >
            BOOK NOW
          </button>
        </div>

        {/* Instant Inquiry */}

        <div
          onClick={handleWhatsAppInquiry}
          className="
            flex
            items-center
            justify-center
            gap-1.5
            mt-2.5
            text-[10px]
            font-bold
            text-gray-400
            hover:text-emerald-600
            transition-colors
            cursor-pointer
            group/inq
          "
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />

          <span className="group-hover/inq:underline">
            INSTANT INQUIRY
          </span>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsCard;