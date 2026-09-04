// TopBar.tsx ✅ Uses the SAME left logo panel style from Navbar (white slab, rounded only on right)
// ✅ Topbar is white
// ✅ All topbar content is on the RIGHT
import React, { useMemo, useState } from "react";
import { Mail, Phone, MessageCircle, ChevronDown } from "lucide-react";

import logo from "../Layout/logo.png"; // adjust path if needed

interface TopBarProps {
  onOpenInquiry: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenInquiry }) => {
  const [isWhatsAppDropdownOpen, setIsWhatsAppDropdownOpen] = useState(false);

  const whatsappTeams = useMemo(
    () => [
      {
        label: "Marketing Team",
        phone: "9779800000001",
        message:
          "Hi Marketing Team, I’d like to know about your latest offers/packages.",
      },
      {
        label: "Ticketing Team",
        phone: "9779800000002",
        message: "Hi Ticketing Team, I need help with flight tickets and pricing.",
      },
      {
        label: "Travelling Team",
        phone: "9779800000003",
        message: "Hi Travelling Team, I want to plan a trip. Please guide me.",
      },
    ],
    []
  );

  const buildWaLink = (phone: string, message: string) => {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
  };

  return (
    <div className="hidden md:block relative z-[1400]">
      <div className="bg-white border-b border-slate-200 relative overflow-hidden">
        {/* SAME LEFT PANEL AS NAVBAR (topbar height) */}
        <div
          className={[
            "absolute left-0 top-0 h-full",
            "w-[300px] md:w-[360px] lg:w-[420px]",
            "bg-white",
            "rounded-r-[28px] md:rounded-r-[36px]",
            "shadow-[0_10px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5",
            "flex items-center",
            "z-[1500]",
          ].join(" ")}
        >
          <a href="#/" className="w-full h-full px-6 md:px-8 flex items-center">
            <img
              src={logo}
              alt="Trip Himalaya Tours & Travels"
              className="h-[80%] w-full object-contain"
            />
          </a>
        </div>

        {/* RIGHT CONTENT (pushed after left panel) */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="h-14 flex items-center justify-end pl-[310px] md:pl-[370px] lg:pl-[430px]">
            <div className="flex items-center justify-end space-x-6 text-[11px] font-extrabold tracking-wider text-[#2D1347]">
              <a
                href="mailto:info@triphimalaya.com.np"
                className="flex items-center space-x-2 hover:text-[#FF4FA3] transition-colors"
              >
                <Mail size={14} className="text-[#FF4FA3]" />
                <span>INFO@TRIPHIMALAYA.COM.NP</span>
              </a>

              {/* WhatsApp dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsWhatsAppDropdownOpen(true)}
                onMouseLeave={() => setIsWhatsAppDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center space-x-2 hover:text-[#FF4FA3] transition-colors py-1"
                >
                  <MessageCircle size={14} className="text-green-600" />
                  <span>WHATSAPP SUPPORT</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${
                      isWhatsAppDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isWhatsAppDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] z-[1600] overflow-hidden border border-slate-100">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Connect with our experts
                      </span>
                    </div>
                    {whatsappTeams.map((t) => (
                      <a
                        key={t.label}
                        href={buildWaLink(t.phone, t.message)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full px-4 py-3.5 hover:bg-[#5D2A8E]/5 flex items-center space-x-3 border-b border-slate-50 last:border-b-0 transition-colors group"
                      >
                        <div className="bg-green-100 p-2 rounded-lg text-green-700 group-hover:bg-green-600 group-hover:text-white transition-all">
                          <MessageCircle size={16} />
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="font-bold text-slate-800 text-xs">
                            {t.label}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Available Now
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="tel:+9779800000000"
                className="flex items-center space-x-2 hover:text-[#FF4FA3] transition-colors"
              >
                <Phone size={14} className="text-[#FF4FA3]" />
                <span>+977 980 0000000</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
