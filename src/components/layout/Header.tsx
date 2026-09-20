import React, { useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "./TopBar";
import NavBar from "./NavBar";
import ServicesStrip from "./ServicesStrip";
import GetQuoteModal from "./GetQuoteModal";
import Logo from "../../assets/images/Logo.png";

const Header: React.FC = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <header className="print:hidden w-full relative z-[300] isolate">
        <div className="relative">

          {/* -- RESPONSIVE OVAL LOGO CARD -- */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="Trip Himalaya - Go to Home"
            aria-label="Trip Himalaya Home"
            className="
              absolute left-0 top-[30px] sm:top-[32px] z-[150] bg-white flex items-end justify-center cursor-pointer group
              w-[106px] h-[62px] rounded-r-[28px]
              sm:w-[145px] sm:h-[84px] sm:rounded-r-[38px]
              md:w-[155px] md:h-[86px] md:rounded-r-[39px]
              lg:w-[165px] lg:h-[88px] lg:rounded-r-[40px]
              pl-1 pr-3 pb-1.5
              sm:pl-2 sm:pr-4.5 sm:pb-2
              md:pl-2.5 md:pr-5 md:pb-2.5
              lg:pl-3 lg:pr-5.5 lg:pb-2.5
              transition-transform duration-200 hover:brightness-[1.02]
            "
            style={{
              boxShadow: "4px 8px 16px -4px rgba(0,0,0,0.12), 3px 4px 6px -2px rgba(0,0,0,0.06)",
            }}
          >
            <img
              src={Logo}
              alt="Trip Himalaya Tours & Travels Pvt. Ltd."
              className="
                h-[70px] sm:h-[97px] md:h-[105px] lg:h-[112px]
                translate-y-[2px] sm:translate-y-[4px] md:translate-y-[5px] lg:translate-y-[5px]
                w-auto object-contain shrink-0 max-w-none
                group-hover:scale-[1.03] transition-transform duration-200
              "
            />
          </Link>

          {/* -- TIER 1: TOP BAR -- */}
          <TopBar onOpenInquiry={() => setQuoteOpen(true)} />

          {/* -- TIER 2: MAIN NAVBAR -- */}
          <NavBar onOpenInquiry={() => setQuoteOpen(true)} />

          {/* -- TIER 3: SERVICES STRIP -- */}
          <div className="absolute left-0 top-[96px] sm:top-full w-full bg-transparent pt-0 sm:pt-1 pointer-events-auto z-10">
            <ServicesStrip />
          </div>

        </div>
      </header>

      {/* -- GET QUOTE MODAL -- */}
      <GetQuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
};

export default Header;
