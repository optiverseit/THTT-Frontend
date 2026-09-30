import React, { useState, useRef, useEffect } from "react";
import { ReactCountryFlag } from "react-country-flag";
import {
  Clock,
  Shield,
  TrendingUp,
  Users,
  Share2,
  Printer,
  MessageCircle,
  Check,
  Link2,
} from "lucide-react";

import {
  shareToPlatform,
  triggerNativeShare,
  openSharePopup,
  copyToClipboard,
} from "../../../utils/shareUtils";

interface CountryProps {
  id: number;
  country_code: string;
  country_name: string;
  iso_2: string;
  flag_code: string;
  short_description: string;
  processing_days: number;
  status: string;
  display_order: number;
}

interface PermitBannerProps {
  id: string;
  country: CountryProps;
}

const PermitBanner: React.FC<PermitBannerProps> = ({
  country,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const shareRef = useRef<HTMLDivElement>(null);

  const serviceDetails = [
    {
      icon: Clock,
      label: `${country.processing_days} working days`,
      title: "estimated duration",
    },
    {
      icon: Shield,
      label: "2 years valid",
      title: "permit duration",
    },
    {
      icon: Users,
      label: "24/7 support",
      title: "human assistance",
    },
    {
      icon: TrendingUp,
      label: "live tracking",
      title: "status updates",
    },
  ];

  // Close share popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        shareRef.current &&
        !shareRef.current.contains(e.target as Node)
      ) {
        setIsShareOpen(false);
      }
    };

    if (isShareOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [isShareOpen]);

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  const shareTitle =
    `${country.country_name} Work Permit | Trip Himalaya Tours & Travel`;

  const shareText =
    `Check out work permit process, requirements and fees for ${country.country_name} on Trip Himalaya Tours & Travel!`;

  const shareData = {
    title: shareTitle,
    text: shareText,
    url: currentUrl,
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(currentUrl);

    if (success) {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;

    document.title =
      `${country.country_name} - Work Permit - Trip Himalaya`;

    window.print();

    window.addEventListener(
      "afterprint",
      () => {
        document.title = originalTitle;
      },
      { once: true }
    );

    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hello Trip Himalaya (Work Permit Team)! I am interested in the work permit process for ${country.country_name}. Please guide me through the requirements and next steps.`
    );

    window.open(
      `https://api.whatsapp.com/send?phone=9779851420882&text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareButtons = [
    {
      name: "Facebook",
      action: () =>
        shareToPlatform("facebook", shareData),
      bg: "#1877F2",
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="white"
          width="15"
          height="15"
        >
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      action: async () => {
        const shared =
          await triggerNativeShare(shareData);

        if (!shared) {
          await copyToClipboard(currentUrl);

          setIsCopied(true);

          setTimeout(() => {
            setIsCopied(false);
          }, 2000);

          openSharePopup(
            "https://www.instagram.com/triphimalayatt",
            "Instagram"
          );
        }
      },
      bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="white"
          width="14"
          height="14"
        >
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="5"
            ry="5"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />

          <path
            d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
            fill="white"
          />

          <circle
            cx="17.5"
            cy="6.5"
            r="1.5"
            fill="white"
          />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      action: () =>
        shareToPlatform("linkedin", shareData),
      bg: "#0A66C2",
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="white"
          width="14"
          height="14"
        >
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />

          <circle
            cx="4"
            cy="4"
            r="2"
            fill="white"
          />
        </svg>
      ),
    },
    {
      name: "Twitter / X",
      action: () =>
        shareToPlatform("twitter", shareData),
      bg: "#000000",
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="white"
          width="13"
          height="13"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="print:hidden relative rounded-3xl overflow-hidden shadow-lg min-h-[220px] sm:min-h-[260px] flex flex-col justify-end w-full">

      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark gradient overlay matching Visa header */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0520]/90 via-[#1a0836]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#2D1347]/40" />

      {/* Content */}
      <div className="relative z-10 pt-10 px-4 pb-4 sm:pt-14 sm:px-6 sm:pb-6 md:p-8">

        {/* Top row: Flag + title + action buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {/* Flag in a glassy container */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
              {country && (
                <ReactCountryFlag
                  className="text-[28px] sm:text-[34px]"
                  countryCode={country.flag_code}
                  svg
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                  {country.country_name} – WORK PERMIT
                </h2>
                <span className="bg-[#E91E63] text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm flex-shrink-0">
                  POPULAR
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white/70 mt-1">
                Authorized Labor Counseling &amp; Government Shram Approval Support
              </p>
            </div>
          </div>

          {/* Action buttons on the right */}
          <div className="print:hidden flex flex-row md:flex-col items-center gap-2 w-full md:w-40 flex-shrink-0 mt-2 md:mt-12">
            <button
              onClick={handleWhatsApp}
              className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <MessageCircle size={14} />
              <span>Ask on WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>
          </div>

        </div>

        {/* Quick pills bar matching Visa */}
        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-white/10 text-xs font-semibold text-white/90">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">
            <Clock size={13} className="text-[#E91E63]" />
            {country.processing_days} Working Days
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">
            <Shield size={13} className="text-emerald-400" />
            2 Years Valid
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">
            <Users size={13} className="text-sky-300" />
            24/7 Support
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">
            <TrendingUp size={13} className="text-amber-300" />
            Live Status Tracking
          </span>
        </div>

      </div>

      {/* SHARE BUTTON TOP RIGHT */}
      <div
        ref={shareRef}
        className="print:hidden absolute top-4 right-4 sm:top-5 sm:right-5 z-20"
      >
        {/* Share popup */}
        {isShareOpen && (
          <div className="absolute top-11 right-0 sm:top-0 sm:right-11 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/80 p-2 flex items-center gap-1.5 flex-nowrap min-w-max z-30">
            {shareButtons.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  item.action();
                  setIsShareOpen(false);
                }}
                title={`Share on ${item.name}`}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer"
                style={{
                  background: item.bg,
                }}
              >
                {item.svg}
              </button>
            ))}

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              title={
                isCopied
                  ? "Copied!"
                  : "Copy Link"
              }
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm flex-shrink-0 cursor-pointer ${
                isCopied
                  ? "bg-emerald-500"
                  : "bg-gray-700 hover:bg-gray-900"
              }`}
            >
              {isCopied ? (
                <Check
                  size={13}
                  color="white"
                />
              ) : (
                <Link2
                  size={13}
                  color="white"
                />
              )}
            </button>

            {/* Arrow tip */}
            <div className="hidden sm:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-gray-200/80" />
          </div>
        )}

        {/* Share trigger */}
        <button
          onClick={() =>
            setIsShareOpen((prev) => !prev)
          }
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
            isShareOpen
              ? "bg-white text-[#2D1347]"
              : "bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/30 text-white"
          }`}
          title="Share this page"
        >
          <Share2 size={15} />
        </button>
      </div>

    </div>
  );
};

export default PermitBanner;