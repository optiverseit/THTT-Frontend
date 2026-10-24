import React, { useEffect, useMemo, useState } from "react";
import type { Package } from "../../../assets/data/types";
import { useOutletContext, useParams } from "react-router-dom";
import { Star, CheckCircle2 } from "lucide-react";

// Gradient palette — consistent colour per name based on first char code
const AVATAR_PALETTES: [string, string][] = [
  ["#E91E63", "#200B3B"],
  ["#7C3AED", "#4C1D95"],
  ["#0EA5E9", "#075985"],
  ["#10B981", "#065F46"],
  ["#F59E0B", "#92400E"],
  ["#EF4444", "#7F1D1D"],
  ["#EC4899", "#831843"],
  ["#14B8A6", "#134E4A"],
];

const TravelerAvatar: React.FC<{ name: string; avatar?: string }> = ({ name, avatar }) => {
  const [imgError, setImgError] = useState(false);
  const initial = (name || "T").trim().charAt(0).toUpperCase();
  const [from, to] = AVATAR_PALETTES[(initial.charCodeAt(0) || 0) % AVATAR_PALETTES.length];

  if (avatar && !imgError) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setImgError(true)}
        className="w-12 h-12 rounded-full object-cover border-2 border-pink-100 shadow-sm flex-shrink-0"
      />
    );
  }

  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-pink-100 shadow-sm"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <span className="text-white font-black text-lg leading-none select-none">{initial}</span>
    </div>
  );
};
import PackagePricing from "./PackagePricing";
import {
  getPublicPackageTestimonials,
  getPackagePublicTestimonials,
} from "../../../api/BackendApi";

interface TestimonialProp {
  allTestimonies?: any[];
  testimonials?: any[];
  pkg: Package;
}

type SortType = "recent" | "highest" | "lowest";

