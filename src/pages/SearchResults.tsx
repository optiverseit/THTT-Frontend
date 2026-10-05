import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Search,
  Bed,
  Shield,
  Heart,
  Car,
  BookOpen,
  Package,
  ArrowRight,
  X,
  Loader2,
  Compass,
  ChevronRight,
  Clock,
  Star,
  Sparkles,
  ShieldCheck,
  Globe,
} from "lucide-react";
import {
  getPackages,
  getHotels,
  getAllVehicles,
  getVisaCategories,
  getInsurancePlans,
} from "../api/BackendApi";
import { services, blogPosts } from "../assets/data/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResultCard {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  meta?: string;
  route: string;
}

interface Section {
  key: string;
  label: string;
  icon: React.ElementType;
  accentHex: string;
  viewAllRoute: string;
  cards: ResultCard[];
}

// ─── Helper: Guarantee Primitive String (Prevents React Child Crash) ──────────

function safeString(val: any): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (val.country_name) return String(val.country_name);
    if (val.name) return String(val.name);
    if (val.title) return String(val.title);
    if (val.highlight) return String(val.highlight);
    return "";
  }
  return "";
}

// ─── Alias & Keyword Mapping ──────────────────────────────────────────────────

const ALIAS_MAP: Record<string, string[]> = {
  rental:       ["vehicle", "car", "rent", "jeep", "van", "bus", "transport"],
  rent:         ["vehicle", "car", "rental", "transport"],
  car:          ["vehicle", "rental", "suv", "car"],
  suv:          ["vehicle", "car", "rental", "jeep"],
  jeep:         ["vehicle", "car", "rental", "suv"],
  van:          ["vehicle", "rental", "transport"],
  bus:          ["vehicle", "transport", "bus"],
  transport:    ["vehicle", "bus", "car", "rental"],
  hotel:        ["hotel", "lodge", "resort", "accommodation", "stay", "room"],
  lodge:        ["hotel", "stay", "resort"],
  resort:       ["hotel", "luxury", "stay"],
  stay:         ["hotel", "room", "lodge"],
  accommodation:["hotel", "room", "stay"],
  room:         ["hotel", "stay"],
  visa:         ["visa", "permit", "passport", "shram", "work"],
  permit:       ["visa", "work", "shram", "permit", "work-permit"],
  passport:     ["visa", "travel"],
  shram:        ["visa", "permit", "work", "work-permit"],
  work:         ["work-permit", "permit", "visa", "shram", "work permit"],
  insurance:    ["insurance", "coverage", "policy", "claim"],
  coverage:     ["insurance", "policy"],
  policy:       ["insurance", "coverage"],
  trek:         ["trekking", "hiking", "expedition", "himalaya"],
  trekking:     ["trek", "hiking", "himalaya"],
  hike:         ["trekking", "trek", "walking"],
  hiking:       ["trekking", "trek", "walking"],
  everest:      ["everest", "ebc", "base camp", "trekking"],
  ebc:          ["everest", "base camp", "trekking"],
  annapurna:    ["annapurna", "abc", "circuit", "sanctuary", "trekking"],
  pokhara:      ["pokhara", "phewa", "paragliding", "lake"],
  bali:         ["bali", "holiday", "tours", "international"],
  adventure:    ["activity", "activities", "adventure", "rafting", "paragliding", "bungee"],
  activity:     ["activity", "activities", "adventure"],
  activities:   ["activity", "adventure"],
  paragliding:  ["activity", "adventure", "fly", "pokhara"],
  bungee:       ["activity", "adventure", "jump"],
  rafting:      ["activity", "adventure", "river", "water"],
  heli:         ["heli", "helicopter", "tour", "flight"],
  helicopter:   ["heli", "tour", "sightseeing"],
  air:          ["air", "ticket", "flight", "airline"],
  ticket:       ["air", "ticket", "flight"],
  flight:       ["air", "ticket", "airline"],
  blog:         ["blog", "article", "story", "guide"],
  article:      ["blog", "story", "read"],
  guide:        ["travel", "guide", "blog"],
};

