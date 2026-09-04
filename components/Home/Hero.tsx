import React, { useState } from "react";
import { ChevronRight, Search, Navigation, TrendingUp } from "lucide-react";
import ServicesStrip from "../Layout/ServicesStrip";

interface HeroProps {
  onInquire: () => void;
}

const Hero: React.FC<HeroProps> = ({ onInquire }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.hash = `/tour-packages?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  const popularDestinations = ["Everest", "Annapurna", "Bali", "Pokhara"];

  return (
    <section className="relative min-h-[720px] md:min-h-[760px] lg:min-h-[820px] overflow-hidden bg-[#2D1347]">
      {/* Sticky service strip */}
      <div className="sticky top-0 z-[60]">
        <ServicesStrip />
      </div>

      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=2000"
        alt="Himalayas"
        className="absolute inset-0 h-full w-full object-cover opacity-60 animate-slow-zoom"
        style={{ objectPosition: "center 40%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D1347]/95 via-[#2D1347]/70 to-[#2D1347]/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <div className="animate-fade-in-left text-white">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
                Trusted Travel Partner in Nepal
              </span>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
                Your Complete Travel
                <br />
                Solution in Nepal
              </h1>

              <p className="mt-5 max-w-xl text-base sm:text-lg text-white/80 font-medium leading-relaxed">
                Tours, treks, transport, hotels, and expert support—everything
                you need for a smooth and memorable journey.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                onClick={onInquire}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#D92671] px-6 sm:px-7 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-xl transition-all hover:-translate-y-0.5 hover:brightness-110"
              >
                <span>Send Inquiry</span>
                <ChevronRight size={18} />
              </button>

              <a
                href="#/tour-packages"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 sm:px-7 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#2D1347]"
              >
                Explore Packages
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="animate-fade-in-right lg:justify-self-end">
            <div className="relative mx-auto w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-[#D92671]/20 blur-3xl -mr-10 -mt-10" />

              <div className="relative z-10 p-5 sm:p-6 md:p-7">
                <div className="mb-6">
                  <h3 className="flex items-center text-lg sm:text-xl font-black text-white">
                    <Navigation className="mr-2 text-[#D92671]" size={20} />
                    Plan Your Journey
                  </h3>
                  <p className="mt-1 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-white/55">
                    Search tours and treks
                  </p>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                      Destination or Activity
                    </label>

                    <div className="relative">
                      <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D92671]"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Search Everest, Pokhara..."
                        className="w-full rounded-xl bg-white/95 py-4 pl-11 pr-4 text-sm font-bold text-[#2D1347] outline-none transition-all focus:ring-4 focus:ring-[#D92671]/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D92671] to-[#FF4081] py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg transition-all hover:brightness-110"
                  >
                    <span>Search Packages</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </form>

                <div className="mt-7">
                  <div className="mb-3 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    <TrendingUp size={11} className="mr-2" />
                    Quick Search
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {popularDestinations.map((dest) => (
                      <button
                        key={dest}
                        type="button"
                        onClick={() => setSearchTerm(dest)}
                        className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-bold text-white/85 transition-all hover:border-[#D92671] hover:bg-[#D92671] hover:text-white"
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end right */}
        </div>
      </div>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.12); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s linear infinite alternate;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-32px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(32px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

const ArrowRight = ({
  size,
  className,
}: {
  size: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default Hero;