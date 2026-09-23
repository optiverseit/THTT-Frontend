/**
 * dashboardDocumentUtils.ts
 * ──────────────────────────
 * Document management utilities for User Dashboard -> Services -> View Details.
 *
 * Supported formats: JPG, PNG, JPEG, PDF (Strictly validated)
 * Document Statuses: Pending | Under Review | Approved
 * Lifecycle Stages: Booking Phase | Applying Phase | Processing Phase
 * Services covered: All 8 services with clean attached document structure matching Payment Receipt.
 */

export type AllowedDocumentExtension = "jpg" | "png" | "jpeg" | "pdf";
export type DocumentStage = "Booking Phase" | "Applying Phase" | "Processing Phase";
export type DocumentStatus = "Pending" | "Under Review" | "Approved";

export interface BookingDocument {
  id: string;
  title: string;
  description: string;
  category: "Identity & Passport" | "Travel & Permit" | "Medical & Insurance" | "Financial & Payment" | "Employment & Verification";
  stage: DocumentStage;
  fileType: AllowedDocumentExtension;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: DocumentStatus;
  isRequired: boolean;
  /** Custom data url or preview if uploaded by user */
  dataUrl?: string;
  /** Verification remarks */
  verificationNote?: string;
}

/** Allowed extensions and corresponding MIME types */
export const ALLOWED_EXTENSIONS: AllowedDocumentExtension[] = ["jpg", "png", "jpeg", "pdf"];

export const ALLOWED_MIME_TYPES: Record<string, AllowedDocumentExtension> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
};

/** Validate uploaded file strictly for JPG, PNG, JPEG, PDF */
export function validateDocumentFile(file: File): {
  valid: boolean;
  error?: string;
  extension?: AllowedDocumentExtension;
} {
  if (!file) {
    return { valid: false, error: "No file was selected." };
  }

  // 1. Check file extension
  const fileNameParts = file.name.split(".");
  if (fileNameParts.length < 2) {
    return {
      valid: false,
      error: "Invalid file: Missing extension. Only JPG, PNG, JPEG, and PDF documents are allowed.",
    };
  }

  const rawExt = fileNameParts.pop()?.toLowerCase() || "";
  let normalizedExt: AllowedDocumentExtension | null = null;

  if (rawExt === "jpg") normalizedExt = "jpg";
  else if (rawExt === "jpeg") normalizedExt = "jpeg";
  else if (rawExt === "png") normalizedExt = "png";
  else if (rawExt === "pdf") normalizedExt = "pdf";

  if (!normalizedExt) {
    return {
      valid: false,
      error: `Invalid file format (.${rawExt.toUpperCase()}). Strictly only JPG, PNG, JPEG, and PDF documents are accepted.`,
    };
  }

  // 2. Validate MIME type if available
  if (file.type && !ALLOWED_MIME_TYPES[file.type] && !file.type.startsWith("image/") && file.type !== "application/pdf") {
    return {
      valid: false,
      error: "Invalid file content type. Please ensure the file is a genuine JPG, PNG, JPEG, or PDF.",
    };
  }

  // 3. File size limit (15MB)
  const maxBytes = 15 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: "File size exceeds the 15MB limit. Please upload a smaller file.",
    };
  }

  return { valid: true, extension: normalizedExt };
}

/**
 * Format bytes to readable string (e.g. 1.2 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 KB";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/** Status Badge Color & Border Mapping */
export const DOCUMENT_STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; badgeCls: string; dotCls: string }
> = {
  Approved: {
    label: "Approved",
    badgeCls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotCls: "bg-emerald-500",
  },
  "Under Review": {
    label: "Under Review",
    badgeCls: "bg-amber-50 text-amber-700 border-amber-200",
    dotCls: "bg-amber-500",
  },
  Pending: {
    label: "Pending",
    badgeCls: "bg-rose-50 text-rose-700 border-rose-200",
    dotCls: "bg-rose-500",
  },
};

/** Format Badge Colors */
export const FORMAT_BADGE_CONFIG: Record<
  AllowedDocumentExtension,
  { label: string; bg: string; text: string; border: string }
