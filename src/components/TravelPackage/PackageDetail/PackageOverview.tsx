import React from "react";
import { useOutletContext } from "react-router-dom";
import type { Package } from "../../../assets/data/types";
import { CheckCircle2, Clock, MapPin } from "lucide-react";
import IncludesExclude from "./IncludesExclude";
import PackagePricing from "./PackagePricing";
import TripRoadmap, { type RoadmapStep } from "../../reusable/TripRoadmap";


interface PackageProp {
  pkg: Package;
  allItenary: { day: string; title: string; desc: string }[];
}

// ─────────────────────────────────────────────
// MOCK ROADMAP DATA (used as fallback when API itinerary is empty)
// Replace / remove once the API provides itinerary steps.
// ─────────────────────────────────────────────
const MOCK_ROADMAP_STEPS: RoadmapStep[] = [
  {
    day: "Day 01",
    schedule: "Full Day Schedule",
    title: "Arrival & Welcome",
    description:
      "Our representative will receive you and transfer you to your accommodation. Evening free for local exploration.",
    tags: ["Breakfast", "Guided Sightseeing"],
  },
  {
    day: "Day 02",
    schedule: "Full Day Schedule",
    title: "Full Day Sightseeing",
    description:
      "Visit the most famous landmarks and cultural heritage sites of the region with our expert guide.",
    tags: ["Breakfast", "Guided Sightseeing"],
  },
  {
    day: "Day 03",
    schedule: "Full Day Schedule",
    title: "Final Departure",
    description:
      "Transfer to the airport or bus station for your onward journey home with beautiful memories.",
    tags: ["Breakfast", "Guided Sightseeing"],
  },
];

const PackageOverview: React.FC = () => {
  const { pkg, allItenary } = useOutletContext<PackageProp>();

  // ── Build roadmap steps from real API data; fall back to mock ──
  const roadmapSteps: RoadmapStep[] =
    Array.isArray(allItenary) && allItenary.length > 0
      ? allItenary.map((item, idx) => ({
          step: idx + 1,
          day: item.day || `Day ${String(idx + 1).padStart(2, "0")}`,
          schedule: (item as any).schedule ?? "Full Day Schedule",
          title: item.title,
          description: item.desc || (item as any).description || "",
          tags: (item as any).tags ?? ["Breakfast", "Guided Sightseeing"],
        }))
      : MOCK_ROADMAP_STEPS;


  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT CONTENT (8 cols) ── */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Info */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#200B3B] leading-tight">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm font-bold text-gray-500">
              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <MapPin size={15} />
                <span className="text-gray-700">{pkg.location}</span>
              </span>

              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <Clock size={15} />
                <span className="text-gray-700">{pkg.duration}</span>
              </span>

              {pkg.difficulty && (
                <span className="bg-pink-50 text-[#E91E63] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {pkg.difficulty}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed font-medium">
              {pkg.description ||
                `Discover the breathtaking beauty and thrilling experiences of ${pkg.title}. Designed with safety, comfort, and unforgettable memories in mind.`}
            </p>
          </div>

          {/* Trip Highlights Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-black text-[#200B3B]">
              <CheckCircle2 size={20} className="text-[#E91E63]" />
              <span>Trip Highlights</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {pkg.highlights?.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── TRIP ROADMAP ── */}
          <TripRoadmap steps={roadmapSteps} />

          {/* Inclusions & Exclusions */}
          <IncludesExclude />
        </div>

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols) ── */}
        <div id="pricing-section" className="lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <PackagePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default PackageOverview;
