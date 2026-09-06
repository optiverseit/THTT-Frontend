import React, { useState } from "react";
import { vehicles } from "../../assets/data/mockData";
import type { Vehicle } from "../../assets/data/types";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
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
    a: "Yes! All our vehicle rentals include a courteous, government-licensed professional chauffeur with extensive experience in Nepal's mountain highways. Chauffeur daily salary, meals, and overnight lodging allowance are 100% included with no hidden extras.",
  },
  {
    q: "Are fuel, road tolls, and parking charges covered in the rate?",
    a: "Yes. All our fixed-route quotes and per-day rental rates include fuel, highway road taxes, municipality permits, and hotel/airport parking charges.",
  },
  {
    q: "Can we make spontaneous photo or food stops along the route?",
    a: "Absolutely! Since this is a private rental, you have total control over the pace. You can stop at scenic viewpoints, suspension bridges, riverside cafes, and fruit markets whenever you wish.",
  },
  {
    q: "What happens if a vehicle experiences a mechanical breakdown?",
    a: "We maintain a nationwide 24/7 breakdown assistance network. In the unlikely event of any issue, our operations team will dispatch a replacement vehicle immediately to ensure your travel schedule is uninterrupted.",
  },
  {
    q: "Can I rent a self-drive car without a driver in Nepal?",
    a: "Due to road conditions, steep mountain passes, and local regulations in Nepal, we strongly recommend and exclusively provide chauffeur-driven vehicles to guarantee maximum safety, smooth navigation, and zero liability for damages.",
  },
];

