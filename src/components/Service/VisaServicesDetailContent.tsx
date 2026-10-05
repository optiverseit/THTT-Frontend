import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { Clock, CheckCircle2, Calendar, MessageCircle, ChevronDown, Search, Eye, X } from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import { VisaDetailPlan, CostOption } from "./VisaCountryDetailView";
import DynamicFaqSection from "../reusable/DynamicFaqSection";
import { getVisaCategories, getVisaPublicPricingTiers } from "../../api/BackendApi";
export type { VisaDetailPlan, CostOption };
const getRegionFromCountryCode = (countryCode: string): VisaDetailPlan["region"] => {
  const code = countryCode.toUpperCase();
  if (["TH", "SG", "MY", "JP", "KR", "CN", "VN", "KH", "PH", "LK", "MV", "HK", "ID"].includes(code)) return "asia";
  if (["AE", "QA", "SA", "OM", "BH", "KW"].includes(code)) return "middle-east";
  if (["FR", "DE", "IT", "ES", "CH", "AT", "NL", "BE", "PT", "GR", "TR"].includes(code)) return "europe";
  if (["US", "GB", "CA", "AU", "NZ", "ZA", "BR"].includes(code)) return "west";
  return "all";
};
const VISA_FAQS = [
  {
    q: "What documents are generally required for international tourist visas from Nepal?",
    a: "Most embassies require: (1) Original passport with at least 6 months validity, (2) Recent biometric photos as per embassy specs, (3) 6-month bank statements with sufficient funds and bank balance certificate, (4) Relationship/citizenship certificates, (5) Confirmed return flight and hotel vouchers, and (6) Leave/employment letters or business tax clearance. Trip Himalaya assists in preparing and verifying every document.",
  },
  {
    q: "Do you guarantee visa approval?",
    a: "Visa granting is strictly the sovereign right of the respective embassy or consulate. However, Trip Himalaya maintains a 98%+ success rate by thoroughly reviewing your application, eliminating discrepancies, structuring your financial evidence correctly, and preparing tailored cover letters that satisfy embassy guidelines.",
  },
  {
    q: "How early should I apply for my visa before my travel date?",
    a: "We recommend applying at least 3–4 weeks prior to your intended departure for Asian destinations (UAE, Thailand, Malaysia, Singapore), and at least 6–8 weeks in advance for European Schengen, UK, US, or Australian visas to secure convenient biometrics appointments.",
  },
  {
    q: "Can I apply for a visa online without visiting your office?",
    a: "Yes! For e-Visas (such as Dubai/UAE, Malaysia, and Singapore), you can send your scanned passport and photo via WhatsApp or Email. We handle the complete filing, payment, and deliver your approved visa electronically.",
  },
];
interface VisaCategory {
  id: number | string;
  country_id: number | string;
  name: string;
  short_description?: string | null;
  description?: string | null;
  visa_image?: string | null;
  processing_time?: string | null;
  status?: "ACTIVE" | "INACTIVE";
  display_order?: number;
  country?: {
    id: number | string;
    country_name?: string;
    country_code?: string;
    iso_2?: string;
    flag_code?: string;
  };
}
export interface VisaFilterCriteria {
  country: string;
  visaType: string;
  entryType: string;
}
export interface VisaServicesDetailContentProps {
  filter?: VisaFilterCriteria | null;
  onClearFilter?: () => void;
}
const matchesCountry = (plan: VisaDetailPlan, countryFilter?: string) => {
  if (!countryFilter || countryFilter.trim() === "" || countryFilter.toLowerCase() === "all") return true;
  const c = countryFilter.trim().toLowerCase();
  const planCountry = (plan.country || "").toLowerCase();
  const planCode = (plan.countryCode || "").toLowerCase();
  const planAbout = (plan.aboutText || "").toLowerCase();
  const planType = (plan.visaType || "").toLowerCase();
  const inclusions = (plan.inclusions || []).join(" ").toLowerCase();

  if (
    planCountry.includes(c) ||
    c.includes(planCountry) ||
    planCode === c ||
    planAbout.includes(c) ||
    planType.includes(c) ||
    inclusions.includes(c)
  ) {
    return true;
  }

  // Common country/region aliases
  const isUae =
    planCountry.includes("uae") ||
    planCountry.includes("emirates") ||
    planCountry.includes("dubai") ||
    planCode === "ae" ||
    planAbout.includes("uae") ||
    planAbout.includes("dubai") ||
    planAbout.includes("emirates");
  if (
    (c === "uae" || c.includes("dubai") || c.includes("emirates") || c === "ae") &&
    isUae
  ) {
    return true;
  }

  const isUsa =
    planCountry.includes("usa") ||
    planCountry.includes("united states") ||
    planCountry.includes("america") ||
    planCode === "us" ||
    planAbout.includes("usa") ||
    planAbout.includes("united states") ||
    planAbout.includes("america");
  if (
    (c === "usa" || c === "us" || c.includes("united states") || c.includes("america")) &&
    isUsa
  ) {
    return true;
  }

  const isUk =
    planCountry.includes("uk") ||
    planCountry.includes("united kingdom") ||
    planCountry.includes("britain") ||
    planCountry.includes("england") ||
    planCode === "gb" ||
    planAbout.includes("uk") ||
    planAbout.includes("united kingdom");
  if (
    (c === "uk" || c === "gb" || c.includes("united kingdom") || c.includes("britain")) &&
    isUk
  ) {
    return true;
  }

  const isSchengen =
    planCountry.includes("schengen") ||
    planCountry.includes("europe") ||
    planCode === "eu" ||
    planAbout.includes("schengen") ||
    planAbout.includes("europe");
  if ((c === "schengen" || c.includes("europe")) && isSchengen) {
    return true;
  }

  if (c.includes("bali") && (planCountry.includes("indonesia") || planAbout.includes("bali") || planAbout.includes("indonesia"))) {
    return true;
  }

  return false;
};

