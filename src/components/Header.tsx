import React from "react";
import { Link } from "react-router-dom";
import TopBar from "./TopBar";
import NavBar from "./NavBar";
import ServicesStrip from "./Home/ServicesStrip";
import Logo from "../assets/images/Logo.png";

interface HeaderProps {
  onOpenInquiry?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenInquiry }) => {
  return (
    <header className="w-full relative z-[300] isolate">
      <div className="relative">

        {/* ── RESPONSIVE OVAL LOGO CARD ──
            Covers Nav 1 (TopBar, full), Nav 2 (NavBar, full), and Nav 3 (ServicesStrip, half)
            across all screen sizes with consistent elongated oval geometry (radius = height / 2).
            - base (< 640px): 175px × 138px (radius 69px)
            - sm (640px - 767px): 200px × 142px (radius 71px)
            - md (768px - 1023px): 220px × 142px (radius 71px)
            - lg (1024px+): 245px × 138px (radius 69px)
        */}
        {/* ── RESPONSIVE OVAL LOGO CARD (Clickable Link to Home) ── */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Trip Himalaya - Go to Home"
          aria-label="Trip Himalaya Home"
          className="
            absolute left-0 top-0 z-[150] bg-white flex items-center justify-center cursor-pointer group
            w-[175px] h-[138px] rounded-r-[69px]
            sm:w-[200px] sm:h-[142px] sm:rounded-r-[71px]
            md:w-[220px] md:h-[142px] md:rounded-r-[71px]
            lg:w-[245px] lg:h-[138px] lg:rounded-r-[69px]
            pl-2 pr-9 py-1
            sm:pl-3 sm:pr-10 sm:py-1.5
            md:pl-3 md:pr-11 md:py-1.5
            lg:pl-3 lg:pr-12 lg:py-1.5
            transition-transform duration-200 hover:brightness-[1.02]
          "
          style={{ boxShadow: "4px 0 25px rgba(0,0,0,0.12)" }}
        >
          <img
            src={Logo}
            alt="Trip Himalaya Tours & Travels Pvt. Ltd."
            className="
              max-h-[102px] w-auto object-contain
              sm:max-h-[110px]
              md:max-h-[114px]
              lg:max-h-[122px]
              group-hover:scale-[1.03] transition-transform duration-200
            "
          />
        </Link>

        {/* ── TIER 1: TOP BAR ── */}
        <TopBar onOpenInquiry={onOpenInquiry} />

        {/* ── TIER 2: MAIN NAVBAR ── */}
        <NavBar onOpenInquiry={onOpenInquiry} />

        {/* ── TIER 3: SERVICES STRIP (Absolute Floating Overlay) ── */}
        <div className="absolute left-0 top-full w-full bg-transparent pt-1 sm:pt-2 pointer-events-auto z-10">
          <ServicesStrip />
        </div>

      </div>
    </header>
  );
};

export default Header;
