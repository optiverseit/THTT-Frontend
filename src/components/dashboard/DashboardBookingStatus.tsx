/**
 * DashboardBookingStatus.tsx
 * ──────────────────────────
 * "Booking" tab content — 3 internal views driven by local state (no routing):
 *
 *   VIEW "cards"  → 8 service cards grid, each showing booking count + latest status.
 *                   Click a card → VIEW "list"
 *
 *   VIEW "list"   → Scrollable table of the user's bookings for the selected service,
 *                   sorted latest-first by submittedAt datetime.
 *                   Columns: S.N. | Submission No. | Name | Email | Nationality |
 *                            Travel Date | Contact | Price | Payment Status | View Details
 *                   Click "View Details" → VIEW "detail"
 *
 *   VIEW "detail" → Full DashboardBookingDetailPage (inline, no route change).
 *                   Back button → VIEW "list"
 *
 * Users book from service pages; submissions appear here read-only.
 * Replace DEMO_BOOKINGS with an API call when the backend is ready.
 */

import React, { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Eye, ChevronRight, Search, User, X, ChevronDown, Filter, FileText } from "lucide-react";
import {
  ServiceType,
  ServiceBooking,
  SERVICE_CONFIGS,
  DEMO_BOOKINGS,
  PAYMENT_CLS,
  BOOKING_CLS,
  getBookedItemDetails,
} from "./DashboardBookingTypes";
import DashboardBookingDetailPage from "./DashboardBookingDetailPage";
import DashboardHeaderBanner from "./DashboardHeaderBanner";

// ─── Types ─────────────────────────────────────────────────────────────────────

type BookingView = "cards" | "list" | "detail";

// Re-export BookingRecord for backward compat with DashboardBookingCard
export interface BookingRecord {
  id: string;
  bookingRef: string;
  packageName: string;
  destination: string;
  dates: string;
  travelers: number;
  status: "Confirmed" | "Processing" | "Completed" | "Cancelled";
  paymentStatus: "Paid" | "Partial" | "Pending";
  amount: string;
  progressPercent: number;
}

interface DashboardBookingStatusProps {
  /**
   * "cards-first": Starts on 8 cards grid, drills into service list & detail (for Dashboard tab)
   * "table-only": Directly renders all bookings table with service filter dropdown & search (for Booking tab)
   */
  mode?: "cards-first" | "table-only";
  onViewBooking?: (booking: BookingRecord) => void;
  userData?: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────

const DashboardBookingStatus: React.FC<DashboardBookingStatusProps> = ({
  mode = "cards-first",
  userData,
}) => {
  const isTableOnly = mode === "table-only";

  const [view, setView] = useState<BookingView>(isTableOnly ? "list" : "cards");
  const [selectedService, setSelectedService] = useState<ServiceType | "all">(
    isTableOnly ? "all" : "package-booking"
  );
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);

  /* ── Search Filters ── */
  const [searchName, setSearchName] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [searchSubNo, setSearchSubNo] = useState("");

  /* ── Dynamic search placeholder based on selected service ── */
  const itemSearchPlaceholder = useMemo(() => {
    switch (selectedService) {
      case "package-booking":
        return "Package name or destination...";
      case "visa-service":
        return "Visa type or country...";
      case "travel-insurance":
        return "Coverage type...";
      case "work-permit":
        return "Job title or employer...";
      case "vehicle-rental":
        return "Vehicle type or route...";
      case "heli-service":
        return "Heli route or destination...";
      case "hotel-booking":
        return "Hotel name or room type...";
      case "air-ticket":
        return "Flight route or class...";
      default:
        return "Package, hotel, flight, or service...";
    }
  }, [selectedService]);

  /* ── Navigation handlers ── */

