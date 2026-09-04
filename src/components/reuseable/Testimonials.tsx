import React from "react";
import type { Package, Testimonial, Testimony } from "../../assets/data/types";
import { ArrowRight } from "lucide-react";

interface testimonialsProps {
  testimonials?: Testimony[];
  pkg?: Package;
  workTest?: Testimonial[];
}

const Testimonials: React.FC<testimonialsProps> = ({
  testimonials,
  pkg,
  workTest,
}) => {
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

  return (
    <div>
      <div className="w-full flex justify-center  py-16 mt-6 ">
        <div className="max-w-7xl">
          {/* Heading */}
          <header className="text-4xl font-extrabold text-center text-purple-950 mb-6">
            What Our Customers Say
          </header>

          {/* Label with line */}
          <div className="relative flex justify-center items-center mb-14">
            <div className="absolute w-80 h-1 bg-pink-600 rounded"></div>

            <h3 className="relative bg-white px-3 text-xs font-semibold tracking-[0.25em] text-gray-500">
              TRUSTED BY REAL CLIENTS
            </h3>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {data.slice(0, 3).map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl"
              >
                {/* Top section */}
                <div className="flex justify-between items-start mb-4">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.userAvatar}
                      alt={testimonial.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-bold text-purple-900">
                        {testimonial.userName}
                      </p>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="rating rating-sm">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div
                        key={i}
                        className="mask mask-star bg-yellow-400 "
                        aria-current="true"
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <p className="text-sm font-bold mb-8 text-purple-800">
                  <span className="text-pink-500 text-2xl">“</span>{" "}
                  {testimonial.comment}{" "}
                  <span className="text-pink-500 text-2xl">”</span>
                </p>

                {/* Bottom */}
                <div className=" text-[10px] flex justify-between items-center pt-4 border-t border-gray-100">
                  <p className=" tracking-widest text-gray-400 font-semibold">
                    VERIFIED CLIENT
                  </p>

                  <span className=" font-semibold text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                    {pkg?.title ? pkg.title : "WORK PERMIT"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="flex justify-center mt-14">
            <button className="flex items-center gap-2 bg-pink-500 text-white px-8 py-4 rounded-full shadow-lg hover:bg-pink-600 transition font-semibold">
              SEE MORE REVIEWS
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
