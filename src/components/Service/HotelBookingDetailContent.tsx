import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HotelBookingSection from "./HotelBookingSection";
import HotelBookingModal from "../HotelPackageDetail/HotelBookingModal";
import HotelSidebarFilter from "../HotelPackageDetail/HotelSidebarFilter";
import { getHotels } from "../../api/BackendApi";
import { Award, Coffee, Car, Clock, ShieldCheck, Headphones, X, Calendar, MapPin, Building2, Globe } from "lucide-react";
import type { Hotel } from "../../assets/data/types";
import { isSessionValid, clearAuthSession } from "../../utils/sessionManager";

export interface HotelFilterCriteria {
  region: string;
  location: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
}

interface HotelBookingDetailContentProps {
  filter?: HotelFilterCriteria | null;
  onClearFilter?: () => void;
}

interface HotelPricingTierApi {
  id: number;
  hotel_id: number;
  room_name: string;
  room_code?: string | null;
  room_description?: string | null;
  price_npr: string | number;
  pricing_unit?: "PER_NIGHT" | "PER_DAY";
  max_guests?: number;
  max_adults?: number | null;
  max_children?: number | null;
  bed_type?: string | null;
  room_size?: string | null;
  status?: string;
  display_order?: number;
}

interface HotelImageApi {
  id?: number;
  hotel_id?: number;
  image_url?: string;
  file_url?: string;
  secure_url?: string;
  url?: string;
  image?: string;
  image_type?: "COVER" | "GALLERY";
  alt_text?: string | null;
  is_primary?: boolean;
  status?: string;
  display_order?: number;
}

interface HotelApi {
  id: number;
  hotel_code?: string;
  hotel_name: string;
  created_at?: string;
  slug?: string | null;
  short_description?: string | null;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  stay_type?: "PER_NIGHT" | "PER_DAY";
  rating?: number | string | null;
  available_from?: string | null;
  available_to?: string | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  status?: string;
  is_featured?: boolean;
  display_order?: number;
  pricing_tiers?: HotelPricingTierApi[];
  pricingTiers?: HotelPricingTierApi[];
  images?: HotelImageApi[];
}

const getPricingTiers = (hotel: HotelApi): HotelPricingTierApi[] => {
  const tiers = hotel.pricing_tiers || hotel.pricingTiers || [];
  return Array.isArray(tiers) ? tiers.filter((tier) => tier.status !== "INACTIVE") : [];
};

const getTierPrice = (tier: HotelPricingTierApi): number => {
  const price = Number(tier.price_npr ?? 0);
  return Number.isFinite(price) ? price : 0;
};

const getLowestTier = (hotel: HotelApi): HotelPricingTierApi | null => {
  const tiers = getPricingTiers(hotel).filter((tier) => getTierPrice(tier) > 0);
  if (!tiers.length) return null;
  return tiers.reduce((lowest, current) =>
    getTierPrice(current) < getTierPrice(lowest) ? current : lowest
  );
};

const getImageUrl = (hotel: HotelApi): string => {
  const images = Array.isArray(hotel.images)
    ? hotel.images.filter((image) => image.status !== "INACTIVE")
    : [];
  const primary = images.find((image) => image.is_primary);
  const cover = images.find((image) => image.image_type === "COVER");
  const selected = primary || cover || images[0];
  return (
    selected?.image_url ||
    selected?.file_url ||
    selected?.secure_url ||
    selected?.url ||
    selected?.image ||
    ""
  );
};

const getGallery = (hotel: HotelApi): string[] => {
  if (!Array.isArray(hotel.images)) return [];
  return hotel.images
    .filter((image) => image.status !== "INACTIVE")
    .map(
      (image) =>
        image.image_url ||
        image.file_url ||
        image.secure_url ||
        image.url ||
        image.image ||
        ""
    )
    .filter(Boolean);
};

const mapPricingTable = (hotel: HotelApi) => {
  return getPricingTiers(hotel).map((tier) => ({
    id: tier.id,
    service: tier.room_name,
    ageGroup: tier.pricing_unit === "PER_DAY" ? "Per Day" : "Per Night",
    priceNepali: String(getTierPrice(tier)),
    priceForeigner: String(getTierPrice(tier)),
  }));
};

