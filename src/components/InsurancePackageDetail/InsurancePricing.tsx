import React, { useState } from "react";
import InsuranceVerificationCard from "./InsuranceVerificationCard";
import InsuranceApplicationModal from "../Service/InsuranceApplicationModal";
import { MessageCircle, Users, Check, Zap, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";
import { useGlobalCurrency, formatNPR, formatUSD, formatINR } from "../../context/CurrencyContext";
import { InsurancePlan, InsuranceCostOption } from "../Service/insuranceData";

interface InsurancePricingProps {
  pkg: any;
}

const WHATSAPP_BUSINESS_NUMBER = "9779851420882";

const InsurancePricing: React.FC<InsurancePricingProps> = ({ pkg }) => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
    isRateLoading,
    rateLoadFailed,
  } = useGlobalCurrency();

  const [numberOfTravelers, setNumberOfTravelers] = useState<number>(1);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);

  const costOptions: InsuranceCostOption[] =
    Array.isArray(pkg.costOptions) && pkg.costOptions.length > 0
      ? pkg.costOptions
      : [
        {
          name: "Standard Cover (10 Days)",
          days: "Up to 10 Days",
          nprPrice: Number(pkg.baseNPRPrice || 4300),
          usdPrice: Number(pkg.priceUSD || 28),
          coverageLimit: pkg.coverageLimit || "$50,000",
          description: "Full medical & emergency rescue cover",
        },
        {
          name: "Extended Cover (20 Days)",
          days: "Up to 20 Days",
          nprPrice: Math.round(Number(pkg.baseNPRPrice || 4300) * 1.6),
          usdPrice: Math.round(Number(pkg.priceUSD || 28) * 1.6),
          coverageLimit: pkg.coverageLimit || "$50,000",
          description: "Ideal for long circuit treks & passes",
        },
        {
          name: "Full Expedition (30 Days)",
          days: "Up to 30 Days",
          nprPrice: Math.round(Number(pkg.baseNPRPrice || 4300) * 2.2),
          usdPrice: Math.round(Number(pkg.priceUSD || 28) * 2.2),
          coverageLimit: pkg.coverageLimit || "$50,000",
          description: "Maximum safety window for remote regions",
        },
      ];

  const currentOption = costOptions[selectedOptionIndex] || costOptions[0];
  const priceInNPR = currentOption.nprPrice;

  const unitPrice: number =
    selectedCurrency === "nepali"
      ? priceInNPR
      : selectedCurrency === "inr"
        ? Math.round(priceInNPR / nprPerOneINR)
        : Math.round(priceInNPR / nprPerOneDollar);

  const estimatedTotal: number = unitPrice * numberOfTravelers;

  const getFormattedTotal = (): string => {
    if (selectedCurrency === "nepali") return formatNPR(estimatedTotal);
    if (selectedCurrency === "inr") return formatINR(estimatedTotal);
    return formatUSD(estimatedTotal);
  };

  const handleWhatsAppInquiry = () => {
    const formattedTotal = getFormattedTotal();
    const currencyLabel = selectedCurrency.toUpperCase();
    const message =
      `Hello Trip Himalaya (Medical & Rescue Desk)! I would like to inquire about insurance for *${pkg.title || "Travel Insurance"}*.\n\n` +
      `*Selected Option:* ${currentOption.name} (${currentOption.days})\n` +
      `*Max Altitude:* ${pkg.maxAltitude || "Standard"}\n` +
      `*Number of Travelers:* ${numberOfTravelers}\n` +
      `*Estimated Premium:* ${formattedTotal} (${currencyLabel})\n\n` +
      `Please provide policy certificate confirmation and cashless claim procedures.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encoded}`, "_blank");
  };

  const planForModal: InsurancePlan = {
    id: pkg.id,
    name: pkg.title,
    badge: pkg.badge || "Verified",
    badgeColor: "bg-blue-100 text-blue-800",
    maxAltitude: pkg.maxAltitude || "Up to 3,000m",
    priceUSD: pkg.priceUSD || 28,
    baseNPRPrice: priceInNPR,
    durationCovered: currentOption.days,
    coverageLimit: pkg.coverageLimit || "$50,000",
    highlights: pkg.highlights || [],
    inclusions: pkg.allIncludes || [],
    heroImage: pkg.image || "",
    aboutText: pkg.description || "",
    requirementDocuments: pkg.requirementDocuments || [],
    termsAndConditions: [],
    costOptions: costOptions,
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100 space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#E91E63] block">
            MEDICAL &amp; HELI RESCUE COVERAGE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#200B3B] mt-0.5">
            Select Duration &amp; Premium
          </h2>
        </div>

        {/* Currency Switcher */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Select Currency
            </span>
            {isRateLoading && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <RefreshCw size={10} className="animate-spin" />
                Updating rates...
              </span>
            )}
            {rateLoadFailed && (
              <span className="flex items-center gap-1 text-[10px] text-amber-500">
                <AlertCircle size={10} />
                Using fallback rates
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-2xl">
            {(
              [
                { id: "nepali", label: "NEPALI", sub: "NPR (रू)" },
                { id: "foreigner", label: "USD", sub: "USD ($)" },
                { id: "inr", label: "INR", sub: "INR (₹)" },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCurrency(c.id)}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                  selectedCurrency === c.id
                    ? "bg-white text-[#200B3B] font-black shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-900 font-semibold"
                }`}
              >
                <div className="text-xs font-black">{c.label}</div>
                <div className="text-[9px] opacity-70">{c.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Coverage Duration Option Selector */}
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Select Trip Window
          </span>
          <div className="space-y-2">
            {costOptions.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedOptionIndex(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedOptionIndex === idx
                    ? "border-[#E91E63] bg-pink-50/40 ring-1 ring-[#E91E63]"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                }`}
              >
                <div>
                  <p className="text-xs font-black text-[#200B3B]">{opt.name}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{opt.days}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#E91E63]">
                    {selectedCurrency === "nepali"
                      ? formatNPR(opt.nprPrice)
                      : selectedCurrency === "inr"
                        ? formatINR(opt.nprPrice / nprPerOneINR)
                        : formatUSD(opt.nprPrice / nprPerOneDollar)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Number of Travelers Counter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#E91E63]" />
              <span className="text-xs font-bold text-gray-700">Insured Travelers</span>
            </div>
            <span className="text-[10px] text-gray-400">Select traveler count</span>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 border border-gray-100">
            <button
              type="button"
              onClick={() => setNumberOfTravelers((prev) => Math.max(1, prev - 1))}
              disabled={numberOfTravelers <= 1}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-700 font-black text-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              −
            </button>

            <span className="text-lg font-black text-[#200B3B]">
              {numberOfTravelers} {numberOfTravelers === 1 ? "Traveler" : "Travelers"}
            </span>

            <button
              type="button"
              onClick={() => setNumberOfTravelers((prev) => prev + 1)}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-700 font-black text-lg flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Total Cost Display */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-gray-500">Total Premium:</span>
            <div className="text-right">
              <div className="text-2xl font-black text-[#E91E63]">
                {getFormattedTotal()}
              </div>
              <span className="text-[10px] text-gray-400">
                {numberOfTravelers > 1 ? `for ${numberOfTravelers} travelers` : "all taxes & heli rescue included"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setIsApplyModalOpen(true)}
            className="w-full py-4 bg-gradient-to-r from-[#E91E63] to-[#200B3B] text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck size={18} />
            <span>Get Covered Now</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className="w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl font-bold text-xs uppercase tracking-wider border border-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageCircle size={16} />
            <span>WhatsApp Instant Inquiry</span>
          </button>
        </div>

        {/* Benefits bullets */}
        <div className="space-y-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-500 flex-shrink-0" />
            <span>Cashless hospital admission guaranteed</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-500 flex-shrink-0" />
            <span>Immediate helicopter rescue dispatch</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-500 flex-shrink-0" />
            <span>Instant digital certificate issued to email</span>
          </div>
        </div>
      </div>

      <InsuranceVerificationCard />

      {/* Insurance Application Modal */}
      {isApplyModalOpen && (
        <InsuranceApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          plan={planForModal}
          selectedOption={currentOption}
          numberOfTravelers={numberOfTravelers}
        />
      )}
    </div>
  );
};

export default InsurancePricing;
