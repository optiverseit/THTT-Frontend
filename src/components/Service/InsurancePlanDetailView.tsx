import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
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
  Ambulance,
  Globe,
} from "lucide-react";
import {
  useGlobalCurrency,
  formatNPR,
  formatUSD,
  formatINR,
} from "../../context/CurrencyContext";
import { InsuranceApplicationModal } from "./InsuranceApplicationModal";
import { InsurancePlan, InsuranceCostOption, INSURANCE_PLANS } from "./insuranceData";
import {
  shareToPlatform,
  copyToClipboard,
  getCurrentUrl,
  getCrawlerSafeUrl,
  triggerNativeShare,
  openSharePopup,
} from "../../utils/shareUtils";
import Logo from "../../assets/images/Logo.png";

interface InsurancePlanDetailViewProps {
  plan: InsurancePlan;
  allPlans: InsurancePlan[];
  onSelectPlan: (plan: InsurancePlan) => void;
  onBack?: () => void;
}

const altitudeHeroBgMap: Record<string, string> = {
  "plan-trek-standard": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1400",
  "plan-high-altitude": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&q=80&w=1400",
  "plan-extreme-expedition": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1400",
  "plan-international": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1400",
};

export const InsurancePlanDetailView: React.FC<InsurancePlanDetailViewProps> = ({
  plan,
  allPlans,
  onSelectPlan,
  onBack: _onBack,
}) => {
  const navigate = useNavigate();

  const {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
    isRateLoading,
    rateLoadFailed,
  } = useGlobalCurrency();

  const defaultOption: InsuranceCostOption =
    plan.costOptions && plan.costOptions.length > 0
      ? plan.costOptions[0]
      : {
          name: plan.durationCovered,
          days: plan.durationCovered,
          nprPrice: plan.baseNPRPrice,
          usdPrice: plan.priceUSD,
          coverageLimit: plan.coverageLimit,
          description: plan.name,
        };

  const [selectedCostOption, setSelectedCostOption] = useState<InsuranceCostOption>(defaultOption);
  const [numberOfTravelers, setNumberOfTravelers] = useState<number>(1);
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
        name: plan.durationCovered,
        days: plan.durationCovered,
        nprPrice: plan.baseNPRPrice,
        usdPrice: plan.priceUSD,
        coverageLimit: plan.coverageLimit,
        description: plan.name,
      });
    }
    setNumberOfTravelers(1);
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

  const costOptionsList: InsuranceCostOption[] =
    plan.costOptions && plan.costOptions.length > 0
      ? plan.costOptions
      : [defaultOption];

  const getRowDisplayPrice = (nprPrice: number): string => {
    if (selectedCurrency === "nepali") return formatNPR(nprPrice);
    if (selectedCurrency === "inr") return formatINR(nprPrice / nprPerOneINR);
    return formatUSD(nprPrice / nprPerOneDollar);
  };

  const unitPrice = selectedCostOption.nprPrice;
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
    const currencyText =
      selectedCurrency === "nepali" ? "NPR" : selectedCurrency === "inr" ? "INR" : "USD";
    const totalFormatted = getFormattedEstimatedTotal();
    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Insurance Team)! I am inquiring about travel insurance for "${plan.name}" (${plan.maxAltitude}). Option: ${selectedCostOption.name} (${selectedCostOption.days}) for ${numberOfTravelers} traveler(s). Coverage: ${selectedCostOption.coverageLimit}. Estimated Premium: ${totalFormatted} (${currencyText}). Please guide me through the next steps.`
    );
    window.open(`https://api.whatsapp.com/send?phone=9779851420882&text=${msg}`, "_blank", "noopener,noreferrer");
  };

  // Share helpers
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `${plan.name} | Trip Himalaya Travel Insurance`;
  const shareText = `Check out ${plan.name} (${plan.maxAltitude}) - ${plan.coverageLimit} starting from ${getFormattedEstimatedTotal()} on Trip Himalaya!`;
  const shareData = {
    title: shareTitle,
    text: shareText,
    url: currentUrl,
    image: altitudeHeroBgMap[plan.id] || plan.heroImage,
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
      name: "WhatsApp",
      action: () => shareToPlatform("whatsapp", shareData),
      bg: "#25D366",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.5 2a9.5 9.5 0 100 19 9.5 9.5 0 000-19zm0 17.5a8 8 0 110-16 8 8 0 010 16z"/></svg>
      ),
    },
    {
      name: "Twitter/X",
      action: () => shareToPlatform("twitter", shareData),
      bg: "#000000",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.626L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
      ),
    },
    {
      name: "Telegram",
      action: () => shareToPlatform("telegram", shareData),
      bg: "#229ED9",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" width="15" height="15"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
      ),
    },
  ];

  const handleCopyLink = async () => {
    const success = await copyToClipboard(getCrawlerSafeUrl(getCurrentUrl()));
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Print document pre-compute values
  const printNPRTotal = formatNPR(estimatedTotalPrice);
  const printUSDTotal = formatUSD(estimatedTotalPrice / nprPerOneDollar);
  const printINRTotal = formatINR(estimatedTotalPrice / nprPerOneINR);

  const heroBg = altitudeHeroBgMap[plan.id] || plan.heroImage;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ══════════════════════════════════════════════════════════════════
          COMPREHENSIVE PRINT-ONLY QUOTATION DOCUMENT (FULL-PAGE BALANCED)
          ══════════════════════════════════════════════════════════════════ */}
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
            /* When printing modal slip, HIDE this quotation completely */
            body.printing-modal-slip .insurance-plan-quotation-print {
              display: none !important;
            }
            /* When printing quotation, HIDE modal slip completely */
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
            /* Force gradient/colored headers to print */
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


        {/* Watermark — CSS flexbox centered, rotates around its own center, text color always prints */}
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
          {/* Top Block: Letterhead + Divider */}
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
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        Airport, Shambhu Marg, Road No. 04, Kathmandu
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.44 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                        </svg>
                        +977 9851420882
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        dev.triphimalayatt@gmail.com
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
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
                  REF: THTT-INS-{plan.id.replace("plan-", "").toUpperCase()}-{new Date().getFullYear()}
                </div>
              </div>
            </div>
            <div style={{ height: "3.5px", background: "linear-gradient(90deg, #E91E63 0%, #db2777 30%, #9333ea 70%, #2D1347 100%)" }} />
          </div>

          {/* ══════════════════════════════════════════════════════════════
              1. APPLIED DETAILS FIRST
              ══════════════════════════════════════════════════════════════ */}
          <div style={{ border: "1px solid #cbd5e1", borderRadius: "7px", overflow: "hidden", background: "#ffffff" }}>
            <div className="print-header-main" style={{ background: "#2D1347", color: "#ffffff", padding: "4.5px 10px", fontSize: "9.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>1. Applied Policy &amp; Coverage Details</span>
              <span style={{ fontSize: "8.5px", fontWeight: 700, color: "#f472b6" }}>
                Status: Applied / Quotation Confirmed
              </span>
            </div>

            {/* Applied Summary Hero Strip */}
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
                  Applied Option: <strong style={{ color: "#2D1347" }}>{selectedCostOption.name} ({selectedCostOption.days})</strong> • Max Altitude: <strong style={{ color: "#be123c" }}>{plan.maxAltitude}</strong> • Medical Limit: <strong style={{ color: "#047857" }}>{selectedCostOption.coverageLimit}</strong>
                </div>
              </div>

              {/* Applied Price Highlight Box — Pinned to Right Side */}
              <div style={{ textAlign: "right", background: "#ffffff", border: "1.5px solid #c084fc", borderRadius: "6px", padding: "5px 14px", flexShrink: 0 }}>
                <div style={{ fontSize: "8px", fontWeight: 800, color: "#7e22ce", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Total Estimated Premium ({numberOfTravelers} {numberOfTravelers === 1 ? "Traveler" : "Travelers"})
                </div>
                <div style={{ fontSize: "16px", fontWeight: 900, color: "#2D1347", lineHeight: 1.15, margin: "2px 0" }}>
                  {printNPRTotal}
                </div>
                <div style={{ fontSize: "8.5px", color: "#6b7280" }}>
                  ≈ {printUSDTotal} &nbsp;|&nbsp; ≈ {printINRTotal}
                </div>
              </div>
            </div>

            {/* Pricing Schedule & Alternative Durations Table */}
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
                {costOptionsList.map((opt, idx) => {
                  const isSelected = opt.name === selectedCostOption.name;
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

          {/* ══════════════════════════════════════════════════════════════
              2. REQUIRED DOCUMENTS CHECKLIST
              ══════════════════════════════════════════════════════════════ */}
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

          {/* ══════════════════════════════════════════════════════════════
              3. TERMS & POLICY CONDITIONS
              ══════════════════════════════════════════════════════════════ */}
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

          {/* ══════════════════════════════════════════════════════════════
              4. EMERGENCY CONTACTS & 24/7 RESCUE ASSISTANCE
              ══════════════════════════════════════════════════════════════ */}
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
                <strong style={{ color: "#881337", fontSize: "9.5px" }}>📞 +977 9851420882</strong>
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

          {/* Corporate Footer Bar */}
          <div className="print-footer-bar" style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", padding: "7px 12px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "8px", color: "#ffffff" }}>
            <div><strong>Trip Himalaya Tours &amp; Travel Pvt. Ltd.</strong> • Nepal Govt. Reg. No. 2490 • Shambhu Marg, Kathmandu</div>
            <div style={{ color: "#fce7f3" }}>24/7 SOS: +977 9851420882 • Cashless Heli Guarantee</div>
            <div style={{ fontWeight: 800, color: "#f472b6" }}>Computer-Generated Quotation • Valid 30 Days • Page 1 of 1</div>
          </div>
        </div>
      </div>

      {/* ── HERO HEADER BANNER ── */}
      <div
        className="print:hidden relative rounded-3xl overflow-hidden shadow-lg min-h-[220px] sm:min-h-[260px] flex flex-col justify-end"
        style={{ backgroundImage: `url('${heroBg}')`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0520]/92 via-[#1a0836]/65 to-transparent print:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#2D1347]/40 print:hidden" />

        {/* Content */}
        <div className="relative z-10 pt-14 px-4 pb-4 sm:pt-16 sm:px-6 sm:pb-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              {/* Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                {plan.id === "plan-international" ? (
                  <Globe size={36} className="text-white" />
                ) : plan.id === "plan-extreme-expedition" ? (
                  <Mountain size={36} className="text-white" />
                ) : (
                  <Ambulance size={36} className="text-white" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                    {plan.name}
                  </h2>
                  {plan.isPopular && (
                    <span className="bg-[#E91E63] text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm flex-shrink-0">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white/70 mt-1">
                  {plan.badge} • High-Altitude Alpine &amp; Medical Rescue Insurance
                </p>
              </div>
            </div>

            {/* Action buttons */}
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
              <Mountain size={14} className="text-pink-300" />
              <span>{plan.maxAltitude}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>{plan.coverageLimit}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
              <Calendar size={14} className="text-blue-300" />
              <span>{plan.durationCovered}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
              <Ambulance size={14} className="text-amber-300" />
              <span>24/7 Rescue Desk</span>
            </div>
          </div>
        </div>

        {/* Share Button — top-right */}
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

      {/* ── MAIN 2-COLUMN SECTION ── */}
      <div className="print:hidden grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT: About, Coverage Benefits, Required Docs, Terms */}
        <div className="lg:col-span-2 space-y-8">

          {/* About the Plan */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              About {plan.name}
            </h3>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3">
              <p>{plan.aboutText}</p>
            </div>

            {/* Coverage Highlights */}
            <div className="pt-4 border-t border-gray-100">
              <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider block mb-2.5">
                Key Coverage Highlights:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Policy Inclusions — Full List */}
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

          {/* Required Documents */}
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
              {plan.requirementDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 hover:bg-purple-50/40 border border-gray-100 transition-colors">
                  <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">{doc}</span>
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

          {/* Terms & Conditions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              Policy Terms &amp; Conditions
            </h3>
            <div className="space-y-2.5">
              {plan.termsAndConditions.map((term, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                  <span className="text-[#E91E63] font-black mt-0.5">•</span>
                  <span className="leading-relaxed">{term}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Sticky Pricing Card */}
        <div id="pricing-section" className="space-y-4 lg:sticky lg:top-[150px] self-start">
          {/* Main Pricing Card */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="py-2.5 px-3.5 bg-gradient-to-r from-[#200B3B] to-[#3B145C] text-white flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-black">Coverage &amp; Pricing</h2>
                <p className="text-[9px] text-gray-300 font-medium">Select your duration plan</p>
              </div>
              {/* Currency Toggle */}
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

            {/* Exchange Rate Banner */}
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

            {/* Pricing Table + Controls */}
            <div className="p-3 sm:p-3.5 space-y-2.5">
              {/* Pricing Table */}
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
                    {costOptionsList.map((opt, rowIndex) => {
                      const isSelected = selectedCostOption.name === opt.name;
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

              {/* Coverage limit badge for selected */}
              <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <ShieldCheck size={12} />
                <span>Coverage: {selectedCostOption.coverageLimit}</span>
              </div>

              {/* Traveler Count Selector */}
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

              {/* Estimated Total */}
              <div className="flex items-center justify-between pt-0.5">
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                    Estimated Premium ({numberOfTravelers} {numberOfTravelers === 1 ? "traveler" : "travelers"})
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
                  className="w-full py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer bg-[#E91E63] hover:bg-pink-600 active:scale-[0.98] text-white"
                >
                  <span>Apply for Insurance Now</span>
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

          {/* Trust/Verification Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-3.5">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">VERIFIED INSURER</span>
                <p className="text-xs font-black text-[#200B3B]">Nepal-Licensed Insurance Brokers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                <Ambulance size={18} />
              </div>
              <div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">RESCUE GUARANTEE</span>
                <p className="text-xs font-black text-[#200B3B]">24/7 Helicopter Dispatch • 45 Min</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#2D1347] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
              <div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">CASHLESS NETWORK</span>
                <p className="text-xs font-black text-[#200B3B]">CIWEC, Swacon &amp; Era Hospitals</p>
              </div>
            </div>
          </div>

          {/* Other Insurance Plans */}
          {allPlans.filter((p) => p.id !== plan.id).length > 0 && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-3">
              <h4 className="text-xs font-black text-[#2D1347] uppercase tracking-wider">Other Plans</h4>
              {allPlans.filter((p) => p.id !== plan.id).map((otherPlan) => (
                <button
                  key={otherPlan.id}
                  type="button"
                  onClick={() => { onSelectPlan(otherPlan); window.scrollTo({ top: 180, behavior: "smooth" }); }}
                  className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-black text-[#2D1347] group-hover:text-[#E91E63] transition-colors">{otherPlan.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{otherPlan.maxAltitude} • From {getRowDisplayPrice(otherPlan.baseNPRPrice)}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-[#E91E63] flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── OUR OTHER SERVICES SECTION ── */}
      <div className="print:hidden pt-8 border-t border-gray-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">Our other Services:</h3>
            <p className="text-xs text-gray-500">Complete one-stop travel logistics by Trip Himalaya</p>
          </div>
          <Link to="/service" className="text-xs sm:text-sm font-bold text-[#E91E63] hover:underline flex items-center gap-1 cursor-pointer">
            <span>view all Services.</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { name: "Air Ticket", slug: "air-ticket", icon: Plane, desc: "Domestic & Global Flights", color: "text-blue-600 bg-blue-50" },
            { name: "Holiday Tours", slug: "tours", icon: Compass, desc: "Heritage & Leisure Trips", color: "text-amber-600 bg-amber-50" },
            { name: "Trekking", slug: "trekking", icon: Mountain, desc: "Himalayan Expeditions", color: "text-emerald-600 bg-emerald-50" },
            { name: "Hotel Booking", slug: "hotel-booking", icon: Bed, desc: "Worldwide Hotel Stays", color: "text-purple-600 bg-purple-50" },
            { name: "Visa Services", slug: "visa-services", icon: Globe, desc: "Embassy Submissions", color: "text-pink-600 bg-pink-50" },
            { name: "Vehicle Rental", slug: "vehicle-rental", icon: Car, desc: "Luxury Tourist Vehicles", color: "text-indigo-600 bg-indigo-50" },
          ].map((srv, idx) => {
            const IconComp = srv.icon;
            return (
              <Link key={idx} to={`/service/${srv.slug}`} className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-[#E91E63] hover:shadow-md transition-all group flex flex-col items-center text-center justify-between cursor-pointer">
                <div className={`w-11 h-11 rounded-xl ${srv.color} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform`}>
                  <IconComp size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#2D1347] group-hover:text-[#E91E63] transition-colors leading-tight">{srv.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{srv.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── INSURANCE APPLICATION MODAL ── */}
      <InsuranceApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        plan={plan}
        selectedOption={selectedCostOption}
        numberOfTravelers={numberOfTravelers}
      />
    </div>
  );
};

export default InsurancePlanDetailView;
