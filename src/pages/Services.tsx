import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane, Map, Activity, Mountain, Bed, Shield, ShieldCheck,
  Heart, Car, Wind, FileText, ArrowRight, MessageCircle,
} from "lucide-react";
import BannerSection from "../components/reuseable/BannerSection";
import PreFooter from "../components/reuseable/PreFooter";
import { services as mockServices } from "../assets/data/mockData";
import type { Service } from "../assets/data/types";

export type { Service };

// Mapping strings to actual Components
const IconMap: Record<string, React.ElementType> = {
  Plane,
  Map,
  Activity,
  Mountain,
  Bed,
  Shield,
  ShieldCheck,
  Heart,
  Car,
  Wind,
  FileText,
};

export const SERVICES_DATA: Service[] = mockServices;

// --- 3. SUB-COMPONENTS ---

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const navigate = useNavigate();
  const Icon = IconMap[service.icon] || FileText;

  const handleClick = () => {
    navigate(`/service/${service.slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-[340px] rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Background Image */}
      <img
        src={service.heroImage}
        alt={service.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      
      {/* Gradient Overlay matching Premium Travel Services logic */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:via-black/45 transition-colors" />

      {/* Top Left Icon Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-pink-500 transition-all duration-300">
          <Icon size={22} strokeWidth={2.2} />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white z-10">
        <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-1.5 tracking-tight group-hover:text-pink-200 transition-colors">
          {service.name}
        </h3>

        <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed line-clamp-2 mb-3">
          {service.shortDesc}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pink-400 group-hover:text-white group-hover:gap-3 transition-all cursor-pointer"
        >
          <span>Explore Details</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

const CTASection = () => (
  <PreFooter
    title="Need a custom solution?"
    description="Tell us what you need — we handle special requests and complex travel planning."
    btn1="Talk to an expert"
    btn2="Get a Free Quote"
  />
);

// --- 4. MAIN PAGE ---

export default function ServicesPage() {
  const handleFloatingWhatsApp = () => {
    const msg = encodeURIComponent("Hello Trip Himalaya! I would like to inquire about your travel services.");
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 font-sans">
      {/* BannerSection matching Image 4 structure */}
      <BannerSection
        heading="COMPREHENSIVE SOLUTIONS"
        title="Our Services"
        description="Everything you need for a seamless journey, from domestic ticketing to global expeditions."
        background="https://images.unsplash.com/photo-1548567117-02328f050eaa?q=80&w=2070&auto=format&fit=crop"
        alt="Trip Himalaya Services"
      />

      <main className="relative z-20 mx-auto w-full flex-grow px-4 pb-16 pt-6 sm:pt-8 sm:px-8 lg:px-16 max-w-screen-2xl">
        <header className="mb-6 sm:mb-8 text-center">
          <h2 className="mb-2.5 text-2xl sm:text-3xl md:text-4xl font-black text-[#2e1065] tracking-tight">
            Tailored Travel Management
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-gray-500">
            We provide end-to-end support for individual travelers, corporate groups, and mountain adventurers.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7">
          {SERVICES_DATA.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </main>

      <CTASection />

      {/* Floating WhatsApp Quick Contact */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleFloatingWhatsApp}
          aria-label="Contact us on WhatsApp"
          className="flex items-center justify-center rounded-full bg-[#25D366] hover:bg-emerald-600 p-3.5 text-white shadow-xl transition-all hover:scale-110 cursor-pointer"
        >
          <MessageCircle size={28} />
        </button>
      </div>
    </div>
  );
}