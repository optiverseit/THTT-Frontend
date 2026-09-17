import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { packages } from "../../assets/data/mockData";
import type { Package } from "../../assets/data/types";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import BookingModal from "../reuseable/packages/BookingModal";
import DynamicFaqSection from "../reusable/DynamicFaqSection";
import {
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Award,
  Camera,
  Car,
  Hotel,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Globe,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";

const TOUR_FAQS = [
  {
    q: "Can our holiday tour itinerary be completely customized?",
    a: "Yes! Every tour package can be customized to match your schedule, preferred hotel category (from budget to 5-star heritage resorts), private vehicle choice, and specific sightseeing interests.",
  },
  {
    q: "What is included in the private transport during tours?",
    a: "We provide clean, air-conditioned private vehicles (Sedans, Scorpio 4x4 SUVs, Toyota Hiace vans, or luxury tourist coasters) with experienced, courteous chauffeurs covering all fuel, toll, and parking fees.",
  },
  {
    q: "Are monument entry fees and government permits covered?",
    a: "In all our full-board packages, entrance fees to UNESCO Heritage monuments, National Park entry tickets, and local permits are organized and included in advance so you can skip queues.",
  },
  {
    q: "Do you offer multi-lingual professional tour guides?",
    a: "Yes, our certified government-licensed tour guides speak English, Hindi, Nepali, French, German, Spanish, Japanese, and Chinese upon request for guided city excursions.",
  },
  {
    q: "How do we confirm our booking and what payment options are accepted?",
    a: "You can reserve your tour with a 20% advance deposit via bank transfer, eSewa, Khalti, or credit card. The balance can be paid prior to departure or upon arrival in Kathmandu.",
  },
];

export const ToursDetailContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const navigate = useNavigate();
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const [selectedBookingTour, setSelectedBookingTour] = useState<Package | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBookTour = (tour: Package) => {
    setSelectedBookingTour(tour);
    setIsBookingModalOpen(true);
  };

  const formatPackagePrice = (priceStr?: string) => {
    if (!priceStr) return null;
    const numericUSD = Number(priceStr.replace(/[^0-9]/g, "") || 0);
    if (numericUSD > 0) {
      const nprAmount = numericUSD * nprPerOneDollar;
      return displayPrice(nprAmount, selectedCurrency, nprPerOneDollar, nprPerOneINR);
    }
    return priceStr;
  };

  // 100% Dynamically sourced from packages data
  const tourPackages = packages.filter((p) => p.type === "tour");

  const filteredTours = tourPackages.filter((pkg) => {
    if (activeTab === "all") return true;
    if (activeTab === "domestic") return pkg.category === "domestic";
    if (activeTab === "international") return pkg.category === "international";
    if (activeTab === "featured") return pkg.isFeatured;
    return true;
  });

  const visibleTours = filteredTours.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTours.length;

  const handleInquiry = (tourTitle: string, priceStr?: string) => {
    const formattedPrice = formatPackagePrice(priceStr);
    const priceText = formattedPrice ? ` (${formattedPrice})` : "";
    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Tours & Holidays Team)! I am interested in booking the "${tourTitle}"${priceText}. Please share details, day-by-day itinerary, and pricing.`
    );
    window.open(`https://api.whatsapp.com/send?phone=9779851403761&text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── HEADER & FILTER PILLS (Outside the box of cards) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
            Featured Holiday Itineraries
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: `All Tours (${tourPackages.length})` },
            { id: "domestic", label: "Domestic Nepal" },
            { id: "international", label: "International Holidays" },
            { id: "featured", label: "Top Featured" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#2D1347] text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200/80 hover:bg-pink-50 hover:border-pink-300 hover:text-[#E11D48] shadow-2xs"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── DYNAMIC TOUR PACKAGES GRID (The Box of Cards) ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100">
        {/* Dynamic Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTours.map((tour) => (
            <div
              key={tour.id}
              onClick={() => navigate(`/details/${tour.id}`)}
              className="bg-[#FBFBFE] rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#E11D48]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#E11D48] text-white shadow-md">
                      {tour.category === "international" ? "International" : "Domestic Tour"}
                    </span>
                    {tour.isFeatured && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-md">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
                    <Clock size={13} className="text-pink-400" />
                    <span>{tour.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-lg sm:text-xl font-black text-[#2D1347] group-hover:text-[#E11D48] transition-colors leading-snug">
                      {tour.title}
                    </h4>
                    {tour.price && (
                      <span className="font-extrabold text-sm text-[#E11D48] whitespace-nowrap bg-pink-50 px-2.5 py-1 rounded-xl">
                        {formatPackagePrice(tour.price)}
                      </span>
                    )}
                  </div>

                  {tour.location && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-4">
                      <MapPin size={14} className="text-[#E11D48] flex-shrink-0" />
                      <span className="truncate">{tour.location}</span>
                    </div>
                  )}

                  <div className="space-y-2 mb-6">
                    {tour.highlights && tour.highlights.slice(0, 3).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions - Format as in Image 5 */}
              <div className="p-6 pt-0 border-t border-gray-100 mt-auto space-y-2.5">
                {/* Row 1: Inquiry First (Dark Blue), Book Now (Pink) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInquiry(tour.title, tour.price);
                    }}
                    className="bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                    title="WhatsApp Inquiry"
                  >
                    <MessageCircle size={14} className="text-pink-400" />
                    <span>Inquiry</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookTour(tour);
                    }}
                    className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-900/20 cursor-pointer whitespace-nowrap"
                  >
                    <CalendarCheck size={14} />
                    <span>Book Now</span>
                  </button>
                </div>

                {/* Row 2: Full Details Centered */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/details/${tour.id}`);
                  }}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#2D1347] text-[#2D1347] hover:text-[#E11D48] font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Full Details</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount(prev => prev + 15)}
              className="px-10 py-3.5 bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-sm rounded-2xl flex items-center gap-2.5 transition-all shadow-lg cursor-pointer"
            >
              <span>See More</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* ── 3. WHAT'S INCLUDED IN OUR TOURS ── */}
      <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="max-w-3xl mb-8">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-xs block mb-1">
            PREMIUM EXPERIENCE GUARANTEE
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            What's Included in Every Holiday Tour
          </h3>
          <p className="text-gray-300 text-sm mt-2 font-medium">
            From seamless luxury transfers to certified native guides, we take care of all logistics so you travel stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            {
              icon: Car,
              title: "Private AC Vehicles",
              desc: "Dedicated chauffeur with all fuel, toll & parking charges included throughout the tour.",
            },
            {
              icon: Hotel,
              title: "Handpicked Stays",
              desc: "Carefully vetted 3-Star, 4-Star or 5-Star boutique hotels with delicious daily breakfast.",
            },
            {
              icon: Award,
              title: "Licensed Tour Guides",
              desc: "Experienced government-certified multi-lingual guides for all historical and cultural sites.",
            },
            {
              icon: Globe,
              title: "Permits & Entry Passes",
              desc: "All UNESCO monument entry tickets, national park permits, and local taxes fully covered.",
            },
            {
              icon: ShieldCheck,
              title: "24/7 Concierge Support",
              desc: "Dedicated tour manager on WhatsApp and call for real-time guidance and assistance.",
            },
            {
              icon: Camera,
              title: "Special Experience Stops",
              desc: "Sunset viewpoints, cultural culinary tastings, and scenic photography pauses.",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] flex items-center justify-center text-white mb-3 shadow-md">
                  <Icon size={20} />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                <p className="text-gray-300 text-xs leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. SEASONAL GUIDE & BEST TIME TO VISIT ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-xs block mb-1">
          TRIP PLANNING INSIGHTS
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight mb-6">
          Best Season for Nepal Holiday Tours
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              season: "Autumn (Sep – Nov)",
              badge: "Peak Season",
              badgeColor: "bg-emerald-100 text-emerald-800",
              desc: "Crisp blue skies, panoramic mountain vistas, festive atmosphere with Dashain and Tihar celebrations.",
            },
            {
              season: "Spring (Mar – May)",
              badge: "Best Flowers & Weather",
              badgeColor: "bg-pink-100 text-pink-800",
              desc: "Pleasant temperatures, blooming rhododendron hillsides, excellent wildlife viewing in Chitwan & Bardia.",
            },
            {
              season: "Winter (Dec – Feb)",
              badge: "Clear Mountain Skies",
              badgeColor: "bg-blue-100 text-blue-800",
              desc: "Sunny daytime in Kathmandu and Pokhara valleys, crystal clear snow peaks, fewer crowds.",
            },
            {
              season: "Monsoon (Jun – Aug)",
              badge: "Lush & Off-Season",
              badgeColor: "bg-amber-100 text-amber-800",
              desc: "Lush terraced hills, vibrant waterfalls, ideal for Upper Mustang and cultural temple tours.",
            },
          ].map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#FBFBFE] border border-gray-200/80">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-block mb-2 ${s.badgeColor}`}>
                {s.badge}
              </span>
              <h4 className="font-black text-[#2D1347] text-sm mb-2">{s.season}</h4>
              <p className="text-gray-600 text-xs leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. CURATED TOURS FAQS ── */}
      <DynamicFaqSection
        targetType="service"
        targetId="holiday-tours"
        defaultFaqs={TOUR_FAQS}
        title="Tours & Holiday FAQ"
        subtitle="Common questions answered by our holiday specialists"
      />

      {/* ── BOOKING MODAL POPUP ── */}
      <BookingModal
        pkg={selectedBookingTour}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default ToursDetailContent;