  const handleCardClick = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
    setSearchName("");
    setSearchItem("");
    setSearchSubNo("");
    setView("list");
  };

  const handleViewDetails = (booking: ServiceBooking) => {
    setSelectedBooking(booking);
    setView("detail");
  };

  const handleBackFromDetail = () => {
    setSelectedBooking(null);
    setView("list");
  };

  const handleBackFromList = () => {
    if (isTableOnly) {
      setSelectedService("all");
    } else {
      setSelectedService("package-booking");
      setView("cards");
    }
    setSearchName("");
    setSearchItem("");
    setSearchSubNo("");
  };

  const handleResetFilters = () => {
    setSelectedService("all");
    setSearchName("");
    setSearchItem("");
    setSearchSubNo("");
  };

  /* ── Per-service booking stats ── */

  const serviceStats = useMemo(() => {
    const map = {} as Record<
      ServiceType,
      { count: number; latestStatus: ServiceBooking["bookingStatus"] | null; latestPayment: ServiceBooking["paymentStatus"] | null }
    >;
    SERVICE_CONFIGS.forEach((cfg) => {
      map[cfg.id] = { count: 0, latestStatus: null, latestPayment: null };
    });
    const sorted = [...DEMO_BOOKINGS].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    sorted.forEach((b) => {
      map[b.serviceType].count++;
      if (!map[b.serviceType].latestStatus) {
        map[b.serviceType].latestStatus = b.bookingStatus;
        map[b.serviceType].latestPayment = b.paymentStatus;
      }
    });
    return map;
  }, []);

  /* ── Filtered & Sorted Bookings ── */
  const bookings = useMemo(() => {
    return [...DEMO_BOOKINGS]
      .filter((b) => {
        // 1. Service filter
        if (selectedService !== "all" && b.serviceType !== selectedService) {
          return false;
        }
        // 2. Name search (name only)
        if (searchName.trim()) {
          const q = searchName.toLowerCase().trim();
          if (!b.name.toLowerCase().includes(q)) {
            return false;
          }
        }
        // 3. Submission number search (dedicated, works across all services)
        if (searchSubNo.trim()) {
          const rawQ = searchSubNo.toLowerCase().replace(/#/g, "").trim();
          // Normalize: treat space or hyphen as interchangeable separators
          const subNo = b.submissionNumber.toLowerCase().replace(/#/g, "");
          const matchExact = subNo.includes(rawQ);
          // Also match if user types with hyphens where there's a space or vice versa
          const rawQSpaces = rawQ.replace(/-/g, " ");
          const rawQHyphens = rawQ.replace(/\s+/g, "-");
          const matchNorm = subNo.includes(rawQSpaces) || subNo.includes(rawQHyphens);
          if (!matchExact && !matchNorm) {
            return false;
          }
        }
        // 4. Package / Service item search (service-specific fields)
        if (searchItem.trim()) {
          const rawQ = searchItem.toLowerCase().trim();
          const item = getBookedItemDetails(b);
          const matchLabel = item.label.toLowerCase().includes(rawQ);
          const matchSub = item.sub ? item.sub.toLowerCase().includes(rawQ) : false;
          const matchPkg = b.packageName ? b.packageName.toLowerCase().includes(rawQ) : false;
          const matchDest = b.destination ? b.destination.toLowerCase().includes(rawQ) : false;
          const matchHotel = b.hotelLocation ? b.hotelLocation.toLowerCase().includes(rawQ) : false;
          const matchVisa = b.visaType ? b.visaType.toLowerCase().includes(rawQ) : false;
          const matchCoverage = b.coverageType ? b.coverageType.toLowerCase().includes(rawQ) : false;
          const matchJob = b.jobTitle ? b.jobTitle.toLowerCase().includes(rawQ) : false;
          const matchEmployer = b.employerName ? b.employerName.toLowerCase().includes(rawQ) : false;
          const matchVehicle = b.vehicleType ? b.vehicleType.toLowerCase().includes(rawQ) : false;
          const matchRoom = b.roomType ? b.roomType.toLowerCase().includes(rawQ) : false;
          if (!matchLabel && !matchSub && !matchPkg && !matchDest && !matchHotel &&
              !matchVisa && !matchCoverage && !matchJob && !matchEmployer &&
              !matchVehicle && !matchRoom) {
            return false;
          }
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
  }, [selectedService, searchName, searchSubNo, searchItem]);

  /* ════════════════════════════════════════════════════════
     VIEW: DETAIL
     ════════════════════════════════════════════════════════ */

  if (view === "detail" && selectedBooking) {
    return (
      <DashboardBookingDetailPage
        booking={selectedBooking}
        onBack={handleBackFromDetail}
      />
    );
  }

  /* ════════════════════════════════════════════════════════
     VIEW: LIST — bookings table with dropdown filter & search
     ════════════════════════════════════════════════════════ */

  if (view === "list") {
    const isSingleService = selectedService !== "all";
    const cfg = isSingleService
      ? SERVICE_CONFIGS.find((s) => s.id === selectedService)!
      : null;

    const hasActiveFilters = selectedService !== "all" || searchName !== "" || searchSubNo !== "" || searchItem !== "";

    return (
      <section
        id={isSingleService ? `booking-list-${selectedService}` : "booking-list-all"}
        aria-label="Bookings list"
        className="space-y-0"
      >
        {/* ── Dark Purple Header Banner with Title + Filter/Search ── */}
        <DashboardHeaderBanner>
          <div className="space-y-4">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {!isTableOnly && (
                  <>
                    <button
                      type="button"
                      id="back-from-service-btn"
                      onClick={handleBackFromList}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-200 hover:text-[#FF2A75] transition-colors cursor-pointer group shrink-0"
                    >
                      <ArrowLeft
                        size={18}
                        className="group-hover:-translate-x-1 transition-transform duration-200"
                      />
                      All Services
                    </button>
                    <span className="text-purple-400/40 font-light">│</span>
                  </>
                )}

                {isSingleService && cfg ? (
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${cfg.bgColor} ${cfg.color} flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      <cfg.IconComponent size={20} />
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-2xl font-black text-white leading-tight">
                        {cfg.label}
                      </h1>
                      <p className="text-[11px] sm:text-xs text-purple-200/80 font-medium">
                        {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found · Latest first
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                      All Bookings
                    </h1>
                    <p className="text-xs sm:text-sm text-purple-200/80 font-medium mt-0.5">
                      {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found across all services · Latest first
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Bar — All 4 search & filter controls in 1 unified row in header */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/15 shadow-sm text-slate-800">
              <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row items-center gap-2.5">

                {/* 1. Service filter dropdown */}
                <div className="relative flex-1 w-full min-w-0">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Filter size={14} />
                  </div>
                  <select
                    id="service-filter-select"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value as ServiceType | "all")}
                    aria-label="Filter bookings by service"
                    className="w-full appearance-none pl-9 pr-8 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF2A75] focus:ring-1 focus:ring-[#FF2A75] transition-all cursor-pointer shadow-sm truncate"
                  >
                    <option value="all">All Services ({DEMO_BOOKINGS.length})</option>
                    {SERVICE_CONFIGS.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.label} ({serviceStats[sc.id].count})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>

                {/* 2. Search by traveler name */}
                <div className="relative flex-1 w-full min-w-0">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    id="search-by-name-input"
                    aria-label="Search by traveler name"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full pl-9 pr-7 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF2A75] focus:ring-1 focus:ring-[#FF2A75] transition-all shadow-sm"
                  />
                  {searchName && (
                    <button type="button" onClick={() => setSearchName("")} aria-label="Clear name search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* 3. Search by submission number */}
                <div className="relative flex-1 w-full min-w-0">
                  <FileText size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    id="search-by-submission-input"
                    aria-label="Search by submission number"
                    placeholder="e.g. THTT-HLI 2026-0001"
                    value={searchSubNo}
                    onChange={(e) => setSearchSubNo(e.target.value)}
                    className="w-full pl-9 pr-7 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#8B2CFF] focus:ring-1 focus:ring-[#8B2CFF] transition-all shadow-sm font-mono"
                  />
                  {searchSubNo && (
                    <button type="button" onClick={() => setSearchSubNo("")} aria-label="Clear submission search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* 4. Search by package / service item */}
                <div className="relative flex-1 w-full min-w-0">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    id="search-by-item-input"
                    aria-label="Search by package or service"
                    placeholder={itemSearchPlaceholder}
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    className="w-full pl-9 pr-7 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF2A75] focus:ring-1 focus:ring-[#FF2A75] transition-all shadow-sm"
                  />
                  {searchItem && (
                    <button type="button" onClick={() => setSearchItem("")} aria-label="Clear package search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Clear all filters button */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    id="reset-filters-btn"
                    onClick={handleResetFilters}
                    className="shrink-0 px-3.5 py-2.5 text-xs font-bold text-white hover:text-[#FF2A75] hover:bg-white/20 bg-white/10 border border-white/20 rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-sm"
                    title="Clear all filters"
                  >
                    Clear
                  </button>
                )}

              </div>
            </div>
          </div>
        </DashboardHeaderBanner>

        {/* ── Scrollable inner content for table ── */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 w-full">
          {/* ── Empty state ── */}
          {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-sm">
              <h3 className="text-base font-black text-slate-900">No bookings found</h3>
              <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                No booking records match your filter and search criteria.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            /* ── Bookings table ── */
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table
                  className="w-full text-xs min-w-[700px]"
                  aria-label="Booking submissions"
                >
                  {/* Table head */}
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#F8F9FC]">
                      {[
                        { key: "sn", label: "S.N.", align: "text-center", wrap: false },
                        { key: "submissionNo", label: "Submission\nNo.", align: "text-center", wrap: true },
                        { key: "service", label: "Service", align: "text-left", wrap: false },
                        { key: "name", label: "Name", align: "text-left", wrap: false },
                        { key: "travelDate", label: "Travel\nDate", align: "text-left", wrap: true },
                        { key: "contact", label: "Contact", align: "text-left", wrap: false },
                        { key: "bookedItem", label: "Booked Package\n/ Service", align: "text-left", wrap: true },
                        { key: "price", label: "Price", align: "text-left", wrap: false },
                        { key: "status", label: "Payment\nStatus", align: "text-left", wrap: true },
                        { key: "action", label: "Action", align: "text-center", wrap: false },
                      ].map((col) => (
                        <th
                          key={col.key}
                          scope="col"
                          className={`${col.align} px-3.5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider ${
                            col.wrap ? "whitespace-pre-line leading-tight" : "whitespace-nowrap"
                          }`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table body */}
                  <tbody>
                    {bookings.map((booking, idx) => {
                      const rowCfg = SERVICE_CONFIGS.find((s) => s.id === booking.serviceType)!;
                      const RowIcon = rowCfg.IconComponent;
                      const itemInfo = getBookedItemDetails(booking);

                      return (
                        <tr
                          key={booking.id}
                          className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                        >
                          {/* S.N. */}
                          <td className="px-3 py-3.5 font-black text-slate-400 text-center">
                            {idx + 1}
                          </td>

                          {/* Submission No. (Wrapped to minimize column width, clean black text) */}
                          <td className="px-3 py-3 text-center">
                            <span
                              className="inline-flex flex-col items-center justify-center font-mono px-2.5 py-0.5 rounded-lg text-[10px] leading-tight border border-slate-200 bg-slate-100/90 text-slate-900 shadow-xs"
                              title={booking.submissionNumber}
                            >
                              {(() => {
                                const parts = booking.submissionNumber.includes(" ")
                                  ? booking.submissionNumber.split(" ")
                                  : [
                                      booking.submissionNumber.split("-").slice(0, 2).join("-"),
                                      booking.submissionNumber.split("-").slice(2).join("-"),
                                    ];
                                return (
                                  <>
                                    <span className="font-black text-slate-900 tracking-tight">
                                      {parts[0]}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-800 tracking-tighter">
                                      {parts[1]}
                                    </span>
                                  </>
                                );
                              })()}
                            </span>
                          </td>

                          {/* Service (Wrapped cleanly) */}
                          <td className="px-3.5 py-3 max-w-[130px]">
                            <div className="flex items-start gap-1.5 font-bold text-slate-700">
                              <span className={`w-5 h-5 rounded-md ${rowCfg.bgColor} ${rowCfg.color} flex items-center justify-center shrink-0 mt-0.5`}>
                                <RowIcon size={12} />
                              </span>
                              <span className="text-xs leading-snug break-words">
                                {rowCfg.label}
                              </span>
                            </div>
                          </td>

                          {/* Name (Wrapped) */}
                          <td className="px-3.5 py-3 max-w-[130px]">
                            <span className="font-bold text-slate-800 text-xs leading-snug break-words block">
                              {booking.name}
                            </span>
                          </td>

                          {/* Travel Date */}
                          <td className="px-3.5 py-3 text-slate-600 font-medium text-xs whitespace-nowrap">
                            {booking.travelDate}
                          </td>

                          {/* Contact */}
                          <td className="px-3.5 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">
                            {booking.contact}
                          </td>

                          {/* Booked Package / Service (Wrapped cleanly without truncate) */}
                          <td className="px-3.5 py-3 max-w-[200px]">
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-800 text-xs leading-snug break-words" title={itemInfo.label}>
                                {itemInfo.label}
                              </p>
                              {itemInfo.sub && (
                                <p className="text-[10px] text-slate-500 font-medium leading-snug break-words" title={itemInfo.sub}>
                                  {itemInfo.sub}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-3.5 py-3 font-black text-slate-900 text-xs whitespace-nowrap">
                            {booking.price}
                          </td>

                          {/* Payment Status */}
                          <td className="px-3.5 py-3 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider whitespace-nowrap ${
                                PAYMENT_CLS[booking.paymentStatus]
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </td>

                          {/* View Details */}
                          <td className="px-3.5 py-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              id={`view-details-btn-${booking.id}`}
                              onClick={() => handleViewDetails(booking)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white text-[10px] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-sm shadow-pink-500/20"
                            >
                              <Eye size={11} />
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  /* ════════════════════════════════════════════════════════
     VIEW: CARDS — 8 service cards grid (only in cards-first mode)
     Main Dashboard tab remains same: Welcome banner intact!
     ════════════════════════════════════════════════════════ */

  return (
    <section
      id="dashboard-booking"
      aria-label="Service bookings"
      className="space-y-0"
    >
      {/* ── Welcome Header Banner (remains 100% same on dashboard!) ── */}
      <DashboardHeaderBanner
        name={userData?.name || "Traveler"}
        email={userData?.email || "user@triphimalaya.com.np"}
        phone={userData?.phone || "+977 9801234567"}
        avatarUrl={userData?.avatar}
      />

      <div className="p-3 sm:p-5 md:p-6 lg:p-8 space-y-6 w-full">
        {/* 8-card grid — responsive from 1 col on xs up to 4 on xl */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {SERVICE_CONFIGS.map((cfg) => {
            const { IconComponent } = cfg;
            const stats = serviceStats[cfg.id];

            return (
              <button
                key={cfg.id}
                type="button"
                id={`service-card-${cfg.id}`}
                aria-label={`View ${cfg.label} bookings`}
                onClick={() => handleCardClick(cfg.id)}
                className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-6.5 border ${cfg.borderColor} shadow-sm hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer text-left group flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-full min-h-[160px] sm:min-h-[175px]`}
                style={{ focusRingColor: cfg.accentHex } as React.CSSProperties}
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl ${cfg.bgColor} ${cfg.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shrink-0`}
                >
                  <IconComponent size={24} />
                </div>

                {/* Label + count */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-[15px] font-black text-slate-900 leading-tight">
                    {cfg.label}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">
                    {stats.count === 0
                      ? "No bookings"
                      : `${stats.count} booking${stats.count > 1 ? "s" : ""}`}
                  </p>
                </div>

                {/* View Details action */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100/80">
                  <span className="text-xs sm:text-[12.5px] font-bold text-slate-500 group-hover:text-[#FF2A75] transition-colors">
                    View Details
                  </span>
                  <ArrowRight
                    size={15}
                    className="text-slate-400 group-hover:text-[#FF2A75] group-hover:translate-x-1 transition-all duration-200 shrink-0"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DashboardBookingStatus;



