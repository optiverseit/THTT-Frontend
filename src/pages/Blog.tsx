import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  PlayCircle,
  ArrowRight,
  Clock,
  Calendar,
  ChevronUp,
  Globe,
} from "lucide-react";
import BannerSection from "../components/reuseable/BannerSection";
import PreFooter from "../components/reuseable/PreFooter";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
}

// --- Data ---
// eslint-disable-next-line react-refresh/only-export-components
export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "Top 10 Essential Tips for Your First Everest Base Camp Trek",
    slug: "ebc-trekking-tips",
    excerpt:
      "Planning your first trek to the roof of the world? Here is everything you need to know about packing, training, and altitude.",
    category: "TREKKING",
    author: "Adventure Desk",
    date: "Sept 21, 2025",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600",
    readTime: "8 min read",
  },
  {
    id: "b2",
    title: "Bali Beyond Beaches: Discovering the Cultural Heart of Ubud",
    slug: "bali-cultural-guide",
    excerpt:
      "Experience the spiritual side of Bali with our guide to hidden temples, local art markets, and traditional ceremonies.",
    category: "INTERNATIONAL",
    author: "Travel Editor",
    date: "Aug 24, 2025",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    readTime: "6 min read",
  },
  {
    id: "b3",
    title: "How to Choose the Right Travel Insurance for Himalayan Tours",
    slug: "travel-insurance-guide",
    excerpt:
      "Safety first! Learn why specific mountain coverage is vital for your high-altitude adventures in Nepal.",
    category: "TRAVEL TIPS",
    author: "Support Team",
    date: "Nov 21, 2024",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min read",
  },
  {
    id: "b4",
    title: "Nepal Visa on Arrival: A Simplified 2025 Guide for Foreigners",
    slug: "nepal-visa-guide",
    excerpt:
      "Getting your entry permit at Kathmandu airport is easier than ever with our step-by-step documentation guide.",
    category: "VISA ASSISTANCE",
    author: "Legal Desk",
    date: "Nov 17, 2024",
    image:
      "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?auto=format&fit=crop&q=80&w=800",
    readTime: "4 min read",
  },
  {
    id: "b5",
    title: "Everything You Need to Know About the ABC Heli Tour Experience",
    slug: "abc-heli-tour-blog",
    excerpt:
      "Short on time but want the big views? The Annapurna Base Camp Helicopter tour is the ultimate luxury experience.",
    category: "LUXURY",
    author: "Tour Guide",
    date: "Nov 10, 2024",
    image:
      "https://images.unsplash.com/photo-1544016768-982d1554f0b9?auto=format&fit=crop&q=80&w=800",
    readTime: "7 min read",
  },
];

// --- Reusable Sub-Components ---

const CategoryBadge = ({ label }: { label: string }) => (
  <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider text-pink-500 uppercase bg-white rounded-full shadow-sm mb-3">
    {label}
  </span>
);

const Metadata = ({ date, readTime }: { date: string; readTime?: string }) => (
  <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mt-2 mb-3">
    <div className="flex items-center gap-1">
      <Calendar size={12} />
      {date}
    </div>
    {readTime && (
      <div className="flex items-center gap-1">
        <Clock size={12} />
        {readTime}
      </div>
    )}
  </div>
);

// Unified Vertical Card Component
const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <article className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="relative h-64 overflow-hidden group">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <CategoryBadge label={post.category} />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <Metadata date={post.date} readTime={post.readTime} />
        <h3 className="text-xl font-extrabold text-[#2E1347] mb-3 leading-tight line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-3 font-semibold flex-grow">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* // Change your button to a Link */}
          <Link
            to={`/blog/${post.slug}`}
            className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide group"
          >
            Read More
            <span className="bg-[#E91E63] text-white rounded-full p-1 group-hover:translate-x-1 transition-transform">
              <ArrowRight size={10} />
            </span>
          </Link>
          <div className="flex items-center gap-2 text-[#2D1B69] text-xs font-bold">
            <div className="w-6 h-6 rounded-full bg-[#2D1B69] flex items-center justify-center text-white text-[10px]">
              {post.author.charAt(0)}
            </div>
            {post.author}
          </div>
        </div>
      </div>
    </article>
  );
};

