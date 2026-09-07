import React, { useState } from "react";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import {
  Shield,
  ShieldCheck,
  Activity,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  CheckCircle2,
  FileCheck2,
  Clock,
  Zap,
  Globe2,
  Stethoscope,
  CalendarCheck,
} from "lucide-react";
import BookingModal, { BookingItem } from "../reuseable/packages/BookingModal";

interface InsurancePlan {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  maxAltitude: string;
  priceUSD: number;
  durationCovered: string;
  isPopular?: boolean;
  coverageLimit: string;
  highlights: string[];
  inclusions: string[];
}

const INSURANCE_PLANS: InsurancePlan[] = [
  {
    id: "plan-trek-standard",
    name: "Standard Cultural & Foothill Plan",
    badge: "Low Altitude",
    badgeColor: "bg-blue-100 text-blue-800",
    maxAltitude: "Up to 3,000 Meters",
    priceUSD: 28,
    durationCovered: "Up to 10 Days",
    coverageLimit: "$50,000 Medical Sum",
    highlights: [
      "Kathmandu, Pokhara, Chitwan & Short Hikes",
      "Poon Hill & Nagarkot Trails",
      "Emergency Road Ambulance",
      "Lost Luggage & Passport Cover",
    ],
    inclusions: [
      "Outpatient & Inpatient Hospitalization",
      "Luggage delay and personal effects loss",
      "Trip cancellation & flight delay allowance",
      "24/7 Global emergency assistance hotline",
    ],
  },
  {
    id: "plan-high-altitude",
    name: "High-Altitude Alpine & Heli Rescue",
    badge: "Most Popular in Nepal",
    badgeColor: "bg-[#E11D48] text-white",
    maxAltitude: "Up to 6,000 Meters",
    priceUSD: 75,
    durationCovered: "Up to 15 Days",
    isPopular: true,
    coverageLimit: "$100,000 + Unlimited Heli Rescue",
    highlights: [
      "Everest Base Camp, Gokyo & Annapurna Circuit",
      "Immediate 45-Min Helicopter Evacuation",
      "Cashless Admission in Kathmandu Hospitals",
      "Altitude Sickness (AMS) & Frostbite",
    ],
    inclusions: [
      "Direct helicopter search, rescue & airlift",
      "Hyperbaric chamber & oxygen therapy",
      "Direct billing with CIWEC & Swacon clinics",
      "Trekking guide & porter liability cover",
      "Lukla / Jomsom weather delay compensation",
    ],
  },
  {
    id: "plan-extreme-expedition",
    name: "Extreme Mountaineering & Peak Climbing",
    badge: "Technical Climbing",
    badgeColor: "bg-purple-100 text-purple-800",
    maxAltitude: "Above 6,000 Meters (Uncapped)",
    priceUSD: 160,
    durationCovered: "Up to 30 Days",
    coverageLimit: "$250,000 Comprehensive",
    highlights: [
      "Island Peak, Mera Peak, Lobuche & 8000m Peaks",
      "Rope, Ice Axe & Crampons Climbing",
      "Advanced High-Altitude Medical Resuscitation",
      "Emergency International Medical Repatriation",
    ],
    inclusions: [
      "All technical peak climbing & mountaineering",
      "Long-line alpine helicopter rescue extraction",
      "Specialist trauma surgeon and ICU hospital care",
      "Full international air-ambulance repatriation",
    ],
  },
  {
    id: "plan-international",
    name: "Global Outbound & Schengen Compliant",
    badge: "Schengen Visa Approved",
    badgeColor: "bg-emerald-100 text-emerald-800",
    maxAltitude: "Worldwide Coverage",
    priceUSD: 40,
    durationCovered: "Per Trip (Up to 30 Days)",
    coverageLimit: "€30,000 / $50,000 Minimum",
    highlights: [
      "Europe (Schengen), Dubai, Thailand & Worldwide",
      "Meets 100% Embassy Visa Requirements",
      "Instant Embassy-Certified Policy Letter",
      "Trip Interruption & Hijack Cover",
    ],
    inclusions: [
      "Emergency dental and COVID medical care",
      "Loss of travel documents and flight missed",
      "Accidental death & permanent disability",
      "Instant digital certificate for visa appointment",
    ],
  },
];

