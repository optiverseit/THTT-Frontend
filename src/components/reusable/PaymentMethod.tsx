import React, { useState } from "react";
import { Wallet, Loader2, ArrowRight, Lock, Check } from "lucide-react";
import esewaLogo from "../../assets/images/esewa_logo.jpg";

export interface PaymentMethodProps {
  bookingReference: string;
  packageTitle: string;
  category?: string;
  tierName?: string;
  guestsCount: number;
  unitPriceFormatted: string;
  totalPriceFormatted: string;
  travelDate?: string;
  isProcessingPayment: boolean;
  initialMethod?: "esewa" | "pay_later";
  onMethodChange?: (method: "esewa" | "pay_later") => void;
  onPayWithEsewa: () => void;
  onPayLater: () => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  bookingReference,
  packageTitle,
  guestsCount,
  totalPriceFormatted,
  travelDate,
  isProcessingPayment,
  initialMethod = "esewa",
  onMethodChange,
  onPayWithEsewa,
  onPayLater,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<"esewa" | "pay_later">(initialMethod);

  const handleSelect = (method: "esewa" | "pay_later") => {
    setSelectedMethod(method);
    onMethodChange?.(method);
  };

  const handleAction = () => {
    if (selectedMethod === "esewa") {
      onPayWithEsewa();
    } else {
      onPayLater();
    }
  };

  return (
    <div className="space-y-4">
      {/* ── 1. Clean Order Summary ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {packageTitle}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {guestsCount} {guestsCount > 1 ? "Travelers" : "Traveler"}
              {travelDate ? ` · ${travelDate}` : ""}
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Ref: {bookingReference}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
              Total Payable
            </span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 block mt-0.5">
              {totalPriceFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Payment Options (2-column card row) ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* ── Card A: eSewa ── */}
        <div
          onClick={() => !isProcessingPayment && handleSelect("esewa")}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
            selectedMethod === "esewa"
              ? "border-[#60BB46] bg-[#F7FCF6] ring-2 ring-[#60BB46]/20 shadow-md"
              : "border-slate-200 bg-white hover:border-[#60BB46]/40 hover:bg-green-50/30 hover:shadow-sm"
          }`}
        >
          {/* eSewa Logo Image (Rectangular, clear presentation) */}
          <div className="h-12 w-full max-w-[124px] rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden px-2 py-1">
            <img
              src={esewaLogo}
              alt="eSewa"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900 leading-tight">eSewa Digital Wallet</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Pay online instantly via eSewa</p>
          </div>

          {/* Selected indicator */}
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
            selectedMethod === "esewa"
              ? "border-[#60BB46] bg-[#60BB46] text-white"
              : "border-slate-300 bg-white"
          }`}>
            {selectedMethod === "esewa" && <Check size={9} className="stroke-[3]" />}
          </div>
        </div>

        {/* ── Card B: Pay Later ── */}
        <div
          onClick={() => !isProcessingPayment && handleSelect("pay_later")}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
            selectedMethod === "pay_later"
              ? "border-[#2D1347] bg-purple-50/40 ring-2 ring-[#2D1347]/15 shadow-md"
              : "border-slate-200 bg-white hover:border-[#2D1347]/40 hover:bg-purple-50/20 hover:shadow-sm"
          }`}
        >
          {/* Wallet Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
            selectedMethod === "pay_later" ? "bg-[#2D1347] text-white" : "bg-slate-100 text-slate-600"
          }`}>
            <Wallet size={22} />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900 leading-tight">Pay Later</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Pay at office or via eSewa before trip</p>
          </div>

          {/* Selected indicator */}
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
            selectedMethod === "pay_later"
              ? "border-[#2D1347] bg-[#2D1347] text-white"
              : "border-slate-300 bg-white"
          }`}>
            {selectedMethod === "pay_later" && <Check size={9} className="stroke-[3]" />}
          </div>
        </div>
      </div>

      {/* ── 3. Primary CTA Button ── */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isProcessingPayment}
          onClick={handleAction}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
            selectedMethod === "esewa"
              ? "bg-[#60BB46] hover:bg-[#52A43B]"
              : "bg-[#2D1347] hover:bg-[#3D1A60]"
          }`}
        >
          {isProcessingPayment ? (
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-white" />
              <span>Redirecting to eSewa…</span>
            </div>
          ) : selectedMethod === "esewa" ? (
            <>
              <Lock size={15} />
              <span>Pay {totalPriceFormatted} with eSewa</span>
              <ArrowRight size={15} />
            </>
          ) : (
            <>
              <span>Confirm Reservation &amp; Pay Later</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>

      {/* ── 4. Clean Footer Note ── */}
      <p className="text-center text-xs text-slate-400">
        Booking verification will be confirmed by admin after submission.
      </p>
    </div>
  );
};

export default PaymentMethod;
