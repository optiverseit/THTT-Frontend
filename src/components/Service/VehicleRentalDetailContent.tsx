import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import type { Package } from "../../assets/data/types";

import {
  useGlobalCurrency,
  displayPrice,
} from "../../context/CurrencyContext";

import VehicleSidebarFilter from "../VehiclePackageDetail/VehicleSidebarFilter";

import VehicleRentalBookingModal, {
  VehicleBookingItem,
} from "./VehicleRentalBookingModal";

import DynamicFaqSection from "../reusable/DynamicFaqSection";
import { isSessionValid, clearAuthSession } from "../../utils/sessionManager";

// Change this path only if your API file is located somewhere else
import { getAllVehicles } from "../../api/BackendApi";

import {
  ShieldCheck,
  Wind,
  Video,
  Gauge,
  AlertCircle,
  Sparkles,
  Star,
  MapPin,
  Calendar,
  Clock,
  Users,
  Luggage,
  Fuel,
  Zap,
  Info,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";


// ============================================================
// BACKEND VEHICLE TYPE
// ============================================================

interface BackendVehicle {
  id: number | string;
  name?: string;
  title?: string;
  slug?: string;

  capacity?: number | string;
  type?: string;
  status?: string;

  price?: number | string;
  price_per_day?: number | string;
  pricePerDay?: number | string;

  image?: string;
  images?: Array<
    | string
    | {
      id?: number;
      vehicle_id?: number;
      image?: string;
      image_url?: string;
      url?: string;
      secure_url?: string;
      image_public_id?: string;
    }
  >;
  description?: string;
  location?: string;

  category?: string;
  categoryLabel?: string;

  best_for?: string;
  bestFor?: string;

  amenities?: string[];
  features?: string[];

  rating?: number;

  is_featured?: boolean | number;
  isFeatured?: boolean;

  // New fields for vehicle rental cards (mock data / API ready)
  fuel_type?: string;         // "Petrol" | "Electric" | "Diesel" | "Hybrid"
  vehicle_type?: string;      // "HiAce" | "4WD SUV" | "Sedan" | "Coaster"
  from_location?: string;     // e.g. "Kathmandu"
  destination?: string;       // e.g. "Pokhara"
  to_location?: string;
  available_from?: string;    // e.g. "2026-10-01"
  available_to?: string;      // e.g. "2026-10-15"
  trip_type?: "One Way" | "Round Trip" | "Private" | string;
  total_seats?: number | string;
  available_seats?: number | string;
  bags_per_person?: number | string;
  luggage_weight_max?: string;
  no_of_days?: number | string;
}


// ============================================================
// FALLBACK MOCK VEHICLES (Used when API is empty or as sample)
// ============================================================

const MOCK_VEHICLES_FALLBACK: BackendVehicle[] = [
  {
    id: "mock-1",
    name: "Toyota HiAce Super GL",
    title: "Toyota HiAce Super GL",
    type: "van",
    vehicle_type: "HiAce",
    fuel_type: "Petrol",
    price: 9500,
    rating: 5,
    description: "Premium high-roof AC HiAce with plush recliner seats, ample legroom, and expert mountain chauffeur for comfortable highway group travel.",
    from_location: "Kathmandu",
    destination: "Pokhara",
    available_from: "2026-10-01",
    available_to: "2026-10-20",
    trip_type: "Round Trip",
    total_seats: 14,
    available_seats: 9,
    bags_per_person: "1 Large Bag",
    luggage_weight_max: "20 kg Max",
    no_of_days: "3 Days",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "mock-2",
    name: "Mahindra Scorpio 4WD S11",
    title: "Mahindra Scorpio 4WD S11",
    type: "suv",
    vehicle_type: "4WD SUV",
    fuel_type: "Petrol",
    price: 8500,
    rating: 5,
    description: "Rugged high-ground clearance 4x4 SUV built specifically for off-road trails, Mustang, Manang, and challenging Himalayan terrains.",
    from_location: "Kathmandu",
    destination: "Muktinath / Jomsom",
    available_from: "2026-10-05",
    available_to: "2026-10-25",
    trip_type: "Private",
    total_seats: 7,
    available_seats: 5,
    bags_per_person: "1 Bag / Person",
    luggage_weight_max: "25 kg Max",
    no_of_days: "4 Days",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "mock-3",
    name: "BYD Atto 3 Electric SUV",
    title: "BYD Atto 3 Electric SUV",
    type: "suv",
    vehicle_type: "4WD SUV",
    fuel_type: "Electric",
    price: 7000,
    rating: 4,
    description: "Eco-friendly zero-emission pure electric SUV with silent ride, panoramic sunroof, and ultra-smooth modern suspension for valley tours.",
    from_location: "Kathmandu",
    destination: "Nagarkot Sunrise",
    available_from: "2026-10-02",
    available_to: "2026-10-30",
    trip_type: "One Way",
    total_seats: 5,
    available_seats: 4,
    bags_per_person: "1 Carry-on",
    luggage_weight_max: "15 kg Max",
    no_of_days: "1 Day",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "mock-4",
    name: "Toyota Coaster Tourist Mini-Bus",
    title: "Toyota Coaster Tourist Mini-Bus",
    type: "bus",
    vehicle_type: "Coaster",
    fuel_type: "Petrol",
    price: 16000,
    rating: 5,
    description: "Spacious 22-seat air-conditioned tourist mini-bus equipped with microphone PA system, luggage racks, and heavy-duty suspension.",
    from_location: "Kathmandu",
    destination: "Chitwan National Park",
    available_from: "2026-10-01",
    available_to: "2026-10-28",
    trip_type: "Round Trip",
    total_seats: 22,
    available_seats: 16,
    bags_per_person: "2 Bags / Person",
    luggage_weight_max: "30 kg Max",
    no_of_days: "3 Days",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    ],
  },
];


