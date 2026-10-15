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
import VehicleRentalDetailContent, {
  VehicleFilterCriteria,
  AVAILABLE_VEHICLE_ROUTES,
} from "../components/Service/VehicleRentalDetailContent";
import { getAllVehicles } from "../api/BackendApi";
import HeliServicesDetailContent from "../components/Service/HeliServicesDetailContent";
import VisaServicesDetailContent, { VisaFilterCriteria } from "../components/Service/VisaServicesDetailContent";

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

  // Heli Search Bar State
  const [heliLocationInput, setHeliLocationInput] = useState("");
  const [heliNameInput, setHeliNameInput] = useState("");
  const [appliedHeliFilter, setAppliedHeliFilter] = useState<{ location: string; name: string } | null>(null);

  const handleHeliSearch = () => {
    const loc = heliLocationInput.trim();
    const name = heliNameInput.trim();
    if (!loc && !name) {
      setAppliedHeliFilter(null);
    } else {
      setAppliedHeliFilter({ location: loc, name });
    }
    setTimeout(() => scrollToSection("section-services", "SERVICES"), 80);
  };

  const handleVisaSearch = () => {
    setAppliedVisaFilter({
      country: visaSearchCountry,
      visaType: visaSearchType,
      entryType: visaSearchEntry,
    });
    scrollToSection("section-services", "SERVICES");
  };

  // Tours Search Bar State
  const [tourDestinationType, setTourDestinationType] = useState("all");
  const [tourLocationSearch, setTourLocationSearch] = useState("");
  const [appliedTourFilter, setAppliedTourFilter] = useState<TourFilterCriteria | null>(null);

  const handleTourSearch = () => {
    setAppliedTourFilter({
      destinationType: tourDestinationType,
      location: tourLocationSearch,
    });
    scrollToSection("section-services", "SERVICES");
  };

  // Activity Search Bar State
  const [activityLocationSearch, setActivityLocationSearch] = useState("");
  const [activityNameSearch, setActivityNameSearch] = useState("");
  const [appliedActivityFilter, setAppliedActivityFilter] = useState<ActivityFilterCriteria | null>(null);

  const handleActivitySearch = () => {
    setAppliedActivityFilter({
      location: activityLocationSearch,
      activityName: activityNameSearch,
    });
    scrollToSection("section-services", "SERVICES");
  };

  // Trekking Search Bar State
  const [trekLocationSearch, setTrekLocationSearch] = useState("");
  const [trekDurationSearch, setTrekDurationSearch] = useState("");
  const [appliedTrekFilter, setAppliedTrekFilter] = useState<TrekFilterCriteria | null>(null);

  const handleTrekkingSearch = () => {
    setAppliedTrekFilter({
      location: trekLocationSearch,
      duration: trekDurationSearch,
    });
    scrollToSection("section-services", "SERVICES");
  };

  // Insurance Search Bar State
  const [insuranceSearchType, setInsuranceSearchType] = useState("all");
  const [insuranceSearchDays, setInsuranceSearchDays] = useState("");
  const [appliedInsuranceFilter, setAppliedInsuranceFilter] = useState<InsuranceFilterCriteria | null>(null);

  const handleInsuranceSearch = () => {
    setAppliedInsuranceFilter({
      insuranceType: insuranceSearchType,
      days: insuranceSearchDays,
    });
    scrollToSection("section-services", "SERVICES");
  };

  // Hotel Booking Search Bar State
  const [hotelSearchRegion, setHotelSearchRegion] = useState("all");
  const [hotelSearchLocation, setHotelSearchLocation] = useState("");
  const [hotelSearchName, setHotelSearchName] = useState("");
  const [hotelSearchCheckIn, setHotelSearchCheckIn] = useState("");
  const [hotelSearchCheckOut, setHotelSearchCheckOut] = useState("");
  const [showHotelLocation, setShowHotelLocation] = useState(false);
  const [showHotelCheckIn, setShowHotelCheckIn] = useState(false);
  const [showHotelCheckOut, setShowHotelCheckOut] = useState(false);
  const [appliedHotelFilter, setAppliedHotelFilter] = useState<HotelFilterCriteria | null>(null);

  const isLocationVisible = showHotelLocation || Boolean(hotelSearchLocation) || showHotelCheckIn || Boolean(hotelSearchCheckIn) || showHotelCheckOut || Boolean(hotelSearchCheckOut);
  const isCheckInVisible = showHotelCheckIn || Boolean(hotelSearchCheckIn) || showHotelCheckOut || Boolean(hotelSearchCheckOut);
  const isCheckOutVisible = showHotelCheckOut || Boolean(hotelSearchCheckOut);

  const handleHotelSearch = () => {
    setAppliedHotelFilter({
      region: hotelSearchRegion,
      location: hotelSearchLocation,
      hotelName: hotelSearchName,
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
                if (r?.from) rawFromList.push(String(r.from));
                if (r?.to) rawToList.push(String(r.to));
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

  // Floating Autocomplete dropdown states for FROM and TO
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
          {/* Left: All Destination / Domestic Tour / International Tour */}
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

          {/* Right: Location Search Input */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <MapPin size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SEARCH BY LOCATION
              </label>
              <input
                type="text"
                value={tourLocationSearch}
                onChange={(e) => setTourLocationSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTourSearch()}
                placeholder="Kathmandu, Pokhara, Chitwan..."
                className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
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
          {/* Left: Location Search */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <MapPin size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SEARCH BY LOCATION
              </label>
              <input
                type="text"
                value={trekLocationSearch}
                onChange={(e) => setTrekLocationSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrekkingSearch()}
                placeholder="Everest, Annapurna, Pokhara..."
                className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
            </div>
          </div>

          {/* Right: Duration Search */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Clock size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SEARCH BY DURATION
              </label>
              <input
                type="text"
                value={trekDurationSearch}
                onChange={(e) => setTrekDurationSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrekkingSearch()}
                placeholder="7 days, 14 nights, short trek..."
                className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
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
          {/* Left: Location Search */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <MapPin size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SEARCH BY LOCATION
              </label>
              <input
                type="text"
                value={activityLocationSearch}
                onChange={(e) => setActivityLocationSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleActivitySearch()}
                placeholder="Pokhara, Kushma, Kathmandu..."
                className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
            </div>
          </div>

          {/* Right: Adventure Activity / Package Search */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Sparkles size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SEARCH BY ADVENTURE ACTIVITY
              </label>
              <input
                type="text"
                value={activityNameSearch}
                onChange={(e) => setActivityNameSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleActivitySearch()}
                placeholder="Paragliding, Bungee, Air Package..."
                className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
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
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:py-4 sm:px-3.5 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 transition-all duration-300">
          {/* 1. At left side: Search by Region: Domestic and International (dropdown - always visible) */}
          <div className="flex items-center gap-2 flex-1 min-w-0 px-2 sm:px-2.5 py-1.5 sm:py-2.5 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Globe size={16} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full min-w-0">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">
                SEARCH BY REGION
              </label>
              <select
                value={hotelSearchRegion}
                onChange={(e) => setHotelSearchRegion(e.target.value)}
                className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none py-1 cursor-pointer w-full truncate"
              >
                <option value="all">All Regions</option>
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>
            </div>
          </div>

          {/* 2. Search by Hotel name (always visible by default; click reveals Location) */}
          <div
            onClick={() => setShowHotelLocation(true)}
            className="flex items-center gap-2 flex-1 min-w-0 px-2 sm:px-2.5 py-1.5 sm:py-2.5 border-b sm:border-b-0 sm:border-r border-gray-100 cursor-text"
          >
            <Building2 size={16} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full min-w-0">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">
                SEARCH BY HOTEL NAME
              </label>
              <input
                type="text"
                value={hotelSearchName}
                onChange={(e) => {
                  setHotelSearchName(e.target.value);
                  setShowHotelLocation(true);
                }}
                onFocus={() => setShowHotelLocation(true)}
                onClick={() => setShowHotelLocation(true)}
                onKeyDown={(e) => e.key === "Enter" && handleHotelSearch()}
                placeholder="Hotel name..."
                className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full truncate"
              />
            </div>
          </div>

          {/* 3. Search by location (revealed when Hotel Name is clicked; click reveals Checkin) */}
          {isLocationVisible && (
            <div
              onClick={() => setShowHotelCheckIn(true)}
              className="flex items-center gap-2 flex-1 min-w-0 px-2 sm:px-2.5 py-1.5 sm:py-2.5 border-b sm:border-b-0 sm:border-r border-gray-100 cursor-text transition-all duration-200"
            >
              <MapPin size={16} className="text-pink-500 flex-shrink-0" />
              <div className="flex flex-col w-full min-w-0">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">
                  SEARCH BY LOCATION
                </label>
                <input
                  type="text"
                  value={hotelSearchLocation}
                  onChange={(e) => {
                    setHotelSearchLocation(e.target.value);
                    setShowHotelCheckIn(true);
                  }}
                  onFocus={() => setShowHotelCheckIn(true)}
                  onClick={() => setShowHotelCheckIn(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleHotelSearch()}
                  placeholder="City, area..."
                  className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full truncate"
                />
              </div>
            </div>
          )}

          {/* 4. Checkin date (revealed when Location is clicked; click reveals Checkout) */}
          {isCheckInVisible && (
            <div
              onClick={() => setShowHotelCheckOut(true)}
              className="flex items-center gap-1.5 flex-1 min-w-0 px-1.5 sm:px-2 py-1.5 sm:py-2.5 border-b sm:border-b-0 sm:border-r border-gray-100 cursor-pointer transition-all duration-200"
            >
              <Calendar size={16} className="text-pink-500 flex-shrink-0" />
              <div className="flex flex-col w-full min-w-0">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">
                  CHECKIN DATE
                </label>
                <input
                  type="date"
                  min={todayDateStr}
                  value={hotelSearchCheckIn}
                  onFocus={() => setShowHotelCheckOut(true)}
                  onClick={() => setShowHotelCheckOut(true)}
                  onChange={(e) => {
                    const val = e.target.value;
                    const finalVal = val && val < todayDateStr ? todayDateStr : val;
                    setHotelSearchCheckIn(finalVal);
                    setShowHotelCheckOut(true);
                    if (hotelSearchCheckOut && finalVal && hotelSearchCheckOut < finalVal) {
                      setHotelSearchCheckOut("");
                    }
                  }}
                  className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none py-1 cursor-pointer w-full min-w-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:p-0"
                />
              </div>
            </div>
          )}

          {/* 5. Checkout date (revealed when Checkin is clicked) */}
          {isCheckOutVisible && (
            <div className="flex items-center gap-1.5 flex-1 min-w-0 px-1.5 sm:px-2 py-1.5 sm:py-2.5 border-b sm:border-b-0 sm:border-r border-gray-100 cursor-pointer transition-all duration-200">
              <Calendar size={16} className="text-pink-500 flex-shrink-0" />
              <div className="flex flex-col w-full min-w-0">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">
                  CHECKOUT DATE
                </label>
                <input
                  type="date"
                  min={hotelSearchCheckIn && hotelSearchCheckIn >= todayDateStr ? hotelSearchCheckIn : todayDateStr}
                  value={hotelSearchCheckOut}
                  onChange={(e) => setHotelSearchCheckOut(e.target.value)}
                  className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none py-1 cursor-pointer w-full min-w-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:p-0"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleHotelSearch}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-6 sm:px-7 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer active:scale-95 flex-shrink-0"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isVisaServices) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* 1. Left: Visa Type */}
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

          {/* 3. Right: Country (Text Input) */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Globe size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                DESTINATION COUNTRY
              </label>
              <input
                type="text"
                value={visaSearchCountry}
                onChange={(e) => setVisaSearchCountry(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVisaSearch()}
                placeholder="Search destination country..."
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
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
          {/* 1. Insurance Type Dropdown */}
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

          {/* 2. Days Input */}
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Clock size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                DAYS
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={insuranceSearchDays}
                onChange={(e) => setInsuranceSearchDays(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleInsuranceSearch()}
                placeholder="Enter number of days..."
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
              />
            </div>
          </div>

          <button
            onClick={handleInsuranceSearch}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer active:scale-95"
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
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
                  <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[210px] bg-white rounded-xl shadow-2xl border border-pink-100 z-50 py-1.5 max-h-56 overflow-y-auto animate-in fade-in duration-150">
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
                  <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[210px] bg-white rounded-xl shadow-2xl border border-pink-100 z-50 py-1.5 max-h-56 overflow-y-auto animate-in fade-in duration-150">
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
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
                  className="w-full sm:w-auto rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 py-3 px-7 text-white font-bold text-xs tracking-wider transition-all whitespace-nowrap cursor-pointer shadow-sm hover:shadow-md"
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
        {/* Location */}
        <div className="flex items-center gap-3 flex-1 min-w-0 px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
          <MapPin size={18} className="text-pink-500 flex-shrink-0" />
          <div className="flex flex-col w-full">
            <label htmlFor="heli-location-input" className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              LOCATION
            </label>
            <input
              id="heli-location-input"
              type="text"
              value={heliLocationInput}
              onChange={(e) => setHeliLocationInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleHeliSearch()}
              placeholder="Everest, Annapurna..."
              className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
            />
          </div>
        </div>

        {/* Name / Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0 px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
          <Wind size={18} className="text-pink-500 flex-shrink-0" />
          <div className="flex flex-col w-full">
            <label htmlFor="heli-name-input" className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              NAME / TITLE
            </label>
            <input
              id="heli-name-input"
              type="text"
              value={heliNameInput}
              onChange={(e) => setHeliNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleHeliSearch()}
              placeholder="Search package name..."
              className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
            />
          </div>
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

  return (
    <>
      {/* ── 1. TOP BANNER SECTION (Omitted on dedicated Heli Tour Details Page) ── */}
      {!isHeliTourDetailPage && (
        <div className="w-full flex flex-col items-center">
          <div className="w-full relative shadow-md bg-white border-b border-gray-200">
          {/* ── 1. TOP BANNER SECTION (With 1. Title at top, 2. SearchBar in middle, 3. Quote below) ── */}
          {isTours ? (
            /* ── TOURS HERO BANNER (Exactly matching Adventure Activities) ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
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
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">
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
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
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
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">
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
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
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
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">
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
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">{renderFloatingSearchBar()}</div>
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
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">{renderFloatingSearchBar()}</div>
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
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">{renderFloatingSearchBar()}</div>
                {service.shortDesc && <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">"{service.shortDesc}"</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
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
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">{renderFloatingSearchBar()}</div>
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
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">{renderFloatingSearchBar()}</div>
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
                  setActivityLocationSearch("");
                  setActivityNameSearch("");
                }}
              />
            ) : isTrekking ? (
              <TrekkingDetailContent
                filter={appliedTrekFilter}
                onClearFilter={() => {
                  setAppliedTrekFilter(null);
                  setTrekLocationSearch("");
                  setTrekDurationSearch("");
                }}
              />
            ) : isHotelBooking ? (
              <HotelBookingDetailContent
                filter={appliedHotelFilter}
                onClearFilter={() => {
                  setAppliedHotelFilter(null);
                  setHotelSearchRegion("all");
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
        telPhone="+9779851420882"
        whatsappPhone="9779851420882"
        whatsappMessage={
          service.id === "heli-services" || isHeliTourDetailPage
            ? "Hello Trip Himalaya (Heli Operations Desk)! I would like to inquire about helicopter services and flight packages."
            : undefined
        }
      />
    </>
  );
};

export default ServiceDetail;
