import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Plane,
  Map,
  Mountain,
  Hotel,
  FileText,
  Bus,
  Car,
  Shield,
  BadgeDollarSign,
  ChevronRight,
  ChevronDown,
  Check,
  ExternalLink,
  Navigation,
  MessageCircle,
} from "lucide-react";
import BannerSection from "../components/reusable/BannerSection";
import PreFooter from "../components/reusable/PreFooter";
import { sendInquiryEmail } from "../services/emailService";
import { SEO } from "../components/reusable";
import { pagesSEO } from "../config/seoConfig";

// =============================================================================
// WhatsApp SVG Icon
// =============================================================================
const WhatsAppSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 0 0 1.333 4.993L2 22l5.233-1.237a9.994 9.994 0 0 0 4.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.925-7.062A9.925 9.925 0 0 0 12.012 2zm0 18.293h-.003a8.318 8.318 0 0 1-4.233-1.157l-.304-.18-3.146.744.757-3.067-.198-.314a8.308 8.308 0 0 1-1.272-4.335c0-4.588 3.733-8.318 8.324-8.318 2.223 0 4.312.865 5.884 2.435a8.272 8.272 0 0 1 2.432 5.885c0 4.59-3.733 8.32-8.324 8.32zm4.561-6.225c-.25-.125-1.478-.73-1.707-.813-.229-.083-.396-.125-.562.125-.167.25-.646.813-.792.979-.146.167-.292.188-.542.063s-1.06-.391-2.019-1.246c-.746-.665-1.25-1.488-1.396-1.738-.146-.25-.016-.385.109-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.021-.438s-.562-1.354-.771-1.854c-.203-.487-.41-.421-.562-.429h-.479c-.167 0-.438.063-.667.313s-.875.854-.875 2.083c0 1.229.896 2.417 1.021 2.583.125.167 1.762 2.69 4.269 3.773.596.258 1.061.412 1.424.527.599.19 1.144.163 1.575.099.48-.072 1.478-.604 1.687-1.188.208-.583.208-1.083.146-1.188-.063-.104-.229-.167-.479-.292z" />
  </svg>
);

// =============================================================================
// Helicopter SVG Icon
// =============================================================================
const HelicopterIcon: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 16,
  color = "#ffffff",
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 4h16" />
    <path d="M12 4v3" />
    <path d="M6 10a4 4 0 0 1 4-3h4a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2H9a3 3 0 0 1-3-3v-2z" />
    <path d="M6 10l-4-2" />
    <path d="M2 6.5v3" />
    <path d="M8 15v3" />
    <path d="M15 15v3" />
    <path d="M5 18h14" />
  </svg>
);

// =============================================================================
// Contact Data
// =============================================================================
const TEAMS_DIRECTORY = [
  {
    name: "Air Ticketing Team",
    icon: Plane,
    bgColor: "#2563eb",
    phone: "9851420882",
    email: "dev.triphimalayatt@gmail.com",
    role: "Domestic & International Flights",
  },
  {
    name: "Tours & Holidays Team",
    icon: Map,
    bgColor: "#7c3aed",
    phone: "9851403761",
    email: "pradip.triphimalayatt@gmail.com",
    role: "Nepal & Global Holiday Packages",
  },
  {
    name: "Trekking & Adventure Team",
    icon: Mountain,
    bgColor: "#059669",
    phone: "9851403761",
    email: "pradip.triphimalayatt@gmail.com",
    role: "Everest, Annapurna, Langtang Treks",
  },
  {
    name: "Hotel Booking Team",
    icon: Hotel,
    bgColor: "#d97706",
    phone: "9851403761",
    email: "pradip.triphimalayatt@gmail.com",
    role: "Resorts, Heritage & Star Hotels",
  },
  {
    name: "Visa & Documentation Team",
    icon: FileText,
    bgColor: "#dc2626",
    phone: "9851420882",
    email: "dev.triphimalayatt@gmail.com",
    role: "Global Visas & Embassy Guidance",
  },
  {
    name: "Regular Route Team",
    icon: Bus,
    bgColor: "#0891b2",
    phone: "9851356882",
    email: "samarpan.triphimalayatt@gmail.com",
    role: "Tourist Bus & Scheduled Route Travel",
  },
  {
    name: "Vehicle Rental Team",
    icon: Car,
    bgColor: "#7c3aed",
    phone: "9851356882",
    email: "samarpan.triphimalayatt@gmail.com",
    role: "SUVs, Jeeps, Vans & Luxury Cars",
  },
  {
    name: "Travel Insurance Team",
    icon: Shield,
    bgColor: "#0284c7",
    phone: "9851403760",
    email: "bhishan.triphimalayatt@gmail.com",
    role: "High-Altitude Medical & Trip Protection",
  },
  {
    name: "Heli Services Team",
    icon: HelicopterIcon,
    bgColor: "#db2777",
    phone: "9851420882",
    email: "dev.triphimalayatt@gmail.com",
    role: "Mountain Flights & Rescue Charters",
  },
  {
    name: "Accounts & Billing Team",
    icon: BadgeDollarSign,
    bgColor: "#16a34a",
    phone: "9851403759",
    email: "actriphimalaya@gmail.com",
    role: "Invoices, Payments & Receipts",
  },
  {
    name: "Customer Support Team",
    icon: MessageCircle,
    bgColor: "#0284c7",
    phone: "9851356882",
    email: "samarpan.triphimalayatt@gmail.com",
    role: "General Support, Assistance & Complaints",
  },
];

