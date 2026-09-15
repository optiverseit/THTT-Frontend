import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Package } from "../../../assets/data/types";
import {
  X,
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  MessageCircle,
  Printer,
  Copy,
  Check,
  UploadCloud,
  FileText,
  Trash2,
  FileCheck,
  CheckCheck,
  Receipt,
  BadgeCheck,
  Globe,
} from "lucide-react";
import { useGlobalCurrency, displayPrice, formatNPR, formatUSD, formatINR } from "../../../context/CurrencyContext";
import THTTLogo from "../../../assets/images/THTTLogo.png";

export interface BookingItem {
  id?: string;
  title: string;
  duration?: string;
  location?: string;
  price?: string;
  image?: string;
  type?: "tour" | "trek" | "trekking" | "adventure" | "activity" | "package" | string;
  category?: string;
  pricingTable?: Array<{
    service: string;
    ageGroup: string;
    priceNepali: string;
    priceForeigner?: string;
  }>;
}

export interface BookingTier {
  name: string;
  ageGroup: string;
  nprPrice: number;
}

interface BookingModalProps {
  pkg: BookingItem | Package | null;
  isOpen: boolean;
  onClose: () => void;
  initialTierIndex?: number;
  initialGuests?: number;
}

// WhatsApp business numbers
const WHATSAPP_CONTACT_NUMBER = "9779851403761"; // Tours, Trekking & Adventure Activity Team

