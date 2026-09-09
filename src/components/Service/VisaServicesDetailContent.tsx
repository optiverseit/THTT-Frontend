import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  Shield,
  Clock,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ChevronDown,
  HelpCircle,
  Zap,
  Globe2,
  Search,
} from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";

interface VisaPlan {
  id: string;
  country: string;
  countryCode: string;
  region: "all" | "middle-east" | "asia" | "europe" | "west";
  visaType: string;
  duration: string;
  processingTime: string;
  baseNPRPrice: number;
  entryType: string;
  inclusions: string[];
  popular?: boolean;
}

const VISA_PLANS: VisaPlan[] = [
  {
    id: "uae-30",
    country: "UAE (Dubai / Abu Dhabi)",
    countryCode: "AE",
    region: "middle-east",
    visaType: "Tourist Visa",
    duration: "30 Days Stay",
    processingTime: "3 – 4 Working Days",
    baseNPRPrice: 14500,
    entryType: "Single Entry",
    inclusions: [
      "100% Online Paperless Filing",
      "Embassy Application Fee Assistance",
      "Confirmed Return Flight Ticket Dummy",
      "24/7 Processing Support",
    ],
    popular: true,
  },
  {
    id: "thailand-60",
    country: "Thailand",
    countryCode: "TH",
    region: "asia",
    visaType: "Tourist Visa",
    duration: "60 Days Stay",
    processingTime: "3 – 5 Working Days",
    baseNPRPrice: 8500,
    entryType: "Single Entry",
    inclusions: [
      "Royal Thai Embassy Submission",
      "Hotel Voucher & Flight Itinerary",
      "Document Verification & Stamp Tracking",
      "Expert Guidance for Visa on Arrival",
    ],
    popular: true,
  },
  {
    id: "schengen-tourist",
    country: "Schengen (Europe)",
    countryCode: "EU",
    region: "europe",
    visaType: "Visitor / Tourist Visa (Type C)",
    duration: "Up to 90 Days",
    processingTime: "10 – 15 Working Days",
    baseNPRPrice: 18500,
    entryType: "Single / Multiple Entry",
    inclusions: [
      "VFS Global Appointment Scheduling",
      "Embassy-Compliant Travel Insurance Aid",
      "Comprehensive Cover Letter & Day-by-Day Itinerary",
      "Financial Document & Sponsor Dossier Review",
    ],
    popular: true,
  },
  {
    id: "singapore-30",
    country: "Singapore",
    countryCode: "SG",
    region: "asia",
    visaType: "e-Visa / Entry Visa",
    duration: "30 Days Stay",
    processingTime: "3 – 5 Working Days",
    baseNPRPrice: 9200,
    entryType: "Multiple Entry",
    inclusions: [
      "ICA Singapore Authorized Submission",
      "LOI (Letter of Introduction) Guidance",
      "Digital e-Visa Issuance",
      "Full Documentation Counseling",
    ],
  },
  {
    id: "japan-tourist",
    country: "Japan",
    countryCode: "JP",
    region: "asia",
    visaType: "Short-Term Tourist Visa",
    duration: "15 – 30 Days",
    processingTime: "5 – 7 Working Days",
    baseNPRPrice: 12000,
    entryType: "Single Entry",
    inclusions: [
      "Embassy of Japan Kathmandu Submission",
      "Daily Schedule of Stay (Keikakusho) Drafting",
      "Confirmed Hotel & Flight Itineraries",
      "Tax & Bank Certificate Vetting",
    ],
  },
  {
    id: "uk-visitor",
    country: "United Kingdom",
    countryCode: "GB",
    region: "west",
    visaType: "Standard Visitor Visa",
    duration: "6 Months",
    processingTime: "15 Working Days",
    baseNPRPrice: 19500,
    entryType: "Multiple Entry",
    inclusions: [
      "UKVI Online Application Management",
      "VFS Global Kathmandu Biometrics Booking",
      "Financial Statement & Ties to Nepal Audit",
      "Detailed Travel Purpose Statement",
    ],
  },
  {
    id: "usa-b1b2",
    country: "United States (USA)",
    countryCode: "US",
    region: "west",
    visaType: "B1/B2 Tourist & Business",
    duration: "Up to 5 Years",
    processingTime: "Appointment Dependent",
    baseNPRPrice: 17000,
    entryType: "Multiple Entry",
    inclusions: [
      "DS-160 Form Accurate Filing & Review",
      "US Embassy Kathmandu Slot Monitoring",
      "1-on-1 Mock Interview Preparation Session",
      "Document Packaging & Checklist",
    ],
  },
  {
    id: "malaysia-evisa",
    country: "Malaysia",
    countryCode: "MY",
    region: "asia",
    visaType: "Tourist e-Visa",
    duration: "30 Days Stay",
    processingTime: "2 – 4 Working Days",
    baseNPRPrice: 7800,
    entryType: "Single Entry",
    inclusions: [
      "Direct Malaysia eVisa Portal Filing",
      "Confirmed Hotel & Return Flight Proof",
      "High Approval Rate Guarantee",
      "Instant Electronic Delivery via WhatsApp",
    ],
  },
];

