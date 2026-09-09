import React, { useState } from "react";
import { hotels } from "../../assets/data/mockData";
import type { Hotel } from "../../assets/data/types";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
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
import BookingModal, { BookingItem } from "../reuseable/packages/BookingModal";

const HOTEL_FAQS = [
  {
    q: "Can Trip Himalaya guarantee lower hotel rates than online booking sites?",
    qNp: "के ट्रिप हिमालयले अनलाइन बुकिङ साइटभन्दा सस्तो होटल दरको गारन्टी दिन सक्नुहुन्छ?",
    a: "Yes. Because we maintain direct, high-volume contracted agreements with over 500+ partner hotels and heritage properties across Nepal, our rates are consistently 15% to 30% lower than major online booking portals with free perks included.",
    aNp: "हो। नेपालभरि ५००+ साझेदार होटल र हेरिटेज सम्पत्तिसंग सिधा उच्च-मात्रा करारदारी समझौता कायम राखेकाले हाम्रा दरहरू बडा अनलाइन बुकिङ पोर्टलभन्दा १५% देखि ३०% सस्तो हुन् — मुफ्त सुविधाहरू समेत।",
  },
  {
    q: "What complimentary benefits are included with hotel bookings through your agency?",
    qNp: "तपाईंको एजेन्सीमार्फत होटल बुकिङ गरदा कुन मुफ्त सुविधाहरू समावेश छन्?",
    a: "Depending on the hotel tier, our clients receive complimentary airport/helipad pick-up, free buffet breakfast, flexible early check-in or late check-out, room category upgrades upon availability, and 24/7 concierge assistance.",
    aNp: "होटल श्रेणी अनुसार, हाम्रा ग्राहकहरूले मुफ्त एयरपोर्ट/हेलिप्याड पिकअप, मुफ्त बुफे ब्रेकफास्ट, लचिला अर्ली चेक-इन वा लेट चेक-आउट, उपलब्धताअनुसार कोठा श्रेणी अपग्रेड, र २४/७ कन्सियर्ज सहायता पाउनुहुन्छ।",
  },
  {
    q: "Do you arrange teahouse and mountain lodge bookings for trekking routes?",
    qNp: "के तपाईंले ट्रेकिङ मार्गहरूको लागि टीहाउस र पहाडी लज बुकिङ व्यवस्था गर्नुहुन्छ?",
    a: "Yes! During peak seasons in Everest, Annapurna, and Langtang, we pre-reserve the highest standard heated rooms in premium teahouses (such as Yeti Mountain Home and high-altitude luxury lodges) with attached bathrooms and warm blankets.",
    aNp: "हो! एभरेस्ट, अन्नपूर्ण, र लाङ्ताङमा पीक सिजनमा, हामी प्रिमियम टीहाउसहरूमा (जस्तै Yeti Mountain Home) संलग्न बाथरुम र न्यानो कम्बलसहितका उच्चतम स्तरका गरम कोठाहरू अग्रिम आरक्षण गरिन्छ।",
  },
  {
    q: "What is your cancellation and date modification policy?",
    qNp: "तपाईंको रद्दीकरण र मिति परिवर्तन नीति के हो?",
    a: "Most of our standard hotel reservations offer free cancellation up to 48 hours prior to check-in. For emergency weather delays or flight cancellations in mountain regions, we adjust your reservation dates with zero penalty fees.",
    aNp: "हाम्रा अधिकांश स्तरीय होटल आरक्षणहरूले चेक-इनसम्म ४८ घन्टाअघि मुफ्त रद्दीकरण इजाजत दिन्छ। आपतकालीन मौसम विलम्ब वा उडान रद्दी भएमा, हामी शून्य जरिमानासह तपाईंको आरक्षण मिति परिवर्तन गर्छौं।",
  },
  {
    q: "How do we book a hotel room and confirm the voucher?",
    qNp: "हामी होटल कोठा कसरी बुक गर्ने र भाउचर कसरी पुष्टि गर्ने?",
    a: "Simply select your preferred hotel or destination, submit your dates through our quick form or WhatsApp, and we will send a confirmed hotel booking voucher with QR code and confirmation number immediately.",
    aNp: "आफनो मनपर्ने होटल वा गन्तव्य छनोट गर्नुहोस्, हाम्रो क्विक फर्म वा WhatsApp मार्यत तारिख पठाउनुहोस्, र हामी तुरिन्तै QR कोड र पुष्टि नम्बरसहित पुष्टिकृत होटल बुकिङ भाउचर पठाउँछौं।",
  },
];


