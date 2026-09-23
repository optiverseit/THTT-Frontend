/**
 * receiptDownloader.ts
 * ─────────────────────
 * Robust digital receipt generator and downloader for Trip Himalaya Tours & Travels.
 *
 * Solves:
 * 1. Cross-origin <a download> restrictions (browsers ignore download on external URLs).
 * 2. CORS errors when fetching external preview images by falling back to Canvas & SVG rendering.
 * 3. Provides crisp, high-resolution PNG receipt downloads for both ServiceBookings and PaymentTransactions.
 */

import { ServiceBooking } from "../components/dashboard/DashboardBookingTypes";

export interface PaymentTransaction {
  id: string;
  invoiceId: string;
  date: string;
  description: string;
  method: string;
  amount: string;
  status: "Verified" | "Processing" | "Refunded";
}

export interface ReceiptData {
  receiptNumber: string;
  submissionNumber: string;
  date: string;
  customerName: string;
  customerEmail?: string;
  customerContact?: string;
  serviceTitle: string;
  destinationOrDetails?: string;
  numberOfDays?: number;
  paymentMethod: string;
  totalAmount: string;
  paymentStatus: "Paid" | "Partial" | "Pending" | "Verified";
}

/**
 * Generates an authentic SVG receipt image string.
 */
export function generateReceiptSvg(data: ReceiptData): string {
  const isPaid = data.paymentStatus === "Paid" || data.paymentStatus === "Verified";
  const stampColor = isPaid ? "#059669" : "#d97706";
  const stampText = isPaid ? "PAID IN FULL" : "PARTIAL PAYMENT";

  const safeXml = (str?: string | number) =>
    String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 560" width="850" height="560" style="background:#ffffff; font-family:'Segoe UI', system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4A0E80" />
      <stop offset="50%" stop-color="#8B2CFF" />
      <stop offset="100%" stop-color="#FF2A75" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#FBBF24" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Background border & card -->
  <rect x="8" y="8" width="834" height="544" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
  <rect x="12" y="12" width="826" height="536" rx="12" fill="none" stroke="#F1F5F9" stroke-width="1" />

  <!-- Top Colorful Header Banner -->
  <path d="M 8 24 Q 8 8 24 8 L 826 8 Q 842 8 842 24 L 842 96 L 8 96 Z" fill="url(#headerGrad)" />

  <!-- Mountain icon / decorative emblem -->
  <g transform="translate(32, 24)" fill="#FFFFFF">
    <path d="M 0 50 L 25 10 L 40 32 L 60 4 L 85 50 Z" opacity="0.9" fill="#FFFFFF" />
    <path d="M 25 10 L 32 20 L 20 22 Z" fill="#FFD700" />
    <path d="M 60 4 L 68 18 L 54 18 Z" fill="#FFD700" />
  </g>

  <!-- Brand Title -->
  <text x="130" y="42" font-size="20" font-weight="900" fill="#FFFFFF" letter-spacing="1">TRIP HIMALAYA TOURS &amp; TRAVELS</text>
  <text x="130" y="60" font-size="11" font-weight="600" fill="#E9D5FF" letter-spacing="0.5">Govt Reg. No: 148920/073 | PAN: 604291823 | Thamel, Kathmandu, Nepal</text>
  <text x="130" y="77" font-size="10" font-weight="500" fill="#FCE7F3">Tel: +977-1-4701234 | Email: info@triphimalaya.com | Web: www.triphimalaya.com</text>

  <!-- Receipt Type Pill -->
  <rect x="620" y="28" width="195" height="42" rx="21" fill="#FFFFFF" opacity="0.18" />
  <rect x="622" y="30" width="191" height="38" rx="19" fill="none" stroke="#FFFFFF" stroke-width="1.5" />
  <text x="717" y="48" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">OFFICIAL RECEIPT</text>
  <text x="717" y="61" font-size="9" font-weight="600" fill="#FFD700" text-anchor="middle">DIGITAL PAYMENT SLIP</text>

  <!-- Section 1: Metadata Bar -->
  <rect x="30" y="112" width="790" height="44" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
  <text x="45" y="130" font-size="10" font-weight="700" fill="#64748B" letter-spacing="0.5">RECEIPT NUMBER</text>
  <text x="45" y="146" font-size="13" font-weight="900" fill="#0F172A">${safeXml(data.receiptNumber || "RCP-2026-0001")}</text>

  <text x="250" y="130" font-size="10" font-weight="700" fill="#64748B" letter-spacing="0.5">BOOKING REFERENCE</text>
  <text x="250" y="146" font-size="13" font-weight="900" fill="#000000">${safeXml(data.submissionNumber)}</text>

  <text x="480" y="130" font-size="10" font-weight="700" fill="#64748B" letter-spacing="0.5">ISSUE DATE</text>
  <text x="480" y="146" font-size="12" font-weight="800" fill="#0F172A">${safeXml(data.date)}</text>

  <text x="660" y="130" font-size="10" font-weight="700" fill="#64748B" letter-spacing="0.5">PAYMENT METHOD</text>
  <text x="660" y="146" font-size="12" font-weight="800" fill="#8B2CFF">${safeXml(data.paymentMethod || "eSewa")}</text>

  <!-- Section 2: Traveler & Service Details Grid -->
  <!-- Left Box: Traveler Info -->
  <rect x="30" y="170" width="385" height="150" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <rect x="30" y="170" width="385" height="30" rx="10" fill="#F1F5F9" />
  <text x="45" y="190" font-size="11" font-weight="800" fill="#334155" letter-spacing="0.5">BILLED TO (TRAVELER DETAILS)</text>

  <text x="45" y="222" font-size="10" font-weight="700" fill="#64748B">NAME:</text>
  <text x="120" y="222" font-size="12" font-weight="800" fill="#0F172A">${safeXml(data.customerName)}</text>

  <text x="45" y="250" font-size="10" font-weight="700" fill="#64748B">EMAIL:</text>
  <text x="120" y="250" font-size="11" font-weight="600" fill="#0F172A">${safeXml(data.customerEmail || "N/A")}</text>

  <text x="45" y="278" font-size="10" font-weight="700" fill="#64748B">CONTACT:</text>
  <text x="120" y="278" font-size="11" font-weight="600" fill="#0F172A">${safeXml(data.customerContact || "N/A")}</text>

  <text x="45" y="306" font-size="10" font-weight="700" fill="#64748B">STATUS:</text>
  <text x="120" y="306" font-size="11" font-weight="800" fill="${stampColor}">${safeXml(data.paymentStatus)}</text>

  <!-- Right Box: Booking & Service Details -->
  <rect x="435" y="170" width="385" height="150" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  <rect x="435" y="170" width="385" height="30" rx="10" fill="#F1F5F9" />
  <text x="450" y="190" font-size="11" font-weight="800" fill="#334155" letter-spacing="0.5">SERVICE DETAILS</text>

  <text x="450" y="222" font-size="10" font-weight="700" fill="#64748B">SERVICE:</text>
  <text x="540" y="222" font-size="12" font-weight="800" fill="#0F172A">${safeXml(data.serviceTitle)}</text>

  <text x="450" y="250" font-size="10" font-weight="700" fill="#64748B">DESTINATION:</text>
  <text x="540" y="250" font-size="11" font-weight="600" fill="#0F172A">${safeXml(data.destinationOrDetails || "Standard Service")}</text>

  <text x="450" y="278" font-size="10" font-weight="700" fill="#64748B">DURATION:</text>
  <text x="540" y="278" font-size="11" font-weight="800" fill="#8B2CFF">${data.numberOfDays ? `${safeXml(data.numberOfDays)} Days` : "—"}</text>

  <text x="450" y="306" font-size="10" font-weight="700" fill="#64748B">VERIFIED BY:</text>
  <text x="540" y="306" font-size="11" font-weight="600" fill="#0F172A">THTT Accounts Dept.</text>

  <!-- Section 3: Amount Table -->
  <rect x="30" y="336" width="790" height="88" rx="10" fill="#FAFAFA" stroke="#E2E8F0" stroke-width="1" />
  <rect x="30" y="336" width="790" height="28" rx="10" fill="#0F172A" />
  <text x="50" y="354" font-size="10" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">DESCRIPTION</text>
  <text x="480" y="354" font-size="10" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">METHOD</text>
  <text x="680" y="354" font-size="10" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">AMOUNT PAID</text>

  <text x="50" y="385" font-size="12" font-weight="800" fill="#1E293B">${safeXml(data.serviceTitle)} Confirmation &amp; Processing</text>
  <text x="50" y="405" font-size="10" font-weight="500" fill="#64748B">Official digital receipt verified by administration</text>

  <text x="480" y="390" font-size="12" font-weight="700" fill="#64748B">${safeXml(data.paymentMethod || "eSewa")}</text>

  <text x="680" y="392" font-size="16" font-weight="900" fill="#0F172A">${safeXml(data.totalAmount)}</text>

  <!-- Circular Rubber Stamp -->
  <g transform="translate(330, 420) rotate(-10)">
    <circle cx="60" cy="40" r="42" fill="none" stroke="${stampColor}" stroke-width="2.5" stroke-dasharray="3,1" opacity="0.85" />
    <circle cx="60" cy="40" r="37" fill="none" stroke="${stampColor}" stroke-width="1" opacity="0.85" />
    <path id="stampArc" d="M 28,40 A 32,32 0 0,1 92,40" fill="none" />
    <text font-size="6.5" font-weight="900" fill="${stampColor}" letter-spacing="1.2">
      <textPath href="#stampArc" startOffset="50%" text-anchor="middle">TRIP HIMALAYA TOURS</textPath>
    </text>
    <text x="60" y="43" font-size="9" font-weight="900" fill="${stampColor}" text-anchor="middle" letter-spacing="0.5">${stampText}</text>
    <text x="60" y="55" font-size="6.5" font-weight="800" fill="${stampColor}" text-anchor="middle">OFFICIAL STAMP</text>
  </g>

  <!-- Signature & Footer -->
  <line x1="620" y1="480" x2="790" y2="480" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="4,2" />
  <text x="705" y="498" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle">Authorized Signature</text>
  <text x="705" y="512" font-size="8.5" font-weight="600" fill="#94A3B8" text-anchor="middle">Trip Himalaya Tours &amp; Travels</text>

  <!-- Barcode decoration on bottom left -->
  <g transform="translate(30, 455)" fill="#334155">
    <rect x="0" y="0" width="3" height="35" />
    <rect x="5" y="0" width="1" height="35" />
    <rect x="8" y="0" width="4" height="35" />
    <rect x="14" y="0" width="2" height="35" />
    <rect x="18" y="0" width="1" height="35" />
    <rect x="22" y="0" width="3" height="35" />
    <rect x="27" y="0" width="5" height="35" />
    <rect x="34" y="0" width="2" height="35" />
    <rect x="38" y="0" width="1" height="35" />
    <rect x="42" y="0" width="4" height="35" />
    <rect x="48" y="0" width="2" height="35" />
    <rect x="52" y="0" width="3" height="35" />
    <rect x="57" y="0" width="1" height="35" />
    <rect x="60" y="0" width="4" height="35" />
    <rect x="66" y="0" width="2" height="35" />
    <rect x="70" y="0" width="3" height="35" />
    <rect x="75" y="0" width="1" height="35" />
    <rect x="78" y="0" width="4" height="35" />
    <text x="0" y="47" font-size="7.5" font-family="monospace" fill="#64748B">${safeXml(data.receiptNumber || data.submissionNumber)}</text>
  </g>

  <!-- Bottom legal note -->
  <text x="425" y="540" font-size="8.5" font-weight="500" fill="#94A3B8" text-anchor="middle">
    This is a computer-generated digital receipt and requires no physical seal. Trip Himalaya Tours &amp; Travels Pvt. Ltd.
  </text>
</svg>`;
}

/**
 * Returns a Data URL for an SVG receipt.
 */
export function generateReceiptSvgDataUrl(data: ReceiptData): string {
  const svg = generateReceiptSvg(data);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Helper to extract ReceiptData from a ServiceBooking.
 */
export function bookingToReceiptData(booking: ServiceBooking): ReceiptData {
  return {
    receiptNumber: booking.receiptNumber || `RCP-2026-${booking.id.toUpperCase()}`,
    submissionNumber: booking.submissionNumber,
    date: booking.paymentDate || new Date(booking.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    customerName: booking.name,
    customerEmail: booking.email,
    customerContact: booking.contact,
    serviceTitle: booking.packageName || booking.visaType || booking.serviceType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    destinationOrDetails: booking.destination || booking.destinationCountry || booking.specialRequests || undefined,
    numberOfDays: booking.numberOfDays,
    paymentMethod: booking.paymentMethod || "eSewa",
    totalAmount: booking.price,
    paymentStatus: booking.paymentStatus,
  };
}

/**
 * Helper to extract ReceiptData from a PaymentTransaction.
 */
export function transactionToReceiptData(tx: PaymentTransaction): ReceiptData {
  return {
    receiptNumber: `RCP-2026-${tx.invoiceId.replace(/^INV-/, "")}`,
    submissionNumber: tx.invoiceId,
    date: tx.date,
    customerName: "Valued Traveler",
    serviceTitle: tx.description,
    paymentMethod: tx.method,
    totalAmount: tx.amount,
    paymentStatus: tx.status === "Verified" ? "Verified" : "Paid",
  };
}

/**
 * Converts an SVG string into a high-res PNG Blob via HTML5 Canvas.
 */
export function svgToPngBlob(svgString: string, width = 1700, height = 1120): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return reject(new Error("Canvas 2D context not available"));
    }

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas toBlob returned null"));
        }
      }, "image/png");
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };

    img.src = url;
  });
}

/**
 * Directly initiates browser download for a Blob.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

/**
 * Universal Receipt Downloader
 * ─────────────────────────────
 * 1. If fallbackReceiptData is provided and no imageUrl or image fetch fails -> generates crisp branded PNG.
 * 2. If imageUrl is a data URL or blob -> downloads directly.
 * 3. If imageUrl is cross-origin -> tries fetch(cors); on failure, loads into Image/Canvas or falls back to SVG.
 */
export async function downloadReceiptImage(
  imageUrl?: string,
  fileName = "receipt.png",
  fallbackReceiptData?: ReceiptData
): Promise<boolean> {
  // If we have explicit receipt data and imageUrl is either missing or an external placeholder
  const isPlaceholder = !imageUrl || imageUrl.includes("placehold.co") || imageUrl.startsWith("data:image/svg+xml");

  if (fallbackReceiptData && isPlaceholder) {
    try {
      const svg = generateReceiptSvg(fallbackReceiptData);
      const pngBlob = await svgToPngBlob(svg);
      const safeName = fileName.endsWith(".png") ? fileName : `${fileName.replace(/\.[^/.]+$/, "")}.png`;
      triggerBlobDownload(pngBlob, safeName);
      return true;
    } catch (err) {
      console.warn("SVG to PNG conversion fallback triggered:", err);
    }
  }

  // If a valid image URL is given:
  if (imageUrl) {
    // 1. Data URL
    if (imageUrl.startsWith("data:")) {
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        triggerBlobDownload(blob, fileName);
        return true;
      } catch (err) {
        console.warn("Direct data-url fetch error:", err);
      }
    }

    // 2. Fetch as blob (same origin or permissive CORS)
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      if (response.ok) {
        const blob = await response.blob();
        triggerBlobDownload(blob, fileName);
        return true;
      }
    } catch {
      // CORS or network failure; continue to fallback
    }

    // 3. Image object with crossOrigin
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = imageUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 850;
      canvas.height = img.naturalHeight || 560;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
        if (blob) {
          triggerBlobDownload(blob, fileName);
          return true;
        }
      }
    } catch {
      // Image canvas failed (e.g. tainted canvas)
    }
  }

  // 4. Ultimate fallback: if fallbackReceiptData is available, generate official PNG
  if (fallbackReceiptData) {
    try {
      const svg = generateReceiptSvg(fallbackReceiptData);
      const pngBlob = await svgToPngBlob(svg);
      triggerBlobDownload(pngBlob, fileName);
      return true;
    } catch (err) {
      console.error("Failed to generate fallback receipt image:", err);
    }
  }

  // As a last-ditch effort, open image in new window
  if (imageUrl) {
    window.open(imageUrl, "_blank");
    return true;
  }

  return false;
}
