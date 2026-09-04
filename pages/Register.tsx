import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  User,
  Phone,
  MapPin,
  Loader2,
  ArrowRight,
  Lock,
  Globe2,
  MessageSquareText,
  CheckCircle2,
} from "lucide-react";

interface RegisterProps {
  onRegister: (user: any) => void;
}

type Step = "details" | "verify" | "success";

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

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    countryCode: "+977",
    phone: "",
    password: "",
    gender: "Male",
    address: "",
    nationality: "Nepali",
  });

  const handleDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtp("");
      setStep("verify");
    }, 900);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (otp.replace(/\D/g, "").length < 6) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");

      const newUser = {
        id: "u" + Math.random().toString(36).slice(2, 10),
        ...form,
        phone: `${form.countryCode} ${form.phone}`,
        photo: null,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      setTimeout(() => {
        onRegister(newUser);
        navigate("/dashboard");
      }, 1200);
    }, 900);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#140A20]">
      {/* Background: TOP pink / BOTTOM purple */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[920px] rounded-full bg-[#D92671]/30 blur-[90px]" />
        <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-b from-[#5D2A8E] to-[#190B2B]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-6xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)] bg-white/5 backdrop-blur">
          <div className="grid lg:grid-cols-2">
            {/* LEFT */}
            <div className="relative min-h-[260px] lg:min-h-[760px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1400"
                alt="Register"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140A20]/95 via-[#5D2A8E]/35 to-transparent" />
              <div className="absolute inset-0 p-10 lg:p-14 flex flex-col">
                <div className="text-[#D92671] text-[10px] font-black uppercase tracking-[0.3em]">
                  Trip Himalaya
                </div>
                <h2 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight mt-2">
                  Create your traveler profile.
                </h2>
                 

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {["Details", "OTP", "Success"].map((t, i) => {
                      const active =
                        (step === "details" && i === 0) ||
                        (step === "verify" && i === 1) ||
                        (step === "success" && i === 2);
                      return (
                        <span
                          key={t}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em]",
                            active
                              ? "bg-[#D92671] text-white"
                              : "bg-white/10 text-white/65 border border-white/10"
                          )}
                        >
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="p-8 md:p-12 lg:p-14 bg-gradient-to-b from-[#5D2A8E] to-[#190B2B]">
              <h3 className="text-white text-3xl font-black tracking-tight">
                {step === "details" && "Create Account"}
                {step === "verify" && "Verify OTP"}
                {step === "success" && "Ready!"}
              </h3>
              <p className="text-white/55 text-xs font-bold mt-2">
                {step === "details" &&
                  "Fill details exactly as your flowchart (full profile fields)."}
                {step === "verify" &&
                  "OTP sent to your phone/email (demo). Enter 6 digits."}
                {step === "success" && "Welcome to the adventure."}
              </p>

              <div className="mt-8">
                {step === "details" && (
                  <form onSubmit={handleDetails} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <FieldLabel>Full Name</FieldLabel>
                        <Input
                          icon={<User size={16} />}
                          value={form.fullName}
                          onChange={(v) => setForm((p) => ({ ...p, fullName: v }))}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <FieldLabel>Email</FieldLabel>
                        <Input
                          icon={<Mail size={16} />}
                          type="email"
                          value={form.email}
                          onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
  <FieldLabel>Phone Number</FieldLabel>

  <div className="flex gap-3">
    {/* Country Code (small) */}
    <div className="w-24">
      <Input
        value={form.countryCode}
        onChange={(v) =>
          setForm((p) => ({ ...p, countryCode: v }))
        }
        placeholder="+977"
        required
        inputMode="tel"
      />
    </div>

    {/* Phone Number (large / flexible) */}
    <div className="flex-1">
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
  </div>
</div>



                    <div className="grid md:grid-cols-2 gap-4">     
                      <div>
                        <FieldLabel>Password</FieldLabel>
                        <Input
                          icon={<Lock size={16} />}
                          type="password"
                          value={form.password}
                          onChange={(v) =>
                            setForm((p) => ({ ...p, password: v }))
                          }
                          placeholder="••••••••"
                          required
                          autoComplete="new-password"
                        />
                      </div>

                      <div>
                        <FieldLabel>Gender</FieldLabel>
                        <div className="relative">
                          <select
                            value={form.gender}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, gender: e.target.value }))
                            }
                            className={cn(
                              "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5",
                              "text-white font-bold text-sm",
                              "focus:outline-none focus:ring-2 focus:ring-[#D92671]/60 focus:border-[#D92671]/60",
                              "transition-all appearance-none"
                            )}
                          >
                            <option className="text-black" value="Male">
                              Male
                            </option>
                            <option className="text-black" value="Female">
                              Female
                            </option>
                            <option className="text-black" value="Other">
                              Other
                            </option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none">
                            <User size={16} />
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <FieldLabel>Address</FieldLabel>
                        <Input
                          icon={<MapPin size={16} />}
                          value={form.address}
                          onChange={(v) => setForm((p) => ({ ...p, address: v }))}
                          placeholder="City, Street, Area"
                        />
                      </div>

                      <div className="md:col-span-2">
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

                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "w-full rounded-2xl py-4 font-black uppercase tracking-widest text-xs",
                        "bg-white text-[#5D2A8E] hover:bg-[#D92671] hover:text-white transition-all",
                        "shadow-[0_20px_50px_rgba(217,38,113,0.18)] flex items-center justify-center gap-3",
                        loading && "opacity-80"
                      )}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          Continue <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {step === "verify" && (
                  <form onSubmit={handleVerify} className="space-y-6">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-[#D92671]/20 border border-[#D92671]/30 flex items-center justify-center">
                          <MessageSquareText className="text-[#D92671]" size={18} />
                        </div>
                        <div>
                          <div className="text-white font-black">OTP Verification</div>
                          <div className="text-white/55 text-xs font-bold">
                            Sent to {form.countryCode} {form.phone}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <FieldLabel>Enter 6-digit OTP</FieldLabel>
                        <OTPBoxes value={otp} onChange={setOtp} disabled={loading} />
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep("details")}
                          className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setOtp("")}
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
                        "bg-white text-[#5D2A8E] hover:bg-[#D92671] hover:text-white transition-all",
                        "shadow-[0_20px_50px_rgba(217,38,113,0.18)] flex items-center justify-center gap-3",
                        loading && "opacity-80"
                      )}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          Activate Profile <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {step === "success" && (
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-7 text-center">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                      <CheckCircle2 className="text-green-400" size={28} />
                    </div>
                    <div className="text-white text-3xl font-black mt-4">
                      Ready!
                    </div>
                    <div className="text-white/55 text-xs font-bold mt-2">
                      Taking you to dashboard…
                    </div>
                    <Loader2 className="animate-spin mx-auto mt-5 text-white/70" />
                  </div>
                )}
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
                <p className="text-white/55 text-[10px] font-black uppercase tracking-[0.22em]">
                  Already have an account?
                </p>
                <Link
                  to="/login"
                  className="text-[#D92671] text-[10px] font-black uppercase tracking-[0.22em] hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
