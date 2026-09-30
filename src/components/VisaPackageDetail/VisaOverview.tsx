import React from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle2, Clock, Globe, FileText, Calendar, ShieldCheck, Check } from "lucide-react";
import VisaIncludesExclude from "./VisaIncludesExclude";
import VisaPricing from "./VisaPricing";

interface VisaOverviewProps {
  pkg: any;
}

const VisaOverview: React.FC = () => {
  const { pkg } = useOutletContext<VisaOverviewProps>();

  const documents: string[] = Array.isArray(pkg.requirementDocuments) && pkg.requirementDocuments.length > 0
    ? pkg.requirementDocuments
    : [
      "Original Passport valid for at least 6 months with minimum 2 blank pages",
      "Recent passport-sized photographs with white background (35mm x 45mm)",
      "Bank statement of the last 6 months with official bank stamp and minimum balance",
      "Employment verification letter or business registration certificate",
      "Confirmed round-trip flight booking and hotel accommodation voucher",
      "Detailed daily travel itinerary and personal cover letter",
    ];

  const stepByStep = [
    {
      step: 1,
      title: "Document Collection & Pre-Screening",
      desc: "Our visa specialists review your personal documents, bank statements, and travel dates to ensure 100% compliance with Embassy rules.",
    },
    {
      step: 2,
      title: "Form Filing & Appointment Scheduling",
      desc: "We accurately fill out official embassy forms, prepare flight & hotel itineraries, and secure early biometric appointment slots.",
    },
    {
      step: 3,
      title: "Embassy / VFS Biometric Submission",
      desc: "Attend your scheduled biometric appointment with our complete filing docket. We provide mock interview guidance where applicable.",
    },
    {
      step: 4,
      title: "Passport Collection & Delivery",
      desc: "Track real-time passport processing status. Receive your approved visa and stamped passport safely at our office or via secure courier.",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT CONTENT (8 cols) ── */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{pkg.flag || "🌐"}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {pkg.country || pkg.location} Visa Assistance
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#200B3B] leading-tight">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <Clock size={15} />
                <span className="text-gray-700">{pkg.duration || "5-7 Working Days"} Processing</span>
              </span>

              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <Calendar size={15} />
                <span className="text-gray-700">{pkg.validity || "90 Days Validity"}</span>
              </span>

              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <Globe size={15} />
                <span className="text-gray-700">{pkg.entryType || "Single / Double Entry"}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed font-medium">
              {pkg.description ||
                `Hassle-free visa assistance service for ${pkg.title}. Our certified immigration counselors manage all embassy documentation, appointment scheduling, and personal guidance from start to finish.`}
            </p>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs">
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block">Processing Time</span>
              <p className="text-xs sm:text-sm font-black text-[#200B3B] mt-0.5">{pkg.duration || "5-7 Days"}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block">Stay Duration</span>
              <p className="text-xs sm:text-sm font-black text-[#200B3B] mt-0.5">{pkg.stayDuration || "Up to 30 Days"}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block">Entry Permitted</span>
              <p className="text-xs sm:text-sm font-black text-[#200B3B] mt-0.5">{pkg.entryType || "Single Entry"}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block">Express Service</span>
              <p className="text-xs sm:text-sm font-black text-emerald-600 mt-0.5">Available on Request</p>
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <VisaIncludesExclude />

          {/* Mandatory Documents Checklist */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-black text-[#200B3B]">
              <FileText size={20} className="text-[#E91E63]" />
              <span>Required Documents Checklist</span>
            </h2>

            <div className="space-y-3 pt-2">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100/80">
                  <div className="w-5 h-5 rounded-full bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Procedure */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-black text-[#200B3B]">
              <CheckCircle2 size={20} className="text-[#E91E63]" />
              <span>How the Visa Process Works</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {stepByStep.map((s) => (
                <div key={s.step} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-xl bg-[#200B3B] text-white flex items-center justify-center font-black text-xs">
                    {s.step}
                  </div>
                  <h3 className="text-sm font-black text-[#200B3B]">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PRICING SIDEBAR (4 cols) ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <VisaPricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default VisaOverview;
