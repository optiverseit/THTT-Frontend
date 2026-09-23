/**
 * PackagePricing.tsx
 * -----------------------------------------------------------------
 * Displays the pricing options card for a travel package detail page.
 *
 * Features:
 *  - Two currency modes: NEPALI (NPR) and FOREIGNER (USD).
 *  - Uses GlobalCurrencyContext for site-wide synchronization:
 *    switching currency here also updates the TopBar flag dropdown,
 *    sub-nav "STARTS FROM" price, and package listing cards.
 *  - Live USD -> NPR exchange rate dynamically provided by context.
 *  - Guest count multiplier to compute an estimated total.
 *  - Book Now + WhatsApp inquiry CTA buttons.
 *  - VerificationCard rendered below the main pricing card.
 * -----------------------------------------------------------------
 */

import React, { useState } from "react";
import type { Package } from "../../../assets/data/types";
import VerificationCard from "./VerificationCard";
import BookingModal from "../../reusable/packages/BookingModal";
import { MessageCircle, Users, Check, Zap, RefreshCw, AlertCircle } from "lucide-react";
import { useGlobalCurrency, formatNPR, formatUSD, formatINR } from "../../../context/CurrencyContext";

// =============================================================================
// Types
// =============================================================================

/**
 * A single row in the pricing table.
 * Prices are always stored internally as raw NPR numbers.
 * USD and INR conversions happen at render time using the live exchange rate.
 */
interface PricingRow {
  serviceName: string;      // Human-readable name of the service or tier
  targetAgeGroup: string;   // The age bracket this pricing tier applies to
  priceInNPR: number;       // Raw numeric price in Nepalese Rupees
}

/** Props accepted by the PackagePricing component */
interface PackagePricingProps {
  pkg: Package;
}

// =============================================================================
// Constants
// =============================================================================

/** WhatsApp business phone number for direct inquiries */
const WHATSAPP_BUSINESS_NUMBER = "9779851403761";

// =============================================================================
// Pure Helper Functions
// =============================================================================

/**
 * Extracts the numeric base price (in USD) from the package price string.
 * Example: "$85" -> 85. Falls back to 85 if absent or invalid.
 */
function extractBaseUSDPrice(rawPriceString: string | undefined): number {
  if (!rawPriceString) return 85;
  const digitsOnly = Number(rawPriceString.replace(/[^0-9]/g, ""));
  return digitsOnly > 0 ? digitsOnly : 85;
}

// =============================================================================
// Component
// =============================================================================

