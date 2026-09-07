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
  MessageCircle,
  ChevronDown,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useGlobalCurrency, type CurrencyMode } from "../context/CurrencyContext";

// =============================================================================
// Currency / Flag Options
// =============================================================================

interface CurrencyOption {
  mode: CurrencyMode;
  flagEmoji: string;       // Unicode flag emoji for visual display
  label: string;           // Full country + currency label shown in dropdown
  shortLabel: string;      // Short label shown in the trigger button
  currencySymbol: string;  // Symbol like "Rs." or "$"
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    mode: "nepali",
    flagEmoji: "🇳🇵",
    label: "Nepali Rupee (NPR)",
    shortLabel: "NPR",
    currencySymbol: "Rs.",
  },
  {
    mode: "foreigner",
    flagEmoji: "🇺🇸",
    label: "US Dollar (USD)",
    shortLabel: "USD",
    currencySymbol: "$",
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
        label: "Marketing Team",
        phone: "9779800000001",
        status: "Available",
        message: "Hi Marketing Team, I''d like to know about your latest offers/packages.",
      },
      {
        label: "Ticketing Team",
        phone: "9779800000002",
        status: "Available",
        message: "Hi Ticketing Team, I need help with flight tickets and pricing.",
      },
      {
        label: "Travel Team",
        phone: "9779800000003",
        status: "Available",
        message: "Hi Travel Team, I want to plan a trip. Please guide me.",
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
              href="mailto:info@triphimalaya.com.np"
              className="hidden sm:flex items-center gap-1.5 hover:text-[#FF4FA3] transition-colors"
            >
              <Mail size={12} className="text-[#FF4FA3]" />
              <span>info@triphimalaya.com.np</span>
            </a>

            {/* ── WhatsApp Dropdown (hidden on mobile, visible from sm up) ── */}
            <div ref={whatsappDropdownRef} className="hidden sm:block relative">
              <button
                type="button"
                onClick={() => setIsWhatsappDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors py-0.5 cursor-pointer font-medium"
                aria-expanded={isWhatsappDropdownOpen}
                aria-label="Open WhatsApp team selector"
              >
                <MessageCircle size={12} className="text-green-500" />
                <span>WhatsApp</span>
                <ChevronDown
                  size={9}
                  className={`transition-transform duration-200 ${isWhatsappDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isWhatsappDropdownOpen && (
                <div className="absolute right-0 sm:right-auto sm:left-0 top-full mt-2 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-2">
                  <div className="px-4 py-1.5 border-b border-gray-100">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                      Chat with our team
                    </p>
                  </div>
                  {whatsappTeams.map((team, index) => (
                    <a
                      key={index}
                      href={buildWhatsAppLink(team.phone, team.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors group"
                      onClick={() => setIsWhatsappDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors flex items-center justify-center flex-shrink-0">
                        <MessageCircle size={15} />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-gray-800">{team.label}</p>
                        <p className="text-[10px] text-green-600 font-semibold">{team.status}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* ── Phone Link ── */}
            <a
              href="tel:+9779800000000"
              className="hidden sm:flex items-center gap-1 hover:text-[#FF4FA3] transition-colors"
            >
              <Phone size={12} className="text-[#FF4FA3]" />
              <span className="whitespace-nowrap font-medium">+977 980 0000000</span>
            </a>

            {/* ── Subtle Divider ── */}
            <span className="hidden sm:block h-3 w-px bg-gray-200 mx-0.5" />

            {/* ── Social Icons ── */}
            <div className="flex items-center gap-2 text-[#64748B]">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#2D1347] transition-colors">
                <Facebook size={12.5} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#FF4FA3] transition-colors">
                <Instagram size={12.5} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-sky-500 transition-colors">
                <Twitter size={12.5} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors">
                <Linkedin size={12.5} />
              </a>
            </div>

            {/* ── Subtle Divider before Flag Selector ── */}
            <span className="hidden sm:block h-3 w-px bg-gray-200 mx-0.5" />

            {/* ── Currency / Flag Selector Dropdown ── */}
            <div ref={currencyDropdownRef} className="relative">

              {/* Trigger Button: shows current flag emoji + short label + chevron */}
              <button
                type="button"
                onClick={() => setIsCurrencyDropdownOpen((prev) => !prev)}
                aria-expanded={isCurrencyDropdownOpen}
                aria-label="Select currency"
                className="flex items-center gap-1 py-0.5 px-1.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
              >
                <span className="text-xs leading-none">{activeCurrencyOption.flagEmoji}</span>
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
                        {/* Flag emoji */}
                        <span className="text-2xl leading-none">{option.flagEmoji}</span>

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
