/**
 * DashboardBookingTypes.ts
 * ─────────────────────────
 * Shared types, service configs and demo data for the Dashboard Booking tab.
 * Imported by DashboardBookingStatus and DashboardBookingDetailPage to
 * avoid circular dependencies.
 */

import React from "react";
import {
  Package2,
  FileCheck2,
  ShieldCheck,
  Briefcase,
  Car,
  Wind,
  Building2,
  Plane,
} from "lucide-react";

import { BookingDocument } from "./dashboardDocumentUtils";

// ─── Service Type ──────────────────────────────────────────────────────────────

export type ServiceType =
  | "package-booking"
  | "visa-service"
  | "travel-insurance"
  | "work-permit"
  | "vehicle-rental"
  | "heli-service"
  | "hotel-booking"
  | "air-ticket";

export type PaymentStatus = "Paid" | "Partial" | "Pending";
export type BookingStatus = "Confirmed" | "Processing" | "Completed" | "Cancelled";

// ─── Booking Record ────────────────────────────────────────────────────────────

export interface ServiceBooking {
  id: string;
  submissionNumber: string;
  serviceType: ServiceType;
  /** ISO datetime string — used for latest-first sorting */
  submittedAt: string;

  /* ── Common table columns ── */
  name: string;
  email: string;
  nationality: string;
  travelDate: string;
  contact: string;
  price: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;

  /* ── Documents (JPG, PNG, JPEG, PDF) ── */
  documents?: BookingDocument[];

  /* ── Payment receipt ── */
  paymentMethod?: string;
  receiptNumber?: string;
  paymentDate?: string;
  /** URL/path of receipt image uploaded by admin (JPG/PNG/WebP) */
  receiptImageUrl?: string;

  /* ── Admin-set fields ── */
  /** Total number of days for this booking/service — set by admin */
  numberOfDays?: number;

  /* ── Package Booking ── */
  packageName?: string;
  destination?: string;
  travelers?: number;
  specialRequests?: string;

  /* ── Visa Service ── */
  visaType?: string;
  destinationCountry?: string;
  passportNo?: string;
  returnDate?: string;
  additionalNotes?: string;

  /* ── Travel Insurance ── */
  coverageType?: string;
  preExistingConditions?: string;

  /* ── Work Permit ── */
  employerName?: string;
  jobTitle?: string;
  workStartDate?: string;

  /* ── Vehicle Rental ── */
  vehicleType?: string;
  pickupDate?: string;
  pickupLocation?: string;
  dropoffLocation?: string;

  /* ── Heli Service ── */
  from?: string;
  to?: string;
  passengers?: number;
  specialRequirements?: string;

  /* ── Hotel Booking ── */
  hotelLocation?: string;
  checkinDate?: string;
  checkoutDate?: string;
  roomType?: string;
  guests?: number;

  /* ── Air Ticket ── */
  departureDate?: string;
  fromCity?: string;
  toCity?: string;
  travelClass?: string;
  mealPreference?: string;
}

// ─── Service Config ────────────────────────────────────────────────────────────

export interface ServiceConfig {
  id: ServiceType;
  label: string;
  /** Lucide icon component — render with size + className props */
  IconComponent: React.FC<{ size?: number; className?: string }>;
  color: string;        // Tailwind text color
  bgColor: string;      // Tailwind bg for icon wrapper
  borderColor: string;  // Tailwind border for card
  accentHex: string;    // Raw hex for inline styles
}

export const SERVICE_CONFIGS: ServiceConfig[] = [
  {
    id: "package-booking",
    label: "Package Booking",
    IconComponent: Package2,
    color: "text-[#8B2CFF]",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
    accentHex: "#8B2CFF",
  },
  {
    id: "visa-service",
    label: "Visa Service",
    IconComponent: FileCheck2,
    color: "text-[#2563EB]",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
    accentHex: "#2563EB",
  },
  {
    id: "travel-insurance",
    label: "Travel Insurance",
    IconComponent: ShieldCheck,
    color: "text-[#10B981]",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    accentHex: "#10B981",
  },
  {
    id: "work-permit",
    label: "Work Permit",
    IconComponent: Briefcase,
    color: "text-[#F59E0B]",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
    accentHex: "#F59E0B",
  },
  {
    id: "vehicle-rental",
    label: "Vehicle Rental",
    IconComponent: Car,
    color: "text-[#0891B2]",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-100",
    accentHex: "#0891B2",
  },
  {
    id: "heli-service",
    label: "Heli Service",
    IconComponent: Wind,
    color: "text-[#EF4444]",
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
    accentHex: "#EF4444",
  },
  {
    id: "hotel-booking",
    label: "Hotel Booking",
    IconComponent: Building2,
    color: "text-[#FF2A75]",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-100",
    accentHex: "#FF2A75",
  },
  {
    id: "air-ticket",
    label: "Air Ticket",
    IconComponent: Plane,
    color: "text-[#6366F1]",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-100",
    accentHex: "#6366F1",
  },
];