const mapApiHotelToHotel = (hotel: HotelApi): Hotel => {
  const lowestTier = getLowestTier(hotel);
  const lowestPriceNPR = lowestTier ? getTierPrice(lowestTier) : 0;
  const pricingTable = mapPricingTable(hotel);
  const rating = Number(hotel.rating ?? 0);
  const country = hotel.country || "Nepal";
  const isDomestic = country.trim().toLowerCase() === "nepal";

  return {
    id: String(hotel.id),
    backendId: hotel.id,
    name: hotel.hotel_name || "Hotel",
    slug: hotel.slug || String(hotel.id),
    category: "luxury",
    tierLabel: lowestTier?.room_name || "Room",
    city: hotel.city || "",
    location:
      [hotel.address, hotel.city, hotel.country].filter(Boolean).join(", ") ||
      "Nepal",
    country,
    address: hotel.address || "",
    region: isDomestic ? "domestic" : "international",
    rating: Number.isFinite(rating) ? rating : 0,
    reviewsCount: 0,
    priceUSD: 0,
    priceNPR: lowestPriceNPR,
    lowestPriceNPR,
    image: getImageUrl(hotel),
    gallery: getGallery(hotel),
    amenities: [],
    features: [],
    description: hotel.description || hotel.short_description || "",
    isFeatured: Boolean(hotel.is_featured),
    badge: hotel.is_featured
      ? "Featured"
      : rating >= 4.5
      ? "Popular"
      : "Best Value",
    roomTypes: pricingTable.map((tier) => tier.service),
    availableFrom: hotel.available_from || undefined,
    availableTo: hotel.available_to || undefined,
    availability: "Available",
    tier: "Standard",
    pricingTable,
  };
};

/**
 * Normalizes any date string (ISO, YYYY-MM-DD, "Oct 08, 2026") into uniform "YYYY-MM-DD"
 */
const normalizeToYMD = (val?: string | null): string | null => {
  if (!val) return null;
  const s = String(val).trim();
  if (!s) return null;

  const ymdMatch = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymdMatch) {
    const y = ymdMatch[1];
    const m = ymdMatch[2].padStart(2, "0");
    const d = ymdMatch[3].padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  return null;
};

const checkIsDomestic = (
  hotel: Hotel,
  countryLower: string,
  cityLower: string,
  locationLower: string
): boolean => {
  const region = (hotel.region || "").trim().toLowerCase();
  const category = (hotel.category || "").trim().toLowerCase();

  if (region === "international" || category === "international") return false;
  if (region === "domestic" || category === "domestic") return true;

  if (countryLower && countryLower !== "nepal") return false;

  const internationalKeywords = [
    "thailand",
    "bangkok",
    "phuket",
    "bali",
    "indonesia",
    "dubai",
    "uae",
    "united arab emirates",
    "india",
    "delhi",
    "new delhi",
    "mumbai",
    "bhutan",
    "maldives",
    "singapore",
    "malaysia",
    "vietnam",
    "japan",
    "europe",
    "switzerland",
    "france",
    "paris",
    "london",
  ];

  if (
    internationalKeywords.some(
      (kw) => locationLower.includes(kw) || cityLower.includes(kw)
    )
  ) {
    return false;
  }

  return true;
};

