/**
 * DashboardLayout.tsx
 * ───────────────────
 * Layout shell for all /dashboard/* routes.
 * Renders the fixed sidebar + mobile topbar and delegates content to <Outlet />.
 * URL-based navigation: sidebar items navigate to proper sub-routes.
 */

import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu } from "lucide-react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { UpdateDetailsModal } from "../components/dashboard/DashboardModals";
import { useLocation } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  /* ── User data — same merge logic as original Dashboard ── */
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

  /* ── Derive active tab label from URL for mobile header ── */
  const getTabTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard/user-profile")) return "User Details";
    if (path.startsWith("/dashboard/booking")) return "Booking";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] overflow-x-hidden">
      {/* ════════════════════════════════════════════════════════
          FIXED DARK PURPLE SIDEBAR
         ════════════════════════════════════════════════════════ */}
      <DashboardSidebar
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
        className="md:ml-[220px] lg:ml-[240px] pt-0 min-h-screen"
      >
        {/* ── Mobile sticky sub-bar: hamburger + current tab title ── */}
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
            {getTabTitle()}
          </span>
        </div>

        {/* ── Nested route content rendered here ── */}
        <Outlet context={{ userData, onUpdateUser: handleUpdateUser }} />
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

export default DashboardLayout;