// ─── Status badge style maps ───────────────────────────────────────────────────

export const PAYMENT_CLS: Record<PaymentStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Partial: "bg-amber-50 text-amber-600 border-amber-200",
  Pending: "bg-rose-50 text-rose-600 border-rose-200",
};

export const BOOKING_CLS: Record<BookingStatus, string> = {
  Confirmed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Processing: "bg-amber-50 text-amber-600 border-amber-200",
  Completed: "bg-blue-50 text-blue-600 border-blue-200",
  Cancelled: "bg-rose-50 text-rose-600 border-rose-200",
};

// ─── Dynamic Year & Submission Number Generator ───────────────────────────────
export const CURRENT_YEAR = new Date().getFullYear();

/**
 * Standard format: THTT-[SERVICE_CODE] [YEAR]-[SEQUENCE]
 * Example: "THTT-HLI 2026-0001" (Year updates automatically)
 */
export function formatSubmissionNumber(serviceCode: string, sequence: number, year = CURRENT_YEAR): string {
  const padded = String(sequence).padStart(4, "0");
  return `THTT-${serviceCode.toUpperCase()} ${year}-${padded}`;
}

// ─── Demo Bookings ─────────────────────────────────────────────────────────────
// Simulates submissions received from service pages.
// Replace with API call when backend is ready.

