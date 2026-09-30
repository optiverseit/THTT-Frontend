import React, { useState } from "react";
import HotelVerificationCard from "./HotelVerificationCard";
import BookingModal from "../reusable/packages/BookingModal";
import { MessageCircle, Users, Check, Zap, RefreshCw, AlertCircle } from "lucide-react";
import { useGlobalCurrency, formatNPR, formatUSD, formatINR } from "../../context/CurrencyContext";

interface HotelPricingProps {
  pkg: any;
}

const WHATSAPP_BUSINESS_NUMBER = "9779851403761";

const HotelPricing: React.FC<HotelPricingProps> = ({ pkg }) => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
    isRateLoading,
    rateLoadFailed,
  } = useGlobalCurrency();

  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);

  const pricingRows: { serviceName: string; targetAgeGroup: string; priceInNPR: number }[] =
    Array.isArray(pkg.pricingTable)
      ? pkg.pricingTable.map((dataRow: any) => ({
        serviceName: dataRow.service,
        targetAgeGroup: dataRow.ageGroup,
        priceInNPR: Number(dataRow.priceNepali),
      }))
      : [];

  const selectedRow = pricingRows[selectedTierIndex];
  const priceInNPR = selectedRow ? selectedRow.priceInNPR : Number(pkg.price || 0);

  const unitPrice: number =
    selectedCurrency === "nepali"
      ? priceInNPR
      : selectedCurrency === "inr"
        ? Math.round(priceInNPR / nprPerOneINR)
        : Math.round(priceInNPR / nprPerOneDollar);

  const estimatedTotal: number = unitPrice * numberOfGuests;

  const getRowDisplayPrice = (row: { priceInNPR: number }): string => {
    if (selectedCurrency === "nepali") return formatNPR(row.priceInNPR);
    if (selectedCurrency === "inr") return formatINR(row.priceInNPR / nprPerOneINR);
    return formatUSD(row.priceInNPR / nprPerOneDollar);
  };

  const getFormattedTotal = (): string => {
    if (selectedCurrency === "nepali") return formatNPR(estimatedTotal);
    if (selectedCurrency === "inr") return formatINR(estimatedTotal);
    return formatUSD(estimatedTotal);
  };

  const handleWhatsAppInquiry = (): void => {
    const currencyText = selectedCurrency === "nepali" ? "NPR" : selectedCurrency === "inr" ? "INR" : "USD";
    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Hotel Booking Team)! I am interested in booking "${pkg.title}" for ${numberOfGuests} guest(s). Estimated Total: ${getFormattedTotal()} (${currencyText}). Please share availability and confirmation details.`
    );
    window.open(`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="space-y-4">
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="py-2.5 px-3.5 bg-gradient-to-r from-[#200B3B] to-[#3B145C] text-white flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-black">Pricing Options</h2>
              <p className="text-[9px] text-gray-300 font-medium">Standard rates & inclusions</p>
            </div>
            <div className="flex bg-white/10 backdrop-blur-md p-0.5 rounded-lg text-[9px] font-black tracking-wider gap-0.5">
              <button
                onClick={() => setSelectedCurrency("nepali")}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${selectedCurrency === "nepali" ? "bg-white text-[#200B3B] shadow-xs" : "text-white/80 hover:text-white"}`}
              >NEPALI</button>
              <button
                onClick={() => setSelectedCurrency("foreigner")}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${selectedCurrency === "foreigner" ? "bg-[#E91E63] text-white shadow-xs" : "text-white/80 hover:text-white"}`}
              >USD ($)</button>
              <button
                onClick={() => setSelectedCurrency("inr")}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${selectedCurrency === "inr" ? "bg-[#FF5722] text-white shadow-xs" : "text-white/80 hover:text-white"}`}
              >INR (₹)</button>
            </div>
          </div>

          {/* Exchange rate banner */}
          {selectedCurrency !== "nepali" && (
            <div className={`flex items-center justify-between gap-1.5 px-3.5 py-1.5 text-[9px] font-semibold ${rateLoadFailed ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
              <div className="flex items-center gap-1">
                {isRateLoading ? <RefreshCw size={10} className="animate-spin" /> : rateLoadFailed ? <AlertCircle size={10} /> : <Zap size={10} />}
                <span>
                  {isRateLoading ? "Fetching live exchange rate..." : rateLoadFailed
                    ? selectedCurrency === "inr" ? "Offline estimate — 1 INR = NPR 1.60" : "Offline estimate — 1 USD = NPR 151.09"
                    : selectedCurrency === "inr" ? `Live rate: 1 INR = NPR ${nprPerOneINR.toFixed(2)}` : `Live rate: 1 USD = NPR ${nprPerOneDollar.toFixed(2)}`}
                </span>
              </div>
              {!isRateLoading && <span className="text-[8px] opacity-60">{rateLoadFailed ? "Fallback rate" : "Live Exchange Rate"}</span>}
            </div>
          )}

          {/* Body */}
          <div className="p-3 sm:p-3.5 space-y-2.5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-[9px] font-black text-gray-400 uppercase tracking-wider w-1/2">Option / Tier</th>
                  <th className="pb-2 text-[9px] font-black text-gray-400 uppercase tracking-wider">Age Group</th>
                  <th className="pb-2 text-[9px] font-black text-gray-400 uppercase tracking-wider text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pricingRows.map((row, idx) => {
                  const isSelected = selectedTierIndex === idx;
                  return (
                    <tr key={idx} onClick={() => setSelectedTierIndex(idx)} className="cursor-pointer hover:bg-gray-50/60 transition-colors">
                      <td className="py-2.5 pr-2">
                        <div className="flex items-center gap-2">
                          <span className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-[#E91E63] bg-[#E91E63]" : "border-gray-300 bg-white"}`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                          </span>
                          <span className={`text-[11px] font-bold leading-tight ${isSelected ? "text-[#E91E63]" : "text-[#200B3B]"}`}>{row.serviceName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-[10px] text-gray-500">{row.targetAgeGroup}</td>
                      <td className={`py-2.5 text-xs font-black text-right whitespace-nowrap ${isSelected ? "text-[#E91E63]" : "text-[#200B3B]"}`}>{getRowDisplayPrice(row)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Guest Count */}
            <div className="bg-[#FBFBFE] py-1.5 px-2.5 rounded-lg border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users size={13} className="text-[#E91E63]" />
                <div>
                  <span className="block text-[11px] font-bold text-[#200B3B]">Number of Guests</span>
                  <span className="text-[9px] text-gray-400">Select traveler count</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setNumberOfGuests(p => Math.max(1, p - 1))} disabled={numberOfGuests <= 1} className="w-5 h-5 rounded bg-white border border-gray-200 text-[#200B3B] font-black text-xs flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 cursor-pointer">−</button>
                <span className="font-black text-xs text-[#200B3B] w-4 text-center">{numberOfGuests}</span>
                <button onClick={() => setNumberOfGuests(p => p + 1)} className="w-5 h-5 rounded bg-white border border-gray-200 text-[#200B3B] font-black text-xs flex items-center justify-center hover:bg-gray-100 cursor-pointer">+</button>
              </div>
            </div>

            {/* Total */}
            <div className="pt-0.5">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Estimated Total</span>
              <span className="text-lg font-black text-[#200B3B]">{getFormattedTotal()}</span>
            </div>

            {/* CTAs */}
            <div className="space-y-1.5 pt-0.5">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className={`w-full py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${isBookingConfirmed ? "bg-emerald-600 text-white" : "bg-[#E91E63] hover:bg-pink-600 active:scale-[0.98] text-white"}`}
              >
                {isBookingConfirmed ? <><Check size={14} /><span>Reservation Requested!</span></> : <span>Book This Hotel Now</span>}
              </button>
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-2 rounded-lg text-[11px] font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle size={14} />
                <span>WhatsApp Instant Inquiry</span>
              </button>
            </div>
          </div>
        </div>

        <HotelVerificationCard />
      </div>

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

export default HotelPricing;