const INSURANCE_FAQS = [
  {
    q: "Why is specialized travel insurance mandatory for trekking in Nepal?",
    a: "Standard travel insurances from regular credit cards or general agents usually cap altitude at 2,000m to 2,500m and exclude helicopter search and rescue. In regions like Everest Base Camp (5,364m) or Thorong La Pass (5,416m), emergency medical helicopter evacuation costs between $2,500 and $5,000 per flight. Specialized high-altitude trekking insurance guarantees 100% cashless helicopter airlift with zero out-of-pocket delays.",
  },
  {
    q: "How fast can a rescue helicopter be dispatched during an emergency on the trail?",
    a: "Once our lead Sherpa guide and wilderness first-responder assess your condition, our 24/7 Kathmandu operations desk coordinates immediate flight clearance. The rescue helicopter typically arrives at the high-altitude helipad within 30 to 45 minutes (weather permitting).",
  },
  {
    q: "Which hospitals in Nepal provide direct cashless billing with this insurance?",
    a: "We work directly with Nepal's premier tourist medical facilities including CIWEC Hospital & Travel Medicine Center (Kathmandu & Pokhara), Swacon International Hospital, and Era Health Care for immediate cashless admission.",
  },
  {
    q: "Does the policy provide certification for Schengen, US, and UK visa applications?",
    a: "Yes! Our International Outbound plan meets all European Union Schengen requirements (minimum €30,000 medical coverage, zero deductible, medical repatriation) and provides an official digital policy certificate recognized by all foreign embassies.",
  },
  {
    q: "Can insurance be arranged on short notice after arriving in Kathmandu?",
    a: "Yes. We can issue official policy certificates within 30 to 60 minutes after receiving your passport copy, planned trekking route, and travel dates.",
  },
];

