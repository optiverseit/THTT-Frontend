import React, { useState, useRef, useEffect } from "react";
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
  Mountain,
  AlertCircle,
  Users,
  HeartPulse,
} from "lucide-react";
import { useGlobalCurrency, displayPrice, formatNPR, formatUSD, formatINR } from "../../context/CurrencyContext";
import THTTLogo from "../../assets/images/THTTLogo.png";
import { COUNTRY_CODES, isoToFlag } from "../../utils/countrycodes";
import { InsurancePlan, InsuranceCostOption } from "./insuranceData";
import { InsuranceDocumentField, DEFAULT_DOCUMENT_CONFIG, buildEmptyDocumentFiles } from "./insuranceDocumentConfig";
import { createInsuranceApplication, initiatePayment } from "../../api/BackendApi";
import { PaymentMethod } from "../reusable/PaymentMethod";

/** Dynamic insurance requirement field definition (can be loaded from API/database) */
export interface InsuranceRequirementField {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "number" | "date" | "textarea" | "select" | "checkbox" | "radio";
  options?: string[];
  defaultValue?: string;
}

/** Default requirement configuration (1 input field for now, extensible dynamically via API/database) */
export const DEFAULT_REQUIREMENT_CONFIG: InsuranceRequirementField[] = [];

export interface InsuranceApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: InsurancePlan & { backendId?: number };
  selectedOption: InsuranceCostOption & { id?: number };
  numberOfTravelers?: number;
  /** Optional document config override from admin panel / API */
  documentConfig?: InsuranceDocumentField[];
  /** Optional dynamic insurance requirement fields from admin panel / database / API */
  requirementConfig?: InsuranceRequirementField[];
}

export interface InsuredApplicantData {
  fullName: string;
  nationality: string;
  email: string;
  phoneCode: string;
  phone: string;
  passportNumber: string;
  passportExpiry: string;
  dateOfBirth: string;
  /** Dynamic file map keyed by InsuranceDocumentField.id */
  files: Record<string, File | null>;
  hasMedicalCondition: boolean;
  medicalNotes: string;
}

const createDefaultApplicant = (docConfig: InsuranceDocumentField[] = DEFAULT_DOCUMENT_CONFIG): InsuredApplicantData => ({
  fullName: "",
  nationality: "Nepal",
  email: "",
  phoneCode: "+977",
  phone: "",
  passportNumber: "",
  passportExpiry: "",
  dateOfBirth: "",
  files: buildEmptyDocumentFiles(docConfig),
  hasMedicalCondition: false,
  medicalNotes: "",
});

