import React from "react";
import { ShieldCheck, HeartPulse } from "lucide-react";

const InsuranceVerificationCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4">
      {/* Verified Underwriter */}
      <div className="flex items-center gap-3.5 pb-3.5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
            VERIFIED UNDERWRITER
          </span>
          <p className="text-xs font-bold text-gray-800">
            Govt. Licensed &amp; Cashless Claim Ready
          </p>
        </div>
      </div>

      {/* 24/7 Heli & Medical Assistance */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#E91E63] flex items-center justify-center flex-shrink-0">
          <HeartPulse size={20} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
            24/7 RESCUE DISPATCH
          </span>
          <p className="text-xs font-bold text-gray-800">
            Direct Hospital &amp; Heli Evacuation Line
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsuranceVerificationCard;
