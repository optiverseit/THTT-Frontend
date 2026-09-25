import React from "react";
import { MapPin, Flag } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface RoadmapStep {
  /** Step number shown in the big circle (auto-generated if not passed) */
  step?: number;
  /** e.g. "Day 01" */
  day: string;
  /** e.g. "Full Day Schedule" or "Half Day" */
  schedule?: string;
  /** e.g. "Arrival & Welcome" */
  title: string;
  /** Paragraph description */
  description?: string;
  /** Small tag pills shown at the bottom of the card */
  tags?: string[];
}

interface TripRoadmapProps {
  steps: RoadmapStep[];
  /** Heading for the whole block – defaults to "Trip Roadmap" */
  heading?: string;
  /** Sub-heading – defaults to "DAY-BY-DAY DETAILED ITINERARY" */
  subheading?: string;
  /** Footer message – defaults to "Safe travels back home with unforgettable memories." */
  endMessage?: string;
  /** Footer heading – defaults to "END OF JOURNEY" */
  endHeading?: string;
}

// ─────────────────────────────────────────────
// HELPER – zero-pad number
// ─────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, "0");

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

const TripRoadmap: React.FC<TripRoadmapProps> = ({
  steps,
  heading = "Trip Roadmap",
  subheading = "DAY-BY-DAY DETAILED ITINERARY",
  endMessage = "Safe travels back home with unforgettable memories.",
  endHeading = "END OF JOURNEY",
}) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-full font-sans">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-7">
        <div>
          <h2 className="text-xl sm:text-[1.6rem] font-black text-[#200B3B] leading-tight flex items-center gap-2.5">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#E91E63,#9C27B0)" }}
            >
              <MapPin size={14} className="text-white" />
            </span>
            {heading}
          </h2>
          <p className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-[0.18em] text-gray-400 mt-1 ml-[2.6rem]">
            {subheading}
          </p>
        </div>
      </div>

      {/* ── STEPS ── */}
      <div className="relative">

        {/* Vertical connector line */}
        <div
          className="absolute left-[21px] sm:left-[23px] top-0 bottom-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom,#E91E63 0%,#9C27B0 60%,transparent 100%)",
            opacity: 0.18,
          }}
          aria-hidden="true"
        />

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const stepNum = step.step ?? idx + 1;

            return (
              <div key={idx} className="flex items-start gap-3.5 sm:gap-4">

                {/* ── Step circle ── */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div
                    className="relative z-10 flex items-center justify-center rounded-full text-white font-black text-xs sm:text-sm shadow-md"
                    style={{
                      width: 44,
                      height: 44,
                      background:
                        "linear-gradient(135deg,#E91E63,#9C27B0)",
                      boxShadow: "0 0 0 4px rgba(233,30,99,0.12)",
                    }}
                  >
                    {pad(stepNum)}
                  </div>
                </div>

                {/* ── Card ── */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  {/* Day badge row */}
                  <div className="flex flex-wrap items-center gap-2 px-4 pt-3.5 pb-0">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white"
                      style={{
                        background:
                          "linear-gradient(90deg,#E91E63,#9C27B0)",
                      }}
                    >
                      {step.day}
                    </span>
                    {step.schedule && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        <span className="w-3 h-px bg-gray-300 rounded-full" />
                        {step.schedule}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div className="px-4 pt-2 pb-1">
                    <h3 className="text-[15px] sm:text-[17px] font-black text-[#200B3B] leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  {step.description && (
                    <div className="px-4 pb-3">
                      <p className="text-xs sm:text-[13px] text-gray-500 font-medium leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {step.tags && step.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3.5 pt-1.5 border-t border-gray-50">
                      {step.tags.map((tag, ti) => (
                        <span
                          key={ti}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#E91E63] bg-pink-50 border border-pink-100"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#E91E63]" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── END OF JOURNEY FOOTER CARD ── */}
      <div className="mt-5 ml-[48px] sm:ml-[56px]">
        <div
          className="flex items-center gap-3.5 p-4 sm:p-5 rounded-xl"
          style={{
            background: "linear-gradient(135deg,#200B3B,#3B145C)",
          }}
        >
          <div
            className="flex-shrink-0 w-9 h-9 rounded-full border-2 border-white/20 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <Flag size={15} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-[0.18em] text-white/60 mb-0.5">
              {endHeading}
            </p>
            <p className="text-xs sm:text-[13px] font-semibold text-white/80 leading-relaxed">
              {endMessage}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TripRoadmap;
