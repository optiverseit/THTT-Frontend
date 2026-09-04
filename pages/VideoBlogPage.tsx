import React, { useMemo, useState } from "react";
import { videoPosts } from "../data/mockData";
import { VideoPost } from "../types";
import {
  Calendar,
  Eye,
  Search,
  Play,
  X,
  TrendingUp,
  Film,
  Youtube,
  ArrowRight,
  Share2,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import ServicesStrip from "@/components/Layout/ServicesStrip";
import { Link } from "react-router-dom";

const VideoBlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);

  const categories = useMemo(() => {
    return ["ALL", ...Array.from(new Set(videoPosts.map((v) => v.category)))];
  }, []);

  const filteredVideos = useMemo(() => {
    return videoPosts.filter((v) => {
      const matchesCat =
        activeCategory === "ALL" || v.category === activeCategory;
      const matchesSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Sidebar “Latest Videos”
  const trendingVideos = useMemo(() => videoPosts.slice(0, 3), []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Sticky Services Strip (same as BlogPage) */}
      <div className="sticky top-0 z-[60]">
        <ServicesStrip />
      </div>

      {/* Cinematic Hero Header (same layout as BlogPage) */}
      <section className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000"
            alt="Video Blog Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-700">
          <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">
            The Visual Journal
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
            Video <span className=" ">Vlogs</span>
          </h1>

          <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-8 shadow-lg" />

          <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
            "Watch the Himalayas come alive — curated vlogs, trek stories, and
            travel films."
          </p>
        </div>
      </section>

      {/* Main content section (same grid structure as BlogPage) */}
      <section className="py-20 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Video Feed */}
            <div className="lg:col-span-8 space-y-12">
              {/* Header row + search (same as BlogPage) */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                {/* Left title */}
                <div className="flex items-center space-x-4">
                  <div className="w-1.5 h-8 bg-[#D92671] rounded-full"></div>
                  <h2 className="text-3xl font-black text-[#2D1347] tracking-tight">
                    Latest Vlogs
                  </h2>

                  
                </div>

                {/* Right side: Search + mobile button */}
                <div className="flex items-center gap-3">
                  {/* ✅ Button on mobile (shows only on small screens) */}
                  <Link
                    to="/blog"
                    className="md:hidden inline-flex items-center justify-center bg-[#2D1347] text-white px-4 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-[#D92671] transition-all shadow-lg"
                  >
                    Read Blogs
                  </Link>

                  {/* Search */}
                  <div className="relative w-full md:w-auto">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search videos..."
                      className="bg-white border border-slate-100 pl-10 pr-6 py-3 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#D92671]/20 focus:border-[#D92671] transition-all w-full md:w-64 shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {/* ✅ Top button (shows from md and up) */}
                  <div className="hidden md:block">
                    <Link
                      to="/blog"
                      className="inline-flex items-center justify-center bg-[#2D1347] text-white px-5 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-[#D92671] transition-all shadow-lg"
                    >
                      Read Blogs
                    </Link>
                  </div>
                </div>
              </div>

              {/* Categories pills (BlogPage-like) */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border ${
                      activeCategory === cat
                        ? "bg-[#2D1347] text-white border-[#2D1347] shadow-lg"
                        : "bg-white text-slate-400 border-slate-100 hover:text-[#D92671] hover:border-[#D92671]/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Video Grid (2nd design card language, same links) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredVideos.map((video) => (
                  <Link
                    key={video.id}
                    to={`/video-blog/${video.slug}`} // ✅ keep same link
                    className="group bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full"
                  >
                    {/* Thumbnail (2nd design style) */}
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />

                      {/* Category badge (Blog-style) */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-[#D92671] tracking-widest uppercase shadow-xl">
                        {video.category}
                      </div>

                      {/* Duration badge (top-right) */}
                      <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {video.duration}
                      </div>

                      {/* Play button (same vibe as 2nd) */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-[#D92671] rounded-full flex items-center justify-center text-white shadow-2xl transform scale-90 group-hover:scale-110 transition-transform duration-500">
                          <Play size={24} fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    {/* Content (Blog-card typography) */}
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center space-x-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center">
                          <Eye size={12} className="mr-1.5 text-[#D92671]" />
                          {video.views} Views
                        </span>
                        <span className="flex items-center">
                          <Calendar
                            size={12}
                            className="mr-1.5 text-[#D92671]"
                          />
                          {video.date}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-[#2D1347] mb-4 group-hover:text-[#D92671] transition-colors tracking-tight leading-tight">
                        {video.title}
                      </h3>

                      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                        {video.description}
                      </p>

                      {/* Footer row (Blog-style CTA + share) */}
                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#2D1347] uppercase tracking-widest flex items-center group/btn">
                          Watch Video
                          <div className="ml-2 w-6 h-6 bg-[#D92671] rounded-full flex items-center justify-center text-white group-hover/btn:scale-110 transition-transform">
                            <Play size={10} fill="currentColor" />
                          </div>
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault(); // prevents navigation
                            // put your share logic here
                          }}
                          className="text-slate-300 hover:text-[#D92671] transition-colors"
                          aria-label="Share"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}

                {filteredVideos.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Film size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-[#2D1347]">
                      No videos found
                    </h3>
                    <button
                      onClick={() => {
                        setActiveCategory("ALL");
                        setSearchQuery("");
                      }}
                      className="text-[#D92671] font-bold text-xs uppercase tracking-widest mt-4"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Empty state */}
              {filteredVideos.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                  <h3 className="text-xl font-black text-[#2D1347]">
                    No videos found
                  </h3>
                  <button
                    onClick={() => {
                      setActiveCategory("ALL");
                      setSearchQuery("");
                    }}
                    className="text-[#D92671] font-bold text-xs uppercase tracking-widest mt-4"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar (same structure as BlogPage) */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                {/* Latest Videos Widget */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                  <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-black text-[#2D1347] flex items-center uppercase tracking-tight">
                      <Film size={20} className="mr-3 text-[#D92671]" /> Latest
                      Videos
                    </h3>
                  </div>

                  <div className="p-6 space-y-6">
                    {trendingVideos.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVideo(v)}
                        className="w-full flex items-center gap-4 group text-left"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 order-2">
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>

                        <div className="flex flex-col justify-center order-1 flex-1">
                          <p className="text-[9px] font-black text-[#D92671] uppercase tracking-widest mb-1">
                            {v.date}
                          </p>

                          <h4 className="text-xs font-black text-[#2D1347] leading-tight group-hover:text-[#D92671] transition-colors line-clamp-2">
                            {v.title}
                          </h4>

                          <div className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                            Watch Now
                            <ArrowRight
                              size={10}
                              className="ml-1 group-hover:translate-x-1 transition-transform"
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-6 pt-0">
                    <button className="w-full bg-[#2D1347] text-white py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-[#D92671] transition-all shadow-lg">
                      View All Videos
                    </button>
                  </div>
                </div>

                {/* Subscribe Widget */}
                <div className="bg-gradient-to-br from-[#5D2A8E] to-[#2D1347] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute -top-10 -right-10 opacity-10">
                    <Youtube size={150} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 relative z-10 leading-tight">
                    Weekly Vlogs, Zero Spam.
                  </h3>
                  <p className="text-white/60 text-xs font-medium mb-8 relative z-10 leading-relaxed">
                    Subscribe to get fresh trek films and travel vlogs directly
                    in your inbox.
                  </p>

                  <div className="space-y-3 relative z-10">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-white/10 border border-white/20 px-6 py-4 rounded-2xl text-xs font-bold placeholder-white/40 outline-none focus:bg-white focus:text-[#2D1347] transition-all"
                    />
                    <button className="w-full bg-[#D92671] text-white py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-xl hover:brightness-110 transition-all">
                      Subscribe Now
                    </button>
                  </div>
                </div>

                {/* Blog cross-link */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                  <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-black text-[#2D1347] flex items-center uppercase tracking-tight">
                      <Newspaper size={20} className="mr-3 text-[#D92671]" />{" "}
                      Blog & News
                    </h3>
                  </div>

                  <div className="p-6">
                    <Link
                      to="/blog"
                      className="w-full inline-flex items-center justify-center bg-[#2D1347] text-white py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-[#D92671] transition-all shadow-lg"
                    >
                      Read Latest Articles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 bg-[#D92671] text-white px-10 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-md hover:shadow-xl transition-all group"
            >
              Back to Top
              <ArrowRight
                size={16}
                className="rotate-[-90deg] group-hover:-translate-y-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal (theater mode) */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-8 right-8 text-white hover:text-[#D92671] transition-all bg-white/10 p-4 rounded-full backdrop-blur-md border border-white/20 z-[3100]"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-6xl relative animate-in zoom-in duration-500">
            <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-10 text-white">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-[#D92671] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {selectedVideo.category}
                </span>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                  Published on {selectedVideo.date}
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                {selectedVideo.title}
              </h2>

              <p className="text-white/60 text-lg font-medium leading-relaxed max-w-3xl">
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoBlogPage;
