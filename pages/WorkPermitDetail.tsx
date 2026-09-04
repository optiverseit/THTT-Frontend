import React, { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import NepaliDatePicker from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import html2canvas from "html2canvas";

import {
  ShieldCheck,
  Clock,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Phone,
  FileText,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Plane,
  Map,
  Bed,
  Car,
  Shield,
  X,
  Upload,
  Calendar,
  ChevronDown,
  Printer,
} from "lucide-react";
import { workPermitCountries } from "../data/mockData";
import ServicesStrip from "@/components/Layout/ServicesStrip";

const WorkPermitDetail: React.FC = () => {
  const { countryId } = useParams<{ countryId: string }>();
  const country =
    workPermitCountries.find((c) => c.id === countryId) ||
    workPermitCountries[0];

  const pricing = [
    { ageGroup: "Below 35 years", cost: "Rs. 11,000" },
    { ageGroup: "35-50 years", cost: "Rs. 12,500" },
    { ageGroup: "Above 51 years", cost: "Rs. 15,500" },
  ];

  const documents = [
    "Original Passport (Scan Copy)",
    "Valid Job Offer Letter / Visa Copy",
    "Experience Certificates (if applicable)",
    "MRP Size Photo (Recent)",
    "Police Clearance Report (if required)",
  ];

  const otherServices = [
    {
      id: 1,
      title: "Air Ticketing",
      link: "/services/air-ticket",
      icon: <Plane />,
    },
    {
      id: 2,
      title: "Tour Packages",
      link: "/services/tour-packages",
      icon: <Map />,
    },
    {
      id: 3,
      title: "Hotel Booking",
      link: "/services/hotel-booking",
      icon: <Bed />,
    },
    {
      id: 4,
      title: "Vehicle Rental",
      link: "/services/vehicle-rental",
      icon: <Car />,
    },
    {
      id: 5,
      title: "Visa services",
      link: "/services/visa-services",
      icon: <Shield />,
    },
  ];

  const [openEnquiry, setOpenEnquiry] = useState(false);
  const [showProcessPopup, setShowProcessPopup] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printContentRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    dateOfBirth: "",
    dateOfBirthBS: "",
    country: "",
    servicePermitType: "",
    passportCopy: null,
    arriveStamp: null,
    visaCopy: null,
    companyChange: false,
    agreementPaper: null,
  });

  const [age, setAge] = useState("");

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    setFormData({ ...formData, dateOfBirth: dob });
    setAge(calculateAge(dob));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShowProcessPopup(false);
  };

  const handlePrint = async () => {
    if (!printContentRef.current) return;
    
    setIsPrinting(true);
    
    try {
      // Temporarily hide popup and other interfering elements
      const popup = document.querySelector('.fixed.inset-0.z-\\[150\\]');
      if (popup) {
        popup.classList.add('hidden');
      }

      // Capture the content as canvas
      const canvas = await html2canvas(printContentRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: false,
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          // Ensure all elements are visible in the clone
          const clonedContent = clonedDoc.querySelector('.print-content');
          if (clonedContent) {
            clonedContent.classList.remove('no-print');
          }
        }
      });

      // Convert canvas to image
      const imageData = canvas.toDataURL('image/png');

      // Create print window
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${country.name} Work Permit - Print View</title>
              <style>
                @page {
                  size: A4;
                  margin: 0;
                }
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: white;
                  min-height: 100vh;
                }
                img {
                  width: 100%;
                  height: auto;
                  display: block;
                  box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                @media print {
                  body {
                    background: white;
                  }
                  img {
                    box-shadow: none;
                    page-break-after: avoid;
                    page-break-before: avoid;
                  }
                }
              </style>
            </head>
            <body>
              <img src="${imageData}" alt="${country.name} Work Permit Details" style="max-width: 100%; height: auto;" />
              <script>
                window.onload = function() {
                  setTimeout(() => {
                    window.print();
                    setTimeout(() => {
                      window.close();
                    }, 1000);
                  }, 500);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }

      // Restore popup visibility
      if (popup) {
        popup.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Print failed:', error);
      alert('Failed to generate print. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <section>
      <div className="bg-slate-50 min-h-screen pb-10 pt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Print Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className={`flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all text-[#2D1347] border border-slate-200 ${
                isPrinting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Printer size={18} />
              <span className="font-bold text-sm">
                {isPrinting ? 'Preparing...' : 'Print this page'}
              </span>
            </button>
          </div>

          {/* Main Content - Exactly as designed */}
          <div ref={printContentRef} className="print-content">
            {/* Header Block */}
            <div className="relative p-12 md:p-24 rounded-[4rem] shadow-2xl border border-slate-100 mb-12 overflow-hidden">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{
                  backgroundImage: `url(${country.backgroundImage})`,
                }}
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 backdrop-blur-[2px]" />

              {/* Content */}
              <div className="relative z-20 text-white">
                <div className="inline-flex items-center space-x-4 mb-8 bg-white/10 px-8 py-3 rounded-full border border-white/20 backdrop-blur-md">
                  <span className="text-3xl">{country.flag}</span>
                  <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                    {country.name} - New Labour Permit
                  </h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                  {[
                    {
                      icon: Clock,
                      label: "4 Working Days",
                      sub: "Estimated time",
                    },
                    {
                      icon: ShieldCheck,
                      label: "2 Year Valid",
                      sub: "Permit duration",
                    },
                    {
                      icon: Users,
                      label: "24/7 Support",
                      sub: "Human assistance",
                    },
                    {
                      icon: TrendingUp,
                      label: "Live Tracking",
                      sub: "Status updates",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                      <div className="bg-white/20 text-white p-4 rounded-2xl backdrop-blur-sm">
                        <item.icon size={22} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-wide">
                          {item.label}
                        </h4>
                        <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                          {item.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/9779800000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Chat"
                  className="absolute -bottom-12 right-0 md:-bottom-20 md:right-4
                         bg-green-500 hover:bg-green-600
                         text-white p-4 rounded-full
                         shadow-xl transition-all duration-300
                         hover:scale-110"
                >
                  <MessageCircle size={26} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Content Pane */}
              <div className="lg:col-span-8 space-y-12">
                {/* About & Requirements */}
                <div className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-xl border border-slate-100">
                  <div className="mb-12">
                    <h2 className="text-2xl font-black text-[#2D1347] mb-6 flex items-center">
                      <FileText className="text-[#D92671] mr-3" /> About{" "}
                      {country.name} Permit
                    </h2>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      Processing a new work permit for {country.name} requires
                      careful documentation and adherence to both the destination
                      country's labour laws and the Nepal government's Shram
                      rules. Our team ensures your file is complete and submitted
                      to the Foreign Employment Office (FEO) correctly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <h3 className="text-lg font-black text-[#2D1347] mb-6 uppercase tracking-tight flex items-center">
                        <CheckCircle2 size={18} className="text-green-500 mr-2" />{" "}
                        Requirement Documents
                      </h3>
                      <ul className="space-y-4">
                        {documents.map((doc, i) => (
                          <li
                            key={i}
                            className="flex items-center text-slate-500 text-sm font-bold"
                          >
                            <div className="w-1.5 h-1.5 bg-[#D92671] rounded-full mr-3"></div>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#2D1347] mb-6 uppercase tracking-tight flex items-center">
                        <Zap size={18} className="text-[#D92671] mr-2" /> What's
                        Included
                      </h3>
                      <ul className="space-y-4">
                        {[
                          "Govt. Application Filing",
                          "FEO Coordination",
                          "Document Scanning",
                          "Insurance Help",
                          "Online Status Tracking",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center text-slate-500 text-sm font-bold"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Policy & Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#2D1347] text-white p-10 rounded-[3rem] shadow-xl">
                    <h3 className="text-lg font-black mb-6 flex items-center">
                      <AlertCircle size={20} className="text-[#D92671] mr-3" />{" "}
                      Policy
                    </h3>
                    <ul className="space-y-4 opacity-70">
                      {[
                        "Non-refundable Govt. Fee",
                        "Verification required",
                        "Self-declaration mandatory",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center text-xs font-bold uppercase tracking-widest"
                        >
                          <div className="w-1.5 h-1.5 bg-white rounded-full mr-3"></div>{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                    <h3 className="text-lg font-black text-[#2D1347] mb-6 flex items-center">
                      <HelpCircle size={20} className="text-[#D92671] mr-3" />{" "}
                      Terms & Conditions
                    </h3>
                    <ul className="space-y-4">
                      {[
                        "Processing starts after full payment",
                        "Time may vary by FEO",
                        "Original docs for verification",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest"
                        >
                          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full mr-3"></div>{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pricing & CTA Pane */}
              <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-4">
                  <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="p-10 border-b border-slate-50 bg-slate-50/50">
                      <h3 className="text-xl font-black text-[#2D1347] tracking-tight">
                        Cost Breakdown
                      </h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        Based on Age Groups (NPR)
                      </p>
                    </div>
                    <div className="p-8">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100">
                            <th className="pb-4">Age Group</th>
                            <th className="pb-4 text-right">Cost (NPR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {pricing.map((row, i) => (
                            <tr key={i} className="group">
                              <td className="py-5 text-sm font-bold text-slate-600">
                                {row.ageGroup}
                              </td>
                              <td className="py-5 text-right font-black text-[#D92671]">
                                {row.cost}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-8 pt-0 space-y-4">
                      <button
                        onClick={() => setShowProcessPopup(true)}
                        className="w-full bg-[#D92671] text-white py-5 rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-[#D92671]/20 hover:brightness-110 transition-all flex items-center justify-center space-x-3"
                      >
                        <span>Process Now</span>
                        <ArrowRight size={18} />
                      </button>
                      <a
                        href="https://wa.me/9779800000000"
                        className="w-full flex items-center justify-center space-x-3 bg-green-500 text-white py-5 rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl hover:brightness-110 transition-all"
                      >
                        <MessageCircle size={18} />
                        <span>WhatsApp Inquiry</span>
                      </a>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl text-center space-y-6">
                    <div>
                      <p className="text-4xl font-black text-[#D92671] leading-none">
                        1000+
                      </p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mt-2">
                        Successful Applications
                      </p>
                    </div>

                    <div className="h-px w-12 bg-slate-100 mx-auto"></div>

                    <div className="space-y-4 text-left">
                      <div className="flex items-start space-x-3">
                        <div className="bg-[#D92671]/10 p-2 rounded-xl text-[#D92671]">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#2D1347]">
                            98% Approval Rate
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Verified submissions
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="bg-[#D92671]/10 p-2 rounded-xl text-[#D92671]">
                          <Clock size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#2D1347]">
                            7+ Years Experience
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Since 2018
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="bg-[#D92671]/10 p-2 rounded-xl text-[#D92671]">
                          <Map size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#2D1347]">
                            Physical Office – Kathmandu
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Walk-in support available
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Services */}
            <div className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-[#2D1347] tracking-tight">
                  Our Other Services
                </h2>

                <Link
                  to="/services"
                  className="text-[10px] font-black border border-[#D92671] p-2 rounded-[10px] text-[#D92671] uppercase tracking-[0.2em] hover:underline"
                >
                  View All Services
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {otherServices.map((service) => (
                  <Link
                    key={service.id}
                    to={service.link}
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center group"
                  >
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#D92671]/10 text-[#D92671] flex items-center justify-center transition-all group-hover:bg-[#D92671] group-hover:text-white">
                      {React.cloneElement(service.icon, {
                        size: 20,
                        strokeWidth: 2,
                      })}
                    </div>
                    <h4 className="font-black text-[#2D1347] text-[11px] uppercase tracking-widest">
                      {service.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Process Now Popup Form */}
        {showProcessPopup && (
          <div className="fixed inset-0 z-[150] overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => setShowProcessPopup(false)}
            />
            <div className="flex min-h-full items-center justify-center p-4">
              <div
                className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-2xl font-black text-[#2D1347]">
                      Online Application
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Fill in your details to proceed
                    </p>
                  </div>
                  <button
                    onClick={() => setShowProcessPopup(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-[#2D1347] uppercase tracking-widest flex items-center">
                      <FileText size={16} className="text-[#D92671] mr-2" />
                      Basic Information
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#D92671] focus:ring-1 focus:ring-[#D92671] outline-none transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">
                        Phone Number *
                      </label>
                      <div className="flex gap-2">
                        <select className="px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 focus:border-[#D92671] outline-none">
                          <option>+977</option>
                          <option>+91</option>
                          <option>+1</option>
                          <option>+44</option>
                        </select>
                        <input
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phoneNumber: e.target.value,
                            })
                          }
                          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#D92671] focus:ring-1 focus:ring-[#D92671] outline-none transition-all"
                          placeholder="98XXXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-500">
                        Date of Birth *
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                            AD
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.dateOfBirth}
                            onChange={handleDateOfBirthChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#D92671] focus:ring-1 focus:ring-[#D92671] outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                            BS (Nepali)
                          </label>
                          <div className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#D92671] focus:ring-1 focus:ring-[#D92671] outline-none transition-all">
                            <NepaliDatePicker
                              inputClassName="w-full outline-none text-sm font-bold text-slate-600"
                              value={formData.dateOfBirthBS}
                              onChange={(value: any) =>
                                setFormData({
                                  ...formData,
                                  dateOfBirthBS: value,
                                })
                              }
                              options={{
                                calenderLocale: "ne",
                                valueLocale: "en",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-xs font-bold text-slate-500 mb-2">
                          Age (Auto-calculated)
                        </label>
                        <div className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-bold">
                          {age ? `${age} years` : "—"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">
                          Country *
                        </label>
                        <select
                          required
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              country: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 focus:border-[#D92671] outline-none appearance-none"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 1rem center",
                            backgroundSize: "1.25rem",
                          }}
                        >
                          <option value="">Select country</option>
                          <option value="uae">UAE</option>
                          <option value="saudi">Saudi Arabia</option>
                          <option value="qatar">Qatar</option>
                          <option value="kuwait">Kuwait</option>
                          <option value="bahrain">Bahrain</option>
                          <option value="oman">Oman</option>
                          <option value="malaysia">Malaysia</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">
                          Service Permit Type (Auto)
                        </label>
                        <input
                          type="text"
                          value="New Labour Permit"
                          disabled
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-bold cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-[#2D1347] uppercase tracking-widest flex items-center">
                      <Upload size={16} className="text-[#D92671] mr-2" />
                      Required Documents Upload
                    </h3>

                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold text-slate-600">
                          Passport Copy *
                        </label>
                      </div>
                      <input
                        type="file"
                        required
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileUpload(
                            "passportCopy",
                            e.target.files?.[0] || null,
                          )
                        }
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#D92671] file:text-white hover:file:bg-[#D92671]/90"
                      />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold text-slate-600">
                          Arrival Stamp *
                        </label>
                      </div>
                      <input
                        type="file"
                        required
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileUpload(
                            "arriveStamp",
                            e.target.files?.[0] || null,
                          )
                        }
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#D92671] file:text-white hover:file:bg-[#D92671]/90"
                      />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold text-slate-600">
                          Visa Copy *
                        </label>
                      </div>
                      <input
                        type="file"
                        required
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileUpload(
                            "visaCopy",
                            e.target.files?.[0] || null,
                          )
                        }
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#D92671] file:text-white hover:file:bg-[#D92671]/90"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-[#2D1347] uppercase tracking-widest flex items-center">
                      <Upload size={16} className="text-[#D92671] mr-2" />
                      Optional Documents
                    </h3>

                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <input
                          type="checkbox"
                          id="companyChange"
                          checked={formData.companyChange}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyChange: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-[#D92671] border-slate-300 rounded focus:ring-[#D92671]"
                        />
                        <label
                          htmlFor="companyChange"
                          className="text-sm font-bold text-slate-600"
                        >
                          Company Change
                        </label>
                      </div>

                      {formData.companyChange && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-slate-500">
                              Agreement Paper
                            </label>
                          </div>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) =>
                              handleFileUpload(
                                "agreementPaper",
                                e.target.files?.[0] || null,
                              )
                            }
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-400 file:text-white hover:file:bg-slate-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D92671] text-white py-5 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-[#D92671]/20 hover:brightness-110 transition-all flex items-center justify-center space-x-3"
                  >
                    <span>Submit Application</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkPermitDetail;