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
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PreFooter from "../components/reuseable/PreFooter";
import { blogPosts } from "./Blog";

const BlogDetailMore: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // Find post by slug or by id
  const post = blogPosts.find(
    (p) => p.slug.toLowerCase() === slug?.toLowerCase() || p.id === slug
  );

  const tags: string[] = ["#ADVENTURE", "#HIMALAYAS", "#NEPAL2025", "#TREKKING", "#TRAVELTIPS"];

  // Related posts excluding the current one
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && p.id !== slug)
    .slice(0, 3);

  // Graceful 404 / Error State when article is not found
  if (!post) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-purple-50/40 to-white flex items-center justify-center px-4 py-20 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-pink-50 flex items-center justify-center text-[#E91E63] shadow-inner">
            <FileQuestion size={40} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E91E63] block mb-2">
            Article Not Found
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D1347] mb-3 tracking-tight">
            Story Not Found
          </h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
            The travel story or article you're looking for doesn't exist, may have been removed, or the link may be outdated.
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
              className="px-6 py-3 rounded-full bg-[#E91E63] hover:bg-pink-600 text-white text-xs font-bold shadow-md shadow-pink-200 transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2"
            >
              <span>Explore All Stories</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#4A5568]">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B69]/90 via-[#2D1B69]/30 to-transparent" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-between py-10">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 w-fit px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest text-[#2D1B69] hover:bg-white transition-all uppercase cursor-pointer"
          >
            <ChevronLeft size={14} /> Back to Journal
          </button>
          <div className="max-w-3xl mb-10 text-white">
            <span className="inline-block px-4 py-1 bg-[#E91E63] text-[10px] font-bold tracking-widest rounded-md mb-4 uppercase">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex gap-10 border-l border-white/30 pl-6">
              <div>
                <p className="text-[9px] opacity-60 font-bold uppercase tracking-widest">Author</p>
                <p className="font-bold text-sm">{post.author.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[9px] opacity-60 font-bold uppercase tracking-widest">Published</p>
                <p className="font-bold text-sm">{post.date.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[9px] opacity-60 font-bold uppercase tracking-widest">Read Time</p>
                <p className="font-bold text-sm">{post.readTime}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- META BAR --- */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-b border-gray-100 flex justify-between items-center">
        <div className="flex gap-6 text-[10px] font-bold tracking-widest text-gray-400">
          <button className="flex items-center gap-2 hover:text-[#E91E63] transition-colors cursor-pointer">
            <Bookmark size={14} /> SAVE FOR LATER
          </button>
          <button className="flex items-center gap-2 hover:text-[#E91E63] transition-colors cursor-pointer">
            <MessageSquare size={14} /> COMMENTS
          </button>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
          <span>SHARE STORY:</span>
          <div className="flex gap-4">
            <Facebook size={14} className="cursor-pointer hover:text-[#2D1B69] transition-colors" />
            <Twitter size={14} className="cursor-pointer hover:text-[#2D1B69] transition-colors" />
            <Share2 size={14} className="cursor-pointer hover:text-[#2D1B69] transition-colors" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* --- MAIN CONTENT --- */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-bold text-[#2D1B69] mb-8 italic leading-snug">
              {post.excerpt}
            </h2>

            <div className="text-[15px] leading-relaxed space-y-6 text-[#4A5568]">
              <p>
                Traveling through the majestic landscapes of the Himalayas offers more than just scenic views;
                it is an immersive pilgrimage into ancient cultures, resilient alpine traditions, and pristine natural wonders.
                Whether scaling high altitude trails or exploring vibrant heritage valleys, preparation is paramount.
              </p>

              <div className="p-6 bg-purple-50/50 rounded-2xl border-l-4 border-[#E91E63] my-6">
                <p className="italic text-[#2D1B69] font-medium text-base">
                  "Every journey in the Himalayas transforms the way you see the world. Respect the trail, honor the locals, and the mountains will reward you beyond measure."
                </p>
              </div>

              <h3 className="text-xl font-bold text-[#2D1B69] mt-8 mb-4">
                Key Insights &amp; Recommendations
              </h3>

              <ul className="space-y-3 pl-4">
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-2 flex-shrink-0" />
                  <span><strong>Early Physical &amp; Mental Training:</strong> Build steady endurance and cardiovascular strength weeks before arriving at elevation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-2 flex-shrink-0" />
                  <span><strong>Optimal Hydration:</strong> Mountain air is arid and accelerates fatigue. Drink 3 to 4 liters of clean water daily.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-2 flex-shrink-0" />
                  <span><strong>Respect Local Custom &amp; Heritage:</strong> Learn local greetings like <em>Tashi Delek</em> or <em>Namaste</em>, and support mountain teahouses and communities.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-2 flex-shrink-0" />
                  <span><strong>Certified Guides &amp; Logistics:</strong> Always partner with licensed operators who hold valid safety certifications and altitude rescue contingency plans.</span>
                </li>
              </ul>
            </div>

            {/* Tags */}
            <div className="mt-12 flex flex-wrap gap-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-[#F1F5F9] text-[9px] font-bold text-[#94A3B8] rounded-full flex items-center gap-2 cursor-pointer hover:bg-[#E91E63] hover:text-white transition-colors"
                >
                  <span className="text-[#CBD5E1]">#</span> {tag.replace("#", "")}
                </span>
              ))}
            </div>
          </div>

          {/* --- SIDEBAR --- */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Author Card */}
            <div className="bg-[#2D1B69] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={80} />
              </div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-8 opacity-60">
                About the Author
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#E91E63] flex items-center justify-center text-xl font-bold shadow-lg">
                  {post.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h5 className="font-bold text-lg leading-none mb-1 text-white uppercase">
                    {post.author}
                  </h5>
                  <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">
                    Travel Specialist
                  </p>
                </div>
              </div>
              <p className="text-xs opacity-80 leading-relaxed mb-8">
                Veteran Himalayan expedition planner and cultural writer with over 15 years of field experience across Nepal, Tibet, and Bhutan.
              </p>
              <button
                onClick={() => navigate("/blog")}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[9px] font-bold uppercase tracking-[0.15em] transition-all border border-white/10 cursor-pointer"
              >
                View All Stories
              </button>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-[12px] font-black text-[#2D1B69] uppercase mb-8">
                  <TrendingUp size={18} className="text-[#E91E63]" /> Related Stories
                </h4>
                <div className="space-y-6">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.id}
                      to={`/blog/${related.slug}`}
                      className="flex gap-4 group cursor-pointer items-center text-left"
                    >
                      <div className="w-20 h-20 rounded-[20px] overflow-hidden shrink-0 shadow-md">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-[#E91E63] uppercase tracking-tighter">
                          {related.category}
                        </span>
                        <h6 className="text-[11px] font-black text-[#2D1347] group-hover:underline leading-snug line-clamp-2 uppercase">
                          {related.title}
                        </h6>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Inspired CTA Box */}
            <div className="bg-[#F8FAFC] p-10 rounded-[50px] text-center flex flex-col items-center border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#E91E63] mb-6">
                <Share2 size={24} />
              </div>
              <h5 className="font-black text-xl text-[#2D1347] mb-3">Inspired to Travel?</h5>
              <p className="text-xs text-[#94A3B8] mb-8 leading-relaxed max-w-[220px]">
                Let our Himalayan specialists craft a personalized mountain or cultural itinerary for you.
              </p>
              <button
                onClick={() => navigate("/packages")}
                className="flex items-center gap-2 px-8 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all group cursor-pointer"
              >
                Explore Packages <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* PreFooter CTA */}
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