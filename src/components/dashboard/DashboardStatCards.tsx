/**
 * DashboardStatCards.tsx
 * ──────────────────────
 * 4-column KPI stat cards in the main "DASHBOARD" tab.
 * Matches Image 2's top card row:
 *  1. Luggage icon  → Booking Requests (purple)
 *  2. Activity icon → Booking Progress (blue)
 *  3. Credit card   → Payment Status (green)
 *  4. Shield check  → Verification (pink)
 *
 * Each card is white, rounded-3xl, with a soft tinted icon background.
 */

import React from "react";
import { Luggage, Activity, CreditCard, ShieldCheck } from "lucide-react";

interface DashboardStatCardsProps {
  /** Number of booking requests (or a display string) */
  bookingRequests?: number | string;
  /** Booking progress percentage — supply a number and "%" is appended, or pass a full string */
  bookingProgress?: number | string;
  /** Payment status display text, e.g. "Paid" | "Pending" */
  paymentStatus?: string;
  /** Verification status display text, e.g. "Verified" | "Pending" */
  verificationStatus?: string;
}

interface StatCardConfig {
  id: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  /** Tailwind bg class for the icon wrapper */
  iconBg: string;
}

const DashboardStatCards: React.FC<DashboardStatCardsProps> = ({
  bookingRequests = 1,
  bookingProgress = "70%",
  paymentStatus = "Paid",
  verificationStatus = "Verified",
}) => {
  const stats: StatCardConfig[] = [
    {
      id: "stat-booking-requests",
      label: "BOOKING REQUESTS",
      value: bookingRequests,
      icon: <Luggage size={22} className="text-[#8B2CFF] stroke-[2.2]" />,
      iconBg: "bg-purple-50",
    },
    {
      id: "stat-booking-progress",
      label: "BOOKING PROGRESS",
      value:
        typeof bookingProgress === "number" ? `${bookingProgress}%` : bookingProgress,
      icon: <Activity size={22} className="text-[#2563EB] stroke-[2.5]" />,
      iconBg: "bg-blue-50",
    },
    {
      id: "stat-payment-status",
      label: "PAYMENT STATUS",
      value: paymentStatus,
      icon: <CreditCard size={22} className="text-[#10B981] stroke-[2.2]" />,
      iconBg: "bg-emerald-50",
    },
    {
      id: "stat-verification",
      label: "VERIFICATION",
      value: verificationStatus,
      icon: <ShieldCheck size={22} className="text-[#FF2A75] stroke-[2.2]" />,
      iconBg: "bg-pink-50",
    },
  ];

  return (
    <div
      id="dashboard-stat-cards"
      role="region"
      aria-label="Key metrics"
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4 lg:gap-5"
    >
      {stats.map((card) => (
        <div
          key={card.id}
          id={card.id}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center group"
        >
          {/* Tinted icon */}
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${card.iconBg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200`}
          >
            {card.icon}
          </div>

          {/* Primary value */}
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {card.value}
          </div>

          {/* Metric label */}
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-widest uppercase mt-1">
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatCards;
