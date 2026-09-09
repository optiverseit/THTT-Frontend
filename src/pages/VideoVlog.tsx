import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import BannerSection from "../components/reusable/BannerSection";
import PreFooter from "../components/reusable/PreFooter";
import LatestVlogs from "../components/blog/LatestVlogs";
import LatestVideos from "../components/blog/LatestVideos";
import WeeklyVlogSub from "../components/blog/WeeklyVlogSub";
import { videoPosts } from "../assets/data/mockData";

const VideoVlog: React.FC = () => {
  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-700">
      <BannerSection
        background="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
        alt="Himalayan Mountain Peaks"
        heading="THE VISUAL JOURNAL"
        title="Video Vlogs & Short Films"
        description="Watch the Himalayas come alive — cinematic drone films, trek stories, and mountain films."
      />

      {/* Switch Mode Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-purple-100 shadow-lg shadow-purple-900/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span>Currently Viewing: <strong className="text-[#2D1347]">Visual Video Journal</strong></span>
          </div>
          <Link
            to="/blog?mode=read"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#2D1347] text-xs font-black uppercase tracking-wider transition-colors"
          >
            <BookOpen size={14} className="text-[#E91E63]" />
            <span>Switch to Reading Blog Articles</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          <div className="lg:col-span-2">
            <LatestVlogs vlogs={videoPosts} />
          </div>
          <aside className="space-y-8">
            <LatestVideos vlogs={videoPosts} />
            <WeeklyVlogSub />
          </aside>
        </div>
      </div>

      <PreFooter
        title="Plan Your Himalayan Expedition"
        description="Get advice and customized itineraries from certified mountain guides."
        btn1="Call Us Now"
        btn2="Request a Quote"
      />
    </div>
  );
};

export default VideoVlog;
