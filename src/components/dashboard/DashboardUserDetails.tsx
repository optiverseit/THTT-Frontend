/**
 * DashboardUserDetails.tsx
 * ────────────────────────
 * Content panel shown when the "USER DETAILS" sidebar tab is active.
 *
 *  Personal Information:
 *   - Full Name, Gender, Nationality, Residential Address
 *
 *  Contact & Security:
 *   - Email Address (always locked — verified at registration)
 *   - Phone Number (with Verify Now OTP — locked after verification)
 *   - Additional Number (no verification required, always editable)
 */

import React, { useState, useEffect, useRef } from "react";
import DashboardHeaderBanner from "./DashboardHeaderBanner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  CheckCircle,
  Globe,
  Users,
  Camera,
  Upload,
  Lock,
  Smartphone,
  X,
  KeyRound,
  PhoneCall,
  RefreshCw,
} from "lucide-react";

export interface UserProfileRecord {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  additionalNumber?: string;
  emergencyContact?: string;
  avatar?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
}

interface DashboardUserDetailsProps {
  user: UserProfileRecord | null;
  onUpdateUser?: (updated: {
    name: string;
    email: string;
    phone: string;
    gender?: string;
    nationality?: string;
    address?: string;
    additionalNumber?: string;
    emergencyContact?: string;
    avatar?: string;
    phoneVerified?: boolean;
    emailVerified?: boolean;
  }) => void;
}

// ─── OTP Modal Component ──────────────────────────────────────────────────────

