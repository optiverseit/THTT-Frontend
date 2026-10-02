import React from "react";
import InsurancePlanDetailView from "../Service/InsurancePlanDetailView";

const InsurancePackageDetails: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-10 sm:pt-11 md:pt-12 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InsurancePlanDetailView />
      </div>
    </div>
  );
};

export default InsurancePackageDetails;