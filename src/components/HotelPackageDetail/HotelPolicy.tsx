import React from "react";
import { ShieldCheck, RotateCcw, CheckCircle2, RefreshCcw, BedDouble, AlertCircle, CreditCard, Baby, ClipboardList, LogIn, LogOut, PawPrint } from "lucide-react";
import HotelPricing from "./HotelPricing";
import { useOutletContext } from "react-router-dom";

interface Policy {
  id: number;
  type: string;
  content: string;
  displayOrder?: number;
}

interface HotelPolicyContext {
  pkg: any;
  policies: Policy[];
}

interface PolicyCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ icon, iconBg, title, children }) => (
  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${iconBg}`}>{icon}</div>
      <h2 className="text-lg sm:text-xl font-black text-[#200B3B]">{title}</h2>
    </div>
    <div className="space-y-2 pt-1 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">{children}</div>
  </div>
);

const Rule: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-start gap-2">
    <CheckCircle2 size={15} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
    <span>{children}</span>
  </div>
);

const policyConfig: Record<string, { title: string; icon: React.ReactNode; iconBg: string }> = {
  CHECK_IN: { title: "Check-In Policy", icon: <LogIn size={20} />, iconBg: "bg-pink-50 text-[#E91E63]" },
  CHECK_OUT: { title: "Check-Out Policy", icon: <LogOut size={20} />, iconBg: "bg-blue-50 text-blue-600" },
  CANCELLATION: { title: "Cancellation Policy", icon: <RotateCcw size={20} />, iconBg: "bg-emerald-50 text-emerald-600" },
  CHILDREN: { title: "Children Policy", icon: <Baby size={20} />, iconBg: "bg-sky-50 text-sky-600" },
  EXTRA_BED: { title: "Extra Bed Policy", icon: <BedDouble size={20} />, iconBg: "bg-purple-50 text-purple-600" },
  PETS: { title: "Pets Policy", icon: <PawPrint size={20} />, iconBg: "bg-orange-50 text-orange-600" },
  PAYMENT: { title: "Payment Policy", icon: <CreditCard size={20} />, iconBg: "bg-amber-50 text-amber-600" },
  OTHER: { title: "Other Policies", icon: <ClipboardList size={20} />, iconBg: "bg-gray-100 text-gray-600" },
};

const HotelPolicy: React.FC = () => {
  const { pkg, policies = [] } = useOutletContext<HotelPolicyContext>();

  const groupedPolicies = policies.reduce<Record<string, Policy[]>>((groups, policy) => {
    const type = policy.type || "OTHER";
    if (!groups[type]) groups[type] = [];
    groups[type].push(policy);
    return groups;
  }, {});

  const policyOrder = ["CHECK_IN", "CHECK_OUT", "CANCELLATION", "CHILDREN", "EXTRA_BED", "PETS", "PAYMENT", "OTHER"];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-5">
          {policies.length > 0 ? (
            policyOrder.map((type) => {
              const items = groupedPolicies[type];
              if (!items?.length) return null;
              const config = policyConfig[type] || {
                title: type.replace(/_/g, " "),
                icon: <ShieldCheck size={20} />,
                iconBg: "bg-pink-50 text-[#E91E63]",
              };
              return (
                <PolicyCard key={type} icon={config.icon} iconBg={config.iconBg} title={config.title}>
                  {items.map((policy) => (
                    <Rule key={policy.id}>{policy.content}</Rule>
                  ))}
                </PolicyCard>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
              <AlertCircle size={30} className="text-gray-300 mx-auto mb-3" />
              <h3 className="font-black text-[#200B3B]">No Policies Available</h3>
              <p className="text-sm text-gray-500 mt-1">No hotel policies have been added yet.</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-4 lg:sticky lg:top-[135px] self-start space-y-6">
          <HotelPricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default HotelPolicy;