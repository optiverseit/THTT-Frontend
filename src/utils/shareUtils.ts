/**
 * shareUtils.ts
 * Reliable social media link sharing helpers for Facebook, WhatsApp, Twitter/X,
 * LinkedIn, Telegram, Email, and Native Web Share API.
 */

import { getEnv } from "../config/env";

export const PRODUCTION_DOMAIN =
  getEnv("VITE_SITE_URL") || "https://triphimalaya.com.np";

/**
 * Returns a valid public URL suitable for external crawlers (Facebook, LinkedIn, Twitter scraper).
 * If running on localhost or private IP, resolves against PRODUCTION_DOMAIN so that
 * Facebook and LinkedIn do not return "Cannot reach localhost" crawl errors.
 */
export function getCrawlerSafeUrl(customUrl?: string): string {
  if (typeof window === "undefined") return PRODUCTION_DOMAIN;

  const rawUrl = customUrl || window.location.href;

  try {
    const parsed = new URL(rawUrl);
    if (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname.startsWith("192.168.") ||
      parsed.hostname.startsWith("10.") ||
      parsed.hostname.endsWith(".local")
    ) {
      // Map local path + search to production domain
      return `${PRODUCTION_DOMAIN}${parsed.pathname}${parsed.search}`;
    }
    return rawUrl;
  } catch {
    return rawUrl;
  }
}

/**
 * Returns the current live browser URL (e.g. for copying or direct chat apps like WhatsApp).
 */
export function getCurrentUrl(): string {
  if (typeof window === "undefined") return PRODUCTION_DOMAIN;
  return window.location.href;
}

/**
 * Opens a centered popup window for social sharing dialogs.
 */
export function openSharePopup(url: string, title = "Share", width = 620, height = 540): Window | null {
  if (typeof window === "undefined") return null;

  const left = Math.max(0, (window.innerWidth - width) / 2 + window.screenX);
  const top = Math.max(0, (window.innerHeight - height) / 2 + window.screenY);

  return window.open(
    url,
    title,
    `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`
  );
}

export interface ShareData {
  title: string;
  text?: string;
  url?: string;
  image?: string;
}

/**
 * Builds an enriched social share URL using the server-side share bridge (share.php)
 * that provides explicit Open Graph and Twitter Card tags to crawlers for Facebook,
 * Messenger, WhatsApp, Twitter/X, LinkedIn, Telegram, etc.
 */
export function getSocialShareBridgeUrl(data: ShareData): string {
  const targetUrl = getCrawlerSafeUrl(data.url);
  const siteUrl = PRODUCTION_DOMAIN.replace(/\/+$/, "");

  let resolvedImage = data.image ? String(data.image).trim() : "";
  if (resolvedImage) {
    if (resolvedImage.startsWith("data:")) {
      resolvedImage = "";
    } else if (resolvedImage.startsWith("//")) {
      resolvedImage = "https:" + resolvedImage;
    } else if (resolvedImage.startsWith("/")) {
      resolvedImage = siteUrl + resolvedImage;
    } else if (!resolvedImage.startsWith("http://") && !resolvedImage.startsWith("https://")) {
      if (resolvedImage.includes("uploads/") || resolvedImage.includes("storage/")) {
        resolvedImage = `https://thtt-backend.triphimalaya.com.np/${resolvedImage.replace(/^\/+/, "")}`;
      } else {
        resolvedImage = `${siteUrl}/${resolvedImage.replace(/^\/+/, "")}`;
      }
    }
  }

  const params = new URLSearchParams();
  if (data.title) params.set("title", data.title);
  if (data.text) params.set("desc", data.text);
  if (resolvedImage) params.set("img", resolvedImage);
  if (targetUrl) params.set("url", targetUrl);

  // Automatically parse and propagate service type, ID and parameters for all specific service details pages
  try {
    const parsed = new URL(targetUrl);
    const pathname = parsed.pathname;

    // 1. Work Permit (/permit-details/:id or /work-permit-details/:id)
    const permitMatch = pathname.match(/\/(permit-details|work-permit-details)\/([0-9a-zA-Z_-]+)/);
    if (permitMatch) {
      params.set("type", "permit-details");
      params.set("id", permitMatch[2]);
      const pType = parsed.searchParams.get("permitType");
      if (pType) {
        params.set("permitType", pType);
      }
    }

    // 2. Tours, Trekking & Adventure Activities (/details/:id or /packages/:id)
    const packageMatch = pathname.match(/\/(details|packages)\/([0-9a-zA-Z_-]+)/);
    if (packageMatch) {
      params.set("type", "details");
      params.set("id", packageMatch[2]);
    }

    // 3. Helicopter Services (/service/heli-services/:tourId)
    const heliMatch = pathname.match(/\/service\/heli-services\/([0-9a-zA-Z_-]+)/);
    if (heliMatch) {
      params.set("type", "heli-services");
      params.set("id", heliMatch[1]);
    }

    // 4. Hotel Booking (/hotel-details/:hotelId or /hotel-detail/:hotelId)
    const hotelMatch = pathname.match(/\/(hotel-details|hotel-detail)\/([0-9a-zA-Z_-]+)/);
    if (hotelMatch) {
      params.set("type", "hotel-details");
      params.set("id", hotelMatch[2]);
    }

    // 5. Travel Insurance (/insurance-details/:insuranceId or /service/travel-insurance/:id)
    const insuranceMatch = pathname.match(/\/(insurance-details|insurance-detail)\/([0-9a-zA-Z_-]+)/) ||
                           pathname.match(/\/service\/travel-insurance\/([0-9a-zA-Z_-]+)/);
    if (insuranceMatch) {
      params.set("type", "insurance-details");
      params.set("id", insuranceMatch[2] || insuranceMatch[1]);
    }

    // 6. Vehicle Rental (/vehicle-details/:vehicleId or /vehicle-detail/:vehicleId)
    const vehicleMatch = pathname.match(/\/(vehicle-details|vehicle-detail)\/([0-9a-zA-Z_-]+)/);
    if (vehicleMatch) {
      params.set("type", "vehicle-details");
      params.set("id", vehicleMatch[2]);
    }

    // 7. Visa Processing (/visa-details/:visaId or /visa-detail/:visaId)
    const visaMatch = pathname.match(/\/(visa-details|visa-detail)\/([0-9a-zA-Z_-]+)/);
    if (visaMatch) {
      params.set("type", "visa-details");
      params.set("id", visaMatch[2]);
    }

    // 8. Documentation (/documentation/:docId or /documents/:docId)
    const docMatch = pathname.match(/\/(documentation|documents)\/([0-9a-zA-Z_-]+)/);
    if (docMatch) {
      params.set("type", "documentation");
      params.set("id", docMatch[2]);
    }

    // 9. Blog Stories (/blog/:slug or /blog-details/:slug)
    const blogMatch = pathname.match(/\/(blog|blog-details)\/([0-9a-zA-Z_-]+)/);
    if (blogMatch) {
      params.set("type", "blog");
      params.set("id", blogMatch[2]);
    }

    // 10. Video Vlogs (/watch/:videoId or /video/:videoId)
    const videoMatch = pathname.match(/\/(watch|video|vlog|vlogs)\/([0-9a-zA-Z_-]+)/);
    if (videoMatch) {
      params.set("type", "watch");
      params.set("id", videoMatch[2]);
    }
  } catch {}

  return `${siteUrl}/share.php?${params.toString()}`;
}

