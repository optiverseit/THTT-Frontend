import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { packages } from "../../assets/data/mockData";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import {
  Compass,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  Camera,
  Car,
  Hotel,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Globe,
  Star,
} from "lucide-react";

const TOUR_FAQS = [
  {
    q: "Can our holiday tour itinerary be completely customized?",
    a: "Yes! Every tour package can be customized to match your schedule, preferred hotel category (from budget to 5-star heritage resorts), private vehicle choice, and specific sightseeing interests.",
  },
  {
    q: "What is included in the private transport during tours?",
    a: "We provide clean, air-conditioned private vehicles (Sedans, Scorpio 4x4 SUVs, Toyota Hiace vans, or luxury tourist coasters) with experienced, courteous chauffeurs covering all fuel, toll, and parking fees.",
  },
  {
    q: "Are monument entry fees and government permits covered?",
    a: "In all our full-board packages, entrance fees to UNESCO Heritage monuments, National Park entry tickets, and local permits are organized and included in advance so you can skip queues.",
  },
  {
    q: "Do you offer multi-lingual professional tour guides?",
    a: "Yes, our certified government-licensed tour guides speak English, Hindi, Nepali, French, German, Spanish, Japanese, and Chinese upon request for guided city excursions.",
  },
  {
    q: "How do we confirm our booking and what payment options are accepted?",
    a: "You can reserve your tour with a 20% advance deposit via bank transfer, eSewa, Khalti, or credit card. The balance can be paid prior to departure or upon arrival in Kathmandu.",
  },
];

