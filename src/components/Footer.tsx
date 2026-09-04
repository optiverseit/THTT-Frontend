import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const associations = [
  {
    name: "ISO 9001:2015 Quality Management Certified",
    short: "ISO",
    sub: "9001:2015",
    color: "#1E40AF",
    url: "https://www.iso.org/iso-9001-quality-management.html",
  },
  {
    name: "Nepal Tourism Board (NTB)",
    short: "NTB",
    sub: "NEPAL",
    color: "#DC2626",
    url: "https://ntb.gov.np/",
  },
  {
    name: "Nepal Association of Tour & Travel Agents (NATTA)",
    short: "NATTA",
    sub: "NEPAL",
    color: "#2563EB",
    url: "https://natta.org.np/",
  },
  {
    name: "International Air Transport Association (IATA)",
    short: "— · —",
    sub: "IATA",
    color: "#0284C7",
    url: "https://www.iata.org/",
  },
  {
    name: "Trekking Agencies' Association of Nepal (TAAN)",
    short: "TAAN",
    sub: "NEPAL",
    color: "#16A34A",
    url: "https://www.taan.org.np/",
  },
];

const Footer: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setName("");
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#080C16] text-white pt-16 pb-8 px-4 sm:px-6 lg:px-12 relative z-20 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* ── TOP SECTION: 4 COLUMNS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          
          {/* Column 1: QUICK LINKS */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-sm font-extrabold tracking-widest uppercase text-white">
                QUICK LINKS
              </h3>
              <span className="w-6 h-[3px] bg-[#E11D48] rounded-full" />
            </div>
            <ul className="space-y-3.5 text-xs font-bold text-gray-300 tracking-wider">
              <li>
                <Link to="/" className="hover:text-[#E11D48] transition-colors">
                  HOME
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E11D48] transition-colors">
                  ABOUT THTT
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-[#E11D48] transition-colors">
                  TOUR PACKAGES
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#E11D48] transition-colors">
                  PHOTO GALLERY
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E11D48] transition-colors">
                  CONTACT US
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: OUR SERVICES */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-sm font-extrabold tracking-widest uppercase text-white">
                OUR SERVICES
              </h3>
              <span className="w-6 h-[3px] bg-[#E11D48] rounded-full" />
            </div>
            <ul className="space-y-3.5 text-xs font-bold text-gray-300 tracking-wider">
              <li>
                <Link to="/service" className="hover:text-[#E11D48] transition-colors">
                  AIR TICKET
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-[#E11D48] transition-colors">
                  TOURS
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-[#E11D48] transition-colors">
                  ADVENTURE ACTIVITIES
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-[#E11D48] transition-colors">
                  TREKKING
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-[#E11D48] transition-colors">
                  HOTEL BOOKING
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: GET IN TOUCH */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-sm font-extrabold tracking-widest uppercase text-white">
                GET IN TOUCH
              </h3>
              <span className="w-6 h-[3px] bg-[#E11D48] rounded-full" />
            </div>
            <ul className="space-y-4 text-xs font-semibold text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#E11D48] flex-shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Kantipath, Kathmandu, Nepal
                  <span className="block text-[10px] text-gray-400 font-normal uppercase tracking-wider mt-0.5">
                    (NEAR NTB OFFICE)
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-[#E11D48] flex-shrink-0" />
                <a href="tel:+97714240000" className="hover:text-white transition-colors">
                  +977 1 4240000 / 9800000000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-[#E11D48] flex-shrink-0" />
                <a
                  href="mailto:info@triphimalaya.com.np"
                  className="hover:text-white transition-colors break-all"
                >
                  info@triphimalaya.com.np
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={15} className="text-[#E11D48] flex-shrink-0" />
                <a
                  href="https://wa.me/9779800000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: +977 9800000000
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: JOIN OUR NEWSLETTER */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-sm font-extrabold tracking-widest uppercase text-white">
                JOIN OUR NEWSLETTER
              </h3>
              <span className="w-6 h-[3px] bg-[#E11D48] rounded-full" />
            </div>
            
            <div className="bg-[#0F1626]/80 border border-white/10 rounded-2xl p-5 shadow-xl">
              <p className="text-xs text-gray-300 mb-4 leading-relaxed font-medium">
                Subscribe our newsletter to know more about travel deals.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#162035]/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-400 outline-none focus:border-[#E11D48] transition-colors font-medium"
                />
                <input
                  type="email"
                  required
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#162035]/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-400 outline-none focus:border-[#E11D48] transition-colors font-medium"
                />
                <button
                  type="submit"
                  className="w-full bg-[#E11D48] hover:bg-[#BE123C] active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-pink-900/40"
                >
                  <span>{subscribed ? "THANK YOU!" : "SUBSCRIBE NOW"}</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* ── MIDDLE SECTION: OUR ASSOCIATIONS CARD ── */}
        <div className="bg-[#0F1626] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 mb-12 shadow-2xl">
          <span className="text-[#E11D48] text-[10px] font-black tracking-[0.25em] uppercase block mb-1.5">
            CERTIFIED & TRUSTED
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5 tracking-tight">
            Our Associations
          </h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8">
            AUTHORIZED TRAVEL PARTNER RECOGNIZED BY NEPAL'S LEADING TOURISM BODIES.
          </p>

          {/* Association Round Badges — clickable links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {associations.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex flex-col items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer flex-shrink-0 group"
                title={`Visit official website: ${item.name}`}
              >
                <span
                  className="font-black text-[11px] sm:text-[12px] leading-tight text-center group-hover:brightness-90 transition-colors"
                  style={{ color: item.color }}
                >
                  {item.short}
                </span>
                {item.sub && (
                  <span
                    className="font-bold text-[7px] sm:text-[8px] tracking-wider uppercase"
                    style={{ color: item.color }}
                  >
                    {item.sub}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR: COPYRIGHT & DEVELOPED BY ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <p>© {new Date().getFullYear()} TRIP HIMALAYA TOURS & TRAVELS PVT. LTD. ALL RIGHTS RESERVED.</p>
          <p className="text-gray-400">
            DEVELOPED BY{" "}
            <a
              href="https://optiverseits.com.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#E11D48] transition-colors font-extrabold"
            >
              OPTIVERSE IT SOLUTIONS PVT. LTD.
            </a>
          </p>
        </div>

      </div>

      {/* Floating Chat Button (Bottom-Right) */}
      <a
        href="https://wa.me/9779800000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
      >
        <MessageCircle size={24} className="fill-white" />
      </a>
    </footer>
  );
};

export default Footer;