const SidebarNewsItem = ({ post }: { post: BlogPost }) => (
  <div className="flex gap-4 mb-6 group cursor-pointer">
    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div>
      <span className="text-[10px] font-bold text-[#E91E63] uppercase block mb-1">
        {post.date}
      </span>
      <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-[#E91E63] transition-colors line-clamp-2">
        {post.title}
      </h4>
      <div className="mt-2 text-[10px] text-gray-400 font-bold flex items-center gap-1">
        READ MORE <ArrowRight size={8} />
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredBlogPosts = blogPosts.filter((post) => {
    const matchesSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      post.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // We use the first 3 for news sidebar simulation
  const newsPosts = blogPosts.slice(0, 3);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans">
      {/* ── 1. EXACT HERO / BANNER SECTION (Title -> SearchBar -> Quote) ── */}
      <BannerSection
        background="https://images.unsplash.com/photo-1548567117-02328f050eaa?q=80&w=2070&auto=format&fit=crop"
        alt="The Travel Journal"
        heading="THE TRAVEL JOURNAL"
        title="Blog & Articles"
        description="Your weekly dose of Himalayan inspiration and global travel insights."
        overlayGradient="bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/55 to-[#2D1347]/20"
        bottomGradient="h-10 sm:h-14 bg-gradient-to-t from-[#F8F9FC] to-transparent"
        searchBar={
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Keyword */}
            <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
              <Search size={18} className="text-pink-500 flex-shrink-0" />
              <div className="flex flex-col w-full text-left">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  SEARCH ARTICLES
                </label>
                <input
                  type="text"
                  className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="Search articles, guides, tips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Topic Category */}
            <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
              <Globe size={18} className="text-pink-500 flex-shrink-0" />
              <div className="flex flex-col w-full text-left">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  TOPIC CATEGORY
                </label>
                <select
                  className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer uppercase"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Topics</option>
                  <option value="TREKKING">Trekking &amp; Alpine</option>
                  <option value="INTERNATIONAL">International Travel</option>
                  <option value="TRAVEL TIPS">Travel Tips &amp; Guides</option>
                  <option value="VISA ASSISTANCE">Visa Assistance</option>
                  <option value="LUXURY">Luxury &amp; Heli Tours</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={() => {
                const el = document.getElementById("blog-articles");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
            >
              SEARCH
            </button>
          </div>
        }
      />

      <div id="blog-articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-8 bg-[#E91E63] rounded-full"></div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B69]">
            Latest Articles &amp; Insights
          </h2>
        </div>
      </div>

      {/* Main Grid Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: All Vertical Cards (8 cols) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {filteredBlogPosts.length > 0 ? (
                filteredBlogPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))
              ) : (
                <div className="sm:col-span-2 bg-white rounded-2xl p-10 text-center border border-gray-100">
                  <p className="text-gray-500 font-bold text-sm">
                    No articles found matching "{searchTerm}".
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="mt-4 px-5 py-2 bg-pink-600 text-white rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="text-[#E91E63]" size={20} />
                <h3 className="text-lg font-extrabold text-[#2D1B69] uppercase">
                  Latest News
                </h3>
              </div>
              <div className="space-y-2">
                {newsPosts.map((post, idx) => (
                  <Fragment key={`news-${post.id}`}>
                    <SidebarNewsItem post={post} />
                    {idx !== newsPosts.length - 1 && (
                      <hr className="border-gray-100 mb-6" />
                    )}
                  </Fragment>
                ))}
              </div>
              <button className="w-full bg-[#2D1B69] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-colors mt-2">
                All Updates
              </button>
            </div>

            <div className="relative bg-[#2D1B69] p-8 rounded-3xl shadow-xl overflow-hidden text-center text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#E91E63] opacity-10 rounded-full -ml-10 -mb-10"></div>
              <h3 className="text-xl font-bold mb-2 relative z-10">
                Stay Inspired, Get Updates.
              </h3>
              <p className="text-xs text-gray-300 mb-6 relative z-10">
                Subscribe to our newsletter for exclusive tour offers and
                Himalayan news.
              </p>
              <div className="relative z-10 space-y-3">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#E91E63] text-sm"
                />
                <button className="w-full bg-[#E91E63] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#d81557] transition-colors shadow-lg shadow-pink-600/30">
                  Subscribe Now
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <PlayCircle className="text-[#E91E63]" size={20} />
                <h3 className="text-lg font-extrabold text-[#2D1B69] uppercase">
                  Video Vlogs
                </h3>
              </div>
              <button className="w-full bg-[#2D1B69] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
                Watch Latest Vlogs
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Back to Top Button */}
      <div className="flex justify-center mt-12 mb-16">
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 bg-[#E91E63] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:-translate-y-1 transition-transform cursor-pointer"
        >
          Back to Top
          <ChevronUp size={14} />
        </button>
      </div>

      {/* PreFooter CTA */}
      <PreFooter
        title="Inspired by Our Travel Stories?"
        description="Let our experienced team craft your next unforgettable journey."
        btn1="Call Us Now"
        btn2="Get a Free Quote"
      />
    </div>
  );
};

export default Blog;
