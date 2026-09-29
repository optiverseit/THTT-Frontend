import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { INSURANCE_PLANS } from "../Service/insuranceData";
import InsurancePlanDetailView from "../Service/InsurancePlanDetailView";
import { Compass } from "lucide-react";

const InsurancePackageDetails: React.FC = () => {
  const { insuranceId } = useParams();
  const navigate = useNavigate();

  const cleanId = (insuranceId || "").toLowerCase().trim();

  // Flexible matcher: matches id, plan name, plan slug, index or partial, with safe fallback
  const matchedInsurance =
    INSURANCE_PLANS.find((ins, idx) => {
      const insId = (ins.id || "").toLowerCase().trim();
      const insName = (ins.name || "").toLowerCase().trim();
      const insSlug = insName.replace(/[^a-z0-9]+/g, "-");
      return (
        insId === cleanId ||
        cleanId === String(idx + 1) ||
        insName === cleanId ||
        cleanId.includes(insId) ||
        insId.includes(cleanId) ||
        insSlug.includes(cleanId) ||
        cleanId.includes(insSlug) ||
        (cleanId === "basic" && insId.includes("standard"))
      );
    }) || INSURANCE_PLANS[0];

  if (!matchedInsurance) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center py-24 px-4 bg-gray-50 text-center font-sans">
        <div className="w-20 h-20 rounded-3xl bg-pink-50 text-[#E91E63] flex items-center justify-center mb-6 shadow-sm border border-pink-100 ring-8 ring-pink-50/50">
          <Compass size={40} />
        </div>

        <h2 className="text-3xl font-black text-[#2D1347]">
          Insurance Plan Not Found
        </h2>

        <p className="text-gray-500 text-sm mt-2 max-w-md">
          We couldn't find the requested insurance plan. Please browse all available insurance plans.
        </p>

        <div className="flex gap-3 mt-8">
          <Link
            to="/service/travel-insurance"
            className="px-6 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            View All Insurance Plans
          </Link>

          <Link
            to="/"
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full font-bold text-xs uppercase tracking-wider transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FBFBFE] font-sans pt-10 sm:pt-11 md:pt-12 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InsurancePlanDetailView
          plan={matchedInsurance}
          allPlans={INSURANCE_PLANS}
          onSelectPlan={(newPlan) =>
            navigate(`/insurance-details/${newPlan.id}`)
          }
          onBack={() => navigate("/service/travel-insurance")}
        />
      </div>
    </div>
  );
};

export default InsurancePackageDetails;
