import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { services } from "../../data/mockData";

const ServicesWheel: React.FC = () => {
  const navigate = useNavigate();
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const scrollMobile = (direction: "left" | "right") => {
    if (!mobileScrollRef.current) return;

    const { scrollLeft, clientWidth } = mobileScrollRef.current;
    const amount = clientWidth * 0.85;

    mobileScrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - amount : scrollLeft + amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="text-center md:text-left">
            <span className="text-[#D92671] font-black uppercase tracking-[0.28em] text-[10px] sm:text-xs">
              Your Adventure Starts Here
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-[#2D1347]">
              Premium Travel Services
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
              Explore our complete range of travel services designed to make
              your journey easier, smoother, and more memorable.
            </p>
          </div>

          {/* Mobile scroll buttons only */}
          <div className="flex items-center justify-center gap-3 md:hidden">
            <button
              onClick={() => scrollMobile("left")}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#5D2A8E] shadow-sm transition-all hover:bg-[#5D2A8E] hover:text-white"
              aria-label="Scroll services left"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => scrollMobile("right")}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#5D2A8E] shadow-sm transition-all hover:bg-[#5D2A8E] hover:text-white"
              aria-label="Scroll services right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Mobile: Horizontal Swipe */}
        <div
          ref={mobileScrollRef}
          className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory md:hidden"
        >
          {services.map((service) => {
            const IconComponent =
              (Icons as any)[service.icon] || Icons.HelpCircle;

            return (
              <button
                key={service.id}
                onClick={() => navigate(`/services/${service.slug}`)}
                className="group relative h-[340px] w-[280px] flex-shrink-0 snap-start overflow-hidden rounded-[1.75rem] text-left shadow-lg transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-[#D92671]/20"
              >
                <img
                  src={service.heroImage}
                  alt={service.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                <div className="absolute top-5 left-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D92671] text-white shadow-lg">
                  <IconComponent size={20} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="text-lg font-black leading-tight">
                    {service.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs text-white/75 font-medium leading-relaxed">
                    {service.shortDesc}
                  </p>

                  <div className="mt-4 inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur-sm">
                    View Service
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop/Tablet: Responsive Grid */}
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent =
              (Icons as any)[service.icon] || Icons.HelpCircle;

            return (
              <button
                key={service.id}
                onClick={() => navigate(`/services/${service.slug}`)}
                className="group relative h-[360px] overflow-hidden rounded-[2rem] text-left shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#D92671]/20"
              >
                <img
                  src={service.heroImage}
                  alt={service.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                <div className="absolute top-6 left-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D92671] text-white shadow-lg">
                  <IconComponent size={22} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-7 text-white">
                  <h3 className="text-xl lg:text-2xl font-black leading-tight">
                    {service.name}
                  </h3>
                  <p className="mt-3 max-w-md text-sm text-white/75 font-medium leading-relaxed line-clamp-2">
                    {service.shortDesc}
                  </p>

                  <div className="mt-5 inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur-sm transition-all group-hover:bg-[#D92671]">
                    View Service
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesWheel;