import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import Logo from "../../assets/images/Logo.png";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MessageCircle,
  Printer,
  Zap,
  Plane,
  Mountain,
  Bed,
  Car,
  Compass,
  ChevronRight,
  Users,
  RefreshCw,
  Share2,
  Check,
  Link2,
  MapPin,
} from "lucide-react";
import {
  useGlobalCurrency,
  formatNPR,
  formatUSD,
  formatINR,
} from "../../context/CurrencyContext";
import VisaApplicationModal from "./VisaApplicationModal";
import {
  shareToPlatform,
  copyToClipboard,
  getCurrentUrl,
  getCrawlerSafeUrl,
  triggerNativeShare,
  openSharePopup,
} from "../../utils/shareUtils";


export interface CostOption {
  name: string;
  days: string;
  nprPrice: number;
  entryType: string;
  description?: string;
}

export interface VisaDetailPlan {
  id: string;
  country: string;
  countryCode: string;
  region: "all" | "middle-east" | "asia" | "europe" | "west";
  visaType: string;
  duration: string;
  processingTime: string;
  baseNPRPrice: number;
  entryType: string;
  inclusions: string[];
  popular?: boolean;
  aboutText?: string;
  requirementDocuments?: string[];
  termsAndConditions?: string[];
  costOptions?: CostOption[];
  successfulApplications?: string;
  successRate?: string;
}

// Country-specific hero background images
const countryBgImages: Record<string, string> = {
  "Thailand": "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&q=80&w=1400",
  "UAE (Dubai / Abu Dhabi)": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1400",
  "South Korea": "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&q=80&w=1400",
  "Japan": "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80&w=1400",
  "Malaysia": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=1400",
  "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1400",
  "Australia": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1400",
  "UK": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1400",
  "USA": "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1400",
  "Schengen": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1400",
};

interface VisaCountryDetailViewProps {
  plan: VisaDetailPlan;
  allPlans: VisaDetailPlan[];
  onSelectPlan: (plan: VisaDetailPlan) => void;
  onBack?: () => void;
}

