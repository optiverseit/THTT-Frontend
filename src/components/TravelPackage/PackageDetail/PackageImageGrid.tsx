import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, X, ChevronLeft, ChevronRight, Check, Star, MapPin, Clock, Share2, Printer, Mail, Phone, Globe } from "lucide-react";
import type { Package } from "../../../assets/data/types";
import { useGlobalCurrency, displayPrice } from "../../../context/CurrencyContext";
import ShareModal from "../../reusable/ShareModal";
import SharePopover from "../../reusable/SharePopover";
import Logo from "../../../assets/images/Logo.png";
import { formatDescription } from "../../../utils/formatDescription";
import {
  getPublicPackageGallery,
  getPackagePublicGallery,
} from "../../../api/BackendApi";
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
  const basePackagePriceNPR = Number(pkg.price || 0);
  const startsFromDisplayPrice = displayPrice(
    basePackagePriceNPR,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );
  const navigate = useNavigate();
  const location = useLocation();

  // Primary package image from API
  const mainImage = pkg.image || pkg.image_url || pkg.thumbnail || "";

  // Raw gallery images strictly from API
  const rawGallery: string[] = Array.isArray(pkg.gallery)
    ? pkg.gallery
        .map((g: any) =>
          typeof g === "string"
            ? g.trim()
            : (g?.image_url || g?.image || g?.url || g?.image_path || "").trim()
        )
        .filter(Boolean)
    : [];

  const [directGallery, setDirectGallery] = useState<string[]>([]);

  // Direct fetch fallback if gallery hasn't populated yet from parent
  useEffect(() => {
    if (rawGallery.length === 0 && pkg?.id) {
      const fetchGallery = async () => {
        try {
          const res = await getPublicPackageGallery(pkg.id);
          const d = res.data?.data;
          const items = Array.isArray(d?.data)
            ? d.data
            : Array.isArray(d)
            ? d
            : Array.isArray(res.data)
            ? res.data
            : [];
          const urls = items
            .map((g: any) =>
              typeof g === "string"
                ? g.trim()
                : (g?.image_url || g?.image || g?.url || g?.image_path || "").trim()
            )
            .filter(Boolean);
          if (urls.length > 0) {
            setDirectGallery(urls);
            return;
          }
        } catch (_) {}

        try {
          const resFallback = await getPackagePublicGallery(pkg.id);
          const d = resFallback.data?.data;
          const items = Array.isArray(d?.data)
            ? d.data
            : Array.isArray(d)
            ? d
            : Array.isArray(resFallback.data)
            ? resFallback.data
            : [];
          const urls = items
            .map((g: any) =>
              typeof g === "string"
                ? g.trim()
                : (g?.image_url || g?.image || g?.url || g?.image_path || "").trim()
            )
            .filter(Boolean);
          if (urls.length > 0) {
            setDirectGallery(urls);
          }
        } catch (_) {}
      };

      fetchGallery();
    }
  }, [rawGallery.length, pkg?.id]);

  // Gallery strictly containing available API images — no mock fallbacks
  const galleryImages: string[] = rawGallery.length > 0 ? rawGallery : directGallery;

  // Hero header background image (main image or first gallery image)
  const heroImage = mainImage || (galleryImages.length > 0 ? galleryImages[0] : "");

  // Lightbox covers gallery images, or hero image if no gallery
  const lightboxImages: string[] =
    galleryImages.length > 0 ? galleryImages : (heroImage ? [heroImage] : []);

  const imageErrorFallback = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    img.onerror = null;
    img.src =
      "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#2D1347"/><stop offset="1" stop-color="#4a154b"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="20" font-family="sans-serif">Image Unavailable</text></svg>'
      );
  };
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
    setCurrentImageIndex((prev) => (prev + 1) % (lightboxImages.length || 1));
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + (lightboxImages.length || 1)) % (lightboxImages.length || 1)
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
const printingTable = Array.isArray(pkg.pricingTable) ? pkg.pricingTable : [];
const itineraryList = Array.isArray(pkg.allItenary) ? pkg.allItenary : [];
const highlightsList = Array.isArray(pkg.highlights) ? pkg.highlights : [];
const includesList = Array.isArray(pkg.allIncludes) ? pkg.allIncludes : [];
const excludesList = Array.isArray(pkg.allExcludes) ? pkg.allExcludes : [];
const restrictionsList = Array.isArray(pkg.restrictions) ? pkg.restrictions : [];
const whatToBringList = Array.isArray(pkg.whatToBring) ? pkg.whatToBring : [];
const faqsList = Array.isArray(pkg.allfaqs) ? pkg.allfaqs : [];
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
              <div style={{ fontSize: "9px", color: "#f3e8ff", margin: "4px 0 0", lineHeight: "1.45" }}>
                {/* 1. Location */}
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <MapPin size={9.5} color="#f472b6" style={{ flexShrink: 0 }} />
                  <span>Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal</span>
                </div>
                {/* 2. Email */}
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                  <Mail size={9.5} color="#f472b6" style={{ flexShrink: 0 }} />
                  <span>{contactEmail}</span>
                </div>
                {/* 3. Phone and Website */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "2px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                    <Phone size={9} color="#f472b6" style={{ flexShrink: 0 }} />
                    <span>{contactPhone}</span>
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                    <Globe size={9} color="#f472b6" style={{ flexShrink: 0 }} />
                    <span>www.triphimalaya.com.np</span>
                  </span>
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
            <span dangerouslySetInnerHTML={{ __html: formatDescription(pkg.description) || `Discover the breathtaking beauty and thrilling experiences of ${pkg.title}. Carefully curated by Trip Himalaya with licensed guides, premier equipment, and unforgettable Himalayan views.` }} />
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
        className="print:hidden relative shadow-lg min-h-[200px] sm:min-h-[280px] flex flex-col justify-end z-20"
        style={{
          backgroundImage: heroImage ? `url('${heroImage}')` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1a0836",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0520]/92 via-[#1a0836]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#2D1347]/40" />
        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: title + meta */}
            <div className="min-w-0 flex-1 pr-12 sm:pr-14 md:pr-0">
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
                  ? <span dangerouslySetInnerHTML={{ __html: pkg.description.slice(0, 100) + (pkg.description.length > 100 ? "..." : "") }} />
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
                  ({Array.isArray(pkg.testimonies) && pkg.testimonies.length > 0 ? pkg.testimonies.length : (Array.isArray(pkg.testimonials) && pkg.testimonials.length > 0 ? pkg.testimonials.length : 0)} reviews)
                </span>
              </div>
            </div>
            {/* CTA Buttons — bottom on mobile, right on desktop */}
            <div className="print:hidden flex flex-row md:flex-col items-center gap-2 w-full md:w-40 flex-shrink-0 mt-2 md:mt-0 md:mr-3 lg:mr-6 xl:mr-8">
              <button
                onClick={handleWhatsAppInquiry}
                className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="white" width="13" height="13">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M11.999 2C6.479 2 2 6.479 2 12c0 1.789.47 3.467 1.29 4.93L2 22l5.232-1.267A9.966 9.966 0 0012 22c5.521 0 10-4.479 10-10S17.521 2 12 2z" />
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
        <div className="absolute top-8 right-4 sm:top-10 sm:right-8 md:top-16 md:right-11 lg:right-14 xl:right-16 z-30">
          <div className="relative">
            <button
              onClick={() => setIsShareOpen((prev) => !prev)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                isShareOpen
                  ? "bg-white text-gray-900 shadow-xl"
                  : "bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 text-white"
              }`}
              title="Share"
              aria-label="Share package"
            >
              <Share2 size={16} />
            </button>

            {isShareOpen && (
              <SharePopover
                onClose={() => setIsShareOpen(false)}
                title={pkg.title}
                subtitle={
                  pkg.location
                    ? `Explore ${pkg.location} with Trip Himalaya.`
                    : "Explore the best travel packages with Trip Himalaya."
                }
                image={heroImage || (lightboxImages.length > 0 ? lightboxImages[0] : "")}
                url={shareUrl}
                onDownloadPdf={handlePrint}
                align="right"
              />
            )}
          </div>
        </div>
      </div>
      {/* THUMBNAIL GRID — dynamic layout based strictly on available API gallery images */}
      {galleryImages.length > 0 && (
        <div className="print:hidden w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
          {/* ── 1 IMAGE AVAILABLE: Single Full-Width Card ── */}
          {galleryImages.length === 1 && (
            <div
              onClick={() => openLightbox(0)}
              className="w-full h-44 sm:h-56 md:h-64 rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100"
            >
              <img
                onError={imageErrorFallback}
                src={galleryImages[0]}
                alt={`${pkg.title} 1`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
          )}

          {/* ── 2 IMAGES AVAILABLE: 2-Column Equal Grid ── */}
          {galleryImages.length === 2 && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
              {galleryImages.slice(0, 2).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(idx)}
                  className="h-36 sm:h-44 md:h-52 rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100"
                >
                  <img
                    onError={imageErrorFallback}
                    src={img}
                    alt={`${pkg.title} ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* ── 3 IMAGES AVAILABLE: 3-Column Equal Grid ── */}
          {galleryImages.length === 3 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
              {galleryImages.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(idx)}
                  className="h-32 sm:h-40 md:h-48 rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100"
                >
                  <img
                    onError={imageErrorFallback}
                    src={img}
                    alt={`${pkg.title} ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* ── 4 OR MORE IMAGES AVAILABLE: 4-Item Mosaic Grid ── */}
          {galleryImages.length >= 4 && (
            <>
              {/* Mobile: 4-col single row */}
              <div className="grid grid-cols-4 sm:hidden gap-1.5">
                {galleryImages.slice(0, 4).map((img: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(idx)}
                    className="relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer group bg-gray-100 shadow-xs border border-gray-100"
                  >
                    <img
                      onError={imageErrorFallback}
                      src={img}
                      alt={`${pkg.title} ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    {idx === 3 && galleryImages.length > 4 && (
                      <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px] flex items-center justify-center text-white text-[11px] font-black tracking-tight">
                        +{galleryImages.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Tablet/Desktop: 12-col mosaic layout */}
              <div className="hidden sm:grid grid-cols-12 gap-3 w-full">
                <div
                  onClick={() => openLightbox(0)}
                  className="col-span-3 h-36 md:h-40 rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100"
                >
                  <img
                    onError={imageErrorFallback}
                    src={galleryImages[0]}
                    alt={`${pkg.title} 1`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                <div
                  onClick={() => openLightbox(1)}
                  className="col-span-6 h-36 md:h-40 rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100"
                >
                  <img
                    onError={imageErrorFallback}
                    src={galleryImages[1]}
                    alt={`${pkg.title} 2`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                <div className="col-span-3 flex flex-col gap-2 h-36 md:h-40">
                  <div
                    onClick={() => openLightbox(2)}
                    className="flex-1 rounded-xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100"
                  >
                    <img
                      onError={imageErrorFallback}
                      src={galleryImages[2]}
                      alt={`${pkg.title} 3`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>

                  <div
                    onClick={() => openLightbox(3)}
                    className="flex-1 rounded-xl overflow-hidden cursor-pointer group bg-gray-100 relative shadow-sm border border-gray-100"
                  >
                    <img
                      onError={imageErrorFallback}
                      src={galleryImages[3]}
                      alt={`${pkg.title} 4`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    {galleryImages.length > 4 && (
                      <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px] flex items-center justify-center text-white text-xs font-black tracking-tight">
                        +{galleryImages.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {/* SUB-NAVIGATION & PRICING BAR */}
      <div className="print:hidden w-full bg-white border-y border-gray-100 shadow-sm relative z-10 mt-3 sm:mt-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Tab nav — scrollable on mobile */}
          <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto scrollbar-none border-b border-gray-100 py-0">
            {outletItems.map((item, index) => {
              const active = isTabActive(item.path);
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`py-3 text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer relative flex-shrink-0 ${
                    active ? "text-[#E91E63]" : "text-gray-400 hover:text-[#200B3B]"
                  }`}
                >
                  <span>{item.name}</span>
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E91E63] rounded-full" />}
                </button>
              );
            })}
          </div>
          {/* Price + Book Now row */}
          <div className="flex items-center justify-between gap-3 py-2.5 sm:py-3">
            <div className="text-left">
              <span className="block text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">STARTS FROM</span>
              <span className="text-lg sm:text-2xl font-black text-[#E91E63]">{startsFromDisplayPrice}</span>
            </div>
            <button
              onClick={() => {
                const el = window.innerWidth >= 1024
                  ? document.getElementById("pricing-section-desktop") || document.getElementById("pricing-section")
                  : document.getElementById("pricing-section") || document.getElementById("pricing-section-desktop");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-[#E91E63] hover:bg-pink-600 text-white shadow-lg shadow-pink-600/20 transition-all cursor-pointer whitespace-nowrap"
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
            <img onError={imageErrorFallback} src={lightboxImages[currentImageIndex] || heroImage} alt="Gallery Preview" className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl" />
            <span className="text-white/80 text-xs font-bold mt-4">Photo {currentImageIndex + 1} of {lightboxImages.length}</span>
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
          image: heroImage || lightboxImages[0] || Logo,
          url: shareUrl,
        }}
      />
    </div>
  );
};
export default PackageImageGrid;
