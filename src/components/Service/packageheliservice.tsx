/**
 * packageheliservice.tsx
 * -----------------------------------------------------------------
 * Helicopter Services Package Component.
 * Implements the exact same flow as available in Packages:
 *  - Filter sidebar (Price range, Ratings, Keywords)
 *  - Tour cards matching Image 1 (Image, Badge, Ratings, Details, Starting price, View Details, Book Now, Instant Inquiry)
 *  - Complete View Details page matching Image 2:
 *      - Top banner with title, badge, WhatsApp button, and Print/Save PDF export
 *      - Sub-navigation strip (OVERVIEW, POLICIES, FAQS, TESTIMONIES) + Starts From + Book Now
 *      - Trip Highlights
 *      - What's Included (teal green card)
 *      - What's Excluded (pink card)
 *      - Restrictions & Health (amber card with warning triangle)
 *      - What to Bring (pink card with essentials)
 *      - Dedicated heliservicepricemodel integration
 *  - Booking Submission Form Modal with CAAN weight declaration, document upload, and passenger manifest
 *  - Print Slip (voucher/receipt) with print trigger
 * -----------------------------------------------------------------
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Users,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  AlertTriangle,
  ShoppingBag,
  Printer,
  MessageCircle,
  Plane,
  ChevronDown,
  ChevronUp,
  Check,
  Calendar,
  FileText,
  UploadCloud,
  Trash2,
  Receipt,
  Headphones,
  FileCheck,
  Luggage,
  HeartPulse,
  CloudSun,
  Filter,
  ArrowLeft,
  Share2,
  Copy,
  BadgeCheck,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import {
  useGlobalCurrency,
  formatNPR,
  formatUSD,
  formatINR,
  displayPrice,
} from "../../context/CurrencyContext";
import HeliServicePriceModel, { HeliTourData } from "./heliservicepricemodel";
import THTTLogo from "../../assets/images/THTTLogo.png";
import Logo from "../../assets/images/Logo.png";
import { COUNTRY_CODES, isoToFlag } from "../../utils/countrycodes";
import {
  getPackagesByCategory,
  getPackagePricingTiers,
  getPackageFaqs,
  getPackageInclusions,
  getPackageExclusions,
  getPackageRestrictions,
  getPackageWhatToBring,
  getPackageHighlights,
  getPackageItineraries,
  getPackageById,
  createBooking,
  initiatePayment,
} from "../../api/BackendApi";
import OtherServicesComponent from "../reusable/OtherServicesComponent";
import { services } from "../../assets/data/mockData";
import { formatDescription } from "../../utils/formatDescription";
import { PaymentMethod } from "../reusable/PaymentMethod";
import DynamicFaqSection from "../reusable/DynamicFaqSection";
import TripRoadmap, { type RoadmapStep } from "../reusable/TripRoadmap";
import { isSessionValid, clearAuthSession } from "../../utils/sessionManager";

// =============================================================================
// Comprehensive Helicopter Tours Data
// =============================================================================

export interface PackageFaqApi {
  id?: number | string;
  package_id?: number | string;
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
  question_np?: string;
  questionNp?: string;
  qNp?: string;
  answer_np?: string;
  answerNp?: string;
  aNp?: string;
}

export interface HeliPackageItem extends HeliTourData {
  id: string;
  backendId: number;
  created_at?: string;

  title: string;
  slug: string;
  location: string;
  duration: string;
  maxAltitude: string;

  // Actual package price from packages.price
  packagePriceNPR: number;

  // Prices from pricing tiers
  charterPriceNPR: number;
  sharingPriceNPR: number;

  charterDesc: string;
  sharingDesc: string;

  category: "ebc" | "abc" | "langtang" | "pilgrimage" | "rescue";

  tag: string;
  apiCategory?: string;
  image: string;
  gallery: string[];
  description: string;

  rating: number;
  reviewsCount: number;

  tripHighlights: string[];
  whatsIncluded: string[];
  whatsExcluded: string[];
  restrictionsAndHealth: string[];
  whatToBring: string[];
  policies: string[];

  faqs: Array<{
    q: string;
    a: string;
  }>;

  testimonies: Array<{
    name: string;
    country: string;
    rating: number;
    comment: string;
    date: string;
  }>;


  package_helis?: any[];
  package_vehicles?: any[];

  min_people?: number | null;
  max_people?: number | null;
}

export interface PricingTierApi {
  id: number;
  package_id: number;
  service: string;
  age_group: string | null;
  price_npr: string;
  price_usd: string;
}

const getCategoryFromPackage = (pkg: any): HeliPackageItem["category"] => {
  const text = `${pkg?.title ?? ""} ${pkg?.location ?? ""}`.toLowerCase();
  if (text.includes("annapurna")) return "abc";
  if (text.includes("langtang")) return "langtang";
  if (text.includes("muktinath") || text.includes("gosaikunda") || text.includes("pilgrim")) return "pilgrimage";
  if (text.includes("rescue") || text.includes("evacuation")) return "rescue";
  return "ebc";
};

const mapApiPackageToHeliPackage = (pkg: any): HeliPackageItem => {

  // Actual package price from packages.price
  const basePrice = Number(pkg?.price ?? 0);

  const heliCapacity =
    pkg?.package_helis?.[0]?.heli?.capacity;

  const rawRating = Number(pkg.rating ?? 0);
  const computedRating = Number.isFinite(rawRating) && rawRating > 0
    ? rawRating
    : ((Number(pkg.id) + (pkg.title?.length || 0)) % 2 === 0 ? 4 : 5);

  return {
    id: String(pkg.id),
    backendId: Number(pkg.id),
    created_at: pkg.created_at,

    title: pkg.title ?? "Helicopter Package",
    slug: pkg.slug ?? String(pkg.id),

    tag: pkg.tag ? String(pkg.tag).trim() : "",
    apiCategory: pkg.adventure_category ? String(pkg.adventure_category).trim() : (pkg.category ? String(pkg.category).trim() : ""),

    location: pkg.location ?? "Nepal",
    duration: pkg.duration ?? "",
    maxAltitude: "",

    rating: computedRating,
    reviewsCount: Number(pkg.reviews_count ?? pkg.reviewsCount ?? 0),

    // Actual package price
    packagePriceNPR: basePrice,

    // Keep existing booking UI working without calling pricing-tier API.
    // Both fallback to the actual package price.
    charterPriceNPR: basePrice,
    sharingPriceNPR: basePrice,

    charterDesc: pkg.charter_description ?? pkg.charterDesc ?? "",
    sharingDesc: pkg.sharing_description ?? pkg.sharingDesc ?? "",

    image:
      pkg.image ||
      pkg.cover_image ||
      pkg.image_url ||
      pkg.thumbnail ||
      (Array.isArray(pkg.gallery) && pkg.gallery[0]
        ? (typeof pkg.gallery[0] === "string" ? pkg.gallery[0] : pkg.gallery[0]?.url || pkg.gallery[0]?.image)
        : "") ||
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600",
    gallery:
      Array.isArray(pkg.gallery) && pkg.gallery.length > 0
        ? pkg.gallery.map((g: any) => (typeof g === "string" ? g : g?.url || g?.image)).filter(Boolean)
        : (pkg.image ? [pkg.image] : ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600"]),

    description: pkg.description ?? "",

    category: getCategoryFromPackage(pkg),

    tripHighlights: Array.isArray(pkg.highlights)
      ? pkg.highlights
          .map((item: any) =>
            typeof item === "string"
              ? item.trim()
              : (item?.highlight ?? item?.title ?? item?.item ?? item?.description ?? "")
          )
          .filter(Boolean)
      : Array.isArray(pkg.highlightDetails)
      ? pkg.highlightDetails
          .map((item: any) =>
            typeof item === "string"
              ? item.trim()
              : (item?.highlight ?? item?.title ?? item?.item ?? item?.description ?? "")
          )
          .filter(Boolean)
      : [],

    whatsIncluded: Array.isArray(pkg.inclusions)
      ? pkg.inclusions.map((item: any) => item?.item ?? item?.title ?? item?.description ?? "").filter(Boolean)
      : [],

    whatsExcluded: Array.isArray(pkg.exclusions)
      ? pkg.exclusions.map((item: any) => item?.item ?? item?.title ?? item?.description ?? "").filter(Boolean)
      : [],

    restrictionsAndHealth: Array.isArray(pkg.restrictions_and_health)
      ? pkg.restrictions_and_health.map((item: any) => typeof item === "string" ? item : item?.item ?? item?.description ?? "").filter(Boolean)
      : [],

    whatToBring: Array.isArray(pkg.what_to_bring)
      ? pkg.what_to_bring.map((item: any) => typeof item === "string" ? item : item?.item ?? item?.description ?? "").filter(Boolean)
      : [],

    policies: Array.isArray(pkg.policies)
      ? pkg.policies.map((item: any) => typeof item === "string" ? item : item?.item ?? item?.description ?? "").filter(Boolean)
      : [],

    faqs: [],

    testimonies: Array.isArray(pkg.testimonies)
      ? pkg.testimonies
      : [],


    package_helis:
      pkg.package_helis ?? [],

    package_vehicles:
      pkg.package_vehicles ?? [],

    min_people:
      pkg.min_people ?? 1,

    max_people:
      pkg.max_people ?? heliCapacity ?? null,
  };
};

// =============================================================================
// Main PackageHeliService Component
// =============================================================================

export const PackageHeliService: React.FC<{
  filter?: { location: string; name: string } | null;
  onClearFilter?: () => void;
}> = ({ filter, onClearFilter }) => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  const navigate = useNavigate();
  const { tourId } = useParams<{ tourId?: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const routeTourId = tourId || searchParams.get("tour");

  const [pricingTiers, setPricingTiers] = useState<PricingTierApi[]>([]);
  const [pricingLoading, setPricingLoading] = useState(false);

  const [heliPackages, setHeliPackages] = useState<HeliPackageItem[]>([]);
  const [packageFaqs, setPackageFaqs] = useState<
    Array<{
      id?: number | string;
      q: string;
      a: string;
      question?: string;
      answer?: string;
      questionNp?: string;
      answerNp?: string;
    }>
  >([]);
  const [packagesLoading, setPackagesLoading] = useState<boolean>(true);
  const [packagesError, setPackagesError] = useState<string>("");
  const [bookingPricingTierId, setBookingPricingTierId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [bookingId, setBookingId] = useState<number | null>(null);

  const [submissionId, setSubmissionId] = useState<string>("");
  const [submittedAt, setSubmittedAt] = useState<string>("");
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // â”€â”€ Separately-fetched sub-resources (not included in category listing) â”€â”€
  const [heliInclusions, setHeliInclusions] = useState<string[]>([]);
  const [heliExclusions, setHeliExclusions] = useState<string[]>([]);
  const [heliRestrictions, setHeliRestrictions] = useState<string[]>([]);
  const [heliWhatToBring, setHeliWhatToBring] = useState<string[]>([]);
  const [heliHighlights, setHeliHighlights] = useState<string[]>([]);
  const [heliItineraries, setHeliItineraries] = useState<RoadmapStep[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchHeliPackages = async () => {
      try {
        setPackagesLoading(true);
        setPackagesError("");

        const response = await getPackagesByCategory("Heli Services");
        const rawPackages = Array.isArray(response.data?.data?.data)
          ? response.data.data.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];

        const mappedPackages = rawPackages.map((pkg: any) =>
          mapApiPackageToHeliPackage(pkg)
        );

        // Sort packages so the latest inserted card appears first (newest to oldest):
        const sortedPackages = [...mappedPackages].sort((a: any, b: any) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;

          if (timeA && timeB && timeA !== timeB) {
            return timeB - timeA;
          }

          const idA = Number(a.backendId ?? a.id) || 0;
          const idB = Number(b.backendId ?? b.id) || 0;
          return idB - idA;
        });

        if (!cancelled) setHeliPackages(sortedPackages);
      } catch (error) {
        console.error("Failed to load Heli Services packages:", error);
        if (!cancelled) {
          setHeliPackages([]);
          setPackagesError("Unable to load helicopter packages.");
        }
      } finally {
        if (!cancelled) setPackagesLoading(false);
      }
    };

    fetchHeliPackages();
    return () => {
      cancelled = true;
    };
  }, []);

  // Read URL search params for heli route/flightType filtering
  const urlRoute = searchParams.get("route") || "";
  const urlFlightType = searchParams.get("flightType") || "";

  // Determine active tour from URL (dedicated Details Page route: /service/heli-services/:tourId)
  const selectedTour = routeTourId
    ? heliPackages.find(
      (t) =>
        String(t.id).toLowerCase() === routeTourId.toLowerCase() ||
        t.slug?.toLowerCase() === routeTourId.toLowerCase()
    ) || null
    : null;

  // =========================
  // FETCH SUB-RESOURCES (inclusions, exclusions, restrictions, what-to-bring)
  // PERFORMANCE: When routeTourId is numeric we can derive backendId immediately
  // and fire all 4 requests IN PARALLEL with the category listing — no waterfall.
  // =========================
  useEffect(() => {
    let cancelled = false;

    // Derive numeric backendId from URL param directly (no need to wait for category listing)
    const numericId = routeTourId && /^\d+$/.test(routeTourId)
      ? Number(routeTourId)
      : selectedTour?.backendId ?? null;

    if (!numericId) {
      setHeliInclusions([]);
      setHeliExclusions([]);
      setHeliRestrictions([]);
      setHeliWhatToBring([]);
      setHeliHighlights([]);
      setHeliItineraries([]);
      return;
    }

    const fetchSubResources = async () => {
      const [incRes, excRes, resRes, wtbRes, hlRes, itinRes, pkgRes] = await Promise.allSettled([
        getPackageInclusions(numericId),
        getPackageExclusions(numericId),
        getPackageRestrictions(numericId),
        getPackageWhatToBring(numericId),
        getPackageHighlights(numericId),
        getPackageItineraries(numericId),
        getPackageById(numericId),
      ]);

      const extractItems = (
        res: PromiseSettledResult<any>,
        preferredField?: string
      ): string[] => {
        if (res.status !== "fulfilled") return [];
        const raw = res.value?.data;
        const list = Array.isArray(raw?.data?.data)
          ? raw.data.data
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw)
          ? raw
          : [];
        return list
          .map((item: any) => {
            if (typeof item === "string") return item.trim();
            if (!item || typeof item !== "object") return "";
            if (preferredField && item[preferredField]) return String(item[preferredField]).trim();
            return String(
              item.highlight ??
              item.item ??
              item.title ??
              item.name ??
              item.restriction ??
              item.description ??
              item.point ??
              ""
            ).trim();
          })
          .filter(Boolean);
      };

      if (!cancelled) {
        setHeliInclusions(extractItems(incRes, "item"));
        setHeliExclusions(extractItems(excRes, "item"));
        // restrictions API returns { restriction: "..." } not { item: "..." }
        setHeliRestrictions(extractItems(resRes, "restriction"));
        setHeliWhatToBring(extractItems(wtbRes, "item"));

        // Extract highlights from dedicated highlights endpoint:
        let fetchedHighlights = extractItems(hlRes, "highlight");
        if (fetchedHighlights.length === 0) {
          fetchedHighlights = extractItems(hlRes, "title");
        }
        if (fetchedHighlights.length === 0) {
          fetchedHighlights = extractItems(hlRes);
        }

        // Fallback: If dedicated endpoint returned empty, check package detail response
        if (fetchedHighlights.length === 0 && pkgRes.status === "fulfilled") {
          const pkgData = pkgRes.value?.data?.data ?? pkgRes.value?.data;
          const pkgHl =
            pkgData?.highlights ??
            pkgData?.highlight_details ??
            pkgData?.highlightDetails;
          if (Array.isArray(pkgHl)) {
            fetchedHighlights = pkgHl
              .map((item: any) => {
                if (typeof item === "string") return item.trim();
                return String(
                  item?.highlight ??
                  item?.title ??
                  item?.item ??
                  item?.description ??
                  ""
                ).trim();
              })
              .filter(Boolean);
          }
        }

        setHeliHighlights(fetchedHighlights);

        // Extract itineraries from dedicated itineraries endpoint:
        let rawItineraries: any[] = [];
        if (itinRes.status === "fulfilled") {
          const raw = itinRes.value?.data;
          rawItineraries = Array.isArray(raw?.data?.data)
            ? raw.data.data
            : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw)
            ? raw
            : [];
        }

        // Fallback: If dedicated itineraries endpoint returned empty, check package detail response
        if (rawItineraries.length === 0 && pkgRes.status === "fulfilled") {
          const pkgData = pkgRes.value?.data?.data ?? pkgRes.value?.data;
          const fallbackItin =
            pkgData?.itineraries ??
            pkgData?.itinerary ??
            pkgData?.allItenary;
          if (Array.isArray(fallbackItin)) {
            rawItineraries = fallbackItin;
          }
        }

        const mappedItineraries: RoadmapStep[] = rawItineraries
          .filter((item: any) => {
            if (!item) return false;
            const title = String(item.title || item.heading || item.name || "").trim();
            const desc = String(item.description || item.desc || item.body || "").trim();
            const day = String(item.day || "").trim();
            return title.length > 0 || desc.length > 0 || day.length > 0;
          })
          .map((item: any, idx: number) => ({
            step: Number(item.step || item.display_order || item.order) || idx + 1,
            day: typeof item.day === "number"
              ? `Day ${String(item.day).padStart(2, "0")}`
              : String(item.day || `Day ${String(idx + 1).padStart(2, "0")}`),
            schedule: item.schedule || item.time || "",
            title: item.title || item.heading || item.name || `Flight Segment ${idx + 1}`,
            description: item.desc || item.description || item.body || "",
            tags: Array.isArray(item.tags)
              ? item.tags
              : typeof item.tags === "string"
              ? item.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
              : [],
          }));

        setHeliItineraries(mappedItineraries);
      }
    };

    fetchSubResources();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeTourId, selectedTour?.backendId]);


  useEffect(() => {
    let cancelled = false;

    if (!selectedTour?.backendId) {
      setPackageFaqs([]);
      return;
    }

    const fetchFaqs = async () => {
      try {
        const response = await getPackageFaqs(selectedTour.backendId);
        const rawFaqs: PackageFaqApi[] = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        const mappedFaqs = rawFaqs
          .map((faq) => ({
            id: faq.id,
            q: faq.question ?? faq.q ?? "",
            a: faq.answer ?? faq.a ?? "",
            question: faq.question ?? faq.q ?? "",
            answer: faq.answer ?? faq.a ?? "",
            questionNp: faq.question_np ?? faq.questionNp ?? faq.qNp ?? "",
            answerNp: faq.answer_np ?? faq.answerNp ?? faq.aNp ?? "",
          }))
          .filter((faq) => (faq.q || faq.question) && (faq.a || faq.answer));

        if (!cancelled) setPackageFaqs(mappedFaqs);
      } catch (error) {
        console.error(`Failed to load FAQs for package ${selectedTour.backendId}:`, error);
        if (!cancelled) setPackageFaqs([]);
      }
    };

    fetchFaqs();
    return () => {
      cancelled = true;
    };
  }, [selectedTour?.backendId]);

  // =========================
  // FETCH PRICING TIERS
  // =========================
  useEffect(() => {
    let cancelled = false;

    if (!selectedTour?.backendId) {
      setPricingTiers([]);
      return;
    }

    const fetchPricingTiers = async () => {
      try {
        setPricingLoading(true);

        const response = await getPackagePricingTiers(
          selectedTour.backendId
        );

        const tiers: PricingTierApi[] = Array.isArray(
          response.data?.data
        )
          ? response.data.data
          : [];

        if (!cancelled) {
          setPricingTiers(tiers);
        }
      } catch (error) {
        console.error(
          `Failed to load pricing tiers for package ${selectedTour.backendId}:`,
          error
        );

        if (!cancelled) {
          setPricingTiers([]);
        }
      } finally {
        if (!cancelled) {
          setPricingLoading(false);
        }
      }
    };

    fetchPricingTiers();

    return () => {
      cancelled = true;
    };
  }, [selectedTour?.backendId]);

  const startsFromDisplayPrice = selectedTour
    ? displayPrice(
      selectedTour.packagePriceNPR,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    )
    : "";

  const combinedHighlights = useMemo(() => {
    if (heliHighlights && heliHighlights.length > 0) return heliHighlights;
    if (selectedTour?.tripHighlights && selectedTour.tripHighlights.length > 0) return selectedTour.tripHighlights;
    return [];
  }, [heliHighlights, selectedTour?.tripHighlights]);

  const combinedItineraries: RoadmapStep[] = useMemo(() => {
    if (heliItineraries && heliItineraries.length > 0) return heliItineraries;
    const fallback =
      (selectedTour as any)?.itineraries ||
      (selectedTour as any)?.itinerary ||
      (selectedTour as any)?.allItenary;
    if (Array.isArray(fallback) && fallback.length > 0) {
      return fallback
        .filter((item: any) => {
          if (!item) return false;
          const title = String(item.title || item.heading || item.name || "").trim();
          const desc = String(item.description || item.desc || item.body || "").trim();
          const day = String(item.day || "").trim();
          return title.length > 0 || desc.length > 0 || day.length > 0;
        })
        .map((item: any, idx: number) => ({
          step: Number(item.step || item.display_order || item.order) || idx + 1,
          day: typeof item.day === "number"
            ? `Day ${String(item.day).padStart(2, "0")}`
            : String(item.day || `Day ${String(idx + 1).padStart(2, "0")}`),
          schedule: item.schedule || item.time || "",
          title: item.title || item.heading || item.name || `Flight Segment ${idx + 1}`,
          description: item.desc || item.description || item.body || "",
          tags: Array.isArray(item.tags)
            ? item.tags
            : typeof item.tags === "string"
            ? item.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
            : [],
        }));
    }
    return [];
  }, [heliItineraries, selectedTour]);
  // Active Tab in Details Page: "OVERVIEW" | "POLICIES" | "FAQS" | "TESTIMONIES"
  const [activeDetailTab, setActiveDetailTab] = useState<
    "OVERVIEW" | "POLICIES" | "FAQS" | "TESTIMONIES"
  >("OVERVIEW");

  // Filter States for Cards Listing
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(500000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingTour, setBookingTour] = useState<HeliPackageItem | null>(null);
  const [bookingFlightOption, setBookingFlightOption] = useState<"charter" | "sharing">("charter");
  const [bookingSeatCount, setBookingSeatCount] = useState<number>(1);
  const [activeApplicantIndex, setActiveApplicantIndex] = useState<number>(0);
  const [bookingTotalPriceNPR, setBookingTotalPriceNPR] = useState<number>(0);


  // Booking Applicant Interface
  interface HeliApplicant {
    fullName: string;
    nationality: string;
    idNumber: string;
    bodyWeightKg: string;
    luggageKg: string;
    email: string;
    phoneCode: string;
    phone: string;
    preferredDate: string;
    pickupHotel: string;
    passportFile?: File | null;
    photoFile?: File | null;
    flightFile?: File | null;
    hotelFile?: File | null;
    insuranceFile?: File | null;
  }

  // Booking Form Fields
  const [bookingFormData, setBookingFormData] = useState({
    fullName: "",
    email: "",
    phoneCode: "+977",
    phone: "",
    nationality: "",
    preferredDate: "",
    reserveDate: "",
    idNumber: "",
    pickupHotel: "",
    specialRequirements: "",
    bodyWeightKg: "",
    luggageKg: "",
    termsAgreed: false,
    applicants: [
      {
        fullName: "",
        nationality: "",
        idNumber: "",
        bodyWeightKg: "",
        luggageKg: "",
        email: "",
        phoneCode: "+977",
        phone: "",
        preferredDate: "",
        pickupHotel: "",
        passportFile: null,
        photoFile: null,
        flightFile: null,
        hotelFile: null,
        insuranceFile: null,
      },
    ] as HeliApplicant[],
  });

  // Booking Form Errors State
  interface HeliFormErrors {
    [key: string]: string | undefined;
  }
  const [formErrors, setFormErrors] = useState<HeliFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const validateHeliField = (name: string, value: any): string | undefined => {
    switch (name) {
      case "fullName":
        if (!value || !String(value).trim()) return "Full name is required (as per passport/NID)";
        if (String(value).trim().length < 2) return "Name must be at least 2 characters";
        return undefined;
      case "email":
        if (!value || !String(value).trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()))
          return "Please enter a valid email address";
        return undefined;
      case "phone":
        if (!value || !String(value).trim()) return "WhatsApp phone number is required";
        const cleanPhone = String(value).replace(/[\s\-()]/g, "");
        if (!/^\d{6,15}$/.test(cleanPhone)) return "Enter a valid phone number (6-15 digits)";
        return undefined;
      case "nationality":
        if (!value || !String(value).trim()) return "Nationality is required";
        if (String(value).trim().length < 2) return "Please enter a valid nationality";
        return undefined;
      case "preferredDate":
        if (!value) return "Preferred flight date is required";
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) return "Flight date cannot be in the past";
        return undefined;
      case "reserveDate":
        if (value && bookingFormData.preferredDate) {
          const pref = new Date(bookingFormData.preferredDate);
          const res = new Date(value);
          if (res < pref) return "Backup date cannot be earlier than preferred flight date";
        }
        return undefined;
      case "bodyWeightKg":
        if (value === "" || value === null || value === undefined)
          return "Approximate body weight is mandatory for flight safety";
        const num = Number(value);
        if (isNaN(num) || num < 20 || num > 160)
          return "Weight must be between 20 kg and 160 kg";
        return undefined;
      case "luggageKg":
        if (value === "" || value === null || value === undefined) return undefined;
        const lugNum = Number(value);
        if (isNaN(lugNum)) return "Please enter a valid luggage weight in kg";
        if (lugNum < 0) return "Luggage weight cannot be negative";
        const maxLuggage = (bookingSeatCount || 1) * 20;
        if (lugNum > maxLuggage) {
          return bookingSeatCount > 1
            ? `Luggage cannot exceed 20 kg per person (max ${maxLuggage} kg for ${bookingSeatCount} passengers)`
            : "Luggage cannot exceed 20 kg per person";
        }
        return undefined;
      case "idNumber":
        if (!value || !String(value).trim()) return "Passport or National ID is required";
        if (String(value).trim().length < 4) return "ID number must be at least 4 characters";
        return undefined;
      case "pickupHotel":
        return undefined;
      case "termsAgreed":
        if (!value) return "You must declare accuracy and accept flight regulations";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateApplicantField = (
    field: keyof HeliApplicant,
    value: any,
    index: number
  ): string | undefined => {
    const isMulti = bookingFlightOption !== "charter" && bookingSeatCount > 1;
    const prefix = isMulti ? `Applicant ${index + 1}: ` : "";
    switch (field) {
      case "fullName":
        if (!value || !String(value).trim())
          return `${prefix}Full name is required (as printed on passport/ID)`;
        if (String(value).trim().length < 2)
          return `${prefix}Name must be at least 2 characters`;
        if (!/^[a-zA-Z\s.'-]+$/.test(String(value).trim()))
          return `${prefix}Name can only contain letters, spaces, and hyphens`;
        return undefined;
      case "nationality":
        if (!value || !String(value).trim())
          return `${prefix}Nationality is required`;
        if (String(value).trim().length < 2)
          return `${prefix}Please enter a valid nationality`;
        return undefined;
      case "idNumber":
        if (!value || !String(value).trim())
          return `${prefix}Passport, Citizenship, or NID number is required`;
        if (String(value).trim().length < 4)
          return `${prefix}ID number must be at least 4 characters`;
        return undefined;
      case "bodyWeightKg":
        if (value === "" || value === null || value === undefined)
          return `${prefix}Weight declaration is mandatory for flight safety`;
        const weightNum = Number(value);
        if (isNaN(weightNum) || weightNum < 20 || weightNum > 160)
          return `${prefix}Body weight must be between 20 kg and 160 kg`;
        return undefined;
      case "luggageKg":
        if (value === "" || value === null || value === undefined) return undefined;
        const lugNum = Number(value);
        if (isNaN(lugNum)) return `${prefix}Please enter a valid luggage weight in kg`;
        if (lugNum < 0) return `${prefix}Luggage weight cannot be negative`;
        if (lugNum > 20) return `${prefix}Luggage cannot exceed 20 kg per person`;
        return undefined;
      case "email":
        if (!value || !String(value).trim())
          return `${prefix}Email address is required`;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()))
          return `${prefix}Please enter a valid email address`;
        return undefined;
      case "phone":
        if (!value || !String(value).trim())
          return `${prefix}WhatsApp phone number is required`;
        const cleanPhone = String(value).replace(/[\s\-()]/g, "");
        if (!/^\d{6,15}$/.test(cleanPhone))
          return `${prefix}Enter a valid phone number (6-15 digits)`;
        return undefined;
      case "preferredDate":
        if (!value) return `${prefix}Preferred flight date is required`;
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) return `${prefix}Flight date cannot be in the past`;
        return undefined;
      case "pickupHotel":
        return undefined;
      default:
        return undefined;
    }
  };

  const handleApplicantDocChange = (
    index: number,
    docType: "passportFile" | "photoFile" | "flightFile" | "hotelFile" | "insuranceFile",
    file: File | null
  ) => {
    if (file && file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10 MB limit. Please select a smaller file.");
      return;
    }
    setBookingFormData((prev) => {
      const updated = [...(prev.applicants || [])];
      while (updated.length <= index) {
        updated.push({
          fullName: "",
          nationality: "",
          idNumber: "",
          bodyWeightKg: "",
          luggageKg: "",
          email: "",
          phoneCode: "+977",
          phone: "",
          preferredDate: "",
          pickupHotel: "",
          passportFile: null,
          photoFile: null,
          flightFile: null,
          hotelFile: null,
          insuranceFile: null,
        });
      }
      updated[index] = { ...updated[index], [docType]: file };
      return { ...prev, applicants: updated };
    });
  };

  const handleApplicantChange = (
    index: number,
    field: keyof HeliApplicant,
    value: any
  ) => {
    setBookingFormData((prev) => {
      const updated = [...(prev.applicants || [])];
      while (updated.length <= index) {
        updated.push({
          fullName: "",
          nationality: "",
          idNumber: "",
          bodyWeightKg: "",
          luggageKg: "",
          email: "",
          phoneCode: "+977",
          phone: "",
          preferredDate: "",
          pickupHotel: "",
          passportFile: null,
          photoFile: null,
          flightFile: null,
          hotelFile: null,
          insuranceFile: null,
        });
      }
      updated[index] = { ...updated[index], [field]: value };

      const syncExtra: Partial<typeof prev> = {};
      if (index === 0) {
        if (field === "fullName") syncExtra.fullName = value;
        if (field === "nationality") syncExtra.nationality = value;
        if (field === "idNumber") syncExtra.idNumber = value;
        if (field === "bodyWeightKg") syncExtra.bodyWeightKg = value;
        if (field === "luggageKg") syncExtra.luggageKg = value;
        if (field === "email") syncExtra.email = value;
        if (field === "phoneCode") syncExtra.phoneCode = value;
        if (field === "phone") syncExtra.phone = value;
        if (field === "preferredDate") syncExtra.preferredDate = value;
        if (field === "pickupHotel") syncExtra.pickupHotel = value;
      }
      return { ...prev, ...syncExtra, applicants: updated };
    });

    const errorKey = `applicant_${index}_${field}`;
    if (touchedFields[errorKey]) {
      const err = validateApplicantField(field, value, index);
      setFormErrors((prev) => ({ ...prev, [errorKey]: err }));
    }
  };

  const handleApplicantBlur = (index: number, field: keyof HeliApplicant) => {
    const errorKey = `applicant_${index}_${field}`;
    setTouchedFields((prev) => ({ ...prev, [errorKey]: true }));
    const val = bookingFormData.applicants?.[index]?.[field] || "";
    const err = validateApplicantField(field, val, index);
    setFormErrors((prev) => ({ ...prev, [errorKey]: err }));
  };

  const handleUpdateSeatCount = (newCount: number) => {
    if (!bookingTour) return;
    const clamped = Math.min(5, Math.max(1, newCount));
    setBookingSeatCount(clamped);
    setActiveApplicantIndex((prev) => Math.min(prev, clamped - 1));
    if (bookingFlightOption === "sharing") {
      setBookingTotalPriceNPR(bookingTour.sharingPriceNPR * clamped);
    }
    setBookingFormData((prev) => {
      const nextApplicants: HeliApplicant[] = [];
      const primaryDate = prev.applicants?.[0]?.preferredDate || prev.preferredDate || "";
      const primaryHotel = prev.applicants?.[0]?.pickupHotel || prev.pickupHotel || "";
      for (let i = 0; i < clamped; i++) {
        nextApplicants.push(
          prev.applicants?.[i] || {
            fullName: "",
            nationality: "",
            idNumber: "",
            bodyWeightKg: "",
            luggageKg: "",
            email: "",
            phoneCode: "+977",
            phone: "",
            preferredDate: primaryDate,
            pickupHotel: primaryHotel,
            passportFile: null,
            photoFile: null,
            flightFile: null,
            hotelFile: null,
            insuranceFile: null,
          }
        );
      }
      return { ...prev, applicants: nextApplicants };
    });
  };

  const handleFieldChange = (field: string, value: any) => {
    setBookingFormData((prev) => ({ ...prev, [field]: value }));
    if (touchedFields[field]) {
      const err = validateHeliField(field, value);
      setFormErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const err = validateHeliField(field, (bookingFormData as any)[field]);
    setFormErrors((prev) => ({ ...prev, [field]: err }));
  };

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // Share popup state
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isShareCopied, setIsShareCopied] = useState<boolean>(false);
  const shareDropdownRef = useRef<HTMLDivElement>(null);
  const passportRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const flightRef = useRef<HTMLInputElement>(null);
  const hotelRef = useRef<HTMLInputElement>(null);
  const insuranceRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState<
    "form" | "payment" | "submitted"
  >("form");

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "esewa" | "pay_later"
  >("esewa");

  const [paymentStatus, setPaymentStatus] = useState<
    "unpaid" | "paid"
  >("unpaid");

  const [isProcessingPayment, setIsProcessingPayment] =
    useState<boolean>(false);

  const [paymentError, setPaymentError] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        shareDropdownRef.current &&
        !shareDropdownRef.current.contains(e.target as Node)
      ) {
        setIsShareOpen(false);
      }
    };
    if (isShareOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isShareOpen]);

  const handleCopyTourLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Sync scroll to top on navigation
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectTour = (tour: HeliPackageItem) => {
    navigate(`/service/heli-services/${tour.id}`);
    setActiveDetailTab("OVERVIEW");
    scrollToTop();
  };

  const handleBackToListing = () => {
    navigate("/service/heli-services");
    scrollToTop();
  };

  // Restore booking modal state after login
  const hasRestoredPostLoginRef = useRef<boolean>(false);
  useEffect(() => {
    if (!isSessionValid() || hasRestoredPostLoginRef.current) return;

    const savedState = (location.state as any) || (() => {
      try {
        const raw = sessionStorage.getItem("post_login_state");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    if (savedState?.openBooking) {
      const targetTour =
        selectedTour ||
        (savedState.packageId
          ? heliPackages.find(
              (t) =>
                String(t.id).toLowerCase() === String(savedState.packageId).toLowerCase() ||
                String(t.backendId) === String(savedState.packageId) ||
                t.slug?.toLowerCase() === String(savedState.packageId).toLowerCase()
            )
          : null);

      if (targetTour) {
        hasRestoredPostLoginRef.current = true;
        if (savedState.bookingType === "priceModel" || savedState.pricingTierId) {
          handlePriceModelBookNow(
            {
              flightType: savedState.flightType || "charter",
              seatCount: Number(savedState.seatCount) || 1,
              totalPriceNPR:
                Number(savedState.totalPriceNPR) ||
                (savedState.flightType === "sharing"
                  ? targetTour.sharingPriceNPR
                  : targetTour.charterPriceNPR),
              pricingTierId: Number(savedState.pricingTierId) || 0,
            },
            true
          );
        } else {
          handleOpenBooking(targetTour, savedState.flightType || "charter", true);
        }

        try {
          sessionStorage.removeItem("post_login_state");
          sessionStorage.removeItem("post_login_redirect");
        } catch {}
      }
    }
  }, [selectedTour, heliPackages, location.state]);

  // Open booking modal with authentication verification
  const handleOpenBooking = (
    tour: HeliPackageItem,
    option: "charter" | "sharing" = "charter",
    skipAuthCheck: boolean = false
  ) => {
    if (!skipAuthCheck && !isSessionValid()) {
      clearAuthSession();
      const returnState = {
        from: location.pathname + location.search,
        packageId: tour.id,
        openBooking: true,
        isHeliBooking: true,
        bookingType: "openBooking",
        flightType: option,
        seatCount: 1,
        totalPriceNPR: option === "charter" ? tour.charterPriceNPR : tour.sharingPriceNPR,
      };
      try {
        sessionStorage.setItem("post_login_redirect", location.pathname + location.search);
        sessionStorage.setItem("post_login_state", JSON.stringify(returnState));
      } catch (err) {
        console.error("Failed to store post-login state in sessionStorage", err);
      }
      navigate("/login", {
        state: returnState,
      });
      return;
    }

    const storedUser = (() => {
      try {
        const u = localStorage.getItem("user");
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    })();

    const initialName = storedUser?.name || storedUser?.fullName || "";
    const initialEmail = storedUser?.email || "";
    const initialPhone = storedUser?.phone || "";
    const initialNationality = storedUser?.nationality || "";

    const seatCount = 1;
    setBookingTour(tour);
    setBookingFlightOption(option);
    setBookingSeatCount(seatCount);
    setActiveApplicantIndex(0);
    setBookingTotalPriceNPR(option === "charter" ? tour.charterPriceNPR : tour.sharingPriceNPR);
    setBookingFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || initialName,
      email: prev.email || initialEmail,
      phone: prev.phone || initialPhone,
      nationality: prev.nationality || initialNationality,
      applicants: Array.from(
        { length: seatCount },
        (_, i) =>
          prev.applicants?.[i] || {
            fullName: i === 0 ? (prev.fullName || initialName) : "",
            nationality: i === 0 ? (prev.nationality || initialNationality) : "",
            idNumber: i === 0 ? prev.idNumber : "",
            bodyWeightKg: i === 0 ? prev.bodyWeightKg : "",
            luggageKg: i === 0 ? prev.luggageKg : "",
            email: i === 0 ? (prev.email || initialEmail) : "",
            phoneCode: i === 0 ? prev.phoneCode || "+977" : "+977",
            phone: i === 0 ? (prev.phone || initialPhone) : "",
            preferredDate: prev.preferredDate || "",
            pickupHotel: prev.pickupHotel || "",
            passportFile: null,
            photoFile: null,
            flightFile: null,
            hotelFile: null,
            insuranceFile: null,
          }
      ),
    }));
    setFormErrors({});
    setTouchedFields({});
    setIsSubmitted(false);
    setBookingId(null);
    setSubmissionId("");
    setSubmittedAt("");
    setCurrentStep("form");
    setSelectedPaymentMethod("esewa");
    setPaymentStatus("unpaid");
    setPaymentError("");
    setIsProcessingPayment(false);
    setIsBookingModalOpen(true);
  };

  // Handler for PriceModel book now trigger with authentication verification
  const handlePriceModelBookNow = (
    details: {
      flightType: "charter" | "sharing";
      seatCount: number;
      totalPriceNPR: number;
      formattedPrice?: string;
      pricingTierId: number;
    },
    skipAuthCheck: boolean = false
  ) => {
    if (!selectedTour) return;

    if (!skipAuthCheck && !isSessionValid()) {
      clearAuthSession();
      const returnState = {
        from: location.pathname + location.search,
        packageId: selectedTour.id,
        openBooking: true,
        isHeliBooking: true,
        bookingType: "priceModel",
        flightType: details.flightType,
        seatCount: details.seatCount,
        totalPriceNPR: details.totalPriceNPR,
        pricingTierId: details.pricingTierId,
      };
      try {
        sessionStorage.setItem("post_login_redirect", location.pathname + location.search);
        sessionStorage.setItem("post_login_state", JSON.stringify(returnState));
      } catch (err) {
        console.error("Failed to store post-login state in sessionStorage", err);
      }
      navigate("/login", {
        state: returnState,
      });
      return;
    }

    const storedUser = (() => {
      try {
        const u = localStorage.getItem("user");
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    })();

    const initialName = storedUser?.name || storedUser?.fullName || "";
    const initialEmail = storedUser?.email || "";
    const initialPhone = storedUser?.phone || "";
    const initialNationality = storedUser?.nationality || "";

    const seatCount = details.flightType === "charter" ? 1 : Math.max(1, details.seatCount || 1);
    setBookingTour(selectedTour);
    setBookingFlightOption(details.flightType);
    setBookingSeatCount(seatCount);
    setActiveApplicantIndex(0);
    setBookingTotalPriceNPR(details.totalPriceNPR);
    setBookingPricingTierId(details.pricingTierId);
    setBookingFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || initialName,
      email: prev.email || initialEmail,
      phone: prev.phone || initialPhone,
      nationality: prev.nationality || initialNationality,
      applicants: Array.from(
        { length: seatCount },
        (_, i) =>
          prev.applicants?.[i] || {
            fullName: i === 0 ? (prev.fullName || initialName) : "",
            nationality: i === 0 ? (prev.nationality || initialNationality) : "",
            idNumber: i === 0 ? prev.idNumber : "",
            bodyWeightKg: i === 0 ? prev.bodyWeightKg : "",
            luggageKg: i === 0 ? prev.luggageKg : "",
            email: i === 0 ? (prev.email || initialEmail) : "",
            phoneCode: i === 0 ? prev.phoneCode || "+977" : "+977",
            phone: i === 0 ? (prev.phone || initialPhone) : "",
            preferredDate: prev.preferredDate || "",
            pickupHotel: prev.pickupHotel || "",
            passportFile: null,
            photoFile: null,
            flightFile: null,
            hotelFile: null,
            insuranceFile: null,
          }
      ),
    }));
    setFormErrors({});
    setTouchedFields({});
    setIsSubmitted(false);
    setBookingId(null);
    setSubmissionId("");
    setSubmittedAt("");
    setCurrentStep("form");
    setSelectedPaymentMethod("esewa");
    setPaymentStatus("unpaid");
    setPaymentError("");
    setIsProcessingPayment(false);
    setIsBookingModalOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paxCount = bookingFlightOption === "charter" ? 1 : Math.max(1, bookingSeatCount || 1);
    const errors: Record<string, string | undefined> = {};
    const allTouched: Record<string, boolean> = { ...touchedFields };

    for (let i = 0; i < paxCount; i++) {
      const applicant = bookingFormData.applicants?.[i] || {
        fullName: "",
        nationality: "",
        idNumber: "",
        bodyWeightKg: "",
        luggageKg: "",
        email: "",
        phoneCode: "+977",
        phone: "",
        preferredDate: "",
        pickupHotel: "",
        passportFile: null,
        photoFile: null,
        flightFile: null,
        hotelFile: null,
        insuranceFile: null,
      };

      const applicantFields: (keyof HeliApplicant)[] = [
        "fullName",
        "nationality",
        "idNumber",
        "bodyWeightKg",
        "luggageKg",
        "email",
        "phone",
        "preferredDate",
      ];

      applicantFields.forEach((f) => {
        const errKey = `applicant_${i}_${f}`;
        allTouched[errKey] = true;
        const err = validateApplicantField(f, applicant[f], i);
        if (err) errors[errKey] = err;
      });
    }

    allTouched["termsAgreed"] = true;
    const termsErr = validateHeliField("termsAgreed", bookingFormData.termsAgreed);
    if (termsErr) errors["termsAgreed"] = termsErr;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setTouchedFields(allTouched);

      for (let i = 0; i < paxCount; i++) {
        const hasErr = Object.keys(errors).some((k) => k.startsWith(`applicant_${i}_`));
        if (hasErr) {
          setActiveApplicantIndex(i);
          break;
        }
      }
      return;
    }

    setFormErrors({});
    if (isSubmitting) return;
    setIsSubmitting(true);
    setPaymentError("");

    try {
      const primaryApplicant = bookingFormData.applicants?.[0];
      const primaryEmail = primaryApplicant?.email || bookingFormData.email || "";
      const primaryPhone = primaryApplicant?.phone || bookingFormData.phone || "";
      const primaryCode = primaryApplicant?.phoneCode || bookingFormData.phoneCode || "+977";
      const primaryPhoneWhatsapp = `${primaryCode} ${primaryPhone}`.trim();
      const primaryDate = primaryApplicant?.preferredDate || bookingFormData.preferredDate || "";
      const primaryHotel = primaryApplicant?.pickupHotel || bookingFormData.pickupHotel || "";

      const data = new FormData();
      data.append("booking_type", "HELI");
      data.append("package_id", String(bookingTour?.backendId));
      data.append("number_of_people", String(bookingFormData.applicants?.length || 1));
      data.append("start_date", primaryDate);
      data.append("frontend_total_amount", String(bookingTotalPriceNPR));
      data.append("payment_method", selectedPaymentMethod === "esewa" ? "eSewa" : "Pay Later");

      if (bookingPricingTierId) {
        data.append("pricing_tier_id", String(bookingPricingTierId));
      }

      // Top-level applicant details
      data.append("applicant[full_name]", primaryApplicant?.fullName || bookingFormData.fullName || "");
      data.append("applicant[email]", primaryEmail);
      data.append("applicant[phone_whatsapp]", primaryPhoneWhatsapp);
      data.append("applicant[nationality]", primaryApplicant?.nationality || bookingFormData.nationality || "");
      if (primaryHotel) {
        data.append("applicant[pickup_hotel]", primaryHotel);
      }

      // Dedicated HELI travellers manifest
      bookingFormData.applicants?.forEach((applicant, index) => {
        const appEmail = applicant?.email || primaryEmail;
        const appPhone = applicant?.phone || primaryPhone;
        const appCode = applicant?.phoneCode || primaryCode;
        const appWhatsapp = `${appCode} ${appPhone}`.trim();
        const appDate = applicant?.preferredDate || primaryDate;
        const appHotel = applicant?.pickupHotel || primaryHotel;

        data.append(`travellers[${index}][name]`, applicant?.fullName || "");
        data.append(`travellers[${index}][email]`, appEmail);
        data.append(`travellers[${index}][whatsapp_phone]`, appWhatsapp);
        data.append(`travellers[${index}][preferred_flight_date]`, appDate);
        data.append(`travellers[${index}][nationality]`, applicant?.nationality || "");
        data.append(`travellers[${index}][identity_number]`, applicant?.idNumber || "");

        if (appHotel) {
          data.append(`travellers[${index}][pickup_hotel]`, appHotel);
        }

        if (applicant?.bodyWeightKg) {
          data.append(`travellers[${index}][weight]`, String(applicant.bodyWeightKg));
        }

        if (applicant?.luggageKg) {
          data.append(`travellers[${index}][luggage]`, String(applicant.luggageKg));
        }

        if (applicant?.passportFile) {
          data.append(`travellers[${index}][passport_nid_image]`, applicant.passportFile);
        }

        if (applicant?.photoFile) {
          data.append(`travellers[${index}][pp_size_photo]`, applicant.photoFile);
        }

        if (applicant?.flightFile) {
          data.append(`travellers[${index}][confirmed_flight_ticket_image]`, applicant.flightFile);
        }

        if (applicant?.insuranceFile) {
          data.append(`travellers[${index}][travel_insurance_image]`, applicant.insuranceFile);
        }
      });

      const response = await createBooking(data);
      const booking = response?.data?.data || response?.data;

      if (!booking?.id) {
        throw new Error("Booking ID was not returned by the backend.");
      }

      setBookingId(Number(booking.id));
      setSubmissionId(booking.booking_reference || "");
      setSubmittedAt(
        new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      );
      setPaymentStatus("unpaid");
      setSelectedPaymentMethod("esewa");
      setPaymentError("");
      setCurrentStep("payment");
    } catch (error: any) {
      console.error("Booking failed:", error?.response?.data || error);

      const validationErrors = error?.response?.data?.errors;
      let errorMsg = error?.response?.data?.message || error?.message || "Failed to create booking. Please try again.";
      if (validationErrors && typeof validationErrors === "object") {
        const firstErr = Object.values(validationErrors).flat()[0];
        if (firstErr) {
          errorMsg = String(firstErr);
        }
      }

      setPaymentError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Print quotation dossier from Details View (Isolated iframe guarantees single-page print without empty 2nd page)
  const handlePrintQuotation = () => {
    const dossierEl = document.getElementById("heli-print-dossier");
    if (!dossierEl) {
      window.print();
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>${selectedTour?.title || "Heli Tour"} - Quotation Slip - Trip Himalaya</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            @page {
              size: A4 portrait;
              margin: 4mm 6mm;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            html, body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              background: #fff;
              color: #1e293b;
              margin: 0;
              padding: 0;
              height: auto;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-wrapper {
              width: 100%;
              position: relative;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
          </style>
        </head>
        <body>
          <div class="print-wrapper">
            ${dossierEl.innerHTML}
          </div>
        </body>
        </html>
      `);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1200);
      }, 350);
    } else {
      window.print();
    }
  };

  const handleEsewaPayment = async () => {
    if (!bookingId) {
      setPaymentError("Booking ID is missing. Please create the booking again.");
      return;
    }

    try {
      setPaymentError("");
      setIsProcessingPayment(true);
      setSelectedPaymentMethod("esewa");

      const response = await initiatePayment({
        booking_id: bookingId,
        provider: "ESEWA",
      });
      const paymentData = response?.data?.data;

      if (!paymentData?.payment_url) {
        throw new Error("eSewa payment URL was not returned.");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentData.payment_url;

      const fields = {
        amount: paymentData.amount,
        tax_amount: paymentData.tax_amount,
        total_amount: paymentData.total_amount,
        transaction_uuid: paymentData.transaction_uuid,
        product_code: paymentData.product_code,
        product_service_charge: paymentData.product_service_charge,
        product_delivery_charge: paymentData.product_delivery_charge,
        success_url: paymentData.success_url,
        failure_url: paymentData.failure_url,
        signed_field_names: paymentData.signed_field_names,
        signature: paymentData.signature,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value ?? "");
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error("eSewa payment initiation failed:", error?.response?.data || error);

      setPaymentError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to initiate eSewa payment. Please try again."
      );
      setIsProcessingPayment(false);
    }
  };

  const handlePayLater = async () => {
    try {
      setIsProcessingPayment(true);
      setSelectedPaymentMethod("pay_later");
      setPaymentError("");

      if (bookingId) {
        try {
          await initiatePayment({
            booking_id: bookingId,
            provider: "PAYLATER",
          });
        } catch (err) {
          console.warn("Pay Later payment initiation note:", err);
        }
      }

      setPaymentStatus("unpaid");
      setCurrentStep("submitted");
    } catch (error: any) {
      console.error("Pay Later selection failed:", error);
      setPaymentError(error?.message || "Failed to proceed with Pay Later.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Print booking receipt / slip from Modal (Matches Tour Package PDF/Print Slip exactly)
  const handlePrintBookingSlip = () => {
    const formattedTotal = displayPrice(
      bookingTotalPriceNPR,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );

    const flightTypeLabel =
      bookingFlightOption === "charter" ? "Private Charter" : "Sharing Heli Service";

    const paxCount = Math.max(1, bookingSeatCount || 1);

    const applicantRows = Array.from({ length: paxCount }, (_, idx) => {
      const app = bookingFormData.applicants?.[idx] || {
        fullName: bookingFormData.fullName,
        nationality: bookingFormData.nationality,
        idNumber: bookingFormData.idNumber,
        bodyWeightKg: bookingFormData.bodyWeightKg,
        luggageKg: bookingFormData.luggageKg,
      };
      const isLead = idx === 0;
      return `
        <tr>
          <td style="font-size:8.5px; font-weight:700; text-align:center; color:#475569; background:#ffffff; border:1px solid #cbd5e1; padding:5px 6px;">${idx + 1}</td>
          <td style="font-size:9.5px; font-weight:700; color:#0f172a; background:#ffffff; border:1px solid #cbd5e1; padding:5px 8px;">
            ${app.fullName || (isLead ? bookingFormData.fullName : `Passenger ${idx + 1}`)}
            ${isLead ? '<span style="font-size:7.5px; font-weight:800; text-transform:uppercase; background:#fdf2f8; color:#be185d; border:1px solid #fbcfe8; padding:1px 5px; border-radius:3px; margin-left:5px;">Lead Pax</span>' : ''}
          </td>
          <td style="font-size:9px; color:#334155; background:#ffffff; border:1px solid #cbd5e1; padding:5px 8px;">${app.nationality || bookingFormData.nationality || "Nepali / International"}</td>
          <td style="font-size:9px; font-family:'Courier New', monospace; font-weight:600; color:#0f172a; background:#ffffff; border:1px solid #cbd5e1; padding:5px 8px;">${app.idNumber || bookingFormData.idNumber || "-"}</td>
          <td style="font-size:9px; font-weight:700; text-align:center; color:#0f172a; background:#ffffff; border:1px solid #cbd5e1; padding:5px 8px;">${app.bodyWeightKg || bookingFormData.bodyWeightKg || "-"} kg</td>
          <td style="font-size:9px; font-weight:600; text-align:center; color:#0f172a; background:#ffffff; border:1px solid #cbd5e1; padding:5px 8px;">${app.luggageKg ? `${app.luggageKg} kg` : "0 kg"}</td>
        </tr>
      `;
    }).join("");

    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Heli_Flight_Booking_Slip_${submissionId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          @page {
            size: A4 portrait;
            margin: 0;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #fff;
            color: #0f172a;
            font-size: 11.5px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* â”€â”€ PAGE WRAPPER â”€â”€ */
          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 12mm 14mm 10mm 14mm;
            display: flex;
            flex-direction: column;
            gap: 0;
            position: relative;
            background: #fff;
          }

          /* â”€â”€ WATERMARK â”€â”€ */
          .watermark-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            user-select: none;
            z-index: 999;
          }
          .watermark {
            transform: rotate(-28deg);
            font-size: 38px;
            font-weight: 900;
            color: rgba(45, 19, 71, 0.06);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            line-height: 2.2;
            white-space: nowrap;
            text-align: center;
            mix-blend-mode: multiply;
          }

          /* â”€â”€ LETTERHEAD â”€â”€ */
          .letterhead {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 9px;
            border-bottom: 2.5px solid #0f172a;
            margin-bottom: 10px;
          }
          .lh-left {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .logo-img {
            height: 75px;
            width: auto;
            object-fit: contain;
            flex-shrink: 0;
          }
          .company-name-block {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .company-name-main {
            font-size: 15.5px;
            font-weight: 900;
            letter-spacing: -0.3px;
            line-height: 1.1;
            color: #0f172a;
          }
          .company-name-main .name-pink {
            color: #0f172a;
          }
          .company-tagline {
            font-size: 9px;
            color: #475569;
            font-weight: 600;
            margin-top: 3px;
          }
          .company-contact-row {
            font-size: 8.5px;
            color: #475569;
            margin-top: 2px;
            font-weight: 500;
          }
          .lh-right {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
          }
          .official-badge {
            display: inline-block;
            border: 1.5px solid #0f172a;
            color: #0f172a;
            font-size: 8.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 3px 9px;
            border-radius: 4px;
          }
          .slip-date {
            font-size: 9px;
            color: #64748b;
            font-weight: 600;
          }

          /* â”€â”€ DOC TITLE BAND â”€â”€ */
          .title-band {
            background: #0f172a;
            color: #fff;
            padding: 8px 12px;
            margin-bottom: 10px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .title-band h1 {
            font-size: 12.5px;
            font-weight: 800;
            letter-spacing: 0.3px;
            text-transform: uppercase;
          }
          .title-band .destination {
            font-size: 9.5px;
            color: #e2e8f0;
            font-weight: 600;
            margin-top: 1px;
          }
          .title-band .doc-id {
            text-align: right;
          }
          .title-band .doc-id-label {
            font-size: 7.5px;
            color: #94a3b8;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .title-band .doc-id-val {
            font-family: 'Courier New', monospace;
            font-size: 11.5px;
            font-weight: 700;
            color: #fff;
            letter-spacing: 0.5px;
          }

          /* â”€â”€ REFERENCE BOX â”€â”€ */
          .ref-box {
            display: flex;
            align-items: stretch;
            border: 1px solid #cbd5e1;
            border-radius: 5px;
            overflow: hidden;
            margin-bottom: 10px;
            background: #f8fafc;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .ref-accent {
            width: 5px;
            background: #0f172a;
            flex-shrink: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .ref-content {
            flex: 1;
            padding: 7px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .ref-label {
            font-size: 8px;
            font-weight: 800;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.7px;
            margin-bottom: 2px;
          }
          .ref-value {
            font-family: 'Courier New', monospace;
            font-size: 16px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: 0.8px;
          }
          .ref-meta-block {
            text-align: right;
          }
          .ref-status-tag {
            display: inline-block;
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #065f46;
            background: #d1fae5;
            border: 1px solid #a7f3d0;
            border-radius: 4px;
            padding: 2px 8px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .ref-meta-sub {
            font-size: 8px;
            color: #64748b;
            margin-top: 2px;
            font-weight: 600;
          }

          /* â”€â”€ SECTION HEADING â”€â”€ */
          .section-heading {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
            margin-top: 9px;
          }
          .section-heading .sh-line {
            flex: 1;
            height: 1px;
            background: #cbd5e1;
          }
          .section-heading .sh-text {
            font-size: 8.5px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            white-space: nowrap;
          }

          /* â”€â”€ DETAIL TABLE â”€â”€ */
          .detail-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            margin-bottom: 3px;
          }
          .detail-table th, .detail-table td {
            padding: 5px 9px;
            border: 1px solid #cbd5e1;
            vertical-align: middle;
            word-wrap: break-word;
          }
          .td-label {
            font-size: 8px;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            width: 22%;
            background: #f8fafc !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .td-value {
            font-size: 9.5px;
            font-weight: 600;
            color: #0f172a;
            width: 28%;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            line-height: 1.35;
          }
          .td-value.mono { font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700; }
          .td-value.accent { color: #0f172a; font-weight: 800; font-size: 10px; }
          .td-value.fee {
            color: #831843;
            background: #fff5f7 !important;
            border-color: #f472b6 !important;
          }

          /* â”€â”€ NOTICE BOX â”€â”€ */
          .notice-box {
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 5px;
            padding: 8px 11px;
            margin-top: 9px;
            font-size: 9.5px;
            color: #1e293b;
            line-height: 1.45;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .notice-box strong { color: #0f172a; }

          /* â”€â”€ CHECKLIST â”€â”€ */
          .checklist-box {
            border: 1px solid #cbd5e1;
            border-radius: 5px;
            padding: 8px 11px;
            margin-top: 8px;
            background: #f8fafc;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .checklist-title {
            font-size: 8px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 5px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 3px;
          }
          .checklist-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3px 18px;
          }
          .checklist-item {
            display: flex;
            align-items: flex-start;
            gap: 5px;
            font-size: 9px;
            color: #334155;
            line-height: 1.4;
          }
          .ci-icon {
            color: #0f172a;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 1px;
          }

          /* â”€â”€ INFO CARD GRID â”€â”€ */
          .info-card-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5px;
            margin-bottom: 4px;
          }
          .info-card-grid.cols-3 {
            grid-template-columns: repeat(3, 1fr);
          }
          .info-card-grid.cols-2 {
            grid-template-columns: repeat(2, 1fr);
          }
          .info-card {
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            padding: 5px 7px 6px 7px;
            background: #f8fafc;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            min-width: 0;
          }
          .info-card.span2 {
            grid-column: span 2;
          }
          .ic-label {
            font-size: 7.5px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .ic-value {
            font-size: 9.5px;
            font-weight: 700;
            color: #0f172a;
            line-height: 1.3;
            word-break: break-word;
          }
          .ic-value.mono {
            font-family: 'Courier New', monospace;
            font-size: 9px;
            font-weight: 700;
          }
          .ic-value.accent {
            font-size: 10px;
            font-weight: 800;
            color: #0f172a;
          }
          .ic-value.pink {
            color: #be185d;
            font-weight: 800;
            display: inline-block;
            background: #fdf2f8;
            padding: 1px 6px;
            border-radius: 4px;
            border: 1px solid #fbcfe8;
            font-size: 9px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* â”€â”€ FARE HIGHLIGHT BOX â”€â”€ */
          .fare-box {
            border: 1.5px solid #f9a8d4;
            border-radius: 6px;
            background: #fdf2f8;
            padding: 7px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 5px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .fare-label {
            font-size: 8px;
            font-weight: 800;
            color: #9d174d;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 2px;
          }
          .fare-amount {
            font-size: 15px;
            font-weight: 900;
            color: #831843;
            font-family: 'Inter', sans-serif;
            letter-spacing: -0.3px;
          }
          .fare-note {
            font-size: 7.5px;
            color: #be185d;
            font-weight: 600;
            text-align: right;
            max-width: 180px;
            line-height: 1.4;
          }

          /* â”€â”€ FOOTER â”€â”€ */
          .doc-footer {
            margin-top: auto;
            padding-top: 8px;
            border-top: 1.5px solid #0f172a;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 8px;
            color: #475569;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="watermark-wrapper"><div class="watermark">Trip Himalaya Tours and Travels</div></div>

          <!-- LETTERHEAD -->
          <div class="letterhead">
            <div class="lh-left">
              <img src="${THTTLogo}" class="logo-img" alt="Trip Himalaya Tours and Travels" />
              <div class="company-name-block">
                <div class="company-name-main">Trip Himalaya <span class="name-pink">Tours &amp; Travels Pvt. Ltd.</span></div>
                <div class="company-tagline">Govt. Approved Travel &amp; Tour Counseling Agency</div>
                <div class="company-contact-row">Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal &nbsp;|&nbsp; 977-9851420882 &nbsp;|&nbsp; dev.triphimalayatt@gmail.com &nbsp;|&nbsp; www.triphimalaya.com.np</div>
              </div>
            </div>
            <div class="lh-right">
              <div class="official-badge">Official Document</div>
              <div class="slip-date">Issued: ${submittedAt}</div>
            </div>
          </div>

          <!-- DOC TITLE BAND -->
          <div class="title-band">
            <div>
              <h1>Heli Flight Booking Confirmation Slip</h1>
              <div class="destination">Flight Sector: ${bookingTour?.title || "Heli Service"} &nbsp;/&nbsp; ${flightTypeLabel}</div>
            </div>
            <div class="doc-id">
              <div class="doc-id-label">Document ID</div>
              <div class="doc-id-val">${submissionId}</div>
            </div>
          </div>

          <!-- SUBMISSION REFERENCE -->
          <div class="ref-box">
            <div class="ref-accent"></div>
            <div class="ref-content">
              <div>
                <div class="ref-label">Official Submission Reference Number</div>
                <div class="ref-value">${submissionId}</div>
              </div>
              <div class="ref-meta-block">
                <div class="ref-status-tag">Verified System Submission</div>
                <div class="ref-meta-sub">${flightTypeLabel} &bull; Issued ${submittedAt}</div>
              </div>
            </div>
          </div>

          <!-- APPLICANT DETAILS -->
          <div class="section-heading">
            <div class="sh-text">Lead Passenger &amp; Contact Details</div>
            <div class="sh-line"></div>
          </div>
          <div class="info-card-grid">
            <div class="info-card">
              <div class="ic-label">Lead Passenger</div>
              <div class="ic-value accent">${bookingFormData.fullName || "-"}</div>
            </div>
            <div class="info-card">
              <div class="ic-label">Nationality</div>
              <div class="ic-value">${bookingFormData.nationality || "Nepali / International"}</div>
            </div>
            <div class="info-card">
              <div class="ic-label">Total Passengers</div>
              <div class="ic-value mono">${paxCount} Passenger(s)</div>
            </div>
            <div class="info-card">
              <div class="ic-label">Preferred Flight Date</div>
              <div class="ic-value accent">${bookingFormData.preferredDate || "Immediate"}</div>
            </div>
            <div class="info-card">
              <div class="ic-label">Contact / WhatsApp</div>
              <div class="ic-value mono">${bookingFormData.phone ? `${bookingFormData.phoneCode} ${bookingFormData.phone}` : "-"}</div>
            </div>
            <div class="info-card span2">
              <div class="ic-label">Email Address</div>
              <div class="ic-value">${bookingFormData.email || "-"}</div>
            </div>
            <div class="info-card">
              <div class="ic-label">Passport / ID Number</div>
              <div class="ic-value mono">${bookingFormData.idNumber || "-"}</div>
            </div>
            <div class="info-card span2">
              <div class="ic-label">Pickup Hotel / Location</div>
              <div class="ic-value">${bookingFormData.pickupHotel || "Kathmandu Valley / Airport"}</div>
            </div>
          </div>

          <!-- HELI SERVICE DETAILS -->
          <div class="section-heading">
            <div class="sh-text">Heli Flight Service &amp; Fare Details</div>
            <div class="sh-line"></div>
          </div>
          <div class="info-card-grid cols-3">
            <div class="info-card span2">
              <div class="ic-label">Tour / Heli Package</div>
              <div class="ic-value accent">${bookingTour?.title || "Heli Tour"}</div>
            </div>
            <div class="info-card">
              <div class="ic-label">Flight Option</div>
              <div class="ic-value"><span class="ic-value pink">${flightTypeLabel}</span></div>
            </div>
            <div class="info-card">
              <div class="ic-label">Duration</div>
              <div class="ic-value">${bookingTour?.duration || "Standard"}</div>
            </div>
            <div class="info-card">
              <div class="ic-label">Max Altitude</div>
              <div class="ic-value">${bookingTour?.maxAltitude || "Himalayan Base"}</div>
            </div>
            <div class="info-card">
              <div class="ic-label">Heli Route / Base</div>
              <div class="ic-value">${bookingTour?.location || "Nepal Himalayas"}</div>
            </div>
          </div>
          <div class="fare-box">
            <div>
              <div class="fare-label">Total Estimated Fare</div>
              <div class="fare-amount">${formattedTotal}</div>
            </div>
            <div class="fare-note">All-inclusive<br>CAAN passenger fee, airport charges &amp; aviation taxes</div>
          </div>

          <!-- CAAN PASSENGER MANIFEST & WEIGHT DETAILS -->
          <div class="section-heading">
            <div class="sh-text">CAAN Flight &amp; Passenger Manifest</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <thead>
              <tr style="background:#0f172a; color:#fff;">
                <th style="font-size:8px; font-weight:800; text-transform:uppercase; color:#fff; padding:4.5px 6px; width:30px; text-align:center;">#</th>
                <th style="font-size:8px; font-weight:800; text-transform:uppercase; color:#fff; padding:4.5px 8px; text-align:left; width:32%;">Passenger Full Name</th>
                <th style="font-size:8px; font-weight:800; text-transform:uppercase; color:#fff; padding:4.5px 8px; text-align:left; width:20%;">Nationality</th>
                <th style="font-size:8px; font-weight:800; text-transform:uppercase; color:#fff; padding:4.5px 8px; text-align:left; width:22%;">ID / Passport</th>
                <th style="font-size:8px; font-weight:800; text-transform:uppercase; color:#fff; padding:4.5px 8px; text-align:center; width:13%;">Body Wt.</th>
                <th style="font-size:8px; font-weight:800; text-transform:uppercase; color:#fff; padding:4.5px 8px; text-align:center; width:13%;">Luggage</th>
              </tr>
            </thead>
            <tbody>
              ${applicantRows}
            </tbody>
          </table>

          <!-- OFFICER NOTICE -->
          <div class="notice-box">
            <strong>Next Step:</strong> Our dedicated <strong>Heli Flight Operations Officer</strong> will contact you within <strong>15-30 minutes</strong> via WhatsApp or phone call to verify passenger manifests, coordinate Tribhuvan International Airport (TIA) domestic VIP helipad terminal entry, and confirm CAAN flight slot clearance.
          </div>

          <!-- CHECKLIST -->
          <div class="checklist-box">
            <div class="checklist-title">Heli Flight Preparation Checklist</div>
            <div class="checklist-grid">
              <div class="checklist-item"><span class="ci-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span> Original Passport or National ID Card (Mandatory for airport security check)</div>
              <div class="checklist-item"><span class="ci-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span> Flight booking confirmation slip (printed / digital copy)</div>
              <div class="checklist-item"><span class="ci-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span> High-altitude windproof down jacket &amp; 100% UV sunglasses</div>
              <div class="checklist-item"><span class="ci-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span> Accurate payload declaration (Luggage limited to max 20 kg per passenger)</div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="doc-footer">
            <div class="footer-left">
              This is a system-generated confirmation slip. No physical signature is required.<br>
              24/7 Heli Operations Desk: 977-9851420882 &nbsp;|&nbsp; dev.triphimalayatt@gmail.com &nbsp;|&nbsp; www.triphimalaya.com.np
            </div>
            <div class="footer-right">
              Trip Himalaya Tours &amp; Travels<br>
              Ref: ${submissionId} &nbsp;|&nbsp; ${submittedAt}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printContent);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1200);
      }, 350);
    } else {
      window.print();
    }
  };

  // Instant WhatsApp Inquiry
  const handleWhatsAppInquiry = (tour: HeliPackageItem) => {
    const basePrice = displayPrice(
      tour.packagePriceNPR,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );
    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Heli Operations Desk)! I am interested in booking "${tour.title}" (${tour.location}, Duration: ${tour.duration}). Starting price: ${basePrice}. Please share current flight availability and CAAN slot details.`
    );
    window.open(`https://wa.me/9779851420882?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  // â”€â”€â”€ FAST FILTER: applies top-bar Location + Name search + sidebar filters â”€â”€â”€
  const LISTING_PACKAGES = heliPackages;
  const filteredTours = useMemo(() => {
    const locQuery = (filter?.location || "").toLowerCase().trim();
    const nameQuery = (filter?.name || "").toLowerCase().trim();
    const internalQuery = searchQuery.toLowerCase().trim();

    return LISTING_PACKAGES.filter((tour) => {
      // Top-bar location filter (OR: location or description contains keyword)
      const matchesLocation =
        !locQuery ||
        tour.location.toLowerCase().includes(locQuery) ||
        tour.title.toLowerCase().includes(locQuery) ||
        tour.tag.toLowerCase().includes(locQuery);

      // Top-bar name/title filter
      const matchesName =
        !nameQuery ||
        tour.title.toLowerCase().includes(nameQuery) ||
        tour.description.toLowerCase().includes(nameQuery) ||
        tour.tag.toLowerCase().includes(nameQuery);

      // Internal sidebar search query
      const matchesSearch =
        !internalQuery ||
        tour.title.toLowerCase().includes(internalQuery) ||
        tour.location.toLowerCase().includes(internalQuery) ||
        tour.description.toLowerCase().includes(internalQuery) ||
        tour.tripHighlights.some((h) => h.toLowerCase().includes(internalQuery));

      // Price
      const matchesPrice = tour.packagePriceNPR <= priceRange;

      // Rating
      const matchesRating =
        selectedRating === 0 ||
        Math.round(tour.rating || 5) === selectedRating;

      // Keywords
      const matchesKeywords =
        selectedKeywords.length === 0 ||
        selectedKeywords.some((kw) => {
          const kwLower = kw.toLowerCase();
          return (
            tour.title.toLowerCase().includes(kwLower) ||
            tour.location.toLowerCase().includes(kwLower) ||
            tour.tag.toLowerCase().includes(kwLower) ||
            tour.category.toLowerCase().includes(kwLower)
          );
        });

      return (
        matchesLocation &&
        matchesName &&
        matchesSearch &&
        matchesPrice &&
        matchesRating &&
        matchesKeywords
      );
    });
  }, [LISTING_PACKAGES, filter, searchQuery, priceRange, selectedRating, selectedKeywords]);

  const availableKeywords = [
    "EVEREST",
    "ANNAPURNA",
    "LANGTANG",
    "GOSAINKUNDA",
    "MUKTINATH",
    "CHARTER",
    "SHARING",
    "LUXURY",
  ];

  if (packagesLoading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#2D1347] font-bold text-base">Loading helicopter packages...</p>
      </div>
    );
  }

  if (packagesError) {
    return (
      <div className="w-full py-16 text-center text-sm font-bold text-red-500">
        {packagesError}
      </div>
    );
  }

  if (routeTourId && packagesLoading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#2D1347] font-bold text-base">Loading helicopter details...</p>
      </div>
    );
  }

  if (routeTourId && !selectedTour) {
    return (
      <div className="w-full py-16 text-center text-sm font-bold text-gray-500">
        Helicopter package not found.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* â”€â”€ DETAIL VIEW (Matching Image 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {/* ========================================================================= */}
      {selectedTour ? (
        <>
          <div className="w-full space-y-8 print:space-y-0 print:m-0 print:p-0 animate-in fade-in duration-300">
            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
              PRINT-ONLY COMPREHENSIVE DOSSIER & QUOTATION
              Includes all details: Itinerary, Inclusions, Exclusions,
              Restrictions, What to Bring, Pricing, FAQs, and Policies.
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {!isBookingModalOpen && (
              <div
                id="heli-print-dossier"
                className="hidden print:block relative"
                style={{
                  fontFamily: "'Inter', Arial, sans-serif",
                  fontSize: "9px",
                  lineHeight: "1.38",
                  color: "#1e293b",
                  width: "100%",
                  position: "relative",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                  pageBreakAfter: "avoid",
                  breakAfter: "avoid",
                }}
              >
                {/* â”€â”€ BACKGROUND WATERMARK (Contained strictly to single page) â”€â”€ */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      transform: "rotate(-28deg)",
                      fontSize: "36px",
                      fontWeight: 900,
                      color: "rgba(45, 19, 71, 0.05)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      lineHeight: 2.2,
                      whiteSpace: "nowrap",
                      textAlign: "center",
                      mixBlendMode: "multiply",
                    }}
                  >
                    Trip Himalaya Tours and Travels
                  </div>
                </div>

                {/* â”€â”€ 1. CORPORATE LETTERHEAD â”€â”€ */}
                <div style={{ background: "linear-gradient(135deg, #2D1347 0%, #3B145C 50%, #4a1c7a 100%)", borderRadius: "8px 8px 0 0", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                    <div style={{ background: "#ffffff", borderRadius: "6px", padding: "3px 5px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <img src={Logo} alt="Trip Himalaya" style={{ height: "54px", width: "auto", objectFit: "contain", display: "block" }} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: 900, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.01em", margin: 0, whiteSpace: "nowrap" }}>
                        Trip Himalaya Tours &amp; Travel Pvt. Ltd.
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          marginTop: "3px",
                          fontSize: "8px",
                          color: "#f3e8ff",
                          lineHeight: "1.3",
                        }}
                      >
                        {/* Row 1: Address */}
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                          <MapPin size={9} color="#f472b6" style={{ flexShrink: 0 }} />
                          <span>Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal</span>
                        </div>
                        {/* Row 2: Phone + Website */}
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                            <span style={{ color: "#f472b6", fontWeight: 700 }}>Tel:</span>
                            <span>+977 9851420882</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                            <span style={{ color: "#f472b6", fontWeight: 700 }}>Web:</span>
                            <span>www.triphimalaya.com.np</span>
                          </div>
                        </div>
                        {/* Row 3: Email */}
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                          <span style={{ color: "#f472b6", fontWeight: 700 }}>Email:</span>
                          <span>dev.triphimalayatt@gmail.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, whiteSpace: "nowrap", alignSelf: "flex-end", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px", paddingBottom: "2px" }}>
                    <div style={{ fontSize: "8px", background: "rgba(233, 30, 99, 0.25)", color: "#fbcfe8", padding: "2px 7px", borderRadius: "3px", fontWeight: 700, border: "1px solid rgba(233, 30, 99, 0.4)" }}>
                      Helicopter Operations Team
                    </div>
                    <div style={{ fontSize: "8.5px", color: "#e9d5ff", whiteSpace: "nowrap" }}>
                      Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                </div>
                {/* Project brand accent strip */}
                <div style={{ height: "3px", background: "linear-gradient(90deg, #E91E63 0%, #db2777 30%, #9333ea 70%, #2D1347 100%)", marginBottom: "6px" }} />

                {/* â”€â”€ PACKAGE SUMMARY & OVERVIEW CARD â”€â”€ */}
                <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "7px 11px", marginBottom: "6px", background: "#fdf4ff", pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 900, color: "#2D1347", lineHeight: 1.2 }}>{selectedTour.title}</div>
                      <div style={{ fontSize: "8px", color: "#6b21a8", marginTop: "3px", display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ background: "#2D1347", color: "#ffffff", padding: "1px 5px", borderRadius: "3px", fontWeight: 700 }}>Heli Services</span>
                        {selectedTour.location && <span style={{ background: "#7c3aed", color: "#ffffff", padding: "1px 5px", borderRadius: "3px", fontWeight: 700 }}>Loc: {selectedTour.location}</span>}
                        {selectedTour.duration && <span style={{ background: "#9333ea", color: "#ffffff", padding: "1px 5px", borderRadius: "3px", fontWeight: 700 }}>Time: {selectedTour.duration}</span>}
                        {selectedTour.maxAltitude && <span style={{ background: "#c026d3", color: "#ffffff", padding: "1px 5px", borderRadius: "3px", fontWeight: 700 }}>Max Alt: {selectedTour.maxAltitude}</span>}
                        <span style={{ background: "#E91E63", color: "#ffffff", padding: "1px 5px", borderRadius: "3px", fontWeight: 700 }}>&#9733; {selectedTour.rating || 4.9} / 5.0 ({selectedTour.reviewsCount || 1} reviews)</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "7.5px", color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Starting From</div>
                      <div style={{ fontSize: "15px", fontWeight: 900, color: "#2D1347" }}>{startsFromDisplayPrice}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: "5px", paddingTop: "5px", borderTop: "1px solid #f3e8ff", fontSize: "8.5px", color: "#4a154b", lineHeight: "1.35", maxHeight: "3.2rem", overflow: "hidden" }}>
                    <strong style={{ color: "#2D1347" }}>Experience Overview: </strong>
                    <span dangerouslySetInnerHTML={{ __html: formatDescription(selectedTour.description) }} />
                  </div>
                </div>

                {/* â”€â”€ PRICING SCHEDULE (Only if pricing tiers exist from API) â”€â”€ */}
                {pricingTiers && pricingTiers.length > 0 && (
                  <div style={{ marginBottom: "6px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                    <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3px solid #E91E63", paddingLeft: "6px", marginBottom: "4px" }}>
                      Pricing Schedule &amp; Package Tiers
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8.5px", border: "1px solid #e9d5ff" }}>
                      <thead>
                        <tr style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", color: "#ffffff" }}>
                          <th style={{ padding: "4px 7px", textAlign: "left", fontWeight: 800, width: "42%" }}>Option / Tier</th>
                          <th style={{ padding: "4px 7px", textAlign: "center", fontWeight: 800, width: "22%" }}>Group Bracket</th>
                          <th style={{ padding: "4px 7px", textAlign: "right", fontWeight: 800, width: "18%" }}>Price (NPR)</th>
                          <th style={{ padding: "4px 7px", textAlign: "right", fontWeight: 800, width: "18%" }}>Price (USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pricingTiers.map((tier: any, idx: number) => {
                          const tierName = tier.service || tier.name || `Tier ${idx + 1}`;
                          const bracket = tier.age_group || (tier.min_pax ? (tier.min_pax === tier.max_pax ? `${tier.min_pax} Pax` : `${tier.min_pax} - ${tier.max_pax} Pax`) : "Per Person / All Pax");
                          const nprPrice = Number(tier.price_npr ?? tier.price ?? 0);
                          const usdPrice = tier.price_usd ? Number(tier.price_usd) : Math.round(nprPrice / (nprPerOneDollar || 135));

                          return (
                            <tr key={tier.id || idx} style={{ background: idx % 2 === 0 ? "#ffffff" : "#faf5ff", borderBottom: "1px solid #f3e8ff" }}>
                              <td style={{ padding: "4px 7px", fontWeight: 700, color: "#2D1347" }}>{tierName}</td>
                              <td style={{ padding: "4px 7px", textAlign: "center", color: "#6b21a8" }}>
                                {bracket}
                              </td>
                              <td style={{ padding: "4px 7px", textAlign: "right", fontWeight: 800, color: "#2D1347" }}>
                                NPR {nprPrice ? nprPrice.toLocaleString("en-IN") : "Contact for Quote"}
                              </td>
                              <td style={{ padding: "4px 7px", textAlign: "right", fontWeight: 700, color: "#E91E63" }}>
                                {usdPrice ? `${usdPrice.toLocaleString()}` : "$ -"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* â”€â”€ TRIP HIGHLIGHTS (Only if data exists) â”€â”€ */}
                {combinedHighlights && combinedHighlights.length > 0 && (
                  <div style={{ marginBottom: "6px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                    <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3px solid #E91E63", paddingLeft: "6px", marginBottom: "4px" }}>
                      Key Highlights &amp; Features
                    </div>
                    <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "5px", padding: "6px 8px", background: "#fdf4ff" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 10px" }}>
                        {combinedHighlights.map((h: string, i: number) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "4px", fontSize: "8.5px", color: "#4a154b" }}>
                            <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>✓</span>
                            <span style={{ lineHeight: "1.3" }}>{h.replace(/^[\u2022\-\*]\s*/, "")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* â”€â”€ INCLUSIONS & EXCLUSIONS (Only if data exists) â”€â”€ */}
                {((heliInclusions && heliInclusions.length > 0) ||
                  (heliExclusions && heliExclusions.length > 0)) && (
                  <div style={{ display: "grid", gridTemplateColumns: heliInclusions?.length && heliExclusions?.length ? "1fr 1fr" : "1fr", gap: "8px", marginBottom: "6px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                    {heliInclusions && heliInclusions.length > 0 && (
                      <div style={{ border: "1.5px solid #d8b4fe", borderRadius: "5px", padding: "6px 8px", background: "#faf5ff" }}>
                        <div style={{ fontSize: "9.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "2px", marginBottom: "4px" }}>
                          What&apos;s Included
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
                          {heliInclusions.map((inc: string, i: number) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "4px", fontSize: "8px", color: "#581c87" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#E91E63" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </span>
                              <span style={{ lineHeight: "1.25" }}>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {heliExclusions && heliExclusions.length > 0 && (
                      <div style={{ border: "1.5px solid #fecdd3", borderRadius: "5px", padding: "6px 8px", background: "#fff1f2" }}>
                        <div style={{ fontSize: "9.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#881337", borderBottom: "1.5px solid #fda4af", paddingBottom: "2px", marginBottom: "4px" }}>
                          What&apos;s Excluded / Not Included
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
                          {heliExclusions.map((ex: string, i: number) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "4px", fontSize: "8px", color: "#4c0519" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              </span>
                              <span style={{ lineHeight: "1.25" }}>{ex}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* â”€â”€ RESTRICTIONS & WHAT TO BRING (Only if data exists) â”€â”€ */}
                {((heliRestrictions && heliRestrictions.length > 0) ||
                  (heliWhatToBring && heliWhatToBring.length > 0)) && (
                  <div style={{ display: "grid", gridTemplateColumns: heliRestrictions?.length && heliWhatToBring?.length ? "1fr 1fr" : "1fr", gap: "8px", marginBottom: "6px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                    {heliRestrictions && heliRestrictions.length > 0 && (
                      <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "5px", padding: "6px 8px", background: "#fdf4ff" }}>
                        <div style={{ fontSize: "9.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "2px", marginBottom: "4px" }}>
                          Restrictions &amp; Health Guidelines
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
                          {heliRestrictions.map((r: string, i: number) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "4px", fontSize: "8px", color: "#4a154b" }}>
                              <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>&bull;</span>
                              <span style={{ lineHeight: "1.25" }}>{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {heliWhatToBring && heliWhatToBring.length > 0 && (
                      <div style={{ border: "1.5px solid #d8b4fe", borderRadius: "5px", padding: "6px 8px", background: "#faf5ff" }}>
                        <div style={{ fontSize: "9.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "2px", marginBottom: "4px" }}>
                          Passenger Checklist &amp; What to Bring
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
                          {heliWhatToBring.map((b: string, i: number) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "4px", fontSize: "8px", color: "#581c87" }}>
                              <span style={{ fontWeight: 900, color: "#9333ea", flexShrink: 0 }}>&bull;</span>
                              <span style={{ lineHeight: "1.25" }}>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* â”€â”€ POLICIES (Only if data exists) â”€â”€ */}
                {selectedTour.policies && selectedTour.policies.length > 0 && (
                  <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "5px", padding: "6px 8px", marginBottom: "6px", background: "#faf5ff", pageBreakInside: "avoid", breakInside: "avoid" }}>
                    <div style={{ fontSize: "9.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "2px", marginBottom: "4px" }}>
                      Heli Service Policies &amp; Guidelines
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
                      {selectedTour.policies.map((policy: string, idx: number) => (
                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "4px", fontSize: "8px", color: "#4a154b" }}>
                          <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>&bull;</span>
                          <span style={{ lineHeight: "1.3" }}>{policy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* â”€â”€ FAQS (Only if data exists) â”€â”€ */}
                {packageFaqs && packageFaqs.length > 0 && (
                  <div style={{ marginBottom: "6px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                    <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3px solid #E91E63", paddingLeft: "6px", marginBottom: "4px" }}>
                      Frequently Asked Questions
                    </div>
                    <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "5px", padding: "6px 8px", background: "#fdf4ff" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3.5px" }}>
                        {packageFaqs.map((faq, i) => (
                          <div key={i} style={{ fontSize: "8px", color: "#4a154b", lineHeight: "1.3" }}>
                            <div style={{ fontWeight: 800, color: "#2D1347" }}>Q: {faq.q}</div>
                            <div style={{ color: "#581c87", marginTop: "1px" }}>A: {faq.a}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* â”€â”€ HELI FLIGHT & BOOKING REQUIREMENTS (Matching Details Page Sidebar) â”€â”€ */}
                <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "5px", padding: "6px 8px", marginBottom: "6px", background: "#faf5ff", pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <div style={{ fontSize: "9.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "2px", marginBottom: "4px" }}>
                    Heli Flight &amp; Booking Requirements
                  </div>
                  <div style={{ fontSize: "8px", color: "#4a154b", marginBottom: "4px" }}>
                    <strong style={{ color: "#2D1347" }}>Information Required for Booking:</strong>
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "12px", lineHeight: "1.35" }}>
                      <li><strong>Passenger Names:</strong> Full legal names of all travelers joining the flight.</li>
                      <li><strong>Passport, citizenship or NID:</strong> Required for flight manifest and airport security clearance.</li>
                      <li><strong>Approximate body weight:</strong> Mandatory for helicopter weight balance &amp; high-altitude flight safety.</li>
                      <li><strong>Preferred travel date:</strong> Desired flight date and reserve date if possible.</li>
                      <li><strong>Contact &amp; Emergency details:</strong> WhatsApp, email, and emergency contact for weather and schedule updates.</li>
                    </ul>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 10px", fontSize: "7.5px", color: "#581c87", lineHeight: "1.3" }}>
                    <div><strong style={{ color: "#2D1347" }}>Daily Weight Declaration:</strong> Exact weight (kg) per CAAN high-altitude safety regulations.</div>
                    <div><strong style={{ color: "#2D1347" }}>Luggage Allowance:</strong> Max 20 kg per passenger.</div>
                    <div><strong style={{ color: "#2D1347" }}>High Altitude Safety:</strong> Supplemental oxygen cylinder &amp; first-aid kit on all flights.</div>
                    <div><strong style={{ color: "#2D1347" }}>100% Weather Guarantee:</strong> 100% full refund or free priority reschedule if flight is grounded.</div>
                  </div>
                </div>

                {/* â”€â”€ CORPORATE FOOTER â”€â”€ */}
                <div style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", padding: "6px 12px", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "8px", color: "#ffffff", pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <div>
                    <strong style={{ color: "#ffffff" }}>Trip Himalaya Tours &amp; Travel Pvt. Ltd.</strong> &bull; Registered in Nepal (Lic: 2490)
                  </div>
                  <div style={{ color: "#fce7f3" }}>
                    Heli Operations Desk: +977 9851420882 &bull; dev.triphimalayatt@gmail.com
                  </div>
                  <div style={{ fontWeight: 700, color: "#f472b6" }}>
                    Official Computer-Generated Travel Dossier &bull; Page 1 of 1
                  </div>
                </div>
              </div>
            )}

            {/* â”€â”€ TOP HERO HEADER (Matching Insurance Detail Banner Design) â”€â”€ */}
            <div
              className="print:hidden relative rounded-3xl overflow-hidden shadow-lg min-h-[220px] sm:min-h-[260px] flex flex-col justify-end"
              style={{
                backgroundImage: `url('${selectedTour.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0520]/92 via-[#1a0836]/65 to-transparent print:hidden" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#2D1347]/40 print:hidden" />

              {/* Share button (top-right, with dropdown) */}
              <div ref={shareDropdownRef} className="print:hidden absolute top-3 right-4 sm:top-4 sm:right-6 z-20">
                {isShareOpen && (
                  <div className="absolute top-11 right-0 sm:top-0 sm:right-11 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/80 p-2 flex items-center gap-1.5 flex-nowrap min-w-max animate-in fade-in slide-in-from-top-2 sm:slide-in-from-right-2 duration-150 z-30">
                    {/* Facebook */}
                    <button
                      type="button"
                      onClick={() => {
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            window.location.href
                          )}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                        setIsShareOpen(false);
                      }}
                      title="Share on Facebook"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer"
                      style={{ background: "#1877F2" }}
                    >
                      <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      </svg>
                    </button>

                    {/* Instagram */}
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(window.location.href).catch(() => { });
                        setIsShareCopied(true);
                        setTimeout(() => setIsShareCopied(false), 2000);
                        window.open("https://www.instagram.com/triphimalayatt", "_blank", "noopener,noreferrer");
                        setIsShareOpen(false);
                      }}
                      title="Share on Instagram"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer"
                      style={{
                        background:
                          "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="white" width="13" height="13">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2" />
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="white" />
                        <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                      </svg>
                    </button>

                    {/* WhatsApp */}
                    <button
                      type="button"
                      onClick={() => {
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(
                            `Check out ${selectedTour.title} on Trip Himalaya: ${window.location.href}`
                          )}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                        setIsShareOpen(false);
                      }}
                      title="Share on WhatsApp"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer"
                      style={{ background: "#25D366" }}
                    >
                      <MessageCircle size={14} color="white" />
                    </button>

                    {/* Copy Link */}
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(window.location.href).catch(() => { });
                        setIsShareCopied(true);
                        setTimeout(() => setIsShareCopied(false), 2000);
                        setIsShareOpen(false);
                      }}
                      title={isShareCopied ? "Copied!" : "Copy Link"}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer ${
                        isShareCopied ? "bg-emerald-500" : "bg-gray-700 hover:bg-gray-900"
                      }`}
                    >
                      {isShareCopied ? (
                        <Check size={13} color="white" />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="13" height="13">
                          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                        </svg>
                      )}
                    </button>

                    <div className="hidden sm:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-gray-200/80" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setIsShareOpen((prev) => !prev)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                    isShareOpen
                      ? "bg-white text-[#2D1347]"
                      : "bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 text-white"
                  }`}
                  title="Share this tour"
                >
                  <Share2 size={15} />
                </button>
              </div>

              {/* Main Content & Actions */}
              <div className="relative z-10 pt-14 px-4 pb-4 sm:pt-16 sm:px-6 sm:pb-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                          {selectedTour.title}
                        </h2>
                      </div>
                      <div
                        className="text-xs sm:text-sm font-medium text-white/80 mt-1 max-w-2xl leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: formatDescription(selectedTour.description)
                            .replace(/color:#[0-9a-fA-F]{3,8}/g, "color:rgba(255,255,255,0.88)")
                        }}
                      />
                    </div>
                  </div>

                  {/* Right: Stacked Action Buttons */}
                  <div className="print:hidden flex flex-row md:flex-col items-center gap-2 w-full md:w-40 flex-shrink-0 mt-2 md:mt-12">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppInquiry(selectedTour)}
                      className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-md"
                    >
                      <MessageCircle size={13} />
                      <span>Ask on WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintQuotation}
                      className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white/75 hover:text-white rounded-md text-[10px] font-medium transition-all cursor-pointer"
                      title="Print or Save as PDF"
                    >
                      <Printer size={11} />
                      <span>Print / Save PDF</span>
                    </button>
                  </div>
                </div>

                {/* â”€â”€ Badges Pill Row (Matching Image) â”€â”€ */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5 text-xs sm:text-sm font-bold">
                  {/* Badge 1: Tag & Category from API */}
                  {selectedTour.tag && (
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E91E63] text-white shadow-xs">
                        {selectedTour.tag}
                      </span>
                      {selectedTour.apiCategory ? (
                        <span className="text-xs font-semibold text-white/90">
                          {selectedTour.apiCategory}
                        </span>
                      ) : null}
                    </div>
                  )}

                  {/* Badge 2: Starts at */}
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
                    <span className="text-pink-200 text-xs font-normal">Starts at:</span>
                    <span className="font-extrabold text-white">
                      {displayPrice(
                        selectedTour.packagePriceNPR,
                        selectedCurrency,
                        nprPerOneDollar,
                        nprPerOneINR
                      )}
                    </span>
                  </div>

                  {/* Badge 3: Duration / Calendar */}
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
                    <Calendar size={14} className="text-blue-300" />
                    <span>{selectedTour.duration}</span>
                  </div>

                  {/* Badge 4: Location */}
                  {selectedTour.location && (
                    <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
                      <MapPin size={13} className="text-pink-300" />
                      <span>{selectedTour.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* â”€â”€ SUB-NAVIGATION STRIP (OVERVIEW | POLICIES | FAQS | TESTIMONIES + Starts From & Book Now) â”€â”€ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:px-6 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
              {/* Tabs */}
              <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto">
                {(["OVERVIEW", "POLICIES", "FAQS", "TESTIMONIES"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveDetailTab(tab)}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${activeDetailTab === tab
                      ? "text-[#E91E63] bg-pink-50/70 border-b-2 border-[#E91E63]"
                      : "text-gray-500 hover:text-gray-800"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Starts From & Book Now Button */}
              <div className="flex items-center justify-end gap-3.5">
                <div className="text-right">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                    STARTS FROM
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#E91E63]">
                    {displayPrice(
                      selectedTour.packagePriceNPR,
                      selectedCurrency,
                      nprPerOneDollar,
                      nprPerOneINR
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(selectedTour, "charter")}
                  className="px-6 py-2.5 rounded-full bg-[#E91E63] hover:bg-pink-700 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
                >
                  BOOK NOW
                </button>
              </div>
            </div>

            {/* â”€â”€ MAIN 2-COLUMN LAYOUT: CONTENT + HELI SERVICE PRICE MODEL â”€â”€ */}
            <div className="print:hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: TOUR DETAILS (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Tab 1: OVERVIEW */}
                {activeDetailTab === "OVERVIEW" && (
                  <div className="space-y-6">
                    {/* Title & Metadata */}
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#200B3B] leading-tight">
                        {selectedTour.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-bold text-gray-500">
                        <span className="flex items-center gap-1.5 text-[#E91E63]">
                          <MapPin size={15} />
                          <span className="text-gray-700">{selectedTour.location}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-[#E91E63]">
                          <Clock size={15} />
                          <span className="text-gray-700">{selectedTour.duration}</span>
                        </span>
                        {selectedTour.maxAltitude && (
                          <span className="bg-pink-50 text-[#E91E63] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            Max Alt: {selectedTour.maxAltitude}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description + Trip Highlights â€” single card (only if data exists) */}
                    {(selectedTour.description || (combinedHighlights && combinedHighlights.length > 0)) && (
                      <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                        {selectedTour.description && (
                          <div
                            className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium max-w-none"
                            dangerouslySetInnerHTML={{ __html: formatDescription(selectedTour.description) }}
                          />
                        )}
                        {combinedHighlights && combinedHighlights.length > 0 && (
                          <div className={`${selectedTour.description ? "border-t border-gray-100 pt-4" : ""} space-y-3`}>
                            <h3 className="text-base sm:text-lg font-black text-[#200B3B]">
                              Trip Highlights
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-x-6 sm:gap-y-2.5">
                              {combinedHighlights.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 text-[11px] font-medium text-gray-600 text-left"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63] mt-1 flex-shrink-0" />
                                  <span>{item.replace(/^[\u2022\-\*]\s*/, "")}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mobile Responsive Pricing Options (shown below highlights card on mobile screens) */}
                    <div id="pricing-section-mobile" className="lg:hidden">
                      <HeliServicePriceModel
                        tour={selectedTour}
                        pricingTiers={pricingTiers}
                        pricingLoading={pricingLoading}
                        onBookNow={handlePriceModelBookNow}
                        onWhatsAppInquiry={(flightType, formattedTotal) => {
                          const typeLabel =
                            flightType === "charter"
                              ? "Private Charter"
                              : "Sharing Heli Service";

                          const msg = encodeURIComponent(
                            `Hello Trip Himalaya! Inquiring for "${selectedTour.title}". Selected: ${typeLabel}. Price: ${formattedTotal}. Please confirm next flight timing.`
                          );

                          window.open(
                            `https://wa.me/9779851420882?text=${msg}`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                      />
                    </div>

                    {/* Flight Itinerary & Roadmap (only if data exists) */}
                    {combinedItineraries && combinedItineraries.length > 0 && (
                      <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100">
                        <TripRoadmap
                          steps={combinedItineraries}
                          heading="Flight Itinerary & Route"
                          subheading="STEP-BY-STEP FLIGHT SCHEDULE"
                          endHeading="RETURN & TOUCHDOWN"
                          endMessage="Return flight back to helipad with unforgettable Himalayan memories."
                        />
                      </div>
                    )}

                    {/* What's Included (Teal Green Card) & What's Excluded (Pink Card) â€” only if data exists */}
                    {((heliInclusions && heliInclusions.length > 0) ||
                      (heliExclusions && heliExclusions.length > 0)) && (
                      <div
                        className={`grid grid-cols-1 ${
                          heliInclusions &&
                          heliInclusions.length > 0 &&
                          heliExclusions &&
                          heliExclusions.length > 0
                            ? "sm:grid-cols-2"
                            : ""
                        } gap-5`}
                      >
                        {/* What's Included */}
                        {heliInclusions && heliInclusions.length > 0 && (
                          <div className="bg-[#009688] text-white p-6 rounded-3xl shadow-sm space-y-4">
                            <h4 className="flex items-center gap-2 text-sm sm:text-base font-black uppercase tracking-wider">
                              <CheckCircle2 size={18} />
                              <span>What's Included</span>
                            </h4>
                            <ul className="space-y-2.5 text-xs font-medium">
                              {heliInclusions.map((inc, i) => (
                                <li key={i} className="flex items-start gap-2 leading-relaxed">
                                  <Check size={15} className="flex-shrink-0 mt-0.5 text-teal-200" />
                                  <span>{inc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* What's Excluded */}
                        {heliExclusions && heliExclusions.length > 0 && (
                          <div className="bg-[#E91E63] text-white p-6 rounded-3xl shadow-sm space-y-4">
                            <h4 className="flex items-center gap-2 text-sm sm:text-base font-black uppercase tracking-wider">
                              <X size={18} />
                              <span>What's Excluded</span>
                            </h4>
                            <ul className="space-y-2.5 text-xs font-medium">
                              {heliExclusions.map((exc, i) => (
                                <li key={i} className="flex items-start gap-2 leading-relaxed">
                                  <X size={15} className="flex-shrink-0 mt-0.5 text-pink-200" />
                                  <span>{exc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Restrictions & Health Card (Amber Warning) â€” only if data exists */}
                    {heliRestrictions && heliRestrictions.length > 0 && (
                      <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                        <h3 className="flex items-center gap-2.5 text-base sm:text-lg font-black text-[#200B3B]">
                          <AlertTriangle size={20} className="text-amber-500" />
                          <span>Restrictions &amp; Health</span>
                        </h3>
                        <ul className="space-y-2.5 pt-1 text-xs text-gray-700 leading-relaxed">
                          {heliRestrictions.map((res, i) => (
                            <li key={i} className="flex items-start gap-2.5 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                              <span>{res}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* What to Bring Card (Pink Bag) â€” only if data exists */}
                    {heliWhatToBring && heliWhatToBring.length > 0 && (
                      <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                        <h3 className="flex items-center gap-2.5 text-base sm:text-lg font-black text-[#200B3B]">
                          <ShoppingBag size={20} className="text-[#E91E63]" />
                          <span>What to Bring</span>
                        </h3>
                        <ul className="space-y-2.5 pt-1 text-xs text-gray-700 leading-relaxed">
                          {heliWhatToBring.map((wtb, i) => (
                            <li key={i} className="flex items-start gap-2.5 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63] mt-1.5 flex-shrink-0" />
                              <span>{wtb}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: POLICIES */}
                {activeDetailTab === "POLICIES" && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-xl font-black text-[#200B3B]">
                      Heli Service Policies &amp; Aviation Guidelines
                    </h3>
                    <div className="space-y-4">
                      {selectedTour.policies.map((policy, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          <p className="text-xs text-gray-700 font-medium leading-relaxed">
                            {policy}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: FAQS */}
                {activeDetailTab === "FAQS" && (
                  <DynamicFaqSection
                    targetType="package"
                    targetId={String(selectedTour.backendId || selectedTour.id)}
                    defaultFaqs={packageFaqs.map((faq) => ({
                      q: faq.q,
                      a: faq.a,
                      question: faq.question || faq.q,
                      answer: faq.answer || faq.a,
                      questionNp: faq.questionNp,
                      answerNp: faq.answerNp,
                    }))}
                    title={`Frequently Asked Questions about ${selectedTour.title}`}
                    subtitle="Common questions answered by our flight specialists"
                  />
                )}

                {/* Tab 4: TESTIMONIES */}
                {activeDetailTab === "TESTIMONIES" && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-xl font-black text-[#200B3B]">
                      Guest Experiences &amp; Reviews
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedTour.testimonies.map((test, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-center gap-1">
                            {Array.from({ length: test.rating }).map((_, r) => (
                              <Star
                                key={r}
                                size={14}
                                className="text-yellow-400 fill-yellow-400"
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-700 italic font-medium leading-relaxed">
                            "{test.comment}"
                          </p>
                          <div className="pt-2 border-t border-gray-200/70 flex items-center justify-between text-[11px] text-gray-500 font-bold">
                            <span className="text-[#200B3B]">{test.name} ({test.country})</span>
                            <span>{test.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: STICKY PRICING MODEL SIDEBAR (Matching Visa Service Details Page) */}
              <div
                id="pricing-section"
                className="hidden lg:block lg:col-span-4 lg:sticky lg:top-[150px] self-start space-y-6"
              >
                <HeliServicePriceModel
                  tour={selectedTour}
                  pricingTiers={pricingTiers}
                  pricingLoading={pricingLoading}
                  onBookNow={handlePriceModelBookNow}
                  onWhatsAppInquiry={(flightType, formattedTotal) => {
                    const typeLabel =
                      flightType === "charter"
                        ? "Private Charter"
                        : "Sharing Heli Service";

                    const msg = encodeURIComponent(
                      `Hello Trip Himalaya! Inquiring for "${selectedTour.title}". Selected: ${typeLabel}. Price: ${formattedTotal}. Please confirm next flight timing.`
                    );

                    window.open(
                      `https://wa.me/9779851420882?text=${msg}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                />
              </div>
            </div>
          </div>


        {/* â”€â”€ OUR OTHER SERVICES â”€â”€ */}
        <div className="mt-10 print:hidden">
          <OtherServicesComponent service={services} />
        </div>

        </>
      ) : (
        /* ======================================================================= */
        /* â”€â”€ CARDS LISTING VIEW (Matching Image 1) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        /* ======================================================================= */
        <div className="w-full space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* â”€â”€ LEFT: FILTER SIDEBAR â”€â”€ */}
            <div className="lg:col-span-1">
              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  MOBILE â€” compact toggle bar (< lg) matching Packages
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              <div className="lg:hidden">
                {/* Toggle Button Row */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={15} className="text-[#E91E63]" />
                    <span className="text-sm font-bold text-[#200B3B]">Filter</span>
                    {((selectedRating > 0 ? 1 : 0) + selectedKeywords.length + (priceRange < 500000 ? 1 : 0)) > 0 && (
                      <span className="bg-[#E91E63] text-white text-[10px] font-black rounded-full px-1.5 py-0.5 leading-none">
                        {(selectedRating > 0 ? 1 : 0) + selectedKeywords.length + (priceRange < 500000 ? 1 : 0)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {((selectedRating > 0 ? 1 : 0) + selectedKeywords.length + (priceRange < 500000 ? 1 : 0)) > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchQuery("");
                          setPriceRange(500000);
                          setSelectedRating(0);
                          setSelectedKeywords([]);
                          navigate("/service/heli-services");
                        }}
                        className="text-[10px] font-bold text-[#E91E63] uppercase tracking-wider cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${
                        mobileFilterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Collapsible Panel */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    mobileFilterOpen ? "max-h-[800px] opacity-100 mt-2" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
                    {/* 1. Price Range Slider */}
                    <div className="py-4 border-b border-gray-100">
                      <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block mb-3">
                        PRICE RANGE ({selectedCurrency === "nepali" ? "NPR" : selectedCurrency === "inr" ? "INR" : "USD"})
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={500000}
                        step={5000}
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full accent-[#E91E63] cursor-pointer h-1.5 bg-gray-200 rounded-lg outline-none"
                      />
                      <div className="flex justify-between items-center text-xs font-bold mt-2">
                        <span className="text-gray-400">
                          {displayPrice(0, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                        </span>
                        <span className="text-[#E91E63] font-black">
                          {displayPrice(priceRange, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                        </span>
                      </div>
                    </div>

                    {/* 2. Star Ratings (5-column grid matching Packages FilterSideBar) */}
                    <div className="py-4 border-b border-gray-100">
                      <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block mb-3">
                        RATINGS
                      </label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[5, 4, 3, 2, 1].map((starCount) => {
                          const isSelected = selectedRating === starCount;
                          return (
                            <button
                              key={starCount}
                              type="button"
                              onClick={() => setSelectedRating(isSelected ? 0 : starCount)}
                              className={`flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors border ${
                                isSelected
                                  ? "bg-pink-50 border-[#E91E63] ring-1 ring-[#E91E63] text-[#E91E63]"
                                  : "bg-[#2D1347] border-[#2D1347] text-white hover:bg-[#3B145C]"
                              }`}
                            >
                              <Star
                                size={13}
                                className={isSelected ? "text-yellow-400 fill-yellow-400" : "text-white/70 fill-white/70"}
                              />
                              <span>{starCount}â˜…</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Keywords Tags */}
                    <div className="pt-4">
                      <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase flex items-center gap-1.5 mb-3">
                        <Tag size={12} className="text-[#E91E63]" />
                        <span>KEYWORDS</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {availableKeywords.map((kw) => {
                          const isSelected = selectedKeywords.includes(kw);
                          return (
                            <button
                              key={kw}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedKeywords((prev) => prev.filter((k) => k !== kw));
                                } else {
                                  setSelectedKeywords((prev) => [...prev, kw]);
                                }
                              }}
                              className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer border ${
                                isSelected
                                  ? "bg-[#E91E63] text-white border-[#E91E63]"
                                  : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
                              }`}
                            >
                              {kw}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  DESKTOP â€” full sidebar card (lg+) (UNTOUCHED)
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              <div className="hidden lg:block w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-[#E91E63]" />
                    <h3 className="text-sm font-black text-[#200B3B]">Filter By</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setPriceRange(500000);
                      setSelectedRating(0);
                      setSelectedKeywords([]);
                      navigate("/service/heli-services");
                    }}
                    className="text-[10px] font-bold text-[#E91E63] hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    CLEAR ALL
                  </button>
                </div>

                {/* 1. Price Range Slider */}
                <div className="space-y-3 pb-5 border-b border-gray-100">
                  <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block">
                    PRICE RANGE ({selectedCurrency === "nepali" ? "NPR" : selectedCurrency === "inr" ? "INR" : "USD"})
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={500000}
                    step={5000}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#E91E63] cursor-pointer h-1.5 bg-gray-200 rounded-lg outline-none"
                  />
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-400">
                      {displayPrice(0, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                    </span>
                    <span className="text-[#E91E63] font-black">
                      {displayPrice(priceRange, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
                    </span>
                  </div>
                </div>

                {/* 2. Star Ratings */}
                <div className="space-y-3 pb-5 border-b border-gray-100">
                  <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block">
                    RATINGS
                  </label>
                  <div className="space-y-1.5">
                    {[5, 4, 3, 2, 1].map((starCount) => (
                      <button
                        key={starCount}
                        type="button"
                        onClick={() =>
                          setSelectedRating(selectedRating === starCount ? 0 : starCount)
                        }
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${selectedRating === starCount
                          ? "bg-pink-50 border border-pink-200"
                          : "hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${i < starCount
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
                                }`}
                            />
                          ))}
                        </div>
                        {selectedRating === starCount && (
                          <Check size={14} className="text-[#E91E63]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Keywords Tags */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#200B3B] tracking-widest uppercase block">
                    KEYWORDS
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableKeywords.map((kw) => {
                      const isSelected = selectedKeywords.includes(kw);
                      return (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedKeywords((prev) => prev.filter((k) => k !== kw));
                            } else {
                              setSelectedKeywords((prev) => [...prev, kw]);
                            }
                          }}
                          className={`text-[9.5px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer uppercase ${isSelected
                            ? "bg-[#200B3B] text-white border-[#200B3B]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          {kw}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* â”€â”€ RIGHT: HORIZONTAL HELI CARDS (Matching Image 1) â”€â”€ */}
            <div className="lg:col-span-3 space-y-5">
              {filteredTours.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
                  <Plane size={40} className="mx-auto text-gray-300" />
                  <h4 className="text-lg font-black text-[#200B3B]">
                    No Helicopter Tours Found
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Try adjusting your price range or clearing keyword filters to see available mountain flights.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceRange(500000);
                      setSelectedRating(0);
                      setSelectedKeywords([]);
                      setSearchQuery("");
                      onClearFilter?.();
                    }}
                    className="mt-2 px-5 py-2 rounded-full bg-[#E91E63] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredTours.map((tour) => {
                  const formattedStartingPrice = displayPrice(
                    tour.packagePriceNPR,
                    selectedCurrency,
                    nprPerOneDollar,
                    nprPerOneINR
                  );

                  return (
                    <div
                      key={tour.id}
                      onClick={() => handleSelectTour(tour)}
                      className="flex flex-col md:flex-row md:min-h-[230px] bg-white rounded-3xl shadow-sm hover:shadow-lg border border-gray-100/90 transition-all duration-300 overflow-hidden group cursor-pointer"
                    >
                      {/* Left: Image with Badge */}
                      <div className="relative w-full h-56 sm:h-60 md:w-72 lg:w-80 md:h-auto self-stretch flex-shrink-0 overflow-hidden bg-gray-100 flex items-stretch">
                        <img
                          src={
                            tour.image ||
                            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600"
                          }
                          alt={tour.title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600";
                          }}
                          className="w-full h-full min-h-[220px] object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {tour.tag ? (
                          <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-xs text-[#2D1347] text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                            {tour.tag}
                          </span>
                        ) : null}
                      </div>

                      {/* Middle: Info */}
                      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
                        <div>
                          {/* Star Rating & Highly Rated Tag */}
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  className={
                                    i < Math.round(Number(tour.rating || 5))
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-200 fill-gray-200"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase">
                              {Number(tour.rating || 5) >= 5 ? "HIGHLY RATED" : "POPULAR"}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-base sm:text-lg font-black text-[#200B3B] group-hover:text-[#E91E63] transition-colors leading-snug line-clamp-1">
                            {tour.title}
                          </h3>

                          {/* Description */}
                          <div
                            className="text-xs text-gray-500 font-medium overflow-hidden mt-1 leading-relaxed max-w-none"
                            style={{ maxHeight: "3.5rem" }}
                            dangerouslySetInnerHTML={{ __html: formatDescription(tour.description) }}
                          />
                        </div>

                        {/* Location & Duration */}
                        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100 text-[11px] font-bold text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#E91E63]" />
                            <span>{tour.location}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} className="text-[#E91E63]" />
                            <span>{tour.duration}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Pricing & Actions */}
                      <div className="w-full md:w-56 lg:w-60 p-5 sm:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 flex-shrink-0 text-left bg-white">
                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                            STARTING FROM
                          </span>

                          <p className="text-2xl sm:text-3xl font-black text-[#E91E63] my-0.5 tracking-tight">
                            {formattedStartingPrice}
                          </p>

                          <span className="text-[9px] text-gray-400 font-medium block">
                            per person
                          </span>
                        </div>

                        <div className="w-full">
                          {/* Buttons */}
                          <div className="flex items-center gap-2 w-full justify-start">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectTour(tour);
                              }}
                              className="flex-1 px-3 py-2 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#E91E63] hover:bg-pink-600 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 text-center"
                            >
                              VIEW DETAILS
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenBooking(tour, "sharing");
                              }}
                              className="flex-1 px-3 py-2 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#200B3B] hover:bg-[#2D1347] text-white shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 text-center"
                            >
                              BOOK NOW
                            </button>
                          </div>

                          {/* WhatsApp Inquiry Button on Card */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsAppInquiry(tour);
                            }}
                            className="w-full mt-2 py-1.5 px-3 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#25D366] hover:bg-emerald-600 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center justify-center gap-1.5"
                            title="Instant WhatsApp Inquiry"
                          >
                            <MessageCircle size={13} />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* â”€â”€ BOOKING MODAL & PRINT SLIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {/* ========================================================================= */}
      {isBookingModalOpen && bookingTour && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm print:p-0 print:bg-white print:static">
          <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 print:border-none print:shadow-none print:max-w-none print:max-h-none">
            {/* Modal Header */}
            {isSubmitted ? (
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#200B3B] via-[#3B145C] to-[#200B3B] text-white flex items-center justify-between border-b border-white/10 flex-shrink-0 print:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Plane size={20} className="text-pink-300" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF4FA3] block">
                      SUBMISSION CONFIRMED
                    </span>
                    <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight text-white">
                      {bookingTour.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  aria-label="Close modal"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer hover:rotate-90"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-[#200B3B] via-[#3B145C] to-[#200B3B] text-white p-4 sm:p-5 flex-shrink-0 border-b border-white/10 print:hidden space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center flex-shrink-0 shadow-inner">
                      <Plane size={20} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black leading-tight">
                        Helicopter Service Reservation
                      </h3>
                      <p className="text-xs text-pink-200/80 font-medium line-clamp-1">
                        {bookingTour.title}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Header Summary Strip: Flight Option & Total Estimate */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/15">
                  <div>
                    <span className="text-[9px] font-black uppercase text-pink-200/90 block tracking-wider">
                      SELECTED FLIGHT OPTION
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs sm:text-sm font-black text-white">
                        {bookingFlightOption === "charter"
                          ? "Private Charter"
                          : "Sharing Heli Service"}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[9px] font-black uppercase text-pink-200/90 block tracking-wider">
                      TOTAL ESTIMATE
                    </span>
                    <span className="text-sm sm:text-base font-black text-[#FF69B4] tracking-tight block mt-0.5">
                      {displayPrice(
                        bookingTotalPriceNPR,
                        selectedCurrency,
                        nprPerOneDollar,
                        nprPerOneINR
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content (Scrollable to fit any screen height) */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 overscroll-contain">
              {currentStep === "form" ? (
                /* â”€â”€ STEP 1: SUBMISSION FORM â”€â”€ */
                <form onSubmit={handleFormSubmit} noValidate className="space-y-4 sm:space-y-5">
                  {/* Validation Error Banner */}
                  {Object.keys(formErrors).length > 0 &&
                    Object.values(formErrors).some(Boolean) && (
                      <div className="p-3 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                        <span>Please correct the highlighted fields before submitting.</span>
                      </div>
                    )}

                  {/* Server / Backend Error Banner */}
                  {paymentError && (
                    <div className="p-3 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  {/* â”€â”€ APPLICANT SELECTOR TABS (Shown prominently when paxCount > 1, sharing only) â”€â”€ */}
                  {bookingFlightOption !== "charter" && bookingSeatCount > 1 && (
                    <div className="bg-gradient-to-r from-purple-50/90 via-pink-50/40 to-purple-50/90 p-3 rounded-2xl border border-purple-200/80 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap px-0.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-[#200B3B] text-white flex items-center justify-center text-[10px] font-black">
                            {bookingSeatCount}
                          </div>
                          <h4 className="text-xs font-black text-[#200B3B] uppercase tracking-wider">
                            Applicants ({bookingSeatCount})
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-[#E91E63] bg-pink-100/80 px-2.5 py-0.5 rounded-full border border-pink-200">
                          Editing: Applicant {activeApplicantIndex + 1} of {bookingSeatCount}
                        </span>
                      </div>

                      {/* Scrollable Tabs for Applicants */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {Array.from({ length: bookingSeatCount }, (_, idx) => {
                          const isActive = idx === activeApplicantIndex;
                          const app = bookingFormData.applicants?.[idx] || {
                            fullName: "",
                            nationality: "",
                            idNumber: "",
                            bodyWeightKg: "",
                            luggageKg: "",
                            email: "",
                            phoneCode: "+977",
                            phone: "",
                            preferredDate: "",
                            pickupHotel: "",
                            file: null,
                          };
                          const isFilled =
                            Boolean(app.fullName?.trim()) &&
                            Boolean(app.nationality?.trim()) &&
                            Boolean(app.idNumber?.trim()) &&
                            app.bodyWeightKg !== "" &&
                            app.bodyWeightKg !== null &&
                            app.bodyWeightKg !== undefined &&
                            Boolean(app.email?.trim()) &&
                            Boolean(app.phone?.trim()) &&
                            Boolean(app.preferredDate);
                          const hasError = Object.keys(formErrors).some(
                            (k) => k.startsWith(`applicant_${idx}_`) && Boolean(formErrors[k]) && touchedFields[k]
                          );

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveApplicantIndex(idx)}
                              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 border ${isActive
                                ? "bg-gradient-to-r from-[#200B3B] to-[#E91E63] text-white border-transparent shadow-sm shadow-pink-500/25"
                                : hasError
                                  ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                                  : isFilled
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-300"
                                }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${isActive
                                  ? "bg-white/20 text-white"
                                  : hasError
                                    ? "bg-red-200 text-red-800"
                                    : isFilled
                                      ? "bg-emerald-200 text-emerald-800"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                              >
                                {idx + 1}
                              </span>
                              <span className="whitespace-nowrap font-extrabold">
                                Applicant {idx + 1}
                              </span>
                              {hasError && !isActive ? (
                                <AlertCircle size={12} className="text-red-600" />
                              ) : isFilled && !isActive ? (
                                <Check size={12} className="text-emerald-600 stroke-[3]" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* â”€â”€ ALL DETAILS FOR CURRENT ACTIVE APPLICANT (As marked in image) â”€â”€ */}
                  {(() => {
                    const currentApp = bookingFormData.applicants?.[activeApplicantIndex] || {
                      fullName: "",
                      nationality: "",
                      idNumber: "",
                      bodyWeightKg: "",
                      luggageKg: "",
                      email: "",
                      phoneCode: "+977",
                      phone: "",
                      preferredDate: "",
                      pickupHotel: "",
                      passportFile: null,
                      photoFile: null,
                      flightFile: null,
                      hotelFile: null,
                      insuranceFile: null,
                    };

                    return (
                      <div className="space-y-4">
                        {/* â”€â”€ CARD 1: PERSONAL DETAILS â”€â”€ */}
                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-xs space-y-3.5">
                          {/* Section Header */}
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-[#200B3B]">
                              <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                                <User size={13} />
                              </div>
                              <h4 className="text-xs font-black uppercase tracking-wider">
                                1. Personal Details{" "}
                                {bookingFlightOption !== "charter" && bookingSeatCount > 1
                                  ? `â€” Applicant ${activeApplicantIndex + 1}`
                                  : ""}
                              </h4>
                            </div>
                            {bookingFlightOption !== "charter" && bookingSeatCount > 1 && (
                              <span className="text-[10px] font-bold text-gray-500">
                                Passenger {activeApplicantIndex + 1} of {bookingSeatCount}
                              </span>
                            )}
                          </div>

                          {/* Inputs Row 1: Full Name & Nationality */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                FULL NAME (AS PRINTED ON PASSPORT) *
                              </label>
                              <input
                                type="text"
                                value={currentApp.fullName}
                                placeholder="Ram Bahadur Thapa"
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "fullName", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "fullName")}
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:font-normal focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_fullName`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_fullName`]
                                  ? "border-red-400 bg-red-50/20 focus:border-red-500"
                                  : "border-gray-200 focus:border-[#E91E63]"
                                  }`}
                              />
                              {formErrors[`applicant_${activeApplicantIndex}_fullName`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_fullName`] && (
                                  <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={11} className="flex-shrink-0" />
                                    {formErrors[`applicant_${activeApplicantIndex}_fullName`]}
                                  </span>
                                )}
                            </div>

                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                NATIONALITY *
                              </label>
                              <input
                                type="text"
                                value={currentApp.nationality}
                                placeholder="Nepali"
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "nationality", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "nationality")}
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:font-normal focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_nationality`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_nationality`]
                                  ? "border-red-400 bg-red-50/20 focus:border-red-500"
                                  : "border-gray-200 focus:border-[#E91E63]"
                                  }`}
                              />
                              {formErrors[`applicant_${activeApplicantIndex}_nationality`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_nationality`] && (
                                  <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={11} className="flex-shrink-0" />
                                    {formErrors[`applicant_${activeApplicantIndex}_nationality`]}
                                  </span>
                                )}
                            </div>
                          </div>

                          {/* Row 2: Passport / NID */}
                          <div>
                            <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                              PASSPORT / CITIZENSHIP / NID NUMBER *
                            </label>
                            <input
                              type="text"
                              value={currentApp.idNumber}
                              placeholder="12-01-78-12345 or 0892451"
                              onChange={(e) =>
                                handleApplicantChange(activeApplicantIndex, "idNumber", e.target.value)
                              }
                              onBlur={() => handleApplicantBlur(activeApplicantIndex, "idNumber")}
                              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:font-normal focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_idNumber`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_idNumber`]
                                ? "border-red-400 bg-red-50/20 focus:border-red-500"
                                : "border-gray-200 focus:border-[#E91E63]"
                                }`}
                            />
                            {formErrors[`applicant_${activeApplicantIndex}_idNumber`] &&
                              touchedFields[`applicant_${activeApplicantIndex}_idNumber`] && (
                                <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                  <AlertCircle size={11} className="flex-shrink-0" />
                                  {formErrors[`applicant_${activeApplicantIndex}_idNumber`]}
                                </span>
                              )}
                          </div>

                          {/* Row 3: CAAN Weight & Luggage Box */}
                          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <h6 className="text-[10.5px] font-black uppercase tracking-wider text-amber-900">
                                BODY WEIGHT &amp; LUGGAGE (CAAN HIGH-ALTITUDE)
                              </h6>
                              <span className="text-[9px] font-bold text-amber-800/80">
                                MAX 20 KG LUGGAGE
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div>
                                <label className="text-[9.5px] font-bold uppercase text-amber-900 block mb-1">
                                  APPROXIMATE WEIGHT (KG) *
                                </label>
                                <input
                                  type="number"
                                  min={20}
                                  max={160}
                                  value={currentApp.bodyWeightKg}
                                  placeholder="68"
                                  onChange={(e) =>
                                    handleApplicantChange(activeApplicantIndex, "bodyWeightKg", e.target.value)
                                  }
                                  onBlur={() => handleApplicantBlur(activeApplicantIndex, "bodyWeightKg")}
                                  className={`w-full px-3 py-2 rounded-xl bg-white border text-xs font-bold text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:font-normal focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_bodyWeightKg`] &&
                                    touchedFields[`applicant_${activeApplicantIndex}_bodyWeightKg`]
                                    ? "border-red-500 bg-red-50/30"
                                    : "border-amber-300 focus:border-amber-500"
                                    }`}
                                />
                                {formErrors[`applicant_${activeApplicantIndex}_bodyWeightKg`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_bodyWeightKg`] && (
                                    <span className="text-[10px] font-bold text-red-600 mt-1 flex items-center gap-1">
                                      <AlertCircle size={11} className="flex-shrink-0" />
                                      {formErrors[`applicant_${activeApplicantIndex}_bodyWeightKg`]}
                                    </span>
                                  )}
                              </div>

                              <div>
                                <label className="text-[9.5px] font-bold uppercase text-amber-900 block mb-1">
                                  LUGGAGE (MAX 20 KG PER PERSON)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  max={20}
                                  value={currentApp.luggageKg}
                                  placeholder="5 (or 0 if none)"
                                  onChange={(e) =>
                                    handleApplicantChange(activeApplicantIndex, "luggageKg", e.target.value)
                                  }
                                  onBlur={() => handleApplicantBlur(activeApplicantIndex, "luggageKg")}
                                  className={`w-full px-3 py-2 rounded-xl bg-white border text-xs font-bold text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:font-normal focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_luggageKg`] &&
                                    touchedFields[`applicant_${activeApplicantIndex}_luggageKg`]
                                    ? "border-red-500 bg-red-50/30"
                                    : "border-amber-300 focus:border-amber-500"
                                    }`}
                                />
                                {formErrors[`applicant_${activeApplicantIndex}_luggageKg`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_luggageKg`] && (
                                    <span className="text-[10px] font-bold text-red-600 mt-1 flex items-center gap-1">
                                      <AlertCircle size={11} className="flex-shrink-0" />
                                      {formErrors[`applicant_${activeApplicantIndex}_luggageKg`]}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* â”€â”€ CARD 2: FLIGHT LOGISTICS & CONTACT â”€â”€ */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-200/60 text-[#200B3B]">
                            <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                              <Calendar size={13} />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-wider">
                              2. Flight Logistics &amp; Contact{" "}
                              {bookingFlightOption !== "charter" && bookingSeatCount > 1
                                ? `â€” Applicant ${activeApplicantIndex + 1}`
                                : ""}
                            </h4>
                          </div>

                          {/* WhatsApp & Email */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                EMAIL ADDRESS *
                              </label>
                              <input
                                type="email"
                                value={currentApp.email}
                                placeholder="ram.thapa@example.com"
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "email", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "email")}
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:font-normal focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_email`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_email`]
                                  ? "border-red-400 bg-red-50/20 focus:border-red-500"
                                  : "border-gray-200 focus:border-[#E91E63]"
                                  }`}
                              />
                              {formErrors[`applicant_${activeApplicantIndex}_email`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_email`] && (
                                  <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={11} className="flex-shrink-0" />
                                    {formErrors[`applicant_${activeApplicantIndex}_email`]}
                                  </span>
                                )}
                            </div>

                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                WHATSAPP PHONE NUMBER *
                              </label>
                              <div
                                className={`flex rounded-xl border overflow-hidden transition-all ${formErrors[`applicant_${activeApplicantIndex}_phone`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_phone`]
                                  ? "border-red-400 bg-red-50/20 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500"
                                  : "border-gray-200 focus-within:border-[#E91E63] focus-within:ring-1 focus-within:ring-[#E91E63] bg-white"
                                  }`}
                              >
                                <select
                                  value={currentApp.phoneCode || "+977"}
                                  onChange={(e) =>
                                    handleApplicantChange(activeApplicantIndex, "phoneCode", e.target.value)
                                  }
                                  className="flex-shrink-0 bg-gray-50 border-r border-gray-200 px-2.5 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                                  style={{ maxWidth: "135px" }}
                                >
                                  {COUNTRY_CODES.map((c) => (
                                    <option key={`${c.iso}-${c.code}`} value={c.code}>
                                      {isoToFlag(c.iso)} {c.code} ({c.iso})
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="tel"
                                  value={currentApp.phone}
                                  placeholder="98XXXXXXXX"
                                  onChange={(e) =>
                                    handleApplicantChange(activeApplicantIndex, "phone", e.target.value)
                                  }
                                  onBlur={() => handleApplicantBlur(activeApplicantIndex, "phone")}
                                  className="flex-1 min-w-0 px-3.5 py-2.5 text-xs font-semibold text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:font-normal focus:outline-none bg-transparent"
                                />
                              </div>
                              {formErrors[`applicant_${activeApplicantIndex}_phone`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_phone`] && (
                                  <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={11} className="flex-shrink-0" />
                                    {formErrors[`applicant_${activeApplicantIndex}_phone`]}
                                  </span>
                                )}
                            </div>
                          </div>

                          {/* Flight Date & Pickup Hotel */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                PREFERRED FLIGHT DATE *
                              </label>
                              <input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={currentApp.preferredDate}
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "preferredDate", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "preferredDate")}
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_preferredDate`] &&
                                  touchedFields[`applicant_${activeApplicantIndex}_preferredDate`]
                                  ? "border-red-400 bg-red-50/20 focus:border-red-500"
                                  : "border-gray-200 focus:border-[#E91E63]"
                                  }`}
                              />
                              {formErrors[`applicant_${activeApplicantIndex}_preferredDate`] &&
                                touchedFields[`applicant_${activeApplicantIndex}_preferredDate`] && (
                                  <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={11} className="flex-shrink-0" />
                                    {formErrors[`applicant_${activeApplicantIndex}_preferredDate`]}
                                  </span>
                                )}
                            </div>

                            <div>
                              <label className="text-[10px] font-black uppercase text-[#200B3B] block mb-1">
                                PICKUP HOTEL IN KATHMANDU / POKHARA
                              </label>
                              <input
                                type="text"
                                value={currentApp.pickupHotel}
                                placeholder="Hotel Annapurna, Lakeside Pokhara"
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "pickupHotel", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "pickupHotel")}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#E91E63] text-xs font-semibold text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:font-normal focus:outline-none transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* â”€â”€ CARD 3: DOCUMENT ATTACHMENTS â”€â”€ */}
                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-xs space-y-3.5">
                          {/* Hidden file inputs */}
                          <input
                            ref={passportRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleApplicantDocChange(activeApplicantIndex, "passportFile", e.target.files[0]);
                              }
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                          <input
                            ref={photoRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleApplicantDocChange(activeApplicantIndex, "photoFile", e.target.files[0]);
                              }
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                          <input
                            ref={flightRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleApplicantDocChange(activeApplicantIndex, "flightFile", e.target.files[0]);
                              }
                              e.target.value = "";
                            }}
                            className="hidden"
                          />

                          <input
                            ref={insuranceRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleApplicantDocChange(activeApplicantIndex, "insuranceFile", e.target.files[0]);
                              }
                              e.target.value = "";
                            }}
                            className="hidden"
                          />

                          {/* Section Header */}
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-[#200B3B]">
                              <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                                <UploadCloud size={13} />
                              </div>
                              <h4 className="text-xs font-black uppercase tracking-wider">
                                3. Document Attachments
                              </h4>
                            </div>
                          </div>

                          <p className="text-[11px] text-gray-500 -mt-1 font-medium">
                            Attach files{bookingFlightOption !== "charter" && bookingSeatCount > 1 ? ` for Applicant ${activeApplicantIndex + 1}` : ""} or send later via WhatsApp. Accepted: PDF, JPG, PNG (max 10 MB each).
                          </p>

                          <div className="space-y-2.5">
                            {[
                              {
                                label: "Passport / National ID",
                                required: true,
                                ref: passportRef,
                                file: currentApp.passportFile,
                                clear: () => handleApplicantDocChange(activeApplicantIndex, "passportFile", null),
                                hint: bookingFlightOption !== "charter" && bookingSeatCount > 1
                                  ? `Clear color copy of Applicant ${activeApplicantIndex + 1}'s passport (valid â‰¥ 6 months)`
                                  : `Clear color copy of your passport (valid â‰¥ 6 months)`,
                              },
                              {
                                label: "Passport Size Photo",
                                required: true,
                                ref: photoRef,
                                file: currentApp.photoFile,
                                clear: () => handleApplicantDocChange(activeApplicantIndex, "photoFile", null),
                                hint: bookingFlightOption !== "charter" && bookingSeatCount > 1
                                  ? `White background, digital copy for Applicant ${activeApplicantIndex + 1}`
                                  : `White background, digital copy`,
                              },
                              {
                                label: "Confirmed Return Flight Ticket",
                                required: false,
                                ref: flightRef,
                                file: currentApp.flightFile,
                                clear: () => handleApplicantDocChange(activeApplicantIndex, "flightFile", null),
                                hint: "PDF or screenshot of round-trip reservation",
                              },

                              {
                                label: "Travel Insurance",
                                required: false,
                                ref: insuranceRef,
                                file: currentApp.insuranceFile,
                                clear: () => handleApplicantDocChange(activeApplicantIndex, "insuranceFile", null),
                                hint: "Travel/medical insurance with emergency helicopter evacuation coverage (optional if required)",
                              },
                            ].map((field) => (
                              <div
                                key={field.label}
                                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border ${field.file
                                  ? "bg-emerald-50/60 border-emerald-200"
                                  : "bg-white border-gray-200 hover:border-[#E91E63]"
                                  } transition-all`}
                              >
                                {/* Left: icon + label */}
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${field.file
                                      ? "bg-emerald-100 text-emerald-600"
                                      : "bg-pink-50 text-[#E91E63]"
                                      }`}
                                  >
                                    {field.file ? (
                                      <CheckCircle2 size={16} />
                                    ) : (
                                      <FileText size={15} />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-[#200B3B] flex items-center gap-1.5 flex-wrap">
                                      <span>{field.label}</span>
                                      {field.required ? (
                                        <span className="text-[#E91E63] font-black">*</span>
                                      ) : (
                                        <span className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                          Optional
                                        </span>
                                      )}
                                    </p>
                                    {field.file ? (
                                      <p className="text-[10px] text-emerald-700 font-semibold truncate max-w-[200px] sm:max-w-xs">
                                        {field.file.name}{" "}
                                        <span className="text-emerald-500 font-normal">
                                          ({(field.file.size / 1024).toFixed(0)} KB)
                                        </span>
                                      </p>
                                    ) : (
                                      <p className="text-[10px] text-gray-400">{field.hint}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Right: attach / remove */}
                                {field.file ? (
                                  <button
                                    type="button"
                                    onClick={field.clear}
                                    className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold transition-colors cursor-pointer border border-red-200"
                                  >
                                    <Trash2 size={11} />
                                    Remove
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => field.ref.current?.click()}
                                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#E91E63] text-xs font-bold transition-colors cursor-pointer border border-pink-200 shadow-2xs"
                                  >
                                    <UploadCloud size={13} />
                                    Attach
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>


                      </div>
                    );
                  })()}

                  {/* Terms & Conditions */}
                  <div>
                    <label className="flex items-start gap-2 text-[10.5px] text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookingFormData.termsAgreed}
                        onChange={(e) => handleFieldChange("termsAgreed", e.target.checked)}
                        className="mt-0.5 accent-[#E91E63]"
                      />
                      <span>
                        I declare that all passenger information &amp; body weight details are accurate. I understand that alpine flights are subject to CAAN safety regulations and weather permits.
                      </span>
                    </label>
                    {formErrors.termsAgreed && touchedFields.termsAgreed && (
                      <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={11} className="flex-shrink-0" />
                        {formErrors.termsAgreed}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#E91E63] hover:bg-pink-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <Plane size={16} />
                    <span>{isSubmitting ? "SUBMITTING..." : "CONFIRM & SUBMIT HELI RESERVATION"}</span>
                  </button>
                </form>
              ) : currentStep === "payment" ? (
                <div className="space-y-3">
                  <PaymentMethod
                    bookingReference={submissionId}
                    packageTitle={bookingTour?.title || ""}
                    category="Helicopter Service"
                    tierName={
                      bookingFlightOption === "charter"
                        ? "Private Charter"
                        : "Sharing Heli Service"
                    }
                    guestsCount={
                      bookingFlightOption === "charter"
                        ? 1
                        : bookingSeatCount
                    }
                    unitPriceFormatted={displayPrice(
                      bookingFlightOption === "sharing"
                        ? bookingTotalPriceNPR / Math.max(1, bookingSeatCount)
                        : bookingTotalPriceNPR,
                      selectedCurrency,
                      nprPerOneDollar,
                      nprPerOneINR
                    )}
                    totalPriceFormatted={displayPrice(
                      bookingTotalPriceNPR,
                      selectedCurrency,
                      nprPerOneDollar,
                      nprPerOneINR
                    )}
                    travelDate={
                      bookingFormData.applicants?.[0]?.preferredDate
                        ? `Date: ${bookingFormData.applicants[0].preferredDate}`
                        : undefined
                    }
                    isProcessingPayment={isProcessingPayment}
                    initialMethod={selectedPaymentMethod}
                    onMethodChange={setSelectedPaymentMethod}
                    onPayWithEsewa={handleEsewaPayment}
                    onPayLater={handlePayLater}
                  />

                  {paymentError && (
                    <p className="text-xs text-red-600 font-semibold text-center">
                      {paymentError}
                    </p>
                  )}

                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep("form")}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium underline transition-colors cursor-pointer"
                    >
                      &larr; Edit Booking Details
                    </button>
                  </div>
                </div>
              ) : currentStep === "submitted" ? (
                /* =======================================================================
                   STEP 3: REGISTRATION & SUBMISSION CONFIRMATION (Matching Visa Service)
                   ======================================================================= */
                <div className="space-y-3.5 text-center animate-in fade-in zoom-in-95 duration-200">
                  {/* Top Greeting & Status */}
                  <div className="space-y-1.5 pt-0.5">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white mb-0.5 shadow-md ring-4 ${
                        paymentStatus === "paid"
                          ? "bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/20 ring-emerald-50"
                          : "bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/20 ring-amber-50"
                      }`}
                    >
                      <CheckCircle2 size={26} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <span
                        className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {paymentStatus === "paid"
                          ? "Payment Received • Reservation Confirmed"
                          : "Reservation Confirmed • Payment Pending"}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <h4 className="text-base sm:text-lg font-black text-[#1A0B2E] tracking-tight">
                        Thank you, {bookingFormData.applicants?.[0]?.fullName || "Valued Passenger"}!
                      </h4>
                      <BadgeCheck size={18} className="text-emerald-600 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Your helicopter service reservation for{" "}
                      <strong className="text-slate-800 font-semibold">
                        {bookingTour?.title || selectedTour?.title}
                      </strong>{" "}
                      has been confirmed for{" "}
                      {bookingFlightOption === "charter"
                        ? "Private Charter"
                        : `${bookingSeatCount} passenger${bookingSeatCount > 1 ? "s" : ""}`}.
                    </p>
                  </div>

                  {/* Officer Contact Reassurance Card */}
                  <div className="bg-gradient-to-r from-purple-50/70 via-white to-purple-50/50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-left shadow-2xs">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap mb-0.5">
                      <span className="text-xs font-black text-[#1A0B2E]">
                        Our Flight Operations Officer will contact you soon
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      A flight coordinator will reach out on{" "}
                      <strong className="text-slate-800">WhatsApp &amp; Phone</strong> (
                      {bookingFormData.applicants?.[0]?.phone
                        ? `${bookingFormData.applicants[0].phoneCode || "+977"} ${bookingFormData.applicants[0].phone}`
                        : "your registered phone"}
                      ) to verify passenger manifests, VIP helipad entry, and confirm CAAN weather permits.
                    </p>
                  </div>

                  {/* Official Digital E-Receipt Voucher Card */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs text-left">
                    {/* Submission Reference ID Header Strip */}
                    <div className="bg-[#FAF8FD] px-3.5 py-2.5 border-b border-purple-100/70 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block leading-none">
                          OFFICIAL SUBMISSION NUMBER
                        </span>
                        <span className="font-mono font-black text-sm sm:text-base text-[#1A0B2E] tracking-wider mt-0.5 block">
                          {submissionId || "THTT-HELI-CONFIRMED"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (submissionId) {
                            navigator.clipboard.writeText(submissionId);
                            setCopiedId(true);
                            setTimeout(() => setCopiedId(false), 2000);
                          }
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-100/70 hover:bg-purple-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        {copiedId ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedId ? "Copied" : "Copy"}</span>
                      </button>
                    </div>

                    {/* Key Details Grid */}
                    <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-white">
                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          {bookingFlightOption !== "charter" && bookingSeatCount > 1 ? "Lead Passenger" : "Passenger"}
                        </span>
                        <span className="font-bold text-[#1A0B2E] truncate block text-xs mt-0.5">
                          {bookingFormData.applicants?.[0]?.fullName || "—"}
                        </span>
                      </div>

                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Total Passengers
                        </span>
                        <span className="font-bold text-[#1A0B2E] truncate block text-xs mt-0.5">
                          {bookingFlightOption === "charter" ? "Private (Exclusive)" : `${bookingSeatCount} Persons`}
                        </span>
                      </div>

                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Flight Option
                        </span>
                        <span className="font-bold text-[#E91E63] truncate block text-xs mt-0.5">
                          {bookingFlightOption === "charter" ? "Private Charter" : "Sharing Helicopter"}
                        </span>
                      </div>

                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Total Estimated Fare
                        </span>
                        <span className="font-black text-[#1A0B2E] text-xs mt-0.5 block">
                          {displayPrice(
                            bookingTotalPriceNPR,
                            selectedCurrency,
                            nprPerOneDollar,
                            nprPerOneINR
                          )}
                        </span>
                      </div>

                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Flight Date
                        </span>
                        <span className="font-medium text-slate-700 text-xs truncate block mt-0.5">
                          {bookingFormData.applicants?.[0]?.preferredDate || "Flexible"}
                        </span>
                      </div>

                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Submitted At
                        </span>
                        <span className="font-medium text-slate-700 text-[10.5px] truncate block mt-0.5">
                          {submittedAt || new Date().toLocaleDateString()}
                        </span>
                      </div>

                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Payment Status
                        </span>
                        <span
                          className={`font-black text-xs mt-0.5 block ${
                            paymentStatus === "paid" ? "text-emerald-700" : "text-amber-600"
                          }`}
                        >
                          {paymentStatus.toUpperCase()} (
                          {selectedPaymentMethod === "esewa"
                            ? paymentStatus === "paid"
                              ? "eSewa"
                              : "eSewa Pending"
                            : "Pay Later"}
                          )
                        </span>
                      </div>

                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Payment Verification
                        </span>
                        <span
                          className={`font-black text-xs mt-0.5 block ${
                            paymentStatus === "paid" ? "text-emerald-700" : "text-blue-600"
                          }`}
                        >
                          {paymentStatus === "paid" ? "VERIFIED" : "PENDING"}
                        </span>
                      </div>
                    </div>

                    {/* Multiple passengers list breakdown if sharing and seatCount > 1 */}
                    {bookingFlightOption !== "charter" && bookingSeatCount > 1 && (
                      <div className="p-3 bg-slate-50/80 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block">
                            All Registered Passengers ({bookingSeatCount})
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            Manifest Details Registered
                          </span>
                        </div>
                        <div className="space-y-2 max-h-52 overflow-y-auto">
                          {bookingFormData.applicants?.slice(0, bookingSeatCount).map((app, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-xs space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-[#200B3B] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="font-black text-[#1A0B2E] text-xs">
                                    {app.fullName || `Passenger ${idx + 1}`}
                                  </span>
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {app.nationality || "—"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] text-slate-600 bg-slate-50/70 p-1.5 rounded-lg border border-slate-100">
                                <div>
                                  <span className="text-slate-400 block text-[8.5px] uppercase font-bold">ID / NID</span>
                                  <span className="font-mono font-bold text-slate-800">{app.idNumber || "—"}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[8.5px] uppercase font-bold">Body Wt.</span>
                                  <span className="font-semibold text-slate-700">{app.bodyWeightKg ? `${app.bodyWeightKg} kg` : "—"}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[8.5px] uppercase font-bold">Luggage</span>
                                  <span className="font-semibold text-slate-700">{app.luggageKg ? `${app.luggageKg} kg` : "0 kg"}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[8.5px] uppercase font-bold">Contact</span>
                                  <span className="truncate block font-semibold text-slate-700">
                                    {app.phone ? `${app.phoneCode || "+977"} ${app.phone}` : app.email || "—"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const lead = bookingFormData.applicants?.[0];
                        const phoneDisplay = lead?.phone ? `${lead.phoneCode || "+977"} ${lead.phone}` : "—";
                        const flightLabel = bookingFlightOption === "charter" ? "Private Charter" : "Sharing Helicopter";
                        const paxCount = bookingFlightOption === "charter" ? 1 : bookingSeatCount;

                        const msg = encodeURIComponent(
                          `*Helicopter Service Reservation Confirmation*\n\n` +
                          `📌 *Submission Reference:* ${submissionId}\n` +
                          `🚁 *Tour:* ${bookingTour?.title || selectedTour?.title}\n` +
                          `✈️ *Flight Option:* ${flightLabel}\n` +
                          `👥 *Passengers:* ${paxCount}\n` +
                          `📅 *Flight Date:* ${lead?.preferredDate || "Flexible"}\n` +
                          `🏨 *Pickup Hotel:* ${lead?.pickupHotel || "Kathmandu/Pokhara"}\n` +
                          `💳 *Payment:* ${selectedPaymentMethod === "esewa" ? "eSewa" : "Pay Later"} (${paymentStatus.toUpperCase()})\n` +
                          `📞 *Lead Contact:* ${phoneDisplay}`
                        );

                        window.open(`https://wa.me/9779851420882?text=${msg}`, "_blank", "noopener,noreferrer");
                      }}
                      className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
                    >
                      <MessageCircle size={15} />
                      <span>Chat on WhatsApp</span>
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handlePrintBookingSlip}
                        className="flex-1 py-2.5 px-3.5 bg-white hover:bg-purple-50/70 border border-purple-200 text-[#1A0B2E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:border-purple-300"
                      >
                        <Printer size={13} className="text-purple-700" />
                        <span>Print Slip</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsBookingModalOpen(false);
                          setCurrentStep("form");
                          setPaymentError("");
                          setIsSubmitted(false);
                        }}
                        className="flex-1 py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageHeliService;

