import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Users, User, Mail, MessageSquare, MapPin, Send, MessageCircle, Printer, Copy, Check, BadgeCheck, Globe, AlertCircle, Building2, BedDouble, Paperclip, FileText } from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import THTTLogo from "../../assets/images/THTTLogo.png";
import { COUNTRY_CODES, isoToFlag } from "../../utils/countrycodes";
import { createHotelBooking, initiatePayment } from "../../api/BackendApi";
import { isSessionValid, clearAuthSession } from "../../utils/sessionManager";
import PaymentMethod from "../reusable/PaymentMethod";

export interface HotelBookingItem {
  id?: string | number;
  backendId?: string | number;
  title: string;
  duration?: string;
  location?: string;
  price?: string | number;
  image?: string;
  type?: string;
  category?: string;
  pricingTable?: Array<{ id?: number; service: string; ageGroup: string; priceNepali: string; priceForeigner?: string }>;
  features?: string[];
  amenities?: string[];
}
export interface HotelBookingTier {
  id: number | null;
  name: string;
  ageGroup: string;
  nprPrice: number;
}
export interface HotelBookingModalProps {
  pkg: HotelBookingItem | any;
  isOpen: boolean;
  onClose: () => void;
  pricingSource?: "tier" | "package";
  initialTierIndex?: number;
  initialGuests?: number;
}
const WHATSAPP_CONTACT_NUMBER = "9779851403761";
export const HotelBookingModal: React.FC<HotelBookingModalProps> = ({ pkg, isOpen, onClose, pricingSource: _pricingSource = "tier", initialTierIndex = 0, initialGuests = 1 }) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "unpaid">("unpaid");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"esewa" | "pay_later">("esewa");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const pricingTiers: HotelBookingTier[] = React.useMemo(() => {
    if (!pkg?.pricingTable || !Array.isArray(pkg.pricingTable)) return [];
    return pkg.pricingTable.map((row: any) => ({ id: row.id ? Number(row.id) : null, name: row.service || row.room_name || "Standard Room", ageGroup: row.ageGroup || row.pricing_unit || "Per Night Stay", nprPrice: Number(row.priceNepali ?? row.price_npr ?? 0) }));
  }, [pkg]);
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(initialTierIndex);
  const [guestsCount, setGuestsCount] = useState<number>(initialGuests);
  const [formData, setFormData] = useState({ fullName: "", nationality: "", email: "", phoneCode: "+977", phone: "", travelDateFrom: "", travelDateTo: "", numberOfDays: "1", specialNotes: "", termsAgreed: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [copied, setCopied] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bedsInRoom, setBedsInRoom] = useState<string>("");
  const [hasChildren, setHasChildren] = useState(false);
  const [childrenCount, setChildrenCount] = useState<string>("");

  // ── Single file attachment state (jpg, jpeg, png, pdf, < 1 MB) ──
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Single file attachment only
    const file = files[0];

    // Supported formats: jpg, jpeg, png, pdf
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();

    const isExtensionValid = allowedExtensions.includes(ext);
    const isMimeValid = allowedMimeTypes.includes(file.type);

    if (!isExtensionValid && !isMimeValid) {
      setFileError("Unsupported file type. Only JPG, JPEG, PNG, and PDF files are allowed.");
      e.target.value = "";
      return;
    }

    // Must be strictly less than 1 MB (1024 * 1024 bytes)
    const MAX_SIZE = 1 * 1024 * 1024;
    if (file.size >= MAX_SIZE) {
      setFileError("File size exceeds 1 MB limit. Please upload a file smaller than 1 MB.");
      e.target.value = "";
      return;
    }

    setAttachedFile(file);
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  useEffect(() => {
    if (isOpen) {
      if (isSessionValid()) {
        const name = localStorage.getItem("name") || "";
        const email = localStorage.getItem("email") || "";
        const phone = localStorage.getItem("phone") || "";
        const nationality = localStorage.getItem("nationality") || "";
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || name,
          email: prev.email || email,
          phone: prev.phone || phone,
          nationality: prev.nationality || nationality,
        }));
      }
      setSelectedTierIndex(typeof initialTierIndex === "number" ? initialTierIndex : 0);
      setGuestsCount(typeof initialGuests === "number" && initialGuests > 0 ? initialGuests : 1);
      setIsSubmitting(false);
      setSubmitError("");
      setStep("form");
      setPaymentStatus("unpaid");
      setSelectedPaymentMethod("esewa");
      setIsProcessingPayment(false);
      setBookingId(null);
      setAttachedFile(null);
      setFileError("");
    }
  }, [isOpen, initialTierIndex, initialGuests]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);
  if (!isOpen || !pkg) return null;
  const currentTier = pricingTiers[selectedTierIndex] || pricingTiers[0];
  const nightsCount = Math.max(1, parseInt(formData.numberOfDays || "1", 10) || 1);
  const unitPrice = Number(currentTier?.nprPrice || 0);
  const unitPriceFormatted = displayPrice(unitPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR);
  const totalNpr = unitPrice * nightsCount * guestsCount;
  const totalPriceFormatted = displayPrice(totalNpr, selectedCurrency, nprPerOneDollar, nprPerOneINR);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "travelDateFrom") {
      let checkout = formData.travelDateTo;
      if (value) {
        const d = new Date(`${value}T00:00:00`);
        d.setDate(d.getDate() + nightsCount);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        checkout = `${y}-${m}-${day}`;
      }
      setFormData((prev) => ({ ...prev, travelDateFrom: value, travelDateTo: checkout }));
    } else if (name === "travelDateTo") {
      let days = formData.numberOfDays;
      if (formData.travelDateFrom && value) {
        const from = new Date(`${formData.travelDateFrom}T00:00:00`);
        const to = new Date(`${value}T00:00:00`);
        const diff = Math.round((to.getTime() - from.getTime()) / 86400000);
        if (diff > 0) days = String(diff);
      }
      setFormData((prev) => ({ ...prev, travelDateTo: value, numberOfDays: days }));
    } else if (name === "numberOfDays") {
      const days = Math.max(1, parseInt(value || "1", 10) || 1);
      let checkout = formData.travelDateTo;
      if (formData.travelDateFrom) {
        const d = new Date(`${formData.travelDateFrom}T00:00:00`);
        d.setDate(d.getDate() + days);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        checkout = `${y}-${m}-${day}`;
      }
      setFormData((prev) => ({ ...prev, numberOfDays: value, travelDateTo: checkout }));
    } else setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSessionValid()) {
      clearAuthSession();
      window.location.href = `/login?from=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (!formData.termsAgreed) return setSubmitError("Please review and accept the hotel reservation terms to proceed.");
    if (!formData.fullName.trim()) return setSubmitError("Please enter the primary guest full name.");
    if (!formData.email.trim()) return setSubmitError("Please enter an email address.");
    if (!formData.phone.trim()) return setSubmitError("Please enter a contact phone / WhatsApp number.");
    if (!formData.nationality.trim()) return setSubmitError("Please enter your nationality.");
    if (!formData.travelDateFrom) return setSubmitError("Please select a check-in date.");
    if (!currentTier?.id) return setSubmitError("Please select a valid room type.");
    if (hasChildren && (!childrenCount || Number(childrenCount) < 1)) return setSubmitError("Please enter the number of children.");
    if (hasChildren && Number(childrenCount) > guestsCount) return setSubmitError("Number of children cannot exceed total guests.");
    if (!attachedFile) return setSubmitError("Please upload the required file attachment (JPG, JPEG, PNG, or PDF under 1 MB).");
    if (fileError) return setSubmitError(fileError);
    const hotelId = Number(pkg.backendId ?? pkg.id);
    if (!hotelId || Number.isNaN(hotelId)) return setSubmitError("Invalid hotel. Please refresh the page and try again.");
    try {
      setIsSubmitting(true);
      setSubmitError("");
      let checkout = formData.travelDateTo || null;
      if (!checkout) {
        const d = new Date(`${formData.travelDateFrom}T00:00:00`);
        d.setDate(d.getDate() + nightsCount);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        checkout = `${y}-${m}-${day}`;
      }
      let payload: any;
      if (attachedFile) {
        const fd = new FormData();
        fd.append("hotel_id", String(hotelId));
        fd.append("hotel_pricing_tier_id", String(currentTier.id));
        fd.append("primary_guest_name", formData.fullName.trim());
        fd.append("email", formData.email.trim());
        fd.append("phone_number", `${formData.phoneCode} ${formData.phone}`.trim());
        fd.append("nationality", formData.nationality.trim());
        fd.append("check_in_date", formData.travelDateFrom);
        if (checkout) fd.append("check_out_date", checkout);
        fd.append("number_of_days", String(nightsCount));
        fd.append("total_guests", String(guestsCount));
        if (bedsInRoom) fd.append("beds_in_room", String(bedsInRoom));
        fd.append("travelling_with_children", hasChildren ? "1" : "0");
        fd.append("number_of_children", String(hasChildren ? Number(childrenCount) : 0));
        if (formData.specialNotes.trim()) {
          fd.append("special_requests", formData.specialNotes.trim());
        }
        fd.append("frontend_total_amount", String(totalNpr));
        fd.append("attachment", attachedFile);
        fd.append("document", attachedFile);
        fd.append("file", attachedFile);
        payload = fd;
      } else {
        payload = {
          hotel_id: hotelId,
          hotel_pricing_tier_id: Number(currentTier.id),
          primary_guest_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone_number: `${formData.phoneCode} ${formData.phone}`.trim(),
          nationality: formData.nationality.trim(),
          check_in_date: formData.travelDateFrom,
          check_out_date: checkout,
          number_of_days: nightsCount,
          total_guests: guestsCount,
          beds_in_room: bedsInRoom ? Number(bedsInRoom) : null,
          travelling_with_children: hasChildren,
          number_of_children: hasChildren ? Number(childrenCount) : 0,
          special_requests: formData.specialNotes.trim() || null,
          frontend_total_amount: totalNpr
        };
      }
      console.log("HOTEL BOOKING REQUEST:", payload);
      const response = await createHotelBooking(payload);
      const booking = response?.data?.data;
      if (!booking?.id) throw new Error("Hotel booking ID was not returned.");
      setBookingId(Number(booking.id));
      setSubmissionId(booking.booking_reference || `HOTEL-${booking.id}`);
      setSubmittedAt(new Date(booking.created_at || Date.now()).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }));
      setPaymentStatus("unpaid");
      setSelectedPaymentMethod("esewa");
      setStep("payment");
    } catch (error: any) {
      console.error("HOTEL BOOKING FAILED:", error?.response?.data || error);
      const errors = error?.response?.data?.errors;
      const firstError = errors ? Object.values(errors).flat()[0] : null;
      setSubmitError(String(firstError || error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to create hotel booking."));
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEsewaPayment = async () => {
    if (!bookingId) return setSubmitError("Hotel booking ID not found.");
    try {
      setIsProcessingPayment(true);
      setSubmitError("");
      setSelectedPaymentMethod("esewa");
      const response = await initiatePayment({ hotel_booking_id: bookingId, provider: "ESEWA" });
      const data = response?.data?.data;
      if (!data?.payment_url) throw new Error("eSewa payment URL was not returned.");
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.payment_url;
      const fields = { amount: data.amount, tax_amount: data.tax_amount, total_amount: data.total_amount, transaction_uuid: data.transaction_uuid, product_code: data.product_code, product_service_charge: data.product_service_charge, product_delivery_charge: data.product_delivery_charge, success_url: data.success_url, failure_url: data.failure_url, signed_field_names: data.signed_field_names, signature: data.signature };
      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value ?? "");
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error("ESEWA PAYMENT ERROR:", error?.response?.data || error);
      setSubmitError(error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to initiate eSewa payment.");
      setIsProcessingPayment(false);
    }
  };
  const handlePayLater = async () => {
    if (!bookingId) return setSubmitError("Hotel booking ID not found.");
    try {
      setIsProcessingPayment(true);
      setSubmitError("");
      await initiatePayment({ hotel_booking_id: bookingId, provider: "PAYLATER" });
      setSelectedPaymentMethod("pay_later");
      setPaymentStatus("unpaid");
      setStep("success");
    } catch (error: any) {
      console.error("PAY LATER ERROR:", error?.response?.data || error);
      setSubmitError(error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to select Pay Later.");
    } finally {
      setIsProcessingPayment(false);
    }
  };
  const handleResetAndClose = () => {
    setSubmissionId("");
    setSubmittedAt("");
    setBookingId(null);
    setStep("form");
    setPaymentStatus("unpaid");
    setSelectedPaymentMethod("esewa");
    setIsProcessingPayment(false);
    setSubmitError("");
    setBedsInRoom("");
    setHasChildren(false);
    setAttachedFile(null);
    setFileError("");
    setFormData({ fullName: "", nationality: "", email: "", phoneCode: "+977", phone: "", travelDateFrom: "", travelDateTo: "", numberOfDays: "1", specialNotes: "", termsAgreed: false });
    onClose();
  };
  const handleCopyId = () => {
    navigator.clipboard.writeText(submissionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleWhatsAppForward = () => {
    const paymentMethodDisplay = selectedPaymentMethod === "esewa" ? "eSewa Online Payment" : "Pay at Hotel Reception (Pay Later)";
    const msg = encodeURIComponent(`*Official Hotel Reservation Confirmation*\n\n📌 *Reservation Ref:* ${submissionId}\n🏨 *Hotel Name:* ${pkg.title}\n📍 *Location:* ${pkg.location || "Nepal"}\n🛏️ *Room Type:* ${currentTier?.name || "Room"}\n📅 *Duration:* ${nightsCount} Day(s)\n👥 *Guests:* ${guestsCount} Person(s)\n📅 *Check-in Date:* ${formData.travelDateFrom}\n📅 *Check-out Date:* ${formData.travelDateTo}\n💵 *Total Price:* ${totalPriceFormatted}\n💳 *Payment Method:* ${paymentMethodDisplay}\n📊 *Payment Status:* ${paymentStatus.toUpperCase()}\n👤 *Primary Guest:* ${formData.fullName}\n🌍 *Nationality:* ${formData.nationality}\n📞 *Contact:* ${formData.phoneCode} ${formData.phone}\n✉️ *Email:* ${formData.email}${formData.specialNotes ? `\n📝 *Special Requests:* ${formData.specialNotes}` : ""}\n\nHello Trip Himalaya, please confirm my hotel reservation details.`);
    window.open(`https://wa.me/${WHATSAPP_CONTACT_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };
  const handlePrintReceipt = () => {
    const printContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Hotel_Reservation_${submissionId}</title><style>@page{size:A4 portrait;margin:0}*{box-sizing:border-box}body{font-family:Arial,sans-serif;background:#fff;color:#0f172a;font-size:12px}.page{width:210mm;min-height:297mm;padding:14mm}.header{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #2D1347;padding-bottom:10px;margin-bottom:14px}.logo{width:55px}.brand{font-size:18px;font-weight:900;color:#2D1347}.band{background:#2D1347;color:white;padding:9px 12px;border-radius:6px;display:flex;justify-content:space-between;margin-bottom:16px}.section{font-weight:800;color:#2D1347;background:#f3e8ff;padding:5px 8px;margin:12px 0 7px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:7px 20px}.row{display:flex;justify-content:space-between;border-bottom:1px dashed #ddd;padding:5px}.label{color:#64748b}.value{font-weight:700;text-align:right}.total{font-size:16px;color:#2D1347}.footer{margin-top:25px;border-top:1px solid #ddd;padding-top:10px;text-align:center;color:#64748b;font-size:10px}</style></head><body><div class="page"><div class="header"><div style="display:flex;align-items:center;gap:10px"><img class="logo" src="${THTTLogo}"/><div><div class="brand">Trip Himalaya Tours & Travel</div><div>Hotel Reservations Desk</div></div></div><div>Kathmandu, Nepal<br/>+977 9851403761</div></div><div class="band"><strong>HOTEL RESERVATION VOUCHER</strong><strong>REF: ${submissionId}</strong></div><div class="section">Hotel & Stay Information</div><div class="grid"><div class="row"><span class="label">Hotel</span><span class="value">${pkg.title}</span></div><div class="row"><span class="label">Location</span><span class="value">${pkg.location || "Nepal"}</span></div><div class="row"><span class="label">Room</span><span class="value">${currentTier?.name || "-"}</span></div><div class="row"><span class="label">Guests</span><span class="value">${guestsCount}</span></div><div class="row"><span class="label">Check-in</span><span class="value">${formData.travelDateFrom}</span></div><div class="row"><span class="label">Check-out</span><span class="value">${formData.travelDateTo}</span></div><div class="row"><span class="label">Days</span><span class="value">${nightsCount}</span></div><div class="row"><span class="label">Room Rate</span><span class="value">${unitPriceFormatted}</span></div></div><div class="section">Guest Details</div><div class="grid"><div class="row"><span class="label">Guest</span><span class="value">${formData.fullName}</span></div><div class="row"><span class="label">Nationality</span><span class="value">${formData.nationality}</span></div><div class="row"><span class="label">Phone</span><span class="value">${formData.phoneCode} ${formData.phone}</span></div><div class="row"><span class="label">Email</span><span class="value">${formData.email}</span></div></div><div class="section">Payment</div><div class="grid"><div class="row"><span class="label">Method</span><span class="value">${selectedPaymentMethod === "esewa" ? "eSewa" : "Pay Later"}</span></div><div class="row"><span class="label">Total</span><span class="value total">${totalPriceFormatted}</span></div></div><div class="footer">Present this voucher at check-in with valid identification.</div></div></body></html>`;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 350);
    }
  };
  return createPortal(
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn" onClick={handleResetAndClose}>
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] my-auto relative z-[100000]" onClick={(e) => e.stopPropagation()}>
        {step === "success" ? (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#200B3B] via-[#3B145C] to-[#200B3B] text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center"><Building2 size={20} className="text-pink-300"/></div><div><span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF4FA3] block">SUBMISSION CONFIRMED</span><h3 className="text-sm sm:text-base font-black text-white">{pkg.title}</h3></div></div>
            <button type="button" onClick={handleResetAndClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center cursor-pointer"><X size={16}/></button>
          </div>
        ) : step === "payment" ? (
          <div className="relative bg-gradient-to-r from-[#200B3B] via-[#2D1347] to-[#3B145C] text-white p-5 sm:p-6 flex-shrink-0">
            <button type="button" onClick={handleResetAndClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"><X size={18}/></button>
            <h3 className="text-xl sm:text-2xl font-black text-white pr-8">Payment Method</h3><p className="text-xs text-gray-200 mt-1">{pkg.title}</p>
          </div>
        ) : (
          <div className="relative bg-gradient-to-r from-[#200B3B] via-[#2D1347] to-[#3B145C] text-white p-5 sm:p-6">
            <button type="button" onClick={handleResetAndClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"><X size={18}/></button>
            <h3 className="text-xl sm:text-2xl font-black text-white pr-8">Book: {pkg.title}</h3>
            <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs text-gray-200">
              <span className="bg-white/10 px-3 py-1 rounded-full font-bold text-pink-300">Hotel Booking</span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full font-medium"><BedDouble size={13} className="text-pink-400"/>{currentTier?.name || "Select Room"}</span>
              {pkg.location && <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full font-medium"><MapPin size={13} className="text-pink-400"/>{pkg.location}</span>}
              <span className="bg-[#E11D48] text-white font-extrabold px-3 py-1 rounded-full ml-auto">{unitPriceFormatted}<span className="text-[10px] font-semibold text-red-200"> / day</span></span>
            </div>
          </div>
        )}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {submitError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2"><AlertCircle size={15} className="flex-shrink-0 text-red-500 mt-0.5"/><span>{submitError}</span></div>}
          {step === "payment" ? (
            <div className="space-y-4">
              <PaymentMethod bookingReference={submissionId} packageTitle={pkg.title} category="Hotel Booking" tierName={currentTier?.name || "Room"} guestsCount={guestsCount} unitPriceFormatted={unitPriceFormatted} totalPriceFormatted={totalPriceFormatted} travelDate={formData.travelDateFrom} isProcessingPayment={isProcessingPayment} initialMethod={selectedPaymentMethod} onMethodChange={setSelectedPaymentMethod} onPayWithEsewa={handleEsewaPayment} onPayLater={handlePayLater}/>
              <div className="text-center pt-1"><button type="button" onClick={() => setStep("form")} className="text-xs text-slate-500 hover:text-slate-800 font-medium underline cursor-pointer">← Edit Reservation Details</button></div>
            </div>
          ) : step === "success" ? (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto"><BadgeCheck size={32}/></div>
              <div><h3 className="text-lg font-black text-[#2D1347]">Hotel Reservation Confirmed!</h3><p className="text-xs text-gray-500 mt-1">{selectedPaymentMethod === "pay_later" ? "Your booking has been created. Payment can be completed later." : "Your hotel reservation has been submitted successfully."}</p></div>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between max-w-md mx-auto">
                <div className="text-left"><span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Reservation Reference</span><span className="text-sm font-black text-[#2D1347] font-mono">{submissionId}</span></div>
                <button onClick={handleCopyId} className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5 cursor-pointer">{copied ? <Check size={14} className="text-emerald-500"/> : <Copy size={14}/>}<span>{copied ? "Copied" : "Copy"}</span></button>
              </div>
              <div className="text-left p-3.5 rounded-2xl bg-[#FBFBFE] border border-purple-100 space-y-2 max-w-md mx-auto text-xs">
                <div className="flex justify-between py-1 border-b border-gray-200/60"><span className="text-gray-500">Property</span><span className="font-bold text-gray-800">{pkg.title}</span></div>
                <div className="flex justify-between py-1 border-b border-gray-200/60"><span className="text-gray-500">Room Category</span><span className="font-bold text-gray-800">{currentTier?.name}</span></div>
                <div className="flex justify-between py-1 border-b border-gray-200/60"><span className="text-gray-500">Check-in</span><span className="font-bold text-gray-800">{formData.travelDateFrom}</span></div>
                <div className="flex justify-between py-1 border-b border-gray-200/60"><span className="text-gray-500">Check-out</span><span className="font-bold text-gray-800">{formData.travelDateTo}</span></div>
                <div className="flex justify-between py-1 border-b border-gray-200/60"><span className="text-gray-500">Duration</span><span className="font-bold text-gray-800">{nightsCount} Day(s)</span></div>
                <div className="flex justify-between py-1 border-b border-gray-200/60"><span className="text-gray-500">Total Tariff</span><span className="font-black text-[#2D1347]">{totalPriceFormatted}</span></div>
                <div className="flex justify-between py-1"><span className="text-gray-500">Payment Status</span><span className={`font-bold uppercase ${paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>{paymentStatus === "paid" ? "Paid via eSewa" : "Pay Later"}</span></div>
              </div>
              <div className="text-[10px] text-gray-400">Created: {submittedAt}</div>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto"><button onClick={handleWhatsAppForward} className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"><MessageCircle size={15}/>WhatsApp Concierge</button><button onClick={handlePrintReceipt} className="flex-1 py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"><Printer size={15}/>Print Voucher</button></div>
              <button onClick={handleResetAndClose} className="text-xs text-gray-500 hover:text-gray-800 font-semibold underline cursor-pointer">Done & Close Window</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {pricingTiers.length > 1 && <div><label className="block text-xs font-bold text-gray-700 mb-1">Room Type <span className="text-[#E11D48]">*</span></label><select value={selectedTierIndex} onChange={(e) => setSelectedTierIndex(Number(e.target.value))} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:border-[#2D1347] focus:outline-none">{pricingTiers.map((tier, index) => <option key={tier.id ?? index} value={index}>{tier.name} - {displayPrice(tier.nprPrice, selectedCurrency, nprPerOneDollar, nprPerOneINR)}</option>)}</select></div>}
              <div><label className="block text-xs font-bold text-gray-700 mb-1">Primary Guest Full Name <span className="text-[#E11D48]">*</span></label><div className="relative"><User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" name="fullName" required placeholder="e.g. Ram Sharma" value={formData.fullName} onChange={handleChange} className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-[#2D1347] focus:outline-none"/></div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Email Address <span className="text-[#E11D48]">*</span></label><div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="email" name="email" required placeholder="guest@example.com" value={formData.email} onChange={handleChange} className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-[#2D1347] focus:outline-none"/></div></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Contact / WhatsApp <span className="text-[#E11D48]">*</span></label><div className="flex h-10 border border-gray-200 rounded-xl overflow-hidden"><select name="phoneCode" value={formData.phoneCode} onChange={handleChange} className="bg-gray-50 border-r border-gray-200 px-2 text-xs font-bold focus:outline-none max-w-[110px]">{COUNTRY_CODES.map((c) => <option key={c.iso} value={c.code}>{isoToFlag(c.iso)} {c.code}</option>)}</select><input type="tel" name="phone" required placeholder="9851400000" value={formData.phone} onChange={handleChange} className="flex-1 min-w-0 px-3 text-xs focus:outline-none"/></div></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Check-in Date <span className="text-[#E11D48]">*</span></label><div className="relative"><Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="date" name="travelDateFrom" required min={new Date().toISOString().split("T")[0]} value={formData.travelDateFrom} onChange={handleChange} className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-[#2D1347] focus:outline-none"/></div></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Check-out Date <span className="text-gray-400 font-normal">(Optional)</span></label><div className="relative"><Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="date" name="travelDateTo" min={formData.travelDateFrom || new Date().toISOString().split("T")[0]} value={formData.travelDateTo} onChange={handleChange} className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-[#2D1347] focus:outline-none"/></div></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Number of Days <span className="text-[#E11D48]">*</span></label><input type="number" name="numberOfDays" required min={1} max={60} value={formData.numberOfDays} onChange={handleChange} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-[#2D1347] focus:outline-none"/></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Total Guests <span className="text-[#E11D48]">*</span></label><div className="relative"><Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="number" required min={1} value={guestsCount} onChange={(e) => setGuestsCount(Math.max(1, parseInt(e.target.value, 10) || 1))} className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-[#2D1347] focus:outline-none"/></div></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Nationality <span className="text-[#E11D48]">*</span></label><div className="relative"><Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" name="nationality" required placeholder="e.g. Nepali" value={formData.nationality} onChange={handleChange} className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-[#2D1347] focus:outline-none"/></div></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Beds in Room <span className="text-gray-400 font-normal">(Optional)</span></label><div className="relative"><BedDouble size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="number" min={1} value={bedsInRoom} onChange={(e) => setBedsInRoom(e.target.value)} className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-[#2D1347] focus:outline-none"/></div></div>
              </div>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"><span className="text-xs font-bold text-gray-700">Travelling with Children?</span><button type="button" onClick={() => { setHasChildren((prev) => !prev); if (hasChildren) setChildrenCount(""); }} className={`relative inline-flex h-5 w-9 rounded-full ${hasChildren ? "bg-[#E11D48]" : "bg-gray-300"}`}><span className={`inline-block h-4 w-4 mt-[1px] rounded-full bg-white transition-transform ${hasChildren ? "translate-x-4" : "translate-x-0"}`}/></button></div>
                {hasChildren && <div><label className="block text-xs font-bold text-gray-700 mb-1">Number of Children <span className="text-[#E11D48]">*</span></label><input type="number" required min={1} max={guestsCount} value={childrenCount} onChange={(e) => setChildrenCount(e.target.value)} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-[#2D1347] focus:outline-none"/></div>}
              </div>
              <div><label className="block text-xs font-bold text-gray-700 mb-1">Special Requests <span className="text-gray-400 font-normal">(Optional)</span></label><div className="relative"><MessageSquare size={14} className="absolute left-3 top-3 text-gray-400"/><textarea name="specialNotes" rows={2} maxLength={2000} placeholder="Early check-in, quiet room, airport pickup..." value={formData.specialNotes} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-[#2D1347] focus:outline-none resize-none"/></div></div>
              {/* File Attachment Upload (just below Special Requests) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Attachment <span className="text-gray-500 font-normal">(ID, Citizenship, Passport, Student ID)</span> <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="hotel-attachment-input"
                />
                {!attachedFile ? (
                  <label
                    htmlFor="hotel-attachment-input"
                    className="flex flex-col items-center justify-center p-3 sm:p-4 border-2 border-dashed border-gray-200 hover:border-[#E11D48] rounded-xl bg-gray-50/80 hover:bg-pink-50/30 transition-all cursor-pointer group text-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-[#E11D48] group-hover:scale-110 transition-transform mb-1.5">
                      <Paperclip size={15} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 group-hover:text-[#E11D48] transition-colors">
                      Click to upload ID, Citizenship, Passport, Student ID
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      Supports JPG, JPEG, PNG, PDF (Less than 1 MB, 1 file only)
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-pink-50/50 border border-pink-200 rounded-xl">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate max-w-[200px] sm:max-w-[280px]">
                          {attachedFile.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {formatFileSize(attachedFile.size)} • 1 file attached
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="w-7 h-7 rounded-lg hover:bg-white text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                      title="Remove file"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
                {fileError && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-red-500 font-semibold">
                    <AlertCircle size={13} className="flex-shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between bg-[#FAF8FF] border border-purple-100 rounded-xl px-4 py-3"><div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estimated Total ({nightsCount} {nightsCount > 1 ? "Days" : "Day"} × {guestsCount} {guestsCount > 1 ? "Guests" : "Guest"} × {unitPriceFormatted})</p><p className="text-xl font-black text-[#2D1347]">{totalPriceFormatted}</p></div></div>
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer"><input type="checkbox" name="termsAgreed" checked={formData.termsAgreed} onChange={handleChange} className="mt-0.5 rounded text-[#E11D48]"/><span>I agree to the hotel reservation policy and cancellation terms of Trip Himalaya.</span></label>
              <button type="submit" disabled={isSubmitting || !currentTier?.id || !attachedFile} className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50">{isSubmitting ? <><Send size={15} className="animate-pulse"/><span>Processing Reservation…</span></> : <><Send size={15}/><span>Book This Hotel Room</span></>}</button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
export default HotelBookingModal;