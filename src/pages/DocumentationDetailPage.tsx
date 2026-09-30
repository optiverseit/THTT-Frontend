import React, { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MessageCircle,
  Printer,
  Clock,
  Share2,
  Check,
  Link2,
  ArrowRight,
  Compass,
} from "lucide-react";
import { DOCUMENTATION_ITEMS, DocumentationItem } from "../data/documentationData";
import {
  shareToPlatform,
  copyToClipboard,
  getCurrentUrl,
  getCrawlerSafeUrl,
} from "../utils/shareUtils";
import PreFooter from "../components/reusable/PreFooter";

export default function DocumentationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const cleanId = (id || "").toLowerCase().trim();
  const currentDoc: DocumentationItem =
    DOCUMENTATION_ITEMS.find((d) => d.id.toLowerCase() === cleanId) ||
    DOCUMENTATION_ITEMS[0];

  // Share dropdown state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cleanId]);

  if (!currentDoc) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center py-24 px-4 bg-gray-50 text-center font-sans">
        <div className="w-20 h-20 rounded-3xl bg-pink-50 text-[#E91E63] flex items-center justify-center mb-6 shadow-sm border border-pink-100 ring-8 ring-pink-50/50">
          <Compass size={40} />
        </div>
        <h2 className="text-3xl font-black text-[#2D1347]">Documentation Not Found</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-md">
          We couldn't find the requested documentation details. Please browse all available document services.
        </p>
        <div className="flex gap-3 mt-8">
          <Link
            to="/documentation"
            className="px-6 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Back to Documentation
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full font-bold text-xs uppercase tracking-wider transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Print handler
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `${currentDoc.name} - Official Dossier - Trip Himalaya`;
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

  // WhatsApp Inquiry handler
  const handleWhatsAppInquiry = () => {
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I am inquiring about "${currentDoc.name}" (${currentDoc.category}). Please guide me on the process.`
    );
    window.open(`https://api.whatsapp.com/send?phone=9779851420882&text=${msg}`, "_blank", "noopener,noreferrer");
  };

  // Share data setup
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `${currentDoc.name} | Trip Himalaya Documentation`;
  const shareText = `Check out official documentation services for ${currentDoc.name} on Trip Himalaya!`;
  const shareData = {
    title: shareTitle,
    text: shareText,
    url: currentUrl,
    image: currentDoc.heroImage,
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
  ];

  const handleCopyLink = async () => {
    const success = await copyToClipboard(getCrawlerSafeUrl(getCurrentUrl()));
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Other documents list for the bottom section
  const otherDocs = DOCUMENTATION_ITEMS.filter((d) => d.id !== currentDoc.id);

  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-6 sm:pt-8 md:pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">

        {/* ══════════════════════════════════════════════════════════════════
            PRINT-ONLY OFFICIAL DOSSIER SUMMARY
            ══════════════════════════════════════════════════════════════════ */}
        <div
          className="hidden print:flex flex-col justify-between font-sans relative print-page-container p-6 border border-gray-300 rounded-xl bg-white"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "10px",
            lineHeight: "1.4",
            color: "#1e293b",
          }}
        >
          <div className="border-b-2 border-[#2D1347] pb-4 mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-black text-[#2D1347] uppercase tracking-wide">
                Trip Himalaya Tours & Travels Pvt. Ltd.
              </h1>
              <p className="text-xs text-gray-600">Official Documentation & Legal Verification Services Desk</p>
              <p className="text-[9px] text-gray-500">Reg. No: 2490 • Shambhu Marg, Airport, Kathmandu, Nepal</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded text-xs font-bold">
                Official Dossier
              </span>
              <p className="text-[9px] text-gray-500 mt-1">24/7 Helpline: +977 9851420882</p>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-base font-black text-[#2D1347]">{currentDoc.name}</h2>
            <p className="text-xs text-gray-600 mb-2">{currentDoc.subtitle}</p>
            <div className="cms-content text-xs text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: currentDoc.aboutText }} />
          </div>

          <div className="border-t pt-3 flex justify-between text-[9px] text-gray-500">
            <span>Trip Himalaya Verification Desk • Kathmandu, Nepal</span>
            <span>Printed for Reference • Computer Generated Dossier</span>
          </div>
        </div>

        {/* ── HERO HEADER BANNER ── */}
        <div
          className="print:hidden relative rounded-3xl overflow-hidden shadow-lg min-h-[220px] sm:min-h-[260px] flex flex-col justify-end"
          style={{
            backgroundImage: `url('${currentDoc.heroImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0520]/92 via-[#1a0836]/65 to-transparent print:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#2D1347]/40 print:hidden" />

          {/* Content */}
          <div className="relative z-10 pt-14 px-4 pb-4 sm:pt-16 sm:px-6 sm:pb-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${currentDoc.badgeColor}`}>
                      {currentDoc.badge}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                    {currentDoc.name}
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-white/80 mt-1 max-w-2xl leading-relaxed">
                    {currentDoc.subtitle}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="print:hidden flex flex-row md:flex-col items-center gap-2 w-full md:w-44 flex-shrink-0 mt-2 md:mt-0">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  <MessageCircle size={15} />
                  <span>Ask on WhatsApp</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white/85 hover:text-white rounded-xl text-[11px] font-semibold transition-all cursor-pointer"
                  title="Print or Save Official Checklist"
                >
                  <Printer size={13} />
                  <span>Print Checklist PDF</span>
                </button>
              </div>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5 text-xs font-semibold">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
                <Clock size={14} className="text-emerald-300" />
                <span>Turnaround: <strong>{currentDoc.processingTime}</strong></span>
              </div>
            </div>
          </div>

          {/* Share Button — top-right */}
          <div ref={shareRef} className="print:hidden absolute top-3 right-4 sm:top-4 sm:right-6 z-20">
            {isShareOpen && (
              <div className="absolute top-11 right-0 sm:top-0 sm:right-11 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/80 p-2 flex items-center gap-1.5 flex-nowrap min-w-max animate-in fade-in duration-150 z-30">
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
                <button
                  onClick={handleCopyLink}
                  title={isCopied ? "Copied!" : "Copy Link"}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer ${
                    isCopied ? "bg-emerald-500" : "bg-gray-700 hover:bg-gray-900"
                  }`}
                >
                  {isCopied ? <Check size={13} color="white" /> : <Link2 size={13} color="white" />}
                </button>
              </div>
            )}
            <button
              onClick={() => setIsShareOpen((prev) => !prev)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                isShareOpen
                  ? "bg-white text-[#2D1347]"
                  : "bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 text-white"
              }`}
              title="Share this page"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* ── ABOUT CONTENT SECTION ── */}
        <div className="print:hidden">
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#2D1347] tracking-tight">
              About {currentDoc.name}
            </h2>
            {/* CMS / Rich Text Content Container */}
            <div
              className="cms-content text-sm sm:text-base text-gray-700 leading-relaxed font-normal"
              dangerouslySetInnerHTML={{ __html: currentDoc.aboutText }}
            />
          </div>
        </div>

        {/* ── BROWSE OTHER DOCUMENTATION SERVICES ── */}
        <section className="print:hidden pt-8 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
                Other Documentation Services
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Explore complete attestation, permits, and clearance solutions
              </p>
            </div>
            <Link
              to="/documentation"
              className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1.5 transition"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherDocs.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/documentation/${doc.id}`)}
                className="group relative rounded-2xl overflow-hidden h-52 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={doc.heroImage}
                  alt={doc.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 space-y-1">
                  <span className="text-[9px] font-bold text-pink-300 uppercase tracking-wider block">
                    {doc.category}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-pink-200 transition-colors line-clamp-1">
                    {doc.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-gray-300 font-medium pt-1">
                    <span>{doc.processingTime}</span>
                    <span>•</span>
                    <span className="text-pink-400 group-hover:translate-x-1 transition-transform flex items-center">
                      Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRE-FOOTER CTA ── */}
        <div className="print:hidden pt-4">
          <PreFooter
            title="Need a custom document solution?"
            description="Tell us what documents you need — we handle special embassy attestations, translations, and expedited clearances."
            btn1="Talk to an expert"
            btn2="Get a Free Quote"
          />
        </div>
      </div>
    </div>
  );
}
