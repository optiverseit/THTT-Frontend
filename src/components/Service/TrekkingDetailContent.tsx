import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { packages } from "../../assets/data/mockData";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import {
  Mountain,
  Clock,
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
  Utensils,
  Backpack,
  Sparkles,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  MapPin,
  Activity,
  Layers,
  Star,
} from "lucide-react";

const TREK_FAQS = [
  {
    q: "How difficult is Himalayan trekking and what fitness level is needed?",
    a: "Trekking routes range from Moderate (Poon Hill, Mardi Himal — 4-5 hours walking daily) to Challenging (EBC, Manaslu — 6-7 hours daily with steep ascents). Regular cardiovascular exercise (jogging, stair climbing, hiking) 4-6 weeks prior to arrival is strongly recommended.",
  },
  {
    q: "What measures are taken to prevent and treat Altitude Sickness (AMS)?",
    a: "We design carefully paced itineraries with mandatory acclimatization days. Our guides carry pulse oximeters to test blood oxygen saturation every morning and evening. They are certified in mountain first aid and carry Diamox, oxygen kits, and 24/7 Heli-evacuation coordinates.",
  },
  {
    q: "What is the teahouse lodge accommodation and food like?",
    a: "Teahouses are cozy mountain lodges offering twin-bed private rooms with warm blankets. Meals are freshly cooked and hygienic: famous Dal Bhat (lentil soup with rice, vegetable curry, pickle), noodles, momos, porridge, eggs, pasta, and hot tea/coffee.",
  },
  {
    q: "What permits are required and who arranges them?",
    a: "All permits — including TIMS cards, Sagarmatha National Park, Annapurna Conservation Area (ACAP), Manaslu Restricted Area permits, and local rural municipality fees — are 100% arranged by Trip Himalaya prior to your trek departure.",
  },
  {
    q: "What is the luggage weight limit for porters on the trek?",
    a: "Each porter carries the luggage of two trekkers (up to 12kg – 15kg per person) in waterproof duffle bags provided by us. You only carry a lightweight daypack (5-6kg) with your water, jacket, camera, and personal valuables.",
  },
];

