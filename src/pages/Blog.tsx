import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
  X,
  ExternalLink,
} from "lucide-react";
import { blogPosts, videoPosts } from "../assets/data/mockData";
import type { BlogPost, VideoPost } from "../assets/data/types";
import PreFooter from "../components/reusable/PreFooter";
import { copyToClipboard, triggerNativeShare } from "../utils/shareUtils";
import { SEO } from "../components/reusable";
import { pagesSEO } from "../config/seoConfig";
import { getBlogs, getPageByName, getCategories } from "../api/BackendApi";
import YouTubePlayer from "../components/blog/YouTubePlayer";

// Re-export for backward compatibility
export type { BlogPost };
type BlogMode = "read" | "video";

export interface UnifiedBlogPost {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  categoryId?: number | string;
  image: string;
  date: string;
  readTime?: string;
  author: string;
  authorAvatar?: string;
  excerpt: string;
  content?: string;
  isLatestNews?: boolean;
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "Recent";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// ─── BLOG CARD ───────────────────────────────────────────────────────────────
const BlogCard: React.FC<{ post: UnifiedBlogPost }> = ({ post }) => (
  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 group transition-all duration-300 flex flex-col h-full">
    <div className="relative h-52 overflow-hidden flex-shrink-0">
      <img
        src={post.image}
        alt={post.title}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            "https://images.unsplash.com/photo-1544735745-b81216c7ad8f?auto=format&fit=crop&q=80&w=1200";
        }}
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
      <h3 className="font-extrabold text-[#2D1347] text-sm leading-snug line-clamp-2 mb-2 group-hover:text-[#E91E63] transition-colors">
        {post.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
        <Link
          to={`/blog/${post.slug}`}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors group/link"
        >
          Read More
          <span className="w-5 h-5 rounded-full bg-[#E91E63] flex items-center justify-center group-hover/link:translate-x-0.5 transition-transform">
            <ArrowRight size={8} className="text-white" />
          </span>
        </Link>
        <span className="text-[9px] text-gray-400 font-bold uppercase truncate max-w-[130px]">
          By {post.author}
        </span>
      </div>
    </div>
  </article>
);