export const DEMO_BOOKINGS: ServiceBooking[] = [
  /* ── Package Booking ─────────────────────────────────────── */
  {
    id: "pkg-1",
    submissionNumber: formatSubmissionNumber("PKG", 1),
    serviceType: "package-booking",
    submittedAt: `${CURRENT_YEAR}-09-20T14:30:00`,
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: `Oct 12, ${CURRENT_YEAR}`,
    contact: "+977 9801234567",
    price: "NPR 285,000",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "eSewa",
    receiptNumber: `RCP-${CURRENT_YEAR}-PKG-0001`,
    paymentDate: `Sep 20, ${CURRENT_YEAR}`,
    receiptImageUrl: "https://placehold.co/800x500/1a1a2e/ffffff?text=Payment+Receipt+PKG-0001",
    numberOfDays: 14,
    packageName: "Everest Base Camp Trek & Kala Patthar",
    destination: "Khumbu Region, Nepal",
    travelers: 2,
    specialRequests: "Vegetarian meals preferred",
  },
  {
    id: "pkg-2",
    submissionNumber: formatSubmissionNumber("PKG", 2),
    serviceType: "package-booking",
    submittedAt: `${CURRENT_YEAR}-09-18T09:15:00`,
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: `Dec 5, ${CURRENT_YEAR}`,
    contact: "+977 9801234567",
    price: "NPR 175,000",
    paymentStatus: "Partial",
    bookingStatus: "Processing",
    paymentMethod: "eSewa",
    receiptNumber: `RCP-${CURRENT_YEAR}-PKG-0002`,
    paymentDate: `Sep 18, ${CURRENT_YEAR}`,
    receiptImageUrl: "https://placehold.co/800x500/1a1a2e/ffffff?text=Partial+Payment+Receipt+PKG-0002",
    numberOfDays: 18,
    packageName: "Annapurna Circuit & Thorong La Pass",
    destination: "Annapurna Region, Nepal",
    travelers: 1,
    specialRequests: "",
  },
  {
    id: "pkg-3",
    submissionNumber: formatSubmissionNumber("PKG", 3),
    serviceType: "package-booking",
    submittedAt: `${CURRENT_YEAR}-09-21T16:00:00`,
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: `Nov 15, ${CURRENT_YEAR}`,
    contact: "+977 9801234567",
    price: "NPR 115,000",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "eSewa",
    receiptNumber: `RCP-${CURRENT_YEAR}-PKG-0003`,
    paymentDate: `Sep 21, ${CURRENT_YEAR}`,
    receiptImageUrl: "https://placehold.co/800x500/1a1a2e/ffffff?text=Payment+Receipt+PKG-0003",
    numberOfDays: 7,
    packageName: "Pokhara & Chitwan Tour",
    destination: "Pokhara & Chitwan, Nepal",
    travelers: 2,
    specialRequests: "Jungle safari & lake view hotel included",
  },

  /* ── Visa Service ────────────────────────────────────────── */
  {
    id: "visa-1",
    submissionNumber: formatSubmissionNumber("VIS", 1),
    serviceType: "visa-service",
    submittedAt: `${CURRENT_YEAR}-09-15T11:00:00`,
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: `Oct 10, ${CURRENT_YEAR}`,
    contact: "+977 9801234567",
    price: "NPR 12,500",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "FonePay",
    receiptNumber: `RCP-${CURRENT_YEAR}-VIS-0001`,
    paymentDate: `Sep 15, ${CURRENT_YEAR}`,
    receiptImageUrl: "https://placehold.co/800x500/0f172a/ffffff?text=Payment+Receipt+VIS-0001",
    numberOfDays: 16,
    visaType: "Tourist Visa",
    destinationCountry: "Nepal",
    passportNo: "A1234567",
    returnDate: `Oct 26, ${CURRENT_YEAR}`,
    additionalNotes: "First time visiting Nepal",
  },

  /* ── Travel Insurance ────────────────────────────────────── */
  {
    id: "ins-1",
    submissionNumber: formatSubmissionNumber("INS", 1),
    serviceType: "travel-insurance",
    submittedAt: `${CURRENT_YEAR}-09-19T16:45:00`,
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: `Oct 12, ${CURRENT_YEAR}`,
    contact: "+977 9801234567",
    price: "NPR 8,500",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "FonePay",
    receiptNumber: `RCP-${CURRENT_YEAR}-INS-0001`,
    paymentDate: `Sep 19, ${CURRENT_YEAR}`,
    receiptImageUrl: "https://placehold.co/800x500/0f172a/ffffff?text=Payment+Receipt+INS-0001",
    numberOfDays: 14,
    coverageType: "Comprehensive Trek Coverage",
    returnDate: `Oct 26, ${CURRENT_YEAR}`,
    preExistingConditions: "None",
  },

  /* ── Work Permit ─────────────────────────────────────────── */
  {
    id: "wp-1",
    submissionNumber: formatSubmissionNumber("WP", 1),
    serviceType: "work-permit",
    submittedAt: `${CURRENT_YEAR}-09-10T08:30:00`,
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: `Oct 1, ${CURRENT_YEAR}`,
    contact: "+977 9801234567",
    price: "NPR 25,000",
    paymentStatus: "Paid",
    bookingStatus: "Processing",
    paymentMethod: "FonePay",
    receiptNumber: `RCP-${CURRENT_YEAR}-WP-0001`,
    paymentDate: `Sep 10, ${CURRENT_YEAR}`,
    receiptImageUrl: "https://placehold.co/800x500/0f172a/ffffff?text=Payment+Receipt+WP-0001",
    numberOfDays: 365,
    employerName: "Himalayan Adventures Pvt. Ltd.",
    jobTitle: "Mountain Guide",
    workStartDate: `Oct 1, ${CURRENT_YEAR}`,
    passportNo: "A1234567",
  },

  /* ── Vehicle Rental ──────────────────────────────────────── */
  {
    id: "veh-1",
    submissionNumber: formatSubmissionNumber("VEH", 1),
    serviceType: "vehicle-rental",
    submittedAt: `${CURRENT_YEAR}-09-21T13:00:00`,
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: `Oct 11, ${CURRENT_YEAR}`,
    contact: "+977 9801234567",
    price: "NPR 15,000",
    paymentStatus: "Pending",
    bookingStatus: "Processing",
    paymentMethod: "Cash",
    receiptNumber: "",
    paymentDate: "—",
    numberOfDays: 16,
    vehicleType: "4WD SUV (Toyota Land Cruiser)",
    pickupDate: `Oct 11, ${CURRENT_YEAR}`,
    pickupLocation: "Tribhuvan International Airport, Kathmandu",
    dropoffLocation: "Lukla Airport",
    returnDate: `Oct 27, ${CURRENT_YEAR}`,
  },

  /* ── Heli Service ────────────────────────────────────────── */
  {
    id: "heli-1",
    submissionNumber: formatSubmissionNumber("HLI", 1),
    serviceType: "heli-service",
    submittedAt: `${CURRENT_YEAR}-09-22T10:00:00`,
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: `Oct 12, ${CURRENT_YEAR}`,
    contact: "+977 9801234567",
    price: "NPR 95,000",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "FonePay",
    receiptNumber: `RCP-${CURRENT_YEAR}-HLI-0001`,
    paymentDate: `Sep 22, ${CURRENT_YEAR}`,
    receiptImageUrl: "https://placehold.co/800x500/1a1a2e/ffffff?text=Payment+Receipt+HLI-0001",
    numberOfDays: 1,
    from: "Kathmandu (Tribhuvan Airport)",
    to: "Lukla Airport",
    passengers: 2,
    specialRequirements: "Window seat preferred",
  },

  /* ── Hotel Booking ───────────────────────────────────────── */
  {
    id: "htl-1",
    submissionNumber: formatSubmissionNumber("HTL", 1),
    serviceType: "hotel-booking",
    submittedAt: `${CURRENT_YEAR}-09-17T15:20:00`,
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: `Oct 11, ${CURRENT_YEAR}`,
    contact: "+977 9801234567",
    price: "NPR 45,000",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "FonePay",
    receiptNumber: `RCP-${CURRENT_YEAR}-HTL-0001`,
    paymentDate: `Sep 17, ${CURRENT_YEAR}`,
    receiptImageUrl: "https://placehold.co/800x500/0f172a/ffffff?text=Payment+Receipt+HTL-0001",
    numberOfDays: 16,
    hotelLocation: "Hotel Yak & Yeti, Kathmandu",
    checkinDate: `Oct 11, ${CURRENT_YEAR}`,
    checkoutDate: `Oct 27, ${CURRENT_YEAR}`,
    roomType: "Deluxe Double Room",
    guests: 2,
    specialRequests: "Early check-in if possible",
  },

  /* ── Air Ticket ──────────────────────────────────────────── */
  {
    id: "air-1",
    submissionNumber: formatSubmissionNumber("AIR", 1),
    serviceType: "air-ticket",
    submittedAt: `${CURRENT_YEAR}-09-16T12:00:00`,
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: `Oct 12, ${CURRENT_YEAR}`,
    contact: "+977 9801234567",
    price: "NPR 35,000",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "Cash",
    receiptNumber: `RCP-${CURRENT_YEAR}-AIR-0001`,
    paymentDate: `Sep 16, ${CURRENT_YEAR}`,
    receiptImageUrl: "https://placehold.co/800x500/0f172a/ffffff?text=Payment+Receipt+AIR-0001",
    numberOfDays: 15,
    departureDate: `Oct 12, ${CURRENT_YEAR}`,
    returnDate: `Oct 27, ${CURRENT_YEAR}`,
    fromCity: "New Delhi (IGI Airport)",
    toCity: "Kathmandu (TIA)",
    travelClass: "Economy",
    travelers: 2,
    mealPreference: "Vegetarian",
  },
];