// ============================================================
// POPULAR ROUTES
// ============================================================

const POPULAR_ROUTES = [
  {
    route: "Kathmandu to Pokhara (One-Way)",
    distance: "200 km (6-7 hrs)",
    priceUSD: 95,
    popularVehicle: "Toyota HiAce or Sedan",
    stops: "Malekhu Fish Market, Trishuli Riverside, Bandipur Junction",
  },
  {
    route: "Kathmandu to Chitwan National Park",
    distance: "165 km (5-6 hrs)",
    priceUSD: 85,
    popularVehicle: "Private AC Sedan or 4x4 SUV",
    stops: "Mugling Junction, Narayanghat Bazar, Resort Gate Drop",
  },
  {
    route: "Kathmandu Valley Full Day Sightseeing (7 UNESCO Spots)",
    distance: "Full Day (8 hrs)",
    priceUSD: 50,
    popularVehicle: "Sedan / Scorpio SUV",
    stops: "Pashupatinath, Boudhanath, Swayambhu, Patan & Bhaktapur",
  },
  {
    route: "Kathmandu to Nagarkot Sunrise Return Trip",
    distance: "32 km (2 hrs drive)",
    priceUSD: 40,
    popularVehicle: "Comfort Sedan / SUV",
    stops: "Nagarkot View Tower, Bhaktapur Heritage Pause",
  },
  {
    route: "Pokhara to Muktinath / Jomsom (Off-Road 4x4)",
    distance: "175 km (8 hrs)",
    priceUSD: 180,
    popularVehicle: "Mahindra Scorpio 4WD Only",
    stops: "Tatopani Hot Springs, Rupse Waterfall, Marpha Apple Orchards",
  },
];


// ============================================================
// FAQ
// ============================================================

const VEHICLE_FAQS = [
  {
    q: "Is a professional chauffeur included in the rental price?",
    a: "Yes! All our vehicle rentals include a courteous, government-licensed professional chauffeur with extensive experience in Nepal's mountain highways. Chauffeur daily salary, meals, and overnight lodging allowance are 100% included with no hidden extras.",
  },
  {
    q: "Are fuel, road tolls, and driver allowances included in the price?",
    a: "Yes, 100%! All our quoted rental rates are completely all-inclusive: vehicle rental, experienced mountain chauffeur, all fuel costs, interstate highway tolls, parking charges, and complete driver lodging/meals.",
  },
  {
    q: "Can I rent a vehicle for self-drive in Nepal?",
    a: "Due to complex Himalayan mountain terrain, single-lane bypasses, unpredictable road conditions, and strict local transport regulations, all our vehicles are provided with dedicated professional drivers for maximum passenger safety.",
  },
  {
    q: "How are seat numbers assigned?",
    a: "Admin will assign seats after verification or contact for seat number verification after successful booking. You can also mention your seat preference during checkout or directly over WhatsApp.",
  },
  {
    q: "What happens in case of a mechanical breakdown during the trip?",
    a: "We maintain a 24/7 highway emergency fleet support network across all major highways in Nepal. In the rare event of a mechanical issue, an equivalent replacement vehicle is arranged immediately at no extra cost.",
  },
];


// ============================================================
// AUTO-SLIDING VEHICLE IMAGE CAROUSEL (3 SECONDS INTERVAL)
// ============================================================

interface VehicleImageSliderProps {
  images: string[];
  alt: string;
  fuelType?: string;
  tripType?: string;
}

