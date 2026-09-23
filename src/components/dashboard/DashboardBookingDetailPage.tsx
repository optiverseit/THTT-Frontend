/**
 * DashboardBookingDetailPage.tsx
 * ────────────────────────────────
 * Full booking detail view rendered within the Dashboard Booking tab.
 * Clicking "View Details" on any booking row navigates here (no route change).
 *
 * Sections:
 *  1. Service header — icon + name + submission no + status badges + amount
 *  2. Traveler Information — name, email, contact, nationality
 *  3. Booking Details — service-specific fields (required + optional)
 *  4. Payment Information — amount, method, status, date
 *  5. Payment Receipt — visual receipt card + download (design-only)
 *  6. Submission metadata footer
 */

import React, { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Receipt,
  Download,
  Clock,
  FileText,
  AlertCircle,
  Package2,
  FileCheck2,
  ShieldCheck,
  Briefcase,
  Car,
  Wind,
  Building2,
  Plane,
  ImageIcon,
  ZoomIn,
  X as XIcon,
  CalendarDays,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import DashboardHeaderBanner from "./DashboardHeaderBanner";
import DashboardDocumentsSection from "./DashboardDocumentsSection";
import {
  downloadReceiptImage,
  bookingToReceiptData,
  generateReceiptSvgDataUrl,
} from "../../utils/receiptDownloader";
import {
  ServiceBooking,
  SERVICE_CONFIGS,
  PAYMENT_CLS,
  BOOKING_CLS,
} from "./DashboardBookingTypes";

// ─── Mini helpers ──────────────────────────────────────────────────────────────

const PaymentBadge: React.FC<{ status: ServiceBooking["paymentStatus"] }> = ({ status }) => (
  <span
    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${PAYMENT_CLS[status]}`}
  >
    {status}
  </span>
);

const BookingBadge: React.FC<{ status: ServiceBooking["bookingStatus"] }> = ({ status }) => (
  <span
    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${BOOKING_CLS[status]}`}
  >
    {status}
  </span>
);

/** Single info cell in a detail grid */
const InfoCell: React.FC<{
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}> = ({ label, value, icon, fullWidth }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div
      className={`bg-[#F8F9FC] rounded-2xl p-3.5 border border-slate-100 ${
        fullWidth ? "col-span-2" : ""
      }`}
    >
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
        {label}
      </span>
      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
        {icon && <span className="shrink-0">{icon}</span>}
        {value}
      </p>
    </div>
  );
};

// ─── Service-specific booking detail fields ────────────────────────────────────

