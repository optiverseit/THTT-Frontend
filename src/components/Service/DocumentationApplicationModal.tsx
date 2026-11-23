import React, { useState, useEffect, useRef } from "react";
import {
  X,
  FileText,
  UploadCloud,
  CheckCircle2,
  Calendar,
  User,
  Mail,
  Phone,
  Printer,
  MessageCircle,
  Copy,
  Check,
  Trash2,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  AlertCircle,
  Clock,
  MapPin,
  Lock,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useGlobalCurrency, displayPrice, formatNPR } from "../../context/CurrencyContext";
import THTTLogo from "../../assets/images/Logo.png";
import logoBase64 from "../../assets/images/THTTLogo_b64.txt?raw";
import { COUNTRY_CODES, isoToFlag } from "../../utils/countrycodes";
import { PaymentMethod } from "../reusable/PaymentMethod";
import {
  type DocumentRequirementField,
  type DocumentationServiceOption,
  type DocumentationFormFieldConfig,
  DEFAULT_DOCUMENT_REQUIREMENTS,
  DEFAULT_DOCUMENTATION_SERVICES,
  DEFAULT_DOCUMENTATION_FORM_FIELDS,
} from "./documentationConfig";

const THTT_LOGO_PRINT_SRC = `data:image/png;base64,${logoBase64.trim()}`;

export interface DocumentationApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDocumentId?: number | string;
  preselectedDocumentTitle?: string;
  dynamicRequirements?: DocumentRequirementField[];
  availableServices?: DocumentationServiceOption[];
  customFieldConfigs?: Record<string, DocumentationFormFieldConfig>;
}

export interface DocumentationApplicantData {
  serviceId: number | string;
  serviceTitle: string;
  urgency: "standard" | "express";
  fullName: string;
  nationality: string;
  email: string;
  phoneCode: string;
  phone: string;
  idNumber: string;
  idType: "citizenship" | "passport" | "national_id";
  destinationCountry: string;
  deliveryMethod: "courier" | "office_pickup";
  specialNotes: string;
  documentFiles: Record<string, File | null>;
}

