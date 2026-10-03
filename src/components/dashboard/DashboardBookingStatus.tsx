import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, Search, User, X, FileText, Mail, Phone, Calendar, MapPin, CreditCard, Hash, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVICE_CONFIGS, ServiceType } from "./DashboardBookingTypes";
import DashboardHeaderBanner from "./DashboardHeaderBanner";
import {
  getMyPackageBookings,
  getMyVehicleBookings,
  getMyHeliBookings,
  getMyVisaApplications,
  getMyInsuranceApplications,
  getMyWorkPermitApplications,
  getMyHotelBookings,
  getMyBookingById,
  getMyVisaApplicationById,
  getMyInsuranceApplicationById,
  getMyWorkPermitApplicationById,
  getMyHotelBookingById,
} from "../../api/BackendApi";

interface DashboardBookingStatusProps {
  mode?: "cards-first" | "table-only";
  userData?: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
}

interface ApiBooking {
  id: string;
  backendId: number;
  serviceType: ServiceType;
  submissionNumber: string;
  name: string;
  email: string;
  nationality: string;
  travelDate: string;
  contact: string;
  itemLabel: string;
  itemSub: string;
  price: string;
  paymentStatus: string;
  bookingStatus: string;
  raw: any;
}

const getDataArray = (response: any): any[] => {
  const body = response?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.data)) return body.data.data;
  return [];
};

