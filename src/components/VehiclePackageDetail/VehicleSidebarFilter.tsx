import { Filter, Star, Tag, Award } from "lucide-react";
import React from "react";
import {
  useGlobalCurrency,
  displayPrice,
} from "../../context/CurrencyContext";

interface VehicleSidebarFilterProps {
  priceRange: number;
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

const VehicleSidebarFilter: React.FC<VehicleSidebarFilterProps> = ({
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
  maxPrice = 500000,
  step = 5000,
}) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const ratings = [5, 4, 3, 2, 1];

  const sliderMin = minPrice;
  const sliderMax = maxPrice;
  const sliderStep = step;
  const currentPriceRange = priceRange;

  const keywords =
    customKeywords && customKeywords.length > 0
      ? customKeywords
      : [
          "4X4",
          "SUV",
          "SCORPIO",
          "PRADO",
          "HIACE",
          "VAN",
          "SEDAN",
          "COASTER",
          "CHAUFFEUR",
          "MOUNTAIN",
          "POKHARA",
          "ELECTRIC",
          "PETROL",
        ];

  const clearAllFilters = () => {
    setSelectedRating(0);
    setSelectedKeywords([]);
    setPriceRange(sliderMax);
    if (setSelectedBadges) setSelectedBadges([]);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
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

      {/* 1. PRICE RANGE */}
      <div className="py-5 border-b border-gray-100">
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
        <div className="flex justify-between items-center text-xs font-bold mt-3">
          <span className="text-gray-400">
            {displayPrice(sliderMin, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
          </span>
          <span className="text-[#E91E63] font-black">
            {displayPrice(currentPriceRange, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
          </span>
        </div>
      </div>

      {/* 2. RATINGS */}
      <div className="py-5 border-b border-gray-100">
        <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block mb-3">
          RATINGS
        </label>
        <div className="space-y-1.5">
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

      {/* 3. KEYWORDS */}
      <div className="pt-5">
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

      {/* 4. HIGHLIGHTS / BADGE FILTER */}
      {setSelectedBadges && (
        <div className="pt-5 border-t border-gray-100 mt-6">
          <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase flex items-center gap-1.5 mb-3">
            <Award size={12} className="text-[#E91E63]" />
            <span>HIGHLIGHTS</span>
          </label>
          <div className="flex flex-col gap-0.5">
            {[
              {
                label: "Featured",
                color: "bg-[#E91E63] text-white",
                ring: "ring-[#E91E63]",
              },
              {
                label: "Popular",
                color: "bg-[#2D1347] text-white",
                ring: "ring-[#2D1347]",
              },
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
    </div>
  );
};

export default VehicleSidebarFilter;
