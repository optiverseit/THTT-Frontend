import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { packages } from "../../assets/data/mockData";
import type { Package } from "../../assets/data/types";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import BookingModal from "../reusable/packages/BookingModal";
import DynamicFaqSection from "../reusable/DynamicFaqSection";
import FilterSideBar from "../TravelPackage/FilterSiderBar";
import PackageDetailsSection from "../TravelPackage/PackageDetailsSection";
import {
  Wind,
  ShieldCheck,
  Zap,
  Clock,
  MapPin,
  CheckCircle2,
  Video,
  Gauge,
  Sparkles,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  AlertCircle,
  Flame,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";

const ACTIVITY_FAQS = [
  {
    q: "Do I need prior experience to do Paragliding or Bungee jumping?",
    a: "No prior experience is necessary! All our flights and jumps are conducted as tandem flights or under the direct supervision of internationally certified master instructors who manage the launch, flight, and landing.",
  },
  {
    q: "Are photos and videos included in adventure activities?",
    a: "Yes! High-definition GoPro photos, wide-angle videos, and drone clips (where permitted) are either included or available with on-the-spot mobile transfer immediately after your session.",
  },
  {
    q: "What are the weight and age requirements for extreme activities?",
    a: "For Paragliding: Weight 35kg to 105kg. For Bungee/Canyon Swing: Weight 40kg to 110kg and minimum age 12-16 years. Guests under 18 require signed parental/guardian consent.",
  },
  {
    q: "What happens if an activity is cancelled due to adverse weather?",
    a: "Safety is our #1 priority. If weather (rain, excessive wind, or fog) forces a cancellation, we either reschedule for the next clear slot or issue a 100% immediate refund.",
  },
  {
    q: "What safety gear and certifications do you maintain?",
    a: "We only partner with APPI, UIAGM, and IRF certified operators utilizing European CE/UIAA certified harnesses, backup emergency reserve parachutes, and daily tension-checked cables.",
  },
];

export const ActivitiesDetailContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const navigate = useNavigate();
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const [selectedBookingActivity, setSelectedBookingActivity] = useState<Package | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // 100% Dynamically sourced from packages data
  const activityPackages = packages.filter(
    (p) => p.type === "activity" || p.type === "combo" || p.adventureCategory
  );

  const adventureKeywords = [
    "PARAGLIDING",
    "BUNGEE",
    "RAFTING",
    "ZIPFLYER",
    "CANYONING",
    "POKHARA",
    "KUSHMA",
    "SARANGKOT",
    "ADVENTURE",
    "HIGH THRILL",
    "TANDEM",
    "COMBO",
  ];

  const filteredActivities = activityPackages.filter((pkg) => {
    // 1. Category Tab Filter
    if (activeTab === "Air" && pkg.adventureCategory !== "Air") return false;
    if (activeTab === "Water" && pkg.adventureCategory !== "Water") return false;
    if (activeTab === "Land" && pkg.adventureCategory !== "Land") return false;
    if (activeTab === "combo" && pkg.type !== "combo") return false;

    // 2. Price Range Filter
    const priceNum = Number(pkg.price?.replace(/[^0-9]/g, "") || 0);
    const matchesPrice = priceNum === 0 || priceNum <= priceRange;

    // 3. Ratings Filter
    const pkgRating =
      pkg.rating !== undefined
        ? pkg.rating
        : pkg.testimonies && pkg.testimonies.length > 0
        ? pkg.testimonies[0].rating
        : 5;
    const matchesRating = selectedRating === 0 || Math.round(pkgRating) >= selectedRating;

    // 4. Keywords Filter
    const matchesKeywords =
      selectedKeywords.length === 0
        ? true
        : selectedKeywords.some((keyword) => {
            const kw = keyword.toLowerCase();
            return (
              pkg.title?.toLowerCase().includes(kw) ||
              pkg.location?.toLowerCase().includes(kw) ||
              pkg.adventureCategory?.toLowerCase().includes(kw) ||
              pkg.highlights?.some((hl) => hl.toLowerCase().includes(kw))
            );
          });

    return matchesPrice && matchesRating && matchesKeywords;
  });

  const handleBookActivity = (pkg: Package) => {
    setSelectedBookingActivity(pkg);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-12">

      {/* ── HEADER & FILTER PILLS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
            Featured Adventure Activities &amp; Combos
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Browse adrenaline experiences, aerial flights, whitewater runs, and multi-activity combos.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: `All Activities (${activityPackages.length})` },
            { id: "Air", label: "Aerial Thrills" },
            { id: "Water", label: "River Rapids" },
            { id: "Land", label: "Gravity & Land" },
            { id: "combo", label: "Multi-Activity Combos" },
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

      {/* ── MAIN CONTENT: SIDEBAR + PACKAGES LIST (EXACTLY SAME AS PACKAGES PAGE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left: Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterSideBar
            setPriceRange={setPriceRange}
            priceRange={priceRange}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            customKeywords={adventureKeywords}
          />
        </div>

        {/* Right: Package Details Cards */}
        <div className="lg:col-span-3">
          <PackageDetailsSection
            pkgs={filteredActivities}
            onBook={handleBookActivity}
            itemsPerPage={12}
          />
        </div>
      </div>

      {/* ── 3. SAFETY FIRST PROTOCOLS ── */}
      <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl">
        <div className="max-w-3xl mb-6 sm:mb-8">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs block mb-1">
            SAFETY &amp; CERTIFICATION
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            How We Protect You On Every Jump, Flight &amp; Rapid
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm mt-2 font-medium">
            We adhere to the highest international adventure tourism safety codes with certified instructors, double-checked equipment, and daily inspections.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              icon: ShieldCheck,
              title: "Certified Instructors",
              desc: "APPI, UIAGM, and IRF certified pilots, jump masters, and river guides with 10+ years experience.",
            },
            {
              icon: Gauge,
              title: "CE/UIAA Certified Gear",
              desc: "All carabiners, harnesses, cords, and lifejackets meet strict European and international safety codes.",
            },
            {
              icon: Wind,
              title: "Weather Telemetry",
              desc: "Real-time wind-speed and thermal monitoring before every launch or flight to ensure safe flight windows.",
            },
            {
              icon: Video,
              title: "Full 4K Action Footage",
              desc: "High-definition GoPro video and photography included so you take home unforgettable memories.",
            },
            {
              icon: AlertCircle,
              title: "Pre-Jump Medical Check",
              desc: "Brief health screenings and weight calibrations before high-altitude bungee and canyon swings.",
            },
            {
              icon: Sparkles,
              title: "100% Free Reschedule",
              desc: "Flexible weather-guarantee policy: full refund or zero-fee rebooking if flights are rained out.",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
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

      {/* ── 4. WHAT TO BRING & PACKING GUIDE ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-100 shadow-sm">
        <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs block mb-1">
          ESSENTIAL CHECKLIST
        </span>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#2D1347] tracking-tight mb-4 sm:mb-6">
          What to Wear &amp; Bring for Adventure Sports
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: "Footwear",
              items: ["Lace-up athletic shoes", "Tied sandals for rafting", "No flip-flops on jumps"],
            },
            {
              title: "Clothing",
              items: ["Comfortable active wear", "Windbreaker jacket", "Quick-dry shorts for river"],
            },
            {
              title: "Accessories",
              items: ["Sunglasses with strap", "Sunscreen (SPF 50+)", "Waterproof phone pouch"],
            },
            {
              title: "Documents",
              items: ["Passport / ID Copy", "Travel Insurance policy", "Signed consent form"],
            },
          ].map((cat, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#FBFBFE] border border-gray-200/80">
              <h4 className="font-extrabold text-[#2D1347] text-sm mb-3 pb-2 border-b border-gray-200">{cat.title}</h4>
              <ul className="space-y-2">
                {cat.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. CURATED ACTIVITIES FAQS ── */}
      <DynamicFaqSection
        targetType="service"
        targetId="adventure-activities"
        defaultFaqs={ACTIVITY_FAQS}
        title="Adventure Activities FAQ"
        subtitle="Clear answers on safety, slots, and requirements"
      />

      {/* ── BOOKING MODAL POPUP ── */}
      <BookingModal
        pkg={selectedBookingActivity}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default ActivitiesDetailContent;
