import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock3,
  MessageCircle,
  Printer,
  Share2,
} from "lucide-react";
import PreFooter from "../components/reusable/PreFooter";
import { getDocumentById } from "../api/BackendApi";

interface DocumentationItem {
  id: number;
  title: string;
  subtitle: string | null;
  image: string | null;
  image_public_id?: string | null;
  description: string | null;
  status?: string;
  display_order?: number;
}

export default function DocumentationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [document, setDocument] =
    useState<DocumentationItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        setError("Document not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getDocumentById(id);

        if (response?.data?.status && response?.data?.data) {
          setDocument(response.data.data);
        } else {
          setError(
            response?.data?.message || "Document not found."
          );
        }
      } catch (error: any) {
        console.error("Failed to fetch document:", error);

        setError(
          error?.response?.data?.message ||
            "Failed to load document."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I would like to inquire about ${
        document?.title || "your documentation services"
      }.`
    );

    window.open(
      `https://wa.me/9779800000003?text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document?.title || "Documentation Service",
          text: document?.subtitle || "",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50/50">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#2e1065]" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50/50 px-4 text-center">
        <h2 className="text-2xl font-black text-[#2e1065]">
          Document Not Found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error ||
            "The requested document could not be found."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/documentation")}
          className="mt-6 rounded-xl bg-[#2e1065] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
        >
          Back to Documentation
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 font-sans">

      {/* =====================================================
          MAIN CONTENT
          Same width as original UI
      ====================================================== */}
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 pb-14 pt-5 sm:px-6 lg:px-8">

        {/* =====================================================
            HERO SECTION
        ====================================================== */}
        <section className="relative h-[250px] w-full overflow-hidden rounded-[24px] shadow-lg sm:h-[270px] md:h-[285px]">

          {document.image ? (
            <img
              src={document.image}
              alt={document.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#2e1065]" />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#160828]/95 via-[#241039]/72 to-[#160828]/55" />

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="absolute right-5 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 cursor-pointer"
          >
            <Share2 size={16} />
          </button>

          {/* Hero Content */}
          <div className="relative z-10 flex h-full items-center justify-between gap-8 px-8 sm:px-9 lg:px-10">

            {/* LEFT */}
            <div className="min-w-0 flex-1">

              <span className="inline-flex rounded-md bg-blue-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                Government Clearance
              </span>

              <h1 className="mt-2.5 max-w-3xl text-[27px] font-black leading-tight tracking-tight text-white sm:text-[30px] md:text-[32px]">
                {document.title}
              </h1>

              {document.subtitle && (
                <p className="mt-1.5 max-w-3xl text-[13px] font-semibold leading-relaxed text-white/90 sm:text-sm">
                  {document.subtitle}
                </p>
              )}

              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/15 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-sm">
                <Clock3
                  size={15}
                  className="text-emerald-300"
                />

                <span>
                  Turnaround: 3–5 Business Days
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden w-[200px] shrink-0 flex-col gap-2.5 md:flex">

              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-[13px] font-bold text-white shadow-md transition hover:bg-emerald-600 cursor-pointer"
              >
                <MessageCircle size={16} />
                Ask on WhatsApp
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-[13px] font-bold text-white backdrop-blur-sm transition hover:bg-white/20 cursor-pointer"
              >
                <Printer size={15} />
                Print Checklist PDF
              </button>
            </div>
          </div>
        </section>

        {/* Mobile Buttons */}
        <div className="mt-3 flex gap-2 md:hidden">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-bold text-white cursor-pointer"
          >
            <MessageCircle size={15} />
            Ask on WhatsApp
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2e1065] px-3 py-2.5 text-xs font-bold text-white cursor-pointer"
          >
            <Printer size={14} />
            Print Checklist
          </button>
        </div>

        {/* =====================================================
            ABOUT SECTION
        ====================================================== */}
        <section className="mt-8 rounded-[24px] border border-gray-200 bg-white px-7 py-8 shadow-sm sm:px-9 md:px-10 lg:px-11">

          <h2 className="mb-4 text-[26px] font-black leading-tight tracking-tight text-[#2e1065] sm:text-[28px] md:text-[30px]">
            About {document.title}
          </h2>

          {document.description ? (
            <div
              className="
                documentation-rich-content
                w-full
                min-w-0
                max-w-full
                text-[14px]
                leading-[1.75]
                text-gray-700
                sm:text-[15px]
                md:text-[16px]

                [&_*]:max-w-full

                [&_p]:whitespace-normal
                [&_div]:whitespace-normal
                [&_span]:whitespace-normal

                [&_p]:break-words
                [&_div]:break-words
                [&_span]:break-words

                [&_img]:h-auto
                [&_img]:max-w-full

                [&_table]:w-full
                [&_table]:max-w-full
              "
              dangerouslySetInnerHTML={{
                __html: document.description,
              }}
            />
          ) : (
            <p className="text-sm text-gray-500">
              No additional information is available for
              this document.
            </p>
          )}
        </section>
      </main>

      {/* =====================================================
          PRE FOOTER
      ====================================================== */}
      <PreFooter
        title={`Need help with ${document.title}?`}
        description="Our team can guide you through the complete documentation process and requirements."
        btn1="Talk to an expert"
        btn2="Get a Free Quote"
      />

      {/* =====================================================
          FLOATING WHATSAPP
      ====================================================== */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={handleWhatsApp}
          aria-label="Contact us on WhatsApp"
          className="flex items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-xl transition-all hover:scale-110 hover:bg-emerald-600 cursor-pointer"
        >
          <MessageCircle size={26} />
        </button>
      </div>
    </div>
  );
}