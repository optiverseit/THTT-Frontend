import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Globe,
  ArrowRight,
  Eye,
  EyeOff,
  ChevronDown,
  Search,
  Check,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import hikerHimalaya from "../../assets/images/hiker_himalaya.jpg";

import {
  COUNTRY_CODES,
  CountryCode,
} from "../../utils/countrycodes";

import ReactCountryFlag from "react-country-flag";

import { useAuth } from "../../context/AuthContext";

import { registerUser } from "../../api/BackendApi";

interface RegisterFormData {
  fullName: string;
  email: string;
  countryCode: string;
  countryIso: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: string;
  address: string;
  nationality: string;
}

interface RegErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  nationality?: string;
}

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_DIGITS_REGEX =
  /^[0-9]{6,15}$/;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState<RegErrors>({});

  const [
    formData,
    setFormData,
  ] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    countryCode: "+977",
    countryIso: "NP",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    address: "",
    nationality: "Nepali",
  });

  const [
    showCountryPicker,
    setShowCountryPicker,
  ] = useState(false);

  const [
    countrySearch,
    setCountrySearch,
  ] = useState("");

  const countryPickerRef =
    useRef<HTMLDivElement>(null);

  const filteredCountryCodes =
    COUNTRY_CODES.filter(
      (c) =>
        c.code
          .toLowerCase()
          .includes(
            countrySearch.toLowerCase()
          ) ||
        c.iso
          .toLowerCase()
          .includes(
            countrySearch.toLowerCase()
          )
    );

  useEffect(() => {
    const handleClickOutside = (
      e: MouseEvent
    ) => {
      if (
        countryPickerRef.current &&
        !countryPickerRef.current.contains(
          e.target as Node
        )
      ) {
        setShowCountryPicker(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const genderOptions = [
    "Male",
    "Female",
    "Other",
    "Prefer not to say",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage(null);
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validateDetails = (): boolean => {
    const errs: RegErrors = {};

    if (!formData.fullName.trim()) {
      errs.fullName =
        "Full name is required.";
    } else if (
      formData.fullName.trim().length < 2
    ) {
      errs.fullName =
        "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      errs.email =
        "Email address is required.";
    } else if (
      !EMAIL_REGEX.test(
        formData.email.trim()
      )
    ) {
      errs.email =
        "Please enter a valid email (e.g. you@example.com).";
    }

    if (!formData.phone.trim()) {
      errs.phone =
        "Phone number is required.";
    } else if (
      !PHONE_DIGITS_REGEX.test(
        formData.phone.trim()
      )
    ) {
      errs.phone =
        "Enter 6–15 digits without spaces or dashes.";
    }

    if (!formData.password) {
      errs.password =
        "Password is required.";
    } else if (
      formData.password.length < 8
    ) {
      errs.password =
        "Password must be at least 8 characters.";
    } else if (
      !/[A-Z]/.test(formData.password)
    ) {
      errs.password =
        "Password must contain at least one uppercase letter.";
    } else if (
      !/[0-9]/.test(formData.password)
    ) {
      errs.password =
        "Password must contain at least one number.";
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.confirmPassword !==
      formData.password
    ) {
      errs.confirmPassword =
        "Passwords do not match.";
    }

    if (!formData.address.trim()) {
      errs.address =
        "Address is required.";
    }

    if (!formData.nationality.trim()) {
      errs.nationality =
        "Nationality is required.";
    }

    setFieldErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSelectCountry = (
    country: CountryCode
  ) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: country.code,
      countryIso: country.iso,
    }));

    setShowCountryPicker(false);
    setCountrySearch("");
  };

  // ==========================================
  // REGISTER USER WITH BACKEND
  // ==========================================

  const handleRegisterSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateDetails()) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const nameParts =
        formData.fullName
          .trim()
          .split(/\s+/);

      const firstName =
        nameParts[0] || "";

      const lastName =
        nameParts.length > 1
          ? nameParts
              .slice(1)
              .join(" ")
          : "";

      const userData = {
        first_name: firstName,
        last_name: lastName,

        email:
          formData.email.trim(),

        phone:
          `${formData.countryCode}${formData.phone.trim()}`,

        password:
          formData.password,

        password_confirmation:
          formData.confirmPassword,

        gender:
          formData.gender,

        address:
          formData.address.trim(),

        nationality:
          formData.nationality.trim(),
      };

      console.log(
        "Register payload:",
        userData
      );

      const response =
        await registerUser(userData);

      const responseData =
        response.data;

      console.log(
        "Register response:",
        responseData
      );

      if (
        responseData?.success &&
        responseData?.token &&
        responseData?.user
      ) {
        const user =
          responseData.user;

        // ==============================
        // STORE ACCESS TOKEN
        // ==============================

        localStorage.setItem(
          "token",
          responseData.token
        );

        // Keep support for refresh token
        // when backend adds it later
        if (
          responseData.refreshToken
        ) {
          localStorage.setItem(
            "refreshToken",
            responseData.refreshToken
          );
        }

        // ==============================
        // STORE USER INFORMATION
        // ==============================

        if (user.id) {
          localStorage.setItem(
            "userId",
            user.id.toString()
          );
        }

        if (user.role?.slug) {
          localStorage.setItem(
            "role",
            user.role.slug
          );
        }

        if (user.role?.name) {
          localStorage.setItem(
            "roleName",
            user.role.name
          );
        }

        if (user.email) {
          localStorage.setItem(
            "email",
            user.email
          );
        }

        if (user.first_name) {
          localStorage.setItem(
            "firstName",
            user.first_name
          );
        }

        if (user.last_name) {
          localStorage.setItem(
            "lastName",
            user.last_name
          );
        }

        const fullName = [
          user.first_name,
          user.middle_name,
          user.last_name,
        ]
          .filter(Boolean)
          .join(" ");

        if (fullName) {
          localStorage.setItem(
            "name",
            fullName
          );
        }

        if (user.avatar) {
          localStorage.setItem(
            "avatar",
            user.avatar
          );
        }

        // ==============================
        // UPDATE AUTH CONTEXT
        // ==============================

        login({
          name:
            fullName ||
            formData.fullName,

          email:
            user.email ||
            formData.email,

          phone:
            user.phone ||
            `${formData.countryCode}${formData.phone}`,
        });

        // ==============================
        // REDIRECT TO DASHBOARD
        // ==============================

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );
      } else {
        setErrorMessage(
          responseData?.message ||
            "Registration failed. Please try again."
        );
      }
    } catch (error: any) {
      console.error(
        "Registration error:",
        error
      );

      const backendErrors =
        error.response?.data?.errors;

      if (backendErrors) {
        const firstError =
          Object.values(
            backendErrors
          )
            .flat()
            .find(Boolean);

        setErrorMessage(
          String(
            firstError ||
              "Registration failed."
          )
        );
      } else {
        setErrorMessage(
          error.response?.data
            ?.message ||
            "Unable to register. Please try again."
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

        <div className="relative w-full md:w-1/2 min-h-[340px] md:min-h-[620px] flex flex-col justify-between p-6 sm:p-8 lg:p-10 overflow-hidden">

          <img
            src={hikerHimalaya}
            alt="Traveler exploring Himalayas"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#160a2b]/95 via-[#1b0b36]/40 to-[#180a30]/40 mix-blend-multiply" />

          <div className="absolute inset-0 bg-purple-950/25" />

          <div className="relative z-10">

            <span className="text-[#ff3880] font-black uppercase tracking-[0.22em] text-[11px] sm:text-xs">
              TRIP HIMALAYA
            </span>

            <h1 className="text-white font-extrabold text-2xl sm:text-3xl lg:text-[34px] leading-[1.18] mt-2 max-w-[280px] sm:max-w-[340px] tracking-tight drop-shadow-md">
              Create your traveler
              profile.
            </h1>

          </div>

          <div className="relative z-10" />

        </div>

        {/* RIGHT PANEL */}

        <div className="w-full md:w-1/2 bg-[#180b33] p-6 sm:p-8 lg:p-10 flex flex-col justify-between">

          <div>

            <h2 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight">
              Create Account
            </h2>

            <p className="text-purple-200/70 text-xs sm:text-[13px] mt-1 font-normal">
              Fill in your details to
              create your traveler
              account.
            </p>

            {/* API ERROR */}

            {errorMessage && (
              <div className="mt-3.5 bg-red-950/60 border border-red-500/40 text-red-200 text-xs px-3.5 py-2 rounded-xl">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={
                handleRegisterSubmit
              }
              className="mt-5 sm:mt-6 space-y-3.5"
            >

              {/* FULL NAME + EMAIL */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">

                <div>

                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                    FULL NAME
                  </label>

                  <div
                    className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
                      fieldErrors.fullName
                        ? "border-red-500/70 focus-within:border-red-500 focus-within:ring-red-500/30"
                        : "border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
                    }`}
                  >

                    <input
                      type="text"
                      name="fullName"
                      value={
                        formData.fullName
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Your full name"
                      className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                    />

                    <User
                      size={15}
                      className="text-purple-300/60 shrink-0 absolute right-3 pointer-events-none"
                    />

                  </div>

                  {fieldErrors.fullName && (
                    <p className="text-red-400 text-[10px] mt-1">
                      {
                        fieldErrors.fullName
                      }
                    </p>
                  )}

                </div>

                <div>

                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                    EMAIL
                  </label>

                  <div
                    className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
                      fieldErrors.email
                        ? "border-red-500/70 focus-within:border-red-500 focus-within:ring-red-500/30"
                        : "border-purple-800/40 focus-within:border-pink-500 focus-within:ring-pink-500/30"
                    }`}
                  >

                    <input
                      type="email"
                      name="email"
                      value={
                        formData.email
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                    />

                    <Mail
                      size={15}
                      className="text-purple-300/60 shrink-0 absolute right-3 pointer-events-none"
                    />

                  </div>

                  {fieldErrors.email && (
                    <p className="text-red-400 text-[10px] mt-1">
                      {fieldErrors.email}
                    </p>
                  )}

                </div>

              </div>

              {/* PHONE */}

              <div>

                <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                  PHONE NUMBER
                </label>

                <div
                  className="flex gap-2 relative"
                  ref={
                    countryPickerRef
                  }
                >

                  <div className="relative shrink-0">

                    <button
                      type="button"
                      onClick={() =>
                        setShowCountryPicker(
                          !showCountryPicker
                        )
                      }
                      className="h-11 bg-[#29174d]/85 hover:bg-[#341e61] border border-purple-800/40 rounded-xl px-3 flex items-center justify-between gap-2 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors w-[112px] sm:w-[124px]"
                    >

                      <span className="flex items-center gap-1.5 truncate">

                        <ReactCountryFlag
                          svg
                          countryCode={
                            formData.countryIso
                          }
                          style={{
                            width:
                              "1.4em",
                            height:
                              "1.05em",
                            borderRadius:
                              "2px",
                          }}
                        />

                        <span className="tracking-tight">
                          {
                            formData.countryCode
                          }
                        </span>

                      </span>

                      <ChevronDown
                        size={14}
                        className="text-purple-300/70 shrink-0"
                      />

                    </button>

                    {showCountryPicker && (

                      <div className="absolute top-12 left-0 z-50 bg-[#1a0a33] border border-purple-700/60 rounded-xl shadow-2xl p-2 w-64 max-h-60 flex flex-col">

                        <div className="relative mb-2">

                          <input
                            type="text"
                            value={
                              countrySearch
                            }
                            onChange={(
                              e
                            ) =>
                              setCountrySearch(
                                e.target
                                  .value
                              )
                            }
                            placeholder="Search code or ISO..."
                            className="w-full bg-[#271349] text-white text-xs rounded-lg px-7 py-1.5 border border-purple-700/50 focus:outline-none focus:border-pink-500"
                            autoFocus
                          />

                          <Search
                            size={12}
                            className="text-purple-300/60 absolute left-2 top-2"
                          />

                        </div>

                        <div className="overflow-y-auto flex-1 space-y-0.5 pr-1">

                          {filteredCountryCodes.length ===
                          0 ? (

                            <div className="text-purple-300/50 text-[11px] text-center py-2">
                              No countries
                              found
                            </div>

                          ) : (

                            filteredCountryCodes.map(
                              (
                                item,
                                idx
                              ) => (

                                <button
                                  key={`${item.code}-${item.iso}-${idx}`}
                                  type="button"
                                  onClick={() =>
                                    handleSelectCountry(
                                      item
                                    )
                                  }
                                  className={`w-full px-2.5 py-1.5 text-left text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                                    formData.countryCode ===
                                      item.code &&
                                    formData.countryIso ===
                                      item.iso
                                      ? "bg-pink-600 text-white font-bold"
                                      : "text-purple-100 hover:bg-purple-800/40"
                                  }`}
                                >

                                  <div className="flex items-center gap-2">

                                    <ReactCountryFlag
                                      svg
                                      countryCode={
                                        item.iso
                                      }
                                      style={{
                                        width:
                                          "1.3em",
                                        height:
                                          "1.3em",
                                        borderRadius:
                                          "2px",
                                      }}
                                    />

                                    <span className="font-semibold">
                                      {
                                        item.code
                                      }
                                    </span>

                                    <span className="text-purple-300/70 text-[10px]">
                                      (
                                      {
                                        item.iso
                                      }
                                      )
                                    </span>

                                  </div>

                                  {formData.countryCode ===
                                    item.code &&
                                    formData.countryIso ===
                                      item.iso && (
                                      <Check
                                        size={
                                          12
                                        }
                                      />
                                    )}

                                </button>

                              )
                            )

                          )}

                        </div>

                      </div>

                    )}

                  </div>

                  <div
                    className={`flex-1 relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 focus-within:ring-1 transition-all ${
                      fieldErrors.phone
                        ? "border-red-500/70"
                        : "border-purple-800/40 focus-within:border-pink-500"
                    }`}
                  >

                    <input
                      type="tel"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="9801234567"
                      className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                    />

                    <Phone
                      size={15}
                      className="text-purple-300/60 absolute right-3"
                    />

                  </div>

                </div>

                {fieldErrors.phone && (
                  <p className="text-red-400 text-[10px] mt-1">
                    {fieldErrors.phone}
                  </p>
                )}

              </div>

              {/* PASSWORD + GENDER */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">

                <div>

                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                    PASSWORD
                  </label>

                  <div
                    className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 ${
                      fieldErrors.password
                        ? "border-red-500/70"
                        : "border-purple-800/40 focus-within:border-pink-500"
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
                        formData.password
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Min 8 chars, 1 upper, 1 number"
                      className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 text-purple-300/60 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff
                          size={15}
                        />
                      ) : (
                        <Eye
                          size={15}
                        />
                      )}
                    </button>

                  </div>

                  {fieldErrors.password && (
                    <p className="text-red-400 text-[10px] mt-1">
                      {
                        fieldErrors.password
                      }
                    </p>
                  )}

                </div>

                <div>

                  <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                    GENDER
                  </label>

                  <div className="relative flex items-center bg-[#29174d]/85 border border-purple-800/40 rounded-xl px-3.5 h-11">

                    <select
                      name="gender"
                      value={
                        formData.gender
                      }
                      onChange={
                        handleInputChange
                      }
                      className="w-full bg-transparent text-white text-xs sm:text-sm focus:outline-none cursor-pointer pr-7 appearance-none"
                    >

                      {genderOptions.map(
                        (g) => (
                          <option
                            key={g}
                            value={g}
                            className="bg-[#1e0e3b] text-white"
                          >
                            {g}
                          </option>
                        )
                      )}

                    </select>

                    <User
                      size={15}
                      className="text-purple-300/60 absolute right-3 pointer-events-none"
                    />

                  </div>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                  CONFIRM PASSWORD
                </label>

                <div
                  className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 ${
                    fieldErrors.confirmPassword
                      ? "border-red-500/70"
                      : "border-purple-800/40 focus-within:border-pink-500"
                  }`}
                >

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Re-enter your password"
                    className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 text-purple-300/60 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>

                </div>

                {fieldErrors.confirmPassword && (
                  <p className="text-red-400 text-[10px] mt-1">
                    {
                      fieldErrors.confirmPassword
                    }
                  </p>
                )}

              </div>

              {/* ADDRESS */}

              <div>

                <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                  ADDRESS
                </label>

                <div
                  className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 ${
                    fieldErrors.address
                      ? "border-red-500/70"
                      : "border-purple-800/40 focus-within:border-pink-500"
                  }`}
                >

                  <input
                    type="text"
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="City, Street, Area"
                    className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                  />

                  <MapPin
                    size={15}
                    className="text-purple-300/60 absolute right-3"
                  />

                </div>

                {fieldErrors.address && (
                  <p className="text-red-400 text-[10px] mt-1">
                    {fieldErrors.address}
                  </p>
                )}

              </div>

              {/* NATIONALITY */}

              <div>

                <label className="text-[10px] sm:text-[11px] font-bold tracking-widest text-purple-200/70 uppercase block mb-1.5">
                  NATIONALITY
                </label>

                <div
                  className={`relative flex items-center bg-[#29174d]/85 border rounded-xl px-3.5 h-11 ${
                    fieldErrors.nationality
                      ? "border-red-500/70"
                      : "border-purple-800/40 focus-within:border-pink-500"
                  }`}
                >

                  <input
                    type="text"
                    name="nationality"
                    value={
                      formData.nationality
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Nepali"
                    className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-purple-300/40 focus:outline-none pr-7"
                  />

                  <Globe
                    size={15}
                    className="text-purple-300/60 absolute right-3"
                  />

                </div>

                {fieldErrors.nationality && (
                  <p className="text-red-400 text-[10px] mt-1">
                    {
                      fieldErrors.nationality
                    }
                  </p>
                )}

              </div>

              {/* REGISTER BUTTON */}

              <div className="pt-2">

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-white hover:bg-white/95 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-[#1e0d3d] font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-black/30 transition-all cursor-pointer group"
                >

                  <span>
                    {loading
                      ? "REGISTERING..."
                      : "REGISTER"}
                  </span>

                  <ArrowRight
                    size={15}
                    strokeWidth={2.5}
                    className="group-hover:translate-x-1 transition-transform"
                  />

                </button>

              </div>

            </form>

          </div>

          {/* SIGN IN */}

          <div className="mt-6 pt-4 border-t border-purple-800/30 flex items-center justify-between text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">

            <span className="text-purple-200/60">
              ALREADY HAVE AN ACCOUNT?
            </span>

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

export default RegisterPage;