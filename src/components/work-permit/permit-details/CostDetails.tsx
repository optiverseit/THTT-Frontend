import React from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../../context/CurrencyContext";

const CostDetails: React.FC = () => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  const ageGroups = [
    { label: "Below 35 years", npr: 11000 },
    { label: "35–50 years", npr: 12500 },
    { label: "Above 51 years", npr: 15500 },
  ];

  const currencyLabel =
    selectedCurrency === "nepali" ? "NPR" : selectedCurrency === "inr" ? "INR" : "USD";

  const handleWhatsAppInquiry = () => {
    const minPrice = displayPrice(11000, selectedCurrency, nprPerOneDollar, nprPerOneINR);
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I would like to inquire about the Work Permit service (fees starting around ${minPrice}). Please guide me through the application process and required documents.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <div className="bg-white rounded-4xl p-7 shadow-xl shadow-gray-300">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-purple-950">Cost Breakdown</h2>
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mt-1">
            Based on Age Groups ({currencyLabel})
          </p>
        </div>

        {/* Column Headers */}
        <div className="flex justify-between mb-2 pb-2">
          <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">
            Age Group
          </span>
          <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">
            Cost ({currencyLabel})
          </span>
        </div>

        {/* Rows */}
        <div className="border-t border-gray-100">
          {ageGroups.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between items-center py-3.5 ${
                index < ageGroups.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-sm font-semibold text-gray-600">
                {item.label}
              </span>
              <span className="text-sm font-bold text-pink-500">
                {displayPrice(item.npr, selectedCurrency, nprPerOneDollar, nprPerOneINR)}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => {
              const modal = document.getElementById(
                "work_permit_modal",
              ) as HTMLDialogElement;
              modal?.showModal();
            }}
            className="w-full font-bold cursor-pointer shadow hover:shadow-pink-400/30 flex gap-2 items-center justify-center rounded-2xl bg-pink-500 text-white py-3 transition-all"
          >
            Process Now <ArrowRight size={14} />
          </button>
          <button
            onClick={handleWhatsAppInquiry}
            className="w-full font-bold cursor-pointer shadow hover:shadow-green-400/30 flex gap-2 items-center justify-center rounded-2xl bg-green-500 text-white py-3 transition-all"
          >
            <MessageCircle size={14} />
            WhatsApp Inquiry
          </button>
        </div>
      </div>
      <div className="flex justify-center flex-col items-center rounded-3xl shadow-xl shadow-gray-200 bg-white p-10 mt-8">
        <p className="text-2xl font-bold text-pink-600">1000+</p>
        <p className="text-xs tracking-wider font-semibold text-gray-400">
          SUCCESSFUL APPLICATIONS
        </p>
      </div>
    </div>
  );
};

export default CostDetails;