// ─── Helper: Get Booked Item Title & Subtitle ──────────────────────────────────
export interface BookedItemInfo {
  label: string;
  sub?: string;
}

export function getBookedItemDetails(booking: ServiceBooking): BookedItemInfo {
  switch (booking.serviceType) {
    case "package-booking":
      return {
        label: booking.packageName || "Tour Package",
        sub: booking.destination,
      };
    case "visa-service":
      return {
        label: booking.visaType || "Visa Application",
        sub: booking.destinationCountry ? `Country: ${booking.destinationCountry}` : undefined,
      };
    case "travel-insurance":
      return {
        label: booking.coverageType || "Travel Insurance",
        sub: booking.preExistingConditions ? `Pre-existing: ${booking.preExistingConditions}` : undefined,
      };
    case "work-permit":
      return {
        label: booking.jobTitle || "Work Permit",
        sub: booking.employerName ? `Employer: ${booking.employerName}` : undefined,
      };
    case "vehicle-rental":
      return {
        label: booking.vehicleType || "Vehicle Rental",
        sub: booking.pickupLocation && booking.dropoffLocation
          ? `${booking.pickupLocation.split(",")[0]} → ${booking.dropoffLocation.split(",")[0]}`
          : booking.pickupLocation,
      };
    case "heli-service":
      return {
        label: booking.from && booking.to
          ? `${booking.from.split("(")[0].trim()} → ${booking.to.split("(")[0].trim()}`
          : "Helicopter Charter",
        sub: booking.specialRequirements,
      };
    case "hotel-booking":
      return {
        label: booking.roomType || "Hotel Room",
        sub: booking.hotelLocation,
      };
    case "air-ticket":
      return {
        label: booking.fromCity && booking.toCity
          ? `${booking.fromCity.split("(")[0].trim()} → ${booking.toCity.split("(")[0].trim()}`
          : "Flight Ticket",
        sub: booking.travelClass ? `Class: ${booking.travelClass}` : undefined,
      };
    default:
      return { label: "Standard Booking" };
  }
}