export const HotelBookingDetailContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  // Search box state
  const [searchCity, setSearchCity] = useState("All Destinations");
  const [checkIn, setCheckIn] = useState("");
  const [roomType, setRoomType] = useState("Deluxe Room (1-2 Guests)");

  const [selectedBookingItem, setSelectedBookingItem] = useState<BookingItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const formatPrice = (usdAmount: number) => {
    const nprAmount = usdAmount * nprPerOneDollar;
    return displayPrice(nprAmount, selectedCurrency, nprPerOneDollar, nprPerOneINR);
  };

  // 100% Dynamically sourced and filtered from mockData
  const filteredHotels = hotels.filter((hotel) => {
    if (activeTab !== "all" && hotel.category !== activeTab) return false;
    if (searchCity !== "All Destinations") {
      const cityLower = searchCity.toLowerCase();
      const hotelCityLower = (hotel.city + " " + hotel.location).toLowerCase();
      if (!hotelCityLower.includes(cityLower.replace(" valley", "").replace(" lakeside", "").replace(" national park", "").replace(" sacred garden", "").replace(" mountain lodges", ""))) {
        return false;
      }
    }
    return true;
  });

  const visibleHotels = filteredHotels.slice(0, visibleCount);
  const hasMore = visibleCount < filteredHotels.length;

  const handleInquiry = (hotelName: string, priceUSD: number) => {
    const priceFormatted = formatPrice(priceUSD);
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I would like to inquire about "${hotelName}" (${priceFormatted}/night). Please share room availability, inclusions, and best rates.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handleBookHotel = (hotel: Hotel) => {
    setSelectedBookingItem({
      id: hotel.id,
      title: hotel.name,
      location: hotel.location || hotel.city,
      duration: "Per Night Stay",
      price: `$${hotel.priceUSD}`,
      image: hotel.image,
    });
    setIsBookingModalOpen(true);
  };

  const handleFullDetails = (hotel: Hotel) => {
    const priceFormatted = formatPrice(hotel.priceUSD);
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! Please share full details, room photos, amenities, and policies for "${hotel.name}" in ${hotel.location || hotel.city} (${priceFormatted}/night).`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I am looking for hotel booking in ${searchCity}. ` +
        (checkIn ? `Preferred Date: ${checkIn}. ` : "") +
        `Room type: ${roomType}. Please share available hotels and discounted quotes.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-12">
      {/* ── 1. VALUE PILLARS & STATS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Building2, label: "500+ Partner Hotels", desc: "Heritage & 5-Star Luxury", color: "text-[#E11D48] bg-pink-50" },
          { icon: Award, label: "Best Rate Guarantee", desc: "Up to 30% Below OTAs", color: "text-purple-600 bg-purple-50" },
          { icon: ShieldCheck, label: "Free Cancellation", desc: "Flexible Date Changes", color: "text-emerald-600 bg-emerald-50" },
          { icon: HeartHandshake, label: "VIP Perks Included", desc: "Free Breakfast & Airport Pickup", color: "text-amber-500 bg-amber-50" },
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

      {/* ── 2. QUICK HOTEL SEARCH / RESERVATION BAR ── */}
      <div className="bg-gradient-to-r from-[#200B3B] via-[#2D1347] to-[#3B145C] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl mb-6">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-xs block mb-1">
            INSTANT HOTEL CONCIERGE
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Find &amp; Reserve Verified Stays at Contract Rates
          </h3>
          <p className="text-gray-300 text-xs mt-1 font-medium">
            Get instant room availability, free cancellation vouchers, and complimentary breakfast.
          </p>
        </div>

        <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* City */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <label className="block text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1">
              Destination City
            </label>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-pink-400 flex-shrink-0" />
              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-xs outline-none cursor-pointer [&>option]:text-gray-800"
              >
                <option>All Destinations</option>
                <option>Kathmandu Valley</option>
                <option>Pokhara Lakeside</option>
                <option>Chitwan National Park</option>
                <option>Nagarkot / Dhulikhel</option>
                <option>Lumbini Sacred Garden</option>
                <option>Everest Mountain Lodges</option>
                <option>International (Dubai / Bali)</option>
              </select>
            </div>
          </div>

          {/* Check In */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <label className="block text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1">
              Check-In Date
            </label>
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-pink-400 flex-shrink-0" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Room Type */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <label className="block text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1">
              Room &amp; Guests
            </label>
            <div className="flex items-center gap-2">
              <Users size={15} className="text-pink-400 flex-shrink-0" />
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-xs outline-none cursor-pointer [&>option]:text-gray-800"
              >
                <option>Deluxe Room (1-2 Guests)</option>
                <option>Executive Suite (2-3 Guests)</option>
                <option>Family Cottage (4-5 Guests)</option>
                <option>Heritage Royal Villa (Luxury)</option>
                <option>Trekking Teahouse Room</option>
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
              <span>SEARCH RATES</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── 3. FEATURED HOTELS CATALOG GRID ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-xs block mb-1">
              PRE-VERIFIED STAYS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
              Featured Luxury &amp; Boutique Hotels
            </h3>
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
                    : "bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-[#E11D48]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-[#FBFBFE] rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#E11D48] text-white shadow-md">
                      {hotel.tierLabel}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span>{hotel.rating.toFixed(1)} ({hotel.reviewsCount}+)</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-lg sm:text-xl font-black text-[#2D1347] leading-snug">
                      {hotel.name}
                    </h4>
                    <div className="text-right flex-shrink-0">
                      <span className="font-extrabold text-sm text-[#E11D48] whitespace-nowrap bg-pink-50 px-2.5 py-1 rounded-xl block">
                        {formatPrice(hotel.priceUSD)}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">per night</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-4">
                    <MapPin size={14} className="text-[#E11D48] flex-shrink-0" />
                    <span className="truncate">{hotel.city}</span>
                  </div>

                  {/* Amenities badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hotel.amenities.slice(0, 4).map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-white border border-gray-200/80 text-[11px] font-bold text-gray-700 shadow-2xs"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 mb-2">
                    {hotel.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                        <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions - Format as in Image 5 */}
              <div className="p-6 pt-0 border-t border-gray-100 mt-auto space-y-2.5">
                {/* Row 1: Inquiry First (Dark Blue), Book Now (Pink) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleInquiry(hotel.name, hotel.priceUSD)}
                    className="bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                    title="WhatsApp Inquiry"
                  >
                    <MessageCircle size={14} className="text-pink-400" />
                    <span>Inquiry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBookHotel(hotel)}
                    className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-900/20 cursor-pointer whitespace-nowrap"
                  >
                    <CalendarCheck size={14} />
                    <span>Book Now</span>
                  </button>
                </div>

                {/* Row 2: Full Details Centered */}
                <button
                  type="button"
                  onClick={() => handleFullDetails(hotel)}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#2D1347] text-[#2D1347] hover:text-[#E11D48] font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Full Details</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount(prev => prev + 15)}
              className="px-10 py-3.5 bg-[#2D1347] hover:bg-[#3B145C] text-white font-bold text-sm rounded-2xl flex items-center gap-2.5 transition-all shadow-lg cursor-pointer"
            >
              <span>See More</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        )}
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
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pink-50 text-[#E11D48]">
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              Hotel &amp; Resort Booking FAQ
            </h3>
            <p className="text-xs text-gray-500 font-medium">Common questions answered by our reservation specialists</p>
          </div>
        </div>

        <div className="space-y-3">
          {HOTEL_FAQS.map((faq, index) => {
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

export default HotelBookingDetailContent;
