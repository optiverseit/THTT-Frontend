import React from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle2, Shield, Mountain, HeartPulse, FileText, Check } from "lucide-react";
import InsuranceIncludesExclude from "./InsuranceIncludesExclude";
import InsurancePricing from "./InsurancePricing";

interface InsuranceOverviewProps {
  pkg: any;
}

const InsuranceOverview: React.FC = () => {
  const { pkg } = useOutletContext<InsuranceOverviewProps>();

  const documents: string[] =
    Array.isArray(pkg.requirementDocuments) && pkg.requirementDocuments.length > 0
      ? pkg.requirementDocuments
      : [
        "Clear color scan of passport bio-data page (minimum 6 months validity)",
        "Trek route & peak destination name (e.g. EBC, Annapurna, Manaslu)",
        "Expected trip start and completion dates",
        "Emergency contact name, relation, and international phone number",
        "Pre-existing medical declaration (if any ongoing medical treatment)",
      ];

  const highlights: string[] =
    Array.isArray(pkg.highlights) && pkg.highlights.length > 0
      ? pkg.highlights
      : [
        "Comprehensive High Altitude Emergency Helicopter Evacuation",
        "Cashless Hospital Admission in Kathmandu & Pokhara Clinics",
        "Comprehensive Outpatient & Inpatient Hospitalization Care",
        "COVID-19 & Acute Mountain Sickness (AMS) Medical Cover",
        "Baggage Delay, Theft & Travel Document Replacement",
      ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT CONTENT (8 cols) ── */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#E91E63] uppercase tracking-wider bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                {pkg.badge || "Verified Medical Plan"}
              </span>
              <span className="text-xs font-bold text-gray-400">•</span>
              <span className="text-xs font-bold text-gray-500">Altitude Up to {pkg.maxAltitude || "6,000m"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#200B3B] leading-tight">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <Mountain size={15} />
                <span className="text-gray-700">{pkg.maxAltitude || "All Altitude Peaks"}</span>
              </span>

              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <Shield size={15} />
                <span className="text-gray-700">{pkg.coverageLimit || "$50,000"} Medical Sum</span>
              </span>

              <span className="flex items-center gap-1.5 text-emerald-600">
                <HeartPulse size={15} />
                <span>Instant Cashless Issuance</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed font-medium">
              {pkg.description ||
                `Designed specifically for Himalayan trekkers, climbers, and cultural visitors. This policy delivers zero-hassle coverage for helicopter search and rescue, hospital admission, and trip interruptions.`}
            </p>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs">
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block">Max Altitude</span>
              <p className="text-xs sm:text-sm font-black text-[#200B3B] mt-0.5">{pkg.maxAltitude || "Up to 6,000m"}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block">Medical Sum</span>
              <p className="text-xs sm:text-sm font-black text-[#200B3B] mt-0.5">{pkg.coverageLimit || "$50,000"}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block">Heli Evacuation</span>
              <p className="text-xs sm:text-sm font-black text-emerald-600 mt-0.5">100% Cashless</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block">Issuance Speed</span>
              <p className="text-xs sm:text-sm font-black text-[#200B3B] mt-0.5">Under 30 Minutes</p>
            </div>
          </div>

          {/* Policy Highlights Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-black text-[#200B3B]">
              <CheckCircle2 size={20} className="text-[#E91E63]" />
              <span>Key Policy Inclusions &amp; Protections</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <InsuranceIncludesExclude />

          {/* Required Documents / Enrollment Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-black text-[#200B3B]">
              <FileText size={20} className="text-[#E91E63]" />
              <span>Required Information for Policy Issuance</span>
            </h2>

            <div className="space-y-3 pt-2">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100/80">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PRICING SIDEBAR (4 cols) ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <InsurancePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default InsuranceOverview;
