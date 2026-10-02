import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Bed,
  Flame,
  Award,
  TrendingUp,
  Tag,
  Clock,
} from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import type { Hotel } from "../../assets/data/types";

export interface HotelBookingCardProps {
  hotel: Hotel;
  onBook?: (hotel: Hotel) => void;
  onDetails?: (hotel: Hotel) => void;
  priceUnit?: string;
}

// Fallback high-quality curated hotel & room interior images for slideshow (4-5 images)
const DEFAULT_SLIDESHOW_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200", // Exterior / Pool
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200", // Luxury Bedroom
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200", // Deluxe Suite
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200", // Modern Room Interior
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200", // Balcony / Resort view
];

export const HotelBookingCard: React.FC<HotelBookingCardProps> = ({
  hotel,
  onBook,
  onDetails,
  priceUnit = "per day",
}) => {
  const navigate = useNavigate();
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  // ── Slideshow images (fetched from hotel.gallery / hotel.images or database API, at least 4-5 images) ──
  const hotelImages: string[] = (() => {
    const list: string[] = [];
    if (hotel.image) list.push(hotel.image);
    if (hotel.gallery && Array.isArray(hotel.gallery)) {
      hotel.gallery.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    // Fill up to at least 4-5 images if less are provided, ensuring smooth 5s slide show
    let fallbackIdx = 0;
    while (list.length < 5 && fallbackIdx < DEFAULT_SLIDESHOW_IMAGES.length) {
      const fallbackImg = DEFAULT_SLIDESHOW_IMAGES[fallbackIdx];
      if (!list.includes(fallbackImg)) {
        list.push(fallbackImg);
      }
      fallbackIdx++;
    }
    return list;
  })();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 5-second automatic slideshow cycle (pauses temporarily when user manually interacts or hovers)
  const startSlideTimer = useCallback(() => {
    if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % hotelImages.length);
    }, 5000);
  }, [hotelImages.length]);

  useEffect(() => {
    startSlideTimer();
    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [startSlideTimer]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? hotelImages.length - 1 : prev - 1));
    startSlideTimer();
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % hotelImages.length);
    startSlideTimer();
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentSlide(index);
    startSlideTimer();
  };

  // ── Price calculation & Currency formatting ──
  const rate = nprPerOneDollar || 133;
  const baseNpr = Math.round((hotel.priceUSD || 120) * rate);
  const formattedStartingPrice = displayPrice(
    baseNpr,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );

  // ── Navigation handlers ──
  const handleCardClick = () => {
    if (onDetails) {
      onDetails(hotel);
    } else {
      navigate(`/hotel-details/${hotel.id}`);
    }
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const whatsappPhone = "9779851403761";
    const message =
      `Hello Trip Himalaya (Hotel Booking Team)! ` +
      `I am interested in reserving "${hotel.name}" in ${hotel.location || hotel.city}. ` +
      `Starting rate: ${formattedStartingPrice} ${priceUnit}. ` +
      `Please share room availability and package options.`;

    window.open(
      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ── Badges, Room Types, Availability, Dates ──
  const badgeLabel =
    hotel.badge ||
    (hotel.isFeatured ? "Featured" : hotel.rating >= 4.9 ? "Popular" : "Best Value");

  const getBadgeStyle = (b: string) => {
    const l = b.toLowerCase();
    if (l.includes("featured")) {
      return "bg-[#E91E63] text-white shadow-sm";
    }
    if (l.includes("popular")) {
      return "bg-[#2D1347] text-white shadow-sm";
    }
    if (l.includes("best") || l.includes("value")) {
      return "bg-white/95 text-[#2D1347] border border-gray-200/80 shadow-sm";
    }
    return "bg-[#2D1347] text-white shadow-sm";
  };

  const getBadgeIcon = (b: string) => {
    const l = b.toLowerCase();
    if (l.includes("featured")) return <Flame size={10} className="fill-white text-white" />;
    if (l.includes("popular")) return <TrendingUp size={10} className="text-white" />;
    if (l.includes("best") || l.includes("value")) return <Tag size={10} className="text-[#2D1347]" />;
    return <Award size={10} className="text-white" />;
  };

  // Room pills come directly from hotel.roomTypes — which HotelBookingDetailContent
  // always populates from the same pricing tier names shown in the booking modal.
  const roomTypes: string[] = hotel.roomTypes ?? [];

  // Single tier for this card (Luxury, Deluxe, etc. - only one in one card)
  const hotelTier =
    hotel.tier ||
    (hotel.category === "luxury"
      ? "Luxury"
      : hotel.category === "boutique"
      ? "Deluxe"
      : hotel.tierLabel?.toLowerCase().includes("luxury")
      ? "Luxury"
      : "Deluxe");

  // Default availability dates (e.g. Next 3 months window)
  const availableFrom = hotel.availableFrom || "Oct 10, 2026";
  const availableTo = hotel.availableTo || "Dec 31, 2026";

  // Stay duration: "Per Day" if day = 1 (or undefined), otherwise "X Days"
  const stayDays = hotel.days ?? (hotel as any).durationDays ?? 1;
  const durationDisplay = stayDays > 1 ? `${stayDays} Days` : "Per Day";


  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col md:flex-row bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100/90 transition-all duration-300 overflow-hidden group cursor-pointer md:min-h-[270px] lg:min-h-[280px]"
    >
      {/* =====================================================
          LEFT: 5-SECOND AUTO-SLIDING IMAGES (4-5 IMAGES)
      ====================================================== */}
      <div className="relative w-full h-[230px] md:w-72 lg:w-80 md:h-auto flex-shrink-0 overflow-hidden bg-gray-900 select-none">
        {/* Images with smooth crossfade */}
        {hotelImages.map((imgUrl, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
            }`}
          >
            <img
              src={imgUrl}
              alt={`${hotel.name} - slide ${idx + 1}`}
              className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle dark gradient for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
        ))}

        {/* Top Badges (in column) */}
        <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5 pointer-events-none">
          {/* Main Dynamic Badge (Featured, Popular, Best Value, etc.) */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${getBadgeStyle(
              badgeLabel
            )}`}
          >
            {getBadgeIcon(badgeLabel)}
            {badgeLabel}
          </span>

          {/* Hotel/Room Tier (Luxury, Deluxe, etc. - only one in one card) */}
          <span className="bg-white/95 backdrop-blur-xs text-[#2D1347] border border-white/80 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            {hotelTier}
          </span>
        </div>


        {/* Interactive Slide Controls (Arrows) */}
        <button
          type="button"
          onClick={handlePrevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-80 md:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={handleNextSlide}
          aria-label="Next Slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-80 md:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>

        {/* Slide Pagination Dots */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1">
          {hotelImages.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={(e) => handleDotClick(e, dotIdx)}
              aria-label={`Slide ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                dotIdx === currentSlide
                  ? "w-4 bg-[#E91E63]"
                  : "w-1.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* =====================================================
          MIDDLE: HOTEL INFORMATION & DETAILED ATTRIBUTES
      ====================================================== */}
      <div className="flex-1 min-w-0 p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
        <div className="min-w-0 space-y-2.5">
          {/* Rating & Highly Rated Tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.round(hotel.rating || 5)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-[11px] font-black text-[#2D1347]">
              {Number(hotel.rating || 5).toFixed(1)}
            </span>
          </div>

          {/* Hotel Name */}
          <h2
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="text-lg sm:text-xl font-extrabold text-[#200B3B] hover:text-[#E91E63] transition-colors cursor-pointer leading-snug line-clamp-1"
          >
            {hotel.name}
          </h2>

          {/* 2-3 Line Description */}
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
            {hotel.description ||
              `A prestigious property offering world-class hospitality, verified contract rates, and handcrafted comfort in ${hotel.location || hotel.city}.`}
          </p>

          {/* Rooms Header then Rooms Options Below */}
          <div className="pt-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-[#2D1347] uppercase tracking-wider">
              <Bed size={13} className="text-[#E91E63] flex-shrink-0" />
              <span>Rooms:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {roomTypes.map((rt, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#F8F6FC] text-[#3B145C] border border-[#E9E4F5] hover:border-pink-200 transition-colors shadow-2xs"
                >
                  {rt}
                </span>
              ))}
            </div>
          </div>

          {/* Little space, then Location & Stay Duration (Per Night or X Days) */}
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 flex-wrap pt-2.5">
            <span className="flex items-center gap-1.5 min-w-0 text-[#2D1347] font-bold">
              <MapPin size={13} className="text-[#E91E63] flex-shrink-0" />
              <span className="truncate">{hotel.location || hotel.city}</span>
            </span>
            <span className="flex items-center gap-1.5 text-gray-500 font-medium">
              <Clock size={13} className="text-[#E91E63] flex-shrink-0" />
              <span>{durationDisplay}</span>
            </span>
          </div>
        </div>

        {/* Available Dates */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-600">
          <Calendar size={13} className="text-[#E91E63] flex-shrink-0" />
          <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">
            Available Dates:
          </span>
          <span className="font-bold text-[#2D1347] text-xs">
            {availableFrom} – {availableTo}
          </span>
        </div>
      </div>

      {/* =====================================================
          RIGHT: PRICING & ACTION BUTTONS
      ====================================================== */}
      <div className="w-full md:w-56 lg:w-60 p-5 sm:p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 flex-shrink-0 text-center bg-white">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          STARTING FROM
        </span>

        <p className="text-2xl sm:text-3xl font-black text-[#E91E63] my-1">
          {formattedStartingPrice}
        </p>

        <span className="text-[9px] text-gray-400 font-medium">
          {priceUnit}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-2 w-full justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="flex-1 px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#E91E63] hover:bg-pink-600 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            VIEW DETAILS
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onBook) {
                onBook(hotel);
              } else {
                handleCardClick();
              }
            }}
            className="flex-1 px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#200B3B] hover:bg-[#2D1347] text-white shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            BOOK NOW
          </button>
        </div>

        {/* Instant Inquiry on WhatsApp */}
        <div
          onClick={handleWhatsAppInquiry}
          className="flex items-center justify-center gap-1.5 mt-2.5 text-[10px] font-bold text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer group/inq"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span className="group-hover/inq:underline uppercase tracking-wider">
            INSTANT INQUIRY
          </span>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingCard;