const PackageTestimonial: React.FC = () => {
  const context = useOutletContext<TestimonialProp>() || {};
  const { pkg } = context;
  const { packageId } = useParams();
  const [directTestimonies, setDirectTestimonies] = useState<any[]>([]);
  const targetPkgId = pkg?.id || packageId;

  const rawTestimonies: any[] =
    Array.isArray(context.allTestimonies) && context.allTestimonies.length > 0
      ? context.allTestimonies
      : Array.isArray(context.testimonials) && context.testimonials.length > 0
      ? context.testimonials
      : Array.isArray((pkg as any)?.testimonies) && (pkg as any).testimonies.length > 0
      ? (pkg as any).testimonies
      : Array.isArray((pkg as any)?.testimonials) && (pkg as any).testimonials.length > 0
      ? (pkg as any).testimonials
      : directTestimonies;

  // Direct fetch fallback in case context testimonials haven't populated yet
  useEffect(() => {
    if (rawTestimonies.length === 0 && targetPkgId) {
      const fetchTestimonials = async () => {
        try {
          const res = await getPublicPackageTestimonials(targetPkgId);
          const d = res.data?.data;
          const items = Array.isArray(d?.data)
            ? d.data
            : Array.isArray(d)
            ? d
            : Array.isArray(res.data)
            ? res.data
            : [];
          if (items.length > 0) {
            setDirectTestimonies(items);
            return;
          }
        } catch (_) {}

        try {
          const resFallback = await getPackagePublicTestimonials(targetPkgId);
          const d = resFallback.data?.data;
          const items = Array.isArray(d?.data)
            ? d.data
            : Array.isArray(d)
            ? d
            : Array.isArray(resFallback.data)
            ? resFallback.data
            : [];
          if (items.length > 0) {
            setDirectTestimonies(items);
          }
        } catch (_) {}
      };

      fetchTestimonials();
    }
  }, [rawTestimonies.length, targetPkgId]);

  const [sortBy, setSortBy] = useState<SortType>("recent");

  // Keep strictly only API testimonials — no mock fallback
  const testimonies = rawTestimonies;

  const sortedTestimonials = useMemo(() => {
    const sorted = [...testimonies];

    switch (sortBy) {
      case "highest":
        return sorted.sort(
          (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
        );
      case "lowest":
        return sorted.sort(
          (a, b) => Number(a.rating || 0) - Number(b.rating || 0)
        );
      case "recent":
      default:
        return sorted.sort(
          (a, b) =>
            new Date(
              b.review_date || b.created_at || b.date || 0
            ).getTime() -
            new Date(
              a.review_date || a.created_at || a.date || 0
            ).getTime()
        );
    }
  }, [testimonies, sortBy]);

  const averageRating =
    testimonies.length > 0
      ? (
          testimonies.reduce(
            (acc: number, t: any) => acc + Number(t.rating || 5),
            0
          ) / testimonies.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT TESTIMONIES (8 cols) — ONLY SHOWN IF API DATA EXISTS ── */}
        {testimonies.length > 0 ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Header Score Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#E91E63] to-[#200B3B] text-white shadow-md shadow-pink-500/20">
                  <span className="block text-3xl sm:text-4xl font-black">
                    {averageRating}
                  </span>
                  <div className="flex justify-center my-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={12}
                        className="text-yellow-300 fill-yellow-300"
                      />
                    ))}
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-pink-100">
                    Overall Rating
                  </span>
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#200B3B]">
                    Customer Experiences
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                    Verified feedback from travelers who booked this adventure.
                  </p>
                </div>
              </div>

              {/* Sorting Tabs */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
                <button
                  onClick={() => setSortBy("recent")}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    sortBy === "recent"
                      ? "bg-white text-[#200B3B] shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setSortBy("highest")}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    sortBy === "highest"
                      ? "bg-white text-[#200B3B] shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Highest
                </button>
                <button
                  onClick={() => setSortBy("lowest")}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    sortBy === "lowest"
                      ? "bg-white text-[#200B3B] shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Lowest
                </button>
              </div>
            </div>

            {/* Testimonials List */}
            <div className="space-y-4">
              {sortedTestimonials.map((t: any, idx: number) => {
                const profileImg =
                  t.profile_image ||
                  t.userAvatar ||
                  t.avatar ||
                  t.image ||
                  t.photo ||
                  "";
                const travelerName =
                  t.traveler_name || t.userName || t.name || "Traveler";
                const isVerified = t.is_verified === true || t.is_verified === 1;
                const reviewComment =
                  t.review || t.comment || t.message || "";
                const reviewDateDisplay = t.review_date
                  ? new Date(`${t.review_date}T00:00:00`).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )
                  : t.date || "Recent";

                return (
                  <div
                    key={t.id || idx}
                    className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100 hover:border-pink-100 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <TravelerAvatar name={travelerName} avatar={profileImg} />
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-[#200B3B] flex items-center gap-1.5">
                            <span>{travelerName}</span>
                            {isVerified && (
                              <CheckCircle2
                                size={14}
                                className="text-emerald-500"
                              />
                            )}
                          </h4>
                          <p className="text-xs text-gray-400 font-medium">
                            {t.location || t.country || "Nepal"}
                            {isVerified ? " • Verified Traveler" : ""}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="text-right">
                        <div className="flex items-center gap-0.5 justify-end">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              size={14}
                              className={
                                index < Number(t.rating || 5)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-semibold text-gray-400 mt-1 block">
                          {reviewDateDisplay}
                        </span>
                      </div>
                    </div>

                    {reviewComment && (
                      <div className="relative pl-4 border-l-2 border-[#E91E63]/40">
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                          "{reviewComment}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols or centered if no left cards) ── */}
        <div
          className={`${
            testimonies.length > 0
              ? "lg:col-span-4"
              : "lg:col-span-12 max-w-xl mx-auto"
          } lg:sticky lg:top-[220px] self-start space-y-6 w-full`}
        >
          <PackagePricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default PackageTestimonial;