export const VehicleRentalDetailContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { selectedCurrency, nprPerOneDollar } = useGlobalCurrency();

  // Booking Modal State
  const [selectedBookingItem, setSelectedBookingItem] = useState<BookingItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Quick route form state
  const [pickupCity, setPickupCity] = useState("Kathmandu (Airport / Hotel)");
  const [dropCity, setDropCity] = useState("Pokhara (Lakeside)");
  const [vehicleType, setVehicleType] = useState("All Categories");

  const formatPrice = (usdAmount: number) => {
    const nprAmount = usdAmount * nprPerOneDollar;
    return displayPrice(nprAmount, selectedCurrency, nprPerOneDollar);
  };

  // 100% Dynamically sourced and filtered from mockData
  const filteredFleet = vehicles.filter((vehicle) => {
    if (activeTab !== "all" && vehicle.category !== activeTab) return false;
    return true;
  });

  const handleInquiry = (vehicleName: string, priceUSD: number) => {
    const priceFormatted = formatPrice(priceUSD);
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I would like to inquire about renting the "${vehicleName}" (${priceFormatted}/day). Please confirm availability, driver details, and route pricing.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handleBookVehicle = (v: Vehicle) => {
    setSelectedBookingItem({
      id: v.id,
      title: v.name,
      location: `Capacity: ${v.seats}`,
      duration: "Chauffeur Rental (Per Day / Trip)",
      price: `$${v.pricePerDayUSD}`,
      image: v.image,
    });
    setIsBookingModalOpen(true);
  };

  const handleQuickRouteQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I would like to book a private vehicle rental. ` +
        `Pickup: ${pickupCity} -> Destination: ${dropCity}. ` +
        `Vehicle: ${vehicleType}. ` +
        `Please share the exact all-inclusive fare and booking confirmation.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-12">
      {/* ── 1. VALUE PILLARS & STATS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Car, label: "50+ Fleet Vehicles", desc: "4x4 SUVs, Sedans & Vans", color: "text-[#E11D48] bg-pink-50" },
          { icon: ShieldCheck, label: "Chauffeur Included", desc: "Mountain-Licensed Drivers", color: "text-purple-600 bg-purple-50" },
          { icon: Fuel, label: "All-Inclusive Pricing", desc: "Fuel, Tolls & Parking Covered", color: "text-emerald-600 bg-emerald-50" },
          { icon: Zap, label: "24/7 Rapid Replacement", desc: "Zero Downtime Guarantee", color: "text-amber-500 bg-amber-50" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${stat.color}`}>
                <Icon size={22} />
              </div>
              <h4 className="font-extrabold text-[#2D1347] text-sm leading-tight">{stat.label}</h4>
              <p className="text-gray-500 text-xs mt-1 font-medium">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* ── 2. QUICK ROUTE FARE CALCULATOR ── */}
      <div className="bg-gradient-to-r from-[#200B3B] via-[#2D1347] to-[#3B145C] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl mb-6">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-xs block mb-1">
            DIRECT ROUTE BOOKING
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Reserve Private Chauffeur Transport Across Nepal
          </h3>
          <p className="text-gray-300 text-xs mt-1 font-medium">
            Door-to-door hotel pickups with zero hidden fuel surcharges or driver meal costs.
          </p>
        </div>

        <form onSubmit={handleQuickRouteQuote} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Pickup */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <label className="block text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1">
              Pickup Point
            </label>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-pink-400 flex-shrink-0" />
              <input
                type="text"
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                placeholder="Kathmandu / Airport"
                className="w-full bg-transparent text-white font-bold text-xs outline-none"
              />
            </div>
          </div>

          {/* Destination */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <label className="block text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1">
              Destination / Route
            </label>
            <div className="flex items-center gap-2">
              <Compass size={15} className="text-pink-400 flex-shrink-0" />
              <input
                type="text"
                value={dropCity}
                onChange={(e) => setDropCity(e.target.value)}
                placeholder="Pokhara / Chitwan / Nagarkot"
                className="w-full bg-transparent text-white font-bold text-xs outline-none"
              />
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <label className="block text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1">
              Vehicle Model
            </label>
            <div className="flex items-center gap-2">
              <Car size={15} className="text-pink-400 flex-shrink-0" />
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-xs outline-none cursor-pointer [&>option]:text-gray-800"
              >
                <option>Scorpio 4x4 SUV (4-6 Seats)</option>
                <option>Toyota Prado VIP (Luxury 5 Seats)</option>
                <option>Toyota HiAce Van (12-14 Seats)</option>
                <option>Comfort Sedan (3-4 Seats)</option>
                <option>Tourist Coaster (20-22 Seats)</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full h-full min-h-[46px] bg-[#E11D48] hover:bg-[#BE123C] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search size={15} />
              <span>CHECK EXACT FARE</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── 3. FLEET VEHICLES CATALOG GRID ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-xs block mb-1">
              OUR VERIFIED FLEET
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
              Comfort &amp; 4WD Vehicles with Driver
            </h3>
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
                    : "bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-[#E11D48]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFleet.map((v) => (
            <div
              key={v.id}
              className="bg-[#FBFBFE] rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#2D1347] text-white shadow-md">
                      {v.categoryLabel}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Users size={13} className="text-pink-400" />
                    <span>{v.seats}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-lg sm:text-xl font-black text-[#2D1347] leading-snug">
                      {v.name}
                    </h4>
                    <div className="text-right flex-shrink-0">
                      <span className="font-extrabold text-sm text-[#E11D48] whitespace-nowrap bg-pink-50 px-2.5 py-1 rounded-xl block">
                        {formatPrice(v.pricePerDayUSD)}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">per day / full trip</span>
                    </div>
                  </div>

                  {/* Best For Tag */}
                  <div className="p-2.5 rounded-xl bg-purple-50 text-[#2D1347] text-xs font-bold mb-4 flex items-center gap-2 border border-purple-100/70">
                    <Sparkles size={14} className="text-[#E11D48] flex-shrink-0" />
                    <span className="truncate">Best for: {v.bestFor}</span>
                  </div>

                  {/* Capacity pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200/80 text-[11px] font-bold text-gray-700 flex items-center gap-1">
                      <Users size={12} className="text-[#E11D48]" />
                      {v.seats}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200/80 text-[11px] font-bold text-gray-700 flex items-center gap-1">
                      <Luggage size={12} className="text-[#E11D48]" />
                      {v.luggage}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 mb-2">
                    {v.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                        <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between gap-2.5 mt-auto">
                <button
                  type="button"
                  onClick={() => handleInquiry(v.name, v.pricePerDayUSD)}
                  className="flex-1 bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-pink-900/20 whitespace-nowrap"
                >
                  <MessageCircle size={15} />
                  <span>Inquiry</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBookVehicle(v)}
                  className="flex-1 bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <CalendarCheck size={14} className="text-pink-400" />
                  <span>Book Now</span>
                </button>
              </div>
            </div>
          ))}
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
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-[#E11D48]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4.5 pb-4 text-xs sm:text-[12.5px] text-gray-600 font-medium leading-relaxed bg-gray-50/50 border-t border-gray-100 pt-2.5">
                    {faq.a}
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
