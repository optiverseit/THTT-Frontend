import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { VISA_PLANS } from "../Service/VisaServicesDetailContent";
import VisaCountryDetailView from "../Service/VisaCountryDetailView";
import { Compass } from "lucide-react";

const VisaPackageDetails: React.FC = () => {
  const { visaId } = useParams();
  const navigate = useNavigate();

  const cleanId = (visaId || "").toLowerCase().trim();

  // Flexible matcher: matches id, country name, country slug, index or partial, with safe fallback
  const matchedVisa =
    VISA_PLANS.find((v, idx) => {
      const vId = (v.id || "").toLowerCase().trim();
      const vCountry = (v.country || "").toLowerCase().trim();
      const vSlug = vCountry.replace(/[^a-z0-9]+/g, "-");
      return (
        vId === cleanId ||
        cleanId === String(idx + 1) ||
        vCountry === cleanId ||
        vSlug === cleanId ||
        cleanId.includes(vId) ||
        vId.includes(cleanId) ||
        cleanId.includes(vSlug) ||
        vSlug.includes(cleanId)
      );
    }) || VISA_PLANS[0];

  if (!matchedVisa) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center py-24 px-4 bg-gray-50 text-center font-sans">
        <div className="w-20 h-20 rounded-3xl bg-pink-50 text-[#E91E63] flex items-center justify-center mb-6 shadow-sm border border-pink-100 ring-8 ring-pink-50/50">
          <Compass size={40} />
        </div>

        <h2 className="text-3xl font-black text-[#2D1347]">
          Visa Plan Not Found
        </h2>

        <p className="text-gray-500 text-sm mt-2 max-w-md">
          We couldn't find the requested visa plan. Please browse all available visa services.
        </p>

        <div className="flex gap-3 mt-8">
          <Link
            to="/service/visa-services"
            className="px-6 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            View All Visa Services
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
        <VisaCountryDetailView
          plan={matchedVisa}
          allPlans={VISA_PLANS}
          onSelectPlan={(newPlan) =>
            navigate(`/visa-details/${newPlan.id}`)
          }
          onBack={() => navigate("/service/visa-services")}
        />
      </div>
    </div>
  );
};

export default VisaPackageDetails;
