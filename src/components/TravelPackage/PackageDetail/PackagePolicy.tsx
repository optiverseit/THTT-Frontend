import React, { useEffect, useState } from "react";
import { ShieldCheck, RotateCcw, FileText, CheckCircle2 } from "lucide-react";
import type { Package } from "../../../assets/data/types";
import PackagePricing from "./PackagePricing";
import { useOutletContext, useParams } from "react-router-dom";
import { formatDescription } from "../../../utils/formatDescription";
import {
  getPublicPackagePolicies,
  getPackagePublicPolicies,
} from "../../../api/BackendApi";

interface PolicyItem {
  id?: number | string;
  title?: string;
  policy_title?: string;
  name?: string;
  type?: string;
  policy_type?: string;
  content?: string;
  description?: string;
  policy?: string;
  details?: string;
  guidelines?: string[] | string;
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

const PackagePolicy: React.FC = () => {
  const context = useOutletContext<PackagePolicyContext>() || {};
  const { pkg } = context;
  const { packageId } = useParams();
  const [directPolicies, setDirectPolicies] = useState<PolicyItem[]>([]);
  const targetPkgId = pkg?.id || packageId;

  const rawPolicies: PolicyItem[] =
    Array.isArray(context.policies) && context.policies.length > 0
      ? context.policies
      : Array.isArray(context.allPolicies) && context.allPolicies.length > 0
      ? context.allPolicies
      : Array.isArray((pkg as any)?.policies) && (pkg as any).policies.length > 0
      ? (pkg as any).policies
      : directPolicies;

  // Direct fetch fallback in case context policies haven't populated yet
  useEffect(() => {
    if (rawPolicies.length === 0 && targetPkgId) {
      const fetchPolicies = async () => {
        try {
          const res = await getPublicPackagePolicies(targetPkgId);
          const d = res.data?.data;
          const items = Array.isArray(d?.data)
            ? d.data
            : Array.isArray(d)
            ? d
            : Array.isArray(res.data)
            ? res.data
            : [];
          if (items.length > 0) {
            setDirectPolicies(items);
            return;
          }
        } catch (_) {}

        try {
          const resFallback = await getPackagePublicPolicies(targetPkgId);
          const d = resFallback.data?.data;
          const items = Array.isArray(d?.data)
            ? d.data
            : Array.isArray(d)
            ? d
            : Array.isArray(resFallback.data)
            ? resFallback.data
            : [];
          if (items.length > 0) {
            setDirectPolicies(items);
          }
        } catch (_) {}
      };

      fetchPolicies();
    }
  }, [rawPolicies.length, targetPkgId]);

  const displayPolicies = rawPolicies;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT POLICY CARDS (8 cols) — ONLY SHOWN IF API DATA EXISTS ── */}
        {displayPolicies.length > 0 ? (
          <div className="lg:col-span-8 space-y-6">
            {displayPolicies.map((policy: any, idx: number) => {
              const title =
                policy.title ||
                policy.policy_title ||
                policy.name ||
                (policy.type || policy.policy_type
                  ? String(policy.type || policy.policy_type).replace(/_/g, " ")
                  : "Policy");

              const content =
                policy.description ||
                policy.content ||
                policy.policy ||
                policy.details ||
                "";

              const guidelines = Array.isArray(policy.guidelines)
                ? policy.guidelines
                : typeof policy.guidelines === "string"
                ? [policy.guidelines]
                : [];

              const { icon, bg } = getPolicyIcon(title, idx);

              return (
                <div
                  key={policy.id || idx}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${bg}`}>{icon}</div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                      {title}
                    </h2>
                  </div>

                  {content && (
                    <div
                      className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-1"
                      dangerouslySetInnerHTML={{
                        __html:
                          formatDescription(content) || `<p>${content}</p>`,
                      }}
                    />
                  )}

                  {guidelines.length > 0 && (
                    <div className="pt-2">
                      <ul className="space-y-1.5">
                        {guidelines.map((g: any, gIdx: number) => {
                          const text =
                            typeof g === "string"
                              ? g
                              : g?.description || g?.item || "";
                          if (!text) return null;
                          return (
                            <li
                              key={gIdx}
                              className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-medium"
                            >
                              <CheckCircle2
                                size={15}
                                className="text-emerald-500 flex-shrink-0 mt-0.5"
                              />
                              <span>{text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols or centered if no left cards) ── */}
        <div
          className={`${
            displayPolicies.length > 0
              ? "lg:col-span-4"
              : "lg:col-span-12 max-w-xl mx-auto"
          } lg:sticky lg:top-[220px] self-start space-y-6 w-full`}
        >
          <PackagePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default PackagePolicy;