const VISA_FAQS = [
  {
    q: "What documents are generally required for international tourist visas from Nepal?",
    qNp: "नेपालबाट अन्तर्राष्ट्रिय पर्यटक भिसाको लागि साधारणतया कुन कागजातहरू चाहिन्छन्?",
    a: "Most embassies require: (1) Original passport with at least 6 months validity, (2) Recent biometric photos as per embassy specs, (3) 6-month bank statements with sufficient funds and bank balance certificate, (4) Relationship/citizenship certificates, (5) Confirmed return flight and hotel vouchers, and (6) Leave/employment letters or business tax clearance. Trip Himalaya assists in preparing and verifying every document.",
    aNp: "अधिकांश दूतावासहरूले माग्ने: (१) कमसेकम ६ महिना म्याद रहेको मूल राहदानी, (२) हालिया बायोमेट्रिक फोटो, (३) ६-महिनाको ब्यांक बिबरण र ब्यांक ब्यालेन्स प्रमाणपत्र, (४) नाता/नागरिकता प्रमाणपत्र, (५) पुष्टि भएको फिर्ता उडान र होटल भाउचर, (६) छुट्टी/रोजगार पत्र वा कर चुक्ता प्रमाणपत्र। ट्रिप हिमालयले सबै कागजात तयारी र पुष्टीमा सहयोग गर्छ।",
  },
  {
    q: "Do you guarantee visa approval?",
    qNp: "के तपाईंहरूले भिसा अनुमोदनको गारन्टी दिनुहुन्छ?",
    a: "Visa granting is strictly the sovereign right of the respective embassy or consulate. However, Trip Himalaya maintains a 98%+ success rate by thoroughly reviewing your application, eliminating discrepancies, structuring your financial evidence correctly, and preparing tailored cover letters that satisfy embassy guidelines.",
    aNp: "भिसा प्रदान गर्नु सम्बन्धित दूतावास वा कन्सुलेटको सार्वभौम अधिकार हो। तथापि, ट्रिप हिमालयले तपाईंको आवेदन ध्यानपूर्वक समीक्षा, त्रुटि निवारण, सही ठेगान वित्तीय प्रमाण र दूतावास निर्देशिका पूरा गर्ने कभर लेटर तयार गरेर ८९%+ सफलता दर कायम राख्छ।",
  },
  {
    q: "How early should I apply for my visa before my travel date?",
    qNp: "यात्रा तारिखभन्दा कति अघि भिसाको लागि आवेदन गर्नुपर्छ?",
    a: "We recommend applying at least 3–4 weeks prior to your intended departure for Asian destinations (UAE, Thailand, Malaysia, Singapore), and at least 6–8 weeks in advance for European Schengen, UK, US, or Australian visas to secure convenient biometrics appointments.",
    aNp: "एसियाली गन्तव्यहरू (UAE, थाइल्याण्ड, मलेसिया, सिङ्गापुर) को लागि कमसेकम ३-४ हप्ता अगाडि र युरोपीय Schengen, UK, US, वा अस्ट्रेलियाली भिसाको लागि कमसेकम ६-८ हप्ता अगाडि आवेदन गर्न सिफारिस गरिन्छ।",
  },
  {
    q: "Can I apply for a visa online without visiting your office?",
    qNp: "के तपाईंको कार्यालय नगईकन अनलाइनमा भिसाको लागि आवेदन गर्न सकिन्छ?",
    a: "Yes! For e-Visas (such as Dubai/UAE, Malaysia, and Singapore), you can send your scanned passport and photo via WhatsApp or Email. We handle the complete filing, payment, and deliver your approved visa electronically.",
    aNp: "हो! इ-भिसाहरूको लागि (जस्तै दुबई/UAE, मलेसिया, र सिङ्गापुर), तपाईंले WhatsApp वा Email मार्फत स्क्यान गरिएको राहदानी र फोटो पठाउन सक्नुहुन्छ। हामी सम्पूर्ण दाखिला, भुक्तानी र अनुमोदित भिसा इलेक्ट्रोनिक रूपमा पठाउने काम गर्छौं।",
  },
];