const matchesVisaType = (plan: VisaDetailPlan, typeFilter?: string) => {
  if (!typeFilter || typeFilter === "all" || typeFilter.trim() === "") return true;
  const f = typeFilter.toLowerCase();
  const planType = (plan.visaType || "").toLowerCase();
  const planAbout = (plan.aboutText || "").toLowerCase();
  const inclusions = (plan.inclusions || []).join(" ").toLowerCase();

  if (f === "tourist") {
    return (
      planType.includes("tourist") ||
      planType.includes("visit") ||
      planType.includes("visitor") ||
      planType.includes("holiday") ||
      planType.includes("evisa") ||
      planType.includes("e-visa") ||
      planType.includes("eta") ||
      planAbout.includes("tourist") ||
      planAbout.includes("visitor") ||
      planAbout.includes("tourism") ||
      inclusions.includes("tourist") ||
      inclusions.includes("tourism")
    );
  }
  if (f === "student") {
    return (
      planType.includes("student") ||
      planType.includes("study") ||
      planType.includes("education") ||
      planAbout.includes("student") ||
      planAbout.includes("study") ||
      inclusions.includes("student") ||
      inclusions.includes("study")
    );
  }
  if (f === "business") {
    return (
      planType.includes("business") ||
      planType.includes("commercial") ||
      planType.includes("conference") ||
      planAbout.includes("business") ||
      inclusions.includes("business")
    );
  }
  if (f === "transit") {
    return (
      planType.includes("transit") ||
      planType.includes("stopover") ||
      planAbout.includes("transit") ||
      inclusions.includes("transit")
    );
  }
  if (f === "express") {
    const proc = (plan.processingTime || "").toLowerCase();
    return (
      proc.includes("1 –") ||
      proc.includes("2 –") ||
      proc.includes("1-") ||
      proc.includes("2-") ||
      proc.includes("instant") ||
      proc.includes("same day") ||
      proc.includes("fast") ||
      inclusions.includes("fast-track") ||
      inclusions.includes("express") ||
      inclusions.includes("instant") ||
      planType.includes("express") ||
      planType.includes("fast") ||
      Boolean(plan.popular)
    );
  }
  if (f === "work") {
    return (
      planType.includes("work") ||
      planType.includes("employment") ||
      planAbout.includes("work") ||
      planAbout.includes("employment")
    );
  }
  return planType.includes(f) || planAbout.includes(f) || inclusions.includes(f);
};

