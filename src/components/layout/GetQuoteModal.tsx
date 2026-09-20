import React, { useEffect, useRef, useState } from "react";
import { X, Send, User, Mail, Phone, ChevronDown, CheckCircle2 } from "lucide-react";

interface GetQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICES = [
  "Air Ticket",
  "Tours",
  "Adventure Activities",
  "Trekking",
  "Hotel Booking",
  "Visa Services",
  "Travel Insurance",
  "Vehicle Rental",
  "Heli Services",
  "Other",
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  service?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GetQuoteModal: React.FC<GetQuoteModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<FormData>({
    fullName: "", email: "", phone: "", service: "", message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 80);
    } else {
      setTimeout(() => {
        setForm({ fullName: "", email: "", phone: "", service: "", message: "" });
        setErrors({});
        setSubmitting(false);
        setSubmitted(false);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!EMAIL_REGEX.test(form.email.trim())) errs.email = "Enter a valid email address.";
    if (!form.phone.trim()) errs.phone = "Phone / WhatsApp is required.";
    if (!form.service) errs.service = "Please select a service.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // TODO: replace with real API call — POST /api/inquiries { ...form }
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 900);
  };

  if (!isOpen) return null;

  /* -- Shared field wrapper class -- */
  const fieldWrap = (hasErr: boolean) =>
    `relative flex items-center border rounded-xl px-3.5 h-11 transition-all focus-within:ring-1 ${
      hasErr
        ? "bg-[#29174d]/85 border-red-500/70 focus-within:border-red-500 focus-within:ring-red-500/30"
        : "bg-[#29174d]/85 border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
    }`;

  const inputCls = "flex-1 bg-transparent text-white text-sm placeholder:text-purple-300/40 focus:outline-none min-w-0";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Get a Free Quote"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card — matches project dark purple */}
      <div className="relative w-full max-w-md bg-[#180b33] rounded-[28px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] border border-purple-800/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* -- Header Band: pink?purple gradient (matches Get Quote button) -- */}
        <div className="bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-white font-extrabold text-xl tracking-tight leading-tight">
              Plan Your Trip
            </h2>
            <p className="text-white/75 text-xs mt-0.5">
              Fill out the form and our team will contact you shortly.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/20 transition-all rounded-full p-1.5 cursor-pointer ml-3 shrink-0"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* -- Body -- */}
        <div className="px-6 py-5">
          {submitted ? (
            /* Success */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={34} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Inquiry Sent!</h3>
                <p className="text-purple-200/70 text-sm mt-2 leading-relaxed">
                  Thank you, <strong className="text-white">{form.fullName}</strong>!<br />
                  Our team will contact you at{" "}
                  <strong className="text-pink-300">{form.email}</strong> within 24 hours.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white text-[#1e0d3d] font-black text-sm tracking-wider hover:bg-white/95 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-pink-800/30"
              >
                CLOSE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">

              {/* Full Name */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white uppercase block mb-1.5">
                  Full Name <span className="text-pink-400">*</span>
                </label>
                <div className={fieldWrap(!!errors.fullName)}>
                  <User size={14} className="text-purple-300/60 shrink-0 mr-2.5" />
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={inputCls}
                    autoComplete="name"
                  />
                </div>
                {errors.fullName && <p className="text-red-400 text-[10px] mt-1">{errors.fullName}</p>}
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white uppercase block mb-1.5">
                    Email Address <span className="text-pink-400">*</span>
                  </label>
                  <div className={fieldWrap(!!errors.email)}>
                    <Mail size={13} className="text-purple-300/60 shrink-0 mr-2" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={inputCls + " text-xs"}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white uppercase block mb-1.5">
                    Phone/WhatsApp <span className="text-pink-400">*</span>
                  </label>
                  <div className={fieldWrap(!!errors.phone)}>
                    <Phone size={13} className="text-purple-300/60 shrink-0 mr-2" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className={inputCls + " text-xs"}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Select Service */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white uppercase block mb-1.5">
                  Select Service <span className="text-pink-400">*</span>
                </label>
                <div className={`${fieldWrap(!!errors.service)} pr-8`}>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm focus:outline-none appearance-none cursor-pointer"
                    style={{ color: form.service ? "white" : "rgba(196,168,255,0.4)" }}
                  >
                    <option value="" disabled className="bg-[#1e0e3b] text-purple-300">
                      Choose a Service
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-[#1e0e3b] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="text-purple-300/60 absolute right-3.5 pointer-events-none" />
                </div>
                {errors.service && <p className="text-red-400 text-[10px] mt-1">{errors.service}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white uppercase block mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your travel plans..."
                  className="w-full bg-[#29174d]/85 border border-purple-800/40 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-purple-300/40 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 resize-none transition-all"
                />
              </div>

              {/* Submit — pink?purple gradient matching navbar button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-gradient-to-r from-[#FF4FA3] to-[#8B2CFF] hover:brightness-110 active:scale-[0.99] text-white font-black text-sm tracking-wider rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-pink-900/40 transition-all cursor-pointer disabled:opacity-70"
              >
                <Send size={15} />
                {submitting ? "SENDING..." : "SEND INQUIRY"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetQuoteModal;