export const DocumentationApplicationModal: React.FC<DocumentationApplicationModalProps> = ({
  isOpen,
  onClose,
  preselectedDocumentId,
  preselectedDocumentTitle,
  dynamicRequirements,
  availableServices = DEFAULT_DOCUMENTATION_SERVICES,
  customFieldConfigs,
}) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  const fieldConfigs = {
    ...DEFAULT_DOCUMENTATION_FORM_FIELDS,
    ...(customFieldConfigs || {}),
  };

  const requirementsList =
    dynamicRequirements && dynamicRequirements.length > 0
      ? dynamicRequirements
      : DEFAULT_DOCUMENT_REQUIREMENTS;

  // Step tracking: 1 = Details, 2 = Documents, 3 = Review & Payment, 4 = Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState<DocumentationApplicantData>(() => ({
    serviceId: preselectedDocumentId || availableServices[0]?.id || 1,
    serviceTitle: preselectedDocumentTitle || availableServices[0]?.title || "Police Clearance Certificate (PCC)",
    urgency: "standard",
    fullName: "",
    nationality: "Nepal",
    email: "",
    phoneCode: "+977",
    phone: "",
    idNumber: "",
    idType: "passport",
    destinationCountry: "",
    deliveryMethod: "courier",
    specialNotes: "",
    documentFiles: {},
  }));

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedBookingRef, setSubmittedBookingRef] = useState<string>("");
  const [submittedAt, setSubmittedAt] = useState<string>("");
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"esewa" | "pay_later">("pay_later");

  // Keep pre-selected service in sync when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormErrors({});
      if (preselectedDocumentTitle) {
        const matched = availableServices.find(
          (s) =>
            String(s.id) === String(preselectedDocumentId) ||
            s.title.toLowerCase() === preselectedDocumentTitle.toLowerCase()
        );
        if (matched) {
          setFormData((prev) => ({
            ...prev,
            serviceId: matched.id,
            serviceTitle: matched.title,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            serviceTitle: preselectedDocumentTitle,
          }));
        }
      }
    }
  }, [isOpen, preselectedDocumentId, preselectedDocumentTitle, availableServices]);

  if (!isOpen) return null;

  // Pricing calculations
  const activeService =
    availableServices.find((s) => String(s.id) === String(formData.serviceId)) ||
    availableServices[0];

  const totalNprPrice =
    formData.urgency === "express"
      ? activeService?.expressPriceNpr || 6000
      : activeService?.standardPriceNpr || 3500;

  const formattedTotalPrice = displayPrice(
    totalNprPrice,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );

  // Field change handler
  const handleInputChange = (field: keyof DocumentationApplicantData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // File upload handler
  const handleFileChange = (fieldId: string, file: File | null) => {
    if (file) {
      const fieldConfig = requirementsList.find((r) => r.id === fieldId);
      const maxMb = fieldConfig?.max_size_mb || 5;
      if (file.size > maxMb * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          [fieldId]: `File size exceeds the ${maxMb}MB limit.`,
        }));
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      documentFiles: {
        ...prev.documentFiles,
        [fieldId]: file,
      },
    }));

    if (formErrors[fieldId]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const removeFile = (fieldId: string) => {
    handleFileChange(fieldId, null);
  };

  // Validation
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full legal name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone / WhatsApp number is required.";
    } else if (formData.phone.trim().length < 6) {
      errors.phone = "Please enter a valid contact number.";
    }
    if (!formData.idNumber.trim()) {
      errors.idNumber = "Citizenship / Passport number is required.";
    }
    if (!formData.destinationCountry.trim()) {
      errors.destinationCountry = "Destination country / purpose is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    requirementsList.forEach((req) => {
      if (req.is_required && !formData.documentFiles[req.id]) {
        errors[req.id] = `${req.name} is required to process your application.`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextFromStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  // Submission handler (Pay Later option)
  const handleFinalSubmitPayLater = () => {
    setIsSubmitting(true);
    // Simulate generation of unique booking reference
    const timestampRef = "DOC-" + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    setTimeout(() => {
      setSubmittedBookingRef(timestampRef);
      setSubmittedAt(dateStr);
      setIsSubmitting(false);
      setCurrentStep(4);
    }, 800);
  };

  const handleCopyRef = () => {
    if (submittedBookingRef) {
      navigator.clipboard.writeText(submittedBookingRef);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleWhatsAppFollowUp = () => {
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I just submitted Documentation Application Ref: ${submittedBookingRef} for "${formData.serviceTitle}". Applicant: ${formData.fullName}. Please confirm receipt.`
    );
    window.open(`https://wa.me/9779851420882?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handlePrintDossier = () => {
    const formattedFee = formattedTotalPrice;
    const issueDate =
      submittedAt ||
      new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });

    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Documentation_Clearance_Slip_${submittedBookingRef || "Application"}</title>
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
            font-size: 11px;
            line-height: 1.45;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 12mm 12mm 10mm 12mm;
            display: flex;
            flex-direction: column;
            gap: 0;
          }
          .letterhead {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 8px;
            border-bottom: 2.5px solid #000;
            margin-bottom: 10px;
          }
          .lh-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-img {
            height: 70px;
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
            font-size: 15px;
            font-weight: 900;
            line-height: 1.1;
            color: #000;
          }
          .company-tagline {
            font-size: 9px;
            color: #000;
            font-weight: 600;
            margin-top: 2px;
          }
          .company-contact-row {
            font-size: 8.5px;
            color: #222;
            margin-top: 2px;
            font-weight: 500;
          }
          .lh-right {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 3px;
          }
          .official-badge {
            display: inline-block;
            border: 1.5px solid #000;
            color: #000;
            font-size: 8.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 2px 8px;
            border-radius: 3px;
          }
          .slip-date {
            font-size: 8.5px;
            color: #444;
            font-weight: 600;
          }
          .title-band {
            background: #2e1065;
            color: #fff;
            padding: 8px 12px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .title-band h1 {
            font-size: 13px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #fff;
          }
          .title-band .destination {
            font-size: 10px;
            color: #fbcfe8;
            font-weight: 700;
            margin-top: 1px;
          }
          .doc-id { text-align: right; }
          .doc-id-label { font-size: 8px; color: #d8b4fe; text-transform: uppercase; letter-spacing: 0.8px; }
          .doc-id-val { font-family: monospace; font-weight: 900; font-size: 13px; color: #fff; }

          .section-heading {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 10px 0 6px 0;
          }
          .sh-text {
            font-size: 9.5px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #000;
            white-space: nowrap;
          }
          .sh-line {
            flex: 1;
            height: 1px;
            background: #000;
          }
          .detail-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5px;
          }
          .detail-table th, .detail-table td {
            border: 1px solid #cbd5e1;
            padding: 4.5px 7px;
            vertical-align: top;
          }
          .td-label {
            background: #f8fafc;
            font-weight: 700;
            color: #334155;
            width: 22%;
          }
          .td-value {
            color: #0f172a;
            font-weight: 500;
            width: 28%;
          }
          .td-value.accent { font-weight: 700; color: #000; }
          .td-value.mono { font-family: monospace; font-weight: 700; }
          .td-value.fee { font-size: 11px; font-weight: 900; color: #be185d; }

          .notice-box {
            background: #fdf4ff;
            border: 1px solid #f0abfc;
            border-left: 4px solid #a855f7;
            padding: 7px 10px;
            border-radius: 4px;
            font-size: 9.5px;
            color: #581c87;
            margin-top: 8px;
            line-height: 1.4;
          }

          .checklist-box {
            background: #f0fdf4;
            border: 1px solid #86efac;
            padding: 7px 10px;
            border-radius: 4px;
            margin-top: 8px;
            font-size: 9px;
            color: #14532d;
          }
          .checklist-title {
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 9px;
            margin-bottom: 4px;
            color: #166534;
          }
          .checklist-items {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3px 12px;
          }

          .doc-footer {
            margin-top: auto;
            padding-top: 8px;
            border-top: 1.5px solid #000000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 8px;
            color: #444;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <!-- LETTERHEAD -->
          <div class="letterhead">
            <div class="lh-left">
              <img src="${THTT_LOGO_PRINT_SRC || THTTLogo}" class="logo-img" alt="Trip Himalaya Tours and Travels" />
              <div class="company-name-block">
                <div class="company-name-main">Trip Himalaya Tours &amp; Travels Pvt. Ltd.</div>
                <div class="company-tagline">Govt. Authorized Legal Documentation &amp; Attestation Services</div>
                <div class="company-contact-row">Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal &nbsp;|&nbsp; +977 9851420882 &nbsp;|&nbsp; triphimalayatt@gmail.com</div>
              </div>
            </div>
            <div class="lh-right">
              <div class="official-badge">Official Document</div>
              <div class="slip-date">Issued: ${issueDate}</div>
            </div>
          </div>

          <!-- DOC TITLE BAND -->
          <div class="title-band">
            <div>
              <h1>Documentation Clearance Confirmation Slip</h1>
              <div class="destination">Service: ${formData.serviceTitle || "Legal Documentation Assistance"}</div>
            </div>
            <div class="doc-id">
              <div class="doc-id-label">Tracking Reference</div>
              <div class="doc-id-val">${submittedBookingRef || "DOC-XXXXXX"}</div>
            </div>
          </div>

          <!-- APPLICANT DETAILS SECTION -->
          <div class="section-heading">
            <div class="sh-text">Applicant &amp; Identity Details</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <tr>
              <td class="td-label">Full Legal Name</td>
              <td class="td-value accent">${formData.fullName || "—"}</td>
              <td class="td-label">Citizenship / Passport / ID</td>
              <td class="td-value mono">${formData.idNumber || "—"}</td>
            </tr>
            <tr>
              <td class="td-label">Nationality</td>
              <td class="td-value">${formData.nationality || "Nepal"}</td>
              <td class="td-label">Destination / Purpose</td>
              <td class="td-value">${formData.destinationCountry || "General Clearance"}</td>
            </tr>
            <tr>
              <td class="td-label">Contact / WhatsApp</td>
              <td class="td-value">${formData.phone ? `${formData.phoneCode} ${formData.phone}` : "—"}</td>
              <td class="td-label">Email Address</td>
              <td class="td-value">${formData.email || "—"}</td>
            </tr>
            <tr>
              <td class="td-label">Delivery Preference</td>
              <td class="td-value">${formData.deliveryMethod === "courier" ? "Courier Delivery (Nepal & Global)" : "Self-Collection (Airport Office)"}</td>
              <td class="td-label">Urgency &amp; Timeline</td>
              <td class="td-value accent" style="color:#7e22ce;">${formData.urgency === "express" ? "Express Fast-Track (24–48 Hours)" : "Standard Timeline (3–5 Business Days)"}</td>
            </tr>
          </table>

          <!-- SERVICE & CLEARANCE DETAILS -->
          <div class="section-heading">
            <div class="sh-text">Documentation Service &amp; Fee Details</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <tr>
              <td class="td-label">Selected Service</td>
              <td class="td-value accent" colspan="3">${formData.serviceTitle}</td>
            </tr>
            <tr>
              <td class="td-label">Processing Speed</td>
              <td class="td-value">${formData.urgency === "express" ? "Express Fast-Track" : "Standard Timeline"}</td>
              <td class="td-label">Turnaround Time</td>
              <td class="td-value">${formData.urgency === "express" ? (activeService?.turnaroundExpress || "24–48 Hours") : (activeService?.turnaroundStandard || "3–5 Business Days")}</td>
            </tr>
            <tr>
              <td class="td-label" style="background:#fdf2f8; border-color:#f9a8d4;">Total Processing Fee</td>
              <td class="td-value fee" colspan="3" style="background:#fdf2f8; border-color:#f9a8d4;">
                ${formattedFee} &nbsp;<span style="font-size:8.5px;font-weight:600;color:#9D174D;">(Inclusive of government token, verification &amp; notary facilitation fees)</span>
              </td>
            </tr>
          </table>

          <!-- ATTACHED DOCUMENTS CHECKLIST -->
          <div class="section-heading">
            <div class="sh-text">Attached Documents &amp; Verification Status</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="font-size:8.5px; text-align:left; width:35%;">Document Name</th>
                <th style="font-size:8.5px; text-align:left; width:15%;">Requirement</th>
                <th style="font-size:8.5px; text-align:left; width:50%;">Uploaded File / Submission Status</th>
              </tr>
            </thead>
            <tbody>
              ${requirementsList
                .map((req) => {
                  const file = formData.documentFiles[req.id];
                  return `
                    <tr>
                      <td style="font-weight:700; color:#0f172a; font-size:8.5px;">${req.name || req.title || "Document"}</td>
                      <td style="font-size:8.5px; color:${req.is_required ? "#be185d" : "#64748b"}; font-weight:700;">
                        ${req.is_required ? "Required" : "Optional"}
                      </td>
                      <td style="font-size:8.5px; color:${file ? "#15803d" : "#b45309"}; font-weight:600;">
                        ${
                          file
                            ? `✓ Attached: ${file.name} (${(file.size / 1024).toFixed(0)} KB)`
                            : req.is_required
                            ? "Pending physical submission at office or WhatsApp"
                            : "Not attached (Optional)"
                        }
                      </td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>

          <!-- PAYMENT INFORMATION -->
          <div class="section-heading">
            <div class="sh-text">Payment Information</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <tr>
              <td class="td-label">Payment Method</td>
              <td class="td-value" style="font-weight:700;">Pay Later (Deferred / Settle upon Verification)</td>
              <td class="td-label">Total Processing Fee</td>
              <td class="td-value fee">${formattedFee}</td>
            </tr>
            <tr>
              <td class="td-label">Amount Paid</td>
              <td class="td-value fee" style="color:#b45309;">
                ${selectedCurrency ? `${selectedCurrency} 0 (Pay Later)` : "NPR 0 (Pay Later)"}
              </td>
              <td class="td-label">Payment Status</td>
              <td class="td-value" style="font-weight:900; font-size:10px; color:#b45309;">PAY LATER</td>
            </tr>
            <tr>
              <td class="td-label">Verification Status</td>
              <td class="td-value" colspan="3" style="font-weight:900; font-size:10px; color:#1d4ed8;">
                DOCUMENT DOSSIER UNDER REVIEW
              </td>
            </tr>
          </table>

          <!-- OFFICER NOTICE -->
          <div class="notice-box">
            <strong>Next Step:</strong> Our dedicated Documentation Officer will review your dossier and contact you within <strong>15–30 minutes</strong> via WhatsApp (+977 9851420882) or phone to verify your paperwork, confirm appointment dates, and guide you through consular / embassy clearance.
          </div>

          <!-- CHECKLIST -->
          <div class="checklist-box">
            <div class="checklist-title">Instructions for Original Documents:</div>
            <div class="checklist-items">
              <div>✓ Keep original Citizenship / Passport ready for physical notary verification</div>
              <div>✓ Additional documents may be requested based on embassy / ministry requisites</div>
              <div>✓ For courier delivery, confirm your full municipal address with our officer</div>
              <div>✓ For urgent queries, contact WhatsApp: +977 9851420882</div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="doc-footer">
            <span>Official Documentation Acknowledgement &nbsp;|&nbsp; Trip Himalaya Tours &amp; Travels Pvt. Ltd.</span>
            <span>System Generated &nbsp;•&nbsp; Ref: ${submittedBookingRef || "DOC-XXXXXX"}</span>
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

  return (
    <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-gray-100 flex flex-col max-h-[92vh]">
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-[#2e1065] to-[#3b0764] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck size={20} className="text-pink-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Apply for Documentation Clearance
              </h3>
              <p className="text-xs text-purple-200">
                Official attestation, verification & fast-track legal services
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── STEP PROGRESS BAR (Steps 1–3) ── */}
        {currentStep < 4 && (
          <div className="px-6 pt-4 pb-2 bg-gray-50/70 border-b border-gray-100">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className={currentStep >= 1 ? "text-[#2e1065]" : "text-gray-400"}>
                1. Applicant Details
              </span>
              <span className={currentStep >= 2 ? "text-[#2e1065]" : "text-gray-400"}>
                2. Upload Documents
              </span>
              <span className={currentStep >= 3 ? "text-[#2e1065]" : "text-gray-400"}>
                3. Review & Pay Later
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2e1065] to-[#E91E63] transition-all duration-300"
                style={{
                  width:
                    currentStep === 1
                      ? "33.3%"
                      : currentStep === 2
                      ? "66.6%"
                      : "100%",
                }}
              />
            </div>
          </div>
        )}

        {/* ── MODAL BODY ── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-gray-800">
          {/* ══════════════════════════════════════════════════════════
              STEP 1: SERVICE & APPLICANT DETAILS
          ══════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-4.5">
              {/* Urgency Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Processing Speed & Turnaround
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => handleInputChange("urgency", "standard")}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.urgency === "standard"
                        ? "border-[#2e1065] bg-purple-50/50 shadow-xs"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Standard Timeline</span>
                      <span className="text-[11px] font-bold text-[#2e1065]">
                        {formatNPR(activeService?.standardPriceNpr || 3500)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                      <Clock size={12} /> {activeService?.turnaroundStandard || "3–5 Business Days"}
                    </p>
                  </div>

                  <div
                    onClick={() => handleInputChange("urgency", "express")}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.urgency === "express"
                        ? "border-[#E91E63] bg-pink-50/40 shadow-xs"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Express Fast-Track</span>
                      <span className="text-[11px] font-bold text-[#E91E63]">
                        {formatNPR(activeService?.expressPriceNpr || 6000)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                      <Clock size={12} /> {activeService?.turnaroundExpress || "24–48 Hours"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={fieldConfigs.fullName?.placeholder || "Enter your full name"}
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065] outline-hidden placeholder:text-gray-400"
                  />
                  {formErrors.fullName && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={fieldConfigs.nationality?.placeholder || "Enter your country"}
                    value={formData.nationality}
                    onChange={(e) => handleInputChange("nationality", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065] outline-hidden placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder={fieldConfigs.email?.placeholder || "Enter your email address"}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065] outline-hidden placeholder:text-gray-400"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.phoneCode}
                      onChange={(e) => handleInputChange("phoneCode", e.target.value)}
                      className="w-24 px-2 py-2.5 rounded-xl border border-gray-200 text-xs font-bold bg-gray-50 focus:border-[#2e1065] outline-hidden"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.iso} value={c.code}>
                          {isoToFlag(c.iso)} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      placeholder={fieldConfigs.phone?.placeholder || "Enter your phone number"}
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065] outline-hidden placeholder:text-gray-400"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* ID & Destination Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Citizenship / Passport / National ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={fieldConfigs.idNumber?.placeholder || "Enter ID or passport number"}
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065] outline-hidden placeholder:text-gray-400"
                  />
                  {formErrors.idNumber && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.idNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Destination Country / Purpose <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={fieldConfigs.destinationCountry?.placeholder || "Enter your country"}
                    value={formData.destinationCountry}
                    onChange={(e) => handleInputChange("destinationCountry", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#2e1065] focus:ring-1 focus:ring-[#2e1065] outline-hidden placeholder:text-gray-400"
                  />
                  {formErrors.destinationCountry && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.destinationCountry}</p>
                  )}
                </div>
              </div>

              {/* Delivery Preference */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Completed Document Delivery Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 text-xs font-semibold">
                    <input
                      type="radio"
                      name="delivery"
                      checked={formData.deliveryMethod === "courier"}
                      onChange={() => handleInputChange("deliveryMethod", "courier")}
                      className="text-[#2e1065]"
                    />
                    <span>Courier Delivery (Nepal & Global)</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 text-xs font-semibold">
                    <input
                      type="radio"
                      name="delivery"
                      checked={formData.deliveryMethod === "office_pickup"}
                      onChange={() => handleInputChange("deliveryMethod", "office_pickup")}
                      className="text-[#2e1065]"
                    />
                    <span>Self-Collection (Airport Kathmandu Office)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 2: DYNAMIC DOCUMENT UPLOADS (Visa Service Style)
          ══════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-3.5">
              <div className="bg-purple-50/70 border border-purple-100 p-3.5 rounded-2xl">
                <p className="text-xs font-bold text-[#2e1065]">
                  Document Guidelines &amp; Supported Formats
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                  Attach files or send later via WhatsApp. Accepted formats:{" "}
                  <span className="font-bold text-purple-900">PDF, JPG, PNG, WEBP</span> (max 10 MB each).
                </p>
              </div>

              <div className="space-y-2.5">
                {requirementsList.map((requirement) => {
                  const requirementId = String(requirement.id);
                  const file = formData.documentFiles[requirement.id] || null;
                  const docError = formErrors[requirement.id];
                  const inputId = `doc-file-${requirement.id}`;

                  return (
                    <div key={requirement.id} className="space-y-1">
                      <div
                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border transition-all ${
                          file
                            ? "bg-emerald-50/60 border-emerald-200"
                            : docError
                            ? "bg-rose-50/30 border-rose-400 ring-1 ring-rose-300"
                            : requirement.is_required
                            ? "bg-white border-gray-200 hover:border-[#E91E63]"
                            : "bg-white border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <input
                          id={inputId}
                          type="file"
                          accept={
                            requirement.supported_formats && requirement.supported_formats.length > 0
                              ? requirement.supported_formats.map((f) => `.${f.toLowerCase()}`).join(",")
                              : ".pdf,.jpg,.jpeg,.png,.webp"
                          }
                          className="hidden"
                          onChange={(e) => {
                            const selected = e.target.files?.[0] || null;
                            handleFileChange(requirement.id, selected);
                            e.target.value = "";
                          }}
                        />

                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              file
                                ? "bg-emerald-100 text-emerald-600"
                                : docError
                                ? "bg-rose-100 text-rose-600"
                                : "bg-pink-50 text-[#E91E63]"
                            }`}
                          >
                            {file ? <CheckCircle2 size={16} /> : <FileText size={15} />}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#200B3B] flex items-center gap-1 flex-wrap">
                              {requirement.title || requirement.name || "Document"}
                              {requirement.is_required ? (
                                <span className="text-[#E91E63] font-black">*</span>
                              ) : (
                                <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                  Optional
                                </span>
                              )}
                            </p>
                            {file ? (
                              <p className="text-[10px] text-emerald-700 font-semibold truncate max-w-[240px]">
                                {file.name}{" "}
                                <span className="text-emerald-500 font-normal">
                                  ({(file.size / 1024).toFixed(0)} KB)
                                </span>
                              </p>
                            ) : (
                              <p className="text-[10px] text-gray-400 truncate">
                                {requirement.description || "Attach required document"}
                              </p>
                            )}
                          </div>
                        </div>

                        {file ? (
                          <button
                            type="button"
                            onClick={() => removeFile(requirement.id)}
                            className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            <Trash2 size={11} />
                            <span>Remove</span>
                          </button>
                        ) : (
                          <label
                            htmlFor={inputId}
                            className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border ${
                              docError
                                ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-300"
                                : "bg-pink-50 hover:bg-pink-100 text-[#E91E63] border-pink-200"
                            }`}
                          >
                            <UploadCloud size={12} />
                            <span>Attach</span>
                          </label>
                        )}
                      </div>

                      {docError && (
                        <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium px-1">
                          <AlertCircle size={12} className="flex-shrink-0" />
                          <span>{docError}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 3: REVIEW & PAYMENT (PAY LATER)
          ══════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Application Summary Box */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Service Selected
                  </span>
                  <span className="text-xs font-black text-[#2e1065]">{formData.serviceTitle}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Applicant Name</span>
                  <span className="font-semibold text-gray-800">{formData.fullName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Contact</span>
                  <span className="font-semibold text-gray-800">
                    {formData.phoneCode} {formData.phone}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Processing Timeline</span>
                  <span className="font-semibold text-purple-700 capitalize">
                    {formData.urgency === "express" ? "Express (24–48h)" : "Standard (3–5 Days)"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Documents Attached</span>
                  <span className="font-semibold text-emerald-700">
                    {Object.values(formData.documentFiles).filter(Boolean).length} files attached
                  </span>
                </div>
              </div>

              {/* Payment Method Component with Pay Later Option */}
              <PaymentMethod
                bookingReference="DOC-PENDING"
                packageTitle={formData.serviceTitle}
                category="Documentation Clearance"
                guestsCount={1}
                unitPriceFormatted={formattedTotalPrice}
                totalPriceFormatted={formattedTotalPrice}
                isProcessingPayment={isSubmitting}
                initialMethod="pay_later"
                onMethodChange={setSelectedPaymentMethod}
                onPayWithEsewa={handleFinalSubmitPayLater}
                onPayLater={handleFinalSubmitPayLater}
              />
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 4: SUBMISSION CONFIRMATION & RECEIPT VIEW
              (Matching Visa Service Layout & Aesthetics)
          ══════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className="space-y-3 text-center animate-in fade-in zoom-in-95 duration-200">
              {/* Top Greeting & Status */}
              <div className="space-y-1.5 pt-0.5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white mb-0.5 shadow-md ring-4 bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/20 ring-amber-50">
                  <CheckCircle2 size={26} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    Application Registered • Payment Pending
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <h4 className="text-base sm:text-lg font-black text-[#1A0B2E] tracking-tight">
                    Thank you, {formData.fullName || "Valued Applicant"}!
                  </h4>
                  <BadgeCheck size={18} className="text-emerald-600 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-500">
                  Your documentation request for{" "}
                  <strong className="text-slate-800 font-semibold">
                    {formData.serviceTitle}
                  </strong>{" "}
                  has been registered.
                </p>
              </div>

              {/* Officer Contact Reassurance Card */}
              <div className="bg-gradient-to-r from-purple-50/70 via-white to-purple-50/50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-left shadow-2xs">
                <div className="flex items-center justify-between gap-1.5 flex-wrap mb-0.5">
                  <span className="text-xs font-black text-[#1A0B2E]">
                    Our Documentation Officer will contact you soon
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  A documentation specialist will reach out on{" "}
                  <strong className="text-slate-800">WhatsApp &amp; Phone</strong> (
                  {formData.phone ? `${formData.phoneCode} ${formData.phone}` : "your number"}) to coordinate paperwork, appointment verification, and courier details.
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
                      {submittedBookingRef}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-100/70 hover:bg-purple-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedRef ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedRef ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                {/* Key Details Grid */}
                <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-white">
                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Applicant
                    </span>
                    <span className="font-bold text-[#1A0B2E] truncate block text-xs mt-0.5">
                      {formData.fullName || "—"}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Documentation Service
                    </span>
                    <span className="font-bold text-[#E91E63] truncate block text-xs mt-0.5">
                      {formData.serviceTitle}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Processing Timeline
                    </span>
                    <span className="font-bold text-purple-700 truncate block text-xs mt-0.5 capitalize">
                      {formData.urgency === "express" ? "Express (24–48h)" : "Standard (3–5 Days)"}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Processing Fee
                    </span>
                    <span className="font-black text-[#1A0B2E] text-xs mt-0.5 block">
                      {formattedTotalPrice}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Submitted At
                    </span>
                    <span className="font-medium text-slate-700 text-[10.5px] truncate block mt-0.5">
                      {submittedAt}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Payment Status
                    </span>
                    <span className="font-black text-amber-600 text-xs mt-0.5 block">
                      PAY LATER (Deferred)
                    </span>
                  </div>
                </div>

                {/* Attached Documents breakdown */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block">
                      Attached Documents
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {Object.keys(formData.documentFiles).filter((k) => formData.documentFiles[k]).length} Files Attached
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
                    {requirementsList.map((req) => {
                      const file = formData.documentFiles[req.id];
                      if (!file) return null;
                      return (
                        <span key={req.id} className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          ✓ {req.name || req.title}: {file.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleWhatsAppFollowUp}
                  className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrintDossier}
                    className="flex-1 py-2.5 px-3.5 bg-white hover:bg-purple-50/70 border border-purple-200 text-[#1A0B2E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:border-purple-300"
                  >
                    <Printer size={13} className="text-purple-700" />
                    <span>Print Slip</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS (Steps 1 & 2) ── */}
        {currentStep < 3 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Back to Details
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={currentStep === 1 ? handleNextFromStep1 : handleNextFromStep2}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2e1065] to-[#E91E63] text-white font-bold text-xs flex items-center gap-2 hover:opacity-95 shadow-md transition-all cursor-pointer"
            >
              <span>{currentStep === 1 ? "Proceed to Documents" : "Review & Submit"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationApplicationModal;
