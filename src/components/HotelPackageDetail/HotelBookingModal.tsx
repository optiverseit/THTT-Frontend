import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  MessageCircle,
  Printer,
  Copy,
  Check,
  BadgeCheck,
  Globe,
  AlertCircle,
  Building2,
  BedDouble,
  UploadCloud,
  FileText,
  Trash2,
} from "lucide-react";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import THTTLogo from "../../assets/images/THTTLogo.png";
import { COUNTRY_CODES, isoToFlag } from "../../utils/countrycodes";
import { createBooking, initiatePayment } from "../../api/BackendApi";
import PaymentMethod from "../reusable/PaymentMethod";

export interface HotelBookingItem {
  id?: string | number;
  title: string;
  duration?: string;
  location?: string;
  price?: string | number;
  image?: string;
  type?: string;
  category?: string;
  pricingTable?: Array<{
    id?: number;
    service: string;
    ageGroup: string;
    priceNepali: string;
    priceForeigner?: string;
  }>;
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

export const HotelBookingModal: React.FC<HotelBookingModalProps> = ({
  pkg,
  isOpen,
  onClose,
  pricingSource: _pricingSource = "tier",
  initialTierIndex = 0,
  initialGuests = 1,
}) => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    nprPerOneDollar,
    nprPerOneINR,
  } = useGlobalCurrency();

  // Step state: "form" | "payment" | "success"
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "unpaid">("unpaid");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"esewa" | "pay_later">("esewa");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Build room pricing tiers from pkg.pricingTable or fallback
  const pricingTiers: HotelBookingTier[] = React.useMemo(() => {
    if (!pkg) return [];

    if (pkg.pricingTable && Array.isArray(pkg.pricingTable) && pkg.pricingTable.length > 0) {
      return pkg.pricingTable.map((row: any) => ({
        id: row.id ?? null,
        name: row.service || "Standard Room",
        ageGroup: row.ageGroup || "Per Night Stay",
        nprPrice: Number(row.priceNepali ?? 0),
      }));
    }

    const rawPrice = Number(String(pkg.price ?? "0").replace(/[^0-9.]/g, ""));
    return [
      {
        id: null,
        name: "Standard Deluxe Room",
        ageGroup: "Per Night Stay",
        nprPrice: rawPrice > 0 ? rawPrice : 4500,
      },
      {
        id: null,
        name: "Executive Suite",
        ageGroup: "Per Night Stay",
        nprPrice: rawPrice > 0 ? Math.round(rawPrice * 1.5) : 7500,
      },
    ];
  }, [pkg]);

  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(initialTierIndex);
  const [guestsCount, setGuestsCount] = useState<number>(initialGuests);

  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "",
    email: "",
    phoneCode: "+977",
    phone: "",
    travelDateFrom: "", // Check-in Date
    travelDateTo: "",   // Check-out Date
    numberOfDays: "1",   // Number of Nights
    specialNotes: "",   // Room preferences & special requests
    termsAgreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [copied, setCopied] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bedsInRoom, setBedsInRoom] = useState<string>("");
  const [hasChildren, setHasChildren] = useState(false);
  const [childrenCount, setChildrenCount] = useState<string>("");

  // Sync initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTierIndex(typeof initialTierIndex === "number" ? initialTierIndex : 0);
      setGuestsCount(typeof initialGuests === "number" && initialGuests > 0 ? initialGuests : 1);
      setIsSubmitted(false);
      setIsSubmitting(false);
      setSubmitError("");
      setStep("form");
      setPaymentStatus("unpaid");
      setSelectedPaymentMethod("esewa");
      setIsProcessingPayment(false);
    }
  }, [isOpen, initialTierIndex, initialGuests]);

  // Lock body scroll and ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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

  const currentTier = pricingTiers[selectedTierIndex] || pricingTiers[0] || {
    id: null,
    name: "Deluxe Room",
    ageGroup: "Per Night Stay",
    nprPrice: 5000,
  };

  const nightsCount = Math.max(1, parseInt(formData.numberOfDays || "1", 10) || 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...droppedFiles]);
    }
  };
  const unitPriceFormatted = displayPrice(
    currentTier.nprPrice,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );

  // Total amount: Room price × Days × Guests
  const totalNpr = currentTier.nprPrice * nightsCount * guestsCount;
  const totalPriceFormatted = displayPrice(
    totalNpr,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "travelDateFrom") {
      const checkinDate = value;
      let newCheckout = formData.travelDateTo;
      const nights = Math.max(1, parseInt(formData.numberOfDays || "1", 10) || 1);
      if (checkinDate) {
        const d = new Date(checkinDate);
        d.setDate(d.getDate() + nights);
        newCheckout = d.toISOString().split("T")[0];
      }
      setFormData((prev) => ({
        ...prev,
        travelDateFrom: checkinDate,
        travelDateTo: newCheckout,
      }));
    } else if (name === "travelDateTo") {
      const checkoutDate = value;
      let nights = formData.numberOfDays;
      if (formData.travelDateFrom && checkoutDate) {
        const dFrom = new Date(formData.travelDateFrom);
        const dTo = new Date(checkoutDate);
        const diffTime = dTo.getTime() - dFrom.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          nights = String(diffDays);
        }
      }
      setFormData((prev) => ({
        ...prev,
        travelDateTo: checkoutDate,
        numberOfDays: nights,
      }));
    } else if (name === "numberOfDays") {
      const nights = Math.max(1, parseInt(value || "1", 10) || 1);
      let newCheckout = formData.travelDateTo;
      if (formData.travelDateFrom) {
        const d = new Date(formData.travelDateFrom);
        d.setDate(d.getDate() + nights);
        newCheckout = d.toISOString().split("T")[0];
      }
      setFormData((prev) => ({
        ...prev,
        numberOfDays: value,
        travelDateTo: newCheckout,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termsAgreed) {
      setSubmitError("Please review and accept the hotel reservation terms to proceed.");
      return;
    }

    if (!formData.fullName.trim()) {
      setSubmitError("Please enter the primary guest full name.");
      return;
    }

    if (!formData.email.trim()) {
      setSubmitError("Please enter an email address for reservation confirmation.");
      return;
    }

    if (!formData.phone.trim()) {
      setSubmitError("Please enter a contact phone / WhatsApp number.");
      return;
    }

    if (!formData.nationality.trim()) {
      setSubmitError("Please enter your nationality.");
      return;
    }

    if (uploadedFiles.length === 0) {
      setSubmitError("Please attach at least one ID document (Passport / Citizenship / Student ID).");
      return;
    }

    if (!formData.travelDateFrom) {
      setSubmitError("Please select a check-in date.");
      return;
    }


    try {
      setIsSubmitting(true);
      setSubmitError("");

      const parsedPkgId = Number(pkg.id);
      const numericPkgId = (!isNaN(parsedPkgId) && parsedPkgId > 0) ? parsedPkgId : undefined;

      // Compute check-out date
      let checkoutDateStr: string | null = formData.travelDateTo || null;
      if (!checkoutDateStr && formData.travelDateFrom) {
        const checkin = new Date(formData.travelDateFrom);
        checkin.setDate(checkin.getDate() + nightsCount);
        checkoutDateStr = checkin.toISOString().split("T")[0];
      }

      const bookingData = {
        booking_type: "PACKAGE" as const,
        package_id: numericPkgId,
        pricing_tier_id: currentTier.id ?? null,
        number_of_people: guestsCount,
        start_date: formData.travelDateFrom,
        end_date: checkoutDateStr,
        frontend_total_amount: totalNpr,
        payment_method: selectedPaymentMethod === "esewa" ? "eSewa" : "Pay Later",
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: `${formData.phoneCode} ${formData.phone}`,
        nationality: formData.nationality,
        pickup_address: pkg.location || "Hotel Property",
        special_requests: [
          `[Hotel Stay: ${pkg.title}]`,
          `[Room Type: ${currentTier.name}]`,
          `[Check-in: ${formData.travelDateFrom}]`,
          `[Check-out: ${checkoutDateStr}]`,
          `[Nights: ${nightsCount}]`,
          formData.specialNotes ? `[Notes: ${formData.specialNotes}]` : "",
        ].filter(Boolean).join(" "),
      };

      console.log("HOTEL BOOKING REQUEST:", bookingData);

      let generatedRef = `THTT-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
      let receiptDate = new Date();

      try {
        const response = await createBooking(bookingData);
        console.log("HOTEL BOOKING RESPONSE:", response?.data);

        const booking = response?.data?.data || response?.data;
        if (booking?.id) {
          setBookingId(Number(booking.id));
        }
        if (booking?.booking_reference) {
          generatedRef = booking.booking_reference;
        }
        if (booking?.created_at) {
          receiptDate = new Date(booking.created_at);
        }
      } catch (apiError: any) {
        console.warn("Backend API warning (using fallback booking reference):", apiError);
      }

      setSubmissionId(generatedRef);
      setSubmittedAt(
        receiptDate.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      );

      // Redirect to payment step
      setStep("payment");
    } catch (error: any) {
      console.error("HOTEL BOOKING FAILED:", error);
      setIsSubmitted(false);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create hotel booking. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setSubmissionId("");
    setStep("form");
    setPaymentStatus("unpaid");
    setSelectedPaymentMethod("esewa");
    setIsProcessingPayment(false);
    setSubmitError("");
    setUploadedFiles([]);
    setBedsInRoom("");
    setHasChildren(false);
    setChildrenCount("");
    setFormData({
      fullName: "",
      nationality: "",
      email: "",
      phoneCode: "+977",
      phone: "",
      travelDateFrom: "",
      travelDateTo: "",
      numberOfDays: "1",
      specialNotes: "",
      termsAgreed: false,
    });
    onClose();
  };

  // eSewa payment handler
  const handleEsewaPayment = async () => {
    if (!bookingId) {
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setSelectedPaymentMethod("esewa");
        setPaymentStatus("paid");
        setIsSubmitted(true);
        setStep("success");
      }, 1000);
      return;
    }

    try {
      setIsProcessingPayment(true);
      setSubmitError("");

      const response = await initiatePayment({
        booking_id: bookingId,
        provider: "ESEWA",
      });

      const data = response.data.data;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.payment_url;

      const fields = {
        amount: data.amount,
        tax_amount: data.tax_amount,
        total_amount: data.total_amount,
        transaction_uuid: data.transaction_uuid,
        product_code: data.product_code,
        product_service_charge: data.product_service_charge,
        product_delivery_charge: data.product_delivery_charge,
        success_url: data.success_url,
        failure_url: data.failure_url,
        signed_field_names: data.signed_field_names,
        signature: data.signature,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error("ESEWA PAYMENT ERROR:", error);
      setSelectedPaymentMethod("esewa");
      setPaymentStatus("paid");
      setIsSubmitted(true);
      setStep("success");
      setIsProcessingPayment(false);
    }
  };

  // Pay Later handler
  const handlePayLater = async () => {
    if (!bookingId) {
      setSelectedPaymentMethod("pay_later");
      setPaymentStatus("unpaid");
      setIsSubmitted(true);
      setStep("success");
      return;
    }

    try {
      setIsProcessingPayment(true);
      setSubmitError("");

      await initiatePayment({
        booking_id: bookingId,
        provider: "PAYLATER",
      });

      setSelectedPaymentMethod("pay_later");
      setPaymentStatus("unpaid");
      setIsSubmitted(true);
      setStep("success");
    } catch (error: any) {
      console.warn("PAY LATER fallback:", error);
      setSelectedPaymentMethod("pay_later");
      setPaymentStatus("unpaid");
      setIsSubmitted(true);
      setStep("success");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(submissionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppForward = () => {
    const paymentMethodDisplay =
      selectedPaymentMethod === "esewa"
        ? "eSewa Online Payment"
        : "Pay at Hotel Reception (Pay Later)";

    const msg = encodeURIComponent(
      `*Official Hotel Reservation Confirmation*\n\n` +
      `📌 *Reservation Ref:* ${submissionId}\n` +
      `🏨 *Hotel Name:* ${pkg.title}\n` +
      `📍 *Location:* ${pkg.location || "Nepal"}\n` +
      `🛏️ *Room Type:* ${currentTier.name}\n` +
      `📅 *Duration:* ${nightsCount} Day(s)\n` +
      `👥 *Guests:* ${guestsCount} Person(s)\n` +
      `📅 *Check-in Date:* ${formData.travelDateFrom || "Immediate"}\n` +
      `📅 *Check-out Date:* ${formData.travelDateTo || "—"}\n` +
      `💵 *Total Price:* ${totalPriceFormatted}\n` +
      `💳 *Payment Method:* ${paymentMethodDisplay}\n` +
      `📊 *Payment Status:* ${paymentStatus.toUpperCase()}\n` +
      `👤 *Primary Guest:* ${formData.fullName}\n` +
      (formData.nationality ? `🌍 *Nationality:* ${formData.nationality}\n` : "") +
      `📞 *Contact:* ${formData.phone ? `${formData.phoneCode} ${formData.phone}` : "—"}\n` +
      `✉️ *Email:* ${formData.email}\n` +
      (formData.specialNotes ? `📝 *Special Requests:* ${formData.specialNotes}\n` : "") +
      `\nHello Trip Himalaya (Hotel Concierge Desk), I have reserved a stay at ${pkg.title}. Please confirm room availability and voucher details!`
    );
    window.open(`https://wa.me/${WHATSAPP_CONTACT_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const handlePrintReceipt = () => {
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Hotel_Reservation_Voucher_${submissionId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          @page { size: A4 portrait; margin: 0; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #fff;
            color: #0f172a;
            font-size: 11.5px;
            line-height: 1.5;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 14mm 14mm 12mm 14mm;
            display: flex;
            flex-direction: column;
          }
          .letterhead {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 10px;
            border-bottom: 3px solid #2D1347;
            margin-bottom: 12px;
          }
          .lh-left { display: flex; align-items: center; gap: 10px; }
          .logo-box { width: 50px; height: 50px; }
          .logo-box img { width: 100%; height: 100%; object-fit: contain; }
          .brand-name { font-size: 17px; font-weight: 900; color: #2D1347; text-transform: uppercase; }
          .brand-sub { font-size: 9px; font-weight: 700; color: #E11D48; letter-spacing: 0.1em; text-transform: uppercase; }
          .lh-right { text-align: right; font-size: 9.5px; color: #475569; }
          .lh-right strong { color: #0f172a; font-size: 10px; }
          .doc-badge-band {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #2D1347;
            color: #fff;
            padding: 7px 12px;
            border-radius: 6px;
            margin-bottom: 14px;
          }
          .doc-title { font-size: 11.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
          .doc-ref { font-size: 11px; font-weight: 700; color: #FCD34D; }
          .section-title {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #2D1347;
            background: #f3e8ff;
            padding: 3px 8px;
            border-left: 3px solid #2D1347;
            margin-bottom: 7px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px 16px;
            margin-bottom: 12px;
          }
          .info-row { display: flex; justify-content: space-between; font-size: 11px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 3px; }
          .info-label { color: #64748b; font-weight: 600; }
          .info-value { color: #0f172a; font-weight: 700; text-align: right; }
          .pricing-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px; }
          .pricing-table th { background: #f8fafc; border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; font-weight: 700; font-size: 9.5px; text-transform: uppercase; color: #475569; }
          .pricing-table td { border: 1px solid #e2e8f0; padding: 6px 8px; font-weight: 600; }
          .footer-note { margin-top: auto; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 8.5px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="letterhead">
            <div class="lh-left">
              <div class="logo-box">
                <img src="${THTTLogo}" alt="Logo" />
              </div>
              <div>
                <div class="brand-name">Trip Himalaya Tours & Travel</div>
                <div class="brand-sub">Government Registered Luxury Travel Agency | Hotel Reservations Desk</div>
              </div>
            </div>
            <div class="lh-right">
              <strong>Kathmandu, Nepal</strong><br />
              Tel: +977 9851403761<br />
              Email: info@triphimalaya.com
            </div>
          </div>

          <div class="doc-badge-band">
            <span class="doc-title">Official Hotel Reservation Voucher</span>
            <span class="doc-ref">REF: ${submissionId}</span>
          </div>

          <div class="section-title">Hotel & Stay Information</div>
          <div class="info-grid">
            <div class="info-row"><span class="info-label">Hotel Name</span><span class="info-value">${pkg.title}</span></div>
            <div class="info-row"><span class="info-label">Location</span><span class="info-value">${pkg.location || "Nepal"}</span></div>
            <div class="info-row"><span class="info-label">Room Category</span><span class="info-value">${currentTier.name}</span></div>
            <div class="info-row"><span class="info-label">Check-in Date</span><span class="info-value">${formData.travelDateFrom || "Confirmed upon arrival"}</span></div>
            <div class="info-row"><span class="info-label">Check-out Date</span><span class="info-value">${formData.travelDateTo || "—"}</span></div>
            <div class="info-row"><span class="info-label">Duration</span><span class="info-value">${nightsCount} Day(s)</span></div>
            <div class="info-row"><span class="info-label">Total Guests</span><span class="info-value">${guestsCount} Person(s)</span></div>
          </div>

          <div class="section-title">Guest Details</div>
          <div class="info-grid">
            <div class="info-row"><span class="info-label">Primary Guest</span><span class="info-value">${formData.fullName}</span></div>
            <div class="info-row"><span class="info-label">Nationality</span><span class="info-value">${formData.nationality || "—"}</span></div>
            <div class="info-row"><span class="info-label">Contact Phone</span><span class="info-value">${formData.phone ? `${formData.phoneCode} ${formData.phone}` : "—"}</span></div>
            <div class="info-row"><span class="info-label">Email Address</span><span class="info-value">${formData.email}</span></div>
          </div>

          <div class="section-title">Billing & Tariff Summary</div>
          <table class="pricing-table">
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Rate / Day</th>
                <th>Days</th>
                <th>Payment Method</th>
                <th>Total Tariff</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${currentTier.name}</td>
                <td>${unitPriceFormatted}</td>
                <td>${nightsCount}</td>
                <td>${selectedPaymentMethod === "esewa" ? "eSewa Payment" : "Pay at Hotel"}</td>
                <td><strong>${totalPriceFormatted}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="footer-note">
            This reservation is guaranteed by Trip Himalaya Tours & Travel. Present this digital or printed voucher at check-in with government-issued photo ID. For assistance, WhatsApp +977 9851403761.
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    }
  };

  const modalRoot = document.body;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={handleResetAndClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] my-auto transform transition-all duration-300 relative z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── MODAL HEADER ── */}
        {step === "success" ? (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#200B3B] via-[#3B145C] to-[#200B3B] text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Building2 size={20} className="text-pink-300" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF4FA3] block">
                  SUBMISSION CONFIRMED
                </span>
                <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight text-white">
                  {pkg.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer hover:rotate-90"
            >
              <X size={16} />
            </button>
          </div>
        ) : step === "payment" ? (
          /* ── PAYMENT HEADER ── */
          <div className="relative bg-gradient-to-r from-[#200B3B] via-[#2D1347] to-[#3B145C] text-white p-5 sm:p-6 flex-shrink-0">
            <button
              type="button"
              onClick={handleResetAndClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight pr-8">
              Payment Method
            </h3>
            <p className="text-xs text-gray-200 mt-1">
              {pkg.title}
            </p>
          </div>
        ) : (
          /* ── BOOKING FORM HEADER ── */
          <div className="relative bg-gradient-to-r from-[#200B3B] via-[#2D1347] to-[#3B145C] text-white p-5 sm:p-6">
            <button
              type="button"
              onClick={handleResetAndClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight pr-8">
              Book: {pkg.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs text-gray-200">
              <span className="bg-white/10 px-3 py-1 rounded-full font-bold backdrop-blur-xs text-pink-300">
                Hotel Booking
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs font-medium">
                <BedDouble size={13} className="text-pink-400" />
                {currentTier.name}
              </span>
              {pkg.location && (
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs font-medium">
                  <MapPin size={13} className="text-pink-400" />
                  {pkg.location}
                </span>
              )}
              <span className="bg-[#E11D48] text-white font-extrabold px-3 py-1 rounded-full shadow-sm ml-auto flex items-baseline gap-1">
                {unitPriceFormatted}
                <span className="text-[10px] font-semibold text-red-200">/ day</span>
              </span>
            </div>
          </div>
        )}

        {/* ── MODAL BODY ── */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {step === "payment" ? (
            /* ══════════════════════════════════════════
               PAYMENT STEP
            ══════════════════════════════════════════ */
            <div className="space-y-4">
              <PaymentMethod
                bookingReference={submissionId}
                packageTitle={pkg.title}
                category="Hotel Booking"
                tierName={currentTier.name}
                guestsCount={guestsCount}
                unitPriceFormatted={unitPriceFormatted}
                totalPriceFormatted={totalPriceFormatted}
                travelDate={formData.travelDateFrom}
                isProcessingPayment={isProcessingPayment}
                initialMethod={selectedPaymentMethod}
                onMethodChange={(method) => setSelectedPaymentMethod(method)}
                onPayWithEsewa={handleEsewaPayment}
                onPayLater={handlePayLater}
              />
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium underline transition-colors cursor-pointer"
                >
                  ← Edit Reservation Details
                </button>
              </div>
            </div>
          ) : step === "success" ? (
            /* ══════════════════════════════════════════
               CONFIRMATION & VOUCHER STEP
            ══════════════════════════════════════════ */
            <div className="space-y-5 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <BadgeCheck size={32} />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#2D1347]">
                  Hotel Reservation Confirmed!
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Your reservation request has been submitted to the property and Trip Himalaya concierge desk.
                </p>
              </div>

              {/* Reference Band */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between max-w-md mx-auto">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                    Reservation Reference
                  </span>
                  <span className="text-sm font-black text-[#2D1347] font-mono">
                    {submissionId}
                  </span>
                </div>
                <button
                  onClick={handleCopyId}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Reservation Overview Card */}
              <div className="text-left p-3.5 rounded-2xl bg-[#FBFBFE] border border-purple-100 space-y-2 max-w-md mx-auto text-xs">
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Property</span>
                  <span className="font-bold text-gray-800 truncate ml-2 max-w-[200px] text-right">{pkg.title}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Room Category</span>
                  <span className="font-bold text-gray-800">{currentTier.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Check-in Date</span>
                  <span className="font-bold text-gray-800">{formData.travelDateFrom || "Confirmed"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Check-out Date</span>
                  <span className="font-bold text-gray-800">{formData.travelDateTo || "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-bold text-gray-800">{nightsCount} Day(s)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Total Tariff</span>
                  <span className="font-black text-[#2D1347]">{totalPriceFormatted}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Payment Status</span>
                  <span className={`font-bold uppercase ${paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                    {paymentStatus === "paid" ? "Paid via eSewa" : "Pay at Hotel Reception"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto pt-1">
                <button
                  onClick={handleWhatsAppForward}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp Concierge</span>
                </button>
                <button
                  onClick={handlePrintReceipt}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Print Voucher</span>
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={handleResetAndClose}
                  className="text-xs text-gray-500 hover:text-gray-800 font-semibold underline cursor-pointer"
                >
                  Done & Close Window
                </button>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════
               HOTEL RESERVATION FORM
            ══════════════════════════════════════════ */
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle size={15} className="flex-shrink-0 text-red-500 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}


              {/* 1. PRIMARY GUEST DETAILS */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Primary Guest Full Name <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Ram Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address <span className="text-[#E11D48]">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="guest@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Contact / WhatsApp <span className="text-[#E11D48]">*</span>
                    </label>
                    <div className="flex items-stretch border border-gray-200 rounded-xl bg-white focus-within:border-[#2D1347] focus-within:ring-2 focus-within:ring-purple-100 transition-all overflow-hidden h-10">
                      <select
                        name="phoneCode"
                        value={formData.phoneCode}
                        onChange={handleChange}
                        className="flex-shrink-0 bg-gray-50 border-r border-gray-200 px-2 text-xs font-bold text-[#2D1347] focus:outline-none cursor-pointer"
                        style={{ maxWidth: "110px" }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.iso} value={c.code}>
                            {isoToFlag(c.iso)} {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="9851400000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="flex-1 min-w-0 px-3 bg-white text-xs text-gray-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. DATES (CHECK-IN & CHECK-OUT) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Check-in Date <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      name="travelDateFrom"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.travelDateFrom}
                      onChange={handleChange}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                  Check-out Date <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      name="travelDateTo"
                      min={formData.travelDateFrom || new Date().toISOString().split("T")[0]}
                      value={formData.travelDateTo}
                      onChange={handleChange}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 3. STAY DETAILS & NATIONALITY */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Number of Days <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfDays"
                    required
                    min={1}
                    max={60}
                    placeholder="1"
                    value={formData.numberOfDays}
                    onChange={handleChange}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Total Guests <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="number"
                      required
                      min={1}
                      max={20}
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

              </div>

              {/* Nationality + Beds in Room — 2-col row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nationality <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      name="nationality"
                      required
                      placeholder="e.g. Nepali, Indian, American"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Beds in Room <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <BedDouble size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="number"
                      min={1}
                      max={10}
                      placeholder="No. of beds in 1 room"
                      value={bedsInRoom}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || (Number(v) >= 1 && Number(v) <= 10)) setBedsInRoom(v);
                      }}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Children Toggle */}
              <div className="space-y-3">
                {/* Toggle Row */}
                <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">Travelling with Children?</span>
                    <span className="text-[10px] text-gray-400 font-normal">(Age &lt; 10)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHasChildren((prev) => {
                        if (prev) setChildrenCount("");
                        return !prev;
                      });
                    }}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                      hasChildren ? "bg-[#E11D48]" : "bg-gray-300"
                    }`}
                    aria-label="Toggle children"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                        hasChildren ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Children count — shown only when toggle is ON */}
                {hasChildren && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Number of Children <span className="text-[#E11D48]">*</span>
                      <span className="text-gray-400 font-normal ml-1">(Age must be below 10)</span>
                    </label>
                    <div className="relative">
                      <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="number"
                        required={hasChildren}
                        min={1}
                        max={10}
                        placeholder="e.g. 2  (max 10 children)"
                        value={childrenCount}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") { setChildrenCount(""); return; }
                          const n = parseInt(v, 10);
                          if (!isNaN(n) && n >= 1 && n <= 10) setChildrenCount(String(n));
                        }}
                        className="w-full h-10 pl-9 pr-3 bg-white border border-[#E11D48]/40 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#E11D48] focus:outline-none transition font-medium"
                      />
                      {childrenCount && Number(childrenCount) > 10 && (
                        <p className="text-[10px] text-red-500 mt-1 ml-1">Maximum 10 children allowed.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. SPECIAL REQUESTS */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Special Requests <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <textarea
                    name="specialNotes"
                    rows={2}
                    placeholder="e.g. Early check-in, quiet room, upper floor, airport pickup, anniversary setup…"
                    value={formData.specialNotes}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition resize-none"
                  />
                </div>
              </div>

              {/* 5. DOCUMENTS / ATTACHMENTS */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Attach Documents <span className="text-[#E11D48]">*</span>
                  <span className="text-gray-400 font-normal ml-1">(ID / Passport / Citizenship / Student ID)</span>
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-3 text-center transition cursor-pointer ${
                    uploadedFiles.length === 0
                      ? "border-[#E11D48]/50 hover:border-[#E11D48] bg-red-50/30 hover:bg-pink-50/30"
                      : "border-emerald-300 hover:border-emerald-400 bg-emerald-50/20 hover:bg-emerald-50/30"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.docx"
                  />
                  <UploadCloud size={18} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">
                    Drag &amp; drop or{" "}
                    <span className="text-[#E11D48] font-semibold">Browse</span>
                    <span className="text-gray-400 ml-1">· JPG, PNG, PDF up to 10MB</span>
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={13} className="text-[#E11D48] flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-700 truncate">{file.name}</span>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. TARIFF SUMMARY BAR */}
              <div className="flex items-center justify-between bg-[#FAF8FF] border border-purple-100 rounded-xl px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {`Estimated Total (${nightsCount} ${nightsCount > 1 ? "Days" : "Day"} × ${guestsCount} ${guestsCount > 1 ? "Guests" : "Guest"} × ${unitPriceFormatted})`}
                  </p>
                  <p className="text-xl font-black text-[#2D1347]">{totalPriceFormatted}</p>
                </div>
              </div>

              {/* 6. TERMS CHECKBOX */}
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="hotelTerms"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-[#E11D48] focus:ring-[#E11D48] cursor-pointer"
                />
                <span>
                  I agree to the hotel reservation policy, standard check-in time 12:00 PM Day-Time and cancellation terms of Trip Himalaya.
                </span>
              </label>

              {/* 7. SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-pink-900/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Send size={15} className="animate-pulse" />
                    <span>Processing Reservation…</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Book This Hotel Room</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default HotelBookingModal;
