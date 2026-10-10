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
  CreditCard,
  Printer,
  MessageCircle,
  Copy,
  Check,
  Trash2,
  ArrowRight,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import THTTLogo from "../../assets/images/THTTLogo.png";
import { COUNTRY_CODES, isoToFlag } from "../../utils/countrycodes";
import { PaymentMethod } from "../reusable/PaymentMethod";
import { initiatePayment, storeVisaApplication } from "../../api/BackendApi";
import { isSessionValid, clearAuthSession } from "../../utils/sessionManager";
export { COUNTRY_CODES, isoToFlag };

export interface VisaApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: string;
  countryCode: string;
  visaType: string;
  countryId: number | string;
  visaCategoryId: number | string;
  selectedOption: {
    name: string;
    days: string;
    nprPrice: number;
    entryType: string;
    visaPricingTierId?: number | string;
  };
  numberOfGuests?: number;
  documentRequirements: VisaDocumentRequirement[];
  documentsLoading?: boolean;
}

export interface VisaDocumentRequirement {
  id: number | string;
  visa_category_id?: number | string;
  title?: string;
  name?: string;
  document_type?: string;
  description?: string | null;
  is_required: boolean;
  status?: string;
  display_order?: number;
}

export interface ApplicantData {
  fullName: string;
  nationality: string;
  email: string;
  phoneCode: string;
  phone: string;
  passportNumber: string;
  passportExpiry: string;
  travelDate: string;
  documentFiles: Record<string, File | null>;
}

const createDefaultApplicant = (): ApplicantData => ({
  fullName: "",
  nationality: "",
  email: "",
  phoneCode: "+977",
  phone: "",
  passportNumber: "",
  passportExpiry: "",
  travelDate: "",
  documentFiles: {},
});

