import React from "react";

interface Props {
  title: string;
  description: string;
  btn1: string;
  btn2: string;
}

const PreFooter: React.FC<Props> = ({ title, description, btn1, btn2 }) => {
  return (
    <section className="w-full bg-gradient-to-r from-pink-600 to-rose-500 py-10 px-4 sm:px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Content */}
        <div className="text-white text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{title}</h2>
          <p className="mt-2 text-sm sm:text-base font-semibold opacity-90">{description}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <a
            href="tel:+9779800000000"
            className="bg-indigo-950 text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-indigo-900 transition text-sm sm:text-base w-full sm:w-auto text-center inline-block cursor-pointer shadow-md"
          >
            {btn1}
          </a>
          <button
            onClick={() => {
              const msg = encodeURIComponent("Hello Trip Himalaya! I would like to get a free quote for travel/trekking packages.");
              window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
            }}
            className="bg-white text-pink-600 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition text-sm sm:text-base w-full sm:w-auto text-center cursor-pointer shadow-md"
          >
            {btn2}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PreFooter;
