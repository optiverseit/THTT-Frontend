import React from "react";
import {
  ChevronRight,
  Navigation,
  Search,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const Banner: React.FC = () => {
  const quickSearch: string[] = ["Everest", "Annapurna", "Bali", "Pokhara"];

  return (
    <section className="relative min-h-[540px] md:min-h-[640px] flex flex-col overflow-hidden bg-[#2D1347]">
      {/* Background with overlay — brighter and lighter */}
      <img
        src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=2000"
        alt="Himalayas"
        className="absolute inset-0 w-full h-full object-cover opacity-75"
        style={{ objectPosition: "center 40%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-purple-950/10 to-purple-950/65" />

      {/* Main hero content */}
      <div className="relative z-10 flex flex-1 items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-16 md:pb-20 px-4 sm:px-6 lg:px-10">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">

          {/* Left Hero Text — shifted significantly upward */}
          <div className="hidden md:flex flex-col justify-center max-w-2xl text-white -mt-20 md:-mt-32 lg:-mt-36">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.15] tracking-tight">
              Your Complete Travel Solution In Nepal
            </h1>
            <p className="mt-4 text-lg md:text-xl font-medium text-gray-200">
              Your Journey, Our Expertise.
            </p>
            <button
              onClick={() => {
                const message = encodeURIComponent("Hello Trip Himalaya! I would like to inquire about your travel and trekking packages.");
                window.open(`https://wa.me/9779800000003?text=${message}`, "_blank", "noopener,noreferrer");
              }}
              className="mt-7 w-fit px-8 py-3.5 border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white hover:text-[#2D1347] rounded-xl cursor-pointer transition-all duration-200 shadow-lg group"
            >
              <span className="flex items-center gap-2.5 font-bold text-sm">
                <span>SEND INQUIRY</span>
                <ChevronRight size={16} className="text-pink-400 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Search Card */}
          <div className="w-full md:w-[380px] lg:w-[400px] p-5 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
            {/* Mobile heading */}
            <div className="md:hidden text-white mb-4">
              <h1 className="text-2xl font-extrabold leading-tight">
                Your Complete Travel Solution In Nepal
              </h1>
              <p className="mt-1 text-sm text-gray-200">Your Journey, Our Expertise.</p>
            </div>

            <h2 className="text-base font-extrabold flex items-center gap-2 text-white">
              <Navigation size={16} className="text-pink-400" />
              Plan Your Journey
            </h2>
            <p className="text-[10px] font-bold text-gray-300 mt-1 mb-4 uppercase tracking-wider">
              Search Tours & Treks
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                  Destination or Activity
                </label>
                <div className="flex mt-2 items-center gap-2 border border-white/30 p-3 rounded-xl bg-white/20 text-white text-xs font-bold">
                  <Search size={12} className="text-pink-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search Everest, Bali..."
                    className="bg-transparent outline-none w-full placeholder-gray-300 text-white text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-pink-500 text-white p-3 rounded-xl hover:bg-pink-600 flex items-center justify-center gap-2 font-bold text-xs shadow-lg transition-colors cursor-pointer"
                >
                  SEARCH PACKAGES
                  <ArrowRight size={12} />
                </button>
              </div>
            </form>

            <p className="mt-6 text-[9px] font-bold text-gray-300 flex items-center gap-2 uppercase tracking-widest">
              <TrendingUp size={12} />
              Quick Search
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {quickSearch.map((q, i) => (
                <button
                  key={i}
                  className="px-3 py-1.5 rounded-lg backdrop-blur-xl bg-white/20 text-[10px] font-bold text-gray-200 hover:bg-white/30 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
