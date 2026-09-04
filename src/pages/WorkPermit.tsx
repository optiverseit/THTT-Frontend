import BannerSection from "./../components/reuseable/BannerSection";
import { FileText, Globe, Shield, Clock, Zap, Heart } from "lucide-react";
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
          <BannerSection
            background="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
            alt="Work Permit"
            heading="FAST, SIMPLE & RELIABLE PROCESSING"
            title="Work Permit (श्रम स्वीकृति)"
            description="Fast work permit approvals for UAE, Qatar & beyond."
          />

          {/* Floating Search Bar */}
          <div className="max-w-4xl mx-auto px-4 -mt-8 sm:-mt-12 relative z-20">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                <Globe size={18} className="text-pink-500 flex-shrink-0" />
                <div className="flex flex-col w-full">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    SELECT COUNTRY
                  </label>
                  <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1">
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
                <div className="flex flex-col w-full">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    PERMIT TYPE
                  </label>
                  <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1">
                    <option value="new">New Work Permit</option>
                    <option value="renew">Renewal Permit</option>
                    <option value="individual">Individual Permit</option>
                  </select>
                </div>
              </div>

              <button className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap">
                SEARCH
              </button>
            </div>
          </div>

          {/* Sub-navigation Tabs — scroll to section */}
          <div className="mt-8 flex justify-center items-center px-4 overflow-x-auto">
            <div className="flex gap-4 sm:gap-8 border-b border-gray-200 pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id, tab.name)}
                  className={`py-1 font-bold tracking-widest text-xs transition-colors whitespace-nowrap ${
                    activeTab === tab.name
                      ? "border-b-2 border-pink-600 text-pink-600 -mb-[9px]"
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
        btn1="SEARCH PERMIT"
        btn2="WHATSAPP INQUIRY"
      />
    </>
  );
};

export default WorkPermit;
