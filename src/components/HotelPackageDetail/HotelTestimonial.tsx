import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Star, CheckCircle2 } from "lucide-react";
import HotelPricing from "./HotelPricing";

interface TestimonialProp {
  allTestimonies?: any[];
  pkg: any;
}

type SortType = "recent" | "highest" | "lowest";

const HotelTestimonial: React.FC = () => {
  const { allTestimonies = [], pkg } = useOutletContext<TestimonialProp>();
  const [sortBy, setSortBy] = useState<SortType>("recent");

  const defaultTestimonies = [
    {
      id: "t1",
      userName: "James Harrison",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      location: "United Kingdom",
      rating: 5,
      date: "August 2026",
      comment: "Exceptional stay! The rooms were spotless, the staff incredibly helpful, and the location couldn't be better. Would absolutely recommend to anyone visiting Nepal.",
    },
    {
      id: "t2",
      userName: "Priya Sharma",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      location: "India",
      rating: 5,
      date: "July 2026",
      comment: "Amazing hospitality and wonderful views. Breakfast was delicious and the room was very comfortable. Trip Himalaya made our hotel booking seamless!",
    },
  ];

  const testimonies = allTestimonies.length > 0 ? allTestimonies : defaultTestimonies;

  const sortedTestimonials = useMemo(() => {
    const sorted = [...testimonies];
    switch (sortBy) {
      case "highest": return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest": return sorted.sort((a, b) => a.rating - b.rating);
      default: return sorted;
    }
  }, [testimonies, sortBy]);

  const averageRating =
    testimonies.length > 0
      ? (testimonies.reduce((acc, t) => acc + t.rating, 0) / testimonies.length).toFixed(1)
      : "4.9";

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT TESTIMONIES (8 cols) ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Score Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#E91E63] to-[#200B3B] text-white shadow-md shadow-pink-500/20">
                <span className="block text-3xl sm:text-4xl font-black">{averageRating}</span>
                <div className="flex justify-center my-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={12} className="text-yellow-300 fill-yellow-300" />
                  ))}
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-pink-100">Overall Rating</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#200B3B]">Guest Experiences</h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                  Verified feedback from guests who stayed here.
                </p>
              </div>
            </div>

            {/* Sorting Tabs */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
              {(["recent", "highest", "lowest"] as SortType[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer capitalize ${sortBy === s ? "bg-white text-[#200B3B] shadow-xs" : "text-gray-500 hover:text-gray-900"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Testimonials List */}
          <div className="space-y-4">
            {sortedTestimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100 hover:border-pink-100 transition-all space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={t.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
                      alt={t.userName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-100 shadow-xs"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-[#200B3B] flex items-center gap-1.5">
                        <span>{t.userName}</span>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      </h4>
                      <p className="text-xs text-gray-400 font-medium">{t.location || "Nepal"} • Verified Guest</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 justify-end">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={14} className={index < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-gray-400 mt-1 block">{t.date}</span>
                  </div>
                </div>
                <div className="relative pl-4 border-l-2 border-[#E91E63]/40">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">"{t.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols) ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-[135px] self-start space-y-6">
          <HotelPricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default HotelTestimonial;
