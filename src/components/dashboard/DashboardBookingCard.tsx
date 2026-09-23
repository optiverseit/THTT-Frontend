/**
 * DashboardBookingCard.tsx
 * ────────────────────────
 * Left card in the bottom row of the DASHBOARD tab.
 * Matches Image 2 "Booking Card" exactly:
 *  - Header: luggage icon + "Booking Card" title + pink "VIEW" link
 *  - CURRENT STATUS: "Confirmed" + "PAID" emerald badge
 *  - BOOKING PROGRESS: pink gradient bar with percentage
 *  - REQUEST STATUS / PAYMENT VERIFICATION: two grey sub-panels
 *  - REMARKS: file icon + remarks text
 */

import React from "react";
import { Luggage, FileText } from "lucide-react";

interface DashboardBookingCardProps {
  /** Callback when the "VIEW" button is clicked */
  onView?: () => void;
  /** Current booking status text */
  status?: string;
  /** Payment badge label shown beside status */
  paymentBadge?: string;
  /** 0–100 integer */
  progressPercent?: number;
  /** Request sub-status */
  requestStatus?: string;
  /** Payment verification sub-status */
  paymentVerification?: string;
  /** Free-text remarks for the traveler */
  remarks?: string;
}

const DashboardBookingCard: React.FC<DashboardBookingCardProps> = ({
  onView,
  status = "Confirmed",
  paymentBadge = "PAID",
  progressPercent = 70,
  requestStatus = "Approved",
  paymentVerification = "Verified",
  remarks = "Bring passport, arrive 30 mins early.",
}) => {
  return (
    <article
      id="dashboard-booking-card"
      aria-label="Current booking summary"
      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col gap-5"
    >
      {/* ── HEADER ── */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Luggage size={20} className="text-[#FF2A75] stroke-[2.5]" />
          <h2 className="text-[15px] sm:text-base font-black text-slate-900 tracking-tight">
            Booking Card
          </h2>
        </div>

        <button
          type="button"
          id="dashboard-booking-view-btn"
          onClick={onView}
          className="text-[11px] font-black text-[#FF2A75] hover:text-[#c5154d] uppercase tracking-widest transition-colors cursor-pointer"
        >
          VIEW
        </button>
      </header>

      <div className="flex flex-col gap-4">
        {/* ── CURRENT STATUS ── */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            CURRENT STATUS
          </span>
          <div className="flex items-center gap-2.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {status}
            </span>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              {paymentBadge}
            </span>
          </div>
        </div>

        {/* ── BOOKING PROGRESS BAR ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            <span>BOOKING PROGRESS</span>
            <span className="text-slate-700 font-black">{progressPercent}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Booking progress: ${progressPercent}%`}
            className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF2A75] to-[#E91E63] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ── SUB-PANELS: Request Status & Payment Verification ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#F8F9FC] rounded-2xl p-3 sm:p-3.5 border border-slate-100">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase block">
              REQUEST STATUS
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 block">
              {requestStatus}
            </span>
          </div>
          <div className="bg-[#F8F9FC] rounded-2xl p-3 sm:p-3.5 border border-slate-100">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase block">
              PAYMENT VERIFICATION
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 block">
              {paymentVerification}
            </span>
          </div>
        </div>

        {/* ── REMARKS ── */}
        <div className="bg-[#F8F9FC] rounded-2xl p-3 sm:p-3.5 border border-slate-100 flex items-start gap-2.5">
          <FileText size={15} className="text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block">
              REMARKS
            </span>
            <p className="text-[12px] font-semibold text-slate-700 leading-snug">
              {remarks}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default DashboardBookingCard;
