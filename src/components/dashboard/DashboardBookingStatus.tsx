/**
 * DashboardBookingStatus.tsx
 * ───────────────────────────
 * Content panel shown when the "BOOKING" sidebar tab is active.
 * Displays a rich list of the user's active and past trip bookings.
 *
 * Each booking card shows:
 *  - Booking reference badge + status badge + payment badge
 *  - Package name and destination
 *  - Travel dates, group size, and preparation progress
 *  - "View Details" and download-itinerary buttons
 *
 * Demo data mirrors the project's booking flow; replace with API call
 * when the backend booking endpoint is available.
 */

import React from "react";
import { Luggage, Calendar, Users, Clock, Download, ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookingRecord {
  id: string;
  bookingRef: string;
  packageName: string;
  destination: string;
  /** Human-readable date range string */
  dates: string;
  travelers: number;
  status: "Confirmed" | "Processing" | "Completed" | "Cancelled";
  paymentStatus: "Paid" | "Partial" | "Pending";
  amount: string;
  /** 0–100 integer */
  progressPercent: number;
}

interface DashboardBookingStatusProps {
  onViewBooking?: (booking: BookingRecord) => void;
}

// ─── Demo bookings ─────────────────────────────────────────────────────────

const DEMO_BOOKINGS: BookingRecord[] = [
  {
    id: "bk-1",
    bookingRef: "THTT-2026-8941",
    packageName: "Everest Base Camp Trek & Kala Patthar",
    destination: "Khumbu Region, Nepal",
    dates: "Oct 12, 2026 – Oct 26, 2026  (14 Days)",
    travelers: 2,
    status: "Confirmed",
    paymentStatus: "Paid",
    amount: "NPR 285,000",
    progressPercent: 70,
  },
  {
    id: "bk-2",
    bookingRef: "THTT-2026-7210",
    packageName: "Annapurna Circuit & Thorong La Pass",
    destination: "Annapurna Region, Nepal",
    dates: "Dec 05, 2026 – Dec 18, 2026  (13 Days)",
    travelers: 1,
    status: "Processing",
    paymentStatus: "Paid",
    amount: "NPR 175,000",
    progressPercent: 40,
  },
];

// ─── Status badge helper ───────────────────────────────────────────────────

const statusCls: Record<BookingRecord["status"], string> = {
  Confirmed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Processing: "bg-amber-50 text-amber-600 border-amber-200",
  Completed: "bg-blue-50 text-blue-600 border-blue-200",
  Cancelled: "bg-rose-50 text-rose-600 border-rose-200",
};

// ─── Component ────────────────────────────────────────────────────────────

const DashboardBookingStatus: React.FC<DashboardBookingStatusProps> = ({
  onViewBooking,
}) => {
  return (
    <section id="dashboard-booking" aria-label="My bookings" className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Luggage size={24} className="text-[#FF2A75]" />
            <span>My Bookings</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Track trekking expeditions, itinerary milestones, and service statuses.
          </p>
        </div>

        <Link
          to="/packages"
          id="dashboard-explore-packages-link"
          className="bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-pink-500/25 hover:brightness-110 active:scale-95 flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <span>Explore More Trips</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Booking cards */}
      <div className="space-y-4">
        {DEMO_BOOKINGS.map((booking) => (
          <article
            key={booking.id}
            id={`booking-card-${booking.id}`}
            aria-label={`Booking ${booking.bookingRef}`}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Top row: badges + name + price + actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-5 border-b border-slate-100">
              {/* Left: badges + title + destination */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Reference */}
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-50 text-[#8B2CFF] border border-purple-200 uppercase tracking-wider">
                    {booking.bookingRef}
                  </span>
                  {/* Status */}
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${statusCls[booking.status]}`}>
                    {booking.status}
                  </span>
                  {/* Payment */}
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase tracking-wider">
                    {booking.paymentStatus}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {booking.packageName}
                </h3>

                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#FF2A75] shrink-0" />
                  {booking.destination}
                </p>
              </div>

              {/* Right: amount + action buttons — row layout on mobile */}
              <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Amount
                  </span>
                  <span className="text-lg font-black text-slate-900">{booking.amount}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id={`booking-view-btn-${booking.id}`}
                    onClick={() => onViewBooking && onViewBooking(booking)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    id={`booking-download-btn-${booking.id}`}
                    onClick={() => alert(`Downloading itinerary for ${booking.bookingRef}`)}
                    title="Download itinerary PDF"
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                  >
                    <Download size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom row: dates / travelers / progress */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 pt-5">
              {/* Dates */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-[#8B2CFF] shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Travel Dates
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800">
                    {booking.dates}
                  </span>
                </div>
              </div>

              {/* Travelers */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2A75] shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Group Size
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {booking.travelers} Traveler{booking.travelers > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0">
                  <Clock size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Preparation</span>
                    <span className="text-slate-700 font-black">{booking.progressPercent}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={booking.progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Booking preparation: ${booking.progressPercent}%`}
                    className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1.5"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF2A75] to-[#E91E63]"
                      style={{ width: `${booking.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DashboardBookingStatus;
