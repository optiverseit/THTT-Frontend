import React, { useState } from "react";
import VisaVerificationCard from "./VisaVerificationCard";
import VisaApplicationModal from "../Service/VisaApplicationModal";
import { MessageCircle, Users, Check, Zap, RefreshCw, AlertCircle, FileCheck } from "lucide-react";
import { useGlobalCurrency, formatNPR, formatUSD, formatINR } from "../../context/CurrencyContext";

interface VisaPricingProps {
  pkg: any;
}

const WHATSAPP_BUSINESS_NUMBER = "9779851420882";

const VisaPricing: React.FC<VisaPricingProps> = ({ pkg }) => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
    isRateLoading,
    rateLoadFailed,
  } = useGlobalCurrency();

  const [numberOfApplicants, setNumberOfApplicants] = useState<number>(1);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);

  const priceInNPR = Number(pkg.baseNPRPrice || pkg.price || 12000);

  const unitPrice: number =
    selectedCurrency === "nepali"
      ? priceInNPR
      : selectedCurrency === "inr"
        ? Math.round(priceInNPR / nprPerOneINR)
        : Math.round(priceInNPR / nprPerOneDollar);

  const estimatedTotal: number = unitPrice * numberOfApplicants;

  const getFormattedTotal = (): string => {
    if (selectedCurrency === "nepali") return formatNPR(estimatedTotal);
    if (selectedCurrency === "inr") return formatINR(estimatedTotal);
    return formatUSD(estimatedTotal);
  };

  const handleWhatsAppInquiry = () => {
    const formattedTotal = getFormattedTotal();
    const currencyLabel = selectedCurrency.toUpperCase();
    const message =
      `Hello Trip Himalaya (Visa Team)! I am inquiring about visa assistance for *${pkg.title || pkg.country || "Visa Service"}*.\n\n` +
      `*Number of Applicants:* ${numberOfApplicants}\n` +
      `*Estimated Cost:* ${formattedTotal} (${currencyLabel})\n` +
      `*Processing Time:* ${pkg.duration || "Standard"}\n\n` +
      `Please guide me with the document requirements and consultation process.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encoded}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100 space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#E91E63] block">
            VISA CONSULTATION &amp; ASSISTANCE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#200B3B] mt-0.5">
            Service Rates &amp; Filing
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
                { id: "usd", label: "USD", sub: "USD ($)" },
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

        {/* Number of Applicants Counter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#E91E63]" />
              <span className="text-xs font-bold text-gray-700">Number of Applicants</span>
            </div>
            <span className="text-[10px] text-gray-400">Select traveler count</span>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 border border-gray-100">
            <button
              type="button"
              onClick={() => setNumberOfApplicants((prev) => Math.max(1, prev - 1))}
              disabled={numberOfApplicants <= 1}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-700 font-black text-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              −
            </button>

            <span className="text-lg font-black text-[#200B3B]">
              {numberOfApplicants} {numberOfApplicants === 1 ? "Applicant" : "Applicants"}
            </span>

            <button
              type="button"
              onClick={() => setNumberOfApplicants((prev) => prev + 1)}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-700 font-black text-lg flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Total Cost Display */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-gray-500">Estimated Total:</span>
            <div className="text-right">
              <div className="text-2xl font-black text-[#E91E63]">
                {getFormattedTotal()}
              </div>
              <span className="text-[10px] text-gray-400">
                {numberOfApplicants > 1 ? `for ${numberOfApplicants} applicants` : "all taxes & documentation included"}
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
            <FileCheck size={18} />
            <span>Apply For Visa Now</span>
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
            <span>Complete Embassy document vetting</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-500 flex-shrink-0" />
            <span>Flight &amp; hotel reservations included</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-500 flex-shrink-0" />
            <span>Mock interview briefing provided</span>
          </div>
        </div>
      </div>

      <VisaVerificationCard />

      {/* Visa Application Modal */}
      {isApplyModalOpen && (
        <VisaApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          country={pkg.title || pkg.country || "Destination"}
          countryCode={pkg.countryCode || "NP"}
          visaType={pkg.categoryLabel || "Tourist Visa"}
          selectedOption={{
            name: pkg.title || "Tourist Visa",
            days: pkg.duration || "15-30 Days",
            nprPrice: priceInNPR,
            entryType: pkg.entryType || "Single Entry",
          }}
          numberOfGuests={numberOfApplicants}
        />
      )}
    </div>
  );
};

export default VisaPricing;