const ServiceFields: React.FC<{ b: ServiceBooking }> = ({ b }) => {
  switch (b.serviceType) {
    case "package-booking":
      return (
        <>
          <InfoCell
            label="Package Name"
            value={b.packageName}
            icon={<Package2 size={12} className="text-[#8B2CFF]" />}
            fullWidth
          />
          <InfoCell
            label="Destination"
            value={b.destination}
            icon={<MapPin size={12} className="text-[#FF2A75]" />}
          />
          <InfoCell
            label="No. of Travelers"
            value={b.travelers ? `${b.travelers} Person${b.travelers > 1 ? "s" : ""}` : undefined}
            icon={<Users size={12} className="text-[#8B2CFF]" />}
          />
          <InfoCell
            label="Travel Date"
            value={b.travelDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          {b.numberOfDays !== undefined && (
            <InfoCell
              label="No. of Days"
              value={`${b.numberOfDays} Day${b.numberOfDays !== 1 ? "s" : ""}`}
              icon={<CalendarDays size={12} className="text-[#8B2CFF]" />}
            />
          )}
          {b.specialRequests && (
            <InfoCell label="Special Requests" value={b.specialRequests} fullWidth />
          )}
        </>
      );

    case "visa-service":
      return (
        <>
          <InfoCell
            label="Visa Type"
            value={b.visaType}
            icon={<FileCheck2 size={12} className="text-[#2563EB]" />}
          />
          <InfoCell
            label="Destination Country"
            value={b.destinationCountry}
            icon={<Globe size={12} className="text-[#2563EB]" />}
          />
          <InfoCell
            label="Passport Number"
            value={b.passportNo}
            icon={<FileText size={12} className="text-[#2563EB]" />}
          />
          <InfoCell
            label="Travel Date"
            value={b.travelDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          <InfoCell
            label="Return Date"
            value={b.returnDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          {b.numberOfDays !== undefined && (
            <InfoCell
              label="No. of Days"
              value={`${b.numberOfDays} Day${b.numberOfDays !== 1 ? "s" : ""}`}
              icon={<CalendarDays size={12} className="text-[#2563EB]" />}
            />
          )}
          {b.additionalNotes && (
            <InfoCell label="Additional Notes" value={b.additionalNotes} fullWidth />
          )}
        </>
      );

    case "travel-insurance":
      return (
        <>
          <InfoCell
            label="Coverage Type"
            value={b.coverageType}
            icon={<ShieldCheck size={12} className="text-[#10B981]" />}
          />
          <InfoCell
            label="Travel Date"
            value={b.travelDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          <InfoCell
            label="Return Date"
            value={b.returnDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          {b.numberOfDays !== undefined && (
            <InfoCell
              label="No. of Days"
              value={`${b.numberOfDays} Day${b.numberOfDays !== 1 ? "s" : ""}`}
              icon={<CalendarDays size={12} className="text-[#10B981]" />}
            />
          )}
          {b.preExistingConditions && (
            <InfoCell
              label="Pre-existing Conditions"
              value={b.preExistingConditions}
              fullWidth
            />
          )}
        </>
      );

    case "work-permit":
      return (
        <>
          <InfoCell
            label="Employer Name"
            value={b.employerName}
            icon={<Briefcase size={12} className="text-[#F59E0B]" />}
          />
          <InfoCell label="Job Title" value={b.jobTitle} />
          <InfoCell
            label="Work Start Date"
            value={b.workStartDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          <InfoCell
            label="Passport Number"
            value={b.passportNo}
            icon={<FileText size={12} className="text-[#F59E0B]" />}
          />
          {b.numberOfDays !== undefined && (
            <InfoCell
              label="No. of Days"
              value={`${b.numberOfDays} Day${b.numberOfDays !== 1 ? "s" : ""}`}
              icon={<CalendarDays size={12} className="text-[#F59E0B]" />}
            />
          )}
        </>
      );

    case "vehicle-rental":
      return (
        <>
          <InfoCell
            label="Vehicle Type"
            value={b.vehicleType}
            icon={<Car size={12} className="text-[#0891B2]" />}
            fullWidth
          />
          <InfoCell
            label="Pickup Date"
            value={b.pickupDate ?? b.travelDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          <InfoCell
            label="Return Date"
            value={b.returnDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          {b.numberOfDays !== undefined && (
            <InfoCell
              label="No. of Days"
              value={`${b.numberOfDays} Day${b.numberOfDays !== 1 ? "s" : ""}`}
              icon={<CalendarDays size={12} className="text-[#0891B2]" />}
            />
          )}
          <InfoCell
            label="Pickup Location"
            value={b.pickupLocation}
            icon={<MapPin size={12} className="text-[#FF2A75]" />}
            fullWidth
          />
          {b.dropoffLocation && (
            <InfoCell
              label="Drop-off Location"
              value={b.dropoffLocation}
              icon={<MapPin size={12} className="text-[#0891B2]" />}
              fullWidth
            />
          )}
        </>
      );

    case "heli-service":
      return (
        <>
          <InfoCell
            label="From"
            value={b.from}
            icon={<MapPin size={12} className="text-[#EF4444]" />}
          />
          <InfoCell
            label="To"
            value={b.to}
            icon={<MapPin size={12} className="text-[#EF4444]" />}
          />
          <InfoCell
            label="Travel Date"
            value={b.travelDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          <InfoCell
            label="No. of Passengers"
            value={
              b.passengers
                ? `${b.passengers} Person${b.passengers > 1 ? "s" : ""}`
                : undefined
            }
            icon={<Users size={12} className="text-[#EF4444]" />}
          />
          {b.numberOfDays !== undefined && (
            <InfoCell
              label="No. of Days"
              value={`${b.numberOfDays} Day${b.numberOfDays !== 1 ? "s" : ""}`}
              icon={<CalendarDays size={12} className="text-[#EF4444]" />}
            />
          )}
          {b.specialRequirements && (
            <InfoCell
              label="Special Requirements"
              value={b.specialRequirements}
              fullWidth
            />
          )}
        </>
      );

    case "hotel-booking":
      return (
        <>
          <InfoCell
            label="Hotel / Location"
            value={b.hotelLocation}
            icon={<Building2 size={12} className="text-[#FF2A75]" />}
            fullWidth
          />
          <InfoCell
            label="Check-in Date"
            value={b.checkinDate ?? b.travelDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          <InfoCell
            label="Check-out Date"
            value={b.checkoutDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          <InfoCell label="Room Type" value={b.roomType} />
          <InfoCell
            label="No. of Guests"
            value={
              b.guests ? `${b.guests} Guest${b.guests > 1 ? "s" : ""}` : undefined
            }
            icon={<Users size={12} className="text-[#FF2A75]" />}
          />
          {b.numberOfDays !== undefined && (
            <InfoCell
              label="No. of Days"
              value={`${b.numberOfDays} Day${b.numberOfDays !== 1 ? "s" : ""}`}
              icon={<CalendarDays size={12} className="text-[#FF2A75]" />}
            />
          )}
          {b.specialRequests && (
            <InfoCell label="Special Requests" value={b.specialRequests} fullWidth />
          )}
        </>
      );

    case "air-ticket":
      return (
        <>
          <InfoCell
            label="From"
            value={b.fromCity}
            icon={<Plane size={12} className="text-[#6366F1]" />}
          />
          <InfoCell
            label="To"
            value={b.toCity}
            icon={<Plane size={12} className="text-[#6366F1]" />}
          />
          <InfoCell
            label="Departure Date"
            value={b.departureDate ?? b.travelDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          <InfoCell
            label="Return Date"
            value={b.returnDate}
            icon={<Calendar size={12} className="text-[#2563EB]" />}
          />
          <InfoCell label="Travel Class" value={b.travelClass} />
          <InfoCell
            label="No. of Passengers"
            value={
              b.travelers
                ? `${b.travelers} Person${b.travelers > 1 ? "s" : ""}`
                : undefined
            }
            icon={<Users size={12} className="text-[#6366F1]" />}
          />
          {b.numberOfDays !== undefined && (
            <InfoCell
              label="No. of Days"
              value={`${b.numberOfDays} Day${b.numberOfDays !== 1 ? "s" : ""}`}
              icon={<CalendarDays size={12} className="text-[#6366F1]" />}
            />
          )}
          {b.mealPreference && (
            <InfoCell label="Meal Preference" value={b.mealPreference} />
          )}
        </>
      );

    default:
      return null;
  }
};

// ─── Main component ────────────────────────────────────────────────────────────

interface Props {
  booking: ServiceBooking;
  onBack: () => void;
}

const DashboardBookingDetailPage: React.FC<Props> = ({ booking, onBack }) => {
  const cfg = SERVICE_CONFIGS.find((s) => s.id === booking.serviceType)!;
  const { IconComponent } = cfg;

  /* ── Receipt image & download state ── */
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const hasPaidReceipt =
    booking.paymentStatus === "Paid" || booking.paymentStatus === "Partial";

  // Use admin uploaded image if real, otherwise generate branded official receipt SVG
  const receiptImgSrc =
    booking.receiptImageUrl && !booking.receiptImageUrl.includes("placehold.co")
      ? booking.receiptImageUrl
      : hasPaidReceipt
      ? generateReceiptSvgDataUrl(bookingToReceiptData(booking))
      : undefined;

  const hasReceiptImage = !!(receiptImgSrc && hasPaidReceipt);

  const handleDownloadReceipt = async () => {
    if (!receiptImgSrc && !hasPaidReceipt) return;
    setIsDownloading(true);
    try {
      const receiptData = bookingToReceiptData(booking);
      const fileName = `Receipt-${(booking.receiptNumber || booking.submissionNumber).replace(/\s+/g, "_")}.png`;
      await downloadReceiptImage(receiptImgSrc, fileName, receiptData);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to download receipt:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedSubmittedAt = (() => {
    try {
      return new Date(booking.submittedAt).toLocaleString("en-NP", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return booking.submittedAt;
    }
  })();

  return (
    <section
      id="booking-detail-page"
      aria-label={`Booking detail — ${booking.submissionNumber}`}
      className="space-y-0"
    >
      {/* ── Dark Purple Header Banner with Service Detail Summary ── */}
      <DashboardHeaderBanner>
        <div className="space-y-3.5">
          {/* Back link */}
          <button
            type="button"
            id="booking-detail-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-200 hover:text-[#FF2A75] transition-colors cursor-pointer group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            Back to Bookings
          </button>

          {/* Service Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: icon + name + ref + badges */}
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${cfg.bgColor} ${cfg.color} flex items-center justify-center shrink-0 shadow-md`}
              >
                <IconComponent size={26} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                  {cfg.label}
                </h1>
                <p className="text-xs text-purple-200/90 font-bold mt-0.5 tracking-wide font-mono">
                  {booking.submissionNumber}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <BookingBadge status={booking.bookingStatus} />
                  <PaymentBadge status={booking.paymentStatus} />
                </div>
              </div>
            </div>

            {/* Right: amount */}
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] font-bold text-purple-200/70 uppercase tracking-wider block">
                Total Amount
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {booking.price}
              </span>
            </div>
          </div>
        </div>
      </DashboardHeaderBanner>

      {/* ── Scrollable inner content ── */}
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-5 w-full">
        {/* ── 2 + 3. Traveler Info | Booking Details ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Traveler Information */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">
            Traveler Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCell
              label="Full Name"
              value={booking.name}
              icon={<Users size={12} className="text-[#8B2CFF]" />}
            />
            <InfoCell
              label="Nationality"
              value={booking.nationality}
              icon={<Globe size={12} className="text-[#F59E0B]" />}
            />
            <InfoCell
              label="Email Address"
              value={booking.email}
              icon={<Mail size={12} className="text-[#2563EB]" />}
            />
            <InfoCell
              label="Contact Number"
              value={booking.contact}
              icon={<Phone size={12} className="text-[#10B981]" />}
            />
          </div>
        </div>

        {/* Booking Details (service-specific) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">
            Booking Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ServiceFields b={booking} />
          </div>
        </div>
      </div>

      {/* ── Required & Uploaded Documents (Booking, Applying, Processing) ── */}
      <DashboardDocumentsSection booking={booking} serviceLabel={cfg.label} />

      {/* ── 4 + 5. Payment Info | Payment Receipt ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Payment Information */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">
            Payment Information
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <InfoCell
              label="Total Amount"
              value={booking.price}
              icon={<CreditCard size={12} className="text-[#8B2CFF]" />}
            />
            <div className="bg-[#F8F9FC] rounded-2xl p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Payment Status
              </span>
              <PaymentBadge status={booking.paymentStatus} />
            </div>
            <InfoCell
              label="Payment Method"
              value={booking.paymentMethod ?? "—"}
              icon={<CreditCard size={12} className="text-[#10B981]" />}
            />
            <InfoCell
              label="Payment Date"
              value={booking.paymentDate ?? "—"}
              icon={<Calendar size={12} className="text-[#2563EB]" />}
            />
          </div>
        </div>

        {/* Payment Receipt */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
            <Receipt size={14} className="text-[#FF2A75]" />
            Payment Receipt
          </h3>

          {hasReceiptImage ? (
            <>
              {/* Receipt image card */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden relative group">
                {/* Zoom hint overlay */}
                <div
                  onClick={() => setLightboxOpen(true)}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center cursor-zoom-in z-10"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full px-4 py-2 flex items-center gap-2">
                    <ZoomIn size={14} className="text-slate-700" />
                    <span className="text-xs font-bold text-slate-700">View Full Receipt</span>
                  </div>
                </div>
                <img
                  src={receiptImgSrc!}
                  alt={`Payment receipt for ${booking.submissionNumber}`}
                  className="w-full max-h-[260px] object-contain bg-slate-50"
                  onClick={() => setLightboxOpen(true)}
                />
              </div>

              {/* Metadata strip below image */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span className="font-semibold">{booking.receiptNumber || "—"}</span>
                <span
                  className={`font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider text-[10px] ${
                    booking.paymentStatus === "Paid"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-amber-50 text-amber-600 border-amber-200"
                  }`}
                >
                  {booking.paymentStatus === "Paid" ? "Paid in Full" : "Partial Payment"}
                </span>
              </div>

              {/* Download image button */}
              <button
                type="button"
                id={`download-receipt-img-${booking.id}`}
                onClick={handleDownloadReceipt}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#8B2CFF] to-[#FF2A75] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-75"
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Generating &amp; Downloading...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 size={15} className="text-emerald-300" />
                    <span>Receipt Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    <span>Download Receipt Image</span>
                  </>
                )}
              </button>
            </>
          ) : hasPaidReceipt ? (
            /* Text-only receipt (no image uploaded yet) */
            <>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 relative overflow-hidden">
                {/* Watermark */}
                <div className="absolute -bottom-2 -right-2 opacity-[0.06] pointer-events-none">
                  <Receipt size={100} className="text-[#8B2CFF]" />
                </div>

                {/* Top row: receipt no + paid badge */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Receipt No.
                    </p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">
                      {booking.receiptNumber || "—"}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      booking.paymentStatus === "Paid"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}
                  >
                    {booking.paymentStatus === "Paid" ? "Paid in Full" : "Partial Payment"}
                  </span>
                </div>

                <hr className="border-slate-100 mb-4" />

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service</p>
                    <p className="font-bold text-slate-800 mt-0.5">{cfg.label}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                    <p className="font-bold text-slate-800 mt-0.5">{booking.paymentDate ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Method</p>
                    <p className="font-bold text-slate-800 mt-0.5">{booking.paymentMethod ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</p>
                    <p className="font-black text-slate-900 mt-0.5">{booking.price}</p>
                  </div>
                </div>

                <hr className="border-slate-100 mt-4 mb-3" />
                <p className="text-[10px] text-slate-400 italic leading-relaxed">
                  This is a digital receipt generated by Trip Himalaya Tours &amp; Travels Pvt.
                  Ltd. Please retain it for your records.
                </p>
              </div>

              {/* Awaiting image notice */}
              <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <ImageIcon size={15} className="text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 font-medium">
                  Receipt image will be uploaded by admin soon.
                </p>
              </div>
            </>
          ) : (
            /* Pending state */
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <AlertCircle size={36} className="text-amber-400 mx-auto mb-3" />
              <p className="text-sm font-black text-slate-700">Payment Pending</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Receipt will be generated automatically once your payment is confirmed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── 6. Submission Metadata Footer ── */}
      <div className="bg-white rounded-3xl px-6 py-4 border border-slate-100 shadow-sm flex flex-wrap items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <Clock size={13} className="shrink-0" />
          Submitted: {formattedSubmittedAt}
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <FileText size={13} className="shrink-0" />
          Reference: {booking.submissionNumber}
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <FileCheck2 size={13} className="shrink-0" />
          Booking ID: {booking.id.toUpperCase()}
        </span>
      </div>
      </div>

      {/* ── Receipt Image Lightbox Modal ── */}
      {lightboxOpen && receiptImgSrc && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              id="receipt-lightbox-close-btn"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-4 -right-2 z-10 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
            >
              <XIcon size={18} className="text-white" />
            </button>

            {/* Receipt image */}
            <img
              src={receiptImgSrc}
              alt={`Full receipt — ${booking.submissionNumber}`}
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl bg-white"
            />

            {/* Download button inside lightbox */}
            <button
              type="button"
              id="receipt-lightbox-download-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadReceipt();
              }}
              disabled={isDownloading}
              className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-white text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shadow-lg disabled:opacity-75"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-[#8B2CFF]" />
                  <span>Downloading...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Receipt Downloaded!</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download Receipt Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardBookingDetailPage;
