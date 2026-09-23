/**
 * DashboardRecentActivity.tsx
 * ───────────────────────────
 * Right card in the bottom row of the DASHBOARD tab.
 * Matches Image 2 "Recent Activity" card:
 *  - Activity icon + "Recent Activity" heading
 *  - Vertical connected timeline with 3 nodes:
 *      1. Green shield (Profile Verification Completed) — 12 MIN AGO (pink)
 *      2. Purple clock (Booking Request Sent) — 25 MIN AGO (grey)
 *      3. Grey card (Payment Paid) — COMPLETED (emerald)
 *
 * Accepts optional `items` override for dynamic data.
 */

import React from "react";
import { Activity, ShieldCheck, Clock, CreditCard } from "lucide-react";

export interface ActivityItem {
  id: string;
  /** Bold title line */
  title: string;
  /** Smaller description line */
  description: string;
  /** Timestamp/status label */
  timestamp: string;
  /** Tailwind text-color class for the timestamp */
  timestampColor?: string;
  /** Tailwind classes for the circular timeline node */
  nodeCls: string;
  /** Icon inside the node */
  icon: React.ReactNode;
}

interface DashboardRecentActivityProps {
  /** Override the default 3 activity items */
  items?: ActivityItem[];
}

const DEFAULT_ITEMS: ActivityItem[] = [
  {
    id: "act-verification",
    title: "Profile Verification Completed",
    description: "Verified via OTP and social completion flow.",
    timestamp: "12 MIN AGO",
    timestampColor: "text-[#FF2A75]",
    nodeCls: "bg-emerald-500 text-white shadow-md shadow-emerald-500/25",
    icon: <ShieldCheck size={14} className="stroke-[2.5]" />,
  },
  {
    id: "act-booking-sent",
    title: "Booking Request Sent",
    description: "Your request is now Approved.",
    timestamp: "25 MIN AGO",
    timestampColor: "text-slate-400",
    nodeCls: "bg-[#2D1347] text-white shadow-md shadow-purple-900/25",
    icon: <Clock size={14} className="stroke-[2.5]" />,
  },
  {
    id: "act-payment",
    title: "Payment Paid",
    description: "Payment verification: Verified.",
    timestamp: "COMPLETED",
    timestampColor: "text-emerald-600",
    nodeCls: "bg-slate-100 border border-slate-200 text-slate-600",
    icon: <CreditCard size={14} className="stroke-[2.2]" />,
  },
];

const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({
  items,
}) => {
  const activityList = items && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <article
      id="dashboard-recent-activity"
      aria-label="Recent account activity"
      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm"
    >
      {/* ── Header ── */}
      <header className="flex items-center gap-2.5 mb-6">
        <Activity size={20} className="text-[#8B2CFF] stroke-[2.5]" />
        <h2 className="text-[15px] sm:text-base font-black text-slate-900 tracking-tight">
          Recent Activity
        </h2>
      </header>

      {/* ── Timeline ── */}
      <ol className="relative pl-8 space-y-6" aria-label="Activity timeline">
        {/* Vertical connecting line */}
        <div
          className="absolute left-[14px] top-2 bottom-4 w-0.5 bg-gradient-to-b from-emerald-300 via-purple-200 to-slate-200"
          aria-hidden="true"
        />

        {activityList.map((act) => (
          <li key={act.id} id={act.id} className="relative flex items-start gap-4">
            {/* Timeline node */}
            <div
              className={[
                "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center",
                "shrink-0 absolute -left-8 top-0 z-10 transition-transform hover:scale-110",
                act.nodeCls,
              ].join(" ")}
              aria-hidden="true"
            >
              {act.icon}
            </div>

            {/* Text */}
            <div className="pl-1 space-y-0.5">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                {act.title}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium leading-snug">
                {act.description}
              </p>
              <span
                className={`text-[10px] font-black uppercase tracking-widest block pt-0.5 ${act.timestampColor || "text-slate-400"}`}
              >
                {act.timestamp}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
};

export default DashboardRecentActivity;
