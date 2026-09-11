import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { packages } from "../../assets/data/mockData";
import type { Package } from "../../assets/data/types";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import BookingModal from "../reuseable/packages/BookingModal";
import FilterSideBar from "../TravelPackage/FilterSiderBar";
import PackageDetailsSection from "../TravelPackage/PackageDetailsSection";
import {
  Wind,
  ShieldCheck,
  Zap,
  Clock,
  MapPin,
  CheckCircle2,
  Video,
  Gauge,
  Sparkles,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  AlertCircle,
  Flame,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";

const ACTIVITY_FAQS = [
  {
    q: "Do I need prior experience to do Paragliding or Bungee jumping?",
    qNp: "के प्याराग्लाइडिङ वा बन्जी जम्पिङ गर्नका लागि पूर्व अनुभव आवश्यक पर्छ?",
    a: "No prior experience is necessary! All our flights and jumps are conducted as tandem flights or under the direct supervision of internationally certified master instructors who manage the launch, flight, and landing.",
    aNp: "कुनै पूर्व अनुभव आवश्यक पर्दैन! हाम्रा सबै उडान र जम्पहरू टेन्डम उडानको रूपमा वा अन्तर्राष्ट्रिय रूपमा प्रमाणित मास्टर इन्स्ट्रक्टरहरूको प्रत्यक्ष रेखदेखमा गरिन्छ जसले टेक-अफ, उडान, र अवतरण व्यवस्थापन गर्छन्।",
  },
  {
    q: "Are photos and videos included in adventure activities?",
    qNp: "के साहसिक गतिविधिहरूमा फोटो र भिडियोहरू समावेश छन्?",
    a: "Yes! High-definition GoPro photos, wide-angle videos, and drone clips (where permitted) are either included or available with on-the-spot mobile transfer immediately after your session.",
    aNp: "हो! हाइ-डेफिनिसन गोप्रो फोटो, वाइड-एंगल भिडियो, र ड्रोन क्लिपहरू (अनुमति भएको ठाउँमा) समावेश छन् वा तपाईंको सत्र तुरुन्तै सकिएपछि घटनास्थलमै मोबाइल ट्रान्सफरमार्फत उपलब्ध गराइन्छ।",
  },
  {
    q: "What are the weight and age requirements for extreme activities?",
    qNp: "साहसिक गतिविधिहरूका लागि तौल र उमेरका आवश्यकताहरू के हुन्?",
    a: "For Paragliding: Weight 35kg to 105kg. For Bungee/Canyon Swing: Weight 40kg to 110kg and minimum age 12-16 years. Guests under 18 require signed parental/guardian consent.",
    aNp: "प्याराग्लाइडिङका लागि: तौल ३५ देखि १०५ केजी। बन्जी/क्यान्यन स्विङका लागि: तौल ४० देखि ११० केजी र न्यूनतम उमेर १२–१६ वर्ष। १८ वर्ष मुनिका पाहुनाहरूका लागि अभिभावकको लिखित सहमति आवश्यक पर्छ।",
  },
  {
    q: "What happens if an activity is cancelled due to adverse weather?",
    qNp: "प्रतिकूल मौसमका कारण गतिविधि रद्द भएमा के हुन्छ?",
    a: "Safety is our #1 priority. If weather (rain, excessive wind, or fog) forces a cancellation, we either reschedule for the next clear slot or issue a 100% immediate refund.",
    aNp: "सुरक्षा हाम्रो पहिलो प्राथमिकता हो। यदि मौसम (पानी, अत्यधिक हावा, वा बाक्लो कुहिरो) का कारण गतिविधि रद्द गर्नुपरेमा, हामी अर्को सफा समयमा सार्छौं वा १००% तत्काल फिर्ता गर्छौं।",
  },
  {
    q: "What safety gear and certifications do you maintain?",
    qNp: "तपाईंहरू कस्तो सुरक्षा उपकरण र प्रमाणीकरण मापदण्ड अपनाउनुहुन्छ?",
    a: "We only partner with APPI, UIAGM, and IRF certified operators utilizing European CE/UIAA certified harnesses, backup emergency reserve parachutes, and daily tension-checked cables.",
    aNp: "हामी केवल APPI, UIAGM, र IRF प्रमाणित अपरेटरहरूसँग साझेदारी गर्दछौं जसले युरोपेली CE/UIAA प्रमाणित हार्नेस, ब्याकअप आपतकालीन प्यारासुट, र दैनिक तनाव-जाँच गरिएका डोरी/केबलहरू प्रयोग गर्छन्।",
  },
];

export const ActivitiesDetailContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const navigate = useNavigate();
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const [selectedBookingActivity, setSelectedBookingActivity] = useState<Package | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // 100% Dynamically sourced from packages data
  const activityPackages = packages.filter(
    (p) => p.type === "activity" || p.type === "combo" || p.adventureCategory
  );

  const adventureKeywords = [
    "PARAGLIDING",
    "BUNGEE",
    "RAFTING",
    "ZIPFLYER",
    "CANYONING",
    "POKHARA",
    "KUSHMA",
    "SARANGKOT",
    "ADVENTURE",
    "HIGH THRILL",
    "TANDEM",
    "COMBO",
  ];

  const filteredActivities = activityPackages.filter((pkg) => {
    // 1. Category Tab Filter
    if (activeTab === "Air" && pkg.adventureCategory !== "Air") return false;
    if (activeTab === "Water" && pkg.adventureCategory !== "Water") return false;
    if (activeTab === "Land" && pkg.adventureCategory !== "Land") return false;
    if (activeTab === "combo" && pkg.type !== "combo") return false;

    // 2. Price Range Filter
    const priceNum = Number(pkg.price?.replace(/[^0-9]/g, "") || 0);
    const matchesPrice = priceNum === 0 || priceNum <= priceRange;

    // 3. Ratings Filter
    const pkgRating =
      pkg.rating !== undefined
        ? pkg.rating
        : pkg.testimonies && pkg.testimonies.length > 0
        ? pkg.testimonies[0].rating
        : 5;
    const matchesRating = selectedRating === 0 || Math.round(pkgRating) >= selectedRating;

    // 4. Keywords Filter
    const matchesKeywords =
      selectedKeywords.length === 0
        ? true
        : selectedKeywords.some((keyword) => {
            const kw = keyword.toLowerCase();
            return (
              pkg.title?.toLowerCase().includes(kw) ||
              pkg.location?.toLowerCase().includes(kw) ||
              pkg.adventureCategory?.toLowerCase().includes(kw) ||
              pkg.highlights?.some((hl) => hl.toLowerCase().includes(kw))
            );
          });

    return matchesPrice && matchesRating && matchesKeywords;
  });

  const handleBookActivity = (pkg: Package) => {
    setSelectedBookingActivity(pkg);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-12">

      {/* ── HEADER & FILTER PILLS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
            Featured Adventure Activities &amp; Combos
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Browse adrenaline experiences, aerial flights, whitewater runs, and multi-activity combos.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: `All Activities (${activityPackages.length})` },
            { id: "Air", label: "Aerial Thrills" },
            { id: "Water", label: "River Rapids" },
            { id: "Land", label: "Gravity & Land" },
            { id: "combo", label: "Multi-Activity Combos" },
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
            customKeywords={adventureKeywords}
          />
        </div>

        {/* Right: Package Details Cards */}
        <div className="lg:col-span-3">
          <PackageDetailsSection
            pkgs={filteredActivities}
            onBook={handleBookActivity}
            itemsPerPage={12}
          />
        </div>
      </div>

      {/* ── 3. SAFETY FIRST PROTOCOLS ── */}
      <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="max-w-3xl mb-8">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-xs block mb-1">
            SAFETY &amp; CERTIFICATION
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            How We Protect You On Every Jump, Flight &amp; Rapid
          </h3>
          <p className="text-gray-300 text-sm mt-2 font-medium">
            We adhere to the highest international adventure tourism safety codes with certified instructors, double-checked equipment, and daily inspections.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            {
              icon: ShieldCheck,
              title: "Certified Instructors",
              desc: "APPI, UIAGM, and IRF certified pilots, jump masters, and river guides with 10+ years experience.",
            },
            {
              icon: Gauge,
              title: "CE/UIAA Certified Gear",
              desc: "All carabiners, harnesses, cords, and lifejackets meet strict European and international safety codes.",
            },
            {
              icon: Wind,
              title: "Weather Telemetry",
              desc: "Real-time wind-speed and thermal monitoring before every launch or flight to ensure safe flight windows.",
            },
            {
              icon: Video,
              title: "Full 4K Action Footage",
              desc: "High-definition GoPro video and photography included so you take home unforgettable memories.",
            },
            {
              icon: AlertCircle,
              title: "Pre-Jump Medical Check",
              desc: "Brief health screenings and weight calibrations before high-altitude bungee and canyon swings.",
            },
            {
              icon: Sparkles,
              title: "100% Free Reschedule",
              desc: "Flexible weather-guarantee policy: full refund or zero-fee rebooking if flights are rained out.",
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

      {/* ── 4. WHAT TO BRING & PACKING GUIDE ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-xs block mb-1">
          ESSENTIAL CHECKLIST
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight mb-6">
          What to Wear &amp; Bring for Adventure Sports
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: "Footwear",
              items: ["Lace-up athletic shoes", "Tied sandals for rafting", "No flip-flops on jumps"],
            },
            {
              title: "Clothing",
              items: ["Comfortable active wear", "Windbreaker jacket", "Quick-dry shorts for river"],
            },
            {
              title: "Accessories",
              items: ["Sunglasses with strap", "Sunscreen (SPF 50+)", "Waterproof phone pouch"],
            },
            {
              title: "Documents",
              items: ["Passport / ID Copy", "Travel Insurance policy", "Signed consent form"],
            },
          ].map((cat, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#FBFBFE] border border-gray-200/80">
              <h4 className="font-extrabold text-[#2D1347] text-sm mb-3 pb-2 border-b border-gray-200">{cat.title}</h4>
              <ul className="space-y-2">
                {cat.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. CURATED ACTIVITIES FAQS ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pink-50 text-[#E11D48]">
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              Adventure Activities FAQ
            </h3>
            <p className="text-xs text-gray-500 font-medium">Clear answers on safety, slots, and requirements</p>
          </div>
        </div>

        <div className="space-y-3">
          {ACTIVITY_FAQS.map((faq, index) => {
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
        pkg={selectedBookingActivity}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default ActivitiesDetailContent;
