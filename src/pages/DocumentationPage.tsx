import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import BannerSection from "../components/reusable/BannerSection";
import PreFooter from "../components/reusable/PreFooter";
import { DOCUMENTATION_ITEMS, DocumentationItem } from "../data/documentationData";

// --- SUB-COMPONENT: Documentation Card (No Icons) ---
interface DocumentationCardProps {
  item: DocumentationItem;
  onSelect: (item: DocumentationItem) => void;
}

const DocumentationCard: React.FC<DocumentationCardProps> = ({ item, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="relative w-full h-[340px] rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Background Image */}
      <img
        src={item.heroImage}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:via-black/45 transition-colors" />

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white z-10">
        <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-1.5 tracking-tight group-hover:text-pink-200 transition-colors">
          {item.name}
        </h3>

        <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed line-clamp-2 mb-3">
          {item.shortDesc}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pink-400 group-hover:text-white group-hover:gap-3 transition-all cursor-pointer"
        >
          <span>Explore Details</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

// --- MAIN DOCUMENTATION PAGE ---
export default function DocumentationPage() {
  const navigate = useNavigate();

  const handleFloatingWhatsApp = () => {
    const msg = encodeURIComponent("Hello Trip Himalaya! I would like to inquire about your documentation services.");
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = (item: DocumentationItem) => {
    navigate(`/documentation/${item.id}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 font-sans">
      {/* BannerSection matching Image structure: "Our Documentation" replacing "Our Services" */}
      <BannerSection
        heading="COMPREHENSIVE SOLUTIONS"
        title="Our Documentation"
        description="Everything you need for seamless document processing, verification, and global travel compliance."
        background="https://images.unsplash.com/photo-1548567117-02328f050eaa?q=80&w=2070&auto=format&fit=crop"
        alt="Trip Himalaya Documentation Services"
      />

      <main className="relative z-20 mx-auto w-full flex-grow px-4 pb-16 pt-6 sm:pt-8 sm:px-8 lg:px-16 max-w-screen-2xl">
        <header className="mb-6 sm:mb-8 text-center">
          <h2 className="mb-2.5 text-2xl sm:text-3xl md:text-4xl font-black text-[#2e1065] tracking-tight">
            Tailored Documentation Management
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-gray-500">
            We provide end-to-end support for visa clearances, police reports, insurance policies, and legal document attestations.
          </p>
        </header>

        {/* 3-column Grid matching the screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7">
          {DOCUMENTATION_ITEMS.map((item) => (
            <DocumentationCard
              key={item.id}
              item={item}
              onSelect={handleCardClick}
            />
          ))}
        </div>
      </main>

      {/* PreFooter CTA Section */}
      <PreFooter
        title="Need a custom document solution?"
        description="Tell us what documents you need — we handle special embassy attestations, translations, and expedited clearances."
        btn1="Talk to an expert"
        btn2="Get a Free Quote"
      />

      {/* Floating WhatsApp Quick Contact Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleFloatingWhatsApp}
          aria-label="Contact us on WhatsApp"
          className="flex items-center justify-center rounded-full bg-[#25D366] hover:bg-emerald-600 p-3.5 text-white shadow-xl transition-all hover:scale-110 cursor-pointer"
        >
          <MessageCircle size={28} />
        </button>
      </div>
    </div>
  );
}
