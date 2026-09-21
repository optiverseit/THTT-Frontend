/**
 * heliservicepricemodel.tsx
 * -----------------------------------------------------------------
 * Dedicated Pricing Model for Helicopter Services.
 * Exactly matched to the provided design:
 *  - Solid Dark Purple header (#200B3B) with "Pricing Options" & "STARTING PRICE EXCLUDES 13% VAT"
 *  - Currency pill toggle in the dark header: NEPALI | USD ($) | INR (₹)
 *  - Clean 3-column table: OPTION / TIER | AGE GROUP | PRICE
 *  - Radio selection:
 *      - Private Charter: Pink title, Exclusive Aircraft, Pink price (NPR 6,96,800)
 *      - Sharing Flight: Dark title, Per Person Seat, Dark price (NPR 1,80,800)
 *  - Explanatory light pink badge box: "Private Charter (Fixed/No Multiplier)"
 *  - "CHARTER TOTAL (FLAT RATE)" and large bold price display
 *  - Action buttons:
 *      - [✈ BOOK THIS HELI SERVICE] (Pink)
 *      - [💬 WHATSAPP INSTANT INQUIRY] (Green #00C853)
 *  - Heli Flight & Booking Requirements dossier
 *  - Verified Agency & 24/7 Hotline badges
 * -----------------------------------------------------------------
 */

import React, { useState } from "react";
import {
  MessageCircle,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plane,
  Scale,
  Luggage,
  HeartPulse,
  CloudSun,
  Headphones,
  FileCheck,
  Plus,
  Minus,
} from "lucide-react";
import {
  useGlobalCurrency,
  formatNPR,
  formatUSD,
  formatINR,
  displayPrice,
} from "../../context/CurrencyContext";

export interface HeliTourData {
  id: string;
  title: string;
  slug?: string;
  location: string;
  duration: string;
  maxAltitude?: string;
  charterPriceNPR: number; // e.g. 696800
  sharingPriceNPR: number; // e.g. 180800 or 184416
  charterDesc?: string;
  sharingDesc?: string;
}

interface HeliServicePriceModelProps {
  tour: HeliTourData;
  onBookNow: (bookingDetails: {
    flightType: "charter" | "sharing";
    seatCount: number;
    totalPriceNPR: number;
    formattedPrice: string;
  }) => void;
  onWhatsAppInquiry?: (flightType: "charter" | "sharing", formattedTotal: string) => void;
}

const WHATSAPP_PHONE = "9779851403761";

