import { ShieldCheck, PhoneCall } from "lucide-react";

const VerificationCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4">
      {/* Verified Agency */}
      <div className="flex items-center gap-3.5 pb-3.5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
            VERIFIED AGENCY
          </span>
          <p className="text-xs sm:text-sm font-black text-[#200B3B]">
            Govt. Licensed & Insured
          </p>
        </div>
      </div>

      {/* Support Hours */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#E91E63] flex items-center justify-center flex-shrink-0">
          <PhoneCall size={18} />
        </div>
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
            SUPPORT HOURS
          </span>
          <p className="text-xs sm:text-sm font-black text-[#200B3B]">
            24/7 Hotline Assistance
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationCard;
