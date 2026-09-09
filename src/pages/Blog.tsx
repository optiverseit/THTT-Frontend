import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Clock,
  Calendar,
  Eye,
  Play,
  Share2,
  Tv2,
  BookOpen,
  BookOpenText,
  Clapperboard,
} from "lucide-react";
import BannerSection from "../components/reusable/BannerSection";
import { blogPosts, videoPosts } from "../assets/data/mockData";
import type { BlogPost, VideoPost } from "../assets/data/types";
import PreFooter from "../components/reusable/PreFooter";

// Re-export for backward compatibility
export type { BlogPost };
type BlogMode = "read" | "video";

// ─── BLOG CARD ───────────────────────────────────────────────────────────────
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 group transition-all duration-300 flex flex-col h-full">
    <div className="relative h-52 overflow-hidden flex-shrink-0">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[9px] font-black text-[#E91E63] uppercase tracking-wider shadow-sm">
        {post.category}
      </span>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold mb-2">
        <span className="flex items-center gap-1">
          <Calendar size={10} />
          {post.date}
        </span>
        {post.readTime && (
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {post.readTime}
          </span>
        )}
      </div>
      <h3 className="font-extrabold text-[#2D1347] text-sm leading-snug line-clamp-2 mb-2">
        {post.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <Link
          to={`/blog/${post.slug}`}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors group/link"
        >
          Read More
          <span className="w-5 h-5 rounded-full bg-[#E91E63] flex items-center justify-center group-hover/link:translate-x-0.5 transition-transform">
            <ArrowRight size={8} className="text-white" />
          </span>
        </Link>
        <span className="text-[9px] text-gray-400 font-bold uppercase">
          By {post.author}
        </span>
      </div>
    </div>
  </article>
);

// ─── VIDEO CARD ──────────────────────────────────────────────────────────────
const VideoCard: React.FC<{ vlog: VideoPost }> = ({ vlog }) => (
  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 group transition-all duration-300 flex flex-col h-full">
    <div className="relative h-52 overflow-hidden flex-shrink-0">
      <img
        src={vlog.thumbnail}
        alt={vlog.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[#E91E63]/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play size={18} className="text-white ml-0.5" fill="white" />
        </div>
      </div>
      {/* Category badge */}
      <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[9px] font-black text-[#E91E63] uppercase tracking-wider shadow-sm">
        {vlog.category}
      </span>
      {/* Duration badge */}
      <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 rounded text-[9px] text-white font-bold">
        {vlog.duration}
      </span>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold mb-2">
        <span className="flex items-center gap-1">
          <Eye size={10} />
          {vlog.views}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={10} />
          {vlog.date}
        </span>
      </div>
      <h3 className="font-extrabold text-[#2D1347] text-sm leading-snug line-clamp-2 mb-2">
        {vlog.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">
        {vlog.description}
      </p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <Link
          to={`/watch/${vlog.id}`}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors group/link"
        >
          Watch Video
          <span className="w-5 h-5 rounded-full bg-[#E91E63] flex items-center justify-center group-hover/link:translate-x-0.5 transition-transform">
            <ArrowRight size={8} className="text-white" />
          </span>
        </Link>
        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 cursor-pointer">
          <Share2 size={12} />
        </button>
      </div>
    </div>
  </article>
);

// ─── READ SIDEBAR ─────────────────────────────────────────────────────────────
const ReadSidebar: React.FC<{ onSwitchVideo: () => void }> = ({
  onSwitchVideo,
}) => {
  const recent = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-5">
      {/* Latest News */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h4 className="flex items-center gap-2 text-[11px] font-black text-[#2D1347] uppercase tracking-widest mb-4">
          <span className="w-1 h-4 bg-[#E91E63] rounded-full inline-block flex-shrink-0" />
          Latest News
        </h4>
        <div className="space-y-4">
          {recent.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="flex gap-3 group"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[9px] text-gray-400 font-semibold mb-0.5">
                  {post.date}
                </p>
                <p className="text-xs font-bold text-[#2D1347] line-clamp-2 group-hover:text-[#E91E63] transition-colors leading-snug">
                  {post.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link
          to="/blog"
          className="mt-5 w-full flex justify-center py-2.5 rounded-full border border-[#E91E63] text-[#E91E63] text-[10px] font-black uppercase tracking-widest hover:bg-[#E91E63] hover:text-white transition-colors"
        >
          All Stories
        </Link>
      </div>

      {/* Newsletter */}
      <div className="bg-[#2D1347] rounded-2xl p-6 text-white">
        <h4 className="text-xl font-black mb-1 leading-tight">
          Stay Inspired,
          <br />
          Get Updates.
        </h4>
        <p className="text-xs text-purple-300 mb-4 leading-relaxed">
          Subscribe for exclusive tips and travel deals.
        </p>
        <input
          type="email"
          placeholder="Email address..."
          className="w-full px-4 py-2.5 rounded-full text-xs bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#E91E63] mb-3"
        />
        <button className="w-full py-2.5 rounded-full bg-[#E91E63] hover:bg-pink-600 text-white text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
          Subscribe Now
        </button>
      </div>

      {/* Video Vlogs CTA */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
        <div className="flex items-center gap-2 justify-center mb-3">
          <Tv2 size={14} className="text-[#E91E63]" />
          <span className="text-[10px] font-black text-[#2D1347] uppercase tracking-widest">
            Video Vlogs
          </span>
        </div>
        <button
          onClick={onSwitchVideo}
          className="w-full py-2.5 rounded-full bg-[#2D1347] hover:bg-purple-900 text-white text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          Watch Latest Vlogs
        </button>
      </div>
    </div>
  );
};

// ─── VIDEO SIDEBAR ────────────────────────────────────────────────────────────
const VideoSidebar: React.FC<{ onSwitchRead: () => void }> = ({
  onSwitchRead,
}) => {
  const recent = [...videoPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-5">
      {/* Latest Videos */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h4 className="flex items-center gap-2 text-[11px] font-black text-[#2D1347] uppercase tracking-widest mb-4">
          <span className="w-1 h-4 bg-[#E91E63] rounded-full inline-block flex-shrink-0" />
          Latest Videos
        </h4>
        <div className="space-y-4">
          {recent.map((v) => (
            <Link
              key={v.id}
              to={`/watch/${v.id}`}
              className="flex gap-3 group"
            >
              <div className="relative w-20 h-13 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] px-1 rounded font-bold">
                  {v.duration}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-[#E91E63] font-bold uppercase mb-0.5">
                  {v.category}
                </p>
                <p className="text-xs font-bold text-[#2D1347] line-clamp-2 group-hover:text-[#E91E63] transition-colors leading-snug">
                  {v.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link
          to="/vlogs"
          className="mt-5 w-full flex justify-center py-2.5 rounded-full border border-[#E91E63] text-[#E91E63] text-[10px] font-black uppercase tracking-widest hover:bg-[#E91E63] hover:text-white transition-colors"
        >
          View All Vlogs
        </Link>
      </div>

      {/* Newsletter */}
      <div className="bg-[#2D1347] rounded-2xl p-6 text-white">
        <h4 className="text-xl font-black mb-1 leading-tight">
          Weekly Vlogs,
          <br />
          Zero Spam.
        </h4>
        <p className="text-xs text-purple-300 mb-4 leading-relaxed">
          Subscribe to get fresh vlogs and travel blogs every week.
        </p>
        <input
          type="email"
          placeholder="Email address..."
          className="w-full px-4 py-2.5 rounded-full text-xs bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#E91E63] mb-3"
        />
        <button className="w-full py-2.5 rounded-full bg-[#E91E63] hover:bg-pink-600 text-white text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
          Subscribe Now
        </button>
      </div>

      {/* Blog & News CTA */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
        <div className="flex items-center gap-2 justify-center mb-3">
          <BookOpen size={14} className="text-[#E91E63]" />
          <span className="text-[10px] font-black text-[#2D1347] uppercase tracking-widest">
            Blog &amp; News
          </span>
        </div>
        <button
          onClick={onSwitchRead}
          className="w-full py-2.5 rounded-full bg-[#2D1347] hover:bg-purple-900 text-white text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          Read Latest Articles
        </button>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const Blog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialMode: BlogMode =
    searchParams.get("mode") === "video" ? "video" : "read";

  const [mode, setMode] = useState<BlogMode>(initialMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleModeChange = (newMode: BlogMode) => {
    setMode(newMode);
    setSelectedCategory("All");
    setSearchQuery("");
    setSearchParams(newMode === "video" ? { mode: "video" } : {});
  };

  const readCategories = [
    "All",
    "TREKKING",
    "INTERNATIONAL",
    "TRAVEL TIPS",
    "VISA ASSISTANCE",
    "LUXURY",
  ];
  const videoCategories = ["All", "ADVENTURE", "DESTINATIONS", "WILDLIFE", "LUXURY"];

  const filteredPosts = useMemo(
    () =>
      blogPosts.filter((p) => {
        const s = searchQuery.toLowerCase();
        const matchSearch =
          p.title.toLowerCase().includes(s) ||
          p.excerpt.toLowerCase().includes(s);
        const matchCat =
          selectedCategory === "All" ||
          p.category.toUpperCase() === selectedCategory;
        return matchSearch && matchCat;
      }),
    [searchQuery, selectedCategory]
  );

  const filteredVideos = useMemo(
    () =>
      videoPosts.filter((v) => {
        const s = searchQuery.toLowerCase();
        const matchSearch =
          v.title.toLowerCase().includes(s) ||
          v.description.toLowerCase().includes(s);
        const matchCat =
          selectedCategory === "All" ||
          v.category.toUpperCase() === selectedCategory;
        return matchSearch && matchCat;
      }),
    [searchQuery, selectedCategory]
  );

  const categories = mode === "read" ? readCategories : videoCategories;
  const title = mode === "read" ? "Latest Blogs" : "Latest Vlogs";

  return (
    <div className="bg-[#F8F8FB] min-h-screen font-sans">

      {/* ── HERO BANNER — identical structure to Packages page ── */}
      <div className="relative">
        {mode === "read" ? (
          <BannerSection
            background="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000"
            alt="Himalayan Sunset & Base Camp"
            heading="THE HIMALAYAN JOURNAL"
            title="Travel Stories & Guides"
            description="Explore the stories and guides crafted for your next adventure."
            overlayGradient="bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/55 to-[#2D1347]/20"
            bottomGradient="h-10 sm:h-14 bg-gradient-to-t from-[#F8F8FB] to-transparent"
            searchBar={
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Keyword */}
                <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                  <Search size={18} className="text-pink-500 flex-shrink-0" />
                  <div className="flex flex-col w-full text-left">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      SEARCH KEYWORD
                    </label>
                    <input
                      type="text"
                      className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal"
                      placeholder="Search articles, guides, topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                {/* Select Category */}
                <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                  <BookOpenText size={18} className="text-pink-500 flex-shrink-0" />
                  <div className="flex flex-col w-full text-left">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      SELECT CATEGORY
                    </label>
                    <select
                      className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      <option value="TREKKING">Trekking</option>
                      <option value="INTERNATIONAL">International</option>
                      <option value="TRAVEL TIPS">Travel Tips</option>
                      <option value="VISA ASSISTANCE">Visa Assistance</option>
                      <option value="LUXURY">Luxury</option>
                    </select>
                  </div>
                </div>
                {/* Search Button */}
                <button className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer">
                  SEARCH
                </button>
              </div>
            }
          />
        ) : (
          <BannerSection
            background="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
            alt="Himalayan Mountain Vista"
            heading="THE VISUAL JOURNAL"
            title="Video Vlogs & Short Films"
            description="Watch the Himalayas come alive through cinematic stories and adventure films."
            overlayGradient="bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/55 to-[#2D1347]/20"
            bottomGradient="h-10 sm:h-14 bg-gradient-to-t from-[#F8F8FB] to-transparent"
            searchBar={
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Keyword */}
                <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                  <Search size={18} className="text-pink-500 flex-shrink-0" />
                  <div className="flex flex-col w-full text-left">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      SEARCH KEYWORD
                    </label>
                    <input
                      type="text"
                      className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal"
                      placeholder="Search vlogs, destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                {/* Select Category */}
                <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                  <Clapperboard size={18} className="text-pink-500 flex-shrink-0" />
                  <div className="flex flex-col w-full text-left">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      SELECT CATEGORY
                    </label>
                    <select
                      className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      <option value="ADVENTURE">Adventure</option>
                      <option value="DESTINATIONS">Destinations</option>
                      <option value="WILDLIFE">Wildlife</option>
                      <option value="LUXURY">Luxury</option>
                    </select>
                  </div>
                </div>
                {/* Search Button */}
                <button className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer">
                  SEARCH
                </button>
              </div>
            }
          />
        )}
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── LEFT: Main Content ── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Section header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-[#2D1347] flex items-center gap-3">
                <span className="w-1.5 h-8 bg-[#E91E63] rounded-full inline-block flex-shrink-0" />
                {title}
              </h2>
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      mode === "read" ? "Search blogs..." : "Search vlogs..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-36 sm:w-48 pl-8 pr-3 py-2 rounded-full border border-gray-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E91E63] shadow-xs"
                  />
                  <Search
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
                {/* Mode toggle button */}
                {mode === "read" ? (
                  <button
                    id="blog-watch-vlogs-btn"
                    onClick={() => handleModeChange("video")}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#2D1347] hover:bg-purple-900 text-white text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Play size={9} fill="white" />
                    Watch Vlogs
                  </button>
                ) : (
                  <button
                    id="blog-read-blog-btn"
                    onClick={() => handleModeChange("read")}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#2D1347] hover:bg-purple-900 text-white text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <BookOpen size={9} />
                    Read Blog
                  </button>
                )}
              </div>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#E91E63] text-white shadow-sm shadow-pink-200"
                      : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* ── BLOG GRID ── */}
            {mode === "read" &&
              (filteredPosts.length === 0 ? (
                <div className="col-span-2 text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-sm font-medium">
                    No articles found for your search.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                    className="mt-3 px-5 py-2 bg-[#E91E63] text-white rounded-full text-xs font-bold cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ))}

            {/* ── VIDEO GRID ── */}
            {mode === "video" &&
              (filteredVideos.length === 0 ? (
                <div className="col-span-2 text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-sm font-medium">
                    No vlogs found for your search.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                    className="mt-3 px-5 py-2 bg-[#E91E63] text-white rounded-full text-xs font-bold cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filteredVideos.map((v) => (
                    <VideoCard key={v.id} vlog={v} />
                  ))}
                </div>
              ))}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="lg:col-span-4">
            {mode === "read" ? (
              <ReadSidebar
                onSwitchVideo={() => handleModeChange("video")}
              />
            ) : (
              <VideoSidebar
                onSwitchRead={() => handleModeChange("read")}
              />
            )}
          </aside>
        </div>
      </div>

      {/* Pre-footer CTA */}
      <PreFooter
        title="Inspired to Explore the Himalayas?"
        description="Connect with our travel architects to craft your tailored journey today."
        btn1="Speak With an Expert"
        btn2="Plan Custom Itinerary"
      />
    </div>
  );
};

export default Blog;
