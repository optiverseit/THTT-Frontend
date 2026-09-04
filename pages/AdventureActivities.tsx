import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { packages } from "../data/mockData";
import {
  Zap,
  Wind,
  Waves,
  Mountain,
  Search,
  MapPin,
  Clock,
  Star,
  Filter,
  ArrowRight,
  Globe,
  Target,
  Check,
  Quote,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import ServicesStrip from "@/components/Layout/ServicesStrip";

interface AdventureActivitiesProps {
  onInquire: (pkg: string) => void;
}

const AdventureActivities: React.FC<AdventureActivitiesProps> = ({
  onInquire,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "Air" | "Water" | "Land" | "combo"
  >("all");
  const [difficultyFilter, setDifficultyFilter] = useState<
    "all" | "Easy" | "Moderate" | "Hard" | "Extreme"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activities = useMemo(() => {
    return packages.filter(
      (p: any) => p.type === "activity" || p.type === "combo",
    );
  }, []);
  // ✅ Popular Adventure selections (end sections)
  const popularActivities = useMemo(() => {
    return packages.filter((p: any) => p.type === "activity").slice(0, 6);
  }, []);
  // ✅ Global reviews for Adventure only (activity + combo)
  const allAdventureReviews = useMemo(() => {
    return packages
      .filter((p: any) => p.type === "activity" || p.type === "combo")
      .flatMap((pkg: any) =>
        (pkg.testimonies || []).map((t: any) => ({
          ...t,
          packageTitle: pkg.title, // badge name
        })),
      );
  }, []);
  const popularCombos = useMemo(() => {
    return packages.filter((p: any) => p.type === "combo").slice(0, 3);
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity: any) => {
      const matchesCategory =
        activeCategory === "all"
          ? true
          : activeCategory === "combo"
            ? activity.type === "combo"
            : activity.adventureCategory === activeCategory;

      const matchesDifficulty =
        difficultyFilter === "all"
          ? true
          : activity.difficulty === difficultyFilter;

      const matchesSearch =
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activity.location || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [activities, activeCategory, difficultyFilter, searchQuery]);

  useEffect(() => {
    // Optional: scroll to top of list when filters change (same UX vibe)
    const el = document.getElementById("activities-list-top");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeCategory, difficultyFilter, searchQuery]);

  const difficultyBadge: Record<string, string> = {
    Easy: "bg-green-50 text-green-600 border-green-100",
    Moderate: "bg-blue-50 text-blue-600 border-blue-100",
    Hard: "bg-orange-50 text-orange-600 border-orange-100",
    Extreme: "bg-red-50 text-red-600 border-red-100",
  };
  const ITEMS_PER_PAGE = 15;
  const [page, setPage] = useState(1);
  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeCategory, difficultyFilter, searchQuery]);

  const totalItems = filteredActivities.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const paginatedActivities = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredActivities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredActivities, page]);

  // clamp page if results shrink
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // scroll to list top on page change
  useEffect(() => {
    const el = document.getElementById("activities-list-top");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="bg-slate-50 min-h-screen">
      {/*   */}
      <div className="sticky top-0 z-[60]">
        <ServicesStrip />
      </div>

      {/*  Hero  */}
      <section className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=2000"
            alt="Adventure Activities Background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50" /> 
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl animate-in fade-in zoom-in duration-700">
          <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">
            Adrenaline Unlocked
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            Adventure Activities
          </h1>

          <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-6 shadow-lg" />

          <p className="text-white/80 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
            "Push your limits in Nepal’s most thrilling adventure playground."
          </p>
        </div>
      </section>

      {/* ✅ Search row same as 2nd */}
      <section className="relative -mt-20 w-full px-4 md:px-8 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-white p-2 rounded-[2rem] shadow-2xl mb-10 flex flex-col md:flex-row gap-2 border border-slate-100">
            <div className="flex-1 flex items-center px-6 py-4 md:border-r border-slate-100">
              <Search size={20} className="text-[#D92671] mr-4" />
              <div className="w-full">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Search activity
                </p>
                <input
                  type="text"
                  placeholder="Bungee, Paragliding, Rafting..."
                  className="w-full text-sm font-bold text-slate-800 outline-none placeholder-slate-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 flex items-center px-6 py-4 md:border-r border-slate-100">
              <MapPin size={20} className="text-[#D92671] mr-4" />
              <div className="w-full">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Category
                </p>
                <select
                  className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value as any)}
                >
                  <option value="all">ALL ACTIVITIES</option>
                  <option value="Air">AIR ADVENTURES</option>
                  <option value="Water">WATER SPORTS</option>
                  <option value="Land">LAND & HEIGHTS</option>
                  <option value="combo">COMBO DEALS</option>
                </select>
              </div>
            </div>

            <button className="bg-[#D92671] text-white px-12 py-5 rounded-[1.5rem] font-black tracking-widest hover:brightness-110 transition-all shadow-xl active:scale-95">
              SEARCH
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ✅ Sidebar same feel as 2nd */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-[#2D1347] flex items-center">
                    <Filter size={18} className="mr-2 text-[#D92671]" /> Filter
                    By
                  </h2>
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setDifficultyFilter("all");
                      setSearchQuery("");
                    }}
                    className="text-[10px] font-black text-[#D92671] uppercase tracking-widest"
                  >
                    Clear All
                  </button>
                </div>

                {/* Category buttons (same pattern as your first, but 2nd styling) */}
                <div className="mb-10">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">
                    Category
                  </h3>

                  <div className="space-y-2">
                    {[
                      { id: "all", label: "All Activities", icon: Globe },
                      { id: "Air", label: "Air Adventures", icon: Wind },
                      { id: "Water", label: "Water Sports", icon: Waves },
                      { id: "Land", label: "Land & Heights", icon: Mountain },
                      { id: "combo", label: "Combo Deals", icon: Zap },
                    ].map((cat: any) => {
                      const active = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`
                            w-full flex items-center gap-3
                            px-4 py-3 rounded-xl border
                            text-[11px] font-black uppercase tracking-widest
                            transition-all
                            ${
                              active
                                ? "bg-[#D92671]/10 border-[#D92671] text-[#D92671]"
                                : "bg-slate-50 border-slate-100 text-slate-500 hover:border-[#D92671]/30 hover:text-[#D92671]"
                            }
                          `}
                        >
                          <cat.icon size={16} />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty pills */}
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">
                    Difficulty
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["all", "Easy", "Moderate", "Hard", "Extreme"].map(
                      (diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficultyFilter(diff as any)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                            difficultyFilter === diff
                              ? "bg-[#D92671] text-white border-[#D92671]"
                              : "bg-slate-50 text-slate-400 border-slate-100 hover:border-[#D92671] hover:text-[#D92671]"
                          }`}
                        >
                          {diff}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Main list converted to 2nd design row cards */}
            <div className="lg:col-span-3 space-y-6 relative">
              <div id="activities-list-top" />
              {/* ✅ Sticky Right Pagination (desktop) */}
              {totalItems > 0 && totalPages > 1 && (
                <div className="hidden lg:block">
                  <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[60]">
                    <div className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl shadow-xl p-3 flex flex-col items-center gap-2">
                      <button
                        type="button"
                        onClick={goPrev}
                        disabled={page === 1}
                        className={`
            w-10 h-10 rounded-xl border flex items-center justify-center
            transition-all
            ${
              page === 1
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-white text-[#2D1347] border-slate-100 hover:border-[#D92671]/30 hover:text-[#D92671]"
            }
          `}
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <div className="text-center px-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Page
                        </p>
                        <p className="text-[12px] font-black text-[#2D1347]">
                          {page} / {totalPages}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={goNext}
                        disabled={page === totalPages}
                        className={`
            w-10 h-10 rounded-xl border flex items-center justify-center
            transition-all
            ${
              page === totalPages
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-[#D92671] text-white border-[#D92671] hover:brightness-110 shadow-md shadow-[#D92671]/20"
            }
          `}
                        aria-label="Next page"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {paginatedActivities.map((a: any) => {
                const desc =
                  a.shortDesc ||
                  a.description ||
                  "A high-energy adventure experience curated for safety, excitement, and unforgettable views.";

                return (
                  <Link
                    key={a.id}
                    to={`/tour-packages/${a.slug}`}
                    className="bg-white rounded-[2rem] overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500 border border-slate-100 shadow-lg"
                  >
                    {/* Image section */}
                    <div className="w-full md:w-[400px]">
                      <div className="relative overflow-hidden shrink-0 aspect-[16/10] md:aspect-[4/3]">
                        <img
                          src={a.image}
                          alt={a.title}
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000"
                          loading="lazy"
                        />

                        {/* badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span
                            className={`
                              px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                              border bg-white/90 backdrop-blur-md
                              ${difficultyBadge[a.difficulty || "Easy"] || "border-slate-100 text-slate-500"}
                            `}
                          >
                            {a.difficulty || "Easy"}
                          </span>

                          {a.type === "combo" && (
                            <span className="bg-[#D92671] text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                              Combo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* info section */}
                    <div className="flex-1 p-7 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Popular Choice
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-black text-[#2D1347] mb-2 group-hover:text-[#D92671] transition-colors tracking-tight">
                        {a.title}
                      </h3>

                      <p className="text-[12px] md:text-[13px] text-slate-500 font-semibold leading-relaxed line-clamp-2 mb-5">
                        {desc}
                      </p>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center text-slate-500 text-xs font-bold">
                          <MapPin size={16} className="text-[#D92671] mr-2" />
                          {a.location || "Nepal"}
                        </div>
                        <div className="flex items-center text-slate-500 text-xs font-bold">
                          <Clock size={16} className="text-[#D92671] mr-2" />
                          {a.duration || "Flexible"}
                        </div>
                        <div className="flex items-center text-slate-500 text-xs font-bold">
                          <Target size={16} className="text-[#D92671] mr-2" />
                          {a.intensity || "Medium"}
                        </div>
                      </div>
                    </div>

                    {/* price/action section */}
                    <div className="w-full md:w-[240px] bg-slate-50/60 p-7 md:p-8 flex flex-col justify-center items-center md:border-l border-slate-100 text-center shrink-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Starting from
                      </p>
                      <div className="text-3xl font-black text-[#D92671] mb-5 tracking-tight">
                        {a.price || "Contact"}
                      </div>

                      <div className="w-full grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onInquire(a.title);
                          }}
                          className="w-full bg-[#D92671] text-white py-2 px-1 rounded-2xl font-black text-[10px] tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95 uppercase"
                        >
                          View Details
                        </button>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onInquire(`Book Now: ${a.title}`);
                          }}
                          className="w-full bg-[#2D1347] text-white py-3 rounded-2xl font-black text-[10px] tracking-widest hover:bg-[#1f0d33] transition-all shadow-lg active:scale-95 uppercase"
                        >
                          Book Now
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-center space-x-2 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span>Instant Inquiry</span>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {filteredActivities.length === 0 && (
                <div className="bg-white p-20 rounded-[3rem] text-center shadow-xl border border-slate-100">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-[#2D1347] mb-2">
                    No matching activities
                  </h3>
                  <p className="text-slate-500 font-medium mb-8">
                    Try adjusting your filters or search keywords.
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setDifficultyFilter("all");
                      setSearchQuery("");
                    }}
                    className="text-[#D92671] font-black uppercase tracking-widest text-xs hover:underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
{/* Bottom Pagination */}
              {totalItems > 0 && totalPages > 1 && (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Showing{" "}
                    <span className="text-[#D92671]">
                      {(page - 1) * ITEMS_PER_PAGE + 1}–
                      {Math.min(page * ITEMS_PER_PAGE, totalItems)}
                    </span>{" "}
                    of <span className="text-[#D92671]">{totalItems}</span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={page === 1}
                      className={`
                        px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest
                        border transition-all
                        ${
                          page === 1
                            ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                            : "bg-white text-[#2D1347] border-slate-100 hover:border-[#D92671]/30 hover:text-[#D92671] hover:shadow-sm"
                        }
                      `}
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;

                      const shouldShow =
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        Math.abs(pageNum - page) <= 1;

                      const isEllipsis =
                        (pageNum === page - 2 && pageNum > 1) ||
                        (pageNum === page + 2 && pageNum < totalPages);

                      if (isEllipsis) {
                        return (
                          <span
                            key={`e-${pageNum}`}
                            className="px-2 text-slate-300 font-black"
                          >
                            …
                          </span>
                        );
                      }

                      if (!shouldShow) return null;

                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setPage(pageNum)}
                          className={`
                            w-10 h-10 rounded-xl text-[11px] font-black
                            transition-all border
                            ${
                              page === pageNum
                                ? "bg-[#D92671] text-white border-[#D92671] shadow-md shadow-[#D92671]/20"
                                : "bg-white text-[#2D1347] border-slate-100 hover:border-[#D92671]/30 hover:text-[#D92671]"
                            }
                          `}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={goNext}
                      disabled={page === totalPages}
                      className={`
                        px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest
                        border transition-all
                        ${
                          page === totalPages
                            ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                            : "bg-white text-[#2D1347] border-slate-100 hover:border-[#D92671]/30 hover:text-[#D92671] hover:shadow-sm"
                        }
                      `}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
          {/* Bottom CTA */}
          {filteredActivities.length > 0 && (
            <div className="mt-14 flex mb-4 justify-center">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-3 bg-[#D92671] text-white px-10 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-md hover:shadow-xl transition-all group"
              >
                Back to Top
                <ArrowRight
                  size={16}
                  className="rotate-[-90deg] group-hover:-translate-y-1 transition-transform"
                />
              </button>
            </div>
          )}
          
        </div>
      </section>
      {/* ========================= */}
      {/* Popular Adventure Sections */}
      {/* ========================= */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* A) Popular Adventure Activities */}
          <div className="mb-12">
            <div className="flex items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-[#D92671] font-black uppercase tracking-[0.3em] text-xs">
                  Popular Picks
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-[#2D1347] mt-3 tracking-tight">
                  Popular Adventure Activities
                </h2>
              </div>

              <Link
                to="/services/activites"
                className="hidden md:inline-flex bg-[#5D2A8E]/10 text-[#5D2A8E] px-7 py-3 rounded-full font-black tracking-widest text-[10px] uppercase hover:bg-[#5D2A8E] hover:text-white transition-all"
              >
                View All Activities
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularActivities.slice(0, 3).map((item: any) => (
                <Link
                  key={item.id}
                  to={`/tour-packages/${item.slug}`}
                  className="group bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />

                    {/* duration */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-[#5D2A8E] uppercase tracking-widest">
                      {item.duration || "Flexible"}
                    </div>

                    {/* optional difficulty */}
                    {item.difficulty && (
                      <div className="absolute top-4 right-4 bg-[#2D1347] text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                        {item.difficulty}
                      </div>
                    )}
                  </div>

                  <div className="p-8">
                    <h4 className="text-lg font-black text-[#2D1347] group-hover:text-[#D92671] transition-colors mb-4 leading-tight">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <MapPin size={14} className="mr-1 text-[#D92671]" />
                        {item.location || "Nepal"}
                      </div>

                      <div className="text-lg font-black text-[#D92671]">
                        {item.price || "Contact"}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 md:hidden">
              <Link
                to="/services/activites"
                className="w-full inline-flex justify-center bg-[#5D2A8E]/10 text-[#5D2A8E] px-7 py-4 rounded-2xl font-black tracking-widest text-[10px] uppercase hover:bg-[#5D2A8E] hover:text-white transition-all"
              >
                View All Activities
              </Link>
            </div>
          </div>

          {/* B) Popular Adventure Combos */}
          <div>
            <div className="flex items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-[#D92671] font-black uppercase tracking-[0.3em] text-xs">
                  Combo Deals
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-[#2D1347] mt-3 tracking-tight">
                  Popular Adventure Combos
                </h2>
              </div>

              <Link
                to="/services/activites?tab=combo"
                className="hidden md:inline-flex bg-[#D92671]/10 text-[#D92671] px-7 py-3 rounded-full font-black tracking-widest text-[10px] uppercase hover:bg-[#D92671] hover:text-white transition-all"
              >
                View All Combos
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularCombos.slice(0, 3).map((combo: any) => (
                <Link
                  key={combo.id}
                  to={`/tour-packages/${combo.slug}`}
                  className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />

                    {/* combo badge */}
                    <div className="absolute top-4 right-4 bg-[#D92671] text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                      Combo
                    </div>

                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-[#5D2A8E] uppercase tracking-widest">
                      {combo.duration || "Multi-day"}
                    </div>
                  </div>

                  <div className="p-8">
                    <h4 className="text-lg font-black text-[#2D1347] group-hover:text-[#D92671] transition-colors mb-4 leading-tight">
                      {combo.title}
                    </h4>

                    {/* optional combo includes */}
                    {combo.highlights?.length ? (
                      <p className="text-[12px] font-semibold text-slate-500 leading-relaxed line-clamp-2 mb-5">
                        Includes: {combo.highlights.slice(0, 2).join(" + ")}
                        {combo.highlights.length > 2 ? " + more" : ""}
                      </p>
                    ) : null}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <MapPin size={14} className="mr-1 text-[#D92671]" />
                        {combo.location || "Nepal"}
                      </div>

                      <div className="text-lg font-black text-[#D92671]">
                        {combo.price || "Contact"}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 md:hidden">
              <Link
                to="/services/activites?tab=combo"
                className="w-full inline-flex justify-center bg-[#D92671]/10 text-[#D92671] px-7 py-4 rounded-2xl font-black tracking-widest text-[10px] uppercase hover:bg-[#D92671] hover:text-white transition-all"
              >
                View All Combos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Global Review Section - Aggregates from ALL Adventure Activities + Combos */}
      <section className="py-5 bg-slate-50 relative overflow-hidden">
        {/* soft background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D92671]/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5D2A8E]/5 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-14 pt-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#2D1347] tracking-tight">
              What Our Customers Say
            </h2>

            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="h-1 w-10 bg-[#D92671] rounded-full" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                Verified reviews from all our adventure activities & combos
              </p>
              <div className="h-1 w-10 bg-[#D92671] rounded-full" />
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAdventureReviews.length > 0 ? (
              allAdventureReviews.map((review: any, idx: number) => (
                <div
                  key={`${review.id}-${idx}`}
                  className="
              bg-white p-6 rounded-[2.2rem]
              border border-slate-100 shadow-lg
              hover:shadow-xl transition-all duration-500
              relative overflow-hidden group flex flex-col
            "
                >
                  <Quote
                    size={88}
                    className="absolute -top-6 -right-6 text-slate-100 group-hover:text-[#D92671]/10 transition-all duration-500 pointer-events-none"
                  />

                  {/* Header row */}
                  <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={
                            review.userAvatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              review.userName,
                            )}&background=D92671&color=fff`
                          }
                          alt={review.userName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full shadow-md border border-white">
                          <Check size={8} strokeWidth={4} />
                        </div>
                      </div>

                      <div className="text-left">
                        <h4 className="font-black text-[#2D1347] text-sm leading-tight">
                          {review.userName}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {review.location}
                        </p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? "currentColor" : "none"}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <p className="relative z-10 text-[#2D1347]/80 text-sm font-semibold leading-relaxed flex-grow">
                    <span className="text-[#D92671] font-serif text-xl mr-1">
                      “
                    </span>
                    {review.comment}
                    <span className="text-[#D92671] font-serif text-xl ml-1">
                      ”
                    </span>
                  </p>

                  {/* Bottom meta */}
                  <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Verified Review
                    </span>

                    <div className="bg-[#D92671]/10 text-[#D92671] px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-[#D92671] group-hover:text-white transition-all line-clamp-1">
                      {review.packageTitle || "Adventure"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white rounded-[2.2rem] border border-slate-100 shadow-sm">
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                  Be the first to leave a review for our adventure activities!
                </p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-14 flex justify-center">
            <button
              onClick={() => onInquire("")}
              className="
          flex items-center gap-3
          bg-[#D92671] px-10 py-4 rounded-[2rem]
          border border-[#D92671]/30
          font-black text-[11px] uppercase tracking-widest text-white
          shadow-md hover:shadow-xl transition-all duration-500 group
        "
            >
              <span>See More Reviews</span>
              <ArrowRight
                size={16}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdventureActivities;