export const ToursDetailContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const navigate = useNavigate();
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  const formatPackagePrice = (priceStr?: string) => {
    if (!priceStr) return null;
    const numericUSD = Number(priceStr.replace(/[^0-9]/g, "") || 0);
    if (numericUSD > 0) {
      const nprAmount = numericUSD * nprPerOneDollar;
      return displayPrice(nprAmount, selectedCurrency, nprPerOneDollar, nprPerOneINR);
    }
    return priceStr;
  };

  // 100% Dynamically sourced from packages data
  const tourPackages = packages.filter((p) => p.type === "tour");

  const filteredTours = tourPackages.filter((pkg) => {
    if (activeTab === "all") return true;
    if (activeTab === "domestic") return pkg.category === "domestic";
    if (activeTab === "international") return pkg.category === "international";
    if (activeTab === "featured") return pkg.isFeatured;
    return true;
  });

  const handleInquiry = (tourTitle: string, priceStr?: string) => {
    const formattedPrice = formatPackagePrice(priceStr);
    const priceText = formattedPrice ? ` (${formattedPrice})` : "";
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I am interested in booking the "${tourTitle}"${priceText}. Please share details, day-by-day itinerary, and pricing.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-12">
      {/* ── 1. VALUE PILLARS & STATS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Compass, label: `${tourPackages.length}+ Curated Tours`, desc: "Nepal & International", color: "text-[#E11D48] bg-pink-50" },
          { icon: Sparkles, label: "100% Tailor-Made", desc: "Customized for you", color: "text-purple-600 bg-purple-50" },
          { icon: ShieldCheck, label: "Govt Certified Guides", desc: "Multilingual Experts", color: "text-emerald-600 bg-emerald-50" },
          { icon: Star, label: "4.9/5 Rating", desc: "Trusted by 5,000+ Guests", color: "text-amber-500 bg-amber-50" },
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

      {/* ── 2. DYNAMIC TOUR PACKAGES GRID ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-xs block mb-1">
              CURATED TOUR PACKAGES
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
              Featured Holiday Itineraries
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: `All Tours (${tourPackages.length})` },
              { id: "domestic", label: "Domestic Nepal" },
              { id: "international", label: "International Holidays" },
              { id: "featured", label: "Top Featured" },
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

        {/* Dynamic Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-[#FBFBFE] rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#E11D48] text-white shadow-md">
                      {tour.category === "international" ? "International" : "Domestic Tour"}
                    </span>
                    {tour.isFeatured && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-md">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
                    <Clock size={13} className="text-pink-400" />
                    <span>{tour.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-lg sm:text-xl font-black text-[#2D1347] leading-snug">
                      {tour.title}
                    </h4>
                    {tour.price && (
                      <span className="font-extrabold text-sm text-[#E11D48] whitespace-nowrap bg-pink-50 px-2.5 py-1 rounded-xl">
                        {formatPackagePrice(tour.price)}
                      </span>
                    )}
                  </div>

                  {tour.location && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-4">
                      <MapPin size={14} className="text-[#E11D48] flex-shrink-0" />
                      <span className="truncate">{tour.location}</span>
                    </div>
                  )}

                  <div className="space-y-2 mb-6">
                    {tour.highlights && tour.highlights.slice(0, 3).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between gap-3 mt-auto">
                <button
                  onClick={() => handleInquiry(tour.title, tour.price)}
                  className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-pink-900/20"
                >
                  <MessageCircle size={15} />
                  <span>Inquire Now</span>
                </button>
                <button
                  onClick={() => navigate(`/details/${tour.id}`)}
                  className="px-4 py-3 bg-white border border-gray-200 hover:border-[#2D1347] text-[#2D1347] hover:text-[#E11D48] font-bold text-xs rounded-2xl transition-all cursor-pointer whitespace-nowrap"
                >
                  Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. WHAT'S INCLUDED IN OUR TOURS ── */}
      <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="max-w-3xl mb-8">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-xs block mb-1">
            PREMIUM EXPERIENCE GUARANTEE
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            What's Included in Every Holiday Tour
          </h3>
          <p className="text-gray-300 text-sm mt-2 font-medium">
            From seamless luxury transfers to certified native guides, we take care of all logistics so you travel stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            {
              icon: Car,
              title: "Private AC Vehicles",
              desc: "Dedicated chauffeur with all fuel, toll & parking charges included throughout the tour.",
            },
            {
              icon: Hotel,
              title: "Handpicked Stays",
              desc: "Carefully vetted 3-Star, 4-Star or 5-Star boutique hotels with delicious daily breakfast.",
            },
            {
              icon: Award,
              title: "Licensed Tour Guides",
              desc: "Experienced government-certified multi-lingual guides for all historical and cultural sites.",
            },
            {
              icon: Globe,
              title: "Permits & Entry Passes",
              desc: "All UNESCO monument entry tickets, national park permits, and local taxes fully covered.",
            },
            {
              icon: ShieldCheck,
              title: "24/7 Concierge Support",
              desc: "Dedicated tour manager on WhatsApp and call for real-time guidance and assistance.",
            },
            {
              icon: Camera,
              title: "Special Experience Stops",
              desc: "Sunset viewpoints, cultural culinary tastings, and scenic photography pauses.",
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

      {/* ── 4. SEASONAL GUIDE & BEST TIME TO VISIT ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-xs block mb-1">
          TRIP PLANNING INSIGHTS
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight mb-6">
          Best Season for Nepal Holiday Tours
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              season: "Autumn (Sep – Nov)",
              badge: "Peak Season",
              badgeColor: "bg-emerald-100 text-emerald-800",
              desc: "Crisp blue skies, panoramic mountain vistas, festive atmosphere with Dashain and Tihar celebrations.",
            },
            {
              season: "Spring (Mar – May)",
              badge: "Best Flowers & Weather",
              badgeColor: "bg-pink-100 text-pink-800",
              desc: "Pleasant temperatures, blooming rhododendron hillsides, excellent wildlife viewing in Chitwan & Bardia.",
            },
            {
              season: "Winter (Dec – Feb)",
              badge: "Clear Mountain Skies",
              badgeColor: "bg-blue-100 text-blue-800",
              desc: "Sunny daytime in Kathmandu and Pokhara valleys, crystal clear snow peaks, fewer crowds.",
            },
            {
              season: "Monsoon (Jun – Aug)",
              badge: "Lush & Off-Season",
              badgeColor: "bg-amber-100 text-amber-800",
              desc: "Lush terraced hills, vibrant waterfalls, ideal for Upper Mustang and cultural temple tours.",
            },
          ].map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#FBFBFE] border border-gray-200/80">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-block mb-2 ${s.badgeColor}`}>
                {s.badge}
              </span>
              <h4 className="font-black text-[#2D1347] text-sm mb-2">{s.season}</h4>
              <p className="text-gray-600 text-xs leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. CURATED TOURS FAQS ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pink-50 text-[#E11D48]">
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              Tours &amp; Holiday FAQ
            </h3>
            <p className="text-xs text-gray-500 font-medium">Common questions answered by our holiday specialists</p>
          </div>
        </div>

        <div className="space-y-3">
          {TOUR_FAQS.map((faq, index) => {
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
    </div>
  );
};

export default ToursDetailContent;
