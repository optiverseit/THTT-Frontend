import React from "react";
import { ShieldCheck, RotateCcw, FileText, CheckCircle2 } from "lucide-react";
import HotelPricing from "./HotelPricing";
import { useOutletContext } from "react-router-dom";

interface HotelPolicyContext {
  pkg: any;
}

const HotelPolicy: React.FC = () => {
  const { pkg } = useOutletContext<HotelPolicyContext>();

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
              Advance booking is recommended at least 24 hours before check-in. A confirmation deposit secures your room, with remaining balances settled upon arrival. All major cards and cash payments are accepted.
            </p>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <RotateCcw size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                Flexible Cancellation Policy
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-1">
              Free 100% cancellation refund up to 48 hours before your check-in date. For emergency situations or flight cancellations, we can reschedule your reservation to another date at no extra charge.
            </p>
          </div>

          {/* House Rules */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 text-[#200B3B]">
                <FileText size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                House Rules & Guidelines
              </h2>
            </div>
            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-gray-600 font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Check-in from 2:00 PM; check-out by 12:00 PM (noon).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Pets not allowed unless prior arrangement has been made.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Please present a valid ID or passport at the front desk upon arrival.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
                <span>Quiet hours observed between 10:00 PM and 7:00 AM for all guests' comfort.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols) ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <HotelPricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default HotelPolicy;
