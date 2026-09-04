import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { packages } from "../data/mockData";
import {
  CheckCircle2,
  Search,
  MapPin,
  Clock,
  Star,
  Filter,
  Map,
  Tag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageSquare,
  Quote,
} from "lucide-react";
import ServicesStrip from "@/components/Layout/ServicesStrip";

interface TourPackagesProps {
  onInquire: (pkg: string) => void;
}

const ITEMS_PER_PAGE = 15;

const TourPackages: React.FC<TourPackagesProps> = ({ onInquire }) => {
  const [filter, setFilter] = useState<"all" | "domestic" | "international">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  // Aggregate all reviews from all packages for the bottom section
  const allReviews = useMemo(() => {
    return packages.flatMap((pkg) =>
      (pkg.testimonies || []).map((t) => ({
        ...t,
        packageTitle: pkg.title,
      })),
    );
  }, []);
  // ⭐ pagination
  const [page, setPage] = useState(1);

  const keywords = [
    "Everest",
    "Annapurna",
    "Bali",
    "Pokhara",
    "Chitwan",
    "Trekking",
    "Luxury",
    "Adventure",
    "Culture",
    "Wildlife",
    "EBC",
    "ABC",
    "Heli Tour",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg: any) => {
      const matchesFilter = filter === "all" || pkg.category === filter;
      const matchesSearch = pkg.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const priceNum = pkg.price
        ? parseInt(String(pkg.price).replace(/[^0-9]/g, ""))
        : 0;
      const matchesPrice = priceNum <= priceRange || priceRange >= 5000;

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some(
          (tag) =>
            pkg.title.toLowerCase().includes(tag.toLowerCase()) ||
            (pkg.highlights || []).some((h: string) =>
              h.toLowerCase().includes(tag.toLowerCase()),
            ),
        );

      return matchesFilter && matchesSearch && matchesPrice && matchesTags;
    });
  }, [filter, searchQuery, priceRange, selectedTags]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filter, searchQuery, priceRange, selectedTags]);

  const totalItems = filteredPackages.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const paginatedPackages = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPackages.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPackages, page]);

  // clamp page if results shrink
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // scroll to list top on page change
  useEffect(() => {
    const el = document.getElementById("packages-list-top");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className={`sticky top-0 z-[60]`}>
          <ServicesStrip />
        </div>
      {/* Hero */}
      <section className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=2000"
            alt="Tour Packages Background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl animate-in fade-in zoom-in duration-700">
          <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">
            Curated Adventures
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            Travel Packages
          </h1>

          <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-6 shadow-lg" />

          <p className="text-white/80 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
            "Explore the tours and trek crafted for your next adventure."
          </p>
        </div>
      </section>

      {/* Search row */}
      <section className="relative -mt-20 w-full px-4 md:px-8 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-white p-2 rounded-[2rem] shadow-2xl mb-10 flex flex-col md:flex-row gap-2 border border-slate-100">
            <div className="flex-1 flex items-center px-6 py-4 md:border-r border-slate-100">
              <Search size={20} className="text-[#D92671] mr-4" />
              <div className="w-full">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Search keyword
                </p>
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="w-full text-sm font-bold text-slate-800 outline-none placeholder-slate-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 flex items-center px-6 py-4 md:border-r border-slate-100">
              <Map size={20} className="text-[#D92671] mr-4" />
              <div className="w-full">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Select Category
                </p>
                <select
                  className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <option value="all">ALL CATEGORIES</option>
                  <option value="domestic">DOMESTIC TRIPS</option>
                  <option value="international">INTERNATIONAL TRIPS</option>
                </select>
              </div>
            </div>

            <button className="bg-[#D92671] text-white px-12 py-5 rounded-[1.5rem] font-black tracking-widest hover:brightness-110 transition-all shadow-xl active:scale-95">
              SEARCH
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-[#2D1347] flex items-center">
                    <Filter size={18} className="mr-2 text-[#D92671]" /> Filter
                    By
                  </h2>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("all");
                      setPriceRange(5000);
                      setSelectedTags([]);
                      setMinRating(0);
                    }}
                    className="text-[10px] font-black text-[#D92671] uppercase tracking-widest"
                  >
                    Clear All
                  </button>
                </div>

                {/* Price Range */}
                <div className="mb-10">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">
                    Price Range (USD)
                  </h3>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-[#D92671]"
                  />
                  <div className="flex justify-between mt-4 text-[11px] font-black text-slate-500">
                    <span>$0</span>
                    <span className="text-[#D92671]">$ {priceRange}</span>
                  </div>
                </div>
                {/* Ratings */}
                <div className="mb-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">
                    Ratings
                  </h3>

                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setMinRating(rating)}
                        className={`
          w-full flex items-center justify-between
          px-4 py-2 rounded-xl border
          text-[11px] font-black uppercase tracking-widest
          transition-all
          ${
            minRating === rating
              ? "bg-[#D92671]/10 border-[#D92671] text-[#D92671]"
              : "bg-slate-50 border-slate-100 text-slate-500 hover:border-[#D92671] hover:text-[#D92671]"
          }
        `}
                      >
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < rating ? "currentColor" : "none"}
                              className={
                                i < rating
                                  ? "text-yellow-400"
                                  : "text-slate-300"
                              }
                            />
                          ))}
                        </div>
 
                      </button>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center">
                    <Tag size={12} className="mr-2" /> Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                          selectedTags.includes(tag)
                            ? "bg-[#D92671] text-white border-[#D92671]"
                            : "bg-slate-50 text-slate-400 border-slate-100 hover:border-[#D92671] hover:text-[#D92671]"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main list */}
            <div className="lg:col-span-3 space-y-6 relative">
              <div id="packages-list-top" />

              {/* ✅ Sticky Right Pagination (desktop) */}
              {totalItems > 0 && totalPages > 1 && (
                <div className="hidden lg:block">
                  {/* middle sticky */}
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

              {paginatedPackages.map((pkg: any) => {
                const desc =
                  pkg.shortDesc ||
                  pkg.description ||
                  "A curated travel experience with expert planning, flexible options, and memorable highlights.";

                return (
                  <Link
                    key={pkg.id}
                    to={`/tour-packages/${pkg.slug}`}
                    className="bg-white rounded-[2rem] overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500 border border-slate-100 shadow-lg"
                  >
                    {/* ✅ Image Section — fixed consistent size */}
                    <div className="w-full md:w-[320px]">
                      <div className="relative overflow-hidden shrink-0 aspect-[16/10] md:aspect-[4/3]">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000"
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-[#5D2A8E] tracking-widest uppercase">
                          {pkg.category}
                        </div>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 p-7 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Highly Rated
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-black text-[#2D1347] mb-2 group-hover:text-[#D92671] transition-colors tracking-tight">
                        {pkg.title}
                      </h3>

                      {/* ✅ small description instead of chips */}
                      <p className="text-[12px] md:text-[13px] text-slate-500 font-semibold leading-relaxed line-clamp-2 mb-5">
                        {desc}
                      </p>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center text-slate-500 text-xs font-bold">
                          <MapPin size={16} className="text-[#D92671] mr-2" />
                          {pkg.category === "domestic"
                            ? "Nepal"
                            : "International"}
                        </div>
                        <div className="flex items-center text-slate-500 text-xs font-bold">
                          <Clock size={16} className="text-[#D92671] mr-2" />
                          {pkg.duration}
                        </div>
                      </div>
                    </div>

                    {/* Pricing/Action Section */}
                    <div className="w-full md:w-[240px] bg-slate-50/60 p-7 md:p-8 flex flex-col justify-center items-center md:border-l border-slate-100 text-center shrink-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Starting from
                      </p>
                      <div className="text-3xl font-black text-[#D92671] mb-5 tracking-tight">
                        {pkg.price || "Contact"}
                      </div>

                      {/* ✅ two buttons */}
                      <div className="w-full grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onInquire(pkg.title);
                          }}
                          className="w-full bg-[#D92671] text-white py-2 px-1 rounded-2xl font-black text-[10px] tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95 uppercase"
                        >
                          View Details
                        </button>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onInquire(`Book Now: ${pkg.title}`);
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

              {/* Empty state */}
              {filteredPackages.length === 0 && (
                <div className="bg-white p-20 rounded-[3rem] text-center shadow-xl border border-slate-100">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black text-[#2D1347] mb-2">
                    No matching packages
                  </h3>
                  <p className="text-slate-500 font-medium mb-8">
                    Try adjusting your filters or search keywords.
                  </p>
                  <button
                    onClick={() => {
                      setFilter("all");
                      setSearchQuery("");
                      setPriceRange(5000);
                      setSelectedTags([]);
                    }}
                    className="text-[#D92671] font-black uppercase tracking-widest text-xs hover:underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom CTA */}
          {totalItems > 0 && (
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
          {/* New Global Review Section - Aggregates from ALL packages */}

          <section className="py-5 bg-slate-50 relative overflow-hidden">
            {/* soft background blobs (same as 2nd) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D92671]/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5D2A8E]/5 rounded-full blur-3xl -ml-32 -mb-32" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
              {/* Header – same style as 2nd */}
              <div className="text-center mb-14 pt-16">
                <h2 className="text-3xl md:text-5xl font-black text-[#2D1347] tracking-tight">
                  What Our Customers Say
                </h2>

                <div className="mt-4 flex items-center justify-center space-x-2">
                  <div className="h-1 w-10 bg-[#D92671] rounded-full" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    Verified reviews from all our adventures worldwide
                  </p>
                  <div className="h-1 w-10 bg-[#D92671] rounded-full" />
                </div>
              </div>

              {/* Cards – same design language as 2nd */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allReviews.length > 0 ? (
                  allReviews.map((review, idx) => (
                    <div
                      key={`${review.id}-${idx}`}
                      className="
              bg-white
              p-6
              rounded-[2.2rem]
              border border-slate-100
              shadow-lg
              hover:shadow-xl
              transition-all duration-500
              relative
              overflow-hidden
              group
              flex flex-col
            "
                    >
                      {/* Quote – same positioning as 2nd */}
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

                        {/* Stars – same style as 2nd */}
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

                      {/* Message – same typography feel as 2nd */}
                      <p className="relative z-10 text-[#2D1347]/80 text-sm font-semibold leading-relaxed flex-grow">
                        <span className="text-[#D92671] font-serif text-xl mr-1">
                          “
                        </span>
                        {review.comment}
                        <span className="text-[#D92671] font-serif text-xl ml-1">
                          ”
                        </span>
                      </p>

                      {/* Bottom meta – keep your package badge but styled like 2nd */}
                      <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Verified Review
                        </span>

                        <div className="bg-[#D92671]/10 text-[#D92671] px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-[#D92671] group-hover:text-white transition-all">
                          {review.packageTitle || "Package"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center bg-white rounded-[2.2rem] border border-slate-100 shadow-sm">
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                      Be the first to leave a review for our packages!
                    </p>
                  </div>
                )}
              </div>

              {/* CTA – */}
              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => onInquire("")}
                  className="
          flex items-center gap-3
          bg-[#D92671]
          px-10 py-4
          rounded-[2rem]
          border border-[#D92671]/30
          font-black
          text-[11px]
          uppercase
          tracking-widest
          text-white
          shadow-md
          hover:shadow-xl
          transition-all
          duration-500
          group
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
      </section>
    </div>
  );
};

export default TourPackages;
