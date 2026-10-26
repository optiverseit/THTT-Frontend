import React, { useEffect, useRef, useState } from "react";
import { X, Send, User, Mail, Phone, Globe, ChevronDown, CheckCircle2 } from "lucide-react";
import { sendInquiryEmail } from "../../services/emailService";
import { getTeamInfo } from "../../utils/teamDirectory";

interface GetQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
  nationality: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  nationality?: string;
  email?: string;
  phone?: string;
  service?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GetQuoteModal: React.FC<GetQuoteModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<FormData>({
    fullName: "", nationality: "", email: "", phone: "", service: "", message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 80);
    } else {
      setTimeout(() => {
        setForm({ fullName: "", nationality: "", email: "", phone: "", service: "", message: "" });
        setErrors({});
        setSubmitting(false);
        setSubmitted(false);
        setSubmitError(null);
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
    setSubmitError(null);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.nationality.trim()) errs.nationality = "Nationality is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!EMAIL_REGEX.test(form.email.trim())) errs.email = "Enter a valid email address.";
    if (!form.phone.trim()) errs.phone = "Phone / WhatsApp is required.";
    if (!form.service) errs.service = "Please select a service.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);

    const team = getTeamInfo(form.service);

    try {
      const res = await sendInquiryEmail({
        formType: "quote",
        fullName: form.fullName.trim(),
        nationality: form.nationality.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        serviceOrDepartment: form.service,
        message: form.message.trim(),
        teamEmail: team.email,
        teamPhone: team.phone,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setSubmitError(res.message || "Failed to send inquiry. Please try again.");
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Something went wrong while sending. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
                  Our <strong className="text-pink-300">{getTeamInfo(form.service).name}</strong> will contact you at{" "}
                  <strong className="text-pink-300">{form.email}</strong> within 30 minutes.
                </p>
              </div>
              <div className="space-y-2.5 pt-1">
                <a
                  href={`https://wa.me/977${getTeamInfo(form.service).phone}?text=${encodeURIComponent(
                    `Hello Trip Himalaya (${getTeamInfo(form.service).name})! I just submitted an inquiry for ${form.service}. My name is ${form.fullName}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <WhatsAppSvg size={15} className="shrink-0 text-white" />
                  <span>Chat with {getTeamInfo(form.service).name} on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-white text-[#1e0d3d] font-black text-sm tracking-wider hover:bg-white/95 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-pink-800/30"
                >
                  CLOSE
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">

              {/* Full Name + Nationality */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white uppercase block mb-1.5">
                    Full Name <span className="text-pink-400">*</span>
                  </label>
                  <div className={fieldWrap(!!errors.fullName)}>
                    <User size={13} className="text-purple-300/60 shrink-0 mr-2" />
                    <input
                      ref={firstInputRef}
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Aarav Sharma"
                      className={inputCls + " text-xs"}
                      autoComplete="name"
                    />
                  </div>
                  {errors.fullName && <p className="text-red-400 text-[10px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white uppercase block mb-1.5">
                    Nationality <span className="text-pink-400">*</span>
                  </label>
                  <div className={fieldWrap(!!errors.nationality)}>
                    <Globe size={13} className="text-purple-300/60 shrink-0 mr-2" />
                    <input
                      type="text"
                      name="nationality"
                      value={form.nationality}
                      onChange={handleChange}
                      placeholder="e.g. Nepali"
                      className={inputCls + " text-xs"}
                      autoComplete="country-name"
                    />
                  </div>
                  {errors.nationality && <p className="text-red-400 text-[10px] mt-1">{errors.nationality}</p>}
                </div>
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
                      placeholder="aarav@gmail.com"
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

              {submitError && (
                <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center">
                  {submitError}
                </div>
              )}

              {/* Submit — pink–purple gradient matching navbar button */}
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

