import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Star, CheckCircle2 } from "lucide-react";
import InsurancePricing from "./InsurancePricing";

interface TestimonialProp {
  allTestimonies?: any[];
  pkg: any;
}

const InsuranceTestimonial: React.FC = () => {
  const { allTestimonies = [], pkg } = useOutletContext<TestimonialProp>();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const defaultInsuranceReviews = [
    {
      id: "ir1",
      name: "Marcus Vance",
      location: "Sydney, Australia",
      rating: 5,
      date: "3 weeks ago",
      text: `When I suffered from mild AMS near Dingboche, the 24/7 rescue line answered within seconds. Knowing that helicopter evacuation was 100% cashless gave me total confidence throughout my Everest Base Camp trek.`,
      verified: true,
      policyType: "High Altitude Trekker Plan",
    },
    {
      id: "ir2",
      name: "Elena Rostova",
      location: "Frankfurt, Germany",
      rating: 5,
      date: "1 month ago",
      text: "Fast policy issuance! Ordered in the morning before flying to Lukla, received the certificate in my inbox within 20 minutes. Hospital in Kathmandu processed the consultation smoothly.",
      verified: true,
      policyType: "Standard Foothill Plan",
    },
    {
      id: "ir3",
      name: "Arun Nair",
      location: "Bengaluru, India",
      rating: 5,
      date: "2 months ago",
      text: "Essential protection for Annapurna Circuit. Reasonable pricing and very helpful customer service team when we had to add 3 more days due to Thorong La weather.",
      verified: true,
      policyType: "High Altitude Trekker Plan",
    },
  ];

  const testimoniesToDisplay = allTestimonies.length > 0 ? allTestimonies : defaultInsuranceReviews;

  const filteredTestimonies = useMemo(() => {
    if (!selectedRating) return testimoniesToDisplay;
    return testimoniesToDisplay.filter((t: any) => Math.round(t.rating) === selectedRating);
  }, [testimoniesToDisplay, selectedRating]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT TESTIMONIALS (8 cols) ── */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                  Policyholder Experiences &amp; Reviews
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Verified testimonials from international trekkers and climbers
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedRating(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedRating === null
                      ? "bg-[#200B3B] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All ({testimoniesToDisplay.length})
                </button>
                {[5, 4].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedRating === star
                        ? "bg-[#200B3B] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{star}</span>
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Testimonials list */}
            <div className="divide-y divide-gray-100">
              {filteredTestimonies.map((rev: any, idx: number) => (
                <div key={rev.id || idx} className="py-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#200B3B]">{rev.name}</span>
                        {rev.verified !== false && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <CheckCircle2 size={10} />
                            Verified Policyholder
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{rev.location}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black text-gray-800">{rev.rating || 5}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                    "{rev.text}"
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span>{rev.policyType || "Travel Insurance"}</span>
                    <span>•</span>
                    <span>{rev.date || "Recent"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PRICING SIDEBAR (4 cols) ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-[220px] self-start space-y-6">
          <InsurancePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default InsuranceTestimonial;
