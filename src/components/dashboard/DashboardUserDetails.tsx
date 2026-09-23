/**
 * DashboardUserDetails.tsx
 * ────────────────────────
 * Content panel shown when the "USER DETAILS" sidebar tab is active.
 * Displays and allows inline editing of all traveler profile details
 * collected during registration:
 *
 *  Personal Information:
 *   - Full Name
 *   - Gender (Male, Female, Other, Prefer not to say)
 *   - Nationality (e.g. Nepali)
 *   - Residential Address
 *
 *  Contact & Security:
 *   - Email Address (with "Email Verified" status badge)
 *   - Phone Number (with Country Code)
 *   - Emergency Contact
 */

import React, { useState, useEffect, useRef } from "react";
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
  ShieldCheck,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";

export interface UserProfileRecord {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  emergencyContact?: string;
  avatar?: string;
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
    emergencyContact?: string;
    avatar?: string;
  }) => void;
}

const DashboardUserDetails: React.FC<DashboardUserDetailsProps> = ({
  user,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: user?.name || localStorage.getItem("name") || "Traveler",
    email: user?.email || localStorage.getItem("email") || "user@triphimalaya.com.np",
    phone: user?.phone || localStorage.getItem("phone") || "+977 9801234567",
    gender: user?.gender || localStorage.getItem("gender") || "Male",
    nationality: user?.nationality || localStorage.getItem("nationality") || "Nepali",
    address: user?.address || localStorage.getItem("address") || "Kathmandu, Bagmati Province, Nepal",
    emergencyContact: user?.emergencyContact || localStorage.getItem("emergencyContact") || "+977 9851000000 (Family)",
    avatar: user?.avatar || localStorage.getItem("avatar") || "",
  });

  // Sync form when user prop updates
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
        emergencyContact: user.emergencyContact ?? prev.emergencyContact,
        avatar: user.avatar ?? prev.avatar,
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        // Resize to max 360x360 for high quality & optimal localStorage storage
        const maxDim = 360;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
          setForm((prev) => ({ ...prev, avatar: compressedDataUrl }));
          // Immediately update so the header welcome banner circle updates right away
          if (onUpdateUser) {
            onUpdateUser({
              ...form,
              avatar: compressedDataUrl,
            });
          }
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3500);
        }
      };
      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setForm((prev) => ({ ...prev, avatar: "" }));
    if (onUpdateUser) {
      onUpdateUser({
        ...form,
        avatar: "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser(form);
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <section id="dashboard-user-details" aria-label="User profile details" className="space-y-4 sm:space-y-5 md:space-y-6">

      {/* ── Top action header ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-7 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <User size={24} className="text-[#8B2CFF]" />
            <span>User Profile Details</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Registered traveler details for Himalayan permits and trip operations.
          </p>
        </div>

        <button
          type="button"
          id="dashboard-toggle-edit-btn"
          onClick={() => {
            setIsEditing((prev) => !prev);
            setSaveSuccess(false);
          }}
          className={[
            "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider",
            "transition-all cursor-pointer self-start sm:self-auto active:scale-95",
            isEditing
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : "bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white shadow-md shadow-pink-500/25 hover:brightness-110",
          ].join(" ")}
        >
          {isEditing ? (
            <span>Cancel Edit</span>
          ) : (
            <>
              <Edit3 size={14} />
              <span>Edit Details</span>
            </>
          )}
        </button>
      </div>

      {/* ── Save success banner ── */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs sm:text-sm font-semibold">
          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      {/* ── Detail cards grid ── */}
      <form id="dashboard-user-form" onSubmit={handleSubmit}>
        {/* ── Profile Photo Section ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm mb-5">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative shrink-0 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#FF2A75] via-[#FF4FA3] to-[#8B2CFF] shadow-lg shadow-pink-500/25">
                <div className="w-full h-full rounded-full bg-[#1A0B2E] overflow-hidden flex items-center justify-center border-2 border-white">
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt={`${form.name} avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-black text-white select-none">
                      {form.name ? form.name.charAt(0).toUpperCase() : "T"}
                    </span>
                  )}
                </div>
              </div>

              {/* Floating Camera Button on the circle */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Change Photo"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white flex items-center justify-center shadow-md shadow-pink-500/30 hover:scale-110 active:scale-95 transition cursor-pointer border-2 border-white"
              >
                <Camera size={14} />
              </button>
            </div>

            {/* Photo Info & Action Buttons */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Profile Photo
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-md">
                  Upload your photo for your traveler ID badge and dashboard header banner.
                  Supports JPG, PNG or WEBP (automatically optimized).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                  id="user-avatar-upload-input"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-purple-50 text-[#8B2CFF] hover:bg-purple-100 transition cursor-pointer active:scale-95 border border-purple-200"
                >
                  <Upload size={14} />
                  <span>{form.avatar ? "Change Photo" : "Upload Photo"}</span>
                </button>

                {form.avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer active:scale-95 border border-rose-200"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">

          {/* Personal Information */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User size={16} className="text-[#FF2A75]" />
                <span>Personal Information</span>
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase tracking-wider">
                VERIFIED
              </span>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="ud-name" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              {isEditing ? (
                <input
                  id="ud-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition"
                />
              ) : (
                <p className="text-sm font-black text-slate-900">{form.name}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="ud-gender" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              {isEditing ? (
                <select
                  id="ud-gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 bg-white transition"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#8B2CFF] shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">{form.gender}</span>
                </div>
              )}
            </div>

            {/* Nationality */}
            <div>
              <label htmlFor="ud-nationality" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Nationality
              </label>
              {isEditing ? (
                <input
                  id="ud-nationality"
                  name="nationality"
                  type="text"
                  value={form.nationality}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Nepali, American, British"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition"
                />
              ) : (
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Globe size={14} className="text-[#8B2CFF] shrink-0" />
                  <span>{form.nationality}</span>
                </div>
              )}
            </div>

            {/* Residential Address */}
            <div>
              <label htmlFor="ud-address" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Residential Address
              </label>
              {isEditing ? (
                <input
                  id="ud-address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Street, City, Country"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition"
                />
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
                <span>Contact & Security</span>
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-50 text-[#8B2CFF] border border-purple-200 uppercase tracking-wider">
                SECURED
              </span>
            </div>

            {/* Email (read-only with verified badge) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Mail size={14} className="text-[#FF2A75] shrink-0" />
                <span className="truncate">{form.email}</span>
              </div>
              {/* Email Verified badge */}
              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                <CheckCircle size={11} className="shrink-0" />
                Email Verified
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Primary login address — verified during registration.
              </span>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="ud-phone" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  id="ud-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+977 9801234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition"
                />
              ) : (
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Phone size={14} className="text-emerald-500 shrink-0" />
                  <span>{form.phone}</span>
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            <div>
              <label htmlFor="ud-emergency" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Emergency Contact
              </label>
              {isEditing ? (
                <input
                  id="ud-emergency"
                  name="emergencyContact"
                  type="text"
                  value={form.emergencyContact}
                  onChange={handleChange}
                  placeholder="+977 9851000000 (Family)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition"
                />
              ) : (
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <ShieldCheck size={14} className="text-[#8B2CFF] shrink-0" />
                  <span>{form.emergencyContact}</span>
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
    </section>
  );
};

export default DashboardUserDetails;

