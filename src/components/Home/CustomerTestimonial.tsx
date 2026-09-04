import React from "react";
import { testimonials } from "../../assets/data/mockData";
import { ArrowRight } from "lucide-react";

const CustomerTestimonial: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-gray-50 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <header className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-purple-900 mb-4">
          What Our Customers Say
        </header>

        {/* Divider */}
        <div className="relative flex justify-center items-center mb-10 md:mb-14">
          <div className="absolute w-48 sm:w-64 md:w-80 h-1 bg-pink-600 rounded" />
          <h3 className="relative bg-gradient-to-r from-blue-50 to-gray-50 px-3 text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-gray-500">
            TRUSTED BY REAL CLIENTS
          </h3>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-md p-5 md:p-6 transition hover:shadow-xl"
            >
              {/* Top */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="font-bold text-purple-900 text-sm md:text-base">
                      {testimonial.name}
                    </p>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      {testimonial.country}
                    </p>
                  </div>
                </div>

                <div className="rating rating-sm flex-shrink-0">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div
                      key={i}
                      className="mask mask-star bg-yellow-400"
                      aria-current="true"
                    />
                  ))}
                </div>
              </div>

              {/* Message */}
              <p className="text-sm font-bold mb-6 text-purple-800">
                <span className="text-pink-500 text-xl">"</span>{" "}
                {testimonial.message}{" "}
                <span className="text-pink-500 text-xl">"</span>
              </p>

              {/* Bottom */}
              <div className="text-[10px] flex justify-between items-center pt-3 border-t border-gray-100">
                <p className="tracking-widest text-gray-400 font-semibold">
                  VERIFIED CLIENT
                </p>
                <span className="font-semibold text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                  TESTIMONIAL
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-10 md:mt-14">
          <button className="flex items-center gap-2 bg-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:bg-pink-600 transition font-semibold text-sm sm:text-base">
            SEE MORE REVIEWS
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTestimonial;
