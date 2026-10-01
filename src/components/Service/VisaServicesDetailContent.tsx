import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { Clock, CheckCircle2, Calendar, MessageCircle, ChevronDown, Search, Eye, X } from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import { VisaDetailPlan, CostOption } from "./VisaCountryDetailView";
import DynamicFaqSection from "../reusable/DynamicFaqSection";
import { getVisaCategories } from "../../api/BackendApi";
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
  if (!countryFilter || countryFilter.trim() === "" || countryFilter === "all") return true;
  const c = countryFilter.trim().toLowerCase();
  const planCountry = (plan.country || "").toLowerCase();
  const planId = (plan.id || "").toLowerCase();
  const planCode = (plan.countryCode || "").toLowerCase();
  if (planCountry.includes(c) || planId.includes(c) || planCode === c) return true;
  if (c === "uae" && (planCountry.includes("uae") || planCountry.includes("dubai") || planCountry.includes("emirates"))) return true;
  if (c === "usa" && (planCountry.includes("usa") || planCountry.includes("united states"))) return true;
  if (c === "uk" && (planCountry.includes("uk") || planCountry.includes("united kingdom"))) return true;
  if (c === "schengen" && (planCountry.includes("schengen") || planCountry.includes("europe"))) return true;
  if (c.includes("bali") && planCountry.includes("indonesia")) return true;
  if (c.includes("indonesia") && planCountry.includes("indonesia")) return true;
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
      planType.includes("evisa") ||
      planType.includes("e-visa") ||
      planType.includes("eta") ||
      planAbout.includes("tourist") ||
      planAbout.includes("visitor")
    );
  }
  if (f === "business") {
    return (
      planType.includes("business") ||
      planAbout.includes("business") ||
      inclusions.includes("business")
    );
  }
  if (f === "transit") {
    return (
      planType.includes("transit") ||
      planType.includes("entry") ||
      planAbout.includes("transit") ||
      inclusions.includes("transit")
    );
  }
  if (f === "express") {
    const proc = (plan.processingTime || "").toLowerCase();
    return (
      proc.includes("1 –") ||
      proc.includes("2 –") ||
      proc.includes("instant") ||
      proc.includes("same day") ||
      inclusions.includes("fast-track") ||
      inclusions.includes("express") ||
      inclusions.includes("instant") ||
      Boolean(plan.popular)
    );
  }
  return planType.includes(f);
};
const matchesEntryType = (plan: VisaDetailPlan, entryFilter?: string) => {
  if (!entryFilter || entryFilter === "all" || entryFilter.trim() === "") return true;
  const f = entryFilter.toLowerCase();
  const planEntry = (plan.entryType || "").toLowerCase();
  if (!planEntry && (!plan.costOptions || plan.costOptions.length === 0)) return true;
  if (f === "single") {
    if (planEntry.includes("single")) return true;
    if (plan.costOptions?.some((c: CostOption) => (c.entryType || "").toLowerCase().includes("single"))) return true;
    return false;
  }
  if (f === "multiple") {
    if (planEntry.includes("multiple") || planEntry.includes("double")) return true;
    if (
      plan.costOptions?.some((c: CostOption) => {
        const ce = (c.entryType || "").toLowerCase();
        return ce.includes("multiple") || ce.includes("double");
      })
    ) {
      return true;
    }
    return false;
  }
  return planEntry.includes(f);
};
export const VisaServicesDetailContent: React.FC<VisaServicesDetailContentProps> = ({
  filter,
  onClearFilter,
}) => {
  const navigate = useNavigate();
  const INITIAL_COUNT = 9;
  const LOAD_MORE_STEP = 15;
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);
  const [visaPlans, setVisaPlans] = useState<VisaDetailPlan[]>([]);
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const isExternalFilterActive = Boolean(filter && (Boolean(filter.country && filter.country.trim() !== "" && filter.country !== "all") || (filter.visaType && filter.visaType !== "all") || (filter.entryType && filter.entryType !== "all")));
  useEffect(() => {
    const fetchVisaCategories = async () => {
      try {
        const response = await getVisaCategories();
        const categories: VisaCategory[] = response.data?.data || [];
        const mappedPlans: VisaDetailPlan[] = categories.map((category) => {
          const countryName = category.country?.country_name || "Visa Destination";
          const countryCode = category.country?.iso_2 || category.country?.flag_code || category.country?.country_code || "";
          return { id: String(category.id), country: countryName, countryCode, region: getRegionFromCountryCode(countryCode), visaType: category.name || "Visa", duration: "", processingTime: category.processing_time || "", baseNPRPrice: 0, entryType: "", inclusions: category.short_description ? [category.short_description] : [], aboutText: category.description || category.short_description || "", requirementDocuments: [], termsAndConditions: [], costOptions: [], countryId: category.country_id, visaCategoryId: category.id, image: category.visa_image || null };
        });
        setVisaPlans(mappedPlans);
      } catch (error) {
        console.error("Failed to fetch visa categories:", error);
        setVisaPlans([]);
      }
    };
    fetchVisaCategories();
  }, []);
  useEffect(() => {
    if (isExternalFilterActive) setActiveTab("all");
    setVisibleCount(INITIAL_COUNT);
  }, [filter, activeTab, searchQuery, isExternalFilterActive]);
  const filteredPlans = visaPlans.filter((plan: VisaDetailPlan) => {
    if (filter) {
      if (!matchesCountry(plan, filter.country)) return false;
      if (!matchesVisaType(plan, filter.visaType)) return false;
      if (!matchesEntryType(plan, filter.entryType)) return false;
    }
    if (activeTab !== "all" && plan.region !== activeTab) return false;
    if (searchQuery && !plan.country.toLowerCase().includes(searchQuery.toLowerCase()) && !plan.visaType.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const displayedPlans = filteredPlans.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPlans.length;
  const handleSeeMore = () => setVisibleCount((prev: number) => prev + LOAD_MORE_STEP);
  const handleClearAllFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    onClearFilter?.();
  };
  const handleSelectPlan = (plan: VisaDetailPlan) => navigate(`/visa-details/${plan.id}`);
  const handleWhatsAppInquiry = (plan: VisaDetailPlan) => {
    const formattedPrice = plan.baseNPRPrice > 0 ? displayPrice(plan.baseNPRPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR) : "—";
    const msg = encodeURIComponent(`Hello Trip Himalaya (Visa & Documentation Team)! I would like to inquire about visa assistance for "${plan.country}" (${plan.visaType}, fee starting around ${formattedPrice}). Please guide me with requirements and next steps.`);
    window.open(`https://api.whatsapp.com/send?phone=9779851420882&text=${msg}`, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="space-y-8">
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3 px-4 sm:px-6">
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 w-full">
          <span className="text-xs sm:text-sm font-black text-[#2D1347] uppercase tracking-wider mr-1 whitespace-nowrap">
            All Destination :
          </span>
          {[
            { id: "all", label: "All" },
            { id: "asia", label: "Asia" },
            { id: "middle-east", label: "Gulf & UAE" },
            { id: "europe", label: "Schengen" },
            { id: "west", label: "USA & UK" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? "bg-[#2D1347] text-white shadow-xs"
                : "text-gray-600 hover:text-[#2D1347] hover:bg-gray-100/80"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-gray-200 rounded-full text-xs sm:text-sm font-semibold text-[#2D1347] placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:border-[#E91E63] transition-colors"
          />
        </div>
      </div>
      <div className="space-y-6">
        <div className="text-center pt-2 pb-1">
          <div className="inline-flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2D1347] tracking-tight">
              Popular Visa Destination
            </h3>
            <div className="h-1.5 w-32 sm:w-40 bg-[#E91E63] rounded-full mt-2.5 shadow-xs" />
          </div>
        </div>
        {isExternalFilterActive && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-purple-50/90 border border-purple-200/80 rounded-2xl px-4 sm:px-5 py-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#2D1347] font-bold">
              <span className="text-gray-500 font-semibold">Active Filter:</span>
              {filter?.country && filter.country.trim() !== "" && filter.country !== "all" && (
                <span className="px-2.5 py-1 bg-white border border-pink-200 rounded-lg text-pink-600 font-bold capitalize shadow-2xs">
                  {filter.country}
                </span>
              )}
              {filter?.visaType && filter.visaType !== "all" && (
                <span className="px-2.5 py-1 bg-white border border-purple-200 rounded-lg text-[#2D1347] font-bold capitalize shadow-2xs">
                  {filter.visaType} Visa
                </span>
              )}
              {filter?.entryType && filter.entryType !== "all" && (
                <span className="px-2.5 py-1 bg-white border border-emerald-200 rounded-lg text-emerald-700 font-bold capitalize shadow-2xs">
                  {filter.entryType} Entry
                </span>
              )}
              <span className="text-xs text-gray-500 font-medium ml-1">
                ({filteredPlans.length} {filteredPlans.length === 1 ? "destination" : "destinations"} found)
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-pink-50 text-pink-600 hover:text-pink-700 font-bold text-xs rounded-xl border border-pink-200 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <X size={14} />
              <span>Clear Filter</span>
            </button>
          </div>
        )}
        {filteredPlans.length === 0 ? (
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
              const formattedPrice = plan.baseNPRPrice > 0 ? displayPrice(plan.baseNPRPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR) : "—";
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
                        <span>{plan.duration || "—"}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 text-gray-700 text-xs font-semibold border border-gray-200/70">
                        <Clock size={13} className="text-gray-400" />
                        <span>{plan.processingTime || "—"}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <span>{plan.entryType || "—"}</span>
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
                          handleWhatsAppInquiry(plan);
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
