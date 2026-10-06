import React, { useEffect, useState } from "react";
import type { Package } from "../../../assets/data/types";
import { useOutletContext, useParams } from "react-router-dom";
import PackagePricing from "./PackagePricing";
import DynamicFaqSection from "../../reusable/DynamicFaqSection";
import { getPackageFaqs } from "../../../api/BackendApi";

interface FaqContextType {
  allfaqs?: Package["faqs"];
  pkg: Package;
}

const PackageFaq: React.FC = () => {
  const { allfaqs = [], pkg } = useOutletContext<FaqContextType>();
  const { packageId } = useParams();
  const [directFaqs, setDirectFaqs] = useState<any[]>([]);

  const targetPkgId = pkg?.id || packageId;

  // Direct fetch fallback in case context faqs hasn't populated
  useEffect(() => {
    if (allfaqs.length === 0 && targetPkgId) {
      getPackageFaqs(targetPkgId)
        .then((response) => {
          const raw = Array.isArray(response.data?.data)
            ? response.data.data
            : Array.isArray(response.data)
            ? response.data
            : [];
          if (raw.length > 0) {
            setDirectFaqs(
              raw.map((faq: any) => ({
                id: faq.id,
                question: faq.question ?? "",
                answer: faq.answer ?? "",
                display_order: faq.display_order ?? 0,
                displayOrder: faq.display_order ?? 0,
              }))
            );
          }
        })
        .catch((err) => console.error("Error fetching package FAQs in PackageFaq:", err));
    }
  }, [allfaqs.length, targetPkgId]);

  const effectiveFaqs =
    allfaqs.length > 0
      ? allfaqs
      : (Array.isArray(pkg?.faqs) && pkg.faqs.length > 0
      ? pkg.faqs
      : directFaqs);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT DYNAMIC FAQ SECTION (8 cols) ── */}
        <div className="lg:col-span-8">
          <DynamicFaqSection
            targetType="package"
            targetId={String(pkg?.id || targetPkgId || "")}
            defaultFaqs={effectiveFaqs}
            title="Frequently Asked Questions"
            subtitle={`Everything you need to know about ${pkg?.title || "this package"}`}
          />
        </div>

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols) ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <PackagePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default PackageFaq;