// ─── VIDEO CARD ──────────────────────────────────────────────────────────────
interface VideoCardProps {
  vlog: VideoPost;
  onPlay: (vlog: VideoPost) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ vlog, onPlay }) => (
  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 group transition-all duration-300 flex flex-col h-full">
    {/* Thumbnail Container — click anywhere to play video */}
    <div
      onClick={() => onPlay(vlog)}
      className="relative h-52 overflow-hidden flex-shrink-0 cursor-pointer"
    >
      <img
        src={vlog.thumbnail}
        alt={vlog.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors" />

      {/* Play button with pulsing glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-[#E91E63] flex items-center justify-center shadow-xl group-hover:scale-115 transition-all duration-300 group-hover:shadow-pink-500/50">
          <Play size={22} className="text-white ml-1" fill="white" />
        </div>
      </div>

      {/* Category badge */}
      <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[9px] font-black text-[#E91E63] uppercase tracking-wider shadow-sm">
        {vlog.category}
      </span>

      {/* Duration badge */}
      <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/75 backdrop-blur-xs rounded text-[9px] text-white font-bold tracking-wider">
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
      <h3
        onClick={() => onPlay(vlog)}
        className="font-extrabold text-[#2D1347] text-sm leading-snug line-clamp-2 mb-2 cursor-pointer hover:text-[#E91E63] transition-colors"
      >
        {vlog.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">
        {vlog.description}
      </p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
        <button
          type="button"
          onClick={() => onPlay(vlog)}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors group/link cursor-pointer"
        >
          Watch Video
          <span className="w-5 h-5 rounded-full bg-[#E91E63] flex items-center justify-center group-hover/link:translate-x-0.5 transition-transform">
            <Play size={8} className="text-white ml-0.5" fill="white" />
          </span>
        </button>
        <div className="flex items-center gap-1">
          <Link
            to={`/watch/${vlog.id}`}
            title="Open Video Page"
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#E91E63]"
          >
            <ExternalLink size={12} />
          </Link>
          <button
            onClick={async (e) => {
              e.preventDefault();
              const shareUrl = `${window.location.origin}/watch/${vlog.id}`;
              const shared = await triggerNativeShare({
                title: `${vlog.title} | Trip Himalaya Video`,
                text: vlog.description,
                url: shareUrl,
              });
              if (!shared) {
                await copyToClipboard(shareUrl);
              }
            }}
            title="Share Video"
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#E91E63] cursor-pointer"
          >
            <Share2 size={12} />
          </button>
        </div>
      </div>
    </div>
  </article>
);

// ─── READ SIDEBAR ─────────────────────────────────────────────────────────────
interface ReadSidebarProps {
  latestNews: UnifiedBlogPost[];
  onSwitchVideo: () => void;
}

const ReadSidebar: React.FC<ReadSidebarProps> = ({
  latestNews,
  onSwitchVideo,
}) => {
  return (
    <div className="space-y-5">
      {/* Latest News */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h4 className="flex items-center gap-2 text-[11px] font-black text-[#2D1347] uppercase tracking-widest mb-4">
          <span className="w-1 h-4 bg-[#E91E63] rounded-full inline-block flex-shrink-0" />
          Latest News
        </h4>
        <div className="space-y-4">
          {latestNews.slice(0, 4).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="flex gap-3 group items-center"
            >
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1544735745-b81216c7ad8f?auto=format&fit=crop&q=80&w=300";
                }}
                className="w-16 h-12 object-cover rounded-lg flex-shrink-0 group-hover:opacity-90 transition-opacity"
              />
              <div className="min-w-0 flex-1">
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
      <div className="bg-[#2D1347] rounded-2xl p-6 text-white shadow-sm">
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
interface VideoSidebarProps {
  onSwitchRead: () => void;
  onPlayVideo: (vlog: VideoPost) => void;
}

const VideoSidebar: React.FC<VideoSidebarProps> = ({
  onSwitchRead,
  onPlayVideo,
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
            <div
              key={v.id}
              onClick={() => onPlayVideo(v)}
              className="flex gap-3 group cursor-pointer items-center"
            >
              <div className="relative w-20 h-13 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[8px] px-1 rounded font-bold">
                  {v.duration}
                </span>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                  <Play size={10} className="text-white fill-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] text-[#E91E63] font-bold uppercase mb-0.5">
                  {v.category}
                </p>
                <p className="text-xs font-bold text-[#2D1347] line-clamp-2 group-hover:text-[#E91E63] transition-colors leading-snug">
                  {v.title}
                </p>
              </div>
            </div>
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
      <div className="bg-[#2D1347] rounded-2xl p-6 text-white shadow-sm">
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
  const [loading, setLoading] = useState<boolean>(true);

  // Live API states
  const [apiPosts, setApiPosts] = useState<UnifiedBlogPost[]>([]);
  const [latestNewsPosts, setLatestNewsPosts] = useState<UnifiedBlogPost[]>([]);
  const [bannerBg, setBannerBg] = useState<string>("");

  // Interactive Video Player Modal State
  const [playingVideo, setPlayingVideo] = useState<VideoPost | null>(null);

  // Keyword autocomplete state
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [showKeywordDropdown, setShowKeywordDropdown] = useState(false);
  const keywordDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        keywordDropdownRef.current &&
        !keywordDropdownRef.current.contains(e.target as Node)
      ) {
        setShowKeywordDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Fetch dynamic banner background from Pages API ──
  useEffect(() => {
    let isMounted = true;
    getPageByName("blog")
      .then((res) => {
        const bg =
          res.data?.data?.background_images?.[0]?.image ||
          res.data?.background_images?.[0]?.image;
        if (isMounted && bg) {
          setBannerBg(bg);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // ── Transform mock blogs to unified shape ──
  const mockUnifiedPosts: UnifiedBlogPost[] = useMemo(() => {
    return blogPosts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      image: p.image,
      date: p.date,
      readTime: p.readTime,
      author: p.author,
      excerpt: p.excerpt,
      content: p.content,
    }));
  }, []);

  // ── Fetch blogs & latest news from backend API ──
  const fetchAllBlogData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch main active blogs
      const blogsRes = await getBlogs();
      let rawList: any[] = [];
      if (Array.isArray(blogsRes.data?.data?.data)) {
        rawList = blogsRes.data.data.data;
      } else if (Array.isArray(blogsRes.data?.data)) {
        rawList = blogsRes.data.data;
      } else if (Array.isArray(blogsRes.data)) {
        rawList = blogsRes.data;
      }

      if (rawList.length > 0) {
        const parsed: UnifiedBlogPost[] = rawList.map((b: any) => ({
          id: b.id,
          title: b.title,
          slug: b.slug || String(b.id),
          category: b.category?.name || "Trekking",
          categoryId: b.category_id,
          image:
            b.image ||
            "https://images.unsplash.com/photo-1544735745-b81216c7ad8f?auto=format&fit=crop&q=80&w=1200",
          date: formatDate(b.created_at),
          readTime:
            b.read_time ||
            `${Math.max(3, Math.ceil((b.content?.length || 500) / 800))} min read`,
          author: b.author_name || "Travel Expert",
          authorAvatar: b.author_avatar,
          excerpt:
            b.excerpt ||
            (b.content
              ? b.content.slice(0, 140) + "..."
              : "Discover unforgettable Himalayan travel guides and insights."),
          content: b.content,
          isLatestNews: !!b.is_latest_news,
        }));
        setApiPosts(parsed);
      } else {
        // Fallback to verified local posts if backend has 0 posts seeded
        setApiPosts(mockUnifiedPosts);
      }

      // 2. Fetch Latest News for sidebar
      try {
        const newsRes = await getBlogs({ is_latest_news: true });
        let newsList: any[] = [];
        if (Array.isArray(newsRes.data?.data?.data)) {
          newsList = newsRes.data.data.data;
        } else if (Array.isArray(newsRes.data?.data)) {
          newsList = newsRes.data.data;
        } else if (Array.isArray(newsRes.data)) {
          newsList = newsRes.data;
        }

        if (newsList.length > 0) {
          const parsedNews: UnifiedBlogPost[] = newsList.map((b: any) => ({
            id: b.id,
            title: b.title,
            slug: b.slug || String(b.id),
            category: b.category?.name || "Trekking",
            categoryId: b.category_id,
            image:
              b.image ||
              "https://images.unsplash.com/photo-1544735745-b81216c7ad8f?auto=format&fit=crop&q=80&w=600",
            date: formatDate(b.created_at),
            readTime: b.read_time || "4 min read",
            author: b.author_name || "Travel Expert",
            excerpt: b.excerpt || "",
            content: b.content,
            isLatestNews: true,
          }));
          setLatestNewsPosts(parsedNews);
        } else {
          // If no specific is_latest_news flagged, use latest 4 posts
          setLatestNewsPosts(mockUnifiedPosts.slice(0, 4));
        }
      } catch {
        setLatestNewsPosts(mockUnifiedPosts.slice(0, 4));
      }
    } catch (err) {
      console.warn("Could not load blogs from API, using fallback:", err);
      setApiPosts(mockUnifiedPosts);
      setLatestNewsPosts(mockUnifiedPosts.slice(0, 4));
    } finally {
      setLoading(false);
    }
  }, [mockUnifiedPosts]);

  useEffect(() => {
    fetchAllBlogData();
  }, [fetchAllBlogData]);

  const handleModeChange = (newMode: BlogMode) => {
    setMode(newMode);
    setSelectedCategory("All");
    setSearchQuery("");
    setKeywordSuggestions([]);
    setShowKeywordDropdown(false);
    setSearchParams(newMode === "video" ? { mode: "video" } : {});
  };

  const handleSearchClick = () => {
    setShowKeywordDropdown(false);
    const el = document.getElementById("blog-content-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Build keyword pool from titles
  const keywordPool = useMemo(() => {
    const seen = new Set<string>();
    const pool: string[] = [];
    const addTitle = (title: string) => {
      const clean = title.trim();
      if (clean.length >= 3 && !seen.has(clean.toLowerCase())) {
        seen.add(clean.toLowerCase());
        pool.push(clean);
      }
    };
    apiPosts.forEach((p) => addTitle(p.title));
    videoPosts.forEach((v) => addTitle(v.title));
    return pool;
  }, [apiPosts]);

  // Standard categories matching Image 1
  const standardCategories = useMemo(
    () => [
      "All",
      "Tours and Travel",
      "Adventure activity",
      "Trekking",
      "Hotels",
      "Visa Service",
      "Work Permit",
      "Travel Guide",
    ],
    []
  );

  const normalizeCat = (cat: string) =>
    cat.toLowerCase().replace(/[^a-z0-9]/g, "");

  // ── Filtered Blogs ──
  const filteredPosts = useMemo(() => {
    return apiPosts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const searchCorpus = [
        p.title,
        p.excerpt,
        p.content || "",
        p.category,
        p.author,
        p.date,
        p.readTime || "",
        p.slug,
      ]
        .join(" ")
        .toLowerCase();

      const words = q.split(/\s+/).filter(Boolean);
      const matchSearch =
        words.length === 0 ||
        words.every((word) => searchCorpus.includes(word));

      const matchCat =
        selectedCategory === "All" ||
        normalizeCat(p.category) === normalizeCat(selectedCategory) ||
        p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(p.category.toLowerCase());

      return matchSearch && matchCat;
    });
  }, [apiPosts, searchQuery, selectedCategory]);

  // ── Filtered Videos ──
  const filteredVideos = useMemo(() => {
    return videoPosts.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const searchCorpus = [
        v.title,
        v.description,
        v.content || "",
        v.category,
        v.author,
        v.duration,
        v.date,
        v.slug,
      ]
        .join(" ")
        .toLowerCase();

      const words = q.split(/\s+/).filter(Boolean);
      const matchSearch =
        words.length === 0 ||
        words.every((word) => searchCorpus.includes(word));

      const matchCat =
        selectedCategory === "All" ||
        normalizeCat(v.category) === normalizeCat(selectedCategory) ||
        v.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(v.category.toLowerCase());

      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  const categories = standardCategories;
  const title = mode === "read" ? "Latest Blogs" : "Latest Vlogs";

  // Banner hero image
  const resolvedHeroImage = useMemo(() => {
    if (bannerBg) return bannerBg;
    return mode === "read"
      ? "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000"
      : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000";
  }, [bannerBg, mode]);

  return (
    <div className="bg-[#F8F8FB] min-h-screen font-sans">
      <SEO {...pagesSEO.blog} />

      {/* ── BLOG HERO ── */}
      <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-visible pt-14 sm:pt-16 pb-7 sm:pb-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={resolvedHeroImage}
            alt={
              mode === "read"
                ? "Himalayan Sunset & Base Camp"
                : "Himalayan Mountain Vista"
            }
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mt-2 sm:mt-1.5">
            <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
              {mode === "read" ? "THE HIMALAYAN JOURNAL" : "THE VISUAL JOURNAL"}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
              {mode === "read"
                ? "Travel Stories & Guides"
                : "Video Vlogs & Short Films"}
            </h1>
            <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Left: Search Input */}
              <div
                ref={keywordDropdownRef}
                className="relative flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100"
              >
                <Search size={18} className="text-pink-500 flex-shrink-0" />
                <div className="flex flex-col w-full text-left">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    SEARCH BY KEYWORD
                  </label>
                  <input
                    type="text"
                    className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 placeholder:text-gray-400 placeholder:font-normal w-full"
                    placeholder={
                      mode === "read"
                        ? "Search articles, guides, topics..."
                        : "Search vlogs, destinations..."
                    }
                    value={searchQuery}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchQuery(val);
                      if (val.trim().length > 0) {
                        const q = val.trim().toLowerCase();
                        const matched = keywordPool
                          .filter((s) => s.toLowerCase().includes(q))
                          .slice(0, 20);
                        setKeywordSuggestions(matched);
                        setShowKeywordDropdown(matched.length > 0);
                      } else {
                        setKeywordSuggestions([]);
                        setShowKeywordDropdown(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setShowKeywordDropdown(false);
                        handleSearchClick();
                      } else if (e.key === "Escape") {
                        setShowKeywordDropdown(false);
                      }
                    }}
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showKeywordDropdown && keywordSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-[20] max-h-[320px] overflow-y-auto">
                    {keywordSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSearchQuery(suggestion);
                          setShowKeywordDropdown(false);
                          setTimeout(() => handleSearchClick(), 50);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                      >
                        <Search
                          size={13}
                          className="text-pink-400 flex-shrink-0"
                        />
                        <span className="font-medium">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Category Dropdown */}
              <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                {mode === "read" ? (
                  <BookOpenText
                    size={18}
                    className="text-pink-500 flex-shrink-0"
                  />
                ) : (
                  <Clapperboard
                    size={18}
                    className="text-pink-500 flex-shrink-0"
                  />
                )}
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
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Search button */}
              <button
                onClick={handleSearchClick}
                className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer active:scale-95"
              >
                SEARCH
              </button>
            </div>
          </div>

          <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">
            {mode === "read"
              ? '"Explore the stories and guides crafted for your next adventure."'
              : '"Watch the Himalayas come alive through cinematic stories and adventure films."'}
          </p>

          {/* 4 Hero Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
            {(mode === "read"
              ? [
                  {
                    icon: BookOpen,
                    label: "200+ Articles",
                    desc: "Expert-Written Content",
                  },
                  {
                    icon: Eye,
                    label: "1M+ Monthly Readers",
                    desc: "Growing Community",
                  },
                  {
                    icon: Clock,
                    label: "5-7 Min Reads",
                    desc: "Quick & Informative",
                  },
                  {
                    icon: Calendar,
                    label: "Weekly Updates",
                    desc: "Fresh New Content",
                  },
                ]
              : [
                  {
                    icon: Tv2,
                    label: "100+ Videos",
                    desc: "HD Himalayan Films",
                  },
                  {
                    icon: Play,
                    label: "500K+ Views",
                    desc: "Growing Audience",
                  },
                  {
                    icon: Eye,
                    label: "Watch Anytime",
                    desc: "Free Access",
                  },
                  {
                    icon: Clock,
                    label: "5-60 Min Films",
                    desc: "Short to Full-Length",
                  },
                ]
            ).map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform">
                    <Icon size={14} />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">
                      {stat.label}
                    </h4>
                    <p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">
                      {stat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT SECTION ── */}
      <div
        id="blog-content-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 scroll-mt-6"
      >
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
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#2D1347] hover:bg-purple-900 text-white text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    <Play size={9} fill="white" />
                    Watch Vlogs
                  </button>
                ) : (
                  <button
                    id="blog-read-blog-btn"
                    onClick={() => handleModeChange("read")}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#2D1347] hover:bg-purple-900 text-white text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap cursor-pointer shadow-sm"
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
            {loading && mode === "read" ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#2D1347] font-bold text-base">
                  Loading stories...
                </p>
              </div>
            ) : mode === "read" && filteredPosts.length === 0 ? (
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
            ) : mode === "read" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : null}

            {/* ── VIDEO GRID ── */}
            {mode === "video" && filteredVideos.length === 0 ? (
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
            ) : mode === "video" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredVideos.map((v) => (
                  <VideoCard
                    key={v.id}
                    vlog={v}
                    onPlay={(vlog) => setPlayingVideo(vlog)}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="lg:col-span-4">
            {mode === "read" ? (
              <ReadSidebar
                latestNews={latestNewsPosts}
                onSwitchVideo={() => handleModeChange("video")}
              />
            ) : (
              <VideoSidebar
                onSwitchRead={() => handleModeChange("read")}
                onPlayVideo={(v) => setPlayingVideo(v)}
              />
            )}
          </aside>
        </div>
      </div>

      {/* ── INTERACTIVE FULL-SCREEN VIDEO MODAL (Accurate Video Playback) ── */}
      {playingVideo && (
        <div
          className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-3 sm:p-6"
          onClick={() => setPlayingVideo(null)}
        >
          <div
            className="w-full max-w-4xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gray-950">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] font-black uppercase text-[#E91E63] tracking-widest block mb-0.5">
                  {playingVideo.category} • {playingVideo.duration}
                </span>
                <h3 className="text-white text-base sm:text-lg font-bold truncate">
                  {playingVideo.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/watch/${playingVideo.id}`}
                  onClick={() => setPlayingVideo(null)}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">Details</span>
                </Link>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E91E63] text-white flex items-center justify-center transition cursor-pointer"
                  aria-label="Close video player"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="p-2 sm:p-4 bg-black">
              <YouTubePlayer
                videoUrl={playingVideo.videoUrl}
                autoplay={true}
              />
            </div>

            {/* Bottom Info */}
            <div className="px-5 py-3.5 bg-gray-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-400">
              <p className="line-clamp-1 italic">
                {playingVideo.description}
              </p>
              <div className="flex items-center gap-4 text-[11px] font-semibold flex-shrink-0">
                <span>By {playingVideo.author}</span>
                <span>•</span>
                <span>{playingVideo.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
