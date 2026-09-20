import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = "form" | "success";

const LoginForgotPass = () => {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Invalid email address. Please enter a valid email.");
      return;
    }

    setError("");
    setLoading(true);

    // TODO: Replace with real API call — POST /api/auth/forgot-password { email }
    // On success: setStep("success")
    // On error (email not found in DB): setError("No account found with this email address.")
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 800);
  };

  /* -- STEP 1: Enter Email -- */
  if (step === "form") {
    return (
      <form onSubmit={handleSubmit} noValidate>
        <div className="p-5 backdrop-blur-md bg-gray-600/40 rounded-xl">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-white font-bold text-base leading-tight">
                Reset your password
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            <Link
              to="/login"
              className="text-[11px] font-bold tracking-widest text-gray-300 hover:text-pink-400 transition-colors shrink-0 mt-0.5"
            >
              LOGIN
            </Link>
          </div>

          {/* Email input */}
          <div className="mt-5">
            <label className="text-[10px] tracking-widest uppercase text-gray-400 block mb-1.5">
              Email Address
            </label>
            <div
              className={`input w-full rounded-xl backdrop-blur-md focus:outline-none ${
                error
                  ? "border border-red-500/70 bg-gray-200/10"
                  : "bg-gray-200/10"
              }`}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="you@example.com"
                className="w-full bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none pr-7"
                autoComplete="email"
                autoFocus
              />
              <Mail size={14} className={error ? "text-red-400" : ""} />
            </div>

            {/* Inline error */}
            {error && (
              <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                <span>?</span> {error}
              </p>
            )}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex items-center justify-center rounded-xl bg-white hover:bg-white/95 active:scale-[0.99] shadow-lg shadow-pink-800/50 w-full py-2.5 text-purple-950 tracking-wide font-bold text-sm gap-2 transition-all cursor-pointer disabled:opacity-70"
        >
          {loading ? "SENDING..." : "SEND PASSWORD RESET LINK"}
          {!loading && <ArrowRight size={14} strokeWidth={3} />}
        </button>

        {/* Bottom nav */}
        <div className="mt-8 flex justify-between w-full text-[10px] tracking-widest font-bold">
          <Link to="/login" className="text-gray-300 hover:text-pink-500 transition-colors">
            LOGIN
          </Link>
          <Link to="/register" className="text-gray-300 hover:text-pink-500 transition-colors">
            CREATE ACCOUNT
          </Link>
        </div>
      </form>
    );
  }

  /* -- STEP 2: Success -- */
  return (
    <div>
      <div className="p-6 backdrop-blur-md bg-gray-600/40 rounded-xl text-center space-y-4">
        {/* Icon */}
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
          <CheckCircle2 size={30} />
        </div>

        <div>
          <h3 className="text-white font-bold text-lg">Check your inbox!</h3>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            We've sent a password reset link to{" "}
            <strong className="text-pink-300">{email}</strong>.
            <br />
            Follow the link in the email to reset your password.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-purple-900/30 border border-purple-700/30 rounded-xl px-4 py-3 text-left text-xs text-gray-400 space-y-1">
          <p>• Check your spam/junk folder if you don't see it.</p>
          <p>• The link expires in <strong className="text-gray-300">30 minutes</strong>.</p>
        </div>

        {/* Try again */}
        <button
          type="button"
          onClick={() => { setStep("form"); setEmail(""); setError(""); }}
          className="text-xs text-pink-400 hover:text-pink-300 font-semibold cursor-pointer transition-colors"
        >
          Didn't receive it? Try again ?
        </button>
      </div>

      {/* Back to login */}
      <Link
        to="/login"
        className="mt-4 flex items-center justify-center rounded-xl bg-white hover:bg-white/95 shadow-lg shadow-pink-800/50 w-full py-2.5 text-purple-950 tracking-wide font-bold text-sm gap-2 transition-all cursor-pointer"
      >
        BACK TO LOGIN <ArrowRight size={14} strokeWidth={3} />
      </Link>
    </div>
  );
};

export default LoginForgotPass;
