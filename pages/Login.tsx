import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Phone,
  Facebook,
  Key,
  ArrowRight,
  Loader2,
  ShieldCheck,
  MapPin,
  Globe2,
  User,
  BadgeCheck,
} from "lucide-react";

interface LoginProps {
  onLogin: (user: any) => void;
}

type LoginMethod = "password" | "google" | "facebook";
type IdentifierMode = "email" | "phone";
type Screen =
  | "login"
  | "passwordOtp"
  | "socialCompleteProfile"
  | "forgotIdentify"
  | "forgotOtp"
  | "forgotNewPassword"
  | "forgotSuccess";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/60 mb-2">
    {children}
  </div>
);

function Input({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  inputMode,
  autoComplete,
  maxLength,
  disabled,
}: {
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  maxLength?: number;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <input
        disabled={disabled}
        type={type}
        required={required}
        value={value}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5",
          "text-white placeholder:text-white/35 font-bold text-sm",
          "focus:outline-none focus:ring-2 focus:ring-[#D92671]/60 focus:border-[#D92671]/60",
          "transition-all pr-11",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      />
      {icon ? (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35">
          {icon}
        </div>
      ) : null}
    </div>
  );
}

function OTPBoxes({
  value,
  onChange,
  length = 6,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  disabled?: boolean;
}) {
  const cells = Array.from({ length }, (_, i) => value[i] || "");
  return (
    <div className="grid grid-cols-6 gap-2">
      {cells.map((c, idx) => (
        <input
          key={idx}
          disabled={disabled}
          value={c}
          onChange={(e) => {
            const nextChar = e.target.value.replace(/\D/g, "").slice(-1);
            const arr = value.split("");
            arr[idx] = nextChar;
            const next = arr.join("").slice(0, length);
            onChange(next);
            // auto focus next
            const el = e.currentTarget;
            if (nextChar && el.nextElementSibling instanceof HTMLInputElement) {
              el.nextElementSibling.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !cells[idx]) {
              const prev = e.currentTarget
                .previousElementSibling as HTMLInputElement | null;
              prev?.focus();
            }
          }}
          inputMode="numeric"
          maxLength={1}
          className={cn(
            "h-12 rounded-2xl bg-white/5 border border-white/10 text-white text-center text-lg font-black",
            "focus:outline-none focus:ring-2 focus:ring-[#D92671]/60 focus:border-[#D92671]/60",
            "transition-all",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  // FLOW CONTROLS
  const [screen, setScreen] = useState<Screen>("login");
  const [loading, setLoading] = useState(false);

  // LOGIN METHOD STATES
  const [identifierMode, setIdentifierMode] = useState<IdentifierMode>("email");

  // FORM DATA
  const [form, setForm] = useState({
    email: "",
    phone: "",
    countryCode: "+977",
    password: "",
    otp: "",

    // social completion fields
    fullName: "",
    address: "",
    nationality: "Nepali",
    gender: "Other",
  });

  const identifierLabel = useMemo(() => {
    if (identifierMode === "email") return "Email Address";
    return "Phone Number";
  }, [identifierMode]);

  const identifierValue = identifierMode === "email" ? form.email : form.phone;

  const resetOtp = () => setForm((p) => ({ ...p, otp: "" }));

  // ---------- MOCK RULES (replace with backend) ----------
  // simulate: password login requires OTP on first login
  const shouldRequireOtpForPasswordLogin = (id: string) => {
    // demo heuristic: if no password typed -> false; otherwise require OTP if endswith "1"
    return Boolean(id) && id.trim().length > 3;
  };

  // simulate: social login is first time -> require completion
  const isFirstTimeSocial = true;

  const doLogin = (user: any) => {
    onLogin(user);
    navigate("/dashboard");
  };

  // ---------- ACTIONS ----------
  const handlePasswordLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const id = identifierValue.trim();
    if (!id) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (shouldRequireOtpForPasswordLogin(id)) {
        resetOtp();
        setScreen("passwordOtp");
        return;
      }

      doLogin({
        id: "u1",
        fullName: "John Doe",
        email: form.email || "john@example.com",
        phone: form.phone || `${form.countryCode} 9801234567`,
        photo: null,
        address: "Kantipath, Kathmandu",
        gender: "Male",
        nationality: "Nepali",
        createdAt: "2024-01-15",
        lastLogin: new Date().toISOString(),
      });
    }, 900);
  };

  const handlePasswordOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (form.otp.replace(/\D/g, "").length < 6) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      doLogin({
        id: "u1",
        fullName: "John Doe",
        email: form.email || "john@example.com",
        phone: form.phone || `${form.countryCode} 9801234567`,
        photo: null,
        address: "Kantipath, Kathmandu",
        gender: "Male",
        nationality: "Nepali",
        createdAt: "2024-01-15",
        lastLogin: new Date().toISOString(),
      });
    }, 900);
  };

  const handleSocialClick = (method: LoginMethod) => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // In real app: redirect to OAuth, get profile payload back, check if profile is complete.
      if (isFirstTimeSocial) {
        resetOtp();
        setScreen("socialCompleteProfile");
        // seed a name for nicer UX
        setForm((p) => ({
          ...p,
          fullName: method === "facebook" ? "Facebook User" : "Google User",
        }));
        return;
      }

      doLogin({
        id: method === "facebook" ? "u_fb" : "u_gg",
        fullName: method === "facebook" ? "Facebook User" : "Google User",
        email:
          method === "facebook" ? "fb_user@gmail.com" : "google_user@gmail.com",
        phone: "",
        photo:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
        address: "",
        gender: "Other",
        nationality: "International",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
    }, 900);
  };

  const handleCompleteSocialProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Flowchart: Google asks CC, phone, address, nationality.
      // Facebook asks email + CC, phone, address, nationality.
      // We'll keep both available, but validate basics.
      const phoneOk = form.phone.trim().length >= 7;
      if (!phoneOk) return;

      doLogin({
        id: "u_social",
        fullName: form.fullName || "Traveler",
        email: form.email || "social_user@gmail.com",
        phone: `${form.countryCode} ${form.phone}`,
        photo:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=160",
        address: form.address,
        gender: form.gender,
        nationality: form.nationality,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
    }, 900);
  };

  // FORGOT PASSWORD
  const handleForgotIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const id = identifierValue.trim();
    if (!id) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      resetOtp();
      setScreen("forgotOtp");
    }, 800);
  };

  const handleForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (form.otp.replace(/\D/g, "").length < 6) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForm((p) => ({ ...p, password: "" }));
      setScreen("forgotNewPassword");
    }, 800);
  };

  const handleForgotNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (form.password.trim().length < 6) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen("forgotSuccess");
      setTimeout(() => {
        setScreen("login");
      }, 1200);
    }, 800);
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#140A20]">
      {/* Background: TOP pink glow / BOTTOM purple base */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[920px] rounded-full bg-[#D92671]/30 blur-[90px]" />
        <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-b from-[#2D1347] to-[#190B2B]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-6xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)] bg-white/5 backdrop-blur">
          <div className="grid lg:grid-cols-2">
            {/* LEFT VISUAL */}
            <div className="relative min-h-[260px] lg:min-h-[720px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1400"
                alt="Trip Himalaya"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140A20]/95 via-[#2D1347]/40 to-transparent" />
              <div className="absolute inset-0 p-10 lg:p-14 flex flex-col">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 self-start">
                  <ShieldCheck className="text-[#D92671]" size={16} />
                  <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.22em]">
                    Secure Access
                  </span>
                </div>

                <div className="mt-auto">
                  <h2 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                    Login that matches your flow.
                  </h2>
                  <p className="text-white/70 mt-3 font-bold text-sm max-w-md">
                    Social login first time? We’ll collect the missing details.
                    Password login first time? Verify via OTP. Forgot password?
                    Reset with OTP.
                  </p>

                  {/* <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleSocialClick("google")}
                      disabled={loading}
                      className="px-5 py-3 rounded-2xl bg-white text-[#2D1347] font-black text-[11px] tracking-widest uppercase hover:scale-[1.02] transition-all"
                    >
                      Continue with Google
                    </button>
                    <button
                      onClick={() => handleSocialClick("facebook")}
                      disabled={loading}
                      className="px-5 py-3 rounded-2xl bg-[#1877F2] text-white font-black text-[11px] tracking-widest uppercase hover:scale-[1.02] transition-all"
                    >
                      Continue with Facebook
                    </button>
                  </div> */}
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="p-8 md:p-12 lg:p-14 bg-gradient-to-b from-[#2D1347] to-[#190B2B]">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[#D92671] text-[10px] font-black uppercase tracking-[0.3em]">
                    Trip Himalaya
                  </div>
                  <h3 className="text-white text-3xl font-black tracking-tight mt-2">
                    {screen === "login" && "Login"}
                    {screen === "passwordOtp" && "Verify OTP"}
                    {screen === "socialCompleteProfile" && "Complete Profile"}
                    {screen.startsWith("forgot") && "Forgot Password"}
                  </h3>
                  <p className="text-white/55 text-xs font-bold mt-2">
                    {screen === "login"  }
                    {screen === "passwordOtp" &&
                      "First-time login requires verification."}
                    {screen === "socialCompleteProfile" &&
                      "First-time social login: please provide missing details."}
                    {screen === "forgotIdentify" &&
                      "Enter your email or phone to receive OTP."}
                    {screen === "forgotOtp" && "Enter the OTP you received."}
                    {screen === "forgotNewPassword" &&
                      "Set your new password."}
                    {screen === "forgotSuccess" &&
                      "Password changed successfully."}
                  </p>
                </div>

                 
              </div>

              {/* Step chips */}
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  { key: "login", label: "Login" },
                  { key: "passwordOtp", label: "OTP" },
                  { key: "socialCompleteProfile", label: "Details" },
                  { key: "forgotIdentify", label: "Forgot" },
                ].map((s) => {
                  const active =
                    (screen === "login" && s.key === "login") ||
                    (screen === "passwordOtp" && s.key === "passwordOtp") ||
                    (screen === "socialCompleteProfile" &&
                      s.key === "socialCompleteProfile") ||
                    (screen.startsWith("forgot") && s.key === "forgotIdentify");
                  return (
                    <span
                      key={s.key}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em]",
                        active
                          ? "bg-[#D92671] text-white"
                          : "bg-white/5 text-white/55 border border-white/10"
                      )}
                    >
                      {s.label}
                    </span>
                  );
                })}
              </div>

              {/* Content */}
              <div className="mt-8">
                {/* MAIN LOGIN SCREEN */}
                {screen === "login" && (
                  <>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2">
                      <button
                        onClick={() => setIdentifierMode("email")}
                        className={cn(
                          "flex-1 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] transition-all",
                          identifierMode === "email"
                            ? "bg-[#D92671] text-white"
                            : "text-white/60 hover:text-white"
                        )}
                      >
                        Email
                      </button>
                      <button
                        onClick={() => setIdentifierMode("phone")}
                        className={cn(
                          "flex-1 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] transition-all",
                          identifierMode === "phone"
                            ? "bg-[#D92671] text-white"
                            : "text-white/60 hover:text-white"
                        )}
                      >
                        Phone
                      </button>
                    </div>

                    <form
                      onSubmit={handlePasswordLoginSubmit}
                      className="mt-6 space-y-5"
                    >
                      <div>
                        <FieldLabel>{identifierLabel}</FieldLabel>
                        {identifierMode === "email" ? (
                          <Input
                            icon={<Mail size={16} />}
                            type="email"
                            required
                            autoComplete="email"
                            value={form.email}
                            onChange={(v) =>
                              setForm((p) => ({ ...p, email: v }))
                            }
                            placeholder="you@example.com"
                          />
                        ) : (
                          <div className="grid grid-cols-[110px_1fr] gap-3">
                            <Input
                              value={form.countryCode}
                              onChange={(v) =>
                                setForm((p) => ({ ...p, countryCode: v }))
                              }
                              placeholder="+977"
                              required
                              inputMode="tel"
                            />
                            <Input
                              icon={<Phone size={16} />}
                              value={form.phone}
                              onChange={(v) =>
                                setForm((p) => ({ ...p, phone: v }))
                              }
                              placeholder="9801234567"
                              required
                              inputMode="tel"
                              autoComplete="tel"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <FieldLabel>Password</FieldLabel>
                        <Input
                          icon={<Lock size={16} />}
                          type="password"
                          required
                          autoComplete="current-password"
                          value={form.password}
                          onChange={(v) =>
                            setForm((p) => ({ ...p, password: v }))
                          }
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            resetOtp();
                            setScreen("forgotIdentify");
                          }}
                          className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 hover:text-[#D92671] transition-colors"
                        >
                          Forgot password?
                        </button>

                        <Link
                          to="/register"
                          className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors"
                        >
                          Create account
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                          "w-full rounded-2xl py-4 font-black uppercase tracking-widest text-xs",
                          "bg-white text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all",
                          "shadow-[0_20px_50px_rgba(217,38,113,0.18)] flex items-center justify-center gap-3",
                          loading && "opacity-80"
                        )}
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <>
                            Enter <ArrowRight size={18} />
                          </>
                        )}
                      </button>

                      <div className="pt-4">
                        <div className="text-white/45 text-[10px] font-black uppercase tracking-[0.22em]">
                          Or continue with
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleSocialClick("google")}
                            disabled={loading}
                            className="rounded-2xl bg-white text-[#2D1347] py-3 font-black text-[10px] tracking-widest uppercase hover:scale-[1.01] transition-all"
                          >
                            Google
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSocialClick("facebook")}
                            disabled={loading}
                            className="rounded-2xl bg-[#1877F2] text-white py-3 font-black text-[10px] tracking-widest uppercase hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                          >
                            <Facebook size={16} fill="white" />
                            Facebook
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                )}

                {/* PASSWORD LOGIN FIRST TIME OTP */}
                {screen === "passwordOtp" && (
                  <form onSubmit={handlePasswordOtpVerify} className="space-y-6">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-[#D92671]/20 border border-[#D92671]/30 flex items-center justify-center">
                          <Key className="text-[#D92671]" size={18} />
                        </div>
                        <div>
                          <div className="text-white font-black">
                            OTP Verification
                          </div>
                          <div className="text-white/55 text-xs font-bold">
                            Sent to your{" "}
                            {identifierMode === "email" ? "email" : "phone"}.
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <FieldLabel>Enter 6-digit OTP</FieldLabel>
                        <OTPBoxes
                          value={form.otp}
                          onChange={(v) =>
                            setForm((p) => ({ ...p, otp: v }))
                          }
                          disabled={loading}
                          length={6}
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            resetOtp();
                            setScreen("login");
                          }}
                          className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => resetOtp()}
                          className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 hover:text-[#D92671] transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "w-full rounded-2xl py-4 font-black uppercase tracking-widest text-xs",
                        "bg-white text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all",
                        "shadow-[0_20px_50px_rgba(217,38,113,0.18)] flex items-center justify-center gap-3",
                        loading && "opacity-80"
                      )}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          Verify & Login <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* SOCIAL FIRST-TIME COMPLETE PROFILE */}
                {screen === "socialCompleteProfile" && (
                  <form
                    onSubmit={handleCompleteSocialProfile}
                    className="space-y-5"
                  >
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-[#D92671]/20 border border-[#D92671]/30 flex items-center justify-center">
                          <User className="text-[#D92671]" size={18} />
                        </div>
                        <div>
                          <div className="text-white font-black">
                            Complete your profile
                          </div>
                          <div className="text-white/55 text-xs font-bold">
                            As per your flowchart: ask details on first social
                            login.
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div>
                          <FieldLabel>Full Name</FieldLabel>
                          <Input
                            icon={<User size={16} />}
                            value={form.fullName}
                            onChange={(v) =>
                              setForm((p) => ({ ...p, fullName: v }))
                            }
                            placeholder="Your name"
                            required
                          />
                        </div>

                        <div>
                          <FieldLabel>Email (Required for Facebook flow)</FieldLabel>
                          <Input
                            icon={<Mail size={16} />}
                            type="email"
                            value={form.email}
                            onChange={(v) =>
                              setForm((p) => ({ ...p, email: v }))
                            }
                            placeholder="you@example.com"
                          />
                        </div>

                        <div>
                          <FieldLabel>Country Code + Phone</FieldLabel>
                          <div className="grid grid-cols-[110px_1fr] gap-3">
                            <Input
                              value={form.countryCode}
                              onChange={(v) =>
                                setForm((p) => ({ ...p, countryCode: v }))
                              }
                              placeholder="+977"
                              required
                              inputMode="tel"
                            />
                            <Input
                              icon={<Phone size={16} />}
                              value={form.phone}
                              onChange={(v) =>
                                setForm((p) => ({ ...p, phone: v }))
                              }
                              placeholder="9801234567"
                              required
                              inputMode="tel"
                            />
                          </div>
                        </div>

                        <div>
                          <FieldLabel>Address</FieldLabel>
                          <Input
                            icon={<MapPin size={16} />}
                            value={form.address}
                            onChange={(v) =>
                              setForm((p) => ({ ...p, address: v }))
                            }
                            placeholder="City, Street, Area"
                          />
                        </div>

                        <div>
                          <FieldLabel>Nationality</FieldLabel>
                          <div className="relative">
                            <select
                              value={form.nationality}
                              onChange={(e) =>
                                setForm((p) => ({
                                  ...p,
                                  nationality: e.target.value,
                                }))
                              }
                              className={cn(
                                "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5",
                                "text-white font-bold text-sm",
                                "focus:outline-none focus:ring-2 focus:ring-[#D92671]/60 focus:border-[#D92671]/60",
                                "transition-all appearance-none"
                              )}
                            >
                              <option className="text-black" value="Nepali">
                                Nepali
                              </option>
                              <option className="text-black" value="International">
                                International
                              </option>
                              <option className="text-black" value="Indian">
                                Indian
                              </option>
                              <option className="text-black" value="Other">
                                Other
                              </option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none">
                              <Globe2 size={16} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setScreen("login")}
                          className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                          Required: phone (+ country)
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "w-full rounded-2xl py-4 font-black uppercase tracking-widest text-xs",
                        "bg-white text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all",
                        "shadow-[0_20px_50px_rgba(217,38,113,0.18)] flex items-center justify-center gap-3",
                        loading && "opacity-80"
                      )}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          Save & Continue <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* FORGOT PASSWORD FLOW */}
                {screen === "forgotIdentify" && (
                  <form onSubmit={handleForgotIdentify} className="space-y-5">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-white font-black">
                            Enter email or phone
                          </div>
                          <div className="text-white/55 text-xs font-bold">
                            We’ll send an OTP to reset your password.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setScreen("login")}
                          className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors"
                        >
                          Back
                        </button>
                      </div>

                      <div className="mt-5">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2">
                          <button
                            type="button"
                            onClick={() => setIdentifierMode("email")}
                            className={cn(
                              "flex-1 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] transition-all",
                              identifierMode === "email"
                                ? "bg-[#D92671] text-white"
                                : "text-white/60 hover:text-white"
                            )}
                          >
                            Email
                          </button>
                          <button
                            type="button"
                            onClick={() => setIdentifierMode("phone")}
                            className={cn(
                              "flex-1 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] transition-all",
                              identifierMode === "phone"
                                ? "bg-[#D92671] text-white"
                                : "text-white/60 hover:text-white"
                            )}
                          >
                            Phone
                          </button>
                        </div>
                      </div>

                      <div className="mt-5">
                        {identifierMode === "email" ? (
                          <>
                            <FieldLabel>Email</FieldLabel>
                            <Input
                              icon={<Mail size={16} />}
                              type="email"
                              required
                              value={form.email}
                              onChange={(v) =>
                                setForm((p) => ({ ...p, email: v }))
                              }
                              placeholder="you@example.com"
                            />
                          </>
                        ) : (
                          <>
                            <FieldLabel>Phone</FieldLabel>
                            <div className="grid grid-cols-[110px_1fr] gap-3">
                              <Input
                                value={form.countryCode}
                                onChange={(v) =>
                                  setForm((p) => ({ ...p, countryCode: v }))
                                }
                                placeholder="+977"
                                required
                              />
                              <Input
                                icon={<Phone size={16} />}
                                value={form.phone}
                                onChange={(v) =>
                                  setForm((p) => ({ ...p, phone: v }))
                                }
                                placeholder="9801234567"
                                required
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "w-full rounded-2xl py-4 font-black uppercase tracking-widest text-xs",
                        "bg-white text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all",
                        "shadow-[0_20px_50px_rgba(217,38,113,0.18)] flex items-center justify-center gap-3",
                        loading && "opacity-80"
                      )}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          Send OTP <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {screen === "forgotOtp" && (
                  <form onSubmit={handleForgotOtp} className="space-y-5">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-black">Enter OTP</div>
                          <div className="text-white/55 text-xs font-bold">
                            OTP sent to your{" "}
                            {identifierMode === "email" ? "email" : "phone"}.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setScreen("forgotIdentify")}
                          className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors"
                        >
                          Back
                        </button>
                      </div>

                      <div className="mt-5">
                        <FieldLabel>6-digit OTP</FieldLabel>
                        <OTPBoxes
                          value={form.otp}
                          onChange={(v) =>
                            setForm((p) => ({ ...p, otp: v }))
                          }
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "w-full rounded-2xl py-4 font-black uppercase tracking-widest text-xs",
                        "bg-white text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all",
                        "shadow-[0_20px_50px_rgba(217,38,113,0.18)] flex items-center justify-center gap-3",
                        loading && "opacity-80"
                      )}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          Verify OTP <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {screen === "forgotNewPassword" && (
                  <form onSubmit={handleForgotNewPassword} className="space-y-5">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <div className="text-white font-black">
                        Set new password
                      </div>
                      <div className="text-white/55 text-xs font-bold mt-1">
                        Minimum 6 characters (demo validation).
                      </div>

                      <div className="mt-5">
                        <FieldLabel>New Password</FieldLabel>
                        <Input
                          icon={<Lock size={16} />}
                          type="password"
                          required
                          value={form.password}
                          onChange={(v) =>
                            setForm((p) => ({ ...p, password: v }))
                          }
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "w-full rounded-2xl py-4 font-black uppercase tracking-widest text-xs",
                        "bg-white text-[#2D1347] hover:bg-[#D92671] hover:text-white transition-all",
                        "shadow-[0_20px_50px_rgba(217,38,113,0.18)] flex items-center justify-center gap-3",
                        loading && "opacity-80"
                      )}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          Change Password <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {screen === "forgotSuccess" && (
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-[#D92671]/20 border border-[#D92671]/30 flex items-center justify-center">
                      <BadgeCheck className="text-[#D92671]" size={22} />
                    </div>
                    <div className="text-white font-black mt-4">
                      Password change successfully
                    </div>
                    <div className="text-white/55 text-xs font-bold mt-2">
                      Redirecting you back to login…
                    </div>
                    <Loader2 className="animate-spin mx-auto mt-5 text-white/70" />
                  </div>
                )}
              </div>

              {/* Bottom link (only show when not in login) */}
              {screen !== "login" && (
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setScreen("login")}
                    className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors"
                  >
                    Back to Login
                  </button>
                  <Link
                    to="/register"
                    className="text-[10px] font-black uppercase tracking-[0.22em] text-[#D92671] hover:underline"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
