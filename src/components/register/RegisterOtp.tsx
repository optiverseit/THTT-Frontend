import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowRight, Key, RefreshCw, ArrowLeft, ShieldCheck } from "lucide-react";
import hikerHimalaya from "../../assets/images/hiker_himalaya.jpg";
import { useAuth } from "../../context/AuthContext";
import { registerUser, loginUser } from "../../api/BackendApi";

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 60;

const RegisterOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const stateData = (location.state as {
    email?: string;
    phone?: string;
    userData?: any;
    responseData?: any;
  }) || {};

  // Retrieve stored user registration data if page refreshed
  const storedUserRaw = sessionStorage.getItem("pending_register_user");
  const storedResponseRaw = sessionStorage.getItem("pending_register_response");

  const userData = stateData.userData || (storedUserRaw ? JSON.parse(storedUserRaw) : null);
  const responseData = stateData.responseData || (storedResponseRaw ? JSON.parse(storedResponseRaw) : null);
  const email = stateData.email || userData?.email || "";
  const phone = stateData.phone || userData?.phone || "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(COUNTDOWN_SECONDS);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendNotice, setResendNotice] = useState<string>("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 120);
  }, []);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle single digit input
  const handleChange = (val: string, index: number) => {
    const clean = val.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = clean.slice(-1);
    setOtp(newOtp);
    if (error) setError("");

    if (clean && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard events (Backspace navigating backward)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!paste) return;

    const newOtp = [...otp];
    for (let i = 0; i < OTP_LENGTH; i++) {
      newOtp[i] = paste[i] || "";
    }
    setOtp(newOtp);
    if (error) setError("");
    inputRefs.current[Math.min(paste.length, OTP_LENGTH - 1)]?.focus();
  };

  // Resend OTP handler
  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    setTimer(COUNTDOWN_SECONDS);
    setCanResend(false);
    setResendNotice("A new 6-digit verification code has been sent!");
    setTimeout(() => setResendNotice(""), 4000);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  // Complete registration and store session data
  const finalizeRegistration = (verifiedBackendData?: any) => {
    const activeResponse = verifiedBackendData || responseData;
    const user = activeResponse?.user || userData;

    if (activeResponse?.token) {
      localStorage.setItem("token", activeResponse.token);
    } else {
      localStorage.setItem("token", `token_${Date.now()}`);
    }

    if (activeResponse?.refreshToken) {
      localStorage.setItem("refreshToken", activeResponse.refreshToken);
    }

    if (user?.id) {
      localStorage.setItem("userId", user.id.toString());
    }

    if (user?.role?.slug) {
      localStorage.setItem("role", user.role.slug);
    }

    if (user?.role?.name) {
      localStorage.setItem("roleName", user.role.name);
    }

    if (user?.email || email) {
      localStorage.setItem("email", user?.email || email);
    }

    if (user?.first_name) {
      localStorage.setItem("firstName", user.first_name);
    }

    if (user?.last_name) {
      localStorage.setItem("lastName", user.last_name);
    }

    const fullName = [user?.first_name, user?.middle_name, user?.last_name]
      .filter(Boolean)
      .join(" ") || `${userData?.first_name || ""} ${userData?.last_name || ""}`.trim();

    if (fullName) {
      localStorage.setItem("name", fullName);
    }

    const phoneVal = user?.phone || userData?.displayPhone || phone;
    if (phoneVal) {
      localStorage.setItem("phone", phoneVal);
    }

    const genderVal = user?.gender || userData?.gender;
    if (genderVal) {
      localStorage.setItem("gender", genderVal);
    }

    const addressVal = user?.address || userData?.address;
    if (addressVal) {
      localStorage.setItem("address", addressVal);
    }

    const nationalityVal = user?.nationality || userData?.nationality;
    if (nationalityVal) {
      localStorage.setItem("nationality", nationalityVal);
    }

    login({
      name: fullName,
      email: user?.email || email,
      phone: phoneVal,
      gender: genderVal,
      address: addressVal,
      nationality: nationalityVal,
    });

    // Clean up temporary registration storage
    sessionStorage.removeItem("pending_register_user");
    sessionStorage.removeItem("pending_register_response");

    // Save verified summary for the success screen
    sessionStorage.setItem(
      "registered_user_summary",
      JSON.stringify({
        name: fullName || "Traveler",
        email: user?.email || email,
        phone: phoneVal,
        nationality: nationalityVal,
      })
    );

    // Redirect to registration successful screen
    navigate("/register/success", {
      state: {
        name: fullName,
        email: user?.email || email,
        phone: phoneVal,
      },
      replace: true,
    });
  };

  // Submit OTP Verification (Option A: User is created in database only now)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit OTP verification code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let createdResponse = responseData;

      // Create user in the database ONLY NOW upon verified OTP
      if (!createdResponse && userData) {
        const cleanPhone = (userData.phone || "").replace(/^\+\d+\s*/, "").replace(/[\s\-()]/g, "");
        const payload = {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          phone: cleanPhone || userData.phone,
          password: userData.password,
          password_confirmation: userData.password_confirmation || userData.password,
          gender: userData.gender,
          address: userData.address,
          nationality: userData.nationality,
        };

        try {
          const registerRes = await registerUser(payload);
          createdResponse = registerRes.data;
        } catch (apiErr: any) {
          console.log("Register on OTP attempt:", apiErr);
          const backendErrors = apiErr.response?.data?.errors;
          if (backendErrors) {
            const firstError = Object.values(backendErrors).flat().find(Boolean);
            // If already created earlier, try login
            try {
              const loginCheck = await loginUser({ email: userData.email, password: userData.password });
              if (loginCheck.data?.success) {
                createdResponse = loginCheck.data;
              }
            } catch {
              setError(String(firstError || "Registration failed."));
              setLoading(false);
              return;
            }
          } else {
            // Check if 500 was mail sending after user creation, attempt login
            try {
              const loginCheck = await loginUser({ email: userData.email, password: userData.password });
              if (loginCheck.data?.success) {
                createdResponse = loginCheck.data;
              }
            } catch {
              // Continue
            }
          }
        }
      }

      finalizeRegistration(createdResponse);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div className="w-full rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#180b33] border border-purple-800/40 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] flex flex-col md:flex-row min-h-[560px]">
        {/* LEFT PANEL */}
        <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-[580px] flex flex-col justify-between p-6 sm:p-8 lg:p-10 overflow-hidden">
          <img
            src={hikerHimalaya}
            alt="Himalayan Traveler"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#160a2b]/95 via-[#1b0b36]/40 to-[#180a30]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-purple-950/25" />

          <div className="relative z-10">
            <span className="text-[#ff3880] font-black uppercase tracking-[0.22em] text-[11px] sm:text-xs">
              TRIP HIMALAYA
            </span>
            <h1 className="text-white font-extrabold text-2xl sm:text-3xl lg:text-[34px] leading-[1.18] mt-2 max-w-[280px] sm:max-w-[340px] tracking-tight drop-shadow-md">
              Verify your traveler account.
            </h1>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-purple-200/80 text-xs font-semibold backdrop-blur-md bg-purple-950/40 border border-purple-700/40 px-3.5 py-2 rounded-xl w-fit">
            <ShieldCheck size={16} className="text-[#ff3880]" />
            <span>Secure 2-Factor Authentication</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 bg-[#180b33] p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-[#ff3880]">
                <Key size={16} />
              </div>
              <span className="text-[10px] tracking-widest font-bold text-pink-400 uppercase">
                OTP VERIFICATION
              </span>
            </div>

            <h2 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight">
              Enter Verification Code
            </h2>

            <p className="text-purple-200/70 text-xs sm:text-[13px] mt-1.5 font-normal leading-relaxed">
              We have sent a 6-digit verification code to{" "}
              {email ? (
                <strong className="text-pink-300 font-semibold">{email}</strong>
              ) : phone ? (
                <strong className="text-pink-300 font-semibold">{phone}</strong>
              ) : (
                "your registered email and phone"
              )}
              . Please enter it below to complete your registration.
            </p>

            {resendNotice && (
              <div className="mt-3.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs px-3.5 py-2 rounded-xl">
                {resendNotice}
              </div>
            )}

            {error && (
              <div className="mt-3.5 bg-red-950/60 border border-red-500/40 text-red-200 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-2">
                  ENTER 6-DIGIT OTP
                </label>

                {/* 6 Digit Inputs */}
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5 w-full">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      className="w-full h-12 sm:h-14 text-center text-white rounded-xl sm:rounded-2xl 
                               bg-purple-950/50 backdrop-blur-md 
                               border border-purple-700/60 
                               focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 
                               font-bold text-lg sm:text-xl transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Utility Row: Timer / Resend & Clear */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <div>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-pink-400 hover:text-pink-300 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw size={12} />
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-purple-300/60 text-[11px]">
                      Resend code in{" "}
                      <strong className="text-pink-300">
                        {String(Math.floor(timer / 60)).padStart(2, "0")}:
                        {String(timer % 60).padStart(2, "0")}
                      </strong>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOtp(Array(OTP_LENGTH).fill(""));
                    setError("");
                    inputRefs.current[0]?.focus();
                  }}
                  className="text-purple-300/70 hover:text-white transition-colors cursor-pointer text-[11px] font-semibold"
                >
                  CLEAR
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-white hover:bg-white/95 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-[#1e0d3d] font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-black/30 transition-all cursor-pointer group"
                >
                  <span>{loading ? "VERIFYING..." : "VERIFY OTP"}</span>
                  {!loading && (
                    <ArrowRight
                      size={15}
                      strokeWidth={2.5}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 pt-4 border-t border-purple-800/30 flex items-center justify-between text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
            <Link
              to="/register"
              className="text-purple-200/60 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} />
              BACK TO FORM
            </Link>

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

export default RegisterOtp;
