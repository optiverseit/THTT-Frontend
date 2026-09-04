import React from "react";
import {
  Plane, Map, Activity, Mountain, Bed, ShieldCheck,
  Heart, Car, Wind, FileText, ArrowRight, MessageCircle,
} from "lucide-react";
import SubHero from "../components/reuseable/HeroImage/HeroImg";
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
    description: "We offer the most competitive rates for both domestic flights within Nepal...",
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
    description: 'Experience the thrill of Nepal with our curated adventure activities.',
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
    description: 'Secure your stay in top-rated hotels across Nepal and international destinations.',
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
    description: 'We help you navigate complex visa requirements for major travel destinations.',
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
    description: 'Protect yourself against unforeseen events with our comprehensive travel insurance plans.',
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
    description: 'Modern fleet of vehicles for all your transportation needs.',
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
    description: 'Luxury helicopter tours to Everest Base Camp and other remote destinations.',
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
    description: 'We assist migrant workers with Shram (Labour) permits and essential documentation.',
    subServices: ['New Shram Permit', 'Renewal', 'Orientation Help', 'Document Verification'],
    gallery: []
  }

];

// --- 3. SUB-COMPONENTS ---

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const Icon = IconMap[service.icon] || FileText;

  return (
    <div className="group relative flex h-full flex-col items-start overflow-hidden rounded-3xl border border-gray-50 bg-white p-5 sm:p-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="absolute -mr-8 -mt-8 right-0 top-0 h-32 w-32 rounded-bl-full bg-gray-50/80 transition-colors group-hover:bg-purple-50/50" />

      <div className="relative z-10 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100/50 text-[#2e1065]">
          <Icon size={32} strokeWidth={2.5} />
        </div>
      </div>

      <h3 className="relative z-10 mb-3 text-xl font-extrabold text-[#2E1347]">
        {service.name}
      </h3>

      <p className="relative z-10 mb-6 flex-grow text-sm font-medium leading-relaxed text-gray-500">
        {service.shortDesc}
      </p>

      <button className="relative z-10 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-pink-500 transition-all hover:gap-3 hover:text-pink-600">
        Explore Details <ArrowRight size={14} />
      </button>
    </div>
  );
};

const CTASection = () => (
  // <section className="mt-12 w-full bg-gradient-to-r from-pink-500 to-[#e91e63] px-4 py-16 md:px-12">
  //   <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
  //     <div className="text-center text-white md:text-left">
  //       <h2 className="mb-2 text-3xl font-black md:text-4xl">Need a custom solution?</h2>
  //       <p className="text-sm text-white/90 md:text-base font-semibold">
  //         Tell us what you need — we handle special requests and complex travel planning.
  //       </p>
  //     </div>
  //     <button className="rounded-full bg-[#1e1b4b] px-15 py-5 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-[#2e1065]">
  //       Talk to an expert
  //     </button>
  //   </div>
  // </section>
  <PreFooter
  title="Need a custom solution?"
  description="Tell us what you need — we handle special requests and complex travel planning."
  btn1="Talk to an expert"
  btn2="Talk to an expert"/>
);

// --- 4. MAIN PAGE ---

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans">
      {/* Reusable SubHero Implemented Here */}
      <SubHero
        badge="Comprehensive Solutions"
        title="Our Services"
        description="Everything you need for a seamless journey, from domestic ticketing to global expeditions."
        backgroundImage="https://images.unsplash.com/photo-1548567117-02328f050eaa?q=80&w=2070&auto=format&fit=crop"
      />

      <main className="relative z-20 mx-auto flex-grow px-4 pb-20 pt-20 sm:px-6 lg:px-8 max-w-7xl">
        <header className="mb-10 md:mb-16 text-center">
          <h2 className="mb-3 text-2xl sm:text-3xl font-extrabold text-[#2e1065]">
            Tailored Travel Management
          </h2>
          <p className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-gray-500">
            We provide end-to-end support for individual travelers, corporate groups, and mountain adventurers.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {SERVICES_DATA.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </main>

      <CTASection />

      <div className="fixed bottom-6 right-6 z-50">
        <button
          aria-label="Contact us on WhatsApp"
          className="flex items-center justify-center rounded-full bg-[#25D366] p-3 text-white shadow-lg transition-transform hover:scale-110"
        >
          <MessageCircle size={28} />
        </button>
      </div>
    </div>
  );
}