function tokenize(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .split(/[\s,\-_/]+/)
    .map((t) => t.replace(/[^a-z0-9]/g, ""))
    .filter((t) => t.length > 1);
}

function expandTokens(tokens: string[]): string[] {
  const set = new Set(tokens);
  tokens.forEach((tok) => {
    (ALIAS_MAP[tok] ?? []).forEach((alias) => set.add(alias));
  });
  return Array.from(set);
}

function scoreFields(tokens: string[], expanded: string[], rawFields: any[]): number {
  const flattened: string[] = [];
  for (const f of rawFields) {
    if (!f) continue;
    if (typeof f === "string") flattened.push(f);
    else if (typeof f === "number") flattened.push(String(f));
    else if (Array.isArray(f)) {
      for (const item of f) {
        if (typeof item === "string") flattened.push(item);
        else if (typeof item === "object" && item) {
          if (item.highlight) flattened.push(String(item.highlight));
          if (item.name) flattened.push(String(item.name));
          if (item.title) flattened.push(String(item.title));
        }
      }
    } else if (typeof f === "object") {
      if (f.name) flattened.push(String(f.name));
      if (f.title) flattened.push(String(f.title));
      if (f.country_name) flattened.push(String(f.country_name));
      if (f.city) flattened.push(String(f.city));
    }
  }

  const text = flattened.join(" ").toLowerCase();
  if (!text) return 0;

  let score = 0;
  for (const exp of expanded) {
    if (!exp) continue;
    if (text === exp) {
      score += 35;
    } else if (text.startsWith(exp + " ") || text.endsWith(" " + exp) || text.includes(" " + exp + " ")) {
      score += 20;
    } else if (text.includes(exp)) {
      score += 10;
    }
  }

  // Prefix matching for original user input tokens
  for (const tok of tokens) {
    if (tok.length >= 3 && !text.includes(tok)) {
      const wordsInText = text.split(/\s+/);
      if (wordsInText.some((w) => w.startsWith(tok) || tok.startsWith(w))) {
        score += 6;
      }
    }
  }

  return score;
}

// ─── Default fallback image ───────────────────────────────────────────────────

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=400";

// ─── Result card component ────────────────────────────────────────────────────

const ResultCardItem = React.memo<{
  card: ResultCard;
  accentHex: string;
  IconComp: React.ElementType;
}>(({ card, accentHex, IconComp }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(card.route)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
      style={{ borderTop: `3px solid ${accentHex}` }}
    >
      {card.image && (
        <div className="relative h-28 xs:h-32 sm:h-36 overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      )}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {!card.image && (
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-3 flex-shrink-0"
            style={{ backgroundColor: `${accentHex}15`, color: accentHex }}
          >
            <IconComp size={16} />
          </div>
        )}
        <h4 className="font-bold text-[#2D1347] text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-[#E91E63] transition-colors duration-150">
          {card.title}
        </h4>
        {Boolean(card.subtitle) && (
          <p className="text-[10px] sm:text-xs font-semibold mt-0.5 line-clamp-1" style={{ color: accentHex }}>
            {card.subtitle}
          </p>
        )}
        {Boolean(card.description) && (
          <p className="text-gray-500 text-[10px] sm:text-xs mt-1 sm:mt-1.5 leading-relaxed line-clamp-2 flex-1">
            {card.description}
          </p>
        )}
        {Boolean(card.meta) && (
          <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-1.5 sm:mt-2 flex items-center gap-1">
            <Clock size={9} /> {card.meta}
          </p>
        )}
        <span
          className="mt-2 sm:mt-3 flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider group-hover:gap-2 transition-all duration-150"
          style={{ color: accentHex }}
        >
          View Details <ArrowRight size={9} />
        </span>
      </div>
    </div>
  );
});
ResultCardItem.displayName = "ResultCardItem";

// ─── Section block ────────────────────────────────────────────────────────────

