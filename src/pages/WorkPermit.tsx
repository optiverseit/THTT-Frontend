import BannerSection from "./../components/reuseable/BannerSection";
import { FileText, Globe, Shield, ShieldCheck, Clock, Zap, Heart } from "lucide-react";
import { useState } from "react";
import PermitServices from "../components/work-permit/PermitServices";
import HeroSection from "../components/reuseable/HeroSection";
import Testimonials from "../components/reuseable/Testimonials";
import { workPermitTestimonials } from "../assets/data/mockData";
import WorkPermitProcess from "../components/work-permit/WorkPermitProcess";
import WorkPermitFaq from "../components/work-permit/WorkPermitFaq";
import WorkPermitOverview from "../components/work-permit/WorkPermitOverview";
import PreFooter from "../components/reuseable/PreFooter";

const WorkPermit = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { name: "OVERVIEW", id: "section-overview" },
    { name: "SERVICES", id: "section-services" },
    { name: "WHY US", id: "section-whyus" },
    { name: "TESTIMONIES", id: "section-testimonies" },
    { name: "PROCESS", id: "section-process" },
    { name: "FAQS", id: "section-faqs" },
  ];

  const scrollToSection = (id: string, tabName: string) => {
    setActiveTab(tabName);
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // account for sticky header
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="w-full relative shadow-md bg-white">
          {/* ── WORK PERMIT HERO (Activities-style) ── */}
          <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
              alt="Work Permit"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
            <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
              <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
                  FAST, SIMPLE &amp; RELIABLE PROCESSING
                </span>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
                  Work Permit (श्रम स्वीकृति)
                </h1>
                <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
              </div>

              {/* Search Bar */}
              <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                    <Globe size={18} className="text-pink-500 flex-shrink-0" />
                    <div className="flex flex-col w-full text-left">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SELECT COUNTRY</label>
                      <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                        <option value="">All Countries</option>
                        <option value="uae">UAE (Dubai)</option>
                        <option value="qatar">Qatar</option>
                        <option value="saudi">Saudi Arabia</option>
                        <option value="kuwait">Kuwait</option>
                        <option value="malaysia">Malaysia</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                    <FileText size={18} className="text-pink-500 flex-shrink-0" />
                    <div className="flex flex-col w-full text-left">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">PERMIT TYPE</label>
                      <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                        <option value="new">New Work Permit</option>
                        <option value="renew">Renewal Permit</option>
                        <option value="individual">Individual Permit</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => scrollToSection("section-services", "SERVICES")}
                    className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
                  >
                    SEARCH
                  </button>
                </div>
              </div>

              <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">
                "Fast work permit approvals for UAE, Qatar &amp; beyond."
              </p>

              {/* 4 Hero Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
                {[
                  { icon: Zap, label: "Fast Processing", desc: "Quick Approval Turnaround" },
                  { icon: ShieldCheck, label: "Govt. Approved", desc: "100% Legal & Registered" },
                  { icon: Clock, label: "2-Year Validity", desc: "Long-Term Permits" },
                  { icon: FileText, label: "Complete Docs", desc: "We Handle All Paperwork" },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform">
                        <Icon size={14} />
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4>
                        <p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Sub-navigation Tabs — scroll to section */}
          <div className="flex justify-center items-center px-4 overflow-x-auto py-3 border-b border-gray-200/90 shadow-xs">
            <div className="flex gap-4 sm:gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id, tab.name)}
                  className={`py-1 font-bold tracking-widest text-xs transition-colors whitespace-nowrap ${
                    activeTab === tab.name
                      ? "border-b-2 border-pink-600 text-pink-600"
                      : "text-purple-950 hover:text-pink-500"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
          </div>


        {/* OVERVIEW Section */}
        <div id="section-overview" className="w-full max-w-7xl px-4 sm:px-6 md:px-8 mt-8">
          <WorkPermitOverview />
        </div>
      </div>

      {/* SERVICES Section */}
      <div id="section-services">
        <PermitServices />
      </div>

      {/* WHY US Section */}
      <div id="section-whyus">
        <HeroSection
          title="WHY CHOOSE US"
          subject="Why Choose Trip Himalaya?"
          description="Reliable support, transparent process, and a team that takes responsibility from start to finish."
          backgroundImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
          services={[
            { name: "EXPERIENCED PROCESSING TEAM", icon: Shield },
            { name: "TRANSPARENT PRICING SYSTEM", icon: Zap },
            { name: "FAST & TIMELY RESPONSE", icon: Clock },
            { name: "GOVERNMENT COMPLIANT PROCESS", icon: FileText },
            { name: "TRUSTED BY HUNDREDS OF CLIENTS", icon: Heart },
          ]}
        />
      </div>

      {/* TESTIMONIES Section */}
      <div id="section-testimonies">
        <Testimonials workTest={workPermitTestimonials} />
      </div>

      {/* PROCESS Section */}
      <div id="section-process">
        <WorkPermitProcess />
      </div>

      {/* FAQS Section */}
      <div id="section-faqs">
        <WorkPermitFaq />
      </div>

      <PreFooter
        title="Ready to Apply for Work Permit?"
        description="Search permits or talk to our team for guidance."
        btn1="Search Permit"
        btn2="WhatsApp Inquiry"
      />
    </>
  );
};

export default WorkPermit;
