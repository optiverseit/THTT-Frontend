import React from "react";
import { ShieldCheck, RotateCcw, FileText, CheckCircle2, HeartPulse } from "lucide-react";
import InsurancePricing from "./InsurancePricing";
import { useOutletContext } from "react-router-dom";

interface InsurancePolicyContext {
  pkg: any;
}

const InsurancePolicy: React.FC = () => {
  const { pkg } = useOutletContext<InsurancePolicyContext>();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT POLICY CARDS (8 cols) ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Emergency Heli Rescue Protocol */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-50 text-[#E91E63]">
                <HeartPulse size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Helicopter Evacuation Protocol
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-1">
              In case of severe altitude sickness, acute trauma, or critical medical emergencies, our 24/7 rescue desk coordinates with licensed helicopter charters. Hospital transfer is initiated immediately upon guide or medical officer request without upfront cash deposit from the trekker.
            </p>
          </div>

          {/* Cashless Claim & Hospitalization Policy */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Cashless Claim Settlement Policy
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-1">
              Direct billing is established with major tourist medical facilities across Nepal (CIWEC Hospital, ERA International Hospital, Swacon Hospital). For incidental prescription costs, original bills and medical prescription sheets must be retained for reimbursement within 14 business days.
            </p>
          </div>

          {/* Policy Amendment & Cancellation */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 text-[#200B3B]">
                <RotateCcw size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Policy Extension &amp; Date Changes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-1">
              If your trekking itinerary is extended due to weather delays, high-pass closures, or route deviations, you can extend policy validity online or via WhatsApp before your current certificate expires.
            </p>
          </div>

          {/* Underwriting Standards */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <FileText size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Pre-Trip Declaration Requirements
              </h2>
            </div>
            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-gray-600 font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Cardiovascular, pulmonary, and severe chronic medical history must be disclosed.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Coverage is valid up to {pkg.maxAltitude || "prescribed altitude ceiling"} as stated in the policy certificate.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Keep your digital insurance certificate and 24/7 hotline card accessible at all times during the trek.</span>
              </div>
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

export default InsurancePolicy;
