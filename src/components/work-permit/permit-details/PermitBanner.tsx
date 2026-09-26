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
  id,
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
    <div className="relative min-h-[22rem] sm:min-h-[20rem] md:h-80 w-full overflow-hidden shadow-md flex flex-col justify-center">

      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Full width dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-12 sm:pt-14 pb-6 sm:pb-8 flex flex-col justify-between h-full">

        {/* Top row: title + action buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <h1 className="text-white text-lg sm:text-2xl md:text-3xl font-bold w-fit rounded-full backdrop-blur-xs bg-gray-200/20 max-w-full">

            <span className="px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 flex-wrap">

              {country && (
                <ReactCountryFlag
                  className="text-[18px] sm:text-[20px]"
                  countryCode={country.flag_code}
                  svg
                />
              )}

              <span className="truncate">
                {country.country_code} - NEW LABOUR PERMIT
              </span>

            </span>

          </h1>

          {/* Action buttons */}
          <div className="print:hidden flex flex-row md:flex-col items-center gap-2 w-full md:w-40 flex-shrink-0 mt-2 md:mt-16">

            <button
              onClick={handleWhatsApp}
              className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-md"
            >
              <MessageCircle size={13} />
              <span>Ask on WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 md:flex-none md:w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white/75 hover:text-white rounded-md text-[10px] font-medium transition-all cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer size={11} />
              <span>Print / Save PDF</span>
            </button>

          </div>

        </div>

        {/* Details */}
        <div className="grid grid-cols-2 lg:flex text-white mt-6 sm:mt-8 w-full justify-between gap-3 sm:gap-4">

          {serviceDetails.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-3"
              >

                <div className="p-2.5 sm:p-3.5 md:p-4 backdrop-blur-xs rounded-xl sm:rounded-2xl bg-gray-200/20 flex-shrink-0">
                  <Icon
                    size={18}
                    className="sm:w-5 sm:h-5"
                  />
                </div>

                <div className="min-w-0">

                  <h1 className="font-bold text-xs sm:text-sm md:text-base leading-tight truncate">
                    {item.label.toUpperCase()}
                  </h1>

                  <p className="text-[10px] sm:text-xs text-gray-300 tracking-wide truncate">
                    {item.title.toUpperCase()}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

        {/* SHARE BUTTON */}
        <div
          ref={shareRef}
          className="print:hidden absolute top-12 right-4 sm:top-14 sm:right-8 md:right-12 lg:right-16 xl:right-20 z-20"
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

    </div>
  );
};

export default PermitBanner;