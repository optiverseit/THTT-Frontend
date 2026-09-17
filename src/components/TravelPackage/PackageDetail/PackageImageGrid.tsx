import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, X, ChevronLeft, ChevronRight, Check, Star, MapPin, Clock, Share2, Printer } from "lucide-react";
import type { Package } from "../../../assets/data/types";
import { useGlobalCurrency } from "../../../context/CurrencyContext";
import ShareModal from "../../reuseable/ShareModal";
import Logo from "../../../assets/images/Logo.png";

interface PackageProp {
  pkg: any;
}

const PackageImageGrid: React.FC<PackageProp> = ({ pkg }) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const [copied, setCopied] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  const handlePrint = () => {
    const originalTitle = document.title;
    const packageTitle = pkg.title || "Travel Package";
    document.title = `${packageTitle} - Quotation - Trip Himalaya`;
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

  const basePackagePriceInUSD = Number(pkg.price?.replace(/[^0-9]/g, "") || 85);
  const calculatedNPRPrice = basePackagePriceInUSD * nprPerOneDollar;

  const startsFromDisplayPrice =
    selectedCurrency === "nepali"
      ? `NPR ${Math.round(calculatedNPRPrice).toLocaleString("en-IN")}`
      : selectedCurrency === "inr"
      ? `RS ${Math.round(calculatedNPRPrice / nprPerOneINR).toLocaleString("en-IN")}`
      : pkg.price || `$${basePackagePriceInUSD}`;

  const navigate = useNavigate();
  const location = useLocation();

  const galleryImages =
    pkg.gallery && pkg.gallery.length >= 5
      ? pkg.gallery
      : [
          pkg.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
          "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
        ];

  const outletItems = [
    { name: "OVERVIEW", path: `/details/${pkg.id}` },
    { name: "POLICIES", path: `/details/${pkg.id}/policies` },
    { name: "FAQS", path: `/details/${pkg.id}/faqs` },
    { name: "TESTIMONIES", path: `/details/${pkg.id}/testimonies` },
  ];

  const isTabActive = (tabPath: string) => {
    if (tabPath === `/details/${pkg.id}`) {
      return (
        location.pathname === `/details/${pkg.id}` ||
        location.pathname === `/details/${pkg.id}/`
      );
    }
    return location.pathname.startsWith(tabPath);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);

  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );

  const isTour = pkg.type === "tour";
  const isActivity = pkg.type === "activity" || pkg.type === "combo";
  const isTrekking = pkg.type === "trekking";

  const contactTeam = isTour
    ? "Tours & Holidays Team"
    : isActivity
    ? "Adventure Activity Team"
    : "Trekking & Adventure Activity Team";

  const contactPhone = "+977 9851403761";
  const contactEmail = "pradip.triphimalayatt@gmail.com";
  const contactWhatsApp = "9779851403761";

  const handleWhatsAppInquiry = () => {
    const locationInfo = pkg.location ? ` (${pkg.location})` : "";
    const durationInfo = pkg.duration ? ` - Duration: ${pkg.duration}.` : "";
    const priceInfo = startsFromDisplayPrice ? ` Starting price: ${startsFromDisplayPrice}.` : "";
    const msg = encodeURIComponent(
      `Hello Trip Himalaya (${contactTeam})! I am interested in "${pkg.title}"${locationInfo}${durationInfo}${priceInfo} Please share availability and details.`
    );
    window.open(`https://wa.me/${contactWhatsApp}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const categoryLabel =
    pkg.type === "trekking" ? "Trekking" :
    pkg.type === "tour" ? "Tour Package" :
    pkg.type === "activity" ? "Adventure Activity" :
    pkg.category === "international" ? "International" : "Experience";

  const categoryColor =
    pkg.type === "trekking" ? "bg-emerald-500" :
    pkg.type === "tour" ? "bg-blue-500" :
    pkg.type === "activity" ? "bg-[#E91E63]" : "bg-purple-500";

  const packageIconText =
    pkg.type === "trekking" ? "T" :
    pkg.type === "tour" ? "T" :
    pkg.type === "activity" ? "A" : "P";

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  /* ── Comprehensive data fallback lists for complete PDF / Print dossier ── */
  const printingTable = pkg.pricingTable && pkg.pricingTable.length > 0
    ? pkg.pricingTable
    : [
        { service: "Standard Experience", ageGroup: "Adult (16+)", priceNepali: `NPR ${Math.round(calculatedNPRPrice).toLocaleString("en-IN")}`, priceForeigner: pkg.price || `$${basePackagePriceInUSD}` },
        { service: "VIP Tandem + Media Pack", ageGroup: "All Ages", priceNepali: `NPR ${Math.round(calculatedNPRPrice * 1.3).toLocaleString("en-IN")}`, priceForeigner: `$${Math.round(basePackagePriceInUSD * 1.3)}` },
        { service: "Student / Youth Special", ageGroup: "Youth (12-15)", priceNepali: `NPR ${Math.round(calculatedNPRPrice * 0.85).toLocaleString("en-IN")}`, priceForeigner: `$${Math.round(basePackagePriceInUSD * 0.85)}` },
      ];

  const itineraryList = pkg.allItenary && pkg.allItenary.length > 0 ? pkg.allItenary : [
    { day: "1", title: "Hotel Pickup & Base Station Transfer", desc: "Enjoy comfortable private pickup directly from your hotel with scenic transfer to our activity briefing lounge." },
    { day: "2", title: "Preparation & Safety Briefing", desc: "Meet with your certified tandem master, review wind conditions and safety protocols, and strap into safety gear." },
    { day: "3", title: "Scenic Mountain Ascent to Launch Point", desc: "Drive up through scenic winding mountain roads to the launch vantage point with panoramic Himalayan vistas." },
    { day: "4", title: `Main ${pkg.title} Experience`, desc: "Experience the exhilarating core adventure with professional guidance and live 4K GoPro video recording." },
    { day: "5", title: "Gentle Landing & Refreshment", desc: "Perform a safe, smooth touchdown at the lakeside landing zone followed by fresh refreshments." },
    { day: "6", title: "Media Handover & Hotel Drop-off", desc: "Receive your high-definition aerial video footage and action photos directly on your device, with return hotel transfer." },
  ];

  const highlightsList = pkg.highlights && pkg.highlights.length > 0 ? pkg.highlights : [
    "Panoramic views of Himalayan ranges and valleys",
    "Internationally certified and experienced tandem pilots",
    "High-definition 4K aerial photography & video recording",
    "Full safety briefing and top-tier imported safety harness gear",
    "Complimentary private hotel pickup and drop-off service",
    "Official flight certificate & high-resolution media package",
  ];

  const includesList = pkg.allIncludes && pkg.allIncludes.length > 0 ? pkg.allIncludes : (pkg.includes && pkg.includes.length > 0 ? pkg.includes : [
    "Certified English-speaking guide and expert instructor",
    "All essential safety equipment and gear rental",
    "Hotel pickup & drop-off within city center",
    "Complimentary action photos & 4K video recording",
    "Govt taxes and emergency first-aid kit",
  ]);

  const excludesList = pkg.allExcludes && pkg.allExcludes.length > 0 ? pkg.allExcludes : (pkg.excludes && pkg.excludes.length > 0 ? pkg.excludes : [
    "Personal travel insurance (mandatory)",
    "Alcoholic beverages and personal snacks",
    "Tips & gratitude for instructor and crew",
    "Extra personal expenses not specified",
  ]);

  const restrictionsList = pkg.restrictions && pkg.restrictions.length > 0 ? pkg.restrictions : [
    "Maximum weight limit: 110 kg (242 lbs)",
    "Minimum age requirement: 12 years with parental consent",
    "Not recommended for pregnant travelers or individuals with acute heart conditions",
    "Participants must wear sturdy closed-toe footwear",
  ];

  const whatToBringList = pkg.whatToBring && pkg.whatToBring.length > 0 ? pkg.whatToBring : [
    "Comfortable sports clothing and windproof jacket",
    "Sturdy running or hiking shoes",
    "UV protection sunglasses and sunscreen",
    "Valid government ID or passport copy",
    "Personal water bottle and lightweight daypack",
  ];

  const faqsList = pkg.allfaqs && pkg.allfaqs.length > 0 ? pkg.allfaqs : [
    { question: `What is the cancellation and rescheduling policy for ${pkg.title}?`, answer: "100% full refund if cancelled up to 24 hours prior to departure. In the event of unsuitable weather conditions, Trip Himalaya offers free immediate rescheduling or a 100% full refund." },
    { question: "Is prior experience required to participate?", answer: "No prior experience is necessary. All activities are conducted tandem or fully guided by certified master instructors with years of Himalayan experience." },
    { question: "Are transport and safety gear included?", answer: "Yes, complete safety gear, harness/equipment, and round-trip hotel pickup/drop-off within the city are included." },
    { question: "Is personal travel insurance required?", answer: "Yes, personal travel insurance covering medical emergency and adventure activities is strongly advised and mandatory for high-altitude activities." },
  ];

  return (
    <div className="w-full bg-[#FBFBFE]">

      {/* ══════════════════════════════════════════════════════════
          PRINT-ONLY COMPREHENSIVE DOSSIER & QUOTATION
          Includes all details: Itinerary, Inclusions, Exclusions,
          Restrictions, What to Bring, Pricing, FAQs, and Policies.
          ══════════════════════════════════════════════════════════ */}
      <div
        className="hidden print:block relative"
        style={{
          fontFamily: "'Inter', Arial, sans-serif",
          fontSize: "9.5px",
          lineHeight: "1.45",
          color: "#1e293b",
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
        <div style={{ background: "linear-gradient(135deg, #2D1347 0%, #3B145C 50%, #4a1c7a 100%)", borderRadius: "10px 10px 0 0", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "#ffffff", borderRadius: "8px", padding: "3px 6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src={Logo} alt="Trip Himalaya" style={{ height: "96px", width: "auto", objectFit: "contain", display: "block" }} />
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.01em", margin: 0 }}>
                Trip Himalaya Tours &amp; Travel Pvt. Ltd.
              </div>
              <div style={{ fontSize: "9px", color: "#f3e8ff", margin: "3px 0 0", lineHeight: "1.4" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center" }}>
                    <MapPin size={10} color="#f472b6" style={{ marginRight: "4px", flexShrink: 0 }} />
                    Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal
                  </span>
                  <span>📞 {contactPhone}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "3px" }}>
                  <span>✉ {contactEmail}</span>
                  <span>🌐 www.triphimalaya.com.np</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, whiteSpace: "nowrap", alignSelf: "flex-end", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", paddingBottom: "2px" }}>
            <div style={{ fontSize: "8.5px", background: "rgba(233, 30, 99, 0.25)", color: "#fbcfe8", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, border: "1px solid rgba(233, 30, 99, 0.4)" }}>
              {contactTeam}
            </div>
            <div style={{ fontSize: "9.5px", color: "#e9d5ff", whiteSpace: "nowrap" }}>
              Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>
        {/* Project brand accent strip */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #E91E63 0%, #db2777 30%, #9333ea 70%, #2D1347 100%)", marginBottom: "10px" }} />

        {/* ── PACKAGE SUMMARY & OVERVIEW CARD ── */}
        <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px", background: "#fdf4ff", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#2D1347", lineHeight: 1.2 }}>{pkg.title}</div>
              <div style={{ fontSize: "8.5px", color: "#6b21a8", marginTop: "4px", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ background: "#2D1347", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>{categoryLabel}</span>
                {pkg.location && <span style={{ background: "#7c3aed", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>📍 {pkg.location}</span>}
                {pkg.duration && <span style={{ background: "#9333ea", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>⏱ {pkg.duration}</span>}
                {pkg.difficulty && <span style={{ background: "#c026d3", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>⚡ {pkg.difficulty}</span>}
                <span style={{ background: "#E91E63", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>★ {pkg.rating || 4.9} / 5.0 ({pkg.reviewsCount || 1} reviews)</span>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "8px", color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Starting From</div>
              <div style={{ fontSize: "16px", fontWeight: 900, color: "#2D1347" }}>{startsFromDisplayPrice}</div>
            </div>
          </div>
          <div style={{ marginTop: "7px", paddingTop: "7px", borderTop: "1px solid #f3e8ff", fontSize: "9px", color: "#4a154b", lineHeight: "1.45" }}>
            <strong style={{ color: "#2D1347" }}>Experience Overview: </strong>
            {pkg.description || `Discover the breathtaking beauty and thrilling experiences of ${pkg.title}. Carefully curated by Trip Himalaya with licensed guides, premier equipment, and unforgettable Himalayan views.`}
          </div>
        </div>

        {/* ── SECTION 1: PRICING SCHEDULE ── */}
        <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "5px" }}>
            1. Pricing Schedule &amp; Package Tiers
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px", border: "1px solid #e9d5ff" }}>
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", color: "#ffffff" }}>
                <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: 800, width: "42%" }}>Service / Experience Tier</th>
                <th style={{ padding: "6px 8px", textAlign: "center", fontWeight: 800, width: "22%" }}>Group / Age Bracket</th>
                <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, width: "18%" }}>Price (NPR)</th>
                <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, width: "18%" }}>Price (USD)</th>
              </tr>
            </thead>
            <tbody>
              {printingTable.map((row: any, idx: number) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? "#ffffff" : "#faf5ff", borderBottom: "1px solid #f3e8ff" }}>
                  <td style={{ padding: "5px 8px", fontWeight: 700, color: "#2D1347" }}>{row.service}</td>
                  <td style={{ padding: "5px 8px", textAlign: "center", color: "#6b21a8" }}>{row.ageGroup}</td>
                  <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 800, color: "#2D1347" }}>{row.priceNepali}</td>
                  <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, color: "#E91E63" }}>{row.priceForeigner}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: "8px", color: "#7c3aed", marginTop: "3px", fontWeight: 500 }}>
            * Rates include certified pilot/guide fees, all safety gear, hotel pickup/drop within city, local tax, and emergency support.
          </div>
        </div>

        {/* ── SECTION 2: DAY-BY-DAY / STEP-BY-STEP ITINERARY ── */}
        <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "6px" }}>
            2. Step-by-Step Experience Itinerary &amp; Timeline
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {itineraryList.map((item: any, i: number) => (
              <div
                key={i}
                style={{
                  border: "1px solid #e9d5ff",
                  borderRadius: "4px",
                  padding: "6px 8px",
                  background: "#faf5ff",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                  pageBreakInside: "avoid",
                  breakInside: "avoid",
                }}
              >
                <div
                  style={{
                    background: "#2D1347",
                    color: "#ffffff",
                    fontSize: "8px",
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: "3px",
                    flexShrink: 0,
                    textTransform: "uppercase",
                  }}
                >
                  {item.day ? `Step ${item.day}` : `Phase ${i + 1}`}
                </div>
                <div>
                  <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#2D1347" }}>{item.title}</div>
                  <div style={{ fontSize: "8.5px", color: "#581c87", marginTop: "1px", lineHeight: "1.35" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 3: TRIP HIGHLIGHTS ── */}
        <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "6px" }}>
            3. Key Highlights &amp; Features
          </div>
          <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "8px 10px", background: "#fdf4ff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
              {highlightsList.map((h: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "9px", color: "#4a154b" }}>
                  <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>✓</span>
                  <span style={{ lineHeight: "1.35" }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: INCLUSIONS & EXCLUSIONS (2 columns) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
          {/* What's Included */}
          <div style={{ border: "1.5px solid #d8b4fe", borderRadius: "6px", padding: "8px 10px", background: "#faf5ff" }}>
            <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
              4. What&apos;s Included
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {includesList.map((inc: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#581c87" }}>
                  <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>✓</span>
                  <span style={{ lineHeight: "1.3" }}>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Excluded */}
          <div style={{ border: "1.5px solid #fecdd3", borderRadius: "6px", padding: "8px 10px", background: "#fff1f2" }}>
            <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#881337", borderBottom: "1.5px solid #fda4af", paddingBottom: "3px", marginBottom: "5px" }}>
              5. What&apos;s Excluded / Not Included
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {excludesList.map((ex: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#4c0519" }}>
                  <span style={{ fontWeight: 900, color: "#be185d", flexShrink: 0 }}>✗</span>
                  <span style={{ lineHeight: "1.3" }}>{ex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 5: SAFETY GUIDELINES, RESTRICTIONS & WHAT TO BRING (2 columns) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
          {/* Restrictions */}
          <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "8px 10px", background: "#fdf4ff" }}>
            <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
              6. Safety Restrictions &amp; Health Rules
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {restrictionsList.map((r: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#4a154b" }}>
                  <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>&bull;</span>
                  <span style={{ lineHeight: "1.3" }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What to Bring */}
          <div style={{ border: "1.5px solid #d8b4fe", borderRadius: "6px", padding: "8px 10px", background: "#faf5ff" }}>
            <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
              7. Packing List &amp; What to Bring
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {whatToBringList.map((b: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#581c87" }}>
                  <span style={{ fontWeight: 900, color: "#9333ea", flexShrink: 0 }}>&bull;</span>
                  <span style={{ lineHeight: "1.3" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 6: FREQUENTLY ASKED QUESTIONS ── */}
        <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "6px" }}>
            8. Important FAQs &amp; Essential Information
          </div>
          <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "8px 10px", background: "#fdf4ff" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {faqsList.map((faq: any, i: number) => (
                <div key={i} style={{ fontSize: "8.5px", color: "#4a154b", lineHeight: "1.35" }}>
                  <div style={{ fontWeight: 800, color: "#2D1347" }}>Q: {faq.question || faq.q}</div>
                  <div style={{ color: "#581c87", marginTop: "1px" }}>A: {faq.answer || faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 7: BOOKING TERMS & CANCELLATION POLICIES ── */}
        <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "7px 10px", marginBottom: "10px", background: "#faf5ff", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
            9. Booking Policies, Terms &amp; Conditions
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 14px", fontSize: "8px", color: "#4a154b", lineHeight: "1.4" }}>
            <div><strong style={{ color: "#2D1347" }}>Cancellation &amp; Refunds:</strong> 100% full refund if cancelled 24+ hours before; 50% refund within 12-24 hours; non-refundable within 12 hours of departure.</div>
            <div><strong style={{ color: "#2D1347" }}>Reservation Deposit:</strong> A 30% advance deposit confirms booking. Balances payable via cash, card, or digital payment upon arrival.</div>
            <div><strong style={{ color: "#2D1347" }}>Weather Guarantee:</strong> In case of unsuitable weather (rain/high winds), Trip Himalaya will reschedule for free or issue a 100% full immediate refund.</div>
            <div><strong style={{ color: "#2D1347" }}>Insurance &amp; Safety:</strong> Personal travel insurance is mandatory. Participants must follow instructor instructions at all times.</div>
          </div>
        </div>

        {/* ── CORPORATE FOOTER ── */}
        <div style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", padding: "8px 14px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "8.5px", color: "#ffffff" }}>
          <div>
            <strong style={{ color: "#ffffff" }}>Trip Himalaya Tours &amp; Travel Pvt. Ltd.</strong> &bull; Registered in Nepal (Lic: 2490)
          </div>
          <div style={{ color: "#fce7f3" }}>
            {contactTeam}: {contactPhone} &bull; {contactEmail}
          </div>
          <div style={{ fontWeight: 700, color: "#f472b6" }}>
            Official Computer-Generated Travel Dossier &bull; Page 1 of 1
          </div>
        </div>
      </div>

      {/* HERO HEADER — visa-page style */}
      <div
        className="print:hidden relative overflow-hidden shadow-lg min-h-[250px] sm:min-h-[280px] flex flex-col justify-end"
        style={{
          backgroundImage: `url('${galleryImages[0]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0520]/92 via-[#1a0836]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#2D1347]/40" />

        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Left: title + meta */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-white tracking-tight drop-shadow-sm leading-tight">
                  {pkg.title}
                </h1>
                <span className={`${categoryColor} text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm flex-shrink-0`}>
                  {categoryLabel}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white/70 mt-1 max-w-xl">
                {pkg.description
                  ? pkg.description.slice(0, 100) + (pkg.description.length > 100 ? "..." : "")
                  : `Explore ${pkg.title} with expert guides — safe, thrilling and unforgettable.`}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-white font-extrabold text-xs">{pkg.rating || 4.9}</span>
                <span className="text-white/60 text-[10px] font-semibold">
                  ({pkg.testimonies?.length || 1} reviews)
                </span>
              </div>
            </div>

            {/* CTA Buttons — bottom on mobile, right on desktop */}
            <div className="print:hidden flex flex-row md:flex-col items-center gap-2 w-full md:w-40 flex-shrink-0 mt-2 md:mt-0">
              <button
                onClick={handleWhatsAppInquiry}
                className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="white" width="13" height="13">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.999 2C6.479 2 2 6.479 2 12c0 1.789.47 3.467 1.29 4.93L2 22l5.232-1.267A9.966 9.966 0 0012 22c5.521 0 10-4.479 10-10S17.521 2 12 2z"/>
                </svg>
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
        </div>

        {/* Share button — top-right corner of hero */}
        <div className="absolute top-14 right-4 sm:top-6 sm:right-6 z-20">
          {isShareOpen && (
            <div className="absolute top-0 right-11 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/80 p-2 flex items-center gap-1.5 min-w-max z-30">
              {/* Facebook */}
              <button
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
                  setIsShareOpen(false);
                }}
                title="Facebook"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                style={{ background: "#1877F2" }}
              >
                <svg viewBox="0 0 24 24" fill="white" width="15" height="15"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </button>
              {/* Instagram */}
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  window.open("https://www.instagram.com/triphimalayatt", "_blank", "noopener,noreferrer");
                  setIsShareOpen(false);
                }}
                title="Instagram"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                style={{ background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}
              >
                <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="white"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
                </svg>
              </button>
              {/* TikTok */}
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  window.open("https://www.tiktok.com/@trip.himalaya", "_blank", "noopener,noreferrer");
                  setIsShareOpen(false);
                }}
                title="TikTok"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                style={{ background: "#000000" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </button>
              {/* LinkedIn */}
              <button
                onClick={() => {
                  window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(pkg.title)}`, "_blank", "noopener,noreferrer");
                  setIsShareOpen(false);
                }}
                title="LinkedIn"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                style={{ background: "#0A66C2" }}
              >
                <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2" fill="white"/>
                </svg>
              </button>
              {/* Twitter/X */}
              <button
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(pkg.title)}`, "_blank", "noopener,noreferrer");
                  setIsShareOpen(false);
                }}
                title="Twitter / X"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                style={{ background: "#000000" }}
              >
                <svg viewBox="0 0 24 24" fill="white" width="13" height="13">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              {/* Copy Link */}
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  setIsShareOpen(false);
                }}
                title={copied ? "Copied!" : "Copy Link"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer ${copied ? "bg-emerald-500" : "bg-gray-700 hover:bg-gray-900"}`}
              >
                {copied ? <Check size={13} color="white" /> : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="13" height="13">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                  </svg>
                )}
              </button>
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-gray-200/80" />
            </div>
          )}
          <button
            onClick={() => setIsShareOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg"
            title="Share"
          >
            <Share2 size={15} />
          </button>
        </div>


      </div>

      {/* THUMBNAIL ROW — 4 photos preserved */}
      <div className="print:hidden w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 w-full">
          <div onClick={() => openLightbox(1)} className="sm:col-span-3 h-32 sm:h-36 md:h-40 rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100">
            <img src={galleryImages[1]} alt={`${pkg.title} 2`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          <div onClick={() => openLightbox(2)} className="sm:col-span-6 h-32 sm:h-36 md:h-40 rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100">
            <img src={galleryImages[2]} alt={`${pkg.title} 3`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="sm:col-span-3 flex flex-col gap-2 h-32 sm:h-36 md:h-40">
            <div onClick={() => openLightbox(3)} className="flex-1 rounded-xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100">
              <img src={galleryImages[3]} alt={`${pkg.title} 4`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            <div onClick={() => openLightbox(4)} className="flex-1 rounded-xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100">
              <img src={galleryImages[4]} alt={`${pkg.title} 5`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION & PRICING BAR */}
      <div className="print:hidden w-full bg-white border-y border-gray-100 shadow-sm relative z-10 mt-6 sm:mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {outletItems.map((item, index) => {
              const active = isTabActive(item.path);
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`py-2 text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer relative ${active ? "text-[#E91E63]" : "text-gray-400 hover:text-[#200B3B]"}`}
                >
                  <span>{item.name}</span>
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E91E63] rounded-full" />}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">STARTS FROM</span>
              <span className="text-xl sm:text-2xl font-black text-[#E91E63]">{startsFromDisplayPrice}</span>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById("pricing-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 sm:px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#E91E63] hover:bg-pink-600 text-white shadow-lg shadow-pink-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div className="print:hidden fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 backdrop-blur-md cursor-pointer">
            <X size={24} />
          </button>
          <button onClick={prevImage} className="absolute left-4 sm:left-8 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md cursor-pointer">
            <ChevronLeft size={24} />
          </button>
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img src={galleryImages[currentImageIndex]} alt="Gallery Preview" className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl" />
            <span className="text-white/80 text-xs font-bold mt-4">Photo {currentImageIndex + 1} of {galleryImages.length}</span>
          </div>
          <button onClick={nextImage} className="absolute right-4 sm:right-8 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md cursor-pointer">
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={{
          title: `${pkg.title} | Trip Himalaya Tours & Travel`,
          text: `Explore ${pkg.title} (${pkg.location || "Nepal"}) - book your adventure with Trip Himalaya!`,
          image: pkg.image || galleryImages[0],
          url: shareUrl,
        }}
      />
    </div>
  );
};

export default PackageImageGrid;
