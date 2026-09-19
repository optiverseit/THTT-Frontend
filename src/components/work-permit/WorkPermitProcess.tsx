import React, { useState } from "react";
import {
  Globe,
  FileSearch,
  Share2,
  Printer,
  MessageCircle,
  FileText,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  BellRing,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface WorkflowStep {
  id: string;
  stepNum: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  highlights: string[];
  tagColor: string;
  metaBadge?: string;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: "step-1",
    stepNum: "01",
    badge: "DISCOVERY & SEARCH",
    title: "Work Permit Main Page",
    subtitle: "Select Destination Country & Permit Category",
    description:
      "Explore comprehensive labor permit services for countries like UAE, Qatar, Saudi Arabia, Kuwait, and European destinations. Use the search bar to filter by country and permit type.",
    icon: Globe,
    highlights: [
      "Real-time country permit directory",
      "Filter by New Permit, Renewal, or Individual",
      "Overview of processing times and government fees",
    ],
    tagColor: "from-purple-600 to-indigo-600",
  },
  {
    id: "step-2",
    stepNum: "02",
    badge: "CONVERSION PAGE",
    title: "Country Detail Page",
    subtitle: "In-depth Information with Share & Print Tools",
    description:
      "Review specific labor requirements, age-based government cost breakdowns, required documents checklist, and policy details. Applicants can share the page with family or print documentation on demand.",
    icon: FileSearch,
    highlights: [
      "Share with friends or employer via WhatsApp, Facebook, or Copy Link",
      "1-Click Print view for offline reference and employer review",
      "Age-group cost breakdown and requirements checklist",
    ],
    tagColor: "from-pink-600 to-rose-600",
    metaBadge: "Share & Print Available",
  },
  {
    id: "step-3-4",
    stepNum: "03 & 04",
    badge: "TWO CONVERSION CHANNELS",
    title: "Online Application & WhatsApp Inquiry",
    subtitle: "Fast 3-Step Digital Form or 1-on-1 WhatsApp Chat",
    description:
      "Choose between instant WhatsApp counselor guidance or direct Online Application divided into 3 rapid stages to ensure zero friction.",
    icon: Sparkles,
    highlights: [
      "Step A: Basic Information (Quick 30-sec form)",
      "Step B: Document Upload (Passport, Visa, Arrival stamp)",
      "Step C: Review & Final Submit with verification preview",
    ],
    tagColor: "from-blue-600 to-cyan-600",
    metaBadge: "30-Sec Fast Apply",
  },
  {
    id: "step-5-7",
    stepNum: "05 - 07",
    badge: "MOST IMPORTANT PART",
    title: "After Submit & Notification System",
    subtitle: "Admin Verification, FEO Coordination & Live Alerts",
    description:
      "Once submitted, our dedicated admin team conducts thorough document authentication and interfaces directly with the Foreign Employment Office (FEO/DOFE). The notification system keeps you updated at every milestone.",
    icon: BellRing,
    highlights: [
      "Step 5: Instant Application Receipt & Unique Tracking ID",
      "Step 6: Admin Side verification, biometric checks & Shram filing",
      "Step 7: Automated Notification System via WhatsApp, SMS & Email",
    ],
    tagColor: "from-emerald-600 to-teal-600",
    metaBadge: "Crucial Stage",
  },
];

