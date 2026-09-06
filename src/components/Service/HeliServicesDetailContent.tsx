import React, { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Mountain,
  Plane,
  Shield,
  Users,
  Wind,
  AlertTriangle,
  Compass,
  HeartPulse,
} from "lucide-react";

// ── FAQ DATA ──────────────────────────────────────────────────────────────────
const HELI_FAQS = [
  {
    q: "What is the best season for helicopter tours in Nepal?",
    a: "October–November (autumn) and March–May (spring) offer the clearest skies and most stable flight conditions. However, our fleet operates year-round with daily weather briefings to ensure safety at all times.",
  },
  {
    q: "What is the difference between shared and charter helicopter tours?",
    a: "Shared (seat-in-helicopter) tours have a fixed departure, fixed schedule, and seats are sold individually — ideal for budget-conscious travelers. Charter tours give you full control over the departure time, duration, itinerary, and co-passengers — perfect for families, VIPs, and corporate groups.",
  },
  {
    q: "How safe are helicopter flights over the Himalayas?",
    a: "Nepal's helicopter operators are regulated by CAAN (Civil Aviation Authority of Nepal). We exclusively use CAAN-certified aircraft, HEMS-trained pilots with thousands of mountain flying hours, and carry emergency oxygen, first-aid kits, and comprehensive flight insurance on every departure.",
  },
  {
    q: "Can the helicopter tour be cancelled due to weather?",
    a: "Yes — passenger safety is paramount. If visibility is poor or winds are unsafe, we will postpone your flight. In case of weather cancellations, we offer a full refund or free reschedule at no extra charge.",
  },
  {
    q: "How many people can fly in one helicopter?",
    a: "Most of our mountain helicopters seat 4–5 passengers plus the pilot. For charter requests, we can arrange larger aircraft for groups of up to 12 passengers depending on altitude requirements.",
  },
  {
    q: "Is travel insurance or rescue insurance required?",
    a: "We strongly recommend comprehensive travel insurance that covers high-altitude helicopter evacuation. We can facilitate your insurance purchase through our partner providers. Basic flight insurance is included in all our tour packages.",
  },
];

// ── WHY CHOOSE US POINTS ──────────────────────────────────────────────────────
const WHY_CHOOSE = [
  {
    icon: Shield,
    title: "CAAN Certified Operators",
    desc: "All our flights use Civil Aviation Authority of Nepal certified aircraft and licensed mountain pilots.",
  },
  {
    icon: Wind,
    title: "Daily Weather Briefings",
    desc: "Real-time meteorological monitoring ensures every departure meets strict visibility and wind safety thresholds.",
  },
  {
    icon: HeartPulse,
    title: "Medical Oxygen Onboard",
    desc: "Emergency oxygen tanks, first-aid kits, and altitude sickness response gear are standard on every flight.",
  },
  {
    icon: Users,
    title: "Private & Shared Options",
    desc: "Choose seat-in-helicopter shared tours for value, or full private charters for ultimate flexibility.",
  },
  {
    icon: Compass,
    title: "Expert Mountain Pilots",
    desc: "Our pilots have logged thousands of hours specifically in high-altitude Himalayan terrain.",
  },
  {
    icon: AlertTriangle,
    title: "24/7 Rescue Network",
    desc: "Round-the-clock emergency coordination with CIWEC Hospital, insurance agencies, and rescue teams.",
  },
];

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export const HeliServicesDetailContent: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-10">
      {/* ── OVERVIEW BANNER ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <span className="text-[#E91E63] font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
          HELICOPTER SERVICES
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight mb-4">
          Nepal's Premier Helicopter Tour & Charter Service
        </h2>
        <p className="text-gray-600 text-base leading-relaxed font-medium">
          Experience the Himalayas from a perspective that few ever witness — hovering at eye level with the world's
          highest peaks. From the iconic Everest Base Camp to the sacred Muktinath Temple, our helicopter services
          deliver breathtaking aerial adventures, spiritual pilgrimages, and emergency rescue solutions across Nepal.
        </p>

        {/* Stats Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Tours Completed", value: "3,000+", icon: Plane },
            { label: "Max Altitude", value: "5,600 m", icon: Mountain },
            { label: "Regions Covered", value: "12+", icon: Compass },
            { label: "Safety Record", value: "100%", icon: Shield },
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


      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#2D1347] to-[#401863] text-white p-8 sm:p-12 rounded-3xl shadow-xl">
        <span className="text-pink-400 font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
          OUR GUARANTEE
        </span>
        <h3 className="text-2xl sm:text-3xl font-black mb-8 tracking-tight">
          Why Fly with Trip Himalaya?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_CHOOSE.map((item) => (
            <div
              key={item.title}
              className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center mb-3">
                <item.icon size={20} />
              </div>
              <h4 className="font-black text-sm uppercase tracking-wide text-white mb-1.5">
                {item.title}
              </h4>
              <p className="text-gray-300 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <span className="text-[#E91E63] font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
          BOOKING PROCESS
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight mb-8">
          How to Book Your Helicopter Tour
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 relative">
          {/* Connector line (desktop) */}
          <div className="hidden sm:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-pink-100 via-pink-300 to-pink-100 z-0" />
          {[
            {
              step: "01",
              title: "Select Tour",
              desc: "Browse and choose a heli tour or request a custom charter.",
            },
            {
              step: "02",
              title: "Confirm Dates",
              desc: "Share your preferred departure date and passenger count.",
            },
            {
              step: "03",
              title: "Pay & Receive Voucher",
              desc: "Secure your spot with payment. Receive your flight voucher instantly.",
            },
            {
              step: "04",
              title: "Fly & Experience",
              desc: "Meet at the helipad on the day, board, and soar to the Himalayas.",
            },
          ].map((step) => (
            <div key={step.step} className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D1347] to-[#E91E63] text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-xl font-black">{step.step}</span>
              </div>
              <h4 className="font-black text-sm text-[#2D1347] mb-1">{step.title}</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SAFETY & COMPLIANCE ──────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <span className="text-[#E91E63] font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
          SAFETY FIRST
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight mb-6">
          Safety & Compliance Standards
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "CAAN (Civil Aviation Authority of Nepal) approved operator",
            "All aircraft on regular CAAN-mandated maintenance schedules",
            "HEMS-certified high-altitude emergency medical service pilots",
            "Emergency oxygen tanks & first aid standard on all flights",
            "Real-time weather monitoring before every departure",
            "Full flight insurance and liability coverage included",
            "Coordination with CIWEC Hospital for medical emergencies",
            "Pre-flight safety briefing for every passenger",
          ].map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-pink-50/30 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-white shadow-xs text-[#E91E63] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E91E63] group-hover:text-white transition-colors">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-sm font-semibold text-gray-700 leading-snug">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ SECTION ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pink-50 text-[#E91E63]">
            <HelpCircle size={20} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-gray-400 font-medium">Everything you need to know about heli tours</p>
          </div>
        </div>
        <div className="space-y-3">
          {HELI_FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-gray-100 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-3.5 font-bold text-xs sm:text-[13px] text-[#2D1347] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-[#E91E63]" : ""
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

export default HeliServicesDetailContent;
