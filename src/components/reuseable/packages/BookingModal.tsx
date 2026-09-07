import React, { useState, useEffect } from "react";
import type { Package } from "../../../assets/data/types";
import {
  X,
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../../context/CurrencyContext";

export interface BookingItem {
  id?: string;
  title: string;
  duration?: string;
  location?: string;
  price?: string;
  image?: string;
}

interface BookingModalProps {
  pkg: BookingItem | Package | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  pkg,
  isOpen,
  onClose,
}) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelDate: "",
    guests: 1,
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Reset state when modal opens with a new package
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen, pkg?.id]);

  if (!isOpen || !pkg) return null;

  // Format price
  const baseUSDPrice = Number(pkg.price?.replace(/[^0-9]/g, "") || 0);
  const baseNPRPrice = baseUSDPrice * nprPerOneDollar;
  const formattedPrice =
    baseUSDPrice > 0
      ? displayPrice(baseNPRPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR)
      : pkg.price || "On Request";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleWhatsAppBooking = () => {
    const whatsappPhone = "9779800000003";
    const msg = encodeURIComponent(
      `*Trip Booking Inquiry - Trip Himalaya*\n\n` +
        `*Package:* ${pkg.title}\n` +
        `*Starting Price:* ${formattedPrice}\n` +
        `*Duration:* ${pkg.duration}\n` +
        (pkg.location ? `*Location:* ${pkg.location}\n` : "") +
        `\n*Customer Details:*\n` +
        `*Name:* ${formData.fullName || "Not provided"}\n` +
        `*Email:* ${formData.email || "Not provided"}\n` +
        `*Phone/WhatsApp:* ${formData.phone || "Not provided"}\n` +
        `*Preferred Date:* ${formData.travelDate || "Flexible"}\n` +
        `*Guests / Travelers:* ${formData.guests}\n` +
        (formData.notes ? `*Special Request:* ${formData.notes}\n` : "") +
        `\nPlease confirm availability and reservation steps.`
    );
    window.open(`https://wa.me/${whatsappPhone}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── MODAL HEADER ── */}
        <div className="relative bg-gradient-to-r from-[#200B3B] via-[#2D1347] to-[#3B145C] text-white p-5 sm:p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-1 text-pink-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Fast Booking &amp; Reservation</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight pr-8">
            Book: {pkg.title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-200">
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs font-semibold">
              <Clock size={13} className="text-pink-400" />
              {pkg.duration}
            </span>
            {pkg.location && (
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs font-semibold">
                <MapPin size={13} className="text-pink-400" />
                {pkg.location}
              </span>
            )}
            <span className="bg-[#E11D48] text-white font-extrabold px-3 py-1 rounded-full shadow-sm ml-auto">
              From {formattedPrice}
            </span>
          </div>
        </div>

        {/* ── MODAL BODY ── */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {isSubmitted ? (
            /* ── SUCCESS STATE ── */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 className="text-2xl font-black text-[#2D1347]">
                  Booking Request Received!
                </h4>
                <p className="text-sm text-gray-600 mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#2D1347]">{formData.fullName}</strong>. We have received your booking request for{" "}
                  <strong className="text-[#E11D48]">{pkg.title}</strong>. Our tour manager will connect with you within 15 minutes.
                </p>
              </div>

              <div className="bg-[#FBFBFE] border border-gray-200/80 rounded-2xl p-4 text-left text-xs text-gray-700 space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Travelers:</span>
                  <span className="font-bold text-[#2D1347]">{formData.guests} Guest(s)</span>
                </div>
                {formData.travelDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Travel Date:</span>
                    <span className="font-bold text-[#2D1347]">{formData.travelDate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Contact:</span>
                  <span className="font-bold text-[#2D1347]">{formData.phone || formData.email}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleWhatsAppBooking}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Send via WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-[#2D1347] font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* ── BOOKING FORM ── */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name <span className="text-[#E11D48]">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone / WhatsApp <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+977 9800000000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Travel Date & Number of Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Preferred Travel Date <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="travelDate"
                      required
                      value={formData.travelDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Number of Guests <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition appearance-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "10+ (Group)"].map((num, i) => (
                        <option key={i} value={typeof num === "number" ? num : 10}>
                          {num} {typeof num === "number" && num === 1 ? "Traveler" : "Travelers"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Requests / Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Special Requirements / Notes (Optional)
                </label>
                <div className="relative">
                  <MessageSquare size={15} className="absolute left-3.5 top-3 text-gray-400" />
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Hotel category, dietary requirements, airport pickup, etc."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition resize-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-pink-900/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{isSubmitting ? "Submitting Booking..." : "Submit Booking Request"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppBooking}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle size={15} />
                  <span>Quick WhatsApp</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-gray-400 font-medium">
                🔒 No advance payment required immediately. We'll contact you to confirm details.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
