import { SquarePlay } from "lucide-react";
import React from "react";

const WeeklyVlogSub: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 mt-6">
      {/* Subscribe Card */}
      <div className="bg-gradient-to-br from-purple-800 to-purple-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Decorative Shape */}
        <div className="absolute -top-10 rotate-5 -right-5 opacity-20">
          <SquarePlay size={100} />
        </div>

        <h2 className="text-2xl font-bold mb-2">Weekly Vlogs. Zero Spam.</h2>
        <p className="text-sm text-purple-200 mb-6">
          Subscribe to get fresh trek films and travel vlogs directly in your
          inbox
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-xl bg-purple-300/20 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <button className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 transition font-semibold">
            SUBSCRIBE NOW
          </button>
        </div>
      </div>

      {/* Blog & News Card */}
      <div className="bg-white p-6 rounded-3xl shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-pink-500 rounded-sm"></div>
          <h3 className="font-semibold text-gray-800">BLOG & NEWS</h3>
        </div>

        <button className="w-full py-3 rounded-xl bg-purple-900 text-white font-semibold hover:bg-purple-800 transition">
          READ LATEST ARTICLES
        </button>
      </div>
    </div>
  );
};

export default WeeklyVlogSub;
