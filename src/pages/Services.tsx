import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane, Map, Activity, Mountain, Bed, ShieldCheck,
  Heart, Car, Wind, FileText, ArrowRight, MessageCircle,
} from "lucide-react";
import BannerSection from "../components/reuseable/BannerSection";
import PreFooter from "../components/reuseable/PreFooter";

export interface Service {
  id: string;
  name: string;
  slug: string;
  icon: string; 
  heroImage: string;
  shortDesc: string;
  description: string;
  subServices: string[];
  gallery: string[];
}

// Mapping strings to actual Components
const IconMap: Record<string, React.ElementType> = {
  Plane,
  Map,
  Activity,
  Mountain,
  Bed,
  Shield: ShieldCheck,
  Heart,
  Car,
  Wind,
  FileText,
};

const SERVICES_DATA: Service[] = [
  {
    id: "1",
    name: "Air Ticket",
    slug: "air-ticket",
    icon: "Plane", 
    heroImage: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=1600",
    shortDesc: "Affordable domestic and international flight bookings with top airlines.",
    description: "We offer the most competitive rates for both domestic flights within Nepal and international flights worldwide with major certified carriers.",
    subServices: ["Domestic Air Ticket", "International Air Ticket", "Himalayan Sightseeing Flights", "Charter Flights"],
    gallery: ["https://images.unsplash.com/photo-1544016768-982d1554f0b9?auto=format&fit=crop&q=80&w=600"],
  },
  {
    id: '2',
    name: 'Tours',
    slug: 'tours',
    icon: 'Map',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600',
    shortDesc: 'Explore the beauty of Nepal and the world with our curated tour packages.',
    description: 'Discover the rich culture and natural beauty of Nepal or travel across the globe with our expertly curated tour packages for all types of travelers.',
    subServices: ['Domestic Tours', 'International Tours', 'Religious Pilgrimages', 'Cultural Heritage Tours'],
    gallery: []
  },
  {
    id: '5',
    name: 'Adventure Activities',
    slug: 'activities',
    icon: 'Activity',
    heroImage: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=1600',
    shortDesc: 'Paragliding, Bungee, Rafting, and more.',
    description: 'Experience the thrill of Nepal with our curated adventure activities and certified instructors.',
    subServices: ['Paragliding', 'Bungee Jumping', 'White Water Rafting', 'Zip Lining'],
    gallery: []
  },
  {
    id: '6',
    name: 'Trekking',
    slug: 'trekking',
    icon: 'Mountain',
    heroImage: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=1600',
    shortDesc: 'Guided treks through the world\'s highest mountains.',
    description: 'Expert-led trekking expeditions in the Annapurna, Everest, and Langtang regions.',
    subServices: ['EBC Trek', 'Annapurna Circuit', 'Mardi Himal', 'Langtang Valley'],
    gallery: []
  },
  {
    id: '7',
    name: 'Hotel Booking',
    slug: 'hotel-booking',
    icon: 'Bed',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600',
    shortDesc: 'Best rates at premium hotels and resorts.',
    description: 'Secure your stay in top-rated hotels across Nepal and international destinations with exclusive amenities.',
    subServices: ['Luxury Resorts', 'Boutique Hotels', 'Budget Stays', 'Homestays'],
    gallery: []
  },
  {
    id: '8',
    name: 'Visa Services',
    slug: 'visa-services',
    icon: 'Shield',
    heroImage: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1600',
    shortDesc: 'Expert assistance for visa applications and processing.',
    description: 'We help you navigate complex visa requirements for major travel destinations with full documentation counseling.',
    subServices: ['Visit Visas', 'Work Permits', 'Schengen Visas', 'Visa Counseling'],
    gallery: []
  },
  {
    id: '9',
    name: 'Travel Insurance',
    slug: 'travel-insurance',
    icon: 'Heart',
    heroImage: 'https://images.unsplash.com/photo-1454165833767-0270b24bdaae?auto=format&fit=crop&q=80&w=1600',
    shortDesc: 'Comprehensive coverage for a worry-free journey.',
    description: 'Protect yourself against unforeseen events with our comprehensive travel and high-altitude rescue insurance plans.',
    subServices: ['Medical Coverage', 'Trip Cancellation', 'Lost Baggage', 'Emergency Evacuation'],
    gallery: []
  },
  {
    id: '10',
    name: 'Vehicle Rental',
    slug: 'vehicle-rental',
    icon: 'Car',
    heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1600',
    shortDesc: 'Rent a car, SUV, or bus for your custom group travel.',
    description: 'Modern fleet of vehicles with experienced drivers for all your transportation and tour needs.',
    subServices: ['Private Cars', 'Scorpio/SUV', 'Coaster/Hiace', 'Tourist Bus'],
    gallery: []
  },
  {
    id: '11',
    name: 'Heli Services',
    slug: 'heli-services',
    icon: 'Wind',
    heroImage: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=1600',
    shortDesc: 'VIP Helicopter tours and emergency rescue.',
    description: 'Luxury helicopter tours to Everest Base Camp, Annapurna, and other remote destinations with 24/7 rescue readiness.',
    subServices: ['EBC Heli Tour', 'Muktinath Heli Tour', 'Emergency Medical Rescue', 'Charter Services'],
    gallery: []
  },
  {
    id: '12',
    name: 'Online Shram/Labour',
    slug: 'work-permit',
    icon: 'FileText',
    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1600',
    shortDesc: 'Help with labor permits and online registration.',
    description: 'We assist migrant workers with Shram (Labour) permits, document attestation, and embassy verification.',
    subServices: ['New Shram Permit', 'Renewal', 'Orientation Help', 'Document Verification'],
    gallery: []
  }
];

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
      className="group relative flex h-full flex-col items-start overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer"
    >
      <div className="absolute -mr-8 -mt-8 right-0 top-0 h-32 w-32 rounded-bl-full bg-gray-50/80 transition-colors group-hover:bg-purple-50/70" />

      <div className="relative z-10 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100/60 text-[#2e1065] group-hover:bg-[#E91E63] group-hover:text-white transition-all duration-300 shadow-xs">
          <Icon size={30} strokeWidth={2.2} />
        </div>
      </div>

      <h3 className="relative z-10 mb-3 text-xl font-extrabold text-[#2E1347] group-hover:text-[#E91E63] transition-colors">
        {service.name}
      </h3>

      <p className="relative z-10 mb-6 flex-grow text-sm font-medium leading-relaxed text-gray-500">
        {service.shortDesc}
      </p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E91E63] transition-all group-hover:gap-3 group-hover:text-pink-700 cursor-pointer"
      >
        <span>Explore Details</span>
        <ArrowRight size={15} />
      </button>
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

      <main className="relative z-20 mx-auto flex-grow px-4 pb-16 pt-6 sm:pt-8 sm:px-6 lg:px-8 max-w-7xl">
        <header className="mb-6 sm:mb-8 text-center">
          <h2 className="mb-2.5 text-2xl sm:text-3xl md:text-4xl font-black text-[#2e1065] tracking-tight">
            Tailored Travel Management
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-gray-500">
            We provide end-to-end support for individual travelers, corporate groups, and mountain adventurers.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
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