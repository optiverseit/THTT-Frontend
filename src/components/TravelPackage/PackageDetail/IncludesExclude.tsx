import React, { useMemo } from "react";
import type { Package } from "../../../assets/data/types";
import { useOutletContext } from "react-router-dom";
import {
  Check,
  X,
  AlertTriangle,
  Backpack,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Prop {
  pkg?: Package;
  allIncludes?: Package["includes"];
  allExcludes?: Package["excludes"];
  restrictions?: Package["restrictions"];
  whatToBring?: Package["whatToBring"];
}

const IncludesExclude: React.FC = () => {
  const context = useOutletContext<Prop & { [key: string]: any }>() || {};
  const { pkg } = context;

  const validIncludes: string[] = useMemo(() => {
    const raw = (Array.isArray(context.allIncludes) && context.allIncludes.length > 0)
      ? context.allIncludes
      : (Array.isArray(pkg?.includes) ? pkg.includes : []);

    return raw
      .map((item: any) => (typeof item === "string" ? item.trim() : (item?.item || item?.name || "").trim()))
      .filter((item: string) => item.length > 0);
  }, [context.allIncludes, pkg?.includes]);

  const validExcludes: string[] = useMemo(() => {
    const raw = (Array.isArray(context.allExcludes) && context.allExcludes.length > 0)
      ? context.allExcludes
      : (Array.isArray(pkg?.excludes) ? pkg.excludes : []);

    return raw
      .map((item: any) => (typeof item === "string" ? item.trim() : (item?.item || item?.name || "").trim()))
      .filter((item: string) => item.length > 0);
  }, [context.allExcludes, pkg?.excludes]);

  const validRestrictions: string[] = useMemo(() => {
    const raw = (Array.isArray(context.restrictions) && context.restrictions.length > 0)
      ? context.restrictions
      : (Array.isArray(pkg?.restrictions) ? pkg.restrictions : []);

    return raw
      .map((item: any) => (typeof item === "string" ? item.trim() : (item?.restriction || item?.item || item?.name || "").trim()))
      .filter((item: string) => item.length > 0);
  }, [context.restrictions, pkg?.restrictions]);

  const validWhatToBring: string[] = useMemo(() => {
    const raw = (Array.isArray(context.whatToBring) && context.whatToBring.length > 0)
      ? context.whatToBring
      : (Array.isArray(pkg?.whatToBring)
        ? pkg.whatToBring
        : (Array.isArray((pkg as any)?.what_to_bring) ? (pkg as any).what_to_bring : []));

    return raw
      .map((item: any) => (typeof item === "string" ? item.trim() : (item?.item || item?.name || "").trim()))
      .filter((item: string) => item.length > 0);
  }, [context.whatToBring, pkg?.whatToBring, (pkg as any)?.what_to_bring]);

  const hasIncludes = validIncludes.length > 0;
  const hasExcludes = validExcludes.length > 0;
  const hasInclusionsSection = hasIncludes || hasExcludes;

  const hasRestrictions = validRestrictions.length > 0;
  const hasWhatToBring = validWhatToBring.length > 0;
  const hasRequirementsSection = hasRestrictions || hasWhatToBring;

  if (!hasInclusionsSection && !hasRequirementsSection) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── 1. INCLUDED & EXCLUDED CARDS ── */}
      {hasInclusionsSection && (
        <div className={`grid grid-cols-1 ${hasIncludes && hasExcludes ? "md:grid-cols-2" : ""} gap-4 sm:gap-6`}>
          {/* Included Card (Emerald / Green) */}
          {hasIncludes && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl shadow-sm space-y-3 sm:space-y-4">
              <header className="flex items-center gap-2.5 pb-2 border-b border-white/20">
                <div className="p-1.5 bg-white text-emerald-600 rounded-lg shadow-sm">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">What's Included</h3>
              </header>

              <div className="space-y-2 sm:space-y-2.5">
                {validIncludes.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs sm:text-sm font-medium leading-relaxed">
                    <Check size={16} className="text-emerald-200 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Excluded Card (Rose / Red) */}
          {hasExcludes && (
            <div className="bg-gradient-to-br from-[#E91E63] to-rose-700 text-white p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl shadow-sm space-y-3 sm:space-y-4">
              <header className="flex items-center gap-2.5 pb-2 border-b border-white/20">
                <div className="p-1.5 bg-white text-[#E91E63] rounded-lg shadow-sm">
                  <XCircle size={18} />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">What's Excluded</h3>
              </header>

              <div className="space-y-2 sm:space-y-2.5">
                {validExcludes.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs sm:text-sm font-medium leading-relaxed">
                    <X size={16} className="text-rose-200 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 2. RESTRICTIONS & WHAT TO BRING ── */}
      {hasRequirementsSection && (
        <div className={`grid grid-cols-1 ${hasRestrictions && hasWhatToBring ? "md:grid-cols-2" : ""} gap-4 sm:gap-6`}>
          {/* Restrictions Card */}
          {hasRestrictions && (
            <div className="bg-white p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-3 sm:space-y-4">
              <header className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#200B3B]">
                  Restrictions & Health
                </h3>
              </header>

              <div className="space-y-2">
                {validRestrictions.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What to Bring Card */}
          {hasWhatToBring && (
            <div className="bg-white p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-3 sm:space-y-4">
              <header className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <div className="p-1.5 bg-pink-50 text-[#E91E63] rounded-lg">
                  <Backpack size={18} />
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#200B3B]">
                  What to Bring
                </h3>
              </header>

              <div className="space-y-2">
                {validWhatToBring.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63] mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IncludesExclude;
