import { useState, useEffect } from "react";
import { getPageByName } from "../api/BackendApi";
import { getBackendRootUrl } from "../config/env";

/**
 * Custom React hook to fetch background images dynamically from the backend
 * CMS Pages API (/pages/name/{name}).
 *
 * Supports single or fallback page identifiers (e.g. ["adventure-activities", "activities"]).
 * Automatically resolves relative backend image URLs and sorts by sort_order.
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

      for (const id of identifiers) {
        if (!id) continue;
        try {
          const res = await getPageByName(id);
          const pageData = res?.data?.data || res?.data;
          const rawImages = pageData?.background_images || pageData?.images;

          if (Array.isArray(rawImages) && rawImages.length > 0) {
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
            const parsedUrls = activeImages
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

            if (isMounted && parsedUrls.length > 0) {
              setImages(parsedUrls);
              return; // Stop trying once images are successfully found
            }
          }
        } catch {
          // Continue to next identifier if this one 404s
        }
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