export const VisaApplicationModal: React.FC<VisaApplicationModalProps> = ({
  isOpen,
  onClose,
  country,
  countryCode,
  visaType,
  countryId,
  visaCategoryId,
  selectedOption,
  numberOfGuests = 1,
  documentRequirements,
  documentsLoading = false,
}) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  const guests = numberOfGuests > 0 ? numberOfGuests : 1;
  const totalNprPrice = selectedOption.nprPrice * guests;

  const [applicants, setApplicants] = useState<ApplicantData[]>(() =>
    Array.from({ length: guests }, createDefaultApplicant)
  );
  const [activeApplicantIndex, setActiveApplicantIndex] = useState(0);

  // Sync applicants array whenever modal opens or guest count changes
  useEffect(() => {
    if (isOpen) {
      setApplicants((prev) => {
        if (prev.length === guests) return prev;
        const next = [...prev];
        while (next.length < guests) {
          next.push(createDefaultApplicant());
        }
        return next.slice(0, guests);
      });
      setActiveApplicantIndex(0);
      setCurrentStep("form");
      setPaymentStatus("unpaid");
      setSelectedPaymentMethod("esewa");
      setIsProcessingPayment(false);
      setIsSubmittingApplication(false);
      setVisaApplicationId(null);
      setSubmissionId("");
      setFormErrors({});
      setTermsError("");
      setHasSubmitted(false);
    }
  }, [guests, isOpen]);

  // Shared notes
  const [specialNotes, setSpecialNotes] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Form Validation State
  const [formErrors, setFormErrors] = useState<Record<number, Record<string, string>>>({});
  const [termsError, setTermsError] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const todayStr = new Date().toISOString().split("T")[0];
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState<"form" | "payment" | "submitted">("form");
  const [submissionId, setSubmissionId] = useState("");
  const [submittedAt, setSubmittedAt] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "unpaid">("unpaid");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"esewa" | "pay_later">("esewa");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [visaApplicationId, setVisaApplicationId] = useState<number | null>(null);

  if (!isOpen) return null;

  const formattedPerPerson = displayPrice(
    selectedOption.nprPrice,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );

  const formattedFee = displayPrice(
    totalNprPrice,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );

  const currentApplicant =
    applicants[activeApplicantIndex] || applicants[0] || createDefaultApplicant();
  const currentApplicantErrors = hasSubmitted
    ? formErrors[activeApplicantIndex] || {}
    : {};

  const updateCurrentApplicant = (patch: Partial<ApplicantData>) => {
    setApplicants((prev) => {
      const updated = [...prev];
      if (!updated[activeApplicantIndex]) return prev;
      updated[activeApplicantIndex] = {
        ...updated[activeApplicantIndex],
        ...patch,
      };
      return updated;
    });

    if (hasSubmitted) {
      setFormErrors((prev) => {
        const currentErrs = { ...(prev[activeApplicantIndex] || {}) };
        Object.keys(patch).forEach((key) => {
          delete currentErrs[key];
        });
        return {
          ...prev,
          [activeApplicantIndex]: currentErrs,
        };
      });
    }
  };

  const handleDocumentChange = (requirementId: number | string, file: File | null) => {
    setApplicants((prev) => {
      const updated = [...prev];
      const applicant = updated[activeApplicantIndex];
      if (!applicant) return prev;
      updated[activeApplicantIndex] = {
        ...applicant,
        documentFiles: { ...applicant.documentFiles, [String(requirementId)]: file },
      };
      return updated;
    });

    if (hasSubmitted && file) {
      setFormErrors((prev) => {
        const currentErrs = { ...(prev[activeApplicantIndex] || {}) };
        delete currentErrs[`doc_${requirementId}`];
        return {
          ...prev,
          [activeApplicantIndex]: currentErrs,
        };
      });
    }
  };

  const validateApplicant = (
    app: ApplicantData,
    requirements: VisaDocumentRequirement[]
  ): Record<string, string> => {
    const errs: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Full Name
    const trimmedName = (app.fullName || "").trim();
    if (!trimmedName) {
      errs.fullName = "Full Name is required as printed on passport";
    } else if (trimmedName.length < 3) {
      errs.fullName = "Full Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      errs.fullName = "Please enter a valid English name";
    }

    // Nationality
    const trimmedNationality = (app.nationality || "").trim();
    if (!trimmedNationality) {
      errs.nationality = "Nationality is required";
    }

    // Email
    const trimmedEmail = (app.email || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errs.email = "Email address is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      errs.email = "Please enter a valid email address";
    }

    // Phone
    const rawPhone = (app.phone || "").trim().replace(/[\s-]/g, "");
    if (!rawPhone) {
      errs.phone = "WhatsApp / Mobile phone number is required";
    } else if (app.phoneCode === "+977") {
      if (!/^9\d{9}$/.test(rawPhone)) {
        errs.phone = "Nepal phone must be 10 digits starting with 9";
      }
    } else {
      if (!/^\d{7,15}$/.test(rawPhone)) {
        errs.phone = "Please enter a valid phone number (7–15 digits)";
      }
    }

    // Passport Number
    const trimmedPassport = (app.passportNumber || "").trim().replace(/\s/g, "");
    if (!trimmedPassport) {
      errs.passportNumber = "Passport number is required";
    } else if (trimmedPassport.length < 6) {
      errs.passportNumber = "Passport number must be at least 6 characters";
    } else if (!/^[a-zA-Z0-9]{6,15}$/.test(trimmedPassport)) {
      errs.passportNumber = "Please enter a valid alphanumeric passport number";
    }

    // Intended Travel Date
    if (!app.travelDate) {
      errs.travelDate = "Intended travel date is required";
    } else {
      const tDate = new Date(app.travelDate);
      if (isNaN(tDate.getTime())) {
        errs.travelDate = "Invalid travel date";
      } else if (tDate < today) {
        errs.travelDate = "Travel date cannot be in the past";
      }
    }

    // Passport Expiry
    if (!app.passportExpiry) {
      errs.passportExpiry = "Passport expiry date is required";
    } else {
      const pDate = new Date(app.passportExpiry);
      if (isNaN(pDate.getTime())) {
        errs.passportExpiry = "Invalid passport expiry date";
      } else if (pDate <= today) {
        errs.passportExpiry = "Passport has expired. Must be a future date";
      } else if (app.travelDate) {
        const tDate = new Date(app.travelDate);
        if (!isNaN(tDate.getTime()) && pDate <= tDate) {
          errs.passportExpiry = "Passport must be valid past travel date (6+ months recommended)";
        }
      }
    }

    // Required Documents
    requirements.forEach((req) => {
      if (req.is_required && !app.documentFiles[String(req.id)]) {
        errs[`doc_${req.id}`] = `Please attach ${req.title || req.document_type || "required document"}`;
      }
    });

    return errs;
  };

  const validateAll = (): {
    isValid: boolean;
    firstFailingIndex: number | null;
    newErrors: Record<number, Record<string, string>>;
    termsValid: boolean;
  } => {
    const newErrors: Record<number, Record<string, string>> = {};
    let firstFailingIndex: number | null = null;

    for (let i = 0; i < guests; i++) {
      const app = applicants[i] || createDefaultApplicant();
      const appErrors = validateApplicant(app, documentRequirements);
      if (Object.keys(appErrors).length > 0) {
        newErrors[i] = appErrors;
        if (firstFailingIndex === null) {
          firstFailingIndex = i;
        }
      }
    }

    const termsValid = termsAgreed;
    if (!termsValid) {
      setTermsError("Please agree to the terms and conditions to proceed.");
    } else {
      setTermsError("");
    }

    setFormErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0 && termsValid,
      firstFailingIndex,
      newErrors,
      termsValid,
    };
  };

  const scrollToFirstError = (
    targetApplicantIndex: number | null,
    allErrors: Record<number, Record<string, string>>,
    termsFailed: boolean
  ) => {
    setTimeout(() => {
      let targetElementId: string | null = null;

      if (targetApplicantIndex !== null && allErrors[targetApplicantIndex]) {
        const appErrs = allErrors[targetApplicantIndex];
        const fieldOrder = [
          "fullName",
          "nationality",
          "email",
          "phone",
          "passportNumber",
          "passportExpiry",
          "travelDate",
          ...documentRequirements.map((r) => `doc_${r.id}`),
        ];

        const firstErrorKey = fieldOrder.find((k) => appErrs[k]);
        if (firstErrorKey) {
          targetElementId = `field-${firstErrorKey}`;
        }
      }

      if (!targetElementId && termsFailed) {
        targetElementId = "field-termsAgreed";
      }

      if (!targetElementId) {
        targetElementId = "field-error-banner";
      }

      const element = document.getElementById(targetElementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        if (
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement
        ) {
          element.focus();
        } else {
          const focusable = element.querySelector<HTMLElement>(
            "input, textarea, select, button, label[for]"
          );
          if (focusable) {
            focusable.focus();
          }
        }
      } else if (modalBodyRef.current) {
        modalBodyRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 120);
  };

  const getApiErrorMessage = (error: any, fallback: string) => {
    const errors = error?.response?.data?.errors;
    if (errors && typeof errors === "object") {
      const firstError = Object.values(errors).flat()[0];
      if (firstError) return String(firstError);
    }
    return error?.response?.data?.message || error?.message || fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSessionValid()) {
      clearAuthSession();
      window.location.href = `/login?from=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setHasSubmitted(true);
    const { isValid, firstFailingIndex, newErrors, termsValid } = validateAll();

    if (!isValid) {
      if (firstFailingIndex !== null) {
        setActiveApplicantIndex(firstFailingIndex);
      }
      scrollToFirstError(firstFailingIndex, newErrors, !termsValid);
      return;
    }

    if (!countryId || !visaCategoryId) {
      alert("Visa country or category information is missing.");
      return;
    }

    if (!selectedOption.visaPricingTierId) {
      alert("Please select a valid visa pricing option.");
      return;
    }

    const formData = new FormData();

    formData.append("country_id", String(countryId));
    formData.append("visa_category_id", String(visaCategoryId));
    formData.append("visa_pricing_tier_id", String(selectedOption.visaPricingTierId));
    formData.append("intended_travel_date", applicants[0]?.travelDate || "");

    applicants.forEach((applicant, applicantIndex) => {
      formData.append(
        `applicants[${applicantIndex}][applicant_full_name]`,
        applicant.fullName
      );
      formData.append(
        `applicants[${applicantIndex}][nationality]`,
        applicant.nationality
      );
      formData.append(
        `applicants[${applicantIndex}][email]`,
        applicant.email
      );
      formData.append(
        `applicants[${applicantIndex}][country_code]`,
        applicant.phoneCode
      );
      formData.append(
        `applicants[${applicantIndex}][phone_number]`,
        applicant.phone
      );
      formData.append(
        `applicants[${applicantIndex}][passport_number]`,
        applicant.passportNumber
      );
      formData.append(
        `applicants[${applicantIndex}][passport_expiry_date]`,
        applicant.passportExpiry
      );

      let documentIndex = 0;
      documentRequirements.forEach((requirement) => {
        const file = applicant.documentFiles[String(requirement.id)];
        if (!file) return;
        formData.append(`applicants[${applicantIndex}][documents][${documentIndex}][visa_document_requirement_id]`, String(requirement.id));
        formData.append(`applicants[${applicantIndex}][documents][${documentIndex}][file]`, file);
        documentIndex++;
      });
    });

    try {
      setIsSubmittingApplication(true);

      const response = await storeVisaApplication(formData);
      const application = response?.data?.data;

      if (!response?.data?.status || !application?.id) {
        throw new Error(response?.data?.message || "Failed to create visa application.");
      }

      setVisaApplicationId(Number(application.id));
      setSubmissionId(
        application.application_number || `VISA-${application.id}`
      );
      setSubmittedAt(
        new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      );
      setCurrentStep("payment");
    } catch (error: any) {
      console.error("Visa application submission failed:", error);
      alert(getApiErrorMessage(error, "Failed to submit visa application."));
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const redirectToEsewa = (paymentData: any) => {
    if (!paymentData?.payment_url) {
      throw new Error("eSewa payment URL was not returned by the server.");
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = paymentData.payment_url;

    Object.entries(paymentData).forEach(([key, value]) => {
      if (key === "payment_url" || value === undefined || value === null) return;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleEsewaPayment = async () => {
    if (!visaApplicationId) {
      alert("Visa application ID is missing. Please submit the application again.");
      return;
    }

    try {
      setIsProcessingPayment(true);
      setSelectedPaymentMethod("esewa");

      const response = await initiatePayment({
        visa_application_id: visaApplicationId,
        provider: "ESEWA",
      });

      if (!response?.data?.status) {
        throw new Error(response?.data?.message || "Unable to initiate eSewa payment.");
      }

      redirectToEsewa(response.data.data);
    } catch (error: any) {
      console.error("eSewa payment initiation failed:", error);
      alert(getApiErrorMessage(error, "Unable to initiate eSewa payment."));
      setIsProcessingPayment(false);
    }
  };

  const handlePayLater = async () => {
    if (!visaApplicationId) {
      alert("Visa application ID is missing. Please submit the application again.");
      return;
    }

    try {
      setIsProcessingPayment(true);
      setSelectedPaymentMethod("pay_later");

      const response = await initiatePayment({
        visa_application_id: visaApplicationId,
        provider: "PAYLATER",
      });

      if (!response?.data?.status) {
        throw new Error(response?.data?.message || "Unable to select Pay Later.");
      }

      setPaymentStatus("unpaid");
      setCurrentStep("submitted");
    } catch (error: any) {
      console.error("Pay Later initiation failed:", error);
      alert(getApiErrorMessage(error, "Unable to select Pay Later."));
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(submissionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const lead = applicants[0] || createDefaultApplicant();
    const applicantsList = applicants
      .map(
        (a, i) =>
          `  ${i + 1}. *${a.fullName || `Applicant ${i + 1}`}* (${a.nationality || "—"
          }) — Pass: ${a.passportNumber || "—"}`
      )
      .join("\n");

    const msg = encodeURIComponent(
      `*Official Visa Application Confirmation*\n\n` +
      `📌 *Submission Number:* ${submissionId}\n` +
      `🌍 *Destination:* ${country} (${visaType})\n` +
      `📋 *Option:* ${selectedOption.name} (${selectedOption.days})\n` +
      `👥 *Number of Applicants:* ${guests}\n` +
      `👤 *Applicant List:*\n${applicantsList}\n\n` +
      `📅 *Travel Date:* ${lead.travelDate || "Flexible"}\n` +
      `📞 *Lead Contact:* ${lead.phone ? `${lead.phoneCode} ${lead.phone}` : "—"}\n` +
      `✉️ *Lead Email:* ${lead.email || "—"}\n` +
      `💵 *Per Person Fee:* ${formattedPerPerson}\n` +
      `💰 *Total Processing Fee (${guests} applicant${guests > 1 ? "s" : ""
      }):* ${formattedFee}\n` +
      `💳 *Payment Method:* ${selectedPaymentMethod === "esewa" ? "eSewa Digital Wallet" : "Pay Later"}\n` +
      `📊 *Payment Status:* ${paymentStatus.toUpperCase()}\n` +
      `🔍 *Payment Verification:* PENDING\n\n` +
      `Hello Trip Himalaya (Visa & Documentation Team), I have submitted my visa application online. Please confirm document receipt and advise on embassy processing.`
    );
    window.open(
      `https://api.whatsapp.com/send?phone=9779851420882&text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handlePrintSlip = () => {
    const lead = applicants[0] || createDefaultApplicant();
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
            background: #000;
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
            color: #ffb3d9;
            font-weight: 700;
            margin-top: 1px;
          }
          .doc-id { text-align: right; }
          .doc-id-label { font-size: 8px; color: #aaa; text-transform: uppercase; letter-spacing: 0.8px; }
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
              <img src="${THTTLogo}" class="logo-img" alt="Trip Himalaya Tours and Travels" />
              <div class="company-name-block">
                <div class="company-name-main">Trip Himalaya Tours &amp; Travels Pvt. Ltd.</div>
                <div class="company-tagline">Govt. Approved Travel &amp; Visa Counseling Agency</div>
                <div class="company-contact-row">Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal &nbsp;|&nbsp; +977 9851420882 &nbsp;|&nbsp; dev.triphimalayatt@gmail.com</div>
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
              <div class="doc-id-label">Submission ID</div>
              <div class="doc-id-val">${submissionId}</div>
            </div>
          </div>

          <!-- APPLICANT DETAILS SECTION -->
          <div class="section-heading">
            <div class="sh-text">${guests > 1
        ? `Applicant Details (${guests} Applicants Registered)`
        : "Applicant &amp; Passport Details"
      }</div>
            <div class="sh-line"></div>
          </div>

          ${guests === 1
        ? `
          <table class="detail-table">
            <tr>
              <td class="td-label">Full Name</td>
              <td class="td-value accent">${lead.fullName || "—"}</td>
              <td class="td-label">Passport Number</td>
              <td class="td-value mono">${lead.passportNumber || "—"}</td>
            </tr>
            <tr>
              <td class="td-label">Nationality</td>
              <td class="td-value">${lead.nationality || "—"}</td>
              <td class="td-label">Passport Expiry</td>
              <td class="td-value">${lead.passportExpiry || "—"}</td>
            </tr>
            <tr>
              <td class="td-label">Contact / WhatsApp</td>
              <td class="td-value">${lead.phone ? `${lead.phoneCode} ${lead.phone}` : "—"}</td>
              <td class="td-label">Email Address</td>
              <td class="td-value">${lead.email || "—"}</td>
            </tr>
            <tr>
              <td class="td-label">Intended Travel Date</td>
              <td class="td-value">${lead.travelDate || "—"}</td>
              <td class="td-label">Documents Submitted</td>
              <td class="td-value" style="font-size:8.5px; color:#15803d; font-weight:600;">
                ${documentRequirements
                  .map((requirement) => {
                    const file = lead.documentFiles[String(requirement.id)];
                    if (!file) return "";
                    return `✓ ${requirement.title || requirement.document_type || requirement.name || "Document"} (${file.name})`;
                  })
                  .filter(Boolean)
                  .join("<br/>")}
              </td>
            </tr>
          </table>
          `
        : `
          <table class="detail-table">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="width:26px; text-align:center; font-size:8.5px;">#</th>
                <th style="font-size:8.5px; text-align:left;">Full Name</th>
                <th style="font-size:8.5px; text-align:left;">Passport No.</th>
                <th style="font-size:8.5px; text-align:left;">Nationality</th>
                <th style="font-size:8.5px; text-align:left;">Expiry Date</th>
                <th style="font-size:8.5px; text-align:left;">Travel Date</th>
                <th style="font-size:8.5px; text-align:left;">Phone / Email</th>
                <th style="font-size:8.5px; text-align:left;">Documents</th>
              </tr>
            </thead>
            <tbody>
              ${applicants
          .map(
            (a, i) => `
                <tr>
                  <td style="text-align:center; font-weight:800; font-size:8.5px;">
                    ${i + 1}
                  </td>
                  <td style="font-weight:700; color:#0f172a; font-size:8.5px;">${a.fullName || "—"
              }</td>
                  <td style="font-family:monospace; font-weight:700; font-size:8.5px;">${a.passportNumber || "—"
              }</td>
                  <td style="font-size:8.5px;">${a.nationality || "—"}</td>
                  <td style="font-size:8.5px;">${a.passportExpiry || "—"}</td>
                  <td style="font-size:8.5px;">${a.travelDate || "—"}</td>
                  <td style="font-size:8px;">${a.phone ? `${a.phoneCode} ${a.phone}` : "—"}<br/><span style="color:#64748b;">${a.email || "—"
              }</span></td>
                  <td style="font-size:8px; color:#15803d; font-weight:600;">
                    ${documentRequirements
                      .map((requirement) => {
                        const file = a.documentFiles[String(requirement.id)];
                        if (!file) return "";
                        return `✓ ${requirement.title || requirement.document_type || requirement.name || "Document"}`;
                      })
                      .filter(Boolean)
                      .join("<br/>")}
                  </td>
                </tr>
              `
          )
          .join("")}
            </tbody>
          </table>
          `
      }

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
              <td class="td-value">${lead.travelDate || "Flexible"}</td>
            </tr>
            <tr>
              <td class="td-label">Number of Applicants</td>
              <td class="td-value">${guests} ${guests === 1 ? "Applicant" : "Applicants"
      }</td>
              <td class="td-label">Fee Per Person</td>
              <td class="td-value">${formattedPerPerson}</td>
            </tr>
            <tr>
              <td class="td-label" style="background:#fdf2f8; border-color:#f9a8d4;">Total Processing Fee</td>
              <td class="td-value fee" colspan="3" style="background:#fdf2f8; border-color:#f9a8d4;">
                ${formattedFee} &nbsp;<span style="font-size:8.5px;font-weight:600;color:#9D174D;">(${guests} applicant${guests > 1 ? "s" : ""
      } × ${formattedPerPerson}/person, inclusive of all service charges)</span>
              </td>
            </tr>
          </table>

          <!-- PAYMENT INFORMATION -->
          <div class="section-heading">
            <div class="sh-text">Payment Information</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <tr>
              <td class="td-label">Payment Method</td>
              <td class="td-value" style="font-weight:700;">${selectedPaymentMethod === "esewa"
        ? "eSewa Digital Wallet"
        : "Pay Later (Deferred / Pay at Office)"
      }</td>
              <td class="td-label">Total Processing Fee</td>
              <td class="td-value fee">${formattedFee}</td>
            </tr>
            <tr>
              <td class="td-label">Amount Paid</td>
              <td class="td-value fee" style="color:${paymentStatus === "paid" ? "#047857" : "#b45309"
      };">${paymentStatus === "paid"
        ? formattedFee
        : selectedCurrency
          ? `${selectedCurrency} 0 (Pay Later)`
          : "NPR 0 (Pay Later)"
      }</td>
              <td class="td-label">Payment Status</td>
              <td class="td-value" style="font-weight:900; font-size:10px; color:${paymentStatus === "paid" ? "#047857" : "#b45309"
      };">${paymentStatus.toUpperCase()}</td>
            </tr>
            <tr>
              <td class="td-label">Payment Verification</td>
              <td class="td-value" colspan="3" style="font-weight:900; font-size:10px; color:#1d4ed8;">PENDING</td>
            </tr>
          </table>

          <!-- OFFICER NOTICE -->
          <div class="notice-box">
            <strong>Next Step:</strong> Our dedicated Visa Officer will contact you within <strong>15–30 minutes</strong> via WhatsApp or phone call to verify your documents and guide you through the embassy biometric/submission process.
          </div>

          <!-- CHECKLIST -->
          <div class="checklist-box">
            <div class="checklist-title">Document Checklist for Embassy Submission:</div>
            <div class="checklist-items">
              <div>✓ Original Passport (min 6 months validity)</div>
              <div>✓ 2 Passport Size Photos (white background)</div>
              <div>✓ Round-trip Flight &amp; Hotel Itinerary</div>
              <div>✓ Proof of Funds / Bank Statement (if required)</div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="doc-footer">
            <span>Official Visa Acknowledgement &nbsp;|&nbsp; Trip Himalaya Tours &amp; Travels Pvt. Ltd.</span>
            <span>System Generated &nbsp;•&nbsp; Ref: ${submissionId}</span>
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
    setCurrentStep("form");
    setSubmissionId("");
    setActiveApplicantIndex(0);
    setPaymentStatus("unpaid");
    setSelectedPaymentMethod("esewa");
    setIsProcessingPayment(false);
    setIsSubmittingApplication(false);
    setVisaApplicationId(null);
    setFormErrors({});
    setTermsError("");
    setHasSubmitted(false);
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
                {currentStep === "payment"
                  ? "Select Payment Option"
                  : currentStep === "submitted"
                    ? "Submission Confirmed"
                    : "Official Visa Application"}
              </span>
              <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight text-white">
                {currentStep === "payment" ? "Payment Method" : `${country} – ${visaType}`}
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
        {currentStep === "form" && (
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
              {guests > 1 && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {guests} Applicants
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-col items-end gap-0.5">
              {guests > 1 && (
                <span className="text-[9px] text-gray-400 font-medium">
                  {formattedPerPerson} × {guests} persons
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {guests > 1 ? "Total Fee:" : "Processing Fee:"}
                </span>
                <span className="text-xs sm:text-sm font-black text-[#E91E63] bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-100">
                  {formattedFee}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL BODY SCROLLABLE ── */}
        <div ref={modalBodyRef} className="p-4 sm:p-5 overflow-y-auto">
          {currentStep === "payment" ? (
            /* =======================================================================
               PAYMENT METHOD VIEW (eSewa & Pay Later)
               ======================================================================= */
            <div className="space-y-3">
              <PaymentMethod
                bookingReference={submissionId}
                packageTitle={`${country} – ${visaType}`}
                category="Visa Service"
                tierName={selectedOption.name}
                guestsCount={guests}
                unitPriceFormatted={formattedPerPerson}
                totalPriceFormatted={formattedFee}
                travelDate={applicants[0]?.travelDate ? `Travel: ${applicants[0].travelDate}` : undefined}
                isProcessingPayment={isProcessingPayment}
                initialMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                onPayWithEsewa={handleEsewaPayment}
                onPayLater={handlePayLater}
              />
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep("form")}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium underline transition-colors cursor-pointer"
                >
                  ← Edit Application Details
                </button>
              </div>
            </div>
          ) : currentStep === "submitted" ? (
            /* =======================================================================
               CONFIRMATION & RECEIPT VIEW
               ======================================================================= */
            <div className="space-y-3 text-center animate-in fade-in zoom-in-95 duration-200">

              {/* Top Greeting & Status */}
              <div className="space-y-1.5 pt-0.5">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white mb-0.5 shadow-md ring-4 ${paymentStatus === "paid"
                    ? "bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/20 ring-emerald-50"
                    : "bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/20 ring-amber-50"
                  }`}>
                  <CheckCircle2 size={26} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${paymentStatus === "paid"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                    {paymentStatus === "paid" ? "Payment Received • Application Registered" : "Application Registered • Payment Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <h4 className="text-base sm:text-lg font-black text-[#1A0B2E] tracking-tight">
                    Thank you, {applicants[0]?.fullName || "Valued Applicant"}!
                  </h4>
                  <BadgeCheck size={18} className="text-emerald-600 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-500">
                  Your visa request for{" "}
                  <strong className="text-slate-800 font-semibold">
                    {country} ({visaType})
                  </strong>{" "}
                  has been registered for {guests} applicant{guests > 1 ? "s" : ""}.
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
                  A visa specialist will reach out on{" "}
                  <strong className="text-slate-800">WhatsApp &amp; Phone</strong> (
                  {applicants[0]?.phone
                    ? `${applicants[0].phoneCode} ${applicants[0].phone}`
                    : "your number"}
                  ) to coordinate next steps.
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
                    type="button"
                    onClick={handleCopyId}
                    className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-100/70 hover:bg-purple-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                {/* Key Details Grid */}
                <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-white">
                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      {guests > 1 ? "Primary Contact" : "Applicant"}
                    </span>
                    <span className="font-bold text-[#1A0B2E] truncate block text-xs mt-0.5">
                      {applicants[0]?.fullName || "—"}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Applicants
                    </span>
                    <span className="font-bold text-[#1A0B2E] truncate block text-xs mt-0.5">
                      {guests} {guests > 1 ? "Persons" : "Person"}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Visa Tier</span>
                    <span className="font-bold text-[#E91E63] truncate block text-xs mt-0.5">
                      {selectedOption.entryType || selectedOption.name}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      {guests > 1 ? `Total Fee (${guests} pax)` : "Processing Fee"}
                    </span>
                    <span className="font-black text-[#1A0B2E] text-xs mt-0.5 block">
                      {formattedFee}
                    </span>
                    {guests > 1 && (
                      <span className="text-[9px] text-slate-400 block">
                        {formattedPerPerson}/person
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Travel Date</span>
                    <span className="font-medium text-slate-700 text-xs truncate block mt-0.5">
                      {applicants[0]?.travelDate || "Flexible"}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Submitted At</span>
                    <span className="font-medium text-slate-700 text-[10.5px] truncate block mt-0.5">
                      {submittedAt}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Payment Status</span>
                    <span className={`font-black text-xs mt-0.5 block ${paymentStatus === "paid" ? "text-emerald-700" : "text-amber-600"}`}>
                      {paymentStatus.toUpperCase()} ({selectedPaymentMethod === "esewa" ? (paymentStatus === "paid" ? "eSewa" : "eSewa Pending") : "Pay Later"})
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Payment Verification</span>
                    <span className="font-black text-blue-600 text-xs mt-0.5 block">
                      PENDING
                    </span>
                  </div>
                </div>

                {/* Multiple applicants list breakdown if guests > 1 */}
                {guests > 1 && (
                  <div className="p-3 bg-slate-50/80 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block">
                        All Registered Applicants ({guests})
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Details &amp; Documents Verified
                      </span>
                    </div>
                    <div className="space-y-2 max-h-52 overflow-y-auto">
                      {applicants.map((app, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#200B3B] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                                {idx + 1}
                              </span>
                              <span className="font-black text-[#1A0B2E] text-xs">
                                {app.fullName || `Applicant ${idx + 1}`}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {app.nationality || "—"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] text-slate-600 bg-slate-50/70 p-1.5 rounded-lg border border-slate-100">
                            <div>
                              <span className="text-slate-400 block text-[8.5px] uppercase font-bold">Passport No.</span>
                              <span className="font-mono font-bold text-slate-800">{app.passportNumber || "—"}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8.5px] uppercase font-bold">Expiry Date</span>
                              <span className="font-semibold text-slate-700">{app.passportExpiry || "—"}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8.5px] uppercase font-bold">Travel Date</span>
                              <span className="font-semibold text-slate-700">{app.travelDate || "—"}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8.5px] uppercase font-bold">Contact</span>
                              <span className="truncate block font-semibold text-slate-700">{app.phone ? `${app.phoneCode} ${app.phone}` : app.email || "—"}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[9.5px] text-emerald-700 font-semibold">
                            {documentRequirements.map((requirement) => {
                              const file = app.documentFiles[String(requirement.id)];
                              if (!file) return null;

                              return (
                                <span key={requirement.id}>
                                  ✓ {requirement.title || requirement.document_type}: {file.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
               VISA APPLICATION FORM — WITH APPLICANT TABS AT THE TOP
               ======================================================================= */
            <form noValidate onSubmit={handleSubmit} className="space-y-4">

              {/* ── ERROR SUMMARY BANNER ── */}
              {hasSubmitted && (Object.keys(currentApplicantErrors).length > 0 || termsError) && (
                <div id="field-error-banner" className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold animate-in fade-in duration-200">
                  <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
                  <span>
                    {Object.keys(currentApplicantErrors).length > 0
                      ? `Please complete the highlighted required fields for ${guests > 1 ? `Applicant ${activeApplicantIndex + 1}` : "your application"} below.`
                      : termsError}
                  </span>
                </div>
              )}

              {/* ── APPLICANT SELECTOR TABS ── */}
              {guests > 1 && (
                <div className="bg-gradient-to-r from-purple-50/90 via-pink-50/40 to-purple-50/90 p-3 rounded-2xl border border-purple-200/80 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap px-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-[#200B3B] text-white flex items-center justify-center text-[10px] font-black">
                        {guests}
                      </div>
                      <h4 className="text-xs font-black text-[#200B3B] uppercase tracking-wider">
                        Applicants ({guests})
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-[#E91E63] bg-pink-100/80 px-2.5 py-0.5 rounded-full border border-pink-200">
                      Editing: Applicant {activeApplicantIndex + 1} of {guests}
                    </span>
                  </div>

                  {/* Scrollable Tabs for Applicants */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {applicants.map((app, idx) => {
                      const isActive = idx === activeApplicantIndex;
                      const appErrs = hasSubmitted ? formErrors[idx] : undefined;
                      const hasAppErrors = appErrs && Object.keys(appErrs).length > 0;
                      const isFilled =
                        app.fullName.trim() !== "" &&
                        app.passportNumber.trim() !== "" &&
                        app.nationality.trim() !== "" &&
                        !hasAppErrors;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveApplicantIndex(idx)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 border ${isActive
                              ? "bg-gradient-to-r from-[#200B3B] to-[#E91E63] text-white border-transparent shadow-sm shadow-pink-500/25"
                              : hasAppErrors
                                ? "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
                                : isFilled
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                  : "bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-300"
                            }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${isActive
                                ? "bg-white/20 text-white"
                                : hasAppErrors
                                  ? "bg-rose-200 text-rose-800"
                                  : isFilled
                                    ? "bg-emerald-200 text-emerald-800"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {hasAppErrors && !isActive ? "!" : idx + 1}
                          </span>
                          <span className="whitespace-nowrap font-extrabold">
                            Applicant {idx + 1}
                          </span>
                          {isFilled && !isActive && (
                            <Check size={12} className="text-emerald-600 stroke-[3]" />
                          )}
                          {hasAppErrors && !isActive && (
                            <AlertCircle size={12} className="text-rose-600 stroke-[2.5]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── SECTION 1: APPLICANT PERSONAL DETAILS ── */}
              <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100 space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-200/60">
                  <div className="flex items-center gap-2 text-[#200B3B]">
                    <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                      <User size={13} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider">
                      1. Personal Details{" "}
                      {guests > 1 ? `— Applicant ${activeApplicantIndex + 1}` : ""}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="field-fullName" className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name (As printed on Passport) <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      id="field-fullName"
                      type="text"
                      placeholder="Ram Bahadur Thapa"
                      value={currentApplicant.fullName}
                      onChange={(e) =>
                        updateCurrentApplicant({ fullName: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-white border rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] placeholder:text-xs placeholder:text-gray-400 placeholder:font-normal focus:outline-none transition-all ${
                        currentApplicantErrors.fullName
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 ring-2 ring-rose-200"
                          : "border-gray-200 focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100"
                      }`}
                    />
                    {currentApplicantErrors.fullName && (
                      <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
                        <AlertCircle size={12} className="flex-shrink-0" />
                        <span>{currentApplicantErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Nationality */}
                  <div>
                    <label htmlFor="field-nationality" className="block text-xs font-bold text-gray-700 mb-1">
                      Nationality <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      id="field-nationality"
                      type="text"
                      placeholder="Nepali"
                      value={currentApplicant.nationality}
                      onChange={(e) =>
                        updateCurrentApplicant({ nationality: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-white border rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] placeholder:text-xs placeholder:text-gray-400 placeholder:font-normal focus:outline-none transition-all ${
                        currentApplicantErrors.nationality
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 ring-2 ring-rose-200"
                          : "border-gray-200 focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100"
                      }`}
                    />
                    {currentApplicantErrors.nationality && (
                      <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
                        <AlertCircle size={12} className="flex-shrink-0" />
                        <span>{currentApplicantErrors.nationality}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="field-email" className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      id="field-email"
                      type="email"
                      placeholder="ram.thapa@gmail.com"
                      value={currentApplicant.email}
                      onChange={(e) =>
                        updateCurrentApplicant({ email: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-white border rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] placeholder:text-xs placeholder:text-gray-400 placeholder:font-normal focus:outline-none transition-all ${
                        currentApplicantErrors.email
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 ring-2 ring-rose-200"
                          : "border-gray-200 focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100"
                      }`}
                    />
                    {currentApplicantErrors.email && (
                      <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
                        <AlertCircle size={12} className="flex-shrink-0" />
                        <span>{currentApplicantErrors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* WhatsApp Phone with Country Code */}
                  <div>
                    <label htmlFor="field-phone" className="block text-xs font-bold text-gray-700 mb-1">
                      WhatsApp / Mobile Phone <span className="text-[#E91E63]">*</span>
                    </label>
                    <div
                      className={`flex items-stretch border rounded-xl bg-white transition-all overflow-hidden ${
                        currentApplicantErrors.phone
                          ? "border-rose-400 bg-rose-50/20 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100 ring-2 ring-rose-200"
                          : "border-gray-200 focus-within:border-[#E91E63] focus-within:ring-2 focus-within:ring-pink-100"
                      }`}
                    >
                      {/* Country Code Selector */}
                      <select
                        value={currentApplicant.phoneCode}
                        onChange={(e) =>
                          updateCurrentApplicant({ phoneCode: e.target.value })
                        }
                        className="flex-shrink-0 bg-gray-50 border-r border-gray-200 px-2 py-2 text-xs font-bold text-[#200B3B] focus:outline-none cursor-pointer"
                        style={{ maxWidth: "110px" }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.iso} value={c.code}>
                            {isoToFlag(c.iso)} {c.code}
                          </option>
                        ))}
                      </select>
                      {/* Phone Number Input */}
                      <input
                        id="field-phone"
                        type="tel"
                        placeholder="9841234567"
                        value={currentApplicant.phone}
                        onChange={(e) =>
                          updateCurrentApplicant({ phone: e.target.value })
                        }
                        className="flex-1 min-w-0 px-3 py-2 bg-transparent text-xs sm:text-sm font-semibold text-[#200B3B] placeholder:text-xs placeholder:text-gray-400 placeholder:font-normal focus:outline-none"
                      />
                    </div>
                    {currentApplicantErrors.phone && (
                      <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
                        <AlertCircle size={12} className="flex-shrink-0" />
                        <span>{currentApplicantErrors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: PASSPORT & TRAVEL PLANS ── */}
              <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100 space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-200/60">
                  <div className="flex items-center gap-2 text-[#200B3B]">
                    <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                      <CreditCard size={13} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider">
                      2. Passport &amp; Travel Plans{" "}
                      {guests > 1
                        ? `— Applicant ${activeApplicantIndex + 1}`
                        : ""}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Passport Number */}
                  <div>
                    <label htmlFor="field-passportNumber" className="block text-xs font-bold text-gray-700 mb-1">
                      Passport Number <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      id="field-passportNumber"
                      type="text"
                      placeholder="09876543"
                      value={currentApplicant.passportNumber}
                      onChange={(e) =>
                        updateCurrentApplicant({
                          passportNumber: e.target.value.toUpperCase(),
                        })
                      }
                      className={`w-full px-3 py-2 bg-white border rounded-xl text-xs sm:text-sm font-mono font-bold text-[#200B3B] uppercase placeholder:text-xs placeholder:text-gray-400 placeholder:font-normal placeholder:font-sans focus:outline-none transition-all ${
                        currentApplicantErrors.passportNumber
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 ring-2 ring-rose-200"
                          : "border-gray-200 focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100"
                      }`}
                    />
                    {currentApplicantErrors.passportNumber && (
                      <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
                        <AlertCircle size={12} className="flex-shrink-0" />
                        <span>{currentApplicantErrors.passportNumber}</span>
                      </p>
                    )}
                  </div>

                  {/* Passport Expiry Date */}
                  <div>
                    <label htmlFor="field-passportExpiry" className="block text-xs font-bold text-gray-700 mb-1">
                      Passport Expiry Date <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      id="field-passportExpiry"
                      type="date"
                      min={todayStr}
                      value={currentApplicant.passportExpiry}
                      onChange={(e) =>
                        updateCurrentApplicant({
                          passportExpiry: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 bg-white border rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] focus:outline-none transition-all ${
                        currentApplicantErrors.passportExpiry
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 ring-2 ring-rose-200"
                          : "border-gray-200 focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100"
                      }`}
                    />
                    {currentApplicantErrors.passportExpiry && (
                      <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
                        <AlertCircle size={12} className="flex-shrink-0" />
                        <span>{currentApplicantErrors.passportExpiry}</span>
                      </p>
                    )}
                  </div>

                  {/* Intended Travel Date */}
                  <div>
                    <label htmlFor="field-travelDate" className="block text-xs font-bold text-gray-700 mb-1">
                      Intended Travel Date <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      id="field-travelDate"
                      type="date"
                      min={todayStr}
                      value={currentApplicant.travelDate}
                      onChange={(e) =>
                        updateCurrentApplicant({ travelDate: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-white border rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] focus:outline-none transition-all ${
                        currentApplicantErrors.travelDate
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 ring-2 ring-rose-200"
                          : "border-gray-200 focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100"
                      }`}
                    />
                    {currentApplicantErrors.travelDate && (
                      <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
                        <AlertCircle size={12} className="flex-shrink-0" />
                        <span>{currentApplicantErrors.travelDate}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: DOCUMENT ATTACHMENTS ── */}
              <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100 space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-200/60">
                  <div className="flex items-center gap-2 text-[#200B3B]">
                    <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                      <UploadCloud size={13} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider">
                      3. Document Attachments{" "}
                      {guests > 1
                        ? `— Applicant ${activeApplicantIndex + 1}`
                        : ""}
                    </h4>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 -mt-1">
                  Attach files for Applicant {activeApplicantIndex + 1} or send later via WhatsApp. Accepted: PDF, JPG, PNG (max 10 MB each).
                </p>

                <div className="space-y-2.5">
                  {documentsLoading ? (
                    <div className="py-4 text-center text-xs font-semibold text-gray-400">Loading document requirements...</div>
                  ) : documentRequirements.length > 0 ? (
                    documentRequirements.map((requirement) => {
                      const requirementId = String(requirement.id);
                      const file = currentApplicant.documentFiles[requirementId] || null;
                      const docError = currentApplicantErrors[`doc_${requirement.id}`];
                      const inputId = `visa-document-${activeApplicantIndex}-${requirement.id}`;
                      return (
                        <div key={requirement.id} id={`field-doc_${requirement.id}`} className="space-y-1">
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
                              accept=".pdf,.jpg,.jpeg,.png,.webp"
                              className="hidden"
                              onChange={(e) => {
                                handleDocumentChange(requirement.id, e.target.files?.[0] || null);
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
                                {file ? (
                                  <CheckCircle2 size={16} />
                                ) : (
                                  <FileText size={15} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#200B3B] flex items-center gap-1 flex-wrap">
                                  {requirement.title || requirement.document_type || requirement.name || "Document"}
                                  {requirement.is_required ? (
                                    <span className="text-[#E91E63] font-black">*</span>
                                  ) : (
                                    <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                      Optional
                                    </span>
                                  )}
                                </p>
                                {file ? (
                                  <p className="text-[10px] text-emerald-700 font-semibold truncate max-w-[180px]">
                                    {file.name}{" "}
                                    <span className="text-emerald-500 font-normal">
                                      ({(file.size / 1024).toFixed(0)} KB)
                                    </span>
                                  </p>
                                ) : (
                                  <p className="text-[10px] text-gray-400">
                                    {requirement.description || requirement.document_type || "Attach required document"}
                                  </p>
                                )}
                              </div>
                            </div>
                            {file ? (
                              <button
                                type="button"
                                onClick={() => handleDocumentChange(requirement.id, null)}
                                className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                <Trash2 size={11} />
                                Remove
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
                                Attach
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
                    })
                  ) : (
                    <div className="py-4 text-center text-xs font-semibold text-gray-400">No document requirements available.</div>
                  )}
                </div>
              </div>

              {/* ── ADDITIONAL NOTES ── */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Additional Notes / Special Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Need urgent visa counseling or appointment assistance..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-[#200B3B] placeholder:text-xs placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all"
                />
              </div>

              {/* ── TERMS & AGREEMENT NOTE ── */}
              <div
                id="field-termsAgreed"
                className={`p-3.5 rounded-2xl border transition-all ${
                  termsError
                    ? "bg-rose-50/40 border-rose-300 ring-2 ring-rose-200"
                    : "bg-purple-50/50 border-purple-100"
                }`}
              >
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    id="field-termsAgreed-input"
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => {
                      setTermsAgreed(e.target.checked);
                      if (e.target.checked) setTermsError("");
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-[#E91E63] focus:ring-[#E91E63] border-gray-300 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I understand that embassy visa processing fees and confirmed tickets are non-refundable as per embassy rules. All information provided above for all {guests} applicant{guests > 1 ? "s" : ""} is authentic and accurate.
                  </span>
                </label>
                {termsError && (
                  <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1.5 pl-6">
                    <AlertCircle size={12} className="flex-shrink-0" />
                    <span>{termsError}</span>
                  </p>
                )}
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
                  disabled={isSubmittingApplication}
                  className="px-7 py-2.5 bg-gradient-to-r from-[#200B3B] to-[#E91E63] hover:from-[#2D1347] hover:to-pink-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-pink-500/25 hover:shadow-pink-500/40 active:scale-98 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{isSubmittingApplication ? "Submitting..." : `Submit Application (${guests} Pax)`}</span>
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
