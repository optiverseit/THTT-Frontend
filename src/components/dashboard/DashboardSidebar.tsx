/**
 * DashboardSidebar.tsx
 * ─────────────────────
 * Fixed full-height dark purple sidebar for the dashboard.
 * Navigation is URL-based: clicking a tab navigates to its route.
 *
 * KEY LAYOUT RULE:
 *  - Sidebar starts at top:0, height:100vh, z-index:60 (above sticky header z-50).
 *  - This means the sidebar background is CONTINUOUS from the very top of the page
 *    through all three header tiers (TopBar, NavBar, ServicesStrip) on the left column.
 *  - Inner content is pushed down with padding-top = total header height
 *    so the nav items appear below the header area.
 *
 * Breakpoint strategy:
 *  - < 768px  (mobile)  : hidden by default, slides in as a drawer
 *  - 768px+   (tablet+) : fixed sidebar always visible, content offset by 220px
 *  - 1024px+  (desktop) : sidebar 240px wide
 *
 * Colors: project palette #2D1347, #3B145C, #FF2A75
 */

import React from "react";
import {
  LayoutDashboard,
  User,
  Luggage,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Sidebar spacer heights matching the sticky header per breakpoint:
 *  mobile  : NavBar only ≈ 56px  (+34px margin = 90px)
 *  sm      : TopBar+NavBar ≈ 84px (+28px = 112px)
 *  md/lg+  : All 3 tiers ≈ 128px (+28px = 156px)
 */

export type DashboardTab = "dashboard" | "user-details" | "booking";

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ReactNode;
  /** The URL path this item navigates to */
  path: string;
  /** URL prefix used to determine if this item is "active" */
  matchPrefix: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} className="shrink-0" />,
    path: "/dashboard",
    matchPrefix: "/dashboard",
  },
  {
    id: "user-details",
    label: "User Details",
    icon: <User size={18} className="shrink-0" />,
    path: "/dashboard/user-profile",
    matchPrefix: "/dashboard/user-profile",
  },
  {
    id: "booking",
    label: "Booking",
    icon: <Luggage size={18} className="shrink-0" />,
    path: "/dashboard/booking",
    matchPrefix: "/dashboard/booking",
  },
];

interface DashboardSidebarProps {
  onLogout: () => void;
  userName: string;
  userEmail: string;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  onLogout,
  mobileOpen,
  onMobileClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (item: NavItem) => {
    navigate(item.path);
    onMobileClose();
  };

  /**
   * Determine which nav item is active based on the current URL.
   * Special case: Dashboard (/) should only be active when path is exactly /dashboard.
   */
  const isActive = (item: NavItem): boolean => {
    if (item.id === "dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(item.matchPrefix);
  };

  return (
    <>
      {/* ── Mobile backdrop — shown when sidebar drawer is open ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* ════════════════════════════════════════════════════════════════
          SIDEBAR PANEL
          top:0 / height:100vh → background runs behind all header tiers.
          Inner content is padded down so nav items appear below the header.
         ════════════════════════════════════════════════════════════════ */}
      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard navigation"
        className={[
          /* Full-height from top-0: background covers left column of all 3 header tiers */
          "fixed top-0 left-0 h-screen w-[190px] md:w-[220px] lg:w-[240px]",
          /* Mobile: z-[60] > backdrop z-[55] so sidebar is always above the backdrop.
             md+: z-[30] < sticky header z-50 → header + logo render ON TOP of sidebar */
          mobileOpen ? "z-[60]" : "z-[30] md:z-[30]",
          /* Dark purple gradient matching the project NavBar palette */
          "bg-gradient-to-b from-[#2D1347] via-[#26103c] to-[#1A0B2E]",
          "border-r border-white/10 flex flex-col overflow-hidden",
          /* Slide-in on mobile, always visible on md+ */
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* ── SPACER: pushes nav content below the sticky header ── */}
        <div className="shrink-0 pt-[130px] sm:pt-[136px] md:pt-[156px]" />

        {/* ── NAVIGATION ITEMS ── */}
        <nav
          className="flex-1 px-2 md:px-3 py-4 space-y-1 overflow-y-auto"
          aria-label="Dashboard sections"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.id}
                type="button"
                id={`sidebar-tab-${item.id}`}
                role="tab"
                aria-selected={active}
                onClick={() => handleNav(item)}
                className={[
                  "w-full flex items-center gap-2.5 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl",
                  "text-[12px] md:text-[13px] font-bold tracking-wide transition-all duration-200",
                  "cursor-pointer text-left active:scale-[0.98]",
                  active
                    ? "bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white shadow-lg shadow-pink-600/30"
                    : "text-white/65 hover:text-white hover:bg-white/10",
                ].join(" ")}
              >
                <span className={active ? "text-white" : "text-white/45"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── LOGOUT — pinned to bottom ── */}
        <div className="px-2 md:px-3 pb-6 pt-3 border-t border-white/10 shrink-0">
          <button
            type="button"
            id="sidebar-logout-btn"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl text-[12px] md:text-[13px] font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 transition-all duration-200 cursor-pointer text-left active:scale-[0.98]"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
