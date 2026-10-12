import React from "react";
import { ShieldCheck, RotateCcw, FileText, CheckCircle2 } from "lucide-react";
import type { Package } from "../../../assets/data/types";
import PackagePricing from "./PackagePricing";
import { useOutletContext } from "react-router-dom";
import { formatDescription } from "../../../utils/formatDescription";

interface PolicyItem {
  id?: number | string;
  title?: string;
  policy_title?: string;
  name?: string;
  type?: string;
  content?: string;
  description?: string;
  policy?: string;
  display_order?: number;
  displayOrder?: number;
}

interface PackagePolicyContext {
  pkg: Package;
  policies?: PolicyItem[];
  allPolicies?: PolicyItem[];
}

const getPolicyIcon = (title: string, index: number) => {
  const lower = title.toLowerCase();
  if (lower.includes("cancel") || lower.includes("refund")) {
    return {
      icon: <RotateCcw size={22} />,
      bg: "bg-emerald-50 text-emerald-600",
    };
  }
  if (
    lower.includes("booking") ||
    lower.includes("reservation") ||
    lower.includes("payment") ||
    lower.includes("deposit")
  ) {
    return {
      icon: <ShieldCheck size={22} />,
      bg: "bg-pink-50 text-[#E91E63]",
    };
  }
  if (
    lower.includes("safety") ||
    lower.includes("conduct") ||
    lower.includes("rule") ||
    lower.includes("guideline") ||
    lower.includes("term")
  ) {
    return {
      icon: <FileText size={22} />,
      bg: "bg-purple-50 text-[#200B3B]",
    };
  }
  const colorBgs = [
    "bg-pink-50 text-[#E91E63]",
    "bg-emerald-50 text-emerald-600",
    "bg-purple-50 text-[#200B3B]",
    "bg-blue-50 text-blue-600",
    "bg-amber-50 text-amber-600",
  ];
  return {
    icon: <ShieldCheck size={22} />,
    bg: colorBgs[index % colorBgs.length],
  };
};

const defaultPolicies = [
  {
    id: "def-1",
    title: "Reservation & Booking Policy",
    content:
      "Advance booking is recommended at least 48 hours in advance for adventure activities and 7 days for multi-day trekking packages. A 20% deposit confirms your spot, and remaining balances can be settled upon arrival in Nepal via cash or credit card.",
  },
  {
    id: "def-2",
    title: "Flexible Cancellation & Weather Guarantee",
    content:
      "Free 100% cancellation refund up to 24 hours before your scheduled activity. In case of unsuitable weather (rain or high mountain winds for aerial activities), you can reschedule to any upcoming date or receive a full immediate refund.",
  },
  {
    id: "def-3",
    title: "Safety & Conduct Guidelines",
    content:
      "Follow instructions given by the licensed pilot/lead guide at all times. Wear appropriate closed sports footwear and weather-resistant gear. Disclose any medical or physical conditions during check-in.",
  },
];

const PackagePolicy: React.FC = () => {
  const context = useOutletContext<PackagePolicyContext>() || {};
  const { pkg } = context;

  const rawPolicies =
    (Array.isArray(context.policies) && context.policies.length > 0)
      ? context.policies
      : (Array.isArray(context.allPolicies) && context.allPolicies.length > 0)
      ? context.allPolicies
      : (Array.isArray((pkg as any)?.policies) && (pkg as any).policies.length > 0)
      ? (pkg as any).policies
      : [];

  const displayPolicies = rawPolicies.length > 0 ? rawPolicies : defaultPolicies;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT POLICY CARDS (8 cols) ── */}
        <div className="lg:col-span-8 space-y-6">
          {displayPolicies.map((policy: any, idx: number) => {
            const title =
              policy.title ||
              policy.policy_title ||
              policy.name ||
              (policy.type ? String(policy.type).replace(/_/g, " ") : "Policy");

            const content =
              policy.content ||
              policy.description ||
              policy.policy ||
              policy.details ||
              "";

            const { icon, bg } = getPolicyIcon(title, idx);

            return (
              <div
                key={policy.id || idx}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${bg}`}>
                    {icon}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                    {title}
                  </h2>
                </div>

                {content && (
                  <div
                    className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-1"
                    dangerouslySetInnerHTML={{
                      __html:
                        formatDescription(content) ||
                        `<p>${content}</p>`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols) ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <PackagePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default PackagePolicy;
