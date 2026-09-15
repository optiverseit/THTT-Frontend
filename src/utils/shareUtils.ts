/**
 * shareUtils.ts
 * Reliable social media link sharing helpers for Facebook, WhatsApp, Twitter/X,
 * LinkedIn, Telegram, Email, and Native Web Share API.
 */

export const PRODUCTION_DOMAIN =
  (import.meta.env.VITE_SITE_URL as string) || "https://triphimalaya.com.np";

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

  switch (platform) {
    case "facebook": {
      // Facebook Sharer requires a public crawler-accessible URL
      const shareEndpoint = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        crawlerUrl
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
      // WhatsApp can receive formatted message with title and link
      const message = `${title}\n\n${text !== title ? `${text}\n\n` : ""}${directUrl}`;
      const shareEndpoint = `https://wa.me/?text=${encodeURIComponent(message)}`;
      openSharePopup(shareEndpoint, "Share via WhatsApp");
      break;
    }

    case "twitter": {
      // Twitter / X intent
      const shareEndpoint = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        crawlerUrl
      )}&text=${encodeURIComponent(text)}`;
      openSharePopup(shareEndpoint, "Share on X");
      break;
    }

    case "linkedin": {
      // LinkedIn official share-offsite
      const shareEndpoint = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        crawlerUrl
      )}`;
      openSharePopup(shareEndpoint, "Share on LinkedIn");
      break;
    }

    case "telegram": {
      // Telegram share
      const shareEndpoint = `https://t.me/share/url?url=${encodeURIComponent(
        crawlerUrl
      )}&text=${encodeURIComponent(text)}`;
      openSharePopup(shareEndpoint, "Share on Telegram");
      break;
    }

    case "email": {
      // Standard mailto
      const body = `${title}\n\n${text !== title ? `${text}\n\n` : ""}Check it out here:\n${directUrl}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
        body
      )}`;
      break;
    }

    case "viber": {
      // Viber direct share
      const message = `${title} ${directUrl}`;
      window.location.href = `viber://forward?text=${encodeURIComponent(message)}`;
      break;
    }

    case "reddit": {
      // Reddit submit
      const shareEndpoint = `https://reddit.com/submit?url=${encodeURIComponent(
        crawlerUrl
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
