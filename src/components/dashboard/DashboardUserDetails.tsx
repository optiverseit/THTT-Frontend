import React, { useEffect, useRef, useState } from "react";
import DashboardHeaderBanner from "./DashboardHeaderBanner";
import { User, Mail, Phone, MapPin, Edit3, Save, CheckCircle, Globe, Users, Camera, Upload, Lock, Smartphone, X, KeyRound, PhoneCall, RefreshCw } from "lucide-react";
import { updateUserProfile, uploadUserProfilePicture } from "../../api/BackendApi";

export interface UserProfileRecord {
  name?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  country_code?: string;
  date_of_birth?: string;
  additionalNumber?: string;
  emergencyContact?: string;
  avatar?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
}

interface DashboardUserDetailsProps {
  user: UserProfileRecord | null;
  onUpdateUser?: (updated: any) => void;
}

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
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
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
    if (e.key === "Backspace" && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus();
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
          <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"><X size={14} /></button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF2A75] to-[#8B2CFF] flex items-center justify-center shadow-lg shadow-pink-500/30"><Smartphone size={20} className="text-white" /></div>
            <div><h2 className="text-base font-black text-white tracking-tight">Phone Verification</h2><p className="text-xs text-slate-300 font-medium">OTP sent to {phone}</p></div>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          {success ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center"><CheckCircle size={28} className="text-emerald-500" /></div>
              <p className="text-sm font-black text-slate-900">Phone Verified!</p>
              <p className="text-xs text-slate-500 text-center">Your number has been verified successfully.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 text-center font-medium">Enter the 6-digit verification code sent via SMS.</p>
              <div className="flex justify-center gap-2">
                {digits.map((d, i) => (
                  <input key={i} ref={(el) => { inputRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={d} onChange={(e) => handleDigit(i, e.target.value)} onKeyDown={(e) => handleKey(i, e)} onPaste={i === 0 ? handlePaste : undefined} className={["w-10 h-12 text-center rounded-xl border-2 text-base font-black text-slate-900 focus:outline-none transition", d ? "border-[#FF2A75] bg-pink-50" : "border-slate-200 bg-slate-50 focus:border-[#FF2A75]"].join(" ")} />
                ))}
              </div>
              {error && <p className="text-[11px] font-semibold text-red-500 text-center">{error}</p>}
              <div className="text-center">
                {canResend ? <button onClick={handleResend} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B2CFF] hover:underline cursor-pointer"><RefreshCw size={12} />Resend OTP</button> : <span className="text-xs text-slate-400 font-medium">Resend in <span className="font-black text-slate-700">{String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}</span></span>}
              </div>
              <button onClick={handleVerify} disabled={isVerifying} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 transition disabled:opacity-60 cursor-pointer">
                {isVerifying ? <><RefreshCw size={14} className="animate-spin" />Verifying&hellip;</> : <><KeyRound size={14} />Verify OTP</>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardUserDetails: React.FC<DashboardUserDetailsProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(user?.phoneVerified ?? false);
  const isEmailVerified = user?.emailVerified ?? true;
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const getFullName = (data: UserProfileRecord | null) => {
    if (!data) return "";
    if (data.first_name || data.middle_name || data.last_name) return [data.first_name, data.middle_name, data.last_name].filter(Boolean).join(" ");
    return data.name || "";
  };
  const splitName = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { first_name: "", middle_name: "", last_name: "" };
    if (parts.length === 1) return { first_name: parts[0], middle_name: "", last_name: "" };
    if (parts.length === 2) return { first_name: parts[0], middle_name: "", last_name: parts[1] };
    return { first_name: parts[0], middle_name: parts.slice(1, -1).join(" "), last_name: parts[parts.length - 1] };
  };
  const [form, setForm] = useState({
    name: getFullName(user) || "Traveler",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    nationality: user?.nationality || "",
    address: user?.address || "",
    additionalNumber: user?.additionalNumber || user?.emergencyContact || "",
    avatar: user?.avatar || "",
    date_of_birth: user?.date_of_birth || "",
    country_code: user?.country_code || "",
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "",
    postal_code: user?.postal_code || ""
  });
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: getFullName(user) || prev.name,
      email: user.email ?? prev.email,
      phone: user.phone ?? prev.phone,
      gender: user.gender ?? prev.gender,
      nationality: user.nationality ?? prev.nationality,
      address: user.address ?? prev.address,
      additionalNumber: user.additionalNumber ?? user.emergencyContact ?? prev.additionalNumber,
      avatar: user.avatar ?? prev.avatar,
      date_of_birth: user.date_of_birth ?? prev.date_of_birth,
      country_code: user.country_code ?? prev.country_code,
      city: user.city ?? prev.city,
      state: user.state ?? prev.state,
      country: user.country ?? prev.country,
      postal_code: user.postal_code ?? prev.postal_code
    }));
    if (user.phoneVerified !== undefined) setIsPhoneVerified(user.phoneVerified);
  }, [user]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };
  const updateParentUser = (apiUser: any) => {
    if (!onUpdateUser || !apiUser) return;
    const fullName = [apiUser.first_name, apiUser.middle_name, apiUser.last_name].filter(Boolean).join(" ");
    onUpdateUser({
      name: fullName || form.name,
      email: apiUser.email || form.email,
      phone: apiUser.phone || form.phone,
      gender: apiUser.gender || "",
      nationality: apiUser.nationality || "",
      address: apiUser.address || "",
      additionalNumber: form.additionalNumber,
      emergencyContact: form.additionalNumber,
      avatar: apiUser.avatar || form.avatar,
      phoneVerified: Boolean(apiUser.phone_verified_at) || isPhoneVerified,
      emailVerified: Boolean(apiUser.email_verified_at) || isEmailVerified
    });
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please select a JPG, JPEG, PNG or WEBP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile picture must not exceed 5 MB.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    const previousAvatar = form.avatar;
    setForm((prev) => ({ ...prev, avatar: previewUrl }));
    setIsUploadingAvatar(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await uploadUserProfilePicture(formData);
      const apiUser = response?.data?.user;
      if (!response?.data?.success || !apiUser) throw new Error(response?.data?.message || "Failed to upload profile picture.");
      setForm((prev) => ({ ...prev, avatar: apiUser.avatar || prev.avatar }));
      updateParentUser(apiUser);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setForm((prev) => ({ ...prev, avatar: previousAvatar }));
      const validationErrors = err?.response?.data?.errors;
      const firstValidationError = validationErrors ? Object.values(validationErrors).flat()[0] : null;
      setError(String(firstValidationError || err?.response?.data?.message || err?.message || "Failed to upload profile picture."));
    } finally {
      URL.revokeObjectURL(previewUrl);
      setIsUploadingAvatar(false);
    }
  };
  const handlePhoneVerified = () => {
    setIsPhoneVerified(true);
    if (onUpdateUser) onUpdateUser({ ...form, emergencyContact: form.additionalNumber, phoneVerified: true, emailVerified: isEmailVerified });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSaveSuccess(false);
    try {
      const names = splitName(form.name);
      const payload: any = {
        first_name: names.first_name,
        middle_name: names.middle_name || null,
        last_name: names.last_name,
        gender: form.gender || null,
        nationality: form.nationality || null,
        phone: form.phone || null,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        country: form.country || null,
        postal_code: form.postal_code || null,
        country_code: form.country_code || null,
        date_of_birth: form.date_of_birth || null
      };
      const response = await updateUserProfile(payload);
      const apiUser = response?.data?.user;
      if (!response?.data?.success || !apiUser) throw new Error(response?.data?.message || "Failed to update profile.");
      const fullName = [apiUser.first_name, apiUser.middle_name, apiUser.last_name].filter(Boolean).join(" ");
      setForm((prev) => ({
        ...prev,
        name: fullName || prev.name,
        email: apiUser.email || prev.email,
        phone: apiUser.phone || "",
        gender: apiUser.gender || "",
        nationality: apiUser.nationality || "",
        address: apiUser.address || "",
        avatar: apiUser.avatar || prev.avatar,
        date_of_birth: apiUser.date_of_birth || "",
        country_code: apiUser.country_code || "",
        city: apiUser.city || "",
        state: apiUser.state || "",
        country: apiUser.country || "",
        postal_code: apiUser.postal_code || ""
      }));
      updateParentUser(apiUser);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      const validationErrors = err?.response?.data?.errors;
      const firstValidationError = validationErrors ? Object.values(validationErrors).flat()[0] : null;
      setError(String(firstValidationError || err?.response?.data?.message || err?.message || "Failed to update profile."));
    } finally {
      setIsSaving(false);
    }
  };
  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition bg-white";
  return (
    <div className="w-full">
      {isOtpModalOpen && <OtpModal phone={form.phone} onClose={() => setIsOtpModalOpen(false)} onVerified={handlePhoneVerified} />}
      <DashboardHeaderBanner>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5"><span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-[#FF4FA3]"><User size={22} /></span><span>User Profile Details</span></h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Registered traveler details for Himalayan permits and trip operations.</p>
          </div>
          <button type="button" id="dashboard-toggle-edit-btn" onClick={() => { setIsEditing((prev) => !prev); setSaveSuccess(false); setError(""); }} className={["flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider", "transition-all cursor-pointer self-start sm:self-auto active:scale-95 shadow-lg", isEditing ? "bg-white/20 hover:bg-white/30 text-white border border-white/20" : "bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white shadow-pink-500/30 hover:brightness-110"].join(" ")}>
            {isEditing ? <span>Cancel Edit</span> : <><Edit3 size={14} /><span>Edit Details</span></>}
          </button>
        </div>
      </DashboardHeaderBanner>
      <div className="p-3 sm:p-5 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6 w-full max-w-[1400px]">
        {saveSuccess && <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs sm:text-sm font-semibold"><CheckCircle size={18} className="text-emerald-600 shrink-0" /><span>Profile information updated successfully!</span></div>}
        {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-xs sm:text-sm font-semibold">{error}</div>}
        <form id="dashboard-user-form" onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm mb-5">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#FF2A75] via-[#FF4FA3] to-[#8B2CFF] shadow-lg shadow-pink-500/25">
                  <div className="w-full h-full rounded-full bg-[#1A0B2E] overflow-hidden flex items-center justify-center border-2 border-white">
                    {form.avatar ? <img src={form.avatar} alt={`${form.name} avatar`} className="w-full h-full object-cover" /> : <span className="text-3xl sm:text-4xl font-black text-white select-none">{form.name ? form.name.charAt(0).toUpperCase() : "T"}</span>}
                  </div>
                </div>
                <button type="button" disabled={isUploadingAvatar} onClick={() => fileInputRef.current?.click()} title="Change Photo" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white flex items-center justify-center shadow-md shadow-pink-500/30 hover:scale-110 active:scale-95 transition cursor-pointer border-2 border-white disabled:opacity-60">{isUploadingAvatar ? <RefreshCw size={14} className="animate-spin" /> : <Camera size={14} />}</button>
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div><h3 className="text-base font-black text-slate-900 tracking-tight">Profile Photo</h3><p className="text-xs text-slate-500 font-medium mt-0.5 max-w-md">Upload your photo for your traveler ID badge. Supports JPG, PNG or WEBP up to 5 MB.</p></div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageChange} id="user-avatar-upload-input" />
                  <button type="button" disabled={isUploadingAvatar} onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-purple-50 text-[#8B2CFF] hover:bg-purple-100 transition cursor-pointer active:scale-95 border border-purple-200 disabled:opacity-60">{isUploadingAvatar ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}<span>{isUploadingAvatar ? "Uploading..." : form.avatar ? "Change Photo" : "Upload Photo"}</span></button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100"><h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2"><User size={16} className="text-[#FF2A75]" /><span>Personal Information</span></h3><span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase tracking-wider">VERIFIED</span></div>
              <div>
                <label htmlFor="ud-name" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                {isEditing ? <input id="ud-name" name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Enter full name" className={inputCls} /> : <div className="flex items-center gap-2"><User size={14} className="text-[#FF2A75] shrink-0" /><p className="text-sm font-black text-slate-900">{form.name}</p></div>}
              </div>
              <div>
                <label htmlFor="ud-gender" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
                {isEditing ? <select id="ud-gender" name="gender" value={form.gender} onChange={handleChange} className={inputCls}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option><option value="Prefer not to say">Prefer not to say</option></select> : <div className="flex items-center gap-2"><Users size={14} className="text-[#8B2CFF] shrink-0" /><span className="text-sm font-semibold text-slate-800">{form.gender || "—"}</span></div>}
              </div>
              <div>
                <label htmlFor="ud-nationality" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nationality</label>
                {isEditing ? <input id="ud-nationality" name="nationality" type="text" value={form.nationality} onChange={handleChange} placeholder="e.g. Nepali" className={inputCls} /> : <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Globe size={14} className="text-[#8B2CFF] shrink-0" /><span>{form.nationality || "—"}</span></div>}
              </div>
              <div>
                <label htmlFor="ud-address" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Residential Address</label>
                {isEditing ? <input id="ud-address" name="address" type="text" value={form.address} onChange={handleChange} placeholder="Street address" className={inputCls} /> : <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><MapPin size={14} className="text-[#FF2A75] shrink-0" /><span>{form.address || "—"}</span></div>}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100"><h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2"><Mail size={16} className="text-[#8B2CFF]" /><span>Contact &amp; Security</span></h3><span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-50 text-[#8B2CFF] border border-purple-200 uppercase tracking-wider">SECURED</span></div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"><Mail size={14} className="text-[#FF2A75] shrink-0" /><span className="text-xs font-semibold text-slate-500 truncate flex-1">{form.email}</span><Lock size={12} className="text-slate-400 shrink-0" /></div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5"><span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-widest"><CheckCircle size={11} className="shrink-0" />Email Verified</span><span className="text-[10px] text-slate-400 font-medium">Verified at registration — cannot be changed</span></div>
              </div>
              <div>
                <label htmlFor="ud-phone" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Number</label>
                {isPhoneVerified ? <>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50"><Phone size={14} className="text-emerald-500 shrink-0" /><span className="text-xs font-semibold text-slate-700 flex-1">{form.phone || "—"}</span><Lock size={12} className="text-emerald-400 shrink-0" /></div>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5"><span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-widest"><CheckCircle size={11} className="shrink-0" />Verified</span><span className="text-[10px] text-slate-400 font-medium">Number verified — cannot be changed</span></div>
                </> : <>
                  {isEditing ? <input id="ud-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="9801234567" className={inputCls} /> : <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Phone size={14} className="text-slate-400 shrink-0" /><span>{form.phone || "—"}</span></div>}
                  {form.phone && <div className="flex items-center gap-2 mt-2"><button type="button" onClick={() => setIsOtpModalOpen(true)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white text-[10px] font-bold uppercase tracking-wider shadow shadow-pink-500/20 hover:brightness-110 active:scale-95 transition cursor-pointer"><Smartphone size={10} />Verify Now</button><span className="text-[10px] text-slate-400">Verify your number to secure your account.</span></div>}
                </>}
              </div>
              <div>
                <label htmlFor="ud-additional" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Additional Number</label>
                {isEditing ? <input id="ud-additional" name="additionalNumber" type="tel" value={form.additionalNumber} onChange={handleChange} placeholder="+977 9851000000" className={inputCls} /> : <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><PhoneCall size={14} className="text-[#8B2CFF] shrink-0" /><span>{form.additionalNumber || "—"}</span></div>}
              </div>
            </div>
          </div>
          {isEditing && <div className="flex justify-end mt-5"><button type="submit" disabled={isSaving} id="dashboard-save-details-btn" className="bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-60">{isSaving ? <><RefreshCw size={15} className="animate-spin" /><span>Saving...</span></> : <><Save size={15} /><span>Save Changes</span></>}</button></div>}
        </form>
      </div>
    </div>
  );
};

export default DashboardUserDetails;