import React, { useState, useEffect, useMemo } from "react";
import {
  Share2,
  Bookmark,
  MessageSquare,
  Facebook,
  Twitter,
  ArrowRight,
  TrendingUp,
  FileQuestion,
  Clock,
  Calendar,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PreFooter from "../components/reusable/PreFooter";
import { blogPosts } from "../assets/data/mockData";
import ShareModal from "../components/reusable/ShareModal";
import { shareToPlatform } from "../utils/shareUtils";
import { SEO } from "../components/reusable";
import { getBlogById } from "../api/BackendApi";

export interface BlogInsightItem {
  id?: number | string;
  title: string;
  description: string;
  sort_order?: number;
}

export interface RelatedStoryItem {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  image: string;
}

export interface BlogDetailData {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  categoryId?: number | string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  authorAvatar?: string;
  excerpt: string;
  content: string;
  quote?: string;
  insights?: BlogInsightItem[];
  tags?: string[];
}

const DEFAULT_INSIGHTS: BlogInsightItem[] = [
  {
    title: "Early Physical & Mental Training",
    description:
      "Build steady endurance and cardiovascular strength weeks before arriving at elevation.",
  },
  {
    title: "Optimal Hydration",
    description:
      "Mountain air is arid and accelerates fatigue. Drink 3–4 liters of clean water daily.",
  },
  {
    title: "Respect Local Culture & Heritage",
    description:
      "Learn local greetings like Tashi Delek or Namaste, and support mountain teahouses.",
  },
  {
    title: "Certified Guides & Logistics",
    description:
      "Always partner with licensed operators who hold valid safety certifications.",
  },
];

const DEFAULT_TAGS = [
  "#ADVENTURE",
  "#HIMALAYAS",
  "#NEPAL2025",
  "#TREKKING",
  "#TRAVELTIPS",
];

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "Sept 21, 2025";
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

const BlogDetailMore: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Check if article matches local mock post first
  const mockPost = useMemo(
    () =>
      blogPosts.find(
        (p) =>
          p.slug.toLowerCase() === slug?.toLowerCase() ||
          String(p.id).toLowerCase() === slug?.toLowerCase()
      ),
    [slug]
  );

  const [post, setPost] = useState<BlogDetailData | null>(() => {
    if (mockPost) {
      return {
        id: mockPost.id,
        title: mockPost.title,
        slug: mockPost.slug,
        category: mockPost.category,
        image: mockPost.image,
        date: mockPost.date,
        readTime: mockPost.readTime || "8 min read",
        author: mockPost.author || "Adventure Desk",
        excerpt: mockPost.excerpt,
        content: mockPost.content || "",
        quote: "",
        insights: DEFAULT_INSIGHTS,
        tags: DEFAULT_TAGS,
      };
    }
    return null;
  });

  const [relatedStories, setRelatedStories] = useState<RelatedStoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(!mockPost);

  // ── Fetch single blog detail and related stories from backend API ──
  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setLoading(!mockPost);

    getBlogById(slug)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data?.data;
        const apiBlog = data?.blog || data;
        const apiRelated = data?.related_stories;

        if (apiBlog && apiBlog.title) {
          // Parse insights from backend relationship
          let insightsList: BlogInsightItem[] = DEFAULT_INSIGHTS;
          if (Array.isArray(apiBlog.insights) && apiBlog.insights.length > 0) {
            insightsList = apiBlog.insights.map((ins: any) => ({
              id: ins.id,
              title: ins.title,
              description: ins.description,
              sort_order: ins.sort_order,
            }));
          }

          // Parse tags from backend
          let tagsList = DEFAULT_TAGS;
          if (Array.isArray(apiBlog.tags) && apiBlog.tags.length > 0) {
            tagsList = apiBlog.tags.map((t: string) =>
              t.startsWith("#") ? t : `#${t}`
            );
          }

          setPost({
            id: apiBlog.id,
            title: apiBlog.title,
            slug: apiBlog.slug || String(apiBlog.id),
            category: apiBlog.category?.name || "Trekking",
            categoryId: apiBlog.category_id,
            image:
              apiBlog.image ||
              "https://images.unsplash.com/photo-1544735745-b81216c7ad8f?auto=format&fit=crop&q=80&w=1200",
            date: formatDate(apiBlog.created_at),
            readTime: apiBlog.read_time || "8 min read",
            author: apiBlog.author_name || "Adventure Desk",
            authorAvatar: apiBlog.author_avatar,
            excerpt: apiBlog.excerpt || "",
            content: apiBlog.content || "",
            quote: apiBlog.quote || "",
            insights: insightsList,
            tags: tagsList,
          });

          // Parse Related Stories from backend response
          if (Array.isArray(apiRelated) && apiRelated.length > 0) {
            setRelatedStories(
              apiRelated.map((rel: any) => ({
                id: rel.id,
                title: rel.title,
                slug: rel.slug || String(rel.id),
                category: rel.category?.name || "Tours and Travel",
                image:
                  rel.image ||
                  "https://images.unsplash.com/photo-1544735745-b81216c7ad8f?auto=format&fit=crop&q=80&w=400",
              }))
            );
          } else {
            // Fallback related stories
            setRelatedStories(
              blogPosts
                .filter(
                  (p) =>
                    p.slug.toLowerCase() !== slug?.toLowerCase() &&
                    String(p.id) !== slug
                )
                .slice(0, 3)
                .map((p) => ({
                  id: p.id,
                  title: p.title,
                  slug: p.slug,
                  category: p.category,
                  image: p.image,
                }))
            );
          }
        } else if (mockPost) {
          // If API didn't return a record but we have mock post, retain mock
          setRelatedStories(
            blogPosts
              .filter((p) => p.slug !== slug && p.id !== slug)
              .slice(0, 3)
              .map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                category: p.category,
                image: p.image,
              }))
          );
        }
      })
      .catch(() => {
        if (!isMounted) return;
        if (mockPost) {
          setRelatedStories(
            blogPosts
              .filter((p) => p.slug !== slug && p.id !== slug)
              .slice(0, 3)
              .map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                category: p.category,
                image: p.image,
              }))
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug, mockPost]);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 bg-white">
        <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mb-4" />
        <p className="text-[#2D1347] font-bold text-sm">Loading article...</p>
      </div>
    );
  }

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
            The travel story you're looking for doesn't exist or the link may be
            outdated.
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

  const authorInitials = post.author
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const insightsToRender =
    post.insights && post.insights.length > 0
      ? post.insights
      : DEFAULT_INSIGHTS;

  const tagsToRender =
    post.tags && post.tags.length > 0 ? post.tags : DEFAULT_TAGS;

  return (
    <div className="min-h-screen bg-white font-sans text-[#4A5568]">
      <SEO
        title={`${post.title} | Trip Himalaya Travel Blog`}
        description={
          post.excerpt
            ? post.excerpt.slice(0, 160)
            : `Read ${post.title} on Trip Himalaya. Tips, advice, and stories about Nepal travel and trekking.`
        }
        keywords={`${post.title}, Nepal travel blog, ${post.category}, Nepal trekking tips, Trip Himalaya stories`}
        canonicalPath={`/blog/${post.slug}`}
        image={post.image}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          datePublished: post.date,
          author: {
            "@type": "Person",
            name: post.author || "Trip Himalaya Team",
          },
          publisher: {
            "@type": "TravelAgency",
            name: "Trip Himalaya Tours & Travel",
          },
        }}
      />

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

        <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end py-8">
          {/* Title block */}
          <div className="max-w-3xl pb-4">
            <span className="inline-block px-4 py-1 bg-[#E91E63] text-[10px] font-black tracking-widest rounded-md mb-4 uppercase text-white shadow-sm">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight drop-shadow-md">
              {post.title}
            </h1>

            {/* Author / Published / Read Time row */}
            <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E91E63] flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-md">
                  {authorInitials}
                </div>
                <div>
                  <p className="text-[9px] text-white/60 font-bold uppercase tracking-widest">
                    AUTHOR
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    {post.author.toUpperCase()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[9px] text-white/60 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={10} /> PUBLISHED
                </p>
                <p className="text-xs sm:text-sm font-bold text-white">
                  {post.date}
                </p>
              </div>
              {post.readTime && (
                <div>
                  <p className="text-[9px] text-white/60 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> READ TIME
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    {post.readTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── META ACTION BAR ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 sm:py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            <button
              onClick={() =>
                shareToPlatform("facebook", {
                  title: `${post.title} | Trip Himalaya Travel Stories`,
                  text:
                    post.excerpt ||
                    "Read this inspiring story on Trip Himalaya Tours & Travel!",
                  image: post.image,
                  url:
                    typeof window !== "undefined"
                      ? window.location.href
                      : undefined,
                })
              }
              title="Share on Facebook"
              className="p-2 rounded-full bg-gray-100 hover:bg-[#1877F2] hover:text-white text-gray-500 transition-all cursor-pointer"
            >
              <Facebook size={13} />
            </button>
            <button
              onClick={() =>
                shareToPlatform("twitter", {
                  title: `${post.title} | Trip Himalaya Travel Stories`,
                  text:
                    post.excerpt ||
                    "Read this inspiring story on Trip Himalaya Tours & Travel!",
                  image: post.image,
                  url:
                    typeof window !== "undefined"
                      ? window.location.href
                      : undefined,
                })
              }
              title="Share on X"
              className="p-2 rounded-full bg-gray-100 hover:bg-black hover:text-white text-gray-500 transition-all cursor-pointer"
            >
              <Twitter size={13} />
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              title="More sharing options"
              className="p-2 rounded-full bg-gray-100 hover:bg-[#E91E63] hover:text-white text-gray-500 transition-all cursor-pointer"
            >
              <Share2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14">
          {/* Article body */}
          <div className="lg:col-span-8 space-y-6">
            {post.excerpt && (
              <h2 className="text-xl font-bold text-[#2D1B69] italic leading-snug">
                {post.excerpt}
              </h2>
            )}

            <div className="text-[15px] leading-relaxed space-y-5 text-[#4A5568]">
              {post.content ? (
                <div className="whitespace-pre-line leading-relaxed space-y-4">
                  {post.content}
                </div>
              ) : (
                <p>
                  Traveling through the majestic landscapes of the Himalayas
                  offers more than just scenic views — it is an immersive
                  pilgrimage into ancient cultures, resilient alpine traditions,
                  and pristine natural wonders. Whether scaling high-altitude
                  trails or exploring vibrant heritage valleys, preparation is
                  paramount.
                </p>
              )}

              {post.quote && (
                <div className="p-6 bg-purple-50/60 rounded-2xl border-l-4 border-[#E91E63] my-6">
                  <p className="italic text-[#2D1B69] font-medium text-base">
                    "{post.quote}"
                  </p>
                </div>
              )}

              {/* Dynamic Key Insights & Recommendations */}
              <div className="pt-4">
                <h3 className="text-xl font-bold text-[#2D1B69] mb-4">
                  Key Insights &amp; Recommendations
                </h3>

                <ul className="space-y-3.5 pl-2">
                  {insightsToRender.map((ins, index) => (
                    <li key={ins.id || index} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#E91E63] mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">
                        <strong className="text-[#2D1B69] font-bold">
                          {ins.title}:
                        </strong>{" "}
                        {ins.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-10 flex flex-wrap gap-2.5 pt-4 border-t border-gray-100">
              {tagsToRender.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-[#F1F5F9] text-[9px] font-bold text-[#94A3B8] rounded-full cursor-pointer hover:bg-[#E91E63] hover:text-white transition-colors uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8 sm:space-y-10">
            {/* Author card matching Image 3 */}
            <div className="bg-[#2D1B69] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={80} />
              </div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 opacity-60">
                ABOUT THE AUTHOR
              </p>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-[#E91E63] flex items-center justify-center text-xl font-bold shadow-lg flex-shrink-0">
                  {authorInitials}
                </div>
                <div>
                  <h5 className="font-bold text-base leading-none mb-1 text-white uppercase tracking-wider">
                    {post.author}
                  </h5>
                  <p className="text-[9px] opacity-60 uppercase tracking-widest font-bold">
                    TRAVEL SPECIALIST
                  </p>
                </div>
              </div>
              <p className="text-xs opacity-75 leading-relaxed mb-7">
                Veteran Himalayan expedition planner and cultural writer with
                over 15 years of field experience across Nepal, Tibet, and Bhutan.
              </p>
              <button
                onClick={() => navigate("/blog")}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] transition-all border border-white/10 cursor-pointer text-center"
              >
                VIEW ALL STORIES
              </button>
            </div>

            {/* ── RELATED STORIES (Live from backend API) ── */}
            {relatedStories.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-[11px] font-black text-[#2D1B69] uppercase tracking-widest mb-6">
                  <TrendingUp size={16} className="text-[#E91E63]" />
                  RELATED STORIES
                </h4>
                <div className="space-y-5">
                  {relatedStories.map((related) => (
                    <Link
                      key={related.id}
                      to={`/blog/${related.slug}`}
                      className="flex gap-4 group items-center"
                    >
                      <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm bg-gray-100">
                        <img
                          src={related.image}
                          alt={related.title}
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1544735745-b81216c7ad8f?auto=format&fit=crop&q=80&w=300";
                          }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
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
            <div className="bg-[#F8FAFC] p-6 sm:p-8 rounded-2xl sm:rounded-3xl text-center flex flex-col items-center border border-gray-100 shadow-xs">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#E91E63] mb-5">
                <Share2 size={22} />
              </div>
              <h5 className="font-black text-xl text-[#2D1347] mb-2">
                Inspired to Travel?
              </h5>
              <p className="text-xs text-[#94A3B8] mb-7 leading-relaxed max-w-[210px]">
                Let our Himalayan specialists craft a personalized itinerary for
                you.
              </p>
              <button
                onClick={() => navigate("/packages")}
                className="flex items-center gap-2 px-7 py-3 bg-[#E91E63] hover:bg-pink-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all group cursor-pointer"
              >
                EXPLORE PACKAGES
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
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

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={{
          title: `${post.title} | Trip Himalaya Travel Stories`,
          text:
            post.excerpt ||
            "Read this inspiring travel story on Trip Himalaya Tours & Travel.",
          image: post.image,
          url:
            typeof window !== "undefined" ? window.location.href : undefined,
        }}
      />
    </div>
  );
};

export default BlogDetailMore;