/**
 * Dispatches sharing to a specific platform.
 */
export function shareToPlatform(
  platform: "facebook" | "whatsapp" | "twitter" | "linkedin" | "telegram" | "email" | "viber" | "reddit" | "tiktok",
  data: ShareData
): void {
  const crawlerUrl = getCrawlerSafeUrl(data.url);
  const directUrl = data.url || (typeof window !== "undefined" ? window.location.href : crawlerUrl);
  const title = data.title || "Trip Himalaya Tours & Travel";
  const text = data.text || title;
  const bridgeUrl = getSocialShareBridgeUrl(data);

  switch (platform) {
    case "facebook": {
      // Facebook Sharer requires the rich Open Graph bridge URL so the specific page image & title appear
      const shareEndpoint = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        bridgeUrl
      )}`;
      openSharePopup(shareEndpoint, "Share on Facebook");
      break;
    }

    case "tiktok": {
      copyToClipboard(directUrl);
      openSharePopup("https://www.tiktok.com/@trip.himalaya", "Share on TikTok");
      break;
    }

    case "whatsapp": {
      // WhatsApp message with title and bridge URL so WhatsApp generates the specific page link preview
      const message = `${title}\n\n${text && text !== title ? `${text}\n\n` : ""}${bridgeUrl}`;
      const shareEndpoint = `https://wa.me/?text=${encodeURIComponent(message)}`;
      openSharePopup(shareEndpoint, "Share via WhatsApp");
      break;
    }

    case "twitter": {
      // Twitter / X intent with rich bridge URL for summary_large_image card
      const shareEndpoint = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        bridgeUrl
      )}&text=${encodeURIComponent(text)}`;
      openSharePopup(shareEndpoint, "Share on X");
      break;
    }

    case "linkedin": {
      // LinkedIn official share-offsite with rich bridge URL
      const shareEndpoint = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        bridgeUrl
      )}`;
      openSharePopup(shareEndpoint, "Share on LinkedIn");
      break;
    }

    case "telegram": {
      // Telegram share with rich bridge URL
      const shareEndpoint = `https://t.me/share/url?url=${encodeURIComponent(
        bridgeUrl
      )}&text=${encodeURIComponent(text)}`;
      openSharePopup(shareEndpoint, "Share on Telegram");
      break;
    }

    case "email": {
      // Standard mailto
      const body = `${title}\n\n${text && text !== title ? `${text}\n\n` : ""}Check it out here:\n${directUrl}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
        body
      )}`;
      break;
    }

    case "viber": {
      // Viber direct share with rich bridge URL
      const message = `${title} ${bridgeUrl}`;
      window.location.href = `viber://forward?text=${encodeURIComponent(message)}`;
      break;
    }

    case "reddit": {
      // Reddit submit with rich bridge URL
      const shareEndpoint = `https://reddit.com/submit?url=${encodeURIComponent(
        bridgeUrl
      )}&title=${encodeURIComponent(title)}`;
      openSharePopup(shareEndpoint, "Share on Reddit");
      break;
    }
  }
}

/**
 * Checks if device supports native Web Share API.
 */
export function canNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

/**
 * Triggers native system share dialog on supported devices (iOS, Android, macOS Safari, Edge).
 */
export async function triggerNativeShare(data: ShareData): Promise<boolean> {
  if (!canNativeShare()) return false;

  try {
    await navigator.share({
      title: data.title,
      text: data.text || data.title,
      url: data.url || (typeof window !== "undefined" ? window.location.href : PRODUCTION_DOMAIN),
    });
    return true;
  } catch (err: any) {
    // AbortError is normal when user cancels dialog
    if (err?.name !== "AbortError") {
      console.warn("Native share failed, falling back:", err);
    }
    return false;
  }
}

/**
 * Copies text to clipboard with fallback support for older browsers.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // Fallback below
  }

  // Fallback using textarea
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand("copy");
    textArea.remove();
    return success;
  } catch (e) {
    return false;
  }
}
