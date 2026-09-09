import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { videoPosts } from "../../assets/data/mockData";
import YouTubePlayer from "./YouTubePlayer";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Facebook,
  MessageCircle,
  Share2,
  TrendingUp,
  Twitter,
  Youtube,
  Video as VideoIcon,
} from "lucide-react";

const VideoDetails: React.FC = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const video = videoPosts.find(
    (v) => v.id.toLowerCase() === videoId?.toLowerCase()
  );

  if (!video) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 bg-gray-900 text-center font-sans">
        <div className="w-20 h-20 rounded-3xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-5 shadow-sm border border-pink-500/20">
          <VideoIcon size={38} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Video Not Found
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
          The video you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/blog?mode=video"
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all"
        >
          <ChevronLeft size={16} />
          Back to Vlogs
        </Link>
      </div>
    );
  }

  const initials = video.author
    .trim()
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase();

  const related = videoPosts.filter((v) => v.id !== video.id).slice(0, 3);

  return (
    <div className="font-sans">

      {/* ── HERO: Dark video player section ── */}
      <div className="bg-gray-950 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate("/blog?mode=video")}
            className="flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer w-fit"
          >
            <ChevronLeft size={14} />
            Back to Vlogs
          </button>

          {/* YouTube Player — responsive 16:9 */}
          <YouTubePlayer videoUrl={video.videoUrl} />

          {/* Video meta */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-widest">
              <span className="px-4 py-1.5 rounded-full bg-[#E91E63] text-white text-[10px] uppercase">
                {video.category}
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <Clock size={13} className="text-[#E91E63]" />
                {video.duration}
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <Eye size={13} className="text-[#E91E63]" />
                {video.views} Views
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight max-w-4xl">
              {video.title}
            </h1>

            {/* Author + date */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E91E63] flex items-center justify-center text-white font-bold text-sm border-2 border-pink-400">
                  {initials}
                </div>
                <div>
                  <p className="text-[9px] text-[#E91E63] font-bold uppercase tracking-widest">
                    Uploaded By
                  </p>
                  <p className="text-sm font-bold text-white">
                    {video.author.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="text-[9px] text-[#E91E63] font-bold uppercase tracking-widest">
                  Release Date
                </p>
                <p className="text-sm font-bold text-white">
                  {video.date.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Action bar */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div className="flex items-center gap-6 text-sm font-semibold text-[#2D1347]">
                <button className="flex items-center gap-2 hover:text-[#E91E63] transition-colors cursor-pointer">
                  <Youtube size={18} className="text-[#E91E63]" />
                  Subscribe
                </button>
                <button className="flex items-center gap-2 hover:text-[#E91E63] transition-colors cursor-pointer">
                  <MessageCircle size={18} />
                  Comments
                </button>
              </div>
              <div className="flex gap-2">
                {[Facebook, Twitter, Share2].map((Icon, i) => (
                  <button
                    key={i}
                    className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 cursor-pointer"
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold tracking-wide text-[#2D1347] uppercase">
                About This Journey
              </h2>
              <p className="text-[#2D1347] font-bold text-base italic leading-relaxed">
                {video.description}
              </p>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {video.content}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <h3 className="font-bold flex items-center gap-2 text-[#2D1347] uppercase text-sm">
              <TrendingUp size={16} className="text-[#E91E63]" />
              More Visuals
            </h3>

            <div className="space-y-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/watch/${item.id}`}
                  className="flex gap-3 group cursor-pointer"
                >
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] px-1 rounded font-bold">
                      {item.duration}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#E91E63] font-bold uppercase mb-0.5">
                      {item.category}
                    </p>
                    <p className="text-xs font-bold text-[#2D1347] line-clamp-2 group-hover:text-[#E91E63] transition-colors leading-snug">
                      {item.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA card */}
            <div className="bg-[#E91E63] rounded-3xl py-10 px-8 text-white text-center">
              <h2 className="text-xl font-bold mb-2">Feel The Vibe?</h2>
              <p className="text-pink-100 mb-6 text-sm leading-relaxed">
                Stop watching and start living. Book your custom adventure
                today.
              </p>
              <button
                onClick={() => navigate("/packages")}
                className="w-full bg-white text-[#E91E63] px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors cursor-pointer text-xs uppercase tracking-wider"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
