import { Filter, Star, Tag, Award, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import {
  useGlobalCurrency,
  formatNPR,
  formatUSD,
  formatINR,
  displayPrice,
} from "../../context/CurrencyContext";

interface FilterSideBarProps {
  priceRange?: number;
  setPriceRange: React.Dispatch<React.SetStateAction<number>>;
  selectedKeywords: string[];
  setSelectedKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRating: number;
  setSelectedRating: React.Dispatch<React.SetStateAction<number>>;
  customKeywords?: string[];
  selectedBadges?: string[];
  setSelectedBadges?: React.Dispatch<React.SetStateAction<string[]>>;
  minPrice?: number;
  maxPrice?: number;
  step?: number;
}

const FilterSideBar: React.FC<FilterSideBarProps> = ({
  priceRange,
  setPriceRange,
  setSelectedKeywords,
  selectedKeywords,
  selectedRating,
  setSelectedRating,
  customKeywords,
  selectedBadges = [],
  setSelectedBadges,
  minPrice = 0,
  maxPrice,
  step,
}) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const ratings = [5, 4, 3, 2, 1];
  const [mobileOpen, setMobileOpen] = useState(false);

  const isNPRScale = typeof maxPrice === "number";
  const sliderMin = minPrice;
  const sliderMax = isNPRScale ? maxPrice : 5000;
  const sliderStep = step ?? (isNPRScale ? 1000 : 1);
  const currentPriceRange = priceRange ?? sliderMax;

  const keywords =
    customKeywords && customKeywords.length > 0
      ? customKeywords
      : [
          "EVEREST",
          "ANNAPURNA",
          "BALI",
          "POKHARA",
          "CHITWAN",
          "TREKKING",
          "LUXURY",
          "ADVENTURE",
          "CULTURE",
          "WILDLIFE",
          "EBC",
          "ABC",
          "HELI TOUR",
        ];

  const clearAllFilters = () => {
    setSelectedRating(0);
    setSelectedKeywords([]);
    setPriceRange(sliderMax);
    if (setSelectedBadges) setSelectedBadges([]);
  };

  const activeFilterCount =
    (selectedRating > 0 ? 1 : 0) +
    selectedKeywords.length +
    selectedBadges.length +
    (currentPriceRange < sliderMax ? 1 : 0);

  /* ────────────────────────── shared inner panel ────────────────────────── */
  const FilterBody = () => (
    <>
      {/* ── 1. PRICE RANGE ── */}
      <div className="py-4 border-b border-gray-100">
        <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block mb-3">
          PRICE RANGE (
          {selectedCurrency === "nepali"
            ? "NPR"
            : selectedCurrency === "inr"
            ? "INR"
            : "USD"}
          )
        </label>
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          value={currentPriceRange}
          className="w-full accent-[#E91E63] cursor-pointer h-1.5 bg-gray-200 rounded-lg outline-none"
          onChange={(e) => setPriceRange(Number(e.target.value))}
        />
        <div className="flex justify-between items-center text-xs font-bold mt-2">
          <span className="text-gray-400">
            {isNPRScale
              ? displayPrice(sliderMin, selectedCurrency, nprPerOneDollar, nprPerOneINR)
              : selectedCurrency === "nepali"
              ? "NPR 0"
              : selectedCurrency === "inr"
              ? "₹0"
              : "$0"}
          </span>
          <span className="text-[#E91E63] font-black">
            {isNPRScale
              ? displayPrice(currentPriceRange, selectedCurrency, nprPerOneDollar, nprPerOneINR)
              : selectedCurrency === "nepali"
              ? formatNPR(currentPriceRange * nprPerOneDollar)
              : selectedCurrency === "inr"
              ? formatINR((currentPriceRange * nprPerOneDollar) / nprPerOneINR)
              : formatUSD(currentPriceRange)}
          </span>
        </div>
      </div>

      {/* ── 2. RATINGS ── */}
      <div className="py-4 border-b border-gray-100">
        <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block mb-3">
          RATINGS
        </label>
        {/* Mobile: 5-column grid so all pills fit without scrolling */}
        <div className="grid grid-cols-5 gap-1.5 lg:hidden">
          {ratings.map((starCount) => {
            const isSelected = selectedRating === starCount;
            return (
              <button
                key={starCount}
                onClick={() => setSelectedRating(isSelected ? 0 : starCount)}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors border ${
                  isSelected
                    ? "bg-pink-50 border-[#E91E63] ring-1 ring-[#E91E63] text-[#E91E63]"
                    : "bg-[#2D1347] border-[#2D1347] text-white hover:bg-[#3B145C]"
                }`}
              >
                <Star
                  size={13}
                  className={isSelected ? "text-yellow-400 fill-yellow-400" : "text-white/70 fill-white/70"}
                />
                <span>{starCount}★</span>
              </button>
            );
          })}
        </div>
        {/* Desktop: vertical list */}
        <div className="hidden lg:flex flex-col gap-1.5">
          {ratings.map((starCount) => {
            const isSelected = selectedRating === starCount;
            return (
              <button
                key={starCount}
                onClick={() => setSelectedRating(isSelected ? 0 : starCount)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-full transition-colors text-xs font-semibold cursor-pointer ${
                  isSelected
                    ? "bg-pink-50 ring-1 ring-[#E91E63]"
                    : "bg-gray-50/70 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={13}
                      className={
                        idx < starCount
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. KEYWORDS ── */}
      <div className="pt-4">
        <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase flex items-center gap-1.5 mb-3">
          <Tag size={12} className="text-[#E91E63]" />
          <span>KEYWORDS</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((kw) => {
            const isSelected = selectedKeywords.includes(kw.toLowerCase());
            return (
              <button
                key={kw}
                onClick={() =>
                  setSelectedKeywords((prev) =>
                    isSelected
                      ? prev.filter((k) => k !== kw.toLowerCase())
                      : [...prev, kw.toLowerCase()]
                  )
                }
                className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-[#E91E63] text-white border-[#E91E63]"
                    : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
                }`}
              >
                {kw}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. BADGE FILTER ── */}
      {setSelectedBadges && (
        <div className="pt-4 border-t border-gray-100 mt-5">
          <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase flex items-center gap-1.5 mb-3">
            <Award size={12} className="text-[#E91E63]" />
            <span>HIGHLIGHTS</span>
          </label>
          <div className="flex flex-col gap-0.5">
            {[
              { label: "Featured", color: "bg-[#E91E63] text-white", ring: "ring-[#E91E63]" },
              { label: "Popular", color: "bg-[#2D1347] text-white", ring: "ring-[#2D1347]" },
              {
                label: "Best Value",
                color: "bg-white text-[#2D1347] border border-gray-300",
                ring: "ring-gray-400",
              },
            ].map(({ label, color, ring }) => {
              const isSelected = selectedBadges.includes(label);
              return (
                <button
                  key={label}
                  onClick={() =>
                    setSelectedBadges((prev) =>
                      prev.includes(label) ? [] : [label]
                    )
                  }
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-full transition-all text-xs font-bold cursor-pointer ${
                    isSelected
                      ? `${color} ring-1 ${ring} shadow-sm`
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* ══════════════════════════════════════════
          MOBILE  — compact toggle bar (< lg)
      ══════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Toggle Button Row */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-[#E91E63]" />
            <span className="text-sm font-bold text-[#200B3B]">Filter</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#E91E63] text-white text-[10px] font-black rounded-full px-1.5 py-0.5 leading-none">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFilters();
                }}
                className="text-[10px] font-bold text-[#E91E63] uppercase tracking-wider"
              >
                Clear
              </button>
            )}
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${
                mobileOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Collapsible Panel */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-[800px] opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
            <FilterBody />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP  — full sidebar card (lg+)
      ══════════════════════════════════════════ */}
      <div className="hidden lg:block w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#E91E63]" />
            <h3 className="text-sm font-black text-[#200B3B]">Filter By</h3>
          </div>
          <button
            onClick={clearAllFilters}
            className="text-[10px] font-bold text-[#E91E63] hover:underline uppercase tracking-wider cursor-pointer"
          >
            CLEAR ALL
          </button>
        </div>
        <FilterBody />
      </div>
    </>
  );
};

export default FilterSideBar;
