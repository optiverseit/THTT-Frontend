import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock3,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  Share2,
  ShieldCheck,
} from "lucide-react";
import PreFooter from "../components/reusable/PreFooter";
import SharePopover from "../components/reusable/SharePopover";
import Logo from "../assets/images/Logo.png";
import { getDocumentById } from "../api/BackendApi";

interface DocumentationItem {
  id: number;
  title: string;
  subtitle: string | null;
  image: string | null;
  image_public_id?: string | null;
  description: string | null;
  status?: string;
  display_order?: number;
}

export default function DocumentationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [document, setDocument] =
    useState<DocumentationItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        setError("Document not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getDocumentById(id);

        if (response?.data?.status && response?.data?.data) {
          setDocument(response.data.data);
        } else {
          setError(
            response?.data?.message || "Document not found."
          );
        }
      } catch (error: any) {
        console.error("Failed to fetch document:", error);

        setError(
          error?.response?.data?.message ||
            "Failed to load document."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I would like to inquire about ${
        document?.title || "your documentation services"
      }.`
    );

    window.open(
      `https://wa.me/9779800000003?text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handlePrint = () => {
    const originalTitle = window.document.title;
    const docName = document?.title || "Document";
    window.document.title = `${docName} - Trip Himalaya Official Clearance`;
    window.print();
    window.addEventListener(
      "afterprint",
      () => {
        window.document.title = originalTitle;
      },
      { once: true }
    );
    setTimeout(() => {
      window.document.title = originalTitle;
    }, 2000);
  };

  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setIsShareOpen(false);
      }
    };
    if (isShareOpen) {
      window.document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShareOpen]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50/50">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#2e1065]" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50/50 px-4 text-center">
        <h2 className="text-2xl font-black text-[#2e1065]">
          Document Not Found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error ||
            "The requested document could not be found."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/documentation")}
          className="mt-6 rounded-xl bg-[#2e1065] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
        >
          Back to Documentation
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 font-sans">

      {/* ══════════════════════════════════════════════════════════
          PRINT-ONLY DOCUMENT DOSSIER (hidden on screen)
      ══════════════════════════════════════════════════════════ */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .doc-screen-only, .print\\:hidden, [data-print-hide="true"] {
            display: none !important;
          }
          .doc-print-dossier {
            display: flex !important;
            flex-direction: column !important;
            min-height: 96vh !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .doc-print-content {
            flex: 1 0 auto !important;
          }
          .doc-print-footer {
            margin-top: auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .doc-print-body {
            font-size: 10.8px !important;
            line-height: 1.5 !important;
            color: #1e293b !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          .doc-print-body p {
            margin-top: 0 !important;
            margin-bottom: 6px !important;
            font-size: 10.8px !important;
            line-height: 1.5 !important;
            color: #1e293b !important;
          }
          .doc-print-body strong, .doc-print-body b {
            font-weight: 800 !important;
            color: #1e1b4b !important;
          }
          .doc-print-body blockquote {
            margin: 6px 0 !important;
            padding: 4px 9px !important;
            background: #fdf4ff !important;
            border-left: 3px solid #9333ea !important;
            border-radius: 4px !important;
          }
          .doc-print-body ol, .doc-print-body ul {
            padding-left: 14px !important;
            margin: 4px 0 !important;
          }
          .doc-print-body li {
            margin-bottom: 2.5px !important;
            font-size: 10.2px !important;
            line-height: 1.4 !important;
          }
        }
      `}</style>
      <div
        className="hidden print:block doc-print-dossier"
        style={{
          fontFamily: "'Inter', Arial, sans-serif",
          fontSize: "10.8px",
          lineHeight: "1.4",
          color: "#1e293b",
          width: "100%",
          boxSizing: "border-box",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* ── WATERMARK ── */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
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
              fontSize: "42px",
              fontWeight: 900,
              color: "rgba(45, 19, 71, 0.05)",
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

        <div className="doc-print-content">
          {/* ── 1. CORPORATE LETTERHEAD HEADER ── */}
        <div style={{
          background: "linear-gradient(135deg, #2D1347 0%, #3B145C 50%, #4a1c7a 100%)",
          borderRadius: "12px 12px 0 0",
          padding: "12px 15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              background: "#ffffff",
              borderRadius: "8px",
              padding: "3px 5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <img src={Logo} alt="Trip Himalaya" style={{ height: "68px", width: "auto", objectFit: "contain", display: "block" }} />
            </div>
            <div>
              <div style={{ fontSize: "14.8px", fontWeight: 900, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.01em", margin: 0 }}>
                Trip Himalaya Tours &amp; Travel Pvt. Ltd.
              </div>
              <div style={{ fontSize: "9px", color: "#f3e8ff", margin: "2px 0 0", lineHeight: "1.3" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={9} color="#f472b6" style={{ flexShrink: 0 }} />
                  <span>Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                  <Mail size={9} color="#f472b6" style={{ flexShrink: 0 }} />
                  <span>triphimalayatt@gmail.com</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", whiteSpace: "nowrap" }}>
                    <Phone size={8.5} color="#f472b6" style={{ flexShrink: 0 }} />
                    <span>+977-9851420882</span>
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", whiteSpace: "nowrap" }}>
                    <Globe size={8.5} color="#f472b6" style={{ flexShrink: 0 }} />
                    <span>www.triphimalaya.com.np</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style={{
            textAlign: "right",
            flexShrink: 0,
            whiteSpace: "nowrap",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "2px",
            paddingBottom: "2px",
          }}>
            <div style={{
              fontSize: "8.5px",
              background: "rgba(233, 30, 99, 0.28)",
              color: "#fbcfe8",
              padding: "2px 5px",
              borderRadius: "4px",
              fontWeight: 700,
              border: "1px solid rgba(233, 30, 99, 0.45)",
            }}>
              Documentation &amp; Government Clearance Team
            </div>
            <div style={{ fontSize: "9px", color: "#e9d5ff", fontWeight: 600, whiteSpace: "nowrap" }}>
              Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>

        {/* Brand accent strip */}
        <div style={{ height: "3px", background: "linear-gradient(90deg, #E91E63 0%, #db2777 30%, #9333ea 70%, #2D1347 100%)", marginBottom: "8px" }} />

        {/* ── 2. DOCUMENT SUMMARY & BADGES CARD ── */}
        <div style={{
          border: "1.5px solid #e9d5ff",
          borderRadius: "8px",
          padding: "10px 13px",
          marginBottom: "8px",
          background: "#fdf4ff",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}>
          {/* Title & subtitle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "17px", fontWeight: 900, color: "#2D1347", lineHeight: 1.25 }}>{document.title}</div>
              {document.subtitle && (
                <div style={{ fontSize: "10.2px", color: "#6b21a8", marginTop: "2px", fontWeight: 700 }}>{document.subtitle}</div>
              )}
            </div>
            <span style={{ background: "#2D1347", color: "#fff", padding: "2.5px 7px", borderRadius: "4px", fontWeight: 800, fontSize: "9px", flexShrink: 0 }}>
              Government Clearance
            </span>
          </div>

          {/* Metadata badges */}
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center", marginTop: "6px", paddingTop: "5px", borderTop: "1px solid #f3e8ff" }}>
            <span style={{ background: "#1d4ed8", color: "#fff", padding: "2px 5px", borderRadius: "4px", fontWeight: 700, fontSize: "9px" }}>
              ⏱ Turnaround: 3–5 Business Days
            </span>
            <span style={{ background: "#059669", color: "#fff", padding: "2px 5px", borderRadius: "4px", fontWeight: 700, fontSize: "9px" }}>
              ✓ Official Legal Verification
            </span>
            <span style={{ background: "#7c3aed", color: "#fff", padding: "2px 5px", borderRadius: "4px", fontWeight: 700, fontSize: "9px" }}>
              🏛 Authorized Document Submission
            </span>
          </div>
        </div>

        {/* ── 3. ABOUT {DOCUMENT.TITLE} SECTION (ONLY API DETAILS) ── */}
        <div style={{
          border: "1.5px solid #e9d5ff",
          borderRadius: "8px",
          padding: "11px 14px",
          marginBottom: "8px",
          background: "#ffffff",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}>
          <div style={{
            fontSize: "13.5px",
            fontWeight: 900,
            color: "#2D1347",
            letterSpacing: "-0.01em",
            borderBottom: "2px solid #e9d5ff",
            paddingBottom: "4px",
            marginBottom: "6px",
          }}>
            About {document.title}
          </div>

          {document.description ? (
            <div
              className="doc-print-body"
              style={{
                fontSize: "10.8px",
                lineHeight: "1.5",
                color: "#1e293b",
              }}
              dangerouslySetInnerHTML={{ __html: document.description }}
            />
          ) : (
            <div style={{ fontSize: "10.5px", color: "#64748b" }}>
              No additional documentation details provided.
            </div>
          )}
        </div>
      </div>

        {/* ── CORPORATE FOOTER ── */}
        <div
          className="doc-print-footer"
          style={{
            background: "linear-gradient(90deg, #2D1347, #3B145C)",
            padding: "7px 11px",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "8.5px",
            color: "#ffffff",
            marginTop: "8px",
          }}
        >
          <div>
            <strong style={{ color: "#ffffff" }}>Trip Himalaya Tours &amp; Travel Pvt. Ltd.</strong> &bull; Registered in Nepal (Lic: 2490)
          </div>
          <div style={{ color: "#fce7f3" }}>
            Documentation Team: +977-9851420882 &bull; triphimalayatt@gmail.com
          </div>
          <div style={{ fontWeight: 800, color: "#f472b6" }}>
            Official Computer-Generated Document &bull; Page 1 of 1
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
          Same width as original UI
      ====================================================== */}
      <main data-print-hide="true" className="print:hidden doc-screen-only mx-auto w-full max-w-7xl flex-grow px-4 pb-14 pt-12 sm:px-6 lg:px-8">

        {/* =====================================================
            HERO HEADER BANNER (Aligned like Visa Details Page)
        ====================================================== */}
        <section className="print:hidden relative rounded-3xl shadow-lg min-h-[220px] sm:min-h-[260px] flex flex-col justify-end z-20">
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-r from-[#120524] via-[#200B3B] to-[#2D1347] pointer-events-none"
            style={
              document.image
                ? {
                    backgroundImage: `url('${document.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            {document.image && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0520]/95 via-[#1a0836]/65 to-black/30 print:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#2D1347]/40 print:hidden" />
              </>
            )}
            {!document.image && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-800/25 via-transparent to-transparent pointer-events-none" />
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 pt-14 px-4 pb-4 sm:pt-16 sm:px-6 sm:pb-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Side Info */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                {/* Document Icon in a glassy container */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg text-white">
                  <FileText className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                      {document.title}
                    </h1>
                    <span className="bg-blue-600 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm flex-shrink-0">
                      Government Clearance
                    </span>
                  </div>

                  {document.subtitle && (
                    <p className="text-xs sm:text-sm font-semibold text-white/80 mt-1">
                      {document.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons on the right */}
              <div className="print:hidden flex flex-row md:flex-col items-center gap-2 w-full md:w-44 flex-shrink-0 mt-2 md:mt-12">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-md"
                >
                  <MessageCircle size={13} />
                  <span>Ask on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white/80 hover:text-white rounded-md text-[10px] font-medium transition-all cursor-pointer"
                  title="Print or Save as PDF"
                >
                  <Printer size={11} />
                  <span>Print Checklist PDF</span>
                </button>
              </div>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5 text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
                <Clock3 size={14} className="text-emerald-300" />
                <span>Turnaround: 3–5 Business Days</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
                <ShieldCheck size={14} className="text-sky-300" />
                <span>Official Legal Verification</span>
              </div>
            </div>
          </div>

          {/* ── SHARE BUTTON — top-right of hero ── */}
          <div ref={shareRef} className="print:hidden absolute top-3 right-4 sm:top-4 sm:right-6 z-30">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsShareOpen((prev) => !prev)}
                aria-label="Share this document"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                  isShareOpen
                    ? "bg-white text-gray-900 shadow-xl"
                    : "bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 text-white"
                }`}
              >
                <Share2 size={16} />
              </button>

              {isShareOpen && (
                <SharePopover
                  onClose={() => setIsShareOpen(false)}
                  title={document.title}
                  subtitle={document.subtitle || "Authorized Government Clearance & Documentation Services"}
                  image={document.image || undefined}
                  url={window.location.href}
                  onDownloadPdf={handlePrint}
                  align="right"
                />
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            ABOUT SECTION
        ====================================================== */}
        <section data-print-hide="true" className="print:hidden doc-screen-only mt-8 rounded-[24px] border border-gray-200 bg-white px-7 py-8 shadow-sm sm:px-9 md:px-10 lg:px-11">

          <h2 className="mb-4 text-[26px] font-black leading-tight tracking-tight text-[#2e1065] sm:text-[28px] md:text-[30px]">
            About {document.title}
          </h2>

          {document.description ? (
            <div
              className="
                documentation-rich-content
                w-full
                min-w-0
                max-w-full
                text-[14px]
                leading-[1.75]
                text-gray-700
                sm:text-[15px]
                md:text-[16px]

                [&_*]:max-w-full

                [&_p]:whitespace-normal
                [&_div]:whitespace-normal
                [&_span]:whitespace-normal

                [&_p]:break-words
                [&_div]:break-words
                [&_span]:break-words

                [&_img]:h-auto
                [&_img]:max-w-full

                [&_table]:w-full
                [&_table]:max-w-full
              "
              dangerouslySetInnerHTML={{
                __html: document.description,
              }}
            />
          ) : (
            <p className="text-sm text-gray-500">
              No additional information is available for
              this document.
            </p>
          )}
        </section>
      </main>

      {/* =====================================================
          PRE FOOTER
      ====================================================== */}
      <div className="print:hidden">
        <PreFooter
          title={`Need help with ${document.title}?`}
          description="Our team can guide you through the complete documentation process and requirements."
          btn1="Talk to an expert"
          btn2="Get a Free Quote"
        />
      </div>

      {/* =====================================================
          FLOATING WHATSAPP
      ====================================================== */}
      <div className="print:hidden fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={handleWhatsApp}
          aria-label="Contact us on WhatsApp"
          className="flex items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-xl transition-all hover:scale-110 hover:bg-emerald-600 cursor-pointer"
        >
          <MessageCircle size={26} />
        </button>
      </div>
    </div>
  );
}