const WorkPermitProcess: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = workflowSteps[activeStepIndex];

  return (
    <section className="w-full bg-gradient-to-b from-white via-slate-50 to-white py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2D1347] tracking-tight">
            How the Work Permit Process Works
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto my-4" />
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            From initial destination discovery to automated real-time notifications,
            experience a transparent and verified labor approval process.
          </p>
        </div>

        {/* Top Level Diagram Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStepIndex === idx;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-pink-500 shadow-xl shadow-pink-100/60 ring-2 ring-pink-500/20 -translate-y-1"
                    : "bg-white/80 hover:bg-white border-gray-200 hover:border-pink-300 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Step number badge & icon */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        isSelected
                          ? "bg-pink-600 text-white shadow-sm"
                          : "bg-purple-100/70 text-purple-900"
                      }`}
                    >
                      Step {step.stepNum}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform ${
                        isSelected
                          ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md scale-105"
                          : "bg-pink-50 text-pink-600"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-[#2D1347] text-lg mb-1 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-pink-600 mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                    {step.description}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {step.badge}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${
                      isSelected ? "text-pink-600 translate-x-1" : "text-gray-300"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Interactive Workflow Breakdown */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-50/50 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10">
            {/* Header of Active Step */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D1347] to-purple-900 text-white flex items-center justify-center shadow-lg shadow-purple-950/20 flex-shrink-0">
                  <activeStep.icon size={26} className="text-pink-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 uppercase tracking-wider">
                      Stage {activeStep.stepNum}
                    </span>
                    {activeStep.metaBadge && (
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase tracking-wider">
                        {activeStep.metaBadge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] mt-1">
                    {activeStep.title}
                  </h3>
                </div>
              </div>

              {/* Step Navigator */}
              <div className="flex items-center gap-2 self-start md:self-auto bg-gray-50 p-1.5 rounded-2xl border border-gray-200/80">
                {workflowSteps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStepIndex(i)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      activeStepIndex === i
                        ? "bg-[#E91E63] text-white shadow-sm"
                        : "text-gray-500 hover:text-purple-950"
                    }`}
                  >
                    Step {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
              {/* Left Column: Description & Key Highlights */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    STAGE OBJECTIVE
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {activeStep.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    CORE FEATURES &amp; DELIVERABLES
                  </h4>
                  <div className="space-y-3">
                    {activeStep.highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 hover:border-pink-200 transition-colors"
                      >
                        <CheckCircle2
                          size={18}
                          className="text-pink-600 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-sm font-semibold text-gray-800 leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Architecture Preview of each stage */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#2D1347] to-[#1a0b2b] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl" />

                {/* Contextual Visualizer for Active Step */}
                {activeStepIndex === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">
                        Discovery Interface
                      </span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-300">
                        Main Page
                      </span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-gray-200">
                        <Globe size={14} className="text-pink-400" />
                        <span>Filter Country &bull; Select Category</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                          🇦🇪 UAE / Dubai
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                          🇶🇦 Qatar
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                          🇸🇦 Saudi Arabia
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                          🇰🇼 Kuwait
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-300 text-center">
                        Direct links to detailed destination conversion pages
                      </p>
                    </div>
                  </div>
                )}

                {activeStepIndex === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">
                        Conversion Page Highlights
                      </span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-300">
                        Detail Page
                      </span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
                      <div className="flex items-center justify-around gap-2">
                        <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 border border-white/15 w-full text-center">
                          <Share2 size={20} className="text-pink-400 mb-1" />
                          <span className="text-xs font-bold">Share Tool</span>
                          <span className="text-[10px] text-gray-300">WhatsApp, Link</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 border border-white/15 w-full text-center">
                          <Printer size={20} className="text-blue-400 mb-1" />
                          <span className="text-xs font-bold">Print View</span>
                          <span className="text-[10px] text-gray-300">PDF / Paper</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-center">
                        <span className="text-xs font-bold text-pink-200">
                          Dual Action Conversion:
                        </span>
                        <div className="flex justify-center gap-2 mt-1.5 text-[11px] font-bold">
                          <span className="px-2 py-0.5 rounded-md bg-green-500/80 text-white">
                            WhatsApp Inquire
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-pink-600 text-white">
                            Online Application
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStepIndex === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">
                        Application Breakdown
                      </span>
                      <span className="text-[10px] bg-pink-500/30 text-pink-200 px-2 py-0.5 rounded-full font-bold">
                        3-Step Wizard
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-pink-500 text-white text-[11px] font-black flex items-center justify-center">
                            A
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">
                              Basic Information
                            </p>
                            <p className="text-[10px] text-gray-300">
                              Name, phone, country, DOB
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-green-400 bg-green-950/40 px-2 py-0.5 rounded-md border border-green-500/30">
                          ~30 sec form
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-[11px] font-black flex items-center justify-center">
                            B
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">
                              Document Upload
                            </p>
                            <p className="text-[10px] text-gray-300">
                              Passport, visa copy, arrival stamp
                            </p>
                          </div>
                        </div>
                        <UploadCloud size={16} className="text-blue-400" />
                      </div>

                      <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-[11px] font-black flex items-center justify-center">
                            C
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">
                              Review &amp; Submit
                            </p>
                            <p className="text-[10px] text-gray-300">
                              Final verification before filing
                            </p>
                          </div>
                        </div>
                        <CheckCircle2 size={16} className="text-purple-400" />
                      </div>
                    </div>
                  </div>
                )}

                {activeStepIndex === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                        Post-Submission Execution
                      </span>
                      <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                        Most Important Part
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-start gap-3">
                        <ShieldCheck size={18} className="text-pink-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-white">
                            Step 5 &amp; 6: Admin Side Verification
                          </p>
                          <p className="text-[10px] text-gray-300 mt-0.5 leading-relaxed">
                            Team authenticates documents, verifies foreign embassy stamps, and coordinates directly with Foreign Employment Office (FEO).
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-start gap-3">
                        <BellRing size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-emerald-200">
                            Step 7: Automated Notification System
                          </p>
                          <p className="text-[10px] text-emerald-100/90 mt-0.5 leading-relaxed">
                            Real-time SMS &amp; WhatsApp milestone updates: Submitted &rarr; In Verification &rarr; FEO Approved &rarr; Shram Issued!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom navigation helper */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    Stage {activeStepIndex + 1} of {workflowSteps.length}
                  </span>
                  {activeStepIndex < workflowSteps.length - 1 ? (
                    <button
                      onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                      className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Next Stage</span>
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveStepIndex(0)}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Back to Stage 1</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Process Flow Line (Step 1 to 7) */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <h4 className="text-xs font-bold text-purple-950 uppercase tracking-widest text-center mb-6">
            Complete Workflow Architecture at a Glance
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
            {[
              { num: "1", title: "Main Page", sub: "Explore & Filter" },
              { num: "2", title: "Detail Page", sub: "Share & Print" },
              { num: "3", title: "Inquire", sub: "WhatsApp Chat" },
              { num: "4", title: "Application", sub: "3-Step Wizard" },
              { num: "5", title: "After Submit", sub: "File Queued" },
              { num: "6", title: "Admin Side", sub: "FEO Processing" },
              { num: "7", title: "Notifications", sub: "SMS & WhatsApp" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative p-3 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center group hover:bg-pink-50 hover:border-pink-200 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-purple-950 text-white text-[11px] font-black flex items-center justify-center mb-1 group-hover:bg-pink-600 transition-colors">
                  {item.num}
                </span>
                <span className="text-xs font-extrabold text-[#2D1347] leading-tight">
                  {item.title}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkPermitProcess;
