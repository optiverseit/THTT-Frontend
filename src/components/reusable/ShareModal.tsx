import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  Share2,
  Mail,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  shareToPlatform,
  canNativeShare,
  triggerNativeShare,
  copyToClipboard,
  getCrawlerSafeUrl,
  getCurrentUrl,
  ShareData,
} from "../../utils/shareUtils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);
  const [hasNative, setHasNative] = useState(false);

  useEffect(() => {
    setHasNative(canNativeShare());
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentDisplayUrl = data.url || getCurrentUrl();
  const safeCrawlerUrl = getCrawlerSafeUrl(data.url);
  const isLocalDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  const handleCopy = async () => {
    const success = await copyToClipboard(currentDisplayUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleNativeShare = async () => {
    const success = await triggerNativeShare(data);
    if (success) {
      onClose();
    }
  };

  const socialPlatforms = [
    {
      id: "whatsapp" as const,
      name: "WhatsApp",
      subtitle: "Chat & status",
      bg: "bg-[#25D366] hover:bg-[#20bd5a]",
      textColor: "text-white",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.12-.533-1.656-.69-2.73-2.39-2.812-2.502-.083-.112-.667-.887-.667-1.691 0-.804.42-1.2.57-1.356.144-.15.314-.187.42-.187.106 0 .21.002.3.007.097.006.226-.037.354.27.132.315.45 1.097.49 1.176.04.08.067.172.013.28-.053.107-.08.173-.16.266-.08.093-.167.208-.239.28-.08.08-.163.167-.07.327.093.16.413.682.887 1.103.61.542 1.125.71 1.285.79.16.08.253.067.347-.04.093-.107.4-.467.507-.627.107-.16.213-.133.36-.08.147.053.933.44 1.093.52.16.08.267.12.307.187.04.066.04.385-.104.79z" />
        </svg>
      ),
    },
    {
      id: "facebook" as const,
      name: "Facebook",
      subtitle: "Feed & stories",
      bg: "bg-[#1877F2] hover:bg-[#166fe5]",
      textColor: "text-white",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: "tiktok" as const,
      name: "TikTok",
      subtitle: "Share video",
      bg: "bg-black hover:bg-neutral-800",
      textColor: "text-white",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
    },
    {
      id: "twitter" as const,
      name: "X (Twitter)",
      subtitle: "Tweet post",
      bg: "bg-black hover:bg-neutral-800",
      textColor: "text-white",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: "linkedin" as const,
      name: "LinkedIn",
      subtitle: "Professional network",
      bg: "bg-[#0A66C2] hover:bg-[#095196]",
      textColor: "text-white",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.94 0 1.7-.76 1.7-1.7s-.76-1.7-1.7-1.7-1.7.76-1.7 1.7.76 1.7 1.7 1.7m1.4 9.74v-8.37H5.06v8.37h2.8z" />
        </svg>
      ),
    },
    {
      id: "telegram" as const,
      name: "Telegram",
      subtitle: "Direct message",
      bg: "bg-[#229ED9] hover:bg-[#1f8ec4]",
      textColor: "text-white",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      id: "email" as const,
      name: "Email",
      subtitle: "Send via inbox",
      bg: "bg-slate-700 hover:bg-slate-800",
      textColor: "text-white",
      icon: <Mail className="w-5 h-5" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pink-50 text-[#E91E63] flex items-center justify-center">
              <Share2 size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                Share with Friends & Family
              </h3>
              <p className="text-xs text-gray-500">
                Trip Himalaya Tours & Travel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close share dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Card Preview */}
          {(data.image || data.title) && (
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
              {data.image && (
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-16 h-16 rounded-xl object-cover shadow-sm flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#E91E63] uppercase tracking-wider mb-0.5">
                  <Sparkles size={11} /> Featured Experience
                </div>
                <h4 className="text-sm font-bold text-gray-900 truncate">
                  {data.title}
                </h4>
                {data.text && (
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {data.text}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Social Platforms Grid */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-3">
              Direct Social Share
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => shareToPlatform(platform.id, data)}
                  className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/80 shadow-xs hover:shadow-md transition-all group text-left cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${platform.bg} ${platform.textColor} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-xs`}
                  >
                    {platform.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-gray-800 block truncate leading-tight">
                      {platform.name}
                    </span>
                    <span className="text-[10px] text-gray-400 block truncate">
                      {platform.subtitle}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Native Web Share Button (if supported on mobile/mac/edge) */}
          {hasNative && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#200B3B] to-[#3B156B] hover:from-[#2D1347] hover:to-[#4a1c85] text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <ExternalLink size={15} />
              Open Device Share Menu (Instagram, Messages, AirDrop)
            </button>
          )}

          {/* Copy Link Field */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Or Copy Shareable Link
            </label>
            <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-gray-50 border border-gray-200 focus-within:border-[#E91E63] focus-within:ring-2 focus-within:ring-[#E91E63]/10 transition-all">
              <span className="text-xs text-gray-600 truncate flex-1 font-mono select-all">
                {currentDisplayUrl}
              </span>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer flex-shrink-0 ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-[#200B3B] hover:bg-[#34125f] text-white"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={13} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Helpful dev hint for localhost / crawler notice */}
          {isLocalDev && (
            <div className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/70 rounded-xl p-2.5 leading-relaxed">
              <span className="font-bold">Development mode notice:</span> Social
              crawlers (Facebook & LinkedIn) cannot crawl <code className="bg-amber-100 px-1 rounded font-mono">localhost</code>.
              When opening Facebook or LinkedIn, the live domain URL (
              <span className="font-mono">{safeCrawlerUrl}</span>) is used so
              Facebook previews display correctly without crawler rejection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
