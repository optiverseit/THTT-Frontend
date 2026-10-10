import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Calendar, CheckCircle2, AlertCircle, ShieldCheck, MessageCircle, Printer, Zap, Users, RefreshCw, Share2, Check, Link2 } from "lucide-react";
import { useGlobalCurrency, formatNPR, formatUSD, formatINR, displayPrice } from "../../context/CurrencyContext";
import { useAuth } from "../../context/AuthContext";
import { isSessionValid, clearAuthSession } from "../../utils/sessionManager";
import { InsuranceApplicationModal, InsuranceRequirementField } from "./InsuranceApplicationModal";
import { getInsurancePlanById, getInsuranceDynamicFieldsByPlan, getInsurancePricingTiersByPlan } from "../../api/BackendApi";
import { shareToPlatform, copyToClipboard, getCurrentUrl, getCrawlerSafeUrl } from "../../utils/shareUtils";
import Logo from "../../assets/images/Logo.png";
import OtherServicesComponent from "../reusable/OtherServicesComponent";
import { services } from "../../assets/data/mockData";
import { formatDescription } from "../../utils/formatDescription";
interface InsuranceCostOption {
  id?: number;
  name: string;
  days: string;
  nprPrice: number;
  usdPrice: number;
  coverageLimit: string;
  description: string;
}
interface InsurancePlanView {
  id: string;
  backendId: number;
  name: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  maxAltitude: string;
  priceUSD: number;
  baseNPRPrice: number;
  durationCovered: string;
  coverageLimit: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  heroImage: string;
  aboutText: string;
  requirementDocuments: string[];
  documentRequirements: {
    id: number;
    document_type: string;
    title: string;
    description?: string | null;
    is_required: boolean;
  }[];
  dynamicRequirements: InsuranceRequirementField[];
  policyConditions: string[];
  termsConditions: string[];
  termsAndConditions: string[];
  costOptions: InsuranceCostOption[];
  emergencyHelpline?: string;
  claimSettlement?: string;
}
const toArray = (value: any) => Array.isArray(value) ? value : [];
const sortByDisplayOrder = (items: any[]) => [...items].sort((a, b) => Number(a?.display_order ?? 0) - Number(b?.display_order ?? 0));
const normalizeDynamicFieldType = (value: any): InsuranceRequirementField["type"] => {
  const type = String(value || "TEXT").toUpperCase();
  if (type === "NUMBER") return "number";
  if (type === "DATE") return "date";
  if (type === "TEXTAREA") return "textarea";
  if (type === "SELECT") return "select";
  if (type === "CHECKBOX") return "checkbox";
  if (type === "RADIO") return "radio";
  return "text";
};
const normalizeDynamicOptions = (value: any): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
};
const getBadgeColor = (tier?: string | null) => {
  const t = (tier || "").trim().toLowerCase();
  if (t.includes("gold")) return "bg-amber-100 text-amber-900 border border-amber-300";
  if (t.includes("silver")) return "bg-slate-100 text-slate-800 border border-slate-300";
  if (t.includes("platinum")) return "bg-indigo-100 text-indigo-900 border border-indigo-300";
  if (t.includes("diamond")) return "bg-cyan-100 text-cyan-900 border border-cyan-300";
  if (t.includes("bronze")) return "bg-orange-100 text-orange-900 border border-orange-300";
  if (t.includes("premium")) return "bg-rose-100 text-[#E11D48] border border-rose-300";
  return "bg-pink-100 text-[#E11D48] border border-pink-300";
};

