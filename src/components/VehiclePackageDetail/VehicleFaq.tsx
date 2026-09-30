import React from "react";
import { useOutletContext } from "react-router-dom";
import VehiclePricing from "./VehiclePricing";
import DynamicFaqSection from "../reusable/DynamicFaqSection";

interface FaqContextType {
  allfaqs?: any[];
  pkg: any;
}

const VehicleFaq: React.FC = () => {
  const { allfaqs = [], pkg } = useOutletContext<FaqContextType>();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <DynamicFaqSection
            targetType="package"
            targetId={pkg.id || pkg.slug}
            defaultFaqs={allfaqs}
            title="Frequently Asked Questions"
            subtitle={`Everything you need to know about ${pkg.title}`}
          />
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <VehiclePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default VehicleFaq;
