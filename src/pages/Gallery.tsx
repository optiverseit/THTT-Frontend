import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  MapPin,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import PreFooter from "../components/reusable/PreFooter";
import BannerSection from "../components/reusable/BannerSection";
import { galleryData } from "../assets/data/mockData";
import { SEO } from "../components/reusable";
import { pagesSEO } from "../config/seoConfig";
import { getGalleries, getPageByName } from "../api/BackendApi";

export interface GalleryItem {
  id: string | number;
  galleryId?: number | string;
  title: string;
  category: string;
  categoryId?: number | string;
  location: string;
  image: string;
  caption?: string;
}

interface CategoryFilter {
  id: string;
  label: string;
  aliases: string[];
}

const BASE_CATEGORIES: CategoryFilter[] = [
  { id: "all", label: "All Photos", aliases: [] },
  { id: "treks", label: "Trekking", aliases: ["trek", "himalaya", "trekking", "everest", "annapurna"] },
  { id: "tours", label: "Tours & Holidays", aliases: ["tour", "holiday", "tours", "vacation", "lake"] },
  { id: "adventures", label: "Adventures", aliases: ["adventur", "raft", "paragl", "safari", "extreme"] },
  { id: "cultural", label: "Culture & Heritage", aliases: ["cultur", "heritage", "temple", "stupa", "sacred"] },
  { id: "vehicles", label: "Vehicles & Heli", aliases: ["vehic", "heli", "coach", "van", "flight", "car", "helicopter"] },
];

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=2000";

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bannerImage, setBannerImage] = useState<string>(DEFAULT_BANNER);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Check category slider scroll limits on mobile
  const checkScroll = useCallback(() => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const el = categoryScrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [checkScroll]);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = 220;
      categoryScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  // ── Fetch dynamic gallery banner image from Pages API ──
  useEffect(() => {
    let isMounted = true;
    const fetchBanner = async () => {
      try {
        const pageRes = await getPageByName("gallery");
        const bgImages =
          pageRes.data?.data?.background_images ||
          pageRes.data?.background_images;
        if (
          isMounted &&
          Array.isArray(bgImages) &&
          bgImages.length > 0 &&
          bgImages[0]?.image
        ) {
          setBannerImage(bgImages[0].image);
        }
      } catch {
        // Keeps default banner image gracefully if not set in CMS
      }
    };
    fetchBanner();
    return () => {
      isMounted = false;
    };
  }, []);

  // ── Fetch galleries from backend API ──
  const fetchGalleryData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getGalleries();

      // Normalize Laravel paginated / standard data structure
      let rawGalleries: any[] = [];
      if (Array.isArray(response.data?.data?.data)) {
        rawGalleries = response.data.data.data;
      } else if (Array.isArray(response.data?.data)) {
        rawGalleries = response.data.data;
      } else if (Array.isArray(response.data)) {
        rawGalleries = response.data;
      }

      const parsedItems: GalleryItem[] = [];

      rawGalleries.forEach((gallery: any) => {
        const title = gallery.title || "Nepal Himalayan Moment";
        const location = gallery.location || "Nepal";
        const categoryName = gallery.category?.name || "Trekking";
        const categoryId = gallery.category_id || gallery.category?.id;

        const activeImages = Array.isArray(gallery.images)
          ? gallery.images.filter(
              (img: any) => img.status === "ACTIVE" || !img.status
            )
          : [];

        if (activeImages.length > 0) {
          activeImages.forEach((img: any, idx: number) => {
            parsedItems.push({
              id: `${gallery.id}-${img.id || idx}`,
              galleryId: gallery.id,
              title: title,
              category: categoryName,
              categoryId: categoryId,
              location: location,
              image: img.image,
              caption: title,
            });
          });
        } else if (gallery.image) {
          parsedItems.push({
            id: String(gallery.id),
            galleryId: gallery.id,
            title: title,
            category: categoryName,
            categoryId: categoryId,
            location: location,
            image: gallery.image,
            caption: title,
          });
        }
      });

      if (parsedItems.length > 0) {
        setPhotos(parsedItems);
      } else {
        // Fallback to verified local items if backend has not seeded galleries yet
        setPhotos(galleryData as GalleryItem[]);
      }
    } catch (err) {
      console.warn("Unable to fetch galleries from API, fallback to default:", err);
      setPhotos(galleryData as GalleryItem[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  // ── Dynamically discover any extra categories from loaded data ──
  const categories = useMemo(() => {
    const customCats: CategoryFilter[] = [];
    photos.forEach((photo) => {
      const cat = photo.category;
      if (!cat) return;
      const lower = cat.toLowerCase();
      const alreadyCovered = BASE_CATEGORIES.some(
        (bc) =>
          bc.id === lower ||
          bc.label.toLowerCase() === lower ||
          bc.aliases.some((a) => lower.includes(a))
      );
      if (!alreadyCovered && !customCats.some((c) => c.label.toLowerCase() === lower)) {
        customCats.push({
          id: lower.replace(/\s+/g, "-"),
          label: cat,
          aliases: [lower],
        });
      }
    });
    return [...BASE_CATEGORIES, ...customCats];
  }, [photos]);

  // ── Filter photos by selected category ──
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "all") return photos;

    const activeCatObj = categories.find((c) => c.id === selectedCategory);
    const filterId = selectedCategory.toLowerCase();
    const filterLabel = activeCatObj ? activeCatObj.label.toLowerCase() : filterId;
    const aliases = activeCatObj?.aliases || [];

    return photos.filter((photo) => {
      const pCat = (photo.category || "").toLowerCase();
      if (pCat === filterId || pCat === filterLabel) return true;
      if (aliases.some((a) => pCat.includes(a))) return true;
      return false;
    });
  }, [photos, selectedCategory, categories]);

  // Format category badge display text
  const getCategoryBadge = (cat: string) => {
    if (!cat) return "PHOTO";
    const lower = cat.toLowerCase();
    if (lower === "treks" || lower.includes("trek")) return "TREKS";
    if (lower === "tours" || lower.includes("tour")) return "TOURS";
    if (lower === "adventures" || lower.includes("advent")) return "ADVENTURES";
    if (lower === "cultural" || lower.includes("cultur") || lower.includes("heritage")) return "CULTURAL";
    if (lower === "vehicles" || lower.includes("vehic") || lower.includes("heli")) return "VEHICLES";
    return cat.toUpperCase();
  };

  const handleNext = () => {
    if (activePhotoIndex !== null && filteredPhotos.length > 0) {
      setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
    }
  };

  const handlePrev = () => {
    if (activePhotoIndex !== null && filteredPhotos.length > 0) {
      setActivePhotoIndex(
        (activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      );
    }
  };

  // Keyboard navigation for full screen lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === "Escape") setActivePhotoIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, filteredPhotos.length]);

  return (
    <div className="w-full bg-white font-sans min-h-screen">
      <SEO {...pagesSEO.gallery} />

      {/* ── HERO BANNER ── */}
      <BannerSection
        background={bannerImage}
        alt="Himalayan Photo Gallery"
        heading="CAPTURING MEMORIES"
        title="Photo Gallery"
        description="Explore authentic moments from our treks, luxury tours, thrilling adventures, and cultural journeys across Nepal and beyond."
      />

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 md:pb-16">
        {/* Category Filters with Horizontal Scroll & Arrows on mobile; full row on desktop */}
        <div className="relative max-w-5xl mx-auto mb-8 sm:mb-10 px-1">
          <div className="flex items-center gap-1.5 sm:gap-2 md:justify-center">
            {/* Left Scroll Arrow — Mobile only */}
            <button
              type="button"
              onClick={() => scrollCategories("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll categories left"
              className={`md:hidden flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center transition-all cursor-pointer z-10 ${
                canScrollLeft
                  ? "text-slate-700 hover:text-[#FF4FA3] hover:bg-pink-50 hover:border-pink-200 active:scale-95"
                  : "text-slate-300 opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Container: Slider on mobile, clean centered flex on desktop */}
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 sm:gap-3 overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center scroll-smooth py-2 px-1 flex-1 md:flex-none whitespace-nowrap"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#CBD5E1 transparent",
              }}
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActivePhotoIndex(null);
                    }}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs flex-shrink-0 whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] text-white shadow-md shadow-pink-900/30 scale-105"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow — Mobile only */}
            <button
              type="button"
              onClick={() => scrollCategories("right")}
              disabled={!canScrollRight}
              aria-label="Scroll categories right"
              className={`md:hidden flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center transition-all cursor-pointer z-10 ${
                canScrollRight
                  ? "text-slate-700 hover:text-[#FF4FA3] hover:bg-pink-50 hover:border-pink-200 active:scale-95"
                  : "text-slate-300 opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-[#2D1347] border-t-[#FF4FA3] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#2D1347] font-bold text-base">Loading gallery moments...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <MapPin size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">No photos in this category yet</h3>
            <p className="text-sm text-slate-500 mb-5">
              Check back soon or explore our other collections.
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] text-white text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              View All Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setActivePhotoIndex(index)}
                className="group relative h-72 sm:h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-100 bg-slate-900"
              >
                {/* Image */}
                <img
                  src={photo.image}
                  alt={photo.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_BANNER;
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Top Category Badge */}
                <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  {getCategoryBadge(photo.category)}
                </span>

                {/* Floating View Icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Eye size={16} />
                </div>

                {/* Bottom Caption & Location */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs text-[#FF4FA3] font-bold flex items-center gap-1.5 mb-1.5 drop-shadow-sm">
                    <MapPin size={13} className="shrink-0 text-[#FF4FA3]" />
                    <span className="truncate">{photo.location}</span>
                  </p>
                  <h3 className="text-lg font-black tracking-tight leading-snug drop-shadow-md line-clamp-2">
                    {photo.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── FULL-SCREEN LIGHTBOX MODAL ── */}
      {activePhotoIndex !== null && filteredPhotos[activePhotoIndex] && (
        <div
          className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 select-none"
          onClick={() => setActivePhotoIndex(null)}
        >
          {/* Top Bar: Title, Location & Controls */}
          <div
            className="flex items-center justify-between w-full z-50 px-2 sm:px-4 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white max-w-xs sm:max-w-lg">
              <span className="text-[10px] sm:text-xs font-black text-[#FF4FA3] uppercase tracking-widest flex items-center gap-1 mb-0.5">
                <MapPin size={11} className="shrink-0" />
                {filteredPhotos[activePhotoIndex].location}
              </span>
              <h3 className="text-base sm:text-xl font-black truncate">
                {filteredPhotos[activePhotoIndex].title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-white/70 bg-white/10 px-3 py-1 rounded-full">
                {activePhotoIndex + 1} / {filteredPhotos.length}
              </span>
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-xl"
                aria-label="Close full screen viewer"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Center: Full-Screen Image & Navigation Arrows */}
          <div
            className="relative flex-1 flex items-center justify-center w-full px-2 sm:px-12 my-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-[#FF4FA3] text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border border-white/20 shadow-2xl hover:scale-110"
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Main Full-Screen Photo */}
            <img
              src={filteredPhotos[activePhotoIndex].image}
              alt={filteredPhotos[activePhotoIndex].title}
              className="max-h-[75vh] sm:max-h-[82vh] md:max-h-[86vh] w-auto max-w-[94vw] object-contain rounded-2xl shadow-2xl transition-all duration-300"
            />

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-[#FF4FA3] text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border border-white/20 shadow-2xl hover:scale-110"
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Bottom Bar: Caption */}
          {filteredPhotos[activePhotoIndex].caption && (
            <div
              className="w-full text-center px-4 py-2 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto bg-black/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 inline-block">
                {filteredPhotos[activePhotoIndex].caption}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── PRE-FOOTER CTA ── */}
      <PreFooter
        title="Ready to Capture Your Own Story?"
        description="Book customized Himalayan treks, cultural tours, and adventures with Trip Himalaya."
        btn1="Call Us Now"
        btn2="Get a Free Quote"
      />
    </div>
  );
};

export default Gallery;
