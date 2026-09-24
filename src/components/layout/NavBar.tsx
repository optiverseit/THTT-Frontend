import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
import { TikTokIcon } from "./TopBar";
import { useAuth } from "../../context/AuthContext";

interface NavBarProps {
  onOpenInquiry?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onOpenInquiry }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoggedIn, user, logout } = useAuth();

  const displayName = (() => {
    if (user?.name && user.name !== "Traveler") return user.name;
    const name = localStorage.getItem("name") || "";
    if (name) return name;
    const firstName = localStorage.getItem("firstName") || "";
    const lastName = localStorage.getItem("lastName") || "";
    if (firstName || lastName) return `${firstName} ${lastName}`.trim();
    return user?.name || "Aniket Mandal";
  })();

  const userEmail = user?.email || localStorage.getItem("email") || "aniket@gmail.com";

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignOut = () => {
    logout();
    localStorage.clear();
    console.log("cleared log");
    setUserDropdownOpen(false);
    navigate("/login", { replace: true });

  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/service" },
    { name: "Packages", path: "/packages" },
    { name: "Blog", path: "/blog" },
    { name: "Gallery", path: "/gallery" },
    { name: "Travel Guide", path: "/travel-guide" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleGetQuote = () => {
    if (onOpenInquiry) {
      onOpenInquiry();
    } else {
      const msg = encodeURIComponent(
        "Hello Trip Himalaya! I would like to get a free quote for travel/trekking packages."
      );
      window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
    }
  };

  const renderUserButtonAndDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        id="navbar-user-menu-btn"
        onClick={() => setUserDropdownOpen((prev) => !prev)}
        className={`bg-white/10 hover:bg-white/20 border border-white/25 active:scale-95 text-white font-medium text-[11px] sm:text-[11.5px] rounded-full pl-1.5 pr-3 py-1 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-sm ${userDropdownOpen ? "ring-2 ring-[#FF4FA3]/50 bg-white/20" : ""
          }`}
        aria-expanded={userDropdownOpen}
        aria-haspopup="true"
        title={`Account: ${displayName}`}
      >
        {/* User icon inside circular badge */}
        <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF2A75] to-[#8B2CFF] flex items-center justify-center text-white shrink-0 shadow-xs">
          <User size={12} className="text-white" />
        </span>

        {/* User's Name */}
        <span className="font-semibold text-white max-w-[120px] sm:max-w-[150px] truncate">
          {displayName}
        </span>

        {/* Dropdown Chevron */}
        <ChevronDown
          size={12}
          className={`text-purple-200 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Crisp, Luxury White Dropdown Menu */}
      {userDropdownOpen && (
        <div
          id="navbar-user-dropdown"
          className="absolute right-[-100px] md:right-[-120px] lg:right-[-160px] top-[calc(100%+10px)] w-[272px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-slate-100 p-2 z-[999] animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Subtle upward pointer arrow */}
          <div className="absolute -top-1.5 left-10 md:left-10 lg:left-[42px] w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45" />

          {/* User Profile Header Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF2A75] to-[#8B2CFF] flex items-center justify-center text-white shrink-0 shadow-sm">
              <User size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-900 truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                {userEmail}
              </p>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Account
              </span>
            </div>
          </div>

          {/* Menu Actions */}
          <div className="p-1 mt-1 space-y-1">
            {/* Dashboard Option */}
            <button
              type="button"
              id="nav-dropdown-dashboard-btn"
              onClick={() => {
                navigate("/dashboard");
                setUserDropdownOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-purple-50/80 transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100/70 text-[#8B2CFF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <LayoutDashboard size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-800 group-hover:text-[#8B2CFF] transition-colors">
                  Dashboard
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  Manage bookings &amp; profile
                </p>
              </div>
              <ChevronRight
                size={13}
                className="text-slate-300 group-hover:text-[#8B2CFF] group-hover:translate-x-0.5 transition-all shrink-0"
              />
            </button>

            {/* Log Out Option */}
            <button
              type="button"
              id="nav-dropdown-logout-btn"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-red-50/80 transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100/70 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <LogOut size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-red-600 group-hover:text-red-700 transition-colors">
                  Log Out
                </p>
                <p className="text-[10px] text-red-400/80 font-medium">
                  Sign out of your session
                </p>
              </div>
              <ChevronRight
                size={13}
                className="text-red-200 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all shrink-0"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="w-full bg-gradient-to-r from-[#2D1347] via-[#3B145C] to-[#2D1347] border-b border-white/10 text-white relative z-20">
      <div className="w-full pl-3 pr-2 sm:pr-4 lg:px-10">
        <div className="h-[48px] sm:h-[52px] flex items-center justify-between pl-[114px] sm:pl-[155px] md:pl-[168px] lg:pl-[178px]">

          {/* Mobile view brand — placeholder to maintain justify-between spacing */}
          <div className="md:hidden flex items-center">
            <span className="sr-only">Menu</span>
          </div>

          {/* Desktop Centered Navigation: Links & Actions */}
          <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 2xl:gap-10 flex-1 font-semibold text-[13px] xl:text-[13.5px] tracking-normal px-2">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`transition-colors whitespace-nowrap py-0.5 ${isActive(item.path)
                  ? "text-[#FF4FA3] font-bold"
                  : "text-white/90 hover:text-[#FF4FA3]"
                  }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Action Buttons: Get Quote & User Profile / Login */}
            <div className="flex items-center gap-3.5 xl:gap-4 flex-shrink-0">
              {/* Get Quote Pill */}
              <button
                onClick={handleGetQuote}
                className="bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] hover:brightness-110 active:scale-95 text-white font-semibold text-[11px] sm:text-[11.5px] rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 shadow-md shadow-pink-900/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <MessageCircle size={13.5} />
                <span>Get Quote</span>
              </button>

              {/* User Dropdown when logged in, or Login Pill when logged out */}
              {isLoggedIn ? (
                renderUserButtonAndDropdown()
              ) : (
                <button
                  id="nav-login-btn-desktop"
                  onClick={() => navigate("/login")}
                  className="bg-white/10 hover:bg-white/20 border border-white/25 active:scale-95 text-white font-medium text-[11px] sm:text-[11.5px] rounded-full px-3 sm:px-3.5 py-1.5 sm:py-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm"
                >
                  <LogIn size={13.5} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Tablet Action Buttons: Get Quote & User Profile / Login (md only, hidden on lg) */}
          <div className="hidden md:flex lg:hidden items-center gap-2.5 flex-shrink-0 ml-auto">
            {/* Get Quote Pill */}
            <button
              onClick={handleGetQuote}
              className="bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] hover:brightness-110 active:scale-95 text-white font-semibold text-[11px] sm:text-[11.5px] rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 shadow-md shadow-pink-900/25 transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageCircle size={13.5} />
              <span>Get Quote</span>
            </button>

            {/* User Dropdown when logged in, or Login Pill when logged out */}
            {isLoggedIn ? (
              renderUserButtonAndDropdown()
            ) : (
              <button
                id="nav-login-btn-tablet"
                onClick={() => navigate("/login")}
                className="bg-white/10 hover:bg-white/20 border border-white/25 active:scale-95 text-white font-medium text-[11px] sm:text-[11.5px] rounded-full px-3 sm:px-3.5 py-1.5 sm:py-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm"
              >
                <LogIn size={13.5} />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Action buttons & Hamburger toggle */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={handleGetQuote}
              className="bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] text-white text-[10px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm"
            >
              <MessageCircle size={11} />
              <span>Quote</span>
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gradient-to-b from-[#2D1347] to-[#1E0B33] border-t border-purple-800/80 px-4 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
          {/* Links list */}
          <div className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive(item.path)
                  ? "bg-white/10 text-[#FF4FA3] font-bold"
                  : "text-white/90 hover:bg-white/5 hover:text-[#FF4FA3]"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions in mobile drawer */}
          <div className="pt-3 border-t border-white/10 space-y-2.5">

            {isLoggedIn ? (
              <div className="space-y-2">
                {/* User card in mobile drawer */}
                <div className="bg-white/10 rounded-2xl p-3 border border-white/15 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF2A75] to-[#8B2CFF] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <User size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-purple-200/70 truncate">{userEmail}</p>
                  </div>
                </div>

                {/* Dashboard button */}
                <button
                  type="button"
                  id="mobile-drawer-dashboard-btn"
                  onClick={() => {
                    navigate("/dashboard");
                    setMobileOpen(false);
                  }}
                  className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm rounded-2xl py-2.5 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <LayoutDashboard size={16} className="text-[#FF4FA3]" />
                  <span>Dashboard</span>
                </button>

                {/* Log Out button */}
                <button
                  type="button"
                  id="mobile-drawer-logout-btn"
                  onClick={() => {
                    handleSignOut();
                    setMobileOpen(false);
                  }}
                  className="w-full bg-red-500/15 hover:bg-red-500/25 border border-red-400/30 text-red-300 font-semibold text-sm rounded-2xl py-2.5 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="mobile-drawer-login-btn"
                onClick={() => {
                  navigate("/login");
                  setMobileOpen(false);
                }}
                className="w-full bg-white/10 border border-white/20 text-white font-semibold text-sm rounded-2xl py-2.5 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogIn size={16} />
                <span>Login to Account</span>
              </button>
            )}

            <button
              onClick={() => {
                handleGetQuote();
                setMobileOpen(false);
              }}
              className="w-full bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] text-white font-bold text-sm rounded-2xl py-3 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <MessageCircle size={16} />
              <span>Get Free Quote</span>
            </button>
          </div>

          {/* Contacts in mobile drawer */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 text-xs text-white/80">
            <a href="mailto:triphimalayatt@gmail.com" className="flex items-center gap-2 hover:text-[#FF4FA3]">
              <Mail size={14} className="text-[#FF4FA3]" />
              <span>triphimalayatt@gmail.com</span>
            </a>
            <div className="flex items-center gap-2 flex-wrap">
              <Phone size={14} className="text-[#FF4FA3]" />
              <a href="tel:01-5922697" className="hover:text-[#FF4FA3]">Tel: 01-5922697</a>
              <span className="text-white/40">|</span>
              <a href="tel:+977-9851420882" className="hover:text-[#FF4FA3]">Phone: +977-9851420882</a>
            </div>
          </div>

          {/* Socials */}
          <div className="pt-2 flex items-center gap-4 text-gray-300">
            <a href="https://www.facebook.com/profile.php?id=61567928307209" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-blue-400">
              <Facebook size={16} />
            </a>
            <a href="https://www.instagram.com/triphimalayatt" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-pink-400">
              <Instagram size={16} />
            </a>
            <a href="https://www.tiktok.com/@trip.himalaya" target="_blank" rel="noreferrer" aria-label="TikTok" className="hover:text-white">
              <TikTokIcon size={16} />
            </a>
            <a href="https://www.youtube.com/@triphimalaya" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-red-500">
              <Youtube size={17} />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-blue-400">
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