const VehicleImageSlider: React.FC<VehicleImageSliderProps> = ({
  images,
  alt,
  fuelType,
  tripType,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const safeImages =
    images && images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"];

  useEffect(() => {
    if (safeImages.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [safeImages.length, isHovered]);

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  return (
    <div
      className="relative w-full h-full min-h-[200px] sm:min-h-[220px] overflow-hidden bg-gray-100 group/slider select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sliding Images */}
      {safeImages.map((imgSrc, idx) => (
        <img
          key={idx}
          src={imgSrc}
          alt={`${alt} - ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
        />
      ))}

      {/* Floating Petrol & Private Badges on Image (replaced VEHICLE RENTAL tag) */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
        {fuelType && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs ${fuelType.toLowerCase() === "electric"
                ? "bg-emerald-600 text-white"
                : "bg-white/95 text-amber-800"
              }`}
          >
            {fuelType.toLowerCase() === "electric" ? (
              <Zap size={10} className="fill-current" />
            ) : (
              <Fuel size={10} className="text-amber-600" />
            )}
            {fuelType}
          </span>
        )}

        {tripType && (
          <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-[#2D1347] border border-purple-100 shadow-sm backdrop-blur-xs">
            {tripType}
          </span>
        )}
      </div>

      {/* Arrow Controls (visible on hover if multiple images) */}
      {safeImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous Image"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all cursor-pointer z-10"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next Image"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all cursor-pointer z-10"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs">
            {safeImages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                className={`transition-all rounded-full ${i === currentIndex
                    ? "w-4 h-1.5 bg-[#FF4FA3]"
                    : "w-1.5 h-1.5 bg-white/70 hover:bg-white"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};


// ============================================================
// HELPER: ENRICH VEHICLE WITH FALLBACKS FOR NEW FIELDS
// ============================================================

const enrichVehicleWithDefaults = (v: BackendVehicle, index = 0) => {
  const name = v.name || v.title || "Rental Vehicle";
  const rawType = (v.type || v.category || "").toLowerCase();
  const rawName = name.toLowerCase();

  // 1. Vehicle Type like HiAce, 4WD SUVs, Sedan, Coaster
  let vehicleType = v.vehicle_type;
  if (!vehicleType) {
    if (
      rawType.includes("hiace") ||
      rawType.includes("van") ||
      rawName.includes("hiace") ||
      rawName.includes("van")
    ) {
      vehicleType = "HiAce";
    } else if (
      rawType.includes("sedan") ||
      rawName.includes("sedan") ||
      rawName.includes("dzire")
    ) {
      vehicleType = "Sedan";
    } else if (
      rawType.includes("bus") ||
      rawType.includes("coaster") ||
      rawName.includes("coaster") ||
      rawName.includes("bus")
    ) {
      vehicleType = "Coaster";
    } else {
      vehicleType = "4wd SUVs";
    }
  }

  // 2. Petrol or Electric
  let fuelType = v.fuel_type;
  if (!fuelType) {
    if (
      rawName.includes("ev") ||
      rawName.includes("electric") ||
      rawType.includes("electric")
    ) {
      fuelType = "Electric";
    } else {
      fuelType = "Petrol";
    }
  }

  // 3. From, Destination
  const fromLocation = v.from_location || "Kathmandu";
  const destination = v.destination || v.to_location || (index % 2 === 0 ? "Pokhara" : "Chitwan");

  // 4. Date: from to To
  const availableFrom = v.available_from || "2026-10-01";
  const availableTo = v.available_to || "2026-10-20";

  // 5. One way or Round Trip, Private (any one at a time) — defaults to "One Way" until API provides trip_type
  const tripType = v.trip_type || "One Way";

  // 6. Total Number of Seats & Available Seats
  const capacityNum = Number(v.capacity) || (vehicleType === "HiAce" ? 14 : vehicleType === "Coaster" ? 22 : 7);
  const totalSeats = v.total_seats ?? capacityNum;
  const availableSeats =
    v.available_seats ??
    Math.max(1, Math.min(Number(totalSeats), Math.floor(Number(totalSeats) * 0.7)));

  // 7. Bags per person & Luggage Weight (Max)
  const bagsPerPerson = v.bags_per_person ?? "1 Bag / Person";
  const luggageWeightMax = v.luggage_weight_max ?? "20 kg (Max)";

  // 8. No. of days:
  const noOfDays = v.no_of_days ?? (index % 2 === 0 ? "1 Day" : "3 Days");

  // 9. Rating
  const rating = v.rating ?? 5;

  // 10. Sliding Images gallery (each 3 seconds)
  let images: string[] = [];

  if (Array.isArray(v.images) && v.images.length > 0) {
    images = v.images
      .map((img) => {
        if (typeof img === "string") return img;

        return (
          img.image ||
          img.image_url ||
          img.secure_url ||
          img.url ||
          ""
        );
      })
      .filter((img): img is string => Boolean(img));
  }

  if (images.length === 0 && v.image) {
    images = [v.image];
  }

  return {
    ...v,
    name,
    vehicleType,
    fuelType,
    fromLocation,
    destination,
    availableFrom,
    availableTo,
    tripType,
    totalSeats,
    availableSeats,
    bagsPerPerson,
    luggageWeightMax,
    noOfDays,
    rating,
    images,
  };
};


// ============================================================
// VEHICLE RENTAL DETAIL CONTENT COMPONENT
// ============================================================

const VehicleRentalDetailContent: React.FC = () => {
  const navigate = useNavigate();

  const {
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  // State
  const [vehicles, setVehicles] = useState<BackendVehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number>(500000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  // Booking Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingItem, setSelectedBookingItem] = useState<VehicleBookingItem | null>(null);

  // Pagination for cards
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const cardsTopRef = useRef<HTMLDivElement>(null);

  // ==========================================================
  // FETCH VEHICLES FROM API
  // ==========================================================

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllVehicles();
        console.log("Vehicles API response:", response.data);

        const vehicleData =
          response.data?.data?.data ??
          response.data?.data ??
          response.data ??
          [];

        if (Array.isArray(vehicleData) && vehicleData.length > 0) {
          const mappedVehicles = vehicleData.map((v: any, index: number) => {
            if (v.rating !== undefined && v.rating !== null && v.rating !== "") {
              return v;
            }
            const numId = Number(v.id) || index;
            const computedRating = (!isNaN(numId) && (numId + (v.name?.length || 0)) % 2 === 0) ? 4 : 5;
            return {
              ...v,
              rating: computedRating,
            };
          });
          setVehicles(mappedVehicles);
        } else {
          // Fallback to mock data if API returned empty array
          setVehicles(MOCK_VEHICLES_FALLBACK);
        }
      } catch (err: any) {
        console.error("Failed to fetch vehicles, using mock data:", err);
        // Use mock data on error so page still renders completely
        setVehicles(MOCK_VEHICLES_FALLBACK);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Reset page when tab or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, priceRange, selectedRating, selectedKeywords]);

  // ==========================================================
  // FORMAT USD TO CURRENCY
  // ==========================================================

  const formatPrice = (usdAmount: number) => {
    const nprAmount = usdAmount * nprPerOneDollar;
    return displayPrice(
      nprAmount,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );
  };

  const getVehiclePrice = (vehicle: BackendVehicle): number => {
    const value =
      vehicle.price ??
      vehicle.price_per_day ??
      vehicle.pricePerDay ??
      0;
    const cleanStr = String(value).replace(/[^0-9.]/g, "");
    const parsed = Number(cleanStr);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const vehicleKeywords = [
    "4X4",
    "SUV",
    "SCORPIO",
    "PRADO",
    "HIACE",
    "VAN",
    "SEDAN",
    "COASTER",
    "CHAUFFEUR",
    "MOUNTAIN",
    "POKHARA",
    "ELECTRIC",
    "PETROL",
  ];

  // ==========================================================
  // ENRICH VEHICLES WITH FULL SPECS & MOCK DEFAULTS
  // ==========================================================

  const enrichedVehicles = vehicles.map((v, idx) =>
    enrichVehicleWithDefaults(v, idx)
  );

  // ==========================================================
  // FILTER VEHICLES
  // ==========================================================

  const filteredVehicles = enrichedVehicles.filter((v) => {
    // 1. Tab filter
    if (activeTab !== "all") {
      const typeStr = (v.type || v.category || v.vehicleType || "").toLowerCase();
      const nameStr = (v.name || v.title || "").toLowerCase();

      if (activeTab === "suv") {
        const matches =
          typeStr.includes("suv") ||
          typeStr.includes("4wd") ||
          nameStr.includes("suv") ||
          nameStr.includes("scorpio") ||
          nameStr.includes("prado") ||
          nameStr.includes("maruti");
        if (!matches) return false;
      }

      if (activeTab === "van") {
        const matches =
          typeStr.includes("van") ||
          typeStr.includes("hiace") ||
          nameStr.includes("hiace") ||
          nameStr.includes("van");
        if (!matches) return false;
      }

      if (activeTab === "sedan") {
        const matches =
          typeStr.includes("sedan") ||
          nameStr.includes("sedan") ||
          nameStr.includes("dzire");
        if (!matches) return false;
      }

      if (activeTab === "bus") {
        const matches =
          typeStr.includes("bus") ||
          typeStr.includes("coaster") ||
          nameStr.includes("bus") ||
          nameStr.includes("coaster");
        if (!matches) return false;
      }
    }

    // 2. Price filter (0 to 500,000 NPR)
    const priceNum = getVehiclePrice(v);
    const matchesPrice =
      priceNum === 0 || priceNum <= priceRange;

    // 3. Rating filter
    const rating = Math.round(Number(v.rating ?? 5));
    const matchesRating =
      selectedRating === 0 || rating === selectedRating;

    // 4. Keyword filter
    const matchesKeywords =
      selectedKeywords.length === 0
        ? true
        : selectedKeywords.some((keyword) => {
          const kw = keyword.toLowerCase();
          const name = (v.name || v.title || "").toLowerCase();
          const type = (v.type || v.vehicleType || "").toLowerCase();
          const desc = (v.description || "").toLowerCase();
          const fuel = (v.fuelType || "").toLowerCase();
          const location = (v.fromLocation || "" + v.destination || "").toLowerCase();

          return (
            name.includes(kw) ||
            type.includes(kw) ||
            desc.includes(kw) ||
            fuel.includes(kw) ||
            location.includes(kw)
          );
        });

    return matchesPrice && matchesRating && matchesKeywords;
  });

  // Pagination slice
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredVehicles.length);
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (cardsTopRef.current) {
      const navOffset = 95;
      const elementPosition = cardsTopRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  // ==========================================================
  // BOOK VEHICLE HANDLER
  // ==========================================================

  const handleBookVehicle = (vehicle: ReturnType<typeof enrichVehicleWithDefaults>) => {
    if (!isSessionValid()) {
      clearAuthSession();
      navigate("/login", {
        state: {
          from: "/service/vehicle-rental",
          vehicleId: vehicle.id,
          openBooking: true,
        },
      });
      return;
    }

    const priceNum = getVehiclePrice(vehicle);

    setSelectedBookingItem({
      id: String(vehicle.id),
      title: vehicle.name,
      location: `Route: ${vehicle.fromLocation} to ${vehicle.destination}`,
      duration: `Rental (${vehicle.noOfDays})`,
      price: String(priceNum),
      image: vehicle.images[0] || vehicle.image,
      type: "vehicle-rental",
      category: "Vehicle Rental",
      vehicleRental: {
        tripType: vehicle.tripType,
        totalSeats: Number(vehicle.totalSeats) || 10,
        availableSeats: Number(vehicle.availableSeats) || 7,
        fromLocation: vehicle.fromLocation,
        destination: vehicle.destination,
        vehicleType: vehicle.vehicleType,
        fuelType: vehicle.fuelType,
        availableFrom: vehicle.availableFrom,
        availableTo: vehicle.availableTo,
        basePrice: priceNum,
      },
    });

    setIsBookingModalOpen(true);
  };

  // ==========================================================
  // WHATSAPP INQUIRY
  // ==========================================================

  const handleWhatsAppInquiry = (vehicle: ReturnType<typeof enrichVehicleWithDefaults>) => {
    const priceNum = getVehiclePrice(vehicle);
    const priceFormatted = displayPrice(
      priceNum,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );

    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I am inquiring about vehicle rental for "${vehicle.name}" (${vehicle.vehicleType} - ${vehicle.fuelType}). Route: ${vehicle.fromLocation} to ${vehicle.destination}. Rate: ${priceFormatted}/day. Please share availability.`
    );

    window.open(
      `https://wa.me/9779851420882?text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================================
  // LOADING / ERROR
  // ==========================================================

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#2D1347] font-bold text-base">Loading vehicles...</p>
      </div>
    );
  }

  // ==========================================================
  // PAGE RENDER
  // ==========================================================

  return (
    <div className="space-y-12">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
            Comfort &amp; 4WD Vehicles with Driver
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Choose a vehicle category or filter by daily rate, ratings, and vehicle tags below.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: `All Vehicles (${vehicles.length})` },
            { id: "suv", label: "4WD SUVs" },
            { id: "van", label: "HiAce Vans" },
            { id: "sedan", label: "Sedans" },
            { id: "bus", label: "Coasters" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id
                  ? "bg-[#2D1347] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sidebar + Vehicle Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start" ref={cardsTopRef}>
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1">
          <VehicleSidebarFilter
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minPrice={0}
            maxPrice={500000}
            step={5000}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            customKeywords={vehicleKeywords}
          />
        </div>

        {/* Right: Vehicle Cards List */}
        <div className="lg:col-span-3">
          {filteredVehicles.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
              <p className="font-bold text-gray-600 text-base">No vehicles found.</p>
              <p className="text-gray-400 text-xs mt-1">Try resetting or broadening your filter criteria.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {currentVehicles.map((vehicle) => {
                const baseNPRPrice = getVehiclePrice(vehicle);
                const formattedStartingPrice =
                  baseNPRPrice > 0
                    ? displayPrice(
                      baseNPRPrice,
                      selectedCurrency,
                      nprPerOneDollar,
                      nprPerOneINR
                    )
                    : "Contact Us";

                return (
                  <div
                    key={vehicle.id}
                    className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 overflow-hidden group"
                  >
                    {/* LEFT: SLIDING IMAGE BOX (5s interval, rectangular layout) */}
                    <div className="relative w-full lg:w-60 xl:w-72 h-52 sm:h-60 lg:h-auto min-h-[200px] lg:min-h-[220px] flex-shrink-0 overflow-hidden bg-gray-100">
                      <VehicleImageSlider
                        images={vehicle.images}
                        alt={vehicle.name}
                        fuelType={vehicle.fuelType}
                        tripType={vehicle.tripType}
                      />
                    </div>

                    {/* MIDDLE: VEHICLE DETAILS & SPECIFICATIONS */}
                    <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col justify-between">
                      <div>
                        {/* Top row: Star Rating & Vehicle Type Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => {
                                const roundedRating = Math.round(Number(vehicle.rating ?? 5));
                                return (
                                  <Star
                                    key={i}
                                    size={13}
                                    className={
                                      i < roundedRating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-200 fill-gray-200"
                                    }
                                  />
                                );
                              })}
                            </div>
                            <span className="text-[11px] font-black text-gray-700">
                              {Number(vehicle.rating || 5).toFixed(1)}
                            </span>
                          </div>

                          {/* Vehicle type like HiAce, 4wd SUVs */}
                          <span className="text-xs font-bold text-[#E91E63] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100 flex-shrink-0 whitespace-nowrap">
                            {vehicle.vehicleType}
                          </span>
                        </div>

                        {/* Vehicle Name */}
                        <div className="mb-1">
                          <h2 className="text-lg sm:text-xl font-extrabold text-[#200B3B] leading-snug truncate" title={vehicle.name}>
                            {vehicle.name}
                          </h2>
                        </div>

                        {/* Vehicle Details / Information */}
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium mb-2.5">
                          {vehicle.description ||
                            `${vehicle.vehicleType} with professional chauffeur service for reliable Nepal mountain highway and valley travel.`}
                        </p>

                        {/* Structured Specifications Grid: 6 Balanced Items in 3 Columns */}
                        <div className="my-2">
                          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                            {/* 1. From */}
                            <div className="p-2 rounded-xl bg-gray-50/90 border border-gray-100 flex flex-col justify-between min-w-0 overflow-hidden">
                              <div className="flex items-center gap-1 text-[#E91E63] mb-0.5 min-w-0">
                                <MapPin size={11} className="flex-shrink-0" />
                                <span className="text-[9px] font-bold uppercase tracking-tight text-gray-400 truncate">
                                  From
                                </span>
                              </div>
                              <span className="font-extrabold text-[#200B3B] text-[11px] leading-tight capitalize truncate" title={vehicle.fromLocation}>
                                {vehicle.fromLocation}
                              </span>
                            </div>

                            {/* 2. Destination */}
                            <div className="p-2 rounded-xl bg-gray-50/90 border border-gray-100 flex flex-col justify-between min-w-0 overflow-hidden">
                              <div className="flex items-center gap-1 text-[#E91E63] mb-0.5 min-w-0">
                                <MapPin size={11} className="flex-shrink-0" />
                                <span className="text-[9px] font-bold uppercase tracking-tight text-gray-400 truncate">
                                  Destination
                                </span>
                              </div>
                              <span className="font-extrabold text-[#200B3B] text-[11px] leading-tight capitalize truncate" title={vehicle.destination}>
                                {vehicle.destination}
                              </span>
                            </div>

                            {/* 3. Days (updated from No. of Days) */}
                            <div className="p-2 rounded-xl bg-gray-50/90 border border-gray-100 flex flex-col justify-between min-w-0 overflow-hidden">
                              <div className="flex items-center gap-1 text-[#8B2CFF] mb-0.5 min-w-0">
                                <Clock size={11} className="flex-shrink-0" />
                                <span className="text-[9px] font-bold uppercase tracking-tight text-gray-400 truncate">
                                  Days
                                </span>
                              </div>
                              <span className="font-bold text-gray-800 text-[11px] leading-tight truncate">
                                {vehicle.noOfDays}
                              </span>
                            </div>

                            {/* 4. Seats: Total & Available */}
                            <div className="p-2 rounded-xl bg-gray-50/90 border border-gray-100 flex flex-col justify-between min-w-0 overflow-hidden">
                              <div className="flex items-center gap-1 text-[#8B2CFF] mb-0.5 min-w-0">
                                <Users size={11} className="flex-shrink-0" />
                                <span className="text-[9px] font-bold uppercase tracking-tight text-gray-400 truncate">
                                  Seats
                                </span>
                              </div>
                              {vehicle.tripType?.toLowerCase() === "private" ? (
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <span className="font-extrabold text-[#200B3B] text-[11px] leading-tight whitespace-nowrap truncate">
                                    {vehicle.totalSeats} Total
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1.5 min-w-0">
                                  <span className="font-extrabold text-[#200B3B] text-[11px] leading-tight whitespace-nowrap">
                                    {vehicle.availableSeats} Available
                                  </span>
                                  <span className="text-[8.5px] font-extrabold text-purple-700 bg-purple-100/90 px-1.5 rounded leading-tight whitespace-nowrap">
                                    {vehicle.totalSeats} Total
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* 5. Bags per person */}
                            <div className="p-2 rounded-xl bg-gray-50/90 border border-gray-100 flex flex-col justify-between min-w-0 overflow-hidden">
                              <div className="flex items-center gap-1 text-blue-600 mb-0.5 min-w-0">
                                <Luggage size={11} className="flex-shrink-0" />
                                <span className="text-[9px] font-bold uppercase tracking-tight text-gray-400 truncate" title="Bags per person">
                                  Bags per person
                                </span>
                              </div>
                              <span className="font-bold text-gray-800 text-[11px] leading-tight truncate" title={String(vehicle.bagsPerPerson)}>
                                {vehicle.bagsPerPerson}
                              </span>
                            </div>

                            {/* 6. Max Luggage */}
                            <div className="p-2 rounded-xl bg-gray-50/90 border border-gray-100 flex flex-col justify-between min-w-0 overflow-hidden">
                              <div className="flex items-center gap-1 text-blue-600 mb-0.5 min-w-0">
                                <ShieldCheck size={11} className="flex-shrink-0" />
                                <span className="text-[9px] font-bold uppercase tracking-tight text-gray-400 truncate" title="Max Luggage">
                                  Max Luggage
                                </span>
                              </div>
                              <span className="font-bold text-gray-800 text-[11px] leading-tight truncate">
                                {vehicle.luggageWeightMax}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Available Dates Individual Card (positioned below the specification grid) */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50/90 border border-pink-100 text-[#2D1347] max-w-full">
                          <Calendar size={12} className="text-[#E91E63] flex-shrink-0" />
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight flex-shrink-0">Available Dates:</span>
                          <span className="font-extrabold text-[#E91E63] text-[11px] whitespace-nowrap truncate">
                            {vehicle.availableFrom} to {vehicle.availableTo}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: PRICING & BOOK NOW BUTTON (VIEW DETAILS REMOVED) */}
                    <div className="w-full lg:w-44 xl:w-48 p-3.5 sm:p-4 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-gray-100 flex-shrink-0 text-center bg-white">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        STARTING FROM
                      </span>

                      <p className="text-2xl sm:text-3xl font-black text-[#E91E63] my-1">
                        {formattedStartingPrice}
                      </p>

                      <span className="text-[9px] text-gray-400 font-medium mb-4">
                        {vehicle.tripType?.toLowerCase() === "private" ? "per vehicle" : "per person"}
                      </span>

                      {/* BOOK NOW Button */}
                      <button
                        type="button"
                        onClick={() => handleBookVehicle(vehicle)}
                        className="w-full py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider bg-[#200B3B] hover:bg-[#2D1347] text-white shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
                      >
                        BOOK NOW
                      </button>

                      {/* WhatsApp Button (below BOOK NOW) */}
                      <a
                        href="https://wa.me/9779851403761"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-2 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.133 1.532 5.869L.054 23.447a.5.5 0 0 0 .614.614l5.578-1.478A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 0 1-5.012-1.375l-.36-.214-3.31.877.877-3.31-.214-.36A9.823 9.823 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" /></svg>
                        WhatsApp
                      </a>

                      {/* Instant WhatsApp Inquiry */}
                      <button
                        type="button"
                        onClick={() => handleWhatsAppInquiry(vehicle)}
                        className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-emerald-600 transition-colors mt-2.5 cursor-pointer group"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                        <span>INSTANT INQUIRY</span>
                      </button>

                      {/* Short Note: Admin seat assignment verification below Book Now & Instant Inquiry (hidden if trip is Private) */}
                      {vehicle.tripType?.toLowerCase() !== "private" && (
                        <div className="mt-2.5 p-1.5 px-2 rounded-xl bg-purple-50/80 border border-purple-100 text-[8px] text-[#3B145C] leading-snug text-left flex items-start gap-1">
                          <Info size={9.5} className="text-[#8B2CFF] flex-shrink-0 mt-0.5" />
                          <span>
                            Admin will assign seats after verification or contact for seat number verification after successful booking.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="text-gray-500 font-semibold text-sm">
                    SHOWING{" "}
                    <span className="text-[#E91E63] font-bold">
                      {filteredVehicles.length === 0 ? 0 : startIndex + 1}-{endIndex}
                    </span>{" "}
                    OF <span className="text-[#E91E63] font-bold">{filteredVehicles.length}</span>
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex items-center gap-1.5">
                    {totalPages > 1 && (
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous Page"
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${currentPage === 1
                            ? "text-gray-300 cursor-not-allowed bg-gray-50"
                            : "text-gray-600 bg-gray-100 hover:bg-pink-50 hover:text-[#E91E63] cursor-pointer active:scale-95"
                          }`}
                      >
                        <ChevronLeft size={14} />
                        <span className="hidden sm:inline">Prev</span>
                      </button>
                    )}

                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === pageNum
                              ? "bg-[#2D1347] text-white shadow-xs"
                              : "text-gray-600 bg-gray-100 hover:bg-pink-50 hover:text-[#E91E63]"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 1 && (
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next Page"
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed bg-gray-50"
                            : "text-gray-600 bg-gray-100 hover:bg-pink-50 hover:text-[#E91E63] cursor-pointer active:scale-95"
                          }`}
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Popular Routes Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-100 shadow-sm">
        <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs block mb-1">
          FIXED HIGHWAY FARES
        </span>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#2D1347] tracking-tight mb-4 sm:mb-6">
          Popular Tourist Route Fares (Fuel &amp; Driver Included)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-[#2D1347] font-black text-[11px] uppercase tracking-wider">
                <th className="pb-3 pr-4">Route &amp; Destination</th>
                <th className="pb-3 px-3">Distance &amp; Time</th>
                <th className="pb-3 px-3">Recommended Vehicle</th>
                <th className="pb-3 pl-3 text-right">Fixed Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {POPULAR_ROUTES.map((route, i) => (
                <tr key={i} className="hover:bg-pink-50/30 transition-colors">
                  <td className="py-3.5 pr-4">
                    <strong className="text-[#2D1347] block font-extrabold">
                      {route.route}
                    </strong>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Stops: {route.stops}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-gray-600 whitespace-nowrap">
                    {route.distance}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-purple-900">
                    {route.popularVehicle}
                  </td>
                  <td className="py-3.5 pl-3 text-right">
                    <span className="font-black text-sm text-[#E11D48] bg-pink-50 px-3 py-1 rounded-xl inline-block">
                      {formatPrice(route.priceUSD)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Section */}
      <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl">
        <div className="max-w-3xl mb-6 sm:mb-8">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs block mb-1">
            SAFE &amp; COMFORTABLE TRAVEL
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Reliable Vehicles for Nepal's Roads
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm mt-2 font-medium">
            Travel with professional drivers and well-maintained vehicles suitable for city, highway, and mountain routes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              icon: ShieldCheck,
              title: "Professional Drivers",
              desc: "Experienced and licensed chauffeurs familiar with Nepal's highways and mountain passes.",
            },
            {
              icon: Gauge,
              title: "Highway-Ready Fleet",
              desc: "Regular mechanical checks, excellent suspension, and all-terrain tires for maximum comfort.",
            },
            {
              icon: Wind,
              title: "Climate Controlled",
              desc: "Fully functioning AC and heating systems for comfort across tropical valleys and alpine altitudes.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] flex items-center justify-center text-white mb-3 shadow-md">
                  <Icon size={20} />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                <p className="text-gray-300 text-xs leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic FAQ Section */}
      <DynamicFaqSection
        targetType="service"
        targetId="vehicle-rental"
        defaultFaqs={VEHICLE_FAQS}
        title="Vehicle Rental FAQ"
        subtitle="Important details regarding chauffeur services and highway routes"
      />

      {/* Vehicle Rental Booking Modal */}
      <VehicleRentalBookingModal
        item={selectedBookingItem}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default VehicleRentalDetailContent;