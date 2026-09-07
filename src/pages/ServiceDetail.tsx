import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { services } from "../assets/data/mockData";
import {
  CheckCircle2,
  MessageCircle,
  Phone,
  ArrowRight,
  Image as ImageIcon,
  MapPin,
  Repeat,
  Shield,
  Plane,
  Compass,
} from "lucide-react";
import SubHero from "../components/reuseable/HeroImage/HeroImg";
import PreFooter from "../components/reuseable/PreFooter";
import ToursDetailContent from "../components/Service/ToursDetailContent";
import ActivitiesDetailContent from "../components/Service/ActivitiesDetailContent";
import TrekkingDetailContent from "../components/Service/TrekkingDetailContent";
import HotelBookingDetailContent from "../components/Service/HotelBookingDetailContent";
import TravelInsuranceDetailContent from "../components/Service/TravelInsuranceDetailContent";
import VehicleRentalDetailContent from "../components/Service/VehicleRentalDetailContent";
import HeliServicesDetailContent from "../components/Service/HeliServicesDetailContent";
import VisaServicesDetailContent from "../components/Service/VisaServicesDetailContent";
import DynamicFaqSection from "../components/reuseable/DynamicFaqSection";

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Find the service by slug or by id
  const service = services.find(
    (s) =>
      s.slug.toLowerCase() === slug?.toLowerCase() ||
      s.id === slug ||
      (slug === "activities" && s.slug === "activities") ||
      (slug === "tours" && s.slug === "tours") ||
      (slug === "trekking" && s.slug === "trekking") ||
      (slug === "air-ticket" && s.slug === "air-ticket") ||
      (slug === "hotel-booking" && s.slug === "hotel-booking") ||
      (slug === "visa-services" && s.slug === "visa-services") ||
      (slug === "travel-insurance" && s.slug === "travel-insurance") ||
      (slug === "vehicle-rental" && s.slug === "vehicle-rental") ||
      (slug === "heli-services" && s.slug === "heli-services") ||
      (slug === "work-permit" && s.slug === "work-permit")
  );

  const [tripType, setTripType] = useState<"one-way" | "two-way">("two-way");
  const [passengerCount, setPassengerCount] = useState("1 Passenger");
  const [originCity, setOriginCity] = useState("Kathmandu");
  const [destinationCity, setDestinationCity] = useState("Pokhara");

  if (!service) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-purple-50/40 to-white flex items-center justify-center px-4 py-20 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-pink-50 flex items-center justify-center text-[#E91E63] shadow-inner">
            <Compass size={40} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E91E63] block mb-2">
            Service Not Found
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D1347] mb-3 tracking-tight">
            Unknown Service
          </h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
            The travel service you requested could not be located. It might have been updated, renamed, or temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-full border border-gray-200 text-xs font-bold text-[#2D1347] hover:bg-gray-50 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Go Back
            </button>
            <Link
              to="/service"
              className="px-6 py-3 rounded-full bg-[#E91E63] hover:bg-pink-600 text-white text-xs font-bold shadow-md shadow-pink-200 transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2"
            >
              <span>Explore Services</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAirTicket =
    service.slug === "air-ticket" ||
    service.name.toLowerCase().includes("air") ||
    service.name.toLowerCase().includes("flight");

  const isTours = service.slug === "tours";
  const isActivities = service.slug === "activities";
  const isTrekking = service.slug === "trekking";
  const isHotelBooking = service.slug === "hotel-booking";
  const isTravelInsurance = service.slug === "travel-insurance";
  const isVehicleRental = service.slug === "vehicle-rental";
  const isHeliServices = service.slug === "heli-services";
  const isVisaServices = service.slug === "visa-services" || service.slug === "visa";
  const isToursOrTreks = isTours || isTrekking || isActivities;

  const faqs = isAirTicket
    ? [
        {
          question: "What do I need to book a domestic or international flight ticket?",
          answer:
            "Share your full name as per passport or citizenship ID, chosen route, travel dates, and preferred timing. We will issue options with real-time pricing and fast confirmation.",
        },
        {
          question: "Can I change, reschedule, or cancel my ticket?",
          answer:
            "Yes, changes and cancellations depend on the specific airline fare rules. Our 24/7 ticketing desk will guide you through any penalties or rebooking steps without hassle.",
        },
        {
          question: "Do you offer group booking discounts?",
          answer:
            "Yes, we provide special corporate and group flight fares with dedicated seat blocks on major domestic and international airlines.",
        },
        {
          question: "How fast do I receive my electronic ticket?",
          answer:
            "Electronic tickets are issued immediately after payment verification and delivered via WhatsApp and Email within minutes.",
        },
      ]
    : [
        {
          question: `How do I request a tailored quote for ${service.name}?`,
          answer:
            "Click 'Request Quotation' or message our team directly on WhatsApp with your planned dates and requirements. We reply with a detailed custom proposal within hours.",
        },
        {
          question: "Can this service be customized according to budget and schedule?",
          answer:
            "Absolutely! All our packages and services are 100% customizable to suit solo travelers, families, corporate delegations, or luxury seekers.",
        },
        {
          question: "What documentation or permits are required?",
          answer:
            "Our dedicated concierge team handles all required government permits, registrations, insurance policies, and paperwork from start to finish.",
        },
        {
          question: "What payment methods are supported?",
          answer:
            "We support eSewa, Khalti, direct bank transfers in NPR/USD, major credit/debit cards, and swift wire transfers for international clients.",
        },
      ];

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I am interested in your "${service.name}" service. Please share details, itineraries, and available dates.`
    );
    window.open(`https://wa.me/9779800000003?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hello Trip Himalaya! I would like to book a ${tripType} flight from ${originCity} to ${destinationCity} for ${passengerCount}. Please share available flights and rates.`
    );
    window.open(`https://wa.me/9779800000002?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  // Curated gallery images fallback if service has none
  const galleryImages = service.gallery && service.gallery.length > 0
    ? service.gallery
    : [
        service.heroImage,
        "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1544016768-982d1554f0b9?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=800",
      ];

  const getServiceBadge = () => {
    if (isTours) return "CURATED EXPERIENCES";
    if (isActivities) return "HIGH ADRENALINE";
    if (isTrekking) return "EPIC TRAILS";
    if (isHotelBooking) return "VERIFIED STAYS";
    if (isTravelInsurance) return "ALTITUDE RESCUE";
    if (isVehicleRental) return "CHAUFFEUR FLEET";
    if (isHeliServices) return "HIMALAYAN HELI TOURS";
    if (isVisaServices) return "EMBASSY VERIFIED";
    return "PREMIUM SERVICE";
  };

  return (
    <div className="w-full bg-[#FBFBFE] font-sans">
      {/* ── 1. HERO SECTION ── */}
      <SubHero
        badge={getServiceBadge()}
        title={service.name}
        description={service.shortDesc}
        backgroundImage={service.heroImage}
      />

      {/* ── 2. FLIGHT SEARCH BAR (If Air Ticket) ── */}
      {isAirTicket && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 bg-purple-50 p-1 rounded-full border border-purple-100">
                <button
                  type="button"
                  onClick={() => setTripType("one-way")}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    tripType === "one-way"
                      ? "bg-[#2D1347] text-white shadow-sm"
                      : "text-purple-900 hover:text-pink-600"
                  }`}
                >
                  One Way
                </button>
                <button
                  type="button"
                  onClick={() => setTripType("two-way")}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    tripType === "two-way"
                      ? "bg-[#2D1347] text-white shadow-sm"
                      : "text-purple-900 hover:text-pink-600"
                  }`}
                >
                  Round Trip
                </button>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(e.target.value)}
                  className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 outline-none cursor-pointer"
                >
                  <option>1 Passenger</option>
                  <option>2 Passengers</option>
                  <option>3 Passengers</option>
                  <option>4+ Group Booking</option>
                </select>
              </div>
            </div>

            <form onSubmit={handleFlightSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* From */}
              <div className="md:col-span-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  From (Origin)
                </label>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#E91E63] flex-shrink-0" />
                  <input
                    type="text"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    placeholder="Kathmandu (KTM)"
                    className="w-full bg-transparent font-bold text-gray-800 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="hidden md:flex md:col-span-1 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const temp = originCity;
                    setOriginCity(destinationCity);
                    setDestinationCity(temp);
                  }}
                  className="w-10 h-10 rounded-full bg-pink-50 text-[#E91E63] hover:bg-pink-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Repeat size={16} />
                </button>
              </div>

              {/* To */}
              <div className="md:col-span-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  To (Destination)
                </label>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#E91E63] flex-shrink-0" />
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    placeholder="Pokhara (PKR)"
                    className="w-full bg-transparent font-bold text-gray-800 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-800 to-pink-600 hover:from-purple-900 hover:to-pink-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plane size={16} />
                  <span>CHECK FARES</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 3. MAIN SERVICE CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          
          {/* Left Column: Dedicated Components for Tours, Activities, Trekking, Hotels, Insurance, Vehicles, or Generic */}
          <div className="lg:col-span-2 space-y-12">
            {isTours ? (
              <ToursDetailContent />
            ) : isActivities ? (
              <ActivitiesDetailContent />
            ) : isTrekking ? (
              <TrekkingDetailContent />
            ) : isHotelBooking ? (
              <HotelBookingDetailContent />
            ) : isTravelInsurance ? (
              <TravelInsuranceDetailContent />
            ) : isVehicleRental ? (
              <VehicleRentalDetailContent />
            ) : isHeliServices ? (
              <HeliServicesDetailContent />
            ) : isVisaServices ? (
              <VisaServicesDetailContent />
            ) : (
              <>
                {/* Overview */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
                  <span className="text-[#E91E63] font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
                    SERVICE OVERVIEW
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight mb-4">
                    Professional &amp; Certified Management
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium">
                    {service.description || service.shortDesc}
                  </p>

                  {/* Action Banner for Tours / Treks */}
                  {isToursOrTreks && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-[#2D1347] text-base">Looking for all packages?</h3>
                        <p className="text-xs text-gray-600 mt-0.5">Explore our complete catalog of curated tours, treks, and adventures.</p>
                      </div>
                      <button
                        onClick={() => navigate("/packages")}
                        className="px-6 py-3 bg-[#E91E63] hover:bg-pink-600 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                      >
                        <span>View All Packages</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-services / Key Features */}
                {service.subServices && service.subServices.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
                    <span className="text-[#E91E63] font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
                      WHAT WE OFFER
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight mb-6">
                      Key Service Options
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.subServices.map((sub, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3.5 p-4 rounded-2xl bg-gray-50/80 hover:bg-pink-50/40 border border-gray-100 transition-all group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-white shadow-xs text-[#E91E63] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E91E63] group-hover:text-white transition-colors">
                            <CheckCircle2 size={18} />
                          </div>
                          <span className="font-bold text-gray-800 text-sm">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Showcase Gallery */}
                {galleryImages.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 rounded-xl bg-pink-50 text-[#E91E63]">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-[#2D1347] tracking-tight">
                          Visual Showcase
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">Moments from recent experiences</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {galleryImages.map((img, i) => (
                        <div key={i} className="h-56 sm:h-64 rounded-2xl overflow-hidden shadow-xs group">
                          <img
                            src={img}
                            alt={`${service.name} preview ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3-Step Process */}
                <div className="bg-gradient-to-br from-[#2D1347] to-[#401863] text-white p-8 sm:p-12 rounded-3xl shadow-xl">
                  <h3 className="text-2xl sm:text-3xl font-black mb-8 tracking-tight">
                    How It Works — Simple 3-Step Process
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      {
                        step: "01",
                        title: "Consult",
                        desc: "Contact us via WhatsApp, phone, or quotation form with your preferred dates and requirements.",
                      },
                      {
                        step: "02",
                        title: "Customize",
                        desc: "Our destination experts create an optimal plan tailored to your budget and specifications.",
                      },
                      {
                        step: "03",
                        title: "Confirm",
                        desc: "Receive immediate bookings, ticket confirmations, vouchers, and 24/7 on-trip assistance.",
                      },
                    ].map((item) => (
                      <div key={item.step} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                        <span className="text-3xl font-black text-pink-400 block mb-2">{item.step}</span>
                        <h4 className="font-black text-base uppercase tracking-wider text-white mb-2">{item.title}</h4>
                        <p className="text-gray-300 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic FAQs Section */}
                <DynamicFaqSection
                  targetType="service"
                  targetId={service.slug}
                  defaultFaqs={faqs}
                  title="Frequently Asked Questions"
                  subtitle={`Everything you need to know about our ${service.name}`}
                />
              </>
            )}
          </div>

          {/* Right Column: Sticky Sidebar with Inquiry & Quick Contacts */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              {/* Inquiry Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 text-center">
                <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block mb-3">
                  FAST RESPONSE
                </span>
                <h3 className="text-xl font-black text-[#2D1347] mb-2">
                  Inquire About {service.name}
                </h3>
                <p className="text-xs text-gray-500 mb-6 font-medium">
                  Connect directly with our dedicated team for instant availability, rates, and customized quotes.
                </p>

                <div className="space-y-3">
                  {/* WhatsApp Button */}
                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle size={17} />
                    <span>WhatsApp Inquiry</span>
                  </button>

                  {/* Phone Call */}
                  <a
                    href="tel:+9779800000000"
                    className="w-full bg-[#2D1347] hover:bg-purple-950 text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer inline-flex"
                  >
                    <Phone size={16} />
                    <span>Call Hotline</span>
                  </a>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Available 24/7 for support</span>
                </div>
              </div>

              {/* Trust & Accreditations Card */}
              <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <Shield size={20} className="text-pink-400" />
                  <h4 className="font-extrabold text-sm uppercase tracking-wider">Government Licensed</h4>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  Trip Himalaya Tours &amp; Travels is a fully certified agency recognized by the Nepal Tourism Board (NTB), NATTA, and TAAN.
                </p>
              </div>

              {/* Back to all services link */}
              <div className="text-center pt-2">
                <Link
                  to="/service"
                  className="text-xs font-bold text-[#E91E63] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>&larr; Back to all services</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── 4. PREFOOTER CTA ── */}
      <PreFooter
        title="Need a Customized Package or Service?"
        description="Our destination specialists are ready to tailor an unforgettable experience for you."
        btn1="Call Us Now"
        btn2="Chat on WhatsApp"
      />
    </div>
  );
};

export default ServiceDetail;
