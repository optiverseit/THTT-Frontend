import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import {
  Shield,
  ShieldCheck,
  Activity,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  CheckCircle2,
  FileCheck2,
  Clock,
  Zap,
  Globe2,
  Stethoscope,
  CalendarCheck,
} from "lucide-react";
import DynamicFaqSection from "../reusable/DynamicFaqSection";
import { INSURANCE_PLANS, InsurancePlan } from "./insuranceData";
import { InsuranceApplicationModal } from "./InsuranceApplicationModal";


const INSURANCE_FAQS = [
  {
    q: "Why is specialized travel insurance mandatory for trekking in Nepal?",
    a: "Standard travel insurances from regular credit cards or general agents usually cap altitude at 2,000m to 2,500m and exclude helicopter search and rescue. In regions like Everest Base Camp (5,364m) or Thorong La Pass (5,416m), emergency medical helicopter evacuation costs between $2,500 and $5,000 per flight. Specialized high-altitude trekking insurance guarantees 100% cashless helicopter airlift with zero out-of-pocket delays.",
  },
  {
    q: "How fast can a rescue helicopter be dispatched during an emergency on the trail?",
    a: "Once our lead Sherpa guide and wilderness first-responder assess your condition, our 24/7 Kathmandu operations desk coordinates immediate flight clearance. The rescue helicopter typically arrives at the high-altitude helipad within 30 to 45 minutes (weather permitting).",
  },
  {
    q: "Which hospitals in Nepal provide direct cashless billing with this insurance?",
    a: "We work directly with Nepal's premier tourist medical facilities including CIWEC Hospital & Travel Medicine Center (Kathmandu & Pokhara), Swacon International Hospital, and Era Health Care for immediate cashless admission.",
  },
  {
    q: "Does the policy provide certification for Schengen, US, and UK visa applications?",
    a: "Yes! Our International Outbound plan meets all European Union Schengen requirements (minimum €30,000 medical coverage, zero deductible, medical repatriation) and provides an official digital policy certificate recognized by all foreign embassies.",
  },
  {
    q: "Can insurance be arranged on short notice after arriving in Kathmandu?",
    a: "Yes. We can issue official policy certificates within 30 to 60 minutes after receiving your passport copy, planned trekking route, and travel dates.",
  },
];

