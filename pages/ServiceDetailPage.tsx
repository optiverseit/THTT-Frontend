import React, { useState } from "react";
import { Service } from "../types";
import {
  CheckCircle2,
  MessageCircle,
  Phone,
  ArrowRight,
  Image as ImageIcon,
  Globe,
  Calendar,
  Check,
  MapPin,
  Repeat,
  Users,ChevronDown, HelpCircle,
  Star,
  Quote,
  Award,
  Clock,
  Shield,
} from "lucide-react";
import { testimonials } from "@/data/mockData";
import ServicesStrip from "@/components/Layout/ServicesStrip";

interface ServiceDetailPageProps {
  service: Service;
  onInquire: (serviceName: string) => void;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  service,
  onInquire,
}) => {
  const [tripType, setTripType] = useState<"one-way" | "two-way">("two-way");
  const [passengers, setPassengers] = useState("1 Passenger");
  const isAirTicket =
    service.name.toLowerCase().includes("air") ||
    service.name.toLowerCase().includes("flight");
const [openFaq, setOpenFaq] = useState<number | null>(0);

const faqs = isAirTicket
  ? [
      {
        question: "What do I need to book a flight ticket?",
        answer:
          "Share your full name (as per passport/ID), route, dates, and preferred flight time. We’ll send options with pricing and confirmation steps.",
      },
      {
        question: "Can I change or cancel my ticket?",
        answer:
          "Yes—changes/cancellations depend on airline fare rules. We’ll explain penalties and timelines before processing.",
      },
      {
        question: "Do you handle group bookings?",
        answer:
          "Yes. We check group fares, availability, and align everyone on the same itinerary for smoother coordination.",
      },
      {
        question: "How fast will I receive the e-ticket?",
        answer:
          "Most tickets are issued right after payment confirmation. For special cases, we’ll update you immediately.",
      },
      {
        question: "Can you help with missed flights or rescheduling?",
        answer:
          "Yes. Contact us ASAP and we’ll coordinate rebooking options based on your ticket policy and availability.",
      },
    ]
  : [
      {
        question: "How do I request a quote for this service?",
        answer:
          "Click “Request Quotation” or message us on WhatsApp with your dates and group size. We’ll respond with a tailored plan.",
      },
      {
        question: "Do you customize packages or itineraries?",
        answer:
          "Yes. We customize based on time, budget, interests, and comfort level. You can add upgrades or special requests anytime.",
      },
      {
        question: "What’s included in the price?",
        answer:
          "Inclusions vary by service. We clearly list what’s covered (permits, transport, guide, hotel, etc.) before you confirm.",
      },
      {
        question: "Should I book in advance?",
        answer:
          "For peak seasons and limited availability, advance booking is recommended. For flexible plans, we can often arrange quickly too.",
      },
      {
        question: "How do payment and confirmation work?",
        answer:
          "We confirm availability first, then finalize after payment verification. You’ll receive all documents and confirmations promptly.",
      },
    ];


  return (
    <div>
      <div className={`sticky top-0 z-[60]`}>
          <ServicesStrip />
        </div>
      {/* Hero Banner with Darker Overlay */}
      <section className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <img
          src={service.heroImage}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute  inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50"></div>
      {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-700">
          <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">
            Discover Our Legacy
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
            {service.name}
          </h1>
          <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-8 shadow-lg"></div>
          <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
            "{service.shortDesc}"
          </p>
        </div>

        {/* Floating Stats or Element can be added here if needed */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-12">
              <span className="text-[#D92671] font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
                Service Overview
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#2D1347] tracking-tight">
                Professional Management
              </h2>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed mb-12 font-medium">
              {service.description}
            </p>

            <h3 className="text-2xl font-black text-[#2D1347] mb-8 tracking-tight">
              Key Service Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {service.subServices.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:border-[#D92671]/30 hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  <div className="bg-white p-2 rounded-xl text-[#D92671] mr-4 shadow-sm group-hover:bg-[#D92671] group-hover:text-white transition-all">
                    <CheckCircle2 size={24} />
                  </div>
                  <span className="font-black text-slate-700 text-sm group-hover:text-[#2D1347] transition-colors uppercase tracking-tight">
                    {sub}
                  </span>
                </div>
              ))}
            </div>
            {isAirTicket && (
              <div className="absolute bottom-2 left-0 w-full px-4 md:px-8 z-20">
                <div className="max-w-7xl mx-auto">
                  <div className="bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] p-6 md:p-10 animate-in slide-in-from-bottom-10 duration-1000">
                    {/* Top Options Bar */}
                    <div className="flex flex-wrap items-center gap-6 mb-8">
                      <div className="flex items-center justify-center mb-6">
                        <div className="bg-white rounded-full p-1 shadow-lg border border-slate-100 flex">
                          {/* One Way */}
                          <button
                            onClick={() => setTripType("one-way")}
                            className={`
        px-6 py-2
        rounded-full
        text-[11px]
        font-black
        uppercase
        tracking-widest
        transition-all
        ${
          tripType === "one-way"
            ? "bg-[#D92671] text-white shadow-md"
            : "text-slate-500 hover:text-[#D92671]"
        }
      `}
                          >
                            One Way
                          </button>

                          {/* Two Way */}
                          <button
                            onClick={() => setTripType("two-way")}
                            className={`
        px-6 py-2
        rounded-full
        text-[11px]
        font-black
        uppercase
        tracking-widest
        transition-all
        ${
          tripType === "two-way"
            ? "bg-[#D92671] text-white shadow-md"
            : "text-slate-500 hover:text-[#D92671]"
        }
      `}
                          >
                            Two Way
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <select className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl text-xs font-black text-slate-700 outline-none appearance-none pr-12 cursor-pointer">
                          <option>1 Passenger</option>
                          <option>2 Passengers</option>
                          <option>3 Passengers</option>
                          <option>Group Booking</option>
                        </select>
                        <Users
                          size={14}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                      </div>

                      <div className="relative">
                        <div className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl text-xs font-black text-slate-700 flex items-center space-x-3">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg"
                            alt="Nepal"
                            className="h-3 shadow-sm"
                          />
                          <span>NEPAL</span>
                        </div>
                      </div>
                    </div>

                    {/* Main Search Inputs Grid */}
                    <div className="bg-white rounded-[2.8rem] shadow-2xl px-6 py-5">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        {/* FROM */}
                        <div className="lg:col-span-3">
                          <div className="flex items-center gap-4">
                            <MapPin size={18} className="text-[#D92671]" />
                            <div className="flex-1">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                From
                              </label>
                              <input
                                type="text"
                                placeholder="Kathmandu"
                                className="w-full bg-transparent font-black text-slate-800 placeholder-slate-300 outline-none text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* SWAP */}
                        <div className="hidden lg:flex lg:col-span-1 justify-center">
                          <button className="w-12 h-12 rounded-full bg-[#D92671]/10 text-[#D92671] flex items-center justify-center hover:bg-[#D92671] hover:text-white transition-all">
                            <Repeat size={18} />
                          </button>
                        </div>

                        {/* TO */}
                        <div className="lg:col-span-3">
                          <div className="flex items-center gap-4">
                            <MapPin size={18} className="text-[#D92671]" />
                            <div className="flex-1">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                To
                              </label>
                              <input
                                type="text"
                                placeholder="Pokhara"
                                className="w-full bg-transparent font-black text-slate-800 placeholder-slate-300 outline-none text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* DATES */}
                        <div className="lg:col-span-3 flex gap-6">
                          <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-[#D92671]" />
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                Departure
                              </label>
                              <p className="font-black text-slate-800 text-sm">
                                01 / 31 / 2026
                              </p>
                            </div>
                          </div>

                          {tripType === "two-way" && (
                            <div className="flex items-center gap-3">
                              <Calendar size={18} className="text-[#D92671]" />
                              <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                  Return
                                </label>
                                <p className="font-black text-slate-800 text-sm">
                                  02 / 01 / 2026
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* SEARCH BUTTON */}
                        <div className="lg:col-span-2">
                          <button
                            className="
        w-full h-[64px]
        bg-[#D92671]
        text-white
        rounded-[2rem]
        font-black
        tracking-widest
        text-sm
        shadow-xl
        shadow-[#D92671]/30
        hover:brightness-110
        active:scale-95
        transition-all
        uppercase
      "
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Gallery Preview */}
            {service.gallery.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center mb-10">
                  <div className="bg-[#D92671]/10 p-3 rounded-2xl text-[#D92671] mr-4">
                    <ImageIcon size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-[#2D1347] tracking-tight">
                    Visual Showcase
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {service.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="rounded-[2.5rem] overflow-hidden shadow-2xl group"
                    >
                      <img
                        src={img}
                        alt={`${service.name} ${i + 1}`}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps */}
            <div className="bg-[#2D1347] text-white p-12 md:p-20 rounded-[4rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-5 pointer-events-none translate-x-1/4 -translate-y-1/4">
                <ArrowRight size={500} />
              </div>
              <h3 className="text-3xl font-black mb-12 relative z-10 tracking-tight">
                The Seamless Journey
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                {[
                  {
                    step: "01",
                    title: "Consult",
                    desc: "Discuss your requirements with our specialized travel desk.",
                  },
                  {
                    step: "02",
                    title: "Plan",
                    desc: "Our experts craft the perfect itinerary tailored to your budget.",
                  },
                  {
                    step: "03",
                    title: "Book",
                    desc: "Secure your experience with instant confirmation and documents.",
                  },
                ].map((item) => (
                  <div key={item.step} className="relative group">
                    <span className="text-7xl font-black text-white/5 absolute -top-10 -left-6 group-hover:text-[#D92671]/20 transition-all duration-500">
                      {item.step}
                    </span>
                    <h4 className="font-black text-lg mb-4 text-[#D92671] tracking-wide uppercase">
                      {item.title}
                    </h4>
                    <p className="text-white/60 text-sm font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-40 space-y-8">
              <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(45,19,71,0.1)] p-10 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12"></div>
                <h3 className="text-2xl font-black text-[#2D1347] mb-10 text-center tracking-tight relative z-10">
                  Instant Inquiry
                </h3>
                <div className="space-y-4 relative z-10">
                  <button
                    onClick={() => onInquire(service.name)}
                    className="w-full bg-[#D92671] text-white py-5 rounded-2xl font-black tracking-widest hover:brightness-110 transition-all flex items-center justify-center space-x-3 shadow-xl uppercase text-xs shadow-[#D92671]/20"
                  >
                    <span>Request Quotation</span>
                    <ArrowRight size={18} />
                  </button>
                  <a
                    href="https://wa.me/9779800000000"
                    className="w-full bg-green-500 text-white py-5 rounded-2xl font-black tracking-widest hover:bg-green-600 transition-all flex items-center justify-center space-x-3 shadow-xl uppercase text-xs"
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp Now</span>
                  </a>
                  <a
                    href="tel:+9779800000000"
                    className="w-full bg-[#2D1347] text-white py-5 rounded-2xl font-black tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 shadow-xl uppercase text-xs"
                  >
                    <Phone size={18} />
                    <span>Call Support</span>
                  </a>
                </div>
                <div className="mt-10 flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Active Helpdesk
                  </p>
                </div>
              </div>

              {/* Legal Note */}
              <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200">
                <h4 className="font-black text-[#2D1347] mb-4 text-sm uppercase tracking-wide">
                  Trust Guarantee
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed italic font-medium">
                  "Every service is backed by our full legal accreditation and a
                  commitment to 100% traveler safety."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Why Choose Us – Blurred Banner with 6 items */}
<section className="relative py-20 overflow-hidden">
  {/* Background image */}
  <img
    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
    alt="Why Choose Us"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

<div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-white">
    {/* Header */}
    <div className="text-center max-w-4xl mx-auto mb-14">
      <span className="text-[#FF4FA3] font-black uppercase tracking-[0.3em] text-[10px]">
        The THTT Edge
      </span>
      <h2 className="text-2xl md:text-3xl font-black mt-4 tracking-[0.2em] uppercase">
        Why Choose Trip Himalaya?
      </h2>
      <p className="text-xs md:text-sm text-white/75 max-w-4xl mx-auto mt-4 font-medium leading-relaxed">
        More than bookings—we take responsibility for your entire journey, so you travel with confidence and return
        with stories worth keeping.
      </p>
    </div>

    {/* 🔥 ONE LINE – 6 ITEMS */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-10">
      {[
        {
          icon: Shield,
          title: "Safe & Legal",
          desc: "Fully licensed and accountable.",
        },
        {
          icon: Clock,
          title: "Zero Hassle",
          desc: "Smooth bookings, no chasing.",
        },
        {
          icon: Users,
          title: "Local Experts",
          desc: "Real insight from real locals.",
        },
        {
          icon: Award,
          title: "Fair Pricing",
          desc: "Transparent value, no surprises.",
        },
        {
          icon: Users,
          title: "24/7 Human Support",
          desc: "A real person, anytime.",
        },
        {
          icon: Shield,
          title: "All-in-One Partner",
          desc: "Everything handled in one place.",
        },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center text-center group">
          {/* Icon */}
          <div className="mb-4 border border-white/30 bg-white/10 p-4 rounded-full
                          group-hover:border-white transition-all duration-300
                          group-hover:scale-110">
            <item.icon size={22} className="text-white" />
          </div>

          {/* Title */}
          <span className="text-[11px] md:text-[12px] font-black uppercase tracking-widest">
            {item.title}
          </span>

          {/* Description */}
          <span className="mt-2 text-[10px] md:text-[11px] text-white/70 font-semibold leading-snug max-w-[14rem]">
            {item.desc}
          </span>
        </div>
      ))}
    </div>
  </div>

</section>


      
{/* Testimonials */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
  {/* soft background blobs (same as first) */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-[#D92671]/5 rounded-full blur-3xl -mr-32 -mt-32" />
  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5D2A8E]/5 rounded-full blur-3xl -ml-32 -mb-32" />

  <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
    {/* Header – compact like first */}
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-5xl font-black text-[#2D1347] tracking-tight">
        What Our Customers Say
      </h2>

      <div className="mt-4 flex items-center justify-center space-x-2">
        <div className="h-1 w-10 bg-[#D92671] rounded-full" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
          Trusted by real clients
        </p>
        <div className="h-1 w-10 bg-[#D92671] rounded-full" />
      </div>
    </div>

    {/* Cards – SAME as first design */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.slice(0, 3).map((t) => (
        <div
          key={t.id}
          className="
            bg-white
            p-6
            rounded-[2.2rem]
            border border-slate-100
            shadow-lg
            hover:shadow-xl
            transition-all duration-500
            relative
            overflow-hidden
            group
            flex flex-col
          "
        >
          {/* Quote */}
          <Quote
            size={88}
            className="absolute -top-6 -right-6 text-slate-100 group-hover:text-[#D92671]/10 transition-all duration-500 pointer-events-none"
          />

          {/* Header row */}
          <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full shadow-md border border-white">
                  <Check size={8} strokeWidth={4} />
                </div>
              </div>

              <div className="text-left">
                <h4 className="font-black text-[#2D1347] text-sm leading-tight">
                  {t.name}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t.country}
                </p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < t.rating ? "currentColor" : "none"}
                  className={
                    i < t.rating ? "text-yellow-400" : "text-slate-200"
                  }
                />
              ))}
            </div>
          </div>

          {/* Message */}
          <p className="relative z-10 text-[#2D1347]/80 text-sm font-semibold leading-relaxed flex-grow">
            <span className="text-[#D92671] font-serif text-xl mr-1">“</span>
            {t.message}
            <span className="text-[#D92671] font-serif text-xl ml-1">”</span>
          </p>

          {/* Bottom meta */}
          <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Verified Client
            </span>

            <div className="bg-[#D92671]/10 text-[#D92671] px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-[#D92671] group-hover:text-white transition-all">
              Testimonial
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* CTA – same scale as first */}
    <div className="mt-14 flex justify-center">
      <button 
        className="
          flex items-center gap-3
          bg-[#D92671]
          px-10 py-4
          rounded-[2rem]
          border border-[#D92671]/30
          font-black
          text-[11px]
          uppercase
          tracking-widest
          text-white
          shadow-md
          hover:shadow-xl
          transition-all
          duration-500
          group
        "
      >
        <span>See More Reviews</span>
        <ArrowRight
          size={16}
          className="transform group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  </div>
</section>
      {/* FAQ – below Testimonials, above CTA */}
<section className="py-12 bg-white">
  <div className="max-w-8xl mx-auto px-4 md:px-8">
    <div id="faqs" className="max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-black text-[#2D1347] mb-4">
        Frequently Asked Questions (FAQs)
      </h2>

      <div className="space-y-2">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full px-8 py-5 flex items-center justify-between text-left group"
            >
              <span className="font-black text-[#2D1347] group-hover:text-[#D92671] transition-colors">
                {faq.question}
              </span>
              <ChevronDown
                size={20}
                className={`text-slate-400 transition-transform ${
                  openFaq === idx ? "rotate-180" : ""
                }`}
              />
            </button>

            {openFaq === idx && (
              <div className="px-8 pb-6 text-slate-500 text-sm font-medium leading-relaxed animate-in slide-in-from-top-2 duration-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


      {/* CTA Strip */}
      <section className="bg-gradient-to-r from-[#D92671] to-[#E91E63] py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Start Your Journey Today</h2>
            <p className="text-white/90 font-bold text-xl">Get a free consultation from our travel experts.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="tel:+9779800000000" className="bg-[#2D1347] text-white px-12 py-5 rounded-full font-black tracking-widest hover:brightness-125 transition-all shadow-2xl">CALL US NOW</a>
            <button  className="bg-white text-[#D92671] px-12 py-5 rounded-full font-black tracking-widest hover:bg-slate-50 transition-all shadow-2xl">GET FREE QUOTE</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
