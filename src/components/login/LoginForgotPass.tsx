import { ArrowRight, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/BackendApi";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForgotPass = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const response = await forgotPassword(email.trim());

      if (response.data?.success) {
        navigate("/login/otp", {
          state: {
            email: email.trim(),
            mode: "reset-password",
          },
        });
      } else {
        setError(
          response.data?.message ||
            "Unable to send OTP. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);

      if (error.response?.data?.errors?.email?.[0]) {
        setError(error.response.data.errors.email[0]);
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to send OTP. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* -- Enter Email -- */
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

            <Mail
              size={14}
              className={error ? "text-red-400" : ""}
            />
          </div>

          {/* Inline error */}
          {error && (
            <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
              <span>⚠</span> {error}
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
        {loading ? "SENDING..." : "SEND OTP"}
        {!loading && <ArrowRight size={14} strokeWidth={3} />}
      </button>

      {/* Bottom nav */}
      <div className="mt-8 flex justify-between w-full text-[10px] tracking-widest font-bold">
        <Link
          to="/login"
          className="text-gray-300 hover:text-pink-500 transition-colors"
        >
          LOGIN
        </Link>

        <Link
          to="/register"
          className="text-gray-300 hover:text-pink-500 transition-colors"
        >
          CREATE ACCOUNT
        </Link>
      </div>
    </form>
  );
};

export default LoginForgotPass;