interface OtpModalProps {
  phone: string;
  onClose: () => void;
  onVerified: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ phone, onClose, onVerified }) => {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [timer]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 120);
  }, []);

  const handleDigit = (i: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    const updated = [...digits];
    updated[i] = clean.slice(-1);
    setDigits(updated);
    setError("");
    if (clean && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0)
      inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;
    const updated = [...digits];
    for (let i = 0; i < 6; i++) updated[i] = paste[i] || "";
    setDigits(updated);
    inputRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  const handleResend = () => {
    setDigits(["", "", "", "", "", ""]);
    setError("");
    setTimer(60);
    setCanResend(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 80);
  };

  const handleVerify = () => {
    const code = digits.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    setIsVerifying(true);
    setError("");
    setTimeout(() => {
      setIsVerifying(false);
      setSuccess(true);
      setTimeout(() => {
        onVerified();
        onClose();
      }, 1200);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#1A0B2E] to-[#2D1F5A] px-6 pt-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF2A75] to-[#8B2CFF] flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Smartphone size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">Phone Verification</h2>
              <p className="text-xs text-slate-300 font-medium">OTP sent to {phone}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {success ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                <CheckCircle size={28} className="text-emerald-500" />
              </div>
              <p className="text-sm font-black text-slate-900">Phone Verified!</p>
              <p className="text-xs text-slate-500 text-center">Your number has been verified successfully.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 text-center font-medium">
                Enter the 6-digit code sent via SMS. (Demo: any 6 digits work)
              </p>
              <div className="flex justify-center gap-2">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKey(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    className={[
                      "w-10 h-12 text-center rounded-xl border-2 text-base font-black text-slate-900 focus:outline-none transition",
                      d ? "border-[#FF2A75] bg-pink-50" : "border-slate-200 bg-slate-50 focus:border-[#FF2A75]",
                    ].join(" ")}
                  />
                ))}
              </div>
              {error && (
                <p className="text-[11px] font-semibold text-red-500 text-center">{error}</p>
              )}
              <div className="text-center">
                {canResend ? (
                  <button onClick={handleResend} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B2CFF] hover:underline cursor-pointer">
                    <RefreshCw size={12} />
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    Resend in{" "}
                    <span className="font-black text-slate-700">
                      {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
                    </span>
                  </span>
                )}
              </div>
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 transition disabled:opacity-60 cursor-pointer"
              >
                {isVerifying ? (
                  <><RefreshCw size={14} className="animate-spin" />Verifying&hellip;</>
                ) : (
                  <><KeyRound size={14} />Verify OTP</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const DashboardUserDetails: React.FC<DashboardUserDetailsProps> = ({
  user,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(() =>
    user?.phoneVerified ?? (localStorage.getItem("phoneVerified") === "true")
  );
  const isEmailVerified = true;

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  // Strip stale "(Family)" or similar annotations from old localStorage values
  const cleanNumber = (val: string | null | undefined) =>
    (val || "").replace(/\s*\(.*?\)/g, "").trim();

  const rawAdditional =
    user?.additionalNumber ||
    user?.emergencyContact ||
    localStorage.getItem("additionalNumber") ||
    localStorage.getItem("emergencyContact") ||
    "";

  const [form, setForm] = useState({
    name: user?.name || localStorage.getItem("name") || "Traveler",
    email: user?.email || localStorage.getItem("email") || "user@triphimalaya.com.np",
    phone: user?.phone || localStorage.getItem("phone") || "+977 9801234567",
    gender: user?.gender || localStorage.getItem("gender") || "Male",
    nationality: user?.nationality || localStorage.getItem("nationality") || "Nepali",
    address: user?.address || localStorage.getItem("address") || "Kathmandu, Bagmati Province, Nepal",
    additionalNumber: cleanNumber(rawAdditional),
    avatar: user?.avatar || localStorage.getItem("avatar") || "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name ?? prev.name,
        email: user.email ?? prev.email,
        phone: user.phone ?? prev.phone,
        gender: user.gender ?? prev.gender,
        nationality: user.nationality ?? prev.nationality,
        address: user.address ?? prev.address,
        additionalNumber: cleanNumber(user.additionalNumber ?? user.emergencyContact ?? prev.additionalNumber),
        avatar: user.avatar ?? prev.avatar,
      }));
      if (user.phoneVerified !== undefined) setIsPhoneVerified(user.phoneVerified);
    }
  }, [user]);

  // One-time cleanup: overwrite localStorage with the cleaned value so "(Family)" never comes back
  useEffect(() => {
    const cleaned = cleanNumber(
      localStorage.getItem("additionalNumber") ||
      localStorage.getItem("emergencyContact") || ""
    );
    if (cleaned) {
      localStorage.setItem("additionalNumber", cleaned);
      localStorage.setItem("emergencyContact", cleaned);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 360;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) { height = Math.round((height * maxDim) / width); width = maxDim; }
        } else {
          if (height > maxDim) { width = Math.round((width * maxDim) / height); height = maxDim; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
          setForm((prev) => ({ ...prev, avatar: compressedDataUrl }));
          if (onUpdateUser) {
            onUpdateUser({ ...form, avatar: compressedDataUrl, emergencyContact: form.additionalNumber, phoneVerified: isPhoneVerified, emailVerified: isEmailVerified });
          }
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3500);
        }
      };
      if (typeof event.target?.result === "string") img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handlePhoneVerified = () => {
    setIsPhoneVerified(true);
    localStorage.setItem("phoneVerified", "true");
    if (onUpdateUser) {
      onUpdateUser({ ...form, emergencyContact: form.additionalNumber, phoneVerified: true, emailVerified: isEmailVerified });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({ ...form, emergencyContact: form.additionalNumber, phoneVerified: isPhoneVerified, emailVerified: isEmailVerified });
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition bg-white";

  return (
    <div className="w-full">
      {isOtpModalOpen && (
        <OtpModal
          phone={form.phone}
          onClose={() => setIsOtpModalOpen(false)}
          onVerified={handlePhoneVerified}
        />
      )}

      <DashboardHeaderBanner>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-[#FF4FA3]">
                <User size={22} />
              </span>
              <span>User Profile Details</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              Registered traveler details for Himalayan permits and trip operations.
            </p>
          </div>
          <button
            type="button"
            id="dashboard-toggle-edit-btn"
            onClick={() => { setIsEditing((prev) => !prev); setSaveSuccess(false); }}
            className={[
              "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider",
              "transition-all cursor-pointer self-start sm:self-auto active:scale-95 shadow-lg",
              isEditing
                ? "bg-white/20 hover:bg-white/30 text-white border border-white/20"
                : "bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white shadow-pink-500/30 hover:brightness-110",
            ].join(" ")}
          >
            {isEditing ? <span>Cancel Edit</span> : <><Edit3 size={14} /><span>Edit Details</span></>}
          </button>
        </div>
      </DashboardHeaderBanner>

      <div className="p-3 sm:p-5 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6 w-full max-w-[1400px]">
        {saveSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs sm:text-sm font-semibold">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        <form id="dashboard-user-form" onSubmit={handleSubmit}>
          {/* ── Profile Photo ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm mb-5">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#FF2A75] via-[#FF4FA3] to-[#8B2CFF] shadow-lg shadow-pink-500/25">
                  <div className="w-full h-full rounded-full bg-[#1A0B2E] overflow-hidden flex items-center justify-center border-2 border-white">
                    {form.avatar ? (
                      <img src={form.avatar} alt={`${form.name} avatar`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl sm:text-4xl font-black text-white select-none">
                        {form.name ? form.name.charAt(0).toUpperCase() : "T"}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change Photo"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white flex items-center justify-center shadow-md shadow-pink-500/30 hover:scale-110 active:scale-95 transition cursor-pointer border-2 border-white"
                >
                  <Camera size={14} />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">Profile Photo</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-md">
                    Upload your photo for your traveler ID badge. Supports JPG, PNG or WEBP (automatically optimized).
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                  <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleImageChange} id="user-avatar-upload-input" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-purple-50 text-[#8B2CFF] hover:bg-purple-100 transition cursor-pointer active:scale-95 border border-purple-200"
                  >
                    <Upload size={14} />
                    <span>{form.avatar ? "Change Photo" : "Upload Photo"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Two-column grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">

            {/* Personal Information */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <User size={16} className="text-[#FF2A75]" />
                  <span>Personal Information</span>
                </h3>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase tracking-wider">VERIFIED</span>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="ud-name" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                {isEditing ? (
                  <input id="ud-name" name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Enter full name" className={inputCls} />
                ) : (
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-[#FF2A75] shrink-0" />
                    <p className="text-sm font-black text-slate-900">{form.name}</p>
                  </div>
                )}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="ud-gender" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
                {isEditing ? (
                  <select id="ud-gender" name="gender" value={form.gender} onChange={handleChange} className={inputCls}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-[#8B2CFF] shrink-0" />
                    <span className="text-sm font-semibold text-slate-800">{form.gender || "—"}</span>
                  </div>
                )}
              </div>

              {/* Nationality */}
              <div>
                <label htmlFor="ud-nationality" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nationality</label>
                {isEditing ? (
                  <input id="ud-nationality" name="nationality" type="text" value={form.nationality} onChange={handleChange} required placeholder="e.g. Nepali, American" className={inputCls} />
                ) : (
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Globe size={14} className="text-[#8B2CFF] shrink-0" />
                    <span>{form.nationality}</span>
                  </div>
                )}
              </div>

              {/* Residential Address */}
              <div>
                <label htmlFor="ud-address" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Residential Address</label>
                {isEditing ? (
                  <input id="ud-address" name="address" type="text" value={form.address} onChange={handleChange} required placeholder="Street, City, Country" className={inputCls} />
                ) : (
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <MapPin size={14} className="text-[#FF2A75] shrink-0" />
                    <span>{form.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact & Security */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Mail size={16} className="text-[#8B2CFF]" />
                  <span>Contact &amp; Security</span>
                </h3>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-50 text-[#8B2CFF] border border-purple-200 uppercase tracking-wider">SECURED</span>
              </div>

              {/* Email — always locked */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <Mail size={14} className="text-[#FF2A75] shrink-0" />
                  <span className="text-xs font-semibold text-slate-500 truncate flex-1">{form.email}</span>
                  <Lock size={12} className="text-slate-400 shrink-0" />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                    <CheckCircle size={11} className="shrink-0" />
                    Email Verified
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Verified at registration — cannot be changed</span>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="ud-phone" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Number</label>
                {isPhoneVerified ? (
                  <>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
                      <Phone size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700 flex-1">{form.phone}</span>
                      <Lock size={12} className="text-emerald-400 shrink-0" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                        <CheckCircle size={11} className="shrink-0" />
                        Verified
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Number verified — cannot be changed</span>
                    </div>
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <input id="ud-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+977 9801234567" className={inputCls} />
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        <span>{form.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsOtpModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white text-[10px] font-bold uppercase tracking-wider shadow shadow-pink-500/20 hover:brightness-110 active:scale-95 transition cursor-pointer"
                      >
                        <Smartphone size={10} />
                        Verify Now
                      </button>
                      <span className="text-[10px] text-slate-400">Verify your number to secure your account.</span>
                    </div>
                  </>
                )}
              </div>

              {/* Additional Number — always editable, no verification */}
              <div>
                <label htmlFor="ud-additional" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Additional Number</label>
                {isEditing ? (
                  <input id="ud-additional" name="additionalNumber" type="tel" value={form.additionalNumber} onChange={handleChange} placeholder="+977 9851000000" className={inputCls} />
                ) : (
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <PhoneCall size={14} className="text-[#8B2CFF] shrink-0" />
                    <span>{form.additionalNumber || "—"}</span>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Save button */}
          {isEditing && (
            <div className="flex justify-end mt-5">
              <button
                type="submit"
                id="dashboard-save-details-btn"
                className="bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Save size={15} />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DashboardUserDetails;
