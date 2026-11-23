import { useState, useEffect } from "react";
import { getPageTestimonials } from "../api/BackendApi";
import { getBackendRootUrl, isLocalEnvironment } from "../config/env";

/**
 * Mapping of frontend service slugs to backend CMS page names
 * as configured in the Page Testimonial Manager.
 */
export const SERVICE_SLUG_TO_CMS_PAGE: Record<string, string> = {
  "air-ticket": "AIR_TICKET",
  "air_ticket": "AIR_TICKET",
  "airticket": "AIR_TICKET",
  "AIR_TICKET": "AIR_TICKET",

  "tours": "TOURS",
  "tour": "TOURS",
  "TOURS": "TOURS",

  "activities": "ADVENTURE_ACTIVITIES",
  "adventure-activities": "ADVENTURE_ACTIVITIES",
  "adventure_activities": "ADVENTURE_ACTIVITIES",
  "ADVENTURE_ACTIVITIES": "ADVENTURE_ACTIVITIES",

  "trekking": "TREKKING",
  "trek": "TREKKING",
  "TREKKING": "TREKKING",

  "hotel-booking": "HOTEL_BOOKING",
  "hotel_booking": "HOTEL_BOOKING",
  "hotels": "HOTEL_BOOKING",
  "hotel": "HOTEL_BOOKING",
  "HOTEL_BOOKING": "HOTEL_BOOKING",

  "visa-services": "VISA_SERVICES",
  "visa_services": "VISA_SERVICES",
  "visa": "VISA_SERVICES",
  "VISA_SERVICES": "VISA_SERVICES",

  "travel-insurance": "TRAVEL_INSURANCE",
  "travel_insurance": "TRAVEL_INSURANCE",
  "insurance": "TRAVEL_INSURANCE",
  "TRAVEL_INSURANCE": "TRAVEL_INSURANCE",

  "vehicle-rental": "VEHICLE_RENTAL",
  "vehicle_rental": "VEHICLE_RENTAL",
  "vehicles": "VEHICLE_RENTAL",
  "vehicle": "VEHICLE_RENTAL",
  "VEHICLE_RENTAL": "VEHICLE_RENTAL",

  "heli-services": "HELI_SERVICES",
  "heli_services": "HELI_SERVICES",
  "heli": "HELI_SERVICES",
  "helicopter": "HELI_SERVICES",
  "HELI_SERVICES": "HELI_SERVICES",

  "online-shram": "ONLINE_SHRAM",
  "online_shram": "ONLINE_SHRAM",
  "work-permit": "ONLINE_SHRAM",
  "work_permit": "ONLINE_SHRAM",
  "shram": "ONLINE_SHRAM",
  "ONLINE_SHRAM": "ONLINE_SHRAM",

  "documentation": "DOCUMENTATION",
  "document": "DOCUMENTATION",
  "documents": "DOCUMENTATION",
  "DOCUMENTATION": "DOCUMENTATION",
};

export interface PageTestimonialData {
  id: string | number;
  traveler_name: string;
  country?: string;
  rating: number;
  review: string;
  review_date?: string;
  display_order?: number;
  status?: string;
  is_verified?: boolean | number | string;
  profile_image?: string;
}

/**
 * Resolves a service slug or raw string to a valid CMS page identifier.
 */
export function resolveCmsPageName(identifier: string): string {
  const normalized = String(identifier || "").trim();
  if (SERVICE_SLUG_TO_CMS_PAGE[normalized]) {
    return SERVICE_SLUG_TO_CMS_PAGE[normalized];
  }
  const lower = normalized.toLowerCase();
  if (SERVICE_SLUG_TO_CMS_PAGE[lower]) {
    return SERVICE_SLUG_TO_CMS_PAGE[lower];
  }
  return normalized.toUpperCase().replace(/-/g, "_");
}

/**
 * Custom React hook to fetch testimonials for a specific page.
 *
 * Rules:
 * - On LIVE website: uses live backend API data only. Mock data is NEVER shown.
 *   If no live data exists, returns [] so the testimonial section is hidden.
 * - On LOCAL environment: uses live backend API data if available; falls back to
 *   mock data if no live data is present (allowing local UI preview).
 */
export function usePageTestimonials(
  pageIdentifier: string,
  mockFallback?: any[]
) {
  const [testimonials, setTestimonials] = useState<any[]>(() => {
    // Initial state: only seed mock on local development
    if (isLocalEnvironment() && Array.isArray(mockFallback) && mockFallback.length > 0) {
      return mockFallback;
    }
    return [];
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const cmsPageName = resolveCmsPageName(pageIdentifier);
    const isLocal = isLocalEnvironment();

    if (!cmsPageName) {
      setLoading(false);
      setTestimonials(isLocal && mockFallback ? mockFallback : []);
      return;
    }

    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getPageTestimonials(cmsPageName);
        const raw = response?.data?.data;
        let items = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(response?.data)
          ? response.data
          : [];

        // Filter active only
        items = items.filter(
          (item: any) =>
            !item?.status || String(item.status).toUpperCase() === "ACTIVE"
        );

        // Sort by display_order ascending
        items.sort(
          (a: any, b: any) =>
            Number(a?.display_order ?? 0) - Number(b?.display_order ?? 0)
        );

        // Prepend backend root URL to relative profile image paths
        const backendRoot = getBackendRootUrl();
        const formattedItems = items.map((item: any) => {
          let profileImg = item.profile_image || item.userAvatar || item.avatar;
          if (
            profileImg &&
            typeof profileImg === "string" &&
            !profileImg.startsWith("http://") &&
            !profileImg.startsWith("https://") &&
            !profileImg.startsWith("data:")
          ) {
            profileImg = `${backendRoot}${profileImg.startsWith("/") ? "" : "/"}${profileImg}`;
          }
          return {
            ...item,
            profile_image: profileImg,
          };
        });

        if (isMounted) {
          if (formattedItems.length > 0) {
            setTestimonials(formattedItems);
          } else {
            // No live data available
            if (isLocal && mockFallback && mockFallback.length > 0) {
              // Local preview fallback
              setTestimonials(mockFallback);
            } else {
              // Live website or no mock: hide section
              setTestimonials([]);
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to load testimonials");
          if (isLocal && mockFallback && mockFallback.length > 0) {
            setTestimonials(mockFallback);
          } else {
            setTestimonials([]);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTestimonials();

    return () => {
      isMounted = false;
    };
  }, [pageIdentifier, mockFallback]);

  return { testimonials, loading, error };
}