export const TravelInsuranceDetailContent: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<InsurancePlan | null>(null);

  const formatPrice = (usdAmount: number) => {
    const nprAmount = usdAmount * nprPerOneDollar;
    return displayPrice(nprAmount, selectedCurrency, nprPerOneDollar, nprPerOneINR);
  };

  const handleInquiry = (planName: string, priceUSD: number) => {
    const priceFormatted = formatPrice(priceUSD);
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I would like to inquire about the "${planName}" (${priceFormatted}). Please share policy details, altitude coverage verification, and issuance steps.`
    );
    window.open(`https://api.whatsapp.com/send?phone=9779851420882&text=${msg}`, "_blank", "noopener,noreferrer");
  };

  // Navigate to the insurance plan detail page
  const handleViewPlan = (planId: string) => {
    navigate(`/details/${planId}`);
  };

  return (
    <div className="space-y-12">
      {/* ── INSURANCE PLANS COMPARISON GRID ── */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2D1347] tracking-tight">
          Tailored Plans for Trekking, Expeditions &amp; Holidays
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm mt-1.5 font-medium">
          Select the exact altitude and trip profile required for full medical peace of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {INSURANCE_PLANS.slice(0, 3).map((plan) => (
          <div
            key={plan.id}
            onClick={() => handleViewPlan(plan.id)}
            className={`rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 ${
              plan.isPopular
                ? "bg-gradient-to-b from-pink-50/50 to-white border-[#E11D48] ring-2 ring-[#E11D48]/20"
                : "bg-[#FBFBFE] border-gray-200/80 hover:border-[#E11D48]/50"
            }`}
          >
            <div className="p-6 sm:p-7">
              {/* Plan Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2 ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-[#2D1347] leading-snug group-hover:text-[#E11D48] transition-colors">
                    {plan.name}
                  </h4>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-extrabold text-base sm:text-lg text-[#E11D48] whitespace-nowrap bg-pink-50 px-3 py-1.5 rounded-2xl block shadow-2xs">
                    {formatPrice(plan.priceUSD)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">{plan.durationCovered}</span>
                </div>
              </div>

              {/* Altitude Limit & Coverage Tag */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-purple-100 text-purple-900 px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1">
                  <Activity size={13} className="text-[#E11D48]" />
                  {plan.maxAltitude}
                </span>
                <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  {plan.coverageLimit}
                </span>
              </div>

              {/* Key Highlights */}
              <div className="space-y-2 mb-6">
                {plan.highlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-700 font-bold">
                    <CheckCircle2 size={14} className="text-[#E11D48] mt-0.5 flex-shrink-0" />
                    <span className="leading-tight">{hl}</span>
                  </div>
                ))}
              </div>

              {/* Full Inclusions List */}
              <div className="border-t border-gray-100 pt-4 space-y-1.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">
                  POLICY INCLUSIONS
                </span>
                {plan.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-gray-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 sm:p-6 pt-0 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleInquiry(plan.name, plan.priceUSD);
                }}
                className="flex-1 bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-[11px] sm:text-xs py-3 px-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-pink-900/20 whitespace-nowrap"
              >
                <MessageCircle size={15} />
                <span>Inquiry</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlanForModal(plan);
                }}
                className="flex-1 bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-[11px] sm:text-xs py-3 px-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap"
              >
                <CalendarCheck size={14} className="text-pink-400" />
                <span>Apply for Insurance</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. EMERGENCY HELICOPTER EVACUATION PROTOCOL ── */}
      <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="max-w-3xl mb-8">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-xs block mb-1">
            24/7 MOUNTAIN RESCUE GUARANTEE
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            How Our Emergency Helicopter Rescue Works
          </h3>
          <p className="text-gray-300 text-sm mt-2 font-medium">
            In remote Himalayan terrain, minutes matter. Our direct satellite and radio link ensures the fastest evacuation in Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "Trail Medical Assessment",
              desc: "Lead Sherpa guide tests blood oxygen (SpO2) and symptoms on the trail with our medical kit.",
            },
            {
              step: "02",
              title: "Instant SOS Dispatch",
              desc: "Our Kathmandu operations center triggers insurance clearance & assigns the nearest standby helicopter.",
            },
            {
              step: "03",
              title: "45-Min Alpine Airlift",
              desc: "Helicopter lands at the mountain helipad and flies patient with oxygen directly to Kathmandu/Pokhara.",
            },
            {
              step: "04",
              title: "Direct Cashless Care",
              desc: "Patient enters CIWEC or Swacon Hospital with zero upfront hospital deposit or paperwork stress.",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-[#FF4FA3] block mb-2">{item.step}</span>
              <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
              <p className="text-gray-300 text-xs leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. TRAVEL INSURANCE FAQS ── */}
      {/* ── 5. TRAVEL INSURANCE FAQS ── */}
      <DynamicFaqSection
        targetType="service"
        targetId="travel-insurance"
        defaultFaqs={INSURANCE_FAQS}
        title="Trekking & Travel Insurance FAQ"
        subtitle="Critical information for high-altitude trekking safety"
      />

      {/* ── INSURANCE APPLICATION MODAL ── */}
      {selectedPlanForModal && (
        <InsuranceApplicationModal
          isOpen={Boolean(selectedPlanForModal)}
          onClose={() => setSelectedPlanForModal(null)}
          plan={selectedPlanForModal}
          selectedOption={selectedPlanForModal.costOptions[0]}
          numberOfTravelers={1}
        />
      )}
    </div>
  );
};

export default TravelInsuranceDetailContent;
