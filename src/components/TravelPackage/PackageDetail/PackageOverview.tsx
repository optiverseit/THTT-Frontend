import React from "react";
import { useOutletContext } from "react-router-dom";
import type { Package } from "../../../assets/data/types";
import { CheckCircle2, Clock, MapPin } from "lucide-react";
import IncludesExclude from "./IncludesExclude";
import PackagePricing from "./PackagePricing";
import TripRoadmap, { type RoadmapStep } from "../../reusable/TripRoadmap";
import { formatDescription } from "../../../utils/formatDescription";

interface PackageProp {
  pkg: Package;
  allItenary?: { day: string; title: string; desc: string }[];
  highlights?: string[];
  highlightDetails?: any[];
}

const PackageOverview: React.FC = () => {
  const context = useOutletContext<PackageProp & { [key: string]: any }>() || {};
  const { pkg, allItenary } = context;

  // ── Extract highlights safely from context or package data ──
  const highlightsList: string[] = React.useMemo(() => {
    const raw = (Array.isArray(context.highlights) && context.highlights.length > 0)
      ? context.highlights
      : (Array.isArray(pkg?.highlights) && pkg.highlights.length > 0)
      ? pkg.highlights
      : (Array.isArray(context.highlightDetails) && context.highlightDetails.length > 0)
      ? context.highlightDetails.map((h: any) => h?.highlight || "").filter(Boolean)
      : (Array.isArray((pkg as any)?.highlightDetails)
        ? (pkg as any).highlightDetails.map((h: any) => h?.highlight || "").filter(Boolean)
        : []);

    return raw
      .map((item: any) => (typeof item === "string" ? item.trim() : (item?.highlight || item?.title || "")))
      .filter((item: string) => item.length > 0);
  }, [context.highlights, context.highlightDetails, pkg?.highlights, (pkg as any)?.highlightDetails]);

  // ── Extract roadmap/itinerary steps from real API data ──
  const rawItinerary = React.useMemo(() => {
    if (Array.isArray(allItenary) && allItenary.length > 0) return allItenary;
    if (Array.isArray(pkg?.itinerary) && pkg.itinerary.length > 0) return pkg.itinerary;
    if (Array.isArray((pkg as any)?.itineraries) && (pkg as any).itineraries.length > 0) return (pkg as any).itineraries;
    return [];
  }, [allItenary, pkg?.itinerary, (pkg as any)?.itineraries]);

  const roadmapSteps: RoadmapStep[] = React.useMemo(() => {
    if (!Array.isArray(rawItinerary) || rawItinerary.length === 0) return [];

    return rawItinerary
      .filter((item: any) => {
        if (!item) return false;
        const title = (item.title || "").trim();
        const desc = (item.desc || item.description || "").trim();
        const day = (item.day || "").trim();
        return title.length > 0 || desc.length > 0 || day.length > 0;
      })
      .map((item: any, idx: number) => ({
        step: idx + 1,
        day: item.day || `Day ${String(idx + 1).padStart(2, "0")}`,
        schedule: (item as any).schedule || "",
        title: item.title || "",
        description: item.desc || (item as any).description || "",
        tags: Array.isArray((item as any).tags)
          ? (item as any).tags
          : [],
      }));
  }, [rawItinerary]);

  if (!pkg) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* ── LEFT CONTENT (8 cols) ── */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Header Info */}
          <div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-[#200B3B] leading-tight">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm font-bold text-gray-500">
              {pkg.location && (
                <span className="flex items-center gap-1.5 text-[#E91E63]">
                  <MapPin size={13} />
                  <span className="text-gray-700">{pkg.location}</span>
                </span>
              )}

              {pkg.duration && (
                <span className="flex items-center gap-1.5 text-[#E91E63]">
                  <Clock size={13} />
                  <span className="text-gray-700">{pkg.duration}</span>
                </span>
              )}

              {pkg.difficulty && (
                <span className="bg-pink-50 text-[#E91E63] px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                  {pkg.difficulty}
                </span>
              )}
            </div>

            <div
              className="mt-3 sm:mt-4"
              dangerouslySetInnerHTML={{
                __html: formatDescription(pkg.description) ||
                  `<p style="color:#4B5563;font-size:0.875em;line-height:1.7;">Discover the breathtaking beauty and thrilling experiences of ${pkg.title}. Designed with safety, comfort, and unforgettable memories in mind.</p>`
              }}
            />
          </div>

          {/* ── PRICING TIER ON MOBILE (Just below header info) ── */}
          <div id="pricing-section" className="lg:hidden">
            <PackagePricing pkg={pkg} />
          </div>

          {/* Trip Highlights Card (Only show if highlights data is available) */}
          {highlightsList.length > 0 && (
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-3 sm:space-y-4">
              <h2 className="flex items-center gap-2 sm:gap-2.5 text-base sm:text-xl font-black text-[#200B3B]">
                <CheckCircle2 size={18} className="text-[#E91E63]" />
                <span>Trip Highlights</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
                {highlightsList.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm font-semibold text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TRIP ROADMAP (Only show if roadmap/itinerary steps are available) ── */}
          {roadmapSteps.length > 0 && (
            <TripRoadmap steps={roadmapSteps} />
          )}

          {/* Inclusions & Exclusions */}
          <IncludesExclude />
        </div>

        {/* ── PRICING SIDEBAR (4 cols sticky on desktop, hidden on mobile) ── */}
        <div id="pricing-section-desktop" className="hidden lg:block lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <PackagePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default PackageOverview;