const PackagePricing: React.FC<PackagePricingProps> = ({ pkg }) => {

  // ---------------------------------------------------------------------------
  // Global Currency Context
  // ---------------------------------------------------------------------------

  const {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
    isRateLoading,
    rateLoadFailed,
  } = useGlobalCurrency();

  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------

  /** Selected experience tier index */
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);

  /** Number of travelers selected by the user */
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);

  /** Controls opening the upgraded BookingModal */
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  /** Controls the booking confirmation animation (resets after 3s) */
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // Pricing Data Preparation
  // ---------------------------------------------------------------------------

  /** Base price in USD extracted from the package record (e.g. "$85" -> 85) */
  const basePackagePriceInUSD = extractBaseUSDPrice(pkg.price);

  /**
   * Builds the array of pricing rows to display in the table.
   * All prices are stored internally as raw NPR numbers.
   */
  const pricingRows: PricingRow[] =
    pkg.pricingTable && pkg.pricingTable.length > 0
      ? pkg.pricingTable.map((dataRow) => ({
        serviceName: dataRow.service,

        targetAgeGroup: dataRow.ageGroup,

        priceInNPR:
          Number(dataRow.priceNepali) ||
          basePackagePriceInUSD * nprPerOneDollar,
      }))
      : [
        {
          serviceName: "Standard Experience",
          targetAgeGroup: "Adult (16+)",
          priceInNPR: 9500,
        },
        {
          serviceName: "VIP Tandem + Media Pack",
          targetAgeGroup: "All Ages",
          priceInNPR: 12500,
        },
        {
          serviceName: "Student / Youth Special",
          targetAgeGroup: "Youth (12-15)",
          priceInNPR: 8000,
        },
      ];

  // ---------------------------------------------------------------------------
  // Estimated Total Calculation
  // ---------------------------------------------------------------------------

  /**
   * Unit price used for the total calculation based on the user-selected tier
   */
  const selectedRow = pricingRows[selectedTierIndex] || pricingRows[0];

  const unitPriceForEstimatedTotal: number =
    selectedCurrency === "nepali"
      ? selectedRow.priceInNPR
      : selectedCurrency === "inr"
        ? Math.round(selectedRow.priceInNPR / nprPerOneINR)
        : Math.round(selectedRow.priceInNPR / nprPerOneDollar);

  /** Final estimated total = unit price * guest count */
  const estimatedTotalPrice: number = unitPriceForEstimatedTotal * numberOfGuests;

  // ---------------------------------------------------------------------------
  // Display Formatting Helpers
  // ---------------------------------------------------------------------------

  /**
   * Formats a table row's price based on the currently selected currency.
   */
  const getRowDisplayPrice = (row: PricingRow): string => {
    if (selectedCurrency === "nepali") {
      return formatNPR(row.priceInNPR);
    }
    if (selectedCurrency === "inr") {
      return formatINR(row.priceInNPR / nprPerOneINR);
    }
    return formatUSD(row.priceInNPR / nprPerOneDollar);
  };

  /**
   * Formats the estimated total in the active currency.
   */
  const getFormattedEstimatedTotal = (): string => {
    if (selectedCurrency === "nepali") {
      return formatNPR(estimatedTotalPrice);
    }
    if (selectedCurrency === "inr") {
      return formatINR(estimatedTotalPrice);
    }
    return formatUSD(estimatedTotalPrice);
  };

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------

  const handleIncreaseGuestCount = (): void => {
    setNumberOfGuests((previousCount) => previousCount + 1);
  };

  const handleDecreaseGuestCount = (): void => {
    setNumberOfGuests((previousCount) => Math.max(1, previousCount - 1));
  };

  const handleBookNow = (): void => {
    setIsBookingModalOpen(true);
  };

  const handleWhatsAppInquiry = (): void => {
    const currencyText =
      selectedCurrency === "nepali" ? "NPR" : selectedCurrency === "inr" ? "INR" : "USD";
    const isTour = pkg.type === "tour";
    const teamName = isTour ? "Tours & Holidays Team" : "Trekking & Adventure Activity Team";
    const packageTitle = pkg.title;
    const guestCount = numberOfGuests;
    const totalFormatted = getFormattedEstimatedTotal();
    const tierName = selectedRow.serviceName;

    const inquiryMessage = encodeURIComponent(
      `Hello Trip Himalaya (${teamName})! I am interested in booking "${packageTitle}" (${tierName}) for ${guestCount} guest(s). Estimated Total: ${totalFormatted} (${currencyText}). Please share availability and confirmation details.`
    );

    window.open(`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${inquiryMessage}`, "_blank", "noopener,noreferrer");
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <div className="space-y-4">

        {/* =======================================================================
          MAIN PRICING CARD
          ======================================================================= */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Card Header: Title left, Currency Toggle right */}
          <div className="py-2.5 px-3.5 bg-gradient-to-r from-[#200B3B] to-[#3B145C] text-white flex items-center justify-between gap-2">

            <div>
              <h2 className="text-sm font-black">Pricing Options</h2>
              <p className="text-[9px] text-gray-300 font-medium">Standard rates &amp; inclusions</p>
            </div>

            {/* NEPALI / USD / INR currency toggle buttons (syncs site-wide) */}
            <div className="flex bg-white/10 backdrop-blur-md p-0.5 rounded-lg text-[9px] font-black tracking-wider gap-0.5">
              <button
                onClick={() => setSelectedCurrency("nepali")}
                aria-label="Show prices in Nepali Rupees (NPR)"
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${selectedCurrency === "nepali"
                  ? "bg-white text-[#200B3B] shadow-xs"
                  : "text-white/80 hover:text-white"
                  }`}
              >
                NEPALI
              </button>
              <button
                onClick={() => setSelectedCurrency("foreigner")}
                aria-label="Show prices in US Dollars (USD)"
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${selectedCurrency === "foreigner"
                  ? "bg-[#E91E63] text-white shadow-xs"
                  : "text-white/80 hover:text-white"
                  }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setSelectedCurrency("inr")}
                aria-label="Show prices in Indian Rupees (INR)"
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${selectedCurrency === "inr"
                  ? "bg-[#FF5722] text-white shadow-xs"
                  : "text-white/80 hover:text-white"
                  }`}
              >
                INR (₹)
              </button>
            </div>
          </div>

          {/* Exchange Rate Status Banner — shown when USD or INR mode is active */}
          {selectedCurrency !== "nepali" && (
            <div
              className={`flex items-center justify-between gap-1.5 px-3.5 py-1.5 text-[9px] font-semibold ${rateLoadFailed
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
                }`}
            >
              <div className="flex items-center gap-1">
                {isRateLoading ? (
                  <RefreshCw size={10} className="animate-spin" />
                ) : rateLoadFailed ? (
                  <AlertCircle size={10} />
                ) : (
                  <Zap size={10} />
                )}
                <span>
                  {isRateLoading
                    ? "Fetching live exchange rate..."
                    : rateLoadFailed
                      ? selectedCurrency === "inr"
                        ? `Offline estimate — 1 INR = NPR 1.60`
                        : `Offline estimate — 1 USD = NPR 151.09`
                      : selectedCurrency === "inr"
                        ? `Live rate: 1 INR = NPR ${nprPerOneINR.toFixed(2)} (100 INR = NPR ${(nprPerOneINR * 100).toFixed(1)})`
                        : `Live rate: 1 USD = NPR ${nprPerOneDollar.toFixed(2)}`}
                </span>
              </div>
              {!isRateLoading && (
                <span className="text-[8px] opacity-60">
                  {rateLoadFailed ? "Fallback rate" : "Live Exchange Rate"}
                </span>
              )}
            </div>
          )}

          {/* Pricing Table + Controls body */}
          <div className="p-3 sm:p-3.5 space-y-2.5">

            {/* Pricing Table — proper HTML table for guaranteed column alignment */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-[9px] font-black text-gray-400 uppercase tracking-wider w-1/2">
                    Option / Tier
                  </th>
                  <th className="pb-2 text-[9px] font-black text-gray-400 uppercase tracking-wider">
                    Age Group
                  </th>
                  <th className="pb-2 text-[9px] font-black text-gray-400 uppercase tracking-wider text-right">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pricingRows.map((pricingRow, rowIndex) => {
                  const isSelected = selectedTierIndex === rowIndex;
                  return (
                    <tr
                      key={rowIndex}
                      onClick={() => setSelectedTierIndex(rowIndex)}
                      className="cursor-pointer hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Radio + service name */}
                      <td className="py-2.5 pr-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                              ? "border-[#E91E63] bg-[#E91E63]"
                              : "border-gray-300 bg-white"
                              }`}
                          >
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                            )}
                          </span>
                          <span className={`text-[11px] font-bold leading-tight ${isSelected ? "text-[#E91E63]" : "text-[#200B3B]"}`}>
                            {pricingRow.serviceName}
                          </span>
                        </div>
                      </td>

                      {/* Age Group */}
                      <td className="py-2.5 text-[10px] text-gray-500">
                        {pricingRow.targetAgeGroup}
                      </td>

                      {/* Price */}
                      <td className={`py-2.5 text-xs font-black text-right whitespace-nowrap ${isSelected ? "text-[#E91E63]" : "text-[#200B3B]"}`}>
                        {getRowDisplayPrice(pricingRow)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Guest Count Selector */}
            <div className="bg-[#FBFBFE] py-1.5 px-2.5 rounded-lg border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users size={13} className="text-[#E91E63]" />
                <div>
                  <span className="block text-[11px] font-bold text-[#200B3B]">
                    Number of Guests
                  </span>
                  <span className="text-[9px] text-gray-400">Select traveler count</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDecreaseGuestCount}
                  disabled={numberOfGuests <= 1}
                  aria-label="Remove one guest"
                  className="w-5 h-5 rounded bg-white border border-gray-200 text-[#200B3B] font-black text-xs flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                >
                  −
                </button>
                <span className="font-black text-xs text-[#200B3B] w-4 text-center">
                  {numberOfGuests}
                </span>
                <button
                  onClick={handleIncreaseGuestCount}
                  aria-label="Add one more guest"
                  className="w-5 h-5 rounded bg-white border border-gray-200 text-[#200B3B] font-black text-xs flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Estimated Total */}
            <div className="pt-0.5">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                Estimated Total
              </span>
              <span className="text-lg font-black text-[#200B3B]">
                {getFormattedEstimatedTotal()}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-1.5 pt-0.5">
              <button
                onClick={handleBookNow}
                aria-label="Book this trip"
                className={`w-full py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${isBookingConfirmed
                  ? "bg-emerald-600 text-white"
                  : "bg-[#E91E63] hover:bg-pink-600 active:scale-[0.98] text-white"
                  }`}
              >
                {isBookingConfirmed ? (
                  <>
                    <Check size={14} />
                    <span>Reservation Requested!</span>
                  </>
                ) : (
                  <span>Book This Trip Now</span>
                )}
              </button>

              <button
                onClick={handleWhatsAppInquiry}
                aria-label="Send a WhatsApp inquiry"
                className="w-full py-2 rounded-lg text-[11px] font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle size={14} />
                <span>WhatsApp Instant Inquiry</span>
              </button>
            </div>
          </div>
        </div>

        {/* =======================================================================
          VERIFICATION & TRUST CARD
          ======================================================================= */}
        <VerificationCard />
      </div>

      {/* =======================================================================
        BOOKING MODAL — opens when user clicks "Book This Trip Now"
        ======================================================================= */}
      <BookingModal
        pkg={pkg}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialTierIndex={selectedTierIndex}
        initialGuests={numberOfGuests}
        pricingSource="tier"
      />
    </>
  );
};

export default PackagePricing;
