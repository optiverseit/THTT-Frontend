/**
 * DashboardHeaderBanner.tsx
 * ─────────────────────────
 * Top welcome card rendered on every dashboard tab.
 * Matches Image 2's hero welcome banner:
 *  - Circular pink-ring avatar with camera badge
 *  - MEMBER + ACCOUNT VERIFIED pill badges
 *  - Large welcome heading
 *  - Email • phone subtitle
 *
 * Colors used: project palette (#210936, #2D1347, #FF2A75, #FF4FA3, #8B2CFF)
 */

import React from "react";
import { Mail, Phone, User } from "lucide-react";

export interface DashboardHeaderBannerProps {
  /** Optional User ID — falls back to stored userId or default */
  userId?: string;
  /** Logged-in user's display name */
  name?: string;
  /** Logged-in user's email address */
  email?: string;
  /** Logged-in user's phone number */
  phone?: string;
  /** Optional avatar URL — falls back to initials */
  avatarUrl?: string;
  onEditPhoto?: () => void;
  /** Optional custom content to render inside the banner instead of default welcome greeting */
  children?: React.ReactNode;
}

export const formatUserId = (raw?: string | number | null): string => {
  if (!raw) return "THTT-UID-000001";
  const str = String(raw).trim();
  if (/^THTT-UID-\d{6}$/i.test(str)) {
    return str.toUpperCase();
  }
  const match = str.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    return `THTT-UID-${String(num).padStart(6, "0")}`;
  }
  return "THTT-UID-000001";
};

const DashboardHeaderBanner: React.FC<DashboardHeaderBannerProps> = ({
  userId,
  name,
  email,
  phone,
  avatarUrl,
  children,
}) => {
  const resolvedUserId = (() => {
    if (userId) return formatUserId(userId);
    const stored =
      localStorage.getItem("userId") ||
      localStorage.getItem("user_id") ||
      localStorage.getItem("id");
    return formatUserId(stored);
  })();
  return (
    <section
      id="dashboard-header-banner"
      aria-label="Dashboard header banner"
      className="relative w-full overflow-hidden bg-gradient-to-r from-[#210936] via-[#2D1347] to-[#1E0D33] text-white px-4 sm:px-7 md:px-8 lg:px-10 pt-[80px] sm:pt-[84px] md:pt-[84px] lg:pt-[94px] pb-6 sm:pb-8 lg:pb-9 border-b border-purple-900/40 shadow-sm"
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-[#FF4FA3]/10 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#8B2CFF]/10 rounded-full blur-3xl pointer-events-none -mb-20" />

      <div className="relative z-10 w-full">
        {children ? (
          children
        ) : (
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8">
            {/* ── Avatar with gradient ring ── */}
            <div className="relative shrink-0">
              {/* Gradient ring */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#FF2A75] via-[#FF4FA3] to-[#8B2CFF] shadow-lg shadow-pink-900/40">
                <div className="w-full h-full rounded-full bg-[#1A0B2E] overflow-hidden flex items-center justify-center border-2 border-[#2D1347]">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={`${name} profile photo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-white select-none">
                      {name ? name.charAt(0).toUpperCase() : "T"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Identity: name, contact ── */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              {/* Greeting */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                Welcome, {name || "Traveler"}!
              </h1>

              {/* Contact row with colored icons */}
              <div className="text-purple-200/90 text-[11px] sm:text-xs md:text-sm font-medium flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 pt-1">
                <span className="inline-flex items-center gap-1.5 shrink-0" title={`User ID: ${resolvedUserId}`}>
                  <User size={14} className="text-[#A855F7] shrink-0" />
                  <span>{resolvedUserId}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 truncate max-w-[240px] sm:max-w-none">
                  <Mail size={14} className="text-[#FF2A75] shrink-0" />
                  <span>{email}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={14} className="text-[#10B981] shrink-0" />
                  <span>{phone}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardHeaderBanner;
