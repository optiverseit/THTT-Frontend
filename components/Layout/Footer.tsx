import React, { useState } from "react";

import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Globe,
  Landmark,
  Award,
  Mountain,
} from "lucide-react";
import { services } from "../../data/mockData"; 
const Footer: React.FC = () => {
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Newsletter:", { newsletterName, newsletterEmail });
    setNewsletterName("");
    setNewsletterEmail("");
  };
  return (
    <footer className="bg-[#0a0f1a] text-slate-400 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black text-lg mb-8 flex items-center">
              QUICK LINKS{" "}
              <span className="w-8 h-1 bg-[#D92671] ml-3 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {[
                "Home",
                "About THTT",
                "Tour Packages",
                "Photo Gallery",
                "Contact Us",
              ].map((item) => {
                const path =
                  item === "Home"
                    ? "/"
                    : `/${item.toLowerCase().replace(" ", "-")}`;
                return (
                  <li key={item}>
                    <a
                      href={`#${path}`}
                      className="text-sm font-bold hover:text-[#D92671] flex items-center group transition-colors"
                    >
                      <ArrowRight
                        size={14}
                        className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#D92671]"
                      />
                      {item.toUpperCase()}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-black text-lg mb-8 flex items-center">
              OUR SERVICES{" "}
              <span className="w-8 h-1 bg-[#D92671] ml-3 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <a
                    href={`#/services/${service.slug}`}
                    className="text-sm font-bold hover:text-[#D92671] flex items-center group transition-colors"
                  >
                    <ArrowRight
                      size={14}
                      className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#D92671]"
                    />
                    {service.name.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-black text-lg mb-8 flex items-center">
              GET IN TOUCH{" "}
              <span className="w-8 h-1 bg-[#D92671] ml-3 rounded-full"></span>
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start space-x-4 text-sm font-medium">
                <MapPin className="text-[#D92671] shrink-0 mt-1" size={18} />
                <span>
                  Kantipath, Kathmandu, Nepal
                  <br />
                  <span className="text-[11px] text-slate-500 uppercase tracking-widest">
                    (Near NTB Office)
                  </span>
                </span>
              </li>
              <li className="flex items-center space-x-4 text-sm font-medium">
                <Phone className="text-[#D92671] shrink-0" size={18} />
                <span>+977 1 4240000 / 9800000000</span>
              </li>
              <li className="flex items-center space-x-4 text-sm font-medium">
                <Mail className="text-[#D92671] shrink-0" size={18} />
                <span>info@triphimalaya.com.np</span>
              </li>
              <li className="flex items-center space-x-4 text-sm font-medium">
                <MessageCircle className="text-[#D92671] shrink-0" size={18} />
                <span>WhatsApp: +977 9800000000</span>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-white font-black text-lg mb-8 flex items-center ">
              JOIN OUR NEWSLETTER{" "}
              <span className="w-8 h-1 bg-[#D92671] ml-3 rounded-full"></span>
            </h3>
            <div className=" ">
              <p className="text-sm leading-relaxed mb-6 text-slate-400 font-medium">
                Subscribe our newsletter to know more about travel deals.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="text"
                  value={newsletterName}
                  onChange={(e) => setNewsletterName(e.target.value)}
                  placeholder="Enter Name"
                  className="
        w-full
        bg-transparent
        border border-white 
        rounded-md
        px-4 py-2.5
        text-[12px]
        font-bold
        text-white
        placeholder:text-slate-500
        outline-none
        focus:border-[#D92671]
        focus:ring-2 focus:ring-[#D92671]/20
        transition
      "
                />

                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  className="
        w-full
        bg-transparent
        border border-white 
        rounded-md
        px-4 py-2.5
        text-[12px]
        font-bold
        text-white
        placeholder:text-slate-500
        outline-none
        focus:border-[#D92671]
        focus:ring-2 focus:ring-[#D92671]/20
        transition
      "
                  required
                />

                <button
                  type="submit"
                  className="
        w-full
        bg-[#D92671]
        
        border border-[#D92671]
        text-white
        px-4 py-2.5
        rounded-md
        font-black
        text-[11px]
        
        uppercase
        tracking-widest
        hover:bg-white/5
        hover:border-white/20
        transition-all
        flex items-center justify-center gap-2
      "
                >
                  Subscribe Now <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Associations Section */}
        <div className="border-t border-white/5 pt-16 mt-12 bg-white/[0.02] -mx-4 md:-mx-8 px-4 md:px-8 pb-12 rounded-[3rem]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[#D92671] font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
                Certified & Trusted
              </span>
              <h3 className="text-white font-black text-3xl tracking-tight">
                Our Associations
              </h3>
              <p className="text-slate-500 whitespace-nowrap text-xs font-bold max-w-md md:text-right uppercase tracking-wider">
                Authorized travel partner recognized by Nepal's leading tourism
                bodies.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-8">
            {/* ISO Logo */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center p-2 shadow-xl hover:scale-105 transition-transform cursor-help">
              <div className="flex flex-col items-center">
                <div className="w-8 h-5 border-[1.5px] border-blue-800 rounded-sm relative flex items-center justify-center overflow-hidden">
                  <span className="text-[7px] font-black text-blue-800">
                    ISO
                  </span>
                </div>
                <div className="w-10 h-0.5 bg-blue-800 mt-1 rounded-full"></div>
              </div>
            </div>

            {/* NTB Logo */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center p-2 shadow-xl hover:scale-105 transition-transform cursor-help">
              <div className="text-center">
                <div className="text-[8px] font-black leading-none text-red-600">
                  NTB
                </div>
                <div className="w-6 h-6 mx-auto my-0.5 border-b-[1.5px] border-blue-800 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* NATTA Logo */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center p-2 shadow-xl hover:scale-105 transition-transform cursor-help border-2 border-blue-700">
              <div className="text-center">
                <span className="text-[7px] font-black text-blue-700 leading-none">
                  NATTA
                </span>
                <div className="text-[6px] font-bold text-blue-700">1966</div>
              </div>
            </div>

            {/* IATA Logo */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center p-2 shadow-xl hover:scale-105 transition-transform cursor-help">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-0.5 mb-0.5">
                  <div className="w-3 h-0.5 bg-blue-900"></div>
                  <div className="w-3 h-3 border-[1.5px] border-blue-900 rounded-full"></div>
                  <div className="w-3 h-0.5 bg-blue-900"></div>
                </div>
                <span className="text-[8px] font-black text-blue-900 tracking-tighter">
                  IATA
                </span>
              </div>
            </div>

            {/* TAAN Logo */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center p-2 shadow-xl hover:scale-105 transition-transform cursor-help border-2 border-green-700">
              <div className="text-center">
                <div className="w-8 h-4 border-b-[1.5px] border-green-700 mx-auto"></div>
                <span className="text-[7px] font-black text-green-700 tracking-widest">
                  TAAN
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 border-t border-white/5 pt-10 font-bold uppercase tracking-widest">
          <p>
            &copy; {new Date().getFullYear()} Trip Himalaya Tours & Travels Pvt.
            Ltd. All Rights Reserved.
          </p>
          <p className="mt-4 md:mt-0 flex items-center">
            <span className="mr-2">Powered by</span>
            <span className="text-white">Optiverse IT Solutions Pvt. Ltd.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
