import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { services, workPermitTestimonials, packages } from "../assets/data/mockData";
import {
  Compass,
  ArrowRight,
  Shield,
  Clock,
  Heart,
  HeartPulse,
  FileText,
  Users,
  Globe,
  MapPin,
  Plane,
  Mountain,
  Bed,
  Car,
  Wind,
  ShieldCheck,
  Sparkles,
  Activity,
  Star,
  ChevronUp,
  ChevronDown,
  Building2,
  Award,
  HeartHandshake,
  Stethoscope,
  Globe2,
  Zap,
  Fuel,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import BannerSection from "../components/reusable/BannerSection";
import Testimonials from "../components/reusable/Testimonials";
import PreFooter from "../components/reusable/PreFooter";
import ToursDetailContent, { TourFilterCriteria } from "../components/Service/ToursDetailContent";
import ActivitiesDetailContent, { ActivityFilterCriteria } from "../components/Service/ActivitiesDetailContent";
import TrekkingDetailContent, { TrekFilterCriteria } from "../components/Service/TrekkingDetailContent";
import HotelBookingDetailContent, { HotelFilterCriteria } from "../components/Service/HotelBookingDetailContent";
import TravelInsuranceDetailContent, { InsuranceFilterCriteria } from "../components/Service/TravelInsuranceDetailContent";
import { INSURANCE_PLANS } from "../components/Service/insuranceData";
import VehicleRentalDetailContent, {
  VehicleFilterCriteria,
  AVAILABLE_VEHICLE_ROUTES,
} from "../components/Service/VehicleRentalDetailContent";
import { getAllVehicles, getPackagesByCategory, getHotels, getVisaCategories, getInsurancePlans } from "../api/BackendApi";
import HeliServicesDetailContent from "../components/Service/HeliServicesDetailContent";
import VisaServicesDetailContent, { VisaFilterCriteria } from "../components/Service/VisaServicesDetailContent";
import { SEO } from "../components/reusable";
import { pagesSEO } from "../config/seoConfig";

const ServiceDetail: React.FC = () => {
  const { slug, tourId } = useParams<{ slug: string; tourId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // If slug is work-permit, redirect to dedicated /work-permit route
  if (slug === "work-permit") {
    return <Navigate to="/work-permit" replace />;
  }

  // Find the service by slug or by id
  const service = services.find(
    (s) =>
      s.slug.toLowerCase() === slug?.toLowerCase() ||
      s.id === slug ||
      (slug === "activities" && s.slug === "activities") ||
      (slug === "tours" && s.slug === "tours") ||
      (slug === "trekking" && s.slug === "trekking") ||
      (slug === "air-ticket" && s.slug === "air-ticket") ||
      (slug === "hotel-booking" && s.slug === "hotel-booking") ||
      (slug === "visa-services" && s.slug === "visa-services") ||
      (slug === "travel-insurance" && s.slug === "travel-insurance") ||
      (slug === "vehicle-rental" && s.slug === "vehicle-rental") ||
      (slug === "heli-services" && s.slug === "heli-services")
  );

  const scrollToSection = (id: string, _tabName?: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // account for sticky 3-tier header
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (!service) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-purple-50/40 to-white flex items-center justify-center px-4 py-20 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-pink-50 flex items-center justify-center text-[#E91E63] shadow-inner">
            <Compass size={40} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E91E63] block mb-2">
            Service Not Found
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D1347] mb-3 tracking-tight">
            Unknown Service
          </h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
            The travel service you requested could not be located. It might have been updated, renamed, or temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-full border border-gray-200 text-xs font-bold text-[#2D1347] hover:bg-gray-50 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Go Back
            </button>
            <Link
              to="/service"
              className="px-6 py-3 rounded-full bg-[#E91E63] hover:bg-pink-600 text-white text-xs font-bold shadow-md shadow-pink-200 transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2"
            >
              <span>Explore Services</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAirTicket =
    service.slug === "air-ticket" ||
    service.name.toLowerCase().includes("air") ||
    service.name.toLowerCase().includes("flight");
  const isTours = service.slug === "tours";
  const isActivities = service.slug === "activities";
  const isTrekking = service.slug === "trekking";
  const isHotelBooking = service.slug === "hotel-booking";
  const isTravelInsurance = service.slug === "travel-insurance";
  const isVehicleRental = service.slug === "vehicle-rental";
  const isHeliServices = service.slug === "heli-services";
  const isHeliTourDetailPage = isHeliServices && Boolean(tourId || searchParams.get("tour"));
  const isVisaServices = service.slug === "visa-services" || service.slug === "visa";

  // Visa Search Bar State
  const [visaSearchCountry, setVisaSearchCountry] = useState("");
  const [visaSearchType, setVisaSearchType] = useState("all");
  const [visaSearchEntry, setVisaSearchEntry] = useState("all");
  const [appliedVisaFilter, setAppliedVisaFilter] = useState<VisaFilterCriteria | null>(null);

  // Visa autocomplete state
  const [visaSuggestions, setVisaSuggestions] = useState<string[]>([]);
  const [showVisaDropdown, setShowVisaDropdown] = useState(false);
  const [allVisaSuggestionPool, setAllVisaSuggestionPool] = useState<string[]>([]);
  const visaDropdownRef = useRef<HTMLDivElement>(null);

  // Close visa dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (visaDropdownRef.current && !visaDropdownRef.current.contains(e.target as Node)) {
        setShowVisaDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVisaSearch = () => {
    setShowVisaDropdown(false);
    setAppliedVisaFilter({
      country: visaSearchCountry,
      visaType: visaSearchType,
      entryType: visaSearchEntry,
    });
    scrollToSection("section-services", "SERVICES");
  };

  // Heli Search Bar State
  const [heliLocationInput, setHeliLocationInput] = useState("all");
  const [heliNameInput, setHeliNameInput] = useState("");
  const [appliedHeliFilter, setAppliedHeliFilter] = useState<{ location: string; name: string } | null>(null);

  // Heli name autocomplete state
  const [heliNameSuggestions, setHeliNameSuggestions] = useState<string[]>([]);
  const [showHeliNameDropdown, setShowHeliNameDropdown] = useState(false);
  const [allHeliNamePool, setAllHeliNamePool] = useState<string[]>([]);
  const heliNameDropdownRef = useRef<HTMLDivElement>(null);

  // Heli region custom dropdown state
  const [showHeliRegionDropdown, setShowHeliRegionDropdown] = useState(false);
  const heliRegionDropdownRef = useRef<HTMLDivElement>(null);

  // Dynamically built from API — only real heli package locations
  const [heliRegions, setHeliRegions] = useState<{ value: string; label: string }[]>([
    { value: "all", label: "All Regions" },
  ]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (heliNameDropdownRef.current && !heliNameDropdownRef.current.contains(e.target as Node)) {
        setShowHeliNameDropdown(false);
      }
      if (heliRegionDropdownRef.current && !heliRegionDropdownRef.current.contains(e.target as Node)) {
        setShowHeliRegionDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch heli package name suggestions AND locations for autocomplete / region dropdown
  useEffect(() => {
    if (!isHeliServices) return;
    const fetchHeliSuggestions = async () => {
      try {
        const response = await getPackagesByCategory("Heli Services");
        const pkgs =
          response.data?.data?.data ??
          response.data?.data ??
          [];
        if (Array.isArray(pkgs) && pkgs.length > 0) {
          // ── Name pool (for autocomplete) ──────────────────────────
          const nameMap = new Map<string, string>();
          // ── Location pool (for region dropdown) ───────────────────
          const locMap = new Map<string, string>(); // key=lowercase → display label

          pkgs.forEach((pkg: any) => {
            // Names
            const rawName = pkg.title || pkg.name;
            if (rawName && typeof rawName === "string") {
              const clean = rawName.trim();
              if (clean.length >= 2) {
                const key = clean.toLowerCase();
                if (!nameMap.has(key)) nameMap.set(key, clean);
              }
            }

            // Locations — try every field that might hold a region
            const rawLoc =
              pkg.location || pkg.destination || pkg.place || pkg.region || pkg.area;
            if (rawLoc && typeof rawLoc === "string") {
              // A single field may contain multiple locations split by comma or slash
              rawLoc.split(/[,/]/).forEach((part: string) => {
                const clean = part.trim();
                if (clean.length >= 2) {
                  const key = clean.toLowerCase();
                  if (!locMap.has(key)) {
                    // Title-case the display label
                    const label = clean
                      .split(/\s+/)
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                      .join(" ");
                    locMap.set(key, label);
                  }
                }
              });
            }
          });

          setAllHeliNamePool(Array.from(nameMap.values()));

          // Build region list: "All Regions" first, then sorted unique locations
          const dynamicRegions = Array.from(locMap.values())
            .sort((a, b) => a.localeCompare(b))
            .map((label) => ({ value: label, label }));
          setHeliRegions([{ value: "all", label: "All Regions" }, ...dynamicRegions]);
        }
      } catch (err) {
        console.error("Failed to fetch heli suggestions:", err);
      }
    };
    fetchHeliSuggestions();
  }, [isHeliServices]);

  const handleHeliSearch = () => {
    setShowHeliNameDropdown(false);
    setShowHeliRegionDropdown(false);
    const loc = heliLocationInput === "all" ? "" : heliLocationInput.trim();
    const name = heliNameInput.trim();
    if (!loc && !name) {
      setAppliedHeliFilter(null);
    } else {
      setAppliedHeliFilter({ location: loc, name });
    }
    setTimeout(() => scrollToSection("section-services", "SERVICES"), 80);
  };

  // Tours Search Bar State
  const [tourDestinationType, setTourDestinationType] = useState("all");
  const [tourLocationSearch, setTourLocationSearch] = useState("");
  const [appliedTourFilter, setAppliedTourFilter] = useState<TourFilterCriteria | null>(null);

  // Tours autocomplete state
  const [tourSuggestions, setTourSuggestions] = useState<string[]>([]);
  const [showTourDropdown, setShowTourDropdown] = useState(false);
  const [allTourSuggestionPool, setAllTourSuggestionPool] = useState<string[]>([]);
  const tourDropdownRef = useRef<HTMLDivElement>(null);

  // Close tour dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tourDropdownRef.current && !tourDropdownRef.current.contains(e.target as Node)) {
        setShowTourDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTourSearch = () => {
    setShowTourDropdown(false);
    setAppliedTourFilter({
      destinationType: tourDestinationType,
      location: tourLocationSearch,
    });
    scrollToSection("section-services", "SERVICES");
  };

  // Activity Search Bar State
  const [activitySearchQuery, setActivitySearchQuery] = useState("");
  const [activityAdventureLevel, setActivityAdventureLevel] = useState("all");
  const [appliedActivityFilter, setAppliedActivityFilter] = useState<ActivityFilterCriteria | null>(null);

  // Activity autocomplete state
  const [activitySuggestions, setActivitySuggestions] = useState<string[]>([]);
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [allActivitySuggestionPool, setAllActivitySuggestionPool] = useState<string[]>([]);
  const activityDropdownRef = useRef<HTMLDivElement>(null);

  // Close activity dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activityDropdownRef.current && !activityDropdownRef.current.contains(e.target as Node)) {
        setShowActivityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleActivitySearch = () => {
    setShowActivityDropdown(false);
    setAppliedActivityFilter({
      query: activitySearchQuery,
      location: activitySearchQuery,
      activityName: activitySearchQuery,
      difficulty: activityAdventureLevel,
    });
    scrollToSection("section-services", "SERVICES");
  };

  // Trekking Search Bar State
  const [trekLocationSearch, setTrekLocationSearch] = useState("");
  const [trekAdventureLevel, setTrekAdventureLevel] = useState("all");
  const [trekDurationSearch, setTrekDurationSearch] = useState("");
  const [appliedTrekFilter, setAppliedTrekFilter] = useState<TrekFilterCriteria | null>(null);

  // Trekking autocomplete state
  const [trekSuggestions, setTrekSuggestions] = useState<string[]>([]);
  const [showTrekDropdown, setShowTrekDropdown] = useState(false);
  const [allTrekSuggestionPool, setAllTrekSuggestionPool] = useState<string[]>([]);
  const trekDropdownRef = useRef<HTMLDivElement>(null);

  // Close trek dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (trekDropdownRef.current && !trekDropdownRef.current.contains(e.target as Node)) {
        setShowTrekDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTrekkingSearch = () => {
    setShowTrekDropdown(false);
    setAppliedTrekFilter({
      location: trekLocationSearch,
      difficulty: trekAdventureLevel,
    });
    scrollToSection("section-services", "SERVICES");
  };

  // Insurance Search Bar State
  const [insuranceSearchName, setInsuranceSearchName] = useState("");
  const [insuranceSearchType, setInsuranceSearchType] = useState("all");
  const [insuranceSearchDays, setInsuranceSearchDays] = useState("");
  const [appliedInsuranceFilter, setAppliedInsuranceFilter] = useState<InsuranceFilterCriteria | null>(null);

  // Insurance autocomplete state
  const [insuranceSuggestions, setInsuranceSuggestions] = useState<string[]>([]);
  const [showInsuranceDropdown, setShowInsuranceDropdown] = useState(false);
  const [allInsuranceSuggestionPool, setAllInsuranceSuggestionPool] = useState<string[]>([]);
  const insuranceDropdownRef = useRef<HTMLDivElement>(null);

  // Close insurance dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (insuranceDropdownRef.current && !insuranceDropdownRef.current.contains(e.target as Node)) {
        setShowInsuranceDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInsuranceSearch = () => {
    setShowInsuranceDropdown(false);
    setAppliedInsuranceFilter({
      name: insuranceSearchName,
      insuranceType: insuranceSearchType,
      days: insuranceSearchDays,
    });
    scrollToSection("section-services", "SERVICES");
  };

  // Hotel Booking Search Bar State
  const [hotelSearchRegion, setHotelSearchRegion] = useState("all");
  const [hotelSearchNameOrLocation, setHotelSearchNameOrLocation] = useState("");
  const [hotelSearchLocation, setHotelSearchLocation] = useState("");
  const [hotelSearchName, setHotelSearchName] = useState("");
  const [hotelSearchCheckIn, setHotelSearchCheckIn] = useState("");
  const [hotelSearchCheckOut, setHotelSearchCheckOut] = useState("");
  const [showHotelLocation, setShowHotelLocation] = useState(false);
  const [showHotelCheckIn, setShowHotelCheckIn] = useState(false);
  const [showHotelCheckOut, setShowHotelCheckOut] = useState(false);
  const [appliedHotelFilter, setAppliedHotelFilter] = useState<HotelFilterCriteria | null>(null);

  // Hotel autocomplete state
  const [hotelSuggestions, setHotelSuggestions] = useState<string[]>([]);
  const [showHotelDropdown, setShowHotelDropdown] = useState(false);
  const [allHotelSuggestionPool, setAllHotelSuggestionPool] = useState<string[]>([]);
  const hotelDropdownRef = useRef<HTMLDivElement>(null);

  // Close hotel dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (hotelDropdownRef.current && !hotelDropdownRef.current.contains(e.target as Node)) {
        setShowHotelDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLocationVisible = showHotelLocation || Boolean(hotelSearchLocation) || showHotelCheckIn || Boolean(hotelSearchCheckIn) || showHotelCheckOut || Boolean(hotelSearchCheckOut);
  const isCheckInVisible = showHotelCheckIn || Boolean(hotelSearchCheckIn) || showHotelCheckOut || Boolean(hotelSearchCheckOut);
  const isCheckOutVisible = showHotelCheckOut || Boolean(hotelSearchCheckOut);

  const handleHotelSearch = () => {
    setShowHotelDropdown(false);
    setAppliedHotelFilter({
      region: hotelSearchRegion,
      nameOrLocation: hotelSearchNameOrLocation,
      location: hotelSearchNameOrLocation || hotelSearchLocation,
      hotelName: hotelSearchNameOrLocation || hotelSearchName,
      checkInDate: hotelSearchCheckIn,
      checkOutDate: hotelSearchCheckOut,
    });
    scrollToSection("section-services", "SERVICES");
  };

  // Today's local date string (YYYY-MM-DD) so past dates cannot be selected
  const todayDateStr = (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  })();

  // Vehicle Rental Trip Type State
  const [vehicleTripType, setVehicleTripType] = useState<"One Way" | "Round Trip" | "Private">("One Way");

  // Vehicle Route Search State (One Way / Round Trip expanded fields)
  const [vehicleFrom, setVehicleFrom] = useState("");
  const [vehicleTo, setVehicleTo] = useState("");
  const [vehicleDepartureDate, setVehicleDepartureDate] = useState("");
  const [vehicleReturnDate, setVehicleReturnDate] = useState("");
  const [vehiclePassengers, setVehiclePassengers] = useState("1");
  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePassengerType, setVehiclePassengerType] = useState("");
  const [appliedVehicleFilter, setAppliedVehicleFilter] = useState<VehicleFilterCriteria | null>(null);

  // Dynamic fleet locations and custom vehicle types from database
  const [dynamicFromLocations, setDynamicFromLocations] = useState<string[]>([]);
  const [dynamicToLocations, setDynamicToLocations] = useState<string[]>([]);
  const [dynamicVehicleTypes, setDynamicVehicleTypes] = useState<string[]>([]);

  // Case-insensitive deduplication & Title-Case normalization
  const dedupeLocationsCaseInsensitive = (items: string[]): string[] => {
    const map = new Map<string, string>();
    items.forEach((item) => {
      if (!item || typeof item !== "string") return;
      const clean = item.trim();
      if (!clean) return;
      const key = clean.toLowerCase();
      if (!map.has(key)) {
        // Format to clean Title Case (e.g. "kathmandu" -> "Kathmandu")
        const formatted = clean
          .split(/\s+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
        map.set(key, formatted);
      }
    });
    return Array.from(map.values());
  };

  useEffect(() => {
    if (!isVehicleRental) return;
    const fetchDynamicVehicleData = async () => {
      try {
        const response = await getAllVehicles();
        const vehicleData = response.data?.data?.data ?? response.data?.data ?? response.data ?? [];
        if (Array.isArray(vehicleData) && vehicleData.length > 0) {
          const rawFromList: string[] = [];
          const rawToList: string[] = [];
          const typeSet = new Set<string>();

          vehicleData.forEach((v: any) => {
            const f = v.from_location || v.fromLocation || v.location;
            if (f && typeof f === "string") rawFromList.push(f);

            const t = v.destination || v.to_location || v.toLocation;
            if (t && typeof t === "string") rawToList.push(t);

            let routesArr = v.routes;
            if (typeof routesArr === "string") {
              try { routesArr = JSON.parse(routesArr); } catch (_) {}
            }
            if (Array.isArray(routesArr)) {
              routesArr.forEach((r: any) => {
                if (typeof r === "string") {
                  const parts = r.split(/\s*(?:to|-|–|->)\s*/i);
                  if (parts[0]) rawFromList.push(parts[0].trim());
                  if (parts[1]) rawToList.push(parts[1].trim());
                } else if (r && typeof r === "object") {
                  const fromVal = r.from || r.from_location || r.fromLocation || r.origin;
                  const toVal = r.to || r.to_location || r.toLocation || r.destination;
                  if (fromVal) rawFromList.push(String(fromVal).trim());
                  if (toVal) rawToList.push(String(toVal).trim());
                }
              });
            }

            const vt = v.vehicle_type || v.vehicleType || v.type || v.category;
            if (vt && typeof vt === "string") {
              typeSet.add(vt.trim());
            }
          });

          setDynamicFromLocations(dedupeLocationsCaseInsensitive(rawFromList));
          setDynamicToLocations(dedupeLocationsCaseInsensitive(rawToList));

          const standardKeywords = ["sedan", "suv", "hiace", "bus", "coaster", "van", "4wd"];
          const customOnly = Array.from(typeSet).filter(
            (typeName) => !standardKeywords.some((k) => typeName.toLowerCase().includes(k))
          );
          setDynamicVehicleTypes(customOnly);
        }
      } catch (err) {
        console.error("Failed to load dynamic vehicle search options:", err);
      }
    };

    fetchDynamicVehicleData();
  }, [isVehicleRental]);

  // Fetch tour suggestions pool for autocomplete
  useEffect(() => {
    if (!isTours) return;
    const fetchTourSuggestions = async () => {
      try {
        const response = await getPackagesByCategory("Tours");
        const pkgs =
          response.data?.data?.data ??
          response.data?.data ??
          [];
        if (Array.isArray(pkgs) && pkgs.length > 0) {
          // Use Map keyed by lowercase for case-insensitive deduplication
          // e.g. "pokhara" and "Pokhara" → stored as just "Pokhara" (first seen wins)
          const seenMap = new Map<string, string>();

          const addToPool = (raw: string) => {
            const clean = raw.trim();
            if (clean.length < 2) return;
            const key = clean.toLowerCase();
            if (!seenMap.has(key)) {
              // Normalize to Title Case: "pokhara valley" → "Pokhara Valley"
              const titleCase = clean
                .split(/\s+/)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(" ");
              seenMap.set(key, titleCase);
            }
          };

          pkgs.forEach((pkg: any) => {
            if (pkg.title && typeof pkg.title === "string") addToPool(pkg.title);
            if (pkg.name && typeof pkg.name === "string") addToPool(pkg.name);
            const loc = pkg.location || pkg.destination || pkg.place || pkg.city;
            if (loc && typeof loc === "string") {
              loc.split(/[,/]/).forEach((l: string) => addToPool(l));
            }
          });

          setAllTourSuggestionPool(Array.from(seenMap.values()));
        }
      } catch (err) {
        console.error("Failed to fetch tour suggestions:", err);
      }
    };
    fetchTourSuggestions();
  }, [isTours]);

  // Fetch trek suggestions pool for autocomplete
  useEffect(() => {
    if (!isTrekking) return;
    const fetchTrekSuggestions = async () => {
      try {
        const response = await getPackagesByCategory("Trekking");
        const pkgs =
          response.data?.data?.data ??
          response.data?.data ??
          [];
        if (Array.isArray(pkgs) && pkgs.length > 0) {
          // Use Map keyed by lowercase for case-insensitive deduplication
          const seenMap = new Map<string, string>();

          const addToPool = (raw: string) => {
            const clean = raw.trim();
            if (clean.length < 2) return;
            const key = clean.toLowerCase();
            if (!seenMap.has(key)) {
              // Normalize to Title Case
              const titleCase = clean
                .split(/\s+/)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(" ");
              seenMap.set(key, titleCase);
            }
          };

          pkgs.forEach((pkg: any) => {
            if (pkg.title && typeof pkg.title === "string") addToPool(pkg.title);
            if (pkg.name && typeof pkg.name === "string") addToPool(pkg.name);
            const loc = pkg.location || pkg.destination || pkg.place || pkg.city;
            if (loc && typeof loc === "string") {
              loc.split(/[,/]/).forEach((l: string) => addToPool(l));
            }
          });

          setAllTrekSuggestionPool(Array.from(seenMap.values()));
        }
      } catch (err) {
        console.error("Failed to fetch trek suggestions:", err);
      }
    };
    fetchTrekSuggestions();
  }, [isTrekking]);

  // Fetch activity suggestions pool for autocomplete
  useEffect(() => {
    if (!isActivities) return;
    const fetchActivitySuggestions = async () => {
      try {
        const response = await getPackagesByCategory("Adventure Activities");
        const pkgs =
          response.data?.data?.data ??
          response.data?.data ??
          [];
        if (Array.isArray(pkgs) && pkgs.length > 0) {
          // Use Map keyed by lowercase for case-insensitive deduplication
          const seenMap = new Map<string, string>();

          const addToPool = (raw: string) => {
            const clean = raw.trim();
            if (clean.length < 2) return;
            const key = clean.toLowerCase();
            if (!seenMap.has(key)) {
              // Normalize to Title Case
              const titleCase = clean
                .split(/\s+/)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(" ");
              seenMap.set(key, titleCase);
            }
          };

          pkgs.forEach((pkg: any) => {
            if (pkg.title && typeof pkg.title === "string") addToPool(pkg.title);
            if (pkg.name && typeof pkg.name === "string") addToPool(pkg.name);
            const loc = pkg.location || pkg.destination || pkg.place || pkg.city;
            if (loc && typeof loc === "string") {
              loc.split(/[,/]/).forEach((l: string) => addToPool(l));
            }
          });

          setAllActivitySuggestionPool(Array.from(seenMap.values()));
        }
      } catch (err) {
        console.error("Failed to fetch activity suggestions:", err);
      }
    };
    fetchActivitySuggestions();
  }, [isActivities]);

  // Fetch hotel suggestions pool for autocomplete
  useEffect(() => {
    if (!isHotelBooking) return;
    const fetchHotelSuggestions = async () => {
      try {
        const response = await getHotels();
        const responseData = response?.data?.data;
        const apiHotels: any[] = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
          ? responseData.data
          : [];
        if (Array.isArray(apiHotels) && apiHotels.length > 0) {
          const seenMap = new Map<string, string>();

          const addToPool = (raw: string) => {
            const clean = raw.trim();
            if (clean.length < 2) return;
            const key = clean.toLowerCase();
            if (!seenMap.has(key)) {
              const titleCase = clean
                .split(/\s+/)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(" ");
              seenMap.set(key, titleCase);
            }
          };

          apiHotels.forEach((hotel: any) => {
            const name = hotel.hotel_name || hotel.name;
            if (name && typeof name === "string") addToPool(name);
            const city = hotel.city;
            if (city && typeof city === "string") addToPool(city);
            const loc = hotel.location || hotel.address || hotel.destination;
            if (loc && typeof loc === "string") {
              loc.split(/[,/]/).forEach((l: string) => addToPool(l));
            }
          });

          setAllHotelSuggestionPool(Array.from(seenMap.values()));
        }
      } catch (err) {
        console.error("Failed to fetch hotel suggestions:", err);
      }
    };
    fetchHotelSuggestions();
  }, [isHotelBooking]);

  // Fetch visa suggestions pool for autocomplete
  useEffect(() => {
    if (!isVisaServices) return;
    const fetchVisaSuggestions = async () => {
      try {
        const response = await getVisaCategories();
        const categories: any[] = response.data?.data || [];
        if (Array.isArray(categories) && categories.length > 0) {
          const seenMap = new Map<string, string>();

          const addToPool = (raw: string) => {
            const clean = raw.trim();
            if (clean.length < 2) return;
            const key = clean.toLowerCase();
            if (!seenMap.has(key)) {
              const titleCase = clean
                .split(/\s+/)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(" ");
              seenMap.set(key, titleCase);
            }
          };

          categories.forEach((cat: any) => {
            const countryName = cat.country?.country_name;
            if (countryName && typeof countryName === "string") addToPool(countryName);
            const name = cat.name;
            if (name && typeof name === "string") addToPool(name);
          });

          setAllVisaSuggestionPool(Array.from(seenMap.values()));
        }
      } catch (err) {
        console.error("Failed to fetch visa suggestions:", err);
      }
    };
    fetchVisaSuggestions();
  }, [isVisaServices]);

  // Fetch insurance suggestions pool for autocomplete (strictly plan names only)
  useEffect(() => {
    if (!isTravelInsurance) return;
    const fetchInsuranceSuggestions = async () => {
      try {
        const response = await getInsurancePlans();
        const rawPlans = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.data?.data)
          ? response.data.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];

        const seenMap = new Map<string, string>();
        const addToPool = (raw: string) => {
          if (!raw || typeof raw !== "string") return;
          const clean = raw.trim();
          if (clean.length < 2) return;
          const key = clean.toLowerCase();
          if (!seenMap.has(key)) {
            seenMap.set(key, clean);
          }
        };

        if (rawPlans.length > 0) {
          rawPlans.forEach((plan: any) => {
            const planName = plan.name || plan.title;
            if (planName) addToPool(planName);
          });
        } else if (Array.isArray(INSURANCE_PLANS)) {
          // Fallback only if no plans returned from API
          INSURANCE_PLANS.forEach((plan) => {
            if (plan.name) addToPool(plan.name);
          });
        }

        setAllInsuranceSuggestionPool(Array.from(seenMap.values()));
      } catch (err) {
        console.error("Failed to fetch insurance suggestions:", err);
        // Fallback to static plan names on network error
        if (Array.isArray(INSURANCE_PLANS)) {
          const names = INSURANCE_PLANS.map((p) => p.name).filter(Boolean);
          setAllInsuranceSuggestionPool(names);
        }
      }
    };
    fetchInsuranceSuggestions();
  }, [isTravelInsurance]);


  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ONLY show unique locations that are actually available in the vehicle fleet
  const allKnownFromLocations = dedupeLocationsCaseInsensitive(dynamicFromLocations);
  const allKnownToLocations = dedupeLocationsCaseInsensitive(dynamicToLocations);

  const matchingFromLocations = vehicleFrom.trim()
    ? allKnownFromLocations.filter((loc) =>
        loc.toLowerCase().includes(vehicleFrom.trim().toLowerCase())
      )
    : [];

  const matchingToLocations = vehicleTo.trim()
    ? allKnownToLocations.filter((loc) =>
        loc.toLowerCase().includes(vehicleTo.trim().toLowerCase())
      )
    : [];

  const handleVehicleSearch = () => {
    setAppliedVehicleFilter({
      tripType: vehicleTripType,
      fromLocation: vehicleFrom.trim(),
      toLocation: vehicleTo.trim(),
      departureDate: vehicleDepartureDate,
      returnDate: vehicleTripType === "One Way" ? "" : vehicleReturnDate,
      passengers: vehicleTripType === "Private" ? "" : vehiclePassengers,
      vehicleType: vehicleType,
      passengerType: vehiclePassengerType,
    });
    scrollToSection("section-services", "SERVICES");
  };

  const getBannerHeading = () => {
    if (isAirTicket) return "DOMESTIC & INTERNATIONAL AIR TICKETING";
    if (isTours) return "UNESCO HERITAGE & SCENIC HOLIDAYS";
    if (isActivities) return "HIGH ADRENALINE ADVENTURE EXPERIENCES";
    if (isTrekking) return "LEGENDARY HIMALAYAN ALPINE EXPEDITIONS";
    if (isHotelBooking) return "LUXURY RESORTS & VERIFIED HOTEL STAYS";
    if (isVisaServices) return "EMBASSY VERIFIED VISA COUNSELING & FILING";
    if (isTravelInsurance) return "HIGH-ALTITUDE MEDICAL & EMERGENCY COVERAGE";
    if (isVehicleRental) return "CHAUFFEUR DRIVEN PRIVATE & TOURIST FLEET";
    if (isHeliServices) return "VIP EVEREST & HIMALAYAN HELI TOURS";
    return "PREMIUM TRAVEL & CONCIERGE SERVICES";
  };

  // 2. Floating Search Bar Config tailored to each service
  const renderFloatingSearchBar = () => {
    if (isAirTicket) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Plane size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                FROM (ORIGIN)
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="ktm">Kathmandu (KTM)</option>
                <option value="pkr">Pokhara (PKR)</option>
                <option value="lua">Lukla (LUA)</option>
                <option value="bhr">Bharatpur / Chitwan (BHR)</option>
                <option value="bwa">Bhairahawa / Lumbini (BWA)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <MapPin size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                TO (DESTINATION)
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="pkr">Pokhara (PKR)</option>
                <option value="lua">Lukla / Everest (LUA)</option>
                <option value="dxb">Dubai (DXB)</option>
                <option value="bkk">Bangkok (BKK)</option>
                <option value="del">New Delhi (DEL)</option>
                <option value="sin">Singapore (SIN)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => scrollToSection("section-overview", "OVERVIEW")}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isTours) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Left: Location or Name Search with Autocomplete */}
          <div ref={tourDropdownRef} className="relative flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <MapPin size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SEARCH BY LOCATION OR NAME
              </label>
              <input
                type="text"
                value={tourLocationSearch}
                onChange={(e) => {
                  const val = e.target.value;
                  setTourLocationSearch(val);
                  if (val.trim().length > 0) {
                    const q = val.trim().toLowerCase();
                    const matched = allTourSuggestionPool
                      .filter((s) => s.toLowerCase().includes(q))
                      .slice(0, 20);
                    setTourSuggestions(matched);
                    setShowTourDropdown(matched.length > 0);
                  } else {
                    setTourSuggestions([]);
                    setShowTourDropdown(false);
                  }
                }}
                onFocus={() => {
                  if (tourLocationSearch.trim().length > 0 && tourSuggestions.length > 0) {
                    setShowTourDropdown(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowTourDropdown(false);
                    handleTourSearch();
                  } else if (e.key === "Escape") {
                    setShowTourDropdown(false);
                  }
                }}
                placeholder="Kathmandu, Pokhara, Chitwan or tour name..."
                className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showTourDropdown && tourSuggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-[999] max-h-64 overflow-y-auto"
              >
                {tourSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setTourLocationSearch(suggestion);
                      setShowTourDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                  >
                    <MapPin size={13} className="text-pink-400 flex-shrink-0" />
                    <span className="font-medium">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: All Destination / Domestic Tour / International Tour */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Globe size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                DESTINATION TYPE
              </label>
              <select
                value={tourDestinationType}
                onChange={(e) => setTourDestinationType(e.target.value)}
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer"
              >
                <option value="all">All Destination</option>
                <option value="domestic">Domestic Tour</option>
                <option value="international">International Tour</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleTourSearch}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
          >
            SEARCH
          </button>
        </div>
      );
    }


    if (isTrekking) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Left: Location or Name Search with Autocomplete */}
          <div ref={trekDropdownRef} className="relative flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <MapPin size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SEARCH BY LOCATION OR NAME
              </label>
              <input
                type="text"
                value={trekLocationSearch}
                onChange={(e) => {
                  const val = e.target.value;
                  setTrekLocationSearch(val);
                  if (val.trim().length > 0) {
                    const q = val.trim().toLowerCase();
                    const matched = allTrekSuggestionPool
                      .filter((s) => s.toLowerCase().includes(q))
                      .slice(0, 20);
                    setTrekSuggestions(matched);
                    setShowTrekDropdown(matched.length > 0);
                  } else {
                    setTrekSuggestions([]);
                    setShowTrekDropdown(false);
                  }
                }}
                onFocus={() => {
                  if (trekLocationSearch.trim().length > 0 && trekSuggestions.length > 0) {
                    setShowTrekDropdown(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowTrekDropdown(false);
                    handleTrekkingSearch();
                  } else if (e.key === "Escape") {
                    setShowTrekDropdown(false);
                  }
                }}
                placeholder="Everest, Annapurna, Manaslu or trek name..."
                className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showTrekDropdown && trekSuggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-[999] max-h-64 overflow-y-auto"
              >
                {trekSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setTrekLocationSearch(suggestion);
                      setShowTrekDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                  >
                    <MapPin size={13} className="text-pink-400 flex-shrink-0" />
                    <span className="font-medium">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Trekking Level Dropdown */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Mountain size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                TREKKING LEVEL
              </label>
              <select
                value={trekAdventureLevel}
                onChange={(e) => setTrekAdventureLevel(e.target.value)}
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer"
              >
                <option value="all">All Trekking Levels</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Extreme">Extreme</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleTrekkingSearch}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer active:scale-95"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isActivities) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Left: Search by Name and Location with Autocomplete */}
          <div ref={activityDropdownRef} className="relative flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <MapPin size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SEARCH BY NAME AND LOCATION
              </label>
              <input
                type="text"
                value={activitySearchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setActivitySearchQuery(val);
                  if (val.trim().length > 0) {
                    const q = val.trim().toLowerCase();
                    const matched = allActivitySuggestionPool
                      .filter((s) => s.toLowerCase().includes(q))
                      .slice(0, 20);
                    setActivitySuggestions(matched);
                    setShowActivityDropdown(matched.length > 0);
                  } else {
                    setActivitySuggestions([]);
                    setShowActivityDropdown(false);
                  }
                }}
                onFocus={() => {
                  if (activitySearchQuery.trim().length > 0 && activitySuggestions.length > 0) {
                    setShowActivityDropdown(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowActivityDropdown(false);
                    handleActivitySearch();
                  } else if (e.key === "Escape") {
                    setShowActivityDropdown(false);
                  }
                }}
                placeholder="Pokhara, Paragliding, Bungee, Kushma..."
                className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showActivityDropdown && activitySuggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-[999] max-h-64 overflow-y-auto"
              >
                {activitySuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setActivitySearchQuery(suggestion);
                      setShowActivityDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                  >
                    <MapPin size={13} className="text-pink-400 flex-shrink-0" />
                    <span className="font-medium">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Adventure Level Dropdown */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Activity size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                ADVENTURE LEVEL
              </label>
              <select
                value={activityAdventureLevel}
                onChange={(e) => setActivityAdventureLevel(e.target.value)}
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer"
              >
                <option value="all">All Adventure Levels</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Extreme">Extreme</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleActivitySearch}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer active:scale-95"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isHotelBooking) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Left: Search by Hotel Name or Location with Autocomplete */}
          <div ref={hotelDropdownRef} className="relative flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Building2 size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SEARCH BY HOTEL NAME OR LOCATION
              </label>
              <input
                type="text"
                value={hotelSearchNameOrLocation}
                onChange={(e) => {
                  const val = e.target.value;
                  setHotelSearchNameOrLocation(val);
                  if (val.trim().length > 0) {
                    const q = val.trim().toLowerCase();
                    const matched = allHotelSuggestionPool
                      .filter((s) => s.toLowerCase().includes(q))
                      .slice(0, 20);
                    setHotelSuggestions(matched);
                    setShowHotelDropdown(matched.length > 0);
                  } else {
                    setHotelSuggestions([]);
                    setShowHotelDropdown(false);
                  }
                }}
                onFocus={() => {
                  if (hotelSearchNameOrLocation.trim().length > 0 && hotelSuggestions.length > 0) {
                    setShowHotelDropdown(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowHotelDropdown(false);
                    handleHotelSearch();
                  } else if (e.key === "Escape") {
                    setShowHotelDropdown(false);
                  }
                }}
                placeholder="Hyatt, Marriott, Kathmandu, Pokhara..."
                className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showHotelDropdown && hotelSuggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-[999] max-h-64 overflow-y-auto"
              >
                {hotelSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setHotelSearchNameOrLocation(suggestion);
                      setShowHotelDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                  >
                    <Building2 size={13} className="text-pink-400 flex-shrink-0" />
                    <span className="font-medium">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Search by Region */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Globe size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SEARCH BY REGION
              </label>
              <select
                value={hotelSearchRegion}
                onChange={(e) => setHotelSearchRegion(e.target.value)}
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer"
              >
                <option value="all">All Regions</option>
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleHotelSearch}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer active:scale-95 flex-shrink-0"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isVisaServices) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* 1. Left: Destination / Visa Name (Text Input with Autocomplete Dropdown) */}
          <div ref={visaDropdownRef} className="relative flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Globe size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                DESTINATION / VISA NAME
              </label>
              <input
                type="text"
                value={visaSearchCountry}
                onChange={(e) => {
                  const val = e.target.value;
                  setVisaSearchCountry(val);
                  if (val.trim().length > 0) {
                    const q = val.trim().toLowerCase();
                    const matched = allVisaSuggestionPool
                      .filter((s) => s.toLowerCase().includes(q))
                      .slice(0, 20);
                    setVisaSuggestions(matched);
                    setShowVisaDropdown(matched.length > 0);
                  } else {
                    setVisaSuggestions([]);
                    setShowVisaDropdown(false);
                  }
                }}
                onFocus={() => {
                  if (visaSearchCountry.trim().length > 0 && visaSuggestions.length > 0) {
                    setShowVisaDropdown(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowVisaDropdown(false);
                    handleVisaSearch();
                  } else if (e.key === "Escape") {
                    setShowVisaDropdown(false);
                  }
                }}
                placeholder="Search destination or visa name..."
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showVisaDropdown && visaSuggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-[999] max-h-64 overflow-y-auto"
              >
                {visaSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setVisaSearchCountry(suggestion);
                      setShowVisaDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                  >
                    <Globe size={13} className="text-pink-400 flex-shrink-0" />
                    <span className="font-medium">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Center: Entry Type */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Shield size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                ENTRY TYPE
              </label>
              <select
                value={visaSearchEntry}
                onChange={(e) => setVisaSearchEntry(e.target.value)}
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer"
              >
                <option value="all">All Entry Types</option>
                <option value="single">Single Entry</option>
                <option value="multiple">Multiple Entry</option>
              </select>
            </div>
          </div>

          {/* 3. Right: Visa Type */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <FileText size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                VISA TYPE
              </label>
              <select
                value={visaSearchType}
                onChange={(e) => setVisaSearchType(e.target.value)}
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer"
              >
                <option value="all">All Visa Types</option>
                <option value="tourist">Tourist Visa</option>
                <option value="student">Student Visa</option>
                <option value="business">Business Visa</option>
                <option value="transit">Transit Visa</option>
                <option value="express">Express Fast-Track</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleVisaSearch}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer active:scale-95"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isTravelInsurance) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Left: Search by Name with Autocomplete */}
          <div ref={insuranceDropdownRef} className="relative flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <ShieldCheck size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SEARCH BY NAME
              </label>
              <input
                type="text"
                value={insuranceSearchName}
                onChange={(e) => {
                  const val = e.target.value;
                  setInsuranceSearchName(val);
                  if (val.trim().length > 0) {
                    const q = val.trim().toLowerCase();
                    const matched = allInsuranceSuggestionPool
                      .filter((s) => s.toLowerCase().includes(q))
                      .slice(0, 20);
                    setInsuranceSuggestions(matched);
                    setShowInsuranceDropdown(matched.length > 0);
                  } else {
                    setInsuranceSuggestions([]);
                    setShowInsuranceDropdown(false);
                  }
                }}
                onFocus={() => {
                  const q = insuranceSearchName.trim().toLowerCase();
                  const matched = q
                    ? allInsuranceSuggestionPool.filter((s) => s.toLowerCase().includes(q)).slice(0, 20)
                    : allInsuranceSuggestionPool.slice(0, 10);
                  setInsuranceSuggestions(matched);
                  if (matched.length > 0) setShowInsuranceDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowInsuranceDropdown(false);
                    handleInsuranceSearch();
                  } else if (e.key === "Escape") {
                    setShowInsuranceDropdown(false);
                  }
                }}
                placeholder="High Altitude Trekking, Outbound Travel..."
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showInsuranceDropdown && insuranceSuggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-[999] max-h-64 overflow-y-auto"
              >
                {insuranceSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setInsuranceSearchName(suggestion);
                      setShowInsuranceDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                  >
                    <ShieldCheck size={13} className="text-pink-400 flex-shrink-0" />
                    <span className="font-medium">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Insurance Type Dropdown */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Shield size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                INSURANCE TYPE
              </label>
              <select
                value={insuranceSearchType}
                onChange={(e) => setInsuranceSearchType(e.target.value)}
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer"
              >
                <option value="all">All Insurance Types</option>
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleInsuranceSearch}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer active:scale-95 flex-shrink-0"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isVehicleRental) {
      return (
        <div className="w-full flex flex-col items-start">

          {/* ── Floating tab bar attached flush to left edge ── */}
          <div className="relative inline-flex items-center p-1 bg-white rounded-tl-2xl sm:rounded-tl-3xl rounded-tr-xl sm:rounded-tr-2xl border-t border-l border-gray-100 gap-1 z-10 -mb-px">
            {(["One Way", "Round Trip", "Private"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setVehicleTripType(type);
                  setAppliedVehicleFilter({
                    tripType: type,
                    fromLocation: vehicleFrom.trim(),
                    toLocation: vehicleTo.trim(),
                    departureDate: vehicleDepartureDate,
                    returnDate: type === "One Way" ? "" : vehicleReturnDate,
                    passengers: type === "Private" ? "" : vehiclePassengers,
                    vehicleType: vehicleType,
                    passengerType: vehiclePassengerType,
                  });
                }}
                className={`px-3.5 sm:px-4 py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  vehicleTripType === type
                    ? "bg-[#E91E63] text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/70"
                }`}
              >
                {type}
              </button>
            ))}

            {/* Smooth concave curve on the right corner */}
            <svg
              className="absolute -right-3.5 bottom-0 w-3.5 h-3.5 pointer-events-none"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path d="M0 0 C0 7.732 6.268 14 14 14 L0 14 Z" fill="white" />
              <path d="M0 0 C0 7.732 6.268 14 14 14" stroke="#f3f4f6" strokeWidth="1" fill="none" />
            </svg>
          </div>

          {/* ── Search card ── */}
          <div className="w-full bg-white rounded-b-2xl sm:rounded-b-3xl rounded-tr-2xl sm:rounded-tr-3xl rounded-tl-none shadow-xl border border-gray-100 relative">

            {/* ROW 1: From / To / Departure Date / Return Date */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* FROM */}
              <div ref={fromDropdownRef} className="relative flex items-center gap-2.5 flex-1 px-4 py-3">
                <MapPin size={16} className="text-pink-500 flex-shrink-0" />
                <div className="flex flex-col w-full">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">FROM</label>
                  <input
                    type="text"
                    value={vehicleFrom}
                    onChange={(e) => {
                      setVehicleFrom(e.target.value);
                      setShowFromDropdown(true);
                    }}
                    onFocus={() => {
                      if (vehicleFrom.trim().length > 0) setShowFromDropdown(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setShowFromDropdown(false);
                        handleVehicleSearch();
                      } else if (e.key === "Escape") {
                        setShowFromDropdown(false);
                      }
                    }}
                    placeholder="Select departure location"
                    className="text-xs sm:text-[13px] font-semibold text-gray-800 bg-transparent focus:outline-none py-0.5 placeholder:text-xs placeholder:text-gray-400 placeholder:font-normal w-full"
                  />
                </div>

                {/* Autocomplete Dropdown for FROM */}
                {showFromDropdown && matchingFromLocations.length > 0 && (
                  <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[210px] bg-white rounded-xl shadow-2xl border border-pink-100 z-[999] py-1.5 max-h-56 overflow-y-auto animate-in fade-in duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                      Matching Locations
                    </div>
                    {matchingFromLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setVehicleFrom(loc);
                          setShowFromDropdown(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <MapPin size={13} className="text-pink-500 flex-shrink-0" />
                        <span>{loc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* TO */}
              <div ref={toDropdownRef} className="relative flex items-center gap-2.5 flex-1 px-4 py-3">
                <MapPin size={16} className="text-pink-500 flex-shrink-0" />
                <div className="flex flex-col w-full">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">TO</label>
                  <input
                    type="text"
                    value={vehicleTo}
                    onChange={(e) => {
                      setVehicleTo(e.target.value);
                      setShowToDropdown(true);
                    }}
                    onFocus={() => {
                      if (vehicleTo.trim().length > 0) setShowToDropdown(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setShowToDropdown(false);
                        handleVehicleSearch();
                      } else if (e.key === "Escape") {
                        setShowToDropdown(false);
                      }
                    }}
                    placeholder="Select destination"
                    className="text-xs sm:text-[13px] font-semibold text-gray-800 bg-transparent focus:outline-none py-0.5 placeholder:text-xs placeholder:text-gray-400 placeholder:font-normal w-full"
                  />
                </div>

                {/* Autocomplete Dropdown for TO */}
                {showToDropdown && matchingToLocations.length > 0 && (
                  <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[210px] bg-white rounded-xl shadow-2xl border border-pink-100 z-[999] py-1.5 max-h-56 overflow-y-auto animate-in fade-in duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                      Matching Destinations
                    </div>
                    {matchingToLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setVehicleTo(loc);
                          setShowToDropdown(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <MapPin size={13} className="text-pink-500 flex-shrink-0" />
                        <span>{loc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* DEPARTURE DATE */}
              <div className="flex items-center gap-2.5 flex-1 px-4 py-3">
                <Calendar size={16} className="text-pink-500 flex-shrink-0" />
                <div className="flex flex-col w-full">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">DEPARTURE DATE</label>
                  <input
                    type="date"
                    min={todayDateStr}
                    value={vehicleDepartureDate}
                    onChange={(e) => {
                      const selected = e.target.value;
                      if (selected && selected < todayDateStr) {
                        setVehicleDepartureDate(todayDateStr);
                      } else {
                        setVehicleDepartureDate(selected);
                      }
                      if (vehicleReturnDate && selected && vehicleReturnDate < selected) {
                        setVehicleReturnDate(selected);
                      }
                    }}
                    className="text-xs font-medium text-gray-700 bg-transparent focus:outline-none py-0.5 cursor-pointer w-full placeholder:text-xs [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60"
                  />
                </div>
              </div>

              {/* RETURN DATE — shown for Round Trip and Private */}
              {vehicleTripType !== "One Way" && (
                <div className="flex items-center gap-2.5 flex-1 px-4 py-3">
                  <Calendar size={16} className="text-pink-500 flex-shrink-0" />
                  <div className="flex flex-col w-full">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">RETURN DATE</label>
                    <input
                      type="date"
                      min={vehicleDepartureDate && vehicleDepartureDate >= todayDateStr ? vehicleDepartureDate : todayDateStr}
                      value={vehicleReturnDate}
                      onChange={(e) => {
                        const selected = e.target.value;
                        const minAllowed = vehicleDepartureDate && vehicleDepartureDate >= todayDateStr ? vehicleDepartureDate : todayDateStr;
                        if (selected && selected < minAllowed) {
                          setVehicleReturnDate(minAllowed);
                        } else {
                          setVehicleReturnDate(selected);
                        }
                      }}
                      className="text-xs font-medium text-gray-700 bg-transparent focus:outline-none py-0.5 cursor-pointer w-full placeholder:text-xs [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* ROW 2: Passengers / Vehicle Type / Passenger Type / Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* NO. OF PASSENGERS — only for One Way and Round Trip */}
              {vehicleTripType !== "Private" && (
                <div className="flex items-center gap-2.5 flex-1 px-4 py-3">
                  <Users size={16} className="text-pink-500 flex-shrink-0" />
                  <div className="flex flex-col w-full">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">NO. OF PASSENGERS</label>
                    <select
                      value={vehiclePassengers}
                      onChange={(e) => setVehiclePassengers(e.target.value)}
                      className="text-xs font-medium text-gray-700 bg-transparent focus:outline-none py-0.5 cursor-pointer"
                    >
                      <option value="">Any Passengers</option>
                      {[1,2,3,4,5,6,7,8,9,10,12,14,16,18,20,22].map(n => (
                        <option key={n} value={n}>{n} Passenger{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* VEHICLE TYPE */}
              <div className="flex items-center gap-2.5 flex-1 px-4 py-3">
                <Car size={16} className="text-pink-500 flex-shrink-0" />
                <div className="flex flex-col w-full">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">VEHICLE TYPE</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="text-xs font-medium text-gray-700 bg-transparent focus:outline-none py-0.5 cursor-pointer"
                  >
                    <option value="">Any Vehicle</option>
                    <option value="sedan">Sedan / Car (4 Seat)</option>
                    <option value="suv">4WD SUV / Scorpio (7 Seat)</option>
                    <option value="hiace">Toyota HiAce (14 Seat)</option>
                    <option value="bus">Tourist Coaster Bus (22 Seat)</option>
                    {dynamicVehicleTypes.map((t) => (
                      <option key={t} value={t.toLowerCase()}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PASSENGER TYPE (optional) */}
              <div className="flex items-center gap-2.5 flex-1 px-4 py-3">
                <Shield size={16} className="text-pink-500 flex-shrink-0" />
                <div className="flex flex-col w-full">
                  <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">PASSENGER TYPE <span className="normal-case font-normal text-gray-400">(Optional)</span></label>
                  <select
                    value={vehiclePassengerType}
                    onChange={(e) => setVehiclePassengerType(e.target.value)}
                    className="text-xs font-medium text-gray-700 bg-transparent focus:outline-none py-0.5 cursor-pointer"
                  >
                    <option value="">Any</option>
                    <option value="nepali">Nepali</option>
                    <option value="foreign">Foreign</option>
                  </select>
                </div>
              </div>

              {/* SEARCH ROUTE BUTTON */}
              <div className="px-4 py-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleVehicleSearch}
                  className="w-full md:w-auto rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 py-3 px-7 text-white font-bold text-xs tracking-wider transition-all whitespace-nowrap cursor-pointer shadow-sm hover:shadow-md"
                >
                  SEARCH ROUTE
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Heli Services
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Left: Search by Name/Title with Autocomplete */}
        <div ref={heliNameDropdownRef} className="relative flex items-center gap-3 flex-1 min-w-0 px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
          <Wind size={18} className="text-pink-500 flex-shrink-0" />
          <div className="flex flex-col w-full">
            <label htmlFor="heli-name-input" className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              SEARCH BY NAME / TITLE
            </label>
            <input
              id="heli-name-input"
              type="text"
              value={heliNameInput}
              onChange={(e) => {
                const val = e.target.value;
                setHeliNameInput(val);
                if (val.trim().length > 0) {
                  const q = val.trim().toLowerCase();
                  const matched = allHeliNamePool
                    .filter((s) => s.toLowerCase().includes(q))
                    .slice(0, 20);
                  setHeliNameSuggestions(matched);
                  setShowHeliNameDropdown(matched.length > 0);
                } else {
                  setHeliNameSuggestions([]);
                  setShowHeliNameDropdown(false);
                }
              }}
              onFocus={() => {
                const q = heliNameInput.trim().toLowerCase();
                const matched = q
                  ? allHeliNamePool.filter((s) => s.toLowerCase().includes(q)).slice(0, 20)
                  : allHeliNamePool.slice(0, 10);
                setHeliNameSuggestions(matched);
                if (matched.length > 0) setShowHeliNameDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowHeliNameDropdown(false);
                  handleHeliSearch();
                } else if (e.key === "Escape") {
                  setShowHeliNameDropdown(false);
                }
              }}
              placeholder="Everest Base Camp Heli Tour..."
              className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showHeliNameDropdown && heliNameSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-[999] max-h-64 overflow-y-auto">
              {heliNameSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setHeliNameInput(suggestion);
                    setShowHeliNameDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                >
                  <Wind size={13} className="text-pink-400 flex-shrink-0" />
                  <span className="font-medium">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Search by Region (Custom Dropdown – 8 visible, scrollable) */}
        <div ref={heliRegionDropdownRef} className="relative flex items-center gap-3 flex-1 min-w-0 px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
          <MapPin size={18} className="text-pink-500 flex-shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              SEARCH BY REGION
            </label>
            {/* Trigger button */}
            <button
              type="button"
              onClick={() => setShowHeliRegionDropdown((prev) => !prev)}
              className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer text-left"
            >
              <span>
                {heliRegions.find((r) => r.value === heliLocationInput)?.label ?? "All Regions"}
              </span>
              <ChevronDown
                size={14}
                className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${showHeliRegionDropdown ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Custom dropdown panel – max 8 rows (8 × 40px = 320px), scrollable */}
          {showHeliRegionDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-[999] max-h-[320px] overflow-y-auto">
              {heliRegions.map((region) => (
                <button
                  key={region.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setHeliLocationInput(region.value);
                    setShowHeliRegionDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0 cursor-pointer ${
                    heliLocationInput === region.value
                      ? "bg-pink-50 text-pink-600 font-bold"
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-600 font-medium"
                  }`}
                >
                  <MapPin size={13} className="text-pink-400 flex-shrink-0" />
                  <span>{region.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleHeliSearch}
          className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer active:scale-95"
        >
          SEARCH
        </button>
      </div>
    );
  };





  // Section titles
  const getServicesSectionBadge = () => {
    if (isAirTicket) return "TICKETING PARTNERS";
    if (isTours) return "FEATURED TOUR PACKAGES";
    if (isTrekking) return "ALPINE EXPEDITIONS";
    if (isActivities) return "ADVENTURE OPTIONS";
    if (isHotelBooking) return "VERIFIED PROPERTIES";
    if (isVisaServices) return "DESTINATIONS";
    if (isTravelInsurance) return "INSURANCE PLANS";
    if (isVehicleRental) return "FLEET SELECTION";
    if (isHeliServices) return "HELI PACKAGES";
    return "AVAILABLE SERVICES";
  };

  const getServicesSectionTitle = () => {
    if (isAirTicket) return "Authorized Airline Partners & Global Booking";
    if (isTours) return "Curated Holiday Tours & Packages";
    if (isTrekking) return "Himalayan Trekking Expeditions";
    if (isActivities) return "Extreme Adventure Experiences";
    if (isHotelBooking) return "Featured Hotels & Luxury Resorts";
    if (isVisaServices) return "Our Visa Counseling Services";
    if (isTravelInsurance) return "Comprehensive Coverage Plans";
    if (isVehicleRental) return "Modern Vehicle Rental Fleet";
    if (isHeliServices) return "VIP Helicopter Flight Packages";
    return `Our ${service.name} Offerings`;
  };

  const activeSEO = (() => {
    if (isVisaServices) return pagesSEO.serviceVisa;
    if (isHeliServices) return pagesSEO.serviceHeli;
    if (isHotelBooking) return pagesSEO.serviceHotel;
    if (isVehicleRental) return pagesSEO.serviceVehicle;
    if (isTravelInsurance) return pagesSEO.serviceInsurance;
    if (isTrekking) {
      return {
        title: "Trekking in Nepal & Himalayan Expeditions | Trip Himalaya",
        description: "Premier trekking packages in Nepal: Everest Base Camp Trek, Annapurna Base Camp, Circuit, Langtang Valley, Mardi Himal, Manaslu, and Mustang.",
        keywords: "Trekking in Nepal, Nepal trekking packages, Everest Base Camp Trek, Annapurna Base Camp Trek, Annapurna Circuit Trek, Langtang Valley Trek, Mardi Himal Trek, Manaslu Circuit Trek, Upper Mustang Trek, Poon Hill Trek, Nepal trekking cost",
        canonicalPath: `/service/${slug}`,
        type: "website" as const,
      };
    }
    if (isActivities) {
      return {
        title: "Adventure Tours & Extreme Sports in Nepal | Trip Himalaya",
        description: "Himalayan adventure tours in Nepal: Mountain biking, peak climbing, white water rafting, bungee jumping, and paragliding with expert guides.",
        keywords: "Adventure tours in Nepal, Mountain biking in Nepal, Nepal mountain biking tours, Nepal peak climbing, Nepal expedition packages, Himalayan adventure tours",
        canonicalPath: `/service/${slug}`,
        type: "website" as const,
      };
    }
    return {
      title: `${service.name} in Nepal | Trip Himalaya`,
      description: service.shortDesc || `Professional ${service.name} services in Nepal provided by Trip Himalaya Tours & Travel.`,
      keywords: `${service.name} Nepal, ${service.name} Kathmandu, Trip Himalaya services`,
      canonicalPath: `/service/${slug}`,
      type: "website" as const,
    };
  })();

  return (
    <>
      <SEO {...activeSEO} />
      {/* ── 1. TOP BANNER SECTION (Omitted on dedicated Heli Tour Details Page) ── */}
      {!isHeliTourDetailPage && (
        <div className="w-full flex flex-col items-center">
          <div className="w-full relative z-30 shadow-md bg-white border-b border-gray-200">
          {/* ── 1. TOP BANNER SECTION (With 1. Title at top, 2. SearchBar in middle, 3. Quote below) ── */}
          {isTours ? (
            /* ── TOURS HERO BANNER (Exactly matching Adventure Activities) ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-visible pt-14 sm:pt-16 pb-7 sm:pb-8">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img src={service.heroImage} alt={service.name} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              </div>
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
                    {getBannerHeading()}
                  </span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
                    {service.name}
                  </h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-30">
                  {renderFloatingSearchBar()}
                </div>
                {service.shortDesc && (
                  <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">
                    "{service.shortDesc}"
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3 px-0">
                  {[
                    { icon: Compass, label: `${packages.filter((p) => p.type === "tour").length}+ Curated Tours`, desc: "Nepal & International", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: Sparkles, label: "100% Tailor-Made", desc: "Customized for you", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: ShieldCheck, label: "Govt Certified Guides", desc: "Multilingual Experts", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: Star, label: "4.9/5 Rating", desc: "Trusted by 5,000+ Guests", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${stat.color} group-hover:scale-105 transition-transform`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex flex-col text-left min-w-0">
                          <h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4>
                          <p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

          ) : isActivities ? (
            /* ── ACTIVITIES HERO BANNER (Original, unchanged) ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-visible pt-14 sm:pt-16 pb-7 sm:pb-8">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img src={service.heroImage} alt={service.name} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              </div>
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
                    {getBannerHeading()}
                  </span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
                    {service.name}
                  </h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-30">
                  {renderFloatingSearchBar()}
                </div>
                {service.shortDesc && (
                  <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">
                    "{service.shortDesc}"
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3 px-0">
                  {[
                    { icon: Activity, label: `${packages.filter((p) => p.type === "activity" || p.type === "combo").length}+ Thrill Sports`, desc: "Air, River & Land", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: ShieldCheck, label: "100% Certified Safety", desc: "CE & UIAA Approved", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: Wind, label: "4K Action Media", desc: "Photos & Video Included", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: Star, label: "Zero Compromise", desc: "Strict Safety Protocols", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${stat.color} group-hover:scale-105 transition-transform`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex flex-col text-left min-w-0">
                          <h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4>
                          <p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

          ) : isTrekking ? (
            /* ── TREKKING HERO BANNER (Exactly matching Adventure Activities) ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-visible pt-14 sm:pt-16 pb-7 sm:pb-8">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img src={service.heroImage} alt={service.name} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              </div>
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
                    {getBannerHeading()}
                  </span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
                    {service.name}
                  </h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-30">
                  {renderFloatingSearchBar()}
                </div>
                {service.shortDesc && (
                  <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">
                    "{service.shortDesc}"
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3 px-0">
                  {[
                    { icon: Mountain, label: `${packages.filter((p) => p.type === "trek").length}+ Epic Trails`, desc: "Everest, Annapurna & Beyond", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: HeartPulse, label: "Daily Oximeter Checks", desc: "Altitude Safety First", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: ShieldCheck, label: "Licensed Sherpas", desc: "Native Mountain Experts", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: Sparkles, label: "24/7 Heli Standby", desc: "Emergency Medical Rescue", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${stat.color} group-hover:scale-105 transition-transform`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex flex-col text-left min-w-0">
                          <h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4>
                          <p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

          ) : isHotelBooking ? (
            /* ── HOTEL BOOKING HERO ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-visible pt-14 sm:pt-16 pb-7 sm:pb-8">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img src={service.heroImage} alt={service.name} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              </div>
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-30">{renderFloatingSearchBar()}</div>
                {service.shortDesc && <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">"{service.shortDesc}"</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
                  {[
                    { icon: Building2, label: "500+ Partner Hotels", desc: "Heritage & 5-Star Luxury" },
                    { icon: Award, label: "Best Rate Guarantee", desc: "Up to 30% Below OTAs" },
                    { icon: ShieldCheck, label: "Free Cancellation", desc: "Flexible Date Changes" },
                    { icon: HeartHandshake, label: "VIP Perks Included", desc: "Free Breakfast & Airport Pickup" },
                  ].map((stat, idx) => { const Icon = stat.icon; return (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform"><Icon size={14} /></div>
                      <div className="flex flex-col text-left min-w-0"><h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4><p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p></div>
                    </div>
                  ); })}
                </div>
              </div>
            </section>

          ) : isTravelInsurance ? (
            /* ── TRAVEL INSURANCE HERO ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-visible pt-14 sm:pt-16 pb-7 sm:pb-8">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img src={service.heroImage} alt={service.name} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              </div>
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-30">{renderFloatingSearchBar()}</div>
                {service.shortDesc && <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">"{service.shortDesc}"</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
                  {[
                    { icon: Activity, label: "Up to 6,000m+ Covered", desc: "EBC, ABC & Alpine Circuits" },
                    { icon: Zap, label: "45-Min Heli Dispatch", desc: "Immediate Alpine Evacuation" },
                    { icon: Stethoscope, label: "Cashless Hospitalization", desc: "Top International Hospitals" },
                    { icon: Globe2, label: "Schengen Visa Approved", desc: "Embassy Certified Policies" },
                  ].map((stat, idx) => { const Icon = stat.icon; return (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform"><Icon size={14} /></div>
                      <div className="flex flex-col text-left min-w-0"><h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4><p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p></div>
                    </div>
                  ); })}
                </div>
              </div>
            </section>

          ) : isVehicleRental ? (
            /* ── VEHICLE RENTAL HERO ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-visible pt-14 sm:pt-16 pb-7 sm:pb-8">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img src={service.heroImage} alt={service.name} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              </div>
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-30">{renderFloatingSearchBar()}</div>
                {service.shortDesc && <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">"{service.shortDesc}"</p>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
                  {[
                    { icon: Car, label: "50+ Fleet Vehicles", desc: "4x4 SUVs, Sedans & Vans" },
                    { icon: ShieldCheck, label: "Chauffeur Included", desc: "Mountain-Licensed Drivers" },
                    { icon: Fuel, label: "All-Inclusive Pricing", desc: "Fuel, Tolls & Parking Covered" },
                    { icon: Zap, label: "24/7 Rapid Replacement", desc: "Zero Downtime Guarantee" },
                  ].map((stat, idx) => { const Icon = stat.icon; return (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform"><Icon size={14} /></div>
                      <div className="flex flex-col text-left min-w-0"><h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4><p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p></div>
                    </div>
                  ); })}
                </div>
              </div>
            </section>

          ) : isHeliServices ? (
            /* ── HELI SERVICES HERO ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-visible pt-14 sm:pt-16 pb-7 sm:pb-8">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img src={service.heroImage} alt={service.name} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              </div>
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-30">{renderFloatingSearchBar()}</div>
                {service.shortDesc && <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">"{service.shortDesc}"</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
                  {[
                    { icon: Plane, label: "3,000+ Tours Completed", desc: "All Nepal Himalayan Routes" },
                    { icon: Mountain, label: "5,600m Max Altitude", desc: "Everest Base Camp & Beyond" },
                    { icon: Compass, label: "12+ Regions Covered", desc: "National Coverage" },
                    { icon: Shield, label: "100% Safety Record", desc: "Zero Incident History" },
                  ].map((stat, idx) => { const Icon = stat.icon; return (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform"><Icon size={14} /></div>
                      <div className="flex flex-col text-left min-w-0"><h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4><p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p></div>
                    </div>
                  ); })}
                </div>
              </div>
            </section>

          ) : (
            /* ── VISA SERVICES HERO ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-visible pt-14 sm:pt-16 pb-7 sm:pb-8">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img src={service.heroImage} alt={service.name} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              </div>
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-30">{renderFloatingSearchBar()}</div>
                <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">
                  "Expert assistance for seamless visa applications, embassy counseling, and swift approvals"
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
                  {[
                    { icon: Shield, label: "98%+", desc: "Visa Approved" },
                    { icon: Globe2, label: "45+", desc: "Destinations" },
                    { icon: Clock, label: "3–5 Days", desc: "Express Processing" },
                    { icon: Zap, label: "24/7", desc: "Expert Support" },
                    { icon: CheckCircle2, label: "Doorstep", desc: "Document Pickup Service" },
                  ].map((stat, idx) => { const Icon = stat.icon; return (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform"><Icon size={14} /></div>
                      <div className="flex flex-col text-left min-w-0">
                        <h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4>
                        <p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p>
                      </div>
                    </div>
                  ); })}
                </div>
              </div>
            </section>
          )}

          {/* ── 3. FULL-WIDTH DIVIDER LINE WITH SHADOW (Sub-navigation tab texts removed as requested) ── */}
          <div className="w-full border-b border-gray-200/90 shadow-xs" />
        </div>
      </div>
      )}

      {/* ── 5. SERVICES SECTION (Full width, soft gradient, dedicated interactive component) ── */}
      {!isAirTicket && (
        <div
          id="section-services"
          className={
            isHeliTourDetailPage
              ? "w-full pt-10 sm:pt-12 pb-12 px-4 sm:px-6 lg:px-8 bg-[#FBFBFE]"
              : "w-full pt-8 sm:pt-9 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-blue-100/30 via-blue-50/20 to-pink-50/40 mt-3 sm:mt-4"
          }
        >
          <div className="max-w-7xl mx-auto">
            {!isTours && !isActivities && !isTrekking && !isHotelBooking && !isVehicleRental && !isVisaServices && !isTravelInsurance && !isHeliServices && (
              <header className="text-center mb-8">
                <h2 className="text-xs text-pink-500 tracking-widest font-bold mb-2 uppercase">
                  {getServicesSectionBadge()}
                </h2>
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-purple-950 font-extrabold">
                  {getServicesSectionTitle()}
                </h1>
              </header>
            )}

            {/* Dedicated Interactive Component for each Service */}
            {isTours ? (
              <ToursDetailContent
                filter={appliedTourFilter}
                onClearFilter={() => {
                  setAppliedTourFilter(null);
                  setTourDestinationType("all");
                  setTourLocationSearch("");
                }}
              />
            ) : isActivities ? (
              <ActivitiesDetailContent
                filter={appliedActivityFilter}
                onClearFilter={() => {
                  setAppliedActivityFilter(null);
                  setActivitySearchQuery("");
                  setActivityAdventureLevel("all");
                }}
              />
            ) : isTrekking ? (
              <TrekkingDetailContent
                filter={appliedTrekFilter}
                onClearFilter={() => {
                  setAppliedTrekFilter(null);
                  setTrekLocationSearch("");
                  setTrekAdventureLevel("all");
                  setTrekDurationSearch("");
                }}
              />
            ) : isHotelBooking ? (
              <HotelBookingDetailContent
                filter={appliedHotelFilter}
                onClearFilter={() => {
                  setAppliedHotelFilter(null);
                  setHotelSearchRegion("all");
                  setHotelSearchNameOrLocation("");
                  setHotelSearchLocation("");
                  setHotelSearchName("");
                  setHotelSearchCheckIn("");
                  setHotelSearchCheckOut("");
                  setShowHotelLocation(false);
                  setShowHotelCheckIn(false);
                  setShowHotelCheckOut(false);
                }}
              />
            ) : isTravelInsurance ? (
              <TravelInsuranceDetailContent
                filter={appliedInsuranceFilter}
                onClearFilter={() => {
                  setAppliedInsuranceFilter(null);
                  setInsuranceSearchType("all");
                  setInsuranceSearchDays("");
                }}
              />
            ) : isVehicleRental ? (
              <VehicleRentalDetailContent
                filter={appliedVehicleFilter}
                onClearFilter={() => {
                  setAppliedVehicleFilter(null);
                  setVehicleFrom("");
                  setVehicleTo("");
                  setVehicleDepartureDate("");
                  setVehicleReturnDate("");
                  setVehiclePassengers("");
                  setVehicleType("");
                  setVehiclePassengerType("");
                }}
              />
            ) : isHeliServices ? (
              <HeliServicesDetailContent
                filter={appliedHeliFilter}
                onClearFilter={() => {
                  setAppliedHeliFilter(null);
                  setHeliLocationInput("");
                  setHeliNameInput("");
                }}
              />
            ) : (
              <VisaServicesDetailContent
                filter={appliedVisaFilter}
                onClearFilter={() => {
                  setAppliedVisaFilter(null);
                  setVisaSearchCountry("");
                  setVisaSearchType("all");
                  setVisaSearchEntry("all");
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* ── 7. TESTIMONIES SECTION (Omitted on Heli Tour Details Page as it has dedicated testimonies) ── */}
      {!isHeliTourDetailPage && (
        <div id="section-testimonies">
          <Testimonials workTest={workPermitTestimonials} />
        </div>
      )}

      {/* ── 10. PREFOOTER CTA ── */}
      <PreFooter
        title={
          isHeliTourDetailPage
            ? "Ready to Experience This Adventure?"
            : `Ready to Book Your ${service.name}?`
        }
        description={
          isHeliTourDetailPage
            ? "Connect with our Himalayan travel specialists for tailored dates, group discounts, and custom arrangements."
            : "Search options or connect with our specialist team for personalized guidance."
        }
        btn1={isHeliTourDetailPage ? "Call Us Now" : "Call Hotline"}
        btn2={
          service.id === "heli-services" || isHeliTourDetailPage
            ? "WhatsApp Inquiry"
            : isHeliTourDetailPage
            ? "Request Custom Quote"
            : "WhatsApp Inquiry"
        }
        telPhone={isHotelBooking ? "+9779851403761" : "+9779851420882"}
        whatsappPhone={isHotelBooking ? "9779851403761" : "9779851420882"}
        whatsappMessage={
          service.id === "heli-services" || isHeliTourDetailPage
            ? "Hello Trip Himalaya (Heli Operations Desk)! I would like to inquire about helicopter services and flight packages."
            : isHotelBooking
            ? "Hello Trip Himalaya (Hotel Booking Team)! I would like to inquire about hotel rooms and availability. Please share details."
            : undefined
        }
      />
    </>
  );
};

export default ServiceDetail;
