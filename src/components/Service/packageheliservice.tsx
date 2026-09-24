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

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
} from "../../api/BackendApi";

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
}

export interface HeliPackageItem extends HeliTourData {
  id: string;
  backendId: number;

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

  return {
    id: String(pkg.id),
    backendId: Number(pkg.id),

    title: pkg.title ?? "Helicopter Package",
    slug: pkg.slug ?? String(pkg.id),

    tag: pkg.tag ?? pkg.adventure_category ?? "",

    location: pkg.location ?? "Nepal",
    duration: pkg.duration ?? "",
    maxAltitude: "",

    rating: Number(pkg.rating ?? 0),
    reviewsCount: Number(pkg.reviews_count ?? pkg.reviewsCount ?? 0),

    // Actual package price
    packagePriceNPR: basePrice,

    // Keep existing booking UI working without calling pricing-tier API.
    // Both fallback to the actual package price.
    charterPriceNPR: basePrice,
    sharingPriceNPR: basePrice,

    charterDesc: pkg.charter_description ?? pkg.charterDesc ?? "",
    sharingDesc: pkg.sharing_description ?? pkg.sharingDesc ?? "",

    image: pkg.image ?? "",
    gallery: pkg.image ? [pkg.image] : [],

    description: pkg.description ?? "",

    category: getCategoryFromPackage(pkg),

    tripHighlights: Array.isArray(pkg.highlights)
      ? pkg.highlights.map((item: any) => item?.title ?? item?.item ?? item?.description ?? "").filter(Boolean)
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

export const PackageHeliService: React.FC = () => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  const navigate = useNavigate();
  const { tourId } = useParams<{ tourId?: string }>();
  const [searchParams] = useSearchParams();
  const routeTourId = tourId || searchParams.get("tour");

  const [pricingTiers, setPricingTiers] = useState<PricingTierApi[]>([]);
  const [pricingLoading, setPricingLoading] = useState(false);

  const [heliPackages, setHeliPackages] = useState<HeliPackageItem[]>([]);
  const [packageFaqs, setPackageFaqs] = useState<Array<{ q: string; a: string }>>([]);
  const [packagesLoading, setPackagesLoading] = useState<boolean>(true);
  const [packagesError, setPackagesError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const fetchHeliPackages = async () => {
      try {
        setPackagesLoading(true);
        setPackagesError("");

        const response = await getPackagesByCategory("Heli Services");
        const rawPackages = Array.isArray(response.data?.data?.data)
          ? response.data.data.data
          : [];

        const mappedPackages = rawPackages.map((pkg: any) =>
          mapApiPackageToHeliPackage(pkg)
        );

        if (!cancelled) setHeliPackages(mappedPackages);
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
            q: faq.question ?? faq.q ?? "",
            a: faq.answer ?? faq.a ?? "",
          }))
          .filter((faq) => faq.q && faq.a);

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

  const rateUSD = nprPerOneDollar || 133;
  const printCharterPriceNPR = selectedTour?.charterPriceNPR || 0;
  const printSharingPriceNPR = selectedTour?.sharingPriceNPR || 0;
  const printCharterPriceUSD = Math.round(printCharterPriceNPR / rateUSD);
  const printSharingPriceUSD = Math.round(printSharingPriceNPR / rateUSD);
  const printVipPriceNPR = Math.round(printSharingPriceNPR * 1.15);
  const printVipPriceUSD = Math.round(printSharingPriceUSD * 1.15);

  const heliItineraryList = [
    { phase: "Phase 1", title: "Private Hotel Pickup & Airport Transfer", desc: "Private vehicle transfer from your hotel to the domestic airport helicopter terminal. Check-in, passenger weighing & CAAN flight manifest clearance." },
    { phase: "Phase 2", title: "Captain Safety Briefing & Boarding", desc: "Meet your CAAN-certified alpine captain. Comprehensive briefing on headsets, emergency oxygen protocols, and high-altitude flight safety." },
    { phase: "Phase 3", title: `Scenic Helicopter Flight to ${selectedTour?.location || "Alpine Destination"}`, desc: "Take off and enjoy breathtaking aerial views of Himalayan massifs, deep valleys, and alpine rivers from panoramic window seats." },
    { phase: "Phase 4", title: "Alpine Ground Landing & Photography", desc: `Land at ${selectedTour?.maxAltitude ? `${selectedTour.location} (${selectedTour.maxAltitude})` : (selectedTour?.location || "Alpine Base")}. Savor 30-45 minutes of ground time for photography, fresh mountain air, and tea/coffee.` },
    { phase: "Phase 5", title: "Return Scenic Flight & Hotel Drop-off", desc: "Scenic return flight with aerial panorama of snow-capped peaks. Touchdown and private transfer back to your hotel." },
  ];

  // Active Tab in Details Page: "OVERVIEW" | "POLICIES" | "FAQS" | "TESTIMONIES"
  const [activeDetailTab, setActiveDetailTab] = useState<
    "OVERVIEW" | "POLICIES" | "FAQS" | "TESTIMONIES"
  >("OVERVIEW");

  // Filter States for Cards Listing
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(800000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingTour, setBookingTour] = useState<HeliPackageItem | null>(null);
  const [bookingFlightOption, setBookingFlightOption] = useState<"charter" | "sharing">("charter");
  const [bookingSeatCount, setBookingSeatCount] = useState<number>(1);
  const [activeApplicantIndex, setActiveApplicantIndex] = useState<number>(0);
  const [bookingTotalPriceNPR, setBookingTotalPriceNPR] = useState<number>(0);

  // Submission / Print Slip State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string>("");
  const [submittedAt, setSubmittedAt] = useState<string>("");
  const [copiedId, setCopiedId] = useState<boolean>(false);

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
    const label = `Applicant ${index + 1}`;
    switch (field) {
      case "fullName":
        if (!value || !String(value).trim())
          return `${label}: Full name is required`;
        if (String(value).trim().length < 2)
          return `${label}: Name must be at least 2 characters`;
        return undefined;
      case "nationality":
        if (!value || !String(value).trim())
          return `${label}: Nationality is required`;
        if (String(value).trim().length < 2)
          return `${label}: Please enter valid nationality`;
        return undefined;
      case "idNumber":
        if (!value || !String(value).trim())
          return `${label}: Passport or NID number is required`;
        if (String(value).trim().length < 4)
          return `${label}: ID must be at least 4 characters`;
        return undefined;
      case "bodyWeightKg":
        if (value === "" || value === null || value === undefined)
          return `${label}: Weight declaration is mandatory for flight safety`;
        const weightNum = Number(value);
        if (isNaN(weightNum) || weightNum < 20 || weightNum > 160)
          return `${label}: Weight must be between 20 kg and 160 kg`;
        return undefined;
      case "luggageKg":
        if (value === "" || value === null || value === undefined) return undefined;
        const lugNum = Number(value);
        if (isNaN(lugNum)) return `${label}: Please enter a valid luggage weight in kg`;
        if (lugNum < 0) return `${label}: Luggage weight cannot be negative`;
        if (lugNum > 20) return `${label}: Luggage cannot exceed 20 kg per person`;
        return undefined;
      case "email":
        if (!value || !String(value).trim())
          return `${label}: Email address is required`;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()))
          return `${label}: Please enter a valid email address`;
        return undefined;
      case "phone":
        if (!value || !String(value).trim())
          return `${label}: WhatsApp phone number is required`;
        const cleanPhone = String(value).replace(/[\s\-()]/g, "");
        if (!/^\d{6,15}$/.test(cleanPhone))
          return `${label}: Enter a valid phone number (6-15 digits)`;
        return undefined;
      case "preferredDate":
        if (!value) return `${label}: Preferred flight date is required`;
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) return `${label}: Flight date cannot be in the past`;
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

  // Open booking modal
  const handleOpenBooking = (tour: HeliPackageItem, option: "charter" | "sharing" = "charter") => {
    const seatCount = 1;
    setBookingTour(tour);
    setBookingFlightOption(option);
    setBookingSeatCount(seatCount);
    setActiveApplicantIndex(0);
    setBookingTotalPriceNPR(option === "charter" ? tour.charterPriceNPR : tour.sharingPriceNPR);
    setBookingFormData((prev) => ({
      ...prev,
      applicants: Array.from(
        { length: seatCount },
        (_, i) =>
          prev.applicants?.[i] || {
            fullName: i === 0 ? prev.fullName : "",
            nationality: i === 0 ? prev.nationality : "",
            idNumber: i === 0 ? prev.idNumber : "",
            bodyWeightKg: i === 0 ? prev.bodyWeightKg : "",
            luggageKg: i === 0 ? prev.luggageKg : "",
            email: i === 0 ? prev.email : "",
            phoneCode: i === 0 ? prev.phoneCode || "+977" : "+977",
            phone: i === 0 ? prev.phone : "",
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
    setIsBookingModalOpen(true);
  };

  // Handler for PriceModel book now trigger
  const handlePriceModelBookNow = (details: {
    flightType: "charter" | "sharing";
    seatCount: number;
    totalPriceNPR: number;
  }) => {
    if (!selectedTour) return;
    const seatCount = details.flightType === "charter" ? 1 : Math.max(1, details.seatCount || 1);
    setBookingTour(selectedTour);
    setBookingFlightOption(details.flightType);
    setBookingSeatCount(seatCount);
    setActiveApplicantIndex(0);
    setBookingTotalPriceNPR(details.totalPriceNPR);
    setBookingFormData((prev) => ({
      ...prev,
      applicants: Array.from(
        { length: seatCount },
        (_, i) =>
          prev.applicants?.[i] || {
            fullName: i === 0 ? prev.fullName : "",
            nationality: i === 0 ? prev.nationality : "",
            idNumber: i === 0 ? prev.idNumber : "",
            bodyWeightKg: i === 0 ? prev.bodyWeightKg : "",
            luggageKg: i === 0 ? prev.luggageKg : "",
            email: i === 0 ? prev.email : "",
            phoneCode: i === 0 ? prev.phoneCode || "+977" : "+977",
            phone: i === 0 ? prev.phone : "",
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
    setIsBookingModalOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paxCount = bookingFlightOption === "charter" ? 1 : Math.max(1, bookingSeatCount || 1);
    const errors: Record<string, string | undefined> = {};
    const allTouched: Record<string, boolean> = { ...touchedFields };

    // Validate each applicant
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

    // Terms agreement
    allTouched["termsAgreed"] = true;
    const termsErr = validateHeliField("termsAgreed", bookingFormData.termsAgreed);
    if (termsErr) errors["termsAgreed"] = termsErr;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setTouchedFields(allTouched);

      // Auto-switch to first applicant with an error
      for (let i = 0; i < paxCount; i++) {
        const hasErr = Object.keys(errors).some((k) =>
          k.startsWith(`applicant_${i}_`)
        );
        if (hasErr) {
          setActiveApplicantIndex(i);
          break;
        }
      }
      return;
    }

    setFormErrors({});
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `TH-HELI-2026-${randomSuffix}`;
    const now = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    setSubmissionId(generatedId);
    setSubmittedAt(now);
    setIsSubmitted(true);
  };

  // Print quotation dossier from Details View
  const handlePrintQuotation = () => {
    const originalTitle = document.title;
    document.title = `${selectedTour?.title || "Heli Tour"} - Quotation Slip - Trip Himalaya`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
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
          <td style="font-size:9px; font-family:'Courier New', monospace; font-weight:600; color:#0f172a; background:#ffffff; border:1px solid #cbd5e1; padding:5px 8px;">${app.idNumber || bookingFormData.idNumber || "—"}</td>
          <td style="font-size:9px; font-weight:700; text-align:center; color:#0f172a; background:#ffffff; border:1px solid #cbd5e1; padding:5px 8px;">${app.bodyWeightKg || bookingFormData.bodyWeightKg || "—"} kg</td>
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

          /* ── PAGE WRAPPER ── */
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

          /* ── WATERMARK ── */
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

          /* ── LETTERHEAD ── */
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

          /* ── DOC TITLE BAND ── */
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

          /* ── REFERENCE BOX ── */
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

          /* ── SECTION HEADING ── */
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

          /* ── DETAIL TABLE ── */
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

          /* ── NOTICE BOX ── */
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

          /* ── CHECKLIST ── */
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
            font-weight: 900;
            font-size: 9.5px;
            flex-shrink: 0;
            margin-top: 1px;
          }

          /* ── INFO CARD GRID ── */
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

          /* ── FARE HIGHLIGHT BOX ── */
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

          /* ── FOOTER ── */
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
                <div class="company-contact-row">Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal &nbsp;|&nbsp; 977-9851403761 &nbsp;|&nbsp; pradip.triphimalayatt@gmail.com &nbsp;|&nbsp; www.triphimalaya.com.np</div>
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
              <div class="ic-value accent">${bookingFormData.fullName || "—"}</div>
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
              <div class="ic-value mono">${bookingFormData.phone ? `${bookingFormData.phoneCode} ${bookingFormData.phone}` : "—"}</div>
            </div>
            <div class="info-card span2">
              <div class="ic-label">Email Address</div>
              <div class="ic-value">${bookingFormData.email || "—"}</div>
            </div>
            <div class="info-card">
              <div class="ic-label">Passport / ID Number</div>
              <div class="ic-value mono">${bookingFormData.idNumber || "—"}</div>
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
            <strong>Next Step:</strong> Our dedicated <strong>Heli Flight Operations Officer</strong> will contact you within <strong>15–30 minutes</strong> via WhatsApp or phone call to verify passenger manifests, coordinate Tribhuvan International Airport (TIA) domestic VIP helipad terminal entry, and confirm CAAN flight slot clearance.
          </div>

          <!-- CHECKLIST -->
          <div class="checklist-box">
            <div class="checklist-title">Heli Flight Preparation Checklist</div>
            <div class="checklist-grid">
              <div class="checklist-item"><span class="ci-icon">✓</span> Original Passport or National ID Card (Mandatory for airport security check)</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> Flight booking confirmation slip (printed / digital copy)</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> High-altitude windproof down jacket &amp; 100% UV sunglasses</div>
              <div class="checklist-item"><span class="ci-icon">✓</span> Accurate payload declaration (Luggage limited to max 20 kg per passenger)</div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="doc-footer">
            <div class="footer-left">
              This is a system-generated confirmation slip. No physical signature is required.<br>
              24/7 Heli Operations Desk: 977-9851403761 &nbsp;|&nbsp; pradip.triphimalayatt@gmail.com &nbsp;|&nbsp; www.triphimalaya.com.np
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
    window.open(`https://wa.me/9779851403761?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  // Filter logic — exclude rescue category from listing
  const LISTING_PACKAGES = heliPackages;

  const filteredTours = LISTING_PACKAGES.filter((tour) => {
    // Search
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      tour.title.toLowerCase().includes(query) ||
      tour.location.toLowerCase().includes(query) ||
      tour.description.toLowerCase().includes(query) ||
      tour.tripHighlights.some((h) =>
        h.toLowerCase().includes(query)
      );

    // Route filter
    const routeMap: Record<string, string> = {
      everest: "ebc",
      annapurna: "abc",
      langtang: "langtang",
      muktinath: "pilgrimage",
      gosaikunda: "pilgrimage",
    };

    const mappedCategory = urlRoute
      ? routeMap[urlRoute.toLowerCase()]
      : "";

    const matchesRoute =
      !urlRoute ||
      (mappedCategory
        ? tour.category === mappedCategory
        : tour.location
          .toLowerCase()
          .includes(urlRoute.toLowerCase()) ||
        tour.title
          .toLowerCase()
          .includes(urlRoute.toLowerCase()));

    // Flight Type
    // Pricing-tier API is intentionally not called here, so do not filter
    // packages by pricing-tier service.
    const matchesFlightType = true;

    // Price
    const matchesPrice =
      tour.packagePriceNPR <= priceRange;

    // Rating
    const matchesRating =
      selectedRating === 0 ||
      tour.rating >= selectedRating;

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
      matchesSearch &&
      matchesRoute &&
      matchesFlightType &&
      matchesPrice &&
      matchesRating &&
      matchesKeywords
    );
  });

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
      <div className="w-full py-16 text-center text-sm font-bold text-gray-500">
        Loading helicopter packages...
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
      {/* ── DETAIL VIEW (Matching Image 2) ─────────────────────────────────────── */}
      {/* ========================================================================= */}
      {selectedTour ? (
        <div className="w-full space-y-8 animate-in fade-in duration-300">
          {/* ══════════════════════════════════════════════════════════
              PRINT-ONLY COMPREHENSIVE DOSSIER & QUOTATION
              Includes all details: Itinerary, Inclusions, Exclusions,
              Restrictions, What to Bring, Pricing, FAQs, and Policies.
              ══════════════════════════════════════════════════════════ */}
          {!isBookingModalOpen && (
            <div
              id="heli-print-dossier"
              className="hidden print:block relative"
              style={{
                fontFamily: "'Inter', Arial, sans-serif",
                fontSize: "9.5px",
                lineHeight: "1.45",
                color: "#1e293b",
                width: "100%",
                position: "relative",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              }}
            >
              {/* ── BACKGROUND WATERMARK ── */}
              <div
                aria-hidden="true"
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: 999,
                }}
              >
                <div
                  style={{
                    transform: "rotate(-28deg)",
                    fontSize: "38px",
                    fontWeight: 900,
                    color: "rgba(45, 19, 71, 0.06)",
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

              {/* ── 1. CORPORATE LETTERHEAD ── */}
              <div style={{ background: "linear-gradient(135deg, #2D1347 0%, #3B145C 50%, #4a1c7a 100%)", borderRadius: "10px 10px 0 0", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                  <div style={{ background: "#ffffff", borderRadius: "8px", padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img src={Logo} alt="Trip Himalaya" style={{ height: "68px", width: "auto", objectFit: "contain", display: "block" }} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.01em", margin: 0, whiteSpace: "nowrap" }}>
                      Trip Himalaya Tours &amp; Travel Pvt. Ltd.
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2.5px",
                        marginTop: "4px",
                        fontSize: "8.5px",
                        color: "#f3e8ff",
                        lineHeight: "1.35",
                      }}
                    >
                      {/* Row 1: Address */}
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                        <MapPin size={10} color="#f472b6" style={{ flexShrink: 0 }} />
                        <span>Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal</span>
                      </div>
                      {/* Row 2: Phone + Website */}
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                          <span style={{ color: "#f472b6" }}>📞</span>
                          <span>+977 9851403761</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                          <span style={{ color: "#f472b6" }}>🌐</span>
                          <span>www.triphimalaya.com.np</span>
                        </div>
                      </div>
                      {/* Row 3: Email */}
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                        <span style={{ color: "#f472b6" }}>✉</span>
                        <span>pradip.triphimalayatt@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, whiteSpace: "nowrap", alignSelf: "flex-end", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", paddingBottom: "2px" }}>
                  <div style={{ fontSize: "8.5px", background: "rgba(233, 30, 99, 0.25)", color: "#fbcfe8", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, border: "1px solid rgba(233, 30, 99, 0.4)" }}>
                    Helicopter Operations Team
                  </div>
                  <div style={{ fontSize: "9.5px", color: "#e9d5ff", whiteSpace: "nowrap" }}>
                    Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
              </div>
              {/* Project brand accent strip */}
              <div style={{ height: "4px", background: "linear-gradient(90deg, #E91E63 0%, #db2777 30%, #9333ea 70%, #2D1347 100%)", marginBottom: "10px" }} />

              {/* ── PACKAGE SUMMARY & OVERVIEW CARD ── */}
              <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px", background: "#fdf4ff", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "15px", fontWeight: 900, color: "#2D1347", lineHeight: 1.2 }}>{selectedTour.title}</div>
                    <div style={{ fontSize: "8.5px", color: "#6b21a8", marginTop: "4px", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ background: "#2D1347", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>Heli Services</span>
                      {selectedTour.location && <span style={{ background: "#7c3aed", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>📍 {selectedTour.location}</span>}
                      {selectedTour.duration && <span style={{ background: "#9333ea", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>⏱ {selectedTour.duration}</span>}
                      {selectedTour.maxAltitude && <span style={{ background: "#c026d3", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>⚡ Max Alt: {selectedTour.maxAltitude}</span>}
                      <span style={{ background: "#E91E63", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>★ {selectedTour.rating || 4.9} / 5.0 ({selectedTour.reviewsCount || 1} reviews)</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "8px", color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Starting From</div>
                    <div style={{ fontSize: "16px", fontWeight: 900, color: "#2D1347" }}>{startsFromDisplayPrice}</div>
                  </div>
                </div>
                <div style={{ marginTop: "7px", paddingTop: "7px", borderTop: "1px solid #f3e8ff", fontSize: "9px", color: "#4a154b", lineHeight: "1.45" }}>
                  <strong style={{ color: "#2D1347" }}>Experience Overview: </strong>
                  {selectedTour.description}
                </div>
              </div>

              {/* ── SECTION 1: PRICING SCHEDULE ── */}
              <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "5px" }}>
                  1. Pricing Schedule &amp; Package Tiers
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px", border: "1px solid #e9d5ff" }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", color: "#ffffff" }}>
                      <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: 800, width: "42%" }}>Service / Experience Tier</th>
                      <th style={{ padding: "6px 8px", textAlign: "center", fontWeight: 800, width: "22%" }}>Group / Age Bracket</th>
                      <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, width: "18%" }}>Price (NPR)</th>
                      <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, width: "18%" }}>Price (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: "#ffffff", borderBottom: "1px solid #f3e8ff" }}>
                      <td style={{ padding: "5px 8px", fontWeight: 700, color: "#2D1347" }}>Private Charter (Full Helicopter)</td>
                      <td style={{ padding: "5px 8px", textAlign: "center", color: "#6b21a8" }}>Up to 5 Pax (Private Flight)</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 800, color: "#2D1347" }}>NPR {printCharterPriceNPR.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, color: "#E91E63" }}>${printCharterPriceUSD.toLocaleString()}</td>
                    </tr>
                    <tr style={{ background: "#faf5ff", borderBottom: "1px solid #f3e8ff" }}>
                      <td style={{ padding: "5px 8px", fontWeight: 700, color: "#2D1347" }}>Group Joining (Per Seat Sharing)</td>
                      <td style={{ padding: "5px 8px", textAlign: "center", color: "#6b21a8" }}>Per Person (Guaranteed Seat)</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 800, color: "#2D1347" }}>NPR {printSharingPriceNPR.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, color: "#E91E63" }}>${printSharingPriceUSD.toLocaleString()}</td>
                    </tr>
                    <tr style={{ background: "#ffffff", borderBottom: "1px solid #f3e8ff" }}>
                      <td style={{ padding: "5px 8px", fontWeight: 700, color: "#2D1347" }}>VIP Priority (Front Window View)</td>
                      <td style={{ padding: "5px 8px", textAlign: "center", color: "#6b21a8" }}>Per Person (Front Window Seat)</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 800, color: "#2D1347" }}>NPR {printVipPriceNPR.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 700, color: "#E91E63" }}>${printVipPriceUSD.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ fontSize: "8px", color: "#7c3aed", marginTop: "3px", fontWeight: 500 }}>
                  * Rates include certified captain/pilot fees, aviation passenger insurance, landing permits, national park fees, and emergency ground support.
                </div>
              </div>

              {/* ── SECTION 2: DAY-BY-DAY / STEP-BY-STEP ITINERARY ── */}
              <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "6px" }}>
                  2. Step-by-Step Experience Itinerary &amp; Timeline
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {heliItineraryList.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        border: "1px solid #e9d5ff",
                        borderRadius: "4px",
                        padding: "6px 8px",
                        background: "#faf5ff",
                        display: "flex",
                        gap: "8px",
                        alignItems: "flex-start",
                        pageBreakInside: "avoid",
                        breakInside: "avoid",
                      }}
                    >
                      <div
                        style={{
                          background: "#2D1347",
                          color: "#ffffff",
                          fontSize: "8px",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: "3px",
                          flexShrink: 0,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.phase || `Phase ${i + 1}`}
                      </div>
                      <div>
                        <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#2D1347" }}>{item.title}</div>
                        <div style={{ fontSize: "8.5px", color: "#581c87", marginTop: "1px", lineHeight: "1.35" }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SECTION 3: TRIP HIGHLIGHTS ── */}
              <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "6px" }}>
                  3. Key Highlights &amp; Features
                </div>
                <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "8px 10px", background: "#fdf4ff" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                    {(selectedTour.tripHighlights || []).map((h: string, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "9px", color: "#4a154b" }}>
                        <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>✓</span>
                        <span style={{ lineHeight: "1.35" }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── SECTION 4: INCLUSIONS & EXCLUSIONS (2 columns) ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                {/* What's Included */}
                <div style={{ border: "1.5px solid #d8b4fe", borderRadius: "6px", padding: "8px 10px", background: "#faf5ff" }}>
                  <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
                    4. What&apos;s Included
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    {(selectedTour.whatsIncluded || []).map((inc: string, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#581c87" }}>
                        <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>✓</span>
                        <span style={{ lineHeight: "1.3" }}>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's Excluded */}
                <div style={{ border: "1.5px solid #fecdd3", borderRadius: "6px", padding: "8px 10px", background: "#fff1f2" }}>
                  <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#881337", borderBottom: "1.5px solid #fda4af", paddingBottom: "3px", marginBottom: "5px" }}>
                    5. What&apos;s Excluded / Not Included
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    {(selectedTour.whatsExcluded || []).map((ex: string, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#4c0519" }}>
                        <span style={{ fontWeight: 900, color: "#be185d", flexShrink: 0 }}>✗</span>
                        <span style={{ lineHeight: "1.3" }}>{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── SECTION 5: SAFETY GUIDELINES, RESTRICTIONS & WHAT TO BRING (2 columns) ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                {/* Restrictions */}
                <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "8px 10px", background: "#fdf4ff" }}>
                  <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
                    6. Safety Restrictions &amp; CAAN Flight Rules
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    {(selectedTour.restrictionsAndHealth || []).map((r: string, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#4a154b" }}>
                        <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>&bull;</span>
                        <span style={{ lineHeight: "1.3" }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What to Bring */}
                <div style={{ border: "1.5px solid #d8b4fe", borderRadius: "6px", padding: "8px 10px", background: "#faf5ff" }}>
                  <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
                    7. Passenger Checklist &amp; What to Bring
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    {(selectedTour.whatToBring || []).map((b: string, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "5px", fontSize: "8.5px", color: "#581c87" }}>
                        <span style={{ fontWeight: 900, color: "#9333ea", flexShrink: 0 }}>&bull;</span>
                        <span style={{ lineHeight: "1.3" }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── SECTION 6: FREQUENTLY ASKED QUESTIONS ── */}
              <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderLeft: "3.5px solid #E91E63", paddingLeft: "7px", marginBottom: "6px" }}>
                  8. Important FAQs &amp; Flight Information
                </div>
                <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "8px 10px", background: "#fdf4ff" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {packageFaqs.map((faq, i) => (
                      <div key={i} style={{ fontSize: "8.5px", color: "#4a154b", lineHeight: "1.35" }}>
                        <div style={{ fontWeight: 800, color: "#2D1347" }}>Q: {faq.q}</div>
                        <div style={{ color: "#581c87", marginTop: "1px" }}>A: {faq.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── SECTION 7: BOOKING TERMS & CANCELLATION POLICIES ── */}
              <div style={{ border: "1.5px solid #e9d5ff", borderRadius: "6px", padding: "7px 10px", marginBottom: "10px", background: "#faf5ff", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2D1347", borderBottom: "1.5px solid #e9d5ff", paddingBottom: "3px", marginBottom: "5px" }}>
                  9. Booking Policies, Weather &amp; Cancellation Terms
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 14px", fontSize: "8px", color: "#4a154b", lineHeight: "1.4" }}>
                  <div><strong style={{ color: "#2D1347" }}>Weather Guarantee:</strong> 100% full refund or complimentary reschedule if flight is grounded due to mountain weather/air traffic control.</div>
                  <div><strong style={{ color: "#2D1347" }}>Weight &amp; Balance:</strong> Strictly max 5 passengers or total passenger weight per CAAN and aircraft flight manual specifications.</div>
                  <div><strong style={{ color: "#2D1347" }}>Reservation &amp; Confirmation:</strong> 30% advance deposit secures flight slot and permits; balance payable prior to boarding.</div>
                  <div><strong style={{ color: "#2D1347" }}>Permits &amp; Identification:</strong> Valid passport copy (or Nepali citizenship ID) required for domestic terminal clearance.</div>
                </div>
              </div>

              {/* ── CORPORATE FOOTER ── */}
              <div style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", padding: "8px 14px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "8.5px", color: "#ffffff" }}>
                <div>
                  <strong style={{ color: "#ffffff" }}>Trip Himalaya Tours &amp; Travel Pvt. Ltd.</strong> &bull; Registered in Nepal (Lic: 2490)
                </div>
                <div style={{ color: "#fce7f3" }}>
                  Heli Operations Desk: +977 9851403761 &bull; pradip.triphimalayatt@gmail.com
                </div>
                <div style={{ fontWeight: 700, color: "#f472b6" }}>
                  Official Computer-Generated Travel Dossier &bull; Page 1 of 1
                </div>
              </div>
            </div>
          )}

          {/* ── TOP HERO HEADER (From Image 2) ── */}
          <div className="print:hidden relative rounded-3xl overflow-hidden shadow-xl min-h-[300px] sm:min-h-[360px] flex flex-col justify-end text-white">
            <img
              src={selectedTour.image}
              alt={selectedTour.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#200B3B]/95 via-[#200B3B]/60 to-black/30" />

            {/* ── Share button (top-right, always visible) ── */}
            <div ref={shareDropdownRef} className="absolute top-3 right-4 sm:top-8 sm:right-6 z-20 print:hidden">
              <button
                type="button"
                onClick={() => setIsShareOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95"
                title="Share this tour"
              >
                <Share2 size={16} />
              </button>

              {/* Share Dropdown */}
              {isShareOpen && (
                <div className="absolute top-12 right-0 sm:top-0 sm:right-12 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/80 p-2 flex items-center gap-1.5 min-w-max z-30 animate-in fade-in duration-150">
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
                    title="Facebook"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{ background: "#1877F2" }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" width="15" height="15">
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
                    title="Instagram"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="white" />
                      <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                    </svg>
                  </button>

                  {/* TikTok */}
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href).catch(() => { });
                      setIsShareCopied(true);
                      setTimeout(() => setIsShareCopied(false), 2000);
                      window.open("https://www.tiktok.com/@trip.himalaya", "_blank", "noopener,noreferrer");
                      setIsShareOpen(false);
                    }}
                    title="TikTok"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{ background: "#000000" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  </button>

                  {/* LinkedIn */}
                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                          window.location.href
                        )}&title=${encodeURIComponent(selectedTour.title)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                      setIsShareOpen(false);
                    }}
                    title="LinkedIn"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{ background: "#0A66C2" }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" fill="white" />
                    </svg>
                  </button>

                  {/* Twitter / X */}
                  <button
                    type="button"
                    onClick={() => {
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          window.location.href
                        )}&text=${encodeURIComponent(selectedTour.title)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                      setIsShareOpen(false);
                    }}
                    title="Twitter / X"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{ background: "#000000" }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" width="13" height="13">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
                    title="WhatsApp"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                    style={{ background: "#25D366" }}
                  >
                    <MessageCircle size={15} color="white" />
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer ${isShareCopied ? "bg-emerald-500" : "bg-gray-700 hover:bg-gray-900"
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
            </div>

            {/* ── Desktop-only: stacked action buttons top-right ── */}
            <div className="hidden sm:flex flex-col absolute sm:top-32 sm:right-6 gap-2 w-48 z-20 print:hidden">
              <button
                type="button"
                onClick={() => handleWhatsAppInquiry(selectedTour)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <MessageCircle size={15} />
                <span>Ask on WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={handlePrintQuotation}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#200B3B]/60 hover:bg-[#200B3B]/80 backdrop-blur-md border border-white/25 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Printer size={14} />
                <span>Print / Save PDF</span>
              </button>
            </div>

            {/* ── Title & description + mobile action buttons ── */}
            <div className="relative z-10 p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {selectedTour.title}
                </h1>
                <span className="bg-[#E91E63] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xs">
                  EXPERIENCE
                </span>
              </div>
              <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl mb-4 sm:mb-0">
                {selectedTour.description}
              </p>

              {/* Mobile-only: action buttons below description */}
              <div className="flex sm:hidden items-center gap-3 mt-4 print:hidden">
                <button
                  type="button"
                  onClick={() => handleWhatsAppInquiry(selectedTour)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle size={14} />
                  <span>Ask on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintQuotation}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Printer size={14} />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── SUB-NAVIGATION STRIP (OVERVIEW | POLICIES | FAQS | TESTIMONIES + Starts From & Book Now) ── */}
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

          {/* ── MAIN 2-COLUMN LAYOUT: CONTENT + HELI SERVICE PRICE MODEL ── */}
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

                  {/* Description + Trip Highlights — single card */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                      {selectedTour.description}
                    </p>
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <h3 className="text-base sm:text-lg font-black text-[#200B3B]">
                        Trip Highlights
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedTour.tripHighlights.map((item, idx) => (
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
                  </div>

                  {/* What's Included (Teal Green Card) & What's Excluded (Pink Card) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* What's Included */}
                    <div className="bg-[#009688] text-white p-6 rounded-3xl shadow-sm space-y-4">
                      <h4 className="flex items-center gap-2 text-sm sm:text-base font-black uppercase tracking-wider">
                        <CheckCircle2 size={18} />
                        <span>What's Included</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs font-medium">
                        {selectedTour.whatsIncluded.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2 leading-relaxed">
                            <Check size={15} className="flex-shrink-0 mt-0.5 text-teal-200" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What's Excluded */}
                    <div className="bg-[#E91E63] text-white p-6 rounded-3xl shadow-sm space-y-4">
                      <h4 className="flex items-center gap-2 text-sm sm:text-base font-black uppercase tracking-wider">
                        <X size={18} />
                        <span>What's Excluded</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs font-medium">
                        {selectedTour.whatsExcluded.map((exc, i) => (
                          <li key={i} className="flex items-start gap-2 leading-relaxed">
                            <X size={15} className="flex-shrink-0 mt-0.5 text-pink-200" />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Restrictions & Health Card (Amber Warning) */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                    <h3 className="flex items-center gap-2.5 text-base sm:text-lg font-black text-[#200B3B]">
                      <AlertTriangle size={20} className="text-amber-500" />
                      <span>Restrictions &amp; Health</span>
                    </h3>
                    <ul className="space-y-2.5 pt-1 text-xs text-gray-700 leading-relaxed">
                      {selectedTour.restrictionsAndHealth.map((res, i) => (
                        <li key={i} className="flex items-start gap-2.5 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What to Bring Card (Pink Bag) */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                    <h3 className="flex items-center gap-2.5 text-base sm:text-lg font-black text-[#200B3B]">
                      <ShoppingBag size={20} className="text-[#E91E63]" />
                      <span>What to Bring</span>
                    </h3>
                    <ul className="space-y-2.5 pt-1 text-xs text-gray-700 leading-relaxed">
                      {selectedTour.whatToBring.map((wtb, i) => (
                        <li key={i} className="flex items-start gap-2.5 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63] mt-1.5 flex-shrink-0" />
                          <span>{wtb}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-xl font-black text-[#200B3B]">
                    Frequently Asked Questions about {selectedTour.title}
                  </h3>
                  <div className="space-y-3">
                    {packageFaqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2"
                      >
                        <h4 className="text-sm font-bold text-[#200B3B]">{faq.q}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
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
              className="lg:col-span-4 lg:sticky lg:top-[150px] self-start space-y-6"
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
                    `https://wa.me/9779851403761?text=${msg}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================================= */
        /* ── CARDS LISTING VIEW (Matching Image 1) ────────────────────────────── */
        /* ======================================================================= */
        <div className="w-full space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* ── LEFT: FILTER SIDEBAR ── */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
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
                    setPriceRange(800000);
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
                  max={800000}
                  step={10000}
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

            {/* ── RIGHT: HORIZONTAL HELI CARDS (Matching Image 1) ── */}
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
                      setPriceRange(800000);
                      setSelectedRating(0);
                      setSelectedKeywords([]);
                      setSearchQuery("");
                      navigate("/service/heli-services");
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
                      className="flex flex-col md:flex-row md:h-[230px] bg-white rounded-3xl shadow-sm hover:shadow-lg border border-gray-100/90 transition-all duration-300 overflow-hidden group cursor-pointer"
                    >
                      {/* Left: Image with Badge */}
                      <div className="relative w-full md:w-72 lg:w-80 h-52 md:h-full flex-shrink-0 overflow-hidden bg-gray-100">
                        <img
                          src={tour.image}
                          alt={tour.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-xs text-[#2D1347] text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          {tour.tag}
                        </span>
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
                                  className="text-yellow-400 fill-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase">
                              HIGHLY RATED
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-base sm:text-lg font-black text-[#200B3B] group-hover:text-[#E91E63] transition-colors leading-snug line-clamp-1">
                            {tour.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-gray-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                            {tour.description}
                          </p>
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

                          {/* Instant Inquiry */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsAppInquiry(tour);
                            }}
                            className="flex items-center justify-center gap-1.5 mt-2.5 text-[10px] font-bold text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer group/inq"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                            <span className="group-hover/inq:underline">INSTANT INQUIRY</span>
                          </div>
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
      {/* ── BOOKING MODAL & PRINT SLIP ─────────────────────────────────────────── */}
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
              {!isSubmitted ? (
                /* ── STEP 1: SUBMISSION FORM ── */
                <form onSubmit={handleFormSubmit} noValidate className="space-y-4 sm:space-y-5">
                  {/* Validation Error Banner */}
                  {Object.keys(formErrors).length > 0 &&
                    Object.values(formErrors).some(Boolean) && (
                      <div className="p-3 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                        <span>Please correct the highlighted fields before submitting.</span>
                      </div>
                    )}

                  {/* ── APPLICANT SELECTOR TABS (Shown prominently when paxCount > 1, sharing only) ── */}
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

                  {/* ── ALL DETAILS FOR CURRENT ACTIVE APPLICANT (As marked in image) ── */}
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
                        {/* ── CARD 1: PERSONAL DETAILS ── */}
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
                                  ? `— Applicant ${activeApplicantIndex + 1}`
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
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "fullName", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "fullName")}
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_fullName`] &&
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
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "nationality", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "nationality")}
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_nationality`] &&
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
                              onChange={(e) =>
                                handleApplicantChange(activeApplicantIndex, "idNumber", e.target.value)
                              }
                              onBlur={() => handleApplicantBlur(activeApplicantIndex, "idNumber")}
                              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_idNumber`] &&
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
                                  onChange={(e) =>
                                    handleApplicantChange(activeApplicantIndex, "bodyWeightKg", e.target.value)
                                  }
                                  onBlur={() => handleApplicantBlur(activeApplicantIndex, "bodyWeightKg")}
                                  className={`w-full px-3 py-2 rounded-xl bg-white border text-xs font-bold text-gray-800 focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_bodyWeightKg`] &&
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
                                  onChange={(e) =>
                                    handleApplicantChange(activeApplicantIndex, "luggageKg", e.target.value)
                                  }
                                  onBlur={() => handleApplicantBlur(activeApplicantIndex, "luggageKg")}
                                  className={`w-full px-3 py-2 rounded-xl bg-white border text-xs font-bold text-gray-800 focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_luggageKg`] &&
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

                        {/* ── CARD 2: FLIGHT LOGISTICS & CONTACT ── */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-200/60 text-[#200B3B]">
                            <div className="w-6 h-6 rounded-lg bg-pink-100 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                              <Calendar size={13} />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-wider">
                              2. Flight Logistics &amp; Contact{" "}
                              {bookingFlightOption !== "charter" && bookingSeatCount > 1
                                ? `— Applicant ${activeApplicantIndex + 1}`
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
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "email", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "email")}
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 focus:outline-none transition-colors ${formErrors[`applicant_${activeApplicantIndex}_email`] &&
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
                                  onChange={(e) =>
                                    handleApplicantChange(activeApplicantIndex, "phone", e.target.value)
                                  }
                                  onBlur={() => handleApplicantBlur(activeApplicantIndex, "phone")}
                                  className="flex-1 min-w-0 px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none bg-transparent"
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
                                onChange={(e) =>
                                  handleApplicantChange(activeApplicantIndex, "pickupHotel", e.target.value)
                                }
                                onBlur={() => handleApplicantBlur(activeApplicantIndex, "pickupHotel")}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#E91E63] text-xs font-semibold text-gray-800 focus:outline-none transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* ── CARD 3: DOCUMENT ATTACHMENTS ── */}
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
                                  ? `Clear color copy of Applicant ${activeApplicantIndex + 1}'s passport (valid ≥ 6 months)`
                                  : `Clear color copy of your passport (valid ≥ 6 months)`,
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
                    className="w-full py-3.5 rounded-xl bg-[#E91E63] hover:bg-pink-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <Plane size={16} />
                    <span>CONFIRM &amp; SUBMIT HELI RESERVATION</span>
                  </button>
                </form>
              ) : (
                /* ── STEP 2: DIGITAL CONFIRMATION & RECEIPT VIEW (Matches Tour Package Modal Exactly) ── */
                <div className="space-y-3.5 text-center animate-in fade-in zoom-in-95 duration-200">
                  {/* Top Greeting & Status */}
                  <div className="space-y-1 pt-0.5">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white mb-0.5 shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50">
                      <CheckCircle2 size={24} className="stroke-[2.5]" />
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <h4 className="text-base sm:text-lg font-black text-[#1A0B2E] tracking-tight">
                        Thank you, {bookingFormData.fullName || "Valued Traveler"}!
                      </h4>
                      <BadgeCheck size={18} className="text-emerald-600 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Your heli flight reservation for <strong className="text-slate-800 font-semibold">{bookingTour.title}</strong> has been registered.
                    </p>
                  </div>

                  {/* Specialist Contact Reassurance Card */}
                  <div className="bg-gradient-to-r from-purple-50/70 via-white to-purple-50/50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-left shadow-2xs">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap mb-0.5">
                      <span className="text-xs font-black text-[#1A0B2E]">
                        Our Heli Flight Operations Desk will contact you soon
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Our operations officer will reach out on <strong className="text-slate-800">WhatsApp &amp; Phone</strong> ({bookingFormData.phone ? `${bookingFormData.phoneCode} ${bookingFormData.phone}` : "your number"}) to verify CAAN flight clearances and coordinate helipad boarding.
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
                          {submissionId}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(submissionId);
                          setCopiedId(true);
                          setTimeout(() => setCopiedId(false), 2000);
                        }}
                        type="button"
                        className="flex items-center gap-1 text-[11px] font-bold text-[#E91E63] hover:underline cursor-pointer"
                      >
                        {copiedId ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedId ? "Copied!" : "Copy Code"}</span>
                      </button>
                    </div>

                    {/* 6 Key Details Grid */}
                    <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-white">
                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Lead Passenger</span>
                        <span className="font-bold text-[#1A0B2E] truncate block text-xs mt-0.5">
                          {bookingFormData.fullName || "—"}
                        </span>
                      </div>

                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Flight Option</span>
                        <span className="font-bold text-[#E91E63] truncate block text-xs mt-0.5">
                          {bookingFlightOption === "charter" ? "Private Charter" : "Sharing Heli Service"}
                        </span>
                      </div>

                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Passengers</span>
                        <span className="font-bold text-[#1A0B2E] truncate block text-xs mt-0.5">
                          {bookingFlightOption === "charter" ? "Exclusive Aircraft" : `${bookingSeatCount} Passenger(s)`}
                        </span>
                      </div>

                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Estimated Fare</span>
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
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Flight Date</span>
                        <span className="font-medium text-slate-700 text-xs truncate block mt-0.5">
                          {bookingFormData.preferredDate || "Immediate"}
                        </span>
                      </div>

                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Submitted At</span>
                        <span className="font-medium text-slate-700 text-[10.5px] truncate block mt-0.5">
                          {submittedAt}
                        </span>
                      </div>
                    </div>

                    {/* Desk Status Footer */}
                    <div className="px-3.5 py-1.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-emerald-900">Desk Status: CAAN Flight Manifest Clearance in Progress</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const msg = encodeURIComponent(
                          `Hello Trip Himalaya! I just booked "${bookingTour.title}" with Reference ID: ${submissionId}. Lead Passenger: ${bookingFormData.fullName}. Flight Date: ${bookingFormData.preferredDate || "Immediate"}. Please confirm my heli flight slot.`
                        );
                        window.open(`https://wa.me/9779851403761?text=${msg}`, "_blank", "noopener,noreferrer");
                      }}
                      className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer truncate"
                    >
                      <MessageCircle size={15} />
                      <span>Chat on WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrintBookingSlip}
                      className="py-2.5 px-3.5 bg-white hover:bg-purple-50/70 border border-purple-200 text-[#1A0B2E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:border-purple-300"
                    >
                      <Printer size={13} className="text-purple-700" />
                      <span>Print Slip</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsBookingModalOpen(false)}
                      className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageHeliService;
