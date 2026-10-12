/**
 * TopBar.tsx
 * ----------------------------------------------------------------
 * The top-most bar of the site header. Displays:
 *  - Contact info (email, WhatsApp dropdown, phone)
 *  - Social media links
 *  - Currency / Flag selector dropdown (NPR Nepal | USD United States)
 *
 * The flag selector:
 *  - Defaults to Nepali (NPR) flag
 *  - Persists selection in sessionStorage across page refreshes
 *  - Switches all prices site-wide via GlobalCurrencyContext
 * ----------------------------------------------------------------
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Mail,
  Phone,
  ChevronDown,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Plane,
  Map,
  Mountain,
  Hotel,
  FileText,
  Bus,
  Car,
  Shield,
  BadgeDollarSign,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useGlobalCurrency, type CurrencyMode } from "../../context/CurrencyContext";

// =============================================================================
// Social Icons
// =============================================================================

export const WhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 14,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 0 0 1.333 4.993L2 22l5.233-1.237a9.994 9.994 0 0 0 4.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.925-7.062A9.925 9.925 0 0 0 12.012 2zm0 18.293h-.003a8.318 8.318 0 0 1-4.233-1.157l-.304-.18-3.146.744.757-3.067-.198-.314a8.308 8.308 0 0 1-1.272-4.335c0-4.588 3.733-8.318 8.324-8.318 2.223 0 4.312.865 5.884 2.435a8.272 8.272 0 0 1 2.432 5.885c0 4.59-3.733 8.32-8.324 8.32zm4.561-6.225c-.25-.125-1.478-.73-1.707-.813-.229-.083-.396-.125-.562.125-.167.25-.646.813-.792.979-.146.167-.292.188-.542.063s-1.06-.391-2.019-1.246c-.746-.665-1.25-1.488-1.396-1.738-.146-.25-.016-.385.109-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.021-.438s-.562-1.354-.771-1.854c-.203-.487-.41-.421-.562-.429h-.479c-.167 0-.438.063-.667.313s-.875.854-.875 2.083c0 1.229.896 2.417 1.021 2.583.125.167 1.762 2.69 4.269 3.773.596.258 1.061.412 1.424.527.599.19 1.144.163 1.575.099.48-.072 1.478-.604 1.687-1.188.208-.583.208-1.083.146-1.188-.063-.104-.229-.167-.479-.292z" />
  </svg>
);

export const HelicopterIcon: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 15,
  color = "#ffffff",
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 4h16" />
    <path d="M12 4v3" />
    <path d="M6 10a4 4 0 0 1 4-3h4a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2H9a3 3 0 0 1-3-3v-2z" />
    <path d="M6 10l-4-2" />
    <path d="M2 6.5v3" />
    <path d="M8 15v3" />
    <path d="M15 15v3" />
    <path d="M5 18h14" />
  </svg>
);

export const TikTokIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 13,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// =============================================================================
// Currency / Flag Options
// =============================================================================

interface CurrencyOption {
  mode: CurrencyMode;
  countryCode: string;     // ISO 3166-1 alpha-2 code for SVG flag
  flagEmoji: string;       // Unicode flag emoji fallback
  label: string;           // Full country + currency label shown in dropdown
  shortLabel: string;      // Short label shown in the trigger button
  currencySymbol: string;  // Symbol like "Rs.", "$", or "₹"
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    mode: "nepali",
    countryCode: "NP",
    flagEmoji: "🇳🇵",
    label: "Nepali Rupee (NPR)",
    shortLabel: "NPR",
    currencySymbol: "Rs.",
  },
  {
    mode: "foreigner",
    countryCode: "US",
    flagEmoji: "🇺🇸",
    label: "US Dollar (USD)",
    shortLabel: "USD",
    currencySymbol: "$",
  },
  {
    mode: "inr",
    countryCode: "IN",
    flagEmoji: "🇮🇳",
    label: "Indian Rupee (INR)",
    shortLabel: "INR",
    currencySymbol: "₹",
  },
];

// =============================================================================
// Props
// =============================================================================

interface TopBarProps {
  onOpenInquiry?: () => void;
}

// =============================================================================
// Component
// =============================================================================

const TopBar: React.FC<TopBarProps> = () => {

  // ---------------------------------------------------------------------------
  // WhatsApp dropdown state & outside-click handling
  // ---------------------------------------------------------------------------

  const [isWhatsappDropdownOpen, setIsWhatsappDropdownOpen] = useState(false);
  const whatsappDropdownRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Currency / Flag dropdown state & outside-click handling
  // ---------------------------------------------------------------------------

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  /** Pull the global currency state from context */
  const { selectedCurrency, setSelectedCurrency } = useGlobalCurrency();

  /** The currently active currency option object (for displaying flag + label) */
  const activeCurrencyOption: CurrencyOption =
    CURRENCY_OPTIONS.find((option) => option.mode === selectedCurrency) ?? CURRENCY_OPTIONS[0];

  // ---------------------------------------------------------------------------
  // WhatsApp Teams
  // ---------------------------------------------------------------------------

  const whatsappTeams = useMemo(
    () => [
      {
        icon: Plane,
        iconColor: "#ffffff",
        bgColor: "#2563eb",
        hoverBg: "#1d4ed8",
        label: "Air Ticketing Team",
        phone: "9779851420882",
        email: "dev.triphimalayatt@gmail.com",
        message: "Hi Air Ticketing Team, I need help with air ticket booking.",
      },
      {
        icon: Map,
        iconColor: "#ffffff",
        bgColor: "#7c3aed",
        hoverBg: "#6d28d9",
        label: "Tours & Holidays Team",
        phone: "9779851403761",
        email: "pradip.triphimalayatt@gmail.com",
        message: "Hi Tours & Holidays Team, I'd like to plan a tour/holiday package.",
      },
      {
        icon: Mountain,
        iconColor: "#ffffff",
        bgColor: "#059669",
        hoverBg: "#047857",
        label: "Trekking & Adventure Team",
        phone: "9779851403761",
        email: "pradip.triphimalayatt@gmail.com",
        message: "Hi Trekking & Adventure Team, I need help with trekking/adventure activities.",
      },
      {
        icon: Hotel,
        iconColor: "#ffffff",
        bgColor: "#d97706",
        hoverBg: "#b45309",
        label: "Hotel Booking Team",
        phone: "9779851403761",
        email: "pradip.triphimalayatt@gmail.com",
        message: "Hi Hotel Booking Team, I need help with hotel reservations.",
      },
      {
        icon: FileText,
        iconColor: "#ffffff",
        bgColor: "#dc2626",
        hoverBg: "#b91c1c",
        label: "Visa & Documentation Team",
        phone: "9779851420882",
        email: "dev.triphimalayatt@gmail.com",
        message: "Hi Visa & Documentation Team, I need help with visa application and documentation.",
      },
      {
        icon: Bus,
        iconColor: "#ffffff",
        bgColor: "#0891b2",
        hoverBg: "#0e7490",
        label: "Regular Route Team",
        phone: "9779851356882",
        email: "samarpan.triphimalayatt@gmail.com",
        message: "Hi Regular Route Team, I need help with regular route transport.",
      },
      {
        icon: Car,
        iconColor: "#ffffff",
        bgColor: "#7c3aed",
        hoverBg: "#6d28d9",
        label: "Vehicle Rental Team",
        phone: "9779851356882",
        email: "samarpan.triphimalayatt@gmail.com",
        message: "Hi Vehicle Rental Team, I need help with vehicle rental services.",
      },
      {
        icon: Shield,
        iconColor: "#ffffff",
        bgColor: "#0284c7",
        hoverBg: "#0369a1",
        label: "Travel Insurance Team",
        phone: "9779851403760",
        email: "pradip.triphimalayatt@gmail.com",
        message: "Hi Travel Insurance Team, I need help with travel insurance.",
      },
      {
        icon: HelicopterIcon,
        iconColor: "#ffffff",
        bgColor: "#db2777",
        hoverBg: "#be185d",
        label: "Heli Services Team",
        phone: "9779851420882",
        email: "dev.triphimalayatt@gmail.com",
        message: "Hi Heli Services Team, I need help with helicopter service booking.",
      },
      {
        icon: BadgeDollarSign,
        iconColor: "#ffffff",
        bgColor: "#16a34a",
        hoverBg: "#15803d",
        label: "Accounts & Billing Team",
        phone: "9779851403759",
        email: "actriphimalaya@gmail.com",
        message: "Hi Accounts & Billing Team, I need help with billing and payments.",
      },
    ],
    []
  );

  const buildWhatsAppLink = (phone: string, message: string): string =>
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // ---------------------------------------------------------------------------
  // Outside-click listeners to close dropdowns
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        whatsappDropdownRef.current &&
        !whatsappDropdownRef.current.contains(event.target as Node)
      ) {
        setIsWhatsappDropdownOpen(false);
      }
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCurrencyDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * Handles the user selecting a currency from the dropdown.
   * Updates the global currency context (which also persists to sessionStorage).
   */
  const handleCurrencySelection = (selectedOption: CurrencyOption): void => {
    setSelectedCurrency(selectedOption.mode);
    setIsCurrencyDropdownOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="w-full bg-white border-b border-gray-100/80 relative z-30">
      <div className="w-full pl-3 pr-2 sm:pr-4 lg:px-10">
        <div className="h-[30px] sm:h-[32px] flex items-center justify-end">

          {/* All contact, social, and currency controls — right-aligned */}
          <div className="flex items-center gap-2 sm:gap-3.5 lg:gap-4 text-[10px] sm:text-[11px] font-medium text-[#2D1347]">

            {/* ── Email Link ── */}
            <a
              href="mailto:triphimalayatt@gmail.com"
              className="hidden sm:flex items-center gap-1.5 hover:text-[#FF4FA3] transition-colors"
            >
              <Mail size={12} className="text-[#FF4FA3]" />
              <span>triphimalayatt@gmail.com</span>
            </a>

            {/* ── WhatsApp Dropdown (hidden on mobile, visible from sm up) ── */}
            <div ref={whatsappDropdownRef} className="hidden sm:block relative">
              <button
                type="button"
                onClick={() => setIsWhatsappDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors py-0.5 cursor-pointer font-medium"
                aria-expanded={isWhatsappDropdownOpen}
                aria-label="Open WhatsApp team selector"
              >
                <WhatsAppIcon size={14} className="text-[#25D366]" />
                <span>WhatsApp</span>
                <ChevronDown
                  size={9}
                  className={`transition-transform duration-200 ${isWhatsappDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isWhatsappDropdownOpen && (
                <div className="absolute right-0 sm:right-auto sm:left-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-2.5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/70 via-green-50/30 to-white sticky top-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <WhatsAppIcon size={14} className="text-[#25D366]" />
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                        Chat with our team
                      </p>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100/70 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                      10 Teams
                    </span>
                  </div>
                  {/* Scrollable list — 4 rows visible (~56px each), rest scrollable */}
                  <div
                    className="overflow-y-auto divide-y divide-gray-50"
                    style={{ maxHeight: "228px" }}
                  >
                    {whatsappTeams.map((team, index) => {
                      const IconComp = team.icon;
                      return (
                        <a
                          key={index}
                          href={buildWhatsAppLink(team.phone, team.message)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50/40 transition-colors"
                          onClick={() => setIsWhatsappDropdownOpen(false)}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105"
                            style={{ backgroundColor: team.bgColor }}
                          >
                            <IconComp size={15} color={team.iconColor} strokeWidth={2.5} />
                          </div>
                          <div className="min-w-0 flex-1 pr-1">
                            <p className="font-bold text-[11px] text-gray-800 truncate leading-tight group-hover:text-emerald-700 transition-colors">
                              {team.label}
                            </p>
                            <p className="text-[9.5px] text-gray-500 truncate mt-0.5 select-all">
                              {team.email}
                            </p>
                          </div>
                          <div className="ml-auto flex items-center gap-1 bg-emerald-50 group-hover:bg-[#25D366] text-emerald-700 group-hover:text-white border border-emerald-200/80 group-hover:border-[#25D366] px-2 py-0.5 rounded-full text-[9px] font-bold transition-all flex-shrink-0 shadow-xs">
                            <WhatsAppIcon size={10} className="text-[#25D366] group-hover:text-white transition-colors" />
                            <span>Chat</span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── Phone Links (Landline & Mobile) ── */}
            <div className="hidden sm:flex items-center gap-1.5 font-medium">
              <Phone size={12} className="text-[#FF4FA3]" />
              <a
                href="tel:01-5922697"
                className="hover:text-[#FF4FA3] transition-colors whitespace-nowrap"
                title="Landline"
              >
                <span>Tel: 01-5922697</span>
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="tel:+977-9851420882"
                className="hover:text-[#FF4FA3] transition-colors whitespace-nowrap"
                title="Mobile Phone"
              >
                <span>Phone: +977-9851420882</span>
              </a>
            </div>

            {/* ── Subtle Divider ── */}
            <span className="hidden sm:block h-3 w-px bg-gray-200 mx-0.5" />

            {/* ── Social Icons ── */}
            <div className="flex items-center gap-2 text-[#64748B]">
              <a
                href="https://www.facebook.com/profile.php?id=61567928307209"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="hover:text-[#1877F2] transition-colors"
              >
                <Facebook size={12.5} />
              </a>
              <a
                href="https://www.instagram.com/triphimalayatt"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-[#FF4FA3] transition-colors"
              >
                <Instagram size={12.5} />
              </a>
              <a
                href="https://www.tiktok.com/@trip.himalaya"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="hover:text-black transition-colors"
              >
                <TikTokIcon size={12.5} />
              </a>
              <a
                href="https://www.youtube.com/@triphimalaya"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="hover:text-[#FF0000] transition-colors"
              >
                <Youtube size={13.5} />
              </a>
              <a
                href="https://www.linkedin.com/company/trip-himalaya-tours-and-travels/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin size={12.5} />
              </a>
            </div>

            {/* ── Subtle Divider before Flag Selector ── */}
            <span className="hidden sm:block h-3 w-px bg-gray-200 mx-0.5" />

            {/* ── Currency / Flag Selector Dropdown ── */}
            <div ref={currencyDropdownRef} className="relative">

              {/* Trigger Button: shows current country flag + short label + chevron */}
              <button
                type="button"
                onClick={() => setIsCurrencyDropdownOpen((prev) => !prev)}
                aria-expanded={isCurrencyDropdownOpen}
                aria-label="Select currency"
                className="flex items-center gap-1.5 py-0.5 px-1.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
              >
                <ReactCountryFlag
                  svg
                  countryCode={activeCurrencyOption.countryCode}
                  style={{ width: "1.25em", height: "1.25em", borderRadius: "2px" }}
                  aria-label={activeCurrencyOption.label}
                />
                <span className="text-[10px] font-bold text-[#2D1347] tracking-wider">
                  {activeCurrencyOption.shortLabel}
                </span>
                <ChevronDown
                  size={9}
                  className={`text-gray-400 transition-transform duration-200 ${isCurrencyDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Panel: lists all currency options */}
              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-1.5">

                  {/* Dropdown header label */}
                  <div className="px-4 py-1.5 border-b border-gray-100 mb-1">
                    <p className="text-[10px] uppercase tracking-wider font-black text-gray-400">
                      Select Currency
                    </p>
                  </div>

                  {/* Currency option rows */}
                  {CURRENCY_OPTIONS.map((option) => {
                    const isCurrentlySelected = option.mode === selectedCurrency;

                    return (
                      <button
                        key={option.mode}
                        type="button"
                        onClick={() => handleCurrencySelection(option)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                          isCurrentlySelected
                            ? "bg-purple-50 text-[#2D1347]"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                        aria-selected={isCurrentlySelected}
                      >
                        {/* SVG Flag */}
                        <div className="flex-shrink-0 flex items-center justify-center">
                          <ReactCountryFlag
                            svg
                            countryCode={option.countryCode}
                            style={{ width: "1.6em", height: "1.6em", borderRadius: "3px" }}
                            aria-label={option.label}
                          />
                        </div>

                        {/* Currency name and symbol */}
                        <div className="flex-1">
                          <p className={`text-xs font-bold ${isCurrentlySelected ? "text-[#2D1347]" : "text-gray-800"}`}>
                            {option.label}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            Symbol: {option.currencySymbol}
                          </p>
                        </div>

                        {/* Active check indicator */}
                        {isCurrentlySelected && (
                          <span className="w-2 h-2 rounded-full bg-[#E91E63] flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
