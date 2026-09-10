import React, { useState, useEffect } from "react";
import BannerSection from "../components/reuseable/BannerSection";
import { Search, MapPin, Star, ShieldCheck, Users } from "lucide-react";
import FilterSideBar from "../components/TravelPackage/FilterSiderBar";
import { packages } from "../assets/data/mockData";
import PackageDetailsSection from "../components/TravelPackage/PackageDetailsSection";
import Testimonials from "../components/reuseable/Testimonials";
import PreFooter from "../components/reuseable/PreFooter";

const Packages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPackages, setFilteredPackages] = useState(packages);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const handleSearch = () => {
    const filtered = packages.filter((pkg) => {
      // search query
      const matchesSearch =
        !searchQuery ||
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.highlights?.some((h) =>
          h.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // category (all, domestic, international)
      const matchesCategory =
        selectedCategory === "all" || !selectedCategory
          ? true
          : pkg.category.toLowerCase() === selectedCategory.toLowerCase();

      // price range
      const priceNum = Number(pkg.price?.replace(/[^0-9]/g, "") || 0);
      const matchesPrice = priceNum === 0 || priceNum <= priceRange;

      // ratings
      const matchesRating =
        selectedRating === 0 ||
        (pkg.rating !== undefined && Math.round(pkg.rating) >= selectedRating);

      // keywords
      const matchesKeywords =
        selectedKeywords.length === 0
          ? true
          : selectedKeywords.some((keyword) =>
              pkg.highlights?.some((highlight) =>
                highlight.toLowerCase().includes(keyword.toLowerCase())
              ) || pkg.title.toLowerCase().includes(keyword.toLowerCase())
            );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesKeywords
      );
    });

    setFilteredPackages(filtered);
  };

  // Auto-apply filters when any filter changes
  useEffect(() => {
    handleSearch();
  }, [
    searchQuery,
    selectedCategory,
    priceRange,
    selectedRating,
    selectedKeywords,
  ]);

  const pkg = packages.find((p) => p.id === "p1");
  const testimonies = pkg?.testimonies ?? [];

  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans">
      {/* ── PACKAGES HERO (Activities-style) ── */}
      <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000"
          alt="Canyon & Mountain Adventures"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
        <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mt-2 sm:mt-1.5">
            <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
              CURATED ADVENTURES
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
              Travel Packages
            </h1>
            <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                <Search size={18} className="text-pink-500 flex-shrink-0" />
                <div className="flex flex-col w-full text-left">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SEARCH KEYWORD</label>
                  <input
                    type="text"
                    className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal"
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                <MapPin size={18} className="text-pink-500 flex-shrink-0" />
                <div className="flex flex-col w-full text-left">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SELECT CATEGORY</label>
                  <select
                    className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="domestic">Domestic Nepal</option>
                    <option value="international">International Holidays</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
              >
                SEARCH
              </button>
            </div>
          </div>

          <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">
            "Explore the tours and treks crafted for your next adventure."
          </p>

          {/* 4 Hero Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
            {[
              { icon: MapPin, label: `${packages.length}+ Packages`, desc: "Curated Adventures" },
              { icon: Star, label: "4.9/5 Rating", desc: "Verified Reviews" },
              { icon: ShieldCheck, label: "Best Price Match", desc: "No Hidden Fees" },
              { icon: Users, label: "10,000+ Travelers", desc: "Happy Clients" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform">
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
      </section>

      {/* ── 3. MAIN CONTENT: SIDEBAR + PACKAGES LIST ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
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
            />
          </div>

          {/* Right: Package Details Cards */}
          <div className="lg:col-span-3">
            <PackageDetailsSection pkgs={filteredPackages} />
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <Testimonials testimonials={testimonies} pkg={pkg} />
        </div>
      </div>

      {/* ── 4. PREFOOTER CTA ── */}
      <PreFooter
        title="Find Your Perfect Himalayan Adventure"
        description="Speak with our travel specialists to create your dream custom itinerary."
        btn1="Call Us Now"
        btn2="Request Custom Quote"
      />
    </div>
  );
};

export default Packages;