const getSingleData = (response: any): any => {
  const body = response?.data;
  if (body?.data && !Array.isArray(body.data)) return body.data;
  if (body && !Array.isArray(body)) return body;
  return null;
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const formatMoney = (value: any) => {
  if (value === null || value === undefined || value === "") return "NPR 0";
  const amount = Number(value);
  return `NPR ${Number.isFinite(amount) ? amount.toLocaleString() : "0"}`;
};

const readableText = (value?: string | null) => {
  if (!value) return "-";
  return String(value).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const getPaymentStatus = (item: any) =>
  String(item?.payment_status ?? item?.paymentStatus ?? item?.payments?.[0]?.status ?? "PENDING").toUpperCase();

const getBookingStatus = (item: any) =>
  String(item?.status ?? item?.application_status ?? item?.booking_status ?? "PENDING").toUpperCase();

const fullUserName = (user: any) => {
  if (!user) return "";
  if (user.name) return user.name;
  return [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ");
};

const getAuthenticatedApplicant = (item: any, authenticatedEmail?: string) => {
  const applicants = Array.isArray(item?.applicants) ? item.applicants : [];
  if (!applicants.length) return null;
  if (authenticatedEmail) {
    const match = applicants.find((applicant: any) =>
      String(applicant?.email || "").toLowerCase() === authenticatedEmail.toLowerCase()
    );
    if (match) return match;
  }
  return applicants[0];
};

const normalizePackageBooking = (item: any, serviceType: ServiceType, userData?: DashboardBookingStatusProps["userData"]): ApiBooking => {
  const vehicle = item?.transports?.find((transport: any) => transport?.vehicle)?.vehicle;
  const heli = item?.transports?.find((transport: any) => transport?.heli)?.heli;
  let itemLabel = item?.package?.title || item?.package?.name || "-";
  let itemSub = item?.package?.location || "";
  if (serviceType === "vehicle-rental") {
    itemLabel = vehicle?.name || vehicle?.vehicle_type || "Vehicle Rental";
    itemSub = vehicle ? `${vehicle.from_location || ""}${vehicle.from_location && vehicle.to_location ? " → " : ""}${vehicle.to_location || ""}` : "";
  }
  if (serviceType === "heli-service") {
    itemLabel = item?.package?.title || heli?.name || "Helicopter Service";
    itemSub = item?.package?.location || heli?.location || "";
  }
  return {
    id: String(item.id),
    backendId: Number(item.id),
    serviceType,
    submissionNumber: item.booking_reference || item.booking_number || item.reference_number || `#${item.id}`,
    name: item.primary_guest_name || item.customer_name || item.name || fullUserName(item.user) || userData?.name || "-",
    email: item.email || item.user?.email || userData?.email || "-",
    nationality: item.nationality || item.user?.nationality || "-",
    travelDate: formatDate(item.travel_date || item.start_date || item.booking_date || item.created_at),
    contact: item.phone_number || item.phone || item.contact_number || item.user?.phone || userData?.phone || "-",
    itemLabel,
    itemSub,
    price: formatMoney(item.total_amount ?? item.amount ?? item.total_price ?? item.frontend_total_amount),
    paymentStatus: getPaymentStatus(item),
    bookingStatus: getBookingStatus(item),
    raw: item,
  };
};

const normalizeVisa = (item: any, userData?: DashboardBookingStatusProps["userData"]): ApiBooking => {
  const applicant = getAuthenticatedApplicant(item, userData?.email);
  return {
    id: String(item.id),
    backendId: Number(item.id),
    serviceType: "visa-service",
    submissionNumber: item.application_number || item.application_reference || `VISA-${item.id}`,
    name: applicant?.applicant_full_name || item.primary_applicant_name || item.applicant_name || fullUserName(item.user) || userData?.name || "-",
    email: applicant?.email || item.email || item.user?.email || userData?.email || "-",
    nationality: applicant?.nationality || item.nationality || item.user?.nationality || "-",
    travelDate: formatDate(item.intended_travel_date || item.travel_date || item.created_at),
    contact: applicant ? `${applicant.country_code || ""} ${applicant.phone_number || ""}`.trim() : item.phone_number || item.phone || userData?.phone || "-",
    itemLabel: item.visa_category?.name || item.visaCategory?.name || item.visa_type || "Visa Application",
    itemSub: item.country?.country_name || item.country?.name || "",
    price: formatMoney(item.total_amount ?? item.amount ?? item.frontend_total_amount),
    paymentStatus: getPaymentStatus(item),
    bookingStatus: getBookingStatus(item),
    raw: item,
  };
};

const normalizeInsurance = (item: any, userData?: DashboardBookingStatusProps["userData"]): ApiBooking => {
  const applicant = getAuthenticatedApplicant(item, userData?.email);
  return {
    id: String(item.id),
    backendId: Number(item.id),
    serviceType: "travel-insurance",
    submissionNumber: item.application_number || item.application_reference || `INS-${item.id}`,
    name: applicant?.applicant_full_name || applicant?.full_name || item.primary_applicant_name || item.applicant_name || fullUserName(item.user) || userData?.name || "-",
    email: applicant?.email || item.email || item.user?.email || userData?.email || "-",
    nationality: applicant?.nationality || item.nationality || item.user?.nationality || "-",
    travelDate: formatDate(item.travel_date || item.start_date || item.intended_travel_date || item.created_at),
    contact: applicant?.phone_number || item.phone_number || item.phone || userData?.phone || "-",
    itemLabel: item.insurance_plan?.plan_name || item.insurance_plan?.name || item.insurancePlan?.plan_name || item.insurancePlan?.name || "Travel Insurance",
    itemSub: item.pricing_tier?.tier_name || item.pricing_tier?.name || item.pricingTier?.tier_name || item.pricingTier?.name || item.coverage_type || "",
    price: formatMoney(item.total_amount ?? item.amount ?? item.frontend_total_amount),
    paymentStatus: getPaymentStatus(item),
    bookingStatus: getBookingStatus(item),
    raw: item,
  };
};

const normalizeWorkPermit = (item: any, userData?: DashboardBookingStatusProps["userData"]): ApiBooking => ({
  id: String(item.id),
  backendId: Number(item.id),
  serviceType: "work-permit",
  submissionNumber: item.application_number || item.booking_reference || `WP-${item.id}`,
  name: item.applicant_full_name || item.primary_applicant_name || fullUserName(item.user) || userData?.name || "-",
  email: item.email || item.user?.email || userData?.email || "-",
  nationality: item.nationality || item.user?.nationality || "-",
  travelDate: formatDate(item.created_at),
  contact: item.phone_number || item.phone || item.user?.phone || userData?.phone || "-",
  itemLabel: readableText(item.permit_type || item.job_title || "Work Permit"),
  itemSub: item.country?.country_name || item.country?.name || item.employer_company_name || "",
  price: formatMoney(item.total_amount ?? item.fee_tier?.total_cost_npr ?? item.feeTier?.total_cost_npr ?? item.fee_tier?.total_fee_npr),
  paymentStatus: getPaymentStatus(item),
  bookingStatus: getBookingStatus(item),
  raw: item,
});

const normalizeHotel = (item: any, userData?: DashboardBookingStatusProps["userData"]): ApiBooking => ({
  id: String(item.id),
  backendId: Number(item.id),
  serviceType: "hotel-booking",
  submissionNumber: item.booking_reference || `HOTEL-${item.id}`,
  name: item.primary_guest_name || fullUserName(item.user) || userData?.name || "-",
  email: item.email || item.user?.email || userData?.email || "-",
  nationality: item.nationality || item.user?.nationality || "-",
  travelDate: formatDate(item.check_in_date),
  contact: item.phone_number || item.phone || item.user?.phone || userData?.phone || "-",
  itemLabel: item.hotel?.hotel_name || item.hotel?.name || "Hotel Booking",
  itemSub: item.pricing_tier?.room_name || item.pricingTier?.room_name || "",
  price: formatMoney(item.total_amount),
  paymentStatus: getPaymentStatus(item),
  bookingStatus: getBookingStatus(item),
  raw: item,
});

const normalizeDetail = (item: any, service: ServiceType, userData?: DashboardBookingStatusProps["userData"]): ApiBooking => {
  switch (service) {
    case "visa-service": return normalizeVisa(item, userData);
    case "travel-insurance": return normalizeInsurance(item, userData);
    case "work-permit": return normalizeWorkPermit(item, userData);
    case "hotel-booking": return normalizeHotel(item, userData);
    default: return normalizePackageBooking(item, service, userData);
  }
};

const statusClass = (status: string) => {
  const value = status.toUpperCase();
  if (["PAID", "CONFIRMED", "APPROVED", "COMPLETED", "VERIFIED"].includes(value)) return "bg-emerald-50 text-emerald-600 border-emerald-200";
  if (["FAILED", "REJECTED", "CANCELLED"].includes(value)) return "bg-red-50 text-red-600 border-red-200";
  return "bg-amber-50 text-amber-600 border-amber-200";
};

const DetailField = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="bg-[#F8F9FC] rounded-2xl p-4 border border-slate-100">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>
    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">{icon}{value ?? "-"}</div>
  </div>
);

const DashboardBookingStatus: React.FC<DashboardBookingStatusProps> = ({ mode = "cards-first", userData }) => {
  const navigate = useNavigate();
  const { serviceId: urlServiceId, bookingId: urlBookingId } = useParams<{ serviceId?: string; bookingId?: string }>();
  const isTableOnly = mode === "table-only";
  const selectedService = (urlServiceId || "") as ServiceType;
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [detailBooking, setDetailBooking] = useState<ApiBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [searchSubNo, setSearchSubNo] = useState("");
  const view = urlBookingId ? "detail" : urlServiceId ? "list" : isTableOnly ? "cards" : "cards";

  useEffect(() => {
    if (!urlServiceId || urlBookingId || urlServiceId === "air-ticket") {
      setBookings([]);
      return;
    }
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      setBookings([]);
      try {
        let response: any;
        let normalized: ApiBooking[] = [];
        switch (urlServiceId) {
          case "package-booking":
            response = await getMyPackageBookings();
            normalized = getDataArray(response).map((item) => normalizePackageBooking(item, "package-booking", userData));
            break;
          case "vehicle-rental":
            response = await getMyVehicleBookings();
            normalized = getDataArray(response).map((item) => normalizePackageBooking(item, "vehicle-rental", userData));
            break;
          case "heli-service":
            response = await getMyHeliBookings();
            normalized = getDataArray(response).map((item) => normalizePackageBooking(item, "heli-service", userData));
            break;
          case "visa-service":
            response = await getMyVisaApplications();
            normalized = getDataArray(response).map((item) => normalizeVisa(item, userData));
            break;
          case "travel-insurance":
            response = await getMyInsuranceApplications();
            normalized = getDataArray(response).map((item) => normalizeInsurance(item, userData));
            break;
          case "work-permit":
            response = await getMyWorkPermitApplications();
            normalized = getDataArray(response).map((item) => normalizeWorkPermit(item, userData));
            break;
          case "hotel-booking":
            response = await getMyHotelBookings();
            normalized = getDataArray(response).map((item) => normalizeHotel(item, userData));
            break;
          default:
            normalized = [];
        }
        if (active) setBookings(normalized);
      } catch (err: any) {
        if (active) {
          setBookings([]);
          setError(err?.response?.data?.message || "Failed to load bookings.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [urlServiceId, urlBookingId, userData]);

  useEffect(() => {
    if (!urlServiceId || !urlBookingId || urlServiceId === "air-ticket") {
      setDetailBooking(null);
      return;
    }
    let active = true;
    const loadDetail = async () => {
      setLoading(true);
      setError("");
      setDetailBooking(null);
      try {
        let response: any;
        switch (urlServiceId) {
          case "package-booking":
          case "vehicle-rental":
          case "heli-service":
            response = await getMyBookingById(urlBookingId);
            break;
          case "visa-service":
            response = await getMyVisaApplicationById(urlBookingId);
            break;
          case "travel-insurance":
            response = await getMyInsuranceApplicationById(urlBookingId);
            break;
          case "work-permit":
            response = await getMyWorkPermitApplicationById(urlBookingId);
            break;
          case "hotel-booking":
            response = await getMyHotelBookingById(urlBookingId);
            break;
          default:
            throw new Error("Unsupported booking service.");
        }
        const data = getSingleData(response);
        if (!data) throw new Error("Booking details were not found.");
        if (active) setDetailBooking(normalizeDetail(data, urlServiceId as ServiceType, userData));
      } catch (err: any) {
        if (active) {
          setDetailBooking(null);
          setError(err?.response?.data?.message || err?.message || "Failed to load booking details.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDetail();
    return () => { active = false; };
  }, [urlServiceId, urlBookingId, userData]);

  const cfg = SERVICE_CONFIGS.find((item) => item.id === selectedService);

  const itemSearchPlaceholder = useMemo(() => {
    switch (selectedService) {
      case "package-booking": return "Package name or destination...";
      case "visa-service": return "Visa type or country...";
      case "travel-insurance": return "Coverage type...";
      case "work-permit": return "Permit type or country...";
      case "vehicle-rental": return "Vehicle type or route...";
      case "heli-service": return "Heli package or destination...";
      case "hotel-booking": return "Hotel name or room type...";
      case "air-ticket": return "Flight route or class...";
      default: return "Package or service...";
    }
  }, [selectedService]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const name = searchName.trim().toLowerCase();
      const sub = searchSubNo.trim().toLowerCase().replace(/#/g, "");
      const item = searchItem.trim().toLowerCase();
      if (name && !booking.name.toLowerCase().includes(name)) return false;
      if (sub && !booking.submissionNumber.toLowerCase().replace(/#/g, "").includes(sub)) return false;
      if (item && !`${booking.itemLabel} ${booking.itemSub}`.toLowerCase().includes(item)) return false;
      return true;
    });
  }, [bookings, searchName, searchSubNo, searchItem]);

  const clearSearch = () => {
    setSearchName("");
    setSearchSubNo("");
    setSearchItem("");
  };

  const handleCardClick = (service: ServiceType) => {
    clearSearch();
    navigate(`/dashboard/booking/${service}`);
  };

  const handleViewDetails = (booking: ApiBooking) => {
    navigate(`/dashboard/booking/${booking.serviceType}/${booking.backendId}`);
  };

  if (view === "detail") {
    const raw = detailBooking?.raw;
    const IconComponent = cfg?.IconComponent;
    const selectedApplicant = raw ? getAuthenticatedApplicant(raw, userData?.email) : null;
    const vehicle = raw?.transports?.find((transport: any) => transport?.vehicle)?.vehicle;
    const heli = raw?.transports?.find((transport: any) => transport?.heli)?.heli;
    return (
      <section className="space-y-0">
        <DashboardHeaderBanner>
          <div className="flex flex-col gap-4">
            <button type="button" onClick={() => navigate(`/dashboard/booking/${selectedService}`)} className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-200 hover:text-[#FF2A75] transition-colors w-fit">
              <ArrowLeft size={18} /> Back to Bookings
            </button>
            {detailBooking && (
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                <div className="flex items-center gap-4">
                  {cfg && IconComponent && <div className={`w-14 h-14 rounded-2xl ${cfg.bgColor} ${cfg.color} flex items-center justify-center`}><IconComponent size={27} /></div>}
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">{cfg?.label || "Booking Details"}</h1>
                    <p className="text-xs sm:text-sm text-purple-200 font-mono mt-1">{detailBooking.submissionNumber}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase ${statusClass(detailBooking.bookingStatus)}`}>{detailBooking.bookingStatus}</span>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase ${statusClass(detailBooking.paymentStatus)}`}>{detailBooking.paymentStatus}</span>
                    </div>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Total Amount</p>
                  <p className="text-2xl sm:text-3xl font-black text-white mt-1">{detailBooking.price}</p>
                </div>
              </div>
            )}
          </div>
        </DashboardHeaderBanner>
        <div className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-[#FF2A75] rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-500 mt-4">Loading booking details...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-red-100 shadow-sm">
              <h3 className="font-black text-slate-900">Unable to load booking details</h3>
              <p className="text-xs text-red-500 mt-2">{error}</p>
            </div>
          ) : detailBooking ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Traveler Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <DetailField label="Full Name" value={detailBooking.name} icon={<User size={15} className="text-[#8B2CFF]" />} />
                  <DetailField label="Nationality" value={detailBooking.nationality} icon={<MapPin size={15} className="text-amber-500" />} />
                  <DetailField label="Email Address" value={detailBooking.email} icon={<Mail size={15} className="text-blue-500" />} />
                  <DetailField label="Contact Number" value={detailBooking.contact} icon={<Phone size={15} className="text-emerald-500" />} />
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Booking Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <DetailField label="Service" value={detailBooking.itemLabel} icon={<CheckCircle2 size={15} className="text-[#FF2A75]" />} />
                  <DetailField label="Travel Date" value={detailBooking.travelDate} icon={<Calendar size={15} className="text-blue-500" />} />
                  <DetailField label="Submission Number" value={detailBooking.submissionNumber} icon={<Hash size={15} className="text-purple-500" />} />
                  <DetailField label="Total Amount" value={detailBooking.price} icon={<CreditCard size={15} className="text-emerald-500" />} />
                  {detailBooking.itemSub && <div className="sm:col-span-2"><DetailField label="Package / Service Details" value={detailBooking.itemSub} /></div>}
                </div>
              </div>

              {selectedService === "package-booking" && raw && (
                <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Package Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                    <DetailField label="Package" value={raw.package?.title || "-"} />
                    <DetailField label="Location" value={raw.package?.location || "-"} />
                    <DetailField label="Duration" value={raw.package?.duration || "-"} />
                    <DetailField label="Number of People" value={raw.number_of_people ?? "-"} />
                    <DetailField label="Start Date" value={formatDate(raw.start_date)} />
                    <DetailField label="End Date" value={formatDate(raw.end_date)} />
                    <DetailField label="Pricing Tier" value={raw.pricing_tier?.service || "-"} />
                    <DetailField label="Age Group" value={raw.pricing_tier?.age_group || "-"} />
                  </div>
                </div>
              )}

              {selectedService === "vehicle-rental" && raw && (
                <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Vehicle Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                    <DetailField label="Vehicle" value={vehicle?.name || "-"} />
                    <DetailField label="Vehicle Type" value={vehicle?.vehicle_type || "-"} />
                    <DetailField label="From" value={vehicle?.from_location || "-"} />
                    <DetailField label="To" value={vehicle?.to_location || "-"} />
                    <DetailField label="Trip Type" value={readableText(vehicle?.trip_type)} />
                    <DetailField label="Fuel Type" value={readableText(vehicle?.fuel_type)} />
                    <DetailField label="Passengers" value={raw.number_of_people ?? "-"} />
                    <DetailField label="Capacity" value={vehicle?.capacity ?? "-"} />
                    <DetailField label="Start Date" value={formatDate(raw.start_date)} />
                    <DetailField label="End Date" value={formatDate(raw.end_date)} />
                    <DetailField label="Price Per Person" value={vehicle?.price ? formatMoney(vehicle.price) : "-"} />
                    <DetailField label="Total Amount" value={formatMoney(raw.total_amount)} />
                  </div>
                </div>
              )}

              {selectedService === "heli-service" && raw && (
                <>
                  <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Helicopter Booking Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                      <DetailField label="Package" value={raw.package?.title || heli?.name || "-"} />
                      <DetailField label="Location" value={raw.package?.location || "-"} />
                      <DetailField label="Duration" value={raw.package?.duration || "-"} />
                      <DetailField label="Passengers" value={raw.number_of_people ?? "-"} />
                      <DetailField label="Flight Date" value={formatDate(raw.start_date)} />
                      <DetailField label="Service" value={raw.pricing_tier?.service || "-"} />
                      <DetailField label="Age Group" value={raw.pricing_tier?.age_group || "-"} />
                      <DetailField label="Total Amount" value={formatMoney(raw.total_amount)} />
                    </div>
                  </div>
                  {Array.isArray(raw.heli_booking_documents) && raw.heli_booking_documents.length > 0 && (
                    <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                      <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Passenger Information</h2>
                      <div className="space-y-4 mt-4">
                        {raw.heli_booking_documents.map((doc: any, index: number) => (
                          <div key={doc.id || index} className="border border-slate-100 rounded-2xl p-4">
                            <p className="text-xs font-black text-[#8B2CFF] mb-3">Passenger {index + 1}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              <DetailField label="Name" value={doc.name || "-"} />
                              <DetailField label="Nationality" value={doc.nationality || "-"} />
                              <DetailField label="Identity Number" value={doc.identity_number || "-"} />
                              <DetailField label="Weight" value={doc.weight ? `${doc.weight} kg` : "-"} />
                              <DetailField label="Luggage" value={doc.luggage ? `${doc.luggage} kg` : "-"} />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {doc.passport_nid_image && <a href={doc.passport_nid_image} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">View Passport / NID</a>}
                              {doc.pp_size_photo && <a href={doc.pp_size_photo} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">View Photo</a>}
                              {doc.confirmed_flight_ticket_image && <a href={doc.confirmed_flight_ticket_image} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">View Flight Ticket</a>}
                              {doc.travel_insurance_image && <a href={doc.travel_insurance_image} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">View Insurance</a>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedService === "visa-service" && raw && (
                <>
                  <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Visa Application Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                      <DetailField label="Country" value={raw.country?.country_name || "-"} />
                      <DetailField label="Visa Category" value={raw.visa_category?.name || raw.visaCategory?.name || "-"} />
                      <DetailField label="Entry Type" value={raw.pricing_tier?.title || "-"} />
                      <DetailField label="Validity" value={raw.pricing_tier?.validity || "-"} />
                      <DetailField label="Travel Date" value={formatDate(raw.intended_travel_date)} />
                      <DetailField label="Applicants" value={raw.applicant_count ?? raw.applicants?.length ?? 0} />
                      <DetailField label="Price Per Applicant" value={raw.pricing_tier?.price_npr ? formatMoney(raw.pricing_tier.price_npr) : "-"} />
                      <DetailField label="Total Amount" value={formatMoney(raw.total_amount)} />
                    </div>
                  </div>
                  {Array.isArray(raw.applicants) && raw.applicants.length > 0 && (
                    <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                      <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Applicants</h2>
                      <div className="space-y-4 mt-4">
                        {raw.applicants.map((applicant: any, index: number) => (
                          <div key={applicant.id || index} className={`border rounded-2xl p-4 ${selectedApplicant?.id === applicant.id ? "border-purple-200 bg-purple-50/20" : "border-slate-100"}`}>
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <p className="text-xs font-black text-[#8B2CFF]">Applicant {index + 1}</p>
                              {selectedApplicant?.id === applicant.id && <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-purple-100 text-purple-600">Your Applicant Record</span>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              <DetailField label="Full Name" value={applicant.applicant_full_name || "-"} />
                              <DetailField label="Nationality" value={applicant.nationality || "-"} />
                              <DetailField label="Email" value={applicant.email || "-"} />
                              <DetailField label="Phone" value={`${applicant.country_code || ""} ${applicant.phone_number || ""}`.trim() || "-"} />
                              <DetailField label="Passport Number" value={applicant.passport_number || "-"} />
                              <DetailField label="Passport Expiry" value={formatDate(applicant.passport_expiry_date)} />
                            </div>
                            {Array.isArray(applicant.documents) && applicant.documents.length > 0 && (
                              <div className="mt-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Documents</p>
                                <div className="flex flex-wrap gap-2">
                                  {applicant.documents.map((document: any) => (
                                    <a key={document.id} href={document.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200">
                                      <FileText size={13} />{document.requirement?.title || document.requirement?.document_type || document.file_name || "View Document"}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedService === "work-permit" && raw && (
                <>
                  <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Work Permit Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                      <DetailField label="Permit Type" value={readableText(raw.permit_type)} />
                      <DetailField label="Country" value={raw.country?.country_name || "-"} />
                      <DetailField label="Age Group" value={raw.fee_tier?.age_group_label || "-"} />
                      <DetailField label="Calculated Age" value={raw.calculated_age ?? "-"} />
                      <DetailField label="Passport Number" value={raw.passport_number || "-"} />
                      <DetailField label="Passport Expiry" value={formatDate(raw.passport_expiry_date)} />
                      <DetailField label="Date of Birth AD" value={formatDate(raw.dob_ad)} />
                      <DetailField label="Date of Birth BS" value={raw.dob_bs || "-"} />
                      <DetailField label="Gender" value={raw.gender || "-"} />
                      <DetailField label="Job Title" value={raw.job_title || "-"} />
                      <DetailField label="Employer" value={raw.employer_company_name || "-"} />
                      <DetailField label="FEIMS Reference" value={raw.feims_reference_number || "-"} />
                    </div>
                  </div>
                  {raw.fee_tier && (
                    <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                      <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Fee Details</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
                        <DetailField label="Welfare Fund" value={formatMoney(raw.fee_tier.welfare_fund_npr)} />
                        <DetailField label="SSF Contribution" value={formatMoney(raw.fee_tier.ssf_contribution_npr)} />
                        <DetailField label="Insurance Premium" value={formatMoney(raw.fee_tier.insurance_premium_npr)} />
                        <DetailField label="Service Fee" value={formatMoney(raw.fee_tier.service_fee_npr)} />
                        <DetailField label="Total Cost" value={formatMoney(raw.fee_tier.total_cost_npr)} />
                      </div>
                    </div>
                  )}
                  {Array.isArray(raw.documents) && raw.documents.length > 0 && (
                    <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                      <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Documents</h2>
                      <div className="flex flex-wrap gap-3 mt-4">
                        {raw.documents.map((document: any) => (
                          <a key={document.id} href={document.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F8F9FC] border border-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-100">
                            <FileText size={14} className="text-[#8B2CFF]" />
                            <span>{readableText(document.document_type)}</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full ${document.is_verified ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>{document.is_verified ? "VERIFIED" : "PENDING"}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedService === "travel-insurance" && raw && (
                <>
                  <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Insurance Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                      <DetailField label="Insurance Plan" value={raw.insurance_plan?.plan_name || raw.insurance_plan?.name || raw.insurancePlan?.plan_name || raw.insurancePlan?.name || "-"} />
                      <DetailField label="Pricing Tier" value={raw.pricing_tier?.tier_name || raw.pricing_tier?.name || raw.pricingTier?.tier_name || raw.pricingTier?.name || "-"} />
                      <DetailField label="Travel Date" value={formatDate(raw.travel_date || raw.start_date)} />
                      <DetailField label="Applicants" value={raw.applicant_count ?? raw.applicants?.length ?? 0} />
                    </div>
                  </div>
                  {Array.isArray(raw.applicants) && raw.applicants.length > 0 && (
                    <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                      <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Applicants</h2>
                      <div className="space-y-4 mt-4">
                        {raw.applicants.map((applicant: any, index: number) => (
                          <div key={applicant.id || index} className="border border-slate-100 rounded-2xl p-4">
                            <p className="text-xs font-black text-[#8B2CFF] mb-3">Applicant {index + 1}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              <DetailField label="Full Name" value={applicant.applicant_full_name || applicant.full_name || "-"} />
                              <DetailField label="Nationality" value={applicant.nationality || "-"} />
                              <DetailField label="Email" value={applicant.email || "-"} />
                              <DetailField label="Phone" value={applicant.phone_number || "-"} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedService === "hotel-booking" && raw && (
                <>
                  <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Hotel Stay Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                      <DetailField label="Hotel" value={raw.hotel?.hotel_name || "-"} />
                      <DetailField label="Room" value={raw.pricing_tier?.room_name || "-"} />
                      <DetailField label="Check In" value={formatDate(raw.check_in_date)} />
                      <DetailField label="Check Out" value={formatDate(raw.check_out_date)} />
                      <DetailField label="Number of Days" value={raw.number_of_days ? `${raw.number_of_days} Day${Number(raw.number_of_days) !== 1 ? "s" : ""}` : "-"} />
                      <DetailField label="Total Guests" value={raw.total_guests ?? "-"} />
                      <DetailField label="Beds in Room" value={raw.beds_in_room ?? "-"} />
                      <DetailField label="Children" value={raw.number_of_children ?? 0} />
                    </div>
                  </div>
                  {raw.special_requests && (
                    <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                      <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider pb-4 border-b border-slate-100">Special Requests</h2>
                      <p className="text-sm font-medium text-slate-700 mt-4">{raw.special_requests}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (view === "list") {
    const IconComponent = cfg?.IconComponent;
    return (
      <section id={`booking-list-${selectedService}`} className="space-y-0">
        <DashboardHeaderBanner>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-200 hover:text-[#FF2A75] transition-colors"><ArrowLeft size={18} /> All Services</button>
              <span className="text-purple-400/40">│</span>
              {cfg && IconComponent && (
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${cfg.bgColor} ${cfg.color} flex items-center justify-center`}><IconComponent size={20} /></div>
                  <div>
                    <h1 className="text-lg sm:text-2xl font-black text-white">{cfg.label}</h1>
                    <p className="text-xs text-purple-200/80 font-medium">{loading ? "Loading bookings..." : `${filteredBookings.length} booking${filteredBookings.length !== 1 ? "s" : ""} found · Latest first`}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="flex flex-col sm:grid sm:grid-cols-3 lg:flex lg:flex-row items-center gap-2.5">
                <div className="relative flex-1 w-full">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search by name..." value={searchName} onChange={(e) => setSearchName(e.target.value)} className="w-full pl-9 pr-7 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FF2A75]" />
                  {searchName && <button type="button" onClick={() => setSearchName("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"><X size={13} /></button>}
                </div>
                <div className="relative flex-1 w-full">
                  <FileText size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Submission number..." value={searchSubNo} onChange={(e) => setSearchSubNo(e.target.value)} className="w-full pl-9 pr-7 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FF2A75]" />
                  {searchSubNo && <button type="button" onClick={() => setSearchSubNo("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"><X size={13} /></button>}
                </div>
                <div className="relative flex-1 w-full">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder={itemSearchPlaceholder} value={searchItem} onChange={(e) => setSearchItem(e.target.value)} className="w-full pl-9 pr-7 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FF2A75]" />
                  {searchItem && <button type="button" onClick={() => setSearchItem("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"><X size={13} /></button>}
                </div>
                {(searchName || searchSubNo || searchItem) && <button type="button" onClick={clearSearch} className="px-4 py-2.5 text-xs font-bold text-white bg-white/10 border border-white/20 rounded-xl">Clear</button>}
              </div>
            </div>
          </div>
        </DashboardHeaderBanner>
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm"><div className="w-8 h-8 border-4 border-slate-200 border-t-[#FF2A75] rounded-full animate-spin mx-auto" /><p className="text-sm font-bold text-slate-500 mt-4">Loading your bookings...</p></div>
          ) : error ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-red-100 shadow-sm"><h3 className="font-black text-slate-900">Unable to load bookings</h3><p className="text-xs text-red-500 mt-2">{error}</p></div>
          ) : selectedService === "air-ticket" ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm"><h3 className="font-black text-slate-900">Air Ticket</h3><p className="text-xs text-slate-400 mt-2">Air ticket booking API will be connected later.</p></div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm"><h3 className="font-black text-slate-900">No bookings found</h3><p className="text-xs text-slate-400 mt-2">No booking records were found for this service.</p></div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#F8F9FC]">
                      <th className="px-3 py-3 text-center text-[10px] font-black text-slate-400 uppercase">S.N.</th>
                      <th className="px-3 py-3 text-center text-[10px] font-black text-slate-400 uppercase">Submission No.</th>
                      <th className="px-3 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Service</th>
                      <th className="px-3 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Name</th>
                      <th className="px-3 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Travel Date</th>
                      <th className="px-3 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Contact</th>
                      <th className="px-3 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Booked Package / Service</th>
                      <th className="px-3 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Price</th>
                      <th className="px-3 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Payment Status</th>
                      <th className="px-3 py-3 text-center text-[10px] font-black text-slate-400 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <tr key={`${booking.serviceType}-${booking.id}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                        <td className="px-3 py-3.5 font-black text-slate-400 text-center">{index + 1}</td>
                        <td className="px-3 py-3 text-center"><span className="font-mono px-2.5 py-1 rounded-lg text-[10px] border border-slate-200 bg-slate-100 text-slate-900">{booking.submissionNumber}</span></td>
                        <td className="px-3 py-3 font-bold text-slate-700">{cfg?.label}</td>
                        <td className="px-3 py-3 font-bold text-slate-800">{booking.name}</td>
                        <td className="px-3 py-3 text-slate-600 font-medium whitespace-nowrap">{booking.travelDate}</td>
                        <td className="px-3 py-3 text-slate-500 font-mono whitespace-nowrap">{booking.contact}</td>
                        <td className="px-3 py-3 max-w-[220px]"><p className="font-bold text-slate-800">{booking.itemLabel}</p>{booking.itemSub && <p className="text-[10px] text-slate-500 mt-0.5">{booking.itemSub}</p>}</td>
                        <td className="px-3 py-3 font-black text-slate-900 whitespace-nowrap">{booking.price}</td>
                        <td className="px-3 py-3"><span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase ${statusClass(booking.paymentStatus)}`}>{booking.paymentStatus}</span></td>
                        <td className="px-3 py-3 text-center"><button type="button" onClick={() => handleViewDetails(booking)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white text-[10px] font-black uppercase"><Eye size={11} /> View Details</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard-booking" className="space-y-0">
      <DashboardHeaderBanner name={userData?.name || "Traveler"} email={userData?.email || ""} phone={userData?.phone || ""} avatarUrl={userData?.avatar} />
      <div className="p-3 sm:p-5 md:p-6 lg:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {SERVICE_CONFIGS.map((cfg) => {
            const { IconComponent } = cfg;
            return (
              <button key={cfg.id} type="button" onClick={() => handleCardClick(cfg.id)} className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border ${cfg.borderColor} shadow-sm hover:shadow-lg active:scale-[0.98] transition-all text-left group flex flex-col justify-between gap-4 w-full min-h-[160px] sm:min-h-[175px]`}>
                <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl ${cfg.bgColor} ${cfg.color} flex items-center justify-center group-hover:scale-110 transition-transform`}><IconComponent size={24} /></div>
                <div className="flex-1"><p className="text-sm sm:text-[15px] font-black text-slate-900">{cfg.label}</p></div>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100/80"><span className="text-xs font-bold text-slate-500 group-hover:text-[#FF2A75]">View Details</span><ArrowRight size={15} className="text-slate-400 group-hover:text-[#FF2A75] group-hover:translate-x-1 transition-all" /></div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DashboardBookingStatus;