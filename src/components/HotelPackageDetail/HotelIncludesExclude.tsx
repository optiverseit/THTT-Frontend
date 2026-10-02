import React from "react";
import { useOutletContext } from "react-router-dom";
import {
  Check, X, Backpack, CheckCircle2, XCircle,
  ShieldCheck, RotateCcw, RefreshCcw, BedDouble, CreditCard, AlertCircle,
} from "lucide-react";

interface Prop {
  allIncludes?: string[];
  allExcludes?: string[];
  restrictions?: string[];
  whatToBring?: string[];
}

const Rule: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-medium">
    <CheckCircle2 size={14} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
    <span>{children}</span>
  </div>
);

const HotelIncludesExclude: React.FC = () => {
  const { allIncludes = [], allExcludes = [], whatToBring = [] } =
    useOutletContext<Prop>();

  return (
    <div className="space-y-6">
      {/* Included & Excluded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
          <header className="flex items-center gap-2.5 pb-2 border-b border-white/20">
            <div className="p-1.5 bg-white text-emerald-600 rounded-lg shadow-sm">
              <CheckCircle2 size={18} />
            </div>
            <h3 className="text-xl font-black text-white">What's Included</h3>
          </header>
          <div className="space-y-2.5">
            {allIncludes.map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm font-medium leading-relaxed">
                <Check size={16} className="text-emerald-200 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#E91E63] to-rose-700 text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
          <header className="flex items-center gap-2.5 pb-2 border-b border-white/20">
            <div className="p-1.5 bg-white text-[#E91E63] rounded-lg shadow-sm">
              <XCircle size={18} />
            </div>
            <h3 className="text-xl font-black text-white">What's Excluded</h3>
          </header>
          <div className="space-y-2.5">
            {allExcludes.map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm font-medium leading-relaxed">
                <X size={16} className="text-rose-200 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What to Bring */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <header className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-pink-50 text-[#E91E63] rounded-lg">
              <Backpack size={18} />
            </div>
            <h3 className="text-lg font-black text-[#200B3B]">What to Bring</h3>
          </header>
          <div className="space-y-2">
            {whatToBring.map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63] mt-2 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>


      {/* ── HOTEL POLICIES ── */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-[#200B3B] pt-2">Hotel Policies</h3>
        <div className="flex flex-col gap-5">

          {/* Booking Policy */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-pink-50 text-[#E91E63] rounded-lg"><ShieldCheck size={16} /></div>
              <h4 className="text-sm font-black text-[#200B3B]">Booking Policy</h4>
            </div>
            <Rule>Advance booking recommended at least 24 hours before check-in.</Rule>
            <Rule>30% confirmation deposit secures your room; balance settled on arrival.</Rule>
            <Rule>Group bookings (5+ rooms) require 72-hour advance notice.</Rule>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><RotateCcw size={16} /></div>
              <h4 className="text-sm font-black text-[#200B3B]">Cancellation Policy</h4>
            </div>
            <Rule>Free 100% cancellation if cancelled 48+ hours before check-in.</Rule>
            <Rule>24–48 hours notice: 50% charge of first night applies.</Rule>
            <Rule>Within 24 hours or no-show: full first night charged.</Rule>
          </div>

          {/* Return & Refund Policy */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><RefreshCcw size={16} /></div>
              <h4 className="text-sm font-black text-[#200B3B]">Return & Refund Policy</h4>
            </div>
            <Rule>Eligible refunds processed within 5–7 working days to original payment method.</Rule>
            <Rule>Partial refunds apply for early check-out after first night is consumed.</Rule>
            <Rule>Refund disputes must be raised within 30 days of check-out.</Rule>
          </div>

          {/* Room Assignment Policy */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><BedDouble size={16} /></div>
              <h4 className="text-sm font-black text-[#200B3B]">Room Assignment Policy</h4>
            </div>
            <Rule>Room category assigned based on availability at check-in.</Rule>
            <Rule>Complimentary upgrades offered when booked category is unavailable.</Rule>
            <Rule>Specific floor/view preferences honored subject to availability.</Rule>
          </div>

          {/* Payment Policy */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><CreditCard size={16} /></div>
              <h4 className="text-sm font-black text-[#200B3B]">Payment Policy</h4>
            </div>
            <Rule>Accepted: Visa, MasterCard, eSewa, Khalti, bank transfer, and cash (NPR/USD).</Rule>
            <Rule>Credit card required as security deposit for incidentals at check-in.</Rule>
            <Rule>VAT receipts issued for all corporate bookings upon request.</Rule>
          </div>

          {/* No-Show Policy */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-red-50 text-red-500 rounded-lg"><AlertCircle size={16} /></div>
              <h4 className="text-sm font-black text-[#200B3B]">No-Show Policy</h4>
            </div>
            <Rule>No-show results in automatic cancellation of remaining reservation.</Rule>
            <Rule>Full first night's rate charged for no-show without prior notice.</Rule>
            <Rule>Late arrivals after midnight must be pre-notified to avoid cancellation.</Rule>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HotelIncludesExclude;
