import React from "react";
import { ShieldCheck, RotateCcw, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import VisaPricing from "./VisaPricing";
import { useOutletContext } from "react-router-dom";

interface VisaPolicyContext {
  pkg: any;
}

const VisaPolicy: React.FC = () => {
  const { pkg } = useOutletContext<VisaPolicyContext>();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT POLICY CARDS (8 cols) ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Embassy Authority Disclaimer */}
          <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <AlertTriangle size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Embassy Authority &amp; Decision Notice
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium pt-1">
              Please note that visa issuance, validity, number of entries, and processing duration are entirely at the sole discretion of the respective Embassy or Consulate. Trip Himalaya Tours &amp; Travel ensures thorough preparation and compliance, but cannot guarantee approval.
            </p>
          </div>

          {/* Service Fee Policy */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-50 text-[#E91E63]">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Consultancy &amp; Processing Fees
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-1">
              Consultation and documentation processing fees cover application drafting, hotel reservations, flight itineraries, appointment management, and personal counseling. Official Embassy visa fees and VFS biometric surcharges are non-refundable once submitted to the consular portal.
            </p>
          </div>

          {/* Cancellation & Rescheduling */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <RotateCcw size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Appointment Rescheduling Policy
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-1">
              If you need to reschedule your Embassy biometric appointment, please inform us at least 48 hours in advance. Most diplomatic missions allow one free date modification within 30 days of initial scheduling.
            </p>
          </div>

          {/* Document Verification Standards */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 text-[#200B3B]">
                <FileText size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Document Authenticity Standards
              </h2>
            </div>
            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-gray-600 font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>All bank statements must carry the official bank seal and sign on each page.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Passports must have at least 6 months remaining validity from the travel departure date.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Digital photographs must match official embassy pixel dimensions and white background standards.</span>
              </div>
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

export default VisaPolicy;