export const InsuranceApplicationModal: React.FC<InsuranceApplicationModalProps> = ({
  isOpen,
  onClose,
  plan,
  selectedOption,
  numberOfTravelers = 1,
  documentConfig = DEFAULT_DOCUMENT_CONFIG,
  requirementConfig = DEFAULT_REQUIREMENT_CONFIG,
}) => {
  const safeRequirementConfig = requirementConfig || [];
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  const travelersCount = numberOfTravelers > 0 ? numberOfTravelers : 1;
  const totalNprPrice = selectedOption.nprPrice * travelersCount;

  const [applicants, setApplicants] = useState<InsuredApplicantData[]>(() =>
    Array.from({ length: travelersCount }, () => createDefaultApplicant(documentConfig))
  );
  const [activeApplicantIndex, setActiveApplicantIndex] = useState(0);

  // Dynamic Insurance Requirements values (keyed by field id)
  const [requirementValues, setRequirementValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    safeRequirementConfig.forEach((f) => {
      initial[f.id] = f.defaultValue || "";
    });
    return initial;
  });

  // Emergency contact phone (Optional)
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");

  // Dates
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Submission State
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [submittedAt, setSubmittedAt] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [insuranceApplicationId, setInsuranceApplicationId] = useState<number | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"esewa" | "pay_later">("esewa");

  // File input refs — one per document config slot (dynamic)
  const fileRefs = useRef<Record<string, React.RefObject<HTMLInputElement | null>>>({});
  documentConfig.forEach((field) => {
    if (!fileRefs.current[field.id]) {
      fileRefs.current[field.id] = React.createRef<HTMLInputElement>();
    }
  });

  // Sync applicants array whenever travelersCount or modal opens
  useEffect(() => {
    if (isOpen) {
      setApplicants((prev) => {
        if (prev.length === travelersCount) return prev;
        const next = [...prev];
        while (next.length < travelersCount) {
          next.push(createDefaultApplicant(documentConfig));
        }
        return next.slice(0, travelersCount);
      });
      setActiveApplicantIndex(0);

      // Sync dynamic requirement values from config
      setRequirementValues((prev) => {
        const next = { ...prev };
        safeRequirementConfig.forEach((f) => {
          if (next[f.id] === undefined) {
            next[f.id] = f.defaultValue || "";
          }
        });
        return next;
      });
    }
  }, [travelersCount, isOpen, plan, documentConfig, safeRequirementConfig]);

  if (!isOpen) return null;

  const currentApplicant =
    applicants[activeApplicantIndex] || applicants[0] || createDefaultApplicant(documentConfig);

  const updateCurrentApplicant = (patch: Partial<InsuredApplicantData>) => {
    setApplicants((prev) => {
      const updated = [...prev];
      if (!updated[activeApplicantIndex]) return prev;
      updated[activeApplicantIndex] = {
        ...updated[activeApplicantIndex],
        ...patch,
      };
      return updated;
    });
  };

  /** Universal file handler – works for any document config slot */
  const handleFileChange = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateCurrentApplicant({
        files: { ...currentApplicant.files, [fieldId]: e.target.files[0] },
      });
    }
    e.target.value = "";
  };

  const clearFile = (fieldId: string) => {
    updateCurrentApplicant({
      files: { ...currentApplicant.files, [fieldId]: null },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const planId = Number((plan as any).backendId || plan.id);
    const pricingTierId = Number(selectedOption.id);
    if (!Number.isFinite(planId) || planId <= 0) { alert("Insurance plan ID is missing."); return; }
    if (!Number.isFinite(pricingTierId) || pricingTierId <= 0) { alert("Insurance pricing tier ID is missing."); return; }
    if (documentConfig.length === 0) { alert("No document requirements are configured for this insurance plan."); return; }

    for (let i = 0; i < travelersCount; i++) {
      const app = applicants[i];
      if (!app || !app.fullName.trim()) { setActiveApplicantIndex(i); alert(`Please enter Full Name for Traveler ${i + 1}.`); return; }
      if (!app.nationality.trim()) { setActiveApplicantIndex(i); alert(`Please enter Nationality for Traveler ${i + 1}.`); return; }
      if (!app.dateOfBirth) { setActiveApplicantIndex(i); alert(`Please enter Date of Birth for Traveler ${i + 1}.`); return; }

      const dob = new Date(app.dateOfBirth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dobDate = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());

      if (dobDate >= today) { setActiveApplicantIndex(i); alert(`Date of Birth must be before today for Traveler ${i + 1}.`); return; }

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;

      if (age < 18) { setActiveApplicantIndex(i); alert(`Traveler ${i + 1} must be at least 18 years old to apply for insurance.`); return; }
      if (!app.passportNumber.trim()) { setActiveApplicantIndex(i); alert(`Please enter Passport, NID, or Citizenship Number for Traveler ${i + 1}.`); return; }
      if (!app.email.trim()) { setActiveApplicantIndex(i); alert(`Please enter Email Address for Traveler ${i + 1}.`); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email.trim())) { setActiveApplicantIndex(i); alert(`Please enter a valid email address for Traveler ${i + 1}.`); return; }
      if (!app.phone.trim()) { setActiveApplicantIndex(i); alert(`Please enter WhatsApp / Mobile Number for Traveler ${i + 1}.`); return; }
      if (app.phone.replace(/\D/g, "").length !== 10) { setActiveApplicantIndex(i); alert(`Phone number must be exactly 10 digits for Traveler ${i + 1}.`); return; }

      for (const field of documentConfig) {
        const file = app.files[field.id];
        if (field.required && !file) { setActiveApplicantIndex(i); alert(`Please upload "${field.title}" for Traveler ${i + 1}.`); return; }
        if (file && file.size > 5 * 1024 * 1024) { setActiveApplicantIndex(i); alert(`"${field.title}" for Traveler ${i + 1} must be 5 MB or smaller.`); return; }
      }
    }

    for (const field of safeRequirementConfig) {
      if (field.required && !requirementValues[field.id]?.trim()) {
        alert(`Please enter ${field.name}.`);
        return;
      }
    }

    if (!startDate) { alert("Please select the Policy Expected Start Date."); return; }
    if (!endDate) { alert("Please select the Policy Expected End Date."); return; }

    const todayString = new Date().toISOString().split("T")[0];
    if (startDate < todayString) { alert("Policy Expected Start Date cannot be before today."); return; }
    if (endDate < startDate) { alert("Policy Expected End Date cannot be earlier than Policy Expected Start Date."); return; }
    if (!termsAgreed) { alert("Please accept the insurance terms and conditions to proceed."); return; }

    try {
      setIsSubmittingApplication(true);

      const formData = new FormData();
      formData.append("insurance_plan_id", String(planId));
      formData.append("insurance_pricing_tier_id", String(pricingTierId));
      formData.append("start_date", startDate);
      formData.append("end_date", endDate);

      applicants.forEach((app, applicantIndex) => {
        formData.append(`applicants[${applicantIndex}][applicant_full_name]`, app.fullName.trim());
        formData.append(`applicants[${applicantIndex}][date_of_birth]`, app.dateOfBirth);
        formData.append(`applicants[${applicantIndex}][nationality]`, app.nationality.trim());
        if (app.email.trim()) formData.append(`applicants[${applicantIndex}][email]`, app.email.trim());
        if (app.phoneCode) formData.append(`applicants[${applicantIndex}][country_code]`, app.phoneCode);
        if (app.phone.trim()) formData.append(`applicants[${applicantIndex}][phone_number]`, app.phone.trim());
        formData.append(`applicants[${applicantIndex}][passport_number]`, app.passportNumber.trim());
        if (emergencyContactPhone.trim()) {
          formData.append(`applicants[${applicantIndex}][emergency_contact_number]`, emergencyContactPhone.trim());
        }

        safeRequirementConfig.forEach((field) => {
          const value = requirementValues[field.id];
          if (value !== undefined && value !== "") {
            formData.append(`applicants[${applicantIndex}][dynamic_fields][${field.id}]`, value);
          }
        });

        let documentIndex = 0;
        documentConfig.forEach((field) => {
          const file = app.files[field.id];
          if (!file) return;

          formData.append(
            `applicants[${applicantIndex}][documents][${documentIndex}][insurance_document_requirement_id]`,
            String(field.id)
          );
          formData.append(
            `applicants[${applicantIndex}][documents][${documentIndex}][file]`,
            file
          );
          documentIndex++;
        });
      });

      const response = await createInsuranceApplication(formData);
      const application = response?.data?.data;

      if (!response?.data?.status || !application?.id) {
        throw new Error(response?.data?.message || "Failed to create insurance application.");
      }

      setInsuranceApplicationId(Number(application.id));
      setSubmissionId(application.application_number || `INS-${application.id}`);
      setSubmittedAt(new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }));
      setShowPaymentStep(true);
    } catch (error: any) {
      console.error("Insurance application submission failed:", error);
      const errors = error?.response?.data?.errors;
      const firstError = errors ? Object.values(errors).flat()?.[0] : null;
      alert(String(firstError || error?.response?.data?.message || error?.message || "Failed to create insurance application."));
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const redirectToEsewa = (paymentData: any) => {
    if (!paymentData?.payment_url) throw new Error("eSewa payment URL was not returned by the server.");
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
    if (!insuranceApplicationId) { alert("Insurance application ID is missing. Please submit the application again."); return; }
    try {
      setIsProcessingPayment(true);
      setSelectedPaymentMethod("esewa");
      const response = await initiatePayment({ insurance_application_id: insuranceApplicationId, provider: "ESEWA" });
      if (!response?.data?.status) throw new Error(response?.data?.message || "Unable to initiate eSewa payment.");
      redirectToEsewa(response.data.data);
    } catch (error: any) {
      console.error("eSewa payment initiation failed:", error);
      alert(error?.response?.data?.message || error?.message || "Unable to initiate eSewa payment.");
      setIsProcessingPayment(false);
    }
  };

  const handlePayLater = async () => {
    if (!insuranceApplicationId) { alert("Insurance application ID is missing. Please submit the application again."); return; }
    try {
      setIsProcessingPayment(true);
      setSelectedPaymentMethod("pay_later");
      const response = await initiatePayment({ insurance_application_id: insuranceApplicationId, provider: "PAYLATER" });
      if (!response?.data?.status) throw new Error(response?.data?.message || "Unable to select Pay Later.");
      setShowPaymentStep(false);
      setSubmitted(true);
    } catch (error: any) {
      console.error("Pay Later initiation failed:", error);
      alert(error?.response?.data?.message || error?.message || "Unable to select Pay Later.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePrintSlip = () => {
    document.body.classList.add("printing-modal-slip");
    const originalTitle = document.title;
    document.title = `${submissionId} - Insurance Application Confirmation - Trip Himalaya`;
    window.print();
    const cleanup = () => {
      document.body.classList.remove("printing-modal-slip");
      document.title = originalTitle;
    };
    window.addEventListener("afterprint", cleanup, { once: true });
    setTimeout(cleanup, 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(submissionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppFollowUp = () => {
    const totalFormatted = displayPrice(totalNprPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR);
    const reqSummary = safeRequirementConfig
      .map((f) => `*${f.name}:* ${requirementValues[f.id] || "N/A"}`)
      .join("\n");
    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Travel & Trekking Insurance Team)!\n\nI have just submitted an online insurance application.\n\n*Reference ID:* ${submissionId}\n*Plan:* ${plan.name} (${selectedOption.name})\n*Altitude Cap:* ${plan.maxAltitude}\n*Travelers:* ${travelersCount} Person(s) (Lead: ${applicants[0].fullName})\n*Dates:* ${startDate} to ${endDate}\n${reqSummary}\n*Emergency Contact:* ${emergencyContactPhone || "N/A"}\n*Estimated Premium:* ${totalFormatted}\n\nAll required documents have been attached. Please issue the official policy certificate and cashless hospital card.`
    );
    window.open(`https://api.whatsapp.com/send?phone=9779851420882&text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <style>{`
        .ins-modal-input::placeholder { font-size: 10px; font-weight: 400; color: #b0b7c3; letter-spacing: 0.01em; }
      `}</style>
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative w-full ${submitted ? "max-w-2xl" : "max-w-xl"} bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-3 sm:my-6 flex flex-col max-h-[92vh] z-10 print:border-none print:shadow-none print:max-w-none print:w-full print:rounded-none`}>
        
        {/* ── TOP HEADER ── */}
        <div className="bg-gradient-to-r from-[#2D1347] via-[#3B145C] to-[#2D1347] px-4 pt-4 pb-3.5 sm:px-5 sm:pt-4.5 sm:pb-3.5 text-white flex items-start justify-between print:hidden">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
              <Mountain className="text-pink-300" size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black tracking-widest uppercase bg-[#E11D48] text-white px-2.5 py-0.5 rounded-full">
                  {plan.badge}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white truncate mt-0.5">
                {submitted ? "Insurance Application Confirmed" : showPaymentStep ? "Choose Payment Method" : `Apply for ${plan.name}`}
              </h2>
              <p className="text-xs text-white/80 font-semibold mt-0.5">
                {selectedOption.name} ({selectedOption.days})
              </p>
            </div>
          </div>

          {/* Right side: Close button top (tier level) + Price pill bottom */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-3">
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer flex-shrink-0"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
            {!submitted && !showPaymentStep && (
              <div className="bg-[#E11D48] text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md whitespace-nowrap mt-3.5">
                {displayPrice(selectedOption.nprPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR)}{" "}
                <span className="text-[10px] font-semibold text-white/90">/Person</span>
              </div>
            )}
          </div>
        </div>



        {/* ══════════════════════════════════════════════════════════════════
            SUBMITTED SUCCESS VIEW / CONFIRMATION SLIP
            ══════════════════════════════════════════════════════════════════ */}
        {submitted ? (
          <div className="max-h-[85vh] overflow-y-auto">
            {/* ── ON-SCREEN MODERN, CLEAN, PROFESSIONAL VIEW ── */}
            <div className="p-6 sm:p-7 text-center w-full print:hidden space-y-4">
              
              {/* Soft Green Success Icon */}
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 shadow-sm">
                <CheckCircle2 size={32} />
              </div>

              {/* Headings */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-lg mx-auto leading-relaxed">
                  Your insurance application has been received successfully. Our alpine safety and insurance desk is reviewing your documents to issue your official policy certificate.
                </p>
              </div>

              {/* Reference ID Pill with 1-Click Copy */}
              <div className="inline-flex items-center gap-2 bg-purple-50/80 border border-purple-100 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#2D1347]">
                <span className="text-purple-400 font-sans font-semibold text-[11px]">Reference ID:</span>
                <span>{submissionId}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-purple-400 hover:text-[#2D1347] cursor-pointer transition-colors ml-0.5"
                  title="Copy Reference ID"
                >
                  {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                </button>
              </div>

              {/* Clean, Unified Summary Card */}
              <div className="bg-gray-50/90 border border-gray-200/90 rounded-2xl p-5 sm:p-6 text-left space-y-4 shadow-2xs">
                {/* Plan & Total Row */}
                <div className="flex items-start justify-between pb-3.5 border-b border-gray-200/80 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Selected Plan</span>
                    <h4 className="text-sm sm:text-base font-black text-[#2D1347] mt-0.5">{plan.name}</h4>
                    <span className="text-[11px] text-gray-500">{selectedOption.name} • {plan.maxAltitude}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Premium</span>
                    <span className="text-base sm:text-lg font-black text-[#2D1347] block mt-0.5">
                      {displayPrice(totalNprPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                      {travelersCount} {travelersCount === 1 ? "Traveler" : "Travelers"}
                    </span>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Lead Traveler</span>
                    <span className="font-bold text-gray-800 block mt-0.5 truncate">
                      {applicants[0]?.fullName || "Traveler"}
                      {travelersCount > 1 && ` (+${travelersCount - 1} more)`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Expected Policy Dates</span>
                    <span className="font-bold text-gray-800 block mt-0.5">
                      {startDate} → {endDate}
                    </span>
                  </div>
                  {safeRequirementConfig.map((field) => (
                    <div key={field.id}>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{field.name}</span>
                      <span className="font-bold text-gray-800 block mt-0.5 truncate" title={requirementValues[field.id] || "N/A"}>
                        {requirementValues[field.id] || "N/A"}
                      </span>
                    </div>
                  ))}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Emergency Contact</span>
                    <span className="font-bold text-gray-800 block mt-0.5 truncate" title={emergencyContactPhone || "Optional (Not provided)"}>
                      {emergencyContactPhone || "Optional (Not provided)"}
                    </span>
                  </div>
                </div>

                {/* 3-Step What Happens Next Timeline */}
                <div className="pt-3.5 border-t border-gray-200/80">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5">
                    Application Process:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-xl border border-gray-100 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold mb-1 shadow-2xs">
                        ✓
                      </div>
                      <span className="text-[11px] font-bold text-gray-800">Application Received</span>
                      <span className="text-[9px] text-emerald-600 font-medium mt-0.5">Documents Uploaded</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200/80 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold mb-1 shadow-2xs animate-pulse">
                        2
                      </div>
                      <span className="text-[11px] font-bold text-amber-900">Under Review</span>
                      <span className="text-[9px] text-amber-600 font-medium mt-0.5">Admin Verification</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-gray-100 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 border border-gray-200 flex items-center justify-center text-[10px] font-bold mb-1">
                        3
                      </div>
                      <span className="text-[11px] font-bold text-gray-700">Policy Issued</span>
                      <span className="text-[9px] text-gray-400 mt-0.5">Via WhatsApp &amp; PDF</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Hotline Strip */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center justify-between text-xs text-emerald-900 flex-wrap gap-2">
                <div className="flex items-center gap-2 font-medium text-[11px]">
                  <ShieldCheck size={15} className="text-emerald-600 flex-shrink-0" />
                  <span>Cashless Hospital Direct Billing &amp; 24/7 Rescue Protocol Active</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800">SOS: +977 9851420882</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleWhatsAppFollowUp}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>Confirm on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer size={14} className="text-purple-600" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>

            {/* ── PRINT-ONLY OFFICIAL CONFIRMATION SLIP (Activated only during print) ── */}
            <div
              id="insurance-slip"
              className="hidden print:block insurance-modal-slip-print p-0 space-y-0 text-gray-800 relative"
              style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
                fontSize: "10.5px",
                lineHeight: "1.45",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
                background: "#faf8fc",
                position: "relative",
                minHeight: "297mm",
              }}
            >
              <style>{`
                @page {
                  size: A4 portrait;
                  margin: 10mm 12mm;
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
                  /* When printing modal slip, HIDE the background quotation */
                  body.printing-modal-slip .insurance-plan-quotation-print {
                    display: none !important;
                  }
                  /* When not printing modal slip, HIDE this slip */
                  body:not(.printing-modal-slip) .insurance-modal-slip-print {
                    display: none !important;
                  }
                  #insurance-slip {
                    display: block !important;
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    background: #faf8fc !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  .slip-coverage-bg {
                    background: #fbf7ff !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  .slip-schedule-bg {
                    background: #f8fafc !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  .slip-emergency-bg {
                    background: #fff1f2 !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  .slip-table-header {
                    background: #f1f5f9 !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  .slip-header-bg {
                    background: #2D1347 !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  #insurance-slip {
                    background: #faf8fc !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                }
              `}</style>

              {/* Watermark — CSS flexbox centered, text color always prints */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
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

              {/* Slip Header — Purple gradient banner matching the quotation PDF */}
              <div
                className="slip-header-bg"
                style={{
                  background: "linear-gradient(135deg, #2D1347 0%, #3B145C 50%, #4a1c7a 100%)",
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0",
                }}
              >
                {/* Logo + Company Name */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ background: "#ffffff", borderRadius: "6px", padding: "3px 6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img src={THTTLogo} alt="Trip Himalaya" style={{ height: "44px", width: "auto", objectFit: "contain", display: "block" }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "0.02em", textTransform: "uppercase" }}>
                      Trip Himalaya Tours &amp; Travel Pvt. Ltd.
                    </h4>
                    <p style={{ fontSize: "8.5px", color: "#f3e8ff", margin: "3px 0 0", lineHeight: 1.4 }}>
                      Emergency Travel &amp; High-Altitude Alpine Rescue Insurance Desk • Govt. Reg. No. 2490
                    </p>
                    {/* Contact rows with icons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "3px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <span style={{ fontSize: "8px", color: "#e9d5ff", display: "inline-flex", alignItems: "center", gap: "3px", whiteSpace: "nowrap" }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          Airport, Shambhu Marg, Road No. 04, Kathmandu
                        </span>
                        <span style={{ fontSize: "8px", color: "#e9d5ff", display: "inline-flex", alignItems: "center", gap: "3px", whiteSpace: "nowrap" }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.44 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                          </svg>
                          +977 9851420882
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <span style={{ fontSize: "8px", color: "#e9d5ff", display: "inline-flex", alignItems: "center", gap: "3px", whiteSpace: "nowrap" }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          dev.triphimalayatt@gmail.com
                        </span>
                        <span style={{ fontSize: "8px", color: "#e9d5ff", display: "inline-flex", alignItems: "center", gap: "3px", whiteSpace: "nowrap" }}>
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

                {/* Right: Badge + Ref */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "8px", background: "rgba(233, 30, 99, 0.3)", color: "#fbcfe8", padding: "2px 8px", borderRadius: "4px", fontWeight: 800, border: "1px solid rgba(233, 30, 99, 0.4)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "4px" }}>
                    Official Confirmation Slip
                  </div>
                  <div style={{ fontSize: "9.5px", fontFamily: "monospace", fontWeight: 900, color: "#ffffff" }}>
                    {submissionId}
                  </div>
                  <div style={{ fontSize: "8px", color: "#c4b5fd", marginTop: "2px" }}>
                    {submittedAt}
                  </div>
                </div>
              </div>

              {/* Pink accent line */}
              <div style={{ height: "3px", background: "linear-gradient(90deg, #E91E63 0%, #db2777 30%, #9333ea 70%, #2D1347 100%)", marginBottom: "14px" }} />

              {/* Content wrapper with padding */}
              <div style={{ padding: "0 16px 16px" }} className="space-y-4 relative z-1">

              {/* Policy & Coverage Summary */}
              <div
                className="slip-coverage-bg grid grid-cols-4 gap-3 p-3.5 rounded-xl border text-xs relative z-1"
                style={{ background: "#fbf7ff", borderColor: "#e9d5ff" }}
              >
                <div>
                  <span className="text-gray-400 block text-[9px] font-bold uppercase tracking-wider">Plan Name</span>
                  <strong className="text-[#2D1347] font-black text-xs sm:text-sm block mt-0.5">{plan.name}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] font-bold uppercase tracking-wider">Max Altitude</span>
                  <strong className="text-[#E11D48] font-black text-xs sm:text-sm block mt-0.5">{plan.maxAltitude}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] font-bold uppercase tracking-wider">Medical Coverage</span>
                  <strong className="text-emerald-700 font-black text-xs sm:text-sm block mt-0.5">{selectedOption.coverageLimit}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] font-bold uppercase tracking-wider">Total Premium</span>
                  <strong className="text-[#2D1347] font-black text-xs sm:text-sm block mt-0.5">
                    {displayPrice(totalNprPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                  </strong>
                </div>
              </div>

              {/* Insurance Requirements & Dates Schedule */}
              <div
                className="slip-schedule-bg grid grid-cols-3 gap-3 text-xs p-3.5 rounded-xl border relative z-1"
                style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
              >
                <div>
                  <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">Policy Coverage Dates</span>
                  <span className="font-bold text-[#2D1347] block mt-0.5">{startDate} to {endDate}</span>
                </div>
                {safeRequirementConfig.map((field) => (
                  <div key={field.id}>
                    <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">{field.name}</span>
                    <span className="font-bold text-gray-800 block mt-0.5">{requirementValues[field.id] || "N/A"}</span>
                  </div>
                ))}
                <div>
                  <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">Emergency Contact</span>
                  <span className="font-bold text-gray-800 block mt-0.5">{emergencyContactPhone || "Optional (Not provided)"}</span>
                </div>
              </div>

              {/* Travelers Table */}
              <div className="relative z-1">
                <h5 className="text-[10.5px] font-black text-[#2D1347] uppercase tracking-wider mb-1.5">
                  Insured Persons ({travelersCount})
                </h5>
                <div className="overflow-x-auto border border-gray-200 rounded-xl" style={{ borderColor: "#e2e8f0" }}>
                  <table className="w-full text-left text-xs">
                    <thead className="slip-table-header text-gray-700 font-bold text-[9px] uppercase tracking-wider" style={{ background: "#f1f5f9" }}>
                      <tr>
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Full Name</th>
                        <th className="py-2 px-3">Passport / NID / Citizenship No.</th>
                        <th className="py-2 px-3">Nationality</th>
                        <th className="py-2 px-3">Contact</th>
                        <th className="py-2 px-3">Documents Uploaded</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800 text-[10.5px]">
                      {applicants.map((app, idx) => (
                        <tr key={idx} style={{ background: idx % 2 === 0 ? "#ffffff" : "#fcfbfd" }}>
                          <td className="py-2 px-3 font-bold text-gray-400">{idx + 1}</td>
                          <td className="py-2 px-3 font-bold text-[#2D1347]">{app.fullName}</td>
                          <td className="py-2 px-3 font-mono">{app.passportNumber}</td>
                          <td className="py-2 px-3">{app.nationality}</td>
                          <td className="py-2 px-3">{app.phoneCode} {app.phone}</td>
                          <td className="py-2 px-3">
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold" style={{ color: "#15803d" }}>
                              <CheckCircle2 size={11} /> {(() => {
                                const count = Object.values(app.files || {}).filter(Boolean).length;
                                return count > 0 ? `${count} File${count > 1 ? "s" : ""} (Attached)` : "Pending";
                              })()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hospital & Helicopter Protocol */}
              <div
                className="slip-emergency-bg p-3.5 rounded-xl border text-xs space-y-1.5 relative z-1"
                style={{ background: "#fff1f2", borderColor: "#fecdd3" }}
              >
                <div className="flex items-center gap-1.5 text-[#E11D48] font-black text-xs">
                  <ShieldCheck size={14} />
                  <span>Cashless Hospital Direct Billing &amp; 24/7 Helicopter Protocol</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-[10px]">
                  Direct cashless billing active at <strong>CIWEC Hospital &amp; Travel Medicine Center (Kathmandu &amp; Pokhara)</strong> and <strong>Swacon International Hospital</strong>. 24/7 Flight operations center coordinates emergency helicopter rescue.
                </p>
                <div className="pt-1 flex flex-wrap gap-4 text-[9.5px] font-bold text-gray-600">
                  <span>📞 24/7 SOS Desk: +977 9851420882</span>
                  <span>🏥 CIWEC Clinic: 01-4424111</span>
                  <span>🏥 Swacon Hospital: 01-4112211</span>
                  <span>✉ emergency@triphimalaya.com.np</span>
                </div>
              </div>

              {/* Official Seal / Signature Bar */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-200 relative z-1">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[10.5px]">
                    <CheckCircle2 size={13} />
                    <span>Application Logged &amp; Verified for Policy Underwriting</span>
                  </div>
                  <p className="text-[9px] text-gray-400">
                    Policy certificate with digital QR code will be dispatched via WhatsApp and Email upon confirmation.
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block border-b border-gray-400 w-36 mb-1"></div>
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Authorized Officer Signature</div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[9px] text-gray-400">
                <span>Trip Himalaya Tours &amp; Travel Pvt. Ltd. • Authorized Insurance Brokerage (Govt. Reg. No. 2490)</span>
                <span className="font-mono">System Generated Confirmation • Page 1 of 1</span>
              </div>
              </div> {/* end content wrapper */}
            </div>
          </div>
        ) : showPaymentStep ? (
          <div className="p-5 sm:p-6 overflow-y-auto">
            <div className="space-y-3">
              <PaymentMethod
                bookingReference={submissionId}
                packageTitle={plan.name}
                category="Travel Insurance"
                tierName={selectedOption.name}
                guestsCount={travelersCount}
                unitPriceFormatted={displayPrice(selectedOption.nprPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                totalPriceFormatted={displayPrice(totalNprPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                travelDate={startDate && endDate ? `${startDate} to ${endDate}` : undefined}
                isProcessingPayment={isProcessingPayment}
                initialMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                onPayWithEsewa={handleEsewaPayment}
                onPayLater={handlePayLater}
              />
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowPaymentStep(false)}
                  disabled={isProcessingPayment}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium underline transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  ← Edit Application Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">

            {/* If multiple travelers, show Applicant tabs */}
            {travelersCount > 1 && (
              <div className="bg-gradient-to-r from-purple-50/90 via-pink-50/40 to-purple-50/90 p-3 rounded-2xl border border-purple-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap px-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-[#2D1347] text-white flex items-center justify-center text-[10px] font-black">
                      {travelersCount}
                    </div>
                    <h4 className="text-xs font-black text-[#2D1347] uppercase tracking-wider">
                      Travelers ({travelersCount})
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-[#E11D48] bg-pink-100/80 px-2.5 py-0.5 rounded-full border border-pink-200">
                    Editing: Traveler {activeApplicantIndex + 1} of {travelersCount}
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {applicants.map((app, idx) => {
                    const isActive = idx === activeApplicantIndex;
                    const isFilled = app.fullName.trim() !== "" && app.passportNumber.trim() !== "" && app.nationality.trim() !== "";
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveApplicantIndex(idx)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 border ${
                          isActive
                            ? "bg-gradient-to-r from-[#2D1347] to-[#E11D48] text-white border-transparent shadow-sm shadow-pink-500/25"
                            : isFilled
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-300"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          isActive ? "bg-white/20 text-white" : isFilled ? "bg-emerald-200 text-emerald-800" : "bg-gray-100 text-gray-600"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="whitespace-nowrap font-extrabold">Traveler {idx + 1}</span>
                        {isFilled && !isActive && <Check size={12} className="text-emerald-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SECTION 1: TRAVELER INFORMATION ── */}
            <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200/60">
                <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                  <User size={13} />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#2D1347]">
                  1. Traveler {travelersCount > 1 ? `${activeApplicantIndex + 1} of ${travelersCount}` : ""} Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ram Bahadur Thapa"
                    value={currentApplicant.fullName}
                    onChange={(e) => updateCurrentApplicant({ fullName: e.target.value })}
                    className="ins-modal-input w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nationality <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nepali"
                    value={currentApplicant.nationality}
                    onChange={(e) => updateCurrentApplicant({ nationality: e.target.value })}
                    className="ins-modal-input w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Date of Birth (18+ Years) <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split("T")[0]}
                    value={currentApplicant.dateOfBirth}
                    onChange={(e) => updateCurrentApplicant({ dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@email.com"
                    value={currentApplicant.email}
                    onChange={(e) => updateCurrentApplicant({ email: e.target.value })}
                    className="ins-modal-input w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>

                {/* Passport / NID / Citizenship Number */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Passport / NID / Citizenship No. <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A1234567"
                    value={currentApplicant.passportNumber}
                    onChange={(e) => updateCurrentApplicant({ passportNumber: e.target.value.toUpperCase() })}
                    className="ins-modal-input w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#200B3B] uppercase focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>

                {/* WhatsApp / Mobile Number (10 Digits) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    WhatsApp / Mobile Number (10 Digits) <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="flex items-stretch border border-gray-200 rounded-xl bg-white focus-within:border-[#E11D48] focus-within:ring-2 focus-within:ring-pink-100 transition-all overflow-hidden">
                    <select
                      value={currentApplicant.phoneCode}
                      onChange={(e) => updateCurrentApplicant({ phoneCode: e.target.value })}
                      className="flex-shrink-0 bg-gray-50 border-r border-gray-200 px-2 py-2 text-xs font-bold text-[#200B3B] focus:outline-none cursor-pointer"
                      style={{ maxWidth: "110px" }}
                    >
                      {COUNTRY_CODES.map((c, idx) => (
                        <option key={idx} value={c.code}>
                          {isoToFlag(c.iso)} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="9800000000"
                      value={currentApplicant.phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        updateCurrentApplicant({ phone: digits });
                      }}
                      maxLength={10}
                      className="ins-modal-input flex-1 min-w-0 px-3 py-2 bg-white text-xs font-semibold text-[#200B3B] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Emergency Contact Number (Optional) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>Emergency Contact Number</span>
                    <span className="text-gray-400 font-normal text-[10px]">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +977 9800000000"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    className="ins-modal-input w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ── SECTION 2: INSURANCE REQUIREMENTS: ── */}
            <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200/60">
                <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                  <Mountain size={13} />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#2D1347]">
                  2. Insurance Requirements:
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {safeRequirementConfig.length === 0 ? (
                  <div className="sm:col-span-2 text-xs text-gray-400 py-1">
                    No additional insurance requirements for this plan.
                  </div>
                ) : safeRequirementConfig.map((field) => (
                  <div key={field.id} className={safeRequirementConfig.length === 1 ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <span>{field.name}</span>
                      {field.required ? (
                        <span className="text-[#E11D48]">*</span>
                      ) : (
                        <span className="text-gray-400 font-normal text-[10px]">(Optional)</span>
                      )}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        required={field.required}
                        placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                        value={requirementValues[field.id] || ""}
                        onChange={(e) => setRequirementValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                        rows={3}
                        className="ins-modal-input w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-pink-100 transition-all resize-none"
                      />
                    ) : field.type === "select" ? (
                      <select
                        required={field.required}
                        value={requirementValues[field.id] || ""}
                        onChange={(e) => setRequirementValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer"
                      >
                        <option value="">Select {field.name}...</option>
                        {(field.options || []).map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === "radio" ? (
                      <div className="flex flex-wrap gap-2">
                        {(field.options || []).map((opt, i) => (
                          <label key={i} className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] cursor-pointer">
                            <input
                              type="radio"
                              name={`insurance_requirement_${field.id}`}
                              value={opt}
                              checked={requirementValues[field.id] === opt}
                              onChange={(e) => setRequirementValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                              required={field.required}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : field.type === "checkbox" ? (
                      <label className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={requirementValues[field.id] === "1"}
                          onChange={(e) => setRequirementValues((prev) => ({ ...prev, [field.id]: e.target.checked ? "1" : "" }))}
                          required={field.required}
                        />
                        <span>{field.placeholder || field.name}</span>
                      </label>
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                        required={field.required}
                        placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
                        value={requirementValues[field.id] || ""}
                        onChange={(e) => setRequirementValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                        className="ins-modal-input w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-pink-100 transition-all"
                      />
                    )}
                  </div>
                ))}

                {/* Start Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Start Date <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    End Date <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={startDate || new Date().toISOString().split("T")[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ── SECTION 3: REQUIRED DOCUMENTS UPLOAD ── */}
            <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                    <UploadCloud size={13} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#2D1347]">
                    3. Document Attachments {travelersCount > 1 ? `— Traveler ${activeApplicantIndex + 1}` : ""}
                  </h4>
                </div>
                <span className="text-[10px] font-black uppercase text-[#E11D48] bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">Required</span>
              </div>

              <p className="text-[11px] text-gray-400 -mt-1">
                Attach for Traveler {travelersCount > 1 ? activeApplicantIndex + 1 : "1"} ({currentApplicant.fullName || "Current"}). PDF, JPG, PNG, WEBP (max 5 MB each).
              </p>

              {/* Hidden file inputs — one per document config entry */}
              {documentConfig.map((field) => (
                <input
                  key={field.id}
                  ref={fileRefs.current[field.id]}
                  type="file"
                  accept={field.accept}
                  onChange={(e) => handleFileChange(field.id, e)}
                  className="hidden"
                />
              ))}

              <div className="space-y-2.5">
                {documentConfig.map((field) => {
                  const file = currentApplicant.files[field.id] ?? null;
                  const label =
                    travelersCount > 1
                      ? `${field.title} (Traveler ${activeApplicantIndex + 1})`
                      : field.title;
                  return (
                    <div
                      key={field.id}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border ${
                        file
                          ? "bg-emerald-50/60 border-emerald-200"
                          : field.required
                          ? "bg-white border-gray-200 hover:border-[#E11D48]"
                          : "bg-white border-gray-200 hover:border-purple-300"
                      } transition-all`}
                    >
                      {/* Left: icon + label */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          file ? "bg-emerald-100 text-emerald-600" : "bg-pink-50 text-[#E11D48]"
                        }`}>
                          {file ? <CheckCircle2 size={16} /> : <FileText size={15} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#200B3B] flex items-center gap-1 flex-wrap">
                            {label}
                            {field.required ? (
                              <span className="text-[#E11D48] font-black">*</span>
                            ) : (
                              <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">Optional</span>
                            )}
                          </p>
                          {file ? (
                            <p className="text-[10px] text-emerald-700 font-semibold truncate max-w-[180px]">
                              {file.name}{" "}
                              <span className="text-emerald-500 font-normal">({(file.size / 1024).toFixed(0)} KB)</span>
                            </p>
                          ) : (
                            <p className="text-[10px] text-gray-400">{field.subtitle}</p>
                          )}
                        </div>
                      </div>

                      {/* Right: attach / remove */}
                      {file ? (
                        <button
                          type="button"
                          onClick={() => clearFile(field.id)}
                          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          <Trash2 size={11} />
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileRefs.current[field.id]?.current?.click()}
                          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#E11D48] text-[10px] font-bold transition-colors cursor-pointer border border-pink-200"
                        >
                          <UploadCloud size={12} />
                          Attach
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── CALCULATED PRICE SUMMARY ── */}
            <div className="bg-gradient-to-r from-pink-50/70 via-purple-50/50 to-pink-50/70 rounded-2xl p-3.5 sm:p-4 border border-pink-200/70 shadow-xs flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                  <Users size={16} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-[#2D1347]">Total Insurance Price</span>
                    <span className="text-[10px] font-semibold text-gray-500 bg-white/80 border border-gray-200/80 px-2 py-0.5 rounded-full">
                      {selectedOption.name} ({selectedOption.days})
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    {displayPrice(selectedOption.nprPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR)} × {travelersCount} {travelersCount === 1 ? "Applicant" : "Applicants"}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-base sm:text-lg font-black text-[#E11D48] tracking-tight">
                  {displayPrice(totalNprPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                </div>
                <div className="text-[10px] font-semibold text-gray-400">
                  {travelersCount} {travelersCount === 1 ? "Pax Total" : "Pax Total"}
                </div>
              </div>
            </div>

            {/* ── DECLARATIONS & SUBMIT ── */}
            <div className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100 space-y-3 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#E11D48] focus:ring-[#E11D48] border-gray-300 cursor-pointer flex-shrink-0"
                />
                <span className="text-gray-600 leading-relaxed">
                  I agree to the Trip Himalaya Insurance Terms.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end pt-1 border-t border-gray-100">

              <div className="text-right">
                <div className="text-[10px] text-gray-400 font-medium mb-0.5">
                  {travelersCount} {travelersCount === 1 ? "Applicant" : "Applicants"}
                </div>
                <button type="submit" disabled={isSubmittingApplication} className="px-7 py-2.5 bg-gradient-to-r from-[#2D1347] to-[#E11D48] hover:from-[#3B145C] hover:to-pink-600 text-white font-black text-xs rounded-xl shadow-md shadow-pink-500/25 hover:shadow-pink-500/40 active:scale-98 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  <span>{isSubmittingApplication ? "Submitting..." : `Submit Application (${travelersCount} Pax)`}</span>
                  {!isSubmittingApplication && <ArrowRight size={14} />}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default InsuranceApplicationModal;
