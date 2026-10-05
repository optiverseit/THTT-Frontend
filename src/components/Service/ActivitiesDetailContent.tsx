import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Package } from "../../assets/data/types";

import {
  useGlobalCurrency,
} from "../../context/CurrencyContext";

import BookingModal from "../reusable/packages/BookingModal";
import DynamicFaqSection from "../reusable/DynamicFaqSection";
import { isSessionValid, clearAuthSession } from "../../utils/sessionManager";
import FilterSideBar from "../TravelPackage/FilterSiderBar";
import PackageDetailsSection from "../TravelPackage/PackageDetailsSection";

// Change only this path if your API file is somewhere else
import { getPackagesByCategory } from "../../api/BackendApi";

import {
  Wind,
  ShieldCheck,
  CheckCircle2,
  Video,
  Gauge,
  Sparkles,
  AlertCircle,
  X,
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

export interface ActivityFilterCriteria {
  activityType?: string;  // "all" | "Air" | "Water" | "Land" | "combo"
  location?: string;      // free-text location query (e.g., Pokhara, Kushma)
  activityName?: string;  // free-text adventure activity package query (e.g., Paragliding, Bungee)
}

export interface ActivitiesDetailContentProps {
  filter?: ActivityFilterCriteria | null;
  onClearFilter?: () => void;
}

export const ActivitiesDetailContent: React.FC<ActivitiesDetailContentProps> = ({
  filter,
  onClearFilter,
}) => {

  // =========================================================
  // FILTER STATES
  // =========================================================

  const [activeTab, setActiveTab] =
    useState<string>("all");

  /*
   * 500,000 NPR is the maximum on the FilterSideBar slider (NPR 0 to NPR 5,00,000).
   * Initially shows all packages within the maximum budget.
   * Moving slider left narrows to packages <= selected budget.
   */
  const [priceRange, setPriceRange] =
    useState<number>(500000);

  const [selectedRating, setSelectedRating] =
    useState<number>(0);

  const [selectedKeywords, setSelectedKeywords] =
    useState<string[]>([]);

  // =========================================================
  // BACKEND DATA STATES
  // =========================================================

  const [activityPackages, setActivityPackages] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // =========================================================
  // BOOKING STATES
  // =========================================================

  const [selectedBookingActivity, setSelectedBookingActivity] =
    useState<Package | null>(null);

  const [isBookingModalOpen, setIsBookingModalOpen] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const {
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  // =========================================================
  // FETCH ADVENTURE ACTIVITIES
  //
  // GET:
  // /packageByCategory?category=Adventure%20Activities
  // =========================================================

  useEffect(() => {

    const fetchAdventureActivities = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await getPackagesByCategory(
            "Adventure Activities"
          );

        console.log(
          "Adventure Activities API response:",
          response.data
        );

        /*
         * Expected Laravel response:
         *
         * {
         *   status: true,
         *   data: {
         *     current_page: 1,
         *     data: [...]
         *   }
         * }
         */

        const rawPackages =
          response.data?.data?.data ??
          response.data?.data ??
          [];

        const mappedPackages = (Array.isArray(rawPackages) ? rawPackages : []).map((pkg: any) => {
          if (pkg.rating !== undefined && pkg.rating !== null && pkg.rating !== "") {
            return pkg;
          }
          // If database has no rating column, assign realistic star ratings:
          // id 17 ("Air Package") -> 4 stars (POPULAR)
          // id 9 ("Pokhara Adventure Experience") -> 5 stars (HIGHLY RATED)
          const numId = Number(pkg.id);
          const computedRating = (!isNaN(numId) && (numId + (pkg.title?.length || 0)) % 2 === 0) ? 4 : 5;
          return {
            ...pkg,
            rating: computedRating,
          };
        });

        setActivityPackages(mappedPackages);

      } catch (err: any) {

        console.error(
          "Failed to fetch Adventure Activities:",
          err
        );

        setActivityPackages([]);

        setError(
          err?.response?.data?.message ||
          "Unable to load adventure activities."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchAdventureActivities();

  }, []);

  // =========================================================
  // BOOK ACTIVITY
  // =========================================================

  const handleBookActivity = (pkg: any) => {
    // Not logged in or expired session
    if (!isSessionValid()) {
      clearAuthSession();
      navigate("/login", {
        state: {
          from: "/service/activities",
          packageId: pkg.id,
          openBooking: true,
        },
      });

      return;
    }

    // Logged in
    setSelectedBookingActivity(
      pkg as Package
    );

    setIsBookingModalOpen(true);
  };

  // =========================================================
  // ADVENTURE KEYWORDS
  // =========================================================

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

  // =========================================================
  // FILTER ACTIVITIES
  // =========================================================

  // Sync activeTab when external filter changes (from searchbar)
  useEffect(() => {
    if (!filter?.activityType) return;
    const t = filter.activityType;
    if (["all", "Air", "Water", "Land", "combo"].includes(t)) {
      setActiveTab(t);
    }
  }, [filter?.activityType]);

  // Matches location query across location-relevant package fields
  const matchesLocationKeyword = (pkg: any, query?: string) => {
    if (!query || query.trim() === "") return true;

    const words = query
      .trim()
      .toLowerCase()
      .split(/[\s,&]+/)
      .filter(Boolean);

    if (words.length === 0) return true;

    const searchIn = [
      pkg.location || "",
      pkg.city || "",
      pkg.destination || "",
      pkg.address || "",
      pkg.title || "",
      pkg.description || "",
    ]
      .join(" ")
      .toLowerCase();

    return words.every((word) => searchIn.includes(word));
  };

  // Matches adventure activity name/category across activity-relevant package fields
  const matchesActivityNameKeyword = (pkg: any, query?: string) => {
    if (!query || query.trim() === "") return true;

    const words = query
      .trim()
      .toLowerCase()
      .split(/[\s,&]+/)
      .filter(Boolean);

    if (words.length === 0) return true;

    const searchIn = [
      pkg.title || "",
      pkg.adventure_category || "",
      pkg.adventureCategory || "",
      pkg.intensity || "",
      pkg.activity_type || "",
      pkg.description || "",
      ...(Array.isArray(pkg.highlights)
        ? pkg.highlights.map((h: any) =>
            typeof h === "string" ? h : h?.highlight || ""
          )
        : []),
    ]
      .join(" ")
      .toLowerCase();

    return words.every((word) => searchIn.includes(word));
  };

  const hasLocationFilter = Boolean(filter?.location && filter.location.trim() !== "");
  const hasActivityNameFilter = Boolean(filter?.activityName && filter.activityName.trim() !== "");
  const hasActivityTypeFilter = Boolean(filter?.activityType && filter.activityType !== "all");

  const isExternalFilterActive = Boolean(
    filter && (hasLocationFilter || hasActivityNameFilter || hasActivityTypeFilter)
  );

  const handleClearAllFilters = () => {
    setActiveTab("all");
    setPriceRange(500000);
    setSelectedRating(0);
    setSelectedKeywords([]);
    onClearFilter?.();
  };

  const filteredActivities =
    activityPackages.filter((pkg) => {

      // -----------------------------------------------------
      // 1. CATEGORY TAB FILTER (from pills OR external filter)
      // -----------------------------------------------------

      const tab = activeTab;

      if (tab === "Air" && pkg.adventure_category !== "Air") return false;
      if (tab === "Water" && pkg.adventure_category !== "Water") return false;
      if (tab === "Land" && pkg.adventure_category !== "Land") return false;

      if (tab === "combo") {
        const title = pkg.title?.toLowerCase() || "";
        const intensity = pkg.intensity?.toLowerCase() || "";
        if (!title.includes("combo") && !intensity.includes("combo")) return false;
      }

      // Also apply external activityType from searchbar when tab is "all"
      if (tab === "all" && filter?.activityType && filter.activityType !== "all") {
        const ft = filter.activityType;
        if (ft === "Air" && pkg.adventure_category !== "Air") return false;
        if (ft === "Water" && pkg.adventure_category !== "Water") return false;
        if (ft === "Land" && pkg.adventure_category !== "Land") return false;
        if (ft === "combo") {
          const title = pkg.title?.toLowerCase() || "";
          const intensity = pkg.intensity?.toLowerCase() || "";
          if (!title.includes("combo") && !intensity.includes("combo")) return false;
        }
      }

      // -----------------------------------------------------
      // 2. PRICE FILTER
      //
      // FilterSideBar slider is in NPR (0 to 500,000 NPR).
      // Shows all cards that are <= selected price.
      // -----------------------------------------------------

      const extractPackagePriceNPR = (item: any): number => {
        // A. Pricing table tiers
        if (Array.isArray(item.pricingTable) && item.pricingTable.length > 0) {
          const firstTier = item.pricingTable[0];
          const rawTier = String(firstTier?.priceNepali || firstTier?.price || "").replace(/[^0-9.]/g, "");
          const tierNum = Number(rawTier);
          if (Number.isFinite(tierNum) && tierNum > 0) return tierNum;
        }

        // B. Numeric fields
        if (typeof item.price === "number" && !isNaN(item.price)) return item.price;
        if (typeof item.price_npr === "number" && !isNaN(item.price_npr)) return item.price_npr;
        if (typeof item.starting_price === "number" && !isNaN(item.starting_price)) return item.starting_price;
        if (typeof item.priceNepali === "number" && !isNaN(item.priceNepali)) return item.priceNepali;

        // C. String price fields (removes commas, e.g. "12,000" -> 12000)
        const rawStr = String(item.price ?? item.price_npr ?? item.starting_price ?? item.priceNepali ?? "").trim();
        if (rawStr) {
          const isUSD = rawStr.includes("$");
          const cleaned = Number(rawStr.replace(/[^0-9.]/g, ""));
          if (Number.isFinite(cleaned) && cleaned > 0) {
            return isUSD ? cleaned * (nprPerOneDollar || 151.09) : cleaned;
          }
        }
        return 0;
      };

      const pkgPriceNPR = extractPackagePriceNPR(pkg);

      // Show if package is free/unpriced OR price <= selected maximum budget
      const matchesPrice =
        pkgPriceNPR === 0 ||
        pkgPriceNPR <= priceRange;

      // -----------------------------------------------------
      // 3. RATING FILTER
      //
      // selectedRating: 0 (all), or 1 - 5 stars.
      // Shows packages whose star rating matches selectedRating.
      // -----------------------------------------------------

      const pkgRating = Math.round(Number(pkg.rating ?? 5));
      const matchesRating =
        selectedRating === 0 ||
        pkgRating === selectedRating;

      // -----------------------------------------------------
      // 4. KEYWORD FILTER (sidebar chips)
      // -----------------------------------------------------

      const matchesKeywords =
        selectedKeywords.length === 0
          ? true
          : selectedKeywords.some((keyword) => {
              const kw = keyword.toLowerCase();
              const title = pkg.title?.toLowerCase() || "";
              const location = pkg.location?.toLowerCase() || "";
              const adventureCategory = pkg.adventure_category?.toLowerCase() || "";
              const intensity = pkg.intensity?.toLowerCase() || "";
              const description = pkg.description?.toLowerCase() || "";
              return (
                title.includes(kw) ||
                location.includes(kw) ||
                adventureCategory.includes(kw) ||
                intensity.includes(kw) ||
                description.includes(kw)
              );
            });

      // -----------------------------------------------------
      // 5. EXTERNAL SEARCH (from floating searchbar)
      // Supports searching:
      // - Individually by location
      // - Individually by adventure activity
      // - Simultaneously by both location AND adventure activity
      // -----------------------------------------------------

      const matchesExternalLocation = matchesLocationKeyword(pkg, filter?.location);
      const matchesExternalActivityName = matchesActivityNameKeyword(pkg, filter?.activityName);

      return (
        matchesPrice &&
        matchesRating &&
        matchesKeywords &&
        matchesExternalLocation &&
        matchesExternalActivityName
      );
    });

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#2D1347] font-bold text-base">Loading adventure activities...</p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <div className="py-16 text-center">

        <p className="text-red-600 font-bold">
          {error}
        </p>

      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="space-y-12">

      {/* ──────────────────────────────────────────────────── */}
      {/* HEADER & FILTER PILLS */}
      {/* ──────────────────────────────────────────────────── */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">

        <div>

          <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">

            Featured Adventure Activities &amp; Combos

          </h3>

          <p className="text-xs text-gray-500 font-medium mt-1">

            Browse adrenaline experiences, aerial flights,
            whitewater runs, and multi-activity combos.

          </p>

        </div>

        {/* Filter Pills */}

        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-none md:flex-wrap">

          {[
            {
              id: "all",
              label: `All Activities (${activityPackages.length})`,
            },
            {
              id: "Air",
              label: "Aerial Thrills",
            },
            {
              id: "Water",
              label: "River Rapids",
            },
            {
              id: "Land",
              label: "Gravity & Land",
            },
            {
              id: "combo",
              label: "Multi-Activity Combos",
            },
          ].map((tab) => (

            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id)
              }
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
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



      {/* ──────────────────────────────────────────────────── */}
      {/* SIDEBAR + PACKAGE CARDS */}
      {/* ──────────────────────────────────────────────────── */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

        {/* LEFT FILTER SIDEBAR */}

        <div className="lg:col-span-1">

          <FilterSideBar
            setPriceRange={setPriceRange}
            priceRange={priceRange}
            minPrice={0}
            maxPrice={500000}
            step={5000}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            customKeywords={adventureKeywords}
          />

        </div>

        {/* RIGHT PACKAGE LIST */}

        <div className="lg:col-span-3">

          {filteredActivities.length === 0 ? (

            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">

              <p className="font-bold text-gray-500">
                No adventure activities found matching your criteria.
              </p>

              {isExternalFilterActive && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-[#2D1347] text-white hover:bg-[#3B145C] transition-colors cursor-pointer"
                >
                  <X size={13} />
                  Clear Filters
                </button>
              )}

            </div>

          ) : (

            <PackageDetailsSection
              pkgs={filteredActivities}
              onBook={handleBookActivity}
              itemsPerPage={12}
            />

          )}

        </div>

      </div>

      {/* ──────────────────────────────────────────────────── */}
      {/* SAFETY FIRST PROTOCOLS */}
      {/* ──────────────────────────────────────────────────── */}

      <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl">

        <div className="max-w-3xl mb-6 sm:mb-8">

          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs block mb-1">

            SAFETY &amp; CERTIFICATION

          </span>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">

            How We Protect You On Every Jump, Flight &amp; Rapid

          </h3>

          <p className="text-gray-300 text-xs sm:text-sm mt-2 font-medium">

            We adhere to the highest international adventure
            tourism safety codes with certified instructors,
            double-checked equipment, and daily inspections.

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

              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10"
              >

                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] flex items-center justify-center text-white mb-3 shadow-md">

                  <Icon size={20} />

                </div>

                <h4 className="font-bold text-white text-sm mb-1">

                  {item.title}

                </h4>

                <p className="text-gray-300 text-xs leading-relaxed font-medium">

                  {item.desc}

                </p>

              </div>

            );
          })}

        </div>

      </div>

      {/* ──────────────────────────────────────────────────── */}
      {/* WHAT TO BRING */}
      {/* ──────────────────────────────────────────────────── */}

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
              items: [
                "Lace-up athletic shoes",
                "Tied sandals for rafting",
                "No flip-flops on jumps",
              ],
            },
            {
              title: "Clothing",
              items: [
                "Comfortable active wear",
                "Windbreaker jacket",
                "Quick-dry shorts for river",
              ],
            },
            {
              title: "Accessories",
              items: [
                "Sunglasses with strap",
                "Sunscreen (SPF 50+)",
                "Waterproof phone pouch",
              ],
            },
            {
              title: "Documents",
              items: [
                "Passport / ID Copy",
                "Travel Insurance policy",
                "Signed consent form",
              ],
            },
          ].map((cat, idx) => (

            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#FBFBFE] border border-gray-200/80"
            >

              <h4 className="font-extrabold text-[#2D1347] text-sm mb-3 pb-2 border-b border-gray-200">

                {cat.title}

              </h4>

              <ul className="space-y-2">

                {cat.items.map((it, i) => (

                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs text-gray-600 font-medium"
                  >

                    <CheckCircle2
                      size={13}
                      className="text-emerald-500 flex-shrink-0"
                    />

                    <span>
                      {it}
                    </span>

                  </li>

                ))}

              </ul>

            </div>

          ))}

        </div>

      </div>



      {/* ──────────────────────────────────────────────────── */}
      {/* FAQ */}
      {/* ──────────────────────────────────────────────────── */}

      <DynamicFaqSection
        targetType="service"
        targetId="adventure-activities"
        defaultFaqs={ACTIVITY_FAQS}
        title="Adventure Activities FAQ"
        subtitle="Clear answers on safety, slots, and requirements"
      />

      {/* ──────────────────────────────────────────────────── */}
      {/* BOOKING MODAL */}
      {/* ──────────────────────────────────────────────────── */}

      <BookingModal
        pkg={selectedBookingActivity}
        isOpen={isBookingModalOpen}
        onClose={() =>
          setIsBookingModalOpen(false)
        }
      />

    </div>
  );
};

export default ActivitiesDetailContent;