export const VisaCountryDetailView: React.FC<VisaCountryDetailViewProps> = ({
  plan,
  allPlans,
  onSelectPlan,
  onBack: _onBack,
}) => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
    isRateLoading,
    rateLoadFailed,
  } = useGlobalCurrency();

  // Selected Cost Option in Estimate Invoice Card (default to first option or single entry)
  const defaultOption: CostOption = plan.costOptions && plan.costOptions.length > 0
    ? plan.costOptions[0]
    : {
        name: plan.entryType,
        days: plan.duration,
        nprPrice: plan.baseNPRPrice,
        entryType: plan.entryType,
      };

  const [selectedCostOption, setSelectedCostOption] = useState<CostOption>(defaultOption);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Update selected option when plan changes
  React.useEffect(() => {
    if (plan.costOptions && plan.costOptions.length > 0) {
      setSelectedCostOption(plan.costOptions[0]);
    } else {
      setSelectedCostOption({
        name: plan.entryType,
        days: plan.duration,
        nprPrice: plan.baseNPRPrice,
        entryType: plan.entryType,
      });
    }
  }, [plan]);

  // Close share popup on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setIsShareOpen(false);
      }
    };
    if (isShareOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isShareOpen]);

  const costOptionsList: CostOption[] = plan.costOptions && plan.costOptions.length > 0
    ? plan.costOptions
    : [
        {
          name: "Single Entry",
          days: plan.duration,
          nprPrice: plan.baseNPRPrice,
          entryType: "Single Entry",
          description: "Standard tourist visit visa",
        },
        {
          name: "Multiple Entry",
          days: "90 Days",
          nprPrice: Math.round(plan.baseNPRPrice * 1.45),
          entryType: "Multiple Entry",
          description: "Frequent traveler multi-entry visa",
        },
      ];

  const handleIncreaseGuestCount = (): void => {
    setNumberOfGuests((prev) => prev + 1);
  };

  const handleDecreaseGuestCount = (): void => {
    setNumberOfGuests((prev) => Math.max(1, prev - 1));
  };

  const getRowDisplayPrice = (nprPrice: number): string => {
    if (selectedCurrency === "nepali") {
      return formatNPR(nprPrice);
    }
    if (selectedCurrency === "inr") {
      return formatINR(nprPrice / nprPerOneINR);
    }
    return formatUSD(nprPrice / nprPerOneDollar);
  };

  const unitPrice = selectedCostOption.nprPrice;
  const estimatedTotalPrice = unitPrice * numberOfGuests;

  const getFormattedEstimatedTotal = (): string => {
    if (selectedCurrency === "nepali") {
      return formatNPR(estimatedTotalPrice);
    }
    if (selectedCurrency === "inr") {
      return formatINR(estimatedTotalPrice / nprPerOneINR);
    }
    return formatUSD(estimatedTotalPrice / nprPerOneDollar);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const countryName = plan.country || "Visa";
    const visaCategory = plan.visaType || "Application";
    document.title = `${countryName} - ${visaCategory} - Quotation - Trip Himalaya`;
    window.print();
    window.addEventListener(
      "afterprint",
      () => {
        document.title = originalTitle;
      },
      { once: true }
    );
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  };

  const handleWhatsAppInquiry = () => {
    const currencyText =
      selectedCurrency === "nepali" ? "NPR" : selectedCurrency === "inr" ? "INR" : "USD";
    const totalFormatted = getFormattedEstimatedTotal();
    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Visa & Documentation Team)! I am inquiring about visa counseling for "${plan.country}" (${plan.visaType}). Option: ${selectedCostOption.name} (${selectedCostOption.days}) for ${numberOfGuests} applicant(s). Estimated Total: ${totalFormatted} (${currencyText}). Please guide me through document submission and next steps.`
    );
    window.open(`https://api.whatsapp.com/send?phone=9779851420882&text=${msg}`, "_blank", "noopener,noreferrer");
  };

  // Share helpers
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `${plan.country} ${plan.visaType} | Trip Himalaya Tours & Travel`;
  const shareText = `Check out visa counseling, required documents, and pricing for ${plan.country} on Trip Himalaya Tours & Travel!`;
  const shareData = {
    title: shareTitle,
    text: shareText,
    url: currentUrl,
    image: countryBgImages[plan.country] || "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=1400",
  };

  const shareButtons = [
    {
      name: "Facebook",
      action: () => shareToPlatform("facebook", shareData),
      bg: "#1877F2",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" width="15" height="15"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
      ),
    },
    {
      name: "Instagram",
      action: async () => {
        const shared = await triggerNativeShare(shareData);
        if (!shared) {
          await copyToClipboard(currentUrl);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
          openSharePopup("https://www.instagram.com/triphimalayatt", "Instagram");
        }
      },
      bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="white"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg>
      ),
    },
    {
      name: "TikTok",
      action: async () => {
        await copyToClipboard(currentUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        openSharePopup("https://www.tiktok.com/@trip.himalaya", "TikTok");
      },
      bg: "#000000",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      action: () => shareToPlatform("linkedin", shareData),
      bg: "#0A66C2",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="white"/></svg>
      ),
    },
    {
      name: "Twitter / X",
      action: () => shareToPlatform("twitter", shareData),
      bg: "#000000",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" width="13" height="13"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      ),
    },
  ];

  const handleCopyLink = async () => {
    const success = await copyToClipboard(currentUrl);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Pre-compute all-currency totals for the print document
  const printNPRTotal = formatNPR(estimatedTotalPrice);
  const printUSDTotal = formatUSD(estimatedTotalPrice / nprPerOneDollar);
  const printINRTotal = formatINR(estimatedTotalPrice / nprPerOneINR);

  const heroBg = countryBgImages[plan.country] || "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=1400";


  const handleQuickCountryChange = (countryName: string) => {
    const found = allPlans.find(
      (p) => p.country.toLowerCase() === countryName.toLowerCase()
    );
    if (found) {
      onSelectPlan(found);
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ══════════════════════════════════════════════════════════════════
          COMPREHENSIVE PRINT-ONLY DOCUMENT (hidden on screen, shown in print)
          ══════════════════════════════════════════════════════════════════ */}
      <div
        className="hidden print:flex flex-col justify-between font-sans relative"
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
          fontSize: "10.5px",
          lineHeight: "1.45",
          color: "#1e293b",
          boxSizing: "border-box",
          width: "100%",
          position: "relative",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* ── BACKGROUND WATERMARK ── */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 999,
          }}
        >
          <div
            style={{
              transform: "rotate(-28deg)",
              fontSize: "38px",
              fontWeight: 900,
              color: "rgba(45, 19, 71, 0.06)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              lineHeight: 2.2,
              whiteSpace: "nowrap",
              textAlign: "center",
              mixBlendMode: "multiply",
            }}
          >
            Trip Himalaya Tours and Travels
          </div>
        </div>

        {/* ── 1. CORPORATE LETTERHEAD ── */}
        <div style={{ background: "linear-gradient(135deg, #2D1347 0%, #3B145C 50%, #4a1c7a 100%)", borderRadius: "10px 10px 0 0", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "#ffffff", borderRadius: "8px", padding: "3px 6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src={Logo} alt="Trip Himalaya Logo" style={{ height: "96px", width: "auto", objectFit: "contain", display: "block" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff", letterSpacing: "0.01em", margin: 0, textTransform: "uppercase" }}>
                Trip Himalaya Tours &amp; Travel Pvt. Ltd.
              </h1>
              <div style={{ fontSize: "9px", color: "#f3e8ff", margin: "3px 0 0", lineHeight: "1.4" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center" }}>
                    <MapPin size={10} color="#f472b6" style={{ marginRight: "4px", flexShrink: 0 }} />
                    Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal
                  </span>
                  <span>📞 +977 9851420882</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "3px" }}>
                  <span>✉ dev.triphimalayatt@gmail.com</span>
                  <span>🌐 www.triphimalaya.com.np</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, whiteSpace: "nowrap", alignSelf: "flex-end", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", paddingBottom: "2px" }}>
            <div style={{ fontSize: "8.5px", background: "rgba(233, 30, 99, 0.25)", color: "#fbcfe8", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, border: "1px solid rgba(233, 30, 99, 0.4)" }}>
              Visa &amp; Documentation Team
            </div>
            <div style={{ fontSize: "9.5px", color: "#e9d5ff", whiteSpace: "nowrap" }}>
              Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>
        {/* Project brand accent strip */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #E91E63 0%, #db2777 30%, #9333ea 70%, #2D1347 100%)", marginBottom: "10px" }} />

        {/* ── 2. DESTINATION & APPLICANT SUMMARY STRIP ── */}
        <div style={{ background: "#fdf4ff", border: "1.5px solid #e9d5ff", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "26px", lineHeight: 1 }}>
              {plan.countryCode === "EU" ? "🇪🇺" : <ReactCountryFlag svg countryCode={plan.countryCode} style={{ width: "1.4em", height: "1.4em", borderRadius: "3px" }} />}
            </span>
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: 900, color: "#2D1347", margin: 0, lineHeight: 1.2 }}>
                {plan.country} – {plan.visaType}
              </h2>
              <span style={{ fontSize: "9px", color: "#6b21a8" }}>
                Official Embassy Submission &amp; Documentation Guidance • Nepali Passport Holders
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, background: "#2D1347", color: "#fff", padding: "3px 8px", borderRadius: "4px" }}>
              📅 {plan.duration.toLowerCase().includes("valid") ? plan.duration : `${plan.duration} Valid`}
            </span>
            <span style={{ fontSize: "9px", fontWeight: 700, background: "#7c3aed", color: "#fff", padding: "3px 8px", borderRadius: "4px" }}>
              ✓ {plan.entryType}
            </span>
            <span style={{ fontSize: "9px", fontWeight: 700, background: "#9333ea", color: "#fff", padding: "3px 8px", borderRadius: "4px" }}>
              ⏱ {plan.processingTime}
            </span>
            <span style={{ fontSize: "9px", fontWeight: 700, background: "#E91E63", color: "#fff", padding: "3px 8px", borderRadius: "4px" }}>
              👥 {numberOfGuests} {numberOfGuests === 1 ? "Applicant" : "Applicants"}
            </span>
          </div>
        </div>

        {/* ── 3. OFFICIAL VISA PRICING & QUOTATION SCHEDULE ── */}
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", fontWeight: 900, color: "#2D1347", textTransform: "uppercase", letterSpacing: "0.04em", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px" }}>
              1. Visa Pricing Schedule &amp; Fee Quotation
            </span>
            <span style={{ fontSize: "9px", color: "#7c3aed", fontWeight: 600 }}>
              Currency: Nepali Rupees (NPR) &amp; USD Equivalent
            </span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", border: "1px solid #e9d5ff" }}>
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", color: "#ffffff" }}>
                <th style={{ padding: "7px 10px", textAlign: "left", fontWeight: 800, width: "34%" }}>Option / Package Tier</th>
                <th style={{ padding: "7px 8px", textAlign: "center", fontWeight: 800, width: "18%" }}>Validity &amp; Stay</th>
                <th style={{ padding: "7px 8px", textAlign: "center", fontWeight: 800, width: "16%" }}>Processing Time</th>
                <th style={{ padding: "7px 10px", textAlign: "right", fontWeight: 800, width: "16%" }}>Per Person (NPR)</th>
                <th style={{ padding: "7px 10px", textAlign: "right", fontWeight: 800, width: "16%" }}>Per Person (USD)</th>
              </tr>
            </thead>
            <tbody>
              {costOptionsList.map((opt, idx) => {
                const isSel = selectedCostOption.name === opt.name;
                return (
                  <tr
                    key={idx}
                    style={{
                      background: isSel ? "#fdf2f8" : idx % 2 === 0 ? "#ffffff" : "#faf5ff",
                      borderBottom: "1px solid #f3e8ff",
                      fontWeight: isSel ? 700 : 500,
                    }}
                  >
                    <td style={{ padding: "6px 10px", color: "#2D1347" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {isSel && (
                          <span style={{ fontSize: "8px", background: "#E91E63", color: "#ffffff", padding: "1px 5px", borderRadius: "3px", fontWeight: 800 }}>
                            SELECTED
                          </span>
                        )}
                        <span>{opt.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "6px 8px", textAlign: "center", color: "#6b21a8" }}>
                      {opt.days}
                    </td>
                    <td style={{ padding: "6px 8px", textAlign: "center", color: "#7c3aed" }}>
                      {plan.processingTime}
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 800, color: "#2D1347" }}>
                      {formatNPR(opt.nprPrice)}
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "right", color: "#E91E63", fontWeight: 700 }}>
                      {formatUSD(opt.nprPrice / nprPerOneDollar)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Grand Total Bar */}
          <div style={{ background: "linear-gradient(90deg, #2D1347 0%, #3B145C 50%, #4a1c7a 100%)", color: "#ffffff", borderRadius: "0 0 8px 8px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #E91E63" }}>
            <div>
              <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#f5d0fe", display: "block" }}>
                Total Estimated Payable ({numberOfGuests} {numberOfGuests === 1 ? "Applicant" : "Applicants"} • {selectedCostOption.name})
              </span>
              <span style={{ fontSize: "8.5px", color: "#e9d5ff" }}>
                Includes embassy fee, appointment booking, day-to-day itinerary, flight &amp; hotel vouchers, and dossier audit.
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "20px", fontWeight: 900, color: "#ffffff", lineHeight: 1.1 }}>
                {printNPRTotal}
              </div>
              <div style={{ fontSize: "9px", color: "#fce7f3", marginTop: "2px" }}>
                USD Approx: <strong style={{ color: "#ffffff" }}>{printUSDTotal}</strong> • INR: <strong style={{ color: "#ffffff" }}>{printINRTotal}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. TWO-COLUMN: SCOPE OF SERVICES & REQUIRED DOCUMENT CHECKLIST ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.08fr", gap: "10px", marginBottom: "10px" }}>

          {/* Left: Services */}
          <div style={{ background: "#faf5ff", border: "1.5px solid #d8b4fe", borderRadius: "8px", padding: "10px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "5px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10.5px", fontWeight: 900, color: "#2D1347", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                2. What Trip Himalaya Provides
              </span>
              <span style={{ fontSize: "8px", background: "#2D1347", color: "#ffffff", padding: "1px 6px", borderRadius: "3px", fontWeight: 700 }}>
                Service Scope
              </span>
            </div>
            <p style={{ fontSize: "9px", color: "#6b21a8", margin: "0 0 6px", lineHeight: 1.4 }}>
              Our expert visa officers prepare your application strictly compliant with {plan.country} consular standards:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {[
                { title: "Embassy / VFS Appointment Booking", desc: "Confirmed appointment scheduling & biometric slot reservation." },
                { title: "Cover Letter & Day-by-Day Itinerary", desc: "Customized statement of purpose & embassy-compliant trip plan." },
                { title: "Flight Reservations & Hotel Vouchers", desc: "Confirmed booking vouchers matching your travel schedule." },
                { title: "Financial Dossier & Sponsor Audit", desc: "Verification of bank statements, source of funds & property ties." },
                { title: "Translation & Notarization Guidance", desc: "Official Nepali-to-English translation & verification assistance." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                  <span style={{ color: "#E91E63", fontWeight: 900, fontSize: "11px", lineHeight: 1 }}>✓</span>
                  <div>
                    <span style={{ fontSize: "9.5px", fontWeight: 800, color: "#2D1347" }}>{item.title}: </span>
                    <span style={{ fontSize: "9px", color: "#581c87" }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Documents Checklist */}
          <div style={{ background: "#fff1f2", border: "1.5px solid #fecdd3", borderRadius: "8px", padding: "10px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1.5px solid #fda4af", paddingBottom: "5px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10.5px", fontWeight: 900, color: "#881337", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                3. Mandatory Document Checklist
              </span>
              <span style={{ fontSize: "8px", background: "#E91E63", color: "#ffffff", padding: "1px 6px", borderRadius: "3px", fontWeight: 700 }}>
                Applicant Checklist
              </span>
            </div>
            <p style={{ fontSize: "9px", color: "#be185d", margin: "0 0 6px", lineHeight: 1.4 }}>
              Please tick and prepare the following verified original documents before submission:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {(plan.requirementDocuments && plan.requirementDocuments.length > 0
                ? plan.requirementDocuments
                : [
                    "Current passport valid min. 6 months beyond travel date with 2+ blank visa pages",
                    "Recent 35mm x 45mm white-background passport photograph (matte/glossy, 80% face)",
                    "Bank statement (last 6 months with official bank stamp & sufficient closing balance)",
                    "Proof of occupation (employment letter, pay slips, or business registration & PAN)",
                    "Round-trip air ticket reservation & confirmed hotel vouchers (arranged by agency)",
                    "Certified English translation for all Nepali civil certificates (Citizenship, Marriage)",
                  ]
              ).map((req, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "9px", color: "#4c0519" }}>
                  <span style={{ border: "1.5px solid #E91E63", borderRadius: "2px", width: "10px", height: "10px", display: "inline-block", flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ lineHeight: 1.35 }}>{req}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── 5. EMBASSY POLICIES & ADVISORY ── */}
        <div style={{ background: "#fdf4ff", border: "1.5px solid #e9d5ff", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px" }}>
          <div style={{ marginBottom: "5px" }}>
            <span style={{ fontSize: "10px", fontWeight: 900, color: "#2D1347", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              ⚠ 4. Important Embassy Advisory &amp; Legal Policies
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: "8.5px", color: "#4a154b", lineHeight: 1.35 }}>
            <div>• <strong style={{ color: "#2D1347" }}>Consular Discretion:</strong> Visa grant, validity, and entry permissions are under the exclusive authority of the embassy/consulate.</div>
            <div>• <strong style={{ color: "#2D1347" }}>Non-Refundable Terms:</strong> Consular application charges and counseling documentation fees are non-refundable once processed.</div>
            <div>• <strong style={{ color: "#2D1347" }}>Document Authenticity:</strong> All applicant records must be authentic, valid, and verifiable upon embassy background checks.</div>
            <div>• <strong style={{ color: "#2D1347" }}>Translation Requirement:</strong> Documents issued in Nepali (Civil, Land, Tax) must carry certified translation and legal notarization.</div>
          </div>
        </div>

        {/* ── 6. CORPORATE FOOTER ── */}
        <div style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", padding: "8px 14px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "8.5px", color: "#ffffff" }}>
          <div>
            <strong style={{ color: "#ffffff" }}>Trip Himalaya Tours &amp; Travel Pvt. Ltd.</strong> • Registered in Nepal (Lic: 2490)
          </div>
          <div style={{ color: "#fce7f3" }}>
            Visa &amp; Documentation Team: +977 9851420882 • dev.triphimalayatt@gmail.com
          </div>
          <div style={{ fontWeight: 700, color: "#f472b6" }}>
            Official Computer-Generated Quotation • Page 1 of 1
          </div>
        </div>

      </div>

      {/* ── HERO HEADER BANNER with Background Image ── */}
      <div
        className="print:hidden relative rounded-3xl overflow-hidden shadow-lg min-h-[220px] sm:min-h-[260px] flex flex-col justify-end"
        style={{
          backgroundImage: `url('${heroBg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0520]/90 via-[#1a0836]/60 to-transparent print:hidden" />
        {/* Subtle purple tint on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#2D1347]/40 print:hidden" />

        {/* Content */}
        <div className="relative z-10 pt-14 px-4 pb-4 sm:pt-16 sm:px-6 sm:pb-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              {/* Flag in a glassy circle */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                {plan.countryCode === "EU" ? (
                  <span className="text-3xl sm:text-4xl">🇪🇺</span>
                ) : (
                  <ReactCountryFlag
                    svg
                    countryCode={plan.countryCode}
                    style={{ width: "2.4em", height: "2.4em", borderRadius: "6px" }}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                    {plan.country} – {plan.visaType}
                  </h2>
                  {plan.popular && (
                    <span className="bg-[#E91E63] text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm flex-shrink-0">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white/70 mt-1">
                  Authorized Counseling &amp; Embassy Submission Support for Nepali Citizens
                </p>
              </div>
            </div>

            {/* Action buttons on the right */}
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

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
              <Calendar size={14} className="text-pink-300" />
              <span>{plan.duration.toLowerCase().includes("valid") ? plan.duration : `${plan.duration} Valid`}</span>
            </div>

            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>{plan.entryType}</span>
            </div>

            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
              <Clock size={14} className="text-blue-300" />
              <span>{plan.processingTime}</span>
            </div>
          </div>
        </div>

        {/* ── SHARE BUTTON — top-right of hero ── */}
        <div ref={shareRef} className="print:hidden absolute top-3 right-4 sm:top-4 sm:right-6 z-20">
          {/* Share popup — appears below on mobile, to the LEFT on desktop */}
          {isShareOpen && (
            <div className="absolute top-11 right-0 sm:top-0 sm:right-11 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/80 p-2 flex items-center gap-1.5 flex-nowrap min-w-max animate-in fade-in slide-in-from-top-2 sm:slide-in-from-right-2 duration-150 z-30">
              {shareButtons.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setIsShareOpen(false);
                  }}
                  title={`Share on ${item.name}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer"
                  style={{ background: item.bg }}
                >
                  {item.svg}
                </button>
              ))}
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                title={isCopied ? "Copied!" : "Copy Link"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer ${isCopied ? "bg-emerald-500" : "bg-gray-700 hover:bg-gray-900"}`}
              >
                {isCopied ? <Check size={13} color="white" /> : <Link2 size={13} color="white" />}
              </button>
              {/* Arrow tip pointing right toward share button — hidden on mobile */}
              <div className="hidden sm:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-gray-200/80" />
            </div>
          )}

          {/* Share trigger button */}
          <button
            onClick={() => setIsShareOpen((prev) => !prev)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${isShareOpen ? "bg-white text-[#2D1347]" : "bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 text-white"}`}
            title="Share this page"
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN SECTION (Left Content | Right Sticky Estimate Invoice) ── */}
      <div className="print:hidden grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: About Visa, Requirement Document, Terms & Conditions */}
        <div className="lg:col-span-2 space-y-8">
          {/* # About Visa */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              About {plan.country} Visa
            </h3>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3">
              <p>
                {plan.aboutText ||
                  `Nepali passport holders require a pre-approved tourist visa to enter ${plan.country}. All applicants must fulfill embassy regulations, submit biometric details where applicable, and demonstrate genuine travel intent with verified funds and return reservations.`}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Trip Himalaya Tours &amp; Travel assists you through the complete process: document auditing, certified translations, embassy application filing, confirmed flight and hotel booking vouchers, and 24/7 dedicated visa assistance.
              </p>
            </div>

            {/* Inclusions Pill Bar */}
            <div className="pt-4 border-t border-gray-100">
              <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider block mb-2.5">
                Our Service Includes:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.inclusions.map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* # Requirement Document */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
                Requirement Document
              </h3>
              <span className="text-xs font-bold text-[#E91E63] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                Official Checklist
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-500">
              Please ensure all documents are clear, valid, and prepared prior to embassy submission:
            </p>

            <div className="space-y-3">
              {(plan.requirementDocuments && plan.requirementDocuments.length > 0
                ? plan.requirementDocuments
                : [
                    "Passport copy (valid for at least 6 months with blank pages)",
                    "Passport size photo (recent white background 35mm x 45mm)",
                    "Bank statement (up to 6 months closing balance minimum NPR 200,000)",
                    "Confirmed Round trip ticket reservation",
                    "Confirm hotel booking voucher",
                    "Certified English translations for any documents originally in Nepali",
                  ]
              ).map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 hover:bg-purple-50/40 border border-gray-100 transition-colors"
                >
                  <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                    {req}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Important Note:</strong> Documents issued in Nepali (such as Citizenship, Relationship Certificates, or Land Ownership) must be officially translated into English and notarized. Trip Himalaya provides certified notarization and translation services.
              </p>
            </div>
          </div>

          {/* # Terms and Conditions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              Terms and Conditions
            </h3>

            <div className="space-y-2.5">
              {(plan.termsAndConditions && plan.termsAndConditions.length > 0
                ? plan.termsAndConditions
                : [
                    "Payment fully non-refundable if visa refused by the embassy.",
                    "Ticket canceled as per system penalties and airline fare rules.",
                    "Hotels payment is fully non-refundable once issued.",
                    "Embassy processing fee and service charge are non-refundable under any circumstance.",
                    "Approval or rejection of visa is at the sole discretion of the respective embassy / immigration department.",
                  ]
              ).map((term, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                  <span className="text-[#E91E63] font-black mt-0.5">•</span>
                  <span className="leading-relaxed">{term}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Same design, alignment, style and stack as Trekking Details Page (PackagePricing.tsx) */}
        <div id="pricing-section" className="space-y-4 lg:sticky lg:top-[150px] self-start">
          {/* =======================================================================
              MAIN PRICING CARD (Matching PackagePricing.tsx)
              ======================================================================= */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Card Header: Title left, Currency Toggle right */}
            <div className="py-2.5 px-3.5 bg-gradient-to-r from-[#200B3B] to-[#3B145C] text-white flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-black">Pricing Options</h2>
                <p className="text-[9px] text-gray-300 font-medium">Standard rates &amp; inclusions</p>
              </div>

              {/* NEPALI / USD / INR currency toggle buttons (syncs site-wide) */}
              <div className="flex bg-white/10 backdrop-blur-md p-0.5 rounded-lg text-[9px] font-black tracking-wider gap-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedCurrency("nepali")}
                  aria-label="Show prices in Nepali Rupees (NPR)"
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    selectedCurrency === "nepali"
                      ? "bg-white text-[#200B3B] shadow-xs"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  NEPALI
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCurrency("foreigner")}
                  aria-label="Show prices in US Dollars (USD)"
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    selectedCurrency === "foreigner"
                      ? "bg-[#E91E63] text-white shadow-xs"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCurrency("inr")}
                  aria-label="Show prices in Indian Rupees (INR)"
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    selectedCurrency === "inr"
                      ? "bg-[#FF5722] text-white shadow-xs"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  INR (₹)
                </button>
              </div>
            </div>

            {/* Exchange Rate Status Banner — shown when USD or INR mode is active */}
            {selectedCurrency !== "nepali" && (
              <div
                className={`flex items-center justify-between gap-1.5 px-3.5 py-1.5 text-[9px] font-semibold ${
                  rateLoadFailed
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <div className="flex items-center gap-1">
                  {isRateLoading ? (
                    <RefreshCw size={10} className="animate-spin" />
                  ) : rateLoadFailed ? (
                    <AlertCircle size={10} />
                  ) : (
                    <Zap size={10} />
                  )}
                  <span>
                    {isRateLoading
                      ? "Fetching live exchange rate..."
                      : rateLoadFailed
                      ? selectedCurrency === "inr"
                        ? `Offline estimate — 1 INR = NPR 1.60`
                        : `Offline estimate — 1 USD = NPR 151.09`
                      : selectedCurrency === "inr"
                      ? `Live rate: 1 INR = NPR ${nprPerOneINR.toFixed(2)}`
                      : `Live rate: 1 USD = NPR ${nprPerOneDollar.toFixed(2)}`}
                  </span>
                </div>
                {!isRateLoading && (
                  <span className="text-[8px] opacity-60">Live Exchange Rate</span>
                )}
              </div>
            )}

            {/* Pricing Table + Controls body */}
            <div className="p-3 sm:p-3.5 space-y-2.5">
              {/* Pricing Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="pb-2">Option / Tier</th>
                      <th className="pb-2">Validity</th>
                      <th className="pb-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/60">
                    {costOptionsList.map((pricingRow, rowIndex) => {
                      const isSelected = selectedCostOption.name === pricingRow.name;
                      return (
                        <tr
                          key={rowIndex}
                          onClick={() => setSelectedCostOption(pricingRow)}
                          className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                            isSelected ? "bg-purple-50/70 font-bold" : ""
                          }`}
                        >
                          <td className="py-2.5 font-bold text-[#200B3B] text-xs">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full border ${
                                  isSelected ? "bg-[#E91E63] border-[#E91E63]" : "border-gray-300"
                                }`}
                              />
                              <span>{pricingRow.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-gray-500 text-[11px]">
                            {pricingRow.days}
                          </td>
                          <td className="py-2.5 text-right font-black text-[#E91E63] text-sm">
                            {getRowDisplayPrice(pricingRow.nprPrice)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Guest / Applicant Count Selector */}
              <div className="bg-[#FBFBFE] py-1.5 px-2.5 rounded-lg border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-[#E91E63]" />
                  <div>
                    <span className="block text-[11px] font-bold text-[#200B3B]">
                      Number of Applicants
                    </span>
                    <span className="text-[9px] text-gray-400">Select traveler count</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDecreaseGuestCount}
                    disabled={numberOfGuests <= 1}
                    aria-label="Remove one applicant"
                    className="w-5 h-5 rounded bg-white border border-gray-200 text-[#200B3B] font-black text-xs flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-black text-xs text-[#200B3B] w-4 text-center">
                    {numberOfGuests}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncreaseGuestCount}
                    aria-label="Add one more applicant"
                    className="w-5 h-5 rounded bg-white border border-gray-200 text-[#200B3B] font-black text-xs flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Estimated Total */}
              <div className="flex items-center justify-between pt-0.5">
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                    Estimated Total ({numberOfGuests} {numberOfGuests === 1 ? "applicant" : "applicants"})
                  </span>
                  <span className="text-lg font-black text-[#200B3B]">
                    {getFormattedEstimatedTotal()}
                  </span>
                </div>
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap size={10} />
                  Best Rate
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsAppModalOpen(true)}
                  aria-label="Process Visa Application Now"
                  className="w-full py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer bg-[#E91E63] hover:bg-pink-600 active:scale-[0.98] text-white"
                >
                  <span>Process Application Now</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  aria-label="Send a WhatsApp inquiry"
                  className="w-full py-2 rounded-lg text-[11px] font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Instant Inquiry</span>
                </button>
              </div>
            </div>
          </div>

          {/* =======================================================================
              VERIFICATION & TRUST CARD (Matching Trekking Details stack + Sketch stats)
              ======================================================================= */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-3.5">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                  VERIFIED CONCIERGE
                </span>
                <p className="text-xs font-black text-[#200B3B]">
                  Govt. Licensed &amp; Official Embassy Liaison
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#2D1347] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
              <div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                  SUCCESSFUL APPLICATIONS
                </span>
                <p className="text-xs font-black text-[#200B3B]">
                  {plan.successfulApplications || "1000+"} Approvals Granted
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                  APPROVAL RATING
                </span>
                <p className="text-xs font-black text-[#200B3B]">
                  {plan.successRate || "99%"} Visa Success Rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── OUR OTHER SERVICES SECTION (As drawn in wireframe sketch) ── */}
      <div className="print:hidden pt-8 border-t border-gray-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              Our other Services:
            </h3>
            <p className="text-xs text-gray-500">Complete one-stop travel logistics by Trip Himalaya</p>
          </div>
          <Link
            to="/service"
            className="text-xs sm:text-sm font-bold text-[#E91E63] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>view all Services.</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Horizontal row of 6 service cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            {
              name: "Air Ticket",
              slug: "air-ticket",
              icon: Plane,
              desc: "Domestic & Global Flights",
              color: "text-blue-600 bg-blue-50",
            },
            {
              name: "Holiday Tours",
              slug: "tours",
              icon: Compass,
              desc: "Heritage & Leisure Trips",
              color: "text-amber-600 bg-amber-50",
            },
            {
              name: "Trekking",
              slug: "trekking",
              icon: Mountain,
              desc: "Himalayan Expeditions",
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              name: "Hotel Booking",
              slug: "hotel-booking",
              icon: Bed,
              desc: "Worldwide Hotel Stays",
              color: "text-purple-600 bg-purple-50",
            },
            {
              name: "Travel Insurance",
              slug: "travel-insurance",
              icon: ShieldCheck,
              desc: "Medical & Luggage Cover",
              color: "text-pink-600 bg-pink-50",
            },
            {
              name: "Vehicle Rental",
              slug: "vehicle-rental",
              icon: Car,
              desc: "Luxury Tourist Vehicles",
              color: "text-indigo-600 bg-indigo-50",
            },
          ].map((srv, idx) => {
            const IconComp = srv.icon;
            return (
              <Link
                key={idx}
                to={`/service/${srv.slug}`}
                className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-[#E91E63] hover:shadow-md transition-all group flex flex-col items-center text-center justify-between cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl ${srv.color} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform`}>
                  <IconComp size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#2D1347] group-hover:text-[#E91E63] transition-colors leading-tight">
                    {srv.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{srv.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── VISA APPLICATION MODAL (Triggered when clicking 'Process Now') ── */}
      <VisaApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        country={plan.country}
        countryCode={plan.countryCode}
        visaType={plan.visaType}
        selectedOption={selectedCostOption}
        numberOfGuests={numberOfGuests}
      />
    </div>
  );
};

export default VisaCountryDetailView;
