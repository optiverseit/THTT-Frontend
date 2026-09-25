import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Phone,
} from "lucide-react";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../../context/AuthContext";

import {
  loginUser,
  googleLogin,
} from "../../api/BackendApi";

interface LoginFormData {
  email: string;
  phone: string;
  password: string;
}

interface FieldErrors {
  emailOrPhone?: string;
  password?: string;
}

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX =
  /^\+?[0-9\s\-().]{7,20}$/;

const LoginForm = () => {
  const [loginMethod, setLoginMethod] =
    useState<"email" | "phone">("email");

  const { login } = useAuth();

  const navigate = useNavigate();

  const [data, setData] =
    useState<LoginFormData>({
      email: "",
      phone: "",
      password: "",
    });

  const [errors, setErrors] =
    useState<FieldErrors>({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [apiError, setApiError] =
    useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setApiError("");

    if (
      name === "email" ||
      name === "phone"
    ) {
      setErrors((prev) => ({
        ...prev,
        emailOrPhone: undefined,
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};

    if (loginMethod === "email") {
      if (!data.email.trim()) {
        newErrors.emailOrPhone =
          "Email address is required.";
      } else if (
        !EMAIL_REGEX.test(
          data.email.trim()
        )
      ) {
        newErrors.emailOrPhone =
          "Please enter a valid email address (e.g. you@example.com).";
      }
    } else {
      if (!data.phone.trim()) {
        newErrors.emailOrPhone =
          "Phone number is required.";
      } else if (
        !PHONE_REGEX.test(
          data.phone.trim()
        )
      ) {
        newErrors.emailOrPhone =
          "Please enter a valid phone number (7–20 digits).";
      }
    }

    if (!data.password) {
      newErrors.password =
        "Password is required.";
    } else if (
      data.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const saveLoginData = (
    responseData: any
  ) => {
    const user = responseData.user;

    if (responseData?.token) {
      localStorage.setItem(
        "token",
        responseData.token
      );
    }

    if (responseData?.refreshToken) {
      localStorage.setItem(
        "refreshToken",
        responseData.refreshToken
      );
    }

    if (user?.id) {
      localStorage.setItem(
        "userId",
        user.id.toString()
      );
    }

    if (user?.role?.slug) {
      localStorage.setItem(
        "role",
        user.role.slug
      );
    }

    if (user?.role?.name) {
      localStorage.setItem(
        "roleName",
        user.role.name
      );
    }

    if (user?.email) {
      localStorage.setItem(
        "email",
        user.email
      );
    }

    if (user?.first_name) {
      localStorage.setItem(
        "firstName",
        user.first_name
      );
    }

    if (user?.last_name) {
      localStorage.setItem(
        "lastName",
        user.last_name
      );
    }

    const fullName = [
      user?.first_name,
      user?.middle_name,
      user?.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    if (fullName) {
      localStorage.setItem(
        "name",
        fullName
      );
    }

    if (user?.phone) {
      localStorage.setItem("phone", user.phone);
    }

    if (user?.gender) {
      localStorage.setItem("gender", user.gender);
    }

    if (user?.address) {
      localStorage.setItem("address", user.address);
    }

    if (user?.nationality) {
      localStorage.setItem("nationality", user.nationality);
    }

    login({
      name: fullName || user?.name,
      email:
        user?.email ||
        data.email ||
        data.phone,
      phone: user?.phone,
      gender: user?.gender,
      address: user?.address,
      nationality: user?.nationality,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      const loginData =
        loginMethod === "email"
          ? {
              email:
                data.email.trim(),
              password:
                data.password,
            }
          : {
              phone:
                data.phone.trim(),
              password:
                data.password,
            };

      const response =
        await loginUser(loginData);

      const responseData =
        response.data;

      console.log(
        "Login response:",
        responseData
      );

      if (
        responseData?.success &&
        responseData?.token &&
        responseData?.user
      ) {
        saveLoginData(
          responseData
        );

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );
      } else {
        setApiError(
          responseData?.message ||
            "Invalid login response."
        );
      }
    } catch (error: any) {
      console.error(
        "Login error:",
        error
      );

      setApiError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess =
    async (
      credentialResponse: any
    ) => {
      try {
        setLoading(true);
        setApiError("");

        const idToken =
          credentialResponse.credential;

        if (!idToken) {
          setApiError(
            "Unable to authenticate with Google."
          );

          return;
        }

        const response =
          await googleLogin(
            idToken
          );

        const responseData =
          response.data;

        console.log(
          "Google login response:",
          responseData
        );

        if (
          responseData?.success &&
          responseData?.token &&
          responseData?.user
        ) {
          saveLoginData(
            responseData
          );

          navigate(
            "/dashboard",
            {
              replace: true,
            }
          );
        } else {
          setApiError(
            responseData?.message ||
              "Invalid Google login response."
          );
        }
      } catch (error: any) {
        console.error(
          "Google login error:",
          error
        );

        setApiError(
          error.response?.data
            ?.message ||
            "Google login failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  const inputCls =
    "w-full bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none pr-7";

  return (
    <form
      onSubmit={handleSubmit}
      className="text-gray-300"
      noValidate
    >
      {/* LOGIN METHOD TABS */}

      <div className="backdrop-blur-md bg-gray-600/40 rounded-md p-2 flex justify-between">
        {(
          [
            "email",
            "phone",
          ] as const
        ).map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => {
              setLoginMethod(
                method
              );

              setData((prev) => ({
                ...prev,

                email:
                  method ===
                  "email"
                    ? prev.email
                    : "",

                phone:
                  method ===
                  "phone"
                    ? prev.phone
                    : "",
              }));

              setErrors({});
              setApiError("");
            }}
            className={`rounded-lg ${
              loginMethod ===
              method
                ? "bg-pink-500 text-white"
                : ""
            } cursor-pointer w-full`}
          >
            <p className="py-1 tracking-widest text-sm">
              {method.toUpperCase()}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* EMAIL / PHONE FIELD */}

        <div className="flex flex-col">
          <label className="text-xs tracking-widest mb-1.5">
            {loginMethod ===
            "email"
              ? "EMAIL ADDRESS"
              : "PHONE"}
          </label>

          <div
            className={`input w-full rounded-xl backdrop-blur-md bg-gray-600/40 focus:outline-none ${
              errors.emailOrPhone
                ? "border border-red-500/70"
                : ""
            }`}
          >
            <input
              type={
                loginMethod ===
                "email"
                  ? "email"
                  : "tel"
              }
              name={
                loginMethod ===
                "email"
                  ? "email"
                  : "phone"
              }
              value={
                loginMethod ===
                "email"
                  ? data.email
                  : data.phone
              }
              onChange={
                handleChange
              }
              placeholder={
                loginMethod ===
                "email"
                  ? "you@example.com"
                  : "+977 9800000000"
              }
              className={
                inputCls
              }
              autoComplete={
                loginMethod ===
                "email"
                  ? "email"
                  : "tel"
              }
            />

            {loginMethod ===
            "email" ? (
              <Mail size={14} />
            ) : (
              <Phone size={14} />
            )}
          </div>

          {errors.emailOrPhone && (
            <p className="text-red-400 text-[10px] mt-1">
              {
                errors.emailOrPhone
              }
            </p>
          )}
        </div>

        {/* PASSWORD FIELD */}

        <div className="flex flex-col mt-4">
          <label className="text-xs tracking-widest mb-1.5">
            PASSWORD
          </label>

          <div
            className={`input w-full rounded-xl backdrop-blur-md bg-gray-600/40 focus:outline-none ${
              errors.password
                ? "border border-red-500/70"
                : ""
            }`}
          >
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={
                data.password
              }
              onChange={
                handleChange
              }
              placeholder="••••••••"
              className={
                inputCls
              }
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="text-white/50 hover:text-white/80 transition-colors cursor-pointer"
              tabIndex={-1}
              title={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff
                  size={14}
                />
              ) : (
                <Eye
                  size={14}
                />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-400 text-[10px] mt-1">
              {
                errors.password
              }
            </p>
          )}
        </div>
      </div>

      {/* API ERROR */}

      {apiError && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2">
          <p className="text-red-400 text-xs">
            {apiError}
          </p>
        </div>
      )}

      <div className="mt-6">
        <div className="tracking-widest text-[10px] flex w-full justify-between cursor-pointer">
          <p
            onClick={() =>
              navigate(
                "/login/forgot-password"
              )
            }
            className="hover:text-pink-500"
          >
            FORGOT PASSWORD?
          </p>

          <p
            onClick={() =>
              navigate(
                "/register"
              )
            }
            className="hover:text-pink-500"
          >
            CREATE ACCOUNT
          </p>
        </div>

        {/* LOGIN BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center rounded-xl bg-white hover:bg-white/95 active:scale-[0.99] shadow-lg shadow-pink-800/50 w-full py-2.5 text-purple-950 tracking-wide font-bold text-sm gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            "LOGGING IN..."
          ) : (
            <>
              LOGIN

              <ArrowRight
                size={14}
                strokeWidth={3}
              />
            </>
          )}
        </button>

        {/* SOCIAL LOGIN */}

        <div className="mt-8">
          <p>
            OR CONTINUE WITH
          </p>

          <div className="w-full overflow-hidden rounded-xl mt-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setApiError("Unable to authenticate with Google.")
              }
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;