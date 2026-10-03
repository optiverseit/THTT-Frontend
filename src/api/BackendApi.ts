import axiosInstance from "../services/axiosinstance";
import axios from "axios";

export const registerUser = (userData: any) => {
  return axiosInstance.post("auth/register", userData);
};

export const verifyEmailOtp = (data: {
  email: string;
  otp: string;
}) => {
  return axiosInstance.post("/auth/verify-email-otp", data);
};

export const loginUser = (loginData: any) => {
  return axiosInstance.post("/auth/login", loginData);
};

export const googleLogin = (idToken: any) => {
  return axiosInstance.post("/auth/google", {
    id_token: idToken,
  });
};

export const forgotPassword = (email: string) => {
  return axiosInstance.post("/auth/forgot-password", {
    email,
  });
};

export const verifyResetOtp = (
  email: string,
  otp: string
) => {
  return axiosInstance.post("/auth/verify-reset-otp", {
    email,
    otp,
  });
};

export const resetPassword = (
  email: string,
  resetToken: string,
  password: string,
  passwordConfirmation: string
) => {
  return axiosInstance.post("/auth/reset-password", {
    email,
    reset_token: resetToken,
    password,
    password_confirmation: passwordConfirmation,
  });
};

export const updateUserProfile = (data: any) => {
  return axiosInstance.put("/profile", data);
};

