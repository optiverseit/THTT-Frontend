import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import BannerSection from "../components/reusable/BannerSection";
import PreFooter from "../components/reusable/PreFooter";
import { getAllDocuments } from "../api/BackendApi";
import { SEO } from "../components/reusable";
import { pagesSEO } from "../config/seoConfig";
import { usePageBackgrounds } from "../utils/usePageBackgrounds";
import { usePageTestimonials } from "../utils/usePageTestimonials";
import Testimonials from "../components/reusable/Testimonials";
import { testimonials as mockTestimonials, mockDocuments } from "../assets/data/mockData";
import { isLocalEnvironment } from "../config/env";
import { isSessionValid, clearAuthSession } from "../utils/sessionManager";
import DocumentationApplicationModal from "../components/Service/DocumentationApplicationModal";
import ApplyDocumentationSection from "../components/Service/ApplyDocumentationSection";

const DEFAULT_DOC_BG =
  "https://images.unsplash.com/photo-1548567117-02328f050eaa?q=80&w=2070&auto=format&fit=crop";

interface DocumentationItem {
  id: number;
  title: string;
  subtitle: string | null;
  image: string | null;
  image_public_id?: string | null;
  description?: string | null;
  status?: string;
  display_order?: number;
}

interface DocumentationCardProps {
  item: DocumentationItem;
  onSelect: (item: DocumentationItem) => void;
  onApply: (item: DocumentationItem) => void;
}

const DocumentationCard: React.FC<DocumentationCardProps> = ({ item, onSelect, onApply }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="relative w-full h-[340px] rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:via-black/45 transition-colors" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white z-10">
        <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-1.5 tracking-tight group-hover:text-pink-200 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed line-clamp-2 mb-3">
          {item.subtitle}
        </p>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onApply(item);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E91E63] to-pink-600 hover:from-pink-600 hover:to-[#E91E63] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Apply Now</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-300 hover:text-white transition-all cursor-pointer"
          >
            <span>Explore Details</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DocumentationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [documents, setDocuments] = useState<DocumentationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Apply Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedDocForApply, setSelectedDocForApply] = useState<DocumentationItem | null>(null);

  const heroImages = usePageBackgrounds("documentation", DEFAULT_DOC_BG);

  const { testimonials: docTestimonials } = usePageTestimonials(
    "DOCUMENTATION",
    mockTestimonials
  );

  // Check if returning from successful login to open the apply modal
  useEffect(() => {
    const locState = location.state as any;
    const storedStateStr = sessionStorage.getItem("post_login_state");
    let returnState = locState;
    if (!returnState && storedStateStr) {
      try {
        returnState = JSON.parse(storedStateStr);
      } catch (e) {}
    }

    if (returnState?.openApplyModal && isSessionValid()) {
      sessionStorage.removeItem("post_login_state");
      sessionStorage.removeItem("post_login_redirect");
      if (returnState.docId || returnState.docTitle) {
        setSelectedDocForApply({
          id: returnState.docId,
          title: returnState.docTitle || "",
          subtitle: null,
          image: null,
        });
      }
      setIsApplyModalOpen(true);
    }
  }, [location]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await getAllDocuments();
        if (response?.data?.status && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setDocuments(response.data.data);
        } else {
          // On localhost, keep mock cards visible for design and testing
          setDocuments(isLocalEnvironment() ? mockDocuments : []);
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
        setDocuments(isLocalEnvironment() ? mockDocuments : []);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleFloatingWhatsApp = () => {
    const msg = encodeURIComponent("Hello Trip Himalaya! I would like to inquire about your documentation services.");
    window.open(`https://wa.me/9779851420882?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = (item: DocumentationItem) => {
    navigate(`/documentation/${item.id}`);
  };

  const handleApplyClick = (item?: DocumentationItem) => {
    if (!isSessionValid()) {
      clearAuthSession();
      const returnState = {
        from: location.pathname + location.search,
        openApplyModal: true,
        docId: item?.id,
        docTitle: item?.title,
      };
      try {
        sessionStorage.setItem("post_login_redirect", location.pathname + location.search);
        sessionStorage.setItem("post_login_state", JSON.stringify(returnState));
      } catch (err) {
        console.error("Failed to store post-login state", err);
      }
      navigate("/login", {
        state: returnState,
      });
      return;
    }

    setSelectedDocForApply(item || null);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 font-sans">
      <SEO {...pagesSEO.documentation} />
      <BannerSection
        heading="COMPREHENSIVE SOLUTIONS"
        title="Our Documentation"
        description="Everything you need for seamless document processing, verification, and global travel compliance."
        backgrounds={heroImages}
        background={heroImages[0] || DEFAULT_DOC_BG}
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#2e1065] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7">
            {documents.map((item) => (
              <DocumentationCard
                key={item.id}
                item={item}
                onSelect={handleCardClick}
                onApply={(doc) => handleApplyClick(doc)}
              />
            ))}
          </div>
        )}

        {/* ── APPLY FOR DOCUMENTATION AREA / SECTION ── */}
        <ApplyDocumentationSection onOpenApplyModal={() => handleApplyClick()} />
      </main>

      {/* ── DOCUMENTATION APPLICATION MODAL (WITH DYNAMIC FIELDS & PAY LATER) ── */}
      <DocumentationApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setSelectedDocForApply(null);
        }}
        preselectedDocumentId={selectedDocForApply?.id}
        preselectedDocumentTitle={selectedDocForApply?.title}
      />
      <Testimonials testimonials={docTestimonials} />
      <PreFooter
        title="Need a custom document solution?"
        description="Tell us what documents you need — we handle special embassy attestations, translations, and expedited clearances."
        btn1="Talk to an expert"
        btn2="Get a Free Quote"
      />
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
