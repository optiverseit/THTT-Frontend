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

  /* ── Payment receipt ── */
  paymentMethod?: string;
  receiptNumber?: string;
  paymentDate?: string;

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

// ─── Demo Bookings ─────────────────────────────────────────────────────────────
// Simulates submissions received from service pages.
// Replace with API call when backend is ready.

export const DEMO_BOOKINGS: ServiceBooking[] = [
  /* ── Package Booking ─────────────────────────────────────── */
  {
    id: "pkg-1",
    submissionNumber: "THTT-PKG-2026-0001",
    serviceType: "package-booking",
    submittedAt: "2026-09-20T14:30:00",
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: "Oct 12, 2026",
    contact: "+977 9801234567",
    price: "NPR 285,000",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "Bank Transfer",
    receiptNumber: "RCP-2026-PKG-0001",
    paymentDate: "Sep 20, 2026",
    packageName: "Everest Base Camp Trek & Kala Patthar",
    destination: "Khumbu Region, Nepal",
    travelers: 2,
    specialRequests: "Vegetarian meals preferred",
  },
  {
    id: "pkg-2",
    submissionNumber: "THTT-PKG-2026-0002",
    serviceType: "package-booking",
    submittedAt: "2026-09-18T09:15:00",
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: "Dec 5, 2026",
    contact: "+977 9801234567",
    price: "NPR 175,000",
    paymentStatus: "Partial",
    bookingStatus: "Processing",
    paymentMethod: "Online Payment",
    receiptNumber: "RCP-2026-PKG-0002",
    paymentDate: "Sep 18, 2026",
    packageName: "Annapurna Circuit & Thorong La Pass",
    destination: "Annapurna Region, Nepal",
    travelers: 1,
    specialRequests: "",
  },

  /* ── Visa Service ────────────────────────────────────────── */
  {
    id: "visa-1",
    submissionNumber: "THTT-VIS-2026-0001",
    serviceType: "visa-service",
    submittedAt: "2026-09-15T11:00:00",
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: "Oct 10, 2026",
    contact: "+977 9801234567",
    price: "NPR 12,500",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "Online Payment",
    receiptNumber: "RCP-2026-VIS-0001",
    paymentDate: "Sep 15, 2026",
    visaType: "Tourist Visa",
    destinationCountry: "Nepal",
    passportNo: "A1234567",
    returnDate: "Oct 26, 2026",
    additionalNotes: "First time visiting Nepal",
  },

  /* ── Travel Insurance ────────────────────────────────────── */
  {
    id: "ins-1",
    submissionNumber: "THTT-INS-2026-0001",
    serviceType: "travel-insurance",
    submittedAt: "2026-09-19T16:45:00",
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: "Oct 12, 2026",
    contact: "+977 9801234567",
    price: "NPR 8,500",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "Bank Transfer",
    receiptNumber: "RCP-2026-INS-0001",
    paymentDate: "Sep 19, 2026",
    coverageType: "Comprehensive Trek Coverage",
    returnDate: "Oct 26, 2026",
    preExistingConditions: "None",
  },

  /* ── Work Permit ─────────────────────────────────────────── */
  {
    id: "wp-1",
    submissionNumber: "THTT-WP-2026-0001",
    serviceType: "work-permit",
    submittedAt: "2026-09-10T08:30:00",
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: "Oct 1, 2026",
    contact: "+977 9801234567",
    price: "NPR 25,000",
    paymentStatus: "Paid",
    bookingStatus: "Processing",
    paymentMethod: "Bank Transfer",
    receiptNumber: "RCP-2026-WP-0001",
    paymentDate: "Sep 10, 2026",
    employerName: "Himalayan Adventures Pvt. Ltd.",
    jobTitle: "Mountain Guide",
    workStartDate: "Oct 1, 2026",
    passportNo: "A1234567",
  },

  /* ── Vehicle Rental ──────────────────────────────────────── */
  {
    id: "veh-1",
    submissionNumber: "THTT-VEH-2026-0001",
    serviceType: "vehicle-rental",
    submittedAt: "2026-09-21T13:00:00",
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: "Oct 11, 2026",
    contact: "+977 9801234567",
    price: "NPR 15,000",
    paymentStatus: "Pending",
    bookingStatus: "Processing",
    paymentMethod: "Cash on Pickup",
    receiptNumber: "",
    paymentDate: "—",
    vehicleType: "4WD SUV (Toyota Land Cruiser)",
    pickupDate: "Oct 11, 2026",
    pickupLocation: "Tribhuvan International Airport, Kathmandu",
    dropoffLocation: "Lukla Airport",
    returnDate: "Oct 27, 2026",
  },

  /* ── Heli Service ────────────────────────────────────────── */
  {
    id: "heli-1",
    submissionNumber: "THTT-HLI-2026-0001",
    serviceType: "heli-service",
    submittedAt: "2026-09-22T10:00:00",
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: "Oct 12, 2026",
    contact: "+977 9801234567",
    price: "NPR 95,000",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "Bank Transfer",
    receiptNumber: "RCP-2026-HLI-0001",
    paymentDate: "Sep 22, 2026",
    from: "Kathmandu (Tribhuvan Airport)",
    to: "Lukla Airport",
    passengers: 2,
    specialRequirements: "Window seat preferred",
  },

  /* ── Hotel Booking ───────────────────────────────────────── */
  {
    id: "htl-1",
    submissionNumber: "THTT-HTL-2026-0001",
    serviceType: "hotel-booking",
    submittedAt: "2026-09-17T15:20:00",
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: "Oct 11, 2026",
    contact: "+977 9801234567",
    price: "NPR 45,000",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "Online Payment",
    receiptNumber: "RCP-2026-HTL-0001",
    paymentDate: "Sep 17, 2026",
    hotelLocation: "Hotel Yak & Yeti, Kathmandu",
    checkinDate: "Oct 11, 2026",
    checkoutDate: "Oct 27, 2026",
    roomType: "Deluxe Double Room",
    guests: 2,
    specialRequests: "Early check-in if possible",
  },

  /* ── Air Ticket ──────────────────────────────────────────── */
  {
    id: "air-1",
    submissionNumber: "THTT-AIR-2026-0001",
    serviceType: "air-ticket",
    submittedAt: "2026-09-16T12:00:00",
    name: "Aniket Mandal",
    email: "aniket@gmail.com",
    nationality: "Indian",
    travelDate: "Oct 12, 2026",
    contact: "+977 9801234567",
    price: "NPR 35,000",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: "Credit Card",
    receiptNumber: "RCP-2026-AIR-0001",
    paymentDate: "Sep 16, 2026",
    departureDate: "Oct 12, 2026",
    returnDate: "Oct 27, 2026",
    fromCity: "New Delhi (IGI Airport)",
    toCity: "Kathmandu (TIA)",
    travelClass: "Economy",
    travelers: 2,
    mealPreference: "Vegetarian",
  },
];
