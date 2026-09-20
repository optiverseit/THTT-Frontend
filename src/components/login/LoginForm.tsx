import { ArrowRight, Eye, EyeOff, Facebook, Lock, Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LoginFormData {
  email: string;
  phone: string;
  password: string;
}

interface FieldErrors {
  emailOrPhone?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-().]{7,20}$/;

const LoginForm = () => {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<LoginFormData>({
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (name === "email" || name === "phone") {
      setErrors((prev) => ({ ...prev, emailOrPhone: undefined }));
    }
    if (name === "password") {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (loginMethod === "email") {
      if (!data.email.trim()) {
        newErrors.emailOrPhone = "Email address is required.";
      } else if (!EMAIL_REGEX.test(data.email.trim())) {
        newErrors.emailOrPhone = "Please enter a valid email address (e.g. you@example.com).";
      }
    } else {
      if (!data.phone.trim()) {
        newErrors.emailOrPhone = "Phone number is required.";
      } else if (!PHONE_REGEX.test(data.phone.trim())) {
        newErrors.emailOrPhone = "Please enter a valid phone number (7–20 digits).";
      }
    }
    if (!data.password) {
      newErrors.password = "Password is required.";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    login({ email: data.email || data.phone || "user@triphimalaya.com.np" });
    navigate("/");
  };

  const inputCls = "w-full bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none pr-7";

  return (
    <form onSubmit={handleSubmit} className="text-gray-300" noValidate>
      {/* LOGIN METHOD TABS */}
      <div className="backdrop-blur-md bg-gray-600/40 rounded-md p-2 flex justify-between">
        {(["email", "phone"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setLoginMethod(m);
              setData((prev) => ({
                ...prev,
                email: m === "email" ? prev.email : "",
                phone: m === "phone" ? prev.phone : "",
              }));
              setErrors({});
            }}
            className={`rounded-lg ${loginMethod === m ? "bg-pink-500 text-white" : ""} cursor-pointer w-full`}
          >
            <p className="py-1 tracking-widest text-sm">{m.toUpperCase()}</p>
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* EMAIL / PHONE FIELD */}
        <div className="flex flex-col">
          <label className="text-xs tracking-widest mb-1.5">
            {loginMethod === "email" ? "EMAIL ADDRESS" : "PHONE"}
          </label>
          <div
            className={`input w-full rounded-xl backdrop-blur-md bg-gray-600/40 focus:outline-none ${
              errors.emailOrPhone ? "border border-red-500/70" : ""
            }`}
          >
            <input
              type={loginMethod === "email" ? "email" : "tel"}
              name={loginMethod === "email" ? "email" : "phone"}
              value={loginMethod === "email" ? data.email : data.phone}
              onChange={handleChange}
              placeholder={loginMethod === "email" ? "you@example.com" : "+977 9800000000"}
              className={inputCls}
              autoComplete={loginMethod === "email" ? "email" : "tel"}
            />
            {loginMethod === "email" ? <Mail size={14} /> : <Phone size={14} />}
          </div>
          {errors.emailOrPhone && (
            <p className="text-red-400 text-[10px] mt-1">{errors.emailOrPhone}</p>
          )}
        </div>

        {/* PASSWORD FIELD */}
        <div className="flex flex-col mt-4">
          <label className="text-xs tracking-widest mb-1.5">PASSWORD</label>
          <div
            className={`input w-full rounded-xl backdrop-blur-md bg-gray-600/40 focus:outline-none ${
              errors.password ? "border border-red-500/70" : ""
            }`}
          >
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputCls}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/50 hover:text-white/80 transition-colors cursor-pointer"
              tabIndex={-1}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={14} /> : <Lock size={14} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-[10px] mt-1">{errors.password}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="tracking-widest text-[10px] flex w-full justify-between cursor-pointer">
          <p onClick={() => navigate("/login/forgot-password")} className="hover:text-pink-500">FORGOT PASSWORD?</p>
          <p onClick={() => navigate("/register")} className="hover:text-pink-500">CREATE ACCOUNT</p>
        </div>
        <button
          type="submit"
          className="mt-2 flex items-center justify-center rounded-xl bg-white hover:bg-white/95 active:scale-[0.99] shadow-lg shadow-pink-800/50 w-full py-2.5 text-purple-950 tracking-wide font-bold text-sm gap-2 transition-all cursor-pointer"
        >
          LOGIN <ArrowRight size={14} strokeWidth={3} />
        </button>

        <div className="mt-8">
          <p>OR CONTINUE WITH</p>
          <div className="flex gap-2 w-full justify-between text-center">
            {(["google", "facebook"] as const).map((i) => (
              <button
                key={i}
                type="button"
                className={`${
                  i === "google" ? "bg-white text-purple-950" : "bg-blue-500 text-white"
                } py-2 w-full rounded-xl mt-2 text-xs tracking-widest font-bold cursor-pointer transition-opacity hover:opacity-90`}
              >
                <span className="flex items-center gap-1 justify-center">
                  {i === "facebook" ? <Facebook size={14} /> : ""}
                  {i.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
