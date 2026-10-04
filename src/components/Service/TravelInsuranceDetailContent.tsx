import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalCurrency } from "../../context/CurrencyContext";
import { ChevronDown, MessageCircle, CheckCircle2, CalendarCheck, Clock, X, Search, Shield } from "lucide-react";
import DynamicFaqSection from "../reusable/DynamicFaqSection";
import { getInsurancePlans, getInsurancePricingTiersByPlan } from "../../api/BackendApi";

export interface InsuranceFilterCriteria {
  insuranceType: string;
  days: string;
}

export interface TravelInsuranceDetailContentProps {
  filter?: InsuranceFilterCriteria | null;
  onClearFilter?: () => void;
}

interface InsurancePricingTier {
  id: number;
  insurance_plan_id: number;
  title: string;
  duration_days: number;
  price_npr: string | number;
  status?: string;
  display_order?: number;
}

interface InsurancePlan {
  id: number;
  name: string;
  short_description?: string | null;
  description?: string | null;
  insurance_image?: string | null;
  insurance_image_public_id?: string | null;
  processing_time?: string | null;
  status?: "ACTIVE" | "INACTIVE";
  display_order?: number;
  tier?: string | null;
  pricing_tiers?: InsurancePricingTier[];
}

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

const matchesInsuranceType = (plan: InsurancePlan, typeFilter?: string) => {
  if (!typeFilter || typeFilter === "all" || typeFilter.trim() === "") return true;
  const f = typeFilter.toLowerCase();
  const text = `${plan.name} ${plan.short_description || ""} ${plan.description || ""} ${plan.tier || ""}`.toLowerCase();

  if (f === "domestic") {
    const isDomestic =
      text.includes("domestic") ||
      text.includes("nepal") ||
      text.includes("local") ||
      text.includes("inland") ||
      text.includes("himalaya") ||
      text.includes("trekking");
    const isInternational =
      text.includes("international") ||
      text.includes("worldwide") ||
      text.includes("schengen") ||
      text.includes("abroad") ||
      text.includes("global");

    if (isDomestic) return true;
    return !isInternational;
  }

  if (f === "international") {
    const isInternational =
      text.includes("international") ||
      text.includes("worldwide") ||
      text.includes("schengen") ||
      text.includes("abroad") ||
      text.includes("global") ||
      text.includes("europe") ||
      text.includes("foreign");
    const isStrictDomestic =
      (text.includes("domestic") || text.includes("nepal only")) && !isInternational;

    if (isInternational) return true;
    return !isStrictDomestic;
  }

  return text.includes(f);
};

const getPlanDurations = (plan: InsurancePlan): number[] => {
  const tierDays = (plan.pricing_tiers || [])
    .map((t) => Number(t.duration_days))
    .filter((d) => !isNaN(d) && d > 0);

  const text = `${plan.name} ${plan.short_description || ""} ${plan.description || ""}`;
  const regexMatches = Array.from(text.matchAll(/\b(\d+)\s*days?\b/gi)).map((m) =>
    parseInt(m[1], 10)
  );

  return Array.from(new Set([...tierDays, ...regexMatches]));
};

