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
 * │  Booking          │   user form / bookings / payments]   │
 * │  Payments         │                                       │
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
import DashboardStatCards from "../components/dashboard/DashboardStatCards";
import DashboardBookingCard from "../components/dashboard/DashboardBookingCard";
import DashboardRecentActivity from "../components/dashboard/DashboardRecentActivity";
import DashboardUserDetails from "../components/dashboard/DashboardUserDetails";
import DashboardBookingStatus from "../components/dashboard/DashboardBookingStatus";
import DashboardPayments from "../components/dashboard/DashboardPayments";
import { UpdateDetailsModal, BookingDetailsModal } from "../components/dashboard/DashboardModals";


const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* ── UI state ── */
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

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
      emergencyContact: user?.emergencyContact || localStorage.getItem("emergencyContact") || "+977 9851000000 (Family)",
      avatar: user?.avatar || localStorage.getItem("avatar") || "",
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
    emergencyContact?: string;
    avatar?: string;
  }) => {
    setUserData((prev) => ({ ...prev, ...updated }));
    try {
      if (updated.name) localStorage.setItem("name", updated.name);
      if (updated.email) localStorage.setItem("email", updated.email);
      if (updated.phone) localStorage.setItem("phone", updated.phone);
      if (updated.gender) localStorage.setItem("gender", updated.gender);
      if (updated.address) localStorage.setItem("address", updated.address);
      if (updated.nationality) localStorage.setItem("nationality", updated.nationality);
      if (updated.emergencyContact) localStorage.setItem("emergencyContact", updated.emergencyContact);
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
    "payments":     "Payments",
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

        {/* ── WELCOME BANNER (touches top below header, left to sidebar, right to browser edge) ── */}
        <DashboardHeaderBanner
          name={userData.name}
          email={userData.email}
          phone={userData.phone}
          avatarUrl={userData.avatar}
        />

        {/* ── Scrollable inner content ── */}
        <div className="p-3 sm:p-5 md:p-6 lg:p-8 space-y-3 sm:space-y-5 md:space-y-6 w-full max-w-[1400px]">

          {/* ════════════════════════════════════════════════════
              TAB CONTENT — rendered based on activeTab
             ════════════════════════════════════════════════════ */}

          {/* ── DASHBOARD TAB ── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* 4 KPI cards */}
              <DashboardStatCards
                bookingRequests={1}
                bookingProgress="70%"
                paymentStatus="Paid"
                verificationStatus="Verified"
              />

              {/* Booking Card + Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                <DashboardBookingCard
                  onView={() => setBookingModalOpen(true)}
                  status="Confirmed"
                  paymentBadge="PAID"
                  progressPercent={70}
                  requestStatus="Approved"
                  paymentVerification="Verified"
                  remarks="Bring passport, arrive 30 mins early."
                />
                <DashboardRecentActivity />
              </div>
            </div>
          )}

          {/* ── USER DETAILS TAB ── */}
          {activeTab === "user-details" && (
            <DashboardUserDetails
              user={userData}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {/* ── BOOKING TAB ── */}
          {activeTab === "booking" && (
            <DashboardBookingStatus
              onViewBooking={() => setBookingModalOpen(true)}
            />
          )}

          {/* ── PAYMENTS TAB ── */}
          {activeTab === "payments" && (
            <DashboardPayments />
          )}

        </div>
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

      <BookingDetailsModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        booking={{
          bookingRef:  "THTT-2026-8941",
          packageName: "Everest Base Camp Trek & Kala Patthar",
          destination: "Khumbu Region, Nepal",
          dates:       "Oct 12, 2026 – Oct 26, 2026 (14 Days)",
          travelers:   2,
          amount:      "NPR 285,000",
          remarks:     "Bring passport, arrive 30 mins early at TIA Domestic Terminal for Lukla flight.",
        }}
      />
    </div>
  );
};

export default Dashboard;