export const TrekkingDetailContent: React.FC = () => {
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
  const trekPackages = packages.filter((p) => p.type === "trek");

  const filteredTreks = trekPackages.filter((pkg) => {
    if (activeTab === "all") return true;
    const titleLower = pkg.title.toLowerCase();
    const locLower = (pkg.location || "").toLowerCase();
    if (activeTab === "everest") return titleLower.includes("everest") || titleLower.includes("ebc") || locLower.includes("solukhumbu");
    if (activeTab === "annapurna") return titleLower.includes("annapurna") || titleLower.includes("abc") || titleLower.includes("poon") || titleLower.includes("mardi");
    if (activeTab === "langtang") return titleLower.includes("langtang") || titleLower.includes("gosaikunda");
    if (activeTab === "remote") return titleLower.includes("mustang") || titleLower.includes("manaslu") || titleLower.includes("dolpo") || titleLower.includes("kanchenjunga");
    if (activeTab === "featured") return pkg.isFeatured;
    return true;
  });

  const handleInquiry = (trekTitle: string, priceStr?: string) => {
    const formattedPrice = formatPackagePrice(priceStr);
    const priceText = formattedPrice ? ` (${formattedPrice})` : "";
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I am interested in trekking the "${trekTitle}"${priceText}. Please share the day-by-day itinerary, dates, and package price.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case "Moderate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Hard":
      case "Strenuous":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Challenging":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Extreme":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <div className="space-y-12">
      {/* ── 1. VALUE PILLARS & STATS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Mountain, label: `${trekPackages.length}+ Epic Trails`, desc: "Everest, Annapurna & Beyond", color: "text-[#E11D48] bg-pink-50" },
          { icon: HeartPulse, label: "Daily Oximeter Checks", desc: "Altitude Safety First", color: "text-emerald-600 bg-emerald-50" },
          { icon: ShieldCheck, label: "Licensed Sherpas", desc: "Native Mountain Experts", color: "text-purple-600 bg-purple-50" },
          { icon: Sparkles, label: "24/7 Heli Standby", desc: "Emergency Medical Rescue", color: "text-amber-500 bg-amber-50" },
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

      {/* ── 2. DYNAMIC TREK CIRCUITS ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-xs block mb-1">
              LEGENDARY TRAILS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
              Himalayan Trekking Expeditions
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: `All Treks (${trekPackages.length})` },
              { id: "everest", label: "Everest Region" },
              { id: "annapurna", label: "Annapurna Region" },
              { id: "langtang", label: "Langtang" },
              { id: "remote", label: "Mustang & Manaslu" },
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

        {/* Dynamic Treks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTreks.map((trek) => (
            <div
              key={trek.id}
              className="bg-[#FBFBFE] rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image, Badge & Timing */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                  <img
                    src={trek.image}
                    alt={trek.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#E11D48] text-white shadow-md">
                      {trek.category === "domestic" ? "Himalayan Trek" : "Trek"}
                    </span>
                    {trek.difficulty && (
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase border shadow-sm ${getDifficultyColor(trek.difficulty)}`}>
                        {trek.difficulty}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
                    <Clock size={13} className="text-pink-400" />
                    <span>{trek.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-lg sm:text-xl font-black text-[#2D1347] leading-snug">
                      {trek.title}
                    </h4>
                    {trek.price && (
                      <span className="font-extrabold text-sm text-[#E11D48] whitespace-nowrap bg-pink-50 px-2.5 py-1 rounded-xl">
                        {formatPackagePrice(trek.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-gray-500 mb-4">
                    {trek.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-[#E11D48]" />
                        <span>{trek.location}</span>
                      </div>
                    )}
                    {trek.rating && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={13} className="fill-amber-500" />
                        <span className="font-bold text-gray-700">{trek.rating} ({trek.reviewsCount || 5} reviews)</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-6">
                    {trek.highlights && trek.highlights.slice(0, 3).map((hl, i) => (
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
                  onClick={() => handleInquiry(trek.title, trek.price)}
                  className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-pink-900/20"
                >
                  <MessageCircle size={15} />
                  <span>Book This Trek</span>
                </button>
                <button
                  onClick={() => navigate(`/details/${trek.id}`)}
                  className="px-4 py-3 bg-white border border-gray-200 hover:border-[#2D1347] text-[#2D1347] hover:text-[#E11D48] font-bold text-xs rounded-2xl transition-all cursor-pointer whitespace-nowrap"
                >
                  Full Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. SAFETY, ACCLIMATIZATION & MEDICAL READINESS ── */}
      <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="max-w-3xl mb-8">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-xs block mb-1">
            UNCOMPROMISING MOUNTAIN SAFETY
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            How We Safeguard Your Himalayan Ascent
          </h3>
          <p className="text-gray-300 text-sm mt-2 font-medium">
            Trekking above 3,500 meters requires methodical planning. Our certified medical protocols ensure you stay strong, healthy, and acclimatized throughout your trek.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            {
              icon: HeartPulse,
              title: "Daily Oximeter Checks",
              desc: "Lead guide monitors pulse rate and blood oxygen levels every morning and evening to catch altitude symptoms early.",
            },
            {
              icon: Layers,
              title: "Built-in Acclimatization",
              desc: "Paced itineraries following the 'Climb High, Sleep Low' philosophy to allow your body natural altitude adaptation.",
            },
            {
              icon: ShieldCheck,
              title: "Certified Sherpa Guides",
              desc: "Born and raised in the mountains with Wilderness First Aid certification, government licensing, and decades on the trail.",
            },
            {
              icon: Utensils,
              title: "Nutritious Full-Board Meals",
              desc: "High-energy hygienic mountain meals (Dal Bhat, garlic soups, pasta, fresh eggs) and boiled drinking water.",
            },
            {
              icon: Activity,
              title: "Emergency Heli Standby",
              desc: "Direct satellite communication link for rapid medical helicopter evacuations covered under your travel insurance.",
            },
            {
              icon: Backpack,
              title: "Porters & Duffle Bags Provided",
              desc: "High-altitude porters carry main luggage (up to 12kg) so you only trek with a light comfortable daypack.",
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

      {/* ── 4. PACKING & GEAR CHECKLIST ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-xs block mb-1">
          GEAR RECOMMENDATIONS
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight mb-6">
          Trekker's Packing Essentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: "Layering & Outerwear",
              items: ["Waterproof Gore-Tex Jacket", "Down Jacket (-10°C to -20°C)", "Thermal base layers (Top & Bottom)", "Fleece mid-layer sweater"],
            },
            {
              title: "Footwear & Socks",
              items: ["Broken-in trekking boots", "Camp shoes / sandals", "4-5 pairs merino wool socks", "Gaiters (for snowy passes)"],
            },
            {
              title: "Trail Accessories",
              items: ["Adjustable trekking poles", "UV400 Glacier sunglasses", "Headlamp with spare batteries", "Water purification tablets"],
            },
            {
              title: "Personal Medical Kit",
              items: ["Diamox (Acetazolamide)", "Blister band-aids & tape", "Lip balm & high SPF sunscreen", "Electrolyte hydration salts"],
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

      {/* ── 5. CURATED TREKKING FAQS ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pink-50 text-[#E11D48]">
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              Himalayan Trekking FAQ
            </h3>
            <p className="text-xs text-gray-500 font-medium">Frequently asked questions about trails, permits, and lodges</p>
          </div>
        </div>

        <div className="space-y-3">
          {TREK_FAQS.map((faq, index) => {
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

export default TrekkingDetailContent;
