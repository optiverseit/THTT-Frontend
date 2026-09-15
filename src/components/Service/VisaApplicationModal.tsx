import React, { useState, useRef } from "react";
import {
  X,
  FileText,
  UploadCloud,
  CheckCircle2,
  Calendar,
  User,
  Mail,
  Phone,
  CreditCard,
  ShieldCheck,
  Plane,
  AlertCircle,
  Clock,
  Printer,
  MessageCircle,
  Copy,
  Check,
  Trash2,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  Headphones,
  CheckCheck,
  Receipt,
  FileCheck,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import THTTLogo from "../../assets/images/THTTLogo.png";

export interface VisaApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: string;
  countryCode: string;
  visaType: string;
  selectedOption: {
    name: string;
    days: string;
    nprPrice: number;
    entryType: string;
  };
}

export const VisaApplicationModal: React.FC<VisaApplicationModalProps> = ({
  isOpen,
  onClose,
  country,
  countryCode,
  visaType,
  selectedOption,
}) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "male",
    dob: "",
    passportNumber: "",
    passportExpiry: "",
    nationality: "",
    email: "",
    phone: "",
    travelDate: "",
    applicantsCount: "1",
    specialNotes: "",
    termsAgreed: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [submittedAt, setSubmittedAt] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const formattedFee = displayPrice(
    selectedOption.nprPrice,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }

    // Generate unique submission tracking number on every submit
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const code = (countryCode || "VISA").toUpperCase().slice(0, 3);
    const generatedId = `THTT-${code}-${randomDigits}`;

    const now = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    setSubmissionId(generatedId);
    setSubmittedAt(now);
    setSubmitted(true);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(submissionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const msg = encodeURIComponent(
      `*Official Visa Application Confirmation*\n\n` +
      `📌 *Submission Number:* ${submissionId}\n` +
      `🌍 *Destination:* ${country} (${visaType})\n` +
      `📋 *Option:* ${selectedOption.name} (${selectedOption.days})\n` +
      `👤 *Applicant Name:* ${formData.fullName}\n` +
      `🛂 *Passport Number:* ${formData.passportNumber}\n` +
      `📅 *Travel Date:* ${formData.travelDate}\n` +
      `📞 *Contact:* ${formData.phone}\n` +
      `✉️ *Email:* ${formData.email}\n` +
      `💵 *Processing Fee:* ${formattedFee}\n\n` +
      `Hello Trip Himalaya (Visa & Documentation Team), I have submitted my visa application online. Please confirm document receipt and advise on embassy processing.`
    );
    window.open(`https://wa.me/9779851420882?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handlePrintSlip = () => {
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Visa_Application_Slip_${submissionId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          @page {
            size: A4 portrait;
            margin: 0;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #fff;
            color: #0f172a;
            font-size: 11.5px;
            line-height: 1.5;
          }

          /* ── PAGE WRAPPER ── */
          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 14mm 14mm 12mm 14mm;
            display: flex;
            flex-direction: column;
            gap: 0;
          }

          /* ── LETTERHEAD ── */
          .letterhead {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 10px;
            border-bottom: 3px solid #000;
            margin-bottom: 12px;
          }
          .lh-left {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .logo-img {
            height: 80px;
            width: auto;
            object-fit: contain;
            flex-shrink: 0;
          }
          .company-name-block {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .company-name-main {
            font-size: 16px;
            font-weight: 900;
            letter-spacing: -0.3px;
            line-height: 1.1;
            color: #000;
          }
          .company-name-main .name-pink {
            color: #000;
          }
          .company-tagline {
            font-size: 9.5px;
            color: #000;
            font-weight: 600;
            margin-top: 3px;
          }
          .company-contact-row {
            font-size: 9px;
            color: #222;
            margin-top: 2px;
            font-weight: 500;
          }
          .lh-right {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
          }
          .official-badge {
            display: inline-block;
            border: 1.5px solid #000;
            color: #000;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 3px 10px;
            border-radius: 3px;
          }
          .slip-date {
            font-size: 9.5px;
            color: #000;
            font-weight: 500;
          }

          /* ── DOC TITLE BAND ── */
          .title-band {
            background: #000;
            color: #fff;
            padding: 9px 14px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .title-band h1 {
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.3px;
            text-transform: uppercase;
          }
          .title-band .destination {
            font-size: 10px;
            color: #ccc;
            font-weight: 600;
          }
          .title-band .doc-id {
            text-align: right;
          }
          .title-band .doc-id-label {
            font-size: 8px;
            color: #aaa;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .title-band .doc-id-val {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            font-weight: 700;
            color: #fff;
            letter-spacing: 0.5px;
          }

          /* ── REFERENCE BOX ── */
          .ref-box {
            display: flex;
            align-items: stretch;
            border: 1px solid #000;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 14px;
          }
          .ref-accent {
            width: 5px;
            background: #000;
            flex-shrink: 0;
          }
          .ref-content {
            flex: 1;
            padding: 8px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fafafa;
          }
          .ref-label {
            font-size: 8.5px;
            font-weight: 800;
            color: #000;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 2px;
          }
          .ref-value {
            font-family: 'Courier New', monospace;
            font-size: 18px;
            font-weight: 700;
            color: #000;
            letter-spacing: 0.5px;
          }

          /* ── SECTION HEADING ── */
          .section-heading {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 7px;
            margin-top: 12px;
          }
          .section-heading .sh-line {
            flex: 1;
            height: 1px;
            background: #000;
          }
          .section-heading .sh-text {
            font-size: 9px;
            font-weight: 800;
            color: #000;
            text-transform: uppercase;
            letter-spacing: 1px;
            white-space: nowrap;
          }

          /* ── DETAIL TABLE ── */
          .detail-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2px;
          }
          .detail-table td {
            padding: 6px 10px;
            border: 1px solid #999;
            vertical-align: top;
          }
          .detail-table tr:nth-child(even) td {
            background: #f5f5f5;
          }
          .detail-table tr:nth-child(odd) td {
            background: #ffffff;
          }
          .td-label {
            font-size: 8.5px;
            font-weight: 700;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 0.7px;
            width: 35%;
          }
          .td-value {
            font-size: 11.5px;
            font-weight: 600;
            color: #000;
          }
          .td-value.mono { font-family: 'Courier New', monospace; }
          .td-value.accent { color: #000; font-weight: 800; }
          .td-value.fee {
            color: #000;
            font-size: 14px;
            font-weight: 900;
            font-family: 'Inter', sans-serif;
          }

          /* ── NOTICE BOX ── */
          .notice-box {
            border: 1px solid #999;
            background: #f9f9f9;
            border-radius: 6px;
            padding: 9px 12px;
            margin-top: 12px;
            font-size: 10px;
            color: #000;
            line-height: 1.5;
          }
          .notice-box strong { color: #000; }

          /* ── CHECKLIST ── */
          .checklist-box {
            border: 1px solid #999;
            border-radius: 6px;
            padding: 9px 12px;
            margin-top: 10px;
            background: #f9f9f9;
          }
          .checklist-title {
            font-size: 8.5px;
            font-weight: 800;
            color: #000;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 6px;
            border-bottom: 1px solid #999;
            padding-bottom: 4px;
          }
          .checklist-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3px 20px;
          }
          .checklist-item {
            display: flex;
            align-items: flex-start;
            gap: 5px;
            font-size: 9.5px;
            color: #000;
            line-height: 1.4;
          }
          .ci-icon {
            color: #000;
            font-weight: 900;
            font-size: 10px;
            flex-shrink: 0;
            margin-top: 1px;
          }

          /* ── FOOTER ── */
          .doc-footer {
            margin-top: auto;
            padding-top: 10px;
            border-top: 1.5px solid #000000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 8.5px;
            color: #000;
          }
          .watermark-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            user-select: none;
            z-index: 999;
          }
          .watermark {
            transform: rotate(-28deg);
            font-size: 38px;
            font-weight: 900;
            color: rgba(45, 19, 71, 0.06);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            line-height: 2.2;
            white-space: nowrap;
            text-align: center;
            mix-blend-mode: multiply;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="watermark-wrapper"><div class="watermark">Trip Himalaya Tours and Travels</div></div>

          <!-- LETTERHEAD -->
          <div class="letterhead">
            <div class="lh-left">
              <img src="${THTTLogo}" class="logo-img" alt="Trip Himalaya Tours and Travels" />
              <div class="company-name-block">
                <div class="company-name-main">Trip Himalaya <span class="name-pink">Tours &amp; Travels Pvt. Ltd.</span></div>
                <div class="company-tagline" style="margin-top:4px;">Govt. Approved Travel &amp; Visa Counseling Agency</div>
                <div class="company-contact-row" style="margin-top:3px;">Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal &nbsp;|&nbsp; +977 9851420882 &nbsp;|&nbsp; dev.triphimalayatt@gmail.com &nbsp;|&nbsp; www.triphimalaya.com.np</div>
              </div>
            </div>
            <div class="lh-right">
              <div class="official-badge">Official Document</div>
              <div class="slip-date">Issued: ${submittedAt}</div>
            </div>
          </div>

          <!-- DOC TITLE BAND -->
          <div class="title-band">
            <div>
              <h1>Visa Application Confirmation Slip</h1>
              <div class="destination">Destination: ${country} &nbsp;/&nbsp; ${visaType}</div>
            </div>
            <div class="doc-id">
              <div class="doc-id-label">Document ID</div>
              <div class="doc-id-val">${submissionId}</div>
            </div>
          </div>

          <!-- SUBMISSION REFERENCE -->
          <div class="ref-box">
            <div class="ref-accent"></div>
            <div class="ref-content">
              <div>
                <div class="ref-label">Official Submission Reference Number</div>
                <div class="ref-value">${submissionId}</div>
              </div>
            </div>
          </div>

          <!-- APPLICANT DETAILS -->
          <div class="section-heading">
            <div class="sh-text">Applicant &amp; Passport Details</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <tr>
              <td class="td-label">Full Name</td>
              <td class="td-value accent">${formData.fullName || "—"}</td>
              <td class="td-label">Passport Number</td>
              <td class="td-value mono">${formData.passportNumber || "—"}</td>
            </tr>
            <tr>
              <td class="td-label">Nationality</td>
              <td class="td-value">${formData.nationality || "—"}</td>
              <td class="td-label">Passport Expiry</td>
              <td class="td-value">${formData.passportExpiry || "—"}</td>
            </tr>
            <tr>
              <td class="td-label">Contact / WhatsApp</td>
              <td class="td-value">${formData.phone || "—"}</td>
              <td class="td-label">Email Address</td>
              <td class="td-value">${formData.email || "—"}</td>
            </tr>
          </table>

          <!-- VISA SERVICE DETAILS -->
          <div class="section-heading">
            <div class="sh-text">Visa Service &amp; Fee Details</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <tr>
              <td class="td-label">Selected Visa Tier</td>
              <td class="td-value accent">${selectedOption.name}</td>
              <td class="td-label">Validity / Stay Duration</td>
              <td class="td-value">${selectedOption.days}</td>
            </tr>
            <tr>
              <td class="td-label">Entry Type</td>
              <td class="td-value">${selectedOption.entryType || "Single Entry"}</td>
              <td class="td-label">Intended Travel Date</td>
              <td class="td-value">${formData.travelDate || "Flexible"}</td>
            </tr>
            <tr>
              <td class="td-label" style="background:#fdf2f8; border-color:#f9a8d4;">Total Processing Fee</td>
              <td class="td-value fee" colspan="3" style="background:#fdf2f8; border-color:#f9a8d4;">${formattedFee} &nbsp;<span style="font-size:9px;font-weight:600;color:#9D174D;">(inclusive of all service charges)</span></td>
            </tr>
          </table>

          <!-- OFFICER NOTICE -->
          <div class="notice-box">
            <strong>Next Step:</strong> Our dedicated Visa Officer will contact you within <strong>15–30 minutes</strong> via WhatsApp or phone call to verify your documents and guide you through the embassy biometric/submission process.
          </div>

          <!-- CHECKLIST -->
          <div class="checklist-box">
            <div class="checklist-title">Embassy Filing Checklist</div>
            <div class="checklist-grid">
              <div class="checklist-item"><span class="ci-icon">✓</span> Original Passport (min. 6 months validity)</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> 2 passport-size photos (white bg, 35×45mm)</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> Bank statement (sufficient closing balance)</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> Confirmed round-trip ticket &amp; hotel vouchers</div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="doc-footer">
            <div class="footer-left">
              This is a system-generated confirmation slip. No physical signature is required.<br>
              For queries: +977 9851420882 &nbsp;|&nbsp; dev.triphimalayatt@gmail.com &nbsp;|&nbsp; www.triphimalaya.com.np
            </div>
            <div class="footer-right">
              Trip Himalaya Tours &amp; Travels<br>
              Ref: ${submissionId} &nbsp;|&nbsp; ${submittedAt}
            </div>
          </div>

        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printContent);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1200);
      }, 350);
    } else {
      window.print();
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setSubmissionId("");
    onClose();
  };

  return (
    <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-3 sm:my-6 flex flex-col max-h-[92vh]">
        
        {/* ── MODAL TOP HEADER ── */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#200B3B] via-[#3B145C] to-[#200B3B] text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
              {countryCode === "EU" ? (
                <span className="text-xl">🇪🇺</span>
              ) : (
                <ReactCountryFlag
                  svg
                  countryCode={countryCode}
                  style={{ width: "1.6em", height: "1.6em", borderRadius: "3px" }}
                />
              )}
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF4FA3] block">
                {submitted ? "Submission Confirmed" : "Official Visa Application"}
              </span>
              <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight text-white">
                {country} – {visaType}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── SELECTED PLAN SUMMARY BAR (Visible only in form view) ── */}
        {!submitted && (
          <div className="bg-[#FAF7FD] px-5 py-2.5 border-b border-purple-100/70 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0">
            <div className="flex items-center gap-2 font-bold text-[#200B3B] flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E91E63] text-white text-[10px] uppercase tracking-wider font-black">
                {selectedOption.entryType || "Single Entry"}
              </span>
              <span className="text-xs">{selectedOption.name}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600 font-semibold text-xs">
                {selectedOption.days} Validity
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Processing Fee:
              </span>
              <span className="text-xs sm:text-sm font-black text-[#E91E63] bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-100">
                {formattedFee}
              </span>
            </div>
          </div>
        )}

        {/* ── MODAL BODY SCROLLABLE ── */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {submitted ? (
            /* =======================================================================
               CONFIRMATION & RECEIPT VIEW — ULTRA-CLEAN, HARMONIOUS & COMPACT
               1. "Thank you [Name]"
               2. "after submit our visa officer contact you soon"
               3. "every submission number need to generate"
               ======================================================================= */
            <div className="space-y-3 text-center animate-in fade-in zoom-in-95 duration-200">
              
              {/* Top Greeting & Status */}
              <div className="space-y-1 pt-0.5">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white mb-0.5 shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50">
                  <CheckCircle2 size={24} className="stroke-[2.5]" />
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <h4 className="text-base sm:text-lg font-black text-[#1A0B2E] tracking-tight">
                    Thank you, {formData.fullName || "Valued Applicant"}!
                  </h4>
                  <BadgeCheck size={18} className="text-emerald-600 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-500">
                  Your visa request for <strong className="text-slate-800 font-semibold">{country} ({visaType})</strong> has been registered.
                </p>
              </div>

              {/* Officer Contact Reassurance Card */}
              <div className="bg-gradient-to-r from-purple-50/70 via-white to-purple-50/50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-left shadow-2xs">
                <div className="flex items-center justify-between gap-1.5 flex-wrap mb-0.5">
                  <span className="text-xs font-black text-[#1A0B2E]">
                    Our Visa Officer will contact you soon
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  A visa specialist will reach out on <strong className="text-slate-800">WhatsApp &amp; Phone</strong> ({formData.phone || "your number"}) to coordinate next steps.
                </p>
              </div>

              {/* Official Digital E-Receipt Voucher Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs text-left">
                
                {/* Submission Reference ID Header Strip */}
                <div className="bg-[#FAF8FD] px-3.5 py-2.5 border-b border-purple-100/70">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block leading-none">
                    OFFICIAL SUBMISSION NUMBER
                  </span>
                  <span className="font-mono font-black text-sm sm:text-base text-[#1A0B2E] tracking-wider mt-0.5 block">
                    {submissionId}
                  </span>
                </div>

                {/* 6 Key Details Grid */}
                <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-white">
                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Applicant</span>
                    <span className="font-bold text-[#1A0B2E] truncate block text-xs mt-0.5">
                      {formData.fullName || "—"}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Passport No.</span>
                    <span className="font-mono font-bold text-[#1A0B2E] uppercase truncate block text-xs mt-0.5">
                      {formData.passportNumber || "—"}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Visa Tier</span>
                    <span className="font-bold text-[#E91E63] truncate block text-xs mt-0.5">
                      {selectedOption.entryType || selectedOption.name}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Processing Fee</span>
                    <span className="font-black text-[#1A0B2E] text-xs mt-0.5 block">
                      {formattedFee}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Travel Date</span>
                    <span className="font-medium text-slate-700 text-xs truncate block mt-0.5">
                      {formData.travelDate || "Flexible"}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Submitted At</span>
                    <span className="font-medium text-slate-700 text-[10.5px] truncate block mt-0.5">
                      {submittedAt}
                    </span>
                  </div>
                </div>

                {/* Desk Status Footer */}
                <div className="px-3.5 py-1.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-900">Desk Status: Document Verification in Progress</span>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrintSlip}
                    className="flex-1 py-2.5 px-3.5 bg-white hover:bg-purple-50/70 border border-purple-200 text-[#1A0B2E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:border-purple-300"
                  >
                    <Printer size={13} className="text-purple-700" />
                    <span>Print Slip</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="flex-1 py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* =======================================================================
               VISA APPLICATION FORM — CLEAN, READABLE & PROPORTIONATE
               ======================================================================= */
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ── SECTION 1: APPLICANT PERSONAL DETAILS ── */}
              <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-[#200B3B] pb-2 border-b border-gray-200/60">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                    <User size={13} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    1. Applicant Personal Details
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name (As printed on Passport) <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nationality <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  </div>

                  {/* WhatsApp Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      WhatsApp / Mobile Phone <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: PASSPORT & TRAVEL PLANS ── */}
              <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-[#200B3B] pb-2 border-b border-gray-200/60">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                    <CreditCard size={13} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    2. Passport &amp; Travel Plans
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Passport Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Passport Number <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.passportNumber}
                      onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-[#200B3B] uppercase focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  </div>

                  {/* Passport Expiry Date */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Passport Expiry Date <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.passportExpiry}
                      onChange={(e) => setFormData({ ...formData, passportExpiry: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  </div>

                  {/* Intended Travel Date */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Intended Travel Date <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: DOCUMENT SUBMISSION (OPTIONAL) ── */}
              <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-[#200B3B] pb-2 border-b border-gray-200/60">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                    <UploadCloud size={13} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    3. Document Submission (Optional for Instant Quote)
                  </h4>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-purple-200 hover:border-[#E91E63] rounded-2xl p-4 bg-white text-center hover:bg-purple-50/30 transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-pink-50 text-[#E91E63] flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
                    <UploadCloud size={18} />
                  </div>
                  <p className="text-xs font-bold text-[#200B3B]">
                    Click or Drag Passport scan &amp; photo here
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    PDF, JPG, PNG up to 10MB (Or attach later via WhatsApp)
                  </p>
                </div>

                {/* Uploaded Files Chips */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                      Attached Documents ({uploadedFiles.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-2xs"
                        >
                          <FileText size={12} className="text-[#E91E63] flex-shrink-0" />
                          <span className="max-w-[140px] truncate">{file.name}</span>
                          <span className="text-[10px] text-gray-400">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(idx);
                            }}
                            className="text-gray-400 hover:text-red-500 ml-1 cursor-pointer"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── ADDITIONAL NOTES ── */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Additional Notes / Special Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.specialNotes}
                  onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all"
                />
              </div>

              {/* ── TERMS & AGREEMENT NOTE ── */}
              <div className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    required
                    type="checkbox"
                    checked={formData.termsAgreed}
                    onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-[#E91E63] focus:ring-[#E91E63] border-gray-300 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I understand that embassy visa processing fees and confirmed tickets are non-refundable as per embassy rules. All information provided above is authentic and accurate.
                  </span>
                </label>
              </div>

              {/* ── ACTION BUTTONS ── */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-7 py-2.5 bg-gradient-to-r from-[#200B3B] to-[#E91E63] hover:from-[#2D1347] hover:to-pink-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-pink-500/25 hover:shadow-pink-500/40 active:scale-98 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Submit Application</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaApplicationModal;
