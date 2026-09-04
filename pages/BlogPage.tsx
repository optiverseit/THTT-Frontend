import React, { useState } from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/mockData";
import {
  Calendar,
  User,
  Clock,
  Search,
  ChevronRight,
  Play,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Newspaper,
  Globe,
  Zap,
  Film,
} from "lucide-react";
import ServicesStrip from "@/components/Layout/ServicesStrip";

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const trendingNews = blogPosts.slice(0, 3); // For the sidebar

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className={`sticky top-0 z-[60]`}>
        <ServicesStrip />
      </div>
      {/* Cinematic Hero Header */}
      <section className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&q=80&w=2000"
            alt="Blog Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50"></div>
        </div>
        {/* content */}
        <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-700">
          <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">
            The Travel Journal
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
            Blog & News
          </h1>
          <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-8 shadow-lg"></div>
          <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
            "Your weekly dose of Himalayan inspiration and global travel
            insights."
          </p>
        </div>
      </section>

      <section className="py-20 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Main Blog Feed */}
            <div className="lg:col-span-8 space-y-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
  {/* Left title */}
  <div className="flex items-center space-x-4">
    <div className="w-1.5 h-8 bg-[#D92671] rounded-full"></div>
    <h2 className="text-3xl font-black text-[#2D1347] tracking-tight">
      Latest Blogs
    </h2>

   
  </div>

  {/* Right side: Search + mobile button */}
  <div className="flex items-center gap-3">
    {/* ✅ Button on mobile (shows only on small screens) */}
    <Link
      to="/video-blog"
      className="md:hidden inline-flex items-center justify-center bg-[#2D1347] text-white px-4 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-[#D92671] transition-all shadow-lg"
    >
      Watch Vlogs
    </Link>

    {/* Search */}
    <div className="relative w-full md:w-auto">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
        size={16}
      />
      <input
        type="text"
        placeholder="Search articles..."
        className="bg-white border border-slate-100 pl-10 pr-6 py-3 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#D92671]/20 focus:border-[#D92671] transition-all w-full md:w-64 shadow-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
     {/* ✅ Top button (shows from md and up) */}
    <div className="hidden md:block">
      <Link
        to="/video-blog"
        className="inline-flex items-center justify-center bg-[#2D1347] text-white px-5 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-[#D92671] transition-all shadow-lg"
      >
        Watch Vlogs
      </Link>
    </div>
  </div>
</div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full"
                  >
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-[#D92671] tracking-widest uppercase shadow-xl">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center space-x-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center">
                          <Calendar
                            size={12}
                            className="mr-1.5 text-[#D92671]"
                          />{" "}
                          {post.date}
                        </span>
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1.5 text-[#D92671]" />{" "}
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-[#2D1347] mb-4 group-hover:text-[#D92671] transition-colors tracking-tight leading-tight">
                        {post.title}
                      </h3>

                      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-[10px] font-black text-[#2D1347] uppercase tracking-widest flex items-center group/btn"
                        >
                          Read More
                          <div className="ml-2 w-6 h-6 bg-[#D92671] rounded-full flex items-center justify-center text-white group-hover/btn:scale-110 transition-transform">
                            <Play size={10} fill="currentColor" />
                          </div>
                        </Link>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden">
                            <img
                              src={`https://ui-avatars.com/api/?name=${post.author}&background=5D2A8E&color=fff`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase">
                            {post.author}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                  <h3 className="text-xl font-black text-[#2D1347]">
                    No articles found
                  </h3>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#D92671] font-bold text-xs uppercase tracking-widest mt-4"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                {/* Latest News Widget */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                  <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-black text-[#2D1347] flex items-center uppercase tracking-tight">
                      <Newspaper size={20} className="mr-3 text-[#D92671]" />{" "}
                      Latest News
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {trendingNews.map((news) => (
                      <Link
                        key={news.id}
                        to={`/blog/${news.slug}`}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 order-2">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>

                        <div className="flex flex-col justify-center order-1 flex-1">
                          <p className="text-[9px] font-black text-[#D92671] uppercase tracking-widest mb-1">
                            {news.date}
                          </p>

                          <h4 className="text-xs font-black text-[#2D1347] leading-tight group-hover:text-[#D92671] transition-colors line-clamp-2">
                            {news.title}
                          </h4>

                          <div className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                            Read More
                            <ArrowRight
                              size={10}
                              className="ml-1 group-hover:translate-x-1 transition-transform"
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-6 pt-0">
                    <button className="w-full bg-[#2D1347] text-white py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-[#D92671] transition-all shadow-lg">
                      All Updates
                    </button>
                  </div>
                </div>

                {/* Newsletter Widget */}
                <div className="bg-gradient-to-br from-[#5D2A8E] to-[#2D1347] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute -top-10 -right-10 opacity-10">
                    <TrendingUp size={150} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 relative z-10 leading-tight">
                    Stay Inspired, Get Updates.
                  </h3>
                  <p className="text-white/60 text-xs font-medium mb-8 relative z-10 leading-relaxed">
                    Subscribe to our newsletter for exclusive tour offers and
                    Himalayan news.
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
                {/* Mini “Video Vlogs” cross-link (same style as Video page card) */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                  <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-black text-[#2D1347] flex items-center uppercase tracking-tight">
                      <Film size={20} className="mr-3 text-[#D92671]" /> Video
                      Vlogs
                    </h3>
                  </div>

                  <div className="p-6">
                    <Link
                      to="/video-blog"
                      className="w-full inline-flex items-center justify-center bg-[#2D1347] text-white py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-[#D92671] transition-all shadow-lg"
                    >
                      Watch Latest Vlogs
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default BlogPage;
