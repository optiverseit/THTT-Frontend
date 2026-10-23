import React, { useState, useEffect } from "react";
import { X, Check, Link2 } from "lucide-react";
import {
  getCrawlerSafeUrl,
  getCurrentUrl,
  copyToClipboard,
  openSharePopup,
  ShareData,
} from "../../utils/shareUtils";
import Logo from "../../assets/images/Logo.png";

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData;
  onDownloadPdf?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  data,
  onDownloadPdf,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeUrl = data.url || getCurrentUrl();
  const crawlerUrl = getCrawlerSafeUrl(activeUrl);
  const title = data.title || "Trip Himalaya Tours & Travel";
  const subtitle = data.text || "Explore the best travel packages with Trip Himalaya.";
  const image = data.image || Logo;

  const displayUrl =
    activeUrl.startsWith("http://localhost") || activeUrl.startsWith("http://127.0.0.1")
      ? getCrawlerSafeUrl(activeUrl)
      : activeUrl;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(activeUrl);
    if (ok) {
      setCopied(true);
      showToast("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleMessenger = () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `fb-messenger://share/?link=${encodeURIComponent(crawlerUrl)}`;
      setTimeout(() => {
        openSharePopup(
          `https://www.facebook.com/dialog/send?link=${encodeURIComponent(crawlerUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(crawlerUrl)}`,
          "Share to Messenger"
        );
      }, 700);
    } else {
      openSharePopup(
        `https://www.facebook.com/dialog/send?link=${encodeURIComponent(crawlerUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(crawlerUrl)}`,
        "Share to Messenger"
      );
    }
  };

  const handleFacebookPost = () => {
    openSharePopup(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(crawlerUrl)}`,
      "Share on Facebook"
    );
  };

  const handleWhatsApp = () => {
    const text = `${title}\n${activeUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    openSharePopup(waUrl, "Share via WhatsApp");
  };

  const handleViber = async () => {
    await copyToClipboard(activeUrl);
    const msg = `${title} ${activeUrl}`;
    window.location.href = `viber://forward?text=${encodeURIComponent(msg)}`;
    showToast("Opening Viber (link copied to clipboard)");
  };

  const handleInstagram = async () => {
    await copyToClipboard(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);

    if (typeof navigator !== "undefined" && navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title,
          text: `Explore ${title} with Trip Himalaya Tours & Travel!`,
          url: activeUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }

    showToast("Link copied! Open Instagram to share in Story or DM.");
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const handleDownloadPdf = () => {
    onClose();
    if (onDownloadPdf) {
      onDownloadPdf();
    } else {
      window.print();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[370px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 sm:p-6 animate-in zoom-in-95 duration-200 select-none text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle pill */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto -mt-1 mb-2.5" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">Share</h3>
          <p className="text-xs text-gray-500 mt-0.5">Share this with your friends and family</p>
        </div>

        {/* Preview Card */}
        <div className="mt-3.5 p-2.5 rounded-2xl bg-[#F4F5F7] border border-gray-200/60 flex items-center gap-3">
          <img
            src={image}
            alt={title}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0 bg-white shadow-xs border border-white"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = Logo;
            }}
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 truncate leading-snug">
              {title}
            </h4>
            <p className="text-[11px] text-gray-500 truncate mt-0.5 leading-snug">
              {subtitle}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
              <Link2 size={12} className="rotate-[-45deg] text-gray-400 flex-shrink-0" />
              <span className="truncate select-all text-gray-500 font-mono text-[10.5px]">
                {displayUrl}
              </span>
            </div>
          </div>
        </div>

        {/* Social Platforms 4-Column Grid */}
        <div className="grid grid-cols-4 gap-y-3.5 gap-x-2 mt-4 text-center">
          {/* 1. Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-108 group-active:scale-95 shadow-sm ${
                copied ? "bg-emerald-600" : "bg-[#5B6777]"
              }`}
            >
              {copied ? (
                <Check size={20} className="text-white" />
              ) : (
                <Link2 size={20} className="text-white rotate-[-45deg]" />
              )}
            </div>
            <span className="text-[11px] font-medium text-gray-800 mt-1.5 text-center leading-tight">
              {copied ? "Copied!" : "Copy Link"}
            </span>
          </button>

          {/* 2. Messenger */}
          <button
            type="button"
            onClick={handleMessenger}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-108 group-active:scale-95 shadow-sm bg-[#0084FF]">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.453 5.518 3.734 7.207V22l3.359-1.844c.915.253 1.888.39 2.907.39 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.002 12.43-2.56-2.73-4.996 2.73 5.494-5.832 2.624 2.73 4.933-2.73-5.495 5.832z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-gray-800 mt-1.5 text-center leading-tight">
              Messenger
            </span>
          </button>

          {/* 3. Facebook Post */}
          <button
            type="button"
            onClick={handleFacebookPost}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-108 group-active:scale-95 shadow-sm bg-[#1877F2]">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-gray-800 mt-1.5 text-center leading-tight whitespace-pre-line">
              Facebook{"\n"}Post
            </span>
          </button>

          {/* 4. WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-108 group-active:scale-95 shadow-sm bg-[#25D366]">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M11.999 2C6.479 2 2 6.479 2 12c0 1.789.47 3.467 1.29 4.93L2 22l5.232-1.267A9.966 9.966 0 0012 22c5.521 0 10-4.479 10-10S17.521 2 12 2z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-gray-800 mt-1.5 text-center leading-tight">
              WhatsApp
            </span>
          </button>

          {/* 5. Viber */}
          <button
            type="button"
            onClick={handleViber}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-108 group-active:scale-95 shadow-sm bg-[#7360F2]">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M19.467 15.65c-.477-.384-2.28-1.294-2.73-1.428-.45-.133-.777.067-.999.366-.222.3-.855 1.077-1.044 1.298-.189.222-.378.244-.711.089-.333-.156-1.408-.52-2.682-1.656-.991-.884-1.66-1.977-1.854-2.31-.194-.333-.021-.513.146-.679.15-.15.333-.389.5-.583.167-.194.222-.333.333-.555.111-.222.056-.416-.028-.583-.083-.167-.75-1.808-1.028-2.476-.271-.65-.547-.56-.75-.572-.194-.01-.417-.013-.639-.013-.222 0-.583.083-.889.417-.306.333-1.167 1.141-1.167 2.781 0 1.641 1.194 3.226 1.361 3.449.167.222 2.35 3.589 5.7 5.034.797.345 1.419.551 1.905.705.801.255 1.53.219 2.106.133.642-.096 1.977-.808 2.255-1.589.278-.781.278-1.45.194-1.589-.083-.139-.306-.222-.64-.389zM15.5 3.5c3.86 0 7 3.14 7 7 0 .55-.45 1-1 1s-1-.45-1-1c0-2.76-2.24-5-5-5-.55 0-1-.45-1-1s.45-1 1-1zm-.5 3.5c2.21 0 4 1.79 4 4 0 .55-.45 1-1 1s-1-.45-1-1c0-1.1-.9-2-2-2-.55 0-1-.45-1-1s.45-1 1-1z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-gray-800 mt-1.5 text-center leading-tight">
              Viber
            </span>
          </button>

          {/* 6. Instagram */}
          <button
            type="button"
            onClick={handleInstagram}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-108 group-active:scale-95 shadow-sm"
              style={{
                background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-gray-800 mt-1.5 text-center leading-tight">
              Instagram
            </span>
          </button>

          {/* 7. Download as PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-108 group-active:scale-95 shadow-sm bg-[#E53935]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-white">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" />
                <polyline points="14 2 14 8 20 8" stroke="white" />
                <text x="7" y="16.5" fill="white" fontSize="4.5" fontWeight="900" fontFamily="sans-serif">
                  PDF
                </text>
              </svg>
            </div>
            <span className="text-[11px] font-medium text-gray-800 mt-1.5 text-center leading-tight whitespace-pre-line">
              Download{"\n"}as PDF
            </span>
          </button>
        </div>

        {/* Floating toast notification */}
        {toastMessage && (
          <div className="mt-3 p-2 bg-gray-900 text-white text-[11px] font-medium text-center rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
