import React from "react";
import { useOutletContext } from "react-router-dom";
import {
  Check,
  X,
  Backpack,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  RotateCcw,
  BedDouble,
  CreditCard,
  Baby,
  PawPrint,
  Clock,
  ClipboardList,
} from "lucide-react";

interface HotelPolicy {
  id: number;
  hotel_id: number;
  type: string;
  content: string;
  display_order?: number;
  status?: string;
}

interface Prop {
  allIncludes?: string[];
  allExcludes?: string[];
  whatToBring?: string[];
  policies?: HotelPolicy[];
}

interface PolicyConfig {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
}

const Rule: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-medium">
    <CheckCircle2 size={14} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
    <span>{children}</span>
  </div>
);

const getPolicyConfig = (type: string): PolicyConfig => {
  switch (type) {
    case "CHECK_IN":
      return {
        title: "Check-In Policy",
        icon: <Clock size={16} />,
        iconBg: "bg-pink-50 text-[#E91E63]",
      };
    case "CHECK_OUT":
      return {
        title: "Check-Out Policy",
        icon: <Clock size={16} />,
        iconBg: "bg-blue-50 text-blue-600",
      };
    case "CANCELLATION":
      return {
        title: "Cancellation Policy",
        icon: <RotateCcw size={16} />,
        iconBg: "bg-emerald-50 text-emerald-600",
      };
    case "CHILDREN":
      return {
        title: "Children Policy",
        icon: <Baby size={16} />,
        iconBg: "bg-sky-50 text-sky-600",
      };
    case "EXTRA_BED":
      return {
        title: "Extra Bed Policy",
        icon: <BedDouble size={16} />,
        iconBg: "bg-purple-50 text-purple-600",
      };
    case "PETS":
      return {
        title: "Pets Policy",
        icon: <PawPrint size={16} />,
        iconBg: "bg-orange-50 text-orange-600",
      };
    case "PAYMENT":
      return {
        title: "Payment Policy",
        icon: <CreditCard size={16} />,
        iconBg: "bg-amber-50 text-amber-600",
      };
    case "OTHER":
      return {
        title: "Other Policy",
        icon: <ClipboardList size={16} />,
        iconBg: "bg-gray-100 text-gray-600",
      };
    default:
      return {
        title: type
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase()),
        icon: <ShieldCheck size={16} />,
        iconBg: "bg-pink-50 text-[#E91E63]",
      };
  }
};

const HotelIncludesExclude: React.FC = () => {
  const {
    allIncludes = [],
    allExcludes = [],
    whatToBring = [],
    policies = [],
  } = useOutletContext<Prop>();

  const groupedPolicies = policies.reduce<Record<string, HotelPolicy[]>>(
    (groups, policy) => {
      if (!groups[policy.type]) {
        groups[policy.type] = [];
      }
      groups[policy.type].push(policy);
      return groups;
    },
    {}
  );

  return (
    <div className="space-y-6">
      {(allIncludes.length > 0 || allExcludes.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allIncludes.length > 0 && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
              <header className="flex items-center gap-2.5 pb-2 border-b border-white/20">
                <div className="p-1.5 bg-white text-emerald-600 rounded-lg shadow-sm">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="text-xl font-black text-white">What's Included</h3>
              </header>
              <div className="space-y-2.5">
                {allIncludes.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-xs sm:text-sm font-medium leading-relaxed"
                  >
                    <Check
                      size={16}
                      className="text-emerald-200 mt-0.5 flex-shrink-0"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allExcludes.length > 0 && (
            <div className="bg-gradient-to-br from-[#E91E63] to-rose-700 text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
              <header className="flex items-center gap-2.5 pb-2 border-b border-white/20">
                <div className="p-1.5 bg-white text-[#E91E63] rounded-lg shadow-sm">
                  <XCircle size={18} />
                </div>
                <h3 className="text-xl font-black text-white">What's Excluded</h3>
              </header>
              <div className="space-y-2.5">
                {allExcludes.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-xs sm:text-sm font-medium leading-relaxed"
                  >
                    <X
                      size={16}
                      className="text-rose-200 mt-0.5 flex-shrink-0"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {whatToBring.length > 0 && (
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
      )}

      {policies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-[#200B3B] pt-2">
            Hotel Policies
          </h3>

          <div className="flex flex-col gap-5">
            {Object.entries(groupedPolicies).map(
              ([type, policyItems]) => {
                const config = getPolicyConfig(type);

                return (
                  <div
                    key={type}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${config.iconBg}`}>
                        {config.icon}
                      </div>

                      <h4 className="text-sm font-black text-[#200B3B]">
                        {config.title}
                      </h4>
                    </div>

                    {policyItems
                      .sort(
                        (a, b) =>
                          Number(a.display_order ?? 0) -
                          Number(b.display_order ?? 0)
                      )
                      .map((policy) => (
                        <Rule key={policy.id}>
                          {policy.content}
                        </Rule>
                      ))}
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelIncludesExclude;