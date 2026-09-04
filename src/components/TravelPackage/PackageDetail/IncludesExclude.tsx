import React from "react";
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
  allIncludes?: Package["includes"];
  allExcludes?: Package["excludes"];
  restrictions?: Package["restrictions"];
  whatToBring?: Package["whatToBring"];
}

const IncludesExclude: React.FC = () => {
  const { allIncludes = [], allExcludes = [], restrictions = [], whatToBring = [] } =
    useOutletContext<Prop>();

  return (
    <div className="space-y-6">
      {/* ── 1. INCLUDED & EXCLUDED CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Included Card (Emerald / Green) */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
          <header className="flex items-center gap-2.5 pb-2 border-b border-white/20">
            <div className="p-1.5 bg-white text-emerald-600 rounded-lg shadow-sm">
              <CheckCircle2 size={18} />
            </div>
            <h3 className="text-xl font-black text-white">What's Included</h3>
          </header>

          <div className="space-y-2.5">
            {allIncludes.map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm font-medium leading-relaxed">
                <Check size={16} className="text-emerald-200 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Excluded Card (Rose / Red) */}
        <div className="bg-gradient-to-br from-[#E91E63] to-rose-700 text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
          <header className="flex items-center gap-2.5 pb-2 border-b border-white/20">
            <div className="p-1.5 bg-white text-[#E91E63] rounded-lg shadow-sm">
              <XCircle size={18} />
            </div>
            <h3 className="text-xl font-black text-white">What's Excluded</h3>
          </header>

          <div className="space-y-2.5">
            {allExcludes.map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm font-medium leading-relaxed">
                <X size={16} className="text-rose-200 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. RESTRICTIONS & WHAT TO BRING ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restrictions Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <header className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle size={18} />
            </div>
            <h3 className="text-lg font-black text-[#200B3B]">
              Restrictions & Health
            </h3>
          </header>

          <div className="space-y-2">
            {restrictions.map((item, index) => (
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

        {/* What to Bring Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <header className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-pink-50 text-[#E91E63] rounded-lg">
              <Backpack size={18} />
            </div>
            <h3 className="text-lg font-black text-[#200B3B]">
              What to Bring
            </h3>
          </header>

          <div className="space-y-2">
            {whatToBring.map((item, index) => (
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
      </div>
    </div>
  );
};

export default IncludesExclude;
