/**
 * Dashboard.tsx
 * ─────────────
 * User Dashboard page — rendered on /dashboard (ProtectedRoute).
 *
 * Layout (Image 1 structure + Image 2 design):
 * ┌──────────────────────────────────────────────────────────┐
 * │  3-Tier Header  (TopBar + NavBar + ServicesStrip)        │  ← sticky, from App.tsx
 * ├───────────────────┬──────────────────────────────────────┤
 * │  Dark Purple      │  Content Area (light grey bg)        │
 * │  Fixed Sidebar    │                                       │
 * │  ─────────────    │  [Welcome Banner]                    │
 * │  Dashboard ●      │  [Tab Content: stat cards /          │
 * │  User Details     │   booking card / activity /          │
 * │  Booking          │   user form / bookings]              │
 * │  ─────────────    │                                       │
 * │  Logout           │                                       │
 * └───────────────────┴──────────────────────────────────────┘
 *
 * ● Sidebar is fixed left; content area has matching left margin.
 * ● On mobile a hamburger button opens the sidebar as a drawer.
 * ● Auth/API code is NOT changed (AuthContext, BackendApi, ProtectedRoute untouched).
 */

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

/* ── Dashboard sub-components ── */
import DashboardSidebar, { type DashboardTab } from "../components/dashboard/DashboardSidebar";
import DashboardHeaderBanner from "../components/dashboard/DashboardHeaderBanner";
import DashboardUserDetails from "../components/dashboard/DashboardUserDetails";
import DashboardBookingStatus from "../components/dashboard/DashboardBookingStatus";
import { UpdateDetailsModal } from "../components/dashboard/DashboardModals";


const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* ── UI state ── */
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  /* ── User data — merges AuthContext + localStorage keys from LoginForm ── */
  const [userData, setUserData] = useState(() => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";
    const fullName  = localStorage.getItem("name")      || "";
    const name =
      user?.name ||
      fullName ||
      (firstName || lastName ? `${firstName} ${lastName}`.trim() : "Traveler");

    return {
      name,
      email: user?.email || localStorage.getItem("email") || "user@triphimalaya.com.np",
      phone: user?.phone || localStorage.getItem("phone") || "+977 9801234567",
      gender: user?.gender || localStorage.getItem("gender") || "Male",
      address: user?.address || localStorage.getItem("address") || "Kathmandu, Bagmati Province, Nepal",
      nationality: user?.nationality || localStorage.getItem("nationality") || "Nepali",
      additionalNumber: (user as any)?.additionalNumber || user?.emergencyContact || localStorage.getItem("additionalNumber") || localStorage.getItem("emergencyContact") || "+977 9851000000",
      emergencyContact: user?.emergencyContact || localStorage.getItem("emergencyContact") || "+977 9851000000",
      avatar: user?.avatar || localStorage.getItem("avatar") || "",
      phoneVerified: localStorage.getItem("phoneVerified") === "true",
    };
  });

  /* ── Handlers ── */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpdateUser = (updated: {
    name: string;
    email: string;
    phone: string;
    gender?: string;
    address?: string;
    nationality?: string;
    additionalNumber?: string;
    emergencyContact?: string;
    avatar?: string;
    phoneVerified?: boolean;
  }) => {
    setUserData((prev) => ({ ...prev, ...updated }));
    try {
      if (updated.name) localStorage.setItem("name", updated.name);
      if (updated.email) localStorage.setItem("email", updated.email);
      if (updated.phone) localStorage.setItem("phone", updated.phone);
      if (updated.gender) localStorage.setItem("gender", updated.gender);
      if (updated.address) localStorage.setItem("address", updated.address);
      if (updated.nationality) localStorage.setItem("nationality", updated.nationality);
      if (updated.additionalNumber) {
        localStorage.setItem("additionalNumber", updated.additionalNumber);
        localStorage.setItem("emergencyContact", updated.additionalNumber);
      } else if (updated.emergencyContact) {
        localStorage.setItem("additionalNumber", updated.emergencyContact);
        localStorage.setItem("emergencyContact", updated.emergencyContact);
      }
      if (updated.phoneVerified !== undefined) {
        localStorage.setItem("phoneVerified", String(updated.phoneVerified));
      }
      if (updated.avatar !== undefined) {
        if (updated.avatar) {
          localStorage.setItem("avatar", updated.avatar);
        } else {
          localStorage.removeItem("avatar");
        }
      }
      const saved = localStorage.getItem("user");
      const parsed = saved ? JSON.parse(saved) : {};
      localStorage.setItem("user", JSON.stringify({ ...parsed, ...updated }));
    } catch {
      /* storage may be unavailable */
    }
  };
  

  /* ── Tab title for the top-bar of the content area ── */
  const TAB_TITLES: Record<DashboardTab, string> = {
    "dashboard":    "Dashboard",
    "user-details": "User Details",
    "booking":      "Booking",
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] overflow-x-hidden">
      {/* ════════════════════════════════════════════════════════
          FIXED DARK PURPLE SIDEBAR
          top = HEADER_H (below sticky header, above ServicesStrip offset)
         ════════════════════════════════════════════════════════ */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        userName={userData.name}
        userEmail={userData.email}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT AREA — offset by sidebar width on desktop
         ════════════════════════════════════════════════════════ */}
      <main
        id="dashboard-main"
        aria-label="Dashboard content"
        /* pt-0: Header is sticky and takes up normal DOM flow; pt-0 connects the banner directly flush to nav2 */
        className="md:ml-[220px] lg:ml-[240px] pt-0 min-h-screen"
      >
        {/* ── Mobile sticky sub-bar: hamburger + current tab title (mobile only < 768px) ── */}
        <div className="md:hidden sticky top-[56px] sm:top-[84px] z-20 flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 shadow-sm">
          <button
            type="button"
            id="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            className="p-2 rounded-xl text-[#2D1347] hover:bg-purple-50 transition-colors cursor-pointer shrink-0"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-black text-slate-900 tracking-tight truncate">
            {TAB_TITLES[activeTab]}
          </span>
        </div>

        {/* ════════════════════════════════════════════════════
            TAB CONTENT — each tab renders its own full-width header banner
           ════════════════════════════════════════════════════ */}

        {/* ── DASHBOARD TAB (All 8 Service Cards with Welcome Banner) ── */}
        {activeTab === "dashboard" && (
          <DashboardBookingStatus userData={userData} />
        )}

        {/* ── USER DETAILS TAB (Header with Edit Action + Details Form) ── */}
        {activeTab === "user-details" && (
          <DashboardUserDetails
            user={userData}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {/* ── BOOKING TAB (All Bookings Header + Filter Bar + Table) ── */}
        {activeTab === "booking" && (
          <DashboardBookingStatus mode="table-only" userData={userData} />
        )}
      </main>

      {/* ════════════════════════════════════════════════════════
          MODALS
         ════════════════════════════════════════════════════════ */}
      <UpdateDetailsModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        initialData={userData}
        onSave={handleUpdateUser}
      />
    </div>
  );
};

export default Dashboard;
