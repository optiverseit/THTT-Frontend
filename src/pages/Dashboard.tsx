/**
 * Dashboard.tsx
 * ─────────────
 * Content renderer for each dashboard sub-route.
 * Receives a `tab` prop from the route definition in App.tsx.
 * URL params (serviceId, bookingId) are read by child components directly.
 *
 * Layout:
 *   /dashboard               → tab="dashboard"   → DashboardBookingStatus (cards-first)
 *   /dashboard/user-profile  → tab="user-details" → DashboardUserDetails
 *   /dashboard/booking       → tab="booking"      → DashboardBookingStatus (table-only)
 *   /dashboard/booking/:svc  → tab="booking"      → DashboardBookingStatus (service filtered)
 *   /dashboard/booking/:svc/:id → tab="booking"   → DashboardBookingStatus (detail view)
 *
 * Auth/API code is NOT changed (AuthContext, BackendApi, ProtectedRoute untouched).
 */

import React from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardTab } from "../components/dashboard/DashboardSidebar";

/* ── Dashboard sub-components ── */
import DashboardUserDetails from "../components/dashboard/DashboardUserDetails";
import DashboardBookingStatus from "../components/dashboard/DashboardBookingStatus";

/* ── Outlet context shape (provided by DashboardLayout) ── */
interface DashboardOutletContext {
  userData: {
    name: string;
    email: string;
    phone: string;
    gender: string;
    address: string;
    nationality: string;
    additionalNumber: string;
    emergencyContact: string;
    avatar: string;
    phoneVerified: boolean;
  };
  onUpdateUser: (updated: {
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
  }) => void;
}

interface DashboardProps {
  tab: DashboardTab;
}

const Dashboard: React.FC<DashboardProps> = ({ tab }) => {
  const { userData, onUpdateUser } = useOutletContext<DashboardOutletContext>();

  /* ── DASHBOARD TAB (All 8 Service Cards with Welcome Banner) ── */
  if (tab === "dashboard") {
    return <DashboardBookingStatus userData={userData} />;
  }

  /* ── USER DETAILS TAB ── */
  if (tab === "user-details") {
    return (
      <DashboardUserDetails
        user={userData}
        onUpdateUser={onUpdateUser}
      />
    );
  }

  /* ── BOOKING TAB (table-only — driven by URL params) ── */
  if (tab === "booking") {
    return <DashboardBookingStatus mode="table-only" userData={userData} />;
  }

  return null;
};

export default Dashboard;
