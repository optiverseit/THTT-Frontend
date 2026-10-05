import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronRight,
  Navigation,
  Search,
  ArrowRight,
  TrendingUp,
  X,
  Package,
  Plane,
  Map,
  Mountain,
  Activity,
  Bed,
  Shield,
  Heart,
  Car,
  Wind,
  FileText,
  BookOpen,
  Compass,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getPackages,
  getHotels,
  getAllVehicles,
  getVisaCategories,
  getInsurancePlans,
} from "../../api/BackendApi";
import { services, blogPosts } from "../../assets/data/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string | number;
  label: string;
  sublabel?: string;
  type:
    | "package"
    | "service"
    | "blog"
    | "hotel"
    | "vehicle"
    | "visa"
    | "insurance"
    | "heli"
    | "trekking"
    | "activity"
    | "tour";
  route: string;
  icon: React.ElementType;
}

// ─── Icon mapping for service slugs ──────────────────────────────────────────

const SERVICE_ICON_MAP: Record<string, React.ElementType> = {
  "air-ticket": Plane,
  tours: Map,
  activities: Activity,
  trekking: Mountain,
  "hotel-booking": Bed,
  "visa-services": Shield,
  "travel-insurance": Heart,
  "vehicle-rental": Car,
  "heli-services": Wind,
  "work-permit": FileText,
};

const TYPE_COLOR_MAP: Record<string, string> = {
  package: "bg-pink-100 text-pink-600",
  service: "bg-purple-100 text-purple-600",
  blog: "bg-blue-100 text-blue-600",
  hotel: "bg-amber-100 text-amber-600",
  vehicle: "bg-green-100 text-green-600",
  visa: "bg-indigo-100 text-indigo-600",
  insurance: "bg-rose-100 text-rose-600",
  heli: "bg-cyan-100 text-cyan-600",
  trekking: "bg-emerald-100 text-emerald-600",
  activity: "bg-orange-100 text-orange-600",
  tour: "bg-violet-100 text-violet-600",
};

const TYPE_LABEL_MAP: Record<string, string> = {
  package: "Package",
  service: "Service",
  blog: "Blog",
  hotel: "Hotel",
  vehicle: "Vehicle",
  visa: "Visa",
  insurance: "Insurance",
  heli: "Heli Tour",
  trekking: "Trekking",
  activity: "Activity",
  tour: "Tour",
};

// ─── Quick search chips ───────────────────────────────────────────────────────

const QUICK_SEARCHES = ["Everest", "Annapurna", "Bali", "Pokhara", "Paragliding", "Visa"];

// ─── Static items built from mock data ───────────────────────────────────────

const STATIC_SEARCH_ITEMS: SearchResult[] = [
  ...services.map((s) => ({
    id: s.id,
    label: s.name,
    sublabel: s.shortDesc,
    type: "service" as const,
    route: s.slug === "work-permit" ? "/work-permit" : `/service/${s.slug}`,
    icon: SERVICE_ICON_MAP[s.slug] ?? FileText,
  })),
  ...blogPosts.map((b) => ({
    id: b.id,
    label: b.title,
    sublabel: b.category,
    type: "blog" as const,
    route: `/blog/${b.slug}`,
    icon: BookOpen,
  })),
];

// ─── Banner Component ─────────────────────────────────────────────────────────

