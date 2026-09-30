import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, X, ChevronLeft, ChevronRight, Check, Star, Shield, Clock, Share2, Printer, Mountain } from "lucide-react";
import { useGlobalCurrency } from "../../context/CurrencyContext";
import ShareModal from "../reusable/ShareModal";
import Logo from "../../assets/images/Logo.png";

interface PackageProp {
  pkg: any;
}

const InsuranceImageGrid: React.FC<PackageProp> = ({ pkg }) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const [copied, setCopied] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const handlePrint = () => {
    const originalTitle = document.title;
    const packageTitle = pkg.title || "Insurance Policy";
    document.title = `${packageTitle} - Quotation - Trip Himalaya`;
    window.print();
    window.addEventListener(
      "afterprint",
      () => {
        document.title = originalTitle;
      },
      { once: true }
    );
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  };

  const basePackagePriceNPR = Number(pkg.baseNPRPrice || pkg.price || 0);

  const startsFromDisplayPrice = `NPR ${basePackagePriceNPR.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 0,
    }
  )}`;

  const navigate = useNavigate();
  const location = useLocation();

  const galleryImages =
    pkg.gallery && pkg.gallery.length >= 5
      ? pkg.gallery
      : [
        pkg.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
      ];

  const outletItems = [
    { name: "OVERVIEW", path: `/insurance-details/${pkg.id}` },
    { name: "POLICIES", path: `/insurance-details/${pkg.id}/policies` },
    { name: "FAQS", path: `/insurance-details/${pkg.id}/faqs` },
    { name: "TESTIMONIES", path: `/insurance-details/${pkg.id}/testimonies` },
  ];

  const isTabActive = (tabPath: string) => {
    if (tabPath === `/insurance-details/${pkg.id}`) {
      return (
        location.pathname === `/insurance-details/${pkg.id}` ||
        location.pathname === `/insurance-details/${pkg.id}/`
      );
    }
    return location.pathname.startsWith(tabPath);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);

  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );

  const contactTeam = "Travel Insurance & Medical Team";
  const contactPhone = "+977-9851420882";
  const contactWhatsApp = "9779851420882";

  return (
    <div className="w-full">
      {/* ── PRINT-ONLY QUOTATION HEADER ── */}
      <div className="hidden print:block mb-8 p-6 border-b-2 border-black">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="Trip Himalaya" className="h-14 w-auto" />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900">
                TRIP HIMALAYA TOURS &amp; TRAVEL
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                Emergency Medical &amp; High Altitude Heli Insurance
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-600 space-y-1">
            <p className="font-bold text-gray-800">Hotline: {contactPhone}</p>
            <p>WhatsApp: +{contactWhatsApp}</p>
          </div>
        </div>
      </div>

      {/* ── HERO BANNER: 5-IMAGE GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E91E63] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                Travel Insurance
              </span>
              <span className="text-xs font-bold text-gray-400">•</span>
              <span className="text-xs font-bold text-gray-500">{pkg.badge || "Trek & Expedition"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#200B3B] tracking-tight">
              {pkg.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 pt-0.5">
              <span className="flex items-center gap-1 text-amber-500">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="font-black text-gray-800">{pkg.rating || 5.0}</span>
                <span className="text-gray-400">({pkg.reviewsCount || 62} reviews)</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-600">
                <Mountain size={13} className="text-[#E91E63]" />
                <span>{pkg.maxAltitude || "Altitude Protection"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-600">
                <Shield size={13} className="text-emerald-600" />
                <span>{pkg.coverageLimit || "$50,000"} Cover</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={() => {
                const message = encodeURIComponent(
                  `Hello ${contactTeam}! I am inquiring about *${pkg.title}*. Please confirm policy coverage, altitude caps, and issuance process.`
                );
                window.open(`https://wa.me/${contactWhatsApp}?text=${message}`, "_blank");
              }}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full font-bold text-xs uppercase tracking-wider border border-emerald-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              Ask on WhatsApp
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all cursor-pointer"
              title="Share Policy"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* 5-Photo Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[320px] sm:h-[420px] rounded-3xl overflow-hidden shadow-sm">
          <div
            className="md:col-span-2 relative group cursor-pointer overflow-hidden h-full"
            onClick={() => openLightbox(0)}
          >
            <img
              src={galleryImages[0]}
              alt={pkg.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          </div>

          <div className="hidden md:grid md:col-span-1 grid-rows-2 gap-3 h-full">
            <div
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              onClick={() => openLightbox(1)}
            >
              <img
                src={galleryImages[1]}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              onClick={() => openLightbox(2)}
            >
              <img
                src={galleryImages[2]}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="hidden md:grid md:col-span-1 grid-rows-2 gap-3 h-full">
            <div
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              onClick={() => openLightbox(3)}
            >
              <img
                src={galleryImages[3]}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              onClick={() => openLightbox(4)}
            >
              <img
                src={galleryImages[4]}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 hover:bg-black/30 flex items-center justify-center text-white font-bold text-xs gap-1.5 transition-colors">
                <Eye size={16} />
                <span>View All Photos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY NAVIGATION TABS ── */}
      <div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-y border-gray-100 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-3">
            {outletItems.map((tab) => {
              const active = isTabActive(tab.path);
              return (
                <button
                  key={tab.name}
                  onClick={() => navigate(tab.path)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-[#200B3B] text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                STARTS FROM
              </span>
              <span className="text-sm font-black text-[#E91E63]">
                {startsFromDisplayPrice}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 p-2 cursor-pointer"
          >
            <X size={28} />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-6 text-white hover:text-gray-300 p-2 cursor-pointer"
          >
            <ChevronLeft size={36} />
          </button>
          <img
            src={galleryImages[currentImageIndex]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
          />
          <button
            onClick={nextImage}
            className="absolute right-6 text-white hover:text-gray-300 p-2 cursor-pointer"
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          data={{ title: pkg.title, url: window.location.href }}
        />
      )}
    </div>
  );
};

export default InsuranceImageGrid;
