import React, { useState, useEffect, useRef } from "react";
import type { Hotel } from "../../assets/data/types";
import HotelBookingCard from "./HotelBookingCard";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface HotelBookingSectionProps {
  hotels: Hotel[];
  onBook?: (hotel: Hotel) => void;
  onDetails?: (hotel: Hotel) => void;
  priceUnit?: string;
  itemsPerPage?: number;
  onClearFilter?: () => void;
  hasActiveFilter?: boolean;
}

export const HotelBookingSection: React.FC<HotelBookingSectionProps> = ({
  hotels,
  onBook,
  onDetails,
  priceUnit = "per day",
  itemsPerPage = 12,
  onClearFilter,
  hasActiveFilter,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Automatically reset to page 1 whenever the hotel list changes (e.g. user changes filters/tabs)
  useEffect(() => {
    setCurrentPage(1);
  }, [hotels]);

  const totalPages = Math.ceil(hotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, hotels.length);
  const currentHotels = hotels.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    // Smoothly scroll up to the top of the cards listing so the user immediately sees the items
    if (sectionRef.current) {
      const navOffset = 95;
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  return (
    <div ref={sectionRef} className="w-full col-span-3 max-w-7xl scroll-mt-28">
      <div className="flex flex-col gap-6">
        {currentHotels.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs space-y-3">
            <p className="text-gray-700 font-bold text-base">
              No hotels found matching your filter criteria.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Try broadening your price range, ratings, or keyword selections.
            </p>
            {(hasActiveFilter ?? Boolean(onClearFilter)) && onClearFilter && (
              <button
                type="button"
                onClick={onClearFilter}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-[#2D1347] text-white hover:bg-[#3B145C] transition-colors cursor-pointer"
              >
                <X size={13} />
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          currentHotels.map((hotel) => (
            <HotelBookingCard
              key={hotel.id}
              hotel={hotel}
              onBook={onBook}
              onDetails={onDetails}
              priceUnit={priceUnit}
            />
          ))
        )}
      </div>

      {totalPages > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
          <div className="text-gray-500 font-semibold text-sm">
            SHOWING{" "}
            <span className="text-[#E91E63] font-bold">
              {hotels.length === 0 ? 0 : startIndex + 1}-{endIndex}
            </span>{" "}
            OF <span className="text-[#E91E63] font-bold">{hotels.length}</span> HOTELS
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-1.5">
            {totalPages > 1 && (
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed bg-gray-50"
                    : "text-gray-600 bg-gray-100 hover:bg-pink-50 hover:text-[#E91E63] cursor-pointer active:scale-95"
                }`}
              >
                <ChevronLeft size={14} />
                <span className="hidden sm:inline">Prev</span>
              </button>
            )}

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  aria-current={isActive ? "page" : undefined}
                  className={`min-w-[38px] h-[38px] px-3 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer select-none active:scale-95 ${
                    isActive
                      ? "bg-[#E91E63] text-white shadow-md shadow-pink-500/25"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 1 && (
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed bg-gray-50"
                    : "text-gray-600 bg-gray-100 hover:bg-pink-50 hover:text-[#E91E63] cursor-pointer active:scale-95"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelBookingSection;
