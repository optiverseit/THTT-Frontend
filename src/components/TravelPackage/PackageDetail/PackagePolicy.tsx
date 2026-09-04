import React from "react";
import { ShieldCheck, RotateCcw, FileText, CheckCircle2 } from "lucide-react";
import type { Package } from "../../../assets/data/types";
import PackagePricing from "./PackagePricing";
import { useOutletContext } from "react-router-dom";

interface PackagePolicyContext {
  pkg: Package;
}

const PackagePolicy: React.FC = () => {
  const { pkg } = useOutletContext<PackagePolicyContext>();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT POLICY CARDS (8 cols) ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Booking Policy */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-50 text-[#E91E63]">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Reservation & Booking Policy
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-1">
              Advance booking is recommended at least 48 hours in advance for adventure activities and 7 days for multi-day trekking packages. A 20% deposit confirms your spot, and remaining balances can be settled upon arrival in Nepal via cash or credit card.
            </p>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <RotateCcw size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Flexible Cancellation & Weather Guarantee
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-1">
              Free 100% cancellation refund up to 24 hours before your scheduled activity. In case of unsuitable weather (rain or high mountain winds for aerial activities), you can reschedule to any upcoming date or receive a full immediate refund.
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 text-[#200B3B]">
                <FileText size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Safety & Conduct Guidelines
              </h2>
            </div>
            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-gray-600 font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Follow instructions given by the licensed pilot/lead guide at all times.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Wear appropriate closed sports footwear and weather-resistant gear.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Disclose any medical or physical conditions during check-in.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols) ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-[190px] self-start space-y-6">
          <PackagePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default PackagePolicy;