export const BookingModal: React.FC<BookingModalProps> = ({
  pkg,
  isOpen,
  onClose,
  initialTierIndex = 0,
  initialGuests = 1,
}) => {
  const {
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  // Determine Category (Tour, Trekking, Adventure)
  const getPackageCategory = (): "Tour" | "Trekking" | "Adventure Activity" => {
    if (!pkg) return "Tour";
    const titleLower = (pkg.title || "").toLowerCase();
    const typeLower = ((pkg as any).type || (pkg as any).category || "").toLowerCase();

    if (
      typeLower.includes("trek") ||
      titleLower.includes("trek") ||
      titleLower.includes("camp") ||
      titleLower.includes("circuit")
    ) {
      return "Trekking";
    }
    if (
      typeLower.includes("adv") ||
      typeLower.includes("activ") ||
      titleLower.includes("paragliding") ||
      titleLower.includes("rafting") ||
      titleLower.includes("bungee") ||
      titleLower.includes("canyon") ||
      titleLower.includes("safari") ||
      titleLower.includes("heli")
    ) {
      return "Adventure Activity";
    }
    return "Tour";
  };

  const category = getPackageCategory();
  const assignedTeam =
    category === "Tour"
      ? "Tours & Holidays Team"
      : "Trekking & Adventure Activity Team";

  // Build Pricing Tiers
  const pricingTiers: BookingTier[] = React.useMemo(() => {
    if (!pkg) return [];
    if (pkg.pricingTable && pkg.pricingTable.length > 0) {
      return pkg.pricingTable.map((row) => ({
        name: row.service,
        ageGroup: row.ageGroup,
        nprPrice: Number(row.priceNepali.replace(/[^0-9]/g, "")) || 9500,
      }));
    }

    // Default 3 standard experience tiers as requested
    const baseDigits = Number(pkg.price?.replace(/[^0-9]/g, "") || 0);
    const baseNpr = baseDigits > 0 ? baseDigits * nprPerOneDollar : 9500;

    return [
      {
        name: "Standard Experience",
        ageGroup: "Adult (16+)",
        nprPrice: baseNpr > 0 ? baseNpr : 9500,
      },
      {
        name: "VIP Tandem + Media Pack",
        ageGroup: "All Ages",
        nprPrice: baseNpr > 0 ? Math.round(baseNpr * 1.315) : 12500,
      },
      {
        name: "Student / Youth Special",
        ageGroup: "Youth (12-15)",
        nprPrice: baseNpr > 0 ? Math.round(baseNpr * 0.842) : 8000,
      },
    ];
  }, [pkg, nprPerOneDollar]);

  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(initialTierIndex);
  const [guestsCount, setGuestsCount] = useState<number>(initialGuests);

  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "",
    email: "",
    phone: "",
    travelDate: "",
    pickupAddress: "",
    specialNotes: "",
    termsAgreed: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial selections when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setSelectedTierIndex(initialTierIndex);
      setGuestsCount(initialGuests > 0 ? initialGuests : 1);
      setIsSubmitted(false);
      setIsSubmitting(false);
      setCopied(false);
    }
  }, [isOpen, initialTierIndex, initialGuests, pkg?.id]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !pkg) return null;

  const currentTier = pricingTiers[selectedTierIndex] || pricingTiers[0] || {
    name: "Standard Experience",
    ageGroup: "Adult (16+)",
    nprPrice: 9500,
  };

  // Pricing calculations
  const unitPriceFormatted = displayPrice(
    currentTier.nprPrice,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );

  const totalNpr = currentTier.nprPrice * guestsCount;
  const totalPriceFormatted = displayPrice(
    totalNpr,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert("Please review and accept the booking terms and conditions to proceed.");
      return;
    }

    setIsSubmitting(true);

    // Generate distinct Reference Number based on category:
    // Tours: THTT-TOUR-XXXXXX
    // Trekking: THTT-TREK-XXXXXX
    // Adventure Activities: THTT-ADV-XXXXXX
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    let prefix = "THTT-TOUR";
    if (category === "Trekking") prefix = "THTT-TREK";
    if (category === "Adventure Activity") prefix = "THTT-ADV";

    const generatedRefId = `${prefix}-${randomDigits}`;
    const now = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    setTimeout(() => {
      setSubmissionId(generatedRefId);
      setSubmittedAt(now);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setSubmissionId("");
    setFormData({
      fullName: "",
      nationality: "",
      email: "",
      phone: "",
      travelDate: "",
      pickupAddress: "",
      specialNotes: "",
      termsAgreed: false,
    });
    setUploadedFiles([]);
    onClose();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(submissionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppBooking = () => {
    const msg = encodeURIComponent(
      `*Official Trip Booking & Reservation Confirmation*\n\n` +
      `📌 *Reference Number:* ${submissionId}\n` +
      `🎒 *Package Title:* ${pkg.title}\n` +
      `🏷️ *Category:* ${category}\n` +
      `⭐ *Selected Tier:* ${currentTier.name} (${currentTier.ageGroup})\n` +
      `👥 *Number of Guests:* ${guestsCount} Traveler(s)\n` +
      `💵 *Total Estimated Price:* ${totalPriceFormatted}\n` +
      `📅 *Preferred Travel Date:* ${formData.travelDate || "Immediate"}\n` +
      `👤 *Lead Traveler:* ${formData.fullName}\n` +
      (formData.nationality ? `🌍 *Nationality:* ${formData.nationality}\n` : "") +
      `📞 *Phone / WhatsApp:* ${formData.phone}\n` +
      `✉️ *Email:* ${formData.email}\n` +
      (formData.pickupAddress ? `📍 *Pickup / Hotel:* ${formData.pickupAddress}\n` : "") +
      (formData.specialNotes ? `📝 *Special Requests:* ${formData.specialNotes}\n` : "") +
      `\nHello Trip Himalaya (${assignedTeam}), I have completed my booking online. Please confirm reservation availability and share next steps!`
    );
    window.open(`https://wa.me/${WHATSAPP_CONTACT_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handlePrintReceipt = () => {
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Trip_Booking_Slip_${submissionId}</title>
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
                <div class="company-tagline" style="margin-top:4px;">Govt. Approved Travel &amp; Tour Counseling Agency</div>
                <div class="company-contact-row" style="margin-top:3px;">Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal &nbsp;|&nbsp; 977-9851403761 &nbsp;|&nbsp; pradip.triphimalayatt@gmail.com &nbsp;|&nbsp; www.triphimalaya.com.np</div>
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
              <h1>Trip Booking Confirmation Slip</h1>
              <div class="destination">Destination: ${pkg.title} &nbsp;/&nbsp; ${category}</div>
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
            <div class="sh-text">Applicant &amp; Traveler Details</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <tr>
              <td class="td-label">Full Name</td>
              <td class="td-value accent">${formData.fullName || "—"}</td>
              <td class="td-label">Total Travelers</td>
              <td class="td-value mono">${guestsCount} Guest(s)</td>
            </tr>
            <tr>
              <td class="td-label">Nationality</td>
              <td class="td-value">${formData.nationality || "Nepali / International"}</td>
              <td class="td-label">Travel Date</td>
              <td class="td-value">${formData.travelDate || "Flexible"}</td>
            </tr>
            <tr>
              <td class="td-label">Contact / WhatsApp</td>
              <td class="td-value">${formData.phone || "—"}</td>
              <td class="td-label">Email Address</td>
              <td class="td-value">${formData.email || "—"}</td>
            </tr>
          </table>

          <!-- PACKAGE SERVICE DETAILS -->
          <div class="section-heading">
            <div class="sh-text">Trip Service &amp; Fee Details</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <tr>
              <td class="td-label">Selected Package Tier</td>
              <td class="td-value accent">${currentTier.name}</td>
              <td class="td-label">Stay / Trip Duration</td>
              <td class="td-value">${pkg.duration || "Standard"}</td>
            </tr>
            <tr>
              <td class="td-label">Package Category</td>
              <td class="td-value">${category}</td>
              <td class="td-label">Intended Travel Date</td>
              <td class="td-value">${formData.travelDate || "Flexible"}</td>
            </tr>
            <tr>
              <td class="td-label" style="background:#fdf2f8; border-color:#f9a8d4;">Total Processing Fee</td>
              <td class="td-value fee" colspan="3" style="background:#fdf2f8; border-color:#f9a8d4;">${totalPriceFormatted} &nbsp;<span style="font-size:9px;font-weight:600;color:#9D174D;">(inclusive of all service charges)</span></td>
            </tr>
          </table>

          <!-- OFFICER NOTICE -->
          <div class="notice-box">
            <strong>Next Step:</strong> Our dedicated ${category === "Tour" ? "Tour" : category === "Trekking" ? "Trekking" : "Adventure"} Officer will contact you within <strong>15–30 minutes</strong> via WhatsApp or phone call to verify your details, coordinate logistics, and confirm departure.
          </div>

          <!-- CHECKLIST -->
          <div class="checklist-box">
            <div class="checklist-title">Trip Preparation Checklist</div>
            <div class="checklist-grid">
              <div class="checklist-item"><span class="ci-icon">✓</span> Original Passport / Govt. Photo ID (valid for travel)</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> 2 passport-size photos (for permits &amp; entries)</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> Booking confirmation slip (printed / digital copy)</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> Personal travel gear &amp; recommended clothing</div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="doc-footer">
            <div class="footer-left">
              This is a system-generated confirmation slip. No physical signature is required.<br>
              For queries: 977-9851403761 &nbsp;|&nbsp; pradip.triphimalayatt@gmail.com &nbsp;|&nbsp; www.triphimalaya.com.np
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

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={handleResetAndClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] my-auto transform transition-all duration-300 relative z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── MODAL HEADER ── */}
        {isSubmitted ? (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#200B3B] via-[#3B145C] to-[#200B3B] text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                <MapPin size={20} className="text-pink-300" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF4FA3] block">
                  SUBMISSION CONFIRMED
                </span>
                <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight text-white">
                  {pkg.title}
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
        ) : (
          <div className="relative bg-gradient-to-r from-[#200B3B] via-[#2D1347] to-[#3B145C] text-white p-5 sm:p-6">
            <button
              type="button"
              onClick={handleResetAndClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight pr-8">
              Book: {pkg.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs text-gray-200">
              <span className="bg-white/10 px-3 py-1 rounded-full font-bold backdrop-blur-xs text-pink-300">
                {category}
              </span>
              {pkg.duration && (
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs font-medium">
                  <Clock size={13} className="text-pink-400" />
                  {pkg.duration}
                </span>
              )}
              {pkg.location && (
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs font-medium">
                  <MapPin size={13} className="text-pink-400" />
                  {pkg.location}
                </span>
              )}
              <span className="bg-[#E11D48] text-white font-extrabold px-3 py-1 rounded-full shadow-sm ml-auto">
                {totalPriceFormatted} Total
              </span>
            </div>
          </div>
        )}

        {/* ── MODAL BODY ── */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {isSubmitted ? (
            /* =======================================================================
               CONFIRMATION & RECEIPT VIEW — MATCHING VISA PROCESSING SUBMISSION
               ======================================================================= */
            <div className="space-y-3 text-center animate-in fade-in zoom-in-95 duration-200">
              
              {/* Top Greeting & Status */}
              <div className="space-y-1 pt-0.5">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white mb-0.5 shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50">
                  <CheckCircle2 size={24} className="stroke-[2.5]" />
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <h4 className="text-base sm:text-lg font-black text-[#1A0B2E] tracking-tight">
                    Thank you, {formData.fullName || "Valued Traveler"}!
                  </h4>
                  <BadgeCheck size={18} className="text-emerald-600 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-500">
                  Your trip request for <strong className="text-slate-800 font-semibold">{pkg.title}</strong> has been registered.
                </p>
              </div>

              {/* Specialist Contact Reassurance Card */}
              <div className="bg-gradient-to-r from-purple-50/70 via-white to-purple-50/50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-left shadow-2xs">
                <div className="flex items-center justify-between gap-1.5 flex-wrap mb-0.5">
                  <span className="text-xs font-black text-[#1A0B2E]">
                    Our Trip Specialist will contact you soon
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  A trip specialist will reach out on <strong className="text-slate-800">WhatsApp &amp; Phone</strong> ({formData.phone || "your number"}) to coordinate next steps.
                </p>
              </div>

              {/* Official Digital E-Receipt Voucher Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs text-left">
                
                {/* Submission Reference ID Header Strip */}
                <div className="bg-[#FAF8FD] px-3.5 py-2.5 border-b border-purple-100/70 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block leading-none">
                      OFFICIAL SUBMISSION NUMBER
                    </span>
                    <span className="font-mono font-black text-sm sm:text-base text-[#1A0B2E] tracking-wider mt-0.5 block">
                      {submissionId}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyId}
                    type="button"
                    className="flex items-center gap-1 text-[11px] font-bold text-[#E91E63] hover:underline cursor-pointer"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? "Copied!" : "Copy Code"}</span>
                  </button>
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
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Nationality</span>
                    <span className="font-bold text-[#1A0B2E] uppercase truncate block text-xs mt-0.5">
                      {formData.nationality || `${guestsCount} Guest(s)`}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Trip Tier</span>
                    <span className="font-bold text-[#E91E63] truncate block text-xs mt-0.5">
                      {currentTier.name}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Processing Fee</span>
                    <span className="font-black text-[#1A0B2E] text-xs mt-0.5 block">
                      {totalPriceFormatted}
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
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleWhatsAppBooking}
                  className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer truncate"
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="py-2.5 px-3.5 bg-white hover:bg-purple-50/70 border border-purple-200 text-[#1A0B2E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:border-purple-300"
                >
                  <Printer size={13} className="text-purple-700" />
                  <span>Print Slip</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* ── BOOKING FORM ── */
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── Selected Tier Summary banner ── */}
              <div className="flex items-center justify-between bg-pink-50 border border-pink-200 rounded-xl px-4 py-3">
                <div>
                  <p className="text-[9px] font-black text-pink-500 uppercase tracking-wider mb-0.5">
                    Selected Experience Tier
                  </p>
                  <p className="text-sm font-black text-[#2D1347] leading-tight">
                    {currentTier.name}
                    <span className="text-[10px] font-semibold text-gray-500 ml-1.5">{currentTier.ageGroup}</span>
                  </p>
                </div>
                <span className="text-sm font-black text-[#E11D48] whitespace-nowrap">{unitPriceFormatted}<span className="text-[10px] font-semibold text-gray-400"> / guest</span></span>
              </div>

              {/* ── Travel Date ── */}
              {/* ── Travel Date & Nationality ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Travel Date <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      name="travelDate"
                      required
                      value={formData.travelDate}
                      onChange={handleChange}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nationality <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      name="nationality"
                      required
                      placeholder="e.g. Nepali, Indian, American"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* ── Full Name ── */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Primary Traveler Full Name <span className="text-[#E11D48]">*</span>
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Ram Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* ── Email + Phone ── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone / WhatsApp <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+977-9851400000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* ── Pickup Address ── */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Pickup / Hotel in Nepal <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="pickupAddress"
                    placeholder="e.g. Kathmandu Airport or Thamel Hotel"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* ── Special Notes ── */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Dietary / Health Notes <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <textarea
                    name="specialNotes"
                    rows={2}
                    placeholder="e.g. Vegetarian meals, high-altitude preparation, extra porter…"
                    value={formData.specialNotes}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition resize-none"
                  />
                </div>
              </div>

              {/* ── File Upload ── */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Attach Documents <span className="text-gray-400 font-normal">(ID / Passport / Student Card)</span>
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-[#E11D48] rounded-xl p-3 text-center bg-gray-50/50 hover:bg-pink-50/20 transition cursor-pointer"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.docx"
                  />
                  <UploadCloud size={18} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">
                    Drag & drop or <span className="text-[#E11D48] font-semibold">Browse</span>
                    <span className="text-gray-400 ml-1">· JPG, PNG, PDF up to 10MB</span>
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={13} className="text-[#E11D48] flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-700 truncate">{file.name}</span>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Estimated Total ── */}
              <div className="flex items-center justify-between bg-[#FAF8FF] border border-purple-100 rounded-xl px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Estimated Total ({guestsCount} × {unitPriceFormatted})
                  </p>
                  <p className="text-xl font-black text-[#2D1347]">{totalPriceFormatted}</p>
                </div>
              </div>

              {/* ── Terms ── */}
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-[#E11D48] focus:ring-[#E11D48] cursor-pointer"
                />
                <span>
                  I agree to Trip Himalaya's booking terms, free 48h cancellation policy, and confirm the traveler information is accurate.
                </span>
              </label>

              {/* ── Submit Button ── */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-pink-900/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send size={15} />
                <span>{isSubmitting ? "Generating Confirmation…" : "Book This Trip Now"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BookingModal;