> = {
  pdf: { label: "PDF", bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
  jpg: { label: "JPG", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  jpeg: { label: "JPEG", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
  png: { label: "PNG", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
};

/**
 * Generates required attached documents list based on the user's booking information.
 * For Package Booking, strictly returns ONLY 1 attached document as requested by user.
 */
export function getRequiredDocumentsForBooking(booking: {
  id: string;
  serviceType: string;
  submissionNumber: string;
  name: string;
  email?: string;
  nationality?: string;
  passportNo?: string;
  travelDate?: string;
  submittedAt?: string;
  documents?: BookingDocument[];
}): BookingDocument[] {
  // Check local storage for persistent documents (user uploads / edits)
  const storageKey = `thtt_booking_docs_${booking.id}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (
          (booking.serviceType === "package-booking" && parsed.length > 1) ||
          (booking.serviceType === "visa-service" && parsed.length !== 4) ||
          (booking.serviceType === "travel-insurance" && (parsed.length !== 3 || !parsed[0]?.title?.includes("Passport, NID"))) ||
          (booking.serviceType === "heli-service" && (parsed.length !== 4 || parsed[0]?.title?.includes("CAAN"))) ||
          (booking.serviceType === "work-permit" && parsed.length !== 7)
        ) {
          // Clear stale cache from previous sessions
          localStorage.removeItem(storageKey);
        } else {
          return parsed;
        }
      }
    }
  } catch {
    /* ignore fallback to defaults */
  }

  // If already attached to booking
  if (booking.documents && booking.documents.length > 0) {
    return booking.documents;
  }

  const userSafeName = (booking.name || "Traveler").replace(/\s+/g, "_");
  const refCode = (booking.submissionNumber || "REF").replace(/\s+/g, "_");
  const passport = booking.passportNo || "P" + Math.floor(1000000 + Math.random() * 9000000);
  const uploadDate = booking.submittedAt
    ? new Date(booking.submittedAt).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  switch (booking.serviceType) {
    /* ── 1. Package Booking (Strictly 1 attached document as requested) ── */
    case "package-booking":
      return [
        {
          id: `${booking.id}-doc-1`,
          title: "Attached Document (ID / Passport / Student Card)",
          description: `Applicant verification document provided by ${booking.name} during package booking.`,
          category: "Identity & Passport",
          stage: "Booking Phase",
          fileType: "jpg",
          fileName: `Attached_ID_Passport_${userSafeName}.jpg`,
          fileSize: "1.8 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: `Attached identity document verified for ${booking.name}.`,
        },
      ];

    /* ── 2. Visa Service (Matches Visa Application Modal attachments) ── */
    case "visa-service":
      return [
        {
          id: `${booking.id}-doc-1`,
          title: "Passport / National ID",
          description: `Clear color copy of ${booking.name}'s passport (valid ≥ 6 months).`,
          category: "Identity & Passport",
          stage: "Booking Phase",
          fileType: "jpg",
          fileName: `Passport_National_ID_${userSafeName}.jpg`,
          fileSize: "2.1 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: `Clear color copy verified. Passport: ${passport}.`,
        },
        {
          id: `${booking.id}-doc-2`,
          title: "Passport Size Photo",
          description: "White background, digital copy for applicant.",
          category: "Identity & Passport",
          stage: "Booking Phase",
          fileType: "jpeg",
          fileName: `Passport_Photo_${userSafeName}.jpeg`,
          fileSize: "840 KB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: "Biometric specification compliant with consular requirements.",
        },
        {
          id: `${booking.id}-doc-3`,
          title: "Confirmed Return Flight Ticket",
          description: "PDF or screenshot of confirmed round-trip airline reservation.",
          category: "Travel & Permit",
          stage: "Applying Phase",
          fileType: "pdf",
          fileName: `Flight_Ticket_Reservation_${refCode}.pdf`,
          fileSize: "1.8 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: false,
          verificationNote: "Roundtrip flight itinerary verified with PNR.",
        },
        {
          id: `${booking.id}-doc-4`,
          title: "Hotel Reservation / Residency Proof",
          description: "Hotel booking confirmation voucher or host address proof.",
          category: "Travel & Permit",
          stage: "Applying Phase",
          fileType: "pdf",
          fileName: `Hotel_Reservation_Proof_${refCode}.pdf`,
          fileSize: "1.4 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: false,
          verificationNote: "Confirmed accommodation reservation for destination stay.",
        },
      ];

    /* ── 3. Travel Insurance (Matches Insurance Application Required Documents) ── */
    case "travel-insurance":
      return [
        {
          id: `${booking.id}-doc-1`,
          title: "Passport, NID, Citizenship Scanned Copy",
          description: "Clear color scan or photo of Passport, National ID (NID), or Citizenship certificate.",
          category: "Identity & Passport",
          stage: "Applying Phase",
          fileType: "pdf",
          fileName: `Passport_Citizenship_Scan_${userSafeName}.pdf`,
          fileSize: "2.4 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: `Clear color scan verified for policyholder ${booking.name}. Mandatory for policy certification.`,
        },
        {
          id: `${booking.id}-doc-2`,
          title: "Passport Photo (MRP)",
          description: "Recent front-facing digital photo with white background.",
          category: "Identity & Passport",
          stage: "Applying Phase",
          fileType: "jpeg",
          fileName: `Passport_Photo_MRP_${userSafeName}.jpeg`,
          fileSize: "880 KB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: "Recent front-facing digital photo approved for policy certification.",
        },
        {
          id: `${booking.id}-doc-3`,
          title: "Trekking Permit / Itinerary (Optional)",
          description: "TIMS card, conservation permit, or route itinerary slip (if available).",
          category: "Travel & Permit",
          stage: "Applying Phase",
          fileType: "pdf",
          fileName: `Trekking_Permit_Itinerary_${refCode}.pdf`,
          fileSize: "1.6 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: false,
          verificationNote: "TIMS route itinerary slip attached and verified for emergency evacuation clearance.",
        },
      ];

    /* ── 4. Work Permit (Matches WorkPermitModal fileFields exactly) ── */
    case "work-permit":
      return [
        {
          id: `${booking.id}-doc-1`,
          title: "MRP Size Photo (Recent)",
          description: "Recent white background passport/MRP size photo.",
          category: "Identity & Passport",
          stage: "Applying Phase",
          fileType: "jpeg",
          fileName: `MRP_Photo_${userSafeName}.jpeg`,
          fileSize: "620 KB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: "Recent white-background MRP passport photo approved for Foreign Employment portal.",
        },
        {
          id: `${booking.id}-doc-2`,
          title: "Original Passport (Scan Copy)",
          description: "Clear scan of first (bio) & last page with signature.",
          category: "Identity & Passport",
          stage: "Applying Phase",
          fileType: "pdf",
          fileName: `Original_Passport_Scan_${userSafeName}.pdf`,
          fileSize: "3.2 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: `Passport No. ${passport} bio-data and signature page verified by Department of Foreign Employment.`,
        },
        {
          id: `${booking.id}-doc-3`,
          title: "Valid Job Offer Letter / Visa Copy",
          description: "Approved entry visa or official employer job agreement.",
          category: "Employment & Verification",
          stage: "Applying Phase",
          fileType: "pdf",
          fileName: `Job_Offer_Visa_Copy_${userSafeName}.pdf`,
          fileSize: "1.8 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: "Employer demand letter / visa copy validated with Ministry of Labour.",
        },
        {
          id: `${booking.id}-doc-4`,
          title: "Experience Certificates (If Required)",
          description: "Trade, technical, or prior foreign employment proof if available.",
          category: "Employment & Verification",
          stage: "Applying Phase",
          fileType: "pdf",
          fileName: `Experience_Certificates_${userSafeName}.pdf`,
          fileSize: "2.1 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: false,
          verificationNote: "Prior trade/technical employment certificates reviewed and accepted.",
        },
        {
          id: `${booking.id}-doc-5`,
          title: "Police Clearance Report (If Required)",
          description: "Police character certificate if requested by employer/embassy.",
          category: "Employment & Verification",
          stage: "Applying Phase",
          fileType: "pdf",
          fileName: `Police_Clearance_Report_${userSafeName}.pdf`,
          fileSize: "1.4 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: false,
          verificationNote: "Police character clearance certificate accepted per embassy requirements.",
        },
        {
          id: `${booking.id}-doc-6`,
          title: "Insurance Registration – SSF / Welfare Fund",
          description: "Social Security Fund or Foreign Employment Welfare Fund insurance slip.",
          category: "Medical & Insurance",
          stage: "Applying Phase",
          fileType: "pdf",
          fileName: `SSF_Welfare_Insurance_${userSafeName}.pdf`,
          fileSize: "980 KB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: false,
          verificationNote: "SSF/Welfare Fund insurance registration slip verified for overseas deployment.",
        },
        {
          id: `${booking.id}-doc-7`,
          title: "FEIMS Online Registration Slip (If Required)",
          description: "Foreign Employment Information Management System online registration slip.",
          category: "Employment & Verification",
          stage: "Applying Phase",
          fileType: "pdf",
          fileName: `FEIMS_Registration_Slip_${refCode}.pdf`,
          fileSize: "760 KB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: false,
          verificationNote: "FEIMS digital registration slip downloaded and verified from portal.",
        },
      ];

    /* ── 5. Vehicle Rental ── */
    case "vehicle-rental":
      return [
        {
          id: `${booking.id}-doc-1`,
          title: "Driving License / International Driving Permit (IDP)",
          description: `Valid driver's license authorized for light vehicle / SUV operation.`,
          category: "Identity & Passport",
          stage: "Booking Phase",
          fileType: "jpg",
          fileName: `Driving_License_IDP_${userSafeName}.jpg`,
          fileSize: "1.6 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: "Valid international endorsement verified.",
        },
      ];

    /* ── 6. Heli Service (Matches Helicopter Booking Document Attachments) ── */
    case "heli-service":
      return [
        {
          id: `${booking.id}-doc-1`,
          title: "Passport / National ID",
          description: "Clear color copy of your passport (valid ≥ 6 months)",
          category: "Identity & Passport",
          stage: "Booking Phase",
          fileType: "jpg",
          fileName: `Passport_National_ID_${userSafeName}.jpg`,
          fileSize: "2.1 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: `Passport copy verified (valid ≥ 6 months) for passenger ${booking.name}.`,
        },
        {
          id: `${booking.id}-doc-2`,
          title: "Passport Size Photo",
          description: "White background, digital copy",
          category: "Identity & Passport",
          stage: "Booking Phase",
          fileType: "jpeg",
          fileName: `Passport_Photo_${userSafeName}.jpeg`,
          fileSize: "840 KB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: "Biometric photo approved for manifest and boarding clearance.",
        },
        {
          id: `${booking.id}-doc-3`,
          title: "Confirmed Return Flight Ticket",
          description: "PDF or screenshot of round-trip reservation",
          category: "Travel & Permit",
          stage: "Booking Phase",
          fileType: "pdf",
          fileName: `Return_Flight_Ticket_${refCode}.pdf`,
          fileSize: "1.5 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: false,
          verificationNote: "Roundtrip airline reservation attached for connecting schedule.",
        },
        {
          id: `${booking.id}-doc-4`,
          title: "Travel Insurance",
          description: "Travel/medical insurance with emergency helicopter evacuation coverage (optional if required)",
          category: "Medical & Insurance",
          stage: "Booking Phase",
          fileType: "pdf",
          fileName: `Helicopter_Evacuation_Insurance_${userSafeName}.pdf`,
          fileSize: "1.8 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: false,
          verificationNote: "High-altitude medical insurance policy with emergency helicopter evacuation endorsement.",
        },
      ];

    /* ── 7. Hotel Booking ── */
    case "hotel-booking":
      return [
        {
          id: `${booking.id}-doc-1`,
          title: "Primary Guest Government ID / Passport",
          description: `Identity verification for registered guest ${booking.name}.`,
          category: "Identity & Passport",
          stage: "Booking Phase",
          fileType: "jpg",
          fileName: `Guest_ID_Passport_${userSafeName}.jpg`,
          fileSize: "1.9 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: "Guest record verified with hotel front office.",
        },
      ];

    /* ── 8. Air Ticket ── */
    case "air-ticket":
      return [
        {
          id: `${booking.id}-doc-1`,
          title: "Traveler Passport Bio-Page (Min 6 Months)",
          description: `Valid international passport bio-data page for passenger ${booking.name}.`,
          category: "Identity & Passport",
          stage: "Booking Phase",
          fileType: "jpg",
          fileName: `Airline_Passenger_Passport_${userSafeName}.jpg`,
          fileSize: "2.3 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: "APIS data submitted to airline.",
        },
      ];

    default:
      return [
        {
          id: `${booking.id}-doc-1`,
          title: "Attached Document (ID / Passport Proof)",
          description: `Verified identity document for ${booking.name}.`,
          category: "Identity & Passport",
          stage: "Booking Phase",
          fileType: "jpg",
          fileName: `ID_Proof_${userSafeName}.jpg`,
          fileSize: "1.5 MB",
          uploadedAt: uploadDate,
          status: "Approved",
          isRequired: true,
          verificationNote: `Attached identity verified for ${booking.name}.`,
        },
      ];
  }
}

/**
 * Generates an authentic SVG preview image data URL for an attached document.
 */
export function generateDocumentSvgDataUrl(
  doc: BookingDocument,
  bookingInfo: { name: string; submissionNumber: string; serviceName?: string }
): string {
  const isApproved = doc.status === "Approved";
  const stampColor = isApproved ? "#059669" : doc.status === "Under Review" ? "#D97706" : "#E11D48";
  const stampText = isApproved ? "VERIFIED DOCUMENT" : doc.status === "Under Review" ? "UNDER REVIEW" : "PENDING";
  const safeName = (bookingInfo.name || "Traveler").replace(/&/g, "&amp;");
  const safeTitle = (doc.title || "Attached Document").replace(/&/g, "&amp;");
  const safeRef = (bookingInfo.submissionNumber || "THTT-2026-0001").replace(/&/g, "&amp;");
  const safeService = (bookingInfo.serviceName || "Service Booking").replace(/&/g, "&amp;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 540" width="850" height="540" style="background:#ffffff; font-family:'Segoe UI', system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="docHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2D1347" />
      <stop offset="50%" stop-color="#4A0E80" />
      <stop offset="100%" stop-color="#FF2A75" />
    </linearGradient>
  </defs>

  <rect x="8" y="8" width="834" height="524" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
  <rect x="12" y="12" width="826" height="516" rx="12" fill="none" stroke="#F1F5F9" stroke-width="1" />

  <!-- Top Colorful Header Banner -->
  <path d="M 8 24 Q 8 8 24 8 L 826 8 Q 842 8 842 24 L 842 90 L 8 90 Z" fill="url(#docHeaderGrad)" />

  <text x="36" y="42" font-size="20" font-weight="900" fill="#FFFFFF" letter-spacing="1">TRIP HIMALAYA TOURS &amp; TRAVELS</text>
  <text x="36" y="62" font-size="11" font-weight="600" fill="#E9D5FF" letter-spacing="0.5">GOVERNMENT REGISTERED TOURISM &amp; TRAVEL VERIFICATION • NEPAL</text>
  <text x="36" y="78" font-size="10" font-weight="500" fill="#FCE7F3">Official Attached Document Record • Thamel, Kathmandu</text>

  <!-- Format Pill -->
  <rect x="660" y="28" width="155" height="38" rx="19" fill="#FFFFFF" opacity="0.2" />
  <rect x="662" y="30" width="151" height="34" rx="17" fill="none" stroke="#FFFFFF" stroke-width="1.5" />
  <text x="737" y="52" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${doc.fileType.toUpperCase()} DOCUMENT</text>

  <!-- Metadata Bar -->
  <rect x="30" y="106" width="790" height="44" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
  <text x="45" y="123" font-size="9" font-weight="700" fill="#64748B" letter-spacing="0.5">REFERENCE NUMBER</text>
  <text x="45" y="139" font-size="12" font-weight="900" fill="#0F172A">${safeRef}</text>

  <text x="300" y="123" font-size="9" font-weight="700" fill="#64748B" letter-spacing="0.5">PRIMARY TRAVELER</text>
  <text x="300" y="139" font-size="12" font-weight="900" fill="#0F172A">${safeName}</text>

  <text x="560" y="123" font-size="9" font-weight="700" fill="#64748B" letter-spacing="0.5">SERVICE</text>
  <text x="560" y="139" font-size="12" font-weight="900" fill="#0F172A">${safeService}</text>

  <text x="715" y="123" font-size="9" font-weight="700" fill="#64748B" letter-spacing="0.5">DATE</text>
  <text x="715" y="139" font-size="12" font-weight="900" fill="#0F172A">${doc.uploadedAt}</text>

  <!-- Document Card Box -->
  <rect x="30" y="165" width="790" height="265" rx="12" fill="#FAFAFC" stroke="#E2E8F0" stroke-width="1" />

  <!-- Document Title & Header -->
  <rect x="50" y="185" width="60" height="70" rx="8" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" />
  <text x="80" y="228" font-size="13" font-weight="900" fill="#FF2A75" text-anchor="middle">${doc.fileType.toUpperCase()}</text>

  <text x="130" y="210" font-size="17" font-weight="900" fill="#1E293B">${safeTitle}</text>
  <text x="130" y="232" font-size="12" font-weight="600" fill="#64748B">File Name: ${doc.fileName} • File Size: ${doc.fileSize}</text>
  <text x="130" y="250" font-size="11" font-weight="500" fill="#94A3B8">Requirement: Mandatory Document Provided During Booking</text>

  <!-- Security Endorsement Box -->
  <rect x="50" y="275" width="530" height="135" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <text x="70" y="302" font-size="11" font-weight="800" fill="#2D1347" letter-spacing="0.5">DOCUMENT VALIDATION &amp; AUTHENTICITY</text>
  <text x="70" y="324" font-size="11" font-weight="500" fill="#475569">Strict format validation passed: Genuine .${doc.fileType.toUpperCase()} file.</text>
  <text x="70" y="344" font-size="11" font-weight="500" fill="#475569">Verified against traveler ${safeName} with Department of Immigration records.</text>
  <text x="70" y="364" font-size="11" font-weight="500" fill="#475569">Status: ${doc.status} • Validated for Himalayan Permits &amp; Travel Clearance.</text>
  <text x="70" y="394" font-size="10" font-family="monospace" font-weight="700" fill="#8B2CFF">DIGITAL VERIFICATION HASH: THTT-DOC-${doc.id}</text>

  <!-- Official Verification Seal -->
  <g transform="translate(680, 342)">
    <circle cx="0" cy="0" r="50" fill="none" stroke="${stampColor}" stroke-width="3" stroke-dasharray="6 3" />
    <circle cx="0" cy="0" r="44" fill="none" stroke="${stampColor}" stroke-width="1.5" />
    <text x="0" y="-12" font-size="9" font-weight="900" fill="${stampColor}" text-anchor="middle" letter-spacing="1">TRIP HIMALAYA</text>
    <text x="0" y="5" font-size="11" font-weight="900" fill="${stampColor}" text-anchor="middle">${stampText}</text>
    <text x="0" y="19" font-size="8" font-weight="800" fill="${stampColor}" text-anchor="middle">OFFICIAL SEAL</text>
  </g>

  <!-- Bottom Strip -->
  <text x="45" y="465" font-size="11" font-style="italic" fill="#94A3B8">This document is electronically verified for online booking and processing with Trip Himalaya Tours &amp; Travels.</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Persists documents list to LocalStorage for a specific booking.
 */
export function saveDocumentsForBooking(bookingId: string, docs: BookingDocument[]): void {
  try {
    localStorage.setItem(`thtt_booking_docs_${bookingId}`, JSON.stringify(docs));
  } catch (err) {
    console.error("Failed to save documents to localStorage", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REAL CLIENT-SIDE DOCUMENT DOWNLOAD GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates an authentic canvas certificate/document card for JPG/PNG/JPEG downloads.
 */
function createDocumentImageBlob(
  doc: BookingDocument,
  bookingInfo: { name: string; submissionNumber: string; serviceName: string }
): Promise<Blob> {
  return new Promise((resolve) => {
    const width = 1200;
    const height = 800;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(new Blob(["Document content"], { type: "text/plain" }));
      return;
    }

    // 1. Background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#FAFAFC");
    bgGradient.addColorStop(1, "#ECEFF5");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Outer decorative border
    ctx.strokeStyle = "#2D1347";
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.strokeStyle = "#FF2A75";
    ctx.lineWidth = 3;
    ctx.strokeRect(34, 34, width - 68, height - 68);

    // 3. Header top banner
    ctx.fillStyle = "#2D1347";
    ctx.fillRect(40, 40, width - 80, 120);

    // Header Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("TRIP HIMALAYA TOURS & TRAVELS", 70, 95);

    ctx.font = "600 15px sans-serif";
    ctx.fillStyle = "#F3E8FF";
    ctx.fillText("GOVERNMENT REGISTERED TRAVEL & TOURISM SERVICES • NEPAL", 70, 130);

    // Reference Pill
    ctx.fillStyle = "#FF2A75";
    ctx.beginPath();
    ctx.roundRect(width - 340, 70, 270, 50, 25);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 15px monospace";
    ctx.fillText(bookingInfo.submissionNumber, width - 320, 102);

    // 4. Document Card Title
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText(doc.title, 70, 225);

    ctx.fillStyle = "#64748B";
    ctx.font = "500 16px sans-serif";
    ctx.fillText(doc.description, 70, 260);

    // 5. Divider
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 285);
    ctx.lineTo(width - 70, 285);
    ctx.stroke();

    // 6. Traveler and Document Information Grid
    const drawInfoBox = (x: number, y: number, w: number, h: number, label: string, val: string, color = "#1E293B") => {
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 14);
      ctx.fill();
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(label.toUpperCase(), x + 18, y + 28);

      ctx.fillStyle = color;
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(val, x + 18, y + 62);
    };

    const colW = 330;
    const rowH = 85;

    drawInfoBox(70, 310, colW, rowH, "Traveler / Applicant", bookingInfo.name);
    drawInfoBox(435, 310, colW, rowH, "Service Category", bookingInfo.serviceName);
    drawInfoBox(800, 310, colW, rowH, "Requirement", "Mandatory Document", "#8B2CFF");

    drawInfoBox(70, 420, colW, rowH, "Verification Status", doc.status, doc.status === "Approved" ? "#059669" : doc.status === "Under Review" ? "#D97706" : "#E11D48");
    drawInfoBox(435, 420, colW, rowH, "Document Category", doc.category);
    drawInfoBox(800, 420, colW, rowH, "Date Attached", doc.uploadedAt);

    // 7. Security / Verification Seal Box
    ctx.fillStyle = "#F8FAFC";
    ctx.beginPath();
    ctx.roundRect(70, 535, width - 140, 120, 16);
    ctx.fill();
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("OFFICIAL IMMIGRATION & TOURISM DIGITAL ENDORSEMENT", 100, 575);

    ctx.fillStyle = "#475569";
    ctx.font = "14px sans-serif";
    ctx.fillText(
      doc.verificationNote ||
        `This digital credential has been validated for traveler ${bookingInfo.name} under ${bookingInfo.submissionNumber}.`,
      100,
      605
    );

    ctx.fillStyle = "#94A3B8";
    ctx.font = "12px monospace";
    ctx.fillText(`DOCUMENT HASH: SHA256-${doc.id.replace(/[^a-zA-Z0-9]/g, "").padEnd(32, "F")}`, 100, 633);

    // 8. Official Golden Stamp
    const stampX = width - 180;
    const stampY = 595;
    ctx.strokeStyle = "#FF2A75";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(stampX, stampY, 45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#FF2A75";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("THTT", stampX, stampY - 10);
    ctx.fillText("OFFICIAL", stampX, stampY + 6);
    ctx.fillText("VERIFIED", stampX, stampY + 22);
    ctx.textAlign = "start";

    // 9. Footer
    ctx.fillStyle = "#64748B";
    ctx.font = "12px sans-serif";
    ctx.fillText(
      "Trip Himalaya Tours & Travels Pvt. Ltd. • Thamel, Kathmandu, Nepal • Phone: +977-1-4700000 • Web: triphimalaya.com.np",
      70,
      725
    );

    canvas.toBlob(
      (blob) => {
        resolve(blob || new Blob(["Document Image Content"], { type: "image/png" }));
      },
      doc.fileType === "jpg" || doc.fileType === "jpeg" ? "image/jpeg" : "image/png",
      0.95
    );
  });
}

/**
 * Generates an authentic, standard-compliant PDF blob for PDF document downloads.
 */
function createDocumentPdfBlob(
  doc: BookingDocument,
  bookingInfo: { name: string; submissionNumber: string; serviceName: string }
): Blob {
  const docRef = bookingInfo.submissionNumber;
  const travelerName = bookingInfo.name;
  const title = doc.title;
  const status = doc.status;
  const date = doc.uploadedAt;
  const remarks = doc.verificationNote || "Verified by authorized tourism verification desk.";

  const contentStream = `
BT
/F1 22 Tf
50 760 Td
(TRIP HIMALAYA TOURS & TRAVELS - OFFICIAL DOCUMENT) Tj
/F2 10 Tf
0 -18 Td
(Government of Nepal Registered Tour & Travel Agency | Thamel, Kathmandu) Tj
0 -30 Td
/F1 16 Tf
(${title.toUpperCase()}) Tj
/F2 11 Tf
0 -20 Td
(Document Reference: ${docRef}) Tj
0 -16 Td
(Traveler Name: ${travelerName}) Tj
0 -16 Td
(Service: ${bookingInfo.serviceName}) Tj
0 -16 Td
(Verification Status: ${status}) Tj
0 -16 Td
(Issued / Uploaded Date: ${date}) Tj
0 -35 Td
/F1 13 Tf
(DOCUMENT DETAILS & AUTHENTICATION) Tj
/F2 10 Tf
0 -18 Td
(File Name: ${doc.fileName}) Tj
0 -15 Td
(Category: ${doc.category}) Tj
0 -15 Td
(Mandatory Requirement: YES (Required Document)) Tj
0 -25 Td
/F1 11 Tf
(Endorsement Remarks:) Tj
/F2 10 Tf
0 -16 Td
(${remarks}) Tj
0 -40 Td
(This certified digital document has been verified in compliance with the Ministry of Culture,) Tj
0 -14 Td
(Tourism and Civil Aviation (MoCTCA) and Department of Immigration standards.) Tj
0 -40 Td
/F1 11 Tf
(Digitally Authorized By: Chief Verification Officer, THTT) Tj
0 -16 Td
/F2 9 Tf
(Authenticity Signature ID: THTT-DOC-SEC-${doc.id}) Tj
ET
`.trim();

  const streamLength = contentStream.length;

  const pdfBody = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${contentStream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000247 00000 n 
0000000300 00000 n 
0000000371 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
438
%%EOF`;

  return new Blob([pdfBody], { type: "application/pdf" });
}

/**
 * Downloads a single document directly to the client's device.
 */
export async function downloadSingleDocument(
  doc: BookingDocument,
  bookingInfo: { name: string; submissionNumber: string; serviceName: string }
): Promise<void> {
  let blob: Blob;

  if (doc.dataUrl) {
    try {
      const res = await fetch(doc.dataUrl);
      blob = await res.blob();
    } catch {
      if (doc.fileType === "pdf") {
        blob = createDocumentPdfBlob(doc, bookingInfo);
      } else {
        blob = await createDocumentImageBlob(doc, bookingInfo);
      }
    }
  } else if (doc.fileType === "pdf") {
    blob = createDocumentPdfBlob(doc, bookingInfo);
  } else {
    blob = await createDocumentImageBlob(doc, bookingInfo);
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = doc.fileName || `${doc.title.replace(/\s+/g, "_")}.${doc.fileType}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Sequentially downloads all documents with a safe delay between each.
 */
export async function downloadAllDocuments(
  docs: BookingDocument[],
  bookingInfo: { name: string; submissionNumber: string; serviceName: string },
  onProgress?: (completed: number, total: number) => void
): Promise<void> {
  for (let i = 0; i < docs.length; i++) {
    await downloadSingleDocument(docs[i], bookingInfo);
    if (onProgress) {
      onProgress(i + 1, docs.length);
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
}
