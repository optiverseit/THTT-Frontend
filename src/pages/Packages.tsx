import React, { useState, useEffect } from "react";
import BannerSection from "../components/reuseable/BannerSection";
import { Search, MapPin } from "lucide-react";
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
      {/* ── 1. EXACT HERO / BANNER SECTION (Title -> SearchBar -> Quote) ── */}
      <div className="relative">
        <BannerSection
          background="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000"
          alt="Canyon & Mountain Adventures"
          heading="CURATED ADVENTURES"
          title="Travel Packages"
          description="Explore the tours and trek crafted for your next adventure."
          overlayGradient="bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/55 to-[#2D1347]/20"
          bottomGradient="h-10 sm:h-14 bg-gradient-to-t from-[#FBFBFE] to-transparent"
          searchBar={
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Keyword */}
              <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                <Search size={18} className="text-pink-500 flex-shrink-0" />
                <div className="flex flex-col w-full text-left">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    SEARCH KEYWORD
                  </label>
                  <input
                    type="text"
                    className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal"
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Select Category */}
              <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                <MapPin size={18} className="text-pink-500 flex-shrink-0" />
                <div className="flex flex-col w-full text-left">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    SELECT CATEGORY
                  </label>
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

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
              >
                SEARCH
              </button>
            </div>
          }
        />
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
        btn1="Call Us Now"
        btn2="Request Custom Quote"
      />
    </div>
  );
};

export default Packages;
