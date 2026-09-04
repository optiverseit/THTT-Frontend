import React, { useState, useEffect } from "react";
import BannerSection from "../components/reuseable/BannerSection";
import { Search, MapPin, ChevronDown } from "lucide-react";
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
      {/* ── 1. EXACT HERO / BANNER SECTION ── */}
      <div className="relative">
        <BannerSection
          background="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000"
          alt="Canyon & Mountain Adventures"
          heading="CURATED ADVENTURES"
          title="Travel Packages"
          description="Explore the tours and trek crafted for your next adventure."
        />
      </div>

      {/* ── 2. FLOATING SEARCH & CATEGORY BAR ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-14 relative z-20">
        <div className="bg-white rounded-full shadow-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-center border border-gray-100 gap-3 sm:gap-4">
          {/* Search Keyword */}
          <div className="flex items-center px-5 sm:px-7 py-3 sm:py-3.5 gap-3.5 flex-1 w-full sm:border-r border-gray-100">
            <Search size={19} className="text-[#E91E63] flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-0.5">
                SEARCH KEYWORD
              </label>
              <input
                type="text"
                className="focus:outline-none text-xs sm:text-sm font-bold text-[#200B3B] w-full placeholder:text-gray-400 placeholder:font-normal py-0.5"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Select Category */}
          <div className="flex items-center px-5 sm:px-7 py-3 sm:py-3.5 gap-3.5 sm:w-76 lg:w-84 w-full">
            <MapPin size={19} className="text-[#E91E63] flex-shrink-0" />
            <div className="flex flex-col w-full relative">
              <label className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-0.5">
                SELECT CATEGORY
              </label>
              <div className="flex items-center justify-between">
                <select
                  className="focus:outline-none text-xs sm:text-sm font-black text-[#200B3B] bg-transparent cursor-pointer uppercase w-full appearance-none pr-6 py-0.5"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">ALL CATEGORIES</option>
                  <option value="domestic">DOMESTIC</option>
                  <option value="international">INTERNATIONAL</option>
                </select>
                <ChevronDown size={14} className="text-gray-400 pointer-events-none -ml-4" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-[#E91E63] hover:bg-pink-600 active:scale-95 text-white font-black text-xs sm:text-sm px-10 sm:px-14 py-4 sm:py-5 rounded-full uppercase tracking-wider shadow-lg shadow-pink-600/20 transition-all cursor-pointer whitespace-nowrap"
          >
            SEARCH
          </button>
        </div>
      </div>

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
        btn1="CALL US NOW"
        btn2="REQUEST CUSTOM QUOTE"
      />
    </div>
  );
};

export default Packages;
