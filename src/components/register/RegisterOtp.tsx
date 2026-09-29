import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  Key,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import hikerHimalaya from "../../assets/images/hiker_himalaya.jpg";

import {
  verifyEmailOtp,
} from "../../api/BackendApi";

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 60;

const RegisterOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const stateData =
    (location.state as {
      email?: string;
    }) || {};

  const storedEmail =
    sessionStorage.getItem(
      "pending_register_email"
    ) || "";

  const email =
    stateData.email || storedEmail;

  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const [error, setError] =
    useState<string>("");

  const [loading, setLoading] =
    useState<boolean>(false);

  const [timer, setTimer] =
    useState<number>(
      COUNTDOWN_SECONDS
    );

  const [canResend, setCanResend] =
    useState<boolean>(false);

  const [
    resendNotice,
    setResendNotice,
  ] = useState<string>("");

  const inputRefs = useRef<
    (HTMLInputElement | null)[]
  >([]);

  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 120);
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [timer]);

  const handleChange = (
    val: string,
    index: number
  ) => {
    const clean = val.replace(/\D/g, "");

    const newOtp = [...otp];
    newOtp[index] =
      clean.slice(-1);

    setOtp(newOtp);

    if (error) {
      setError("");
    }

    if (
      clean &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const paste =
      e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, OTP_LENGTH);

    if (!paste) return;

    const newOtp = [...otp];

    for (
      let i = 0;
      i < OTP_LENGTH;
      i++
    ) {
      newOtp[i] = paste[i] || "";
    }

    setOtp(newOtp);

    if (error) {
      setError("");
    }

    inputRefs.current[
      Math.min(
        paste.length,
        OTP_LENGTH - 1
      )
    ]?.focus();
  };

  const handleResend = () => {
    if (!canResend) return;

    setOtp(
      Array(OTP_LENGTH).fill("")
    );

    setError("");

    setTimer(
      COUNTDOWN_SECONDS
    );

    setCanResend(false);

    setResendNotice(
      "Please return to the registration form to request a new OTP."
    );

    setTimeout(
      () => setResendNotice(""),
      4000
    );

    setTimeout(
      () =>
        inputRefs.current[0]?.focus(),
      100
    );
  };

  const handleVerifyOtp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const enteredOtp =
      otp.join("");

    if (!email) {
      setError(
        "Registration email not found. Please register again."
      );
      return;
    }

    if (
      enteredOtp.length <
      OTP_LENGTH
    ) {
      setError(
        "Please enter the complete 6-digit OTP verification code."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response =
        await verifyEmailOtp({
          email,
          otp: enteredOtp,
        });

      if (response.data?.success) {
        const user =
          response.data?.user;

        const fullName = [
          user?.first_name,
          user?.middle_name,
          user?.last_name,
        ]
          .filter(Boolean)
          .join(" ");

        sessionStorage.removeItem(
          "pending_register_email"
        );

        sessionStorage.setItem(
          "registered_user_summary",
          JSON.stringify({
            name:
              fullName ||
              "Traveler",
            email:
              user?.email ||
              email,
            phone:
              user?.phone || "",
            nationality:
              user?.nationality ||
              "",
          })
        );

        navigate(
          "/register/success",
          {
            state: {
              name: fullName,
              email:
                user?.email ||
                email,
              phone:
                user?.phone || "",
            },
            replace: true,
          }
        );
      }
    } catch (err: any) {
      console.error(
        "OTP verification error:",
        err
      );

      const backendErrors =
        err.response?.data?.errors;

      if (backendErrors?.otp?.[0]) {
        setError(
          backendErrors.otp[0]
        );
      } else if (
        backendErrors?.email?.[0]
      ) {
        setError(
          backendErrors.email[0]
        );
      } else {
        setError(
          err.response?.data
            ?.message ||
            "OTP verification failed. Please try again."
        );
      }
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
            <ShieldCheck
              size={16}
              className="text-[#ff3880]"
            />

            <span>
              Secure 2-Factor Authentication
            </span>
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
              We have sent a 6-digit
              verification code to{" "}

              {email ? (
                <strong className="text-pink-300 font-semibold">
                  {email}
                </strong>
              ) : (
                "your registered email"
              )}

              . Please enter it below
              to complete your
              registration.
            </p>

            {resendNotice && (
              <div className="mt-3.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs px-3.5 py-2 rounded-xl">
                {resendNotice}
              </div>
            )}

            {error && (
              <div className="mt-3.5 bg-red-950/60 border border-red-500/40 text-red-200 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
                <span>⚠</span>
                {error}
              </div>
            )}

            {/* OTP Form */}

            <form
              onSubmit={
                handleVerifyOtp
              }
              className="mt-6 space-y-4"
            >
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-2">
                  ENTER 6-DIGIT OTP
                </label>

                <div className="grid grid-cols-6 gap-2 sm:gap-2.5 w-full">
                  {otp.map(
                    (
                      digit,
                      index
                    ) => (
                      <input
                        key={
                          index
                        }
                        ref={(
                          el
                        ) => {
                          inputRefs.current[
                            index
                          ] =
                            el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={
                          1
                        }
                        value={
                          digit
                        }
                        onChange={(
                          e
                        ) =>
                          handleChange(
                            e
                              .target
                              .value,
                            index
                          )
                        }
                        onKeyDown={(
                          e
                        ) =>
                          handleKeyDown(
                            e,
                            index
                          )
                        }
                        onPaste={
                          handlePaste
                        }
                        className="w-full h-12 sm:h-14 text-center text-white rounded-xl sm:rounded-2xl bg-purple-950/50 backdrop-blur-md border border-purple-700/60 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 font-bold text-lg sm:text-xl transition-all"
                      />
                    )
                  )}
                </div>
              </div>

              {/* Timer / Resend */}

              <div className="pt-1 flex items-center justify-between text-xs">
                <div>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={
                        handleResend
                      }
                      className="text-pink-400 hover:text-pink-300 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw
                        size={
                          12
                        }
                      />
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-purple-300/60 text-[11px]">
                      Resend
                      code in{" "}

                      <strong className="text-pink-300">
                        {String(
                          Math.floor(
                            timer /
                              60
                          )
                        ).padStart(
                          2,
                          "0"
                        )}
                        :
                        {String(
                          timer %
                            60
                        ).padStart(
                          2,
                          "0"
                        )}
                      </strong>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOtp(
                      Array(
                        OTP_LENGTH
                      ).fill("")
                    );

                    setError("");

                    inputRefs.current[
                      0
                    ]?.focus();
                  }}
                  className="text-purple-300/70 hover:text-white transition-colors cursor-pointer text-[11px] font-semibold"
                >
                  CLEAR
                </button>
              </div>

              {/* Submit */}

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className="w-full h-12 bg-white hover:bg-white/95 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-[#1e0d3d] font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-black/30 transition-all cursor-pointer group"
                >
                  <span>
                    {loading
                      ? "VERIFYING..."
                      : "VERIFY OTP"}
                  </span>

                  {!loading && (
                    <ArrowRight
                      size={
                        15
                      }
                      strokeWidth={
                        2.5
                      }
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
              <ArrowLeft
                size={13}
              />
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