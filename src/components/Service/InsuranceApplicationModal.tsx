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
  Lock,
  Users,
  HeartPulse,
} from "lucide-react";
import { useGlobalCurrency, displayPrice, formatNPR, formatUSD, formatINR } from "../../context/CurrencyContext";
import THTTLogo from "../../assets/images/THTTLogo.png";
import { COUNTRY_CODES, isoToFlag } from "../../utils/countrycodes";
import { InsurancePlan, InsuranceCostOption } from "./insuranceData";

export interface InsuranceApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: InsurancePlan;
  selectedOption: InsuranceCostOption;
  numberOfTravelers?: number;
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
  passportFile: File | null;
  photoFile: File | null;
  itineraryFile: File | null;
  medicalFitnessFile: File | null;
  hasMedicalCondition: boolean;
  medicalNotes: string;
}

const createDefaultApplicant = (): InsuredApplicantData => ({
  fullName: "",
  nationality: "Nepal",
  email: "",
  phoneCode: "+977",
  phone: "",
  passportNumber: "",
  passportExpiry: "",
  dateOfBirth: "",
  passportFile: null,
  photoFile: null,
  itineraryFile: null,
  medicalFitnessFile: null,
  hasMedicalCondition: false,
  medicalNotes: "",
});

export const InsuranceApplicationModal: React.FC<InsuranceApplicationModalProps> = ({
  isOpen,
  onClose,
  plan,
  selectedOption,
  numberOfTravelers = 1,
}) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  const travelersCount = numberOfTravelers > 0 ? numberOfTravelers : 1;
  const totalNprPrice = selectedOption.nprPrice * travelersCount;

  const [applicants, setApplicants] = useState<InsuredApplicantData[]>(() =>
    Array.from({ length: travelersCount }, createDefaultApplicant)
  );
  const [activeApplicantIndex, setActiveApplicantIndex] = useState(0);

  // Group trip details
  const [trekkingRegion, setTrekkingRegion] = useState("Everest Base Camp & Gokyo (5,364m - 5,545m)");
  const [maxAltitudeMeters, setMaxAltitudeMeters] = useState(plan.maxAltitude);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agencyOrGuideName, setAgencyOrGuideName] = useState("Trip Himalaya Tours & Travel (Authorized Lead)");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [altitudeDeclarationAgreed, setAltitudeDeclarationAgreed] = useState(false);

  // Submission State
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [submittedAt, setSubmittedAt] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // File Input Refs
  const passportRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const itineraryRef = useRef<HTMLInputElement>(null);
  const medicalRef = useRef<HTMLInputElement>(null);

  // Sync applicants array whenever travelersCount or modal opens
  useEffect(() => {
    if (isOpen) {
      setApplicants((prev) => {
        if (prev.length === travelersCount) return prev;
        const next = [...prev];
        while (next.length < travelersCount) {
          next.push(createDefaultApplicant());
        }
        return next.slice(0, travelersCount);
      });
      setActiveApplicantIndex(0);
      setMaxAltitudeMeters(plan.maxAltitude);
      if (plan.id === "plan-trek-standard") {
        setTrekkingRegion("Poon Hill & Cultural Foothill Trails (Under 3,000m)");
      } else if (plan.id === "plan-extreme-expedition") {
        setTrekkingRegion("Island Peak / Mera Peak Climbing (6,000m+)");
      } else if (plan.id === "plan-international") {
        setTrekkingRegion("International / Global Travel Route");
      } else {
        setTrekkingRegion("Everest Base Camp & Gokyo (5,364m - 5,545m)");
      }
      setAgencyOrGuideName("Trip Himalaya Tours & Travel (Authorized Lead)");
    }
  }, [travelersCount, isOpen, plan]);

  if (!isOpen) return null;

  const currentApplicant =
    applicants[activeApplicantIndex] || applicants[0] || createDefaultApplicant();

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

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateCurrentApplicant({ passportFile: e.target.files[0] });
    }
    e.target.value = "";
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateCurrentApplicant({ photoFile: e.target.files[0] });
    }
    e.target.value = "";
  };

  const handleItineraryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateCurrentApplicant({ itineraryFile: e.target.files[0] });
    }
    e.target.value = "";
  };

  const handleMedicalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateCurrentApplicant({ medicalFitnessFile: e.target.files[0] });
    }
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate applicants
    for (let i = 0; i < travelersCount; i++) {
      const app = applicants[i];
      if (!app || !app.fullName.trim()) {
        setActiveApplicantIndex(i);
        alert(`Please enter Full Name for Traveler ${i + 1}.`);
        return;
      }
      if (!app.nationality.trim()) {
        setActiveApplicantIndex(i);
        alert(`Please enter Nationality for Traveler ${i + 1}.`);
        return;
      }

      // Date of Birth validation: cannot be in the future, must be >= 18
      if (!app.dateOfBirth) {
        setActiveApplicantIndex(i);
        alert(`Please enter Date of Birth for Traveler ${i + 1}.`);
        return;
      }
      const dob = new Date(app.dateOfBirth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dobDate = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
      if (dobDate > today) {
        setActiveApplicantIndex(i);
        alert(`Date of Birth cannot be in the future for Traveler ${i + 1}.`);
        return;
      }
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        setActiveApplicantIndex(i);
        alert(`Traveler ${i + 1} must be at least 18 years old to apply for insurance.`);
        return;
      }

      // Passport / NID / Citizenship Number
      if (!app.passportNumber.trim()) {
        setActiveApplicantIndex(i);
        alert(`Please enter Passport, NID, or Citizenship Number for Traveler ${i + 1}.`);
        return;
      }

      // Passport Expiry or NID/Citizenship Issued date
      if (!app.passportExpiry) {
        setActiveApplicantIndex(i);
        alert(`Please enter Passport Expiry or NID/Citizenship Issued Date for Traveler ${i + 1}.`);
        return;
      }

      // Email validation
      if (!app.email.trim()) {
        setActiveApplicantIndex(i);
        alert(`Please enter Email Address for Traveler ${i + 1}.`);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(app.email.trim())) {
        setActiveApplicantIndex(i);
        alert(`Please enter a valid email address for Traveler ${i + 1}.`);
        return;
      }

      // Phone number 10-digit validation
      if (!app.phone.trim()) {
        setActiveApplicantIndex(i);
        alert(`Please enter WhatsApp / Mobile Number for Traveler ${i + 1}.`);
        return;
      }
      const phoneDigits = app.phone.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        setActiveApplicantIndex(i);
        alert(`Phone number must be exactly 10 digits for Traveler ${i + 1}.`);
        return;
      }

      // Documents validation
      if (!app.passportFile) {
        setActiveApplicantIndex(i);
        alert(`Please upload Passport, NID, or Citizenship Scanned Copy for Traveler ${i + 1}.`);
        return;
      }
      if (!app.photoFile) {
        setActiveApplicantIndex(i);
        alert(`Please upload Passport Size Photo for Traveler ${i + 1}.`);
        return;
      }
      // Note: Trekking Permit / Itinerary is Optional in Section 3
    }

    // Section 2: Healthcare & Emergency details validation
    if (!emergencyContactName.trim()) {
      alert("Please enter Full Name for Healthcare & Emergency Contact (Section 2).");
      return;
    }
    if (!emergencyRelationship.trim()) {
      alert("Please enter Relationship for Healthcare & Emergency Contact (Section 2).");
      return;
    }
    if (!emergencyContactPhone.trim()) {
      alert("Please enter Emergency Contact Number for Healthcare & Emergency Contact (Section 2).");
      return;
    }

    // Section 3: Trekking Route & Travel Schedule validation
    if (!startDate) {
      alert("Please select the Policy Expected Start Date (Section 3).");
      return;
    }
    if (!endDate) {
      alert("Please select the Policy Expected End Date (Section 3).");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert("Policy Expected End Date cannot be earlier than Policy Expected Start Date.");
      return;
    }

    if (!termsAgreed) {
      alert("Please accept the insurance terms and conditions to proceed.");
      return;
    }
    if (!altitudeDeclarationAgreed) {
      alert("Please check the altitude safety declaration.");
      return;
    }

    const randomRef = `THTT-INS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmissionId(randomRef);
    setSubmittedAt(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setSubmitted(true);
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
    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Travel & Trekking Insurance Team)!\n\nI have just submitted an online insurance application.\n\n*Reference ID:* ${submissionId}\n*Plan:* ${plan.name} (${selectedOption.name})\n*Altitude Cap:* ${plan.maxAltitude}\n*Travelers:* ${travelersCount} Person(s) (Lead: ${applicants[0].fullName})\n*Dates:* ${startDate} to ${endDate}\n*Trek Route:* ${trekkingRegion}\n*Estimated Premium:* ${totalFormatted}\n\nAll required documents (Passport scan, photo, and trekking itinerary) have been attached. Please issue the official policy certificate and cashless hospital card.`
    );
    window.open(`https://api.whatsapp.com/send?phone=9779851420882&text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Click outside to close (disabled in print) */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} />

      <div className={`relative w-full ${submitted ? "max-w-2xl" : "max-w-4xl"} bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto z-10 transition-all duration-300 print:border-none print:shadow-none print:max-w-none print:w-full print:rounded-none`}>
        
        {/* ── TOP HEADER ── */}
        <div className="bg-gradient-to-r from-[#2D1347] via-[#3B145C] to-[#2D1347] p-5 sm:p-6 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
              <Mountain className="text-pink-300" size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black tracking-widest uppercase bg-[#E11D48] text-white px-2.5 py-0.5 rounded-full">
                  {plan.badge}
                </span>
                <span className="text-xs text-purple-200 font-semibold">
                  {plan.maxAltitude}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white truncate mt-0.5">
                {submitted ? "Insurance Application Confirmed" : `Apply for ${plan.name}`}
              </h2>
              <p className="text-xs text-white/70">
                Option: <strong className="text-white">{selectedOption.name} ({selectedOption.days})</strong> • {selectedOption.coverageLimit}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer flex-shrink-0 ml-3"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
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
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Trek Route / Trail</span>
                    <span className="font-bold text-gray-800 block mt-0.5 truncate" title={trekkingRegion}>
                      {trekkingRegion}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Emergency Contact</span>
                    <span className="font-bold text-gray-800 block mt-0.5 truncate" title={`${emergencyContactName} (${emergencyRelationship}) • ${emergencyContactPhone}`}>
                      {emergencyContactName} {emergencyRelationship ? `(${emergencyRelationship})` : ""} • {emergencyContactPhone}
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

              {/* Trekking & Dates Schedule */}
              <div
                className="slip-schedule-bg grid grid-cols-3 gap-3 text-xs p-3.5 rounded-xl border relative z-1"
                style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
              >
                <div>
                  <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">Destination / Route</span>
                  <span className="font-bold text-gray-800 block mt-0.5">{trekkingRegion}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">Policy Coverage Dates</span>
                  <span className="font-bold text-[#2D1347] block mt-0.5">{startDate} to {endDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">Healthcare &amp; Emergency</span>
                  <span className="font-bold text-gray-800 block mt-0.5" title={`${emergencyContactName} (${emergencyRelationship}) • ${emergencyContactPhone}`}>
                    {emergencyContactName} {emergencyRelationship ? `(${emergencyRelationship})` : ""} • {emergencyContactPhone}
                  </span>
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
                              <CheckCircle2 size={11} /> {app.passportFile && app.photoFile ? (app.itineraryFile ? "3 Files (Attached)" : "2 Files (Attached)") : "Pending"}
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
        ) : (
          /* ══════════════════════════════════════════════════════════════════
              MAIN FORM VIEW WITH APPLICANTS & REQUIRED DOCUMENTS
              ══════════════════════════════════════════════════════════════════ */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6 max-h-[85vh] overflow-y-auto">

            {/* If multiple travelers, show Applicant tabs */}
            {travelersCount > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100">
                {applicants.map((app, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveApplicantIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                      activeApplicantIndex === idx
                        ? "bg-[#2D1347] text-white shadow-md"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <span>Traveler {idx + 1}</span>
                    {app.fullName && <span className="text-[10px] text-purple-200 font-normal truncate max-w-[80px]">({app.fullName})</span>}
                    {app.passportFile && app.photoFile && (
                      <CheckCircle2 size={12} className="text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* ── SECTION 1: TRAVELER INFORMATION ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#2D1347] uppercase tracking-wider flex items-center gap-2">
                  <User size={16} className="text-[#E11D48]" />
                  <span>1. Traveler {travelersCount > 1 ? `${activeApplicantIndex + 1} of ${travelersCount}` : ""} Information</span>
                </h3>
                <span className="text-[11px] text-gray-400 font-medium">As shown in official identification</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentApplicant.fullName}
                    onChange={(e) => updateCurrentApplicant({ fullName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#2D1347] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentApplicant.nationality}
                    onChange={(e) => updateCurrentApplicant({ nationality: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#2D1347] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Date of Birth (18+ Years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split("T")[0]}
                    value={currentApplicant.dateOfBirth}
                    onChange={(e) => updateCurrentApplicant({ dateOfBirth: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:border-[#2D1347] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                {/* Passport / NID / Citizenship Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Passport/NID Number, Citizenship <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentApplicant.passportNumber}
                    onChange={(e) => updateCurrentApplicant({ passportNumber: e.target.value.toUpperCase() })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#2D1347] focus:ring-2 focus:ring-purple-100 outline-none transition-all uppercase"
                  />
                </div>

                {/* Passport Expiry or NID/Citizenship Issued date */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Passport Expiry or NID/Citizenship Issued date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={currentApplicant.passportExpiry}
                    onChange={(e) => updateCurrentApplicant({ passportExpiry: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:border-[#2D1347] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={currentApplicant.email}
                    onChange={(e) => updateCurrentApplicant({ email: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#2D1347] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                {/* WhatsApp / Mobile Number (10 Digits) */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    WhatsApp / Mobile Number (10 Digits) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-stretch border border-gray-300 rounded-xl bg-white focus-within:border-[#2D1347] focus-within:ring-2 focus-within:ring-purple-100 transition-all overflow-hidden">
                    {/* Country Code Selector with flag */}
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
                    {/* Phone Number Input (numeric, max 10 digits) */}
                    <input
                      type="tel"
                      required
                      value={currentApplicant.phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        updateCurrentApplicant({ phone: digits });
                      }}
                      maxLength={10}
                      className="flex-1 min-w-0 px-3.5 py-2.5 bg-white text-xs font-semibold text-[#200B3B] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── SECTION 2: HEALTHCARE & EMERGENCY DETAILS ── */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#2D1347] uppercase tracking-wider flex items-center gap-2">
                  <HeartPulse size={16} className="text-[#E11D48]" />
                  <span>2. Healthcare &amp; Emergency details</span>
                </h3>
                <span className="text-[11px] text-gray-400 font-medium">Next of kin / Emergency contact</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#2D1347] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={emergencyRelationship}
                    onChange={(e) => setEmergencyRelationship(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#2D1347] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                {/* emergency contact number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    emergency contact number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#2D1347] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ── SECTION 3: TREKKING ROUTE & TRAVEL SCHEDULE ── */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-black text-[#2D1347] uppercase tracking-wider flex items-center gap-2">
                  <Mountain size={16} className="text-[#E11D48]" />
                  <span>3. Trekking Route &amp; Travel Schedule</span>
                </h3>
                <span className="text-[11px] text-gray-400 font-medium">Route plan &amp; expected policy duration</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* Trek Destination / Trail (Unchangeable) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>Trek Destination / Trail</span>
                    <span className="text-[10px] text-gray-400 font-normal">(Preset)</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={trekkingRegion}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed outline-none font-medium"
                  />
                </div>

                {/* Maximum Planned Altitude (Unchangeable) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>Maximum Planned Altitude</span>
                    <span className="text-[10px] text-gray-400 font-normal">(Preset)</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={maxAltitudeMeters || plan.maxAltitude}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed outline-none font-medium"
                  />
                </div>

                {/* Trekking Agency / Guide Name (Unchangeable) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>Trekking Agency / Guide Name</span>
                    <span className="text-[10px] text-gray-400 font-normal">(Authorized)</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={agencyOrGuideName}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed outline-none font-medium"
                  />
                </div>

                {/* Policy Expected Start Date (User Editable & Required) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Policy Expected Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:border-[#2D1347] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>

                {/* Policy Expected End Date (User Editable & Required) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Policy Expected End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={startDate || new Date().toISOString().split("T")[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:border-[#2D1347] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ── SECTION 4: REQUIRED DOCUMENTS UPLOAD ── */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-black text-[#2D1347] uppercase tracking-wider flex items-center gap-2">
                    <FileText size={16} className="text-[#E11D48]" />
                    <span>4. Required Documents Upload</span>
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    For Traveler {travelersCount > 1 ? `${activeApplicantIndex + 1}` : "1"} ({currentApplicant.fullName || "Current"}) • JPG, PNG or PDF (Max 10MB each)
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase text-[#E11D48] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
                  Mandatory For Policy Certification
                </span>
              </div>

              {/* Document upload grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                
                {/* 1. Passport, NID, Citizenship Scanned Copy */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-purple-300 transition-all flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-800">Passport, NID, Citizenship Scanned Copy</span>
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Required</span>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Clear color scan or photo of Passport, National ID (NID), or Citizenship certificate.
                    </p>
                  </div>

                  <div className="mt-3">
                    <input
                      ref={passportRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handlePassportChange}
                      className="hidden"
                    />
                    {currentApplicant.passportFile ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-xl text-xs">
                        <span className="truncate max-w-[140px] font-medium">
                          {currentApplicant.passportFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCurrentApplicant({ passportFile: null })}
                          className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => passportRef.current?.click()}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-700 cursor-pointer transition-all shadow-2xs"
                      >
                        <UploadCloud size={14} className="text-purple-600" />
                        <span>Upload Document Scan</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Passport Size Digital Photograph */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-purple-300 transition-all flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-800">Passport Photo (MRP)</span>
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Required</span>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Recent front-facing digital photo with white background.
                    </p>
                  </div>

                  <div className="mt-3">
                    <input
                      ref={photoRef}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    {currentApplicant.photoFile ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-xl text-xs">
                        <span className="truncate max-w-[140px] font-medium">
                          {currentApplicant.photoFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCurrentApplicant({ photoFile: null })}
                          className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => photoRef.current?.click()}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-700 cursor-pointer transition-all shadow-2xs"
                      >
                        <UploadCloud size={14} className="text-purple-600" />
                        <span>Upload Photo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Trekking Permit / Route Itinerary (Optional) */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-purple-300 transition-all flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-800">Trekking Permit / Itinerary (Optional)</span>
                      <span className="text-[10px] font-bold text-gray-600 bg-gray-200/80 px-1.5 py-0.5 rounded">Optional</span>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      TIMS card, conservation permit, or route itinerary slip (if available).
                    </p>
                  </div>

                  <div className="mt-3">
                    <input
                      ref={itineraryRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleItineraryChange}
                      className="hidden"
                    />
                    {currentApplicant.itineraryFile ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-xl text-xs">
                        <span className="truncate max-w-[140px] font-medium">
                          {currentApplicant.itineraryFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCurrentApplicant({ itineraryFile: null })}
                          className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => itineraryRef.current?.click()}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-700 cursor-pointer transition-all shadow-2xs"
                      >
                        <UploadCloud size={14} className="text-purple-600" />
                        <span>Upload Itinerary (Optional)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── SECTION 4: DECLARATIONS & SUBMIT ── */}
            <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={altitudeDeclarationAgreed}
                  onChange={(e) => setAltitudeDeclarationAgreed(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2D1347] focus:ring-purple-500 mt-0.5"
                />
                <span className="text-gray-700 leading-snug">
                  <strong>High-Altitude &amp; Medical Declaration:</strong> I confirm that the insured traveler(s) are physically fit for the indicated trekking altitude ({plan.maxAltitude}) and have disclosed any major pre-existing heart or lung conditions.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2D1347] focus:ring-purple-500 mt-0.5"
                />
                <span className="text-gray-700 leading-snug">
                  I agree to the Trip Himalaya Insurance Terms, 24/7 Helicopter Evacuation Dispatch Protocol, and Cashless Hospital Admission regulations.
                </span>
              </label>
            </div>

            {/* Sticky/Bottom Action Footer */}
            <div className="bg-gray-50 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-4 sm:p-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-gray-500 font-bold uppercase block">
                  Total Premium ({travelersCount} {travelersCount === 1 ? "Traveler" : "Travelers"})
                </span>
                <span className="text-xl font-black text-[#2D1347]">
                  {displayPrice(totalNprPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                </span>
                <span className="text-[10px] text-gray-400 block">
                  {selectedOption.name} • {selectedOption.days} Coverage
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-[#2D1347] hover:bg-[#3B145C] text-white text-xs font-bold shadow-lg shadow-purple-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Submit Application</span>
                  <ArrowRight size={14} />
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
