import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Share2, Eye, X, ChevronLeft, ChevronRight, Check, Star, MapPin, Clock } from "lucide-react";
import type { Package } from "../../../assets/data/types";
import { useGlobalCurrency } from "../../../context/CurrencyContext";

interface PackageProp {
  pkg: Package;
}

const PackageImageGrid: React.FC<PackageProp> = ({ pkg }) => {
  const { selectedCurrency, nprPerOneDollar } = useGlobalCurrency();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  /**
   * Extracts the base USD price from the package price string (e.g. "$85" -> 85).
   * Used to compute the NPR equivalent for the "STARTS FROM" label.
   */
  const basePackagePriceInUSD = Number(pkg.price?.replace(/[^0-9]/g, "") || 85);

  /**
   * NPR equivalent of the base price calculated using the live exchange rate.
   */
  const calculatedNPRPrice = basePackagePriceInUSD * nprPerOneDollar;

  /**
   * The formatted "STARTS FROM" price string to display in the sub-nav.
   * In Nepali mode: shows NPR price. In Foreigner mode: shows USD price.
   */
  const startsFromDisplayPrice =
    selectedCurrency === "nepali"
      ? `NPR ${Math.round(calculatedNPRPrice).toLocaleString("en-IN")}`
      : pkg.price || `$${basePackagePriceInUSD}`;

  const navigate = useNavigate();
  const location = useLocation();

  const galleryImages = pkg.gallery && pkg.gallery.length >= 5 ? pkg.gallery : [
    pkg.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
  ];

  const outletItems = [
    { name: "OVERVIEW", path: `/details/${pkg.id}` },
    { name: "POLICIES", path: `/details/${pkg.id}/policies` },
    { name: "FAQS", path: `/details/${pkg.id}/faqs` },
    { name: "TESTIMONIES", path: `/details/${pkg.id}/testimonies` },
  ];

  const isTabActive = (tabPath: string) => {
    if (tabPath === `/details/${pkg.id}`) {
      return location.pathname === `/details/${pkg.id}` || location.pathname === `/details/${pkg.id}/`;
    }
    return location.pathname.startsWith(tabPath);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="w-full bg-[#FBFBFE]">
      {/* ── 1. TOP HERO IMAGE (Starts at Top behind Navbar) ── */}
      <div className="w-full relative">
        <div
          onClick={() => openLightbox(0)}
          className="w-full h-[400px] sm:h-[470px] md:h-[520px] lg:h-[560px] overflow-hidden cursor-pointer group bg-gray-900 relative"
        >
          <img
            src={galleryImages[0]}
            alt={`${pkg.title} Main View`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Dark gradient for navbar & title readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/95 via-[#2D1347]/45 to-black/40 pointer-events-none" />

          {/* ── CENTERED HERO CONTENT (Shifted Higher Up) ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-10 sm:pt-14 md:pt-18 pb-24 sm:pb-28 pointer-events-none z-10 max-w-4xl mx-auto">
            {/* Stars & Rating Pill */}
            <div className="inline-flex items-center gap-1.5 mb-2.5 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <span className="text-white font-extrabold text-xs ml-1">
                {pkg.rating || 4.9}
              </span>
              <span className="text-white/80 text-[10px] sm:text-xs font-semibold">
                ({pkg.testimonies?.length || 1} reviews)
              </span>
            </div>

            {/* Package Title (Matching Image 1 Font & Style) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2 tracking-tight drop-shadow-md leading-tight">
              {pkg.title}
            </h1>

            {/* Accent Line */}
            <div className="h-1 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-3 shadow-md" />

            {/* Location & Duration Tag */}
            <div className="inline-flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold text-white drop-shadow-md bg-black/40 backdrop-blur-md px-5 py-1.5 rounded-full border border-white/15">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#E91E63]" />
                <span>{pkg.location || "Sarangkot, Pokhara"}</span>
              </span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#E91E63]" />
                <span>{pkg.duration || "30-45 Mins"}</span>
              </span>
            </div>
          </div>

          {/* Floating Action Buttons (Heart + Share) */}
          <div className="absolute top-36 sm:top-40 md:top-42 left-6 sm:left-10 flex items-center gap-2.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="p-2.5 sm:p-3 rounded-full bg-white/95 backdrop-blur-md shadow-lg text-gray-700 hover:text-[#E91E63] transition-all cursor-pointer hover:scale-105"
              aria-label="Wishlist"
            >
              <Heart
                size={17}
                className={isLiked ? "fill-[#E91E63] text-[#E91E63]" : ""}
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="p-2.5 sm:p-3 rounded-full bg-white/95 backdrop-blur-md shadow-lg text-gray-700 hover:text-[#200B3B] transition-all cursor-pointer hover:scale-105 relative"
              aria-label="Share"
            >
              {copied ? (
                <Check size={17} className="text-emerald-600" />
              ) : (
                <Share2 size={17} />
              )}
              {copied && (
                <span className="absolute left-full ml-2 px-3 py-1 bg-[#200B3B] text-white text-xs font-bold rounded-lg whitespace-nowrap shadow-md">
                  Link Copied!
                </span>
              )}
            </button>
          </div>

          {/* View All Photos Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(0);
            }}
            className="absolute bottom-4 sm:bottom-5 right-6 sm:right-10 z-10 bg-white/95 backdrop-blur-md text-[#200B3B] hover:text-[#E91E63] text-xs font-black px-4 py-2 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
          >
            <Eye size={15} />
            <span>VIEW ALL PHOTOS</span>
          </button>
        </div>
      </div>

      {/* ── 2. BOTTOM ROW: SMALL COMPACT THUMBNAIL GALLERY (Clamped Height) ── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 w-full">
          {/* image2 (Left: 3 cols) */}
          <div
            onClick={() => openLightbox(1)}
            className="sm:col-span-3 h-32 sm:h-36 md:h-40 rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100"
          >
            <img
              src={galleryImages[1]}
              alt={`${pkg.title} 2`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* image3 (Middle Wide: 6 cols) */}
          <div
            onClick={() => openLightbox(2)}
            className="sm:col-span-6 h-32 sm:h-36 md:h-40 rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100"
          >
            <img
              src={galleryImages[2]}
              alt={`${pkg.title} 3`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Right Stack: image4 & image5 (3 cols) */}
          <div className="sm:col-span-3 flex flex-col gap-2 h-32 sm:h-36 md:h-40">
            {/* image4 */}
            <div
              onClick={() => openLightbox(3)}
              className="flex-1 h-[calc(50%-4px)] rounded-xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100"
            >
              <img
                src={galleryImages[3]}
                alt={`${pkg.title} 4`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* image5 */}
            <div
              onClick={() => openLightbox(4)}
              className="flex-1 h-[calc(50%-4px)] rounded-xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100"
            >
              <img
                src={galleryImages[4]}
                alt={`${pkg.title} 5`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. SUB-NAVIGATION & PRICING BAR (With Generous Spacing) ── */}
      <div className="w-full bg-white border-y border-gray-100 shadow-sm relative z-20 mt-6 sm:mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {outletItems.map((item, index) => {
              const active = isTabActive(item.path);
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`py-2 text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer relative ${
                    active
                      ? "text-[#E91E63]"
                      : "text-gray-400 hover:text-[#200B3B]"
                  }`}
                >
                  <span>{item.name}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E91E63] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Starts From & Check Availability Button */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                STARTS FROM
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#E91E63]">
                {startsFromDisplayPrice}
              </span>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById("pricing-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 sm:px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#E91E63] hover:bg-pink-600 text-white shadow-lg shadow-pink-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. FULLSCREEN LIGHTBOX MODAL ── */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 backdrop-blur-md cursor-pointer"
          >
            <X size={24} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={galleryImages[currentImageIndex]}
              alt="Gallery Preview"
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
            <span className="text-white/80 text-xs font-bold mt-4">
              Photo {currentImageIndex + 1} of {galleryImages.length}
            </span>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PackageImageGrid;
