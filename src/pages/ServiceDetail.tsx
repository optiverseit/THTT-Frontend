import React from "react";
import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
import { services, workPermitTestimonials, packages } from "../assets/data/mockData";
import {
  Compass,
  ArrowRight,
  Shield,
  Clock,
  Heart,
  HeartPulse,
  FileText,
  Users,
  Globe,
  MapPin,
  Plane,
  Mountain,
  Bed,
  Car,
  Wind,
  ShieldCheck,
  Sparkles,
  Activity,
  Star,
  ChevronUp,
  ChevronDown,
  Building2,
  Award,
  HeartHandshake,
  Stethoscope,
  Globe2,
  Zap,
  Fuel,
} from "lucide-react";
import BannerSection from "../components/reuseable/BannerSection";
import Testimonials from "../components/reuseable/Testimonials";
import PreFooter from "../components/reuseable/PreFooter";
import ToursDetailContent from "../components/Service/ToursDetailContent";
import ActivitiesDetailContent from "../components/Service/ActivitiesDetailContent";
import TrekkingDetailContent from "../components/Service/TrekkingDetailContent";
import HotelBookingDetailContent from "../components/Service/HotelBookingDetailContent";
import TravelInsuranceDetailContent from "../components/Service/TravelInsuranceDetailContent";
import VehicleRentalDetailContent from "../components/Service/VehicleRentalDetailContent";
import HeliServicesDetailContent from "../components/Service/HeliServicesDetailContent";
import VisaServicesDetailContent from "../components/Service/VisaServicesDetailContent";

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // If slug is work-permit, redirect to dedicated /work-permit route
  if (slug === "work-permit") {
    return <Navigate to="/work-permit" replace />;
  }

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
      (slug === "heli-services" && s.slug === "heli-services")
  );

  const scrollToSection = (id: string, _tabName?: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // account for sticky 3-tier header
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

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



  // 1. Banner Subtitle
  const getBannerHeading = () => {
    if (isAirTicket) return "DOMESTIC & INTERNATIONAL AIR TICKETING";
    if (isTours) return "UNESCO HERITAGE & SCENIC HOLIDAYS";
    if (isActivities) return "HIGH ADRENALINE ADVENTURE EXPERIENCES";
    if (isTrekking) return "LEGENDARY HIMALAYAN ALPINE EXPEDITIONS";
    if (isHotelBooking) return "LUXURY RESORTS & VERIFIED HOTEL STAYS";
    if (isVisaServices) return "EMBASSY VERIFIED VISA COUNSELING & FILING";
    if (isTravelInsurance) return "HIGH-ALTITUDE MEDICAL & EMERGENCY COVERAGE";
    if (isVehicleRental) return "CHAUFFEUR DRIVEN PRIVATE & TOURIST FLEET";
    if (isHeliServices) return "VIP EVEREST & HIMALAYAN HELI TOURS";
    return "PREMIUM TRAVEL & CONCIERGE SERVICES";
  };

  // 2. Floating Search Bar Config tailored to each service
  const renderFloatingSearchBar = () => {
    if (isAirTicket) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Plane size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                FROM (ORIGIN)
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="ktm">Kathmandu (KTM)</option>
                <option value="pkr">Pokhara (PKR)</option>
                <option value="lua">Lukla (LUA)</option>
                <option value="bhr">Bharatpur / Chitwan (BHR)</option>
                <option value="bwa">Bhairahawa / Lumbini (BWA)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <MapPin size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                TO (DESTINATION)
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="pkr">Pokhara (PKR)</option>
                <option value="lua">Lukla / Everest (LUA)</option>
                <option value="dxb">Dubai (DXB)</option>
                <option value="bkk">Bangkok (BKK)</option>
                <option value="del">New Delhi (DEL)</option>
                <option value="sin">Singapore (SIN)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => scrollToSection("section-overview", "OVERVIEW")}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isTours) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Globe size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SELECT DESTINATION
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="">All Destinations</option>
                <option value="ktm">Kathmandu Valley</option>
                <option value="pkr">Pokhara &amp; Annapurna</option>
                <option value="chitwan">Chitwan &amp; Wildlife</option>
                <option value="lumbini">Lumbini (Birthplace of Buddha)</option>
                <option value="intl">International Holidays</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Compass size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                TOUR CATEGORY
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="">All Categories</option>
                <option value="heritage">UNESCO Heritage &amp; Culture</option>
                <option value="nature">Scenic Nature &amp; Lakes</option>
                <option value="safari">Jungle Wildlife Safari</option>
                <option value="luxury">Luxury Vacations</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => scrollToSection("section-services", "SERVICES")}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isTrekking) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Mountain size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                HIMALAYAN REGION
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="">All Mountain Regions</option>
                <option value="everest">Everest (Khumbu) Region</option>
                <option value="annapurna">Annapurna Sanctuary &amp; Circuit</option>
                <option value="langtang">Langtang Valley &amp; Gosainkunda</option>
                <option value="manaslu">Manaslu &amp; Restricted Areas</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Clock size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                TREK DURATION
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="">All Durations</option>
                <option value="short">Short Treks (3 – 7 Days)</option>
                <option value="classic">Classic Treks (8 – 14 Days)</option>
                <option value="expedition">Expeditions (15+ Days)</option>
                <option value="heli-return">Helicopter Return Combos</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => scrollToSection("section-services", "SERVICES")}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isActivities) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Activity size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                CHOOSE ADVENTURE
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="">All Adventures</option>
                <option value="paragliding">Tandem Paragliding</option>
                <option value="bungee">Bungee Jumping (228m Kushma)</option>
                <option value="rafting">Whitewater River Rafting</option>
                <option value="zipflyer">Steepest ZipFlyer (140 km/h)</option>
                <option value="canyon">Canyoning &amp; Abseiling</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <MapPin size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                ACTIVITY LOCATION
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="">All Locations</option>
                <option value="pokhara">Pokhara &amp; Sarangkot</option>
                <option value="kushma">Kushma (Kali Gandaki)</option>
                <option value="bhotekoshi">Bhote Koshi River Valley</option>
                <option value="trishuli">Trishuli River Gorge</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => scrollToSection("section-services", "SERVICES")}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isHotelBooking) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <MapPin size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                CITY / REGION
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="">All Cities</option>
                <option value="kathmandu">Kathmandu &amp; Thamel</option>
                <option value="pokhara">Pokhara Lakeside</option>
                <option value="chitwan">Chitwan Sauraha</option>
                <option value="nagarkot">Nagarkot Mountain View</option>
                <option value="lumbini">Lumbini Heritage</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Bed size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                PROPERTY TYPE
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="">All Property Types</option>
                <option value="5star">5-Star Luxury Resorts</option>
                <option value="boutique">Heritage Boutique Hotels</option>
                <option value="resort">Scenic Eco Lodges</option>
                <option value="deluxe">Standard Deluxe Stays</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => scrollToSection("section-services", "SERVICES")}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isVisaServices) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Globe size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                SELECT DESTINATION
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="">All Destinations</option>
                <option value="uae">UAE (Dubai / Abu Dhabi)</option>
                <option value="thailand">Thailand</option>
                <option value="singapore">Singapore</option>
                <option value="japan">Japan</option>
                <option value="schengen">Schengen Europe</option>
                <option value="uk">United Kingdom</option>
                <option value="usa">USA</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <FileText size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                VISA CATEGORY
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="tourist">Tourist / Visit Visa</option>
                <option value="business">Business Visa</option>
                <option value="transit">Transit Visa</option>
                <option value="express">Express Fast-Track Filing</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => scrollToSection("section-services", "SERVICES")}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isTravelInsurance) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Shield size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                COVERAGE DESTINATION
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="">High Altitude Nepal Trekking (Up to 6000m)</option>
                <option value="schengen">Schengen &amp; Europe Compliant</option>
                <option value="worldwide">Worldwide International Travel</option>
                <option value="domestic">Domestic Nepal Tours</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Heart size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                POLICY TIER
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="gold">Gold (Heli Rescue + Hospitalization)</option>
                <option value="platinum">Platinum (Comprehensive All-Inclusive)</option>
                <option value="silver">Silver (Standard Medical Only)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => scrollToSection("section-services", "SERVICES")}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
          >
            SEARCH
          </button>
        </div>
      );
    }

    if (isVehicleRental) {
      return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Car size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                VEHICLE CLASS
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="">All Vehicles</option>
                <option value="sedan">Private Sedan Car (4 Seat)</option>
                <option value="suv">4x4 Scorpio / Prado SUV (7 Seat)</option>
                <option value="hiace">Toyota HiAce Van (14 Seat)</option>
                <option value="coaster">Tourist Coaster Bus (22 Seat)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Clock size={18} className="text-pink-500 flex-shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                RENTAL TYPE
              </label>
              <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
                <option value="airport">Airport Pickup / Drop</option>
                <option value="day">Full Day City Sightseeing</option>
                <option value="outstation">Outstation (Pokhara, Chitwan)</option>
                <option value="multiday">Multi-Day Custom Tour</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => scrollToSection("section-services", "SERVICES")}
            className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
          >
            SEARCH
          </button>
        </div>
      );
    }

    // Heli Services
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
          <Wind size={18} className="text-pink-500 flex-shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              HELI ROUTE
            </label>
            <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
              <option value="ebc">Everest Base Camp &amp; Kalapathar</option>
              <option value="abc">Annapurna Base Camp</option>
              <option value="langtang">Langtang Valley &amp; Kyanjin</option>
              <option value="muktinath">Muktinath Pilgrimage</option>
              <option value="gosaikunda">Gosaikunda Holy Lake</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
          <Users size={18} className="text-pink-500 flex-shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              FLIGHT TYPE
            </label>
            <select className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none py-1 cursor-pointer">
              <option value="charter">Private VIP Charter</option>
              <option value="sharing">Group Sharing Seat</option>
              <option value="rescue">Emergency Medical Standby</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => scrollToSection("section-services", "SERVICES")}
          className="rounded-xl sm:rounded-2xl bg-pink-600 hover:bg-pink-700 py-3.5 sm:py-4 px-8 text-white font-bold text-xs tracking-wider transition-colors shadow-md whitespace-nowrap cursor-pointer"
        >
          SEARCH
        </button>
      </div>
    );
  };





  // Section titles
  const getServicesSectionBadge = () => {
    if (isAirTicket) return "TICKETING PARTNERS";
    if (isTours) return "FEATURED TOUR PACKAGES";
    if (isTrekking) return "ALPINE EXPEDITIONS";
    if (isActivities) return "ADVENTURE OPTIONS";
    if (isHotelBooking) return "VERIFIED PROPERTIES";
    if (isVisaServices) return "DESTINATIONS";
    if (isTravelInsurance) return "INSURANCE PLANS";
    if (isVehicleRental) return "FLEET SELECTION";
    if (isHeliServices) return "HELI PACKAGES";
    return "AVAILABLE SERVICES";
  };

  const getServicesSectionTitle = () => {
    if (isAirTicket) return "Authorized Airline Partners & Global Booking";
    if (isTours) return "Curated Holiday Tours & Packages";
    if (isTrekking) return "Himalayan Trekking Expeditions";
    if (isActivities) return "Extreme Adventure Experiences";
    if (isHotelBooking) return "Featured Hotels & Luxury Resorts";
    if (isVisaServices) return "Our Visa Counseling Services";
    if (isTravelInsurance) return "Comprehensive Coverage Plans";
    if (isVehicleRental) return "Modern Vehicle Rental Fleet";
    if (isHeliServices) return "VIP Helicopter Flight Packages";
    return `Our ${service.name} Offerings`;
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="w-full relative shadow-md bg-white border-b border-gray-200">
          {/* ── 1. TOP BANNER SECTION (With 1. Title at top, 2. SearchBar in middle, 3. Quote below) ── */}
          {isTours ? (
            /* ── TOURS HERO BANNER (Exactly matching Adventure Activities) ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
                    {getBannerHeading()}
                  </span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
                    {service.name}
                  </h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">
                  {renderFloatingSearchBar()}
                </div>
                {service.shortDesc && (
                  <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">
                    "{service.shortDesc}"
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3 px-0">
                  {[
                    { icon: Compass, label: `${packages.filter((p) => p.type === "tour").length}+ Curated Tours`, desc: "Nepal & International", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: Sparkles, label: "100% Tailor-Made", desc: "Customized for you", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: ShieldCheck, label: "Govt Certified Guides", desc: "Multilingual Experts", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: Star, label: "4.9/5 Rating", desc: "Trusted by 5,000+ Guests", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${stat.color} group-hover:scale-105 transition-transform`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex flex-col text-left min-w-0">
                          <h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4>
                          <p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

          ) : isActivities ? (
            /* ── ACTIVITIES HERO BANNER (Original, unchanged) ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
                    {getBannerHeading()}
                  </span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
                    {service.name}
                  </h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">
                  {renderFloatingSearchBar()}
                </div>
                {service.shortDesc && (
                  <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">
                    "{service.shortDesc}"
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3 px-0">
                  {[
                    { icon: Activity, label: `${packages.filter((p) => p.type === "activity" || p.type === "combo").length}+ Thrill Sports`, desc: "Air, River & Land", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: ShieldCheck, label: "100% Certified Safety", desc: "CE & UIAA Approved", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: Wind, label: "4K Action Media", desc: "Photos & Video Included", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: Star, label: "Zero Compromise", desc: "Strict Safety Protocols", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${stat.color} group-hover:scale-105 transition-transform`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex flex-col text-left min-w-0">
                          <h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4>
                          <p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

          ) : isTrekking ? (
            /* ── TREKKING HERO BANNER (Exactly matching Adventure Activities) ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">
                    {getBannerHeading()}
                  </span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
                    {service.name}
                  </h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">
                  {renderFloatingSearchBar()}
                </div>
                {service.shortDesc && (
                  <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">
                    "{service.shortDesc}"
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3 px-0">
                  {[
                    { icon: Mountain, label: `${packages.filter((p) => p.type === "trek").length}+ Epic Trails`, desc: "Everest, Annapurna & Beyond", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: HeartPulse, label: "Daily Oximeter Checks", desc: "Altitude Safety First", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: ShieldCheck, label: "Licensed Sherpas", desc: "Native Mountain Experts", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                    { icon: Sparkles, label: "24/7 Heli Standby", desc: "Emergency Medical Rescue", color: "text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25" },
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${stat.color} group-hover:scale-105 transition-transform`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex flex-col text-left min-w-0">
                          <h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4>
                          <p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

          ) : isHotelBooking ? (
            /* ── HOTEL BOOKING HERO ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">{renderFloatingSearchBar()}</div>
                {service.shortDesc && <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">"{service.shortDesc}"</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
                  {[
                    { icon: Building2, label: "500+ Partner Hotels", desc: "Heritage & 5-Star Luxury" },
                    { icon: Award, label: "Best Rate Guarantee", desc: "Up to 30% Below OTAs" },
                    { icon: ShieldCheck, label: "Free Cancellation", desc: "Flexible Date Changes" },
                    { icon: HeartHandshake, label: "VIP Perks Included", desc: "Free Breakfast & Airport Pickup" },
                  ].map((stat, idx) => { const Icon = stat.icon; return (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform"><Icon size={14} /></div>
                      <div className="flex flex-col text-left min-w-0"><h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4><p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p></div>
                    </div>
                  ); })}
                </div>
              </div>
            </section>

          ) : isTravelInsurance ? (
            /* ── TRAVEL INSURANCE HERO ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">{renderFloatingSearchBar()}</div>
                {service.shortDesc && <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">"{service.shortDesc}"</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
                  {[
                    { icon: Activity, label: "Up to 6,000m+ Covered", desc: "EBC, ABC & Alpine Circuits" },
                    { icon: Zap, label: "45-Min Heli Dispatch", desc: "Immediate Alpine Evacuation" },
                    { icon: Stethoscope, label: "Cashless Hospitalization", desc: "Top International Hospitals" },
                    { icon: Globe2, label: "Schengen Visa Approved", desc: "Embassy Certified Policies" },
                  ].map((stat, idx) => { const Icon = stat.icon; return (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform"><Icon size={14} /></div>
                      <div className="flex flex-col text-left min-w-0"><h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4><p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p></div>
                    </div>
                  ); })}
                </div>
              </div>
            </section>

          ) : isVehicleRental ? (
            /* ── VEHICLE RENTAL HERO ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">{renderFloatingSearchBar()}</div>
                {service.shortDesc && <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">"{service.shortDesc}"</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
                  {[
                    { icon: Car, label: "50+ Fleet Vehicles", desc: "4x4 SUVs, Sedans & Vans" },
                    { icon: ShieldCheck, label: "Chauffeur Included", desc: "Mountain-Licensed Drivers" },
                    { icon: Fuel, label: "All-Inclusive Pricing", desc: "Fuel, Tolls & Parking Covered" },
                    { icon: Zap, label: "24/7 Rapid Replacement", desc: "Zero Downtime Guarantee" },
                  ].map((stat, idx) => { const Icon = stat.icon; return (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform"><Icon size={14} /></div>
                      <div className="flex flex-col text-left min-w-0"><h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4><p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p></div>
                    </div>
                  ); })}
                </div>
              </div>
            </section>

          ) : isHeliServices ? (
            /* ── HELI SERVICES HERO ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">{renderFloatingSearchBar()}</div>
                {service.shortDesc && <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">"{service.shortDesc}"</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
                  {[
                    { icon: Plane, label: "3,000+ Tours Completed", desc: "All Nepal Himalayan Routes" },
                    { icon: Mountain, label: "5,600m Max Altitude", desc: "Everest Base Camp & Beyond" },
                    { icon: Compass, label: "12+ Regions Covered", desc: "National Coverage" },
                    { icon: Shield, label: "100% Safety Record", desc: "Zero Incident History" },
                  ].map((stat, idx) => { const Icon = stat.icon; return (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform"><Icon size={14} /></div>
                      <div className="flex flex-col text-left min-w-0"><h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4><p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p></div>
                    </div>
                  ); })}
                </div>
              </div>
            </section>

          ) : (
            /* ── VISA SERVICES HERO (default) ── */
            <section className="relative min-h-[500px] sm:min-h-[480px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 pb-7 sm:pb-8">
              <img src={service.heroImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/65 to-[#2D1347]/45" />
              <div className="relative z-10 text-center px-4 max-w-5xl w-full mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 sm:mt-1.5">
                  <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.25em] mb-2 sm:mb-3 shadow-lg">{getBannerHeading()}</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">{service.name}</h1>
                  <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-[#E91E63] mx-auto rounded-full mb-2 sm:mb-2.5 shadow-md" />
                </div>
                <div className="w-full max-w-4xl my-5 sm:my-6 relative z-20">{renderFloatingSearchBar()}</div>
                {service.shortDesc && <p className="text-white/90 text-[10px] sm:text-[13px] font-medium max-w-xs sm:max-w-xl mx-auto leading-snug sm:leading-relaxed italic drop-shadow-xs px-2 sm:px-4 my-1 sm:my-1.5">"{service.shortDesc}"</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[725px] mx-auto mt-2.5 sm:mt-3">
                  {[
                    { icon: Shield, label: "98.4% Approval Rate", desc: "Visas Successfully Approved" },
                    { icon: Globe2, label: "45+ Destinations", desc: "Worldwide Coverage" },
                    { icon: Clock, label: "3-5 Days Turnaround", desc: "Fast Processing" },
                    { icon: Zap, label: "24/7 Embassy Support", desc: "Always Available" },
                  ].map((stat, idx) => { const Icon = stat.icon; return (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg py-2 px-2.5 rounded-xl border border-white/60 shadow-xs hover:shadow-sm hover:bg-white/85 hover:border-[#E91E63]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default flex flex-row items-center gap-2 group min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border text-[#E91E63] bg-pink-50/80 border-[#E91E63]/25 group-hover:scale-105 transition-transform"><Icon size={14} /></div>
                      <div className="flex flex-col text-left min-w-0"><h4 className="font-bold text-[#2D1347] text-[10px] sm:text-[11px] leading-tight group-hover:text-[#E91E63] transition-colors break-words">{stat.label}</h4><p className="text-[#2D1347]/70 text-[8.5px] sm:text-[9.5px] mt-0.5 font-medium leading-tight break-words">{stat.desc}</p></div>
                    </div>
                  ); })}
                </div>
              </div>
            </section>
          )}

          {/* ── 3. FULL-WIDTH DIVIDER LINE WITH SHADOW (Sub-navigation tab texts removed as requested) ── */}
          <div className="w-full border-b border-gray-200/90 shadow-xs" />
        </div>
      </div>

      {/* ── 5. SERVICES SECTION (Full width, soft gradient, dedicated interactive component) ── */}
      {!isAirTicket && (
        <div
          id="section-services"
          className="w-full pt-8 sm:pt-9 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-blue-100/30 via-blue-50/20 to-pink-50/40 mt-3 sm:mt-4"
        >
          <div className="max-w-7xl mx-auto">
            {!isTours && !isActivities && !isTrekking && (
              <header className="text-center mb-8">
                <h2 className="text-xs text-pink-500 tracking-widest font-bold mb-2 uppercase">
                  {getServicesSectionBadge()}
                </h2>
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-purple-950 font-extrabold">
                  {getServicesSectionTitle()}
                </h1>
              </header>
            )}

            {/* Dedicated Interactive Component for each Service */}
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
            ) : (
              <VisaServicesDetailContent />
            )}
          </div>
        </div>
      )}

      {/* ── 7. TESTIMONIES SECTION (Exact Testimonials carousel) ── */}
      <div id="section-testimonies">
        <Testimonials workTest={workPermitTestimonials} />
      </div>

      {/* ── 10. PREFOOTER CTA ── */}
      <PreFooter
        title={`Ready to Book Your ${service.name}?`}
        description="Search options or connect with our specialist team for personalized guidance."
        btn1="Call Hotline"
        btn2="WhatsApp Inquiry"
      />
    </>
  );
};

export default ServiceDetail;
