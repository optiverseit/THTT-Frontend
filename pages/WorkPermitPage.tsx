import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MessageCircle,
  Phone,
  FileText,
  ShieldCheck,
  Clock,
  Users,
  Zap,
  Heart,
  CheckCircle2,
  ChevronDown,
  MessageSquare,
  Navigation,
  Globe,
  ArrowRight,
  Check,
  Quote,
  Star,
} from "lucide-react";
import {
  workPermitCountries,
  testimonials,
  workPermitTestimonials,
} from "../data/mockData";
import ServicesStrip from "@/components/Layout/ServicesStrip";

const WorkPermitPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchCountry, setSearchCountry] = useState("");
  const [searchType, setSearchType] = useState("New Work Permit");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
const [activeTab, setActiveTab] = useState("overview");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset calculation: Main Navbar (~80px) + Secondary Nav (~60px)
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCountry) {
      navigate(`/work-permit/${searchCountry.toLowerCase().replace(" ", "-")}`);
    }
  };

  const highlights = [
    { icon: Zap, title: "Fast Processing", text: "Quick approval turnaround." },
    {
      icon: Clock,
      title: "Long-term Validity",
      text: "Permits valid for up to 2 years.",
    },
    {
      icon: ShieldCheck,
      title: "Govt. Approved",
      text: "100% legal and registered.",
    },
    {
      icon: FileText,
      title: "Complete Docs",
      text: "We handle all paperwork.",
    },
    { icon: Users, title: "Human Support", text: "24/7 expert assistance." },
    {
      icon: MessageCircle,
      title: "WhatsApp Help",
      text: "Instant updates on phone.",
    },
  ];

  const steps = [
    {
      id: 1,
      title: "Choose Country & Permit Type",
      desc: "Select your destination and permit type from our global network.",
    },
    {
      id: 2,
      title: "Submit Required Documents",
      desc: "Provide necessary identity and work papers through our secure portal.",
    },
    {
      id: 3,
      title: "Processing & Follow-up",
      desc: "Our experienced team coordinates directly with government bodies.",
    },
    {
      id: 4,
      title: "Permit Approval",
      desc: "Collect your verified and authenticated work permit successfully.",
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
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
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className={`sticky top-0 z-[60]`}>
          <ServicesStrip />
        </div>
 
      {/* Hero Section */}
<section className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
  <div className="absolute inset-0 z-0">
    <img
      src="../components/Layout/bld.png"
      alt="Work Permit Background"
      className="w-full h-full object-cover scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50" />
  </div>

  <div className="relative z-10 text-center px-4 max-w-5xl animate-in fade-in zoom-in duration-700">
    <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">
      Fast, Simple & Reliable Processing
    </span>

    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
      Work Permit <span className="text-4xl md:text-4xl lg:text-6xl font-black text-white mb-8  tracking-tight drop-shadow-2xl">
              (श्रम स्वीकृति)
            </span>
    </h1>
<section className="relative -mt-1 w-full px-4 md:px-8 z-20">
  <div className="max-w-7xl mx-auto px-4 md:px-8">
    <div className="bg-white p-2 rounded-[2rem] shadow-2xl mb-10 flex flex-col md:flex-row gap-2 border border-slate-100">

      {/* Country */}
      <div className="flex-1 flex items-center px-6 py-4 md:border-r border-slate-100">
        <Globe size={20} className="text-[#D92671] mr-4" />
        <div className="w-full">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Select Country
          </p>
          <select
            className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
          >
            <option value="">Search Country...</option>
            {workPermitCountries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          
        </div>
        
      </div>

      {/* Permit Type */}
      <div className="flex-1 flex items-center px-6 py-4 md:border-r border-slate-100">
        <FileText size={20} className="text-[#D92671] mr-4" />
        <div className="w-full">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Permit Type
          </p>
          <select
            className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option>New Work Permit</option>
            <option>Renewal Permit</option>
            <option>Status Change</option>
          </select>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleSearch}
        className="bg-[#D92671] text-white px-12 py-5 rounded-[1.5rem] font-black tracking-widest hover:brightness-110 transition-all shadow-xl active:scale-95"
      >
        SEARCH
      </button>
<a
                  href="https://wa.me/9779800000000"
                  className="bg-green-500 text-white px-4 py-5 rounded-[1.8rem] font-black text-xs tracking-widest flex items-center justify-center space-x-4 shadow-xl hover:bg-green-600 transition-all uppercase"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp Now</span>
                </a>
    </div>
  </div>
</section>
    <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-6 shadow-lg" />

    <p className="text-white/80 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
      "Fast work permit approvals for UAE, Qatar & beyond."
    </p>
  </div>
</section>






      {/* Secondary Sticky Navigation Bar - Adjusted to avoid overlap with Main Navbar */}
      <div className="sticky top-[76px] md:top-[76px] bg-white shadow-xl z-[40] border-b border-slate-100 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-center space-x-8 md:space-x-16">
          {[
            { id: "overview", label: "Overview" },
            { id: "services", label: "Services" },
            { id: "testimonials", label: "Testimonials" },
            { id: "process", label: "Process" },
            { id: "faqs", label: "FAQs" },
          ].map((tab) => (
            <button
              key={tab.id}
             onClick={() => { setActiveTab(tab.id);scrollToSection(tab.id);}}

             className={`text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors duration-300
  ${
    activeTab === tab.id
      ? "text-[#D92671]"
      : "text-[#2D1347] hover:text-[#D92671]"
  }
`}
>
              {tab.label}
              <span
  className={`absolute -bottom-1 left-0 h-0.5 bg-[#D92671] transition-all duration-300
    ${
      activeTab === tab.id
        ? "w-full"
        : "w-0 group-hover:w-full"
    }
  `}
/>

            </button>
          ))}
        </div>
      </div>

      {/* Overview Section */}
      <section
        id="overview"
        className="py-12 bg-white relative overflow-hidden scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[#D92671] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
                Our Expertise
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#2D1347] mb-8 tracking-tight">
                Permit Overview
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium mb-12">
                A Work Permit (श्रम स्वीकृति) is a mandatory legal document
                required to work abroad. We assist applicants with complete
                processing, documentation, government coordination, and status
                updates to ensure a smooth approval process for all countries
                including UAE, Qatar, Saudi Arabia and Malaysia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/9779800000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-10 py-5 rounded-[1.8rem] font-black text-xs tracking-widest flex items-center justify-center space-x-4 shadow-xl hover:bg-green-600 transition-all uppercase"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp Inquiry</span>
                </a>
                <a
                  href="tel:+97714240000"
                  className="bg-[#2D1347] text-white px-10 py-5 rounded-[1.8rem] font-black text-xs tracking-widest flex items-center justify-center space-x-4 shadow-xl hover:bg-slate-800 transition-all uppercase"
                >
                  <Phone size={20} />
                  <span>Talk to Expert</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="
        bg-white
        p-5
        rounded-[2.2rem]
        border border-[#D92671]/25
        shadow-lg
        transition-all duration-500
        group
        hover:bg-slate-50
        hover:border-slate-100
        hover:shadow-none
      "
                >
                  {/* Top row: text + icon */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-black text-[#2D1347] uppercase tracking-tight text-xs mb-2">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                        {item.text}
                      </p>
                    </div>

                    {/* Icon on RIGHT */}
                    <div
                      className="
            flex
            items-center
            justify-center
            bg-[#D92671]
            p-3
            rounded-xl
            text-white
            shadow-sm
            transform
            -translate-y-0.5
            transition-all duration-500
            group-hover:bg-white
            group-hover:text-[#D92671]
            group-hover:translate-y-0
            shrink-0
          "
                    >
                      <item.icon size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="py-12 bg-slate-50 relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D92671]/5 rounded-full blur-3xl -mr-48 -mt-48" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-[#D92671] font-black uppercase tracking-[0.3em] text-[13px] mb-3 block">
            Destinations
          </span>

          <h2 className="text-3xl md:text-5xl font-black text-[#2D1347] mb-14 tracking-tight">
            Our Work Permit Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {workPermitCountries.map((country) => (
              <div
                key={country.id}
                onClick={() => navigate(`/work-permit/${country.id}`)}
                className="bg-white p-6 rounded-[2.2rem] border border-slate-100 shadow-md group hover:shadow-xl transition-all duration-500 text-center cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 rounded-full -mr-10 -mt-10 group-hover:bg-[#D92671]/5 transition-all" />

                <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 inline-block">
                  {country.flag}
                </div>

                <h3 className="text-base font-black text-[#2D1347] mb-2 group-hover:text-[#D92671] transition-colors">
                  {country.name}
                </h3>

                <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-wider">
                  {country.desc}
                </p>

                <div className="bg-[#5D2A8E]/5 text-[#5D2A8E] py-2 rounded-xl font-black text-[9px] uppercase tracking-widest group-hover:bg-[#D92671] group-hover:text-white transition-all">
                  View
                </div>
              </div>
            ))}

            {/* CTA CARD */}
            <button
              onClick={() => navigate("/services")}
              className="bg-white p-6 rounded-[2.2rem] border border-slate-100 shadow-md group hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col items-center justify-center"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 rounded-full -mr-10 -mt-10 group-hover:bg-[#D92671]/10 transition-all" />

              <div className="w-14 h-14 rounded-2xl bg-[#D92671] text-white flex items-center justify-center transform -translate-y-1 group-hover:bg-white group-hover:text-[#D92671] group-hover:translate-y-0 transition-all duration-500">
                <ArrowRight size={22} />
              </div>

              <h3 className="text-sm font-black text-[#2D1347] mt-4 group-hover:text-[#D92671] transition-colors">
                See All
              </h3>

              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                Countries
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-20 overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
          alt="Why Choose Trip Himalaya"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-white">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-14">
            <span className="text-[#FF4FA3] font-black uppercase tracking-[0.3em] text-[10px]">
              The Advantage
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-4 tracking-[0.2em] uppercase">
              Why Choose Trip Himalaya?
            </h2>
            {/* optional small subtitle - remove if you don’t want */}
            <p className="text-xs md:text-sm text-white/75 max-w-4xl mx-auto mt-4 font-medium leading-relaxed">
              Reliable support, transparent process, and a team that takes
              responsibility from start to finish.
            </p>
          </div>

          {/* Grid – keep same data */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">
            {[
              {
                icon: ShieldCheck,
                text: "Experienced Processing Team",
                color: "text-blue-500",
              },
              {
                icon: Zap,
                text: "Transparent Pricing System",
                color: "text-yellow-600",
              },
              {
                icon: Clock,
                text: "Fast & Timely Response",
                color: "text-[#D92671]",
              },
              {
                icon: FileText,
                text: "Government Compliant Process",
                color: "text-[#5D2A8E]",
              },
              {
                icon: Heart,
                text: "Trusted by Hundreds of Clients",
                color: "text-red-500",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon chip (same as design 1) */}
                <div
                  className={`
              mb-4
              border border-white/30
              bg-white/10
              p-4
              rounded-full
              transition-all duration-300
              group-hover:border-white
              group-hover:scale-110
            `}
                >
                  {/* Keep your color (but on dark bg we force brightness) */}
                  <item.icon size={22} className={`text-white`} />
                </div>

                {/* Text (same data, styled like design 1) */}
                <p className="text-[11px] md:text-[12px] font-black uppercase tracking-widest leading-tight max-w-[160px]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Permit Testimonials */}
      <section id="testimonials" className="py-16 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D92671]/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5D2A8E]/5 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black text-[#2D1347] tracking-tight">
              Trusted Work Permit Processing
            </h2>

            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="h-1 w-10 bg-[#D92671] rounded-full" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                Real clients • Approvals • Support
              </p>
              <div className="h-1 w-10 bg-[#D92671] rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workPermitTestimonials.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-[2.2rem] border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden group flex flex-col"
              >
                <Quote
                  size={88}
                  className="absolute -top-6 -right-6 text-slate-100 group-hover:text-[#D92671]/10 transition-all duration-500 pointer-events-none"
                />

                {/* header row */}
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

                  {/* stars */}
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

                {/* message */}
                <p className="relative z-10 text-[#2D1347]/80 text-sm font-semibold leading-relaxed flex-grow">
                  <span className="text-[#D92671] font-serif text-xl mr-1">
                    “
                  </span>
                  {t.message}
                  <span className="text-[#D92671] font-serif text-xl ml-1">
                    ”
                  </span>
                </p>

                {/* bottom meta */}
                <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Verified Applicant
                  </span>

                  <div className="bg-[#D92671]/10 text-[#D92671] px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-[#D92671] group-hover:text-white transition-all">
                    Work Permit
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* See more testimonials */}
          <div className="mt-14 flex justify-center">
            <button
              onClick={() => navigate("/testimonials")}
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
      hover:bg-[#D92671]
      hover:text-white
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

      {/* Process Flow */}
      <section
        id="process"
        className="py-12 bg-white text-[#2D1347] relative overflow-hidden scroll-mt-20"
      >
        {/* subtle background texture */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-[#D92671]/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] bg-[#5D2A8E]/6 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#2D1347_1px,transparent_1px)] [background-size:46px_46px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[#D92671] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
              Our Workflow
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              How the Process Works
            </h2>
            <div className="h-1 w-24 bg-[#D92671] mx-auto rounded-full mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 relative">
            {/* connector line for desktop */}

            {steps.map((step, idx) => (
              <div
                key={step.id}
                className="relative flex flex-col items-center text-center group"
              >
                {/* STEP CIRCLE */}
                <div className="w-20 h-20 bg-[#D92671] rounded-full flex items-center justify-center text-3xl font-black mb-8 shadow-[0_18px_40px_rgba(217,38,113,0.25)] group-hover:scale-110 transition-transform duration-500 ring-8 ring-white relative z-10">
                  <span className="text-white">{step.id}</span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className="
            hidden md:block
            absolute
            top-[40px]
            left-1/2
            w-full
            pointer-events-none
          "
                  >
                    {/* We start from the circle center and push to the right edge of the circle */}
                    <div className="absolute left-[52px] flex items-center">
                      {/* long line */}
                      <span className="block h-1 w-[140px] lg:w-[180px] bg-[#D92671]/45 group-hover:bg-[#D92671]/70 transition-colors" />

                      {/* arrow head */}
                      <svg
                        width="27"
                        height="27"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="ml-2 text-[#D92671]/70 group-hover:text-[#D92671] transition-colors"
                      >
                        <path
                          d="M9 5l8 7-8 7"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                <h4 className="text-xl font-black mb-4 uppercase tracking-tight leading-tight">
                  {step.title}
                </h4>

                <p className="text-sm text-[#2D1347]/55 font-semibold leading-relaxed max-w-[250px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ – below Testimonials, above CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div id="faqs" className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-[#2D1347] mb-8">
              Frequently Asked Questions (FAQs)
            </h2>

            <div className="space-y-4">
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

      {/* CTA Strip – Work Permit (styled like 2nd) */}
      <section className="bg-gradient-to-r from-[#D92671] to-[#E91E63] py-16 relative overflow-hidden">
        {/* subtle decorative icon (optional, matches premium feel) */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#2D1347]/15 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          {/* Left content */}
          <div className="text-center md:text-left max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Ready to Apply for Work Permit?
            </h2>
            <p className="text-white/90 font-bold text-lg md:text-xl">
              Search permits or talk to our team for guidance.
            </p>
          </div>

          {/* Right actions */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-white text-[#D92671] px-12 py-5 rounded-full font-black tracking-widest hover:bg-slate-50 transition-all shadow-2xl uppercase text-[11px]"
            >
              SEARCH PERMIT
            </button>

            <a
              href="https://wa.me/9779800000000"
              className="bg-[#2D1347] text-white px-12 py-5 rounded-full font-black tracking-widest hover:brightness-125 transition-all shadow-2xl uppercase text-[11px] inline-flex items-center gap-3"
            >
              <MessageCircle size={18} />
              WHATSAPP INQUIRY
            </a>
          </div>
        </div>
      </section>

      {/* 
        <FloatingWhatsApp /> */}
    </div>
  );
};

const FloatingWhatsApp = () => (
  <a
    href="https://wa.me/9779800000000"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-8 right-8 z-[1000] bg-green-500 text-white p-6 rounded-full shadow-[0_30px_60px_rgba(34,197,94,0.4)] hover:scale-110 transition-transform animate-bounce"
  >
    <MessageCircle size={32} />
  </a>
);

export default WorkPermitPage;