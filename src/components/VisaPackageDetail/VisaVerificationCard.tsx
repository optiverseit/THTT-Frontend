import React from "react";
import { ShieldCheck, PhoneCall } from "lucide-react";

const VisaVerificationCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4">
      {/* Verified Visa Consultancy */}
      <div className="flex items-center gap-3.5 pb-3.5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
            VERIFIED CONSULTANCY
          </span>
          <p className="text-xs font-bold text-gray-800">
            Govt. Registered & Embassy Certified
          </p>
        </div>
      </div>

      {/* Support Hours */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#E91E63] flex items-center justify-center flex-shrink-0">
          <PhoneCall size={20} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
            VISA HELPLINE
          </span>
          <p className="text-xs font-bold text-gray-800">
            Dedicated Documentation Assistance
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisaVerificationCard;