export const TravelInsuranceDetailContent: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  // Booking Modal State
  const [selectedBookingItem, setSelectedBookingItem] = useState<BookingItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Quick quote state
  const [altitudeZone, setAltitudeZone] = useState("Up to 6,000m (High Altitude Trekking)");
  const [tripDays, setTripDays] = useState("10 - 15 Days");
  const [travelerCount, setTravelerCount] = useState("1 Person");

  const formatPrice = (usdAmount: number) => {
    const nprAmount = usdAmount * nprPerOneDollar;
    return displayPrice(nprAmount, selectedCurrency, nprPerOneDollar, nprPerOneINR);
  };

  const handleInquiry = (planName: string, priceUSD: number) => {
    const priceFormatted = formatPrice(priceUSD);
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I would like to inquire about the "${planName}" (${priceFormatted}). Please share policy details, altitude coverage verification, and issuance steps.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handleBookPlan = (plan: InsurancePlan) => {
    setSelectedBookingItem({
      id: plan.id,
      title: plan.name,
      location: plan.maxAltitude,
      duration: plan.durationCovered,
      price: `$${plan.priceUSD}`,
    });
    setIsBookingModalOpen(true);
  };

  const handleQuickQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I need a Travel & Trekking Insurance Quote. ` +
        `Altitude Range: ${altitudeZone}, Duration: ${tripDays}, Travelers: ${travelerCount}. ` +
        `Please share policy options and instant pricing.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-12">
      {/* ── 1. VALUE PILLARS & STATS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: "Up to 6,000m+ Covered", desc: "EBC, ABC & Alpine Circuits", color: "text-[#E11D48] bg-pink-50" },
          { icon: Zap, label: "45-Min Heli Dispatch", desc: "Immediate Alpine Evacuation", color: "text-purple-600 bg-purple-50" },
          { icon: Stethoscope, label: "Cashless Hospitalization", desc: "Top International Hospitals", color: "text-emerald-600 bg-emerald-50" },
          { icon: Globe2, label: "Schengen Visa Approved", desc: "Embassy Certified Policies", color: "text-amber-500 bg-amber-50" },
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

      {/* ── 2. QUICK POLICY QUOTE CALCULATOR ── */}
      <div className="bg-gradient-to-r from-[#200B3B] via-[#2D1347] to-[#3B145C] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl mb-6">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-xs block mb-1">
            INSTANT POLICY CALCULATOR
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Get an Altitude-Verified Trekking &amp; Travel Policy
          </h3>
          <p className="text-gray-300 text-xs mt-1 font-medium">
            Certified insurance coverage issued in under 45 minutes with emergency helicopter clearance.
          </p>
        </div>

        <form onSubmit={handleQuickQuote} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Altitude */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <label className="block text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1">
              Max Altitude / Route
            </label>
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-pink-400 flex-shrink-0" />
              <select
                value={altitudeZone}
                onChange={(e) => setAltitudeZone(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-xs outline-none cursor-pointer [&>option]:text-gray-800"
              >
                <option>Up to 3,000m (Tours & Short Hikes)</option>
                <option>Up to 6,000m (High Altitude Trekking)</option>
                <option>6,000m+ (Mountaineering Peak Climbing)</option>
                <option>International Outbound / Schengen</option>
              </select>
            </div>
          </div>

          {/* Days */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <label className="block text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1">
              Duration of Trip
            </label>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-pink-400 flex-shrink-0" />
              <select
                value={tripDays}
                onChange={(e) => setTripDays(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-xs outline-none cursor-pointer [&>option]:text-gray-800"
              >
                <option>1 - 7 Days</option>
                <option>8 - 14 Days</option>
                <option>15 - 21 Days</option>
                <option>22 - 30 Days (Extended)</option>
              </select>
            </div>
          </div>

          {/* Travelers */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <label className="block text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1">
              Number of Insured
            </label>
            <div className="flex items-center gap-2">
              <Shield size={15} className="text-pink-400 flex-shrink-0" />
              <select
                value={travelerCount}
                onChange={(e) => setTravelerCount(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-xs outline-none cursor-pointer [&>option]:text-gray-800"
              >
                <option>1 Person</option>
                <option>2 People (Couple / Pair)</option>
                <option>3 - 5 People (Small Group)</option>
                <option>6+ People (Group Discount)</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full h-full min-h-[46px] bg-[#E11D48] hover:bg-[#BE123C] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck2 size={15} />
              <span>GET POLICY QUOTE</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── 3. INSURANCE PLANS COMPARISON GRID ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="mb-8">
          <span className="text-[#E11D48] font-black uppercase tracking-[0.2em] text-xs block mb-1">
            CERTIFIED COVERAGE TIERS
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
            Tailored Plans for Trekking, Expeditions &amp; Holidays
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">
            Select the exact altitude and trip profile required for full medical peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INSURANCE_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                plan.isPopular
                  ? "bg-gradient-to-b from-pink-50/50 to-white border-[#E11D48] ring-2 ring-[#E11D48]/20"
                  : "bg-[#FBFBFE] border-gray-200/80"
              }`}
            >
              <div className="p-6 sm:p-7">
                {/* Plan Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2 ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-[#2D1347] leading-snug">
                      {plan.name}
                    </h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-extrabold text-base sm:text-lg text-[#E11D48] whitespace-nowrap bg-pink-50 px-3 py-1.5 rounded-2xl block shadow-2xs">
                      {formatPrice(plan.priceUSD)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">{plan.durationCovered}</span>
                  </div>
                </div>

                {/* Altitude Limit & Coverage Tag */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="bg-purple-100 text-purple-900 px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1">
                    <Activity size={13} className="text-[#E11D48]" />
                    {plan.maxAltitude}
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    {plan.coverageLimit}
                  </span>
                </div>

                {/* Key Highlights */}
                <div className="space-y-2 mb-6">
                  {plan.highlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700 font-bold">
                      <CheckCircle2 size={14} className="text-[#E11D48] mt-0.5 flex-shrink-0" />
                      <span className="leading-tight">{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Full Inclusions List */}
                <div className="border-t border-gray-100 pt-4 space-y-1.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">
                    POLICY INCLUSIONS
                  </span>
                  {plan.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-gray-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between gap-2.5 mt-auto">
                <button
                  type="button"
                  onClick={() => handleInquiry(plan.name, plan.priceUSD)}
                  className="flex-1 bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-pink-900/20 whitespace-nowrap"
                >
                  <MessageCircle size={15} />
                  <span>Inquiry</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBookPlan(plan)}
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

      {/* ── 4. EMERGENCY HELICOPTER EVACUATION PROTOCOL ── */}
      <div className="bg-gradient-to-br from-[#2D1347] via-[#3B145C] to-[#2D1347] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="max-w-3xl mb-8">
          <span className="text-[#FF4FA3] font-black uppercase tracking-[0.2em] text-xs block mb-1">
            24/7 MOUNTAIN RESCUE GUARANTEE
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            How Our Emergency Helicopter Rescue Works
          </h3>
          <p className="text-gray-300 text-sm mt-2 font-medium">
            In remote Himalayan terrain, minutes matter. Our direct satellite and radio link ensures the fastest evacuation in Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "Trail Medical Assessment",
              desc: "Lead Sherpa guide tests blood oxygen (SpO2) and symptoms on the trail with our medical kit.",
            },
            {
              step: "02",
              title: "Instant SOS Dispatch",
              desc: "Our Kathmandu operations center triggers insurance clearance & assigns the nearest standby helicopter.",
            },
            {
              step: "03",
              title: "45-Min Alpine Airlift",
              desc: "Helicopter lands at the mountain helipad and flies patient with oxygen directly to Kathmandu/Pokhara.",
            },
            {
              step: "04",
              title: "Direct Cashless Care",
              desc: "Patient enters CIWEC or Swacon Hospital with zero upfront hospital deposit or paperwork stress.",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-[#FF4FA3] block mb-2">{item.step}</span>
              <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
              <p className="text-gray-300 text-xs leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. TRAVEL INSURANCE FAQS ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pink-50 text-[#E11D48]">
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              Trekking &amp; Travel Insurance FAQ
            </h3>
            <p className="text-xs text-gray-500 font-medium">Critical information for high-altitude trekking safety</p>
          </div>
        </div>

        <div className="space-y-3">
          {INSURANCE_FAQS.map((faq, index) => {
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

export default TravelInsuranceDetailContent;
