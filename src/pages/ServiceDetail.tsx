import React, { useState } from "react";
import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
import { services, workPermitTestimonials } from "../assets/data/mockData";
import {
  Compass,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  Heart,
  FileText,
  Users,
  MessageCircle,
  Globe,
  MapPin,
  Plane,
  Mountain,
  Bed,
  Car,
  Wind,
  ShieldCheck,
  Award,
  Camera,
  Hotel,
  Sparkles,
  HeartPulse,
  Activity,
  Calendar,
} from "lucide-react";
import BannerSection from "../components/reuseable/BannerSection";
import HeroSection from "../components/reuseable/HeroSection";
import Testimonials from "../components/reuseable/Testimonials";
import PreFooter from "../components/reuseable/PreFooter";
import DynamicFaqSection from "../components/reuseable/DynamicFaqSection";
import ServiceOverviewSection, {
  type OverviewFeatureItem,
} from "../components/Service/ServiceOverviewSection";
import ServiceProcess, {
  type ProcessStep,
} from "../components/Service/ServiceProcess";
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
  const [activeTab, setActiveTab] = useState("OVERVIEW");

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

  const scrollToSection = (id: string, tabName: string) => {
    setActiveTab(tabName);
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

  const tabs = [
    { name: "OVERVIEW", id: "section-overview" },
    ...(isAirTicket ? [] : [{ name: "SERVICES", id: "section-services" }]),
    { name: "WHY US", id: "section-whyus" },
    { name: "TESTIMONIES", id: "section-testimonies" },
    { name: "PROCESS", id: "section-process" },
    { name: "FAQS", id: "section-faqs" },
  ];

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

  // 3. Overview 6 Feature Cards tailored to each service
  const getOverviewFeatures = (): OverviewFeatureItem[] => {
    if (isAirTicket) {
      return [
        { name: "REAL-TIME FARES", desc: "Live airline inventory & best rates.", icon: Zap },
        { name: "INSTANT E-TICKETS", desc: "Delivered immediately on phone.", icon: Clock },
        { name: "IATA CERTIFIED", desc: "Official domestic & global ticketing.", icon: ShieldCheck },
        { name: "BAGGAGE ASSISTANCE", desc: "Clear luggage allowances.", icon: FileText },
        { name: "24/7 TICKETING DESK", desc: "Flight changes & emergency support.", icon: Users },
        { name: "CORPORATE FARES", desc: "Group seat discounts available.", icon: Sparkles },
      ];
    }
    if (isTours) {
      return [
        { name: "CURATED ITINERARIES", desc: "Top UNESCO heritage & nature.", icon: Compass },
        { name: "PRIVATE TRANSPORT", desc: "Clean AC SUVs, cars & HiAce.", icon: Car },
        { name: "LICENSED GUIDES", desc: "Experienced multilingual experts.", icon: Users },
        { name: "HANDPICKED HOTELS", desc: "Verified stays & luxury resorts.", icon: Hotel },
        { name: "TRANSPARENT PRICING", desc: "Zero hidden charges guaranteed.", icon: Zap },
        { name: "24/7 SUPPORT", desc: "Complete on-trip dedicated care.", icon: ShieldCheck },
      ];
    }
    if (isTrekking) {
      return [
        { name: "SHERPA LEADERS", desc: "Licensed high-altitude native guides.", icon: Mountain },
        { name: "SAFETY FIRST", desc: "Pulse oximeters & medical kits.", icon: HeartPulse },
        { name: "ALL PERMITS SORTED", desc: "TIMS & National Park passes ready.", icon: FileText },
        { name: "TEAHOUSE LODGES", desc: "Best comfortable rooms reserved.", icon: Bed },
        { name: "HELI EVACUATION", desc: "Insurance standby coordination.", icon: Wind },
        { name: "PORTER WELFARE", desc: "Ethical fair-wage equipment support.", icon: Users },
      ];
    }
    if (isActivities) {
      return [
        { name: "APPI CERTIFIED", desc: "Internationally certified pilots.", icon: Award },
        { name: "EUROPEAN GEAR", desc: "Petzl & highest safety gear.", icon: ShieldCheck },
        { name: "HD VIDEO & PHOTOS", desc: "Free action camera footage.", icon: Camera },
        { name: "DOORSTEP PICKUP", desc: "Complimentary hotel transfers.", icon: Car },
        { name: "WEATHER FLEX", desc: "Free rescheduling on bad weather.", icon: Clock },
        { name: "ZERO QUEUE", desc: "Direct instant launch passes.", icon: Zap },
      ];
    }
    if (isHotelBooking) {
      return [
        { name: "VERIFIED STAYS", desc: "Hand-inspected hygienic rooms.", icon: ShieldCheck },
        { name: "BEST RATE GUARANTEE", desc: "Exclusive contracted agency rates.", icon: Zap },
        { name: "COMPLIMENTARY PERKS", desc: "Free breakfast & welcome drinks.", icon: Sparkles },
        { name: "FLEXIBLE CANCEL", desc: "Easy modification terms.", icon: Clock },
        { name: "AIRPORT TRANSFERS", desc: "Free shuttle coordination.", icon: Car },
        { name: "24/7 CONCIERGE", desc: "Late check-in assistance.", icon: Users },
      ];
    }
    if (isVisaServices) {
      return [
        { name: "99.2% SUCCESS RATE", desc: "Thorough pre-submission checks.", icon: ShieldCheck },
        { name: "100% ONLINE FILING", desc: "Fast paperless applications.", icon: Zap },
        { name: "EMBASSY COMPLIANT", desc: "Aligned with current consulate rules.", icon: Award },
        { name: "SLOT BOOKING", desc: "Priority biometric appointments.", icon: Calendar },
        { name: "WHATSAPP TRACKING", desc: "Real-time updates on phone.", icon: MessageCircle },
        { name: "INTERVIEW COACHING", desc: "1-on-1 counseling support.", icon: Users },
      ];
    }
    if (isTravelInsurance) {
      return [
        { name: "HELI RESCUE 6000M", desc: "High-altitude medical evacuation.", icon: Wind },
        { name: "CASHLESS BILLING", desc: "Direct tie-up with top hospitals.", icon: Heart },
        { name: "BAGGAGE LOSS", desc: "Comprehensive delay compensation.", icon: ShieldCheck },
        { name: "TRIP CANCELLATION", desc: "Reimbursement for emergencies.", icon: Clock },
        { name: "INSTANT POLICY", desc: "E-certificate issued in 10 minutes.", icon: Zap },
        { name: "EMBASSY ACCEPTED", desc: "Valid for Schengen & Worldwide.", icon: Award },
      ];
    }
    if (isVehicleRental) {
      return [
        { name: "VERIFIED CHAUFFEURS", desc: "Courteous & licensed drivers.", icon: Users },
        { name: "FUEL & TOLLS INCLUDED", desc: "Zero surprise costs.", icon: Zap },
        { name: "CLEAN & AC FLEET", desc: "Sanitized modern vehicles.", icon: Sparkles },
        { name: "GPS TRACKED", desc: "Full safety & real-time monitoring.", icon: ShieldCheck },
        { name: "PROMPT ARRIVAL", desc: "Guaranteed on-time doorstep pickup.", icon: Clock },
        { name: "PAN-NEPAL PERMITS", desc: "Smooth travel across all districts.", icon: FileText },
      ];
    }
    // Heli Services
    return [
      { name: "WINDOW SEAT ASSURED", desc: "Panoramic Himalayan aerial views.", icon: Sparkles },
      { name: "EBC TOUCHDOWN", desc: "Everest landing & photography.", icon: Camera },
      { name: "OXYGEN ONBOARD", desc: "Full high-altitude safety setup.", icon: HeartPulse },
      { name: "VETERAN CAPTAINS", desc: "Over 10,000 mountain flight hours.", icon: Award },
      { name: "INSTANT DISPATCH", desc: "Prompt takeoff clearances.", icon: Zap },
      { name: "CIVIL AVIATION OK", desc: "Rigorous safety adherence.", icon: ShieldCheck },
    ];
  };

  // 4. Why Us Items
  const getWhyUsFeatures = () => {
    return [
      { name: "EXPERIENCED PROCESSING TEAM", icon: Shield },
      { name: "TRANSPARENT PRICING SYSTEM", icon: Zap },
      { name: "FAST & TIMELY RESPONSE", icon: Clock },
      { name: "GOVERNMENT COMPLIANT PROCESS", icon: FileText },
      { name: "TRUSTED BY HUNDREDS OF CLIENTS", icon: Heart },
    ];
  };

  // 5. 4-Step Process tailored to each service
  const getServiceSteps = (): ProcessStep[] => {
    if (isAirTicket) {
      return [
        { number: 1, title: "SELECT ROUTE & DATES", description: "Search domestic mountain flights or international global destinations." },
        { number: 2, title: "COMPARE AIRLINE FARES", description: "Receive real-time seat availability, timings, and lowest ticket fares." },
        { number: 3, title: "INSTANT E-TICKET ISSUANCE", description: "Secure payment with immediate delivery via WhatsApp and email." },
        { number: 4, title: "24/7 FLIGHT ASSISTANCE", description: "Free online web check-in, reschedule support, and baggage guidance." },
      ];
    }
    if (isTours) {
      return [
        { number: 1, title: "CHOOSE DESTINATION & STYLE", description: "Select heritage, lake views, wildlife safari, or luxury circuits." },
        { number: 2, title: "CUSTOMIZE ITINERARY", description: "Tailor hotel tiers, private transport, and personalized activities." },
        { number: 3, title: "CONFIRMATION & PERMITS", description: "Receive instant booking vouchers, permits, and airport reception plan." },
        { number: 4, title: "IMMERSIVE EXPERIENCE", description: "Enjoy seamless guided sightseeing with a 24/7 dedicated concierge." },
      ];
    }
    if (isTrekking) {
      return [
        { number: 1, title: "SELECT TRAIL & REGION", description: "Everest, Annapurna, Langtang, Manaslu, or remote wilderness circuits." },
        { number: 2, title: "PRE-TREK GEAR & BRIEFING", description: "Comprehensive packing advice, acclimatization schedule, and permits." },
        { number: 3, title: "EXPEDITION COMMENCES", description: "Guided by licensed Sherpas with reserved teahouse accommodations." },
        { number: 4, title: "SAFE SUMMIT & RETURN", description: "Daily health monitoring, emergency heli standby, and celebratory return." },
      ];
    }
    if (isVisaServices) {
      return [
        { number: 1, title: "CHOOSE COUNTRY & VISA TYPE", description: "Select tourist, visit, transit, or business visa assistance." },
        { number: 2, title: "SUBMIT REQUIRED DOCUMENTS", description: "Online document verification and consulate compliance check." },
        { number: 3, title: "EMBASSY FILING & TRACKING", description: "Direct application filing, appointment booking, and live tracking." },
        { number: 4, title: "VISA APPROVAL", description: "Receive your authentic verified visa with complete pre-travel advice." },
      ];
    }
    return [
      { number: 1, title: "CHOOSE OPTION & INQUIRE", description: "Select your preferred service package from our catalog." },
      { number: 2, title: "CUSTOMIZE & QUOTATION", description: "Our dedicated travel specialists tailor dates and requirements." },
      { number: 3, title: "FAST CONFIRMATION", description: "Receive verified digital vouchers, tickets, and clear pricing." },
      { number: 4, title: "SEAMLESS EXPERIENCE", description: "Enjoy certified hospitality, licensed experts, and 24/7 support." },
    ];
  };

  // 6. Faqs tailored to service
  const getFaqs = () => {
    if (isAirTicket) {
      return [
        { question: "What do I need to book a domestic or international flight ticket?", answer: "Share your full name as per passport or citizenship ID, chosen route, travel dates, and preferred timing. We issue options with real-time pricing and fast confirmation." },
        { question: "Can I change, reschedule, or cancel my ticket?", answer: "Yes, changes and cancellations depend on the specific airline fare rules. Our 24/7 ticketing desk will guide you through any penalties or rebooking steps without hassle." },
        { question: "Do you offer group booking discounts?", answer: "Yes, we provide special corporate and group flight fares with dedicated seat blocks on major domestic and international airlines." },
        { question: "How fast do I receive my electronic ticket?", answer: "Electronic tickets are issued immediately after payment verification and delivered via WhatsApp and Email within minutes." },
      ];
    }
    return [
      { question: `How do I request a tailored quote for ${service.name}?`, answer: "Click 'WhatsApp Inquiry' or message our team directly with your planned dates and requirements. We reply with a detailed custom proposal within hours." },
      { question: "Can this service be customized according to budget and schedule?", answer: "Absolutely! All our packages and services are 100% customizable to suit solo travelers, families, corporate delegations, or luxury seekers." },
      { question: "What documentation or permits are required?", answer: "Our dedicated concierge team handles all required government permits, registrations, insurance policies, and paperwork from start to finish." },
      { question: "What payment methods are supported?", answer: "We support eSewa, Khalti, direct bank transfers in NPR/USD/INR, major credit/debit cards, and swift wire transfers for international clients." },
    ];
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
        <div className="w-full relative shadow-md bg-white">
          {/* ── 1. TOP BANNER SECTION (With 1. Title at top, 2. SearchBar in middle, 3. Quote below) ── */}
          <BannerSection
            background={service.heroImage}
            alt={service.name}
            heading={getBannerHeading()}
            title={service.name}
            description={service.shortDesc}
            searchBar={renderFloatingSearchBar()}
          />

          {/* ── 3. SUB-NAVIGATION TABS (Exact Work Permit Tab Bar) ── */}
          <div className="mt-8 flex justify-center items-center px-4 overflow-x-auto">
            <div className="flex gap-4 sm:gap-8 border-b border-gray-200 pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id, tab.name)}
                  className={`py-1 font-bold tracking-widest text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.name
                      ? "border-b-2 border-pink-600 text-pink-600 -mb-[9px]"
                      : "text-purple-950 hover:text-pink-500"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. OVERVIEW SECTION (Left text & buttons, Right 6 rounded cards) ── */}
        <div id="section-overview" className="w-full max-w-7xl px-4 sm:px-6 md:px-8 mt-8">
          <ServiceOverviewSection
            serviceName={service.name}
            description={service.description || service.shortDesc}
            features={getOverviewFeatures()}
            whatsappMessage={`Hello Trip Himalaya! I am interested in your "${service.name}" service. Please share details and pricing.`}
          />
        </div>
      </div>

      {/* ── 5. SERVICES SECTION (Full width, soft gradient, dedicated interactive component) ── */}
      {!isAirTicket && (
        <div
          id="section-services"
          className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-blue-100/30 via-blue-50/20 to-pink-50/40 mt-8"
        >
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-8">
              <h2 className="text-xs text-pink-500 tracking-widest font-bold mb-2 uppercase">
                {getServicesSectionBadge()}
              </h2>
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-purple-950 font-extrabold">
                {getServicesSectionTitle()}
              </h1>
            </header>

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

      {/* ── 6. WHY US SECTION (Exact HeroSection with background image & 5 icons) ── */}
      <div id="section-whyus">
        <HeroSection
          title="WHY CHOOSE US"
          subject={`Why Choose Trip Himalaya for ${service.name}?`}
          description="Reliable support, transparent pricing, verified operators, and a team that takes responsibility from start to finish."
          backgroundImage={service.heroImage}
          services={getWhyUsFeatures()}
        />
      </div>

      {/* ── 7. TESTIMONIES SECTION (Exact Testimonials carousel) ── */}
      <div id="section-testimonies">
        <Testimonials workTest={workPermitTestimonials} />
      </div>

      {/* ── 8. PROCESS SECTION (Exact 4-Step Circle Workflow) ── */}
      <div id="section-process">
        <ServiceProcess steps={getServiceSteps()} />
      </div>

      {/* ── 9. FAQS SECTION (Dynamic Accordion) ── */}
      <div id="section-faqs" className="w-full max-w-5xl mx-auto px-4 py-12">
        <DynamicFaqSection
          targetType="service"
          targetId={service.slug}
          defaultFaqs={getFaqs()}
          title="Frequently Asked Questions"
          subtitle={`Everything you need to know about our ${service.name}`}
        />
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
