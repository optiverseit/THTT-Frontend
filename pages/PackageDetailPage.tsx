import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { packages } from "../data/mockData";
import {
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
  Info,
  Heart,
  Share2,
  Calendar,
  Users,
  Map,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  User,
  Filter,
  Navigation,
  ArrowUp,
} from "lucide-react";

interface PackageDetailPageProps {
  onInquire: (pkg: string) => void;
}

const PackageDetailPage: React.FC<PackageDetailPageProps> = ({ onInquire }) => {
  const { slug } = useParams<{ slug: string }>();
  const pkg = packages.find((p) => p.slug === slug);
  const [activeTab, setActiveTab] = useState<
    "overview" | "policies" | "faqs" | "testimonies"
  >("overview");
  const [pricingType, setPricingType] = useState<"nepali" | "foreigner">(
    "foreigner",
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">(
    "recent",
  );

  if (!pkg) {
    return (
      <div className="py-40 text-center">
        <h2 className="text-3xl font-black text-[#2D1347]">
          Package not found
        </h2>
        <Link
          to="/tour-packages"
          className="text-[#D92671] mt-4 inline-block font-bold"
        >
          Back to Packages
        </Link>
      </div>
    );
  }

  // Fallback for missing detail fields in basic packages
  const includes = pkg.includes || [
    "Accommodation",
    "Professional Guide",
    "Local Transfers",
    "Daily Breakfast",
  ];
  const excludes = pkg.excludes || [
    "Lunch & Dinner",
    "Personal Expenses",
    "Tips",
    "Travel Insurance",
  ];
  const restrictions = pkg.restrictions || [
    "Not suitable for pets",
    "Children below 10 need supervision",
    "Strict noise policy after 10PM",
  ];
  const whatToBring = pkg.whatToBring || [
    "Warm Clothes",
    "Comfortable Shoes",
    "Camera",
    "Sunscreen",
  ];
  const pricingTable = pkg.pricingTable || [
    {
      service: pkg.title,
      ageGroup: "Adult",
      priceNepali: "Rs 15,000",
      priceForeigner: pkg.price || "$200",
    },
    {
      service: pkg.title,
      ageGroup: "Child",
      priceNepali: "Rs 10,000",
      priceForeigner: "$150",
    },
  ];
  const faqs = pkg.faqs || [
    {
      question: "What is included in the package?",
      answer:
        "The package includes accommodation, transfers, and guided sightseeing tours as per the itinerary.",
    },
    {
      question: "How do I book?",
      answer:
        'Click the "Book Now" or "Check Availability" button to send an inquiry or message us on WhatsApp.',
    },
  ];
  const testimonies = pkg.testimonies || [];
  const itinerary = pkg.itinerary || [
    { day: '01', title: 'Arrival & Welcome', desc: 'Our representative will receive you and transfer you to your accommodation. Evening free for local exploration.' },
    { day: '02', title: 'Full Day Sightseeing', desc: 'Visit the most famous landmarks and cultural heritage sites of the region with our expert guide.' },
    { day: '03', title: 'Final Departure', desc: 'Transfer to the airport or bus station for your onward journey home with beautiful memories.' }
  ];
  const gallery = pkg.gallery || [pkg.image, pkg.image, pkg.image, pkg.image];

  // Generate Google Maps URL based on location
  const mapQuery = encodeURIComponent(pkg.location || pkg.title);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY || ""}&q=${mapQuery}`;

  // Use a public search-based embed as a reliable fallback if API key isn't provided/needed for simple embed
  const publicMapEmbed = `https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. Header Gallery Section */}
      <section className="bg-white pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden">
              <img
                src={gallery[0]}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-6 left-6 flex space-x-2">
                <button className="bg-white/90 backdrop-blur-md p-3 rounded-full text-[#D92671] shadow-xl hover:bg-white transition-all">
                  <Heart size={18} />
                </button>
                <button className="bg-white/90 backdrop-blur-md p-3 rounded-full text-slate-800 shadow-xl hover:bg-white transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            <div className="relative group overflow-hidden">
              <img
                src={gallery[1]}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
            </div>
            <div className="relative group overflow-hidden">
              <img
                src={gallery[2]}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
            </div>
            <div className="md:col-span-2 relative group overflow-hidden">
              <img
                src={gallery[3]}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <button className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl text-xs font-black text-[#5D2A8E] shadow-2xl hover:bg-[#D92671] hover:text-white transition-all uppercase tracking-widest">
                View all photos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sticky Booking Bar */}
      <div className="sticky top-0 bg-white shadow-xl z-[1500] border-y border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between py-4">
          <div className="flex space-x-8">
            {["overview", "policies", "faqs", "testimonies"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] pb-1 transition-all border-b-2 ${activeTab === tab ? "text-[#D92671] border-[#D92671]" : "text-slate-400 border-transparent hover:text-slate-600"}`}
              >
                {tab === "testimonies" ? "Testimonies" : tab}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-10">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Starts from
              </p>
              <p className="text-xl font-black text-[#D92671]">
                {pkg.price || "Contact Us"}
              </p>
            </div>
            <button
              onClick={() => onInquire(pkg.title)}
              className="bg-[#D92671] text-white px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:brightness-110 transition-all shadow-xl shadow-[#D92671]/20 uppercase"
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 3. Left Content Area */}
          <div className="lg:col-span-2 space-y-16">
            {activeTab === "overview" && (
              <>
                {/* Package Intro */}
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < (pkg.rating || 5) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      ({pkg.reviewsCount || 0} testimonies)
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-[#2D1347] tracking-tight mb-4">
                    Packages - {pkg.title}
                  </h1>
                  <div className="flex items-center text-slate-500 font-bold text-sm mb-6">
                    <MapPin size={18} className="text-[#D92671] mr-2" />
                    {pkg.location || "Kathmandu, Nepal"}
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium text-lg">
                    {pkg.description ||
                      "Embark on an extraordinary journey through the heart of the Himalayas. This curated package offers a perfect blend of adventure, culture, and natural beauty."}
                  </p>
                </div>

                {/* Trip Highlights Grid */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                  <h2 className="text-xl font-black text-[#2D1347] mb-8 flex items-center">
                    <CheckCircle2 size={24} className="text-[#D92671] mr-3" />{" "}
                    Trip Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    {pkg.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center text-slate-700 font-bold"
                      >
                        <div className="w-2 h-2 bg-[#D92671] rounded-full mr-4"></div>
                        {h}
                      </div>
                    ))}
                    <div className="flex items-center text-slate-700 font-bold">
                      <Clock size={18} className="text-[#D92671] mr-4" />
                      Duration: {pkg.duration}
                    </div>
                  </div>
                </div>
               {/* DETAILED ITINERARY SECTION - NEW */}
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center">
                       <div className="bg-[#D92671]/10 p-4 rounded-2xl text-[#D92671] mr-5">
                          <Map size={24} />
                       </div>
                       <div>
                          <h2 className="text-2xl md:text-3xl font-black text-[#2D1347] tracking-tight">Trip Roadmap</h2>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Day-by-Day Detailed Itinerary</p>
                       </div>
                    </div>
                    <div className="inline-flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Optimized Route</span>
                    </div>
                  </div>

                  <div className="relative pl-8 md:pl-12 border-l-2 border-slate-200 space-y-5 ml-6">
                    {itinerary.map((item, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline Connector Dot */}
                        <div className="absolute -left-[45px] md:-left-[61px] top-0 w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-[#D92671] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 z-10">
                          <span className="text-[#2D1347] font-black text-sm md:text-lg">{item.day}</span>
                        </div>
                        
                        {/* Content Card */}
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-[#D92671]/5 transition-colors"></div>
                          
                          <div className="relative z-10">
                             <div className="flex flex-wrap items-center gap-4 mb-4">
                                <span className="bg-[#D92671]/10 text-[#D92671] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">DAY {item.day}</span>
                                <div className="flex items-center text-slate-400 space-x-1">
                                   <Clock size={12} />
                                   <span className="text-[9px] font-bold uppercase tracking-widest">Full Day Schedule</span>
                                </div>
                             </div>
                             
                             <h3 className="text-xl md:text-2xl font-black text-[#2D1347] mb-4 tracking-tight group-hover:text-[#D92671] transition-colors flex items-center">
                                {item.title}
                                {idx === 0 && <span className="ml-3 inline-block animate-bounce"><ArrowUp size={16} className="text-green-500" /></span>}
                             </h3>
                             
                             <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                                {item.desc}
                             </p>

                             <div className="mt-8 flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Breakfast</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guided Sightseeing</span>
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Final Step Badge */}
                    <div className="relative">
                       <div className="absolute -left-[45px] md:-left-[61px] top-0 w-12 h-12 md:w-16 md:h-16 bg-[#2D1347] rounded-full flex items-center justify-center shadow-xl z-10 text-white">
                          <CheckCircle2 size={24} />
                       </div>
                       <div className="bg-[#2D1347] p-8 md:p-10 rounded-[2.5rem] text-white">
                          <h4 className="text-lg font-black uppercase tracking-widest mb-2">End of Journey</h4>
                          <p className="text-white/60 text-sm font-medium">Safe travels back home with unforgettable memories.</p>
                       </div>
                    </div>
                  </div>
                </div>  

                {/* New: Map Section */}
                <div className="bg-white p-1 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                  <div className="p-8 pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-black text-[#2D1347] flex items-center">
                        <MapPin size={24} className="text-[#D92671] mr-3" />{" "}
                        Destination Map
                      </h2>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {pkg.location}
                      </span>
                    </div>
                  </div>
                  <div className="h-[300px] w-full relative group">
                    <iframe
                      title="Trip Location"
                      src={publicMapEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      className="rounded-b-[2.4rem]"
                    ></iframe>
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/90 backdrop-blur-md border border-slate-200 text-[#D92671] px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-2xl flex items-center space-x-2"
                      >
                        <Navigation size={14} />
                        <span>Open in Google Maps</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Included / Excluded Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Included */}
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#5B2FA7] via-[#7B2FA5] to-[#D92671] p-10 shadow-xl">
                    {/* subtle highlight */}
                    <div className="pointer-events-none absolute inset-0 bg-white/5" />
                    <h3 className="relative mb-6 flex items-center gap-3 text-2xl font-extrabold text-white">
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-[#22C55E] shadow-md">
                        <CheckCircle2 size={18} className="text-white" />
                      </span>
                      Included
                    </h3>

                    <ul className="relative space-y-4">
                      {includes.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-white/90"
                        >
                          <span className="mt-1 text-white">✓</span>
                          <span className="text-[15px] font-semibold leading-snug">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Not Included */}
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#5B2FA7] via-[#7B2FA5] to-[#D92671] p-10 shadow-xl">
                    <div className="pointer-events-none absolute inset-0 bg-white/5" />
                    <h3 className="relative mb-6 flex items-center gap-3 text-2xl font-extrabold text-white">
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-[#EF4444] shadow-md">
                        <XCircle size={18} className="text-white" />
                      </span>
                      Not Included
                    </h3>

                    <ul className="relative space-y-4">
                      {excludes.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-white/90"
                        >
                          <span className="mt-1 text-white">✓</span>
                          <span className="text-[15px] font-semibold leading-snug">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Restrictions & What to Bring */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-black text-[#2D1347] mb-6 flex items-center">
                      <AlertCircle size={20} className="text-[#D92671] mr-2" />{" "}
                      Restrictions
                    </h3>
                    <ul className="space-y-3">
                      {restrictions.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center text-slate-500 text-sm font-bold"
                        >
                          <ChevronRight
                            size={14}
                            className="text-[#D92671] mr-2"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#2D1347] mb-6 flex items-center">
                      <Info size={20} className="text-[#D92671] mr-2" /> What to
                      bring?
                    </h3>
                    <ul className="space-y-3">
                      {whatToBring.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center text-slate-500 text-sm font-bold"
                        >
                          <ChevronRight
                            size={14}
                            className="text-[#D92671] mr-2"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}

            {activeTab === "policies" && (
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-10">
                <div>
                  <h2 className="text-2xl font-black text-[#2D1347] mb-6 flex items-center">
                    <ShieldCheck size={28} className="text-[#D92671] mr-3" />{" "}
                    Booking Policy
                  </h2>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Booking must be done at least 7 days before the trip date. A
                    minimum 25% deposit is required to confirm your reservation.
                    Full payment must be cleared 2 days prior to departure.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#2D1347] mb-6 flex items-center">
                    <XCircle size={28} className="text-[#D92671] mr-3" />{" "}
                    Cancellation Policy
                  </h2>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Customers who cancel bookings before 14 days will get 100%
                    refund. Cancellations made within 7-13 days will receive 50%
                    refund. No refunds are available for cancellations made less
                    than 7 days before departure.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#2D1347] mb-6 flex items-center">
                    <Info size={28} className="text-[#D92671] mr-3" /> Terms &
                    Conditions
                  </h2>
                  <ul className="space-y-4">
                    {[
                      "Minimum number of participants required for group tours.",
                      "Travelers must follow the safety guidelines provided by the guide.",
                      "Itinerary might change due to weather or unforeseen circumstances.",
                    ].map((t, i) => (
                      <li
                        key={i}
                        className="flex items-start text-slate-600 text-sm font-bold"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-[#D92671] mr-3 mt-0.5 shrink-0"
                        />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "faqs" && (
              <div id="faqs">
                <h2 className="text-2xl font-black text-[#2D1347] mb-8">
                  Frequently Asked Questions (FAQs)
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full px-8 py-5 flex items-center justify-between text-left group"
                      >
                        <span className="font-black text-[#2D1347] group-hover:text-[#D92671] transition-colors">
                          {faq.question}
                        </span>
                        <ChevronDown
                          size={20}
                          className={`text-slate-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openFaq === idx && (
                        <div className="px-8 pb-6 text-slate-500 text-sm font-medium leading-relaxed animate-in slide-in-from-top-2 duration-300">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "testimonies" && (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-5">
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-6xl font-black text-[#D92671] leading-none mb-1">
                        {pkg.rating || "0"}
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {pkg.rating && pkg.rating > 0
                          ? "Highly Rated"
                          : "Not Rated Yet"}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                        {pkg.reviewsCount || 0} testimonies
                      </div>
                    </div>
                    <div className="border-l border-slate-100 pl-8">
                      <h2 className="text-2xl font-black text-[#2D1347] tracking-tight">
                        What our customers say
                      </h2>
                      <p className="text-slate-500 font-medium text-sm">
                        Authentic experiences from real travelers.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                      <Filter size={10} className="mr-2" /> Sort Testimonies By
                    </p>
                    <div className="flex flex-col space-y-3">
                      {["recent", "highest", "lowest"].map((sort) => (
                        <label
                          key={sort}
                          className="flex items-center cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="sort"
                            checked={sortBy === sort}
                            onChange={() => setSortBy(sort as any)}
                            className="w-4 h-4 accent-[#D92671]"
                          />
                          <span className="ml-3 text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-[#D92671] transition-colors">
                            {sort.replace(/^\w/, (c) => c.toUpperCase())} Rated
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {testimonies.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {testimonies.map((testimony) => (
                      <div
                        key={testimony.id}
                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-50">
                              {testimony.userAvatar ? (
                                <img
                                  src={testimony.userAvatar}
                                  alt={testimony.userName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <User size={24} />
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-black text-[#2D1347] tracking-tight">
                                {testimony.userName}
                              </h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {testimony.location || "Verified Traveler"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex text-yellow-400 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  fill={
                                    i < testimony.rating
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              ))}
                            </div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                              {testimony.date}
                            </p>
                          </div>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed italic">
                          "{testimony.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm border border-slate-100">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                      <MessageCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-[#2D1347] mb-2">
                      No testimonies yet
                    </h3>
                    <p className="text-slate-500 font-medium mb-8">
                      Be the first to share your experience with this package!
                    </p>
                    <button
                      onClick={() => onInquire(pkg.title)}
                      className="bg-[#D92671] text-white px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:brightness-110 transition-all uppercase"
                    >
                      Write a Testimony
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Right Sidebar: Pricing Table */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#2D1347]">Pricing</h3>
                  <div className="flex bg-white p-1 rounded-xl shadow-inner border border-slate-200">
                    <button
                      onClick={() => setPricingType("nepali")}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${pricingType === "nepali" ? "bg-[#5D2A8E] text-white shadow-lg" : "text-slate-400 hover:text-[#5D2A8E]"}`}
                    >
                      Nepali
                    </button>
                    <button
                      onClick={() => setPricingType("foreigner")}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${pricingType === "foreigner" ? "bg-[#D92671] text-white shadow-lg" : "text-slate-400 hover:text-[#D92671]"}`}
                    >
                      Foreigner
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="pb-4">Service</th>
                        <th className="pb-4">Age Group</th>
                        <th className="pb-4 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {pricingTable.map((row, i) => (
                        <tr
                          key={i}
                          className="text-xs font-bold text-slate-700"
                        >
                          <td className="py-5 pr-4 leading-tight">
                            {row.service}
                          </td>
                          <td className="py-5">{row.ageGroup}</td>
                          <td className="py-5 text-right font-black text-[#D92671]">
                            {pricingType === "nepali"
                              ? row.priceNepali
                              : row.priceForeigner}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-8 space-y-4">
                  <button
                    onClick={() => onInquire(pkg.title)}
                    className="w-full bg-[#D92671] text-white py-5 rounded-2xl font-black text-[11px] tracking-widest hover:brightness-110 transition-all shadow-xl shadow-[#D92671]/20 uppercase"
                  >
                    Book This Trip
                  </button>
                  <a
                    href="https://wa.me/9779800000000"
                    className="w-full flex items-center justify-center space-x-3 bg-green-500 text-white py-5 rounded-2xl font-black text-[11px] tracking-widest hover:brightness-110 transition-all shadow-xl shadow-green-500/20 uppercase"
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>

              {/* Support Info */}
              <div className="bg-[#5D2A8E]/5 border border-[#5D2A8E]/10 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center space-x-4">
                  <ShieldCheck className="text-[#5D2A8E]" size={24} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Verified Agency
                    </p>
                    <p className="text-xs font-black text-[#5D2A8E]">
                      Govt. Licensed & Insured
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <AlertCircle className="text-[#D92671]" size={24} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Support Hours
                    </p>
                    <p className="text-xs font-black text-[#5D2A8E]">
                      24/7 Hotline Assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* 6. Combo Packages Slider Grid */}
<section className="py-12 bg-slate-50 border-t border-slate-100">
  <div className="max-w-7xl mx-auto px-4 md:px-8">
    <div className="flex items-end justify-between gap-6 mb-12">
      <div>
         
        <h2 className="text-3xl md:text-3xl font-black text-[#2D1347] mt-3 tracking-tight">
          Combo Packages
        </h2>
      </div>

       
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {packages
        .filter((p) => p.id !== pkg.id) 
        .slice(0, 3)
        .map((item) => (
          <Link
            key={item.id}
            to={`/tour-packages/${item.slug}`}
            className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
          >
            <div className="relative h-60 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />

              {/* Combo badge */}
              <div className="absolute top-4 right-4 bg-[#D92671] px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-lg">
                Combo
              </div>

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-[#5D2A8E] uppercase tracking-widest">
                {item.duration}
              </div>

              {/* soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1347]/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all" />
            </div>

            <div className="p-8">
              <h4 className="text-lg font-black text-[#2D1347] group-hover:text-[#D92671] transition-colors mb-4 leading-tight">
                {item.title}
              </h4>

              {/* optional: combo includes line */}
              {item.includes?.length ? (
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Includes:{" "}
                  <span className="text-slate-500">
                    {item.includes.slice(0, 2).join(" + ")}
                    {item.includes.length > 2 ? " + more" : ""}
                  </span>
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <MapPin size={14} className="mr-1 text-[#D92671]" />
                  {item.location || "Kathmandu"}
                </div>

                <div className="text-lg font-black text-[#D92671]">
                  {item.price}
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>

    {/* mobile CTA */}
    <div className="mt-10 md:hidden">
      <Link
        to="/tour-packages?type=combo"
        className="w-full inline-flex justify-center bg-[#5D2A8E]/10 text-[#5D2A8E] px-7 py-4 rounded-2xl font-black tracking-widest text-[10px] uppercase hover:bg-[#5D2A8E] hover:text-white transition-all"
      >
        View All Combo Packages
      </Link>
    </div>
  </div>
</section>

      {/* 5. Recommended Packages Slider Grid */}
      <section className="py-12 bg-white border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-black text-[#2D1347] mb-12 tracking-tight">
            Recommended Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages
              .filter((p) => p.id !== pkg.id)
              .slice(0, 3)
              .map((item) => (
                <Link
                  key={item.id}
                  to={`/tour-packages/${item.slug}`}
                  className="group bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-[#5D2A8E] uppercase tracking-widest">
                      {item.duration}
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-lg font-black text-[#2D1347] group-hover:text-[#D92671] transition-colors mb-4 leading-tight">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <MapPin size={14} className="mr-1 text-[#D92671]" />{" "}
                        {item.location || "Kathmandu"}
                      </div>
                      <div className="text-lg font-black text-[#D92671]">
                        {item.price}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackageDetailPage;
