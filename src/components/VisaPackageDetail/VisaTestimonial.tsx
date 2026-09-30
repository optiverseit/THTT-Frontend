import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Star, CheckCircle2 } from "lucide-react";
import VisaPricing from "./VisaPricing";

interface TestimonialProp {
  allTestimonies?: any[];
  pkg: any;
}

const VisaTestimonial: React.FC = () => {
  const { allTestimonies = [], pkg } = useOutletContext<TestimonialProp>();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const defaultVisaReviews = [
    {
      id: "vr1",
      name: "Suman Shakya",
      location: "Kathmandu, Nepal",
      rating: 5,
      date: "2 weeks ago",
      text: `Got my ${pkg.title || "visa"} approved within 6 days! The documentation team organized my bank files and flight reservations flawlessly. Highly recommended for hassle-free visa processing.`,
      verified: true,
      visaType: "Tourist Visa",
    },
    {
      id: "vr2",
      name: "Pooja Gurung",
      location: "Pokhara, Nepal",
      rating: 5,
      date: "1 month ago",
      text: "Super responsive team on WhatsApp. Guided me through the VFS appointment and interview preparation. Seamless experience from start to finish.",
      verified: true,
      visaType: "Visit Visa",
    },
    {
      id: "vr3",
      name: "Bibek Karki",
      location: "Lalitpur, Nepal",
      rating: 5,
      date: "2 months ago",
      text: "Trip Himalaya made the complex embassy requirements so clear and simple. All paperwork was prepared neatly within 24 hours.",
      verified: true,
      visaType: "Tourist Visa",
    },
  ];

  const testimoniesToDisplay = allTestimonies.length > 0 ? allTestimonies : defaultVisaReviews;

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
                  Applicant Reviews &amp; Success Stories
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Verified experiences from travelers who secured visas with us
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
                            Verified Applicant
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
                    <span>{rev.visaType || "Visa Assistance"}</span>
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
          <VisaPricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default VisaTestimonial;
