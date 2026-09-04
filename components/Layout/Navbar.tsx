// Navbar.tsx ✅ purple navbar, bigger left logo panel & bigger image that fills it
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

import logo from "../Layout/thtt.png";

interface NavbarProps {
  onOpenInquiry: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenInquiry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"air" | "tours" | null>(
    null
  );
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services", isServices: true },
    { name: "Tour Packages", path: "/tour-packages" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={[
          "w-full transition-all duration-500 z-[1200] relative overflow-hidden",
          "border-b border-white/10",
          isScrolled
            ? "fixed top-0 bg-[#2D1347]/95 backdrop-blur-xl shadow-2xl"
            : "bg-gradient-to-r from-[#2D1347] via-[#4A1676] to-[#2D1347]",
        ].join(" ")}
      >
        {/* BIGGER LEFT LOGO PANEL */}
        <div
          className={[
            "absolute left-0 top-0 h-full",
            "w-[300px] md:w-[360px] lg:w-[420px]", // enlarged panel
            "bg-white",
            "rounded-r-[28px] md:rounded-r-[36px]",
            "shadow-[0_18px_50px_rgba(0,0,0,0.30)] ring-1 ring-black/5",
            "flex items-center",
            "z-[1300]",
          ].join(" ")}
        >
          <a href="#/" className="w-full h-full px-6 md:px-8 flex items-center">
            <img
              src={logo}
              alt="Trip Himalaya Tours & Travels"
              // image enlarged to fill the panel height better
              className="h-[80%] w-full object-contain"
            />
          </a>
        </div>

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div
            className={[
              "flex justify-between items-center",
              "py-3 md:py-4",
              "pl-[310px] md:pl-[370px] lg:pl-[430px]", // matches bigger panel
            ].join(" ")}
          >
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative group h-full py-2"
                  onMouseEnter={() => link.isServices && setActiveCategory(null)}
                >
                  <a
                    href={`#${link.path}`}
                    className={[
                      "flex items-center space-x-1.5 font-black text-[13px] tracking-wide transition-colors",
                      isActive(link.path)
                        ? "text-[#FF4FA3]"
                        : "text-white/90 hover:text-[#FF4FA3]",
                    ].join(" ")}
                  >
                    <span>{link.name.toUpperCase()}</span>
                    {link.isServices && (
                      <ChevronDown
                        size={14}
                        className="group-hover:rotate-180 transition-transform"
                      />
                    )}
                  </a>

                  {link.isServices && (
                    <div className="absolute left-0 mt-4 w-[480px] bg-white shadow-[0_30px_70px_rgba(0,0,0,0.25)] rounded-3xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1400] border border-slate-100 flex">
                      <div className="w-1/2 border-r border-slate-50 p-2 bg-slate-50/40">
                        <div className="px-4 py-3 mb-1">
                          <span className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">
                            Categories
                          </span>
                        </div>

                        <button
                          onMouseEnter={() => setActiveCategory("air")}
                          className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                            activeCategory === "air"
                              ? "bg-[#4A1676] text-white shadow-lg"
                              : "text-slate-700 hover:bg-white"
                          }`}
                        >
                          <span className="text-xs font-black uppercase tracking-tight">
                            Air Ticket
                          </span>
                          <ChevronRight size={14} />
                        </button>

                        <button
                          onMouseEnter={() => setActiveCategory("tours")}
                          className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl mt-1 transition-all ${
                            activeCategory === "tours"
                              ? "bg-[#4A1676] text-white shadow-lg"
                              : "text-slate-700 hover:bg-white"
                          }`}
                        >
                          <span className="text-xs font-black uppercase tracking-tight">
                            Tours
                          </span>
                          <ChevronRight size={14} />
                        </button>

                        <a
                          href="#/services"
                          className="w-full flex items-center justify-between px-4 py-4 rounded-2xl mt-4 text-[#FF4FA3] hover:bg-[#FF4FA3]/5 transition-all"
                        >
                          <span className="text-xs font-black uppercase tracking-tight">
                            All Services
                          </span>
                          <ArrowRight size={14} />
                        </a>
                      </div>

                      <div className="w-1/2 p-5 bg-white">
                        {!activeCategory && (
                          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <MessageCircle
                              size={32}
                              className="mb-2 text-slate-300"
                            />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-tight">
                              Hover category <br />
                              to explore
                            </p>
                          </div>
                        )}

                        {activeCategory === "air" && (
                          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                            <h4 className="text-[10px] font-black text-[#FF4FA3] uppercase tracking-[0.2em] mb-4">
                              Air Ticketing
                            </h4>
                            <div className="space-y-2">
                              {[
                                "Domestic Air Ticket",
                                "International Air Ticket",
                              ].map((sub) => (
                                <a
                                  key={sub}
                                  href="#/services/air-ticket"
                                  className="block p-3 rounded-xl bg-slate-50 text-[11px] font-extrabold text-slate-700 hover:bg-[#FF4FA3]/5 hover:text-[#FF4FA3] transition-all uppercase"
                                >
                                  {sub}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {activeCategory === "tours" && (
                          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                            <h4 className="text-[10px] font-black text-[#FF4FA3] uppercase tracking-[0.2em] mb-4">
                              Tour Packages
                            </h4>
                            <div className="space-y-2">
                              {["Domestic Tours", "International Tours"].map(
                                (sub) => (
                                  <a
                                    key={sub}
                                    href="#/services/tours"
                                    className="block p-3 rounded-xl bg-slate-50 text-[11px] font-extrabold text-slate-700 hover:bg-[#FF4FA3]/5 hover:text-[#FF4FA3] transition-all uppercase"
                                  >
                                    {sub}
                                  </a>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={onOpenInquiry}
                className="bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] text-white px-7 py-3 rounded-full text-xs font-black tracking-widest flex items-center space-x-3 hover:brightness-110 transition-all transform hover:scale-105 shadow-xl"
              >
                <MessageCircle size={18} />
                <span>GET A QUOTE</span>
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="lg:hidden border-t border-white/10 pb-4">
              <div className="space-y-2 pl-[310px] md:pl-[370px]">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={`#${link.path}`}
                    className={`block px-4 py-3 font-black text-sm tracking-wide ${
                      isActive(link.path) ? "text-[#FF4FA3]" : "text-white/90"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name.toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {isScrolled && <div className="h-[78px] md:h-[86px]"></div>}
    </>
  );
};


export default Navbar;