const Banner: React.FC = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allItems, setAllItems] = useState<SearchResult[]>(STATIC_SEARCH_ITEMS);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Fetch dynamic data from backend ─────────────────────────────────────
  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const [pkgRes, hotelRes, vehicleRes, visaRes, insuranceRes] =
          await Promise.allSettled([
            getPackages(),
            getHotels(),
            getAllVehicles(),
            getVisaCategories(),
            getInsurancePlans(),
          ]);

        const dynamicItems: SearchResult[] = [];

        // Packages
        if (pkgRes.status === "fulfilled") {
          const raw = pkgRes.value.data;
          const pkgs: any[] = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.data?.data)
            ? raw.data.data
            : [];

          pkgs.forEach((p: any) => {
            const typeRaw = (
              p.category?.name || p.category?.title || p.type || ""
            ).toLowerCase();

            let resultType: SearchResult["type"] = "package";
            let icon: React.ElementType = Package;

            if (typeRaw.includes("trek") || typeRaw.includes("hik")) {
              resultType = "trekking";
              icon = Mountain;
            } else if (typeRaw.includes("activity") || typeRaw.includes("adventure")) {
              resultType = "activity";
              icon = Activity;
            } else if (typeRaw.includes("tour") || typeRaw.includes("holiday")) {
              resultType = "tour";
              icon = Map;
            } else if (typeRaw.includes("heli")) {
              resultType = "heli";
              icon = Wind;
            }

            dynamicItems.push({
              id: `pkg-${p.id}`,
              label: p.title || p.name || "Package",
              sublabel: p.location || p.duration || "",
              type: resultType,
              route: `/details/${p.id}`,
              icon,
            });
          });
        }

        // Hotels
        if (hotelRes.status === "fulfilled") {
          const raw = hotelRes.value.data;
          const hotels: any[] = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.data)
            ? raw.data
            : [];
          hotels.forEach((h: any) => {
            dynamicItems.push({
              id: `hotel-${h.id}`,
              label: h.name || "Hotel",
              sublabel: h.city || h.location || "",
              type: "hotel",
              route: `/hotel-details/${h.id}`,
              icon: Bed,
            });
          });
        }

        // Vehicles
        if (vehicleRes.status === "fulfilled") {
          const raw = vehicleRes.value.data;
          const vehicles: any[] = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.data)
            ? raw.data
            : [];
          vehicles.forEach((v: any) => {
            dynamicItems.push({
              id: `veh-${v.id}`,
              label: v.name || "Vehicle",
              sublabel: v.categoryLabel || v.category || "",
              type: "vehicle",
              route: `/vehicle-details/${v.id}`,
              icon: Car,
            });
          });
        }

        // Visa categories
        if (visaRes.status === "fulfilled") {
          const raw = visaRes.value.data;
          const visas: any[] = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.data)
            ? raw.data
            : [];
          visas.forEach((v: any) => {
            dynamicItems.push({
              id: `visa-${v.id}`,
              label: v.name || v.title || "Visa Category",
              sublabel: v.country || v.description || "Visa Services",
              type: "visa",
              route: `/visa-details/${v.id}`,
              icon: Shield,
            });
          });
        }

        // Insurance plans
        if (insuranceRes.status === "fulfilled") {
          const raw = insuranceRes.value.data;
          const plans: any[] = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.data)
            ? raw.data
            : [];
          plans.forEach((p: any) => {
            dynamicItems.push({
              id: `ins-${p.id}`,
              label: p.name || p.title || "Insurance Plan",
              sublabel: p.description || "Travel Insurance",
              type: "insurance",
              route: `/insurance-details/${p.id}`,
              icon: Heart,
            });
          });
        }

        setAllItems([...STATIC_SEARCH_ITEMS, ...dynamicItems]);
      } catch (_err) {
        // keep static items
      }
    };

    loadDynamicData();
  }, []);

  // ── Keyword → type aliases for boosted matching ──────────────────────────
  const TYPE_ALIASES: Record<string, string[]> = {
    vehicle: ["vehicle", "rental", "car", "suv", "van", "bus", "transport"],
    hotel: ["hotel", "lodge", "resort", "accommodation", "stay", "room"],
    visa: ["visa", "schengen", "permit", "passport"],
    insurance: ["insurance", "coverage", "cover", "policy"],
    trekking: ["trek", "trekking", "hike", "hiking", "expedition"],
    activity: ["activity", "activities", "adventure", "paraglid", "bungee", "rafting", "zipline", "swing"],
    tour: ["tour", "holiday", "safari", "sightseeing", "cultural"],
    heli: ["heli", "helicopter", "chopper"],
    service: ["air", "ticket", "flight", "airline"],
    blog: ["blog", "article", "story", "read"],
  };

  // ── Search logic ──────────────────────────────────────────────────────────
  const runSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim().toLowerCase();
      if (!trimmed) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      const words = trimmed.split(/[\s,]+/).filter(Boolean);

      const scored = allItems
        .map((item) => {
          const lbl = item.label.toLowerCase();
          const sub = (item.sublabel ?? "").toLowerCase();
          const typ = item.type.toLowerCase();
          const route = item.route.toLowerCase();

          let score = 0;
          words.forEach((word) => {
            // Label match
            if (lbl === word) score += 20;
            else if (lbl.startsWith(word)) score += 12;
            else if (lbl.includes(word)) score += 7;

            // Sublabel match
            if (sub.includes(word)) score += 4;

            // Route match
            if (route.includes(word)) score += 3;

            // Exact type keyword match (strongest boost)
            if (typ === word) score += 25;
            else if (typ.includes(word)) score += 10;

            // Alias boost: if the word maps to a known type, boost that type
            Object.entries(TYPE_ALIASES).forEach(([aliasType, aliases]) => {
              if (aliases.some((a) => word.includes(a) || a.includes(word))) {
                if (typ === aliasType || typ.includes(aliasType)) score += 18;
                // Also boost service label that contains the alias
                if (lbl.includes(aliasType)) score += 8;
              }
            });
          });
          return { item, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(({ item }) => item);

      setResults(scored);
      setIsOpen(true);
      setHighlightedIndex(-1);
      setLoading(false);
    },
    [allItems]
  );

  useEffect(() => {
    const t = setTimeout(() => runSearch(query), 180);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Navigate to a result ──────────────────────────────────────────────────
  const goToResult = (result: SearchResult) => {
    setQuery("");
    setIsOpen(false);
    navigate(result.route);
  };

  // ── Submit search ─────────────────────────────────────────────────────────
  // Always go to the unified search results page (/search?q=...)
  // Exception: if a dropdown item is keyboard-highlighted, navigate there directly.
  const handleSearchSubmit = () => {
    if (highlightedIndex >= 0 && results[highlightedIndex]) {
      goToResult(results[highlightedIndex]);
      return;
    }
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter") handleSearchSubmit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((p) => (p < results.length - 1 ? p + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((p) => (p > 0 ? p - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleQuickSearch = (q: string) => {
    setQuery(q);
    inputRef.current?.focus();
  };

  return (
    <section className="relative min-h-[540px] md:min-h-[640px] flex flex-col overflow-hidden bg-[#2D1347]">
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=2000"
        alt="Himalayas"
        className="absolute inset-0 w-full h-full object-cover opacity-75"
        style={{ objectPosition: "center 40%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-purple-950/10 to-purple-950/65" />

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-16 md:pb-20 px-4 sm:px-6 lg:px-10">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">

          {/* Left text — desktop only */}
          <div className="hidden md:flex flex-col justify-center max-w-2xl text-white -mt-20 md:-mt-32 lg:-mt-36">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.15] tracking-tight">
              Your Complete Travel Solution In Nepal
            </h1>
            <p className="mt-4 text-lg md:text-xl font-medium text-gray-200">
              Your Journey, Our Expertise.
            </p>
            <button
              onClick={() => {
                const message = encodeURIComponent(
                  "Hello Trip Himalaya! I would like to inquire about your travel and trekking packages."
                );
                window.open(`https://wa.me/9779800000003?text=${message}`, "_blank", "noopener,noreferrer");
              }}
              className="mt-7 w-fit px-8 py-3.5 border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white hover:text-[#2D1347] rounded-xl cursor-pointer transition-all duration-200 shadow-lg group"
            >
              <span className="flex items-center gap-2.5 font-bold text-sm">
                <span>SEND INQUIRY</span>
                <ChevronRight size={16} className="text-pink-400 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* ─── Search Card ─────────────────────────────────────────────── */}
          <div className="w-full md:w-[400px] lg:w-[420px] p-5 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

            {/* Mobile heading */}
            <div className="md:hidden text-white mb-4">
              <h1 className="text-2xl font-extrabold leading-tight">
                Your Complete Travel Solution In Nepal
              </h1>
              <p className="mt-1 text-sm text-gray-200">Your Journey, Our Expertise.</p>
            </div>

            <h2 className="text-base font-extrabold flex items-center gap-2 text-white">
              <Navigation size={16} className="text-pink-400" />
              Plan Your Journey
            </h2>
            <p className="text-[10px] font-bold text-gray-300 mt-1 mb-4 uppercase tracking-wider">
              Search Tours, Treks, Hotels, Visa &amp; More
            </p>

            {/* Input + dropdown wrapper */}
            <div ref={containerRef} className="relative">

              {/* Input row */}
              <div className="flex items-center gap-2 border border-white/30 p-3 rounded-xl bg-white/20 text-white text-xs font-bold focus-within:border-pink-400 focus-within:bg-white/25 transition-all duration-200">
                {loading ? (
                  <Loader2 size={12} className="text-pink-400 flex-shrink-0 animate-spin" />
                ) : (
                  <Search size={12} className="text-pink-400 flex-shrink-0" />
                )}
                <input
                  ref={inputRef}
                  id="home-search-input"
                  type="text"
                  value={query}
                  placeholder="Search Everest, Visa, Hotels, Bali..."
                  className="bg-transparent outline-none w-full placeholder-gray-300 text-white text-xs"
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                      setIsOpen(false);
                      inputRef.current?.focus();
                    }}
                    className="flex-shrink-0 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Dropdown */}
              {isOpen && (
                <div
                  className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl bg-[#1e0a35]/95"
                  style={{ maxHeight: "340px", overflowY: "auto" }}
                >
                  {results.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <Compass size={28} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-400 font-semibold">No results for &ldquo;{query}&rdquo;</p>
                      <p className="text-[10px] text-gray-500 mt-1">Try &ldquo;Everest&rdquo;, &ldquo;Visa&rdquo; or &ldquo;Hotel&rdquo;</p>
                    </div>
                  ) : (
                    <ul role="listbox">
                      {results.map((result, idx) => {
                        const Icon = result.icon;
                        const colorClass = TYPE_COLOR_MAP[result.type] ?? "bg-gray-100 text-gray-600";
                        const isHighlighted = idx === highlightedIndex;

                        return (
                          <li
                            key={`${result.type}-${result.id}`}
                            role="option"
                            aria-selected={isHighlighted}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            onMouseLeave={() => setHighlightedIndex(-1)}
                            onClick={() => goToResult(result)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-100 border-b border-white/5 last:border-0 ${
                              isHighlighted ? "bg-white/15" : "hover:bg-white/10"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                              <Icon size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-bold truncate">{result.label}</p>
                              {result.sublabel && (
                                <p className="text-gray-400 text-[10px] truncate mt-0.5">{result.sublabel}</p>
                              )}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${colorClass}`}>
                              {TYPE_LABEL_MAP[result.type] ?? result.type}
                            </span>
                          </li>
                        );
                      })}

                      {/* See all results → unified search page */}
                      <li
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                        }}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer bg-pink-600/20 hover:bg-pink-600/35 transition-colors"
                      >
                        <span className="text-pink-300 text-[10px] font-bold uppercase tracking-wider">
                          See all results for &ldquo;{query}&rdquo;
                        </span>
                        <ArrowRight size={12} className="text-pink-400" />
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Search button — goes to unified /search?q= page */}
            <button
              type="button"
              id="home-search-btn"
              onClick={handleSearchSubmit}
              className="w-full mt-4 bg-pink-500 text-white p-3 rounded-xl hover:bg-pink-600 flex items-center justify-center gap-2 font-bold text-xs shadow-lg transition-colors cursor-pointer"
            >
              SEARCH
              <ArrowRight size={12} />
            </button>

            {/* Quick search */}
            <p className="mt-5 text-[9px] font-bold text-gray-300 flex items-center gap-2 uppercase tracking-widest">
              <TrendingUp size={12} />
              Quick Search
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {QUICK_SEARCHES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuickSearch(q)}
                  className="px-3 py-1.5 rounded-lg backdrop-blur-xl bg-white/20 text-[10px] font-bold text-gray-200 hover:bg-white/30 hover:text-white transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
