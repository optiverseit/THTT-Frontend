import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  BellRing,
  Sparkles,
  MessageCircle,
  X,
  FileCheck,
  AlertCircle,
  Printer,
  BadgeCheck,
} from "lucide-react";
import { ADToBS } from "bikram-sambat-js";
import { useEffect, useRef, useState } from "react";
import { COUNTRY_CODES, isoToFlag } from "../../utils/countrycodes";
import THTTLogo from "../../assets/images/THTTLogo.png";
import { PaymentMethod } from "../reusable/PaymentMethod";

interface CountryProps {
  id: string;
  name: string;
  flag: string;
  desc: string;
}

export type FileKeys =
  | "passport"
  | "visaCopy"
  | "experienceCert"
  | "photo"
  | "policeReport"
  | "insuranceReg"
  | "feims";

interface FormDataType {
  name: string;
  passportNumber: string;
  phoneCode: string;
  phone: string;
  country: string;
  permitType: string;
  adDate: string;
  bsDate: string;
  age: number | null;
  files: Record<FileKeys, File | null>;
  companyChange: boolean;
}

interface WorkPermitModalProps {
  country: CountryProps[];
  defaultCountry?: string;
}

const WorkPermitModal = ({ country, defaultCountry }: WorkPermitModalProps) => {
  const [currentStep, setCurrentStep] = useState<"stepA" | "stepB" | "stepC" | "payment" | "submitted">("stepA");
  const [applicationId, setApplicationId] = useState("");
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "unpaid">("unpaid");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"esewa" | "pay_later">("esewa");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Max selectable DOB is today (cannot be in future)
  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    passportNumber: "",
    phoneCode: "+977",
    phone: "",
    country: defaultCountry || "",
    permitType: "new_labour_permit",
    adDate: "",
    bsDate: "",
    age: null,
    files: {
      passport: null,
      visaCopy: null,
      experienceCert: null,
      photo: null,
      policeReport: null,
      insuranceReg: null,
      feims: null,
    },
    companyChange: false,
  });

  useEffect(() => {
    if (defaultCountry) {
      setFormData((prev) => ({
        ...prev,
        country: prev.country || defaultCountry,
      }));
    }
  }, [defaultCountry]);

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fileFields: {
    key: FileKeys;
    label: string;
    required: boolean;
    hint: string;
  }[] = [
    {
      key: "photo",
      label: "MRP Size Photo (Recent) *",
      required: true,
      hint: "Recent white background passport/MRP size photo",
    },
    {
      key: "passport",
      label: "Original Passport (Scan Copy) *",
      required: true,
      hint: "Clear scan of first (bio) & last page with signature",
    },
    {
      key: "visaCopy",
      label: "Valid Job Offer Letter/Visa Copy *",
      required: true,
      hint: "Approved entry visa or official employer job agreement",
    },
    {
      key: "experienceCert",
      label: "Experience Certificates (If Required)",
      required: false,
      hint: "Trade, technical, or prior foreign employment proof if available",
    },
    {
      key: "policeReport",
      label: "Police Clearance Report (If Required)",
      required: false,
      hint: "Police character certificate if requested by employer/embassy",
    },
    {
      key: "insuranceReg",
      label: "Insurance Registration – SSF / Welfare Fund (If Required)",
      required: false,
      hint: "Social Security Fund or Foreign Employment Welfare Fund insurance slip",
    },
    {
      key: "feims",
      label: "FEIMS Online Registration Slip (If Required)",
      required: false,
      hint: "Foreign Employment Information Management System online registration slip",
    },
  ];

  const handleButtonClick = (key: string) => {
    fileRefs.current[key]?.click();
  };

  const handleFileChange = (key: FileKeys, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [key]: file,
      },
    }));
  };

  const handleConvert = (value: string) => {
    if (!value) {
      setFormData((prev) => ({
        ...prev,
        adDate: "",
        bsDate: "",
        age: null,
      }));
      return;
    }

    const birthDate = new Date(value);
    const now = new Date();

    // Check if future date
    if (birthDate > now) {
      setFormData((prev) => ({
        ...prev,
        adDate: value,
        bsDate: "Invalid (Future Date)",
        age: -1,
      }));
      return;
    }

    // Accurate Age Calculation
    let calculatedAge = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    // Attempt BS conversion without throwing or wiping age
    let bs = "";
    try {
      bs = ADToBS(value);
    } catch {
      bs = "";
    }

    setFormData((prev) => ({
      ...prev,
      adDate: value,
      bsDate: bs,
      age: calculatedAge,
    }));
  };

  const getAgeCategoryText = (age: number | null): string => {
    if (age === null || isNaN(age)) return "--";
    if (age < 0) return "Invalid Date";
    const label =
      age < 18 ? "Under 18 years" :
      age <= 35 ? "Below 35 years" :
      age <= 50 ? "35–50 years" :
      "Above 51 years";
    return `${label}  ·  ${age} yrs old`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateStepA = () => {
    const errors: string[] = [];
    if (!formData.name.trim()) errors.push("Full Name is required");

    if (!formData.passportNumber.trim()) {
      errors.push("Passport Number is required");
    } else if (!/^[A-Za-z0-9]{6,20}$/.test(formData.passportNumber.trim())) {
      errors.push("Passport Number must be 6–20 alphanumeric characters");
    }

    const cleanPhone = formData.phone.replace(/[\s\-]/g, "");
    if (!cleanPhone) {
      errors.push("Phone / WhatsApp number is required");
    } else if (!/^\d{6,15}$/.test(cleanPhone)) {
      errors.push("Phone must be a valid number (6–15 digits)");
    }

    if (!formData.country) {
      errors.push("Destination Country is required");
    }

    if (!formData.adDate) {
      errors.push("Date of birth is required");
    } else if (formData.age !== null && formData.age < 0) {
      errors.push("Date of birth cannot be in the future");
    } else if (formData.age !== null && formData.age < 18) {
      errors.push("Applicant must be at least 18 years of age for foreign employment");
    }

    setStepErrors(errors);
    return errors.length === 0;
  };

  const validateStepB = () => {
    const errors: string[] = [];
    if (!formData.files.passport) {
      errors.push("Original Passport (Scan Copy) is required");
    }
    if (!formData.files.visaCopy) {
      errors.push("Valid Job Offer Letter/Visa Copy is required");
    }
    if (!formData.files.photo) {
      errors.push("MRP Size Photo (Recent) is required");
    }
    setStepErrors(errors);
    return errors.length === 0;
  };

  const goToStepB = () => {
    if (validateStepA()) {
      setStepErrors([]);
      setCurrentStep("stepB");
    }
  };

  const goToStepC = () => {
    if (validateStepB()) {
      setStepErrors([]);
      setCurrentStep("stepC");
    }
  };

  // ── Work Permit Fee Calculation (Age-based government & insurance fee structure) ──
  const getFeeAmount = (age: number | null) => {
    if (age !== null && age > 50) return 15500;
    if (age !== null && age > 35) return 12500;
    return 11000;
  };

  const getFeeTierLabel = (age: number | null) => {
    if (age !== null && age > 50) return "Above 51 years (Age 51+)";
    if (age !== null && age > 35) return "35–50 years";
    return "Below 35 years (Ages 18–35)";
  };

  const totalFeeNpr = getFeeAmount(formData.age);
  const totalPriceFormatted = `NPR ${totalFeeNpr.toLocaleString("en-IN")}`;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!applicationId) {
      const trackingCode = `TH-WP-${Math.floor(100000 + Math.random() * 900000)}`;
      setApplicationId(trackingCode);
    }
    setCurrentStep("payment");
  };

  // ── eSewa mock payment handler ──
  const handleEsewaPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setSelectedPaymentMethod("esewa");
      setPaymentStatus("paid");
      setCurrentStep("submitted");
      setIsProcessingPayment(false);
    }, 1500);
  };

  // ── Pay Later handler ──
  const handlePayLater = () => {
    setSelectedPaymentMethod("pay_later");
    setPaymentStatus("unpaid");
    setCurrentStep("submitted");
  };

  const handleDownloadSlip = () => {
    const submittedAt = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const permitTypeLabel = ({
      new_labour_permit: "New Labour Permit (Shram)",
      renewal_permit: "Renewal Permit",
      individual_permit: "Individual Work Permit",
    } as Record<string, string>)[formData.permitType] ?? formData.permitType.replace(/_/g, " ");

    const slipHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Work_Permit_Slip_${applicationId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          @page { size: A4 portrait; margin: 0; }
          * { box-sizing: border-box; margin: 0; padding: 0; }

          /* Force background colors to print */
          html, body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #ffffff;
            color: #000000;
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

          /* ── WATERMARK ── */
          .watermark-wrapper {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            user-select: none;
            z-index: 999;
          }
          .watermark {
            transform: rotate(-28deg);
            font-size: 42px;
            font-weight: 900;
            color: rgba(0, 0, 0, 0.04);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            line-height: 2.2;
            white-space: nowrap;
            text-align: center;
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
            font-size: 13px;
            font-weight: 700;
            color: #000;
            letter-spacing: 0.5px;
          }

          /* ── SECTION HEADING ── */
          .section-heading {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 4px;
            margin-top: 8px;
          }
          .section-heading .sh-line {
            flex: 1;
            height: 1px;
            background: #000;
          }
          .section-heading .sh-text {
            font-size: 7.5px;
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
            border: 1.5px solid #3B145C;
          }
          .detail-table th {
            padding: 5px 8px;
            border: 1px solid #3B145C;
            text-align: left;
            vertical-align: middle;
            font-size: 7.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: #200B3B;
            color: #ffffff;
          }
          .detail-table td {
            padding: 5px 8px;
            border: 1px solid #C4ADE8;
            vertical-align: middle;
          }
          .detail-table tbody tr:nth-child(even) td {
            background: #F3EEFF;
          }
          .detail-table tbody tr:nth-child(odd) td {
            background: #ffffff;
          }
          .td-label {
            font-size: 7.5px;
            font-weight: 700;
            color: #3B145C;
            text-transform: uppercase;
            letter-spacing: 0.7px;
            width: 38%;
            background: #EDE5F8 !important;
            border-right: 2px solid #9B6FD4 !important;
          }
          .td-value {
            font-size: 9.5px;
            font-weight: 600;
            color: #1A0B2E;
          }
          .td-value.mono { font-family: 'Courier New', monospace; }
          .td-value.accent { color: #200B3B; font-weight: 800; }
          .td-value.fee {
            color: #1A0B2E;
            font-size: 11px;
            font-weight: 900;
            font-family: 'Inter', sans-serif;
          }

          /* ── TWO-COLUMN GRID ── */
          .two-col-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 0;
          }
          .two-col-grid .col-block {
            display: flex;
            flex-direction: column;
          }
          .two-col-grid .col-block .section-heading {
            margin-top: 0;
          }
          .two-col-grid .detail-table {
            flex: 1;
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
            font-size: 9px;
            color: #222;
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
            border-top: 2px solid #000;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-size: 8.5px;
            color: #444;
          }
          .footer-left { line-height: 1.6; }
          .footer-right { text-align: right; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="page">
          <!-- WATERMARK -->
          <div class="watermark-wrapper"><div class="watermark">Trip Himalaya Tours and Travels</div></div>

          <!-- LETTERHEAD -->
          <div class="letterhead">
            <div class="lh-left">
              <img src="${THTTLogo}" class="logo-img" alt="Trip Himalaya Tours and Travels" />
              <div class="company-name-block">
                <div class="company-name-main">Trip Himalaya Tours &amp; Travels Pvt. Ltd.</div>
                <div class="company-tagline">Govt. Approved Travel &amp; Foreign Employment Documentation Agency</div>
                <div class="company-contact-row">
                  Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal &nbsp;|&nbsp; 977-9851403761 &nbsp;|&nbsp; dev.triphimalayatt@gmail.com
                </div>
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
              <h1>Work Permit (Shram Swikriti) Application Slip</h1>
              <div class="destination">Destination: ${formData.country || "Nepal"} &nbsp;/&nbsp; ${permitTypeLabel}</div>
            </div>
            <div class="doc-id">
              <div class="doc-id-label">Document ID</div>
              <div class="doc-id-val">${applicationId}</div>
            </div>
          </div>

          <!-- SUBMISSION REFERENCE -->
          <div class="ref-box">
            <div class="ref-accent"></div>
            <div class="ref-content">
              <div>
                <div class="ref-label">Official Submission Reference Number</div>
                <div class="ref-value">${applicationId}</div>
              </div>
            </div>
          </div>

          <!-- TOP ROW: APPLICANT DETAILS + SUBMITTED DOCUMENTS (2 columns) -->
          <div class="two-col-grid">

            <!-- LEFT: APPLICANT DETAILS -->
            <div class="col-block">
              <div class="section-heading" style="margin-top:0;">
                <div class="sh-text">Applicant Details</div>
                <div class="sh-line"></div>
              </div>
              <table class="detail-table">
                <thead>
                  <tr>
                    <th style="width:42%;">Field</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="td-label">Full Name</td>
                    <td class="td-value accent">${formData.name || "—"}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Passport Number</td>
                    <td class="td-value mono accent">${formData.passportNumber ? formData.passportNumber.toUpperCase() : "—"}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Contact / WhatsApp</td>
                    <td class="td-value">${formData.phoneCode} ${formData.phone || "—"}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Destination Country</td>
                    <td class="td-value accent">${formData.country || "—"}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Permit Service Type</td>
                    <td class="td-value">${permitTypeLabel}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Date of Birth (A.D.)</td>
                    <td class="td-value mono">${formData.adDate || "—"}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Date of Birth (B.S.)</td>
                    <td class="td-value mono">${formData.bsDate || "—"}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Age Category</td>
                    <td class="td-value">${formData.age !== null ? `${getFeeTierLabel(formData.age)} (${formData.age} yrs)` : "—"}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Company Transfer</td>
                    <td class="td-value">${formData.companyChange ? "Yes" : "No"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- RIGHT: SUBMITTED DOCUMENTS -->
            <div class="col-block">
              <div class="section-heading" style="margin-top:0;">
                <div class="sh-text">Submitted Documents</div>
                <div class="sh-line"></div>
              </div>
              <table class="detail-table">
                <thead>
                  <tr>
                    <th style="width:48%;">Document</th>
                    <th>Status / Filename</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="td-label">Passport (Scan Copy)</td>
                    <td class="td-value" style="color:#047857; font-weight:700;">${formData.files.passport ? "✓ " + formData.files.passport.name : "✓ Uploaded"}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Visa / Job Offer Copy</td>
                    <td class="td-value" style="color:#047857; font-weight:700;">${formData.files.visaCopy ? "✓ " + formData.files.visaCopy.name : "✓ Uploaded"}</td>
                  </tr>
                  <tr>
                    <td class="td-label">MRP Size Photo</td>
                    <td class="td-value" style="color:#047857; font-weight:700;">${formData.files.photo ? "✓ " + formData.files.photo.name : "✓ Uploaded"}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Experience Certificate</td>
                    <td class="td-value">${formData.files.experienceCert ? '<span style="color:#047857; font-weight:700;">✓ ' + formData.files.experienceCert.name + '</span>' : '<span style="color:#9ca3af; font-style:italic;">Not provided</span>'}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Police Clearance</td>
                    <td class="td-value">${formData.files.policeReport ? '<span style="color:#047857; font-weight:700;">✓ ' + formData.files.policeReport.name + '</span>' : '<span style="color:#9ca3af; font-style:italic;">Not provided</span>'}</td>
                  </tr>
                  <tr>
                    <td class="td-label">Insurance (SSF / Welfare)</td>
                    <td class="td-value">${formData.files.insuranceReg ? '<span style="color:#047857; font-weight:700;">✓ ' + formData.files.insuranceReg.name + '</span>' : '<span style="color:#9ca3af; font-style:italic;">Not provided</span>'}</td>
                  </tr>
                  <tr>
                    <td class="td-label">FEIMS Online Slip</td>
                    <td class="td-value">${formData.files.feims ? '<span style="color:#047857; font-weight:700;">✓ ' + formData.files.feims.name + '</span>' : '<span style="color:#9ca3af; font-style:italic;">Not provided</span>'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div><!-- end .two-col-grid -->

          <!-- PAYMENT INFORMATION (full width) -->
          <div class="section-heading">
            <div class="sh-text">Payment Information</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <thead>
              <tr>
                <th style="width:38%;">Field</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-label">Payment Method</td>
                <td class="td-value" style="font-weight:700;">${selectedPaymentMethod === "esewa" ? "eSewa Digital Wallet" : "Pay Later (Deferred / Pay at Office)"}</td>
              </tr>
              <tr>
                <td class="td-label">Total Processing Fee</td>
                <td class="td-value fee">${totalPriceFormatted}</td>
              </tr>
              <tr>
                <td class="td-label">Amount Paid</td>
                <td class="td-value fee" style="color:${paymentStatus === "paid" ? "#047857" : "#b45309"};">${
                  paymentStatus === "paid" ? totalPriceFormatted : "NPR 0 (Pay Later)"
                }</td>
              </tr>
              <tr>
                <td class="td-label">Payment Status</td>
                <td class="td-value" style="font-weight:900; font-size:10px; color:${paymentStatus === "paid" ? "#047857" : "#b45309"};">${
                  paymentStatus.toUpperCase()
                }</td>
              </tr>
              <tr>
                <td class="td-label">Payment Verification</td>
                <td class="td-value" style="font-weight:900; font-size:10px; color:#1d4ed8;">PENDING</td>
              </tr>
            </tbody>
          </table>

          <!-- NOTICE -->
          <div class="notice-box">
            <strong>Next Steps:</strong> Our licensed documentation officer will review your file and contact you within <strong>24 hours</strong> via WhatsApp or phone to verify your credentials and guide you through the DoFE / FEIMS submission process. Keep Reference No. <strong>${applicationId}</strong> for all follow-ups.
          </div>

          <!-- FEO CHECKLIST -->
          <div class="checklist-box">
            <div class="checklist-title">Foreign Employment Office (FEO) Checklist</div>
            <div class="checklist-grid">
              <div class="checklist-item"><span class="ci-icon">✓</span> Original Passport (min 6 months validity)</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> Valid Job Offer / Demand Letter</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> MRP Size Photograph (white background)</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> Insurance Registration (SSF / Welfare Fund)</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> FEIMS Online Registration Slip</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> Police Clearance (if required by employer)</div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="doc-footer">
            <div class="footer-left">
              System-generated slip &mdash; no physical signature required.<br>
              &#x1F4DE; 977-9851403761 &nbsp;|&nbsp; &#x2709; dev.triphimalayatt@gmail.com &nbsp;|&nbsp; &#x1F310; www.triphimalaya.com.np
            </div>
            <div class="footer-right">
              Trip Himalaya Tours &amp; Travels<br>
              Ref: ${applicationId} &nbsp;|&nbsp; ${submittedAt}
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
      doc.write(slipHtml);
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

  const handleCloseModal = () => {
    const modal = document.getElementById("work_permit_modal") as HTMLDialogElement;
    modal?.close();
    // Reset after closing animation
    setTimeout(() => {
      setCurrentStep("stepA");
      setStepErrors([]);
      setPaymentStatus("unpaid");
      setSelectedPaymentMethod("esewa");
      setIsProcessingPayment(false);
      setApplicationId("");
    }, 300);
  };

  return (
    <dialog id="work_permit_modal" className="modal w-full">
      <div className="modal-box rounded-3xl max-w-2xl p-0 overflow-hidden bg-white shadow-2xl border border-gray-100">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#2D1347] to-purple-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/80 text-[10px] font-black uppercase tracking-wider text-white">
                  Work Permit Online Portal
                </span>
                <span className="text-gray-300 text-xs font-semibold">
                  Fast Shram Processing
                </span>
              </div>
              <h2 className="font-extrabold text-xl sm:text-2xl text-white">
                {currentStep === "payment" ? "Payment Method" : "Online Application"}
              </h2>
              {currentStep === "payment" && (
                <p className="text-xs text-gray-200 mt-1">
                  Work Permit — {formData.country || "Government Shram"}
                </p>
              )}
            </div>
            <button
              onClick={handleCloseModal}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* 3-Step Wizard Breadcrumbs (Only if not submitted and not in payment) */}
          {currentStep !== "submitted" && currentStep !== "payment" && (
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/15">
              {/* Step A */}
              <div
                className={`flex items-center gap-2 p-2 rounded-xl transition-all ${
                  currentStep === "stepA"
                    ? "bg-pink-600/90 text-white shadow-sm"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white text-[#2D1347] text-[10px] font-black flex items-center justify-center flex-shrink-0">
                  A
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold truncate">Basic Info</p>
                  <p className="text-[9px] text-pink-200 truncate">~30 sec form</p>
                </div>
              </div>

              {/* Step B */}
              <div
                className={`flex items-center gap-2 p-2 rounded-xl transition-all ${
                  currentStep === "stepB"
                    ? "bg-pink-600/90 text-white shadow-sm"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white text-[#2D1347] text-[10px] font-black flex items-center justify-center flex-shrink-0">
                  B
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold truncate">Documents</p>
                  <p className="text-[9px] text-gray-300 truncate">5 Verification Files</p>
                </div>
              </div>

              {/* Step C */}
              <div
                className={`flex items-center gap-2 p-2 rounded-xl transition-all ${
                  currentStep === "stepC"
                    ? "bg-pink-600/90 text-white shadow-sm"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white text-[#2D1347] text-[10px] font-black flex items-center justify-center flex-shrink-0">
                  C
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold truncate">Review</p>
                  <p className="text-[9px] text-gray-300 truncate">Final Submit</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* Error alerts if any */}
          {stepErrors.length > 0 && (
            <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Please check the following:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {stepErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ══════════ STEP A: BASIC INFORMATION ══════════ */}
          {currentStep === "stepA" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-2 text-purple-950 font-bold text-sm">
                  <FileText size={16} className="text-pink-500" />
                  <span>STEP A: BASIC INFORMATION</span>
                </h3>
                <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1">
                  <Clock size={12} />
                  Takes ~30 seconds
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs text-gray-600 font-bold">Full Name (As in Passport)*</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ram Bahadur Thapa"
                  className="input w-full mt-1 border border-gray-200 focus:border-pink-500 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              {/* Passport Number */}
              <div>
                <label className="text-xs text-gray-600 font-bold">Passport Number*</label>
                <input
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  placeholder="e.g. A1234567"
                  className="input w-full mt-1 border border-gray-200 focus:border-pink-500 rounded-xl px-3 py-2 text-sm"
                  style={{ textTransform: "uppercase" }}
                />
              </div>

              {/* Phone with Country Code */}
              <div>
                <label className="text-xs text-gray-600 font-bold">Phone / WhatsApp Number*</label>
                <div className="flex items-stretch border border-gray-200 rounded-xl bg-white focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100 transition-all overflow-hidden mt-1">
                  <select
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phoneCode: e.target.value }))}
                    className="flex-shrink-0 bg-gray-50 border-r border-gray-200 px-2 py-2 text-xs font-bold text-[#200B3B] focus:outline-none cursor-pointer"
                    style={{ maxWidth: "110px" }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.iso} value={c.code}>
                        {isoToFlag(c.iso)} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={formData.phoneCode === "+977" ? "98XXXXXXXX" : "Mobile / WhatsApp"}
                    className="flex-1 min-w-0 px-3 py-2 bg-white text-xs sm:text-sm font-semibold text-[#200B3B] focus:outline-none"
                  />
                </div>
              </div>

              {/* DOB & BS Conversion */}
              <div>
                <label className="text-xs text-gray-600 font-bold">Date of Birth*</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">English (A.D.)</span>
                    <input
                      type="date"
                      max={todayStr}
                      value={formData.adDate}
                      onChange={(e) => handleConvert(e.target.value)}
                      className="input w-full border border-gray-200 focus:border-pink-500 rounded-xl px-3 py-2 text-sm mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Nepali (B.S.) Auto-Calculated</span>
                    <input
                      value={formData.bsDate}
                      readOnly
                      placeholder="e.g. 2055-02-14"
                      className="input w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 mt-0.5"
                    />
                  </div>
                </div>
              </div>

              {/* Age Category */}
              <div>
                <label className="text-xs text-gray-600 font-bold">Age Category</label>
                <input
                  value={getAgeCategoryText(formData.age)}
                  readOnly
                  className={`input w-full border rounded-xl px-3 py-2 text-sm font-bold mt-1 ${
                    formData.age !== null && (formData.age < 18 || formData.age < 0)
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-gray-50 border-gray-200 text-[#4a1c8c]"
                  }`}
                />
                {formData.age !== null && formData.age >= 0 && formData.age < 18 && (
                  <div className="flex items-start gap-1.5 mt-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertCircle size={13} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-red-600 font-semibold">
                      Age must be at least 18 years for foreign employment. Applicants under 18 are not eligible.
                    </span>
                  </div>
                )}
              </div>

              {/* Country & Permit Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 font-bold">Destination Country*</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="select w-full border border-gray-200 focus:border-pink-500 rounded-xl px-3 py-2 text-sm mt-1 cursor-pointer"
                  >
                    <option value="">Select Destination</option>
                    {country.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-600 font-bold">Permit Service Type</label>
                  <select
                    name="permitType"
                    value={formData.permitType}
                    onChange={handleChange}
                    className="select w-full border border-gray-200 focus:border-pink-500 rounded-xl px-3 py-2 text-sm mt-1 cursor-pointer"
                  >
                    <option value="new_labour_permit">New Labour Permit (Shram)</option>
                    <option value="renewal_permit">Renewal Permit</option>
                    <option value="individual_permit">Individual Work Permit</option>
                  </select>
                </div>
              </div>

              {/* Button to Next Step */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={goToStepB}
                  className="rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm w-full py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-pink-300/40 transition-all cursor-pointer"
                >
                  <span>PROCEED TO DOCUMENT UPLOAD</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ══════════ STEP B: DOCUMENT UPLOAD ══════════ */}
          {currentStep === "stepB" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-2 text-purple-950 font-bold text-sm">
                  <Upload size={16} className="text-pink-500" />
                  <span>STEP B: DOCUMENT UPLOAD</span>
                </h3>
                <span className="text-[11px] text-gray-400 font-semibold">
                  JPG, PNG, or PDF (Max 10MB)
                </span>
              </div>

              {/* Document upload cards - 5 files matching page specifications */}
              {fileFields.map((field) => (
                <div
                  key={field.key}
                  className="rounded-2xl bg-gray-50 p-4 border border-gray-100 hover:border-pink-200 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label className="text-xs text-gray-800 font-bold block">
                      {field.label}
                    </label>
                    {field.required ? (
                      <span className="text-[10px] font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                        Required
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mb-2.5 leading-relaxed">
                    {field.hint}
                  </p>

                  <input
                    type="file"
                    className="hidden"
                    ref={(el) => {
                      fileRefs.current[field.key] = el;
                    }}
                    onChange={(e) =>
                      handleFileChange(field.key, e.target.files?.[0] || null)
                    }
                  />

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleButtonClick(field.key)}
                      className="cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold bg-pink-600 text-white hover:bg-pink-700 transition-colors shadow-xs"
                    >
                      Choose File
                    </button>
                    {formData.files[field.key] ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 truncate">
                        <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{formData.files[field.key]?.name}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No file selected yet</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Optional Company Change Checkbox */}
              <div className="rounded-2xl bg-purple-50/70 p-4 border border-purple-100">
                <label className="flex items-center gap-2 text-xs font-bold text-purple-950 cursor-pointer">
                  <input
                    type="checkbox"
                    name="companyChange"
                    checked={formData.companyChange}
                    onChange={handleChange}
                    className="checkbox checkbox-sm checkbox-primary rounded-md"
                  />
                  <span>This application involves a Company Change / Transfer</span>
                </label>
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("stepA")}
                  className="w-1/3 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-3.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={goToStepC}
                  className="w-2/3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-pink-300/40 transition-all cursor-pointer"
                >
                  <span>REVIEW APPLICATION</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ══════════ STEP C: REVIEW & SUBMIT ══════════ */}
          {currentStep === "stepC" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-2 text-purple-950 font-bold text-sm">
                  <FileCheck size={16} className="text-pink-500" />
                  <span>STEP C: REVIEW AND SUBMIT</span>
                </h3>
                <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full">
                  Verification Summary
                </span>
              </div>

              {/* Applicant Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2 text-xs">
                <h4 className="font-extrabold text-purple-950 text-sm mb-2">
                  Applicant Profile
                </h4>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Name</span>
                    <span className="font-bold text-gray-800">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Contact</span>
                    <span className="font-bold text-gray-800">{formData.phoneCode} {formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Destination</span>
                    <span className="font-bold text-pink-600">{formData.country}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Permit Category</span>
                    <span className="font-bold text-gray-800 capitalize">
                      {formData.permitType.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Date of Birth</span>
                    <span className="font-bold text-gray-800">
                      {formData.adDate} (AD) {formData.bsDate && `• ${formData.bsDate} (BS)`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Age Category</span>
                    <span className="font-bold text-purple-950">
                      {getAgeCategoryText(formData.age)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Summary (All 5 documents) */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2 text-xs">
                <h4 className="font-extrabold text-purple-950 text-sm mb-2">
                  Uploaded Documentation (5 Checkpoints)
                </h4>
                <div className="space-y-1.5 text-gray-600">
                  {fileFields.map((field) => (
                    <div
                      key={field.key}
                      className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-gray-700 font-semibold">{field.label.replace("*", "").trim()}:</span>
                      {formData.files[field.key] ? (
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                          <span className="truncate max-w-[180px]">{formData.files[field.key]?.name}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">
                          {field.required ? "Missing (Required)" : "Not provided (Optional)"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed">
                By clicking Submit, your application enters our official verification queue. You will receive real-time notifications via WhatsApp ({formData.phoneCode} {formData.phone}) as the file progresses through the Foreign Employment Office (FEO).
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("stepB")}
                  className="w-1/3 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-3.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-2/3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-pink-300/40 transition-all cursor-pointer"
                >
                  <span>CONFIRM &amp; SUBMIT APPLICATION</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ══════════ STEP PAYMENT: ESEWA & PAY LATER ══════════ */}
          {currentStep === "payment" && (
            <div className="space-y-3">
              <PaymentMethod
                bookingReference={applicationId}
                packageTitle={`Work Permit (${formData.country || "Government Shram"})`}
                category="Work Permit"
                tierName={getFeeTierLabel(formData.age)}
                guestsCount={1}
                unitPriceFormatted={totalPriceFormatted}
                totalPriceFormatted={totalPriceFormatted}
                travelDate={formData.adDate ? `DOB: ${formData.adDate}` : undefined}
                isProcessingPayment={isProcessingPayment}
                initialMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                onPayWithEsewa={handleEsewaPayment}
                onPayLater={handlePayLater}
              />
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep("stepC")}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium underline transition-colors cursor-pointer"
                >
                  ← Edit Application Details
                </button>
              </div>
            </div>
          )}

          {/* ══════════ STAGE AFTER SUBMIT ══════════ */}
          {currentStep === "submitted" && (
            <div className="text-center py-4 space-y-6">
              {/* Success Badge */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ring-8 ${
                paymentStatus === "paid"
                  ? "bg-emerald-100 text-emerald-600 ring-emerald-50"
                  : "bg-amber-100 text-amber-600 ring-amber-50"
              }`}>
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  paymentStatus === "paid"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {paymentStatus === "paid" ? "Payment Received • Application Logged" : "Application Logged • Payment Pending"}
                </span>
                <h3 className="text-2xl font-black text-purple-950 mt-2">
                  Application Submitted Successfully!
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  Tracking ID: <span className="font-bold text-pink-600 text-sm">{applicationId}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  Total Fee: <span className="font-bold text-slate-800">{totalPriceFormatted}</span> ({selectedPaymentMethod === "esewa" ? (paymentStatus === "paid" ? "Paid via eSewa" : "eSewa Pending") : "Pay Later"})
                </p>
              </div>

              {/* What Happens Next */}
              <div className="text-left bg-gradient-to-br from-slate-50 to-purple-50/40 p-5 rounded-3xl border border-purple-100/80 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-pink-600" />
                  <h4 className="text-xs font-extrabold text-purple-950 uppercase tracking-wider">
                    Post-Submission Processing Flow
                  </h4>
                </div>

                {/* Step 1: Officer Verification */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-100 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-purple-950">
                      Officer Verification &amp; Embassy Matching
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Our licensed officers verify your passport, match embassy records, authenticate the foreign employment contract, and prepare government Shram submission.
                    </p>
                  </div>
                </div>

                {/* Step 2: Automated Notification */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-100 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BellRing size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-900">
                      Automated Status Tracking
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Instant alerts dispatched to your WhatsApp ({formData.phoneCode} {formData.phone}) at every approval milestone until your digital Work Permit is downloaded.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Link, Download PDF Slip & Close */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/9779851420882?text=${encodeURIComponent(
                    `Hello Trip Himalaya! I just submitted my Work Permit application (ID: ${applicationId}) for ${formData.name} to ${formData.country}. Total Fee: ${totalPriceFormatted}. Payment Method: ${selectedPaymentMethod === "esewa" ? (paymentStatus === "paid" ? "eSewa (PAID)" : "eSewa (PENDING)") : "Pay Later (PENDING)"}. Please confirm receipt.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs py-3.5 flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Notify via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadSlip}
                  className="flex-1 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs py-3.5 flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Printer size={16} />
                  <span>Download PDF Slip</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-3.5 px-6 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default WorkPermitModal;
