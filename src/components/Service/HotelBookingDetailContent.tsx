import React, { useState } from "react";
import { hotels } from "../../assets/data/mockData";
import type { Hotel, Package } from "../../assets/data/types";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import FilterSideBar from "../TravelPackage/FilterSiderBar";
import PackageDetailsSection from "../TravelPackage/PackageDetailsSection";
import BookingModal, { BookingItem } from "../reuseable/packages/BookingModal";
import DynamicFaqSection from "../reusable/DynamicFaqSection";
import {
  Star,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Coffee,
  Car,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Award,
  Search,
  Calendar,
  Users,
  Building2,
  HeartHandshake,
  Clock,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";

const HOTEL_FAQS = [
  {
    q: "Can Trip Himalaya guarantee lower hotel rates than online booking sites?",
    a: "Yes. Because we maintain direct, high-volume contracted agreements with over 500+ partner hotels and heritage properties across Nepal, our rates are consistently 15% to 30% lower than major online booking portals with free perks included.",
  },
  {
    q: "What complimentary benefits are included with hotel bookings through your agency?",
    a: "Depending on the hotel tier, our clients receive complimentary airport/helipad pick-up, free buffet breakfast, flexible early check-in or late check-out, room category upgrades upon availability, and 24/7 concierge assistance.",
  },
  {
    q: "Do you arrange teahouse and mountain lodge bookings for trekking routes?",
    a: "Yes! During peak seasons in Everest, Annapurna, and Langtang, we pre-reserve the highest standard heated rooms in premium teahouses (such as Yeti Mountain Home and high-altitude luxury lodges) with attached bathrooms and warm blankets.",
  },
  {
    q: "What is your cancellation and date modification policy?",
    a: "Most of our standard hotel reservations offer free cancellation up to 48 hours prior to check-in. For emergency weather delays or flight cancellations in mountain regions, we adjust your reservation dates with zero penalty fees.",
  },
  {
    q: "How does the reservation and confirmation voucher process work?",
    a: "Simply select your preferred hotel or destination, submit your dates through our quick form or WhatsApp, and we will send a confirmed hotel booking voucher with QR code and confirmation number immediately.",
  },
];


export const HotelBookingDetailContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  const [selectedBookingItem, setSelectedBookingItem] = useState<BookingItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const formatPrice = (usdAmount: number) => {
    const nprAmount = usdAmount * nprPerOneDollar;
    return displayPrice(nprAmount, selectedCurrency, nprPerOneDollar, nprPerOneINR);
  };

  const hotelKeywords = [
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

  // Convert hotels into standard Package format for consistent card rendering
  const hotelPackages: Package[] = hotels.map((h) => ({
    id: h.id,
    title: h.name,
    slug: h.slug,
    duration: "Per Night Stay",
    highlights: h.amenities || h.features || [],
    price: `$${h.priceUSD}`,
    image: h.image,
    category: "domestic",
    type: "activity",
    isFeatured: Boolean(h.isFeatured),
    description:
      h.description ||
      `${h.tierLabel} in ${h.location || h.city}. Handcrafted comfort, premium hospitality, and verified contract rates.`,
    location: h.location || h.city,
    rating: h.rating,
    reviewsCount: h.reviewsCount,
    tierLabel: h.tierLabel,
    priceUnit: "per night",
  } as any));

  const filteredHotels = hotelPackages.filter((pkg) => {
    const rawHotel = hotels.find((h) => h.id === pkg.id);

    // 1. Category Tab Filter
    if (activeTab !== "all" && rawHotel?.category !== activeTab) return false;

    // 2. Price Range Filter
    const priceNum = Number(pkg.price?.replace(/[^0-9]/g, "") || 0);
    const matchesPrice = priceNum === 0 || priceNum <= priceRange;

    // 3. Ratings Filter
    const matchesRating = selectedRating === 0 || Math.round(pkg.rating || 5) >= selectedRating;

    // 4. Keywords Filter
    const matchesKeywords =
      selectedKeywords.length === 0
        ? true
        : selectedKeywords.some((keyword) => {
            const kw = keyword.toLowerCase();
            return (
              pkg.title?.toLowerCase().includes(kw) ||
              pkg.location?.toLowerCase().includes(kw) ||
              rawHotel?.tierLabel?.toLowerCase().includes(kw) ||
              rawHotel?.amenities?.some((a) => a.toLowerCase().includes(kw)) ||
              rawHotel?.features?.some((f) => f.toLowerCase().includes(kw))
            );
          });

    return matchesPrice && matchesRating && matchesKeywords;
  });

  const handleBookHotel = (pkg: Package) => {
    setSelectedBookingItem({
      id: pkg.id,
      title: pkg.title,
      location: pkg.location || "Nepal",
      duration: "Per Night Stay",
      price: pkg.price || "$0",
      image: pkg.image,
    });
    setIsBookingModalOpen(true);
  };

  const handleFullDetails = (pkg: Package) => {
    const priceStr = pkg.price || "$0";
    const baseUSD = Number(priceStr.replace(/[^0-9]/g, "") || 0);
    const priceFormatted = formatPrice(baseUSD);
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! Please share full details, room photos, amenities, and policies for "${pkg.title}" in ${pkg.location} (${priceFormatted}/night).`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-12">

      {/* ── HEADER & FILTER PILLS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
            Featured Luxury &amp; Boutique Hotels
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Browse 5-star heritage hotels, lakeside boutique stays, jungle safari eco-resorts, and mountain lodges.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: `All Stays (${hotels.length})` },
            { id: "luxury", label: "5-Star Heritage" },
            { id: "boutique", label: "Lakeside Boutique" },
            { id: "resort", label: "Safari & Resorts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#2D1347] text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200/80 hover:bg-pink-50 hover:border-pink-300 hover:text-[#E11D48] shadow-2xs"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT: SIDEBAR + PACKAGES LIST (EXACTLY SAME AS PACKAGES PAGE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left: Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterSideBar
            setPriceRange={setPriceRange}
            priceRange={priceRange}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            customKeywords={hotelKeywords}
          />
        </div>

        {/* Right: Package Details Cards */}
        <div className="lg:col-span-3">
          <PackageDetailsSection
            pkgs={filteredHotels}
            onBook={handleBookHotel}
            onDetails={handleFullDetails}
            priceUnit="per night"
            itemsPerPage={12}
          />
        </div>
      </div>

      {/* ── 4. WHAT'S INCLUDED IN OUR HOTEL CONCIERGE ── */}
      <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="max-w-3xl mb-8">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-xs block mb-1">
            VIP TRAVELER ADVANTAGE
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Why Book Your Stays with Trip Himalaya?
          </h3>
          <p className="text-gray-300 text-sm mt-2 font-medium">
            We eliminate third-party booking fees and secure direct property upgrades that you won't find anywhere else.
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
              desc: "Every property is personally inspected for cleanliness, bedding quality, hot water, and safety.",
            },
            {
              icon: HeartHandshake,
              title: "24/7 On-Trip Concierge",
              desc: "Any room change requests, special dietary needs, or extra bed additions handled instantly on WhatsApp.",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
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

      {/* ── 5. TOP HOTEL DESTINATIONS IN NEPAL ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-xs block mb-1">
          POPULAR DESTINATIONS
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight mb-6">
          Curated Stays Across Nepal's Top Hubs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              hub: "Kathmandu & Patan",
              tag: "Culture & Heritage",
              color: "bg-purple-100 text-purple-800",
              desc: "Historic boutique palaces in Thamel, Durbar Square courtyards, and international 5-star chains.",
            },
            {
              hub: "Pokhara Lakeside",
              tag: "Scenic & Relaxation",
              color: "bg-blue-100 text-blue-800",
              desc: "Lakeside resorts with Phewa Lake infinity pools, Sarangkot mountain ridge viewpoints, and spa villas.",
            },
            {
              hub: "Chitwan & Bardia",
              tag: "Jungle Wildlife",
              color: "bg-emerald-100 text-emerald-800",
              desc: "Tharu eco-lodges, riverside elephant safari decks, and luxury air-conditioned jungle tent resorts.",
            },
            {
              hub: "Nagarkot & Dhulikhel",
              tag: "Himalayan Sunrise",
              color: "bg-amber-100 text-amber-800",
              desc: "Panoramic hill station resorts with private balconies overlooking Everest and Langtang snow peaks.",
            },
          ].map((dest, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#FBFBFE] border border-gray-200/80">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-block mb-2 ${dest.color}`}>
                {dest.tag}
              </span>
              <h4 className="font-black text-[#2D1347] text-sm mb-2">{dest.hub}</h4>
              <p className="text-gray-600 text-xs leading-relaxed font-medium">{dest.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. HOTEL BOOKING FAQS ── */}
      {/* ── 5. HOTEL FAQS ── */}
      <DynamicFaqSection
        targetType="service"
        targetId="hotel-booking"
        defaultFaqs={HOTEL_FAQS}
        title="Hotel & Resort Booking FAQ"
        subtitle="Common questions answered by our reservation specialists"
      />

      {/* ── BOOKING MODAL POPUP ── */}
      <BookingModal
        pkg={selectedBookingItem}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default HotelBookingDetailContent;
