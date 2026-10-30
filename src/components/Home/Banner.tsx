import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronRight,
  Navigation,
  Search,
  ArrowRight,
  TrendingUp,
  X,
  Compass,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  SearchResult,
  TYPE_COLOR_MAP,
  TYPE_LABEL_MAP,
  QUICK_SEARCHES,
  getCachedSearchItems,
  syncLiveDatabase,
  executeSearch,
} from "../homesearchcache";

// ─── Banner Component ─────────────────────────────────────────────────────────

const Banner: React.FC = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allItems, setAllItems] = useState<SearchResult[]>(getCachedSearchItems);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Sync with Live Database in Background without Blocking ──────────────
  // Connects to live backend APIs via homesearchcache.
  // Real database items are cached locally for 0ms sub-millisecond retrieval.
  useEffect(() => {
    let isMounted = true;

    syncLiveDatabase((updatedItems) => {
      if (isMounted) {
        setAllItems(updatedItems);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // ── High-Speed Search Algorithm (0ms in-memory execution) ───────────────────
  const runSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      const scored = executeSearch(trimmed, allItems, 20);

      setResults(scored);
      setIsOpen(true);
      setHighlightedIndex(-1);
      setLoading(false);
    },
    [allItems]
  );

  // ── Ultra-fast typing response (40ms debounce) ─────────────────────────────
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const t = setTimeout(() => runSearch(query), 40);
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

  // ── Navigate to selected result details page ──────────────────────────────
  const goToResult = (result: SearchResult) => {
    setQuery("");
    setIsOpen(false);
    navigate(result.route);
  };

  // ── Submit search: directly navigates to chosen/top card (No Quick Search redirect)
  const handleSearchSubmit = () => {
    if (highlightedIndex >= 0 && results[highlightedIndex]) {
      goToResult(results[highlightedIndex]);
      return;
    }
    if (results.length > 0) {
      goToResult(results[0]);
      return;
    }
    if (query.trim()) {
      runSearch(query);
      setIsOpen(true);
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

  // ── Instant Quick Search Chip Click (0ms execution) ───────────────────────
  const handleQuickSearch = (q: string) => {
    setQuery(q);
    runSearch(q);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <section className="relative min-h-[540px] md:min-h-[640px] flex flex-col overflow-hidden bg-[#2D1347]">
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=2000"
        alt="Himalayas - Trip Himalaya Tours & Travel"
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
              id="home-send-inquiry-btn"
              onClick={() => navigate("/contact")}
              className="mt-7 w-fit px-8 py-3.5 border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white hover:text-[#2D1347] rounded-xl cursor-pointer transition-all duration-200 shadow-lg group"
            >
              <span className="flex items-center gap-2.5 font-bold text-sm">
                <span>SEND INQUIRY</span>
                <ChevronRight size={16} className="text-pink-400 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* ─── Search Card ─────────────────────────────────────────────── */}
          <div className="w-full md:w-[420px] lg:w-[440px] xl:w-[455px] p-5 sm:p-6 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

            {/* Mobile heading */}
            <div className="md:hidden text-white mb-4">
              <p className="text-2xl font-extrabold leading-tight">
                Your Complete Travel Solution In Nepal
              </p>
              <p className="mt-1 text-sm text-gray-200">Your Journey, Our Expertise.</p>
            </div>

            <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2 text-white">
              <Navigation size={17} className="text-pink-400" />
              Plan Your Journey
            </h2>
            <p className="text-[11px] font-bold text-gray-300 mt-1 mb-4 uppercase tracking-wider">
              Search Tours, Treks, Hotels, Visa &amp; More
            </p>

            {/* Input + dropdown wrapper */}
            <div ref={containerRef} className="relative">

              {/* Input row */}
              <div className="flex items-center gap-2 border border-white/30 p-3 sm:p-3.5 rounded-xl bg-white/20 text-white text-xs sm:text-sm font-bold focus-within:border-pink-400 focus-within:bg-white/25 transition-all duration-200">
                {loading ? (
                  <Loader2 size={14} className="text-pink-400 flex-shrink-0 animate-spin" />
                ) : (
                  <Search size={14} className="text-pink-400 flex-shrink-0" />
                )}
                <input
                  ref={inputRef}
                  id="home-search-input"
                  type="text"
                  value={query}
                  placeholder="Search Everest, Visa, Hotels, Bali..."
                  className="bg-transparent outline-none w-full placeholder-gray-300 text-white text-xs sm:text-sm font-medium"
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (query.trim()) {
                      runSearch(query);
                    }
                  }}
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
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Dropdown: Instant Results (Max 5 items visible, smoothly scrollable for more) */}
              {isOpen && (
                <div
                  className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl bg-[#1e0a35]/95 overflow-hidden"
                >
                  {results.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <Compass size={28} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-400 font-semibold">No results for &ldquo;{query}&rdquo;</p>
                      <p className="text-[10px] text-gray-500 mt-1">Try &ldquo;Thailand&rdquo;, &ldquo;UAE&rdquo;, &ldquo;Visa&rdquo; or &ldquo;Tours&rdquo;</p>
                    </div>
                  ) : (
                    <ul
                      role="listbox"
                      className="search-dropdown-list overflow-y-auto divide-y divide-white/5"
                      style={{
                        maxHeight: "290px",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(244, 114, 182, 0.6) rgba(255, 255, 255, 0.05)",
                      }}
                    >
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
                            className={`flex items-center gap-3 px-4 py-2.5 h-[58px] min-h-[58px] box-border cursor-pointer transition-colors duration-100 ${
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
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Search button — directly selects top result */}
            <button
              type="button"
              id="home-search-btn"
              onClick={handleSearchSubmit}
              className="w-full mt-3.5 bg-pink-500 text-white p-3 sm:p-3.5 rounded-xl hover:bg-pink-600 active:scale-[0.98] flex items-center justify-center gap-2 font-bold text-xs sm:text-sm tracking-wider shadow-lg transition-all cursor-pointer"
            >
              SEARCH
              <ArrowRight size={13} />
            </button>

            {/* Quick search */}
            <p className="mt-4 sm:mt-5 text-[10px] sm:text-[11px] font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-widest">
              <TrendingUp size={12} />
              Quick Search
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {QUICK_SEARCHES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuickSearch(q)}
                  className="px-3 py-1.5 rounded-lg backdrop-blur-xl bg-white/20 text-[10px] sm:text-[11px] font-bold text-gray-200 hover:bg-white/30 hover:text-white transition-all cursor-pointer active:scale-95"
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
