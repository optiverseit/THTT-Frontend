import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HotelVerificationCard from "./HotelVerificationCard";
import HotelBookingModal from "./HotelBookingModal";
import { MessageCircle, Users, Check, Zap, RefreshCw, AlertCircle } from "lucide-react";
import { useGlobalCurrency, formatNPR, formatUSD, formatINR } from "../../context/CurrencyContext";
import { isSessionValid, clearAuthSession } from "../../utils/sessionManager";

interface HotelPricingProps {
  pkg: any;
}

const WHATSAPP_BUSINESS_NUMBER = "9779851403761";

// ─── Bed icon helpers ─────────────────────────────────────────────────────────

const parseBedInfo = (raw: string): { count: number; isHall: boolean } => {
  if (!raw) return { count: 1, isHall: false };
  const lower = raw.toLowerCase().trim();
  if (lower.includes("hall") || lower.includes("studio") || lower.includes("living") || lower.includes("lounge")) {
    return { count: 0, isHall: true };
  }
  const numMatch = lower.match(/(\d+)/);
  if (numMatch) {
    const n = Math.min(parseInt(numMatch[1], 10), 4);
    return { count: Math.max(n, 1), isHall: false };
  }
  const wordMap: Record<string, number> = {
    single: 1, one: 1,
    double: 2, twin: 2, two: 2,
    triple: 3, three: 3,
    quad: 4, four: 4, family: 4,
  };
  for (const [word, count] of Object.entries(wordMap)) {
    if (lower.includes(word)) return { count, isHall: false };
  }
  return { count: 1, isHall: false };
};

const SingleBedSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg width="17" height="13" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1.5" y="9" width="17" height="4" rx="1" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.2" />
    <rect x="1.5" y="4.5" width="3" height="5" rx="0.8" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.1" />
    <rect x="5" y="5.5" width="13" height="3.5" rx="1" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="0.9" />
    <rect x="2.5" y="13" width="1.5" height="2" rx="0.5" fill={color} />
    <rect x="16" y="13" width="1.5" height="2" rx="0.5" fill={color} />
  </svg>
);

const HallSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg width="22" height="16" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="8" width="20" height="7" rx="2" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.2" />
    <rect x="3" y="6" width="3" height="9" rx="1.2" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.1" />
    <rect x="20" y="6" width="3" height="9" rx="1.2" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.1" />
    <rect x="6" y="5" width="14" height="4" rx="1.2" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="0.9" />
    <line x1="13" y1="9" x2="13" y2="15" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" />
    <rect x="4.5" y="14.5" width="1.5" height="2.5" rx="0.5" fill={color} />
    <rect x="20" y="14.5" width="1.5" height="2.5" rx="0.5" fill={color} />
  </svg>
);

const BedTypeCell: React.FC<{ rawValue: string; accentColor: string; isSelected: boolean }> = ({ rawValue, accentColor, isSelected }) => {
  if (!rawValue) return <span className="text-[10px] text-gray-300">—</span>;
  const { count, isHall } = parseBedInfo(rawValue);
  return (
    <div className="flex flex-col gap-0.5 items-center">
      <span className="flex items-center gap-0.5" title={rawValue}>
        {isHall
          ? <HallSVG color={accentColor} />
          : Array.from({ length: count }).map((_, i) => <SingleBedSVG key={i} color={accentColor} />)
        }
      </span>
      <span className={`text-[8.5px] leading-tight text-center ${isSelected ? "text-[#E91E63]" : "text-gray-400"}`} title={rawValue}>
        {rawValue}
      </span>
    </div>
  );
};

const formatPricingUnit = (unit?: string): string => {
  if (!unit) return "";
  return unit
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

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
  const navigate = useNavigate();
  const location = useLocation();
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);

  // Restore booking modal state after login
  useEffect(() => {
    if (!isSessionValid()) return;

    const savedState = (location.state as any) || (() => {
      try {
        const raw = sessionStorage.getItem("post_login_state");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    if (savedState?.openBooking) {
      if (Number(savedState.numberOfGuests) > 0) {
        setNumberOfGuests(Number(savedState.numberOfGuests));
      }
      if (savedState.selectedTierIndex !== undefined) {
        setSelectedTierIndex(Number(savedState.selectedTierIndex));
      }
      setIsBookingModalOpen(true);
      try {
        sessionStorage.removeItem("post_login_state");
        sessionStorage.removeItem("post_login_redirect");
      } catch {}
    }
  }, [location.state]);

  const pricingRows: { serviceName: string; targetAgeGroup: string; pricingUnit: string; bedType: string; priceInNPR: number }[] =
    Array.isArray(pkg.pricingTable)
      ? pkg.pricingTable.map((dataRow: any) => ({
        serviceName: dataRow.service,
        targetAgeGroup: dataRow.ageGroup,
        pricingUnit: dataRow.pricingUnit || "",
        bedType: dataRow.bedType || "",
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
                  <th className="pb-2 text-[9px] font-black text-gray-400 uppercase tracking-wider w-1/3">Option / Tier</th>
                  <th className="pb-2 text-[9px] font-black text-gray-400 uppercase tracking-wider text-center">Bed Type</th>
                  <th className="pb-2 text-[9px] font-black text-gray-400 uppercase tracking-wider">Stays</th>
                  <th className="pb-2 text-[9px] font-black text-gray-400 uppercase tracking-wider text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pricingRows.map((row, idx) => {
                  const isSelected = selectedTierIndex === idx;
                  const accentColor = isSelected ? "#E91E63" : "#200B3B";
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
                      <td className="py-2.5 text-center">
                        <BedTypeCell rawValue={row.bedType} accentColor={accentColor} isSelected={isSelected} />
                      </td>
                      <td className="py-2.5 pr-1">
                        <span className={`text-[10px] font-semibold leading-tight ${isSelected ? "text-[#E91E63]" : "text-gray-500"}`}>
                          {row.pricingUnit ? formatPricingUnit(row.pricingUnit) : row.targetAgeGroup}
                        </span>
                      </td>
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
                  <span className="block text-[11px] font-bold text-[#200B3B]">Number of Rooms</span>
                  <span className="text-[9px] text-gray-400">Select room count</span>
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
                onClick={() => {
                  if (!isSessionValid()) {
                    clearAuthSession();
                    const returnState = {
                      from: location.pathname + location.search,
                      hotelId: pkg?.backendId || pkg?.id,
                      openBooking: true,
                      numberOfGuests: numberOfGuests,
                      selectedTierIndex: selectedTierIndex,
                    };
                    try {
                      sessionStorage.setItem("post_login_redirect", location.pathname + location.search);
                      sessionStorage.setItem("post_login_state", JSON.stringify(returnState));
                    } catch (err) {
                      console.error("Failed to store post-login state in sessionStorage", err);
                    }
                    navigate("/login", {
                      state: returnState,
                    });
                    return;
                  }
                  setIsBookingModalOpen(true);
                }}
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

      <HotelBookingModal
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