export const VisaServicesDetailContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  const filteredPlans = VISA_PLANS.filter((plan) => {
    if (activeTab !== "all" && plan.region !== activeTab) return false;
    if (searchQuery && !plan.country.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleWhatsAppInquiry = (plan: VisaPlan) => {
    const formattedPrice = displayPrice(
      plan.baseNPRPrice,
      selectedCurrency,
      nprPerOneDollar,
      nprPerOneINR
    );
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I would like to inquire about visa assistance for "${plan.country}" (${plan.visaType}, fee starting around ${formattedPrice}). Please guide me with requirements and next steps.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-10">

      {/* ── 1. OVERVIEW BANNER ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <span className="text-[#E91E63] font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
          INTERNATIONAL VISA COUNSELING &amp; PROCESSING
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight mb-4">
          Hassle-Free Visa Solutions for Nepali &amp; Global Travelers
        </h2>
        <p className="text-gray-600 text-base leading-relaxed font-medium">
          Navigating foreign embassy requirements, appointment backlogs, and strict financial documentation can be daunting.
          Trip Himalaya provides end-to-end visa counseling, official appointment booking, and certified dossier preparation
          for tourist, family, and business travel worldwide.
        </p>

        {/* Highlight Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Visas Approved", value: "98.4%", icon: Shield },
            { label: "Destinations", value: "45+", icon: Globe2 },
            { label: "Avg. Turnaround", value: "3-5 Days", icon: Clock },
            { label: "Embassy Support", value: "24/7", icon: Zap },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-purple-50 to-pink-50 border border-pink-100 rounded-2xl p-4 text-center"
            >
              <stat.icon size={22} className="text-[#E91E63] mx-auto mb-1.5" />
              <p className="text-xl font-black text-[#2D1347]">{stat.value}</p>
              <p className="text-[11px] text-gray-500 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. DESTINATION SEARCH & REGION TABS ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Region Tabs */}
          <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-xs overflow-x-auto gap-1">
            {[
              { id: "all", label: "All Destinations" },
              { id: "asia", label: "Asia" },
              { id: "middle-east", label: "Gulf & UAE" },
              { id: "europe", label: "Schengen" },
              { id: "west", label: "USA & UK" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#2D1347] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#2D1347] hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#2D1347] placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:border-[#E91E63]"
            />
          </div>
        </div>

        {/* ── 3. VISA CARDS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPlans.map((plan) => {
            const formattedPrice = displayPrice(
              plan.baseNPRPrice,
              selectedCurrency,
              nprPerOneDollar,
              nprPerOneINR
            );

            return (
              <div
                key={plan.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
              >
                {plan.popular && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-[#E91E63] to-pink-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Popular
                  </span>
                )}

                <div>
                  {/* Flag & Destination */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-xs">
                      {plan.countryCode === "EU" ? (
                        <span className="text-xl">🇪🇺</span>
                      ) : (
                        <ReactCountryFlag
                          svg
                          countryCode={plan.countryCode}
                          style={{ width: "1.6em", height: "1.6em", borderRadius: "3px" }}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#2D1347] tracking-tight">
                        {plan.country}
                      </h3>
                      <p className="text-[11px] font-bold text-[#E91E63]">{plan.visaType}</p>
                    </div>
                  </div>

                  {/* Key Metadata Badges */}
                  <div className="flex flex-wrap gap-2 my-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-[#2D1347] text-[10px] font-bold">
                      <Calendar size={11} className="text-[#E91E63]" />
                      <span>{plan.duration}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 text-gray-700 text-[10px] font-semibold border border-gray-100">
                      <Clock size={11} className="text-gray-400" />
                      <span>{plan.processingTime}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                      <span>{plan.entryType}</span>
                    </span>
                  </div>

                  {/* Inclusions List */}
                  <div className="space-y-1.5 my-4 pt-3 border-t border-gray-100">
                    {plan.inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                      Assistance Fee Starts At
                    </span>
                    <span className="text-xl font-black text-[#2D1347]">
                      {formattedPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => handleWhatsAppInquiry(plan)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#E91E63] to-pink-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-pink-600/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <MessageCircle size={13} />
                    <span>Inquire Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. HOW IT WORKS ── */}
      <div className="bg-gradient-to-br from-[#2D1347] to-[#401863] text-white p-8 sm:p-12 rounded-3xl shadow-xl">
        <span className="text-pink-400 font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
          SEAMLESS 4-STEP PROCEDURE
        </span>
        <h3 className="text-2xl sm:text-3xl font-black mb-8 tracking-tight">
          How Our Visa Concierge Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: "01",
              title: "Free Evaluation",
              desc: "We assess your passport, travel history, and financial profile to suggest the optimal visa category.",
            },
            {
              step: "02",
              title: "Dossier Prep",
              desc: "Our team drafts tailored cover letters, verifies flight/hotel vouchers, and organizes your embassy dossier.",
            },
            {
              step: "03",
              title: "Appointment / E-filing",
              desc: "We secure your biometrics slot (VFS/TLS) or directly file your electronic visa portal application.",
            },
            {
              step: "04",
              title: "Visa Grant",
              desc: "Collect your passport with stamped visa or receive your digital e-visa directly on WhatsApp & Email.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-all"
            >
              <span className="text-2xl font-black text-pink-400 block mb-2">{item.step}</span>
              <h4 className="font-black text-sm uppercase tracking-wide text-white mb-1.5">
                {item.title}
              </h4>
              <p className="text-gray-300 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. VISA FAQS ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pink-50 text-[#E91E63]">
            <HelpCircle size={20} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              Visa Service FAQs
            </h3>
            <p className="text-xs text-gray-400 font-medium">Important answers to common visa queries</p>
          </div>
        </div>

        <div className="space-y-3">
          {VISA_FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-gray-100 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm text-[#2D1347] hover:text-[#E91E63] cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5">
                    <span>{faq.q}</span>
                    <span className="text-[11px] font-medium text-gray-400">{faq.qNp}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#E91E63]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 border-t border-gray-50 pt-3 space-y-2">
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-2">{faq.aNp}</p>
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

export default VisaServicesDetailContent;