// =============================================================================
// Contact Component
// =============================================================================
const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "",
    email: "",
    phone: "",
    department: "Tours & Holidays Team",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const selectedTeam = TEAMS_DIRECTORY.find((t) => t.name === formData.department);

    try {
      const res = await sendInquiryEmail({
        formType: "contact",
        fullName: formData.fullName.trim(),
        nationality: formData.nationality.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceOrDepartment: formData.department,
        message: formData.message.trim(),
        teamEmail: selectedTeam?.email,
        teamPhone: selectedTeam?.phone,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setSubmitError(res.message || "Failed to send your message. Please try again or reach out on WhatsApp.");
      }
    } catch (err: any) {
      setSubmitError(err?.message || "An unexpected error occurred while sending. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenWhatsApp = () => {
    const selectedTeam = TEAMS_DIRECTORY.find((t) => t.name === formData.department);
    const waNumber = selectedTeam?.phone || "9851420882";
    const text = encodeURIComponent(
      `Hello Trip Himalaya (${formData.department})! My name is ${formData.fullName || "Traveler"}.\n` +
      `Nationality: ${formData.nationality || "N/A"}\n` +
      `Email: ${formData.email || "N/A"}\n` +
      `Phone: ${formData.phone || "N/A"}\n` +
      `Department: ${formData.department}\n` +
      `Message: ${formData.message || "I would like to inquire about your travel services."}`
    );
    window.open(`https://wa.me/977${waNumber}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <SEO {...pagesSEO.contact} />
      {/* ── 1. Hero Banner ── */}
      <BannerSection
        background="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000"
        alt="Trip Himalaya Scenic Peaks"
        heading="GET IN TOUCH"
        title="Contact Us"
        description="Have questions or need assistance? Our team is always ready to help you plan your next journey."
      />

      {/* ── 2. Main Two-Column Contact Section ── */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

          {/* ── Left Column: Get In Touch Info Cards (Desktop Left, Mobile Second) ── */}
          <div className="order-2 lg:order-1 lg:col-span-5 space-y-6">
            <div>
              <span className="text-[#E91E63] font-black uppercase tracking-[0.25em] text-xs">
                Direct Channels
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#2D1347] mt-1.5 tracking-tight">
                Get In Touch
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Whether you need a custom mountain expedition, urgent flight booking, or visa assistance, our specialized desk officers are here to help.
              </p>
            </div>

            {/* Office Address Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#8B2CFF] flex items-center justify-center flex-shrink-0">
                <MapPin size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-gray-900">Our Office</h4>
                <p className="text-sm text-gray-600 mt-1 leading-snug">
                  Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Branch: Kantipath, Kathmandu (Near Nepal Tourism Board)
                </p>
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                  <Clock size={12} className="text-amber-500 flex-shrink-0" />
                  <span>Sun–Fri: 9am–6pm | Sat: 10am–3pm (24/7 rescue & flight support)</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2.5">
                  <a
                    href="https://www.google.com/maps/place/Trip+Himalaya+Tours+And+Travels+Pvt.+ltd/@27.7027784,85.3504801,17z/data=!4m6!3m5!1s0x39eb19977e011101:0x7faa0993f3e0ca2f!8m2!3d27.7027784!4d85.3504801!16s%2Fg%2F11zhmy3w61"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E91E63] hover:text-pink-700 transition-colors"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink size={12} />
                  </a>
                  <span className="text-gray-300">•</span>
                  <a
                    href="https://www.google.com/maps/dir//Trip+Himalaya+Tours+And+Travels+Pvt.+ltd/@27.7027784,85.3504801,17z/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B2CFF] hover:text-purple-800 transition-colors"
                  >
                    <Navigation size={12} />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Unified Phone & Email Inquiries Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                <Phone size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-gray-900">Phone &amp; Email Inquiries</h4>

                {/* Phone Numbers */}
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="text-xs text-gray-400 font-semibold uppercase">Landline: </span>
                    <a href="tel:01-5922697" className="font-semibold text-gray-800 hover:text-[#E91E63] transition-colors">
                      01-5922697
                    </a>
                  </p>
                  <p>
                    <span className="text-xs text-gray-400 font-semibold uppercase">Direct Mobile: </span>
                    <a href="tel:+9779851420882" className="font-semibold text-gray-800 hover:text-[#E91E63] transition-colors">
                      +977-9851420882
                    </a>
                  </p>
                  <p>
                    <span className="text-xs text-gray-400 font-semibold uppercase">Reservations: </span>
                    <a href="tel:+9779851403761" className="font-semibold text-gray-800 hover:text-[#E91E63] transition-colors">
                      +977-9851403761
                    </a>
                  </p>
                </div>

                <div className="border-t border-slate-100 my-3" />

                {/* Email Inquiries */}
                <div className="text-sm text-gray-700">
                  <p className="break-all sm:break-normal">
                    <span className="text-xs text-gray-400 font-semibold uppercase">Email: </span>
                    <a href="mailto:triphimalayatt@gmail.com" className="font-bold text-slate-900 hover:text-[#E91E63] transition-colors">
                      triphimalayatt@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>


          </div>

          {/* ── Right Column: Send Us a Message Form Card (Desktop Right, Mobile First) ── */}
          <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-9 shadow-xl border border-slate-100 flex-1 flex flex-col justify-between">
              <div className="mb-5 sm:mb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight">
                  Send Us a Message
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Fill in your details below and our travel counselor will reply within 30–60 minutes.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900">Inquiry Dispatched!</h4>
                  <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-gray-900">{formData.fullName}</strong>. Your message has been sent to our <strong className="text-gray-900">{formData.department}</strong>. A dedicated counselor will contact you at <strong className="text-gray-900">{formData.email}</strong> shortly.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleOpenWhatsApp}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shadow-md"
                    >
                      <WhatsAppSvg size={16} />
                      <span>Chat on WhatsApp Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setSubmitError(null);
                        setFormData({
                          fullName: "",
                          nationality: "",
                          email: "",
                          phone: "",
                          department: "Tours & Holidays Team",
                          message: "",
                        });
                      }}
                      className="w-full sm:w-auto text-xs font-bold text-gray-600 hover:text-gray-900 px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
                  {/* Name & Nationality Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Aarav Sharma"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-800 placeholder:text-xs placeholder:font-normal placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-[#E91E63]/20 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Nationality *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        placeholder="e.g. Nepali, American"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-800 placeholder:text-xs placeholder:font-normal placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-[#E91E63]/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="aarav@gmail.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-800 placeholder:text-xs placeholder:font-normal placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-[#E91E63]/20 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+977 98XXXXXXXX"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-800 placeholder:text-xs placeholder:font-normal placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-[#E91E63]/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Department Row */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Department / Service of Interest
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-xs sm:text-sm text-gray-800 font-medium flex items-center justify-between text-left transition-all cursor-pointer ${
                        isDropdownOpen
                          ? "bg-white border-[#E91E63] ring-2 ring-[#E91E63]/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="truncate pr-2 text-xs sm:text-sm font-medium">
                        {formData.department}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180 text-[#E91E63]" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 w-full bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto py-1 divide-y divide-slate-100">
                        {TEAMS_DIRECTORY.map((team) => {
                          const isSelected = formData.department === team.name;
                          return (
                            <button
                              type="button"
                              key={team.name}
                              onClick={() => {
                                setFormData({ ...formData, department: team.name });
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2 transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-pink-50 text-[#E91E63]"
                                  : "text-gray-700 hover:bg-slate-50"
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="text-xs font-semibold truncate leading-snug">
                                  {team.name}
                                </div>
                                <div className="text-[10px] text-gray-400 truncate mt-0.5">
                                  {team.role}
                                </div>
                              </div>
                              {isSelected && (
                                <Check size={14} className="text-[#E91E63] flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Message or Travel Requirements *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your trip plans, dates, preferred destinations, number of guests, or any special requests..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-800 placeholder:text-xs placeholder:font-normal placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-[#E91E63]/20 transition-all font-medium resize-y"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
                      {submitError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E91E63] via-[#D92671] to-[#8B2CFF] hover:brightness-110 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/25 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. Department Direct Contact Cards Grid ── */}
      <section className="py-12 bg-white border-y border-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#E91E63] font-black uppercase tracking-[0.25em] text-xs">
              Specialized Help Desks
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2D1347] mt-1 tracking-tight">
              Connect Directly With Our Teams
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              Speak directly with the specialized officer in charge of your specific travel requirement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {TEAMS_DIRECTORY.map((team) => {
              const IconComp = team.icon;
              return (
                <div
                  key={team.name}
                  className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 shadow-xs"
                      style={{ backgroundColor: team.bgColor }}
                    >
                      <IconComp size={18} color="#ffffff" strokeWidth={2.2} />
                    </div>
                    <h5 className="font-bold text-xs text-gray-900 leading-snug">
                      {team.name}
                    </h5>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5 line-clamp-1">
                      {team.role}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1 text-[11px]">
                    <a
                      href={`tel:${team.phone}`}
                      className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-[#E91E63] transition-colors"
                    >
                      <Phone size={10} className="text-gray-400" />
                      <span>{team.phone}</span>
                    </a>
                    <a
                      href={`mailto:${team.email}`}
                      className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors truncate"
                      title={team.email}
                    >
                      <Mail size={10} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{team.email}</span>
                    </a>
                    <a
                      href={`https://wa.me/977${team.phone}?text=${encodeURIComponent(`Hi ${team.name}, I would like to inquire about your services.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 pt-1"
                    >
                      <WhatsAppSvg size={11} className="text-[#25D366]" />
                      <span>WhatsApp Chat</span>
                      <ChevronRight size={10} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Google Maps Office Location Section ── */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
            <div>
              <span className="text-[#E91E63] font-black uppercase tracking-[0.25em] text-[10px]">
                Visit Us in Person
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#2D1347] mt-0.5">
                Trip Himalaya Tours And Travels Pvt. Ltd.
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal • Coordinates: 27.7027784, 85.3504801
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <a
                href="https://www.google.com/maps/dir//Trip+Himalaya+Tours+And+Travels+Pvt.+ltd/@27.7027784,85.3504801,17z/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#E91E63] hover:bg-pink-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm"
              >
                <Navigation size={13} />
                <span>GET DIRECTIONS</span>
              </a>
              <a
                href="https://www.google.com/maps/place/Trip+Himalaya+Tours+And+Travels+Pvt.+ltd/@27.7027784,85.3504801,17z/data=!4m6!3m5!1s0x39eb19977e011101:0x7faa0993f3e0ca2f!8m2!3d27.7027784!4d85.3504801!16s%2Fg%2F11zhmy3w61"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#2D1347] hover:bg-[#3d1a60] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm"
              >
                <ExternalLink size={13} />
                <span>OPEN IN MAPS</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Maps Iframe with rounded corners */}
          <div className="w-full h-[220px] sm:h-[260px] md:h-[280px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner">
            <iframe
              title="Trip Himalaya Tours & Travels Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.5539567954995!2d85.3479052!3d27.7027784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19977e011101%3A0x7faa0993f3e0ca2f!2sTrip%20Himalaya%20Tours%20And%20Travels%20Pvt.%20ltd!5e0!3m2!1sen!2snp!4v1700000000000"
              width="100%"
              height="100%"
              className="w-full h-full rounded-2xl"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── 5. PreFooter ── */}
      <PreFooter
        title="Ready to Plan Your Next Journey?"
        description="Speak with our certified mountain and tour specialists today for free personalized travel itineraries."
        btn1="CALL US NOW"
        btn2="CHAT ON WHATSAPP"
        telPhone="+9779851420882"
        whatsappPhone="9779851420882"
        whatsappMessage="Hello Trip Himalaya! I would like to get a personalized travel quote."
      />
    </div>
  );
};

export default Contact;
