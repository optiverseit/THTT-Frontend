import { useState, useEffect } from "react";
import { getPages, getPageByName } from "../api/BackendApi";
import { getBackendRootUrl } from "../config/env";

// In-memory cache for existing pages to avoid redundant requests and 404 errors
let cachedPagesPromise: Promise<any[]> | null = null;

async function fetchAvailablePages(): Promise<any[]> {
  if (!cachedPagesPromise) {
    cachedPagesPromise = getPages(1, 100)
      .then((res) => {
        const raw = res?.data?.data;
        if (Array.isArray(raw)) return raw;
        if (Array.isArray(raw?.data)) return raw.data;
        return [];
      })
      .catch(() => []);
  }
  return cachedPagesPromise;
}

export function clearPageBackgroundsCache() {
  cachedPagesPromise = null;
}

function parseImages(rawImages: any[]): string[] {
  if (!Array.isArray(rawImages) || rawImages.length === 0) return [];

  // Filter active images
  const activeImages = rawImages.filter(
    (item: any) =>
      !item?.status || String(item.status).toUpperCase() === "ACTIVE"
  );

  // Sort by sort_order ascending
  activeImages.sort(
    (a: any, b: any) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0)
  );

  const backendRoot = getBackendRootUrl();
  return activeImages
    .map((item: any) => {
      const url =
        typeof item === "string"
          ? item
          : item?.image || item?.url || item?.image_url;
      if (!url) return null;
      if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("data:")
      ) {
        return url;
      }
      return `${backendRoot}${url.startsWith("/") ? "" : "/"}${url}`;
    })
    .filter(Boolean) as string[];
}

/**
 * Custom React hook to fetch background images dynamically from the backend
 * CMS Pages API (/pages/name/{name}).
 *
 * Supports single or fallback page identifiers (e.g. ["adventure-activities", "activities"]).
 * Automatically resolves relative backend image URLs and sorts by sort_order.
 * Verifies against available backend pages first to avoid 404 network errors in the browser.
 */
export function usePageBackgrounds(
  pageIdentifier: string | string[],
  fallbackImage?: string
): string[] {
  const [images, setImages] = useState<string[]>(
    fallbackImage ? [fallbackImage] : []
  );

  useEffect(() => {
    let isMounted = true;

    // Keep fallback image updated if it changes
    if (fallbackImage) {
      setImages((prev) => (prev.length === 0 ? [fallbackImage] : prev));
    }

    const fetchImages = async () => {
      const identifiers = Array.isArray(pageIdentifier)
        ? pageIdentifier
        : [pageIdentifier];

      try {
        // Retrieve available CMS pages first so we never request non-existent names (prevents 404s)
        const availablePages = await fetchAvailablePages();

        for (const id of identifiers) {
          if (!id) continue;

          // Find if this page exists in backend CMS
          const matched = availablePages.find(
            (p: any) =>
              p?.name &&
              String(p.name).trim().toLowerCase() === String(id).trim().toLowerCase()
          );

          if (matched) {
            // If background images already present in pages payload
            const rawImages = matched.background_images || matched.images;
            if (Array.isArray(rawImages) && rawImages.length > 0) {
              const parsed = parseImages(rawImages);
              if (isMounted && parsed.length > 0) {
                setImages(parsed);
                return;
              }
            }

            // Otherwise safely fetch by name since we know it exists
            try {
              const res = await getPageByName(matched.name);
              const pageData = res?.data?.data || res?.data;
              const freshImages = pageData?.background_images || pageData?.images;
              if (Array.isArray(freshImages) && freshImages.length > 0) {
                const parsed = parseImages(freshImages);
                if (isMounted && parsed.length > 0) {
                  setImages(parsed);
                  return;
                }
              }
            } catch {
              // Ignore error if specific page fetch fails
            }
          }
        }
      } catch {
        // Fallback gracefully on any fetch failure
      }

      // If no dynamic images found and fallback exists, retain fallback
      if (isMounted && fallbackImage) {
        setImages([fallbackImage]);
      }
    };

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, [
    Array.isArray(pageIdentifier) ? pageIdentifier.join(",") : pageIdentifier,
    fallbackImage,
  ]);

  return images;
}
