import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Globe,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Search,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import hikerHimalaya from "../../assets/images/hiker_himalaya.jpg";
import { COUNTRY_CODES, CountryCode } from "../../utils/countrycodes";
import ReactCountryFlag from "react-country-flag";
import { useAuth } from "../../context/AuthContext";

interface RegisterFormData {
  fullName: string;
  email: string;
  countryCode: string;
  countryIso: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: string;
  address: string;
  nationality: string;
}

interface RegErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  nationality?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_REGEX = /^[0-9]{6,15}$/;

type StepType = "details" | "otp" | "success";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [currentStep, setCurrentStep] = useState<StepType>("details");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RegErrors>({});

  // Form state with default values matching the reference design (+977 Nepal default)
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    countryCode: "+977",
    countryIso: "NP",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    address: "",
    nationality: "Nepali",
  });

  // Country code search & dropdown state
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryPickerRef = useRef<HTMLDivElement>(null);

  // Filter country codes by code or ISO search
  const filteredCountryCodes = COUNTRY_CODES.filter(
    (c) =>
      c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.iso.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        countryPickerRef.current &&
        !countryPickerRef.current.contains(e.target as Node)
      ) {
        setShowCountryPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gender options
  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  // OTP State (6 digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(45);

  useEffect(() => {
    let timer: any;
    if (currentStep === "otp" && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, resendTimer]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
    // Clear field-level error on change
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Full field-level validation
  const validateDetails = (): boolean => {
    const errs: RegErrors = {};

    if (!formData.fullName.trim()) {
      errs.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errs.email = "Please enter a valid email (e.g. you@example.com).";
    }

    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!PHONE_DIGITS_REGEX.test(formData.phone.trim())) {
      errs.phone = "Enter 6–15 digits without spaces or dashes.";
    }

    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      errs.password = "Password must contain at least one uppercase letter.";
    } else if (!/[0-9]/.test(formData.password)) {
      errs.password = "Password must contain at least one number.";
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (!formData.address.trim()) {
      errs.address = "Address is required.";
    }

    if (!formData.nationality.trim()) {
      errs.nationality = "Nationality is required.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSelectCountry = (country: CountryCode) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: country.code,
      countryIso: country.iso,
    }));
    setShowCountryPicker(false);
    setCountrySearch("");
  };

  // Step 1: Submit Details -> Send OTP to Email
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDetails()) return;

    setLoading(true);
    setErrorMessage(null);

    // Frontend design flow: Simulate sending OTP to user's email
    setTimeout(() => {
      setLoading(false);
      setCurrentStep("otp");
      setResendTimer(45);
      setOtpDigits(["", "", "", "", "", ""]);
    }, 500);
  };

  // OTP digit handling
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const nextOtp = [...otpDigits];
    nextOtp[index] = value.slice(-1);
    setOtpDigits(nextOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP -> Login Successful -> Redirect to User Dashboard
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length < 6) {
      setErrorMessage("Please enter the complete 6-digit OTP code sent to your email.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // Simulate OTP verification & authentication
    setTimeout(() => {
      setLoading(false);
      // Login user in AuthContext
      login({
        name: formData.fullName || "Traveler",
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
      });
      // Redirect to user dashboard as requested
      navigate("/dashboard");
    }, 600);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      {/* Outer Registration Card */}
      <div className="w-full rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#180b33] border border-purple-800/40 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] flex flex-col md:flex-row min-h-[560px]">
        
        {/* ── LEFT PANEL: Hiker in Himalayas Image + Stepper Tabs ── */}
        <div className="relative w-full md:w-1/2 min-h-[340px] md:min-h-[620px] flex flex-col justify-between p-6 sm:p-8 lg:p-10 overflow-hidden">
          {/* Background Image */}
          <img
            src={hikerHimalaya}
            alt="Traveler exploring Himalayas"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Deep Purple Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#160a2b]/95 via-[#1b0b36]/40 to-[#180a30]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-purple-950/25" />

          {/* Top Headline Content */}
          <div className="relative z-10">
            <span className="text-[#ff3880] font-black uppercase tracking-[0.22em] text-[11px] sm:text-xs">
              TRIP HIMALAYA
            </span>
            <h1 className="text-white font-extrabold text-2xl sm:text-3xl lg:text-[34px] leading-[1.18] mt-2 max-w-[280px] sm:max-w-[340px] tracking-tight drop-shadow-md">
              Create your traveler profile.
            </h1>
          </div>

          {/* Bottom Trust Note / Scenic Spacer (replaces stepper pills) */}
          <div className="relative z-10" />
        </div>

        {/* ── RIGHT PANEL: Form & Actions ── */}
        <div className="w-full md:w-1/2 bg-[#180b33] p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Header */}
            <h2 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight">
              {currentStep === "details" && "Create Account"}
              {currentStep === "otp" && "Verify Email OTP"}
              {currentStep === "success" && "Profile Ready!"}
            </h2>
            <p className="text-purple-200/70 text-xs sm:text-[13px] mt-1 font-normal">
              {currentStep === "details" &&
                "Fill details exactly as your flowchart (full profile fields)."}
              {currentStep === "otp" &&
                `An OTP verification code has been sent to ${formData.email || "your email"}.`}
              {currentStep === "success" &&
                "Your traveler profile is active. You are now ready to embark on Himalayan journeys."}
            </p>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mt-3.5 bg-red-950/60 border border-red-500/40 text-red-200 text-xs px-3.5 py-2 rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* ── STEP 1: DETAILS FORM (Matches screenshot with REGISTER → button) ── */}
            {currentStep === "details" && (
              <form onSubmit={handleRegisterSubmit} className="mt-5 sm:mt-6 space-y-3.5">
                {/* Row 1: FULL NAME & EMAIL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  {/* FULL NAME */}
                  <div>
                    <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                      FULL NAME
                    </label>
                    <div className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
                      fieldErrors.fullName
                        ? "border-red-500/70 focus-within:border-red-500 focus-within:ring-red-500/30"
                        : "border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
                    }`}>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                      />
                      <User size={15} className="text-purple-300/60 shrink-0 absolute right-3 pointer-events-none" />
                    </div>
                    {fieldErrors.fullName && (
                      <p className="text-red-400 text-[10px] mt-1">{fieldErrors.fullName}</p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                      EMAIL
                    </label>
                    <div className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
                      fieldErrors.email
                        ? "border-red-500/70 focus-within:border-red-500 focus-within:ring-red-500/30"
                        : "border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
                    }`}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                      />
                      <Mail size={15} className="text-purple-300/60 shrink-0 absolute right-3 pointer-events-none" />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-red-400 text-[10px] mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: PHONE NUMBER with countrycodes.ts */}
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                    PHONE NUMBER
                  </label>
                  <div className="flex gap-2 relative" ref={countryPickerRef}>
                    {/* Country Code Pill with Flag (Increased width for full visibility) */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowCountryPicker(!showCountryPicker)}
                        className="h-11 bg-[#29174d]/85 hover:bg-[#341e61] border border-purple-800/40 rounded-xl px-3 flex items-center justify-between gap-2 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors w-[112px] sm:w-[124px]"
                        title="Select Country Calling Code"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <ReactCountryFlag
                            svg
                            countryCode={formData.countryIso}
                            style={{ width: "1.4em", height: "1.05em", borderRadius: "2px" }}
                          />
                          <span className="tracking-tight">{formData.countryCode}</span>
                        </span>
                        <ChevronDown size={14} className="text-purple-300/70 shrink-0" />
                      </button>

                      {/* Dropdown list using countrycodes.ts with Search */}
                      {showCountryPicker && (
                        <div className="absolute top-12 left-0 z-50 bg-[#1a0a33] border border-purple-700/60 rounded-xl shadow-2xl p-2 w-64 max-h-60 flex flex-col">
                          {/* Search Input */}
                          <div className="relative mb-2">
                            <input
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Search code or ISO..."
                              className="w-full bg-[#271349] text-white text-xs rounded-lg px-7 py-1.5 border border-purple-700/50 focus:outline-none focus:border-pink-500"
                              autoFocus
                            />
                            <Search size={12} className="text-purple-300/60 absolute left-2 top-2" />
                          </div>

                          {/* List of Countries */}
                          <div className="overflow-y-auto flex-1 space-y-0.5 pr-1">
                            {filteredCountryCodes.length === 0 ? (
                              <div className="text-purple-300/50 text-[11px] text-center py-2">
                                No countries found
                              </div>
                            ) : (
                              filteredCountryCodes.map((item, idx) => (
                                <button
                                  key={`${item.code}-${item.iso}-${idx}`}
                                  type="button"
                                  onClick={() => handleSelectCountry(item)}
                                  className={`w-full px-2.5 py-1.5 text-left text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                                    formData.countryCode === item.code &&
                                    formData.countryIso === item.iso
                                      ? "bg-pink-600 text-white font-bold"
                                      : "text-purple-100 hover:bg-purple-800/40"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <ReactCountryFlag
                                      svg
                                      countryCode={item.iso}
                                      style={{ width: "1.3em", height: "1.3em", borderRadius: "2px" }}
                                    />
                                    <span className="font-semibold">{item.code}</span>
                                    <span className="text-purple-300/70 text-[10px]">
                                      ({item.iso})
                                    </span>
                                  </div>
                                  {formData.countryCode === item.code &&
                                    formData.countryIso === item.iso && (
                                      <Check size={12} className="text-white" />
                                    )}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone Input */}
                    <div className={`flex-1 relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
                      fieldErrors.phone
                        ? "border-red-500/70 focus-within:border-red-500 focus-within:ring-red-500/30"
                        : "border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
                    }`}>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="9801234567"
                        className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                      />
                      <Phone size={15} className="text-purple-300/60 shrink-0 absolute right-3 pointer-events-none" />
                    </div>
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-red-400 text-[10px] mt-1">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Row 3: PASSWORD & GENDER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  {/* PASSWORD */}
                  <div>
                    <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                      PASSWORD
                    </label>
                    <div className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
                      fieldErrors.password
                        ? "border-red-500/70 focus-within:border-red-500 focus-within:ring-red-500/30"
                        : "border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
                    }`}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Min 8 chars, 1 upper, 1 number"
                        className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-purple-300/60 hover:text-purple-200 transition-colors cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Lock size={15} />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="text-red-400 text-[10px] mt-1">{fieldErrors.password}</p>
                    )}
                  </div>

                  {/* GENDER */}
                  <div>
                    <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                      GENDER
                    </label>
                    <div className="relative flex items-center bg-[#29174d]/85 border border-purple-800/40 rounded-xl px-3.5 h-11 focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500/30 transition-all">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full bg-transparent text-white text-xs sm:text-sm focus:outline-none cursor-pointer pr-7 appearance-none"
                      >
                        {genderOptions.map((g) => (
                          <option key={g} value={g} className="bg-[#1e0e3b] text-white">
                            {g}
                          </option>
                        ))}
                      </select>
                      <User size={15} className="text-purple-300/60 shrink-0 absolute right-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 3b: CONFIRM PASSWORD */}
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                    CONFIRM PASSWORD
                  </label>
                  <div className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
                    fieldErrors.confirmPassword
                      ? "border-red-500/70 focus-within:border-red-500 focus-within:ring-red-500/30"
                      : "border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
                  }`}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter your password"
                      className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-purple-300/60 hover:text-purple-200 transition-colors cursor-pointer"
                      title={showConfirmPassword ? "Hide" : "Show"}
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Lock size={15} />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-400 text-[10px] mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Row 4: ADDRESS */}
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                    ADDRESS
                  </label>
                  <div className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
                    fieldErrors.address
                      ? "border-red-500/70 focus-within:border-red-500 focus-within:ring-red-500/30"
                      : "border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
                  }`}>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="City, Street, Area"
                      className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                    />
                    <MapPin size={15} className="text-purple-300/60 shrink-0 absolute right-3 pointer-events-none" />
                  </div>
                  {fieldErrors.address && (
                    <p className="text-red-400 text-[10px] mt-1">{fieldErrors.address}</p>
                  )}
                </div>

                {/* Row 5: NATIONALITY */}
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                    NATIONALITY
                  </label>
                  <div className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
                    fieldErrors.nationality
                      ? "border-red-500/70 focus-within:border-red-500 focus-within:ring-red-500/30"
                      : "border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
                  }`}>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      placeholder="Nepali"
                      className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                    />
                    <Globe size={15} className="text-purple-300/60 shrink-0 absolute right-3 pointer-events-none" />
                  </div>
                  {fieldErrors.nationality && (
                    <p className="text-red-400 text-[10px] mt-1">{fieldErrors.nationality}</p>
                  )}
                </div>

                {/* Row 6: REGISTER Action Button (Updated from CONTINUE to REGISTER ->) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-white hover:bg-white/95 active:scale-[0.99] text-[#1e0d3d] font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-black/30 transition-all cursor-pointer group"
                  >
                    <span>{loading ? "SENDING OTP..." : "REGISTER"}</span>
                    <ArrowRight
                      size={15}
                      strokeWidth={2.5}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 2: OTP VERIFICATION VIEW (Sends OTP to Email & Redirects to User Dashboard) ── */}
            {currentStep === "otp" && (
              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
                <div className="bg-[#241344]/80 border border-purple-800/40 rounded-2xl p-5 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3">
                    <ShieldCheck size={26} />
                  </div>
                  <h3 className="text-white font-bold text-sm">Enter 6-Digit Email Code</h3>
                  <p className="text-purple-300/80 text-xs mt-1">
                    An OTP code has been sent to{" "}
                    <strong className="text-pink-300">{formData.email || "your email"}</strong>
                  </p>

                  {/* 6 Digit Inputs */}
                  <div className="flex justify-center gap-2 sm:gap-2.5 mt-5">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpRefs.current[idx] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-10 sm:w-12 h-12 text-center text-lg font-bold bg-[#180b33] text-white border border-purple-700/60 rounded-xl focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500/50"
                      />
                    ))}
                  </div>

                  {/* Resend timer */}
                  <div className="mt-4 flex items-center justify-between text-xs text-purple-300/70 px-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep("details")}
                      className="hover:text-pink-400 cursor-pointer transition-colors"
                    >
                      ← Back to Details
                    </button>
                    <div>
                      {resendTimer > 0 ? (
                        <span>Resend code in {resendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setResendTimer(45)}
                          className="text-pink-400 font-bold hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-white hover:bg-white/95 active:scale-[0.99] text-[#1e0d3d] font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-black/30 transition-all cursor-pointer group"
                >
                  <span>{loading ? "VERIFYING..." : "VERIFY OTP & LOGIN"}</span>
                  <ArrowRight
                    size={15}
                    strokeWidth={2.5}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </form>
            )}

            {/* ── STEP 3: SUCCESS CONFIRMATION VIEW ── */}
            {currentStep === "success" && (
              <div className="mt-6 space-y-5">
                <div className="bg-[#241344]/80 border border-purple-800/40 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-white font-bold text-lg">Registration Completed!</h3>
                  <p className="text-purple-200/80 text-xs sm:text-sm mt-1">
                    Welcome to Trip Himalaya, <strong className="text-white">{formData.fullName || "Traveler"}</strong>.
                  </p>

                  {/* Summary badge */}
                  <div className="mt-4 p-3.5 bg-[#180b33] rounded-xl border border-purple-900/60 text-left text-xs space-y-1.5 text-purple-200/80">
                    <div>
                      <span className="text-purple-400 font-semibold">Email:</span>{" "}
                      {formData.email || "you@example.com"}
                    </div>
                    <div>
                      <span className="text-purple-400 font-semibold">Phone:</span>{" "}
                      <span className="inline-flex items-center gap-1">
                        <ReactCountryFlag
                          svg
                          countryCode={formData.countryIso}
                          style={{ width: "1.2em", height: "1.2em", borderRadius: "2px" }}
                        />
                        <span>{formData.countryCode} {formData.phone || "9801234567"}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-400 font-semibold">Nationality:</span>{" "}
                      {formData.nationality || "Nepali"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      login({
                        name: formData.fullName || "Traveler",
                        email: formData.email,
                        phone: `${formData.countryCode} ${formData.phone}`,
                      });
                      navigate("/dashboard");
                    }}
                    className="flex-1 h-12 bg-white hover:bg-white/95 text-[#1e0d3d] font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>GO TO DASHBOARD</span>
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/packages")}
                    className="flex-1 h-12 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer transition-colors"
                  >
                    BROWSE PACKAGES
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer Link: ALREADY HAVE AN ACCOUNT? SIGN IN ── */}
          <div className="mt-6 pt-4 border-t border-purple-800/30 flex items-center justify-between text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
            <span className="text-purple-200/60">ALREADY HAVE AN ACCOUNT?</span>
            <Link
              to="/login"
              className="text-[#f43f8e] hover:text-[#ff5c9f] transition-colors cursor-pointer"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