export const uploadUserProfilePicture = (data: FormData) => {
  return axiosInstance.post("/profile/avatar", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const getPackagesByCategory = (category: string, page = 1) => {
  return axiosInstance.get("/packageByCategory", {
    params: {
      category,
      page,
    },
  });
};

// BOOKING API
export const createBooking = (bookingData: any) => {
  return axiosInstance.post("/bookings", bookingData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMyBookings = (page = 1) => {
  return axiosInstance.get("/my-bookings", {
    params: {
      page,
    },
  });
};

export const initiatePayment = (data: {
  booking_id?: number;
  work_permit_id?: number;
  visa_application_id?: number;
  insurance_application_id?: number;
  hotel_booking_id?: number;
  provider: "ESEWA" | "KHALTI" | "PAYLATER";
}) => {
  return axiosInstance.post("/payments/initiate", data);
};

// ==============================
// PUBLIC CATEGORIES
// ==============================

export const getCategories = () => {
  return axiosInstance.get("/categories");
};


// ==============================
// PUBLIC PACKAGES
// ==============================

export const getPackages = () => {
  return axiosInstance.get("/packages");
};

export const getPackageById = (id: number | string) => {
  return axiosInstance.get(`/packages/${id}`);
};



// ==========================================
// PACKAGE INCLUSIONS
// ==========================================

export const getPackageInclusions = (
  packageId: number | string
) => {
  return axiosInstance.get(
    `/packages/${packageId}/inclusions`
  );
};


// ==========================================
// PACKAGE EXCLUSIONS
// ==========================================

export const getPackageExclusions = (
  packageId: number | string
) => {
  return axiosInstance.get(
    `/packages/${packageId}/exclusions`
  );
};


// ==========================================
// PACKAGE RESTRICTIONS
// ==========================================

export const getPackageRestrictions = (
  packageId: number | string
) => {
  return axiosInstance.get(
    `/packages/${packageId}/restrictions`
  );
};


// ==========================================
// WHAT TO BRING
// ==========================================

export const getPackageWhatToBring = (
  packageId: number | string
) => {
  return axiosInstance.get(
    `/packages/${packageId}/what-to-bring`
  );
};


// ==========================================
// FAQS
// ==========================================

export const getPackageFaqs = (
  packageId: number | string
) => {
  return axiosInstance.get(
    `/packages/${packageId}/faqs`
  );
};


// ==========================================
// PRICING TIERS
// ==========================================

export const getPackagePricingTiers = (
  packageId: number | string
) => {
  return axiosInstance.get(
    `/packages/${packageId}/pricing-tiers`
  );
};


// ==========================================
// ITINERARIES
// ==========================================

export const getPackageItineraries = (
  packageId: number | string
) => {
  return axiosInstance.get(
    `/packages/${packageId}/itineraries`
  );
};


// ==========================================
// HIGHLIGHTS
// ==========================================

export const getPackageHighlights = (
  packageId: number | string
) => {
  return axiosInstance.get(
    `/packages/${packageId}/highlights`
  );
};

// VEHICLES
// PUBLIC - active vehicles for frontend
export const getAllVehicles = () => {
  return axiosInstance.get("/vehicles");
};

export const getVehicleById = (id: number | string) => {
  return axiosInstance.get(`/vehicles/${id}`);
};


// WORK PERMIT
export const getCountries = () => {
  return axiosInstance.get("/countries");
};

export const getCountryById = (id: string | number) => {
  return axiosInstance.get(`/countries/${id}`);
};

export const getPermitFeeTiers = (countryId: string | number) => {
  return axiosInstance.get(`/countries/${countryId}/permit-fee-tiers`);
};

export const getWorkPermitDocumentRequirements = (countryId: number) => {
  return axiosInstance.get(
    `/work-permit-document-requirements/${countryId}`
  );
};

export const createWorkPermitApplication = (data: FormData) => {
  return axiosInstance.post(
    "/work-permits/store",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// ============================================
// VISA SERVICE - PUBLIC
// ============================================

export const getVisaCategories = () => {
  return axiosInstance.get("/visa-categories");
};

export const getVisaPublicDocumentRequirements = (
  visaCategoryId: number | string
) => {
  return axiosInstance.get(
    `/visa-public-document-requirements/${visaCategoryId}`
  );
};

export const getVisaPublicInformation = (
  visaCategoryId: number | string
) => {
  return axiosInstance.get(
    `/visa-public-information/${visaCategoryId}`
  );
};

export const getVisaPublicPricingTiers = (
  visaCategoryId: number | string
) => {
  return axiosInstance.get(
    `/visa-public-pricing-tiers/${visaCategoryId}`
  );
};

export const storeVisaApplication = (data: FormData) => {
  return axiosInstance.post("/visa-applications/store", data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


// ======================================================
// INSURANCE PUBLIC APIs
// ======================================================

export const getInsurancePlans = () => {
  return axiosInstance.get(
    "/insurance-plans"
  );
};

export const getInsurancePlanById = (
  id: number | string
) => {
  return axiosInstance.get(
    `/insurance-plans/show/${id}`
  );
};

export const getInsurancePricingTiersByPlan = (
  insurancePlanId: number | string
) => {
  return axiosInstance.get(
    `/insurance-pricing-tiers/plan/${insurancePlanId}`
  );
};

export const getInsurancePricingTierById = (
  id: number | string
) => {
  return axiosInstance.get(
    `/insurance-pricing-tiers/show/${id}`
  );
};

export const getInsuranceDocumentRequirementsByPlan = (
  insurancePlanId: number | string
) => {
  return axiosInstance.get(
    `/insurance-document-requirements/plan/${insurancePlanId}`
  );
};

export const getInsuranceDocumentRequirementById = (
  id: number | string
) => {
  return axiosInstance.get(
    `/insurance-document-requirements/show/${id}`
  );
};

export const getInsuranceInformationByPlan = (
  insurancePlanId: number | string
) => {
  return axiosInstance.get(
    `/insurance-information/plan/${insurancePlanId}`
  );
};

export const getInsuranceInformationById = (
  id: number | string
) => {
  return axiosInstance.get(
    `/insurance-information/show/${id}`
  );
};

export const getInsuranceDynamicFieldsByPlan = (
  insurancePlanId: number | string
) => {
  return axiosInstance.get(
    `/insurance-dynamic-fields/plan/${insurancePlanId}`
  );
};

export const createInsuranceApplication = (formData: FormData) => {
  return axiosInstance.post("/insurance-applications/store", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// HOTEL SERVICE
export const getHotels = () => {
  return axiosInstance.get("/hotels");
};

export const getHotelById = (id: number | string) => {
  return axiosInstance.get(`/hotels/show/${id}`);
};

export const createHotelBooking = (data: any) => {
  return axiosInstance.post("/hotel-bookings/store", data);
};




// DASHBAORD APIS 
export const getMyPackageBookings = () => {
  return axiosInstance.get("/bookings/my/PACKAGE");
};

export const getMyVehicleBookings = () => {
  return axiosInstance.get("/bookings/my/VEHICLE");
};

export const getMyHeliBookings = () => {
  return axiosInstance.get("/bookings/my/HELI");
};

export const getMyVisaApplications = () => {
  return axiosInstance.get("/visa-applications");
};

export const getMyInsuranceApplications = () => {
  return axiosInstance.get("/insurance-applications");
};

export const getMyWorkPermitApplications = () => {
  return axiosInstance.get("/work-permits/myApplications");
};

export const getMyHotelBookings = () => {
  return axiosInstance.get("/hotel-bookings");
};


// DASHBOARD DETAIL APIS
export const getMyBookingById = (id: number | string) => {
  return axiosInstance.get(`/bookings/show/${id}`);
};
export const getMyVisaApplicationById = (id: number | string) => {
  return axiosInstance.get(`/visa-applications/show/${id}`);
};
export const getMyInsuranceApplicationById = (id: number | string) => {
  return axiosInstance.get(`/insurance-applications/show/${id}`);
};
export const getMyWorkPermitApplicationById = (id: number | string) => {
  return axiosInstance.get(`/work-permits/${id}`);
};
export const getMyHotelBookingById = (id: number | string) => {
  return axiosInstance.get(`/hotel-bookings/show/${id}`);
};