const matchesEntryType = (plan: VisaDetailPlan, entryFilter?: string) => {
  if (!entryFilter || entryFilter === "all" || entryFilter.trim() === "") return true;
  const f = entryFilter.toLowerCase();
  const planEntry = (plan.entryType || "").toLowerCase();
  const planAbout = (plan.aboutText || "").toLowerCase();
  const inclusions = (plan.inclusions || []).join(" ").toLowerCase();
  const allTiers = (plan.costOptions || [])
    .map((c: CostOption) => `${c.name} ${c.entryType || ""}`)
    .join(" ")
    .toLowerCase();

  if (f === "single") {
    return (
      planEntry.includes("single") ||
      allTiers.includes("single") ||
      planAbout.includes("single entry") ||
      inclusions.includes("single entry")
    );
  }
  if (f === "multiple") {
    return (
      planEntry.includes("multiple") ||
      planEntry.includes("double") ||
      allTiers.includes("multiple") ||
      allTiers.includes("double") ||
      planAbout.includes("multiple entry") ||
      inclusions.includes("multiple entry")
    );
  }
  return (
    planEntry.includes(f) ||
    allTiers.includes(f) ||
    planAbout.includes(f) ||
    inclusions.includes(f)
  );
};

export const VisaServicesDetailContent: React.FC<VisaServicesDetailContentProps> = ({
  filter,
  onClearFilter,
}) => {
  const navigate = useNavigate();
  const INITIAL_COUNT = 9;
  const LOAD_MORE_STEP = 15;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);
  const [visaPlans, setVisaPlans] = useState<VisaDetailPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const isExternalFilterActive = Boolean(
    filter &&
      ((filter.country && filter.country.trim() !== "" && filter.country.toLowerCase() !== "all") ||
        (filter.visaType && filter.visaType !== "all") ||
        (filter.entryType && filter.entryType !== "all"))
  );

  useEffect(() => {
    let isMounted = true;
    const fetchVisaCategories = async () => {
      try {
        setLoading(true);
        const response = await getVisaCategories();
        const categories: VisaCategory[] = response.data?.data || [];
        const mappedPlans: VisaDetailPlan[] = await Promise.all(
          categories.map(async (category) => {
            const countryName = category.country?.country_name || "Visa Destination";
            const countryCode =
              category.country?.iso_2 ||
              category.country?.flag_code ||
              category.country?.country_code ||
              "";
            let costOptions: CostOption[] = [];
            let entryType = "";
            let duration = "";
            let baseNPRPrice = 0;

            try {
              const pricingRes = await getVisaPublicPricingTiers(category.id);
              const pricing = pricingRes.data?.data || [];
              costOptions = (Array.isArray(pricing) ? pricing : [])
                .filter((item: any) => item?.status !== "INACTIVE")
                .sort(
                  (a: any, b: any) =>
                    Number(a?.display_order || 0) - Number(b?.display_order || 0)
                )
                .map((item: any, index: number) => ({
                  name: String(item?.title || `Option ${index + 1}`),
                  days: String(item?.validity || ""),
                  nprPrice: Number(item?.price_npr || 0),
                  entryType: String(item?.title || ""),
                  description: item?.description || undefined,
                  visaPricingTierId: item?.id,
                  countryId: category.country_id,
                  visaCategoryId: category.id,
                }));

              if (costOptions.length > 0) {
                entryType = costOptions[0].entryType;
                duration = costOptions[0].days;
                baseNPRPrice = costOptions[0].nprPrice;
              }
            } catch (err) {
              console.warn(
                `Failed to fetch pricing tiers for visa category ${category.id}:`,
                err
              );
            }

            return {
              id: String(category.id),
              country: countryName,
              countryCode,
              region: getRegionFromCountryCode(countryCode),
              visaType: category.name || "Visa",
              duration,
              processingTime: category.processing_time || "",
              baseNPRPrice,
              entryType,
              inclusions: category.short_description
                ? [category.short_description]
                : [],
              aboutText:
                category.description || category.short_description || "",
              requirementDocuments: [],
              termsAndConditions: [],
              costOptions,
              countryId: category.country_id,
              visaCategoryId: category.id,
              image: category.visa_image || null,
            };
          })
        );
        if (isMounted) {
          setVisaPlans(mappedPlans);
        }
      } catch (error) {
        console.error("Failed to fetch visa categories:", error);
        if (isMounted) {
          setVisaPlans([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchVisaCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [filter, isExternalFilterActive]);

  const filteredPlans = visaPlans.filter((plan: VisaDetailPlan) => {
    if (filter) {
      if (!matchesCountry(plan, filter.country)) return false;
      if (!matchesVisaType(plan, filter.visaType)) return false;
      if (!matchesEntryType(plan, filter.entryType)) return false;
    }
    return true;
  });
  const displayedPlans = filteredPlans.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPlans.length;
  const handleSeeMore = () => setVisibleCount((prev: number) => prev + LOAD_MORE_STEP);
  const handleClearAllFilters = () => {
    onClearFilter?.();
  };
  const handleSelectPlan = (plan: VisaDetailPlan) => navigate(`/visa-details/${plan.id}`);
  const handleWhatsAppInquiry = (plan: VisaDetailPlan, entryLabel?: string, priceNPR?: number) => {
    const finalPrice = priceNPR && priceNPR > 0 ? priceNPR : plan.baseNPRPrice;
    const formattedPrice = finalPrice > 0 ? displayPrice(finalPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR) : "—";
    const entryText = entryLabel && entryLabel !== "—" ? `${entryLabel}, ` : "";
    const msg = encodeURIComponent(`Hello Trip Himalaya (Visa & Documentation Team)! I would like to inquire about visa assistance for "${plan.country}" (${plan.visaType}, ${entryText}fee starting around ${formattedPrice}). Please guide me with requirements and next steps.`);
    window.open(`https://api.whatsapp.com/send?phone=9779851420882&text=${msg}`, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="text-center pt-2 pb-1">
          <div className="inline-flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2D1347] tracking-tight">
              Popular Visa Destination
            </h3>
            <div className="h-1.5 w-32 sm:w-40 bg-[#E91E63] rounded-full mt-2.5 shadow-xs" />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#2D1347] font-bold text-base">Loading visa destinations...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-gray-200/80 text-center space-y-4 shadow-sm my-4">
            <div className="w-16 h-16 bg-purple-50 text-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Search size={30} />
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-[#2D1347]">
              No Matching Visa Destinations Found
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              We couldn't find any visa packages matching your criteria. Try clearing or adjusting your search filters.
            </p>
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="px-6 py-2.5 bg-[#2D1347] hover:bg-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
            >
              Show All Visa Destinations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPlans.map((plan: VisaDetailPlan) => {
              // Determine display values based on active entry filter
              let displayEntryType = plan.entryType || "—";
              let displayDuration = plan.duration || "—";
              let displayPriceNPR = plan.baseNPRPrice;

              if (plan.costOptions && plan.costOptions.length > 0) {
                const requestedEntry = filter?.entryType?.toLowerCase();
                if (requestedEntry === "multiple") {
                  const multiOpt = plan.costOptions.find(
                    (c) =>
                      (c.entryType || "").toLowerCase().includes("multiple") ||
                      (c.name || "").toLowerCase().includes("multiple") ||
                      (c.entryType || "").toLowerCase().includes("double")
                  );
                  if (multiOpt) {
                    displayEntryType = multiOpt.entryType || multiOpt.name || "Multiple Entry";
                    displayDuration = multiOpt.days || plan.duration || "—";
                    displayPriceNPR = multiOpt.nprPrice || plan.baseNPRPrice;
                  }
                } else if (requestedEntry === "single") {
                  const singleOpt = plan.costOptions.find(
                    (c) =>
                      (c.entryType || "").toLowerCase().includes("single") ||
                      (c.name || "").toLowerCase().includes("single")
                  );
                  if (singleOpt) {
                    displayEntryType = singleOpt.entryType || singleOpt.name || "Single Entry";
                    displayDuration = singleOpt.days || plan.duration || "—";
                    displayPriceNPR = singleOpt.nprPrice || plan.baseNPRPrice;
                  }
                } else {
                  // No specific entry filter: check if both single and multiple options exist
                  const hasSingle = plan.costOptions.some(
                    (c) =>
                      (c.entryType || "").toLowerCase().includes("single") ||
                      (c.name || "").toLowerCase().includes("single")
                  );
                  const hasMultiple = plan.costOptions.some(
                    (c) =>
                      (c.entryType || "").toLowerCase().includes("multiple") ||
                      (c.name || "").toLowerCase().includes("multiple") ||
                      (c.entryType || "").toLowerCase().includes("double")
                  );
                  if (hasSingle && hasMultiple) {
                    displayEntryType = "Single / Multiple Entry";
                  }
                }
              }

              const formattedPrice =
                displayPriceNPR > 0
                  ? displayPrice(
                      displayPriceNPR,
                      selectedCurrency,
                      nprPerOneDollar,
                      nprPerOneINR
                    )
                  : "—";

              return (
                <div
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan)}
                  className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#E91E63]/40 transition-all duration-300 flex flex-col justify-between relative group cursor-pointer"
                >
                  {plan.popular && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-[#E91E63] to-pink-500 text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                      Popular
                    </span>
                  )}
                  <div>
                    <div className="flex items-center gap-3 mb-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                        {plan.countryCode === "EU" ? (
                          <span className="text-2xl">🇪🇺</span>
                        ) : (
                          <ReactCountryFlag
                            svg
                            countryCode={plan.countryCode}
                            style={{ width: "1.8em", height: "1.8em", borderRadius: "4px" }}
                          />
                        )}
                      </div>
                      <div className="min-w-0 pr-14">
                        <h4 className="text-lg sm:text-xl font-black text-[#2D1347] leading-snug tracking-tight truncate group-hover:text-[#E91E63] transition-colors">
                          {plan.country}
                        </h4>
                        <p className="text-xs sm:text-sm font-bold text-[#E91E63] mt-0.5 truncate">
                          {plan.visaType}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 my-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-[#2D1347] text-xs font-bold border border-purple-100/60">
                        <Calendar size={13} className="text-[#E91E63]" />
                        <span>{displayDuration}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-200/70">
                        <Clock size={13} className="text-gray-400" />
                        <span>{plan.processingTime || "—"}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <span>{displayEntryType}</span>
                      </span>
                    </div>
                    <div className="space-y-2 my-4 pt-3 border-t border-gray-100">
                      {plan.inclusions.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-medium leading-tight">
                          <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5 mt-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                        Assistance Fee Starts At
                      </span>
                      <span className="text-lg sm:text-xl font-black text-[#2D1347]">
                        {formattedPrice}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 mt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan(plan);
                        }}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#2D1347] font-bold text-xs sm:text-sm rounded-xl border border-purple-200/80 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Eye size={15} className="text-[#E91E63]" />
                        <span>View Detail</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsAppInquiry(plan, displayEntryType, displayPriceNPR);
                        }}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-[#E91E63] to-pink-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-pink-600/20 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <MessageCircle size={15} />
                        <span>Inquire</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {filteredPlans.length > 0 && (
          hasMore ? (
            <div className="flex flex-col items-center justify-center pt-8">
              <button
                onClick={handleSeeMore}
                className="px-10 py-3.5 bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-sm rounded-2xl flex items-center gap-2.5 transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
              >
                <span>See More</span>
                <ChevronDown size={16} />
              </button>
            </div>
          ) : filteredPlans.length > INITIAL_COUNT ? (
            <div className="text-center pt-6">
              <span className="inline-block px-5 py-2 rounded-full bg-purple-50 text-[#2D1347] text-xs sm:text-sm font-bold border border-purple-100 shadow-xs">
                ✓ Showing all {filteredPlans.length} visa destinations
              </span>
            </div>
          ) : null
        )}
      </div>
      <div className="bg-gradient-to-br from-[#2D1347] to-[#401863] text-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-xl">
        <span className="text-pink-400 font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
          SEAMLESS 4-STEP PROCEDURE
        </span>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-6 sm:mb-8 tracking-tight">
          How Our Visa Concierge Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[
            {
              step: "01",
              title: "Free Evaluation",
              desc: "We assess your passport, travel history, and financial profile to suggest the optimal visa category.",
            },
            {
              step: "02",
              title: "Dossier Prep",
              desc: "Our team drafts tailored cover letters, verifies flight/hotel vouchers, and organizes your embassy dossier.",
            },
            {
              step: "03",
              title: "Appointment / E-filing",
              desc: "We secure your biometrics slot (VFS/TLS) or directly file your electronic visa portal application.",
            },
            {
              step: "04",
              title: "Visa Grant",
              desc: "Collect your passport with stamped visa or receive your digital e-visa directly on WhatsApp & Email.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-all"
            >
              <span className="text-2xl font-black text-pink-400 block mb-2">{item.step}</span>
              <h4 className="font-black text-sm uppercase tracking-wide text-white mb-1.5">
                {item.title}
              </h4>
              <p className="text-gray-300 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <DynamicFaqSection
        targetType="service"
        targetId="visa-services"
        defaultFaqs={VISA_FAQS}
        title="Visa Services FAQ"
        subtitle="Important answers to common visa queries"
      />
    </div>
  );
};
export default VisaServicesDetailContent;
