import React, { useState } from "react";
import type { Package } from "../../../assets/data/types";
import { useOutletContext } from "react-router-dom";
import PackagePricing from "./PackagePricing";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqContextType {
  allfaqs?: Package["faqs"];
  pkg: Package;
}

const PackageFaq: React.FC = () => {
  const { allfaqs = [], pkg } = useOutletContext<FaqContextType>();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const fallbackFaqs = [
    {
      question: "Is prior experience required for this adventure?",
      answer: "No prior experience is necessary! All flights and guided excursions are conducted with internationally certified tandem instructors who handle all operations while you relax and enjoy.",
    },
    {
      question: "What happens if weather conditions are bad on the booking date?",
      answer: "Safety is our absolute #1 priority. If weather conditions do not permit the activity, we offer a free reschedule to your next preferred date or a 100% full refund immediately.",
    },
    {
      question: "Are photos and videos included in the price?",
      answer: "Yes! High-definition action photos and 4K GoPro video recordings are captured by your instructor and transferred directly to your phone/USB right after the session.",
    },
    {
      question: "Is transport included from my hotel?",
      answer: "Yes, complimentary pick-up and drop-off from any central hotel in the area is included with every booking.",
    },
  ];

  const faqs = allfaqs.length > 0 ? allfaqs : fallbackFaqs;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT ACCORDION (8 cols) ── */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-50 text-[#E91E63]">
                <HelpCircle size={22} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Everything you need to know before booking
                </p>
              </div>
            </div>
          </div>

          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <span className="font-extrabold text-sm sm:text-base text-[#200B3B]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-pink-50 text-[#E91E63] flex items-center justify-center transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180 bg-[#E91E63] text-white" : ""
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium border-t border-gray-100/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols) ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-[190px] self-start space-y-6">
          <PackagePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default PackageFaq;
