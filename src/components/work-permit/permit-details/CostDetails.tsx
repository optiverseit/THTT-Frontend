import React, { useState } from "react";
import { ArrowRight, MessageCircle, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../../context/CurrencyContext";

interface CountryProps {
  id: string;
  name: string;
  flag: string;
  desc?: string;
}

interface CostDetailsProps {
  country?: CountryProps;
}

interface AgeTier {
  id: string;
  label: string;
  range: string;
  totalNpr: number;
  insuranceNpr: number;
  welfareNpr: number;
  ssfNpr: number;
  facilitationNpr: number;
}

const CostDetails: React.FC<CostDetailsProps> = ({ country }) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  // Regulated government, insurance & processing fee tiers
  const ageTiers: AgeTier[] = [
    {
      id: "below-35",
      label: "Below 35 years",
      range: "Ages 18–35",
      totalNpr: 11000,
      insuranceNpr: 3708,
      welfareNpr: 1500,
      ssfNpr: 2500,
      facilitationNpr: 3292,
    },
    {
      id: "35-50",
      label: "35–50 years",
      range: "Ages 35–50",
      totalNpr: 12500,
      insuranceNpr: 4929,
      welfareNpr: 1500,
      ssfNpr: 2500,
      facilitationNpr: 3571,
    },
    {
      id: "above-51",
      label: "Above 51 years",
      range: "Ages 51+",
      totalNpr: 15500,
      insuranceNpr: 9200,
      welfareNpr: 1500,
      ssfNpr: 2500,
      facilitationNpr: 2300,
    },
  ];

  const activeTier = ageTiers[selectedTierIndex];

  const currencyLabel =
    selectedCurrency === "nepali" ? "NPR" : selectedCurrency === "inr" ? "INR" : "USD";

  const itemizedItems = [
    {
      name: "Term Life Insurance (Myadi Bima)",
      npr: activeTier.insuranceNpr,
    },
    {
      name: "Foreign Employment Welfare Fund",
      npr: activeTier.welfareNpr,
    },
    {
      name: "Social Security Fund (SSF)",
      npr: activeTier.ssfNpr,
    },
    {
      name: "FEIMS Filing & Agency Facilitation",
      npr: activeTier.facilitationNpr,
    },
  ];

  const handleWhatsAppInquiry = () => {
    const tierPrice = displayPrice(
      activeTier.totalNpr,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );
    const countryName = country?.name || "Malaysia";
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I am inquiring about the Work Permit service for ${countryName}. Age Group: ${activeTier.label} (Total Fee: ${tierPrice}). Please guide me through the application process and requirements.`
    );
    window.open(`https://wa.me/9779851420882?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── MAIN COST CARD ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl shadow-gray-300 border border-gray-100 relative overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2D1347] via-[#E91E63] to-purple-600" />

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-purple-950">Cost Breakdown</h2>
            {country && (
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-pink-50 text-[#E91E63] border border-pink-100">
                {country.name} Permit
              </span>
            )}
          </div>
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mt-1">
            Based on Age Groups ({currencyLabel})
          </p>
        </div>

        {/* Age Group Selector Tabs */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-gray-500 mb-1.5 flex items-center gap-1">
            <Users size={12} className="text-[#E91E63]" />
            Select Age Group:
          </p>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-200/70">
            {ageTiers.map((tier, idx) => {
              const isSelected = selectedTierIndex === idx;
              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTierIndex(idx)}
                  className={`py-2 px-1 text-center rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#E91E63] text-white shadow-md shadow-pink-500/20 scale-[1.02]"
                      : "text-gray-600 hover:text-[#2D1347] hover:bg-white/80"
                  }`}
                >
                  <div className="leading-tight truncate">{tier.label.replace(" years", "")}</div>
                  <div className={`text-[9px] mt-0.5 ${isSelected ? "text-pink-100" : "text-gray-400"}`}>
                    {displayPrice(tier.totalNpr, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Total Cost Highlight Box */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-[#2D1347] to-[#45186b] text-white shadow-md mb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-pink-300 uppercase tracking-widest block">
              Total Package Fee ({activeTier.label})
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {displayPrice(activeTier.totalNpr, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
              </span>
              {selectedCurrency !== "nepali" && (
                <span className="text-[10px] text-pink-200/80 font-medium">
                  (≈ NPR {activeTier.totalNpr.toLocaleString("en-IN")})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Toggleable Itemized Breakdown (Hidden by default) */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowBreakdown((prev) => !prev)}
            className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-gray-50 hover:bg-gray-100/90 border border-gray-200/70 transition-all text-xs font-bold text-[#2D1347] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E91E63]" />
              {showBreakdown ? "Hide Fee Breakdown" : "View Fee Breakdown"}
            </span>
            {showBreakdown ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showBreakdown && (
            <div className="space-y-2 mt-2.5 pt-1">
              {itemizedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-pink-100 transition-all text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63] flex-shrink-0" />
                    <span className="font-bold text-gray-800">{item.name}</span>
                  </div>
                  <span className="font-black text-[#2D1347] flex-shrink-0 ml-2">
                    {displayPrice(item.npr, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              const modal = document.getElementById("work_permit_modal") as HTMLDialogElement;
              modal?.showModal();
            }}
            className="w-full font-bold cursor-pointer shadow hover:shadow-pink-400/30 flex gap-2 items-center justify-center rounded-2xl bg-pink-500 text-white py-3 transition-all hover:bg-pink-600 text-sm"
          >
            Process Now <ArrowRight size={14} />
          </button>
          <button
            onClick={handleWhatsAppInquiry}
            className="w-full font-bold cursor-pointer shadow hover:shadow-green-400/30 flex gap-2 items-center justify-center rounded-2xl bg-green-500 text-white py-3 transition-all hover:bg-green-600 text-sm"
          >
            <MessageCircle size={14} />
            WhatsApp Inquiry
          </button>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="flex justify-center flex-col items-center rounded-3xl shadow-xl shadow-gray-200 bg-white p-8 border border-gray-100">
        <p className="text-2xl font-bold text-pink-600">1000+</p>
        <p className="text-xs tracking-wider font-semibold text-gray-400 mt-0.5">
          SUCCESSFUL APPLICATIONS
        </p>
      </div>
    </div>
  );
};

export default CostDetails;
