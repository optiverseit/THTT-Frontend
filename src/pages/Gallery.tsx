import React, { useState } from "react";
import {
  Compass,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PreFooter from "../components/reuseable/PreFooter";
import BannerSection from "../components/reuseable/BannerSection";

interface GalleryPhoto {
  id: string;
  title: string;
  category: "all" | "tours" | "treks" | "adventures" | "vehicles" | "cultural";
  image: string;
  location: string;
  caption?: string;
}

const galleryData: GalleryPhoto[] = [
  {
    id: "g1",
    title: "Everest Base Camp Panorama",
    category: "treks",
    location: "Solukhumbu, Nepal",
    image: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=1600",
    caption: "Breathtaking panoramic view of the majestic Everest range during sunrise.",
  },
  {
    id: "g2",
    title: "Phewa Lake Boating & Sunset",
    category: "tours",
    location: "Pokhara, Nepal",
    image: "https://images.unsplash.com/photo-1544735745-b81216c7ad8f?auto=format&fit=crop&q=80&w=1200",
    caption: "Tranquil evening reflection over the calm waters of Phewa Lake in Pokhara.",
  },
  {
    id: "g3",
    title: "Tandem Paragliding High Skies",
    category: "adventures",
    location: "Sarangkot, Pokhara",
    image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=1200",
    caption: "Soaring through the clouds above the Annapurna mountain range.",
  },
  {
    id: "g4",
    title: "Annapurna Sanctuary Expedition",
    category: "treks",
    location: "Annapurna Region, Nepal",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    caption: "Hikers trekking through the rugged trails of the Annapurna massif.",
  },
  {
    id: "g5",
    title: "Luxury Beachfront Getaway",
    category: "tours",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200",
    caption: "Exclusive luxury villa escape with turquoise ocean views.",
  },
  {
    id: "g6",
    title: "Premium Tourist Coaches & Vans",
    category: "vehicles",
    location: "Kathmandu Valley",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
    caption: "Our modern, air-conditioned private fleet ready for airport transfers and tours.",
  },
  {
    id: "g7",
    title: "White Water Rafting Adrenaline",
    category: "adventures",
    location: "Trishuli River, Nepal",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200",
    caption: "Conquering thrilling class III rapids on the pristine Trishuli River.",
  },
  {
    id: "g8",
    title: "Boudhanath Stupa Evening Chants",
    category: "cultural",
    location: "Kathmandu, Nepal",
    image: "https://images.unsplash.com/photo-1545231097-cbd796f1d95f?auto=format&fit=crop&q=80&w=1200",
    caption: "Spiritual ambiance around the ancient UNESCO World Heritage monument.",
  },
  {
    id: "g9",
    title: "Himalayan Heli Sightseeing Tour",
    category: "vehicles",
    location: "Everest Region",
    image: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=1200",
    caption: "VIP helicopter flight touching down near Kalapathar overlooking Mt. Everest.",
  },
  {
    id: "g10",
    title: "Dubai Desert Safari Sunset",
    category: "tours",
    location: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200",
    caption: "Dune bashing and traditional Bedouin desert camp experience.",
  },
  {
    id: "g11",
    title: "Langtang Rhododendron Trails",
    category: "treks",
    location: "Langtang Valley",
    image: "https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&q=80&w=1200",
    caption: "Blooming spring trails winding through traditional Tamang villages.",
  },
  {
    id: "g12",
    title: "Pashupatinath Sacred Heritage",
    category: "cultural",
    location: "Kathmandu, Nepal",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200",
    caption: "Centuries-old architecture and cultural heritage preserved in time.",
  },
];

const categories = [
  { id: "all", label: "All Photos" },
  { id: "treks", label: "Trekking" },
  { id: "tours", label: "Tours & Holidays" },
  { id: "adventures", label: "Adventures" },
  { id: "cultural", label: "Culture & Heritage" },
  { id: "vehicles", label: "Vehicles & Heli" },
];

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const filteredPhotos = selectedCategory === "all"
    ? galleryData
    : galleryData.filter((p) => p.category === selectedCategory);

  const handleNext = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
    }
  };

  const handlePrev = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  // Keyboard navigation for full screen viewer
  React.useEffect(() => {
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
      
      {/* ── HERO HEADER matching Image 4 style ── */}
      <BannerSection
        background="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=2000"
        alt="Himalayan Gallery"
        heading="CAPTURING MEMORIES"
        title="Photo Gallery"
        description="Explore authentic moments from our treks, luxury tours, thrilling adventures, and cultural journeys across Nepal and beyond."
      />

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 md:pb-16">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActivePhotoIndex(null);
              }}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] text-white shadow-md shadow-pink-900/30 scale-105"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
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
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />

              {/* Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Top Category Badge */}
              <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                {photo.category}
              </span>

              {/* Floating View Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Eye size={16} />
              </div>

              {/* Bottom Caption & Location */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs text-pink-400 font-bold flex items-center gap-1 mb-1">
                  <Compass size={13} />
                  {photo.location}
                </p>
                <h3 className="text-lg font-black tracking-tight leading-snug drop-shadow-md">
                  {photo.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* ── FULL-SCREEN LIGHTBOX MODAL ── */}
      {activePhotoIndex !== null && filteredPhotos[activePhotoIndex] && (
        <div
          className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 select-none"
          onClick={() => setActivePhotoIndex(null)}
        >
          {/* Top Bar: Title & Controls */}
          <div
            className="flex items-center justify-between w-full z-50 px-2 sm:px-4 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white">
              <span className="text-[10px] sm:text-xs font-black text-pink-400 uppercase tracking-widest block">
                {filteredPhotos[activePhotoIndex].location}
              </span>
              <h3 className="text-base sm:text-xl font-black truncate max-w-xs sm:max-w-lg">
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
