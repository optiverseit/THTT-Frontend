import { Filter, Star, Tag } from "lucide-react";
import React from "react";
import { useGlobalCurrency, formatNPR, formatUSD, formatINR } from "../../context/CurrencyContext";

interface FilterSideBarProps {
  priceRange?: number;
  setPriceRange: React.Dispatch<React.SetStateAction<number>>;
  selectedKeywords: string[];
  setSelectedKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRating: number;
  setSelectedRating: React.Dispatch<React.SetStateAction<number>>;
}

const FilterSideBar: React.FC<FilterSideBarProps> = ({
  priceRange = 5000,
  setPriceRange,
  setSelectedKeywords,
  selectedKeywords,
  selectedRating,
  setSelectedRating,
}) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const ratings = [5, 4, 3, 2, 1];
  const keywords = [
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
    setPriceRange(5000);
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

      {/* ── 1. PRICE RANGE ── */}
      <div className="py-5 border-b border-gray-100">
        <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block mb-3">
          PRICE RANGE ({selectedCurrency === "nepali" ? "NPR" : selectedCurrency === "inr" ? "INR" : "USD"})
        </label>
        <input
          type="range"
          min={0}
          max={5000}
          value={priceRange}
          className="w-full accent-[#E91E63] cursor-pointer h-1.5 bg-gray-200 rounded-lg outline-none"
          onChange={(e) => setPriceRange(Number(e.target.value))}
        />
        <div className="flex justify-between items-center text-xs font-bold mt-3">
          <span className="text-gray-400">
            {selectedCurrency === "nepali" ? "NPR 0" : selectedCurrency === "inr" ? "₹0" : "$0"}
          </span>
          <span className="text-[#E91E63] font-black">
            {selectedCurrency === "nepali"
              ? formatNPR(priceRange * nprPerOneDollar)
              : selectedCurrency === "inr"
              ? formatINR((priceRange * nprPerOneDollar) / nprPerOneINR)
              : formatUSD(priceRange)}
          </span>
        </div>
      </div>

      {/* ── 2. RATINGS ── */}
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
                onClick={() =>
                  setSelectedRating(isSelected ? 0 : starCount)
                }
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
    </div>
  );
};

export default FilterSideBar;
