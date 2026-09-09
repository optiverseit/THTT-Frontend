import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  LogIn,
  Menu,
  X,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

interface NavBarProps {
  onOpenInquiry?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onOpenInquiry }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <nav className="w-full bg-gradient-to-r from-[#2D1347] via-[#3B145C] to-[#2D1347] border-b border-white/10 text-white relative z-20">
      <div className="w-full pl-3 pr-2 sm:pr-4 lg:px-10">
        <div className="h-[48px] sm:h-[52px] flex items-center justify-between pl-[114px] sm:pl-[155px] md:pl-[168px] lg:pl-[178px]">
          
          {/* Mobile view brand — placeholder to maintain justify-between spacing */}
          <div className="md:hidden flex items-center">
            <span className="sr-only">Menu</span>
          </div>

          {/* Desktop Centered Navigation: Links + Action Buttons */}
          <div className="hidden lg:flex items-center justify-center gap-7 xl:gap-10 2xl:gap-12 flex-1 font-semibold text-[13px] xl:text-[13.5px] tracking-normal px-2">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`transition-colors whitespace-nowrap py-0.5 ${
                  isActive(item.path)
                    ? "text-[#FF4FA3] font-bold"
                    : "text-white/90 hover:text-[#FF4FA3]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Desktop Action Buttons: Get Quote & Login */}
            <div className="flex items-center gap-5 xl:gap-6 flex-shrink-0">
              {/* Get Quote Pill */}
              <button
                onClick={handleGetQuote}
                className="bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] hover:brightness-110 active:scale-95 text-white font-semibold text-[11px] sm:text-[11.5px] rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 shadow-md shadow-pink-900/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <MessageCircle size={13.5} />
                <span>Get Quote</span>
              </button>

              {/* Login Pill with Icon */}
              <button
                onClick={() => navigate("/login")}
                className="bg-white/10 hover:bg-white/20 border border-white/25 active:scale-95 text-white font-medium text-[11px] sm:text-[11.5px] rounded-full px-3 sm:px-3.5 py-1.5 sm:py-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm"
              >
                <LogIn size={13.5} />
                <span>Login</span>
              </button>
            </div>
          </div>

          {/* Tablet Action Buttons: Get Quote & Login (md only, hidden on lg) */}
          <div className="hidden md:flex lg:hidden items-center gap-2.5 flex-shrink-0 ml-auto">
            {/* Get Quote Pill */}
            <button
              onClick={handleGetQuote}
              className="bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] hover:brightness-110 active:scale-95 text-white font-semibold text-[11px] sm:text-[11.5px] rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 shadow-md shadow-pink-900/25 transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageCircle size={13.5} />
              <span>Get Quote</span>
            </button>

            {/* Login Pill with Icon */}
            <button
              onClick={() => navigate("/login")}
              className="bg-white/10 hover:bg-white/20 border border-white/25 active:scale-95 text-white font-medium text-[11px] sm:text-[11.5px] rounded-full px-3 sm:px-3.5 py-1.5 sm:py-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm"
            >
              <LogIn size={13.5} />
              <span>Login</span>
            </button>
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
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(item.path)
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
            <button
              onClick={() => {
                navigate("/login");
                setMobileOpen(false);
              }}
              className="w-full bg-white/10 border border-white/20 text-white font-semibold text-sm rounded-2xl py-2.5 flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              <span>Login to Account</span>
            </button>

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
            <a href="mailto:info@triphimalaya.com.np" className="flex items-center gap-2 hover:text-[#FF4FA3]">
              <Mail size={14} className="text-[#FF4FA3]" />
              <span>info@triphimalaya.com.np</span>
            </a>
            <a href="tel:+9779800000000" className="flex items-center gap-2 hover:text-[#FF4FA3]">
              <Phone size={14} className="text-[#FF4FA3]" />
              <span>+977 980 0000000</span>
            </a>
          </div>

          {/* Socials */}
          <div className="pt-2 flex items-center gap-4 text-gray-300">
            <Facebook size={16} className="cursor-pointer hover:text-blue-400" />
            <Instagram size={16} className="cursor-pointer hover:text-pink-400" />
            <Twitter size={16} className="cursor-pointer hover:text-sky-400" />
            <Linkedin size={16} className="cursor-pointer hover:text-blue-400" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
