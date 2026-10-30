import React from "react";
import {
  AlertCircle,
  CircleCheck,
  CircleHelp,
  FileText,
  Zap,
} from "lucide-react";
import { formatDescription, hasCustomBullet } from "../../../utils/formatDescription";

interface CountryProps {
  id: number;
  country_code: string;
  country_name: string;
  iso_2: string;
  flag_code: string;
  short_description: string;
  processing_days: number;
  status: string;
  display_order: number;
}

interface DocumentRequirement {
  id: number;
  country_id: number;
  permit_type: string;
  document_type: string;
  title: string;
  description: string | null;
  is_required: boolean;
  display_order: number;
  status: string;
}

interface AboutPermitProps {
  id?: string;
  country: CountryProps;
  documentRequirements: DocumentRequirement[];
  costDetailsSlot?: React.ReactNode;
}

const AboutPermit = ({
  country,
  documentRequirements,
  costDetailsSlot,
}: AboutPermitProps) => {
  const included = [
    "Govt. Application Filling",
    "FEO Coordination",
    "Document Scanning",
    "Insurance Help",
    "Online Status Tracking",
  ];

  const policies = [
    "Non-Refundable Govt. & Welfare Fees (Once deposited into FEIMS portal)",
    "FEO & Embassy Document Verification Mandatory",
    "Self-Declaration of Overseas Contract & Job Terms Required",
    "Biometric Verification in DOFE National Database",
  ];

  const terms = [
    "Applicant must be minimum 18 years of age with valid passport",
    "Passport must have at least 6 months validity from departure date",
    "GAMCA / DOFE approved medical fitness report required",
    "Pre-departure orientation certificate required for first-time workers",
  ];

  return (
    <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
      {/* ── CARD 1: ABOUT PERMIT ── */}
      <div className="rounded-2xl sm:rounded-3xl bg-white shadow-xl shadow-gray-200 border border-gray-100 p-6 sm:p-8">
        <header className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 flex-shrink-0">
            <FileText size={18} />
          </div>
          <h2 className="text-purple-950 text-lg sm:text-xl font-bold">
            About {country.country_name} Permit
          </h2>
        </header>

        <div
          className="text-gray-600 font-medium text-xs sm:text-sm leading-relaxed"
          dangerouslySetInnerHTML={{
            __html:
              formatDescription(country.short_description) ||
              "No description available.",
          }}
        />
      </div>

      {/* ── MOBILE ONLY: PERMIT COST (Above Requirement Documents) ── */}
      {costDetailsSlot && (
        <div className="block md:hidden">
          {costDetailsSlot}
        </div>
      )}

      {/* ── CARD 2: REQUIREMENT DOCUMENTS ── */}
      <div className="rounded-2xl sm:rounded-3xl bg-white shadow-xl shadow-gray-200 border border-gray-100 p-6 sm:p-8">
        <header className="flex items-center gap-2.5 mb-3.5">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
            <CircleCheck size={18} />
          </div>
          <h2 className="text-purple-950 font-bold text-base sm:text-xl tracking-tight">
            REQUIREMENT DOCUMENTS
          </h2>
        </header>

        {documentRequirements.length > 0 ? (
          <div className="space-y-2 mt-2">
            {documentRequirements.map((document) => {
              const customBullet = hasCustomBullet(document.title);
              return (
                <div key={document.id} className="flex items-start gap-2 text-xs sm:text-[13px] text-gray-700 font-medium leading-snug">
                  {!customBullet && (
                    <div className="w-4 h-4 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CircleCheck size={11} className="stroke-[2.5]" />
                    </div>
                  )}
                  <div className="flex-1">
                    <span>{document.title}</span>
                    {document.is_required !== false ? (
                      <span className="text-red-500 font-bold text-xs ml-1 select-none" title="Required Document">*</span>
                    ) : (
                      <span className="text-[10px] text-gray-400 italic ml-1">(Optional)</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 font-semibold text-sm">
            No document requirements available.
          </p>
        )}
      </div>

      {/* ── CARD 3: WHAT'S INCLUDED ── */}
      <div className="rounded-2xl sm:rounded-3xl bg-white shadow-xl shadow-gray-200 border border-gray-100 p-6 sm:p-8">
        <header className="flex items-center gap-2.5 mb-3.5">
          <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 flex-shrink-0">
            <Zap size={18} />
          </div>
          <h2 className="text-purple-950 font-bold text-base sm:text-xl tracking-tight">
            WHAT&apos;S INCLUDED
          </h2>
        </header>

        <div className="space-y-2 mt-2">
          {included.map((item, index) => {
            const customBullet = hasCustomBullet(item);
            return (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-[13px] text-gray-700 font-medium leading-snug">
                {!customBullet && (
                  <div className="w-4 h-4 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CircleCheck size={11} className="stroke-[2.5]" />
                  </div>
                )}
                <span className="flex-1">{item}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* POLICY */}
      <div className="flex flex-col sm:flex-row items-stretch w-full justify-between gap-6 mt-6 sm:mt-8">
        <div className="shadow-xl shadow-gray-200 w-full sm:w-[48%] rounded-2xl sm:rounded-3xl bg-purple-950 p-6 sm:p-8 md:p-10">
          <h1 className="flex items-center gap-2 text-white text-lg sm:text-xl font-bold">
            <AlertCircle
              size={16}
              className="text-pink-500 flex-shrink-0"
            />
            Policy
          </h1>

          <div className="space-y-2 mt-3">
            {policies.map((item, index) => {
              const customBullet = hasCustomBullet(item);
              return (
                <div key={index} className="flex items-start gap-2 text-xs sm:text-[13px] text-gray-300 font-medium leading-relaxed">
                  {!customBullet && (
                    <div className="w-4 h-4 rounded bg-pink-900/60 text-pink-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle size={11} />
                    </div>
                  )}
                  <span className="flex-1">{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="shadow-xl shadow-gray-200 w-full sm:w-[48%] rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8">
          <h1 className="flex items-center gap-2 text-purple-950 text-lg sm:text-xl font-bold">
            <CircleHelp
              size={16}
              className="text-pink-500 flex-shrink-0"
            />
            Terms &amp; Conditions
          </h1>

          <div className="space-y-2 mt-3">
            {terms.map((item, index) => {
              const customBullet = hasCustomBullet(item);
              return (
                <div key={index} className="flex items-start gap-2 text-xs sm:text-[13px] text-gray-600 font-medium leading-relaxed">
                  {!customBullet && (
                    <div className="w-4 h-4 rounded bg-purple-100 text-[#4B1E7A] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px] leading-none">
                      •
                    </div>
                  )}
                  <span className="flex-1">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPermit;