export const InsurancePlanDetailView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { insuranceId } = useParams<{ insuranceId: string }>();
  const { selectedCurrency, setSelectedCurrency, nprPerOneDollar, nprPerOneINR, isRateLoading, rateLoadFailed } = useGlobalCurrency();
  const [plan, setPlan] = useState<InsurancePlanView | null>(null);
  const [selectedCostOption, setSelectedCostOption] = useState<InsuranceCostOption | null>(null);
  const [numberOfTravelers, setNumberOfTravelers] = useState<number>(1);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const shareRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchPlan = async () => {
      if (!insuranceId) {
        setLoadError("Insurance plan not found.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setLoadError("");
        const [response, dynamicFieldsResponse, pricingTiersResponse] = await Promise.all([
          getInsurancePlanById(insuranceId),
          getInsuranceDynamicFieldsByPlan(insuranceId),
          getInsurancePricingTiersByPlan(insuranceId).catch(() => null),
        ]);
        const raw = response?.data?.data;
        if (!response?.data?.status || !raw) throw new Error(response?.data?.message || "Insurance plan not found");
        // Pricing tiers: prefer dedicated endpoint (not always nested in plan detail)
        const rawPricingTiers =
          Array.isArray(pricingTiersResponse?.data?.data)
            ? pricingTiersResponse.data.data
            : toArray(raw.pricing_tiers ?? raw.pricingTiers);
        const pricingTiers = sortByDisplayOrder(rawPricingTiers.filter((item: any) => !item?.status || item.status === "ACTIVE"));
        const information = sortByDisplayOrder(toArray(raw.information).filter((item: any) => !item?.status || item.status === "ACTIVE"));
        const documentRequirements = sortByDisplayOrder(toArray(raw.document_requirements ?? raw.documentRequirements).filter((item: any) => !item?.status || item.status === "ACTIVE"));
        const dynamicFieldsData = dynamicFieldsResponse?.data?.data;
        const dynamicFieldsSource = Array.isArray(dynamicFieldsData) ? dynamicFieldsData : toArray(dynamicFieldsData?.data);
        const dynamicFields = sortByDisplayOrder(dynamicFieldsSource.filter((item: any) => !item?.status || item.status === "ACTIVE"));
        const dynamicRequirements: InsuranceRequirementField[] = dynamicFields
          .filter((field: any) => field?.field_name)
          .map((field: any) => ({
            id: String(field.field_name),
            name: field.field_label || field.field_name,
            placeholder: field.placeholder || "",
            required: field.is_required === true || field.is_required === 1,
            type: normalizeDynamicFieldType(field.field_type),
            options: normalizeDynamicOptions(field.options),
          }));
        const coverage = information.filter((item: any) => item.type === "COVERAGE").map((item: any) => item.content).filter(Boolean);
        const exclusions = information.filter((item: any) => item.type === "EXCLUSION").map((item: any) => item.content).filter(Boolean);
        const policy = information.filter((item: any) => item.type === "POLICY").map((item: any) => item.content).filter(Boolean);
        const terms = information.filter((item: any) => item.type === "TERMS_CONDITION").map((item: any) => item.content).filter(Boolean);
        const rate = Number(nprPerOneDollar) > 0 ? Number(nprPerOneDollar) : 151.09;
        const costOptions: InsuranceCostOption[] = pricingTiers.map((tier: any) => ({
          id: Number(tier.id),
          name: tier.title || "Insurance Plan",
          days: `${Number(tier.duration_days || 0)} Days`,
          nprPrice: Number(tier.price_npr || 0),
          usdPrice: Number(tier.price_npr || 0) / rate,
          coverageLimit: "Policy Coverage",
          description: tier.title || raw.name || "Insurance Plan",
        }));
        const firstOption = costOptions[0];
        const mappedPlan: InsurancePlanView = {
          id: String(raw.id),
          backendId: Number(raw.id),
          name: raw.name || "Insurance Plan",
          subtitle: raw.short_description || "",
          badge: raw.tier?.trim() || "Insurance",
          badgeColor: getBadgeColor(raw.tier),
          maxAltitude: "See Policy Details",
          priceUSD: firstOption?.usdPrice || 0,
          baseNPRPrice: firstOption?.nprPrice || 0,
          durationCovered: firstOption?.days
            || (raw.processing_time ? `${raw.processing_time} Days` : "See Pricing"),
          coverageLimit: "See Policy Details",
          highlights: coverage.slice(0, 4),
          inclusions: coverage,
          exclusions,
          heroImage: raw.insurance_image || "",
          aboutText: raw.description || raw.short_description || "",
          requirementDocuments: documentRequirements.map((doc: any) => doc.title || doc.document_type).filter(Boolean),
          documentRequirements: documentRequirements.map((doc: any) => ({
            id: Number(doc.id),
            document_type: doc.document_type || "",
            title: doc.title || doc.document_type || "Document",
            description: doc.description || null,
            is_required: doc.is_required === true || doc.is_required === 1,
          })),
          dynamicRequirements,
          policyConditions: policy,
          termsConditions: terms,
          termsAndConditions: [...policy, ...terms],
          costOptions,
        };
        setPlan(mappedPlan);

        // Check if returning from login with previously saved state
        const savedState = (location.state as any) || (() => {
          try {
            const raw = sessionStorage.getItem("post_login_state");
            return raw ? JSON.parse(raw) : null;
          } catch {
            return null;
          }
        })();

        const preferredOption =
          (savedState?.selectedOptionId &&
            costOptions.find((opt) => opt.id === Number(savedState.selectedOptionId))) ||
          firstOption ||
          null;

        const preferredTravelers =
          Number(savedState?.numberOfTravelers) > 0
            ? Number(savedState.numberOfTravelers)
            : 1;

        setSelectedCostOption(preferredOption);
        setNumberOfTravelers(preferredTravelers);

        if (savedState?.openApplyModal && isSessionValid()) {
          setIsAppModalOpen(true);
          try {
            sessionStorage.removeItem("post_login_state");
            sessionStorage.removeItem("post_login_redirect");
          } catch {}
        }
      } catch (error: any) {
        console.error("Failed to fetch insurance plan:", error);
        setLoadError(error?.response?.data?.message || error?.message || "Failed to load insurance plan.");
        setPlan(null);
        setSelectedCostOption(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [insuranceId]);

  // Handle returning from login if plan was already cached or when location state updates
  useEffect(() => {
    if (!plan || !isSessionValid()) return;

    const savedState = (location.state as any) || (() => {
      try {
        const raw = sessionStorage.getItem("post_login_state");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    if (savedState?.openApplyModal) {
      if (savedState.selectedOptionId) {
        const matched = plan.costOptions.find((opt) => opt.id === Number(savedState.selectedOptionId));
        if (matched) setSelectedCostOption(matched);
      }
      if (Number(savedState.numberOfTravelers) > 0) {
        setNumberOfTravelers(Number(savedState.numberOfTravelers));
      }
      setIsAppModalOpen(true);
      try {
        sessionStorage.removeItem("post_login_state");
        sessionStorage.removeItem("post_login_redirect");
      } catch {}
    }
  }, [plan, location.state]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setIsShareOpen(false);
    };
    if (isShareOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isShareOpen]);
  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-[#E91E63] rounded-full animate-spin" /></div>;
  if (loadError || !plan) return <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-4"><p className="text-sm font-bold text-gray-600">{loadError || "Insurance plan not found."}</p><button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 rounded-xl bg-[#2D1347] text-white text-xs font-bold cursor-pointer">Go Back</button></div>;
  const costOptionsList = plan.costOptions;
  const getRowDisplayPrice = (nprPrice: number): string => {
    if (selectedCurrency === "nepali") return formatNPR(nprPrice);
    if (selectedCurrency === "inr") return formatINR(nprPrice / nprPerOneINR);
    return formatUSD(nprPrice / nprPerOneDollar);
  };
  const unitPrice = selectedCostOption?.nprPrice || 0;
  const estimatedTotalPrice = unitPrice * numberOfTravelers;
  const getFormattedEstimatedTotal = (): string => {
    if (selectedCurrency === "nepali") return formatNPR(estimatedTotalPrice);
    if (selectedCurrency === "inr") return formatINR(estimatedTotalPrice / nprPerOneINR);
    return formatUSD(estimatedTotalPrice / nprPerOneDollar);
  };
  const handlePrint = () => {
    document.body.classList.remove("printing-modal-slip");
    const originalTitle = document.title;
    document.title = `${plan.name} - Insurance Quotation - Trip Himalaya`;
    window.print();
    window.addEventListener("afterprint", () => { document.title = originalTitle; }, { once: true });
    setTimeout(() => { document.title = originalTitle; }, 2000);
  };
  const handleWhatsAppInquiry = () => {
    const currencyText = selectedCurrency === "nepali" ? "NPR" : selectedCurrency === "inr" ? "INR" : "USD";
    const totalFormatted = getFormattedEstimatedTotal();
    const optionText = selectedCostOption ? ` Option: ${selectedCostOption.name} (${selectedCostOption.days}).` : "";
    const msg = encodeURIComponent(`Hello Trip Himalaya (Insurance Team)! I am inquiring about travel insurance for "${plan.name}".${optionText} For ${numberOfTravelers} traveler(s). Estimated Premium: ${selectedCostOption ? totalFormatted : "Not available"} (${currencyText}). Please guide me through the next steps.`);
    window.open(`https\://api.whatsapp.com/send?phone=9779851403760&text=${msg}`, "_blank", "noopener,noreferrer");
  };
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareData = { title: `${plan.name} | Trip Himalaya Travel Insurance`, text: `Check out ${plan.name} starting from ${selectedCostOption ? getFormattedEstimatedTotal() : "Not Available"} on Trip Himalaya!`, url: currentUrl, image: plan.heroImage };
  const shareButtons = [
    { name: "Facebook", action: () => shareToPlatform("facebook", shareData), bg: "#1877F2", svg: <svg viewBox="0 0 24 24" fill="white" width="15" height="15"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg> },
    { name: "WhatsApp", action: () => shareToPlatform("whatsapp", shareData), bg: "#25D366", svg: <svg viewBox="0 0 24 24" fill="white" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M11.5 2a9.5 9.5 0 100 19 9.5 9.5 0 000-19zm0 17.5a8 8 0 110-16 8 8 0 010 16z" /></svg> },
    { name: "Twitter/X", action: () => shareToPlatform("twitter", shareData), bg: "#000000", svg: <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.626L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg> },
    { name: "Telegram", action: () => shareToPlatform("telegram", shareData), bg: "#229ED9", svg: <svg viewBox="0 0 24 24" fill="white" width="15" height="15"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg> },
  ];
  const handleCopyLink = async () => {
    const success = await copyToClipboard(getCrawlerSafeUrl(getCurrentUrl()));
    if (success) { setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }
  };
  const printNPRTotal = formatNPR(estimatedTotalPrice);
  const printUSDTotal = formatUSD(estimatedTotalPrice / nprPerOneDollar);
  const printINRTotal = formatINR(estimatedTotalPrice / nprPerOneINR);
  const heroBg = plan.heroImage;

  const handleApplyClick = () => {
    if (!selectedCostOption) return;

    // Validate and authenticate that user is logged in
    if (!isLoggedIn || !isSessionValid()) {
      clearAuthSession();
      const returnState = {
        from: location.pathname + location.search,
        openApplyModal: true,
        selectedOptionId: selectedCostOption.id,
        numberOfTravelers: numberOfTravelers,
      };
      try {
        sessionStorage.setItem("post_login_redirect", location.pathname + location.search);
        sessionStorage.setItem("post_login_state", JSON.stringify(returnState));
      } catch (err) {
        console.error("Failed to save post-login state to sessionStorage:", err);
      }
      navigate("/login", {
        state: returnState,
      });
      return;
    }

    setIsAppModalOpen(true);
  };

  const renderPricingSidebar = () => (
    <div className="space-y-4">
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="py-2.5 px-3.5 bg-gradient-to-r from-[#200B3B] to-[#3B145C] text-white flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-black">Coverage &amp; Pricing</h2>
            <p className="text-[9px] text-gray-300 font-medium">Select your duration plan</p>
          </div>
          <div className="flex bg-white/10 backdrop-blur-md p-0.5 rounded-lg text-[9px] font-black tracking-wider gap-0.5">
            <button
              type="button"
              onClick={() => setSelectedCurrency("nepali")}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${selectedCurrency === "nepali" ? "bg-white text-[#200B3B] shadow-xs" : "text-white/80 hover:text-white"}`}
            >NEPALI</button>
            <button
              type="button"
              onClick={() => setSelectedCurrency("foreigner")}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${selectedCurrency === "foreigner" ? "bg-[#E91E63] text-white shadow-xs" : "text-white/80 hover:text-white"}`}
            >USD ($)</button>
            <button
              type="button"
              onClick={() => setSelectedCurrency("inr")}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${selectedCurrency === "inr" ? "bg-[#FF5722] text-white shadow-xs" : "text-white/80 hover:text-white"}`}
            >INR (₹)</button>
          </div>
        </div>
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
            {!isRateLoading && <span className="text-[8px] opacity-60">Live Exchange Rate</span>}
          </div>
        )}
        <div className="p-3 sm:p-3.5 space-y-2.5">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="pb-2">Duration Plan</th>
                  <th className="pb-2">Days</th>
                  <th className="pb-2 text-right">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {costOptionsList.length === 0 ? (
                  <tr><td colSpan={3} className="py-5 text-center text-xs font-semibold text-gray-400">No pricing tier available</td></tr>
                ) : costOptionsList.map((opt, rowIndex) => {
                  const isSelected = selectedCostOption?.name === opt.name;
                  return (
                    <tr
                      key={rowIndex}
                      onClick={() => setSelectedCostOption(opt)}
                      className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${isSelected ? "bg-purple-50/70 font-bold" : ""}`}
                    >
                      <td className="py-2.5 font-bold text-[#200B3B] text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full border ${isSelected ? "bg-[#E91E63] border-[#E91E63]" : "border-gray-300"}`} />
                          <span>{opt.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-gray-500 text-[11px]">{opt.days}</td>
                      <td className="py-2.5 text-right font-black text-[#E91E63] text-sm">
                        {getRowDisplayPrice(opt.nprPrice)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-[#FBFBFE] py-1.5 px-2.5 rounded-lg border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users size={13} className="text-[#E91E63]" />
              <div>
                <span className="block text-[11px] font-bold text-[#200B3B]">Number of Travelers</span>
                <span className="text-[9px] text-gray-400">Select group size</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setNumberOfTravelers((prev) => Math.max(1, prev - 1))}
                disabled={numberOfTravelers <= 1}
                className="w-5 h-5 rounded bg-white border border-gray-200 text-[#200B3B] font-black text-xs flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
              >−</button>
              <span className="font-black text-xs text-[#200B3B] w-4 text-center">{numberOfTravelers}</span>
              <button
                type="button"
                onClick={() => setNumberOfTravelers((prev) => prev + 1)}
                className="w-5 h-5 rounded bg-white border border-gray-200 text-[#200B3B] font-black text-xs flex items-center justify-center hover:bg-gray-100 cursor-pointer"
              >+</button>
            </div>
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                Estimated Premium ({numberOfTravelers} {numberOfTravelers === 1 ? "traveler" : "travelers"})
              </span>
              <span className="text-lg font-black text-[#200B3B]">
                {selectedCostOption ? getFormattedEstimatedTotal() : "Not Available"}
              </span>
            </div>
            <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap size={10} />
              Best Rate
            </span>
          </div>
          <div className="space-y-1.5 pt-0.5">
            <button
              type="button"
              onClick={handleApplyClick}
              disabled={!selectedCostOption}
              className={`w-full py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm ${selectedCostOption
                  ? "cursor-pointer bg-[#E91E63] hover:bg-pink-600 active:scale-[0.98] text-white"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
                }`}
            >
              <span>{selectedCostOption ? "Apply for Insurance Now" : "Pricing Not Available"}</span>
            </button>
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="w-full py-2 rounded-lg text-[11px] font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Inquiry</span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Verified Insurance</span>
            <p className="text-xs font-black text-[#200B3B]">Nepal-Licensed Insurance Brokers</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div
        className="hidden print:flex flex-col justify-between font-sans relative print-page-container insurance-plan-quotation-print"
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
          fontSize: "9.5px",
          lineHeight: "1.4",
          color: "#1e293b",
          boxSizing: "border-box",
          width: "100%",
          position: "relative",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <style>{`
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
          @media print {
            html, body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            body.printing-modal-slip .insurance-plan-quotation-print {
              display: none !important;
            }
            body:not(.printing-modal-slip) .insurance-modal-slip-print {
              display: none !important;
            }
            .insurance-plan-quotation-print {
              display: flex !important;
              flex-direction: column !important;
              width: 100% !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              background: #faf8fc !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-header-main {
              background: #2D1347 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-header-dark {
              background: #1e293b !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-header-slate {
              background: #334155 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-header-red {
              background: #be123c !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-footer-bar {
              background: #2D1347 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-highlight-row {
              background: #fdf4ff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-emergency-bg {
              background: #fff1f2 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}</style>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              transform: "rotate(-28deg)",
              whiteSpace: "nowrap",
              fontSize: "28px",
              fontWeight: 900,
              color: "rgba(45,19,71,0.08)",
              letterSpacing: "3px",
              fontFamily: "Arial Black, Arial, sans-serif",
              textTransform: "uppercase",
            }}
          >
            Trip Himalaya Tours and Travels
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <div className="print-header-main" style={{ background: "linear-gradient(135deg, #2D1347 0%, #3B145C 50%, #4a1c7a 100%)", borderRadius: "8px 8px 0 0", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ background: "#ffffff", borderRadius: "6px", padding: "3px 6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={Logo} alt="Trip Himalaya Logo" style={{ height: "48px", width: "auto", objectFit: "contain", display: "block" }} />
                </div>
                <div>
                  <h1 style={{ fontSize: "15px", fontWeight: 900, color: "#ffffff", letterSpacing: "0.02em", margin: 0, textTransform: "uppercase" }}>
                    Trip Himalaya Tours &amp; Travel Pvt. Ltd.
                  </h1>
                  <div style={{ fontSize: "8px", color: "#f3e8ff", margin: "2px 0 0", lineHeight: "1.35" }}>
                    <div style={{ color: "#e9d5ff", fontSize: "8px", fontWeight: 600, marginBottom: "3px" }}>
                      High-Altitude Alpine Rescue &amp; Travel Insurance Desk • Govt. Reg. No. 2490
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "2px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        Airport, Shambhu Marg, Road No. 04, Kathmandu
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.44 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
                        </svg>
                        +977 9851403760
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        dev.triphimalayatt@gmail.com
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        www.triphimalaya.com.np
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "8px", background: "rgba(233, 30, 99, 0.3)", color: "#fbcfe8", padding: "2px 8px", borderRadius: "4px", fontWeight: 800, border: "1px solid rgba(233, 30, 99, 0.4)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Official Insurance Quotation
                </div>
                <div style={{ fontSize: "9px", color: "#e9d5ff", marginTop: "3px" }}>
                  Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <div style={{ fontSize: "8px", color: "#cbd5e1", fontFamily: "monospace" }}>
                  REF: THTT-INS-{String(plan.id).replace("plan-", "").toUpperCase()}-{new Date().getFullYear()}
                </div>
              </div>
            </div>
            <div style={{ height: "3.5px", background: "linear-gradient(90deg, #E91E63 0%, #db2777 30%, #9333ea 70%, #2D1347 100%)" }} />
          </div>
          <div style={{ border: "1px solid #cbd5e1", borderRadius: "7px", overflow: "hidden", background: "#ffffff" }}>
            <div className="print-header-main" style={{ background: "#2D1347", color: "#ffffff", padding: "4.5px 10px", fontSize: "9.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>1. Applied Policy &amp; Coverage Details</span>
              <span style={{ fontSize: "8.5px", fontWeight: 700, color: "#f472b6" }}>
                Status: Applied / Quotation Confirmed
              </span>
            </div>
            <div className="print-highlight-row" style={{ background: "#fdf4ff", padding: "10px 14px", borderBottom: "1px solid #f3e8ff", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h2 style={{ fontSize: "14px", fontWeight: 900, color: "#2D1347", margin: 0 }}>
                    {plan.name}
                  </h2>
                  <span style={{ fontSize: "8.5px", fontWeight: 800, background: "#e9d5ff", color: "#581c87", padding: "2px 7px", borderRadius: "4px" }}>
                    {plan.badge}
                  </span>
                </div>
                <div style={{ fontSize: "9px", color: "#6b21a8", marginTop: "3px", fontWeight: 600, lineHeight: 1.35 }}>
                  Applied Option: <strong style={{ color: "#2D1347" }}>{selectedCostOption ? `${selectedCostOption.name} (${selectedCostOption.days})` : "Not Available"}</strong> • Max Altitude: <strong style={{ color: "#be123c" }}>{plan.maxAltitude}</strong> • Medical Limit: <strong style={{ color: "#047857" }}>{selectedCostOption?.coverageLimit || "Not Available"}</strong>
                </div>
              </div>
              <div style={{ textAlign: "right", background: "#ffffff", border: "1.5px solid #c084fc", borderRadius: "6px", padding: "5px 14px", flexShrink: 0 }}>
                <div style={{ fontSize: "8px", fontWeight: 800, color: "#7e22ce", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Total Estimated Premium ({numberOfTravelers} {numberOfTravelers === 1 ? "Traveler" : "Travelers"})
                </div>
                <div style={{ fontSize: "16px", fontWeight: 900, color: "#2D1347", lineHeight: 1.15, margin: "2px 0" }}>
                  {selectedCostOption ? printNPRTotal : "Not Available"}
                </div>
                <div style={{ fontSize: "8.5px", color: "#6b7280" }}>
                  {selectedCostOption ? <>≈ {printUSDTotal} &nbsp;|&nbsp; ≈ {printINRTotal}</> : ""}
                </div>
              </div>
            </div>
            <table style={{ width: "100%", fontSize: "9px", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "5px 10px", textAlign: "left", fontWeight: 800, color: "#475569" }}>Plan Duration Tier</th>
                  <th style={{ padding: "5px 10px", textAlign: "center", fontWeight: 800, color: "#475569" }}>Valid Days</th>
                  <th style={{ padding: "5px 10px", textAlign: "center", fontWeight: 800, color: "#475569" }}>Medical &amp; Heli Evacuation</th>
                  <th style={{ padding: "5px 10px", textAlign: "right", fontWeight: 800, color: "#475569" }}>Per Person Rate</th>
                  <th style={{ padding: "5px 10px", textAlign: "right", fontWeight: 800, color: "#be123c" }}>Total Amount ({numberOfTravelers}×)</th>
                </tr>
              </thead>
              <tbody>
                {costOptionsList.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: "10px", textAlign: "center", color: "#64748b" }}>No pricing tier available</td></tr>
                ) : costOptionsList.map((opt, idx) => {
                  const isSelected = opt.name === selectedCostOption?.name;
                  return (
                    <tr
                      key={idx}
                      style={{
                        background: isSelected ? "#fdf4ff" : idx % 2 === 0 ? "#ffffff" : "#fafafa",
                        borderBottom: "1px solid #f1f5f9",
                        fontWeight: isSelected ? 800 : 400,
                      }}
                    >
                      <td style={{ padding: "4.5px 10px", color: isSelected ? "#2D1347" : "#334155" }}>
                        {opt.name}
                        {isSelected && (
                          <span style={{ marginLeft: "7px", fontSize: "7.5px", fontWeight: 900, background: "#2D1347", color: "#ffffff", padding: "1.5px 5px", borderRadius: "3px" }}>
                            ✓ APPLIED
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "4.5px 10px", textAlign: "center", color: "#64748b" }}>{opt.days}</td>
                      <td style={{ padding: "4.5px 10px", textAlign: "center", color: "#047857", fontWeight: isSelected ? 800 : 600 }}>{opt.coverageLimit}</td>
                      <td style={{ padding: "4.5px 10px", textAlign: "right", color: "#334155" }}>{formatNPR(opt.nprPrice)}</td>
                      <td style={{ padding: "4.5px 10px", textAlign: "right", color: isSelected ? "#be123c" : "#334155", fontWeight: isSelected ? 900 : 600 }}>
                        {formatNPR(opt.nprPrice * numberOfTravelers)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ border: "1px solid #cbd5e1", borderRadius: "7px", overflow: "hidden", background: "#ffffff" }}>
            <div className="print-header-dark" style={{ background: "#1e293b", color: "#ffffff", padding: "4.5px 10px", fontSize: "9.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              2. Required Documents Checklist
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px 12px", padding: "8px 12px", fontSize: "8.5px", color: "#334155", lineHeight: 1.4, background: "#f8fafc" }}>
              <div>☑ Passport / NID / Citizenship Copy (Color)</div>
              <div>☑ Recent Passport-size MRP Photo</div>
              <div>☑ Trekking Permit / Route Itinerary (Optional)</div>
              <div>☑ Trekking Agency / Guide Name &amp; Contact</div>
              <div>☑ Next of Kin Emergency Contact Details</div>
              <div>☑ Alpine Fitness &amp; Altitude Self-Declaration</div>
            </div>
          </div>
          <div style={{ border: "1px solid #cbd5e1", borderRadius: "7px", overflow: "hidden", background: "#ffffff" }}>
            <div className="print-header-slate" style={{ background: "#334155", color: "#ffffff", padding: "4.5px 10px", fontSize: "9.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              3. Terms &amp; Policy Conditions
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 14px", padding: "8px 12px", fontSize: "8.5px", color: "#334155", lineHeight: 1.45, background: "#ffffff" }}>
              <div>• <strong>Altitude Coverage:</strong> Fully covers high-altitude trekking, alpine expeditions, and non-technical climbs up to {plan.maxAltitude}.</div>
              <div>• <strong>Cashless Helicopter Rescue:</strong> Authorized immediately upon verification from certified trek leader, guide, or medical officer.</div>
              <div>• <strong>Hospital Network:</strong> Direct cashless admission supported at CIWEC Hospital (Kathmandu &amp; Pokhara) and Swacon International Hospital.</div>
              <div>• <strong>Alpine Sickness Scope:</strong> Full protection for Acute Mountain Sickness (AMS), HAPE, HACE, frostbite, and accidental injuries.</div>
              <div>• <strong>24/7 Operations Desk:</strong> All medical dispatch, helicopter authorization, and guarantee letters monitored 24/7 by our Kathmandu desk.</div>
              <div>• <strong>Policy Validity:</strong> Certification issued upon document verification and premium settlement prior to trek departure date.</div>
            </div>
          </div>
          <div style={{ border: "1px solid #cbd5e1", borderRadius: "7px", overflow: "hidden", background: "#ffffff" }}>
            <div className="print-header-red" style={{ background: "linear-gradient(90deg, #be123c, #9d174d)", color: "#ffffff", padding: "4.5px 10px", fontSize: "9.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>4. Emergency Assistance &amp; 24/7 SOS Contacts</span>
              <span style={{ fontSize: "8px", background: "rgba(255,255,255,0.2)", padding: "1.5px 6px", borderRadius: "3px" }}>
                Emergency Desk Active 24/7
              </span>
            </div>
            <div className="print-emergency-bg" style={{ display: "grid", gridTemplateColumns: "1.2fr 1.1fr 1.1fr 1fr", gap: "8px", padding: "8px 12px", fontSize: "8.5px", background: "#fff1f2", alignItems: "center" }}>
              <div style={{ borderRight: "1px solid #fecdd3", paddingRight: "6px" }}>
                <span style={{ color: "#9f1239", fontWeight: 800, display: "block", fontSize: "8px", textTransform: "uppercase" }}>24/7 Alpine Rescue Hotline</span>
                <strong style={{ color: "#881337", fontSize: "9.5px" }}>📞 +977 9851403760</strong>
                <span style={{ color: "#4c0519", fontSize: "7.5px", display: "block" }}>WhatsApp &amp; Direct Voice Call</span>
              </div>
              <div style={{ borderRight: "1px solid #fecdd3", paddingRight: "6px" }}>
                <span style={{ color: "#9f1239", fontWeight: 800, display: "block", fontSize: "8px", textTransform: "uppercase" }}>Kathmandu Flight Rescue Desk</span>
                <span style={{ color: "#881337", fontWeight: 700 }}>01-4424111 / 01-4435232</span>
                <span style={{ color: "#4c0519", fontSize: "7.5px", display: "block" }}>Domestic Airport Rescue Wing</span>
              </div>
              <div style={{ borderRight: "1px solid #fecdd3", paddingRight: "6px" }}>
                <span style={{ color: "#9f1239", fontWeight: 800, display: "block", fontSize: "8px", textTransform: "uppercase" }}>Hospital Direct Billing</span>
                <span style={{ color: "#881337", fontWeight: 700 }}>CIWEC: 01-4424111</span>
                <span style={{ color: "#4c0519", fontSize: "7.5px", display: "block" }}>Swacon Hospital: 01-4112211</span>
              </div>
              <div>
                <span style={{ color: "#9f1239", fontWeight: 800, display: "block", fontSize: "8px", textTransform: "uppercase" }}>Emergency Operations Email</span>
                <span style={{ color: "#881337", fontWeight: 700, fontSize: "8px" }}>dev.triphimalayatt@gmail.com</span>
                <span style={{ color: "#4c0519", fontSize: "7.5px", display: "block" }}>Kathmandu, Nepal</span>
              </div>
            </div>
          </div>
          <div className="print-footer-bar" style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", padding: "7px 12px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "8px", color: "#ffffff" }}>
            <div><strong>Trip Himalaya Tours &amp; Travel Pvt. Ltd.</strong> • Nepal Govt. Reg. No. 2490 • Shambhu Marg, Kathmandu</div>
            <div style={{ color: "#fce7f3" }}>24/7 SOS: +977 9851403760 • Cashless Heli Guarantee</div>
            <div style={{ fontWeight: 800, color: "#f472b6" }}>Computer-Generated Quotation • Valid 30 Days • Page 1 of 1</div>
          </div>
        </div>
      </div>
      <div
        className="print:hidden relative rounded-3xl overflow-hidden shadow-lg min-h-[220px] sm:min-h-[260px] flex flex-col justify-end"
        style={{ backgroundImage: `url('${heroBg}')`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0520]/92 via-[#1a0836]/65 to-transparent print:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#2D1347]/40 print:hidden" />
        <div className="relative z-10 pt-14 px-4 pb-4 sm:pt-16 sm:px-6 sm:pb-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                    {plan.name}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm font-medium text-white/80 mt-1 max-w-2xl leading-relaxed">
                  {plan.subtitle}
                </p>
              </div>
            </div>
            <div className="print:hidden flex flex-row md:flex-col items-center gap-2 w-full md:w-40 flex-shrink-0 mt-2 md:mt-12">
              <button
                onClick={handleWhatsAppInquiry}
                className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-md"
              >
                <MessageCircle size={13} />
                <span>Ask on WhatsApp</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white/75 hover:text-white rounded-md text-[10px] font-medium transition-all cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer size={11} />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${plan.badgeColor}`}>
                {plan.badge}
              </span>
              <span>Tier</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
              <span className="text-pink-200 text-xs font-normal">Starts at:</span>
              <span className="font-extrabold text-white">
                {selectedCostOption ? displayPrice(plan.baseNPRPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR) : "Not Available"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
              <Calendar size={14} className="text-blue-300" />
              <span>{plan.durationCovered}</span>
            </div>
          </div>
        </div>
        <div ref={shareRef} className="print:hidden absolute top-3 right-4 sm:top-4 sm:right-6 z-20">
          {isShareOpen && (
            <div className="absolute top-11 right-0 sm:top-0 sm:right-11 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/80 p-2 flex items-center gap-1.5 flex-nowrap min-w-max animate-in fade-in slide-in-from-top-2 sm:slide-in-from-right-2 duration-150 z-30">
              {shareButtons.map((item) => (
                <button
                  key={item.name}
                  onClick={() => { item.action(); setIsShareOpen(false); }}
                  title={`Share on ${item.name}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer"
                  style={{ background: item.bg }}
                >
                  {item.svg}
                </button>
              ))}
              <button
                onClick={handleCopyLink}
                title={isCopied ? "Copied!" : "Copy Link"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer ${isCopied ? "bg-emerald-500" : "bg-gray-700 hover:bg-gray-900"}`}
              >
                {isCopied ? <Check size={13} color="white" /> : <Link2 size={13} color="white" />}
              </button>
              <div className="hidden sm:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-gray-200/80" />
            </div>
          )}
          <button
            onClick={() => setIsShareOpen((prev) => !prev)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${isShareOpen ? "bg-white text-[#2D1347]" : "bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 text-white"}`}
            title="Share this page"
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>
      <div className="print:hidden grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              About {plan.name}
            </h3>
            {plan.aboutText ? (
              <div
                className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{
                  __html: formatDescription(plan.aboutText) || `<p>${plan.aboutText}</p>`,
                }}
              />
            ) : null}
          </div>

          {/* ── PRICING & TRUST CARDS ON MOBILE (just below About card) ── */}
          <div id="pricing-section-mobile" className="lg:hidden">
            {renderPricingSidebar()}
          </div>

          {plan.inclusions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
                  What Is Covered
                </h3>
                <span className="text-xs font-bold text-[#E91E63] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                  Full Policy Inclusions
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Your policy covers all of the following benefits upon activation:
              </p>
              <div className="space-y-2.5">
                {plan.inclusions.map((inc, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 hover:bg-purple-50/40 border border-gray-100 transition-colors">
                    <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {plan.exclusions && plan.exclusions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
                  What Is Not Covered
                </h3>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  Policy Exclusions
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                The following situations and incidents fall outside the scope of this policy:
              </p>
              <div className="space-y-2.5">
                {plan.exclusions.map((exc, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/60 hover:bg-rose-50 border border-rose-100/80 transition-colors">
                    <div className="w-5 h-5 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5 font-black text-xs">
                      ✕
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">{exc}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Note:</strong> This list is not exhaustive. Please review the full policy document or contact our team for a complete list of exclusions applicable to your specific plan.
                </p>
              </div>
            </div>
          )}
          {plan.documentRequirements.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
                  Required Documents
                </h3>
                <span className="text-xs font-bold text-[#E91E63] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                  Official Checklist
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Prepare and submit the following documents to activate your insurance policy:
              </p>
              <div className="space-y-3">
                {plan.documentRequirements.map((doc, idx) => (
                  <div key={doc.id || idx} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-purple-50/40 border border-gray-100 transition-colors">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Document Type + Required badge row */}
                      <div className="flex items-center flex-wrap gap-1.5">
                        {doc.document_type && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#2D1347]/10 text-[#2D1347] px-2 py-0.5 rounded-md">
                            {doc.document_type}
                          </span>
                        )}
                        {doc.is_required && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-600 px-2 py-0.5 rounded-md border border-rose-200">
                            Required
                          </span>
                        )}
                      </div>
                      {/* Title */}
                      <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                        {doc.title}
                      </p>
                      {/* Description */}
                      {doc.description && (
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Important:</strong> All documents must be in a clear digital format (JPG, PNG, or PDF). Upload them directly in the online application form. For group applications, individual documents are required for each traveler.
                </p>
              </div>
            </div>
          )}
          {plan.policyConditions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
                  Policy Conditions
                </h3>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Policy Guidelines
                </span>
              </div>
              <div className="space-y-2.5">
                {plan.policyConditions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 p-3.5 rounded-xl bg-blue-50/40 border border-blue-100/70">
                    <span className="text-blue-500 font-black mt-0.5 flex-shrink-0">•</span>
                    <div
                      className="leading-relaxed flex-1 [&>p:first-child]:!mt-0 [&>*:first-child]:!mt-0"
                      dangerouslySetInnerHTML={{ __html: formatDescription(item) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {plan.termsConditions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
                  Terms &amp; Conditions
                </h3>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Legal Terms
                </span>
              </div>
              <div className="space-y-2.5">
                {plan.termsConditions.map((term, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 p-3.5 rounded-xl bg-amber-50/40 border border-amber-100/70">
                    <span className="text-amber-600 font-black mt-0.5 flex-shrink-0">•</span>
                    <div
                      className="leading-relaxed flex-1 [&>p:first-child]:!mt-0 [&>*:first-child]:!mt-0"
                      dangerouslySetInnerHTML={{ __html: formatDescription(term) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* RIGHT COLUMN: Desktop Only */}
        <div id="pricing-section" className="hidden lg:block lg:col-span-1 lg:sticky lg:top-[150px] self-start space-y-4">
          {renderPricingSidebar()}
        </div>
      </div>
      <div className="mt-10 print:hidden">
        <OtherServicesComponent service={services} />
      </div>
      {isAppModalOpen && selectedCostOption && (
        <InsuranceApplicationModal
          isOpen={isAppModalOpen}
          onClose={() => setIsAppModalOpen(false)}
          plan={plan as any}
          selectedOption={selectedCostOption}
          numberOfTravelers={numberOfTravelers}
          documentConfig={
            plan?.documentRequirements?.map((doc) => ({
              id: String(doc.id),
              title: doc.title,
              subtitle: doc.description || doc.document_type || "Upload required document",
              required: doc.is_required,
              accept: ".jpg,.jpeg,.png,.pdf",
            })) || []
          }
          requirementConfig={plan?.dynamicRequirements || []}
        />
      )}
    </div>
  );
};
export default InsurancePlanDetailView;
