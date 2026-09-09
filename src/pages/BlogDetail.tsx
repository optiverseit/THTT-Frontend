import React from "react";
import {
  Share2,
  Bookmark,
  MessageSquare,
  Facebook,
  Twitter,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  FileQuestion,
  Clock,
  Calendar,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PreFooter from "../components/reusable/PreFooter";
import { blogPosts } from "../assets/data/mockData";

const BlogDetailMore: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const post = blogPosts.find(
    (p) => p.slug.toLowerCase() === slug?.toLowerCase() || p.id === slug
  );

  const tags: string[] = [
    "#ADVENTURE",
    "#HIMALAYAS",
    "#NEPAL2025",
    "#TREKKING",
    "#TRAVELTIPS",
  ];

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && p.id !== slug)
    .slice(0, 3);

  // ── NOT FOUND STATE ──────────────────────────────────────────────────────
  if (!post) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-purple-50/40 to-white flex items-center justify-center px-4 py-20 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-pink-50 flex items-center justify-center text-[#E91E63]">
            <FileQuestion size={40} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E91E63] block mb-2">
            Article Not Found
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D1347] mb-3 tracking-tight">
            Story Not Found
          </h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
            The travel story you're looking for doesn't exist or the link may
            be outdated.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-full border border-gray-200 text-xs font-bold text-[#2D1347] hover:bg-gray-50 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Go Back
            </button>
            <Link
              to="/blog"
              className="px-6 py-3 rounded-full bg-[#E91E63] hover:bg-pink-600 text-white text-xs font-bold shadow-md transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2"
            >
              Explore All Stories
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#4A5568]">

      {/* ── HERO: Full-width image with overlay title ── */}
      <section className="relative w-full h-[65vh] min-h-[480px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient: transparent top → dark purple bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d35]/95 via-[#2D1B69]/40 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-between py-8">
          {/* Back button — top left */}
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 w-fit px-5 py-2 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black tracking-widest text-[#2D1B69] hover:bg-white transition-all uppercase cursor-pointer shadow-sm"
          >
            <ChevronLeft size={14} />
            Back to Journal
          </button>

          {/* Title block — bottom */}
          <div className="max-w-3xl pb-4">
            <span className="inline-block px-4 py-1 bg-[#E91E63] text-[10px] font-black tracking-widest rounded-md mb-4 uppercase text-white">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author / Published / Read Time row */}
            <div className="flex flex-wrap gap-6 sm:gap-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E91E63] flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                  {post.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest">
                    Author
                  </p>
                  <p className="text-sm font-bold text-white">
                    {post.author.toUpperCase()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={9} /> Published
                </p>
                <p className="text-sm font-bold text-white">{post.date}</p>
              </div>
              {post.readTime && (
                <div>
                  <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Clock size={9} /> Read Time
                  </p>
                  <p className="text-sm font-bold text-white">
                    {post.readTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── META ACTION BAR ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-6 text-[10px] font-bold tracking-widest text-gray-400">
          <button className="flex items-center gap-2 hover:text-[#E91E63] transition-colors cursor-pointer">
            <Bookmark size={14} />
            Save for Later
          </button>
          <button className="flex items-center gap-2 hover:text-[#E91E63] transition-colors cursor-pointer">
            <MessageSquare size={14} />
            Comments
          </button>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
          <span>Share Story:</span>
          <div className="flex gap-3">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer">
              <Facebook size={13} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer">
              <Twitter size={13} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer">
              <Share2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">

          {/* Article body */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold text-[#2D1B69] italic leading-snug">
              {post.excerpt}
            </h2>

            <div className="text-[15px] leading-relaxed space-y-5 text-[#4A5568]">
              <p>
                Traveling through the majestic landscapes of the Himalayas
                offers more than just scenic views — it is an immersive
                pilgrimage into ancient cultures, resilient alpine traditions,
                and pristine natural wonders. Whether scaling high-altitude
                trails or exploring vibrant heritage valleys, preparation is
                paramount.
              </p>

              <div className="p-6 bg-purple-50/60 rounded-2xl border-l-4 border-[#E91E63] my-6">
                <p className="italic text-[#2D1B69] font-medium text-base">
                  "Every journey in the Himalayas transforms the way you see
                  the world. Respect the trail, honor the locals, and the
                  mountains will reward you beyond measure."
                </p>
              </div>

              <h3 className="text-xl font-bold text-[#2D1B69] mt-8 mb-4">
                Key Insights &amp; Recommendations
              </h3>

              <ul className="space-y-3 pl-2">
                {[
                  [
                    "Early Physical & Mental Training",
                    "Build steady endurance and cardiovascular strength weeks before arriving at elevation.",
                  ],
                  [
                    "Optimal Hydration",
                    "Mountain air is arid and accelerates fatigue. Drink 3–4 liters of clean water daily.",
                  ],
                  [
                    "Respect Local Culture & Heritage",
                    "Learn local greetings like Tashi Delek or Namaste, and support mountain teahouses.",
                  ],
                  [
                    "Certified Guides & Logistics",
                    "Always partner with licensed operators who hold valid safety certifications.",
                  ],
                ].map(([heading, body]) => (
                  <li key={heading} className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-2 flex-shrink-0" />
                    <span>
                      <strong className="text-[#2D1B69]">{heading}:</strong>{" "}
                      {body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="mt-10 flex flex-wrap gap-2.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-[#F1F5F9] text-[9px] font-bold text-[#94A3B8] rounded-full cursor-pointer hover:bg-[#E91E63] hover:text-white transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            {/* Author card */}
            <div className="bg-[#2D1B69] rounded-[36px] p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={80} />
              </div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 opacity-60">
                About the Author
              </p>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-[#E91E63] flex items-center justify-center text-xl font-bold shadow-lg flex-shrink-0">
                  {post.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h5 className="font-bold text-base leading-none mb-1 text-white uppercase">
                    {post.author}
                  </h5>
                  <p className="text-[9px] opacity-60 uppercase tracking-widest font-bold">
                    Travel Specialist
                  </p>
                </div>
              </div>
              <p className="text-xs opacity-75 leading-relaxed mb-7">
                Veteran Himalayan expedition planner and cultural writer with
                over 15 years of field experience across Nepal, Tibet, and
                Bhutan.
              </p>
              <button
                onClick={() => navigate("/blog")}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] transition-all border border-white/10 cursor-pointer"
              >
                View All Stories
              </button>
            </div>

            {/* Related articles */}
            {relatedPosts.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-[11px] font-black text-[#2D1B69] uppercase tracking-widest mb-6">
                  <TrendingUp size={16} className="text-[#E91E63]" />
                  Related Stories
                </h4>
                <div className="space-y-5">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.id}
                      to={`/blog/${related.slug}`}
                      className="flex gap-4 group items-center"
                    >
                      <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[9px] font-bold text-[#E91E63] uppercase tracking-wider block">
                          {related.category}
                        </span>
                        <h6 className="text-[11px] font-black text-[#2D1347] group-hover:text-[#E91E63] leading-snug line-clamp-2 transition-colors">
                          {related.title}
                        </h6>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA box */}
            <div className="bg-[#F8FAFC] p-8 rounded-[40px] text-center flex flex-col items-center border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#E91E63] mb-5">
                <Share2 size={22} />
              </div>
              <h5 className="font-black text-xl text-[#2D1347] mb-2">
                Inspired to Travel?
              </h5>
              <p className="text-xs text-[#94A3B8] mb-7 leading-relaxed max-w-[210px]">
                Let our Himalayan specialists craft a personalized itinerary
                for you.
              </p>
              <button
                onClick={() => navigate("/packages")}
                className="flex items-center gap-2 px-7 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all group cursor-pointer"
              >
                Explore Packages
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </aside>
        </div>
      </main>

      <PreFooter
        title="Ready to Experience This Adventure?"
        description="Connect with our Himalayan travel specialists to book your trek, tour, or custom package."
        btn1="Call Us Now"
        btn2="Get a Free Quote"
      />
    </div>
  );
};

export default BlogDetailMore;