export const TravelInsuranceDetailContent: React.FC<TravelInsuranceDetailContentProps> = ({
  filter,
  onClearFilter,
}) => {
  const navigate = useNavigate();
  const { selectedCurrency } = useGlobalCurrency();
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const INITIAL_COUNT = 9;
  const LOAD_MORE_STEP = 15;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  useEffect(() => {
    fetchInsurancePlans();
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [filter]);

  const fetchInsurancePlans = async () => {
    try {
      setLoading(true);
      const response = await getInsurancePlans();
      const rawPlans = Array.isArray(response.data?.data) ? response.data.data : [];

      const detailedPlans: InsurancePlan[] = await Promise.all(
        rawPlans.map(async (plan: any) => {
          try {
            const tiersRes = await getInsurancePricingTiersByPlan(plan.id);
            const tiers = Array.isArray(tiersRes.data?.data) ? tiersRes.data.data : [];
            return {
              ...plan,
              pricing_tiers: tiers.filter((t: any) => t?.status !== "INACTIVE"),
            };
          } catch {
            return { ...plan, pricing_tiers: [] };
          }
        })
      );

      setInsurancePlans(detailedPlans);
    } catch (error) {
      console.error("Failed to fetch insurance plans:", error);
      setInsurancePlans([]);
    } finally {
      setLoading(false);
    }
  };

  const targetDays = filter?.days ? parseInt(filter.days.trim(), 10) : null;
  const isValidDaysSearch = targetDays !== null && !isNaN(targetDays) && targetDays > 0;

  // Check if any plan matching the insurance type filter has an EXACT match for targetDays
  const plansMatchingType = insurancePlans.filter((p) =>
    matchesInsuranceType(p, filter?.insuranceType)
  );

  const hasAnyExactDayMatch =
    isValidDaysSearch &&
    plansMatchingType.some((plan) =>
      getPlanDurations(plan).some((d) => d === targetDays)
    );

  const filteredPlans = insurancePlans.filter((plan) => {
    if (filter) {
      if (!matchesInsuranceType(plan, filter.insuranceType)) return false;

      if (isValidDaysSearch) {
        const durations = getPlanDurations(plan);
        if (durations.length === 0) return false;

        if (hasAnyExactDayMatch) {
          // Exactly same days found on at least one plan -> show exact match
          return durations.some((d) => d === targetDays);
        } else {
          // If exactly same days NOT found, show 5 up and 5 down days (e.g. 45 to 55 for 50)
          const minDays = Math.max(1, targetDays - 5);
          const maxDays = targetDays + 5;
          return durations.some((d) => d >= minDays && d <= maxDays);
        }
      }
    }
    return true;
  });

  const isExternalFilterActive = Boolean(
    filter &&
      ((filter.insuranceType && filter.insuranceType !== "all") ||
        (filter.days && filter.days.trim() !== ""))
  );

  const displayedPlans = filteredPlans.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPlans.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  const handleInquiry = (planName: string) => {
    const msg = encodeURIComponent(`Hello Trip Himalaya! I would like to inquire about the "${planName}" insurance plan. Please share pricing, policy details, coverage verification, and issuance steps.`);
    window.open(`https://api.whatsapp.com/send?phone=9779851420882&text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handleViewPlan = (planId: number) => {
    navigate(`/insurance-details/${planId}`);
  };

  const getPlanBadge = (index: number) => {
    const badges = ["SILVER", "GOLD", "PLATINUM", "PREMIUM"];
    return badges[index % badges.length];
  };

  const getPlanBadgeClass = (index: number) => {
    const classes = [
      "bg-slate-100 text-slate-800 border border-slate-300",
      "bg-amber-100 text-amber-900 border border-amber-300",
      "bg-indigo-100 text-indigo-900 border border-indigo-300",
      "bg-rose-100 text-[#E11D48] border border-rose-300",
    ];
    return classes[index % classes.length];
  };

  return (
    <div className="space-y-12">
      {/* ── INSURANCE PLANS COMPARISON GRID ── */}
      <div className="mb-4 text-center max-w-3xl mx-auto">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2D1347] tracking-tight">
          Tailored Plans for Trekking, Expeditions &amp; Holidays
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm mt-1.5 font-medium">
          Select the exact altitude and trip profile required for full medical peace of mind.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#2D1347] font-bold text-base">Loading insurance plans...</p>
        </div>
      ) : displayedPlans.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 border border-gray-200/80 text-center space-y-4 shadow-sm my-4">
          <div className="w-16 h-16 bg-purple-50 text-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Search size={30} />
          </div>
          <h4 className="text-xl sm:text-2xl font-black text-[#2D1347]">
            No Matching Insurance Plans Found
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            We couldn't find any insurance plans matching your search criteria. Try adjusting your duration or clearing filters.
          </p>
          <button
            type="button"
            onClick={onClearFilter}
            className="px-6 py-2.5 bg-[#2D1347] hover:bg-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
          >
            Show All Insurance Plans
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayedPlans.map((plan, index) => {
            const matchedTier =
              isValidDaysSearch && plan.pricing_tiers
                ? plan.pricing_tiers.find((t) => {
                    const d = Number(t.duration_days);
                    if (hasAnyExactDayMatch) return d === targetDays;
                    return d >= Math.max(1, targetDays - 5) && d <= targetDays + 5;
                  })
                : null;

            return (
              <div
                key={plan.id}
                onClick={() => handleViewPlan(plan.id)}
                className="rounded-3xl border border-gray-200/80 bg-[#FBFBFE] hover:bg-white hover:border-[#E11D48]/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
              >
                <div className="p-6 sm:p-7 pb-4">
                  {/* Plan Header */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider inline-block mb-1.5 ${getPlanBadgeClass(index)}`}>
                        {getPlanBadge(index)}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-[#2D1347] leading-snug group-hover:text-[#E11D48] transition-colors">
                        {plan.name}
                      </h4>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-extrabold text-sm sm:text-base text-[#E11D48] whitespace-nowrap bg-pink-50 px-2.5 py-1 rounded-2xl block shadow-2xs">
                        View Pricing
                      </span>
                    </div>
                  </div>

                  {/* Available/Matched Duration Badges (API-fetched) */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    {matchedTier ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-lg shadow-2xs">
                        <Clock size={11} className="text-pink-600" />
                        <span>{matchedTier.duration_days} Days</span>
                      </span>
                    ) : plan.pricing_tiers && plan.pricing_tiers.length > 0 ? (
                      plan.pricing_tiers.map((tier) => (
                        <span key={tier.id} className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-900 bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 rounded-lg shadow-2xs">
                          <Clock size={11} className="text-[#E11D48]" />
                          <span>{tier.duration_days} Days</span>
                        </span>
                      ))
                    ) : null}
                  </div>

                {/* Little Plan Details */}
                <div className="border-t border-gray-100/90 pt-2.5 mt-1">
                  <p className="text-[10.5px] text-gray-500 leading-relaxed line-clamp-2">
                    {plan.short_description || plan.description || "Travel insurance protection for your journey."}
                  </p>
                </div>

                {/* What Is Covered */}
                <div className="border-t border-gray-100/90 pt-2.5 mt-2.5">
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60 inline-flex items-center gap-1">
                      <CheckCircle2 size={9} className="text-emerald-600" />
                      What Is Covered
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-start gap-1.5 text-[9.5px] text-gray-600 font-medium leading-tight">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                      <span className="leading-tight">View complete policy coverage and benefits</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[9.5px] text-gray-600 font-medium leading-tight">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                      <span className="leading-tight">View pricing options and available durations</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[9.5px] text-gray-600 font-medium leading-tight">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                      <span className="leading-tight">View required documents and policy conditions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 sm:p-6 pt-0 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInquiry(plan.name);
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
                    handleViewPlan(plan.id);
                  }}
                  className="flex-1 bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-[11px] sm:text-xs py-3 px-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <CalendarCheck size={14} className="text-pink-400" />
                  <span>Apply for Insurance</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* ── SEE MORE PLANS BUTTON ── */}
      {!loading && hasMore ? (
        <div className="flex justify-center -mt-6 mb-4">
          <button
            type="button"
            onClick={handleSeeMore}
            className="px-8 py-3 bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span>See More Plans</span>
            <ChevronDown size={16} />
          </button>
        </div>
      ) : !loading && insurancePlans.length > INITIAL_COUNT ? (
        <div className="text-center -mt-6 mb-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 text-[#2D1347] text-xs font-bold border border-purple-100 shadow-2xs">
            ✓ All {insurancePlans.length} insurance tiers displayed
          </span>
        </div>
      ) : null}

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
      <DynamicFaqSection
        targetType="service"
        targetId="travel-insurance"
        defaultFaqs={INSURANCE_FAQS}
        title="Trekking & Travel Insurance FAQ"
        subtitle="Critical information for high-altitude trekking safety"
      />
    </div>
  );
};

export default TravelInsuranceDetailContent;