import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Package, Testimonial, Testimony } from "../../assets/data/types";
import { ArrowRight, ChevronUp } from "lucide-react";

interface testimonialsProps {
  testimonials?: Testimony[];
  pkg?: Package;
  workTest?: Testimonial[];
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard: React.FC<{
  testimonial: {
    id: string | number;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    location?: string;
  };
}> = ({ testimonial }) => (
  <div
    className="bg-white rounded-2xl p-6 flex flex-col transition-shadow duration-300 hover:shadow-lg"
    style={{ border: "1px solid #f0f0f0" }}
  >
    {/* Stars */}
    <StarRating rating={testimonial.rating} />

    {/* Comment */}
    <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-6 flex-1">
      "{testimonial.comment}"
    </p>

    {/* Bottom row */}
    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={testimonial.userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
          alt={testimonial.userName}
          className="w-10 h-10 rounded-full object-cover"
          style={{ border: "2px solid #fce4ec" }}
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {testimonial.userName}
          </p>
          {testimonial.location && (
            <p className="text-[11px] text-gray-400 uppercase tracking-wide">
              {testimonial.location}
            </p>
          )}
        </div>
      </div>

      <span
        className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
        style={{ background: "#fce4ec", color: "#E91E63" }}
      >
        ✓ Verified
      </span>
    </div>
  </div>
);

const Testimonials: React.FC<testimonialsProps> = ({
  testimonials,
  pkg,
  workTest,
}) => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const data = (testimonials ?? workTest ?? []).map((t) => {
    if ("userName" in t) {
      return {
        id: t.id,
        userName: t.userName,
        userAvatar: t.userAvatar,
        rating: t.rating,
        comment: t.comment,
        location: t.location,
      };
    } else {
      return {
        id: t.id,
        userName: t.name,
        userAvatar: t.avatar,
        rating: t.rating,
        comment: t.message,
        location: t.country,
      };
    }
  });

  const visible = showAll ? data : data.slice(0, 3);
  const hasMore = data.length > 3;

  const handleButton = () => {
    if (showAll) {
      // Collapse back to 3 and scroll to section top
      setShowAll(false);
      document
        .getElementById("testimonials-section")
        ?.scrollIntoView({ behavior: "smooth" });
    } else if (hasMore) {
      // Expand to show all in-place
      setShowAll(true);
    } else if (pkg?.id) {
      // If exactly 3 or fewer but has a package, navigate to testimonies page
      navigate(`/details/${pkg.id}/testimonies`);
    }
  };

  return (
    <div id="testimonials-section" className="w-full bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-black uppercase tracking-[0.2em] mb-1"
            style={{ color: "#E11D48" }}
          >
            Client Reviews
          </p>
          <h2
            className="text-2xl sm:text-3xl font-black tracking-tight"
            style={{ color: "#2D1347" }}
          >
            What Our Customers Say
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {visible.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Button — always shown */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleButton}
            className="flex items-center gap-2 text-sm font-semibold px-7 py-3 rounded-full transition-all duration-200 hover:opacity-90"
            style={{ background: "#E91E63", color: "#ffffff" }}
          >
            {showAll ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                See More Reviews <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Testimonials;