const SectionBlock = React.memo<{ section: Section }>(({ section }) => {
  const Icon = section.icon;
  if (!section.cards.length) return null;
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-3 sm:mb-5 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${section.accentHex}18`, color: section.accentHex }}
          >
            <Icon size={16} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-black text-[#2D1347] leading-tight truncate">{section.label}</h3>
            <p className="text-[9px] sm:text-[10px] font-bold" style={{ color: section.accentHex }}>
              {section.cards.length} result{section.cards.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link
          to={section.viewAllRoute}
          className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider hover:opacity-75 transition-opacity flex-shrink-0"
          style={{ color: section.accentHex }}
        >
          View All <ChevronRight size={10} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {section.cards.slice(0, 8).map((card) => (
          <ResultCardItem
            key={`${section.key}-${card.id}`}
            card={card}
            accentHex={section.accentHex}
            IconComp={Icon}
          />
        ))}
      </div>
      <div className="h-px bg-gray-100 mt-6 sm:mt-10" />
    </div>
  );
});
SectionBlock.displayName = "SectionBlock";

// ─── Error boundary ───────────────────────────────────────────────────────────

class SearchErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[SearchResults] Unexpected render error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "#2D134712" }}>
            <Compass size={28} style={{ color: "#2D1347" }} />
          </div>
          <h2 className="text-lg font-black text-[#2D1347] mb-2">Something went wrong</h2>
          <p className="text-gray-500 text-sm max-w-xs">
            We couldn&apos;t load your results right now. Please try again.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-5 px-6 py-2.5 rounded-xl text-white text-xs font-bold cursor-pointer hover:opacity-90 active:scale-95 transition-all"
            style={{ backgroundColor: "#E91E63" }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Section definitions ──────────────────────────────────────────────────────

const SECTION_CONFIG: Omit<Section, "cards">[] = [
  { key: "services",  label: "Services",         icon: Compass,  accentHex: "#2D1347", viewAllRoute: "/service" },
  { key: "packages",  label: "Travel Packages",  icon: Package,  accentHex: "#E91E63", viewAllRoute: "/packages" },
  { key: "hotels",    label: "Hotel Booking",    icon: Bed,      accentHex: "#6D2891", viewAllRoute: "/service/hotel-booking" },
  { key: "vehicles",  label: "Vehicle Rental",   icon: Car,      accentHex: "#3D1F5E", viewAllRoute: "/service/vehicle-rental" },
  { key: "visa",      label: "Visa Services",    icon: Shield,   accentHex: "#C2185B", viewAllRoute: "/service/visa-services" },
  { key: "insurance", label: "Travel Insurance", icon: Heart,    accentHex: "#AD1457", viewAllRoute: "/service/travel-insurance" },
  { key: "blogs",     label: "Blog & Articles",  icon: BookOpen, accentHex: "#512DA8", viewAllRoute: "/blog" },
];

const SUGGESTIONS = ["Work Permit", "Everest", "Vehicle Rental", "Visa", "Hotel", "Trekking", "Paragliding", "Insurance"];

// ─── Main component ───────────────────────────────────────────────────────────

const SearchResultsInner: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(initialQ);
  const [query, setQuery] = useState(initialQ);

  const [backendData, setBackendData] = useState<{
    packages: any[];
    hotels: any[];
    vehicles: any[];
    visas: any[];
    insurance: any[];
  }>({ packages: [], hotels: [], vehicles: [], visas: [], insurance: [] });
  const [dataReady, setDataReady] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // Sync state if URL search params change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setInputValue(q);
    setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    abortRef.current = new AbortController();

    const fetchAll = async () => {
      try {
        const results = await Promise.allSettled([
          getPackages(),
          getHotels(),
          getAllVehicles(),
          getVisaCategories(),
          getInsurancePlans(),
        ]);

        const extract = (r: PromiseSettledResult<any>, name: string): any[] => {
          if (r.status !== "fulfilled") {
            console.error(`[Search] Failed to load ${name}:`, r.reason);
            return [];
          }
          try {
            const d = r.value?.data;
            if (Array.isArray(d)) return d;
            if (Array.isArray(d?.data)) return d.data;
            if (Array.isArray(d?.data?.data)) return d.data.data;
          } catch (e) {
            console.error(`[Search] Data extract error for ${name}:`, e);
          }
          return [];
        };

        if (!abortRef.current?.signal.aborted) {
          setBackendData({
            packages:  extract(results[0], "packages"),
            hotels:    extract(results[1], "hotels"),
            vehicles:  extract(results[2], "vehicles"),
            visas:     extract(results[3], "visas"),
            insurance: extract(results[4], "insurance"),
          });
        }
      } catch (err) {
        console.error("[Search] fetchAll unexpected error:", err);
      } finally {
        if (!abortRef.current?.signal.aborted) {
          setDataReady(true);
        }
      }
    };

    fetchAll();
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // ─── Search matching logic inside useMemo ──────────────────────────────────
  const sections: Section[] = useMemo(() => {
    try {
      const trimmed = query.trim().toLowerCase();
      if (!trimmed) return [];

      const tokens = tokenize(trimmed);
      const expanded = expandTokens(tokens);

      // 1. Services
      const matchedServices = (Array.isArray(services) ? services : [])
        .map((s) => ({
          item: s,
          score: scoreFields(tokens, expanded, [
            s.name,
            s.slug,
            s.shortDesc,
            s.description,
            Array.isArray(s.subServices) ? s.subServices : [],
          ]),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.item);

      // 2. Packages
      const matchedPackages = (Array.isArray(backendData.packages) ? backendData.packages : [])
        .map((p) => ({
          item: p,
          score: scoreFields(tokens, expanded, [
            p.title,
            p.name,
            p.location,
            p.description,
            p.type,
            p.category?.name,
            p.category?.title,
            Array.isArray(p.highlights) ? p.highlights : [],
          ]),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.item);

      // 3. Hotels
      const matchedHotels = (Array.isArray(backendData.hotels) ? backendData.hotels : [])
        .map((h) => ({
          item: h,
          score: scoreFields(tokens, expanded, [
            h.name,
            h.city,
            h.location,
            h.country,
            h.category,
            h.description,
            Array.isArray(h.amenities) ? h.amenities : [],
            Array.isArray(h.features) ? h.features : [],
          ]),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.item);

      // 4. Vehicles
      const matchedVehicles = (Array.isArray(backendData.vehicles) ? backendData.vehicles : [])
        .map((v) => ({
          item: v,
          score: scoreFields(tokens, expanded, [
            v.name,
            v.category,
            v.categoryLabel,
            v.description,
            "vehicle rental car transport suv bus jeep hire",
            Array.isArray(v.features) ? v.features : [],
          ]),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.item);

      // 5. Visas
      const matchedVisas = (Array.isArray(backendData.visas) ? backendData.visas : [])
        .map((v) => ({
          item: v,
          score: scoreFields(tokens, expanded, [
            v.name,
            v.title,
            v.country,
            v.description,
            "visa permit passport documentation work permit shram",
          ]),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.item);

      // 6. Insurance
      const matchedInsurance = (Array.isArray(backendData.insurance) ? backendData.insurance : [])
        .map((ins) => ({
          item: ins,
          score: scoreFields(tokens, expanded, [
            ins.name,
            ins.title,
            ins.description,
            "insurance travel coverage policy protection medical",
          ]),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.item);

      // 7. Blogs
      const matchedBlogs = (Array.isArray(blogPosts) ? blogPosts : [])
        .map((b) => ({
          item: b,
          score: scoreFields(tokens, expanded, [
            b.title,
            b.category,
            b.author,
            b.excerpt,
            b.content,
          ]),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.item);

      const cardsMap: Record<string, ResultCard[]> = {
        services: matchedServices.map((s) => ({
          id: s.id,
          title: safeString(s.name),
          subtitle: s.slug ? s.slug.replace(/-/g, " ").toUpperCase() : "SERVICE",
          description: safeString(s.shortDesc || s.description),
          image: safeString(s.heroImage),
          route: s.slug === "work-permit" ? "/work-permit" : `/service/${s.slug}`,
        })),
        packages: matchedPackages.map((p) => ({
          id: `pkg-${p.id}`,
          title: safeString(p.title || p.name),
          subtitle: safeString(p.location || (typeof p.category === "object" ? p.category?.name || p.category?.title : p.category) || p.duration),
          description: safeString(p.description),
          image: safeString(p.image || p.thumbnail),
          meta: safeString(p.duration),
          route: `/details/${p.id}`,
        })),
        hotels: matchedHotels.map((h) => ({
          id: `hotel-${h.id}`,
          title: safeString(h.name),
          subtitle: safeString(h.city || h.location || (typeof h.country === "object" ? h.country?.country_name || h.country?.name : h.country) || "Hotel"),
          description: safeString(h.description),
          image: safeString(h.image),
          meta: safeString(h.category),
          route: `/hotel-details/${h.id}`,
        })),
        vehicles: matchedVehicles.map((v) => ({
          id: `veh-${v.id}`,
          title: safeString(v.name),
          subtitle: safeString(v.categoryLabel || (typeof v.category === "object" ? v.category?.name : v.category) || "Vehicle"),
          description: safeString(v.description),
          image: safeString(v.image),
          meta: v.seats ? `${v.seats} seats` : undefined,
          route: `/vehicle-details/${v.id}`,
        })),
        visa: matchedVisas.map((v) => ({
          id: `visa-${v.id}`,
          title: safeString(v.name || v.title),
          subtitle: safeString(typeof v.country === "object" ? v.country?.country_name || v.country?.name : v.country) || "Visa Service",
          description: safeString(v.description || (typeof v.country === "object" ? v.country?.short_description : "")),
          image: safeString(v.image || (typeof v.country === "object" ? v.country?.flag_code : "")),
          route: `/visa-details/${v.id}`,
        })),
        insurance: matchedInsurance.map((ins) => ({
          id: `ins-${ins.id}`,
          title: safeString(ins.name || ins.title),
          subtitle: "Travel Insurance",
          description: safeString(ins.description),
          image: safeString(ins.image),
          route: `/insurance-details/${ins.id}`,
        })),
        blogs: matchedBlogs.map((b) => ({
          id: b.id,
          title: safeString(b.title),
          subtitle: safeString(b.category),
          description: safeString(b.excerpt),
          image: safeString(b.image),
          meta: safeString(b.readTime),
          route: `/blog/${b.slug}`,
        })),
      };

      return SECTION_CONFIG
        .map((conf) => ({ ...conf, cards: cardsMap[conf.key] ?? [] }))
        .filter((s) => s.cards.length > 0);
    } catch (e) {
      console.error("[SearchResults] Search calculation error:", e);
      return [];
    }
  }, [query, backendData]);

  const totalCount = useMemo(
    () => sections.reduce((acc, s) => acc + s.cards.length, 0),
    [sections]
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    setQuery(q);
    setSearchParams({ q }, { replace: true });
  };

  const handleClear = () => {
    setInputValue("");
    setQuery("");
    setSearchParams({}, { replace: true });
  };

  const handleSuggestion = (s: string) => {
    setInputValue(s);
    setQuery(s);
    setSearchParams({ q: s }, { replace: true });
  };

  const isLoading = !dataReady && !query;

  return (
    <div className="min-h-screen bg-[#FBFBFE] font-sans">
      {/* ─── Hero Section ─── */}
      <div className="relative bg-[#2D1347] pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden">
        {/* Background image — Kathmandu valley sunrise, different from tours mountain */}
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000"
          alt="Nepal Travel Search"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45 pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
          {/* Eyebrow badge */}
          <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
            PLAN YOUR JOURNEY
          </span>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-2 tracking-tight drop-shadow-2xl">
            Quick Search
          </h1>
          <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 shadow-md" />

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-4xl mb-3 sm:mb-4 relative z-20">
            <div className="bg-white rounded-2xl shadow-xl p-2 sm:p-3 border border-gray-100 flex flex-row items-center gap-2">
              {/* Single Search Input */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2">
                <Search size={16} className="flex-shrink-0" style={{ color: "#E91E63" }} />
                <div className="flex flex-col flex-1 min-w-0">
                  <label className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    SEARCH QUERY
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search services, packages, hotels…"
                    className="text-xs sm:text-sm font-semibold text-gray-700 bg-transparent focus:outline-none py-0.5 sm:py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
                    autoFocus
                  />
                </div>
              </div>

              {/* SEARCH Button */}
              <button
                type="submit"
                className="rounded-xl bg-pink-600 hover:bg-pink-700 py-2.5 sm:py-3 px-4 sm:px-7 text-white font-bold text-[10px] sm:text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer active:scale-95 flex-shrink-0"
                style={{ backgroundColor: "#E91E63" }}
              >
                SEARCH
              </button>
            </div>
          </form>

          {/* Subtitle */}
          <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">
            &ldquo;Explore packages, hotels, vehicles, visa, insurance, adventures and more — all in one place.&rdquo;
          </p>

          {/* 4 Stat Cards — exact same design as Tours page */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
            {[
              { icon: Globe,       label: "9+ Services",       desc: "All Categories Covered",  color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
              { icon: Sparkles,    label: "100% Verified",     desc: "Trusted & Certified",     color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
              { icon: ShieldCheck, label: "Govt Certified",    desc: "Multilingual Experts",    color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
              { icon: Star,        label: "4.9/5 Rating",      desc: "Trusted by 5,000+ Guests", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${stat.color} group-hover:scale-105 transition-transform`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4>
                    <p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Body Content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <Loader2 size={40} className="animate-spin" style={{ color: "#E91E63" }} />
            <p className="text-[#2D1347] font-semibold text-sm">Loading…</p>
          </div>
        )}

        {/* Empty State: No Query Typed Yet */}
        {!isLoading && !query && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-24 text-center px-4">
            <div
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-5"
              style={{ backgroundColor: "#2D134712" }}
            >
              <Search size={28} style={{ color: "#2D1347" }} />
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-[#2D1347] mb-2">What are you looking for?</h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-xs sm:max-w-md leading-relaxed">
              Search packages, hotels, vehicles, visa, insurance, blogs, and more — all in one place.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-6 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white border border-gray-200 text-[10px] sm:text-xs font-bold text-[#2D1347] hover:border-[#E91E63] hover:text-[#E91E63] transition-colors cursor-pointer shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State: Query Entered but No Results */}
        {!isLoading && query && totalCount === 0 && dataReady && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center px-4">
            <div
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-5"
              style={{ backgroundColor: "#E91E6312" }}
            >
              <Compass size={28} style={{ color: "#E91E63" }} />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#2D1347] mb-2">No results found</h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-xs sm:max-w-md mb-4 sm:mb-6 leading-relaxed">
              Nothing matched &ldquo;<strong className="text-[#2D1347]">{query}</strong>&rdquo;.
              Try searching with a broader keyword or one of the popular suggestions below.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white border border-gray-200 text-[10px] sm:text-xs font-bold text-[#2D1347] hover:border-[#E91E63] hover:text-[#E91E63] transition-colors cursor-pointer shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {!isLoading && sections.length > 0 && (
          <>
            {/* Subtle loading notice while live inventory finishes */}
            {!dataReady && query && (
              <div className="flex items-center gap-2 mb-6 text-xs text-gray-400 font-medium">
                <Loader2 size={12} className="animate-spin" style={{ color: "#E91E63" }} />
                Loading live results from services…
              </div>
            )}

            {/* Content Sections */}
            {sections.map((section) => (
              <div key={section.key} id={`section-${section.key}`}>
                <SectionBlock section={section} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// ─── Exported Component wrapped in Error Boundary ─────────────────────────────

const SearchResults: React.FC = () => (
  <SearchErrorBoundary>
    <SearchResultsInner />
  </SearchErrorBoundary>
);

export default SearchResults;
