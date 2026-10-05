import React from "react";
import InsurancePlanDetailView from "../Service/InsurancePlanDetailView";

const InsurancePackageDetails: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-16 sm:pt-18 md:pt-20 pb-12 sm:pb-16 print:min-h-0 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InsurancePlanDetailView />
      </div>
    </div>
  );
};

export default InsurancePackageDetails;