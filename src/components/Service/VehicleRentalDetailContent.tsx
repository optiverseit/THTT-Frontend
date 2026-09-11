import React, { useState } from "react";
import { vehicles } from "../../assets/data/mockData";
import type { Vehicle, Package } from "../../assets/data/types";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import FilterSideBar from "../TravelPackage/FilterSiderBar";
import PackageDetailsSection from "../TravelPackage/PackageDetailsSection";
import {
  Car,
  Users,
  Luggage,
  Fuel,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  Compass,
  Zap,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";
import BookingModal, { BookingItem } from "../reuseable/packages/BookingModal";

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

const VEHICLE_FAQS = [
  {
    q: "Is a professional chauffeur included in the rental price?",
    qNp: "के भाडा मूल्यमा पेशेवर चालक समावेश छ?",
    a: "Yes! All our vehicle rentals include a courteous, government-licensed professional chauffeur with extensive experience in Nepal's mountain highways. Chauffeur daily salary, meals, and overnight lodging allowance are 100% included with no hidden extras.",
    aNp: "हो! हाम्रा सबै सवारीसाधन भाडामा नेपालका पहाडी राजमार्गमा व्यापक अनुभव भएका सरकार-लाइसेन्सप्राप्त पेशेवर चालक समावेश हुन्छ। चालकको दैनिक तलब, खाना, र राति बसाइको भत्ता १००% समावेश छ — कुनै लुकावाटो शुल्क छैन।",
  },
  {
    q: "Are fuel, road tolls, and driver allowances included in the price?",
    qNp: "के इन्धन, सडक दस्तुर, र चालक भत्ता मूल्यमा समावेश छन्?",
    a: "Yes, 100%! All our quoted rental rates are completely all-inclusive: vehicle rental, experienced mountain chauffeur, all fuel costs, interstate highway tolls, parking charges, and complete driver lodging/meals.",
    aNp: "हो, १००%! हाम्रा सबै उद्धृत भाडा दरहरू पूर्ण रूपमा सबै-समावेशी छन्: सवारी साधन, अनुभवी पहाडी चालक, सबै इन्धन खर्च, राजमार्ग कर, पार्किङ शुल्क, र चालकको सम्पूर्ण खाना/बसोबास।",
  },
  {
    q: "Can I rent a vehicle for self-drive in Nepal without a driver?",
    qNp: "के मैले नेपालमा चालक बिना स्वयं-चालन कार भाडामा लिन सक्छु?",
    a: "Due to road conditions, steep mountain passes, and local regulations in Nepal, we strongly recommend and exclusively provide chauffeur-driven vehicles to guarantee maximum safety, smooth navigation, and zero liability for damages.",
    aNp: "नेपालको सडक अवस्था, खडा पहाडी घाटी, र स्थानीय नियमहरूका कारणले, हामी उच्चतम सुरक्षा, सहज नाभिकरण, र क्षतिको शून्य दायित्व सुनिश्चित गर्न चालक-चालित सवारी मात्र प्रदान गर्छौं।",
  },
];

export const VehicleRentalDetailContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  // Booking Modal State
  const [selectedBookingItem, setSelectedBookingItem] = useState<BookingItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const formatPrice = (usdAmount: number) => {
    const nprAmount = usdAmount * nprPerOneDollar;
    return displayPrice(nprAmount, selectedCurrency, nprPerOneDollar, nprPerOneINR);
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
    "MUKTINATH",
  ];

  // Convert vehicles into standard Package format for consistent card rendering
  const vehiclePackages: Package[] = vehicles.map((v) => ({
    id: v.id,
    title: v.name,
    slug: v.slug,
    duration: `Capacity: ${v.seats}`,
    highlights: v.amenities || v.features || [],
    price: `$${v.pricePerDayUSD}`,
    image: v.image,
    category: "domestic",
    type: "activity",
    isFeatured: Boolean(v.isFeatured),
    description:
      v.description ||
      `${v.categoryLabel} with ${v.seats} passenger capacity, air conditioning, and experienced mountain chauffeur service.`,
    location: v.bestFor || "All Nepal Routes",
    rating: 5,
    categoryLabel: v.categoryLabel,
    priceUnit: "per day / trip",
  } as any));

  const filteredFleet = vehiclePackages.filter((pkg) => {
    const rawVehicle = vehicles.find((v) => v.id === pkg.id);

    // 1. Category Tab Filter
    if (activeTab !== "all" && rawVehicle?.category !== activeTab) return false;

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
              rawVehicle?.categoryLabel?.toLowerCase().includes(kw) ||
              rawVehicle?.seats?.toLowerCase().includes(kw) ||
              rawVehicle?.bestFor?.toLowerCase().includes(kw) ||
              rawVehicle?.amenities?.some((a) => a.toLowerCase().includes(kw)) ||
              rawVehicle?.features?.some((f) => f.toLowerCase().includes(kw))
            );
          });

    return matchesPrice && matchesRating && matchesKeywords;
  });

  const handleBookVehicle = (pkg: Package) => {
    const rawVehicle = vehicles.find((v) => v.id === pkg.id);
    setSelectedBookingItem({
      id: pkg.id,
      title: pkg.title,
      location: `Capacity: ${rawVehicle?.seats || pkg.duration}`,
      duration: "Chauffeur Rental (Per Day / Trip)",
      price: pkg.price || "$0",
      image: pkg.image,
    });
    setIsBookingModalOpen(true);
  };

  const handleFullDetails = (pkg: Package) => {
    const rawVehicle = vehicles.find((v) => v.id === pkg.id);
    const priceStr = pkg.price || "$0";
    const baseUSD = Number(priceStr.replace(/[^0-9]/g, "") || 0);
    const priceFormatted = formatPrice(baseUSD);
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! Please share full vehicle specifications, luggage capacity, photos, and all-inclusive rental terms for "${pkg.title}" (${rawVehicle?.categoryLabel || "Rental"}) at ${priceFormatted}/day.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-12">

      {/* ── HEADER & FILTER PILLS ── */}
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
            customKeywords={vehicleKeywords}
          />
        </div>

        {/* Right: Package Details Cards */}
        <div className="lg:col-span-3">
          <PackageDetailsSection
            pkgs={filteredFleet}
            onBook={handleBookVehicle}
            onDetails={handleFullDetails}
            priceUnit="per day / trip"
            itemsPerPage={12}
          />
        </div>
      </div>

      {/* ── 4. POPULAR ROUTES & FIXED ALL-INCLUSIVE RATES ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-xs block mb-1">
          FIXED HIGHWAY FARES
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight mb-6">
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
                    <strong className="text-[#2D1347] block font-extrabold">{route.route}</strong>
                    <span className="text-[11px] text-gray-500 font-medium">Stops: {route.stops}</span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-gray-600 whitespace-nowrap">{route.distance}</td>
                  <td className="py-3.5 px-3 font-bold text-purple-900">{route.popularVehicle}</td>
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

      {/* ── 5. FLEET VEHICLE FAQS ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pink-50 text-[#E11D48]">
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              Vehicle Rental FAQ
            </h3>
            <p className="text-xs text-gray-500 font-medium">Important details regarding chauffeur services and highway routes</p>
          </div>
        </div>

        <div className="space-y-3">
          {VEHICLE_FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-3.5 font-bold text-xs sm:text-[13px] text-[#2D1347] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5">
                    <span>{faq.q}</span>
                    <span className="text-[11px] font-medium text-gray-400">{faq.qNp}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-[#E11D48]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4.5 pb-4 bg-gray-50/50 border-t border-gray-100 pt-2.5 space-y-2">
                    <p className="text-xs sm:text-[12.5px] text-gray-600 font-medium leading-relaxed">{faq.a}</p>
                    <p className="text-xs sm:text-[12px] text-gray-400 font-medium leading-relaxed border-t border-gray-100 pt-2">{faq.aNp}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOOKING MODAL POPUP ── */}
      <BookingModal
        pkg={selectedBookingItem}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default VehicleRentalDetailContent;