const HotelBookingDetailContent: React.FC<HotelBookingDetailContentProps> = ({
  filter,
  onClearFilter,
}) => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Sidebar filters
  const [priceRange, setPriceRange] = useState(500000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);

  // Booking Modal
  const [selectedBookingItem, setSelectedBookingItem] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const response = await getHotels();
        const responseData = response?.data?.data;
        const apiHotels: HotelApi[] = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
          ? responseData.data
          : [];

        // Sort hotels so the latest inserted card appears first (newest to oldest):
        const sortedApiHotels = [...apiHotels].sort((a: any, b: any) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;

          if (timeA && timeB && timeA !== timeB) {
            return timeB - timeA;
          }

          const idA = Number(a.id) || 0;
          const idB = Number(b.id) || 0;
          return idB - idA;
        });

        if (!cancelled) {
          setHotels(sortedApiHotels.map(mapApiHotelToHotel));
        }
      } catch (error) {
        console.error("Failed to load hotels:", error);
        if (!cancelled) {
          setHotels([]);
          setLoadError("Unable to load hotels. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchHotels();
    return () => {
      cancelled = true;
    };
  }, []);

  const getHotelPriceNPR = (hotel: Hotel): number =>
    Number(hotel.lowestPriceNPR ?? hotel.priceNPR ?? 0);

  const hotelKeywords = useMemo(() => {
    const defaultKeywords = [
      "KATHMANDU",
      "POKHARA",
      "CHITWAN",
      "NAGARKOT",
      "LUMBINI",
      "HERITAGE",
      "LUXURY",
      "RESORT",
      "SPA",
      "BOUTIQUE",
      "SWIMMING POOL",
      "MOUNTAIN VIEW",
    ];
    const dynamicKeywords = hotels
      .flatMap((hotel) => [
        hotel.city,
        hotel.location,
        ...(hotel.amenities || []),
        ...(hotel.features || []),
        ...(hotel.roomTypes || []),
      ])
      .filter(Boolean)
      .map((item) => String(item).toUpperCase());
    return Array.from(new Set([...defaultKeywords, ...dynamicKeywords])).slice(
      0,
      20
    );
  }, [hotels]);

  // Pre-index hotels for fastest searching results
  const indexedHotels = useMemo(() => {
    return hotels.map((hotel) => {
      const nameLower = (hotel.name || "").toLowerCase().trim();
      const cityLower = (hotel.city || "").toLowerCase().trim();
      const locationLower = (hotel.location || "").toLowerCase().trim();
      const addressLower = ((hotel as any).address || "").toLowerCase().trim();
      const countryLower = ((hotel as any).country || "").toLowerCase().trim();

      const fromYmd = normalizeToYMD(hotel.availableFrom);
      const toYmd = normalizeToYMD(hotel.availableTo);
      const isDomestic = checkIsDomestic(
        hotel,
        countryLower,
        cityLower,
        locationLower
      );

      const priceNpr = getHotelPriceNPR(hotel);
      const ratingRound = Math.round(hotel.rating || 0);
      const badgeStr = (
        hotel.badge ||
        (hotel.isFeatured
          ? "Featured"
          : hotel.rating >= 4.5
          ? "Popular"
          : "Best Value")
      ).toLowerCase();

      const searchableBlob = [
        nameLower,
        cityLower,
        locationLower,
        addressLower,
        hotel.tierLabel?.toLowerCase() || "",
        ...(hotel.amenities || []).map((a) => a.toLowerCase()),
        ...(hotel.features || []).map((f) => f.toLowerCase()),
        ...(hotel.roomTypes || []).map((r) => r.toLowerCase()),
      ].join(" ");

      return {
        hotel,
        nameLower,
        cityLower,
        locationLower,
        addressLower,
        fromYmd,
        toYmd,
        isDomestic,
        priceNpr,
        ratingRound,
        badgeStr,
        searchableBlob,
      };
    });
  }, [hotels]);

  // Fast filtering: combines search bar criteria (filter) + sidebar filters
  const filteredHotels = useMemo(() => {
    const regionFilter = (filter?.region || "all").trim().toLowerCase();
    const locFilter = (filter?.location || "").trim().toLowerCase();
    const nameFilter = (filter?.hotelName || "").trim().toLowerCase();
    const cIn = normalizeToYMD(filter?.checkInDate) || "";
    const cOut = normalizeToYMD(filter?.checkOutDate) || "";

    return indexedHotels
      .filter((item) => {
        // 1. Search Bar: Region (Domestic & International)
        if (regionFilter === "domestic" && !item.isDomestic) return false;
        if (regionFilter === "international" && item.isDomestic) return false;

        // 2. Search Bar: Location
        if (locFilter) {
          const matchLoc =
            item.cityLower.includes(locFilter) ||
            item.locationLower.includes(locFilter) ||
            item.addressLower.includes(locFilter);
          if (!matchLoc) return false;
        }

        // 3. Search Bar: Hotel Name
        if (nameFilter) {
          if (!item.nameLower.includes(nameFilter)) return false;
        }

        // 4 & 5. Search Bar: Checkin and Checkout Date comparison against hotel's Available dates
        // If the checkin date and checkout date is between the available dates then show that cards:
        // checkIn >= availableFrom (available start date is equals or lesser)
        // checkOut <= availableTo (available end date is equals or greater)
        if (cIn || cOut) {
          const { fromYmd, toYmd } = item;
          if (fromYmd && toYmd) {
            if (cIn && cOut) {
              if (cIn < fromYmd || cOut > toYmd) return false;
            } else if (cIn) {
              if (cIn < fromYmd || cIn > toYmd) return false;
            } else if (cOut) {
              if (cOut < fromYmd || cOut > toYmd) return false;
            }
          } else if (fromYmd) {
            if (cIn && cIn < fromYmd) return false;
            if (cOut && cOut < fromYmd) return false;
          } else if (toYmd) {
            if (cIn && cIn > toYmd) return false;
            if (cOut && cOut > toYmd) return false;
          }
        }

        // 6. Sidebar: Price Range
        if (item.priceNpr > 0 && item.priceNpr > priceRange) return false;

        // 7. Sidebar: Rating
        if (selectedRating > 0 && item.ratingRound < selectedRating) return false;

        // 8. Sidebar: Keywords
        if (selectedKeywords.length > 0) {
          const matches = selectedKeywords.some((kw) =>
            item.searchableBlob.includes(kw.toLowerCase())
          );
          if (!matches) return false;
        }

        // 9. Sidebar: Badges / Highlights
        if (selectedBadges.length > 0) {
          const matches = selectedBadges.some((b) =>
            item.badgeStr.includes(b.toLowerCase())
          );
          if (!matches) return false;
        }

        return true;
      })
      .map((item) => item.hotel);
  }, [
    indexedHotels,
    filter,
    priceRange,
    selectedRating,
    selectedKeywords,
    selectedBadges,
  ]);

  const hasActiveSearchBarFilter = Boolean(
    (filter?.region && filter.region !== "all") ||
      filter?.location?.trim() ||
      filter?.hotelName?.trim() ||
      filter?.checkInDate ||
      filter?.checkOutDate
  );

  const isAnyFilterActive = Boolean(
    hasActiveSearchBarFilter ||
      priceRange < 500000 ||
      selectedRating > 0 ||
      selectedKeywords.length > 0 ||
      selectedBadges.length > 0
  );

  const handleClearAllFilters = () => {
    setPriceRange(500000);
    setSelectedRating(0);
    setSelectedKeywords([]);
    setSelectedBadges([]);
    onClearFilter?.();
  };

  const handleBookHotel = (hotel: Hotel) => {
    // ── Auth guard: redirect to login if not logged in ──
    if (!isSessionValid()) {
      clearAuthSession();
      navigate("/login", {
        state: {
          from: "/service/hotel-booking",
          openBooking: true,
        },
      });
      return;
    }

    setSelectedBookingItem({
      id: hotel.backendId || hotel.id,
      hotelId: hotel.backendId || hotel.id,
      title: hotel.name,
      slug: hotel.slug,
      location: hotel.location || hotel.city || "Nepal",
      duration: "Per Night Stay",
      price: String(getHotelPriceNPR(hotel)),
      image: hotel.image,
      gallery: hotel.gallery || [],
      pricingTable: hotel.pricingTable || [],
      features: hotel.features || [],
      amenities: hotel.amenities || [],
      type: "hotel",
      category: "hotel",
    });
    setIsBookingModalOpen(true);
  };

  const handleFullDetails = (hotel: Hotel) => {
    navigate(`/hotel-details/${hotel.backendId || hotel.id}`);
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#E91E63] rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-500 mt-4">
            Loading hotels...
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="py-20 text-center">
        <p className="font-bold text-[#2D1347]">{loadError}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="px-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
              Featured Luxury &amp; Boutique Hotels
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Browse 5-star heritage hotels, lakeside boutique stays, jungle
              safari eco-resorts, and international luxury destinations.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-6">
          <div className="lg:col-span-1">
            <HotelSidebarFilter
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              selectedKeywords={selectedKeywords}
              setSelectedKeywords={setSelectedKeywords}
              customKeywords={hotelKeywords}
              selectedBadges={selectedBadges}
              setSelectedBadges={setSelectedBadges}
              minPrice={0}
              maxPrice={500000}
              step={5000}
            />
          </div>

          <div className="lg:col-span-3">
            <HotelBookingSection
              hotels={filteredHotels}
              onBook={handleBookHotel}
              onDetails={handleFullDetails}
              priceUnit="per night"
              itemsPerPage={12}
              onClearFilter={handleClearAllFilters}
              hasActiveFilter={isAnyFilterActive}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-xs block mb-1">
              VIP TRAVELER ADVANTAGE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Why Book Your Stays with Trip Himalaya?
            </h3>
            <p className="text-gray-300 text-sm mt-2 font-medium">
              We eliminate third-party booking fees and secure direct property
              upgrades that you won't find anywhere else.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                icon: Award,
                title: "Direct B2B Contract Rates",
                desc: "Save 15% to 30% compared to Booking.com, Agoda, and Expedia with zero hidden booking commissions.",
              },
              {
                icon: Coffee,
                title: "Complimentary Breakfast",
                desc: "Daily buffet or American breakfast included in all standard and luxury partner bookings.",
              },
              {
                icon: Car,
                title: "Free Airport Pick-Up",
                desc: "Complimentary private chauffeur transfer from Kathmandu or Pokhara airport for stays of 2+ nights.",
              },
              {
                icon: Clock,
                title: "Early Check-in & Late Out",
                desc: "Priority room readiness for early morning flight arrivals and late afternoon checkouts.",
              },
              {
                icon: ShieldCheck,
                title: "Verified Hygiene Standards",
                desc: "Every partner property is inspected for cleanliness, safety, and traveler comfort.",
              },
              {
                icon: Headphones,
                title: "24/7 Local Assistance",
                desc: "Our Nepal-based travel team remains available throughout your stay for booking support and assistance.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E91E63] flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h4 className="font-black text-sm">{title}</h4>
                <p className="text-gray-300 text-xs leading-relaxed mt-2">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedBookingItem && (
        <HotelBookingModal
          pkg={selectedBookingItem}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          pricingSource="tier"
          initialTierIndex={0}
          initialGuests={1}
        />
      )}
    </>
  );
};

export default HotelBookingDetailContent;