export const HeliServicePriceModel: React.FC<HeliServicePriceModelProps> = ({
  tour,
  onBookNow,
  onWhatsAppInquiry,
}) => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  // "charter" or "sharing"
  const [flightOption, setFlightOption] = useState<"charter" | "sharing">("charter");
  const [sharingSeats, setSharingSeats] = useState<number>(1);
  const [charterSeats, setCharterSeats] = useState<number>(1);

  // Price calculations
  const charterPrice = tour.charterPriceNPR || 696800;
  const sharingPrice = tour.sharingPriceNPR || 180800;

  const currentTotalNPR =
    flightOption === "charter" ? charterPrice : sharingPrice * sharingSeats;

  // Formatted price string based on active currency
  const formatAmount = (nprAmount: number): string => {
    return displayPrice(nprAmount, selectedCurrency, nprPerOneDollar, nprPerOneINR);
  };

  const formattedCharterPrice = formatAmount(charterPrice);
  const formattedSharingPrice = formatAmount(sharingPrice);
  const formattedTotalPrice = formatAmount(currentTotalNPR);

  const handleBookClick = () => {
    onBookNow({
      flightType: flightOption,
      seatCount: flightOption === "charter" ? 1 : sharingSeats,
      totalPriceNPR: currentTotalNPR,
      formattedPrice: formattedTotalPrice,
    });
  };

  const handleWhatsAppClick = () => {
    if (onWhatsAppInquiry) {
      onWhatsAppInquiry(flightOption, formattedTotalPrice);
      return;
    }

    const typeLabel =
      flightOption === "charter"
        ? "Private Charter (Exclusive Aircraft)"
        : `Sharing Heli Service (${sharingSeats} Seat${sharingSeats > 1 ? "s" : ""})`;

    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Heli Operations Team)! I am inquiring about "${tour.title}". Flight Option: ${typeLabel}. Total Estimated Price: ${formattedTotalPrice}. Please confirm availability, payload clearances, and flight timing.`
    );
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full space-y-6">
      {/* ── 1. MAIN PRICING OPTIONS CARD (Exact alignment to image) ── */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Dark Purple Header (#200B3B) */}
        <div className="bg-[#200B3B] px-5 py-4 text-white flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
              Pricing Options
            </h3>
            <span className="text-[8.5px] font-bold text-white/70 uppercase tracking-wider block mt-1.5">
              STARTING PRICE EXCLUDES 13% VAT
            </span>
          </div>

          {/* Currency Switcher Tabs Pill */}
          <div className="inline-flex bg-white/10 p-0.5 rounded-full text-[10px] font-extrabold border border-white/15">
            <button
              type="button"
              onClick={() => setSelectedCurrency("nepali")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                selectedCurrency === "nepali"
                  ? "bg-white text-[#200B3B] font-black shadow-xs"
                  : "text-white/80 hover:text-white"
              }`}
            >
              NEPALI
            </button>
            <button
              type="button"
              onClick={() => setSelectedCurrency("foreigner")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                selectedCurrency === "foreigner"
                  ? "bg-white text-[#200B3B] font-black shadow-xs"
                  : "text-white/80 hover:text-white"
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCurrency("inr")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                selectedCurrency === "inr"
                  ? "bg-white text-[#200B3B] font-black shadow-xs"
                  : "text-white/80 hover:text-white"
              }`}
            >
              INR (₹)
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Table Headers */}
          <div className="grid grid-cols-12 text-[9px] font-black uppercase text-gray-400 tracking-wider pb-2 border-b border-gray-100 px-0.5">
            <div className="col-span-6 text-left">OPTION / TIER</div>
            <div className="col-span-3 text-center">AGE GROUP</div>
            <div className="col-span-3 text-left">PRICE</div>
          </div>

          {/* Row 1: Private Charter */}
          <div
            onClick={() => setFlightOption("charter")}
            className={`grid grid-cols-12 items-start py-2.5 px-1 rounded-xl cursor-pointer transition-colors duration-150 ${
              flightOption === "charter" ? "bg-pink-50/30" : "hover:bg-gray-50/60"
            }`}
          >
            {/* Column 1: Option / Tier */}
            <div className="col-span-6 flex items-start gap-2.5">
              <div className="pt-0.5 flex-shrink-0">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    flightOption === "charter"
                      ? "border-[#E91E63] bg-[#E91E63]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {flightOption === "charter" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <div>
                <h4
                  className={`text-xs font-black leading-tight ${
                    flightOption === "charter" ? "text-[#E91E63]" : "text-[#200B3B]"
                  }`}
                >
                  Private Charter
                </h4>
              </div>
            </div>

            {/* Column 2: Age Group */}
            <div className="col-span-3 text-center pt-0.5">
              <span className="text-[10px] font-semibold text-gray-700 leading-tight block">
                Exclusive Aircraft
              </span>
            </div>

            {/* Column 3: Price */}
            <div className="col-span-3 text-left pt-0.5">
              <span
                className={`text-xs font-black block ${
                  flightOption === "charter" ? "text-[#E91E63]" : "text-[#200B3B]"
                }`}
              >
                {formattedCharterPrice}
              </span>
            </div>
          </div>

          {/* Row 2: Sharing Flight */}
          <div
            onClick={() => setFlightOption("sharing")}
            className={`grid grid-cols-12 items-start py-2.5 px-1 rounded-xl cursor-pointer transition-colors duration-150 ${
              flightOption === "sharing" ? "bg-pink-50/30" : "hover:bg-gray-50/60"
            }`}
          >
            {/* Column 1: Option / Tier */}
            <div className="col-span-6 flex items-start gap-2.5">
              <div className="pt-0.5 flex-shrink-0">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    flightOption === "sharing"
                      ? "border-[#E91E63] bg-[#E91E63]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {flightOption === "sharing" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <div>
                <h4
                  className={`text-xs font-black leading-tight ${
                    flightOption === "sharing" ? "text-[#E91E63]" : "text-[#200B3B]"
                  }`}
                >
                  Sharing Heli Service
                </h4>
              </div>
            </div>

            {/* Column 2: Age Group */}
            <div className="col-span-3 text-center pt-0.5">
              <span className="text-[10px] font-semibold text-gray-700 leading-tight block">
                Per Person Seat
              </span>
            </div>

            {/* Column 3: Price */}
            <div className="col-span-3 text-left pt-0.5">
              <span
                className={`text-xs font-black block ${
                  flightOption === "sharing" ? "text-[#E91E63]" : "text-[#200B3B]"
                }`}
              >
                {formattedSharingPrice}
              </span>
            </div>
          </div>

          {flightOption === "charter" ? null : (
            <div className="p-3 rounded-xl bg-[#FDF2F7] border border-pink-100/90 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                <Users size={14} />
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <h5 className="text-[10px] font-black text-[#200B3B] leading-tight">
                    Number of Passenger Seats
                  </h5>
                  <p className="text-[8.5px] text-gray-600 leading-tight mt-0.5 font-medium">
                    Per-person shared seat calculation
                  </p>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-2 bg-white px-2 py-0.5 rounded-lg border border-pink-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSharingSeats((prev) => Math.max(1, prev - 1))}
                    disabled={sharingSeats <= 1}
                    className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="text-xs font-black text-[#200B3B] w-4 text-center">
                    {sharingSeats}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSharingSeats((prev) => Math.min(5, prev + 1))}
                    disabled={sharingSeats >= 5}
                    className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Total Cost Display (Matching image) */}
          <div className="pt-2 text-left">
            <span className="text-[9.5px] font-black uppercase text-gray-400 tracking-wider block">
              {flightOption === "charter"
                ? "CHARTER TOTAL (FLAT RATE)"
                : `TOTAL ESTIMATE (${sharingSeats} SEAT${sharingSeats > 1 ? "S" : ""})`}
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#200B3B] mt-0.5 tracking-tight">
              {formattedTotalPrice}
            </div>
            <span className="text-[9px] text-gray-400 font-medium block mt-0.5">
              {flightOption === "charter"
                ? "Exclusive Aircraft — no per-person charge"
                : `Based on ${formattedSharingPrice} per seat`}
            </span>
          </div>

          {/* Action CTAs (Matching image) */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleBookClick}
              className="w-full py-3 px-4 rounded-xl bg-[#E91E63] hover:bg-pink-700 active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plane size={15} />
              <span>BOOK THIS HELI SERVICE</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="w-full py-3 px-4 rounded-xl bg-[#00C853] hover:bg-emerald-600 active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle size={15} />
              <span>WHATSAPP INSTANT INQUIRY</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. HELI FLIGHT & BOOKING REQUIREMENTS CARD ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-100 text-left space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#E91E63]" />
          <h4 className="text-xs font-black uppercase tracking-wider text-[#200B3B]">
            HELI FLIGHT &amp; BOOKING REQUIREMENTS
          </h4>
        </div>

        <div>
          <h5 className="text-[11px] font-bold text-gray-800 mb-1.5">
            Information Required for Booking:
          </h5>
          <p className="text-[10px] text-gray-500 leading-relaxed font-medium mb-3">
            To confirm your heli departure, our flight operations team requires each passenger and travel details to ensure the flight manifest, calculate aircraft payload limits, and coordinate airport clearance:
          </p>

          <ul className="space-y-1.5 text-[10px] text-gray-600">
            <li className="flex items-start gap-1.5">
              <span className="text-[#E91E63] font-bold">•</span>
              <span>
                <strong className="text-gray-800 font-bold">Passenger Names:</strong> Full legal names of all travelers joining the flight.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#E91E63] font-bold">•</span>
              <span>
                <strong className="text-gray-800 font-bold">Passport, citizenship or NID:</strong> Required for flight manifest and airport security clearance.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#E91E63] font-bold">•</span>
              <span>
                <strong className="text-gray-800 font-bold">Approximate body weight:</strong> Mandatory for helicopter weight balance &amp; high-altitude flight safety.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#E91E63] font-bold">•</span>
              <span>
                <strong className="text-gray-800 font-bold">Preferred travel date:</strong> Desired flight date and reserve date if possible.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#E91E63] font-bold">•</span>
              <span>
                <strong className="text-gray-800 font-bold">Contact &amp; Emergency details:</strong> WhatsApp, email, and emergency contact for weather and schedule updates.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#E91E63] font-bold">•</span>
              <span>
                <strong className="text-gray-800 font-bold">Flight option:</strong> Sharing Heli Service (shared seat reservation).
              </span>
            </li>
          </ul>
        </div>

        {/* Operational Highlights checklist */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <div className="flex items-start gap-2 text-[10px] text-gray-600">
            <Scale size={14} className="text-[#E91E63] flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-gray-800 font-bold">Daily Weight Declaration:</strong> Mandatory exact weight (kg) per CAAN high-altitude safety regulations. Max 240kg–250kg combined landing at Kala Patthar (5,545m).
            </span>
          </div>

          <div className="flex items-start gap-2 text-[10px] text-gray-600">
            <Luggage size={14} className="text-[#E91E63] flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-gray-800 font-bold">Luggage Allowance:</strong> Max 20 kg per passenger.
            </span>
          </div>

          <div className="flex items-start gap-2 text-[10px] text-gray-600">
            <FileCheck size={14} className="text-[#E91E63] flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-gray-800 font-bold">Flight Manifest &amp; ID Photo:</strong> Valid passport/citizenship/NID card and recent passport size photo required.
            </span>
          </div>

          <div className="flex items-start gap-2 text-[10px] text-gray-600">
            <HeartPulse size={14} className="text-[#E91E63] flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-gray-800 font-bold">High Altitude Safety:</strong> 4-liter supplemental oxygen cylinder &amp; emergency first-aid kit on all flights.
            </span>
          </div>

          <div className="flex items-start gap-2 text-[10px] text-gray-600">
            <CloudSun size={14} className="text-[#E91E63] flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-gray-800 font-bold">100% Weather Guarantee:</strong> 100% full refund or free priority reschedule if flight is grounded.
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. VERIFIED AGENCY & 24/7 SUPPORT BADGES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="text-left">
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">
              VERIFIED AGENCY
            </span>
            <span className="text-xs font-black text-[#200B3B]">
              Govt. Licensed &amp; Insured
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E91E63] flex items-center justify-center flex-shrink-0">
            <Headphones size={20} />
          </div>
          <div className="text-left">
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">
              SUPPORT GUIDE
            </span>
            <span className="text-xs font-black text-[#200B3B]">
              24/7 Hotline Assistance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeliServicePriceModel;
