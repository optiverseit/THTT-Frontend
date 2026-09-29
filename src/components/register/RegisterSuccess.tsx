import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Compass, ShieldCheck, Mail, Phone, User } from "lucide-react";
import hikerHimalaya from "../../assets/images/hiker_himalaya.jpg";

const RegisterSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = (location.state as {
    name?: string;
    email?: string;
    phone?: string;
  }) || {};

  const storedSummaryRaw = sessionStorage.getItem("registered_user_summary");
  const storedSummary = storedSummaryRaw ? JSON.parse(storedSummaryRaw) : null;

  const name = stateData.name || storedSummary?.name || localStorage.getItem("name") || "Traveler";
  const email = stateData.email || storedSummary?.email || localStorage.getItem("email") || "";
  const phone = stateData.phone || storedSummary?.phone || localStorage.getItem("phone") || "";

  const [countdown, setCountdown] = useState<number>(5);

  // Auto-redirect to dashboard after countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/dashboard", { replace: true });
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div className="w-full rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#180b33] border border-purple-800/40 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] flex flex-col md:flex-row min-h-[560px]">
        {/* LEFT PANEL */}
        <div className="relative w-full md:w-1/2 min-h-[280px] md:min-h-[580px] flex flex-col justify-between p-6 sm:p-8 lg:p-10 overflow-hidden">
          <img
            src={hikerHimalaya}
            alt="Himalayan Adventure"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#160a2b]/95 via-[#1b0b36]/40 to-[#180a30]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-purple-950/25" />

          <div className="relative z-10">
            <span className="text-[#ff3880] font-black uppercase tracking-[0.22em] text-[11px] sm:text-xs">
              TRIP HIMALAYA
            </span>
            <h1 className="text-white font-extrabold text-2xl sm:text-3xl lg:text-[34px] leading-[1.18] mt-2 max-w-[280px] sm:max-w-[340px] tracking-tight drop-shadow-md">
              Welcome to your Himalayan journey.
            </h1>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-emerald-300 text-xs font-semibold backdrop-blur-md bg-emerald-950/40 border border-emerald-500/40 px-3.5 py-2 rounded-xl w-fit">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Account Verified & Active</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 bg-[#180b33] p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Success Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 size={36} className="text-emerald-400" />
            </div>

            <span className="text-[10px] tracking-widest font-bold text-emerald-400 uppercase block mb-1">
              REGISTRATION COMPLETE
            </span>

            <h2 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight">
              Registration Successful!
            </h2>

            <p className="text-purple-200/70 text-xs sm:text-[13px] mt-1.5 font-normal leading-relaxed">
              Your traveler account has been created and verified. You now have full access to personalized itineraries, Himalayan permits, and booking operations.
            </p>

            {/* Profile Summary Card */}
            <div className="mt-5 bg-purple-950/50 border border-purple-800/40 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-purple-800/30">
                <div className="flex items-center gap-2.5">
                  <User size={15} className="text-pink-400" />
                  <span className="text-xs text-purple-200/60 font-semibold">Traveler Name</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-white">{name}</span>
              </div>

              {email && (
                <div className="flex items-center justify-between pb-3 border-b border-purple-800/30">
                  <div className="flex items-center gap-2.5">
                    <Mail size={15} className="text-pink-400" />
                    <span className="text-xs text-purple-200/60 font-semibold">Email</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-purple-200">{email}</span>
                </div>
              )}

              {phone && (
                <div className="flex items-center justify-between pb-3 border-b border-purple-800/30">
                  <div className="flex items-center gap-2.5">
                    <Phone size={15} className="text-pink-400" />
                    <span className="text-xs text-purple-200/60 font-semibold">Phone</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-purple-200">{phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-purple-200/60 font-semibold">Status</span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  VERIFIED & ACTIVE
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard", { replace: true })}
                className="w-full h-12 bg-white hover:bg-white/95 active:scale-[0.99] text-[#1e0d3d] font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-black/30 transition-all cursor-pointer group"
              >
                <span>GO TO DASHBOARD</span>
                <ArrowRight
                  size={15}
                  strokeWidth={2.5}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full h-11 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-700/50 text-purple-200 font-bold text-xs tracking-wider uppercase rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Compass size={15} />
                <span>EXPLORE PACKAGES</span>
              </button>
            </div>
          </div>

          {/* Footer Countdown notice */}
          <div className="mt-6 pt-4 border-t border-purple-800/30 flex items-center justify-between text-[11px] text-purple-300/60">
            <span>
              Redirecting in <strong className="text-pink-400 font-bold">{countdown}s</strong>
            </span>
            <Link
              to="/dashboard"
              className="text-[#f43f8e] hover:text-[#ff5c9f] font-bold uppercase transition-colors"
            >
              SKIP WAITING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
