import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  Menu,
  X,
  User,
  LogIn,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

import logo from "../Layout/thtt.png";

interface HeaderProps {
  onOpenInquiry: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenInquiry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWhatsAppDropdownOpen, setIsWhatsAppDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const profileWrapRef = useRef<HTMLDivElement | null>(null);
  const whatsappWrapRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const username = "Username";

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileWrapRef.current && !profileWrapRef.current.contains(target)) setProfileOpen(false);
      if (whatsappWrapRef.current && !whatsappWrapRef.current.contains(target)) setIsWhatsAppDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setIsOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setIsOpen(false); setIsWhatsAppDropdownOpen(false); setProfileOpen(false); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Packages", path: "/tour-packages" },
    { name: "Blog", path: "/blog" },
    { name: "Gallery", path: "/gallery" },
    { name: "Travel Guide", path: "/travel-guide" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const whatsappTeams = useMemo(
    () => [
      { label: "Marketing", phone: "9779800000001", message: "Hi Marketing Team, I'd like to know about your latest offers/packages." },
      { label: "Ticketing", phone: "9779800000002", message: "Hi Ticketing Team, I need help with flight tickets and pricing." },
      { label: "Travel", phone: "9779800000003", message: "Hi Travelling Team, I want to plan a trip. Please guide me." },
    ],
    []
  );

  const buildWaLink = (phone: string, message: string) =>
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <header ref={headerRef} className="w-full relative z-[300] isolate overflow-x-clip">
      <div className="relative">

        {/* ── LOGO CARD (desktop/tablet) ──
            White teardrop/oval shape anchored to the left, overlapping both
            the top bar and the navbar, matching the screenshot. */}
        <div
          className="hidden md:flex absolute left-0 top-0 z-[150] items-center justify-center"
          style={{
            width: 200,
            /* Tall enough to cover both the top bar (56px) and navbar (74px) = 130px */
            height: 130,
            background: "white",
            borderRadius: "0 70px 70px 0",
            boxShadow: "3px 0 18px rgba(0,0,0,0.12)",
          }}
        >
          <Link to="/" className="w-full h-full flex items-center justify-center px-5 py-3">
            <img src={logo} alt="Trip Himalaya" className="w-full h-full object-contain" />
          </Link>
        </div>

        {/* ── MOBILE HEADER BAR ── (unchanged) */}
        <div className="md:hidden bg-white border-b border-slate-200 relative z-[160]">
          <div className="px-4">
            <div className="h-[72px] flex items-center justify-between gap-3">
              <Link to="/" className="flex items-center gap-3 min-w-0">
                <img src={logo} alt="Tours & Travels" className="h-12 w-auto shrink-0 object-contain" />
                <div className="min-w-0">
                  <p className="text-sm font-black text-[#2D1347] leading-tight truncate">Tours & Travels</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Travel Company</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenInquiry}
                  className="hidden xs:inline-flex bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] text-white px-3 py-2 rounded-full text-[11px] font-semibold shadow-md"
                >
                  Quote
                </button>
                <button
                  className="text-[#2D1347] p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  onClick={() => setIsOpen(s => !s)}
                  aria-label="Toggle menu"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── DESKTOP TOP BAR ── (unchanged, just left-padding to clear logo card) */}
        <div className="hidden md:block bg-white relative z-[130] overflow-x-clip">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="h-14 flex items-center justify-end" style={{ paddingLeft: 210 }}>
              <div className="flex items-center gap-4 md:gap-6 text-[11px] font-semibold tracking-wide text-[#2D1347]">
                <a href="mailto:info@triphimalaya.com.np" className="flex items-center gap-2 hover:text-[#FF4FA3] transition-colors">
                  <Mail size={14} className="text-[#FF4FA3]" />
                  <span className="hidden lg:inline">info@triphimalaya.com.np</span>
                  <span className="lg:hidden">Email</span>
                </a>

                <div
                  ref={whatsappWrapRef}
                  className="relative"
                  onMouseEnter={() => setIsWhatsAppDropdownOpen(true)}
                  onMouseLeave={() => setIsWhatsAppDropdownOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-2 hover:text-[#FF4FA3] transition-colors py-1"
                    onClick={() => setIsWhatsAppDropdownOpen(s => !s)}
                    aria-haspopup="menu"
                    aria-expanded={isWhatsAppDropdownOpen}
                  >
                    <MessageCircle size={14} className="text-green-600" />
                    <span>WhatsApp</span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${isWhatsAppDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isWhatsAppDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.16)] z-[999999] border border-slate-100 overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-500 tracking-wide">Chat with our team</span>
                      </div>
                      {whatsappTeams.map(t => (
                        <a
                          key={t.label}
                          href={buildWaLink(t.phone, t.message)}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full px-4 py-3 hover:bg-[#5D2A8E]/5 flex items-center gap-3 border-b border-slate-50 last:border-b-0 transition-colors group"
                          onClick={() => setIsWhatsAppDropdownOpen(false)}
                        >
                          <div className="bg-green-100 p-2 rounded-lg text-green-700 group-hover:bg-green-600 group-hover:text-white transition-all">
                            <MessageCircle size={16} />
                          </div>
                          <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-slate-800 text-xs">{t.label} Team</span>
                            <span className="text-[11px] text-slate-500">Available</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <a href="tel:+9779800000000" className="hidden md:flex items-center gap-2 hover:text-[#FF4FA3] transition-colors">
                  <Phone size={14} className="text-[#FF4FA3]" />
                  <span>+977 980 0000000</span>
                </a>

                <span className="hidden lg:block h-5 w-px bg-slate-300/70 mx-1" />

                <div className="hidden lg:flex items-center gap-2 text-slate-500">
                  {[{ Icon: Facebook, l: "Facebook" }, { Icon: Instagram, l: "Instagram" }, { Icon: Twitter, l: "Twitter" }, { Icon: Linkedin, l: "LinkedIn" }].map(({ Icon, l }) => (
                    <a key={l} href="#" aria-label={l} className="p-2 rounded-lg hover:bg-[#D92671]/10 hover:text-[#D92671] transition-colors">
                      <Icon size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── DESKTOP NAVBAR ── */}
        <div className="hidden md:block bg-gradient-to-r from-[#2D1347] via-[#4A1676] to-[#2D1347] border-b border-white/10 relative z-[20] overflow-x-clip">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <div className="h-[74px] flex items-center justify-end" style={{ paddingLeft: 210 }}>
              <div className="hidden lg:flex items-center gap-6 xl:gap-10">
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={[
                      "flex items-center gap-1.5 text-[13px] font-semibold tracking-wide transition-colors",
                      isActive(link.path) ? "text-[#FF4FA3]" : "text-white/90 hover:text-[#FF4FA3]",
                    ].join(" ")}
                  >
                    {link.name}
                  </Link>
                ))}

                <button
                  onClick={onOpenInquiry}
                  className="shrink-0 whitespace-nowrap bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] text-white px-5 py-2.5 rounded-full text-[12px] font-semibold tracking-wide inline-flex items-center gap-2 hover:brightness-110 transition-all hover:scale-[1.02] shadow-lg"
                >
                  <MessageCircle size={16} />
                  <span>Get Quote</span>
                </button>

                {/* Profile icon — unchanged */}
                <div ref={profileWrapRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setProfileOpen(s => !s)}
                    className="relative w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white inline-flex items-center justify-center hover:bg-white/15 hover:border-white/40 transition-all active:scale-95"
                    aria-label="Open profile"
                    aria-expanded={profileOpen}
                  >
                    <User size={18} />
                  </button>

                  {/* Welcome pill — slides out to the right, unchanged */}
                  <div
                    className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 transition-all duration-300 ease-out ${
                      profileOpen
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 translate-x-4 pointer-events-none"
                    }`}
                  >
                    <div className="bg-white text-[#2D1347] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-slate-100 px-4 py-2.5 min-w-[200px] flex items-center gap-1 whitespace-nowrap">
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Welcome</span>
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="text-[12px] font-black text-[#D92671] hover:underline">
                        {username}
                      </Link>
                      <span className="ml-auto text-[10px] font-black text-slate-400 uppercase tracking-widest">→</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tablet hamburger */}
              <button
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors ml-auto"
                onClick={() => setIsOpen(s => !s)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Tablet dropdown nav (unchanged) */}
            {isOpen && (
              <div className="lg:hidden pb-4 border-t border-white/10" style={{ paddingLeft: 10 }}>
                <div className="space-y-1.5 mt-3">
                  {navLinks.map(link => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={["block px-4 py-3 rounded-xl text-[14px] font-semibold tracking-wide",
                        isActive(link.path) ? "text-[#FF4FA3] bg-white/5" : "text-white/90 hover:bg-white/5 hover:text-white"].join(" ")}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-2 flex flex-col gap-2 px-2">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="w-full px-4 py-3 rounded-2xl text-[14px] font-semibold tracking-wide text-white/95 border border-white/20 hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2">
                      <LogIn size={18} /> Login
                    </Link>
                    <button onClick={() => { setIsOpen(false); onOpenInquiry(); }} className="w-full whitespace-nowrap bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] text-white px-4 py-3 rounded-2xl text-[14px] font-semibold tracking-wide inline-flex items-center justify-center gap-2 shadow-lg">
                      <MessageCircle size={18} /> <span>Get Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── MOBILE NAV DRAWER ── (unchanged) */}
        {isOpen && (
          <div className="md:hidden bg-gradient-to-r from-[#2D1347] via-[#4A1676] to-[#2D1347] border-b border-white/10 relative z-[55]">
            <div className="px-4 py-4">
              <div className="space-y-1.5">
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={["block px-4 py-3 rounded-xl text-[14px] font-semibold tracking-wide",
                      isActive(link.path) ? "text-[#FF4FA3] bg-white/5" : "text-white/90 hover:bg-white/5 hover:text-white"].join(" ")}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="pt-4 flex flex-col gap-2">
                <a href="mailto:info@triphimalaya.com.np" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white/90">
                  <Mail size={16} className="text-[#FF4FA3]" />
                  <span className="text-sm">info@triphimalaya.com.np</span>
                </a>
                <a href="tel:+9779800000000" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white/90">
                  <Phone size={16} className="text-[#FF4FA3]" />
                  <span className="text-sm">+977 980 0000000</span>
                </a>
              </div>
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full px-4 py-3 rounded-2xl text-[14px] font-semibold tracking-wide text-white/95 border border-white/20 hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2">
                  <LogIn size={18} /> Login
                </Link>
                <button onClick={() => { setIsOpen(false); onOpenInquiry(); }} className="w-full whitespace-nowrap bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] text-white px-4 py-3 rounded-2xl text-[14px] font-semibold tracking-wide inline-flex items-center justify-center gap-2 shadow-lg">
                  <MessageCircle size={18} /> <span>Get Quote</span>
                </button>
              </div>
              <div className="pt-4 flex items-center gap-2">
                {[{ Icon: Facebook, l: "Facebook" }, { Icon: Instagram, l: "Instagram" }, { Icon: Twitter, l: "Twitter" }, { Icon: Linkedin, l: "LinkedIn" }].map(({ Icon, l }) => (
                  <a key={l} href="#" aria-label={l} className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;