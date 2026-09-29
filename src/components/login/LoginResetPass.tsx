import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
} from "lucide-react";

import React, { useState } from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { resetPassword } from "../../api/BackendApi";

interface ResetPasswordState {
  email?: string;
  resetToken?: string;
}

const LoginResetPass: React.FC = () => {
  const location = useLocation();

  const state =
    location.state as ResetPasswordState | null;

  const email = state?.email || "";
  const resetToken = state?.resetToken || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!email || !resetToken) {
      setError(
        "Invalid password reset request. Please request a new OTP."
      );
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await resetPassword(
        email,
        resetToken,
        password,
        confirmPassword
      );

      if (response.data?.success) {
        setIsSuccess(true);
      } else {
        setError(
          response.data?.message ||
            "Unable to reset password."
        );
      }
    } catch (error: any) {
      console.error("Reset password error:", error);

      if (
        error.response?.data?.errors?.password?.[0]
      ) {
        setError(
          error.response.data.errors.password[0]
        );
      } else if (
        error.response?.data?.errors
          ?.reset_token?.[0]
      ) {
        setError(
          error.response.data.errors.reset_token[0]
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to reset password. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* -- STEP: Success View -- */
  if (isSuccess) {
    return (
      <div>
        <div className="p-6 backdrop-blur-md bg-gray-600/40 rounded-xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={30} />
          </div>

          <div>
            <h3 className="text-white font-bold text-lg">
              Password Reset Successful!
            </h3>

            <p className="text-gray-300 text-sm mt-2 leading-relaxed">
              You can now log in with your new password.
            </p>
          </div>

          <div className="bg-purple-900/30 border border-purple-700/30 rounded-xl px-4 py-3 text-left text-xs text-gray-400 space-y-1">
            <p>
              • Your account is now secured with your new password.
            </p>
          </div>
        </div>

        <Link
          to="/login"
          className="mt-4 flex items-center justify-center rounded-xl bg-white hover:bg-white/95 shadow-lg shadow-pink-800/50 w-full py-2.5 text-purple-950 tracking-wide font-bold text-sm gap-2 transition-all cursor-pointer"
        >
          BACK TO LOGIN{" "}
          <ArrowRight size={14} strokeWidth={3} />
        </Link>
      </div>
    );
  }

  /* -- STEP: Form View -- */
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="p-5 backdrop-blur-md bg-gray-600/40 rounded-xl space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-white font-bold text-base leading-tight">
              Reset Your Password
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Enter your new password below.
            </p>
          </div>

          <Link
            to="/login"
            className="text-[11px] font-bold tracking-widest text-gray-300 hover:text-pink-400 transition-colors shrink-0 mt-0.5"
          >
            LOGIN
          </Link>
        </div>

        {/* Email Address (Not Changeable) */}
        <div>
          <label className="text-[10px] tracking-widest uppercase text-gray-400 block mb-1.5">
            Email Address
          </label>

          <div className="relative flex items-center bg-black/25 border border-purple-800/40 rounded-xl px-3.5 h-11 opacity-90 cursor-not-allowed">
            <input
              type="email"
              value={email}
              readOnly
              disabled
              className="w-full bg-transparent text-gray-300 text-sm focus:outline-none pr-7 cursor-not-allowed select-none"
            />

            <Mail
              size={15}
              className="text-purple-300/60 shrink-0 absolute right-3 pointer-events-none"
            />
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="text-[10px] tracking-widest uppercase text-gray-400 block mb-1.5">
            New Password
          </label>

          <div
            className={`relative flex items-center bg-gray-200/10 rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
              error && !password
                ? "border border-red-500/70"
                : "border border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
            }`}
          >
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                if (error) {
                  setError("");
                }
              }}
              placeholder="Min 8 characters"
              className="w-full bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none pr-8"
              autoFocus
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 text-purple-300/60 hover:text-purple-200 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff size={15} />
              ) : (
                <Eye size={15} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-[10px] tracking-widest uppercase text-gray-400 block mb-1.5">
            Confirm Password
          </label>

          <div
            className={`relative flex items-center bg-gray-200/10 rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
              error &&
              (!confirmPassword ||
                password !== confirmPassword)
                ? "border border-red-500/70"
                : "border border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
            }`}
          >
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(
                  e.target.value
                );

                if (error) {
                  setError("");
                }
              }}
              placeholder="Re-enter your new password"
              className="w-full bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none pr-8"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-3 text-purple-300/60 hover:text-purple-200 transition-colors cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff size={15} />
              ) : (
                <Eye size={15} />
              )}
            </button>
          </div>
        </div>

        {/* Inline Error */}
        {error && (
          <p className="text-red-400 text-[11px] flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 flex items-center justify-center rounded-xl bg-white hover:bg-white/95 active:scale-[0.99] shadow-lg shadow-pink-800/50 w-full py-2.5 text-purple-950 tracking-wide font-bold text-sm gap-2 transition-all cursor-pointer disabled:opacity-70"
      >
        {loading
          ? "RESETTING..."
          : "RESET PASSWORD"}

        {!loading && (
          <ArrowRight
            size={14}
            strokeWidth={3}
          />
        )}
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

export default LoginResetPass;